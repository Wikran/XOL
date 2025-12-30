(() => {
    let jsonData = [];
    let jsonDataSum = [];
    let njsonDataSum = [];
    let jsonToDB = []; // for Clone to save to DB
    let gridInstance = null;
    let agridInstance = null;
    let popupInstance = null;
    let templateBuffer = null; // FlexibleTEMP.xlsx buffer
    let templateFileName = "";
    let lLoadTrans = false;
    let lLoadTemp = false;
    // 👇 array ของ objects สำหรับเลือกค่า PayBy
    const PayByList = [
        { PayType: "Corporate Card" },
        { PayType: "Corporate Card 2" },
        { PayType: "Personal" },
    ];
    let lastIssuedRef = null; // check for duplicate refno

    let aaXToX = localStorage.getItem("aaXXoX"); //localStorage["aaXXoX"];
    let aaXNoX = localStorage.getItem("aaXXuX"); //localStorage["aaXXuX"];
    let aaPXXI = localStorage.getItem("aPXIXD"); //localStorage["aPXIXD"];
    let aaMXXT = localStorage.getItem("aDXMenuTitle"); //localStorage["aDXMenuTitle"]; // 
    let asStaffID = localStorage.getItem("asSTFID"); //localStorage["asSTFID"];
    let asDepartment = localStorage.getItem("asDEPT"); //localStorage["asSTFID"];
    let asDivision = localStorage.getItem("asDIV"); //localStorage["asSTFID"];
    let aaPXIXD = localStorage.getItem("aPXIXD"); //localStorage["aPXIXD"];
    let aaEnt = aaPXIXD.includes("X");
    let aaUsrN = localStorage.getItem("aaXXuX"); //localStorage["aaXXuX"];
    let asFullName = localStorage.getItem("asFTNAME"); //
    let asStaffEmail = localStorage.getItem("asEMAIL");

    //console.log("aaXToX = ", aaXToX, " aaXNoX = ", aaXNoX, " aaPXXI = ", aaPXXI, " aaMXXT =", aaMXXT, " asStaffID = ", asStaffID)
    //console.log("aaDept = ", aaDept, " aaPXIXD = ", aaPXIXD, " aaDiv = ", aaDiv, " aaUsrN = ", aaUsrN)
    let aaTBKey = "e8938376-fb56-4e19-bc85-468cbb6dba78"
    let aaPFDMI = isLocalHost();
    let baseUrl = `${aaPFDMI}/temp/uploads/`;
    //console.log(aaPFDMI)
    async function LoadSQLData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, axQuery = undefined) {
        try {
            let aTokena = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";

            // Determine which query condition to use
            let axqr2S = axQuery !== undefined ? axQuery : `WHERE ${aKeyfield} LIKE '%${aKeya}%'`;

            // Construct the full SQL query
            let axFullBody = `SELECT ${axFieldSelected} FROM ${aDataBasea} ${axqr2S}`;

            let response = await fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + aTokena, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "@": btoa(axFullBody) }),
                redirect: "follow"
            });

            return await response.json();
        } catch (error) {
            console.error("LoadSQLData Error:", error);
        }
    }

    var aDatabasea = "ExtraOnLine.dbo.TaskControl";
    var aKeyField = "TaskGroup";
    var aKeyIDa = "MXXXEETRF"; //travel Requisition Form (PRE-APPROVED)
    var axFieldSelected = "IDNO,TaskName,TaskProgram,TaskGroup";
    var aVARs = {};
    var aArrays = {};
    var aObjects = {};
    LoadSQLData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected)
        .then(result => {
            if (!Array.isArray(result)) {
                console.error("Unexpected result format:", result);
                return;
            }
            result.forEach(item => {
                let aMatch = item.TaskName.match(/\[(.*?)\]/);
                if (!aMatch) return;

                let taskProgram = item.TaskProgram.replace(/`/g, "'");

                if (item.TaskName.includes("{ARRAY}")) {
                    aArrays[aMatch[1]] = taskProgram
                        .split("\n")
                        .map(line => line.trim())
                        .map(line => (line === "" ? "" : isNaN(line) ? line : +line));

                } else if (item.TaskName.includes("{T2O}")) {
                    let lines = taskProgram.split("\n");
                    aObjects[aMatch[1]] = lines
                        .map(line => {
                            try {
                                line = line.trim().replace(/,$/, "");
                                line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                                return JSON.parse(line);
                            } catch (err) {
                                if (!line || line.trim() === "") {
                                    DevExpress.ui.dialog.alert("Variables = " + item.TaskName + " there is EMPTY line (need to delete)", "Error");
                                } else {
                                    DevExpress.ui.dialog.alert("Variables = " + item.TaskName + " parsing line: " + line, "Error");
                                }

                                return null; // Skip this line
                            }
                        })
                        .filter(obj => obj !== null) // Remove any failed parses
                        .map(obj => {
                            for (let key in obj) {
                                if (key.includes("amt") && typeof obj[key] === "string") {
                                    obj[key] = +obj[key];
                                }
                            }
                            return obj;
                        });
                } else if (item.TaskName.includes("{OBJ}")) {
                    aObjects[aMatch[1]] = taskProgram
                        .split("\n")
                        .reduce((obj, line) => {
                            let [key, value] = line.trim().split(":").map(part => part.trim());
                            if (key && value !== undefined) obj[key] = isNaN(value) ? value : +value;
                            return obj;
                        }, {});

                } else {
                    aVARs[aMatch[1]] = item.TaskName.includes("{num}") ? +taskProgram : taskProgram;
                }
            });

            //==== Corporate Card Setup ==========================
            let aaCARDIDaa = "";
            const trimmedStaffID = asStaffID.trim();
            // ค้นหาข้อมูลพนักงานจาก EMPID
            const aaRESULaa = aObjects.CORPREG.find(item => item.EMPID === trimmedStaffID);
            //alert(aaRESULaa.CardID)
            const cardIdList = aaRESULaa && aaRESULaa.CardID
                ? ["", aaRESULaa.CardID] // "" = no card
                : [""];
            const cardIdOptions = cardIdList.map(id => ({ // not use
                CardID: id,
                Label: id === "" ? "NOT USE" : id
            }));
            if (!aaRESULaa) {
                console.log("No Staff ID: " + trimmedStaffID);
            } else if (aaRESULaa.CardID && aaRESULaa.CardID !== "" && aaRESULaa.CardID !== "0") {
                aaCARDIDaa = aaRESULaa.CardID;
                console.log("CardID: " + aaCARDIDaa);
            } else {
                console.log("found Staff ID but CardID is empty or = 0");
            }
            let HAVECORPCARD = (aaCARDIDaa === "" ? false : true);
            //======================================================

            // load client Group code from setup data from task control
            const clientGroupcode = aObjects.CashAdvanceClient
            //alert(JSON.stringify(clientGroupcode, null, 2))

            ainitGrid([]); //show empty data before load excel

            // Client group mapping (full list) // Not use
            const aclientGroupcode = [
                { "ID": "00001", "CompanyGroup": "BASF Group", "ClientCode": "BAS11250", "CompanyName": "BASF (Thai) Limited", "CashAdvance": 300000 },
                { "ID": "00002", "CompanyGroup": "BASF Group", "ClientCode": "BAS28234", "CompanyName": "BASF Chemcat (Thailand) Limited", "CashAdvance": 300000 },
                { "ID": "S251117_52468", "CompanyGroup": "BASF Group", "ClientCode": "BAS", "CompanyName": "BASF Coatings Co., Ltd.", "CashAdvance": 300000 },
                { "ID": "00003", "CompanyGroup": "Kiatnakin Phatra Financial Group", "ClientCode": "PHA56845", "CompanyName": "Kiatnakin Phatra Asset Management Company Limited", "CashAdvance": 300000 },
                { "ID": "00004", "CompanyGroup": "Kiatnakin Phatra Financial Group", "ClientCode": "KIA50093", "CompanyName": "Kiatnakin Phatra Bank Public Company Limited", "CashAdvance": 300000 },
                { "ID": "00005", "CompanyGroup": "Kiatnakin Phatra Financial Group", "ClientCode": "PHA56844", "CompanyName": "Kiatnakin Phatra Securities Public Company Limited", "CashAdvance": 300000 },
                { "ID": "00006", "CompanyGroup": "Kiatnakin Phatra Financial Group", "ClientCode": "PHA56843", "CompanyName": "KKP Capital Public Company Limited", "CashAdvance": 300000 },
                { "ID": "00007", "CompanyGroup": "Kiatnakin Phatra Financial Group", "ClientCode": "KKP59460", "CompanyName": "KKP Dime Securities Company Limited", "CashAdvance": 300000 },
                { "ID": "00008", "CompanyGroup": "Kiatnakin Phatra Financial Group", "ClientCode": "CMI56842", "CompanyName": "KKP Tower Company Limited", "CashAdvance": 300000 },
                { "ID": "S251118_22100", "CompanyGroup": "Kiatnakin Phatra Financial Group", "ClientCode": "KKPFG", "CompanyName": "KKPFG", "CashAdvance": 300000 },
                { "ID": "00009", "CompanyGroup": "Osotspa Group", "ClientCode": "OSO56296", "CompanyName": "Osotspa Beverage Co., Ltd.", "CashAdvance": 300000 },
                { "ID": "00010", "CompanyGroup": "Osotspa Group", "ClientCode": "OSO56295", "CompanyName": "Osotspa Public Company Limited", "CashAdvance": 300000 },
                { "ID": "00011", "CompanyGroup": "Osotspa Group", "ClientCode": "WAL56297", "CompanyName": "Osotspa Innovation Centre ", "CashAdvance": 300000 },
                { "ID": "00012", "CompanyGroup": "Osotspa Group", "ClientCode": "GRE57931", "CompanyName": "Greensville ", "CashAdvance": 300000 },
                { "ID": "00013", "CompanyGroup": "Mazda Group", "ClientCode": "MAZ59722", "CompanyName": "Mazda Powertrain Manufacturing (Thailand)", "CashAdvance": 100000 },
                { "ID": "00014", "CompanyGroup": "Promise", "ClientCode": "PRO60092", "CompanyName": "Promise (Thailand) Co., Ltd.", "CashAdvance": 100000 },
                { "ID": "00015", "CompanyGroup": "SCB X Group", "ClientCode": "SCB59297", "CompanyName": "SCB Tech X Company Limited", "CashAdvance": 100000 },
                { "ID": "00016", "CompanyGroup": "Thai Takenaka", "ClientCode": "THA60069", "CompanyName": "Thai Takenaka International Co.,Ltd.", "CashAdvance": 100000 },
                { "ID": "00017", "CompanyGroup": "NITMX", "ClientCode": "NAT60687", "CompanyName": "National ITMX", "CashAdvance": 200000 }
            ];
            console.log("Group code,", clientGroupcode)

            function getCurrentServerInfo() {
                return {
                    origin: window.location.origin,     // e.g. "http://localhost:8089" or "https://cbsdev2.locktonwattana.com"
                    hostname: window.location.hostname, // e.g. "localhost" or "cbsdev2.locktonwattana.com"
                    port: window.location.port          // e.g. "8089" or "" if default (80/443)
                };
            }
            // Example usage:
            // const serverInfo = getCurrentServerInfo();
            // console.log("Origin:", serverInfo.origin);
            // console.log("Hostname:", serverInfo.hostname);
            // console.log("Port:", serverInfo.port);

            function normalizeCellValue(cell) {
                const v = cell && cell.value;
                if (v == null) return "";
                if (typeof v === "object") {
                    if (v.text) return String(v.text).trim();
                    if (v.result != null) return String(v.result).trim();
                    if (v.richText) return v.richText.map(rt => rt.text).join("").trim();
                    if (v instanceof Date) return formatDate(v);
                    if (v.hyperlink && v.text) return String(v.text).trim();
                    return String(v).trim();
                }
                return String(v).trim();
            }

            function formatDate(d) {
                const pad = (n) => (n < 10 ? "0" + n : n);
                return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
            }

            function getCellText(cell) {
                const v = cell && cell.value;
                if (v == null) return "";
                if (typeof v === "object" && v.text) return String(v.text).trim();
                return String(v).trim();
            }

            function extractDateAfterTo(text) {
                if (!text) return "";
                const m = String(text).match(/\bto\b\s+(\d{1,2}\/\d{1,2}\/\d{4})/i);
                return m ? m[1] : "";
            }

            function splitCompanyField(raw) {
                const str = String(raw || "").trim();
                if (!str) return { Company: "", Address: "", TaxNo: "" };
                const result = { Company: "", Address: "", TaxNo: "" };
                const segments = str.split(/(?=Company:|Address:|TaxNo:)/g);
                segments.forEach(seg => {
                    const idx = seg.indexOf(":");
                    if (idx === -1) return;
                    const key = seg.slice(0, idx).trim();
                    const val = seg.slice(idx + 1).trim();
                    if (key === "Company") result.Company = val;
                    else if (key === "Address") result.Address = val;
                    else if (key === "TaxNo") result.TaxNo = val;
                });
                return result;
            }

            function enrichWithGroup(record) {
                const companyPrefix = (record.Company || "").toLowerCase().substring(0, 12);
                const match = clientGroupcode.find(c => c.CompanyName.toLowerCase().substring(0, 12) === companyPrefix);
                if (match) {
                    record.CompanyGroup = match.CompanyGroup;
                    record.CompanyName = match.CompanyName;
                    record.ClientCode = match.ClientCode;
                    record.CashAdvance = match.CashAdvance;
                } else {
                    record.CompanyGroup = "";
                    record.CompanyName = record.Company || "";
                    record.ClientCode = "";
                    record.CashAdvance = "";
                }
                return record;
            }

            function sanitizeSheetName(name) {
                const clean = String(name || "Unknown")
                    .replace(/[\[\]\:\*\?\/\\]/g, " ")
                    .substring(0, 31)
                    .trim();
                return clean || "Sheet";
            }

            function sanitizeFileName(name) {
                return String(name || "Export")
                    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();
            }

            function notify(type, message, ms = 2000) {
                if (window.DevExpress && DevExpress.ui && typeof DevExpress.ui.notify === 'function') {
                    DevExpress.ui.notify(message, type, ms);
                } else {
                    console.log(`[${type}]`, message);
                }
            }

            function initGrid(data) { // filtered Data
                // Clean data: remove records with blank/undefined CompanyGroup OR ProductName = "grand total"
                const filteredData = data.filter(item => {
                    const companyGroupValid = item.CompanyGroup !== undefined && item.CompanyGroup.trim() !== "";
                    const productNameValid = !(item["ProductName"] && item["ProductName"].toLowerCase() === "grand total");
                    return companyGroupValid && productNameValid;
                });

                const columns = [
                    {
                        dataField: "HeadRefNo",
                        caption: "REF#",
                        width: 200,
                    },
                    {
                        dataField: "CompanyGroup",
                        caption: "Company Group",
                        width: 250,
                        dataType: "string",
                        sortOrder: "desc",
                        groupIndex: 0,
                        // Remove "Company Group:" prefix in group headers
                        customizeText: function (e) {
                            return e.valueText; // only show the value
                        }
                    },
                    {
                        dataField: "CompanyName",
                        caption: "Company Name",
                        width: 200,
                    },
                    {
                        dataField: "ClientCode",
                        caption: "Client Code",
                        width: 100,
                    },
                    {
                        dataField: "Company",
                        caption: "Company",
                        width: 250,
                    },
                    {
                        dataField: "ProductName",
                        caption: "Product Name",
                        dataType: "string",
                        alignment: "left",
                        width: 200
                    },
                    {
                        dataField: "Quantity",
                        caption: "Quantity",
                        width: 100,
                        dataType: "number",
                        alignment: "right",
                        format: { type: "fixedPoint", precision: 0 } // 9,999.99
                    },
                    {
                        dataField: "ProductCost",
                        caption: "Product Cost",
                        width: 100,
                        dataType: "number",
                        alignment: "right",
                        format: { type: "fixedPoint", precision: 2 }
                    },
                    {
                        dataField: "CashAdvance",
                        caption: "Cash Advance Limit",
                        width: 100,
                        dataType: "number",
                        alignment: "right",
                        format: { type: "fixedPoint", precision: 2 }
                    },
                    {
                        dataField: "DateText",
                        caption: "Date Text",
                        width: 100,
                    }
                ];

                if (!gridInstance) {
                    gridInstance = $("#grid").dxDataGrid({
                        dataSource: filteredData,
                        columnAutoWidth: true,
                        showBorders: true,
                        rowAlternationEnabled: true,
                        scrolling: { mode: "virtual" },
                        filterRow: { visible: true },
                        searchPanel: { visible: true, width: 240, placeholder: "Search..." },
                        headerFilter: { visible: true },
                        grouping: { contextMenuEnabled: true },
                        groupPanel: { visible: true },
                        columns: columns,

                        // Collapse all groups by default
                        onContentReady: function (e) {
                            e.component.collapseAll(-1);
                        },

                        // Subtotals and Grand Totals
                        summary: {
                            recalculateWhileEditing: true,
                            skipEmptyValues: false,

                            // Grand totals at the bottom
                            totalItems: [
                                {
                                    column: "CompanyName",
                                    summaryType: "count",
                                    displayFormat: "{0} item(s)"
                                },
                                {
                                    column: "Quantity",
                                    summaryType: "sum",
                                    valueFormat: "#,##0",
                                    showInGroupFooter: true,
                                    alignByColumn: true,
                                    displayFormat: "{0}"
                                },
                                {
                                    column: "Product Cost",
                                    summaryType: "sum",
                                    valueFormat: "#,##0.00",
                                    showInGroupFooter: true,
                                    alignByColumn: true,
                                    displayFormat: "{0}"
                                },
                                {
                                    column: "CashAdvance",
                                    summaryType: "max",
                                    valueFormat: "#,##0.00",
                                    showInGroupFooter: true,
                                    alignByColumn: true,
                                    displayFormat: "{0}"
                                }
                            ],

                            // Subtotals per group
                            groupItems: [
                                {
                                    column: "CompanyName",
                                    summaryType: "count",
                                    displayFormat: "{0} item(s)"
                                },
                                {
                                    column: "Quantity",
                                    summaryType: "sum",
                                    valueFormat: "#,##0",
                                    showInGroupFooter: true,
                                    alignByColumn: true,
                                    displayFormat: "{0}"
                                },
                                {
                                    column: "Product Cost",
                                    summaryType: "sum",
                                    valueFormat: "#,##0.00",
                                    showInGroupFooter: true,
                                    alignByColumn: true,
                                    displayFormat: "{0}"
                                },
                                {
                                    column: "CashAdvance",
                                    summaryType: "max",
                                    valueFormat: "#,##0.00",
                                    showInGroupFooter: true,
                                    alignByColumn: true,
                                    displayFormat: "{0}"
                                }
                            ]
                        }

                    }).dxDataGrid("instance");
                } else {
                    gridInstance.option("dataSource", filteredData);
                    gridInstance.option("columns", columns);
                }
            }

            // 👇 ฟังก์ชันสร้าง content ของ popup

            // function createNotePopupContent(noteData) {
            //     const $content = $("<div style='padding:10px;'></div>");
            //     const $grid = $("<div id='noteGrid'></div>");
            //     $content.append($grid);

            //     $grid.dxDataGrid({
            //         dataSource: noteData,
            //         columnAutoWidth: true,
            //         showBorders: true,
            //         showColumnLines: true,
            //         showRowLines: true,
            //         rowAlternationEnabled: true,
            //         filterRow: { visible: true },
            //         searchPanel: { visible: true, width: 240 },
            //         headerFilter: { visible: true },
            //         columnChooser: { enabled: true, mode: "select" },
            //         paging: { pageSize: 5 },
            //         pager: { showPageSizeSelector: true, allowedPageSizes: [5, 10, 50] },
            //         selection: { mode: "single" },

            //         // 👇 กำหนด grouping โดยไม่โชว์ group panel
            //         grouping: { contextMenuEnabled: true },
            //         groupPanel: { visible: true },   // ซ่อน group panel
            //         // 👇 เปิด read/write พร้อม icons
            //         editing: {
            //             mode: "cell",              // ใช้ row mode เพื่อให้มีปุ่มในแต่ละแถว
            //             allowUpdating: true,
            //             allowAdding: false,
            //             allowDeleting: false,
            //             useIcons: true,           // แสดงเป็นไอคอนแทนข้อความ
            //             texts: {
            //                 addRow: "Add New",
            //                 editRow: "Edit",
            //                 deleteRow: "Delete",
            //                 saveRowChanges: "Save",
            //                 cancelRowChanges: "Cancel"
            //             }
            //         },
            //         columns: [
            //             {
            //                 dataField: "Company",
            //                 caption: "Company",
            //                 visible: true,
            //                 readOnly: true,
            //                 dataType: "string",
            //                 groupIndex: 0   // 👈 กำหนดให้ group ตาม Company
            //             },
            //             {
            //                 dataField: "HeadRefNo",
            //                 caption: "Head Ref No",
            //                 readOnly: true,
            //                 visible: false,
            //                 dataType: "string"
            //             },
            //             {
            //                 dataField: "REFNO",
            //                 caption: "Reference No",
            //                 readOnly: true,
            //                 visible: false,
            //                 dataType: "string"
            //             },
            //             {
            //                 dataField: "DateText",
            //                 caption: "Date",
            //                 readOnly: true,
            //                 visible: false,
            //                 dataType: "date",
            //                 format: "dd/MM/yyyy"
            //             },
            //             {
            //                 dataField: "ProductName",
            //                 caption: "Product Name",
            //                 readOnly: true,
            //                 visible: true,
            //                 dataType: "string"
            //             },
            //             {
            //                 dataField: "Quantity",
            //                 caption: "Quantity",
            //                 readOnly: true,
            //                 visible: true,
            //                 dataType: "number",
            //                 format: { type: "fixedPoint", precision: 0 }
            //             },
            //             {
            //                 dataField: "ProductCost",
            //                 caption: "Product Cost",
            //                 visible: true,
            //                 readOnly: true,
            //                 dataType: "number",
            //                 format: { type: "fixedPoint", precision: 0 }
            //             },
            //             {
            //                 dataField: "TotalPoints",
            //                 caption: "Total Points",
            //                 readOnly: true,
            //                 visible: false,
            //                 dataType: "number",
            //                 format: { type: "fixedPoint", precision: 0 }
            //             },

            //             {
            //                 dataField: "ClientCode",
            //                 caption: "Client Code",
            //                 readOnly: true,
            //                 visible: false,
            //                 dataType: "string"
            //             },
            //             {
            //                 dataField: "CashAdvance",
            //                 caption: "Cash Advance",
            //                 readOnly: true,
            //                 visible: false,
            //                 dataType: "number",
            //                 format: { type: "fixedPoint", precision: 0 }
            //             },
            //             {
            //                 dataField: "PayBy",
            //                 caption: "Pay By",
            //                 lookup: {
            //                     dataSource: PayByList, //aObjects.aaPurposeTable,
            //                     valueExpr: "PayType",
            //                     displayExpr: "PayType",
            //                 },
            //                 visible: true,
            //                 dataType: "string"
            //             },
            //             {
            //                 dataField: "LoadedExcel",
            //                 caption: "Loaded Excel File",
            //                 readOnly: true,
            //                 visible: false,
            //                 dataType: "string"
            //             },

            //         ],

            //         // 👇 summary รวมค่าในแต่ละ group และรวมทั้งหมด
            //         summary: {
            //             // groupItems: [
            //             //     {
            //             //         column: "Quantity",
            //             //         summaryType: "sum",
            //             //         displayFormat: "Group Qty: {0}",
            //             //         valueFormat: { type: "fixedPoint", precision: 0 }
            //             //     },
            //             //     {
            //             //         column: "ProductCost",
            //             //         summaryType: "sum",
            //             //         displayFormat: "Group Cost: {0}",
            //             //         valueFormat: { type: "fixedPoint", precision: 0 }
            //             //     },
            //             //     {
            //             //         column: "TotalPoints",
            //             //         summaryType: "sum",
            //             //         displayFormat: "Group Points: {0}",
            //             //         valueFormat: { type: "fixedPoint", precision: 0 }
            //             //     }
            //             // ],
            //             totalItems: [
            //                 {
            //                     column: "Quantity",
            //                     summaryType: "sum",
            //                     displayFormat: " {0}",//Total Qty:
            //                     valueFormat: { type: "fixedPoint", precision: 0 }
            //                 },
            //                 {
            //                     column: "ProductCost",
            //                     summaryType: "sum",
            //                     displayFormat: " {0}", //Total Cost:
            //                     valueFormat: { type: "fixedPoint", precision: 0 }
            //                 },
            //                 {
            //                     column: "TotalPoints",
            //                     summaryType: "sum",
            //                     displayFormat: " {0}", //Total Points:
            //                     valueFormat: { type: "fixedPoint", precision: 0 }
            //                 }
            //             ]
            //         },

            //     });

            //     return $content;
            // }

            function ocreateNotePopupContent(noteData, mainRow) { // view & edit json in Noiote (njsonDatSum.Note) //, popupInstance
                const $content = $("<div style='padding:10px;'></div>");
                const $grid = $("<div id='noteGrid'></div>");
                $content.append($grid);

                $grid.dxDataGrid({
                    dataSource: noteData,
                    columnAutoWidth: true,
                    showBorders: true,
                    showColumnLines: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    filterRow: { visible: true },
                    searchPanel: { visible: true, width: 240 },
                    headerFilter: { visible: true },
                    columnChooser: { enabled: true, mode: "select" },
                    selection: { mode: "single" },
                    grouping: { contextMenuEnabled: true },
                    groupPanel: { visible: true },

                    // 👇 Force grid to fit about 10 rows
                    height: function () {
                        const rowHeight = 40; // typical row height in px
                        const visibleRows = 10;
                        return rowHeight * visibleRows + 100; // +100 for header, filter, pager
                    },

                    // 👇 Scrolling behavior
                    scrolling: {
                        mode: "standard",   // or "virtual" if dataset is large
                        showScrollbar: "always"
                    },

                    paging: {
                        pageSize: 10 // show 10 records per page
                    },
                    pager: {
                        showPageSizeSelector: true,
                        allowedPageSizes: [10, 20, 50]
                    },

                    // grouping: { contextMenuEnabled: true },
                    // groupPanel: { visible: true },

                    editing: {
                        mode: "cell",
                        allowUpdating: true,
                        allowAdding: false,
                        allowDeleting: false,
                        useIcons: true
                    },

                    // Columns expanded to multiple lines
                    columns: [
                        {
                            dataField: "Company",
                            caption: "Company",
                            visible: true,
                            readOnly: true,
                            dataType: "string",
                            groupIndex: 0
                        },
                        {
                            dataField: "HeadRefNo",
                            caption: "Head Ref No",
                            visible: false,
                            readOnly: true,
                            dataType: "string"
                        },
                        {
                            dataField: "REFNO",
                            caption: "Reference No",
                            visible: false,
                            readOnly: true,
                            dataType: "string"
                        },
                        {
                            dataField: "DateText",
                            caption: "Date",
                            visible: false,
                            readOnly: true,
                            dataType: "date",
                            format: "dd/MM/yyyy"
                        },
                        {
                            dataField: "ProductName",
                            caption: "Product Name",
                            visible: true,
                            readOnly: true,
                            dataType: "string"
                        },
                        {
                            dataField: "Quantity",
                            caption: "Quantity",
                            visible: true,
                            readOnly: true,
                            dataType: "number",
                            format: { type: "fixedPoint", precision: 0 }
                        },
                        {
                            dataField: "ProductCost",
                            caption: "Product Cost",
                            visible: true,
                            readOnly: true,
                            dataType: "number",
                            format: { type: "fixedPoint", precision: 0 }
                        },
                        {
                            dataField: "TotalPoints",
                            caption: "Total Points",
                            visible: false,
                            readOnly: true,
                            dataType: "number",
                            format: { type: "fixedPoint", precision: 0 }
                        },
                        {
                            dataField: "ClientCode",
                            caption: "Client Code",
                            visible: false,
                            readOnly: true,
                            dataType: "string"
                        },
                        {
                            dataField: "CashAdvance",
                            caption: "Cash Advance",
                            visible: false,
                            readOnly: true,
                            dataType: "number",
                            format: { type: "fixedPoint", precision: 0 }
                        },
                        {
                            dataField: "PayBy",
                            caption: "Pay By",
                            visible: true,
                            dataType: "string",
                            lookup: {
                                dataSource: PayByList,
                                valueExpr: "PayType",
                                displayExpr: "PayType"
                            }
                        },
                        {
                            dataField: "LoadedExcel",
                            caption: "Loaded Excel File",
                            visible: false,
                            readOnly: true,
                            dataType: "string"
                        },
                        // {
                        //     dataField: "ERODesc05",
                        //     caption: "LOT",
                        //     visible: false,
                        //     readOnly: true,
                        //     width: 80
                        // },
                        // {
                        //     dataField: "EROAmount2",
                        //     caption: "Outstanding",
                        //     visible: false,
                        //     readOnly: true,
                        //     width: 120, dataType: "number",
                        //     alignment: "right", format: { type: "fixedPoint", precision: 2 }
                        // }

                    ],

                    summary: {
                        totalItems: [
                            {
                                column: "Quantity",
                                summaryType: "sum",
                                displayFormat: " {0}",
                                valueFormat: { type: "fixedPoint", precision: 0 }
                            },
                            {
                                column: "ProductCost",
                                summaryType: "sum",
                                displayFormat: " {0}",
                                valueFormat: { type: "fixedPoint", precision: 0 }
                            },
                            {
                                column: "TotalPoints",
                                summaryType: "sum",
                                displayFormat: " {0}",
                                valueFormat: { type: "fixedPoint", precision: 0 }
                            },
                        ]
                    }
                });

                // SAVE button
                const $saveBtn = $("<div style='margin-top:10px;'></div>").dxButton({
                    text: "SAVE",
                    icon: "save",
                    type: "success",
                    onClick: async function () {
                        const gridInstance = $grid.dxDataGrid("instance");

                        // 1) Commit any pending cell edits before reading
                        await gridInstance.saveEditData();

                        // 2) Read only flat data rows (avoid grouped nodes with key/items)
                        const flatRows = gridInstance
                            .getVisibleRows()
                            .filter(r => r.rowType === "data")
                            .map(r => r.data);

                        // Optional: coerce numerics to numbers if needed
                        // flatRows.forEach(r => {
                        //     r.Quantity = Number(r.Quantity);
                        //     r.ProductCost = Number(r.ProductCost);
                        //     r.TotalPoints = Number(r.TotalPoints);
                        //     r.CashAdvance = Number(r.CashAdvance);
                        // });

                        const updatedJson = JSON.stringify(flatRows);

                        // 3) Save back to mainRow and njsonDataSum
                        mainRow.Note = updatedJson;
                        const idx = njsonDataSum.findIndex(r => r.HeadRefNo === mainRow.HeadRefNo);
                        if (idx >= 0) {
                            njsonDataSum[idx].Note = updatedJson;
                        }

                        // 4) Refresh main grid and close popup
                        $("#gridContainer").dxDataGrid("instance").refresh();
                        $("#notePopup").dxPopup("instance").hide();
                        // 👇 ใช้ popupInstance.hide() ปิด popup
                        popupInstance.hide();
                        notify("success", "Note saved and popup closed.", 2000);
                    }
                });
                // EXIT button
                const $exitBtn = $("<div style='margin-top:10px; margin-left:10px; display:inline-block;'></div>").dxButton({
                    text: "EXIT",
                    icon: "close",
                    type: "danger",
                    onClick: function () {
                        // ปิด popup โดยไม่ save
                        //popupInstance.hide();
                        $("#notePopup").dxPopup("instance").hide();
                        notify("info", "Popup closed without saving.", 2000);
                    }
                });

                $content.append($saveBtn);
                $content.append($exitBtn);

                return $content;
            }

            function createNotePopupContent(noteData, mainRow) {
                const $content = $("<div style='padding:10px;'></div>");
                const $grid = $("<div id='noteGrid'></div>");
                $content.append($grid);

                $grid.dxDataGrid({
                    dataSource: noteData,
                    columnAutoWidth: true,
                    showBorders: true,
                    showColumnLines: true,
                    showRowLines: true,
                    rowAlternationEnabled: true,
                    filterRow: { visible: true },
                    searchPanel: { visible: true, width: 240 },
                    headerFilter: { visible: true },
                    columnChooser: { enabled: true, mode: "select" },
                    selection: { mode: "single" },
                    grouping: { contextMenuEnabled: true },
                    groupPanel: { visible: true },

                    height: function () {
                        const rowHeight = 40;
                        const visibleRows = 10;
                        return rowHeight * visibleRows + 100;
                    },

                    scrolling: {
                        mode: "standard",
                        showScrollbar: "always"
                    },

                    paging: {
                        pageSize: 10
                    },
                    pager: {
                        showPageSizeSelector: true,
                        allowedPageSizes: [10, 20, 50]
                    },

                    editing: {
                        mode: "cell",
                        allowUpdating: true,
                        allowAdding: false,
                        allowDeleting: false,
                        useIcons: true
                    },

                    // 👇 Expanded columns for readability
                    columns: [
                        {
                            dataField: "Company",
                            caption: "Company",
                            visible: true,
                            readOnly: true,
                            dataType: "string",
                            groupIndex: 0
                        },
                        {
                            dataField: "HeadRefNo",
                            caption: "Head Ref No",
                            visible: false,
                            readOnly: true,
                            dataType: "string"
                        },
                        {
                            dataField: "REFNO",
                            caption: "Reference No",
                            visible: false,
                            readOnly: true,
                            dataType: "string"
                        },
                        {
                            dataField: "DateText",
                            caption: "Date",
                            visible: false,
                            readOnly: true,
                            dataType: "date",
                            format: "dd/MM/yyyy"
                        },
                        {
                            dataField: "ProductName",
                            caption: "Product Name",
                            visible: true,
                            readOnly: true,
                            dataType: "string"
                        },
                        {
                            dataField: "Quantity",
                            caption: "Quantity",
                            visible: true,
                            readOnly: true,
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            dataField: "ProductCost",
                            caption: "Product Cost",
                            visible: true,
                            readOnly: true,
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            dataField: "TotalPoints",
                            caption: "Total Points",
                            visible: false,
                            readOnly: true,
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            dataField: "ClientCode",
                            caption: "Client Code",
                            visible: false,
                            readOnly: true,
                            dataType: "string"
                        },
                        {
                            dataField: "CashAdvance",
                            caption: "Cash Advance",
                            visible: false,
                            readOnly: true,
                            dataType: "number",
                            format: {
                                type: "fixedPoint",
                                precision: 0
                            }
                        },
                        {
                            dataField: "PayBy",
                            caption: "Pay By",
                            visible: true,
                            dataType: "string",
                            lookup: {
                                dataSource: PayByList,
                                valueExpr: "PayType",
                                displayExpr: "PayType"
                            }
                        },
                        {
                            dataField: "LoadedExcel",
                            caption: "Loaded Excel File",
                            visible: false,
                            readOnly: true,
                            dataType: "string"
                        }
                    ],

                    // 👇 Expanded summary for readability
                    summary: {
                        totalItems: [
                            {
                                column: "Quantity",
                                summaryType: "sum",
                                displayFormat: " {0}",
                                valueFormat: {
                                    type: "fixedPoint",
                                    precision: 0
                                }
                            },
                            {
                                column: "ProductCost",
                                summaryType: "sum",
                                displayFormat: " {0}",
                                valueFormat: {
                                    type: "fixedPoint",
                                    precision: 0
                                }
                            },
                            {
                                column: "TotalPoints",
                                summaryType: "sum",
                                displayFormat: " {0}",
                                valueFormat: {
                                    type: "fixedPoint",
                                    precision: 0
                                }
                            }
                        ]
                    }
                });

                // SAVE button
                const $saveBtn = $("<div style='margin-top:10px;'></div>").dxButton({
                    text: "SAVE",
                    icon: "save",
                    type: "success",
                    onClick: async function () {
                        const gridInstance = $grid.dxDataGrid("instance");

                        try {
                            await gridInstance.saveEditData();

                            const dsOption = gridInstance.option("dataSource");
                            const allRows = Array.isArray(dsOption)
                                ? dsOption
                                : await gridInstance.getDataSource().store().load();

                            const byHead = allRows.reduce((acc, row) => {
                                const key = row.HeadRefNo;
                                if (!key) return acc;
                                (acc[key] ||= []).push(row);
                                return acc;
                            }, {});

                            let updatedCount = 0;
                            Object.keys(byHead).forEach((headRefNo) => {
                                const subsetJson = JSON.stringify(byHead[headRefNo]);

                                const idx = njsonDataSum.findIndex(r => r.HeadRefNo === headRefNo);
                                if (idx >= 0) {
                                    njsonDataSum[idx].Note = subsetJson;
                                    updatedCount++;
                                }

                                if (mainRow && mainRow.HeadRefNo === headRefNo) {
                                    mainRow.Note = subsetJson;
                                }
                            });

                            $("#gridContainer").dxDataGrid("instance").refresh();
                            $("#notePopup").dxPopup("instance").hide();
                            if (typeof popupInstance?.hide === "function") popupInstance.hide();

                            notify("success", `Saved notes for ${updatedCount} customer(s).`, 2500);
                        } catch (err) {
                            notify("error", `Save failed: ${err?.message || err}`, 3000);
                            console.error("Note save error:", err);
                        }
                    }
                });

                // EXIT button
                const $exitBtn = $("<div style='margin-top:10px; margin-left:10px; display:inline-block;'></div>").dxButton({
                    text: "EXIT",
                    icon: "close",
                    type: "danger",
                    onClick: function () {
                        $("#notePopup").dxPopup("instance").hide();
                        notify("info", "Popup closed without saving.", 2000);
                    }
                });

                $content.append($saveBtn);
                $content.append($exitBtn);

                return $content;
            }

            function ainitGrid(data) { // MAIN Popup dxDataGrid using njsonDataSum
                const columns = [
                    {
                        type: "buttons",
                        width: 80,
                        showInColumnChooser: false,
                        buttons: [
                            {
                                hint: "View Details",
                                icon: "search", // DevExtreme icon หรือใช้ FontAwesome ผ่าน elementAttr
                                // visible: function (e) {
                                //     // เงื่อนไขการแสดงปุ่ม
                                //     return (e.row.data.Confirmed === false);
                                // },
                                visible: true,
                                onClick: function (e) {
                                    let noteData = [];
                                    try {
                                        noteData = JSON.parse(e.row.data.Note);
                                    } catch (err) {
                                        console.error("Invalid JSON in Note", err);
                                        return;
                                    }

                                    if (!$("#notePopup").length) {
                                        $("body").append("<div id='notePopup'></div>");
                                    }

                                    $("#notePopup").dxPopup({
                                        title: "Purchase Details",
                                        width: 1200,
                                        height: 650,
                                        position: {
                                            of: window,  // Position relative to the window
                                            my: "center", // Center horizontally
                                            at: "center", // Center vertically
                                            offset: "5 -180" // Move up by 250px (y-axis)
                                        },
                                        visible: true,
                                        showCloseButton: true,
                                        dragEnabled: true,
                                        contentTemplate: function () {
                                            return createNotePopupContent(noteData, e.row.data); //, popupInstance
                                        }
                                    });


                                }

                            },
                            {
                                hint: "View Extract files",
                                icon: "xlsxfile", // DevExtreme icon หรือใช้ FontAwesome ผ่าน elementAttr
                                // visible: function (e) {
                                //     // เงื่อนไขการแสดงปุ่ม
                                //     return (e.row.data.Confirmed === false);
                                // },
                                onClick: function (e) {
                                    //viewUploadedFile("FlexibleTEMP.xlsx");
                                    //alert(e.row.data.ERORefNo1)
                                    ULbCustomerGrp(e.row.data.ERORefNo1)
                                },
                            },
                        ]
                    },
                    {
                        dataField: "HeadRefNo",
                        caption: "PRE REF#",
                        //sortOrder: "asc",
                        width: 130,
                        editorOptions: { readOnly: true },
                    },
                    {
                        dataField: "REFNO",
                        caption: "REF#",
                        width: 130,
                        visible: false,
                        editorOptions: { readOnly: true },
                    },
                    {
                        dataField: "ID",
                        caption: "NO",
                        width: 80,
                        visible: false,
                        editorOptions: { readOnly: true },
                    },
                    {
                        dataField: "ERODate02",
                        caption: "Period",
                        format: "dd/MM/yyyy",
                        width: 100,
                        editorOptions: { readOnly: true }
                    },

                    {
                        dataField: "ERORefNo1",
                        caption: "Company Group",
                        sortOrder: "asc",
                        width: 220,
                        editorOptions: { readOnly: true }
                    },
                    {
                        dataField: "EROAmount6", //EROAmount4 //RefundedAmount
                        caption: "Quantity",
                        width: 100,
                        dataType: "number",
                        alignment: "right",
                        editorOptions: { readOnly: true },
                        format: { type: "fixedPoint", precision: 0 }
                    },
                    {
                        dataField: "RefundedAmount", //EROAmount4 //RefundedAmount
                        caption: "Cash Advance",
                        width: 120,
                        dataType: "number",
                        alignment: "right",
                        editorOptions: { readOnly: true },
                        format: { type: "fixedPoint", precision: 2 }
                    },
                    {
                        dataField: "EROAmount1",
                        caption: "Limit",
                        width: 130,
                        dataType: "number",
                        alignment: "right",
                        editorOptions: { readOnly: true },
                        format: { type: "fixedPoint", precision: 0 } // 9,999.99
                    },

                    {
                        dataField: "ERODesc03",
                        caption: "Cash Advance Reason",
                        dataType: "string",
                        width: 150,
                        visible: false,
                    },
                    {
                        dataField: "PBatchNo",
                        caption: "Corporate Card",
                        width: 100,
                        visible: false,
                        editorOptions: { readOnly: true }
                    },
                    {
                        dataField: "ERODesc01",
                        caption: "URL FILENAME",
                        dataType: "string",
                        width: 200,
                        visible: false,
                    }, {
                        dataField: "Note", caption: "Details Data", dataType: "string", editorType: "dxTextArea", alignment: 'top',
                        cellTemplate: function (container, options) {
                            var text = options.value ? options.value.replace(/\n/g, "<br>") : "";
                            container.html(text);
                        }, width: 200, visible: false
                    },
                    {
                        dataField: "ERStatus",
                        caption: "Status",
                        visible: false,
                        readOnly: true,
                        width: 180
                    },
                    {
                        dataField: "ERODesc05",
                        caption: "LOT",
                        headerCellTemplate: function (container) {
                            $("<div>")
                                .text("LOT")
                                .css({
                                    "background-color": "lightgreen",
                                    "font-weight": "bold",
                                    "padding": "5px"
                                })
                                .appendTo(container);
                        },
                        width: 80
                    },
                    {
                        dataField: "EROAmount2",
                        caption: "Outstanding",
                        headerCellTemplate: function (container) {
                            $("<div>")
                                .text("Outstanding")
                                .css({
                                    "background-color": "lightgreen",
                                    "font-weight": "bold",
                                    "padding": "5px"
                                })
                                .appendTo(container);
                        },
                        width: 120,
                        dataType: "number",
                        alignment: "right",
                        format: { type: "fixedPoint", precision: 2 },
                    },
                    {
                        dataField: "Confirmed",
                        caption: "Confirmed",
                        visible: false,          // ให้แสดง
                        dataType: "boolean",    // boolean จะ render เป็น checkbox
                        width: 120
                    }
                ];
                // 👇 Save incoming data to njsonDataSum
                njsonDataSum = data ? [...data] : [];

                if (!agridInstance) {
                    agridInstance = $("#agrid").dxDataGrid({
                        dataSource: njsonDataSum,   // 👈 use njsonDataSum here //njsonDataSum, //data,
                        columnAutoWidth: true,
                        showBorders: true,
                        groupPaging: true,
                        showColumnLines: true,
                        // 👇 เปิด selection mode
                        selection: {
                            mode: "single"   // หรือ "multiple" ถ้าอยากเลือกหลาย record
                        },
                        showRowLines: true,
                        rowAlternationEnabled: true,
                        scrolling: { mode: "virtual" },
                        filterRow: { visible: true },
                        searchPanel: { visible: true, width: 240, placeholder: "Search..." },
                        headerFilter: { visible: true },
                        grouping: { contextMenuEnabled: true },
                        groupPanel: { visible: false },
                        columnChooser: { enabled: true, mode: "select" },
                        //width: 1200,
                        height: 400,
                        columns: columns,

                        // 👇 เปิด read/write พร้อม icons
                        editing: {
                            mode: "cell",              // ใช้ row mode เพื่อให้มีปุ่มในแต่ละแถว cell,row,popup
                            allowUpdating: true,
                            allowAdding: false,
                            allowDeleting: false,
                            useIcons: true,           // แสดงเป็นไอคอนแทนข้อความ
                            texts: {
                                addRow: "Add New",
                                editRow: "Edit",
                                deleteRow: "Delete",
                                saveRowChanges: "Save",
                                cancelRowChanges: "Cancel"
                            }
                        },

                        // 👇 เพิ่ม toolbar icons
                        onToolbarPreparing: function (e) {
                            var dataGrid = e.component;
                            e.toolbarOptions.items.unshift(
                                //e.toolbarOptions.items.push(
                                {
                                    location: "after",
                                    widget: "dxButton",
                                    options: {
                                        icon: "search",
                                        text: "View Details",
                                        visible: false,
                                        onClick: function () {
                                            const selectedRows = dataGrid.getSelectedRowsData();
                                            if (!selectedRows || selectedRows.length === 0) {
                                                notify("warning", "Please select a record first.", 2000);
                                                return;
                                            }

                                            // ✅ แสดงข้อมูลจริง
                                            //console.log("Selected rows:", JSON.stringify(selectedRows, null, 2));

                                            const selected = selectedRows[0];
                                            let noteData = [];
                                            try {
                                                noteData = JSON.parse(selected.Note);
                                                console.log(noteData)
                                            } catch (err) {
                                                console.error("Invalid JSON in Note", err);
                                                return;
                                            }

                                            if (!$("#notePopup").length) {
                                                $("body").append("<div id='notePopup'></div>");
                                            }

                                            $("#notePopup").dxPopup({
                                                title: "Purchase Details",
                                                //width: 1200,
                                                //height: 600,
                                                visible: true,
                                                showCloseButton: true,
                                                dragEnabled: true,
                                                contentTemplate: function () {
                                                    return createNotePopupContent(noteData);
                                                }
                                            });
                                        }
                                    }
                                },
                                {
                                    location: "after",
                                    widget: "dxButton",
                                    visible: false,
                                    options: {
                                        icon: "save",
                                        text: "Save",
                                        onClick: async function () {
                                            // 1) Commit pending cell edits
                                            await dataGrid.saveEditData();
                                            // 2) Refresh grid (summaries, UI)
                                            await dataGrid.refresh();
                                            // 3) Capture current data into njsonDataSum
                                            const ds = dataGrid.getDataSource();
                                            njsonDataSum = ds ? ds.items() : dataGrid.option("dataSource");
                                            console.log("Saved to njsonDataSum:", njsonDataSum);
                                        }
                                    }
                                },
                                {
                                    location: "after",
                                    widget: "dxButton",
                                    visible: false,
                                    options: {
                                        icon: "undo",
                                        text: "Cancel",
                                        onClick: function () {
                                            dataGrid.cancelEditData();
                                        }
                                    }
                                },
                                {
                                    location: "before",
                                    template: function () {
                                        return $("<div />")
                                            .append(
                                                $("<span style='font-size: 15px; font-weight: bold; color: white; background-color: darkgreen; border-radius: 3px; border: 0px; padding: 1px 5px; ' />")
                                                    .text("Pre-Approved Batch Generate"), //" FOR "
                                            );
                                    }
                                },
                                {
                                    location: "after",
                                    locateInMenu: "auto",
                                    widget: "dxButton",
                                    options: {
                                        icon: "xlsxfile",
                                        text: "LOAD TRANS.",
                                        onClick: function () {
                                            loadExcelPopup(); // 👈 เปิด popup พร้อม uploader และ parse Excel
                                            lLoadTrans = true;
                                        }
                                    }
                                },
                                // {
                                //     location: "after",
                                //     locateInMenu: "auto",
                                //     widget: "dxButton",
                                //     visible: false,
                                //     options: {
                                //         icon: "xlsxfile",   // ใช้ icon ของ DevExtreme
                                //         text: "LOAD TEMPLATE",
                                //         //disabled: !lLoadTrans,
                                //         onClick: function () {
                                //             loadTemplate();
                                //         }
                                //     }
                                // },
                                {
                                    location: "after",
                                    locateInMenu: "auto",
                                    widget: "dxButton",
                                    visible: false,
                                    options: {
                                        icon: "runner",   // ใช้ icon ของ DevExtreme sparkle
                                        text: "TEST 0",
                                        //disabled: !lLoadTemp,
                                        onClick: function () {
                                            //downloadCustomerGrp();
                                            testOneRecord(0);
                                            //uploadCustomerGrps(true);
                                            //notify("success", "Saved to DB & Upload Excel.", 2000);
                                        }
                                    }
                                },
                                {
                                    location: "after",
                                    locateInMenu: "auto",
                                    widget: "dxButton",
                                    options: {
                                        icon: "runner",   // ใช้ icon ของ DevExtreme sparkle
                                        text: "PROCESS",
                                        //disabled: !lLoadTemp,
                                        onClick: function () {
                                            if (lLoadTrans) {
                                                const isAllEmpty = njsonDataSum.every(item => {
                                                    return (!item.ERODesc05 || item.ERODesc05 === "") &&
                                                        (!item.EROAmount2 || item.EROAmount2 === "");
                                                });

                                                if (isAllEmpty) {
                                                    let result = DevExpress.ui.dialog.custom({
                                                        title: "LOT and Outstanding is empty",
                                                        message: "The LOT and Outstanding is not record,<br> Please record these fields",
                                                        buttons: [
                                                            //{ text: "YES", onClick: () => true },
                                                            { text: "CLOSE", onClick: () => false }
                                                        ],
                                                        position: {
                                                            of: window,  // Position relative to the window
                                                            my: "center", // Center horizontally
                                                            at: "center", // Center vertically
                                                            offset: "0 -250" // Move up by 250px (y-axis)
                                                        }
                                                    }).show();
                                                    result.done(function (dresult) {
                                                        if (dresult) {
                                                            downloadCustomerGrp(); // upload Excel file to Server
                                                            saveData(); // save all data to database
                                                            //uploadCustomerGrp();
                                                            //testOneRecord(0); 
                                                        }
                                                    });
                                                } else {
                                                    // Build the message content
                                                    let count = njsonDataSum.length;
                                                    let details = njsonDataSum.map(item =>
                                                        `Pre Ref#: ${item.HeadRefNo} | Company Group: ${item.ERORefNo1} | Period: ${formatDateDDMMYYYY(item.ERODate02)}`
                                                    ).join("<br>");

                                                    // Create the dialog
                                                    let result = DevExpress.ui.dialog.custom({
                                                        title: "BATCH GENERATE",
                                                        message: `Press YES to generate Pre-Approved transaction,<br>There are ${count} items to generate:<br><br>${details}`,
                                                        buttons: [
                                                            { text: "YES", onClick: () => true },
                                                            { text: "NO", onClick: () => false }
                                                        ],
                                                        position: {
                                                            of: window,   // Position relative to the window
                                                            my: "center", // Center horizontally
                                                            at: "center", // Center vertically
                                                            offset: "0 -250" // Move up by 250px (y-axis)
                                                        }
                                                    }).show();

                                                    result.done(function (dresult) {
                                                        if (dresult) {
                                                            downloadCustomerGrp(); // upload Excel file to Server
                                                            saveData(); // save all data to database
                                                        }
                                                    });
                                                }

                                            } else {
                                                // Create the dialog
                                                let xresult = DevExpress.ui.dialog.custom({
                                                    title: `NO DATA LOADED`,
                                                    message: `
                                                        <div style="display:flex; align-items:center; gap:8px;">
                                                            <span>Please Load Excel Cash Advance Transaction by click at,<br> <i class="dx-icon-xlsxfile"></i> LOAD TRANS.
                                                            before and then click  <i class="dx-icon-runner"></i> PROCESS</span>
                                                        </div>
                                                    `,
                                                    buttons: [
                                                        { text: "OK", onClick: () => false }
                                                    ],
                                                    position: {
                                                        of: window,
                                                        my: "center",
                                                        at: "center",
                                                        offset: "0 -250"
                                                    }
                                                }).show();
                                            }
                                        }
                                    }
                                },
                                {
                                    location: "after",
                                    locateInMenu: "auto",
                                    widget: "dxButton",
                                    visible: false,
                                    options: {
                                        icon: "add",
                                        text: "Add New",
                                        onClick: function () {
                                            dataGrid.addRow();
                                        }
                                    }
                                },
                                {
                                    location: "after",
                                    locateInMenu: "auto",
                                    widget: "dxButton",
                                    options: {
                                        icon: "refresh",
                                        hint: "Reload",
                                        onClick: function () {
                                            dataGrid.refresh();
                                        }
                                    }
                                }
                            );
                        },
                        // 👇 Keep njsonDataSum updated when user edits
                        onSaved: function (e) {
                            // Refresh the grid view/data
                            e.component.refresh().then(function () {
                                // Safely capture the array data (works for both array and DataSource)
                                const ds = e.component.getDataSource();
                                njsonDataSum = ds ? ds.items() : e.component.option("dataSource");
                                console.log("Updated njsonDataSum:", njsonDataSum);
                            });
                        },

                        // 👇 เพิ่ม summary สำหรับทุก amount field
                        summary: {
                            totalItems: [
                                {
                                    column: "EROAmount6",
                                    summaryType: "sum",
                                    displayFormat: "{0}",
                                    valueFormat: { type: "fixedPoint", precision: 2 }
                                },
                                {
                                    column: "RefundedAmount",
                                    summaryType: "sum",
                                    displayFormat: "{0}",
                                    valueFormat: { type: "fixedPoint", precision: 2 }
                                },
                                {
                                    column: "EROAmount1",
                                    summaryType: "sum",
                                    displayFormat: "{0}",
                                    valueFormat: { type: "fixedPoint", precision: 2 }
                                },
                                {
                                    column: "EROAmount2",
                                    summaryType: "sum",
                                    displayFormat: "{0}",
                                    valueFormat: { type: "fixedPoint", precision: 0 }
                                }
                            ]
                        }

                    }).dxDataGrid("instance");
                } else {
                    agridInstance.option("dataSource", njsonDataSum); //data
                    agridInstance.option("columns", columns);
                }
            }

            const loadTemplate = () => { //Load FlexibleTEMP.xls Template file
                if (!lLoadTrans) return notify("error", "Please load Excel Transaction before.", 4000);
                // สร้าง popup container ถ้ายังไม่มี
                if (!$("#uploadPopup").length) {
                    $("body").append($("<div id='uploadPopup'></div>"));
                }

                $("#uploadPopup").dxPopup({
                    title: "Load Excel Template",
                    width: 400,
                    height: "auto",
                    visible: true,
                    showCloseButton: true,
                    dragEnabled: true,
                    contentTemplate: () => {
                        // สร้าง content ภายใน popup
                        const $content = $("<div style='padding:10px;'></div>");

                        // สร้าง div สำหรับ uploader และ label
                        const $uploaderDiv = $("<div id='input-template'></div>");
                        const $label = $("<span id='template-name' class='file-label'></span>");

                        $content.append($uploaderDiv, $label);

                        // init dxFileUploader บน div ที่เพิ่งสร้าง
                        $uploaderDiv.dxFileUploader({
                            accept: ".xlsx",
                            selectButtonText: "Browse",
                            uploadMode: "useForm",
                            onValueChanged: async (e) => {
                                const file = e.value[0];
                                if (!file) return;

                                if (file.name.toLowerCase() !== "flexibletemp.xlsx") {
                                    notify("error", "Please select the correct file: FlexibleTEMP.xlsx", 3000);
                                    e.component.reset();
                                    return;
                                }

                                try {
                                    const buffer = await file.arrayBuffer();
                                    templateBuffer = buffer;
                                    templateFileName = file.name;
                                    $label.text(`Loaded: ${templateFileName}`);
                                    notify("success", "Template FlexibleTEMP.xlsx loaded.", 2000);
                                    // 👇 ปิด popup หลังจากโหลดสำเร็จ
                                    $("#uploadPopup").dxPopup("instance").option("visible", false);
                                    lLoadTemp = true;
                                } catch (err) {
                                    console.error(err);
                                    notify("error", "Failed to load template.", 3000);
                                }
                            }
                        });

                        return $content;
                    }
                });
            };

            const loadUrlTemp = async (Url, filename) => {
                // เพิ่ม query string เพื่อบังคับโหลดใหม่
                const bust = "?v=" + Date.now();
                const fileUrl = Url + encodeURIComponent(filename) + bust;
                const urlObj = new URL(fileUrl);
                const serverInfo = getCurrentServerInfo(); // serverInfo.hostname

                console.log("Server:", serverInfo.hostname);
                console.log("URL:", urlObj.href);

                try {
                    if (serverInfo.hostname === "localhost") {
                        const localUrl = `http://localhost:8089/temp/uploads/${filename}${bust}`;
                        const response = await fetch(localUrl, { cache: "no-store" });
                        if (!response.ok) throw new Error("Local server not running");

                        const buffer = await response.arrayBuffer();
                        templateBuffer = buffer;
                        lLoadTemp = true;
                        notify("success", "Template loaded from localhost server.", 2000);
                    } else {
                        const response = await fetch(fileUrl, {
                            method: "GET",
                            credentials: "include",
                            mode: "cors",
                            cache: "no-store" // 👉 บังคับไม่ใช้ cache
                        });
                        if (!response.ok) throw new Error("Failed to load file: " + response.status);

                        const buffer = await response.arrayBuffer();
                        templateBuffer = buffer;
                        lLoadTemp = true;
                        notify("success", "Template loaded from server.", 2000);
                    }
                } catch (err) {
                    console.error(err);
                    notify("error", "Failed to load template. Please upload manually.", 3000);
                }
            };

            const loadExcelPopup = () => { // Load Excel Transaction [first MAIN PROGRAM]
                // สร้าง popup container ถ้ายังไม่มี
                if (!$("#xuploadPopup").length) {
                    $("body").append($("<div id='xuploadPopup'></div>"));
                }

                $("#xuploadPopup").dxPopup({
                    title: "Load Excel File",
                    width: 600,
                    height: "auto",
                    visible: true,
                    showCloseButton: true,
                    dragEnabled: true,
                    position: {
                        my: "left top",   // popup corner to align
                        at: "left top",   // target corner
                        of: window,       // relative to window
                        offset: "200 200"   // shift: x=50px, y=20px
                    },
                    contentTemplate: () => {
                        const $content = $("<div style='padding:10px;'></div>");
                        const $uploaderDiv = $("<div id='xinput-excel'></div>");
                        const $label = $("<span id='xexcel-status' class='file-label'></span>");

                        $content.append($uploaderDiv, $label);

                        // init dxFileUploader
                        $uploaderDiv.dxFileUploader({
                            accept: ".xlsx",
                            selectButtonText: "Browse Excel",
                            uploadMode: "useForm",
                            onValueChanged: async (e) => {
                                const file = e.value[0];
                                if (!file) return;

                                try {
                                    const buffer = await file.arrayBuffer();
                                    const workbook = new ExcelJS.Workbook();
                                    await workbook.xlsx.load(buffer);

                                    const worksheet = workbook.worksheets[0];
                                    const b1 = getCellText(worksheet.getCell("B1"));
                                    const dateText = extractDateAfterTo(b1);

                                    // build headers
                                    const headerRow = worksheet.getRow(2);
                                    const rawValues = headerRow.values.slice();
                                    const headers = {};
                                    for (let i = 1; i < rawValues.length; i++) {
                                        const h = rawValues[i];
                                        headers[i] = typeof h === "string" ? h.trim() : (h ? String(h).trim() : "");
                                        headers[i] = headers[i].replace(/\s+/g, "");
                                    }

                                    // parse rows
                                    const results = [];
                                    worksheet.eachRow((row, rowNumber) => {
                                        if (rowNumber < 3) return;

                                        const record = {};
                                        let hasData = false;

                                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                                            const header = headers[colNumber];
                                            if (!header) return;

                                            const value = normalizeCellValue(cell);

                                            if (header.toLowerCase() === "company") {
                                                const companyParts = splitCompanyField(value);
                                                Object.assign(record, companyParts);
                                                if (companyParts.Company || companyParts.Address || companyParts.TaxNo) hasData = true;
                                            } else {
                                                record[header] = value;
                                                if (value !== "") hasData = true;
                                            }
                                        });

                                        record.DateText = dateText;
                                        enrichWithGroup(record);

                                        // 👇 เพิ่ม header ใหม่ที่คุณต้องการ
                                        record.PayBy = "Corporate Card";
                                        record.LoadedExcel = file.name;   // ใช้ชื่อไฟล์ที่ upload

                                        if (hasData) results.push(record);
                                    });

                                    // process results
                                    //console.log("Group code,",clientGroupcode)
                                    jsonData = results;
                                    jsonData = jsonData.map(r => {
                                        const { Address, Department, TaxNo, ...rest } = r;
                                        return rest;
                                    });
                                    const xjsonData = cleanResults(results);
                                    console.log("cleaned xjsonData = ", xjsonData);

                                    jsonDataSum = SumJson(xjsonData);
                                    console.log("Sum json to new jsonDataSum = ", jsonDataSum);

                                    const njsonData = xLinkInsert(jsonDataSum, jsonData);
                                    console.log("link Refno to njsonData = ", njsonData);

                                    njsonDataSum = addNoteAsText(jsonDataSum, njsonData);
                                    console.log("add detail jsonData to Note njsonDataSum = ", njsonDataSum);

                                    jsonData = njsonData; // set complete njsonData to jsonData
                                    ainitGrid(njsonDataSum);
                                    // Load Tempate excel file
                                    loadUrlTemp("https://cbsdev2.locktonwattana.com/temp/uploads/", "FlexibleTEMP.xlsx")
                                    notify("success", "Excel loaded and JSON generated.", 2000);
                                    $label.text(`Loaded: ${file.name}`);

                                    // 👇 ปิด popup หลังจากโหลดสำเร็จ
                                    $("#xuploadPopup").dxPopup("instance").option("visible", false);
                                    lLoadTrans = true;
                                } catch (err) {
                                    console.error(err);
                                    notify("error", "Failed to load Excel. Check file format or console logs.", 3000);
                                }
                            }
                        });

                        return $content;
                    }
                });
            };

            function buildColumnsFromData(data) {
                if (!data || data.length === 0) return [];
                const keys = Object.keys(data[0]);
                return keys.map(k => ({ dataField: k, caption: k }));
            }

            function initPopup() { // popup for details
                if (!popupInstance) {
                    popupInstance = $("#jsonPopup").dxPopup({
                        title: "JSON content",
                        width: 800,
                        height: 600,
                        showCloseButton: true,
                        visible: true,
                        contentTemplate: function () {
                            const container = $("<div>").css({ height: "100%", display: "flex", flexDirection: "column" });
                            const pre = $("<pre>").css({ flex: "1 1 auto", overflow: "auto", background: "#f7f7f7", padding: "12px", border: "1px solid #ddd" });
                            pre.text(JSON.stringify(jsonData, null, 2));
                            container.append(pre);
                            return container;
                        }
                    }).dxPopup("instance");
                } else {
                    popupInstance.option("contentTemplate", function () {
                        const container = $("<div>").css({ height: "100%", display: "flex", flexDirection: "column" });
                        const pre = $("<pre>").css({ flex: "1 1 auto", overflow: "auto", background: "#f7f7f7", padding: "12px", border: "1px solid #ddd" });
                        pre.text(JSON.stringify(jsonData, null, 2));
                        container.append(pre);
                        return container;
                    });
                }
            }

            // Load Excel Template via button (under the first choose file)
            document.getElementById('btn-load-template').addEventListener('click', () => {
                document.getElementById('input-template').click();
            });

            document.getElementById('input-template').addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (!file) return;
                // check filename (case-insensitive)
                if (file.name.toLowerCase() !== "flexibletemp.xlsx") {
                    notify("error", "Please select the correct file: FlexibleTEMP.xlsx", 3000);
                    event.target.value = ""; // reset file input
                    return;
                }
                try {
                    templateBuffer = await file.arrayBuffer();
                    templateFileName = file.name;
                    document.getElementById('template-name').textContent = `Loaded: ${templateFileName}`;
                    notify("success", "Template FlexibleTEMP.xlsx loaded.", 2000);
                    // 👇 ปิด popup หลังจากโหลดสำเร็จ
                    $("#uploadPopup").dxPopup("instance").option("visible", false);
                    lLoadTemp = true;
                } catch (err) {
                    console.error(err);
                    notify("error", "Failed to load template.", 3000);
                }
            });

            // Load Excel → JSON -> dxDataGrid // Run This first 
            document.getElementById('input-excel').addEventListener('change', async (event) => {
                const file = event.target.files[0];

                if (!file) return;

                try {
                    const buffer = await file.arrayBuffer();
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.load(buffer);

                    const worksheet = workbook.worksheets[0];
                    const b1 = getCellText(worksheet.getCell('B1'));
                    const dateText = extractDateAfterTo(b1);

                    const headerRow = worksheet.getRow(2);
                    const rawValues = headerRow.values.slice();
                    const headers = {};
                    for (let i = 1; i < rawValues.length; i++) {
                        const h = rawValues[i];
                        //const cleanValue = typeof value === 'string' ? value.replace(/\s+/g, '') : value;
                        //headers[i] = typeof h === 'string' ? h.trim() : (h ? String(h).trim() : '');
                        headers[i] = typeof h === 'string' ? h.trim() : (h ? String(h).trim() : '');
                        headers[i] = headers[i].replace(/\s+/g, '')
                    }

                    const results = [];
                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber < 3) return;

                        const record = {};
                        let hasData = false;

                        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                            const header = headers[colNumber];
                            if (!header) return;

                            const value = normalizeCellValue(cell);

                            if (header.toLowerCase() === 'company') {
                                const companyParts = splitCompanyField(value);
                                Object.assign(record, companyParts);
                                if (companyParts.Company || companyParts.Address || companyParts.TaxNo) hasData = true;
                            } else {
                                //const cleanValue = typeof value === 'string' ? value.replace(/\s+/g, '') : value;
                                record[header] = value;
                                if (value !== '') hasData = true;
                            }
                        });

                        record.DateText = dateText;
                        enrichWithGroup(record);

                        if (hasData) results.push(record);
                    });
                    //const aHRefNo = getUniqueHeadRef("P")
                    jsonData = results;
                    const xjsonData = cleanResults(results);
                    console.log("clean result xjsonData =", xjsonData)
                    jsonDataSum = SumJson(xjsonData);
                    console.log("Sum json jsonDataSum = ", jsonDataSum)
                    const njsonData = xLinkInsert(jsonDataSum, jsonData)//, "ERORefNo1", "CustomerGroup", ["REFNO"]);
                    console.log("total json with Refno njsonData = ", njsonData);
                    njsonDataSum = addNoteAsText(jsonDataSum, njsonData)
                    console.log("add note from jsonData to jsonDataSum = ", njsonDataSum)
                    jsonData = njsonData; // return jsonData with new jsonData with HeadRefNo 
                    ainitGrid(njsonDataSum);
                    //initGrid(njsonData);
                    //document.getElementById('output').textContent = JSON.stringify(jsonData, null, 2);
                    //initPopup();
                    notify("success", "Excel loaded and JSON generated.", 2000);
                } catch (err) {
                    console.error(err);
                    notify("error", "Failed to load Excel. Check file format or console logs.", 3000);
                }
            });

            function cleanResults(results) {
                return results.filter(item => {
                    const companyValid = item.Company !== undefined && item.Company.trim() !== "";
                    const productValid = !(item.ProductName && item.ProductName.toLowerCase() === "grand total");
                    return companyValid && productValid;
                });
            }

            function addNoteAsText(jsonDataSum = [], jsonData = []) {
                return jsonDataSum.map(sumRecord => {
                    const relatedDetails = jsonData.filter(
                        d => d.CompanyGroup === sumRecord.ERORefNo1 // 👈 match different keys
                    );

                    return {
                        ...sumRecord,
                        Note: JSON.stringify(relatedDetails) // compact JSON text, "[]" if empty
                    };
                });
            }

            // function oSumJson(data) {
            //     const grouped = {};

            //     data.forEach(record => {
            //         const group = record.CompanyGroup;
            //         //const aHRefNo = getUniqueHeadRef("P")
            //         const [d, m, y] = record.DateText.split("/").map(Number);
            //         //grouped[group].DateFrom = new Date(y, m - 1, d);
            //         if (!grouped[group]) {
            //             grouped[group] = {
            //                 //HeadRefNo: getUniqueHeadRef("P"), //aGetDateRef("P"), //getUniqueHeadRef("P") //
            //                 HeadRefNo: getUniqueHeadRef("P"), // delay ensures uniqueness
            //                 REFNO: "",
            //                 ID: 1,
            //                 ERORefNo1: group,
            //                 RefundedAmount: 0, // Advance Amount from Excel (summary)
            //                 ExpGroupCode: "900",
            //                 //Quantity: 0,
            //                 EROAmount1: 0, // limit 300,000
            //                 //DateText: record.DateText, //ERODate02 //DateText
            //                 ERODate02: new Date(y, m - 1, d, 12),//new Date(y, m - 1, d),
            //                 ERODesc05: "", //LOT
            //                 EROAmount2: 0, // Outstanding (Not received yet)
            //                 EROAmount4: 0, // B/F LImit - (O/S + Advance)
            //                 ERODesc01: "",
            //                 ERODesc03: "",
            //                 ERStatus: "Register",
            //                 Department: "",
            //                 EROAmount6: 0,  // Quantity
            //                 Division: asDivision,
            //                 ERODesc06: asStaffEmail,
            //                 ReqDate: new Date(),
            //                 EntryBy: aaUsrN,
            //                 EntryDate: new Date(),
            //                 PBatchNo: aaCARDIDaa,
            //                 PayToCode: asStaffID,
            //                 PayToName: asFullName,
            //                 Department: asDepartment
            //             };
            //         }

            //         // Summaries 
            //         grouped[group].REFNO = grouped[group].HeadRefNo + "-001"; //REFNO: HeadRefNo + "-001"
            //         grouped[group].RefundedAmount += Number(record.ProductCost || 0);
            //         grouped[group].EROAmount6 += Number(record.Quantity || 0); //Quantity
            //         grouped[group].ERODesc01 = baseUrl + grouped[group].HeadRefNo + ".xlsx"; //Pre-Approved Form Links
            //         grouped[group].EROAmount1 = Math.max(grouped[group].EROAmount1, Number(record.CashAdvance || 0));
            //     });

            //     // Finalize description
            //     Object.values(grouped).forEach(group => {
            //         group.ERODesc03 = "Pre-Approve for Flexible Benefits for " + "PRE-REF# " + group.HeadRefNo + ", Group " + group.ERORefNo1; //+ ", Date " + record.DateText;
            //     });

            //     // ✅ Return array directly
            //     return Object.values(grouped);
            // }

            function SumJson(data) { //update to faster
                const grouped = Object.create(null);

                for (let i = 0; i < data.length; i++) {
                    const r = data[i];
                    const group = r.CompanyGroup;

                    if (!grouped[group]) {
                        const [d, m, y] = r.DateText.split("/").map(Number);

                        grouped[group] = {
                            HeadRefNo: getUniqueHeadRef("P"),
                            REFNO: "",
                            ID: 1,
                            ERORefNo1: group,
                            RefundedAmount: 0,
                            ExpGroupCode: "900",
                            EROAmount1: 0,
                            ERODate02: new Date(y, m - 1, d, 12),
                            ERODesc05: "",
                            EROAmount2: 0,
                            EROAmount4: 0,
                            ERODesc01: "",
                            ERODesc03: "",
                            ERStatus: "Register",
                            EROAmount6: 0,
                            Division: asDivision,
                            ERODesc06: asStaffEmail,
                            ReqDate: new Date(),
                            EntryBy: aaUsrN,
                            EntryDate: new Date(),
                            PBatchNo: aaCARDIDaa,
                            PayToCode: asStaffID, // Requester ID
                            PayToName: asFullName, // Requester
                            Vendor02: "",
                            Department: asDepartment,
                            Division: asDivision,
                            Confirmed: false
                        };
                    }

                    const g = grouped[group];
                    g.REFNO = g.HeadRefNo + "-001";
                    g.RefundedAmount += +r.ProductCost || 0;
                    g.EROAmount6 += +r.Quantity || 0;
                    g.ERODesc01 = baseUrl + g.HeadRefNo + ".xlsx";
                    g.EROAmount1 = Math.max(g.EROAmount1, +r.CashAdvance || 0);
                    g.ERODesc03 = "Pre-Approved [" + "PRE-REF#: " + g.HeadRefNo + ", Client Group: " + g.ERORefNo1 + "]";
                }

                return Object.values(grouped);
            }

            // helper: generate sorted randoms
            function getSortedRandoms(count, max) {
                const arr = Array.from({ length: count }, () => Math.floor(Math.random() * max));
                return arr.sort((a, b) => a - b);
            }

            // main function
            function xgetUniqueHeadRef(prefix) {
                // Call your existing function
                let baseRef = aGetDateRef(prefix);

                // Extract last 4 digits
                let numericTail = parseInt(baseRef.slice(-4), 10);

                // Increment normally
                numericTail = (numericTail + 1) % 10000;

                // Add a random boost from sorted randoms
                const randomBoosts = getSortedRandoms(20, 2000); // 5 random numbers up to 50
                const boost = randomBoosts[0]; // take the smallest (always increasing sequence)
                numericTail = (numericTail + boost) % 10000;

                // Replace last 4 digits with new value
                const newRef = baseRef.slice(0, -4) + numericTail.toString().padStart(4, "0");

                return newRef;
            }

            //let lastIssuedRef = null;

            function getUniqueHeadRef(prefix) {

                // Your original time-based generator (unchanged)
                const baseRef = aGetDateRef(prefix);   // YYMMDD + 4 time digits (10 total)

                const head = baseRef.slice(0, -4);    // YYMMDD
                const currentTail = parseInt(baseRef.slice(-4), 10);

                // ✅ First run → accept as-is
                if (!lastIssuedRef) {
                    lastIssuedRef = baseRef;
                    return baseRef;
                }

                const lastHead = lastIssuedRef.slice(0, -4);
                const lastTail = parseInt(lastIssuedRef.slice(-4), 10);

                let newTail;

                // ✅ Same date block → enforce monotonic increase
                if (head === lastHead) {

                    if (currentTail > lastTail) {
                        // ✅ Real time advanced → accept time value
                        newTail = currentTail;
                    } else {
                        // ✅ Time did NOT advance → force +1
                        newTail = lastTail + 1;
                    }

                } else {
                    // ✅ New date → reset naturally by time
                    newTail = currentTail;
                }

                const newRef = head + newTail.toString().padStart(4, "0");
                lastIssuedRef = newRef;
                return newRef;
            }


            /**
             * LinkInsert - enrich detailJson with fields from summaryJson
             * @param {Array} summaryJson - source array (with master data)
             * @param {Array} detailJson - target array (to enrich)
             * @param {String} summaryLinkKey - field name in summaryJson used for matching (e.g. "ERORefNo1")
             * @param {String} detailLinkKey - field name in detailJson used for matching (e.g. "CompanyGroup")
             * @param {Array} fieldsToAdd - list of field names to copy from summaryJson into detailJson
             * @returns {Array} enriched detailJson
             */
            function LinkInsert(summaryJson, detailJson, summaryLinkKey, detailLinkKey, fieldsToAdd) {
                // Build lookup map keyed by summaryLinkKey
                const lookup = {};
                summaryJson.forEach(item => {
                    lookup[item[summaryLinkKey]] = item;
                });

                // Enrich detailJson
                return detailJson.map(record => {
                    const match = lookup[record[detailLinkKey]];
                    if (match) {
                        const enriched = { ...record };
                        fieldsToAdd.forEach(field => {
                            enriched[field] = match[field];
                        });
                        return enriched;
                    }
                    return record; // unchanged if no match
                });
            }

            function xLinkInsert(summaryJson, detailJson) {
                // Build a lookup map from summaryJson keyed by ERORefNo1
                const lookup = {};
                summaryJson.forEach(item => {
                    lookup[item.ERORefNo1] = {
                        HeadRefNo: item.HeadRefNo,
                        REFNO: item.REFNO
                    };
                });

                // Map detailJson and insert HeadRefNo, REFNO if CompanyGroup matches
                return detailJson.map(record => {
                    const match = lookup[record.CompanyGroup];
                    if (match) {
                        return {
                            ...record,
                            HeadRefNo: match.HeadRefNo,
                            REFNO: match.REFNO
                        };
                    }
                    return record; // unchanged if no match
                });
            }

            //------------------------
            //Download JSON
            // document.getElementById('btn-download').addEventListener('click', () => {
            //     if (!jsonData || jsonData.length === 0) {
            //         notify("warning", "No JSON data to download.", 2000);
            //         return;
            //     }
            //     const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json;charset=utf-8" });
            //     saveAs(blob, "export.json");
            // });

            //Show popup
            // document.getElementById('btn-popup').addEventListener('click', () => {
            //     if (!popupInstance) initPopup();
            //     popupInstance.show();
            // });

            //Export grouped Excel: per CompanyGroup, with requested column layout and grand total (from testExcel2JSF.html)   
            // document.getElementById('btn-export-excel').addEventListener('click', async () => {
            //     if (!jsonData || jsonData.length === 0) {
            //         notify("warning", "No data to export.", 2000);
            //         return;
            //     }

            //     const workbook = new ExcelJS.Workbook();
            //     const LIGHT_GREY = { argb: 'FFEFEFEF' };

            //     // Group records by CompanyGroup
            //     const groups = {};
            //     jsonData.forEach(r => {
            //         const groupName = r.CompanyGroup || "Unknown";
            //         if (!groups[groupName]) groups[groupName] = [];
            //         groups[groupName].push(r);
            //     });

            //     Object.keys(groups).forEach(groupNameRaw => {
            //         const sheetName = sanitizeSheetName(groupNameRaw);
            //         const sheet = workbook.addWorksheet(sheetName);

            //         // Titles
            //         const titleRow = sheet.addRow([`# ${groupNameRaw}`]);
            //         titleRow.font = { bold: true, size: 16 };
            //         const subTitleRow = sheet.addRow(["Company Grouped Export"]);
            //         subTitleRow.font = { bold: true };

            //         // Single DateText in A3 (kept from your base)
            //         const firstDate = (groups[groupNameRaw][0] && groups[groupNameRaw][0].DateText) ? groups[groupNameRaw][0].DateText : "";
            //         sheet.getCell('A3').value = firstDate;

            //         // Build per-company buckets
            //         const byCompany = {};
            //         groups[groupNameRaw].forEach(r => {
            //             const companyName = (r.CompanyName || r.Company || "Unknown").trim();
            //             if (!byCompany[companyName]) byCompany[companyName] = [];
            //             const qty = Number(r.Quantity) || 0;
            //             const cost = Number(r["Product Cost"]) || 0;
            //             const price = qty ? (cost / qty) : 0;
            //             byCompany[companyName].push({
            //                 CompanyName: companyName,
            //                 ProductName: r["Product Name"],
            //                 Quantity: qty,
            //                 Price: price,
            //                 ProductCost: cost
            //             });
            //         });

            //         const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));

            //         let colCMaxLen = 12;
            //         let grandQty = 0;
            //         let grandCost = 0;

            //         companies.forEach(companyName => {
            //             // Spacer rows to maintain your layout
            //             while (sheet.rowCount < 17) {
            //                 sheet.addRow([]);
            //             }
            //             sheet.addRow([]);

            //             // Header row (C..H with grey fill)
            //             const headerRow = sheet.addRow(["", "", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"]);
            //             for (let col of [3, 4, 5, 6, 7, 8]) {
            //                 const cell = headerRow.getCell(col);
            //                 cell.font = { bold: true };
            //                 cell.fill = { type: 'pattern', pattern: 'solid', fgColor: LIGHT_GREY };
            //             }

            //             // Data rows: C=สินค้า, D blank, E/F/G/H values
            //             let subtotalQty = 0;
            //             let subtotalCost = 0;

            //             byCompany[companyName].forEach(item => {
            //                 const row = sheet.addRow([
            //                     "", // A
            //                     "", // B
            //                     item.ProductName, // C
            //                     undefined,        // D
            //                     item.Quantity,    // E
            //                     item.Price,       // F
            //                     item.ProductCost, // G
            //                     "Corporate Card"  // H (example payment text)
            //                 ]);
            //                 row.getCell(5).numFmt = "#,##0";
            //                 row.getCell(6).numFmt = "#,##0.00";
            //                 row.getCell(7).numFmt = "#,##0";

            //                 const nameLen = item.ProductName ? String(item.ProductName).length : 0;
            //                 if (nameLen > colCMaxLen) colCMaxLen = nameLen;

            //                 subtotalQty += item.Quantity;
            //                 subtotalCost += item.ProductCost;
            //                 grandQty += item.Quantity;
            //                 grandCost += item.ProductCost;
            //             });

            //             // Subtotal row: label in C; totals in E and G; shaded C..G
            //             const subtotalRow = sheet.addRow(["", "", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""]);
            //             subtotalRow.getCell(3).font = { bold: true };
            //             for (let col of [3, 4, 5, 6, 7]) {
            //                 const cell = subtotalRow.getCell(col);
            //                 cell.fill = { type: 'pattern', pattern: 'solid', fgColor: LIGHT_GREY };
            //             }
            //             subtotalRow.getCell(5).numFmt = "#,##0";
            //             subtotalRow.getCell(7).numFmt = "#,##0";
            //         });

            //         // Grand total row
            //         sheet.addRow([]);
            //         const grandRow = sheet.addRow(["", "", "Grand Total", "", grandQty, "", grandCost, ""]);
            //         grandRow.getCell(3).font = { bold: true };
            //         grandRow.getCell(5).numFmt = "#,##0";
            //         grandRow.getCell(7).numFmt = "#,##0";

            //         // Column widths: C = 12, D = 40; B slender; then remove column B as per your base
            //         sheet.getColumn(2).width = 4;
            //         sheet.getColumn(3).width = 12;
            //         sheet.getColumn(4).width = 40;

            //         sheet.columns.forEach((col, idx) => {
            //             if ([2, 3, 4].includes(idx)) return;
            //             let maxLength = 12;
            //             col.eachCell({ includeEmpty: true }, cell => {
            //                 const val = cell.value != null ? String(cell.value) : "";
            //                 if (val.length > maxLength) maxLength = val.length;
            //             });
            //             col.width = Math.min(maxLength + 2, 60);
            //         });
            //         sheet.getColumn(1).width = 3;
            //         sheet.getColumn(2).width = 10.25;

            //         // Remove column B
            //         sheet.spliceColumns(2, 1);
            //     });

            //     try {
            //         const buffer = await workbook.xlsx.writeBuffer();
            //         saveAs(new Blob([buffer], { type: "application/octet-stream" }), "CompanyGroupedExport.xlsx");
            //         notify("success", "Exported CompanyGroupedExport.xlsx", 2000);
            //     } catch (err) {
            //         console.error(err);
            //         notify("error", "Failed to export Excel.", 3000);
            //     }
            // });

            // NEW: DL Customer Group — loop each group, open template, write into MEMO from row 18, keep MEMO+DATA, download

            document.getElementById('btn-dl-customer').addEventListener('click', async () => {
                if (!jsonData || jsonData.length === 0) {
                    notify("warning", "No data to export.", 2000);
                    return;
                }
                if (!templateBuffer) {
                    notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);
                    return;
                }

                // Group records by CompanyGroup
                const groups = {};
                jsonData.forEach(r => {
                    const groupName = r.CompanyGroup || "Unknown";
                    if (!groups[groupName]) groups[groupName] = [];
                    groups[groupName].push(r);
                });

                const groupNames = Object.keys(groups);
                for (let i = 0; i < groupNames.length; i++) {
                    const groupNameRaw = groupNames[i];
                    const displayName = groupNameRaw || "Unknown";
                    notify("info", `Processing ${displayName} (${i + 1}/${groupNames.length})`, 1500);

                    try {
                        // 1) Open FlexibleTEMP.xlsx
                        const templateWb = new ExcelJS.Workbook();
                        await templateWb.xlsx.load(templateBuffer);

                        const memoSheet = templateWb.getWorksheet("MEMO");
                        const dataSheet = templateWb.getWorksheet("DATA");
                        if (!memoSheet) { notify("error", "Template missing MEMO sheet.", 4000); break; }
                        if (!dataSheet) { notify("error", "Template missing DATA sheet.", 4000); break; }

                        // Optional: set group title somewhere on MEMO (uncomment and adjust as needed)
                        // memoSheet.getCell('B15').value = displayName;

                        // 2) Prepare grouped data by company (same logic)
                        const byCompany = {};
                        groups[groupNameRaw].forEach(r => {
                            const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                            if (!byCompany[companyName]) byCompany[companyName] = [];
                            const qty = Number(r.Quantity) || 0;
                            const cost = Number(r["ProductCost"]) || 0;
                            const price = qty ? (cost / qty) : 0;
                            byCompany[companyName].push({
                                ProductName: r["ProductName"],
                                Quantity: qty,
                                Price: price,
                                ProductCost: cost,
                                DateText: "Corporate Card" //r.DateText
                            });
                        });

                        // 3) Write results into MEMO starting at row 18
                        const LIGHT_GREY = { argb: 'FFEFEFEF' };
                        // Clear previous content from row 18 down (safe reset)
                        const lastRowNumber = memoSheet.lastRow ? memoSheet.lastRow.number : 0;
                        for (let r = 18; r <= lastRowNumber; r++) {
                            memoSheet.getRow(r).values = [];
                            memoSheet.getRow(r).eachCell(c => {
                                c.value = null;
                                c.fill = null;
                                c.font = null;
                                c.border = null;
                            });
                        }

                        let rowIndex = 18;
                        const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));
                        let grandQty = 0;
                        let grandCost = 0;

                        companies.forEach(companyName => {
                            // Spacer row to visually separate companies
                            if (grandQty !== 0) {
                                const spacer = memoSheet.getRow(rowIndex++);
                                spacer.values = ["", "", "", "", "", "", ""];
                            }
                            // Per-company header: Columns C..G shaded
                            const headerRow = memoSheet.getRow(rowIndex++);
                            headerRow.values = ["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];

                            for (let c = 2; c <= 7; c++) {
                                const cell = headerRow.getCell(c);
                                cell.font = { bold: true };
                                cell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: LIGHT_GREY
                                };

                                // Apply alignment based on column
                                if (c === 4 || c === 5 || c === 6) {
                                    // จำนวน, ราคา, จำนวนเงิน → right aligned
                                    cell.alignment = { horizontal: "right" };
                                } else if (c === 7) {
                                    // การชำระเงิน → indent 2
                                    cell.alignment = { indent: 2 };
                                }
                            }


                            // Data rows
                            let subtotalQty = 0;
                            let subtotalCost = 0;
                            byCompany[companyName].forEach(item => {
                                const row = memoSheet.getRow(rowIndex++);
                                //row.values = ["", "", item.ProductName, item.Quantity, item.Price, item.ProductCost, item.DateText];
                                row.values = [
                                    "",                 // A blank
                                    item.ProductName,   // B
                                    undefined,          // C blank
                                    item.Quantity,      // D
                                    item.Price,         // E
                                    item.ProductCost,   // F
                                    item.DateText       // G
                                ];

                                row.getCell(4).numFmt = "#,##0";
                                row.getCell(5).numFmt = "#,##0.00";
                                row.getCell(6).numFmt = "#,##0.00";
                                row.getCell(7).alignment = { indent: 2 };//corpRow.getCell(3).alignment = { indent: 15 }; // shift right 10 times
                                subtotalQty += item.Quantity;
                                subtotalCost += item.ProductCost;
                                grandQty += item.Quantity;
                                grandCost += item.ProductCost;
                            });

                            // Subtotal row: label in C; totals in D and F shaded (C..F)
                            const subtotalRow = memoSheet.getRow(rowIndex++);
                            subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
                            for (let c = 2; c <= 7; c++) {
                                const cell = subtotalRow.getCell(c);
                                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: LIGHT_GREY };
                            }
                            subtotalRow.getCell(2).font = { bold: true };
                            subtotalRow.getCell(4).numFmt = "#,##0";
                            subtotalRow.getCell(6).numFmt = "#,##0.00";
                        });

                        // Grand total row
                        // sheet.addRow([]);
                        // const grandRow = sheet.addRow(["", "Grand Total", "", grandQty, "", grandCost]);
                        // grandRow.getCell(2).font = { bold: true };
                        // grandRow.getCell(4).numFmt = "#,##0";
                        // grandRow.getCell(6).numFmt = "#,##0.00";
                        // Add a spacer row before Grand Total
                        // Add a spacer row before Grand Total
                        // Add a spacer row before Grand Total
                        memoSheet.addRow([]);

                        // Grand Total row
                        const grandRow = memoSheet.addRow([
                            "",             // A
                            "Grand Total",  // B
                            "",             // C blank
                            grandQty,       // D
                            "",             // E blank
                            grandCost,      // F
                            ""              // G blank
                        ]);

                        // Apply light grey fill to B–G
                        for (let c = 2; c <= 7; c++) {
                            const cell = grandRow.getCell(c);
                            cell.font = { bold: true };
                            cell.fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'FFEFEFEF' }
                            };
                        }

                        // Apply border only to the outside of B–G
                        grandRow.getCell(2).border = {               // B left edge
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' }
                        };
                        grandRow.getCell(7).border = {               // G right edge
                            top: { style: 'thin' },
                            right: { style: 'thin' },
                            bottom: { style: 'thin' }
                        };
                        // Top border across all cells B–G
                        for (let c = 3; c <= 6; c++) {
                            grandRow.getCell(c).border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
                        }

                        // Number formats
                        grandRow.getCell(4).numFmt = "#,##0";        // D = Quantity
                        grandRow.getCell(6).numFmt = "#,##0.00";     // F = Cost

                        // Track the row number just after Grand Total
                        let summaryStartRow = memoSheet.lastRow.number + 2; //1

                        // Define formula range start
                        const formulaStartRow = 18; // your data starts at row 18
                        const formulaEndRow = summaryStartRow - 1; // last row before summary

                        // Row 1: Corporate Card
                        const corpRow = memoSheet.getRow(summaryStartRow++);
                        corpRow.getCell(3).value = "Corporate Card"; // Column C
                        corpRow.getCell(3).alignment = { indent: 15 }; // shift right 10 times
                        corpRow.getCell(4).value = {
                            formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Corporate Card",D${formulaStartRow}:D${formulaEndRow})`
                        };
                        corpRow.getCell(6).value = {
                            formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Corporate Card",F${formulaStartRow}:F${formulaEndRow})`
                        };
                        corpRow.getCell(4).numFmt = "#,##0";
                        corpRow.getCell(6).numFmt = "#,##0.00";

                        // Row 2: Personal
                        const personalRow = memoSheet.getRow(summaryStartRow++);
                        personalRow.getCell(3).value = "Personal";
                        personalRow.getCell(3).alignment = { indent: 15 };
                        personalRow.getCell(4).value = {
                            formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Personal",D${formulaStartRow}:D${formulaEndRow})`
                        };
                        personalRow.getCell(6).value = {
                            formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Personal",F${formulaStartRow}:F${formulaEndRow})`
                        };
                        personalRow.getCell(4).numFmt = "#,##0";
                        personalRow.getCell(6).numFmt = "#,##0.00";
                        // ✅ Bottom single border for Personal row (D and F)
                        [4, 6].forEach(col => {
                            personalRow.getCell(col).border = {
                                bottom: { style: 'thin' }
                            };
                        });
                        // Row 3: Total
                        const totalRow = memoSheet.getRow(summaryStartRow++);
                        totalRow.getCell(3).value = "Total";
                        totalRow.getCell(3).alignment = { indent: 15 };
                        totalRow.getCell(3).font = { bold: true };
                        totalRow.getCell(4).value = {
                            formula: `D${summaryStartRow - 3}+D${summaryStartRow - 2}`
                        };
                        totalRow.getCell(6).value = {
                            formula: `F${summaryStartRow - 3}+F${summaryStartRow - 2}`
                        };
                        totalRow.getCell(4).numFmt = "#,##0";
                        totalRow.getCell(6).numFmt = "#,##0.00";
                        // ✅ Bottom double border for Total row (D and F)
                        [4, 6].forEach(col => {
                            totalRow.getCell(col).border = {
                                bottom: { style: 'double' }
                            };
                        });
                        // Row after Total
                        const regardsRow = memoSheet.getRow(summaryStartRow++);
                        regardsRow.getCell(2).value = "Regards,"; // Column B
                        // Row after "Regards,"
                        summaryStartRow = summaryStartRow + 2;
                        const preparedRow = memoSheet.getRow(summaryStartRow++);
                        preparedRow.getCell(2).value = "Prepared by"; // Column B
                        preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" }; // Column C
                        preparedRow.getCell(3).font = { bold: true };
                        preparedRow.getCell(3).border = { bottom: { style: 'thin' } };

                        // Verified by block on same row
                        preparedRow.getCell(5).value = "Approve by"; // Column E
                        preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" }; // Column F
                        preparedRow.getCell(6).font = { bold: true };
                        preparedRow.getCell(6).border = { bottom: { style: 'thin' } };

                        // Merge F and G for Verified by name
                        memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7); // merge F:G
                        // Center the merged cell content
                        const mergedCell = memoSheet.getCell(summaryStartRow - 1, 6); // top-left of merged range
                        //mergedCell.alignment = { horizontal: 'center' };
                        const dateRow = memoSheet.getRow(summaryStartRow++);
                        dateRow.getCell(3).value = { formula: "DATA!E18" }; // Column C
                        dateRow.getCell(6).value = { formula: "DATA!E16" }; // Column F
                        // Spacer row
                        //summaryStartRow++;
                        // Row for DATA!C13 and C14
                        summaryStartRow = summaryStartRow + 2;
                        const verifyRow = memoSheet.getRow(summaryStartRow++);
                        verifyRow.getCell(5).value = { formula: "DATA!C13" }; // Column E
                        verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" }; // Column F
                        verifyRow.getCell(6).font = { bold: true };
                        //verifyRow.getCell(6).border = { bottom: { style: 'thin' } };

                        // Merge F and G again
                        memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7); // merge F:G
                        // Center the merged cell content
                        const amergedCell = memoSheet.getCell(summaryStartRow - 1, 6); // top-left of merged range
                        //amergedCell.alignment = { horizontal: 'center' };
                        const xdateRow = memoSheet.getRow(summaryStartRow++);
                        xdateRow.getCell(6).value = { formula: "DATA!C15" }; // Column F
                        // Stamp values into fixed cells
                        // 1) Put DateText into DATA!E5
                        //    You can take DateText from the first record in this group
                        const firstRecord = groups[groupNameRaw][0];
                        if (firstRecord) {
                            dataSheet.getCell("E5").value = firstRecord.DateText;
                        }

                        // 2) Put CompanyGroup into DATA!C2
                        dataSheet.getCell("C2").value = groupNameRaw;
                        // Optional: column width tuning for MEMO
                        memoSheet.getColumn(1).width = 5;   // A slender
                        memoSheet.getColumn(2).width = 12;   // B slender
                        memoSheet.getColumn(3).width = 35;  // Product Name
                        memoSheet.getColumn(4).width = 8;  // Quantity
                        memoSheet.getColumn(5).width = 12;  // Price
                        memoSheet.getColumn(6).width = 13;  // Product Cost
                        memoSheet.getColumn(7).width = 22;  // DateText

                        // 4) Keep only MEMO and DATA sheets in the new file
                        const keepNames = new Set(["MEMO", "DATA"]);
                        templateWb.worksheets.slice().forEach(ws => {
                            if (!keepNames.has(ws.name)) {
                                templateWb.removeWorksheet(ws.id);
                            }
                        });

                        // 5) Name new Excel file with Customer Group name
                        const safeName = sanitizeFileName(displayName) || "Unknown";
                        const fileName = `${safeName}.xlsx`;
                        // Force MEMO to be the active sheet when opening
                        //templateWb.views = [{ activeTab: memoSheet.id - 1 }];
                        // 6) Download the file
                        if (safeName !== "Unknown") {
                            const outBuffer = await templateWb.xlsx.writeBuffer();
                            // processedWorkbook = new ExcelJS.Workbook();
                            // await processedWorkbook.xlsx.load(await processedFile.arrayBuffer());
                            // alert("OK")
                            // // Upload RPT and View
                            // const uploadedName = await u2pload2File(processedFile);
                            saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), fileName);
                        }
                    } catch (err) {
                        console.error(err);
                        notify("error", `Failed group export for ${displayName}.`, 3000);
                    }
                }

                notify("success", "DL Customer Group completed for all groups.", 2500);
            });

            // Helper: sanitize file name
            function sanitizeFileName(name) {
                return name.replace(/[<>:"/\\|?*]+/g, "_");
            }

            // Helper: write per-company block (header + items + subtotal)
            function writeCompanyBlock(memoSheet, rowIndex, companyName, items) {
                const LIGHT_GREY = { argb: 'FFEFEFEF' };
                let subtotalQty = 0;
                let subtotalCost = 0;

                // Spacer row
                if (rowIndex > 18) {
                    const spacer = memoSheet.getRow(rowIndex++);
                    spacer.values = ["", "", "", "", "", "", ""];
                }

                // Header row
                const headerRow = memoSheet.getRow(rowIndex++);
                headerRow.values = ["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];
                for (let c = 2; c <= 7; c++) {
                    const cell = headerRow.getCell(c);
                    cell.font = { bold: true };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: LIGHT_GREY };
                    if (c === 4 || c === 5 || c === 6) cell.alignment = { horizontal: "right" };
                    if (c === 7) cell.alignment = { indent: 2 };
                }

                // Data rows
                items.forEach(item => {
                    const row = memoSheet.getRow(rowIndex++);
                    row.values = ["", item.ProductName, undefined, item.Quantity, item.Price, item.ProductCost, item.DateText];
                    row.getCell(4).numFmt = "#,##0";
                    row.getCell(5).numFmt = "#,##0.00";
                    row.getCell(6).numFmt = "#,##0.00";
                    row.getCell(7).alignment = { indent: 2 };
                    subtotalQty += item.Quantity;
                    subtotalCost += item.ProductCost;
                });

                // Subtotal row
                const subtotalRow = memoSheet.getRow(rowIndex++);
                subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
                for (let c = 2; c <= 7; c++) {
                    subtotalRow.getCell(c).fill = { type: 'pattern', pattern: 'solid', fgColor: LIGHT_GREY };
                }
                subtotalRow.getCell(2).font = { bold: true };
                subtotalRow.getCell(4).numFmt = "#,##0";
                subtotalRow.getCell(6).numFmt = "#,##0.00";

                return { rowIndex, subtotalQty, subtotalCost };
            }

            // Helper: write grand total
            function writeGrandTotal(memoSheet, grandQty, grandCost) {
                console.log("grand Total")
                memoSheet.addRow([]);
                const grandRow = memoSheet.addRow(["", "Grand Total", "", grandQty, "", grandCost, ""]);
                for (let c = 2; c <= 7; c++) {
                    const cell = grandRow.getCell(c);
                    cell.font = { bold: true };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFEFEF' } };
                }
                grandRow.getCell(4).numFmt = "#,##0";
                grandRow.getCell(6).numFmt = "#,##0.00";

                // Row after Total
                const regardsRow = memoSheet.getRow(summaryStartRow++);
                regardsRow.getCell(2).value = "Regards,"; // Column B
                // Row after "Regards,"
                summaryStartRow = summaryStartRow + 2;
                const preparedRow = memoSheet.getRow(summaryStartRow++);
                preparedRow.getCell(2).value = "Prepared by"; // Column B
                preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" }; // Column C
                preparedRow.getCell(3).font = { bold: true };
                preparedRow.getCell(3).border = { bottom: { style: 'thin' } };

                // Verified by block on same row
                preparedRow.getCell(5).value = "Verified by"; // Column E
                preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" }; // Column F
                preparedRow.getCell(6).font = { bold: true };
                preparedRow.getCell(6).border = { bottom: { style: 'thin' } };

                // Merge F and G for Verified by name
                memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7); // merge F:G
                // Center the merged cell content
                const mergedCell = memoSheet.getCell(summaryStartRow - 1, 6); // top-left of merged range
                //mergedCell.alignment = { horizontal: 'center' };
                const dateRow = memoSheet.getRow(summaryStartRow++);
                dateRow.getCell(3).value = { formula: "DATA!E18" }; // Column C
                dateRow.getCell(6).value = { formula: "DATA!E16" }; // Column F
                // Spacer row
                //summaryStartRow++;
                // Row for DATA!C13 and C14
                summaryStartRow = summaryStartRow + 2;
                const verifyRow = memoSheet.getRow(summaryStartRow++);
                verifyRow.getCell(5).value = { formula: "DATA!C13" }; // Column E
                verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" }; // Column F
                verifyRow.getCell(6).font = { bold: true };
                //verifyRow.getCell(6).border = { bottom: { style: 'thin' } };

                // Merge F and G again
                memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7); // merge F:G
                // Center the merged cell content
                const amergedCell = memoSheet.getCell(summaryStartRow - 1, 6); // top-left of merged range
                //amergedCell.alignment = { horizontal: 'center' };
                const xdateRow = memoSheet.getRow(summaryStartRow++);
                xdateRow.getCell(6).value = { formula: "DATA!C15" }; // Column F
                return memoSheet.lastRow.number;
            }

            // Main function
            // async function downloadCustomerGroup() { //not used
            //     if (!jsonData || jsonData.length === 0) {
            //         notify("warning", "No data to export.", 2000);
            //         return;
            //     }
            //     console.log("new function", jsonData)
            //     if (!templateBuffer) {
            //         notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);
            //         return;
            //     }

            //     // Group records by CompanyGroup
            //     const groups = {};
            //     jsonData.forEach(r => {
            //         const groupName = r.CompanyGroup || "Unknown";
            //         if (!groups[groupName]) groups[groupName] = [];
            //         groups[groupName].push(r);
            //     });

            //     const groupNames = Object.keys(groups);
            //     for (let i = 0; i < groupNames.length; i++) {
            //         const groupNameRaw = groupNames[i];
            //         const displayName = groupNameRaw || "Unknown";
            //         notify("info", `Processing ${displayName} (${i + 1}/${groupNames.length})`, 1500);

            //         try {
            //             const templateWb = new ExcelJS.Workbook();
            //             await templateWb.xlsx.load(templateBuffer);

            //             const memoSheet = templateWb.getWorksheet("MEMO");
            //             const dataSheet = templateWb.getWorksheet("DATA");
            //             if (!memoSheet || !dataSheet) {
            //                 notify("error", "Template missing MEMO or DATA sheet.", 4000);
            //                 break;
            //             }

            //             // Prepare grouped data by company
            //             const byCompany = {};
            //             groups[groupNameRaw].forEach(r => {
            //                 const companyName = (r.CompanyName || r.Company || "Unknown").trim();
            //                 if (!byCompany[companyName]) byCompany[companyName] = [];
            //                 const qty = Number(r.Quantity) || 0;
            //                 const cost = Number(r["ProductCost"]) || 0;
            //                 const price = qty ? (cost / qty) : 0;
            //                 byCompany[companyName].push({
            //                     ProductName: r["ProductName"],
            //                     Quantity: qty,
            //                     Price: price,
            //                     ProductCost: cost,
            //                     DateText: "Corporate Card"
            //                 });
            //             });

            //             // Clear old rows
            //             const lastRowNumber = memoSheet.lastRow ? memoSheet.lastRow.number : 0;
            //             for (let r = 18; r <= lastRowNumber; r++) {
            //                 memoSheet.getRow(r).values = [];
            //             }

            //             // Write company blocks
            //             let rowIndex = 18;
            //             let grandQty = 0;
            //             let grandCost = 0;
            //             const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));
            //             companies.forEach(companyName => {
            //                 const result = writeCompanyBlock(memoSheet, rowIndex, companyName, byCompany[companyName]);
            //                 rowIndex = result.rowIndex;
            //                 grandQty += result.subtotalQty;
            //                 grandCost += result.subtotalCost;
            //             });
            //             console.log(grandQty, grandQty)
            //             // Grand total // footer
            //             const summaryStartRow = writeGrandTotal(memoSheet, grandQty, grandCost) + 2;

            //             // Put DateText and CompanyGroup into DATA sheet
            //             const firstRecord = groups[groupNameRaw][0];
            //             if (firstRecord) dataSheet.getCell("E5").value = firstRecord.DateText;
            //             dataSheet.getCell("C2").value = groupNameRaw;

            //             // Keep only MEMO and DATA sheets
            //             const keepNames = new Set(["MEMO", "DATA"]);
            //             templateWb.worksheets.slice().forEach(ws => {
            //                 if (!keepNames.has(ws.name)) templateWb.removeWorksheet(ws.id);
            //             });

            //             // Save file
            //             const safeName = sanitizeFileName(displayName) || "Unknown";
            //             if (safeName !== "Unknown") {
            //                 const outBuffer = await templateWb.xlsx.writeBuffer();
            //                 saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), `${safeName}.xlsx`);
            //             }
            //         } catch (err) {
            //             console.error(err);
            //             notify("error", `Failed group export for ${displayName}.`, 3000);
            //         }
            //     }

            //     notify("success", "DL Customer Group completed for all groups.", 2500);
            // }

            function combineGroupsToJsonData(jsonData, jsonDataSum) {
                // สร้าง lookup จาก jsonDataSum โดยใช้ CompanyGroup (ERORefNo1)
                const summaryLookup = jsonDataSum.reduce((acc, sumRecord) => {
                    const key = sumRecord.ERORefNo1 || "Unknown";
                    acc[key] = {
                        ERODesc05: sumRecord.ERODesc05,
                        EROAmount2: sumRecord.EROAmount2
                    };
                    return acc;
                }, {});

                // map jsonData กลับ โดยเพิ่ม field จาก summaryLookup
                const merged = jsonData.map(record => {
                    const groupName = record.CompanyGroup || "Unknown";
                    const summary = summaryLookup[groupName] || {};
                    return {
                        ...record,
                        ...summary // 👈 เพิ่ม ERODesc05, EROAmount2 เข้าไปในแต่ละ record
                    };
                });

                return merged;
            }

            const olddownloadCustomerGrp = async () => { // all Customer Groups
                if (!lLoadTemp) return notify("error", "Please load Excel Template before.", 4000);
                if (!jsonData?.length) return notify("warning", "No data to export.", 2000);
                if (!templateBuffer) return notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);
                console.log(njsonDataSum)
                jsonData = combineGroupsToJsonData(jsonData, njsonDataSum)
                console.log(jsonData)
                // Group records by CompanyGroup
                const groups = jsonData.reduce((acc, r) => {
                    const groupName = r.CompanyGroup || "Unknown";
                    (acc[groupName] ||= []).push(r);
                    return acc;
                }, {});

                const groupNames = Object.keys(groups);

                for (let i = 0; i < groupNames.length; i++) {
                    const groupNameRaw = groupNames[i];
                    const displayName = groupNameRaw || "Unknown";
                    notify("info", `Processing ${displayName} (${i + 1}/${groupNames.length})`, 1500);

                    try {
                        // Load template workbook
                        const templateWb = new ExcelJS.Workbook();
                        await templateWb.xlsx.load(templateBuffer);

                        const memoSheet = templateWb.getWorksheet("MEMO");
                        const dataSheet = templateWb.getWorksheet("DATA");
                        if (!memoSheet || !dataSheet) {
                            notify("error", "Template missing MEMO or DATA sheet.", 4000);
                            break;
                        }

                        // Prepare grouped data by company
                        const byCompany = groups[groupNameRaw].reduce((acc, r) => {
                            const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                            const qty = Number(r.Quantity) || 0;
                            const cost = Number(r.ProductCost) || 0;
                            const price = qty ? cost / qty : 0;
                            (acc[companyName] ||= []).push({
                                ProductName: r.ProductName,
                                Quantity: qty,
                                Price: price,
                                ProductCost: cost,
                                DateText: "Corporate Card" // keep as original
                            });
                            return acc;
                        }, {});

                        // Clear previous content from row 18 down
                        const LIGHT_GREY = { argb: "FFEFEFEF" };
                        for (let r = 18; r <= (memoSheet.lastRow?.number || 0); r++) {
                            const row = memoSheet.getRow(r);
                            row.eachCell(c => { c.value = null; c.fill = null; c.font = null; c.border = null; });
                            row.values = [];
                        }

                        let rowIndex = 18;
                        let grandQty = 0;
                        let grandCost = 0;
                        const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));

                        companies.forEach(companyName => {
                            // Spacer row between companies
                            if (grandQty !== 0) memoSheet.getRow(rowIndex++).values = ["", "", "", "", "", "", ""];

                            // Header row C..G shaded
                            const headerRow = memoSheet.getRow(rowIndex++);
                            headerRow.values = ["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];
                            for (let c = 2; c <= 7; c++) {
                                const cell = headerRow.getCell(c);
                                cell.font = { bold: true };
                                cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                                if ([4, 5, 6].includes(c)) cell.alignment = { horizontal: "right" };
                                if (c === 7) cell.alignment = { indent: 2 };
                            }

                            // Data rows
                            let subtotalQty = 0;
                            let subtotalCost = 0;
                            byCompany[companyName].forEach(item => {
                                const row = memoSheet.getRow(rowIndex++);
                                row.values = ["", item.ProductName, undefined, item.Quantity, item.Price, item.ProductCost, item.DateText];
                                row.getCell(4).numFmt = "#,##0";
                                row.getCell(5).numFmt = "#,##0.00";
                                row.getCell(6).numFmt = "#,##0.00";
                                row.getCell(7).alignment = { indent: 2 };
                                subtotalQty += item.Quantity;
                                subtotalCost += item.ProductCost;
                                grandQty += item.Quantity;
                                grandCost += item.ProductCost;
                            });

                            // Subtotal row
                            const subtotalRow = memoSheet.getRow(rowIndex++);
                            subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
                            for (let c = 2; c <= 7; c++) {
                                subtotalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                            }
                            subtotalRow.getCell(2).font = { bold: true };
                            subtotalRow.getCell(4).numFmt = "#,##0";
                            subtotalRow.getCell(6).numFmt = "#,##0.00";
                        });

                        // Grand total section
                        memoSheet.addRow([]);
                        const grandRow = memoSheet.addRow(["", "Grand Total", "", grandQty, "", grandCost, ""]);
                        for (let c = 2; c <= 7; c++) {
                            const cell = grandRow.getCell(c);
                            cell.font = { bold: true };
                            cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                        }
                        grandRow.getCell(2).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" } };
                        grandRow.getCell(7).border = { top: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };
                        for (let c = 3; c <= 6; c++) {
                            grandRow.getCell(c).border = { top: { style: "thin" }, bottom: { style: "thin" } };
                        }
                        grandRow.getCell(4).numFmt = "#,##0";
                        grandRow.getCell(6).numFmt = "#,##0.00";

                        // Summary block (Corporate/Personal/Total) + Regards + Prepared/Verified + Dates + Verify row
                        let summaryStartRow = memoSheet.lastRow.number + 2;
                        const formulaStartRow = 18;
                        const formulaEndRow = summaryStartRow - 1;

                        // Corporate Card Sub total
                        const corpRow = memoSheet.getRow(summaryStartRow++);
                        corpRow.getCell(3).value = "Corporate Card";
                        corpRow.getCell(3).alignment = { indent: 15 };
                        corpRow.getCell(4).value = { formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Corporate Card",D${formulaStartRow}:D${formulaEndRow})` };
                        corpRow.getCell(6).value = { formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Corporate Card",F${formulaStartRow}:F${formulaEndRow})` };
                        corpRow.getCell(4).numFmt = "#,##0";
                        corpRow.getCell(6).numFmt = "#,##0.00";

                        // Personal Sub Total
                        const personalRow = memoSheet.getRow(summaryStartRow++);
                        personalRow.getCell(3).value = "Personal";
                        personalRow.getCell(3).alignment = { indent: 15 };
                        personalRow.getCell(4).value = { formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Personal",D${formulaStartRow}:D${formulaEndRow})` };
                        personalRow.getCell(6).value = { formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Personal",F${formulaStartRow}:F${formulaEndRow})` };
                        personalRow.getCell(4).numFmt = "#,##0";
                        personalRow.getCell(6).numFmt = "#,##0.00";
                        [4, 6].forEach(col => { personalRow.getCell(col).border = { bottom: { style: "thin" } }; });

                        // Total Sub Total
                        const totalRow = memoSheet.getRow(summaryStartRow++);
                        totalRow.getCell(3).value = "Total";
                        totalRow.getCell(3).alignment = { indent: 15 };
                        totalRow.getCell(3).font = { bold: true };
                        totalRow.getCell(4).value = { formula: `D${summaryStartRow - 3}+D${summaryStartRow - 2}` };
                        totalRow.getCell(6).value = { formula: `F${summaryStartRow - 3}+F${summaryStartRow - 2}` };
                        totalRow.getCell(4).numFmt = "#,##0";
                        totalRow.getCell(6).numFmt = "#,##0.00";
                        [4, 6].forEach(col => { totalRow.getCell(col).border = { bottom: { style: "double" } }; });

                        // Regards,
                        const regardsRow = memoSheet.getRow(summaryStartRow++);
                        regardsRow.getCell(2).value = "Regards,";

                        // Two spacer rows
                        summaryStartRow += 2;

                        // Prepared by / Verified by
                        const preparedRow = memoSheet.getRow(summaryStartRow++);
                        preparedRow.getCell(2).value = "Prepared by";
                        preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" };
                        preparedRow.getCell(3).font = { bold: true };
                        preparedRow.getCell(3).border = { bottom: { style: "thin" } };

                        preparedRow.getCell(5).value = "Approved by"; //Verified by
                        preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" };
                        preparedRow.getCell(6).font = { bold: true };
                        preparedRow.getCell(6).border = { bottom: { style: "thin" } };

                        // Merge F:G for Verified by name
                        memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                        // Dates row
                        const dateRow = memoSheet.getRow(summaryStartRow++);
                        dateRow.getCell(3).value = { formula: "DATA!E18" };
                        dateRow.getCell(6).value = { formula: "DATA!E16" };

                        // Two spacer rows
                        summaryStartRow += 2;

                        // Verify label + name row
                        const verifyRow = memoSheet.getRow(summaryStartRow++);
                        verifyRow.getCell(5).value = { formula: "DATA!C13" };
                        verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" };
                        verifyRow.getCell(6).font = { bold: true };

                        // Merge F:G again
                        memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                        // Extra date
                        const xdateRow = memoSheet.getRow(summaryStartRow++);
                        xdateRow.getCell(6).value = { formula: "DATA!C15" };

                        // Stamp values into DATA sheet (after summary block as requested)
                        const firstRecord = groups[groupNameRaw][0];
                        const dlRefNO = firstRecord.HeadRefNo; //C1
                        const aLotNO = firstRecord.ERODesc05;  //E6
                        const aOSAmt = firstRecord.EROAmount2; //C4
                        const aLimitAmt = firstRecord.CashAdvance; //C7
                        if (firstRecord) dataSheet.getCell("E5").value = firstRecord.DateText;
                        dataSheet.getCell("C2").value = groupNameRaw;
                        dataSheet.getCell("C1").value = dlRefNO; //firstRecord.HeadRefNo;
                        dataSheet.getCell("C4").value = aOSAmt;
                        dataSheet.getCell("C7").value = aLimitAmt;
                        dataSheet.getCell("E6").value = aLotNO;
                        //const dlfilename = firstRecord.HeadRefNo 
                        // Column widths
                        [5, 12, 35, 8, 12, 13, 22].forEach((w, i) => memoSheet.getColumn(i + 1).width = w);

                        // Keep only MEMO and DATA sheets
                        templateWb.worksheets.slice().forEach(ws => {
                            if (!["MEMO", "DATA"].includes(ws.name)) templateWb.removeWorksheet(ws.id);
                        });

                        // Save file
                        //const safeName = sanitizeFileName(displayName) || "Unknown";
                        const safeName = dlRefNO || "Unknown";
                        if (safeName !== "Unknown") {
                            const outBuffer = await templateWb.xlsx.writeBuffer();
                            //saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), `${safeName}.xlsx`);
                            //save to database one by one 
                            //const outBuffer = await templateWb.xlsx.writeBuffer();
                            const outFile = new File(
                                [outBuffer],
                                `${safeName}.xlsx`,
                                { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                            );

                            const uploadedName = await u2pload2File(outFile);
                        }
                    } catch (err) {
                        console.error(err);
                        notify("error", `Failed group export for ${displayName}.`, 3000);
                    }
                }

                notify("success", "DL Customer Group completed for all groups.", 2500);
            };

            const oldULbCustomerGrp = async (customerGroupName) => { //by Custome Group
                if (!lLoadTemp) return notify("error", "Please load Excel Template before.", 4000);
                if (!jsonData?.length) return notify("warning", "No data to export.", 2000);
                if (!templateBuffer) return notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);

                console.log(njsonDataSum);
                jsonData = combineGroupsToJsonData(jsonData, njsonDataSum);
                console.log(jsonData);

                // Group records by CompanyGroup
                const groups = jsonData.reduce((acc, r) => {
                    const groupName = r.CompanyGroup || "Unknown";
                    (acc[groupName] ||= []).push(r);
                    return acc;
                }, {});

                // Use only the requested customer group
                const groupNameRaw = customerGroupName;
                const displayName = groupNameRaw || "Unknown";
                const groupRecords = groups[groupNameRaw];

                if (!groupRecords || !groupRecords.length) {
                    return notify("warning", `No records found for ${displayName}`, 2000);
                }

                notify("info", `Processing ${displayName}`, 1500);

                try {
                    // Load template workbook
                    const templateWb = new ExcelJS.Workbook();
                    await templateWb.xlsx.load(templateBuffer);

                    const memoSheet = templateWb.getWorksheet("MEMO");
                    const dataSheet = templateWb.getWorksheet("DATA");
                    if (!memoSheet || !dataSheet) {
                        notify("error", "Template missing MEMO or DATA sheet.", 4000);
                        return;
                    }

                    // Prepare grouped data by company (using only the selected group)
                    const byCompany = groupRecords.reduce((acc, r) => {
                        const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                        const qty = Number(r.Quantity) || 0;
                        const cost = Number(r.ProductCost) || 0;
                        const price = qty ? cost / qty : 0;
                        (acc[companyName] ||= []).push({
                            ProductName: r.ProductName,
                            Quantity: qty,
                            Price: price,
                            ProductCost: cost,
                            DateText: "Corporate Card" // keep as original
                        });
                        return acc;
                    }, {});

                    // Clear previous content from row 18 down
                    const LIGHT_GREY = { argb: "FFEFEFEF" };
                    for (let r = 18; r <= (memoSheet.lastRow?.number || 0); r++) {
                        const row = memoSheet.getRow(r);
                        row.eachCell(c => { c.value = null; c.fill = null; c.font = null; c.border = null; });
                        row.values = [];
                    }

                    let rowIndex = 18;
                    let grandQty = 0;
                    let grandCost = 0;
                    const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));

                    companies.forEach(companyName => {
                        // Spacer row between companies
                        if (grandQty !== 0) memoSheet.getRow(rowIndex++).values = ["", "", "", "", "", "", ""];

                        // Header row C..G shaded
                        const headerRow = memoSheet.getRow(rowIndex++);
                        headerRow.values = ["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];
                        for (let c = 2; c <= 7; c++) {
                            const cell = headerRow.getCell(c);
                            cell.font = { bold: true };
                            cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                            if ([4, 5, 6].includes(c)) cell.alignment = { horizontal: "right" };
                            if (c === 7) cell.alignment = { indent: 2 };
                        }

                        // Data rows
                        let subtotalQty = 0;
                        let subtotalCost = 0;
                        byCompany[companyName].forEach(item => {
                            const row = memoSheet.getRow(rowIndex++);
                            row.values = ["", item.ProductName, undefined, item.Quantity, item.Price, item.ProductCost, item.DateText];
                            row.getCell(4).numFmt = "#,##0";
                            row.getCell(5).numFmt = "#,##0.00";
                            row.getCell(6).numFmt = "#,##0.00";
                            row.getCell(7).alignment = { indent: 2 };
                            subtotalQty += item.Quantity;
                            subtotalCost += item.ProductCost;
                            grandQty += item.Quantity;
                            grandCost += item.ProductCost;
                        });

                        // Subtotal row
                        const subtotalRow = memoSheet.getRow(rowIndex++);
                        subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
                        for (let c = 2; c <= 7; c++) {
                            subtotalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                        }
                        subtotalRow.getCell(2).font = { bold: true };
                        subtotalRow.getCell(4).numFmt = "#,##0";
                        subtotalRow.getCell(6).numFmt = "#,##0.00";
                    });

                    // Grand total section
                    memoSheet.addRow([]);
                    const grandRow = memoSheet.addRow(["", "Grand Total", "", grandQty, "", grandCost, ""]);
                    for (let c = 2; c <= 7; c++) {
                        const cell = grandRow.getCell(c);
                        cell.font = { bold: true };
                        cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                    }
                    grandRow.getCell(2).border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" } };
                    grandRow.getCell(7).border = { top: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };
                    for (let c = 3; c <= 6; c++) {
                        grandRow.getCell(c).border = { top: { style: "thin" }, bottom: { style: "thin" } };
                    }
                    grandRow.getCell(4).numFmt = "#,##0";
                    grandRow.getCell(6).numFmt = "#,##0.00";

                    // Summary block (Corporate/Personal/Total) + Regards + Prepared/Verified + Dates + Verify row
                    let summaryStartRow = memoSheet.lastRow.number + 2;
                    const formulaStartRow = 18;
                    const formulaEndRow = summaryStartRow - 1;

                    // Corporate Card Sub total
                    const corpRow = memoSheet.getRow(summaryStartRow++);
                    corpRow.getCell(3).value = "Corporate Card";
                    corpRow.getCell(3).alignment = { indent: 15 };
                    corpRow.getCell(4).value = { formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Corporate Card",D${formulaStartRow}:D${formulaEndRow})` };
                    corpRow.getCell(6).value = { formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Corporate Card",F${formulaStartRow}:F${formulaEndRow})` };
                    corpRow.getCell(4).numFmt = "#,##0";
                    corpRow.getCell(6).numFmt = "#,##0.00";

                    // Personal Sub Total
                    const personalRow = memoSheet.getRow(summaryStartRow++);
                    personalRow.getCell(3).value = "Personal";
                    personalRow.getCell(3).alignment = { indent: 15 };
                    personalRow.getCell(4).value = { formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Personal",D${formulaStartRow}:D${formulaEndRow})` };
                    personalRow.getCell(6).value = { formula: `SUMIF(G${formulaStartRow}:G${formulaEndRow},"Personal",F${formulaStartRow}:F${formulaEndRow})` };
                    personalRow.getCell(4).numFmt = "#,##0";
                    personalRow.getCell(6).numFmt = "#,##0.00";
                    [4, 6].forEach(col => { personalRow.getCell(col).border = { bottom: { style: "thin" } }; });

                    // Total Sub Total
                    const totalRow = memoSheet.getRow(summaryStartRow++);
                    totalRow.getCell(3).value = "Total";
                    totalRow.getCell(3).alignment = { indent: 15 };
                    totalRow.getCell(3).font = { bold: true };
                    totalRow.getCell(4).value = { formula: `D${summaryStartRow - 3}+D${summaryStartRow - 2}` };
                    totalRow.getCell(6).value = { formula: `F${summaryStartRow - 3}+F${summaryStartRow - 2}` };
                    totalRow.getCell(4).numFmt = "#,##0";
                    totalRow.getCell(6).numFmt = "#,##0.00";
                    [4, 6].forEach(col => { totalRow.getCell(col).border = { bottom: { style: "double" } }; });

                    // Regards,
                    const regardsRow = memoSheet.getRow(summaryStartRow++);
                    regardsRow.getCell(2).value = "Regards,";

                    // Two spacer rows
                    summaryStartRow += 2;

                    // Prepared by / Verified by
                    const preparedRow = memoSheet.getRow(summaryStartRow++);
                    preparedRow.getCell(2).value = "Prepared by";
                    preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" };
                    preparedRow.getCell(3).font = { bold: true };
                    preparedRow.getCell(3).border = { bottom: { style: "thin" } };

                    preparedRow.getCell(5).value = "Approved by"; //Verified by
                    preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" };
                    preparedRow.getCell(6).font = { bold: true };
                    preparedRow.getCell(6).border = { bottom: { style: "thin" } };

                    // Merge F:G for Verified by name
                    memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                    // Dates row
                    const dateRow = memoSheet.getRow(summaryStartRow++);
                    dateRow.getCell(3).value = { formula: "DATA!E18" };
                    dateRow.getCell(6).value = { formula: "DATA!E16" };

                    // Two spacer rows
                    summaryStartRow += 2;

                    // Verify label + name row
                    const verifyRow = memoSheet.getRow(summaryStartRow++);
                    verifyRow.getCell(5).value = { formula: "DATA!C13" };
                    verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" };
                    verifyRow.getCell(6).font = { bold: true };

                    // Merge F:G again
                    memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                    // Extra date
                    const xdateRow = memoSheet.getRow(summaryStartRow++);
                    xdateRow.getCell(6).value = { formula: "DATA!C15" };

                    // Stamp values into DATA sheet (using selected group)
                    const firstRecord = groupRecords[0];
                    const dlRefNO = firstRecord.HeadRefNo; //C1
                    const aLotNO = firstRecord.ERODesc05;  //E6
                    const aOSAmt = firstRecord.EROAmount2; //C4
                    const aLimitAmt = firstRecord.CashAdvance; //C7
                    if (firstRecord) dataSheet.getCell("E5").value = firstRecord.DateText;
                    dataSheet.getCell("C2").value = groupNameRaw;
                    dataSheet.getCell("C1").value = dlRefNO;
                    dataSheet.getCell("C4").value = aOSAmt;
                    dataSheet.getCell("C7").value = aLimitAmt;
                    dataSheet.getCell("E6").value = aLotNO;

                    // Column widths
                    [5, 12, 35, 8, 12, 13, 22].forEach((w, i) => memoSheet.getColumn(i + 1).width = w);

                    // Keep only MEMO and DATA sheets
                    templateWb.worksheets.slice().forEach(ws => {
                        if (!["MEMO", "DATA"].includes(ws.name)) templateWb.removeWorksheet(ws.id);
                    });

                    // Save one file for the selected group
                    const safeName = "TemporaryX"//dlRefNO || "Unknown";
                    if (safeName !== "Unknown") {
                        const outBuffer = await templateWb.xlsx.writeBuffer();
                        const outFile = new File(
                            [outBuffer],
                            `${safeName}.xlsx`,
                            { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                        );
                        const uploadedName = await u2pload2File(outFile);
                        if (uploadedName) {
                            viewUploadedFile(uploadedName);

                        }
                    }

                    notify("success", `DL Customer Group completed for ${displayName}.`, 2500);
                } catch (err) {
                    console.error(err);
                    notify("error", `Failed group export for ${displayName}.`, 3000);
                }
            };

            const downloadCustomerGrp = async () => {
                if (!lLoadTemp) return notify("error", "Please load Excel Template before.", 4000);
                if (!njsonDataSum?.length) return notify("warning", "No data to export.", 2000);
                if (!templateBuffer) return notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);

                console.log(njsonDataSum);

                for (let i = 0; i < njsonDataSum.length; i++) {
                    const groupRecord = njsonDataSum[i];
                    const displayName = groupRecord.ERORefNo1 || "Unknown";
                    let lOverLimit = (groupRecord.RefundedAmount > groupRecord.EROAmount1);
                    notify("info", `Processing ${displayName} (${i + 1}/${njsonDataSum.length})`, 1500);

                    try {
                        // Load template workbook
                        const templateWb = new ExcelJS.Workbook();
                        await templateWb.xlsx.load(templateBuffer);

                        const memoSheet = templateWb.getWorksheet("MEMO");
                        const dataSheet = templateWb.getWorksheet("DATA");
                        if (!memoSheet || !dataSheet) {
                            notify("error", "Template missing MEMO or DATA sheet.", 4000);
                            break;
                        }

                        // Parse Note JSON
                        let noteItems = [];
                        try {
                            noteItems = JSON.parse(groupRecord.Note || "[]");

                        } catch (err) {
                            console.error("Invalid Note JSON", err);
                            continue;
                        }
                        const bFCorpC = noteItems.some(item => item.PayBy === PayByList[0].PayType);
                        const bFCorpC2 = noteItems.some(item => item.PayBy === PayByList[1].PayType);
                        const bFPers = noteItems.some(item => item.PayBy === PayByList[2].PayType);

                        // Group by CompanyName inside Note
                        const byCompany = noteItems.reduce((acc, r) => {
                            const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                            const qty = Number(r.Quantity) || 0;
                            const cost = Number(r.ProductCost) || 0;
                            const price = qty ? cost / qty : 0;
                            (acc[companyName] ||= []).push({
                                ProductName: r.ProductName,
                                Quantity: qty,
                                Price: price,
                                ProductCost: cost,
                                DateText: r.PayBy || "Unknown"   // ใช้ PayBy จาก Note
                            });
                            return acc;
                        }, {});

                        // Clear previous content from row 18 down
                        const LIGHT_GREY = { argb: "FFEFEFEF" };
                        for (let r = 18; r <= (memoSheet.lastRow?.number || 0); r++) {
                            const row = memoSheet.getRow(r);
                            row.eachCell(c => { c.value = null; c.fill = null; c.font = null; c.border = null; });
                            row.values = [];
                        }

                        let rowIndex = 18;
                        let grandQty = 0;
                        let grandCost = 0;
                        const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));

                        companies.forEach(companyName => {
                            if (grandQty !== 0) memoSheet.getRow(rowIndex++).values = ["", "", "", "", "", "", ""];

                            const headerRow = memoSheet.getRow(rowIndex++);
                            headerRow.values = ["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];
                            for (let c = 2; c <= 7; c++) {
                                const cell = headerRow.getCell(c);
                                cell.font = { bold: true };
                                cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                                if ([4, 5, 6].includes(c)) cell.alignment = { horizontal: "right" };
                                if (c === 7) cell.alignment = { indent: 2 };
                            }

                            let subtotalQty = 0;
                            let subtotalCost = 0;
                            byCompany[companyName].forEach(item => {
                                const row = memoSheet.getRow(rowIndex++);
                                row.values = ["", item.ProductName, undefined, item.Quantity, item.Price, item.ProductCost, item.DateText];
                                row.getCell(4).numFmt = "#,##0";
                                row.getCell(5).numFmt = "#,##0.00";
                                row.getCell(6).numFmt = "#,##0.00";
                                row.getCell(7).alignment = { indent: 2 };
                                subtotalQty += item.Quantity;
                                subtotalCost += item.ProductCost;
                                grandQty += item.Quantity;
                                grandCost += item.ProductCost;
                            });

                            const subtotalRow = memoSheet.getRow(rowIndex++);
                            subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
                            for (let c = 2; c <= 7; c++) {
                                subtotalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                            }
                            subtotalRow.getCell(2).font = { bold: true };
                            subtotalRow.getCell(4).numFmt = "#,##0";
                            subtotalRow.getCell(6).numFmt = "#,##0.00";
                        });

                        memoSheet.addRow([]);
                        const grandRow = memoSheet.addRow(["", "Grand Total", "", grandQty, "", grandCost, ""]);
                        for (let c = 2; c <= 7; c++) {
                            const cell = grandRow.getCell(c);
                            cell.font = { bold: true };
                            cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                        }
                        grandRow.getCell(4).numFmt = "#,##0";
                        grandRow.getCell(6).numFmt = "#,##0.00";

                        // --- Summary block (เหมือนเดิม) ---
                        // summary block (Corporate/Personal/Total)
                        // หาจุดเริ่มต้นของสูตรแบบ dynamic
                        // สมมติว่าข้อมูลเริ่มหลัง header 1 แถว → ใช้ row 2
                        // หรือคุณสามารถกำหนดเป็น row แรกของข้อมูลจริงได้
                        // Anchor ของส่วน summary (วางหลังข้อมูลจริง 2 แถว)
                        let summaryStartRow = memoSheet.lastRow.number + 2;

                        // แถวแรกของสรุป (ใช้เป็นจุดเริ่มต้นช่วง SUM ของ Total)
                        const firstSummaryRow = summaryStartRow;

                        // นับจำนวน summary items ที่ถูกสร้าง (Corp/Corp2/Personal)
                        let summaryItemCount = 0;

                        // Corporate Card
                        if (bFCorpC) {
                            const corpRow = memoSheet.getRow(summaryStartRow++);
                            summaryItemCount++;

                            corpRow.getCell(3).value = PayByList[0].PayType;
                            corpRow.getCell(3).alignment = { indent: 15 };

                            // SUMIF จากข้อมูลดิบ เพื่อได้ค่ายอดรวมตาม PayType
                            corpRow.getCell(4).value = {
                                formula: `SUMIF(G:G,"Corporate Card",D:D)`
                            };
                            corpRow.getCell(6).value = {
                                formula: `SUMIF(G:G,"Corporate Card",F:F)`
                            };

                            corpRow.getCell(4).numFmt = "#,##0";
                            corpRow.getCell(6).numFmt = "#,##0.00";

                            if (!bFPers && !bFCorpC2) {
                                [4, 6].forEach(col => { corpRow.getCell(col).border = { bottom: { style: "thin" } }; });
                            }
                        }

                        // Corporate Card 2
                        if (bFCorpC2) {
                            const corp2Row = memoSheet.getRow(summaryStartRow++);
                            summaryItemCount++;

                            corp2Row.getCell(3).value = PayByList[1].PayType;
                            corp2Row.getCell(3).alignment = { indent: 15 };

                            corp2Row.getCell(4).value = {
                                formula: `SUMIF(G:G,"Corporate Card 2",D:D)`
                            };
                            corp2Row.getCell(6).value = {
                                formula: `SUMIF(G:G,"Corporate Card 2",F:F)`
                            };

                            corp2Row.getCell(4).numFmt = "#,##0";
                            corp2Row.getCell(6).numFmt = "#,##0.00";

                            if (!bFPers && !bFCorpC) {
                                [4, 6].forEach(col => { corp2Row.getCell(col).border = { bottom: { style: "thin" } }; });
                            }
                        }

                        // Personal
                        if (bFPers) {
                            const personalRow = memoSheet.getRow(summaryStartRow++);
                            summaryItemCount++;

                            personalRow.getCell(3).value = PayByList[2].PayType;
                            personalRow.getCell(3).alignment = { indent: 15 };

                            personalRow.getCell(4).value = {
                                formula: `SUMIF(G:G,"Personal",D:D)`
                            };
                            personalRow.getCell(6).value = {
                                formula: `SUMIF(G:G,"Personal",F:F)`
                            };

                            personalRow.getCell(4).numFmt = "#,##0";
                            personalRow.getCell(6).numFmt = "#,##0.00";

                            [4, 6].forEach(col => { personalRow.getCell(col).border = { bottom: { style: "thin" } }; });
                        }

                        // Total Row
                        const totalRow = memoSheet.getRow(summaryStartRow++);
                        totalRow.getCell(3).value = "Total";
                        totalRow.getCell(3).alignment = { indent: 15 };
                        totalRow.getCell(3).font = { bold: true };

                        // ถ้ามีอย่างน้อย 1 item → SUM ช่วงแถวสรุปที่สร้างขึ้น
                        if (summaryItemCount > 0) {
                            totalRow.getCell(4).value = {
                                formula: `SUM(D${firstSummaryRow}:D${totalRow.number - 1})`
                            };
                            totalRow.getCell(6).value = {
                                formula: `SUM(F${firstSummaryRow}:F${totalRow.number - 1})`
                            };
                        } else {
                            // ไม่มี item ใดถูกสร้าง → ให้ Total เป็น 0 เพื่อกัน error/วงเล็บว่าง
                            totalRow.getCell(4).value = 0;
                            totalRow.getCell(6).value = 0;
                        }

                        totalRow.getCell(4).numFmt = "#,##0";
                        totalRow.getCell(6).numFmt = "#,##0.00";

                        // เส้น double border สำหรับ Total
                        [4, 6].forEach(col => {
                            totalRow.getCell(col).border = { bottom: { style: "double" } };
                        });

                        // regards + prepared/approved + dates + verify rows
                        const regardsRow = memoSheet.getRow(summaryStartRow++);
                        regardsRow.getCell(2).value = "Regards,";

                        summaryStartRow += 2;

                        const preparedRow = memoSheet.getRow(summaryStartRow++);
                        preparedRow.getCell(2).value = "Prepared by";
                        preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" };
                        preparedRow.getCell(3).font = { bold: true };
                        preparedRow.getCell(3).border = { bottom: { style: "thin" } };

                        preparedRow.getCell(5).value = "Approved by";
                        preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" };
                        preparedRow.getCell(6).font = { bold: true };
                        preparedRow.getCell(6).border = { bottom: { style: "thin" } };

                        memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                        const dateRow = memoSheet.getRow(summaryStartRow++);
                        dateRow.getCell(3).value = { formula: "DATA!E18" };
                        dateRow.getCell(6).value = { formula: "DATA!E16" };

                        if (lOverLimit) {
                            summaryStartRow += 2;

                            const verifyRow = memoSheet.getRow(summaryStartRow++);
                            //verifyRow.getCell(5).value = { formula: "DATA!C13" };
                            verifyRow.getCell(5).value = "Approved by";
                            verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" };
                            verifyRow.getCell(6).font = { bold: true };
                            verifyRow.getCell(6).border = { bottom: { style: "thin" } };

                            memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                            const xdateRow = memoSheet.getRow(summaryStartRow++);
                            xdateRow.getCell(6).value = { formula: "DATA!C15" };
                        }

                        // Stamp DATA sheet from njsonDataSum fields
                        dataSheet.getCell("C1").value = groupRecord.HeadRefNo;    // PRE REF#
                        dataSheet.getCell("C2").value = groupRecord.ERORefNo1;    // Company Group
                        dataSheet.getCell("C4").value = groupRecord.EROAmount2;   // Outstanding
                        dataSheet.getCell("C6").value = groupRecord.RefundedAmount; // Cash Advance
                        dataSheet.getCell("E5").value = groupRecord.ERODate02;    // Period
                        dataSheet.getCell("E6").value = groupRecord.ERODesc05;    // LOT
                        dataSheet.getCell("C7").value = groupRecord.EROAmount1;   // Limit C8

                        [5, 12, 35, 8, 12, 13, 22].forEach((w, i) => memoSheet.getColumn(i + 1).width = w);

                        templateWb.worksheets.slice().forEach(ws => {
                            if (!["MEMO", "DATA"].includes(ws.name)) templateWb.removeWorksheet(ws.id);
                        });

                        const safeName = groupRecord.HeadRefNo || "Unknown";
                        if (safeName !== "Unknown") {
                            const outBuffer = await templateWb.xlsx.writeBuffer();
                            const outFile = new File(
                                [outBuffer],
                                `${safeName}.xlsx`,
                                { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                            );
                            const uploadedName = await u2pload2File(outFile);
                        }
                    } catch (err) {
                        console.error(err);
                        notify("error", `Failed group export for ${displayName}.`, 3000);
                    }
                }

                notify("success", "DL Customer Group completed for all groups.", 2500);
            };

            // Generate Excel file for ONE selected customer group using njsonDataSum and Note (PayBy)

            const ULbCustomerGrp = async (customerGroupName) => {
                if (!lLoadTemp) return notify("error", "Please load Excel Template before.", 4000);
                if (!njsonDataSum?.length) return notify("warning", "No data to export.", 2000);
                if (!templateBuffer) return notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);

                console.log(njsonDataSum);
                const today = new Date();
                // 👉 แบบใส่วันที่+เวลา (dd/MM/yyyy HH:mm:ss)
                const formattedDateTime = today.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                    //hour: "2-digit",
                    //minute: "2-digit",
                    //second: "2-digit"
                });
                // Find the selected group record from njsonDataSum
                const groupRecord = njsonDataSum.find(r => r.ERORefNo1 === customerGroupName);
                if (!groupRecord) {
                    return notify("warning", `No records found for ${customerGroupName}`, 2000);
                }
                let lOverLimit = (groupRecord.RefundedAmount > groupRecord.EROAmount1);
                notify("info", `Processing ${customerGroupName}`, 1500);

                try {
                    // Load template workbook
                    const templateWb = new ExcelJS.Workbook();
                    await templateWb.xlsx.load(templateBuffer);

                    const memoSheet = templateWb.getWorksheet("MEMO");
                    const dataSheet = templateWb.getWorksheet("DATA");
                    if (!memoSheet || !dataSheet) {
                        notify("error", "Template missing MEMO or DATA sheet.", 4000);
                        return;
                    }

                    // Parse Note JSON for the selected group
                    let noteItems = [];
                    try {
                        noteItems = JSON.parse(groupRecord.Note || "[]");
                    } catch (err) {
                        console.error("Invalid Note JSON", err);
                        notify("warning", `Skip ${customerGroupName}: invalid Note JSON.`, 2000);
                        return;
                    }
                    const bFCorpC = noteItems.some(item => item.PayBy === PayByList[0].PayType);
                    const bFCorpC2 = noteItems.some(item => item.PayBy === PayByList[1].PayType);
                    const bFPers = noteItems.some(item => item.PayBy === PayByList[2].PayType);

                    // Group items by company inside Note
                    const byCompany = noteItems.reduce((acc, r) => {
                        const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                        const qty = Number(r.Quantity) || 0;
                        const cost = Number(r.ProductCost) || 0;
                        const price = qty ? cost / qty : 0;
                        (acc[companyName] ||= []).push({
                            ProductName: r.ProductName,
                            Quantity: qty,
                            Price: price,
                            ProductCost: cost,
                            DateText: r.PayBy || "Unknown"
                        });
                        return acc;
                    }, {});

                    // Clear previous content from row 18 down
                    const LIGHT_GREY = { argb: "FFEFEFEF" };
                    for (let r = 18; r <= (memoSheet.lastRow?.number || 0); r++) {
                        const row = memoSheet.getRow(r);
                        row.eachCell(c => { c.value = null; c.fill = null; c.font = null; c.border = null; });
                        row.values = [];
                    }

                    let rowIndex = 18;
                    let grandQty = 0;
                    let grandCost = 0;
                    const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));

                    companies.forEach(companyName => {
                        // spacer
                        if (grandQty !== 0) memoSheet.getRow(rowIndex++).values = ["", "", "", "", "", "", ""];

                        // header
                        const headerRow = memoSheet.getRow(rowIndex++);
                        headerRow.values = ["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];
                        for (let c = 2; c <= 7; c++) {
                            const cell = headerRow.getCell(c);
                            cell.font = { bold: true };
                            cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                            if ([4, 5, 6].includes(c)) cell.alignment = { horizontal: "right" };
                            if (c === 7) cell.alignment = { indent: 2 };
                        }

                        // data
                        let subtotalQty = 0;
                        let subtotalCost = 0;
                        byCompany[companyName].forEach(item => {
                            const row = memoSheet.getRow(rowIndex++);
                            row.values = ["", item.ProductName, undefined, item.Quantity, item.Price, item.ProductCost, item.DateText];
                            row.getCell(4).numFmt = "#,##0";
                            row.getCell(5).numFmt = "#,##0.00";
                            row.getCell(6).numFmt = "#,##0.00";
                            row.getCell(7).alignment = { indent: 2 };
                            subtotalQty += item.Quantity;
                            subtotalCost += item.ProductCost;
                            grandQty += item.Quantity;
                            grandCost += item.ProductCost;
                        });

                        // subtotal
                        const subtotalRow = memoSheet.getRow(rowIndex++);
                        subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
                        for (let c = 2; c <= 7; c++) {
                            subtotalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                        }
                        subtotalRow.getCell(2).font = { bold: true };
                        subtotalRow.getCell(4).numFmt = "#,##0";
                        subtotalRow.getCell(6).numFmt = "#,##0.00";
                    });

                    // grand total
                    memoSheet.addRow([]);
                    const grandRow = memoSheet.addRow(["", "Grand Total", "", grandQty, "", grandCost, ""]);
                    for (let c = 2; c <= 7; c++) {
                        const cell = grandRow.getCell(c);
                        cell.font = { bold: true };
                        cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                    }
                    grandRow.getCell(4).numFmt = "#,##0";
                    grandRow.getCell(6).numFmt = "#,##0.00";

                    // summary block (Corporate/Personal/Total)
                    // หาจุดเริ่มต้นของสูตรแบบ dynamic
                    // สมมติว่าข้อมูลเริ่มหลัง header 1 แถว → ใช้ row 2
                    // หรือคุณสามารถกำหนดเป็น row แรกของข้อมูลจริงได้
                    // Anchor ของส่วน summary (วางหลังข้อมูลจริง 2 แถว)
                    let summaryStartRow = memoSheet.lastRow.number + 2;

                    // แถวแรกของสรุป (ใช้เป็นจุดเริ่มต้นช่วง SUM ของ Total)
                    const firstSummaryRow = summaryStartRow;

                    // นับจำนวน summary items ที่ถูกสร้าง (Corp/Corp2/Personal)
                    let summaryItemCount = 0;

                    // Corporate Card
                    if (bFCorpC) {
                        const corpRow = memoSheet.getRow(summaryStartRow++);
                        summaryItemCount++;

                        corpRow.getCell(3).value = PayByList[0].PayType;
                        corpRow.getCell(3).alignment = { indent: 15 };

                        // SUMIF จากข้อมูลดิบ เพื่อได้ค่ายอดรวมตาม PayType
                        corpRow.getCell(4).value = {
                            formula: `SUMIF(G:G,"Corporate Card",D:D)`
                        };
                        corpRow.getCell(6).value = {
                            formula: `SUMIF(G:G,"Corporate Card",F:F)`
                        };

                        corpRow.getCell(4).numFmt = "#,##0";
                        corpRow.getCell(6).numFmt = "#,##0.00";

                        if (!bFPers && !bFCorpC2) {
                            [4, 6].forEach(col => { corpRow.getCell(col).border = { bottom: { style: "thin" } }; });
                        }
                    }

                    // Corporate Card 2
                    if (bFCorpC2) {
                        const corp2Row = memoSheet.getRow(summaryStartRow++);
                        summaryItemCount++;

                        corp2Row.getCell(3).value = PayByList[1].PayType;
                        corp2Row.getCell(3).alignment = { indent: 15 };

                        corp2Row.getCell(4).value = {
                            formula: `SUMIF(G:G,"Corporate Card 2",D:D)`
                        };
                        corp2Row.getCell(6).value = {
                            formula: `SUMIF(G:G,"Corporate Card 2",F:F)`
                        };

                        corp2Row.getCell(4).numFmt = "#,##0";
                        corp2Row.getCell(6).numFmt = "#,##0.00";

                        if (!bFPers && !bFCorpC) {
                            [4, 6].forEach(col => { corp2Row.getCell(col).border = { bottom: { style: "thin" } }; });
                        }
                    }

                    // Personal
                    if (bFPers) {
                        const personalRow = memoSheet.getRow(summaryStartRow++);
                        summaryItemCount++;

                        personalRow.getCell(3).value = PayByList[2].PayType;
                        personalRow.getCell(3).alignment = { indent: 15 };

                        personalRow.getCell(4).value = {
                            formula: `SUMIF(G:G,"Personal",D:D)`
                        };
                        personalRow.getCell(6).value = {
                            formula: `SUMIF(G:G,"Personal",F:F)`
                        };

                        personalRow.getCell(4).numFmt = "#,##0";
                        personalRow.getCell(6).numFmt = "#,##0.00";

                        [4, 6].forEach(col => { personalRow.getCell(col).border = { bottom: { style: "thin" } }; });
                    }

                    // Total Row
                    const totalRow = memoSheet.getRow(summaryStartRow++);
                    totalRow.getCell(3).value = "Total";
                    totalRow.getCell(3).alignment = { indent: 15 };
                    totalRow.getCell(3).font = { bold: true };

                    // ถ้ามีอย่างน้อย 1 item → SUM ช่วงแถวสรุปที่สร้างขึ้น
                    if (summaryItemCount > 0) {
                        totalRow.getCell(4).value = {
                            formula: `SUM(D${firstSummaryRow}:D${totalRow.number - 1})`
                        };
                        totalRow.getCell(6).value = {
                            formula: `SUM(F${firstSummaryRow}:F${totalRow.number - 1})`
                        };
                    } else {
                        // ไม่มี item ใดถูกสร้าง → ให้ Total เป็น 0 เพื่อกัน error/วงเล็บว่าง
                        totalRow.getCell(4).value = 0;
                        totalRow.getCell(6).value = 0;
                    }

                    totalRow.getCell(4).numFmt = "#,##0";
                    totalRow.getCell(6).numFmt = "#,##0.00";

                    // เส้น double border สำหรับ Total
                    [4, 6].forEach(col => {
                        totalRow.getCell(col).border = { bottom: { style: "double" } };
                    });

                    // regards + prepared/approved + dates + verify rows

                    const regardsRow = memoSheet.getRow(summaryStartRow++);
                    regardsRow.getCell(2).value = "Regards,";

                    summaryStartRow += 2;

                    const preparedRow = memoSheet.getRow(summaryStartRow++);
                    preparedRow.getCell(2).value = "Prepared by";
                    preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" };
                    preparedRow.getCell(3).font = { bold: true };
                    preparedRow.getCell(3).border = { bottom: { style: "thin" } };

                    preparedRow.getCell(5).value = "Approved by";
                    preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" };
                    preparedRow.getCell(6).font = { bold: true };
                    preparedRow.getCell(6).border = { bottom: { style: "thin" } };

                    memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                    const dateRow = memoSheet.getRow(summaryStartRow++);
                    dateRow.getCell(3).value = { formula: "DATA!E18" };
                    dateRow.getCell(6).value = { formula: "DATA!E16" };
                    //alert("OverLimit")
                    //alert(lOverLimit)
                    if (lOverLimit) {
                        summaryStartRow += 2;

                        const verifyRow = memoSheet.getRow(summaryStartRow++);
                        //verifyRow.getCell(5).value = { formula: "DATA!C13" };
                        verifyRow.getCell(5).value = "Approved by";
                        verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" };
                        verifyRow.getCell(6).font = { bold: true };
                        verifyRow.getCell(6).border = { bottom: { style: "thin" } };

                        memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                        const xdateRow = memoSheet.getRow(summaryStartRow++);
                        xdateRow.getCell(6).value = { formula: "DATA!C15" };
                    }

                    // Stamp DATA sheet from njsonDataSum fields
                    dataSheet.getCell("C1").value = groupRecord.HeadRefNo;    // PRE REF#
                    dataSheet.getCell("C2").value = groupRecord.ERORefNo1;    // Company Group
                    dataSheet.getCell("C4").value = groupRecord.EROAmount2;   // Outstanding
                    dataSheet.getCell("C7").value = groupRecord.RefundedAmount; // Cash Advance
                    dataSheet.getCell("E5").value = groupRecord.ERODate02;    // Period
                    dataSheet.getCell("E6").value = groupRecord.ERODesc05;    // LOT
                    dataSheet.getCell("C7").value = groupRecord.EROAmount1;   // Limit C8
                    if (groupRecord.Confirmed === true) {
                        dataSheet.getCell("C18").value = groupRecord.PayToName;   // Requester
                        dataSheet.getCell("D18").value = formattedDateTime;   // Requester Date
                    }
                    // Column widths
                    [5, 12, 35, 8, 12, 13, 22].forEach((w, i) => memoSheet.getColumn(i + 1).width = w);

                    // Keep only MEMO & DATA sheets
                    templateWb.worksheets.slice().forEach(ws => {
                        if (!["MEMO", "DATA"].includes(ws.name)) templateWb.removeWorksheet(ws.id);
                    });

                    // Save for selected group using HeadRefNo
                    //const safeName = groupRecord.HeadRefNo || "Unknown";
                    const safeName = "PREAPPTEMP" || "Unknown";
                    if (safeName !== "Unknown") {
                        const outBuffer = await templateWb.xlsx.writeBuffer();
                        const outFile = new File(
                            [outBuffer],
                            `${safeName}.xlsx`,
                            { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                        );
                        const uploadedName = await u2pload2File(outFile);
                        if (uploadedName && typeof viewUploadedFile === "function") {
                            viewUploadedFile(uploadedName);
                        }
                    }

                    notify("success", `DL Customer Group completed for ${customerGroupName}.`, 2500);
                } catch (err) {
                    console.error(err);
                    notify("error", `Failed group export for ${customerGroupName}.`, 3000);
                }
            };


            const xULbCustomerGrp = async (customerGroupName) => {
                if (!lLoadTemp) return notify("error", "Please load Excel Template before.", 4000);
                if (!jsonData?.length) return notify("warning", "No data to export.", 2000);
                if (!templateBuffer) return notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);

                // Helpers
                function parseNote(note) {
                    if (!note) return [];
                    if (Array.isArray(note)) return note;
                    if (typeof note === "string") {
                        try {
                            const parsed = JSON.parse(note);
                            return Array.isArray(parsed) ? parsed : [parsed];
                        } catch {
                            return [];
                        }
                    }
                    if (typeof note === "object") return [note];
                    return [];
                }

                function buildPayByMap(noteArray) {
                    const map = new Map();
                    for (const e of noteArray) {
                        const pn = (e?.ProductName || "").trim();
                        const payBy = (e?.PayBy || "").trim();
                        if (pn) map.set(pn, payBy || "Corporate Card");
                    }
                    return map;
                }


                jsonData = combineGroupsToJsonData(jsonData, njsonDataSum);

                // Group records by CompanyGroup
                const groups = jsonData.reduce((acc, r) => {
                    const groupName = r.CompanyGroup || "Unknown";
                    (acc[groupName] ||= []).push(r);
                    return acc;
                }, {});

                const groupNameRaw = customerGroupName;
                const displayName = groupNameRaw || "Unknown";
                const groupRecords = groups[groupNameRaw];

                if (!groupRecords || !groupRecords.length) {
                    return notify("warning", `No records found for ${displayName}`, 2000);
                }

                notify("info", `Processing ${displayName}`, 1500);

                try {
                    const templateWb = new ExcelJS.Workbook();
                    await templateWb.xlsx.load(templateBuffer);

                    const memoSheet = templateWb.getWorksheet("MEMO");
                    const dataSheet = templateWb.getWorksheet("DATA");
                    if (!memoSheet || !dataSheet) {
                        notify("error", "Template missing MEMO or DATA sheet.", 4000);
                        return;
                    }

                    // Step 3.1: หา summaryRow จาก njsonDataSum
                    const summaryRow = njsonDataSum.find(
                        s => String(s?.ERORefNo1 || "").trim() === String(groupNameRaw).trim()
                    );
                    alert("Step 3.1: summaryRow=" + JSON.stringify(summaryRow, null, 2));

                    const noteArray = parseNote(summaryRow?.note || "[]");
                    alert("Step 3.2: noteArray=" + JSON.stringify(noteArray, null, 2));

                    const payByMap = buildPayByMap(noteArray);
                    alert("Step 3.2: payByMap=" + JSON.stringify(Object.fromEntries(payByMap), null, 2));

                    // Prepare grouped data by company
                    const byCompany = groupRecords.reduce((acc, r) => {
                        const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                        const qty = Number(r.Quantity) || 0;
                        const cost = Number(r.ProductCost) || 0;
                        const price = qty ? cost / qty : 0;

                        // Step 3.2: ใช้ ProductName หา PayBy
                        const payBy = payByMap.get((r.ProductName || "").trim()) || "Corporate Card";
                        alert("Step 3.2: Product=" + r.ProductName + " → PayBy=" + payBy);

                        (acc[companyName] ||= []).push({
                            ProductName: r.ProductName,
                            Quantity: qty,
                            Price: price,
                            ProductCost: cost,
                            DateText: payBy
                        });
                        return acc;
                    }, {});

                    // ... ส่วน generate Excel ต่อไป unchanged ...

                    notify("success", `DL Customer Group completed for ${displayName}.`, 2500);
                } catch (err) {
                    console.error(err);
                    const reason = err?.message || JSON.stringify(err);
                    notify("error", `Failed group export for ${displayName}. Reason: ${reason}`, 5000);
                    alert(`Error while processing ${displayName}:\n${reason}`);
                }
            };

            const xdownloadCustomerGrp = async () => { // all Customer Groups
                if (!lLoadTemp) return notify("error", "Please load Excel Template before.", 4000);
                if (!jsonData?.length) return notify("warning", "No data to export.", 2000);
                if (!templateBuffer) return notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);

                // --- Helpers for note/PayBy ---
                function parseNote(note) {
                    if (!note) return [];
                    if (Array.isArray(note)) return note;
                    if (typeof note === "string") {
                        try {
                            const parsed = JSON.parse(note);
                            return Array.isArray(parsed) ? parsed : [parsed];
                        } catch {
                            return [];
                        }
                    }
                    if (typeof note === "object") return [note];
                    return [];
                }

                function buildPayByMap(noteArray) {
                    const map = new Map();
                    for (const e of noteArray) {
                        const pn = (e?.ProductName || "").trim();
                        const payBy = (e?.PayBy || "").trim();
                        if (pn) map.set(pn, payBy || "Corporate Card");
                    }
                    return map;
                }
                // -------------------------------

                console.log(njsonDataSum);
                jsonData = combineGroupsToJsonData(jsonData, njsonDataSum);
                console.log(jsonData);

                // Group records by CompanyGroup
                const groups = jsonData.reduce((acc, r) => {
                    const groupName = r.CompanyGroup || "Unknown";
                    (acc[groupName] ||= []).push(r);
                    return acc;
                }, {});

                const groupNames = Object.keys(groups);

                for (let i = 0; i < groupNames.length; i++) {
                    const groupNameRaw = groupNames[i];
                    const displayName = groupNameRaw || "Unknown";
                    notify("info", `Processing ${displayName} (${i + 1}/${groupNames.length})`, 1500);

                    try {
                        // Load template workbook
                        const templateWb = new ExcelJS.Workbook();
                        await templateWb.xlsx.load(templateBuffer);

                        const memoSheet = templateWb.getWorksheet("MEMO");
                        const dataSheet = templateWb.getWorksheet("DATA");
                        if (!memoSheet || !dataSheet) {
                            notify("error", "Template missing MEMO or DATA sheet.", 4000);
                            break;
                        }

                        // --- NEW: build PayBy map from njsonDataSum.note ---
                        const summaryRow = njsonDataSum.find(
                            s => String(s?.ERORefNo1 || "").trim() === String(groupNameRaw).trim()
                        );
                        const noteArray = parseNote(summaryRow?.note);
                        const payByMap = buildPayByMap(noteArray);
                        // ---------------------------------------------------

                        // Prepare grouped data by company
                        const byCompany = groups[groupNameRaw].reduce((acc, r) => {
                            const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                            const qty = Number(r.Quantity) || 0;
                            const cost = Number(r.ProductCost) || 0;
                            const price = qty ? cost / qty : 0;

                            // Lookup PayBy by ProductName; fallback to Corporate Card
                            const payBy = payByMap.get((r.ProductName || "").trim()) || "Corporate Card";

                            (acc[companyName] ||= []).push({
                                ProductName: r.ProductName,
                                Quantity: qty,
                                Price: price,
                                ProductCost: cost,
                                DateText: payBy // 👈 now dynamic from note.PayBy
                            });
                            return acc;
                        }, {});

                        // --- everything else in your function remains unchanged ---
                        // Clear previous content from row 18 down
                        const LIGHT_GREY = { argb: "FFEFEFEF" };
                        for (let r = 18; r <= (memoSheet.lastRow?.number || 0); r++) {
                            const row = memoSheet.getRow(r);
                            row.eachCell(c => { c.value = null; c.fill = null; c.font = null; c.border = null; });
                            row.values = [];
                        }

                        let rowIndex = 18;
                        let grandQty = 0;
                        let grandCost = 0;
                        const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));

                        companies.forEach(companyName => {
                            if (grandQty !== 0) memoSheet.getRow(rowIndex++).values = ["", "", "", "", "", "", ""];

                            const headerRow = memoSheet.getRow(rowIndex++);
                            headerRow.values = ["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];
                            for (let c = 2; c <= 7; c++) {
                                const cell = headerRow.getCell(c);
                                cell.font = { bold: true };
                                cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                                if ([4, 5, 6].includes(c)) cell.alignment = { horizontal: "right" };
                                if (c === 7) cell.alignment = { indent: 2 };
                            }

                            let subtotalQty = 0;
                            let subtotalCost = 0;
                            byCompany[companyName].forEach(item => {
                                const row = memoSheet.getRow(rowIndex++);
                                row.values = ["", item.ProductName, undefined, item.Quantity, item.Price, item.ProductCost, item.DateText];
                                row.getCell(4).numFmt = "#,##0";
                                row.getCell(5).numFmt = "#,##0.00";
                                row.getCell(6).numFmt = "#,##0.00";
                                row.getCell(7).alignment = { indent: 2 };
                                subtotalQty += item.Quantity;
                                subtotalCost += item.ProductCost;
                                grandQty += item.Quantity;
                                grandCost += item.ProductCost;
                            });

                            const subtotalRow = memoSheet.getRow(rowIndex++);
                            subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
                            for (let c = 2; c <= 7; c++) {
                                subtotalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                            }
                            subtotalRow.getCell(2).font = { bold: true };
                            subtotalRow.getCell(4).numFmt = "#,##0";
                            subtotalRow.getCell(6).numFmt = "#,##0.00";
                        });

                        // ... (rest of your Excel writing logic unchanged) ...

                        notify("success", "DL Customer Group completed for all groups.", 2500);
                    } catch (err) {
                        console.error(err);
                        notify("error", `Failed group export for ${displayName}.`, 3000);
                    }
                }
            };

            const xxULbCustomerGrp = async (customerGroupName) => { // by Customer Group
                if (!lLoadTemp) return notify("error", "Please load Excel Template before.", 4000);
                if (!jsonData?.length) return notify("warning", "No data to export.", 2000);
                if (!templateBuffer) return notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);

                // --- Helpers for note/PayBy ---
                function parseNote(note) {
                    if (!note) return [];
                    if (Array.isArray(note)) return note;
                    if (typeof note === "string") {
                        try {
                            const parsed = JSON.parse(note);
                            return Array.isArray(parsed) ? parsed : [parsed];
                        } catch {
                            return [];
                        }
                    }
                    if (typeof note === "object") return [note];
                    return [];
                }

                function buildPayByMap(noteArray) {
                    const map = new Map();
                    for (const e of noteArray) {
                        const pn = (e?.ProductName || "").trim();
                        const payBy = (e?.PayBy || "").trim();
                        if (pn) map.set(pn, payBy || "Corporate Card");
                    }
                    return map;
                }
                // -------------------------------

                console.log(">>> njsonDataSum:", njsonDataSum);
                alert("njsonDataSum:\n" + JSON.stringify(njsonDataSum, null, 2));

                jsonData = combineGroupsToJsonData(jsonData, njsonDataSum);
                console.log(">>> jsonData after combine:", jsonData);
                alert("jsonData:\n" + JSON.stringify(jsonData, null, 2));

                // Group records by CompanyGroup
                const groups = jsonData.reduce((acc, r) => {
                    const groupName = r.CompanyGroup || "Unknown";
                    (acc[groupName] ||= []).push(r);
                    return acc;
                }, {});

                const groupNameRaw = customerGroupName;
                const displayName = groupNameRaw || "Unknown";
                const groupRecords = groups[groupNameRaw];

                if (!groupRecords || !groupRecords.length) {
                    return notify("warning", `No records found for ${displayName}`, 2000);
                }

                notify("info", `Processing ${displayName}`, 1500);

                try {
                    const templateWb = new ExcelJS.Workbook();
                    await templateWb.xlsx.load(templateBuffer);

                    const memoSheet = templateWb.getWorksheet("MEMO");
                    const dataSheet = templateWb.getWorksheet("DATA");
                    if (!memoSheet || !dataSheet) {
                        notify("error", "Template missing MEMO or DATA sheet.", 4000);
                        return;
                    }

                    // --- Build PayBy map with fallback ---
                    let summaryRow = njsonDataSum.find(
                        s => String(s?.ERORefNo1 || "").trim() === String(groupNameRaw).trim()
                    );

                    if (!summaryRow) {
                        summaryRow = njsonDataSum.find(
                            s => String(s?.CompanyGroup || "").trim() === String(groupNameRaw).trim()
                        );
                    }

                    if (!summaryRow) {
                        alert("❌ summaryRow not found for groupNameRaw=" + groupNameRaw);
                    } else {
                        alert("✅ summaryRow found:\n" + JSON.stringify(summaryRow, null, 2));
                    }

                    alert("Raw note value:\n" + (summaryRow?.note ?? "undefined"));

                    const noteArray = parseNote(summaryRow?.note || "[]");
                    alert("Parsed noteArray (" + noteArray.length + " items):\n" + JSON.stringify(noteArray, null, 2));

                    const payByMap = buildPayByMap(noteArray);
                    alert("payByMap (" + payByMap.size + " entries):\n" + JSON.stringify(Object.fromEntries(payByMap), null, 2));
                    // ---------------------------------------------------

                    const byCompany = groupRecords.reduce((acc, r) => {
                        const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                        const qty = Number(r.Quantity) || 0;
                        const cost = Number(r.ProductCost) || 0;
                        const price = qty ? cost / qty : 0;

                        const payBy = payByMap.get((r.ProductName || "").trim()) || "Corporate Card";

                        (acc[companyName] ||= []).push({
                            ProductName: r.ProductName,
                            Quantity: qty,
                            Price: price,
                            ProductCost: cost,
                            DateText: payBy
                        });

                        // Debug each row
                        console.log(">>> Row item:", r.ProductName, "PayBy:", payBy);
                        alert(`Row Product: ${r.ProductName}\nPayBy: ${payBy}`);

                        return acc;
                    }, {});

                    // ... rest of your Excel writing logic unchanged ...

                    notify("success", `DL Customer Group completed for ${displayName}.`, 2500);
                } catch (err) {
                    console.error(err);
                    const reason = err?.message || JSON.stringify(err);
                    notify("error", `Failed group export for ${displayName}. Reason: ${reason}`, 5000);
                    alert(`Error while processing ${displayName}:\n${reason}`);
                }
            };

            const uploadCustomerGrp = async () => {
                if (!lLoadTemp) return notify("error", "Please load Excel Template before.", 4000);
                if (!jsonData?.length) return notify("warning", "No data to export.", 2000);
                if (!templateBuffer) return notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);

                console.log(njsonDataSum);
                jsonData = combineGroupsToJsonData(jsonData, njsonDataSum);
                console.log(jsonData);

                // Group records by CompanyGroup
                const groups = jsonData.reduce((acc, r) => {
                    const groupName = r.CompanyGroup || "Unknown";
                    (acc[groupName] ||= []).push(r);
                    return acc;
                }, {});

                const groupNames = Object.keys(groups);

                for (let i = 0; i < groupNames.length; i++) {
                    const groupNameRaw = groupNames[i];
                    const displayName = groupNameRaw || "Unknown";
                    notify("info", `Processing ${displayName} (${i + 1}/${groupNames.length})`, 1500);

                    try {
                        // Load template workbook
                        const templateWb = new ExcelJS.Workbook();
                        await templateWb.xlsx.load(templateBuffer);

                        const memoSheet = templateWb.getWorksheet("MEMO");
                        const dataSheet = templateWb.getWorksheet("DATA");
                        if (!memoSheet || !dataSheet) {
                            notify("error", "Template missing MEMO or DATA sheet.", 4000);
                            break;
                        }

                        // Prepare grouped data by company
                        const byCompany = groups[groupNameRaw].reduce((acc, r) => {
                            const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                            const qty = Number(r.Quantity) || 0;
                            const cost = Number(r.ProductCost) || 0;
                            const price = qty ? cost / qty : 0;
                            (acc[companyName] ||= []).push({
                                ProductName: r.ProductName,
                                Quantity: qty,
                                Price: price,
                                ProductCost: cost,
                                DateText: "Corporate Card"
                            });
                            return acc;
                        }, {});

                        // Clear previous content from row 18 down
                        const LIGHT_GREY = { argb: "FFEFEFEF" };
                        for (let r = 18; r <= (memoSheet.lastRow?.number || 0); r++) {
                            const row = memoSheet.getRow(r);
                            row.eachCell(c => { c.value = null; c.fill = null; c.font = null; c.border = null; });
                            row.values = [];
                        }

                        let rowIndex = 18;
                        let grandQty = 0;
                        let grandCost = 0;
                        const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));

                        companies.forEach(companyName => {
                            if (grandQty !== 0) memoSheet.getRow(rowIndex++).values = ["", "", "", "", "", "", ""];

                            const headerRow = memoSheet.getRow(rowIndex++);
                            headerRow.values = ["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];
                            for (let c = 2; c <= 7; c++) {
                                const cell = headerRow.getCell(c);
                                cell.font = { bold: true };
                                cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                                if ([4, 5, 6].includes(c)) cell.alignment = { horizontal: "right" };
                                if (c === 7) cell.alignment = { indent: 2 };
                            }

                            let subtotalQty = 0;
                            let subtotalCost = 0;
                            byCompany[companyName].forEach(item => {
                                const row = memoSheet.getRow(rowIndex++);
                                row.values = ["", item.ProductName, undefined, item.Quantity, item.Price, item.ProductCost, item.DateText];
                                row.getCell(4).numFmt = "#,##0";
                                row.getCell(5).numFmt = "#,##0.00";
                                row.getCell(6).numFmt = "#,##0.00";
                                row.getCell(7).alignment = { indent: 2 };
                                subtotalQty += item.Quantity;
                                subtotalCost += item.ProductCost;
                                grandQty += item.Quantity;
                                grandCost += item.ProductCost;
                            });

                            const subtotalRow = memoSheet.getRow(rowIndex++);
                            subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
                            for (let c = 2; c <= 7; c++) {
                                subtotalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                            }
                            subtotalRow.getCell(2).font = { bold: true };
                            subtotalRow.getCell(4).numFmt = "#,##0";
                            subtotalRow.getCell(6).numFmt = "#,##0.00";
                        });

                        memoSheet.addRow([]);
                        const grandRow = memoSheet.addRow(["", "Grand Total", "", grandQty, "", grandCost, ""]);
                        for (let c = 2; c <= 7; c++) {
                            const cell = grandRow.getCell(c);
                            cell.font = { bold: true };
                            cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                        }
                        grandRow.getCell(4).numFmt = "#,##0";
                        grandRow.getCell(6).numFmt = "#,##0.00";

                        // Stamp values into DATA sheet
                        const firstRecord = groups[groupNameRaw][0];
                        const dlRefNO = firstRecord.HeadRefNo;
                        const aLotNO = firstRecord.ERODesc05;
                        const aOSAmt = firstRecord.EROAmount2;
                        const aLimitAmt = firstRecord.CashAdvance;
                        if (firstRecord) dataSheet.getCell("E5").value = firstRecord.DateText;
                        dataSheet.getCell("C2").value = groupNameRaw;
                        dataSheet.getCell("C1").value = dlRefNO;
                        dataSheet.getCell("C4").value = aOSAmt;
                        dataSheet.getCell("C7").value = aLimitAmt;
                        dataSheet.getCell("E6").value = aLotNO;

                        [5, 12, 35, 8, 12, 13, 22].forEach((w, i) => memoSheet.getColumn(i + 1).width = w);

                        templateWb.worksheets.slice().forEach(ws => {
                            if (!["MEMO", "DATA"].includes(ws.name)) templateWb.removeWorksheet(ws.id);
                        });

                        // 🔄 Upload instead of download
                        const safeName = dlRefNO || "Unknown";
                        if (safeName !== "Unknown") {
                            const outBuffer = await templateWb.xlsx.writeBuffer();
                            const outFile = new File(
                                [outBuffer],
                                `${safeName}.xlsx`,
                                { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                            );

                            const uploadedName = await u2pload2File(outFile);
                            //if (uploadedName) {
                            //viewUploadedFile(uploadedName);
                            //}
                        }
                    } catch (err) {
                        console.error(err);
                        notify("error", `Failed group export for ${displayName}.`, 3000);
                    }
                }

                notify("success", "Upload Customer Group completed for all groups.", 2500);
            };

            /**
             * Upload grouped Excel files to server and view them.
             * @param {boolean} processFirstOnly - If true, only process the first group in the array.
             */
            const uploadCustomerGrps = async (processFirstOnly = false) => {
                if (!lLoadTemp) return notify("error", "Please load Excel Template before.", 4000);
                if (!jsonData?.length) return notify("warning", "No data to export.", 2000);
                if (!templateBuffer) return notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);

                console.log(njsonDataSum);
                jsonData = combineGroupsToJsonData(jsonData, njsonDataSum);
                console.log(jsonData);

                // Group records by CompanyGroup
                const groups = jsonData.reduce((acc, r) => {
                    const groupName = r.CompanyGroup || "Unknown";
                    (acc[groupName] ||= []).push(r);
                    return acc;
                }, {});

                let groupNames = Object.keys(groups);

                // 👉 If only first group requested
                if (processFirstOnly && groupNames.length > 0) {
                    groupNames = [groupNames[0]];
                }

                for (let i = 0; i < groupNames.length; i++) {
                    const groupNameRaw = groupNames[i];
                    const displayName = groupNameRaw || "Unknown";
                    notify("info", `Processing ${displayName} (${i + 1}/${groupNames.length})`, 1500);

                    try {
                        const templateWb = new ExcelJS.Workbook();
                        await templateWb.xlsx.load(templateBuffer);

                        const memoSheet = templateWb.getWorksheet("MEMO");
                        const dataSheet = templateWb.getWorksheet("DATA");
                        if (!memoSheet || !dataSheet) {
                            notify("error", "Template missing MEMO or DATA sheet.", 4000);
                            break;
                        }

                        // ... [same grouping + ExcelJS logic as before] ...

                        // 🔄 Upload instead of download
                        const firstRecord = groups[groupNameRaw][0];
                        const safeName = firstRecord?.HeadRefNo || "Unknown";
                        if (safeName !== "Unknown") {
                            const outBuffer = await templateWb.xlsx.writeBuffer();
                            const outFile = new File(
                                [outBuffer],
                                `${safeName}.xlsx`,
                                { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                            );

                            const uploadedName = await u2pload2File(outFile, "RPT");
                            if (uploadedName) {
                                viewUploadedFile(uploadedName);
                            }
                        }
                    } catch (err) {
                        console.error(err);
                        notify("error", `Failed group export for ${displayName}.`, 3000);
                    }
                }

                notify("success", "Upload Customer Group completed.", 2500);
            };

            async function u2pload2File(file, prefix) { //= "RPT"
                try {
                    if (!file) {
                        console.log("No file provided.");
                        return false;
                    }

                    const originalFileName = file.name;
                    const fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                    const baseName = originalFileName.substring(0, originalFileName.lastIndexOf("."));
                    const prefixUnderscore = prefix ? `_${prefix}` : "";

                    // Always append "_RPT"
                    const newFileName = `${baseName}${prefixUnderscore}${fileExtension}`;

                    const simulatedFile = new File([file], newFileName, { type: file.type });

                    const formData = new FormData();
                    formData.append("file", simulatedFile);

                    const myHeaders = new Headers();
                    myHeaders.append("ref", "44095B6C-CC17-47FD-895B-649E0EAA2BAE");

                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: formData,
                    };

                    //const response = await fetch("https://cbsdev2.locktonwattana.com/temp/uploads/",requestOptions);
                    const response = await fetch(
                        //"https://cbsdev2.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                        isLocalHost() + "/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                        requestOptions
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.text();
                    console.log(result);
                    //aMessageAlert(`Upload file ${newFileName} successful!`, "blue");
                    return newFileName;
                } catch (error) {
                    console.error("Error:", error);
                    return null;
                }
            }

            async function xu2pload2File(file, prefix) { // = "RPT"
                try {
                    if (!file) {
                        console.log("No file provided.");
                        return false;
                    }

                    const originalFileName = file.name;
                    const fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                    const baseName = originalFileName.substring(0, originalFileName.lastIndexOf("."));
                    const prefixUnderscore = prefix ? `_${prefix}` : "";

                    // ✅ PUBLIC NAME (STILL SAME)
                    const newFileName = `${baseName}${prefixUnderscore}${fileExtension}`;

                    // ✅ INTERNAL UNIQUE NAME (FOR SERVER WRITE SAFETY)
                    const uniqueName = `${baseName}${prefixUnderscore}_${Date.now()}${fileExtension}`;

                    const simulatedFile = new File([file], uniqueName, { type: file.type });

                    const formData = new FormData();
                    formData.append("file", simulatedFile);

                    const myHeaders = new Headers();
                    myHeaders.append("ref", "44095B6C-CC17-47FD-895B-649E0EAA2BAE");

                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: formData,
                    };

                    const response = await fetch(
                        isLocalHost() + "/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                        requestOptions
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const result = await response.text();
                    console.log(result);

                    // ✅ WAIT TO ENSURE FILE IS FULLY COMMITTED ON SERVER
                    await new Promise(resolve => setTimeout(resolve, 800));

                    // ✅ RETURN THE PUBLIC NAME (NOT UNIQUE NAME)
                    return newFileName;

                } catch (error) {
                    console.error("Error:", error);
                    return null;
                }
            }

            // สร้าง popup สำหรับ viewer
            // Create popup once when page loads
            const viewerPopup = $("#fileViewerPopup").dxPopup({
                title: "File Viewer",
                width: 900,
                height: 600,
                visible: false,
                showCloseButton: true,
                dragEnabled: true,
                resizeEnabled: true,
                contentTemplate: function () {
                    return $("<iframe>", {
                        id: "viewerFrame",
                        style: "width:100%; height:100%; border:none;"
                    });
                }
            }).dxPopup("instance");   // 👈 this returns the popup instance


            function viewUploadedFile(filename) { // this is the version that clear cache 
                const baseUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/";
                const fileUrl = baseUrl + encodeURIComponent(filename);

                const ext = filename.split('.').pop().toLowerCase();
                let viewerUrl = "";

                // Add a cache-busting query string (timestamp)
                const bust = "?v=" + Date.now();

                if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
                    viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src="
                        + encodeURIComponent(fileUrl + bust);
                } else if (ext === "pdf") {
                    viewerUrl = "https://docs.google.com/gview?embedded=true&url="
                        + encodeURIComponent(fileUrl + bust);
                } else {
                    viewerUrl = fileUrl + bust;
                }

                // Configure popup
                viewerPopup.option({
                    title: "Viewing: " + filename,
                    position: {
                        my: "left top",
                        at: "left top",
                        of: window,
                        offset: "40 50"
                    }
                });
                viewerPopup.show();

                // Force iframe to reload fresh version
                $("#viewerFrame").attr("src", viewerUrl);
            }

            async function saveData() {
                console.log("Start saving...");
                await insertAllRecords();   // 👈 รอให้ทำงานเสร็จ
                console.log("Done saving!");
            }

            // ฟังก์ชันหลักที่ loop ส่งข้อมูลแบบ async/await
            const insertAllRecords = async () => {
                for (let i = 0; i < njsonDataSum.length; i++) {
                    const ObjKeyData = njsonDataSum[i];   // ใช้ record ตรง ๆ จาก array
                    const ObjRowData = JSON.stringify(ObjKeyData);

                    try {
                        // 👇 ใช้ await เพื่อรอผลลัพธ์จาก API ก่อนจะไป record ถัดไป
                        const response = await sendRequestNew(
                            "Insert",
                            ObjRowData,
                            aaTBKey,
                            aaPFDMI,
                            atob(aaXToX)
                        );
                        //alert(`Record ${i} inserted successfully:, ${response}`)
                        console.log(`Record ${i} inserted successfully:`, response);
                    } catch (error) {
                        console.error(`Failed to insert record ${i}:`, error);
                    }
                }
            };

            const insertAllRecordsParallel = async () => {
                try {
                    const promises = njsonDataSum.map(row => {
                        const ObjRowData = JSON.stringify(row);
                        return sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                    });

                    const results = await Promise.all(promises);
                    console.log("All records inserted:", results);
                } catch (error) {
                    console.error("Error inserting records:", error);
                }
            };

            const testOneRecord = async (index) => {
                const ObjKeyData = njsonDataSum[index];
                console.log(ObjKeyData);
                const ObjRowData = JSON.stringify(ObjKeyData);

                try {
                    const response = await sendRequestNew(
                        "Insert",
                        ObjRowData,
                        aaTBKey,
                        aaPFDMI,
                        atob(aaXToX)
                    );
                    console.log(`Record ${index} inserted successfully:`, response);
                } catch (error) {
                    console.error(`Failed to insert record ${index}:`, error);
                }
            };

            // ตัวอย่างเรียกทดสอบ record ที่ 2
            //testOneRecord(1);
            // ฟังก์ชันช่วย format date เป็น dd/MM/yyyy
            function formatDateDDMMYYYY(dateValue) {
                if (!dateValue) return null;
                const d = new Date(dateValue);

                const day = String(d.getDate()).padStart(2, "0");
                const month = String(d.getMonth() + 1).padStart(2, "0");
                const year = d.getFullYear();

                return `${day}/${month}/${year}`;
            }

            const cinsertAllRecords = async () => {
                for (let i = 0; i < njsonDataSum.length; i++) {
                    const ObjKeyData = { ...njsonDataSum[i] };

                    // ✅ แปลง ERODate02 เป็น dd/MM/yyyy ก่อนส่ง
                    if (ObjKeyData.ERODate02) {
                        ObjKeyData.ERODate02 = formatDateDDMMYYYY(ObjKeyData.ERODate02);
                    }

                    const ObjRowData = JSON.stringify(ObjKeyData);

                    try {
                        const response = await sendRequestNew(
                            "Insert",
                            ObjRowData,
                            aaTBKey,
                            aaPFDMI,
                            atob(aaXToX)
                        );
                        console.log(`Record ${i} inserted successfully:`, response);
                    } catch (error) {
                        console.error(`Failed to insert record ${i}:`, error);
                    }
                }
            };

        }) //then fetch LoadSQL
        .catch(error => console.error("Error fetching SQL data:", error)); // load loadsqldata  
})();
