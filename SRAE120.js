//ER-STATUS
window.onload = function() {
    setTimeout(function() {
        location.reload();
    }, 24000000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
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
var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492"; 
var aaPXXI = localStorage["aPXIXD"];
var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
//var aaKeyField = localStorage["aaXKFX"];
//var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var aaPFDMZz = "https://cbsdev3.locktonwattana.com"; //"https://cbsdev2.locktonwattana.com"; // API for DMZ only

var afqrFull = "pageID='" + aaPXIXD + "' "
var afURL = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/all' //+ aaPXXI
var afsettings = {
    "url": afURL,
    "method": "POST",
    "timeout": 0,
    "headers": { "Content-Type": "application/json" },
    "data": JSON.stringify({ "@": afqrFull }), //" pageID='Resigned' "
};
var jqxhr = $.post(afsettings, function (e) { })
    .done(function (e) {
        // console.log("set aaTBKey");
        aObjMPage = e;
        var aaKeyField = aObjMPage[0].PrimaryKey;
        var aaTBKey = aObjMPage[0].TBKey;
        // console.log(aaTBKey)
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

    var aqrFull = "ERSTATUS != '' " //"Status LIKE 'Active%'" //"Dept = '1196'" // "Password !LIKE '%\%"
    var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all' //aaPFDMZz  aaPFDMI
    var settings = {"url": aurl,"method": "POST","timeout": 0,"headers": {"Content-Type": "application/json" },"data": JSON.stringify({"@": aqrFull  }),};//" Status!='Resigned' "

    $("#gridContainer").dxDataGrid({

        dataSource: new DevExpress.data.CustomStore({
            key: "ERSTATUS",
            loadMode: "omit",
            load: function () {return $.post(settings).done();},
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
                var ObjKeyData = { "ERSTATUS": $.trim(key) };   //[aaKeyField] key.trim
                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
            },
            remove: function (key) {
                var ObjKeyData = { "ERSTATUS": $.trim(key) };   //[aaKeyField] key.trim
                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
            }
        }),

        allowColumnReordering: true,
        allowColumnResizing: true,
        columnMinWidth: 60,
        columnChooser: {
            enabled: true
        },
        showBorders: true,
        sorting: {
            mode: "multiple"
        },
        selection: {
            mode: 'single', //'multiple'
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ERSTATUS' + '.xlsx');
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
            mode: "cell", // cell, row, popup
            useIcons: true,
            allowUpdating: true,
            allowDeleting: arDataD,
            allowAdding: arDataC,
            form: {
                labelLocation: 'left',
                showColonAfterLabel: false,
                colCount: 2,
            },
            popup: {
                title: "Status For Exp. Rem. Info",
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
                width: 60,
                buttons: ["edit", "delete"]
            },  
            {
                dataField: "ERNote",
                caption: "ORDER",
                dataType: "string",
                sortOrder: "asc",
                width: 100
            },

            {
                dataField: "ERSTATUS",
                caption: "Status",
                dataType: "string",
                sortOrder: "asc",
                validationRules: [{ type: 'required', message: 'Status is required' }],
                allowHiding: false,
                width: 450,
            },
            {
                dataField: "ERDesc",
                caption: "Description",
                width: 450,
            },
            {
                dataField: "ERClosed",
                caption: "Closed",
                width: 100,
            },
            {
                dataField: "ERFunction",
                caption: "Function",
                width: 300,
                visible: false,
            },

        ],
        // summary
        summary: {
            recalculateWhileEditing: true,
            skipEmptyValues: false,
            totalItems: [
                {
                    column: "ERSTATUS",
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
                                doc.save('ERSTATUS' + '.pdf');
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
