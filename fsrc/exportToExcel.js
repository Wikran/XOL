// exportToExcel.js
$(document).ready(function () {
  var aDXTheme = "material.blue.light" //localStorage["aDXTheme"]
  DevExpress.ui.themes.current(aDXTheme);
  DevExpress.localization.locale("en-GB");
});
/* =============================== State =============================== */
let gridInstance = null, currentData = [], columnMap = [], placeholderRowIdx = null, directiveRowIdx = null;
let templateColWidths = {}, templateColHeaders = {}, deptMap = {};
let dxFrom = null, dxTo = null, dxFromPopup = null, dxToPopup = null, popupPeriod = null;
let reloadTimeout = null;

/* =============================== Utils =============================== */
const setStatus = (m) => $("#status").text(m);
const guessDataType = (n) => {
  if (!n) return "string";
  const s = n.toLowerCase();
  if (/(amount|total|sum|price|qty|quantity|number|count)/.test(s)) return "number";
  if (/(date|day|time)/.test(s)) return "date";
  return "string";
};
const colLetter = (n) => { let s = "", q = n; while (q > 0) { const r = (q - 1) % 26; s = String.fromCharCode(65 + r) + s; q = Math.floor((q - 1) / 26); } return s; };
const toIsoDate = (d) => { const x = new Date(d); if (Number.isNaN(x.getTime())) return ""; return x.toISOString().slice(0, 10); };
const toEnGbDate = (d) => { const x = new Date(d); if (Number.isNaN(x.getTime())) return ""; return x.toLocaleDateString("en-GB", { day: '2-digit', month: '2-digit', year: 'numeric' }); };

/* =============================== Date dropdowns (British dd/MM/yyyy) =============================== */
$(function () {
  const now = new Date();
  const thisYear = now.getFullYear();
  const firstDay = new Date(thisYear, 0, 1);    // 01 Jan this year
  const lastDay = new Date(thisYear, 11, 31);  // 31 Dec this year

  dxFrom = $("#dateFrom").dxDateBox({
    type: "date", displayFormat: "dd/MM/yyyy", useMaskBehavior: true,
    value: firstDay, //new Date()
    calendarOptions: { firstDayOfWeek: 1 },
    onValueChanged: function (e) { scheduleReload(); }
  }).dxDateBox("instance");

  dxTo = $("#dateTo").dxDateBox({
    type: "date", displayFormat: "dd/MM/yyyy", useMaskBehavior: true,
    value: lastDay, //new Date(),
    calendarOptions: { firstDayOfWeek: 1 },
    onValueChanged: function (e) { scheduleReload(); }
  }).dxDateBox("instance");

  // 🔥 Automatically load data first time
  loadDatabaseData();

  // Period popup (hidden by default). We'll create popup instance and inner dateboxes.
  popupPeriod = $("#periodPopup").dxPopup({
    width: 480,
    height: 240,
    showTitle: true,
    title: "Select Period",
    visible: false,
    dragEnabled: false,
    closeOnOutsideClick: true,
    onShown: function () {
      // sync popup values with main date controls when showing
      if (dxFromPopup && dxToPopup) {
        dxFromPopup.option("value", dxFrom.option("value"));
        dxToPopup.option("value", dxTo.option("value"));
      }
    },
    contentTemplate: function (contentElement) {
      // create dateboxes inside the popup content
      const $container = $("<div>").css({ padding: "8px" });
      const row = $("<div>").css({ display: "flex", gap: "12px", alignItems: "flex-start" });
      const fromWrap = $("<div>").css({ display: "flex", flexDirection: "column" });
      const toWrap = $("<div>").css({ display: "flex", flexDirection: "column" });

      fromWrap.append($("<label>").text("From").css({ fontWeight: 600, marginBottom: "6px" }));
      fromWrap.append($("<div id='dateFromPopup_inner'>"));
      toWrap.append($("<label>").text("To").css({ fontWeight: 600, marginBottom: "6px" }));
      toWrap.append($("<div id='dateToPopup_inner'>"));

      row.append(fromWrap).append(toWrap);
      $container.append(row);

      // buttons
      const btnRow = $("<div>").css({ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "12px" });
      const applyBtn = $("<div id='applyPeriodBtn_inner'>");
      const closeBtn = $("<div id='closePeriodBtn_inner'>");
      btnRow.append(closeBtn).append(applyBtn);
      $container.append(btnRow);

      contentElement.append($container);

      // instantiate inner dateboxes and buttons
      dxFromPopup = $("#dateFromPopup_inner").dxDateBox({
        type: "date", displayFormat: "dd/MM/yyyy", useMaskBehavior: true,
        value: dxFrom.option("value") || new Date(), calendarOptions: { firstDayOfWeek: 1 },
        onValueChanged: function (e) {
          // sync main date and reload grid
          dxFrom.option("value", e.value);
          scheduleReload();
        }
      }).dxDateBox("instance");

      dxToPopup = $("#dateToPopup_inner").dxDateBox({
        type: "date", displayFormat: "dd/MM/yyyy", useMaskBehavior: true,
        value: dxTo.option("value") || new Date(), calendarOptions: { firstDayOfWeek: 1 },
        onValueChanged: function (e) {
          dxTo.option("value", e.value);
          scheduleReload();
        }
      }).dxDateBox("instance");

      $("#applyPeriodBtn_inner").dxButton({
        text: "Apply",
        type: "success",
        onClick: function () {
          // apply values to main controls and reload immediately
          dxFrom.option("value", dxFromPopup.option("value"));
          dxTo.option("value", dxToPopup.option("value"));
          popupPeriod.hide();
          loadDatabaseData();
        }
      });

      $("#closePeriodBtn_inner").dxButton({
        text: "Close",
        type: "normal",
        onClick: function () {
          popupPeriod.hide();
        }
      });
    }
  }).dxPopup("instance");
});

