//Read json file for R/W Databasae Table
$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
var aaXToX = localStorage["aaXXoX"];
var xxchkxx = typeof param1 === "undefined" ? "NO" : param1;
var aaPXIXD = xxchkxx === "NO" ? localStorage["aPXIXD"] : param1;
var aaEnt = aaPXIXD.includes("X");
var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost();
//LoadSQLData
var aDatabasea = "ExtraOnLine.dbo.TaskControl";
var aKeyField = "TaskGroup";
var aKeyIDa = "SYSRWTABLE"; //"main"; //aaPXIXD;
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
                        line = line.trim().replace(/,$/, "");
                        line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                        return JSON.parse(line);
                    })
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
        //console.log(aVARs.JSobject)
        const AlltablesConfig = JSON.parse(aVARs.JSobject);
        
        //var aaTableForUse = aVARs.aTableName4Use
        console.log(aVARs.aTableName4Use)
        const tableNameToSearch = aVARs.aTableName4Use; //"ERSTATUS"; //search TABLE to work
        const tableConfigItem = AlltablesConfig.find(t => t.TableName === tableNameToSearch);

        if (tableConfigItem) {
            const { Primarykeys, Fields, TokenKey, TableName } = tableConfigItem;
            const tableConfig = { ...tableConfigItem };

            console.log("Primary Key:", Primarykeys);
            console.log("Table Name", TableName)
            console.log("Fields:", Fields);
            console.log("Token Key:", TokenKey);
            console.log("tableConfig:", tableConfig)
            console.log("tableConfig.Primarykeys", tableConfig.P)

            var aaKeyField = tableConfig.Primarykeys; //"DivCode"
            var aaTBKey = tableConfig.TokenKey; //"c2dee741-7ecd-498c-b761-56e7db248b89"; //aObjMPage[0].TBKey;  // 
           
            $(() => {
                var aMMaMx = localStorage["MMaMx"];
                var aRRgRs = aMMaMx.split('0');
                var aDDeDx = aRRgRs[0];
                var aRrgSx = aRRgRs[1];
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

                var aqrFull = `${aaKeyField} != '' `
                var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'

                var settings = { "url": aurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };
                var requestOptions = { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aqrFull) }), redirect: "follow" };

                $("#gridContainer").dxDataGrid({
                    dataSource: new DevExpress.data.CustomStore({
                        key: aaKeyField, //aaaKeyField, //"DivCode",
                        loadMode: "omit",
                        load: function () { return $.post(settings).done(function (response) { }); },
                        insert: function (values) {
                            if (aaEnt) {
                                var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date() };
                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                            }
                            else {
                                var ObjRowData = JSON.stringify(values);
                            }
                            //console.log(ObjRowData)
                            sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                        },
                        update: function (key, values) {
                            //var ObjKeyData = { "DivCode": $.trim(key) };
                            var ObjKeyData = { [aaKeyField]: $.trim(key) };
                            var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                            //console.log(ObjRowData)
                            sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                        },
                        remove: function (key) {
                            //var ObjKeyData = { "DivCode": $.trim(key) };
                            var ObjKeyData = { [aaKeyField]: $.trim(key) };
                            var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                            //console.log(ObjRowData)
                            sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                        }
                    }),

                    allowColumnReordering: true,
                    allowColumnResizing: true,
                    columnMinWidth: 100,
                    columnChooser: {
                        enabled: true
                    },
                    showBorders: true,
                    sorting: {
                        mode: "multiple"
                    },
                    selection: {
                        mode: 'single'
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
                    paging: {
                        pageSize: 10
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
                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'XOLDivision' + '.xlsx');
                            });
                        });
                        e.cancel = true;
                    },
                    onEditorPreparing: function (e) {
                        if (e.parentType === "dataRow" && arDataU === 0) {
                            e.editorOptions.disabled = true;
                        } else {
                            if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate")) {
                                e.editorOptions.disabled = true;
                            }
                        }
                    },
                    //
                    //
                    // Editing
                    editing: {
                        mode: "popup",
                        allowUpdating: true,
                        allowAdding: true,
                        allowDeleting: true,
                        popup: {
                            title: "Edit Record",  // ✅ This will set the title of the popup
                            showTitle: true,       // ✅ Ensures the title is displayed
                            width: 600,
                            height: "auto"
                        },
                        form: {
                            items: tableConfig.Fields.map(field => ({
                                dataField: field.Name,
                                label: { text: field.Caption }
                            }))
                        }
                    },
                    // column list
                    columns: [
                        {
                            type: "buttons",
                            width: 110,
                            buttons: ["edit", "delete"],
                            visible: true,
                        },
                        ...tableConfig.Fields.map(field => ({
                            dataField: field.Name,
                            sortOrder: field.sortOrder ?? null,
                            caption: field.Caption,
                            dataType: field.Type ?? null, // || "string", // === "date" ? "date" : "string",
                            editorType: field.DxType || "dxTextBox",
                            width: field.Width || 100,
                            validationRules: field.validationRules || [], // ✅ Apply validation rules if they exist
                            visible: field.visible,
                        }))
                    ],

                    // summary
                    summary: {
                        recalculateWhileEditing: true,
                        skipEmptyValues: false,
                        totalItems: [
                            {
                                column: aaKeyField, //"DivCode",
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
                                            doc.save('XOLDivision' + '.pdf');
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

            });
        } else {
            console.log("Table not found");
        }
        // TOP PRG
    });  //LoadSQLData
