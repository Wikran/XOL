
window.onload = function () {
    setTimeout(function () {
        location.reload();
    }, 3000000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
}
$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();

var aaXToX = localStorage["aaXXoX"];
var aaXNoX = localStorage["aaXXuX"];

var atest1 = vigenereEncode("XYZ", "key")
console.log(atest1);
var attst2 = vigenereDecode(atest1, "key");
console.log(attst2);

var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
var aaUsrN = localStorage["aaXXuX"];
var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492";
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var aaPFDMZz = "https://cbsdev3.locktonwattana.com"; //"https://cbsdev2.locktonwattana.com"; // API for DMZ only

var afqrFull = "pageID='" + aaPXIXD + "' "
var afURL = aaPFDMI + "/DMQ/" + acPRJ + "/" + atob(aaXToX) + '/' + aaXTXB + '/all' //+ aaPXXI aaXTXB "326459ff-7ea6-4465-a946-9326b783d492"
var afsettings = {
    "url": afURL,
    "method": "POST",
    "timeout": 0,
    "headers": { "Content-Type": "application/json" },
    "data": JSON.stringify({ "@": afqrFull }), //"�pageID='Resigned'�"
};
// var jqxhr = $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/' + aaPXXI, function (e) {
var jqxhr = $.post(afsettings, function (e) { })
    .done(function (e) {
        //console.log("set aaTBKey");
        aObjMPage = e;
        var aaKeyField = aObjMPage[0].PrimaryKey;
        var aaTBKey = aObjMPage[0].TBKey;
        //console.log(aaTBKey)

        //$(function () { TOP PRG
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

            var aqrFull = "pageID != '' " //"Status LIKE 'Active%'" //"Dept = '1196'" // "Password !LIKE '%\%"
            var aurl = aaPFDMI + "/DMQ/" + acPRJ + "/" + atob(aaXToX) + '/' + aaTBKey + '/all'

            var settings = {
                "url": aurl,
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "@": aqrFull //"�Status!='Resigned'�"
                }),
            };

            $("#gridContainer").dxDataGrid({

                dataSource: new DevExpress.data.CustomStore({
                    key: "pageID",
                    loadMode: "omit",
                    load: function () { return $.post(settings).done(); },
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
                        //console.log( aaKeyField );
                        var ObjKeyData = { "pageID": $.trim(key) };   //[aaKeyField] key.trim
                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                        sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                    },
                    remove: function (key) {
                        var ObjKeyData = { "pageID": $.trim(key) };   //[aaKeyField] key.trim
                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
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
                    mode: "single" //'multiple'
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MasterPageSetUp' + '.xlsx');
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
                    mode: "cell", //"row", //"popup",
                    useIcons: true,
                    allowUpdating: true,
                    allowDeleting: arDataD,
                    allowAdding: arDataC,
                    popup: {
                        title: "Master Page SetUp Info",
                        fullScreen: false,
                        showTitle: true,
                        width: 1000,
                        height: 525,
                        position: {
                            my: "top",
                            at: "top",
                            of: "window"
                        },
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
                        width: 110,
                        buttons: ["edit", "delete"]
                    },
                    {
                        dataField: "pageID",
                        caption: "Page ID",
                        dataType: "string",
                        sortOrder: "asc",
                        validationRules: [{ type: 'required', message: 'Page ID is required' }],
                        editorType: "dxTextBox",
                        editorOptions: { width: 150 },
                        allowHiding: false,
                        width: 150,
                    },
                    {
                        dataField: "TableName",
                        caption: "Table Name",
                        dataType: "string",
                        editorType: "dxTextBox",
                        editorOptions: { width: 300 },
                        validationRules: [{ type: 'required', message: 'Table Name is required' }],
                        width: 300,
                    },
                    {
                        dataField: "PrimaryKey",
                        caption: "Primary Key",
                        dataType: "string",
                        validationRules: [{ type: 'required', message: 'Table Name is required' }],
                        editorType: "dxTextBox",
                        editorOptions: { width: 300 },
                        width: 300,
                    },
                    {
                        dataField: "TBKey",
                        caption: "Table Key",
                        dataType: "string",
                        validationRules: [{ type: 'required', message: 'Table Name is required' }],
                        editorType: "dxTextBox",
                        editorOptions: { width: 300 },
                        width: 300,
                    },

                ],
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
                                        doc.save('MasterPageSetUp' + '.pdf');
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
        // TOP PRG
    });  // ajax        