function scheduleReload() {
  // small debounce to avoid multiple rapid API calls when user toggles calendar
  if (reloadTimeout) clearTimeout(reloadTimeout);
  reloadTimeout = setTimeout(() => {
    reloadTimeout = null;
    // only reload if grid already exists or user clicked apply previously
    if (gridInstance) loadDatabaseData();
  }, 400);
}

/* =============================== Template parsing =============================== */
function parseTemplateWorkbook(wb) {
  const ws = wb.getWorksheet("Report");
  if (!ws) throw new Error("Worksheet 'Report' not found in template.xlsx");

  // Build department map from MSTABLE (code -> name)
  deptMap = {};
  const ms = wb.getWorksheet("MSTABLE");
  if (ms) {
    ms.eachRow((r, i) => {
      if (i === 1) return;
      const code = r.getCell(1).value, name = r.getCell(2).value;
      if (code != null && name != null) deptMap[String(code).trim()] = String(name).trim();
    });
  }

  // Detect {{placeholder}} row and directive row
  columnMap = []; templateColWidths = {}; templateColHeaders = {};
  placeholderRowIdx = null; directiveRowIdx = null;

  for (let r = 1; r <= 1000; r++) {
    const vals = (ws.getRow(r).values || []).slice(1);
    if (vals.some(v => typeof v === "string" && /\{\{\s*[^}]+\s*\}\}/.test(v))) {
      placeholderRowIdx = r; directiveRowIdx = r + 1; break;
    }
  }
  if (!placeholderRowIdx) throw new Error("No {{placeholder}} row found");

  const headerArr = (ws.getRow(placeholderRowIdx - 1).values || []).slice(1);
  const phArr = (ws.getRow(placeholderRowIdx).values || []).slice(1);
  const dirArr = (ws.getRow(directiveRowIdx).values || []).slice(1);
  const maxCols = Math.max(headerArr.length, phArr.length, dirArr.length);

  for (let c = 1; c <= maxCols; c++) {
    const phRaw = phArr[c - 1], dirRaw = dirArr[c - 1];
    let placeholder = null, directive = null;
    if (typeof phRaw === "string") {
      const m = phRaw.match(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/);
      if (m) placeholder = m[1].trim().toLowerCase();
    }
    if (typeof dirRaw === "string") {
      const dm = dirRaw.match(/\{\s*(sum|average|count)\s*\}/i);
      if (dm) directive = dm[1].toLowerCase();
    }

    const col = ws.getColumn(c);
    templateColWidths[c] = col.width || 15;
    templateColHeaders[c] = headerArr[c - 1] || placeholder || "";

    columnMap.push({
      colIndex: c,
      placeholder,
      directive,
      dataType: placeholder ? guessDataType(placeholder) : null
    });
  }
}

