// Task Control (& Workflow)

$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const adgHeader = urlParams.get('dgHead') || "admin";
let templateBuffer = null;   // 👉 Global buffer
let lLoadTemp = false;       // 👉 Flag to check if loaded
let aaXToX = localStorage.getItem("aaXXoX"); //localStorage["aaXXoX"];
let aaXNoX = localStorage.getItem("aaXXuX"); //localStorage["aaXXuX"];
let aaPXIXD = localStorage.getItem("aPXIXD"); //localStorage["aPXIXD"];
let aaUsrN = localStorage.getItem("aaXXuX"); //localStorage["aaXXuX"];
var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492";
var aaEnt = aaPXIXD.includes("X");
// var aaXToX = localStorage["aaXXoX"];
// var aaXNoX = localStorage["aaXXuX"];
// var aaPXXI = localStorage["aPXIXD"];
// var aaPXIXD = localStorage["aPXIXD"];
// var aaKeyField = localStorage["aaXKFX"];
// var aaTBKey = localStorage["aaXTBX"];
// var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var afqrFull = "pageID='" + aaPXIXD + "' "
var afURL = `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/${aaXTXB}/all` //+ aaP ฐฐฐฐผผผป
var afsettings = {
    "url": afURL,
    "method": "POST",
    "timeout": 0,
    "headers": { "Content-Type": "application/json" },
    "data": JSON.stringify({ "@": afqrFull }), //" pageID='Resigned' "
};

const aGetDateRefE = (aERSuf, aMSuf, nFtoL) => {
    let aNowDatev = new Date()
    let aYear2 = String(aNowDatev.getFullYear()).substring(2, 4);
    let aMonth2 = String(101 + aNowDatev.getMonth()).substring(1, 3);
    let aDate2 = String(100 + aNowDatev.getDate()).substring(1, 3);
    let aHour2 = String(100 + aNowDatev.getHours()).substring(1, 3);
    let aDateNow2 = aYear2 + aMonth2 + aDate2 + aMSuf + String(Date.now()).substring(5, nFtoL) // 5,16
    return aERSuf + aDateNow2 //+ aYear2 + aMonth2 + aDate2 + aHour2;
}

const aSaveCloneN = (iData, aaTBKey, aaPFDMI, aaXToX, NewDiv) => {
    let aaID = aGetDateRef("T").substring(1, 11); //aGetDateRefE("", "", 12) 
    let aObjKeyData = { IDNO: aaID }
    if (NewDiv !== undefined) {
        aObjKeyData = { IDNO: aaID, ApproveToDivision: NewDiv }
    }
    let aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
    sendRequestNew("Insert", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
}

// Serialize ArrayBuffer -> JSON string
function serializeBufferToJson(buffer) {
    const uint8 = new Uint8Array(buffer);
    return JSON.stringify(Array.from(uint8));
}

// Deserialize JSON string -> ArrayBuffer
function deserializeJsonToBuffer(jsonStr) {
    const arr = JSON.parse(jsonStr);
    const uint8 = new Uint8Array(arr);
    return uint8.buffer;
}

// Build ExcelJS.Workbook from JSON string
async function getWorkbookFromJson(jsonStr) {
    const buffer = deserializeJsonToBuffer(jsonStr);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    return workbook;
}


// Deep-persist TaskProgram to grid's data source, with fallbacks
async function persistTaskProgram(rowEvent, jsonStr) {
    const grid = rowEvent?.component;
    const row = rowEvent?.row;
    const key = rowEvent?.key;
    const rowIndex = row?.rowIndex;

    // 1) Try store.update for true persistence (works with ArrayStore/CustomStore)
    try {
        const ds = grid?.getDataSource?.();
        const store = ds?.store?.();
        if (store && typeof store.update === "function" && key !== undefined) {
            await store.update(key, { TaskProgram: jsonStr });
            await ds.reload(); // ensure UI reflects the change
            DevExpress.ui.notify("TaskProgram saved via store.update.", "success", 2000);
            return;
        }
    } catch (err) {
        console.warn("store.update failed; will fallback to cellValue.", err);
    }

    // 2) Fallback: write into visible cell (updates UI; persistence depends on editing mode)
    if (grid && rowIndex !== undefined) {
        try {
            grid.cellValue(rowIndex, "TaskProgram", jsonStr);
            // If editing mode requires explicit save
            if (typeof grid.saveEditData === "function") {
                grid.saveEditData();
            }
            DevExpress.ui.notify("TaskProgram saved via cellValue.", "success", 2000);
            return;
        } catch (err) {
            console.warn("cellValue failed; will fallback to direct assignment.", err);
        }
    }

    // 3) Last resort: direct assignment + refresh (works for plain array dataSource)
    if (row?.data) {
        row.data.TaskProgram = jsonStr;
        if (grid && typeof grid.refresh === "function") grid.refresh();
        DevExpress.ui.notify("TaskProgram assigned to row.data and refreshed.", "success", 2000);
        return;
    }

    throw new Error("Unable to persist TaskProgram. Grid/row context missing.");
}

// Popup to load Excel, preview JSON, and persist to TaskProgram
const loadExcelPopup = (rowEvent, options = {}) => {
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
        position: { my: "left top", at: "left top", of: window, offset: "200 200" },
        contentTemplate: () => {
            const $content = $("<div style='padding:10px;'></div>");
            const $uploaderDiv = $("<div id='xinput-excel'></div>");
            const $label = $("<span id='xexcel-status' class='file-label'></span>");
            $content.append($uploaderDiv, $label);

            $uploaderDiv.dxFileUploader({
                accept: ".xlsx",
                selectButtonText: "Browse Excel",
                uploadMode: "useForm",
                onValueChanged: async (e) => {
                    const file = e.value?.[0];
                    if (!file) return;

                    try {
                        // Load file to buffer
                        const buffer = await file.arrayBuffer();

                        // Validate as Excel (optional but recommended)
                        const workbook = new ExcelJS.Workbook();
                        await workbook.xlsx.load(buffer);

                        // Convert to JSON string for storage
                        const jsonStr = serializeBufferToJson(buffer);

                        // Preview before save
                        const preview = jsonStr.substring(0, 300);
                        alert(
                            `Preview JSON (first 300 chars):\n\n${preview}...\n\n` +
                            `Length: ${jsonStr.length} chars`
                        );

                        // Persist into TaskProgram
                        await persistTaskProgram(rowEvent, jsonStr);

                        // Callback to caller
                        if (typeof options.onLoaded === "function") {
                            options.onLoaded(jsonStr, file);
                        }

                        // UI feedback and close
                        $label.text(`Loaded: ${file.name}`);
                        DevExpress.ui.notify("Excel loaded and TaskProgram updated.", "success", 2000);
                        $("#xuploadPopup").dxPopup("instance").option("visible", false);
                    } catch (err) {
                        console.error("Excel load/persist error:", err);
                        DevExpress.ui.notify("Failed to load or save. Check file and grid context.", "error", 3000);
                    }
                }
            });

            return $content;
        }
    });
};

let templateBufferB = null;
let lLoadTempB = false;

const loadExcelPopupB = (rowEvent, options = {}) => {
    if (!$("#xuploadPopupB").length) {
        $("body").append($("<div id='xuploadPopupB'></div>"));
    }

    $("#xuploadPopupB").dxPopup({
        title: "Load Excel File (Binary)",
        width: 600,
        height: "auto",
        visible: true,
        showCloseButton: true,
        dragEnabled: true,
        position: { my: "left top", at: "left top", of: window, offset: "200 200" },
        contentTemplate: () => {
            const $content = $("<div style='padding:10px;'></div>");
            const $uploaderDiv = $("<div id='xinput-excel-b'></div>");
            const $label = $("<span id='xexcel-status-b' class='file-label'></span>");
            $content.append($uploaderDiv, $label);

            $uploaderDiv.dxFileUploader({
                accept: ".xlsx",
                selectButtonText: "Browse Excel",
                uploadMode: "useForm",
                onValueChanged: async (e) => {
                    const file = e.value?.[0];
                    if (!file) return;

                    try {
                        const buffer = await file.arrayBuffer();

                        // 👉 Save buffer directly to TaskProgram
                        rowEvent.row.data.TaskProgram = buffer;

                        // Validate with ExcelJS (optional)
                        const workbook = new ExcelJS.Workbook();
                        await workbook.xlsx.load(buffer);

                        DevExpress.ui.notify("Excel binary buffer saved to TaskProgram.", "success", 2000);
                        rowEvent.component.refresh();

                        $("#xuploadPopup").dxPopup("instance").option("visible", false);
                    } catch (err) {
                        console.error(err);
                        DevExpress.ui.notify("Failed to load Excel.", "error", 3000);
                    }
                }

            });

            return $content;
        }
    });
};


function jsonToBuffer(jsonString) {
    if (!jsonString || typeof jsonString !== "string") {
        throw new Error("Invalid JSON string");
    }
    const arr = JSON.parse(jsonString);       // parse string -> array of numbers
    const uint8Array = new Uint8Array(arr);   // convert -> Uint8Array
    return uint8Array.buffer;                 // return ArrayBuffer
}


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

