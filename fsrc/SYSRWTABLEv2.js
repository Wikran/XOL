
/**
 * SYSRWTABLE.optimized.v2.js
 * Adds graceful retries + DevExtreme toast notifications for fetch errors.
 */
(() => {
  'use strict';

  // ===== Bootstrap & Theme =====
  $(document).ready(() => {
    const theme = localStorage.getItem('aDXTheme');
    if (theme) {
      DevExpress.ui.themes.current(theme);
    }
  });

  if (window.jspdf && window.jspdf.jsPDF) {
    window.jsPDF = window.jspdf.jsPDF;
    if (typeof applyPlugin === 'function') {
      applyPlugin(window.jsPDF);
    }
  }

  console.clear();

  const aXToX = localStorage.getItem('aaXXoX') || '';
  const aaUsrN = localStorage.getItem('aaXXuX') || '';
  const aaPFDMI = isLocalHost();
  const xParam = (typeof param1 === 'undefined' || param1 == null) ? null : param1;
  const aaPXIXD = (xParam == null) ? localStorage.getItem('aPXIXD') || '' : String(xParam);
  const aaEnt = aaPXIXD.includes('X');

  const database = 'ExtraOnLine.dbo.TaskControl';
  const keyField = 'TaskGroup';
  const keyID = 'SYSRWTABLE';
  const fieldsSelected = 'IDNO,TaskName,TaskProgram,TaskGroup';

  const aVARs = Object.create(null);
  const aArrays = Object.create(null);
  const aObjects = Object.create(null);

  const toNumberIfNumeric = (v) => {
    if (v == null) return v;
    const n = Number(v);
    return Number.isFinite(n) && String(v).trim() !== '' ? n : v;
  };

  const safeJSONParse = (str) => {
    try { return JSON.parse(str); } catch { return null; }
  };

  const normalizeLine = (line) => line.trim().replace(/,$/, '');

  const notifyError = (msg) => {
    DevExpress.ui.notify({ message: msg, type: "error", displayTime: 4000 });
  };

  // retry wrapper for fetch
  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) return res.json();
        return res.text();
      } catch (err) {
        if (i < retries - 1) {
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw err;
      }
    }
  };

  // ===== Load TaskControl config =====
  LoadSQLData(aaPFDMI, database, keyID, keyField, fieldsSelected)
    .then((result) => {
      if (!Array.isArray(result)) {
        notifyError('Invalid TaskControl response');
        return;
      }

      for (const item of result) {
        const match = item.TaskName && item.TaskName.match(/\[(.*?)\]/);
        if (!match) continue;

        const tag = match[1];
        const raw = (item.TaskProgram || '').replace(/`/g, "'");

        if (item.TaskName.includes('{ARRAY}')) {
          aArrays[tag] = raw.split('\n').map((ln) => normalizeLine(ln)).map((ln) => (ln === '' ? '' : toNumberIfNumeric(ln)));
        } else if (item.TaskName.includes('{T2O}')) {
          const lines = raw.split('\n').map(normalizeLine).filter(Boolean);
          aObjects[tag] = lines.map((ln) => {
            const jsonLine = ln.replace(/(\w+)\s*:/g, '"$1":').replace(/:\s*([^",\s][^,]*)/g, (m, grp) => `: "${grp.trim()}"`);
            const obj = safeJSONParse(`{${jsonLine}}`) || {};
            for (const k of Object.keys(obj)) {
              if (k.toLowerCase().includes('amt')) obj[k] = toNumberIfNumeric(obj[k]);
            }
            return obj;
          });
        } else if (item.TaskName.includes('{OBJ}')) {
          const obj = {};
          for (const ln of raw.split('\n')) {
            const line = normalizeLine(ln);
            if (!line) continue;
            const idx = line.indexOf(':');
            if (idx === -1) continue;
            const key = line.slice(0, idx).trim();
            const value = line.slice(idx + 1).trim();
            if (key) obj[key] = toNumberIfNumeric(value);
          }
          aObjects[tag] = obj;
        } else {
          aVARs[tag] = item.TaskName.includes('{num}') ? toNumberIfNumeric(raw) : raw;
        }
      }

      const allTablesConfig = safeJSONParse(aVARs.JSobject);
      if (!Array.isArray(allTablesConfig)) {
        notifyError('Invalid JSobject config');
        return;
      }

      const tableNameToSearch = aVARs.aTableName4Use;
      if (!tableNameToSearch) {
        notifyError('No table selected');
        return;
      }

      const tableConfig = allTablesConfig.find((t) => t.TableName === tableNameToSearch);
      if (!tableConfig) {
        notifyError(`Table not found: ${tableNameToSearch}`);
        return;
      }

      const { Primarykeys: aaKeyField, TokenKey: aaTBKey } = tableConfig;
      const fields = Array.isArray(tableConfig.Fields) ? tableConfig.Fields : [];
      const exportBase = tableConfig.TableName || 'Data';

      const MMaMx = localStorage.getItem('MMaMx') || '';
      const parts = MMaMx.split('0');
      const aRrgSx = (typeof parts[1] === 'undefined') ? '377B' : parts[1];

      const nDataPos = 1, nExcelPos = 2, nPDFPos = 3;
      const canReadUpdate = aRolesAction(aRrgSx, nDataPos, 2) === 1;
      const canDelete = aRolesAction(aRrgSx, nDataPos, 3) === 1;
      const excelEnabled = aRolesAction(aRrgSx, nExcelPos, 2) === 1;
      const pdfEnabled = aRolesAction(aRrgSx, nPDFPos, 2) === 1;

      const updateVerb = canReadUpdate ? 'Update' : 'xxx';

      const where = `${aaKeyField} != ''`;
      const baseUrl = `${aaPFDMI}/DMQ/XOL/${atob(aXToX)}/${aaTBKey}/all`;
      const encodedFilter = { '@': btoa(where) };

      const grid = $('#gridContainer').dxDataGrid({
        dataSource: new DevExpress.data.CustomStore({
          key: aaKeyField,
          loadMode: 'raw',
          load: () => fetchWithRetry(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(encodedFilter)
          }).then((data) => {
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.data)) return data.data;
            return [];
          }).catch((err) => {
            notifyError(`Load failed: ${err.message}`);
            return [];
          }),
          insert: (values) => {
            const payload = aaEnt ? JSON.stringify({ EntryBy: aaUsrN, EntryDate: new Date(), ...values }) : JSON.stringify(values);
            return sendRequestNew('Insert', payload, aaTBKey, aaPFDMI, atob(aXToX));
          },
          update: (key, values) => {
            const payload = JSON.stringify({ [aaKeyField]: String(key).trim(), ...values });
            return sendRequestNew(updateVerb, payload, aaTBKey, aaPFDMI, atob(aXToX));
          },
          remove: (key) => {
            const payload = JSON.stringify({ [aaKeyField]: String(key).trim() });
            return sendRequestNew('Delete', payload, aaTBKey, aaPFDMI, atob(aXToX));
          }
        }),
        showBorders: true,
        scrolling: { mode: 'virtual' },
        editing: { mode: 'popup', allowUpdating: canReadUpdate, allowAdding: canReadUpdate, allowDeleting: canDelete },
        columns: [
          { type: 'buttons', width: 110, buttons: ['edit', 'delete'], visible: true },
          ...fields.map((f) => ({
            dataField: f.Name,
            caption: f.Caption,
            dataType: f.Type ?? undefined,
            width: f.Width || 120,
            visible: f.visible !== false
          }))
        ]
      }).dxDataGrid('instance');
    })
    .catch((err) => {
      notifyError(`LoadSQLData failed: ${err.message}`);
    });
})();