/* =============================== Load data =============================== */
async function loadDatabaseData() {
  const df = dxFrom.option("value"), dt = dxTo.option("value");
  if (!df || !dt) { alert("Please select date range"); return; }

  setStatus("Loading template & data...");
  const tplRes = await fetch("template.xlsx", { cache: "no-store" });
  const buf = await tplRes.arrayBuffer();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);
  parseTemplateWorkbook(wb);

  // API
  const aaTBKey = "5ad2685d-4114-4aa5-aa87-67368f4a3559";
  const aaXToX = "QTc1RkNDNzUtOEZCNi00NDYwLUIzRjYtNzA3MEI0NDM3OTMw";
  const baseURL = isLocalHost();

  const dateField = columnMap.find(c => c.dataType === "date" && c.placeholder)?.placeholder || "ReqDate";
  const aqrFull = `ExpGroupCode='700' AND ${dateField} BETWEEN '${toIsoDate(df)}' AND '${toIsoDate(dt)}'`;

  const aurl = `${baseURL}/DMQ/XOL/${atob(aaXToX)}/${aaTBKey}/all`;
  const aSettings = {
    url: aurl, method: "POST", timeout: 0,
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({ "@": btoa(aqrFull) })
  };
  const dbRaw = await $.ajax(aSettings);

  // Map API fields -> placeholders
  const dataPh = columnMap.filter(c => c.placeholder && c.placeholder !== "no").map(c => c.placeholder);
  const sample = dbRaw[0] || {};
  const finalMap = {};
  dataPh.forEach(ph => {
    const f = Object.keys(sample).find(k => k.toLowerCase() === ph.toLowerCase());
    finalMap[ph] = f || ph;
  });

  // Display values only (e.g., department code -> name)
  const mapped = dbRaw.map((r, i) => {
    const o = {}; o.no = i + 1;
    dataPh.forEach(ph => {
      let v = r[finalMap[ph]];
      if (ph === "department" && deptMap[v]) v = deptMap[v];
      o[ph] = v;
    });
    return o;
  });

  // Grid columns based on template
  const cols = [];
  for (const cm of columnMap) {
    if (!cm.placeholder) continue;
    if (cm.placeholder === "no") {
      cols.push({ dataField: "no", caption: "NO", dataType: "number" });
    } else {
      cols.push({ dataField: cm.placeholder, caption: templateColHeaders[cm.colIndex], dataType: cm.dataType || guessDataType(cm.placeholder) });
    }
  }

  if (!gridInstance) {
    gridInstance = $("#gridContainer").dxDataGrid({
      dataSource: mapped,
      columns: cols,
      height: 700, // pixels
      width: 1500,  // pixels
      showBorders: true,
      columnAutoWidth: true,
      allowColumnReordering: true,
      allowColumnResizing: true,
      columnMinWidth: 10,
      columnChooser: {
        enabled: true,  //false // true
      },
      showBorders: true,
      sorting: {
        mode: "multiple"
      },
      selection: {
        mode: "single" //'multiple'
      },
      groupPanel: {
        visible: true, //false //false // can't select other group
      },
      filterRow: {
        visible: true,
        applyFilter: "auto"
      },
      headerFilter: {
        visible: true
      },
      filterPanel: {
        visible: true
      },
      filterBuilderPopup: {
        position: {
          of: window, at: 'top', my: 'top', offset: { y: 5 },
        },
        height: 500,
        width: 1000,
      },
      //filterValue: [['ReqDate', '>=', aFilterT], "and", ['ReqDate', '<=', aFilterT2], "and", ['ERStatus', 'contains', 'finished']],  //     [Req.Date] Is any of('2022')                                   
      grouping: {
        autoExpandAll: true,
      },
      searchPanel: {
        visible: true
      },
      paging: {
        pageSize: 50
      },
      pager: {
        showPageSizeSelector: true,
        allowedPageSizes: [50, 100],
        showNavigationButtons: true,
        showInfo: true
      },
      showBorders: true,
      groupPaging: true,
      showColumnLines: true,
      showRowLines: true,
      rowAlternationEnabled: true, //true,
      wordWrapEnabled: true,
      // Export to Excel 		
      export: {
        enabled: true,
        allowExportSelectedData: true
      },
      onExporting: function (e) {
        const data = e.component.getDataSource().items();
        exportReport(data);
        e.cancel = true; // prevent default export
      },
      onToolbarPreparing: function (e) {
        var dataGrid = e.component;
        // PERIOD button (opens popup)
        e.toolbarOptions.items.unshift(
          {
            location: "after", //before
            widget: "dxButton",
            options: {
              icon: "fas fa-calendar-alt",
              text: "PERIOD",
              type: "default",
              stylingMode: "contained",
              onClick: function () {
                try {
                  popupPeriod.show();
                } catch (err) {
                  alert("Period popup not available: " + err.message);
                }
              }
            }
          }
        );
        // HELP button (safe-call aPopupHelp if exists)
        e.toolbarOptions.items.unshift(
          {
            location: "before",
            widget: "dxButton",
            visible: false,
            options: {
              icon: "fas fa-info",
              text: "HELP",
              type: "default",
              stylingMode: "contained", // "outlined" contained
              onClick: function () {
                // if (typeof aPopupHelp === "function") {
                //   try { aPopupHelp("HELP", (typeof aVARs !== "undefined" ? aVARs.HELP01 : null)); }
                //   catch (e) { console.warn("aPopupHelp threw:", e); alert("Help not available"); }
                // } else {
                //   alert("Help function is not available.");
                // }
                alert("HELP")
                aPopupHelp()
              }
            }
          }
        );
      }
    }).dxDataGrid("instance");
  } else {
    gridInstance.option("columns", cols);
    gridInstance.option("dataSource", mapped);
  }
  function aPopupHelp() {
    const popup = $("#popupHelp").dxPopup({
      title: " HELP - Data Input",
      height: 800,
      width: 1000,
      position: { offset: "40 -100" }, //{my:"top", at:"top", of:window}, <ul><li>
      visible: true,
      showCloseButton: true,
      contentTemplate:
        "<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-plus'></i>" + " ADD MORE ROW</div>" +
        "<p style = 'color: green; font-size: 14px;'><ul><li>����� icon " + "<i class='fas fa-plus'></i>" + " �������� ��¡�� </li><li>������¡�� ��������բ����� ¡��� ��Ǣ���ѹ��� ���ʴ����ѹ���</li></ul></br></p>" +
        "<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-trash'></i>" + " DELETE ROW</div>" +
        "<p style = 'color: green; font-size: 14px;'><ul><li>����� icon " + "<i class='fas fa-trash'></i>" + " ����ź��¡��㹺�÷Ѵ������͡</li><li>�������͡ź ��÷Ѵ��� 1 �ж������繡��ź�����ŷ����� ** ��ͧ���Ѵ���ѧ </ul></li></br></p>" +
        "<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-redo'></i>" + " REFRESH</div>" +
        "<p style = 'color: green; font-size: 14px;'><ul><li>����� icon " + "<i class='fas fa-plus'></i>" + " �������� ��¡�� </li><li>������¡�� ��������բ����� ¡��� ��Ǣ���ѹ��� ���ʴ����ѹ���</li></ul></br></p>" +
        "<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-star'></i>" + " INPUT VDO</div>" +
        "<center><div style='max-width: 560px'><div style='position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;'><iframe src='https://lockton-my.sharepoint.com/personal/wikran_lockton_com/_layouts/15/embed.aspx?UniqueId=245d6310-2b34-4609-8c15-4f00051c98fe&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create' width='640' height='480' frameborder='0' scrolling='no' allowfullscreen title='PVSUB.mp4' style='border:none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100%; max-width: 100%;'></iframe></div></div></center>"
    }).dxPopup("instance");

  }
  currentData = mapped;
  setStatus(`Loaded ${mapped.length} rows`);
}