var jqxhr = $.post(afsettings, function (e) { })
    .done(function (e) {
        //console.log("set aaTBKey");
        aObjMPage = e;
        var aaKeyField = aObjMPage[0].PrimaryKey;
        var aaTBKey = aObjMPage[0].TBKey;

        //TOP PRG
        $(() => {
            var aDatabasea = "ExtraOnLine.dbo.TaskControl";
            var aKeyField = "TaskGroup";
            var aKeyIDa = aaPXIXD; //"main"; //aaPXIXD;
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
                            // let lines = taskProgram.split("\n");
                            // aObjects[aMatch[1]] = lines
                            //     .map(line => {
                            //         line = line.trim().replace(/,$/, "");
                            //         line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                            //         return JSON.parse(line);
                            //     })
                            //     .map(obj => {
                            //         for (let key in obj) {
                            //             if (key.includes("amt") && typeof obj[key] === "string") {
                            //                 obj[key] = +obj[key];
                            //             }
                            //         }
                            //         return obj;
                            //     });
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
                    // aObjects.aTaskProgram.forEach(obj => {
                    //     delete obj.ID;
                    // });
                    
                    const aSaveMemToDB = (iData, aaTBKey, aaPFDMI, aaXToX) => {
                        let aObjRowData = JSON.stringify(iData);
                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                    }
                    // try {
                    //     // Wrap in a function to isolate scope
                    //     const includeFunctions = new Function(aVARs.PRGJS);
                    //     includeFunctions(); // Defines the functions in current scope
                    // } catch (e) {
                    //     console.error("Error including PRGJS:", e);
                    // }
                    //alert(aVARs.TaskTableConfig)
                    //console.log(aObjects.aaLIMITed) //
                    //console.log(aObjects.aaTypeOfGift)
                    //let aVcheck = "Gift"
                    //console.log(aObjects.aaLIMITed.find(item => item.code === aVcheck) ? aObjects.aaLIMITed.find(item => item.code === aVcheck).lmtamt : null );
                    const tabs = [{ name: 'From This Device', value: ['file'] }, { name: 'From the Web', value: ['url'] }, { name: 'Both', value: ['file', 'url'] }];
                    var aMMaMx = localStorage["MMaMx"];
                    var aRRgRs = aMMaMx.split('0');
                    var aDDeDx = aRRgRs[0];
                    var aRrgSx = aRRgRs[1];
                    var asTaskProgram;
                    if (jQuery.type(aRrgSx) === "undefined") {
                        aRrgSx = "377B";
                    }
                    let nDataPos = 1;
                    let nExcelPos = 2;
                    let nPDFPos = 3;
                    let nRPTPos = 4;
                    var arDataC = aRolesAction(aRrgSx, nDataPos, 1);
                    var arDataU = aRolesAction(aRrgSx, nDataPos, 2);
                    if (arDataU === 1) {
                        var aUpdateText = "Update";
                        var aSaveVisible = 1;
                        var aCancelText = "Cancel";
                        var aCancelicon = "close";
                        var aCancelType = "danger";
                    } else {
                        var aUpdateText = "xxx";
                        var aSaveVisible = 0;
                        var aCancelText = "EXIT";
                        var aCancelicon = "fas fa-sign-out-alt";
                        var aCancelType = "success";
                    }
                    var arDataD = aRolesAction(aRrgSx, nDataPos, 3);
                    var arExcelEx = aRolesAction(aRrgSx, nExcelPos, 2);
                    var arPDFEx = aRolesAction(aRrgSx, nPDFPos, 2);

                    let filterValue;
                    if (aMMaMx === "Developer" || aMMaMx === "admin") {
                        filterValue = null
                        // [
                        //     [
                        //         ['TaskName', 'contains', '<'],
                        //         'and',
                        //         ['TaskName', 'contains', aMMaMx]
                        //     ],
                        //     'or',
                        //     ['TaskName', 'notcontains', '<']
                        // ];
                    } else {
                        filterValue = [
                            ['TaskName', 'contains', '<'],
                            'and',
                            ['TaskName', 'contains', aMMaMx] //.trim().toLowerCase()
                        ];
                    }
                    const isVisible = (aMMaMx === "Developer" || aMMaMx === "admin");
                    const showActionColumn = (aMMaMx === "admin" || aMMaMx === "Developer");

                    var aqrFull = `${aaKeyField} != '' ` //"Status LIKE 'Active%'" //"Dept = '1196'" // "Password !LIKE '%\%"
                    var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all' //aaPFDMZz  aaPFDMI

                    var settings = {
                        "url": aurl,
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                            "@": aqrFull //" Status!='Resigned' "
                        }),
                    };

                    $("#gridContainer").dxDataGrid({

                        dataSource: new DevExpress.data.CustomStore({
                            key: aaKeyField,
                            loadMode: "omit",

                            load: function () { return $.post(settings).done(); }, //function (response) {//console.log(response)};
                            // load: function () { return $.post(settings).then(function(data) { // 🔹 Inject TaskHeader into each row
                            //     data.forEach(function(row) {
                            //         row.TaskHeader = row.TaskDescription?.match(/\[(.*?)\]/)?.[1] || "";
                            //     });
                            //     return data;
                            // });
                            // },           
                            insert: function (values) {
                                if (aaEnt) {
                                    var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date() };
                                    var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                }
                                else {
                                    var ObjRowData = JSON.stringify(values);
                                }
                                sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            },
                            update: function (key, values) {
                                //console.log(aaKeyField);
                                var ObjKeyData = { [aaKeyField]: $.trim(key) }; //key.trim
                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                sendRequestNew("Update", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            },
                            remove: function (key) {
                                var ObjKeyData = { [aaKeyField]: $.trim(key) }; //key.trim
                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                                sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            }
                        }),
                        allowColumnReordering: true,
                        allowColumnResizing: true,
                        columnMinWidth: 40,
                        columnChooser: {
                            enabled: (adgHeader === "admin"), //true
                        },
                        showBorders: true,
                        sorting: {
                            mode: "multiple"
                        },
                        selection: {
                            mode: 'single',//'multiple'
                        },
                        groupPanel: {
                            visible: true
                        },
                        filterRow: {
                            visible: true,
                            applyFilter: "auto"
                        },
                        headerFilter: {
                            visible: true
                        },
                        filterPanel: {
                            visible: isVisible, //(aMMaMx === "Developer" || aMMaMx === "admin"), //true
                        },
                        filterBuilderPopup: {
                            position: {
                                of: window, at: 'top', my: 'top', offset: { y: 5 },
                            },
                            height: 500,
                            width: 1000,
                        },
                        filterValue: filterValue,
                        // filterValue: [
                        //     [
                        //         ['TaskName', 'contains', '<'],
                        //         'and',
                        //         ['TaskName', 'contains', aMMaMx]
                        //     ],
                        //     'or',
                        //     ['TaskName', 'notcontains', '<']
                        // ],

                        grouping: {
                            autoExpandAll: true,
                        },
                        searchPanel: {
                            visible: true
                        },
                        paging: {
                            pageSize: 5
                        },
                        pager: {
                            showPageSizeSelector: true,
                            allowedPageSizes: [5, 10, 20, 50],
                            showInfo: true
                        },
                        showBorders: true,
                        groupPaging: true,
                        showColumnLines: true,
                        showRowLines: true,
                        rowAlternationEnabled: true,
                        wordWrapEnabled: true,
                        // Export to Excel 		
                        export: {
                            enabled: arExcelEx,
                            allowExportSelectedData: true
                        },
                        onExporting: function (e) {
                            const workbook = new ExcelJS.Workbook();
                            const worksheet = workbook.addWorksheet('DATA');
                            DevExpress.excelExporter.exportDataGrid({
                                worksheet: worksheet,
                                component: e.component
                            }).then(function () {
                                workbook.xlsx.writeBuffer().then(function (buffer) {
                                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'TaskControl' + '.xlsx');
                                });
                            });
                            e.cancel = true;
                        },
                        onInitNewRow: function (e) {
                            let aaID = 1
                            let axRunRun = aGetDateRef("T").substring(1, 11); // generateUniqueId(); //
                            console.log(axRunRun)
                            e.data.IDNO = axRunRun
                        },
                        onEditorPreparing: function (e) {
                            if (e.parentType === "dataRow" && arDataU === 0) {
                                e.editorOptions.disabled = true;
                            } else {
                                if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate")) {
                                    e.editorOptions.disabled = true;
                                }
                                // if (e.parentType === "dataRow" && (e.dataField === "TaskProgram" )) {
                                //     asTaskProgram = e.data.TaskProgram
                                // }
                            }

                        },
                        onCellPrepared: function (e) {
                            if (e.rowType === "data") {
                                e.cellElement.css("vertical-align", "top");
                                //asTaskProgram = e.data.TaskProgram
                            }
                        },
                        //
                        //
                        // Editing
                        editing: {
                            mode: "popup",
                            useIcons: true,
                            allowUpdating: true,
                            allowDeleting: arDataD,
                            allowAdding: arDataC,
                            form: {
                                showColonAfterLabel: false,
                                labelLocation: "left",//"left", //"top",
                                //labelMode: 'floating',
                                colCount: 2,
                                items: [
                                    {
                                        dataField: "IDNO",
                                        label: { text: "ID NO" },
                                        width: 100,
                                        editorType: "dxTextBox",
                                        editorOptions: { width: 100, readOnly: true },
                                        visible: isVisible,
                                        colSpan: 1,
                                    },
                                    {
                                        dataField: "TaskGroup",
                                        label: { text: "Group" },
                                        //editorType: "dxTextBox",
                                        //editorOptions: { width: 200, },
                                        editorType: "dxSelectBox", //dxSelectBox dxLookup
                                        //editorType: "dxTextArea",
                                        editorOptions: {
                                            dataSource: aObjects.aTaskProgram, //aaPurposeTable
                                            searchExpr: "PNAME",
                                            valueExpr: "code",
                                            displayExpr: "PNAME",
                                            searchEnabled: true,
                                            width: 200,
                                            // readOnly: function (e) {
                                            //     return (aMMaMx === "Developer" || aMMaMx === "admin");
                                            // },
                                            readOnly: !isVisible,
                                            //value: aNewDiva,
                                            // onValueChanged: function (e) {
                                            //     asERORefNo1 = e.value;
                                            // },
                                        },
                                        visible: isVisible,
                                        colSpan: 1,
                                    },
                                    {
                                        dataField: "TaskDescription",
                                        caption: "Description",
                                        width: 250,
                                        editorType: "dxTextArea",
                                        editorOptions: { width: "100%", height: 80 }, //width: 750
                                        //visible: isVisible,
                                        colSpan: 2,
                                    },
                                    {
                                        dataField: "TaskName",
                                        label: { text: "Variable" },
                                        width: 200,
                                        editorType: "dxTextBox",
                                        editorOptions: { width: 400 },
                                        visible: isVisible,
                                        colSpan: 2,
                                    },
                                    {
                                        dataField: "TaskProgram",
                                        label: { text: "HTML Format" },
                                        editorType: "dxHtmlEditor",
                                        colSpan: 2,
                                        editorOptions: {
                                            width: "100%",
                                            height: 400,
                                            valueType: "html",
                                            imageUpload: {
                                                tabs: ['file', 'url'],
                                                fileUploadMode: 'base64',
                                            },
                                            toolbar: {
                                                multiline: true,
                                                items: [
                                                    'undo', 'redo', 'separator',
                                                    {
                                                        name: 'size',
                                                        acceptedValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'],
                                                    },
                                                    {
                                                        name: 'font',
                                                        acceptedValues: ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'],
                                                    },
                                                    'separator', 'bold', 'italic', 'strike', 'underline', 'separator',
                                                    'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'separator',
                                                    'orderedList', 'bulletList', 'separator',
                                                    {
                                                        name: 'header',
                                                        acceptedValues: [false, 1, 2, 3, 4, 5],
                                                    }, 'separator',
                                                    'color', 'background', 'separator',
                                                    'link', 'image', 'separator',
                                                    'clear', 'codeBlock', 'blockquote', 'separator',
                                                    'insertTable', 'deleteTable',
                                                    'insertRowAbove', 'insertRowBelow', 'deleteRow',
                                                    'insertColumnLeft', 'insertColumnRight', 'deleteColumn',
                                                    {
                                                        widget: 'dxButton',
                                                        options: {
                                                            text: 'Edit Markup',
                                                            stylingMode: 'text',
                                                            onClick() {
                                                                popupInstance.show();
                                                                $('.markup-editor').val(editor.option('value'));
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                            mediaResizing: {
                                                enabled: true
                                            }
                                        }

                                    },
                                    {
                                        dataField: "TaskProgram",
                                        label: { text: "Task (Text)" },
                                        width: 300,
                                        editorType: "dxTextArea",
                                        editorOptions: { width: "100%", height: 300 }, // width: "750"   height: 320
                                        setCellValue: function (newData, value, currentRowData) {
                                            newData.asTaskProgram = value; //value.slice(0, 4);                                                
                                            asTaskProgram = value

                                        },
                                        colSpan: 2,
                                    },
                                ]
                            },
                            popup: {
                                title: adgHeader === "admin" ? "Task Control Info" : "Setup Group",
                                fullScreen: false,
                                showTitle: true,
                                resizeEnabled: true, // Allow resizing
                                width: 1400,
                                height: 820,
                                position: {
                                    my: "top",
                                    at: "top",
                                    of: "window",
                                    offset: "-100 30"
                                },
                                // onShowing: function (e) {
                                //     const rowData = e.component.getSelectedRowsData()[0]; // Get selected row data
                                //     initializeHtmlEditor(rowData.TaskProgram, (updatedValue) => {
                                //         rowData.TaskProgram = updatedValue; // Update field with new value
                                //         e.component.refresh(); // Refresh grid after editing
                                //     });
                                // },
                                toolbarItems: [
                                    {
                                        widget: "dxButton",
                                        toolbar: "bottom",
                                        location: "after",
                                        options: {
                                            text: "Save",
                                            onClick: function (e) {
                                                const popup = e.component;
                                                $("#gridContainer").dxDataGrid("instance").saveEditData();
                                            }
                                        }
                                    },
                                    {
                                        widget: "dxButton",
                                        toolbar: "bottom",
                                        location: "after",
                                        options: {
                                            text: "Cancel",
                                            onClick: function (e) {
                                                const popup = e.component;
                                                $("#gridContainer").dxDataGrid("instance").cancelEditData();
                                            }
                                        }
                                    },
                                    // {
                                    //     widget: "dxButton",
                                    //     toolbar: "bottom",
                                    //     location: "after",
                                    //     options: {
                                    //         text: "VIEW Program/Text",
                                    //         onClick: function (e) {
                                    //             //DevExpress.ui.alert("Custom action executed!", "info", 2000);
                                    //             DevExpress.ui.dialog.alert({ showTitle: true, title: "Program/Text VIEW", messageHtml: asTaskProgram });
                                    //         }
                                    //     }
                                    // }
                                ],
                                onContentReady: function (e) {
                                    e.component.option('toolbarItems[0].visible', aSaveVisible);
                                    e.component.option('toolbarItems[0].options.icon', 'save');
                                    e.component.option('toolbarItems[0].options.type', 'success');
                                    e.component.option('toolbarItems[1].options.text', aCancelText);
                                    e.component.option('toolbarItems[1].options.icon', aCancelicon);
                                    e.component.option('toolbarItems[1].options.type', aCancelType);
                                }
                            }
                        },

                        // column list
                        columns: [
                            {
                                type: "buttons",
                                width: 20,
                                visible: function (e) {
                                    const isJsonEditVisible = (e.row?.data?.TaskName || "").toLowerCase().includes("{t2o}");
                                    return (!isJsonEditVisible && (isVisible || aMMaMx === "faSupervisor")) || isVisible;
                                },
                                buttons: [
                                    {
                                        name: "edit",
                                        visible: function (e) {
                                            const isJsonEditVisible = (e.row?.data?.TaskName || "").toLowerCase().includes("{t2o}");
                                            return (!isJsonEditVisible && (isVisible || aMMaMx === "faSupervisor")) || isVisible;
                                        },
                                    },
                                ]
                            },
                            {
                                type: "buttons",
                                width: 20,
                                visible: isVisible,
                                buttons: [
                                    {
                                        name: "delete",
                                    },
                                ]
                            },
                            {
                                type: "buttons",
                                width: 20,
                                visible: isVisible,
                                buttons: [
                                    {
                                        hint: "Clone this Line",
                                        icon: "fas fa-clone",
                                        visible: isVisible,
                                        onClick: (e) => {
                                            let result = DevExpress.ui.dialog.confirm("Are you sure to clone this RECORD ? <br> ", "CLONE THIS RECORD ?");
                                            result.done(function (dresult) {
                                                if (dresult) {
                                                    aSaveCloneN(e.row.data, aaTBKey, aaPFDMI, aaXToX)

                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                }
                                            })
                                        }
                                    },
                                ]
                            },
                            {
                                type: "buttons",
                                width: 20,
                                visible: function (e) {
                                    const name = (e.row?.data?.TaskName || "").toLowerCase();
                                    return isVisible || !(name.includes("{t2o}")); //(aMMaMx === "Developer" || aMMaMx === "admin")
                                },
                                buttons: [
                                    {
                                        hint: "Template/Program Preview",
                                        icon: "fas fa-poll-h", //"fas fa-trash-alt", //fa-trash // fas fa-poll-h //fas fa-file-code
                                        /*elementAttr: { class: "custom-icon-size"}, // Apply the custom icon size class
                                        cssClass: "custom-icon-size",*/
                                        //visible: true,
                                        visible: function (e) {
                                            const name = (e.row?.data?.TaskName || "").toLowerCase();
                                            return isVisible || !(name.includes("{t2o}")); //(aMMaMx === "Developer" || aMMaMx === "admin")
                                        },
                                        onClick: function (e) {
                                            if (e.row.data.TaskName.includes("HELP")) {
                                                aPopupHelp("Template/Program [VIEW]", e.row.data.TaskProgram.replace(/`/g, "'"))
                                            } else {
                                                DevExpress.ui.dialog.alert({ showTitle: true, title: "Template/Program [VIEW]", messageHtml: e.row.data.TaskProgram.replace(/`/g, "'") });
                                            }
                                        }
                                    },
                                ]
                            },
                            {
                                type: "buttons",
                                width: 20,
                                buttons: [
                                    {
                                        hint: "Modify Record", //adgHeader === "admin" ? "EDIT JSON" : "Edit", //"EDIT JSON", //(aMMaMx === "Developer" || aMMaMx === "admin") ? "EDIT JSON" : "Edit", //
                                        icon: "fas fa-pencil-alt", //adgHeader === "admin" ? "fas fa-code" : "fas fa-pencil-alt", //"fas fa-code", //(aMMaMx === "Developer" || aMMaMx === "admin") ? "fas fa-code" : "fas fa-pencil-alt",
                                        visible: function (e) {
                                            const name = (e.row?.data?.TaskName || "").toLowerCase();
                                            return name.includes("{t2o}");
                                        },
                                        onClick: function (e) {
                                            // ส่งทั้งค่า และ reference ของ row เข้าไป Add, Edit, Del (CRUD) json
                                            editTaskProgram(e.row.data.TaskProgram, e.row.data, e.component);
                                        }
                                    },
                                    {
                                        hint: "EDIT Task Table Config",
                                        icon: "fas fa-edit",
                                        visible: function (e) {
                                            const name = (e.row?.data?.TaskName || "").toLowerCase();
                                            return name.includes("tasktableconfig");
                                        },
                                        onClick: function (e) {
                                            editTaskTable(e.row.data.TaskProgram, e.row.data, e.component);
                                        }
                                    },
                                    {
                                        hint: "EDIT Chatbot",
                                        icon: "fas fa-headset", // "fas fa-smile"
                                        visible: function (e) {
                                            return typeof e.row?.data?.TaskProgram === "string" && e.row.data.TaskProgram.includes("|") && (aMMaMx === "Developer" || aMMaMx === "admin");
                                        },
                                        onClick: function (e) {
                                            //manageTaskProgram(e.row.data, e.component);
                                            //editKeyValueProgram(e.row.data.TaskProgram, e.row.data, e.component);
                                            editKeyValueProgram(
                                                e.row.data.TaskProgram, // raw text to parse
                                                e.row.data,             // row object (contains key and TaskProgram)
                                                e.component,            // parent grid instance
                                                null,                   // parentForm (not used here)
                                                null,                   // standalone editor selector (not used here)
                                                {                       // context for aSaveMemToDB
                                                    aaTBKey: aaTBKey,
                                                    aaPFDMI: aaPFDMI,
                                                    aaXToX: aaXToX
                                                }
                                            );
                                        }
                                    },
                                ]
                            },

                            {
                                type: "buttons",
                                width: 20,
                                buttons: [
                                    {
                                        hint: "Trans Excel file to json",
                                        icon: "fas fa-file-excel", //xlsxfile
                                        visible: function (e) {
                                            const name = (e.row?.data?.TaskName || "").toLowerCase();
                                            return name.includes("{json buffer}");
                                        },
                                        onClick: function (e) {
                                            // Pass row event context to popup
                                            loadExcelPopup(e, {
                                                onLoaded: function (jsonStr, file) {
                                                    console.log("TaskProgram JSON length:", jsonStr.length, "file:", file?.name);
                                                }
                                            });
                                        }
                                    }
                                ]
                            },
                            {
                                type: "buttons",
                                width: 28,
                                buttons: [
                                    {
                                        hint: "Transform JSON string to Excel",
                                        icon: "fas fa-download",
                                        visible: function (e) {
                                            const name = (e.row?.data?.TaskName || "").toLowerCase();
                                            return name.includes("{json buffer}");
                                        },
                                        onClick: async function (e) {
                                            try {
                                                // 1) Get JSON string from TaskProgram
                                                const jsonStr = e.row.data.TaskProgram;

                                                // 2) Convert JSON string -> Buffer
                                                const buffer = jsonToBuffer(jsonStr);

                                                // 3) Load buffer into ExcelJS
                                                const workbook = new ExcelJS.Workbook();
                                                await workbook.xlsx.load(buffer);
                                                const safeName = "TEMPLATE"
                                                const outBuffer = await workbook.xlsx.writeBuffer();
                                                saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), `${safeName}.xlsx`);
                                                // const outFile = new File(
                                                //     [outBuffer],
                                                //     `${safeName}.xlsx`,
                                                //     { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                                                // );
                                                //const uploadedName = await u2pload2File(outFile);
                                            } catch (err) {
                                                console.error("Error transforming JSON to Excel:", err);
                                                DevExpress.ui.notify("Failed to transform JSON to Excel.", "error", 3000);
                                            }
                                        }
                                    }
                                ]
                            },

                            {
                                dataField: "IDNO",
                                caption: "ID NO",

                                width: 100,
                                //allowHiding: false,
                                editorType: "dxTextBox",
                                editorOptions: { width: 100, readOnly: true },
                                visible: false,
                            },
                            {
                                dataField: "TaskGroup",
                                caption: "Group",
                                sortOrder: "asc",
                                width: (adgHeader === "admin" ? 150 : 400),
                                dataType: "string",
                                lookup: {
                                    dataSource: aObjects.aTaskProgram,
                                    valueExpr: "code",
                                    displayExpr: "PNAME",
                                },
                                editorOptions: { width: (adgHeader === "admin" ? 150 : 400), readOnly: !isVisible },
                            },
                            {
                                dataField: "TaskDescription",
                                caption: "Description",
                                width: (adgHeader === "admin" ? 250 : 600),
                                editorType: "dxTextBox",
                                editorOptions: { width: (adgHeader === "admin" ? 250 : 600), readOnly: !isVisible, },
                            },
                            {
                                dataField: "TaskName",
                                caption: "Variables",
                                width: 250,
                                editorType: "dxTextBox",
                                editorOptions: { width: 250 },
                                visible: (adgHeader === "admin"),
                            },
                            {
                                dataField: "TaskProgram",
                                caption: "Template/Program",
                                width: 500,
                                height: 200,
                                visible: (adgHeader === "admin"),
                            },
                        ],
                        // summary
                        summary: {
                            recalculateWhileEditing: true,
                            skipEmptyValues: false,
                            totalItems: [
                                {
                                    column: "TaskGroup",
                                    summaryType: "count",
                                    displayFormat: "{0} Items",
                                },
                            ],
                            groupItems: [
                                {
                                    column: "TaskGroup",
                                    summaryType: "count",
                                    displayFormat: "{0} Items",
                                },
                            ],
                        },
                        // Tool Bar
                        onToolbarPreparing: function (e) {
                            var dataGrid = e.component;
                            e.toolbarOptions.items.unshift(
                                {
                                    location: "before",
                                    widget: "dxButton",
                                    options: {
                                        icon: "fas fa-info",
                                        text: "HELP",
                                        type: "default",
                                        stylingMode: "contained", // "outlined" contained
                                        onClick: function () {
                                            aPopupHelp("HELP", aVARs.APOPUPHELP) //"./images/All Slide-Training Expense Reimbursement System.pdf#view=FitH" //"./Help.html" "https://cbsdev2.locktonwattana.com/xol/index.html"
                                        }
                                    }
                                },
                                {
                                    location: "after",
                                    widget: "dxButton",
                                    type: "success",
                                    options: {
                                        icon: 'collapse',
                                        text: 'Collapse All',
                                        width: 140,
                                        onClick: function (e) {
                                            var expanding = e.component.option("text") === "Expand All";
                                            dataGrid.option("grouping.autoExpandAll", expanding);
                                            e.component.option("text", expanding ? "Collapse All" : "Expand All");
                                            e.component.option("icon", expanding ? "collapse" : "expand");
                                        }
                                    }
                                },
                                {
                                    location: "after",
                                    widget: "dxButton",
                                    visible: arPDFEx,
                                    options: {
                                        icon: "exportpdf",
                                        text: "Export to PDF",
                                        onClick: function () {
                                            const doc = new jsPDF();
                                            DevExpress.pdfExporter.exportDataGrid({
                                                jsPDFDocument: doc,
                                                component: dataGrid
                                            }).then(function () {
                                                doc.save('TaskControl' + '.pdf');
                                            });
                                        }
                                    }
                                },
                                {
                                    location: "after",
                                    widget: "dxButton",
                                    options: {
                                        icon: "refresh",
                                        onClick: function () {
                                            dataGrid.refresh();
                                        }
                                    }
                                }
                            );
                        }

                    }).dxDataGrid("instance");

                    function dropDownBoxACCC(cellElement, cellInfo) { //, options = { copyTo: "ACCDesc", copyFrom: "EDESC" }
                        const aaTBKey = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
                        const axqr2S = `WHERE EXPGroup LIKE '%${aaERTYPE}%'`;
                        const axFieldSelected = "ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE,EXPGroup,EXPDesc";
                        const axFullBody = `SELECT ${axFieldSelected} FROM ExtraOnLine.dbo.ACCOUNTCHART ${axqr2S}`;
                        const url = `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/${aaTBKey}`;

                        const cached = window._cachedACCDropdownData;
                        const dataSource = cached
                            ? cached
                            : new DevExpress.data.CustomStore({
                                key: "ACCCODE",
                                loadMode: "raw",
                                load: () =>
                                    fetch(url, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ "@": btoa(axFullBody) }),
                                        redirect: "follow"
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            window._cachedACCDropdownData = data;
                                            return data;
                                        })
                                        .catch(err => {
                                            DevExpress.ui.dialog.alert("Failed to load account chart: " + err.message, "Error");
                                            return [];
                                        })
                            });

                        return $("<div>").dxDropDownBox({
                            dropDownOptions: { width: 1100 },
                            dataSource,
                            value: cellInfo.value,
                            valueExpr: "ACCCODE",
                            displayExpr: "ACCCODE", //item => item ? `${item.ACCCODE}` : "", // | ${item.EDESC} | ${item.TDESC}
                            contentTemplate: e =>
                                $("<div>").dxDataGrid({
                                    dataSource: e.component.option("dataSource"),
                                    columns: [
                                        { dataField: "EDESC", caption: "Eng Desc.", width: 300 },
                                        { dataField: "TDESC", caption: "Thai Desc", width: 300 },
                                        { dataField: "ACCCODE", caption: "Account Code", width: 100, sortOrder: "asc" },
                                        { dataField: "EXPGroup", caption: "Group", width: 120 },
                                        { dataField: "EXPDesc", caption: "Group Desc", width: 200 }
                                    ],
                                    searchPanel: { visible: true },
                                    filterRow: { visible: true },
                                    paging: { enabled: true, pageSize: 20 },
                                    scrolling: { mode: "virtual" },
                                    selection: { mode: "single" },
                                    height: 450,
                                    showBorders: true,
                                    selectedRowKeys: [cellInfo.value],
                                    focusedRowKey: cellInfo.value,
                                    onSelectionChanged: sArgs => {
                                        const selected = sArgs.selectedRowKeys[0];
                                        if (selected) {
                                            e.component.option("value", selected.ACCCODE);
                                            cellInfo.setValue(selected.ACCCODE);
                                            e.component.close();
                                        }
                                    }
                                })
                        });
                    }

                    function dropDownBoxEMP(cellElement, cellInfo) { //, options = {copyTo: "EMPName", copyFrom: "FullNameEng"}
                        const aaTBKey = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
                        const axqr2S = "WHERE Status != 'Resigned'";
                        const axFieldSelected = "EMPCode,FullNameThai,FullNameEng,Dept,DivCode,EmailAddress,Position,AccDeptCode,AccDivCode";
                        const axFullBody = `SELECT ${axFieldSelected} FROM ExtraOnLine.dbo.XOLStaffs ${axqr2S}`;
                        const url = `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/${aaTBKey}`;

                        const cached = window._cachedEMPDropdownData;
                        const edataSource = cached
                            ? cached
                            : new DevExpress.data.CustomStore({
                                key: "EMPCode",
                                loadMode: "raw",
                                load: () =>
                                    fetch(url, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ "@": btoa(axFullBody) }),
                                        redirect: "follow"
                                    })
                                        .then(res => res.json())
                                        .then(data => {
                                            window._cachedEMPDropdownData = data;
                                            return data;
                                        })
                                        .catch(err => {
                                            DevExpress.ui.dialog.alert("Failed to load employee list: " + err.message, "Error");
                                            return [];
                                        })
                            });
                        return $("<div>").dxDropDownBox({
                            dropDownOptions: { width: 1100 },
                            dataSource: edataSource,
                            value: cellInfo.value,
                            valueExpr: "EMPCode",
                            displayExpr: "EMPCode", //item => item ? `${item.EMPCode}` : "",
                            contentTemplate: e =>
                                $("<div>").dxDataGrid({
                                    dataSource: e.component.option("dataSource"),
                                    columns: [
                                        { dataField: "AccDeptCode", caption: "Dept", width: 100 },
                                        { dataField: "EMPCode", caption: "ID", width: 80 },
                                        { dataField: "FullNameThai", caption: "Thai Name", width: 200 },
                                        { dataField: "FullNameEng", caption: "Eng Name", width: 200 },
                                        { dataField: "Position", caption: "Position", width: 200 }
                                    ],
                                    searchPanel: { visible: true },
                                    filterRow: { visible: true },
                                    paging: { enabled: true, pageSize: 20 },
                                    scrolling: { mode: "virtual" },
                                    selection: { mode: "single" },
                                    height: 450,
                                    showBorders: true,
                                    selectedRowKeys: [cellInfo.value],
                                    focusedRowKey: cellInfo.value,
                                    onSelectionChanged: sArgs => {
                                        const selectedRow = sArgs.selectedRowsData && sArgs.selectedRowsData[0];
                                        if (selectedRow) {
                                            // Set EMPCode into this cell
                                            cellInfo.setValue(selectedRow.EMPCode);
                                            e.component.close();
                                        }
                                    }
                                })
                        });
                    }

                    // function dropDownBoxEMP(cellElement, cellInfo, options = {}) {
                    //     const aaTBKey = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
                    //     const axqr2S = "WHERE Status != 'Resigned'";
                    //     const axFieldSelected = "EMPCode,FullNameThai,FullNameEng,Dept,DivCode,EmailAddress,Position,AccDeptCode,AccDivCode";
                    //     const axFullBody = `SELECT ${axFieldSelected} FROM ExtraOnLine.dbo.XOLStaffs ${axqr2S}`;
                    //     const url = `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/${aaTBKey}`;

                    //     const cached = window._cachedEMPDropdownData;
                    //     const edataSource = cached
                    //       ? cached
                    //       : new DevExpress.data.CustomStore({
                    //           key: "EMPCode",
                    //           loadMode: "raw",
                    //           load: () =>
                    //             fetch(url, {
                    //               method: "POST",
                    //               headers: { "Content-Type": "application/json" },
                    //               body: JSON.stringify({ "@": btoa(axFullBody) }),
                    //               redirect: "follow"
                    //             })
                    //               .then(res => res.json())
                    //               .then(data => {
                    //                 window._cachedEMPDropdownData = data;
                    //                 return data;
                    //               })
                    //               .catch(err => {
                    //                 DevExpress.ui.dialog.alert("Failed to load employee list: " + err.message, "Error");
                    //                 return [];
                    //               })
                    //         });

                    //     // Build the dropdown editor inside the cell
                    //     const $editor = $("<div>").dxDropDownBox({
                    //       // Show arrow when cell is in edit mode (DevExtreme behavior)
                    //       dropDownOptions: { width: 1100 },
                    //       deferRendering: false,
                    //       dataSource: edataSource,
                    //       value: cellInfo.value,
                    //       valueExpr: "EMPCode",
                    //       displayExpr: item => (item ? `${item.EMPCode}` : ""),
                    //       contentTemplate: e => {
                    //         const $grid = $("<div>").dxDataGrid({
                    //           dataSource: edataSource,
                    //           columns: [
                    //             { dataField: "AccDeptCode", caption: "Dept", width: 100 },
                    //             { dataField: "EMPCode", caption: "ID", width: 80 },
                    //             { dataField: "FullNameThai", caption: "Thai Name", width: 200 },
                    //             { dataField: "FullNameEng", caption: "Eng Name", width: 200 },
                    //             { dataField: "Position", caption: "Position", width: 200 }
                    //           ],
                    //           searchPanel: { visible: true },
                    //           filterRow: { visible: true },
                    //           paging: { enabled: true, pageSize: 20 },
                    //           scrolling: { mode: "virtual" },
                    //           selection: { mode: "single" },
                    //           height: 450,
                    //           showBorders: true,
                    //           selectedRowKeys: [cellInfo.value],
                    //           focusedRowKey: cellInfo.value,
                    //           onSelectionChanged: sArgs => {
                    //             const selectedRow = sArgs.selectedRowsData && sArgs.selectedRowsData[0];
                    //             if (selectedRow) {
                    //               // Set main value into the cell (commits on save/end edit)
                    //               cellInfo.setValue(selectedRow.EMPCode);

                    //               // Copy extra field dynamically if provided
                    //               if (options.copyTo && options.copyFrom && selectedRow.hasOwnProperty(options.copyFrom)) {
                    //                 cellInfo.data[options.copyTo] = selectedRow[options.copyFrom];
                    //               }

                    //               // Reflect new value in the editor and close
                    //               e.component.option("value", selectedRow.EMPCode);
                    //               e.component.close();
                    //             }
                    //           }
                    //         });

                    //         return $grid;
                    //       }
                    //     });

                    //     // Append the editor element to the cell and return it
                    //     $(cellElement).append($editor);
                    //     return $editor;
                    //   }



                    // function dropDownBoxGeneric(cellElement, cellInfo, options = {}) {
                    //     const {
                    //       endpoint,     // required: full URL to POST
                    //       sql,          // required: full SELECT statement
                    //       cacheKey,     // optional: global cache key, e.g. "_cachedEMPDropdownData"
                    //       keyExpr,      // required: primary key in dataset, e.g. "EMPCode"
                    //       valueExpr,    // required: value bound to the edited cell, e.g. "EMPCode"
                    //       copyTo,       // optional: target field in the row to copy to
                    //       copyFrom,     // optional: source field in dataset to copy from
                    //       gridColumns,  // required: [{ dataField, caption, width, sortOrder? }, ...]
                    //       collapsedDisplayFormat // optional: "{EMPCode} | {FullNameThai} | {FullNameEng}"
                    //     } = options;

                    //     if (!endpoint || !sql || !keyExpr || !valueExpr || !Array.isArray(gridColumns)) {
                    //       DevExpress.ui.dialog.alert("Invalid dropdown configuration", "Error");
                    //       return $("<div>");
                    //     }

                    //     const cached = cacheKey ? window[cacheKey] : undefined;

                    //     const ds = cached
                    //       ? cached
                    //       : new DevExpress.data.CustomStore({
                    //           key: keyExpr,
                    //           loadMode: "raw",
                    //           load: () =>
                    //             fetch(endpoint, {
                    //               method: "POST",
                    //               headers: { "Content-Type": "application/json" },
                    //               body: JSON.stringify({ "@": btoa(sql) }),
                    //               redirect: "follow"
                    //             })
                    //               .then(res => res.json())
                    //               .then(data => {
                    //                 if (cacheKey) window[cacheKey] = data;
                    //                 return data;
                    //               })
                    //               .catch(err => {
                    //                 DevExpress.ui.dialog.alert("Failed to load dropdown data: " + err.message, "Error");
                    //                 return [];
                    //               })
                    //         });

                    //     return $("<div>").dxDropDownBox({
                    //       dropDownOptions: { width: 1100 },
                    //       dataSource: ds,
                    //       value: cellInfo.value,
                    //       valueExpr,

                    //       displayExpr: item => {
                    //         if (!item) return "";
                    //         if (typeof collapsedDisplayFormat === "string") {
                    //           return collapsedDisplayFormat.replace(/\{(\w+)\}/g, (_, key) => item[key] ?? "");
                    //         }
                    //         // fallback to valueExpr if no format provided
                    //         return item[valueExpr];
                    //       },

                    //       contentTemplate: e =>
                    //         $("<div>").dxDataGrid({
                    //           dataSource: e.component.option("dataSource"),
                    //           columns: gridColumns,
                    //           searchPanel: { visible: true },
                    //           headerFilter: { visible: true },
                    //           filterRow: { visible: true },
                    //           paging: { enabled: true, pageSize: 20 },
                    //           scrolling: { mode: "virtual" },
                    //           selection: { mode: "single" },
                    //           height: 450,
                    //           showBorders: true,
                    //           selectedRowKeys: [cellInfo.value],
                    //           focusedRowKey: cellInfo.value,

                    //           onSelectionChanged: sArgs => {
                    //             const selectedKey = sArgs.selectedRowKeys[0];
                    //             const selected = Array.isArray(sArgs.selectedRowsData) && sArgs.selectedRowsData[0]
                    //               ? sArgs.selectedRowsData[0]
                    //               : null;

                    //             if (selectedKey && selected) {
                    //               // Set main value into this cell
                    //               e.component.option("value", selected[valueExpr]);
                    //               cellInfo.setValue(selected[valueExpr]);

                    //               // Copy extra field dynamically if both provided
                    //               if (copyTo && copyFrom && selected.hasOwnProperty(copyFrom)) {
                    //                 cellInfo.data[copyTo] = selected[copyFrom];
                    //               }

                    //               e.component.close();
                    //             }
                    //           }
                    //         })
                    //     });
                    //   }


                    // ฟังก์ชัน normalize: คืนค่า array เสมอ
                    function normalizeTaskProgram(input) {
                        if (Array.isArray(input)) {
                            return input;
                        }
                        if (typeof input === "string") {
                            let str = input.trim();
                            // ถ้าไม่ได้ขึ้นต้นด้วย [ ให้ห่อ []
                            if (!str.startsWith("[")) {
                                str = "[" + str + "]";
                            }
                            try {
                                return JSON.parse(str);
                            } catch (e) {
                                console.error("Invalid JSON format:", e);
                                return null;
                            }
                        }
                        return null;
                    }

                    // ----------------- Main function -----------------
                    function editTaskProgram(aTaskProgram, rowData, parentGrid) {
                        const configText = aVARs.TaskTableConfig; // ✅ Use external config source
                        const aTaskTableConfig = JSON.parse(configText);

                        let aTaskEdit = normalizeTaskProgram(aTaskProgram);
                        if (!Array.isArray(aTaskEdit) || aTaskEdit.length === 0) {
                            DevExpress.ui.dialog.alert("TaskProgram format invalid or empty", "Error");
                            return;
                        }
                        //Show at title: title
                        //let headerText = (typeof rowData.TaskProgram !== "undefined") ? (rowData.TaskDescriptions.match(/\[([^\]]+)\]/)?.[1] || "") : "";
                        //let headerText = (typeof rowData.TaskDescription !== "undefined") ? rowData.TaskDescription.match(/\[(.*?)\]/)?.[1] || "" : "";
                        let jsonTableName = (typeof rowData.TaskName !== "undefined") ? rowData.TaskName.match(/\[(.*?)\]/)?.[1] || "" : "";
                        //alert(jsonTableName)


                        // Keep original string for preserving format on save
                        // let originalText = (typeof rowData.TaskProgram !== "undefined") ? rowData.TaskProgram :
                        //     (typeof rowData.TaksProgram !== "undefined" ? rowData.TaksProgram : "");  // Previous
                        let originalText = rowData.TaskProgram || rowData.TaksProgram || "";
                        // Collect all fields dynamically
                        let allFields = [];
                        aTaskEdit.forEach(obj => {
                            Object.keys(obj).forEach(k => { if (!allFields.includes(k)) allFields.push(k); });
                        });

                        // Build dynamic columns (captions = field names)
                        //let dynamicColumns = allFields.map(f => ({ dataField: f, caption: f }));

                        // 🔍 Find matching config
                        const tableConfig = aTaskTableConfig.find(cfg => cfg.jsonName === jsonTableName);
                        if (!tableConfig) {
                            DevExpress.ui.dialog.alert("No matching config found for " + jsonTableName, "Error");
                            return;
                        }
                        const headerText = tableConfig?.Title || "For Value: " + jsonTableName;
                        const aPopupWidth = tableConfig?.PopupWidth || 1000;
                        const aPopupHeight = tableConfig?.PopupHeight || 700;
                        const adgMode = tableConfig?.dgMode || "cell";
                        // 🧱 Build dxDataGrid columns from Fieldss
                        // const dynamicColumns = [
                        //     {
                        //         type: "buttons",
                        //         width: 110,
                        //         buttons: ["edit", "delete"],
                        //         visible: true,
                        //     },
                        //     ...tableConfig.Fieldss.map(field => ({
                        //         dataField: field.Name,
                        //         caption: field.Caption,
                        //         dataType: field.Type ?? "string",
                        //         editorType: field.DxType ?? "dxTextBox",
                        //         width: field.Width ?? 100,
                        //         validationRules: field.validationRules ?? [],
                        //         visible: field.visible,

                        //         // ✅ Format for display (grid cell)
                        //         format: field.DxType === "dxNumberBox" ? "#,##0.00" : undefined,

                        //         // ✅ Align display cell content
                        //         alignment: field.DxType === "dxNumberBox" ? "right" : "left",

                        //         // ✅ Format for editor (input box)
                        //         editorOptions: field.DxType === "dxNumberBox" ? {
                        //             format: "#,##0.00",
                        //             showSpinButtons: true
                        //         } : undefined
                        //     }))
                        // ];
                        // const dynamicColumns = [
                        //     {
                        //       type: "buttons",
                        //       width: 110,
                        //       buttons: ["edit", "delete"],
                        //       visible: true,
                        //     },
                        //     ...tableConfig.Fieldss.map(field => {
                        //         const isNumber = field.DxType === "dxNumberBox";
                        //         const isSelectBox = field.DxType === "dxSelectBox";
                        //         const isLookup = field.DxType === "lookup";
                        //         const isCustom = field.DxType === "custom";

                        //         const valueExpr = field.valueExpr || "value";
                        //         const displayExpr = field.displayExpr || "label";

                        //         const validationRules = field.validationRules ?? [];
                        //         if (field.required) {
                        //           validationRules.push({ type: "required", message: `${field.Caption} is required` });
                        //         }

                        //         const column = {
                        //           dataField: field.Name,
                        //           caption: field.Caption,
                        //           dataType: field.Type ?? "string",
                        //           width: field.Width ?? 100,
                        //           validationRules,
                        //           visible: field.visible,
                        //           format: isNumber ? "#,##0.00" : undefined,
                        //           alignment: isNumber ? "right" : "left"
                        //         };

                        //         if (isNumber) {
                        //           column.editorType = "dxNumberBox";
                        //           column.editorOptions = { format: "#,##0.00", showSpinButtons: true };
                        //         } else if (isSelectBox) {
                        //           column.editorType = "dxSelectBox";
                        //           column.editorOptions = {
                        //             dataSource: field.Options ?? [],
                        //             valueExpr,
                        //             displayExpr,
                        //             searchEnabled: field.searchEnabled ?? false
                        //           };
                        //         } else if (isLookup && field.Options) {
                        //           column.lookup = {
                        //             dataSource: field.Options,
                        //             valueExpr,
                        //             displayExpr,
                        //             searchEnabled: field.searchEnabled ?? false
                        //           };
                        //         } else if (isCustom && field.editorTemplate) {
                        //             const fn = window[field.editorTemplate];
                        //             if (typeof fn === "function") {
                        //               column.editCellTemplate = (cellElement, cellInfo) =>
                        //                 fn(cellElement, cellInfo, {
                        //                   copyTo: field.copyTo,
                        //                   copyFrom: field.copyFrom
                        //                 });
                        //             }
                        //           }

                        //         return column;
                        //       })

                        //   ];
                        const dynamicColumns = [
                            {
                                type: "buttons",
                                width: 110,
                                buttons: ["edit", "delete"],
                                visible: true
                            },
                            ...tableConfig.Fieldss.map(field => {
                                const isNumber = field.DxType === "dxNumberBox";
                                const isSelectBox = field.DxType === "dxSelectBox";
                                const isLookup = field.DxType === "lookup";
                                const isCustom = field.DxType === "custom";

                                const validationRules = field.validationRules ?? [];
                                if (field.required) {
                                    validationRules.push({ type: "required", message: `${field.Caption} is required` });
                                }

                                const column = {
                                    dataField: field.Name,
                                    caption: field.Caption,
                                    dataType: field.Type ?? "string",
                                    width: field.Width ?? 100,
                                    validationRules,
                                    visible: field.visible,
                                    format: isNumber ? "#,##0.00" : undefined,
                                    alignment: isNumber ? "right" : "left"
                                };
                                if (isNumber) {
                                    column.editorType = "dxNumberBox";
                                    column.editorOptions = { format: "#,##0.00", showSpinButtons: true };
                                } else if (isSelectBox) {
                                    column.editorType = "dxSelectBox";
                                    column.editorOptions = {
                                        dataSource: field.Options ?? [],
                                        valueExpr: field.valueExpr || "value",
                                        displayExpr: field.displayExpr || "label",
                                        searchEnabled: field.searchEnabled ?? false
                                    };
                                } else if (isLookup && field.Options) {
                                    column.lookup = {
                                        dataSource: field.Options,
                                        valueExpr: field.valueExpr || "value",
                                        displayExpr: field.displayExpr || "label"
                                    };
                                } else if (isCustom && field.editorTemplate) {
                                    if (field.editorTemplate === "dropDownBoxEMP") {
                                        column.editCellTemplate = dropDownBoxEMP;
                                        // 👇 Add setCellValue so dependent fields update automatically
                                        column.setCellValue = function (newData, value, currentRowData) {
                                            newData.EMPID = value;
                                            // Hard‑coded mapping: EMPName = FullNameEng
                                            // If you have the selected row cached, you can resolve it here.
                                            const selected = (window._cachedEMPDropdownData || []).find(x => x.EMPCode === value);
                                            if (selected) {
                                                newData.EmpName = selected.FullNameEng.toUpperCase();
                                            }
                                        };
                                    }
                                }

                                return column;
                            })
                        ];


                        // ensure popup exists
                        if ($("#popupEDITJSON").length === 0) {
                            $("<div id='popupEDITJSON'></div>").appendTo("body");
                        }

                        let popupInstance = null; // ✅ ประกาศไว้ด้านบนสุดของไฟล์หรือฟังก์ชัน
                        popupInstance = $("#popupEDITJSON").dxPopup({
                            title: headerText, //"Edit TaskProgram",
                            visible: true,
                            width: aPopupWidth,   // wider popup
                            height: aPopupHeight,   // taller popup
                            position: { my: "top center", at: "top center", of: window, offset: { y: 10 } },
                            showCloseButton: true,
                            contentTemplate: function (contentElement) {
                                contentElement.empty();
                                const wrapper = $("<div>")
                                    .css({
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                        padding: "10px",
                                        boxSizing: "border-box"
                                    })
                                    .appendTo(contentElement)
                                const gridContainer = $("<div id='gridInsidePopup'>")
                                    .css({
                                        flex: "1 1 auto",
                                        overflow: "hidden"
                                    })
                                    .appendTo(wrapper);

                                $("<div id='gridInsidePopup'>").appendTo(contentElement);

                                $("#gridInsidePopup").dxDataGrid({
                                    dataSource: aTaskEdit,
                                    //keyExpr: allFields[0] || undefined,
                                    keyExpr: tableConfig.Pkeys || tableConfig.Fieldss[0]?.Name,
                                    //height: 500,  // grid height inside popup
                                    width: "100%",
                                    height: "100%",
                                    allowColumnReordering: true,
                                    allowColumnResizing: true,
                                    columnMinWidth: 40,
                                    columnChooser: {
                                        enabled: true
                                    },
                                    showBorders: true,
                                    sorting: {
                                        mode: "multiple"
                                    },
                                    selection: {
                                        mode: 'single',//'multiple'
                                    },
                                    groupPanel: {
                                        visible: true
                                    },
                                    filterRow: {
                                        visible: true,
                                        applyFilter: "auto"
                                    },
                                    headerFilter: {
                                        visible: true
                                    },
                                    grouping: {
                                        autoExpandAll: true,
                                    },
                                    searchPanel: {
                                        visible: true
                                    },
                                    showBorders: true,
                                    groupPaging: true,
                                    showColumnLines: true,
                                    showRowLines: true,
                                    rowAlternationEnabled: true,
                                    wordWrapEnabled: true,
                                    // Export to Excel 		
                                    export: {
                                        enabled: true,
                                        allowExportSelectedData: true
                                    },
                                    onExporting: function (e) {
                                        const workbook = new ExcelJS.Workbook();
                                        const worksheet = workbook.addWorksheet('DATA');
                                        DevExpress.excelExporter.exportDataGrid({
                                            worksheet: worksheet,
                                            component: e.component
                                        }).then(function () {
                                            workbook.xlsx.writeBuffer().then(function (buffer) {
                                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), headerText + '.xlsx');
                                            });
                                        });
                                        e.cancel = true;
                                    },
                                    paging: {
                                        pageSize: 20 // show 20 rows per page
                                    },
                                    pager: {
                                        showPageSizeSelector: true,
                                        allowedPageSizes: [10, 20, 50, 100],
                                        showInfo: true
                                    },
                                    editing: {
                                        mode: adgMode, // "cell" "popup"
                                        allowUpdating: true,
                                        allowAdding: false, //true switch to use internal Add Module or not
                                        allowDeleting: true,// 
                                        popup: { title: `Edit ${headerText}`, showTitle: true, width: 1100, height: 700, position: { my: "top center", at: "top center", of: window, offset: { y: 10 } }, },
                                    },
                                    columns: dynamicColumns,
                                    onToolbarPreparing: function (e) {
                                        var dataGrid = e.component;
                                        e.toolbarOptions.items.unshift(
                                            {
                                                location: "before",
                                                widget: "dxButton",
                                                options: {
                                                    icon: "fas fa-info",
                                                    text: "HELP",
                                                    type: "default",
                                                    stylingMode: "contained", // "outlined" contained
                                                    onClick: function () {
                                                        aPopupHelp("HELP", aVARs.APOPUPHELP) //"./images/All Slide-Training Expense Reimbursement System.pdf#view=FitH" //"./Help.html" "https://cbsdev2.locktonwattana.com/xol/index.html"
                                                    }
                                                }
                                            },
                                            {
                                                location: "before",
                                                template: () => { return $("<div style='padding: 5px 5px;'/>") }
                                            },
                                            {
                                                location: "after",
                                                widget: "dxButton",
                                                options: {
                                                    hint: "Add new Record",
                                                    text: "Add New",
                                                    icon: "add",
                                                    type: "default", //type: "default", "success", "danger", "normal"
                                                    stylingMode: "contained", //stylingMode: "contained", "outlined", "text"
                                                    onClick: function () {
                                                        const grid = e.component;
                                                        const keyExpr = grid.option("keyExpr");

                                                        const newRow = buildEmptyRowFromTaskProgram(rowData.TaskProgram, keyExpr);
                                                        if (!newRow) {
                                                            DevExpress.ui.dialog.alert("Cannot Add new row", "Error");
                                                            return;
                                                        }

                                                        // ✅ แสดง alert ค่า key ก่อน insert
                                                        //alert("New key: " + newRow[keyExpr]);

                                                        grid.getDataSource().store().insert(newRow).then(() => {
                                                            grid.refresh();
                                                        });
                                                    }
                                                }
                                            },
                                            {
                                                location: "after",
                                                widget: "dxButton",
                                                type: "success",
                                                options: {
                                                    icon: 'collapse',
                                                    text: 'Collapse All',
                                                    width: 140,
                                                    onClick: function (e) {
                                                        var expanding = e.component.option("text") === "Expand All";
                                                        dataGrid.option("grouping.autoExpandAll", expanding);
                                                        e.component.option("text", expanding ? "Collapse All" : "Expand All");
                                                        e.component.option("icon", expanding ? "collapse" : "expand");
                                                    }
                                                }
                                            },
                                            {
                                                location: "after",
                                                widget: "dxButton",
                                                options: {
                                                    icon: "refresh",
                                                    hint: "Refresh",
                                                    onClick: () => {
                                                        dataGrid.refresh();
                                                    }
                                                }
                                            }
                                        );
                                    }


                                });
                            },
                            toolbarItems: [
                                {
                                    widget: "dxButton",
                                    toolbar: "bottom",
                                    location: "after",
                                    options: {
                                        text: "Save",
                                        type: "success",
                                        onClick: function () {
                                            try {
                                                const grid = $("#gridInsidePopup").dxDataGrid("instance");
                                                if (!grid) {
                                                    DevExpress.ui.dialog.alert("ไม่พบ grid ภายใน popup", "Error");
                                                    return;
                                                }

                                                const updated = grid.option("dataSource");
                                                if (!Array.isArray(updated) || updated.length === 0) {
                                                    DevExpress.ui.dialog.alert("No Data in grid", "Error");
                                                    return;
                                                }

                                                // แปลงเป็น object ต่อกัน และขึ้นบรรทัดใหม่
                                                const jsonArray = JSON.stringify(updated);
                                                const newValue = jsonArray.startsWith("[")
                                                    ? jsonArray.substring(1, jsonArray.length - 1)
                                                    : jsonArray;

                                                const newLines = newValue.split("},{").map((s, i, arr) => {
                                                    if (i === 0) return s + "}";
                                                    if (i === arr.length - 1) return "{" + s;
                                                    return "{" + s + "}";
                                                });

                                                const combined = newLines.join(",\n");

                                                // ✅ แสดงข้อมูลก่อนบันทึก
                                                //DevExpress.ui.dialog.alert("TaskProgram for:\n\n" + combined, "Preview");

                                                // ✅ บันทึกกลับไปที่ TaskProgram
                                                if (rowData) {
                                                    //rowData.TaskProgram = combined;
                                                    // 4) Update the in-memory row for immediate UI
                                                    rowData.TaskProgram = combined;

                                                    // 4a) Persist memory to DB (your idea)
                                                    if (typeof aSaveMemToDB === "function") {
                                                        aSaveMemToDB(rowData, aaTBKey, aaPFDMI, aaXToX);
                                                        //DevExpress.ui.dialog.alert("TaskProgram for:\n\n" + combined, "Preview");
                                                        DevExpress.ui.dialog.alert("Already Saved", "Success");
                                                    }
                                                } else {
                                                    DevExpress.ui.dialog.alert("Not found rowData for save", "Error");
                                                }

                                                if (parentGrid) {
                                                    parentGrid.refresh(true);
                                                } else {
                                                    DevExpress.ui.dialog.alert("Not found parentGrid for refresh", "Warning");
                                                }

                                                if (popupInstance) {
                                                    popupInstance.hide();
                                                } else {
                                                    DevExpress.ui.dialog.alert("Not found popupInstance for close", "Warning");
                                                }

                                            } catch (err) {
                                                DevExpress.ui.dialog.alert("Error happen: " + err.message, "Exception");
                                                console.error("Save error:", err);
                                            }
                                        }
                                    }

                                },
                                {
                                    widget: "dxButton",
                                    toolbar: "bottom",
                                    location: "after",
                                    options: {
                                        text: "Cancel",
                                        onClick: function () {
                                            popupInstance.hide();
                                        }
                                    }
                                }
                            ],
                        }).dxPopup("instance");

                    }

                    // ----------------- build new record --------------------
                    function buildEmptyRowFromTaskProgram(taskProgramRaw, keyExpr = null) {
                        const arr = normalizeTaskProgram(taskProgramRaw);
                        if (!Array.isArray(arr) || arr.length === 0) return null;

                        const template = {};
                        Object.keys(arr[0]).forEach(key => {
                            template[key] = "";
                        });

                        // สร้าง key ที่ไม่ซ้ำ
                        if (keyExpr && keyExpr in template) {
                            const now = new Date();

                            // สร้างส่วนวันที่ในรูปแบบ YYMMDD
                            const yy = String(now.getFullYear()).slice(-2);
                            const mm = String(now.getMonth() + 1).padStart(2, "0");
                            const dd = String(now.getDate()).padStart(2, "0");

                            const datePart = yy + mm + dd;

                            // ใช้วินาทีเป็น serial number (หรือจะใช้ milliseconds ก็ได้)
                            const serial = String(now.getSeconds()).padStart(2, "0") + String(now.getMilliseconds()).padStart(3, "0");

                            // สร้าง key สวย ๆ
                            const newKey = "S" + datePart + "_" + serial;

                            template[keyExpr] = newKey;
                        }


                        return template;
                    }

                    // ----------------- normalizeTaskProgram -----------------
                    function normalizeTaskProgram(input) {
                        if (Array.isArray(input)) return input;
                        if (input && typeof input === "object") return [input];
                        if (typeof input !== "string") return [];

                        const s = input.trim();
                        if (!s) return [];

                        try {
                            if (s[0] === "[") {
                                const parsed = JSON.parse(s);
                                return Array.isArray(parsed) ? parsed : [];
                            }
                        } catch (e) { }

                        const parts = s.match(/\{[^}]*\}/g);
                        if (!parts) return [];

                        return parts.map(p => parseObjectText(p));
                    }

                    // ----------------- parse a { ... } text into an object -----------------
                    function parseObjectText(objText) {
                        let text = objText.trim();
                        if (text.startsWith("{") && text.endsWith("}")) text = text.slice(1, -1);
                        const pairs = splitByCommaNotInQuotes(text);
                        const obj = {};

                        pairs.forEach(pair => {
                            const colonIdx = findColonIndexNotInQuotes(pair);
                            if (colonIdx === -1) return;
                            const keyRaw = pair.slice(0, colonIdx).trim();
                            const valRaw = pair.slice(colonIdx + 1).trim();

                            const key = stripSurroundingQuotes(keyRaw);
                            let val;
                            if (valRaw === "") val = "";
                            else if ((valRaw[0] === '"' && valRaw[valRaw.length - 1] === '"') ||
                                (valRaw[0] === "'" && valRaw[valRaw.length - 1] === "'")) {
                                val = valRaw.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
                            } else if (/^-?\d+(\.\d+)?$/.test(valRaw)) val = parseFloat(valRaw);
                            else if (/^(true|false)$/i.test(valRaw)) val = /^true$/i.test(valRaw);
                            else if (/^null$/i.test(valRaw)) val = null;
                            else val = valRaw;

                            obj[key] = val;
                        });
                        return obj;
                    }

                    // ----------------- patchOriginalFormat -----------------
                    function patchOriginalFormat(original, updatedArray) {
                        try {
                            if (!original || typeof original !== "string") {
                                const jsonArray = JSON.stringify(updatedArray || []);
                                return jsonArray.startsWith("[") ? jsonArray.substring(1, jsonArray.length - 1) : jsonArray;
                            }

                            const parts = original.match(/\{[^}]*\}/g) || [];
                            const result = [];

                            updatedArray.forEach((obj, idx) => {
                                let orig = parts[idx] || "{}";
                                let inner = orig.slice(1, -1).trim();
                                const origPairs = splitByCommaNotInQuotes(inner);
                                const seenKeys = new Set();
                                const reconstructedPairs = [];

                                origPairs.forEach(pair => {
                                    const colonIdx = findColonIndexNotInQuotes(pair);
                                    if (colonIdx === -1) {
                                        reconstructedPairs.push(pair);
                                        return;
                                    }
                                    const key = stripSurroundingQuotes(pair.slice(0, colonIdx).trim());
                                    const val = obj.hasOwnProperty(key) ? obj[key] : pair.slice(colonIdx + 1).trim();
                                    reconstructedPairs.push(key + ": " + formatValueForPatch(val, pair.slice(colonIdx + 1).trim()));
                                    seenKeys.add(key);
                                });

                                Object.keys(obj).forEach(k => {
                                    if (!seenKeys.has(k)) {
                                        reconstructedPairs.push(k + ": " + formatValueForPatch(obj[k]));
                                    }
                                });

                                result.push("{ " + reconstructedPairs.join(", ") + " }");
                            });

                            return result.join(",\n");
                        } catch (e) {
                            console.warn("patchOriginalFormat failed, fallback to stringify", e);
                            const jsonArray = JSON.stringify(updatedArray || []);
                            return jsonArray.startsWith("[") ? jsonArray.substring(1, jsonArray.length - 1) : jsonArray;
                        }
                    }

                    function formatValueForPatch(val, origVal) {
                        if (val === null) return "null";
                        if (typeof val === "number" || typeof val === "boolean") return String(val);
                        if (origVal && (origVal[0] === '"' || origVal[0] === "'")) {
                            const quote = origVal[0];
                            return quote + String(val).replace(new RegExp(quote, "g"), "\\" + quote) + quote;
                        }
                        return '"' + String(val).replace(/"/g, '\\"') + '"';
                    }

                    // ----------------- Utility helpers -----------------
                    function splitByCommaNotInQuotes(s) {
                        const parts = [];
                        let cur = "", inDouble = false, inSingle = false;
                        for (let i = 0; i < s.length; i++) {
                            const ch = s[i];
                            if (ch === '"' && !inSingle && (s[i - 1] !== "\\")) inDouble = !inDouble;
                            else if (ch === "'" && !inDouble && (s[i - 1] !== "\\")) inSingle = !inSingle;
                            else if (ch === "," && !inDouble && !inSingle) { parts.push(cur); cur = ""; continue; }
                            cur += ch;
                        }
                        if (cur !== "") parts.push(cur);
                        return parts.map(p => p.trim()).filter(p => p !== "");
                    }

                    function findColonIndexNotInQuotes(s) {
                        let inDouble = false, inSingle = false;
                        for (let i = 0; i < s.length; i++) {
                            const ch = s[i];
                            if (ch == '"' && !inSingle && s[i - 1] !== "\\") inDouble = !inDouble;
                            else if (ch == "'" && !inDouble && s[i - 1] !== "\\") inSingle = !inSingle;
                            else if (ch == ":" && !inDouble && !inSingle) return i;
                        }
                        return -1;
                    }

                    function stripSurroundingQuotes(s) {
                        if (!s) return s;
                        s = s.trim();
                        if ((s[0] === '"' && s[s.length - 1] === '"') || (s[0] === "'" && s[s.length - 1] === "'")) return s.slice(1, -1);
                        return s;
                    }

                    function findRowIndexInParentGrid(parentGrid, rowData) {
                        try {
                            if (parentGrid && parentGrid instanceof jQuery) parentGrid = parentGrid.dxDataGrid("instance");
                            if (!parentGrid) return -1;

                            const ds = parentGrid.getDataSource ? parentGrid.getDataSource() : null;
                            if (ds && ds.items) {
                                const items = ds.items();
                                let idx = items.findIndex(item => item === rowData);
                                if (idx >= 0) return idx;
                                const keyExpr = parentGrid.option ? parentGrid.option("keyExpr") : null;
                                const keyField = Array.isArray(keyExpr) ? keyExpr[0] : keyExpr;
                                if (keyField && typeof rowData[keyField] !== "undefined") {
                                    try {
                                        const idx2 = parentGrid.getRowIndexByKey(rowData[keyField]);
                                        if (typeof idx2 === "number" && idx2 >= 0) return idx2;
                                    } catch (e) { }
                                }
                            }
                            return -1;
                        } catch (e) { console.warn("findRowIndexInParentGrid error", e); return -1; }
                    }


                    function manageTaskProgram(rowData, parentGrid) {
                        let rawData = rowData.TaskProgram;

                        // Detect format
                        let isJsonArray = false;
                        try {
                            let parsed = JSON.parse("[" + rawData + "]");
                            isJsonArray = Array.isArray(parsed);
                        } catch (e) {
                            isJsonArray = false;
                        }

                        if (isJsonArray) {
                            // ---- JSON array editor ----
                            let aTaskEdit = normalizeTaskProgram(rawData);
                            if (!Array.isArray(aTaskEdit)) {
                                DevExpress.ui.dialog.alert("TaskProgram format invalid", "Error");
                                return;
                            }

                            // Collect all fields
                            let allFields = [];
                            aTaskEdit.forEach(obj => {
                                Object.keys(obj).forEach(k => { if (!allFields.includes(k)) allFields.push(k); });
                            });

                            let dynamicColumns = allFields.map(f => ({ dataField: f, caption: f }));

                            $("#popupTaskProgramJSON").dxPopup({
                                title: "Edit TaskProgram (JSON)",
                                visible: true,
                                width: 1000,
                                height: 600,
                                showCloseButton: true,
                                contentTemplate: function (contentElement) {
                                    $("<div id='gridTaskProgramJSON'>").appendTo(contentElement);
                                    $("#gridTaskProgramJSON").dxDataGrid({
                                        dataSource: aTaskEdit,
                                        keyExpr: allFields[0],
                                        showBorders: true,
                                        paging: { enabled: true, pageSize: 20 },
                                        editing: {
                                            mode: "cell",
                                            allowUpdating: true,
                                            allowAdding: true,
                                            allowDeleting: true
                                        },
                                        columns: dynamicColumns
                                    });
                                },
                                toolbarItems: [
                                    {
                                        widget: "dxButton",
                                        toolbar: "bottom",
                                        location: "after",
                                        options: {
                                            text: "Save",
                                            type: "success",
                                            onClick: function () {
                                                let grid = $("#gridTaskProgramJSON").dxDataGrid("instance");
                                                let updated = grid.option("dataSource") || [];

                                                // Convert back to string without brackets
                                                let newValue = JSON.stringify(updated).slice(1, -1);

                                                rowData.TaskProgram = newValue;
                                                if (parentGrid) parentGrid.refresh(true);
                                                $("#popupTaskProgramJSON").dxPopup("instance").hide();
                                            }
                                        }
                                    },
                                    {
                                        widget: "dxButton",
                                        toolbar: "bottom",
                                        location: "after",
                                        options: {
                                            text: "Cancel",
                                            onClick: function () { $("#popupTaskProgramJSON").dxPopup("instance").hide(); }
                                        }
                                    }
                                ]
                            });
                        } else {
                            // ---- Pipe-separated key-value editor ----
                            let lines = rawData.split("\n").filter(l => l.trim() !== "");
                            let dataArray = lines.map(line => {
                                let parts = line.split("|");
                                return { Ask: parts[0]?.trim() || "", Answer: parts[1]?.trim() || "" };
                            });

                            $("#popupTaskProgramKV").dxPopup({
                                title: "Edit TaskProgram (Key-Value)",
                                visible: true,
                                width: 1000,
                                height: 600,
                                showCloseButton: true,
                                contentTemplate: function (contentElement) {
                                    $("<div id='gridTaskProgramKV'>").appendTo(contentElement);

                                    $("#gridTaskProgramKV").dxDataGrid({
                                        dataSource: dataArray,
                                        keyExpr: "Ask",
                                        showBorders: true,
                                        paging: { enabled: true, pageSize: 20 },
                                        editing: { mode: "cell", allowUpdating: true, allowAdding: true, allowDeleting: true },
                                        columns: [
                                            { dataField: "Ask", caption: "Ask / Caption", width: 300 },
                                            {
                                                dataField: "Answer", caption: "Answer / Content", width: 650, cellTemplate: function (container, options) {
                                                    $("<div contenteditable='true'>")
                                                        .html(options.value)
                                                        .on("input", function () { options.setValue($(this).html()); })
                                                        .appendTo(container);
                                                }
                                            }
                                        ]
                                    });
                                },
                                toolbarItems: [
                                    {
                                        widget: "dxButton",
                                        toolbar: "bottom",
                                        location: "after",
                                        options: {
                                            text: "Save",
                                            type: "success",
                                            onClick: function () {
                                                let grid = $("#gridTaskProgramKV").dxDataGrid("instance");
                                                let updated = grid.option("dataSource") || [];
                                                let newText = updated.map(o => `${o.Ask}| ${o.Answer}`).join("\n");

                                                rowData.TaskProgram = newText;
                                                if (parentGrid) parentGrid.refresh(true);
                                                $("#popupTaskProgramKV").dxPopup("instance").hide();
                                            }
                                        }
                                    },
                                    {
                                        widget: "dxButton",
                                        toolbar: "bottom",
                                        location: "after",
                                        options: {
                                            text: "Cancel",
                                            onClick: function () { $("#popupTaskProgramKV").dxPopup("instance").hide(); }
                                        }
                                    }
                                ]
                            });
                        }
                    }

                    /**
                     * Opens a popup to edit TaskProgram lines (Ask|Answer) as rows.
                     * Persists changes back to the parent screen (grid/form/editor) and database/store.
                     *
                     * @param {string} rawText - Original TaskProgram text (multi-line "Ask|Answer").
                     * @param {object} rowData - The parent row object (must include the key field).
                     * @param {DevExpress.ui.dxDataGrid} [parentGrid] - Parent grid instance (optional).
                     * @param {DevExpress.ui.dxForm} [parentForm] - Parent form instance with formData including TaskProgram (optional).
                     * @param {string} [taskProgramEditorSelector] - Selector for a standalone dxTextArea editor of TaskProgram (optional).
                     * @param {object} [saveCtx] - Optional context for aSaveMemToDB: { aaTBKey, aaPFDMI, aaXToX }
                     */
                    function editKeyValueProgram(rawText, rowData, parentGrid, parentForm, taskProgramEditorSelector, saveCtx) {
                        if (!rawText || typeof rawText !== "string") {
                            DevExpress.ui.dialog.alert("Data format invalid", "Error");
                            return;
                        }
                        let markupPopupInstance = null;

                        // Parse "Ask|AnswerText" lines
                        const lines = rawText.split("\n").filter(l => l.trim() !== "");
                        const dataArray = lines.map(line => {
                            const parts = line.split("|");
                            const ask = (parts[0] || "").trim();
                            const answerText = (parts[1] || "").trim();
                            return {
                                Ask: ask,
                                AnswerText: answerText,
                                AnswerPreview: answerText
                            };
                        });

                        // Create popup host if missing
                        if ($("#popupKeyValueEdit").length === 0) {
                            $("<div id='popupKeyValueEdit'>").appendTo("body");
                        }

                        $("#popupKeyValueEdit").dxPopup({
                            title: "Edit Key-Value Data",
                            visible: true,
                            width: 1400,  // wider popup
                            height: 900,  // taller popup
                            resizeEnabled: true,
                            showCloseButton: true,
                            position: { my: "top center", at: "top center", of: window, offset: { y: 10 } },
                            contentTemplate: function (contentElement) {
                                contentElement.css({ height: "100%", padding: "5px", boxSizing: "border-box" });

                                $("<div id='gridKeyValuePopup'>")
                                    .css({ height: "100%", width: "100%" })
                                    .appendTo(contentElement);

                                $("#gridKeyValuePopup").dxDataGrid({
                                    dataSource: dataArray,
                                    keyExpr: "Ask",
                                    showBorders: true,
                                    showColumnLines: true,
                                    showRowLines: true,
                                    rowAlternationEnabled: true,
                                    wordWrapEnabled: true,
                                    rowAlternationEnabled: true,
                                    height: "100%",

                                    paging: { enabled: true, pageSize: 10 },
                                    pager: {
                                        showPageSizeSelector: true,
                                        allowedPageSizes: [10, 20, 50, 100],
                                        showInfo: true
                                    },

                                    searchPanel: {
                                        visible: true,
                                        highlightCaseSensitive: false,
                                        placeholder: "Search Ask / Answer..."
                                    },

                                    editing: {
                                        mode: "popup",
                                        allowUpdating: true,
                                        allowAdding: true,
                                        allowDeleting: true,
                                        popup: { title: "Edit Record", showTitle: true, width: 1100, height: 700, position: { my: "top center", at: "top center", of: window, offset: { y: 10 } }, },
                                        form: {
                                            colCount: 2,
                                            items: [
                                                { dataField: "Ask", label: { text: "Question" }, colSpan: 2, },

                                                {
                                                    dataField: "AnswerText",
                                                    label: { text: "Answer HTML" },
                                                    editorType: "dxHtmlEditor",
                                                    colSpan: 2,
                                                    editorOptions: {
                                                        width: "100%",
                                                        height: 480,
                                                        valueType: "html",
                                                        toolbar: {
                                                            multiline: true,
                                                            items: [
                                                                "undo", "redo", "separator",
                                                                {
                                                                    formatName: "size",
                                                                    formatValues: ["8pt", "10pt", "12pt", "14pt", "18pt", "24pt", "36pt"]
                                                                },
                                                                {
                                                                    formatName: "font",
                                                                    formatValues: ["Arial", "Tahoma", "Times New Roman", "Verdana"]
                                                                },
                                                                "separator",
                                                                "bold", "italic", "underline", "strike",
                                                                "separator",
                                                                "alignLeft", "alignCenter", "alignRight", "alignJustify",
                                                                "separator",
                                                                "orderedList", "bulletList",
                                                                "separator",
                                                                "color", "background",
                                                                "separator",
                                                                "link", "image",
                                                                "separator",
                                                                "clear",
                                                                "codeBlock",
                                                                {
                                                                    widget: "dxButton",
                                                                    visible: false,
                                                                    options: {
                                                                        text: "Edit Markup",
                                                                        stylingMode: "text",
                                                                        onClick() {
                                                                            const editorInstance = $(".dx-html-editor").dxHtmlEditor("instance");
                                                                            markupPopup.show();
                                                                            $(".markup-editor").val(editorInstance.option("value"));
                                                                        },
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        mediaResizing: {
                                                            enabled: true
                                                        }
                                                    }
                                                },

                                                {
                                                    dataField: "AnswerText",
                                                    label: { text: "Answer / Contents" },
                                                    editorType: "dxTextArea",
                                                    colSpan: 2,
                                                    editorOptions: {
                                                        width: "100%",
                                                        height: 480,
                                                        autoResizeEnabled: false,
                                                        //readOnly: true,
                                                        spellcheck: false
                                                    }
                                                },

                                            ]
                                        }
                                    },

                                    columns: [
                                        {
                                            type: "buttons",
                                            width: 80,               // fixed width for icons so they don't overlap
                                            //alignment: "center",
                                            //fixed: true,
                                            //fixedPosition: "left",
                                            buttons: ["edit", "delete"]
                                        },
                                        {
                                            dataField: "Ask", caption: "Question", width: 280,
                                            cssClass: "answer-top-align",
                                            cellTemplate: function (container, options) {
                                                // Ensure view-mode text aligns to TOP with preserved newlines
                                                $("<div>")
                                                    .css({
                                                        width: "100%",
                                                        minHeight: "240px",
                                                        maxHeight: "600px",
                                                        overflow: "auto",
                                                        padding: "8px",
                                                        //border: "1px solid #e0e0e0",
                                                        //borderRadius: "4px",
                                                        //background: "#fafafa",
                                                        textAlign: "left",
                                                        verticalAlign: "top"
                                                    })
                                                    .text(options.value || "")
                                                    .appendTo(container);
                                            }
                                        },
                                        {
                                            dataField: "AnswerText",
                                            caption: "Answer / Content (Text)",
                                            width: 500,
                                            visible: false,
                                            cssClass: "answer-top-align",
                                            cellTemplate: function (container, options) {
                                                $("<div>")
                                                    .css({
                                                        width: "100%",
                                                        minHeight: "240px",
                                                        maxHeight: "600px",
                                                        overflow: "auto",
                                                        padding: "6px",
                                                        whiteSpace: "pre-wrap",   // wrap text and preserve newlines
                                                        textAlign: "left",        // horizontal left
                                                        display: "flex",          // flexbox for vertical alignment
                                                        alignItems: "flex-start"  // vertical top
                                                        // no border, no background
                                                    })
                                                    .text(options.value || "")
                                                    .appendTo(container);
                                            }
                                        },
                                        {
                                            dataField: "AnswerPreview",
                                            caption: "Result (Preview)",
                                            allowEditing: false,
                                            minWidth: 700,
                                            cellTemplate: function (container, options) {
                                                $("<div>")
                                                    .css({
                                                        width: "100%",
                                                        minHeight: "240px",
                                                        maxHeight: "600px",
                                                        overflow: "auto",
                                                        padding: "8px",
                                                        //border: "1px solid #e0e0e0",
                                                        //borderRadius: "4px",
                                                        //background: "#fafafa",
                                                        textAlign: "left",
                                                        verticalAlign: "top"
                                                    })
                                                    .html(options.value || "")
                                                    .appendTo(container);
                                            }
                                        }
                                    ],

                                    onRowUpdating: function (e) {
                                        if (e.newData && typeof e.newData.AnswerText !== "undefined") {
                                            e.newData.AnswerPreview = e.newData.AnswerText;
                                        }
                                    },
                                    onRowInserting: function (e) {
                                        e.data.AnswerPreview = e.data.AnswerText || "";
                                    }
                                });
                            },

                            toolbarItems: [
                                {
                                    widget: "dxButton",
                                    toolbar: "bottom",
                                    location: "before",
                                    options: {
                                        text: "Full Screen",
                                        type: "default",
                                        onClick: function () {
                                            const popup = $("#popupKeyValueEdit").dxPopup("instance");
                                            const isFull = popup.option("width") === "100%";
                                            popup.option(isFull ? { width: 1600, height: 900 } : { width: "100%", height: "100%" });
                                        }
                                    }
                                },
                                {
                                    widget: "dxButton",
                                    toolbar: "bottom",
                                    location: "after",
                                    options: {
                                        text: "Save",
                                        type: "success",  // green
                                        onClick: function () {
                                            const innerGrid = $("#gridKeyValuePopup").dxDataGrid("instance");

                                            // 1) Commit any pending edits inside the inner grid
                                            innerGrid.saveEditData();

                                            // 2) Read the current data from the dataSource (stable regardless of paging)
                                            const rows = innerGrid.option("dataSource");

                                            // 3) Rebuild TaskProgram text
                                            const newText = rows
                                                .map(o => `${(o.Ask || "").trim()}| ${(o.AnswerText || "").trim()}`)
                                                .join("\n");

                                            // 4) Update the in-memory row for immediate UI
                                            rowData.TaskProgram = newText;

                                            // 4a) Persist memory to DB (your idea)
                                            if (typeof aSaveMemToDB === "function" && saveCtx && saveCtx.aaTBKey && saveCtx.aaPFDMI && saveCtx.aaXToX) {
                                                aSaveMemToDB(rowData, saveCtx.aaTBKey, saveCtx.aaPFDMI, saveCtx.aaXToX);
                                            }

                                            // 5a) Update parent form if exists
                                            if (parentForm && typeof parentForm.updateData === "function") {
                                                parentForm.updateData("TaskProgram", newText);
                                            }

                                            // 5b) Update standalone TaskProgram editor if exists
                                            if (taskProgramEditorSelector) {
                                                const $editor = $(taskProgramEditorSelector);
                                                if ($editor.length) {
                                                    const editorInst = $editor.data("dxTextArea");
                                                    if (editorInst) editorInst.option("value", newText);
                                                    else $editor.val(newText).trigger("change");
                                                }
                                            }

                                            // 5c) Update parent grid and persist to data source/database
                                            if (parentGrid) {
                                                const keyExpr = parentGrid.option("keyExpr");
                                                const key = rowData[keyExpr];

                                                const ds = parentGrid.getDataSource();
                                                const store = ds && ds.store ? ds.store() : null;

                                                if (store && typeof store.update === "function") {
                                                    // Database/store-backed grid
                                                    store.update(key, { TaskProgram: newText })
                                                        .then(() => ds.reload())
                                                        .then(() => {
                                                            DevExpress.ui.notify("Saved to database", "success", 2000);
                                                            $("#popupKeyValueEdit").dxPopup("instance").hide();
                                                        })
                                                        .catch(err => {
                                                            DevExpress.ui.notify("Save failed: " + (err && err.responseText || err), "error", 4000);
                                                        });
                                                } else {
                                                    // Array-backed grid
                                                    const arr = parentGrid.option("dataSource");
                                                    const idx = Array.isArray(arr) ? arr.findIndex(item => item[keyExpr] === key) : -1;

                                                    if (idx > -1) {
                                                        arr[idx].TaskProgram = newText;

                                                        // Reflect immediately in the cell
                                                        const rowIndex = parentGrid.getRowIndexByKey(key);
                                                        if (rowIndex >= 0) {
                                                            parentGrid.cellValue(rowIndex, "TaskProgram", newText);
                                                        }

                                                        parentGrid.option("dataSource", arr);
                                                        parentGrid.refresh();
                                                        DevExpress.ui.notify("Saved", "success", 2000);
                                                        $("#popupKeyValueEdit").dxPopup("instance").hide();
                                                    } else {
                                                        DevExpress.ui.notify("Parent data source not found", "error", 3000);
                                                    }
                                                }
                                            } else {
                                                // If no parent grid, but we updated form/editor, close gracefully
                                                $("#popupKeyValueEdit").dxPopup("instance").hide();
                                            }
                                        }
                                    }
                                },
                                {
                                    widget: "dxButton",
                                    toolbar: "bottom",
                                    location: "after",
                                    options: {
                                        text: "Cancel",
                                        type: "danger",  // red for distinction
                                        onClick: function () {
                                            $("#popupKeyValueEdit").dxPopup("instance").hide();
                                        }
                                    }
                                }
                            ]
                        });

                        const markupPopup = $("#markup-popup").dxPopup({
                            showTitle: true,
                            title: "Edit Markup",
                            width: 800,
                            height: 600,
                            position: {
                                my: "top",
                                at: "top",
                                of: "window",
                                offset: "-350 50"
                            },
                            contentTemplate: () => `
                                <div style="height: 100%; display: flex; flex-direction: column;">
                                    <textarea class="markup-editor" style="flex-grow: 1; width: 100%; font-family: monospace;"></textarea>
                                    <div style="text-align: right; margin-top: 10px;">
                                        <button id="save-markup" style="padding: 5px 10px;">Save</button>
                                    </div>
                                </div>
                            `,
                            onContentReady() {
                                $("#save-markup").on("click", function () {
                                    const newMarkup = $(".markup-editor").val();
                                    const editorInstance = $(".dx-html-editor").dxHtmlEditor("instance");
                                    editorInstance.option("value", newMarkup);
                                    markupPopup.hide();
                                });
                            }
                        }).dxPopup("instance");

                    }


                    function editTaskTable(jsonText, rowData, parentGrid) {
                        let jsonData = JSON.parse(jsonText);

                        // ====== Transform JSON -> Grid data ======
                        function getJsonObject(data) {
                            return data.map(item => ({
                                jsonName: item.jsonName,
                                Pkeys: item.Pkeys,
                                dgMode: item.dgMode || "",
                                PopupWidth: item.PopupWidth || "",
                                PopupHeight: item.PopupHeight || "",
                                Title: item.Title,
                                Fieldss: JSON.stringify(item.Fieldss, null, 2) // keep as text
                            }));
                        }

                        // ====== Transform Grid data -> JSON ======
                        function toOriginalFormat(gridData) {
                            return gridData.map(item => ({
                                jsonName: item.jsonName,
                                Pkeys: item.Pkeys,
                                dgMode: item.dgMode || undefined,
                                PopupWidth: parseInt(item.PopupWidth) || undefined,
                                PopupHeight: parseInt(item.PopupHeight) || undefined,
                                Title: item.Title,
                                Fieldss: JSON.parse(item.Fieldss) // parse back to array
                            }));
                        }

                        // ====== Init Popup ======
                        let gridJSONInstance = null; // declare outside so toolbarItems can see it
                        $("#jsonPopup").dxPopup({
                            title: "JSON Grid Control",
                            width: 1500,
                            height: 600,
                            visible: true,
                            showCloseButton: true,
                            contentTemplate: function (contentElement) {
                                // create and initialize the grid
                                gridJSONInstance = $("<div>").appendTo(contentElement).dxDataGrid({
                                    dataSource: getJsonObject(jsonData),
                                    keyExpr: "jsonName",
                                    showBorders: true,
                                    showColumnLines: true,
                                    editing: {
                                        mode: "popup",
                                        allowUpdating: true,
                                        allowAdding: true,
                                        allowDeleting: true,
                                        popup: {
                                            title: "Edit JSON Config",
                                            showTitle: true,
                                            width: 800,
                                            height: 600
                                        },
                                        form: {
                                            items: [
                                                "jsonName",
                                                "Pkeys",
                                                "dgMode",
                                                "PopupWidth",
                                                "PopupHeight",
                                                "Title",
                                                {
                                                    dataField: "Fieldss",
                                                    editorType: "dxTextArea",
                                                    width: 800,
                                                    height: 600,
                                                    editorOptions: { width: 800, height: 400, colSpan: 2, }
                                                }
                                                // {
                                                //     dataField: "Fieldss",
                                                //     editorType: "dxTextArea",
                                                //     colSpan: 2,
                                                //     editorOptions: {
                                                //         width: 800,
                                                //         height: 200,
                                                //         autoResizeEnabled: true
                                                //     }
                                                // }
                                            ]
                                        }
                                    },
                                    columns: [
                                        {
                                            type: "buttons",
                                            width: 80,
                                            buttons: ["edit", "delete",
                                                {
                                                    hint: "EDIT JSON",
                                                    icon: "fas fa-pencil-alt", //"fas fa-code", //(aMMaMx === "Developer" || aMMaMx === "admin") ? "fas fa-code" : "fas fa-pencil-alt",
                                                    visible: true, //(adgHeader === "admin"), //true, //adgHeader === "admin"
                                                    onClick: function (e) {
                                                        // ส่งทั้งค่า และ reference ของ row เข้าไป Add, Edit, Del (CRUD) json
                                                        editTaskProgram(e.row.data.Fieldss, e.row.data, e.component);
                                                    }
                                                },
                                            ],
                                        },
                                        { dataField: "jsonName", caption: "JSON Name", editorType: "dxTextBox", width: 200 },
                                        { dataField: "Pkeys", caption: "Index Key", editorType: "dxTextBox", width: 100 },
                                        { dataField: "dgMode", caption: "Mode", editorType: "dxTextBox", width: 100 },
                                        { dataField: "PopupWidth", caption: "Popup Width", editorType: "dxNumberBox", width: 120 },
                                        { dataField: "PopupHeight", caption: "Popup Height", editorType: "dxNumberBox", width: 120 },
                                        { dataField: "Title", caption: "Title", editorType: "dxTextBox", width: 200 },
                                        {
                                            dataField: "Fieldss",
                                            caption: "Fields (JSON Text)",
                                            editorType: "dxTextArea",
                                            width: 500,
                                            height: 90,
                                            editorOptions: { height: 90, }
                                        }
                                    ]
                                });
                            },
                            toolbarItems: [
                                {
                                    widget: "dxButton",
                                    toolbar: "bottom",
                                    location: "after",
                                    options: {
                                        text: "Save",
                                        type: "success",
                                        onClick: function () {
                                            try {
                                                //const grid = $("#jsonGridControl").dxDataGrid("instance");
                                                const grid = gridJSONInstance.dxDataGrid("instance");
                                                if (!grid) {
                                                    DevExpress.ui.dialog.alert("ไม่พบ grid ภายใน popup", "Error");
                                                    return;
                                                }
                                                const updated = grid.option("dataSource");
                                                if (!Array.isArray(updated) || updated.length === 0) {
                                                    DevExpress.ui.dialog.alert("No Data in grid", "Error");
                                                    return;
                                                }

                                                // ✅ Transform to original format
                                                const backToJson = toOriginalFormat(updated);

                                                // ✅ Format for preview
                                                const jsonString = JSON.stringify(backToJson, null, 4);
                                                //DevExpress.ui.dialog.alert("TaskProgram for:\n\n" + jsonString, "Preview");

                                                // ✅ Optional: log to console
                                                console.log("Transformed JSON:", jsonString);
                                                if (rowData) {
                                                    rowData.TaskProgram = jsonString;
                                                    if (typeof aSaveMemToDB === "function") {
                                                        aSaveMemToDB(rowData, aaTBKey, aaPFDMI, aaXToX);
                                                        //DevExpress.ui.dialog.alert("TaskProgram for:\n\n" + rowData.TaskProgram, "Preview");
                                                        DevExpress.ui.dialog.alert("Already Saved", "Success");
                                                    }
                                                }
                                            } catch (e) {
                                                DevExpress.ui.dialog.alert("Error parsing Fieldss JSON: " + e.message, "Error");
                                            }
                                        }
                                        // onClick: function () {
                                        //     try {
                                        //         const grid = $("#gridInsidePopup").dxDataGrid("instance");
                                        //         if (!grid) {
                                        //             DevExpress.ui.dialog.alert("ไม่พบ grid ภายใน popup", "Error");
                                        //             return;
                                        //         }

                                        //         const updated = grid.option("dataSource");
                                        //         if (!Array.isArray(updated) || updated.length === 0) {
                                        //             DevExpress.ui.dialog.alert("No Data in grid", "Error");
                                        //             return;
                                        //         }

                                        //         // แปลงเป็น object ต่อกัน และขึ้นบรรทัดใหม่
                                        //         const jsonArray = JSON.stringify(updated);
                                        //         const newValue = jsonArray.startsWith("[")
                                        //             ? jsonArray.substring(1, jsonArray.length - 1)
                                        //             : jsonArray;

                                        //         const newLines = newValue.split("},{").map((s, i, arr) => {
                                        //             if (i === 0) return s + "}";
                                        //             if (i === arr.length - 1) return "{" + s;
                                        //             return "{" + s + "}";
                                        //         });

                                        //         const combined = newLines.join(",\n");

                                        //         // ✅ แสดงข้อมูลก่อนบันทึก
                                        //         //DevExpress.ui.dialog.alert("TaskProgram for:\n\n" + combined, "Preview");

                                        //         // ✅ บันทึกกลับไปที่ TaskProgram
                                        //         if (rowData) {
                                        //             //rowData.TaskProgram = combined;
                                        //             // 4) Update the in-memory row for immediate UI
                                        //             rowData.TaskProgram = combined;

                                        //             // 4a) Persist memory to DB (your idea)
                                        //             if (typeof aSaveMemToDB === "function") {
                                        //                 aSaveMemToDB(rowData, aaTBKey, aaPFDMI, aaXToX);
                                        //                 DevExpress.ui.dialog.alert("TaskProgram for:\n\n" + combined, "Preview");
                                        //             }
                                        //         } else {
                                        //             DevExpress.ui.dialog.alert("Not found rowData for save", "Error");
                                        //         }

                                        //         if (parentGrid) {
                                        //             parentGrid.refresh(true);
                                        //         } else {
                                        //             DevExpress.ui.dialog.alert("Not found parentGrid for refresh", "Warning");
                                        //         }

                                        //         if (popupInstance) {
                                        //             popupInstance.hide();
                                        //         } else {
                                        //             DevExpress.ui.dialog.alert("Not found popupInstance for close", "Warning");
                                        //         }

                                        //     } catch (err) {
                                        //         DevExpress.ui.dialog.alert("Error happen: " + err.message, "Exception");
                                        //         console.error("Save error:", err);
                                        //     }
                                        // }
                                    }
                                },
                                {
                                    widget: "dxButton",
                                    toolbar: "bottom",
                                    location: "after",
                                    options: {
                                        text: "Cancel",
                                        onClick: function () {
                                            $("#jsonPopup").dxPopup("instance").hide();
                                        }
                                    }
                                }
                            ]

                        });
                    }

                    // ====== Example button to call function ======
                    // $("#btnOpenGrid").dxButton({
                    //     text: "Open JSON Grid",
                    //     type: "default",
                    //     icon: "menu",
                    //     onClick: function () {
                    //         const jsonText = `[
                    //             {
                    //                 "jsonName": "aGivenRec",
                    //                 "Pkeys": "ID",
                    //                 "PopupWidth": 700,
                    //                 "Title": "Type Of Declaration",
                    //                 "Fieldss": [
                    //                     { "Name": "ID", "Caption": "ID", "Type": "string", "DxType": "dxTextBox", "Width": 120, "visible": true },
                    //                     { "Name": "code", "Caption": "Declaration Type", "Type": "string", "DxType": "dxTextBox", "Width": 220, "visible": true }
                    //                 ]
                    //             }
                    //         ]`;
                    //         editTaskTable(jsonText);
                    //     }
                    // });

                    function generateUniqueId() {
                        let timestamp = Date.now().toString(36);
                        let randomString = Math.random().toString(36).substring(2, 8);
                        let uniqueId = timestamp + randomString;
                        return uniqueId.substring(0, 10);
                    }

                }) //then fetch (Employee)
                .catch(error => console.error("Error fetching SQL data:", error)); // load loadsqldata  
        }); // load content

    }); // TOP PRG
//
//});  // ajax  