/* =============================== Export =============================== */
async function exportReport(data) {
  if (!data || !data.length) {
    alert("No data to export");
    return;
  }

  setStatus("Exporting...");
  const tplRes = await fetch("template.xlsx", { cache: "no-store" });
  const buf = await tplRes.arrayBuffer();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);
  parseTemplateWorkbook(wb); // assumes columnMap, placeholderRowIdx, etc. are set

  const ws = wb.getWorksheet("Report");

  const headerRow = placeholderRowIdx - 1;
  const firstDataRow = placeholderRowIdx;
  const lastDataRow = firstDataRow + data.length - 1;
  const totalsRowIndex = lastDataRow + 1;
  const periodRow = headerRow - 1;

  // Helpers
  const cellToString = value => {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean" || value instanceof Date) return String(value);
    if (typeof value === "object") {
      if ("formula" in value) return cellToString(value.result);
      if (Array.isArray(value.richText)) return value.richText.map(rt => rt.text ?? "").join("");
      if ("text" in value) return value.text;
      try { return JSON.stringify(value); } catch { return String(value); }
    }
    return String(value);
  };

  const extractBracketedText = str => {
    const m = String(str).match(/^\s*<\s*([^>]+?)\s*>\s*$/);
    return m ? m[1] : null;
  };

  const copyCellStyle = (src, dst) => {
    const s = src.style || {};
    dst.style = {
      font: s.font ? { ...s.font } : undefined,
      alignment: s.alignment ? { ...s.alignment } : undefined,
      border: s.border ? { ...s.border } : undefined,
      fill: s.fill ? { ...s.fill } : undefined,
      numFmt: s.numFmt ?? undefined,
      protection: s.protection ? { ...s.protection } : undefined,
    };
  };

  const isEmpty = v => v === undefined || v === null || v === "";

  const colLetter = n => {
    let s = "";
    while (n > 0) {
      const m = (n - 1) % 26;
      s = String.fromCharCode(65 + m) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  };

  // 1) Period line
  //const df = dxFrom.option("value"), dt = dxTo.option("value");
  // inside exportReport()
  const df = dxFromPopup ? dxFromPopup.option("value") : dxFrom.option("value");
  const dt = dxToPopup ? dxToPopup.option("value") : dxTo.option("value");
  ws.getRow(periodRow).getCell(1).value = `For Period ${toEnGbDate(df)} - ${toEnGbDate(dt)}`;
  ws.getRow(periodRow).commit();

  // 2) Header row: force plain text
  const hdrRow = ws.getRow(headerRow);
  columnMap.forEach(cm => {
    if (!cm.placeholder) return;
    const cell = hdrRow.getCell(cm.colIndex);
    const finalText = (cell?.text?.trim()) || templateColHeaders[cm.colIndex] || "";
    cell.value = finalText;
  });
  hdrRow.commit();

  // 3) Placeholder → column index map
  const colMap = {};
  columnMap.forEach(c => {
    if (c.placeholder) colMap[c.placeholder] = c.colIndex;
  });

  // 4) Write data rows
  data.forEach((rowData, i) => {
    const rNo = firstDataRow + i;
    const row = ws.getRow(rNo);

    columnMap.forEach(cm => {
      if (cm.placeholder) row.getCell(cm.colIndex).value = "";
    });

    if (colMap["no"]) row.getCell(colMap["no"]).value = i + 1;

    for (const [key, val] of Object.entries(rowData)) {
      if (key === "no") continue;
      const colIdx = colMap[key];
      if (!colIdx) continue;

      const dtType = columnMap.find(c => c.placeholder === key)?.dataType || guessDataType(key);
      const cell = row.getCell(colIdx);

      if (val == null || val === "") continue;

      if (dtType === "date") {
        const d = val instanceof Date ? val : new Date(val);
        cell.value = Number.isNaN(d.getTime()) ? "" : d;
      } else if (dtType === "number") {
        const n = Number(val);
        cell.value = Number.isNaN(n) ? "" : n;
      } else {
        cell.value = val;
      }
    }

    row.commit();
  });

  // 5) Totals row
  const totalsRow = ws.getRow(totalsRowIndex);
  const headerTemplateRow = ws.getRow(headerRow);

  columnMap.forEach(cm => {
    if (!cm.placeholder) return;

    const tCell = totalsRow.getCell(cm.colIndex);

    // 5.1 Replace <TEXT> → TEXT, preserving casing
    // const raw = cellToString(tCell.value);
    // const label = extractBracketedText(raw);
    // console.log(raw, label)
    // if (label) {
    //   tCell.value = label;
    // }

    // 5.2 Apply formula if directive exists and cell is still empty
    if (cm.directive && isEmpty(tCell.value)) {
      const L = colLetter(cm.colIndex);
      const rng = `${L}${firstDataRow}:${L}${lastDataRow}`;
      let formula = "";

      if (cm.directive === "sum") formula = `SUM(${rng})`;
      else if (cm.directive === "average") formula = `AVERAGE(${rng})`;
      else if (cm.directive === "count") formula = `COUNTA(${rng})`;

      if (formula) tCell.value = { formula };
    }

    // 5.3 Copy header formatting
    const hCell = headerTemplateRow.getCell(cm.colIndex);
    copyCellStyle(hCell, tCell);
  });

  totalsRow.commit();

  // 6) Column widths
  for (const [ci, w] of Object.entries(templateColWidths)) {
    ws.getColumn(Number(ci)).width = w || 15;
  }
  console.log("first datarow = ", firstDataRow, "lastData row ", lastDataRow)
  //applyDataAreaBorders(ws, firstDataRow, lastDataRow, columnMap);
  //applyTotalRowBorders(ws, totalsRowIndex, columnMap);
  //applyRowStyleToData(ws, firstDataRow, firstDataRow, lastDataRow, columnMap);
  //applyRowStyleToData(ws, 6, 7, 11, columnMap);
  //applyDashedBorderRange(ws, 6, 11, 1, 7); // A6 to G11

  // 7) Hide MSTABLE
  const ms = wb.getWorksheet("MSTABLE");
  if (ms) ms.state = 'hidden';

  wb.calcProperties.fullCalcOnLoad = true;

  const out = await wb.xlsx.writeBuffer();
  saveAs(new Blob([out]), "report.xlsx");
  setStatus("Export complete");
}

/* =============================== Actions =============================== */
$("#loadDbBtn").on("click", loadDatabaseData);
$("#exportBtn").on("click", () => exportReport(currentData));

// Optional: load on page ready if you want automatic loading. If you'd rather keep manual, comment out the next line.
// loadDatabaseData();
