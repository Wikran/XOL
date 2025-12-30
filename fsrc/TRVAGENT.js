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
var aaPFDMI = isLocalHost();
var aaXToX = localStorage["aaXXoX"];
var aaXNoX = localStorage["aaXXuX"];
var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492";
var aaPXXI = localStorage["aPXIXD"];

var jqxhr = $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaXTXB + '/' + aaPXXI, function (e) {
    aObjMPage = e;
    aaKeyField = aObjMPage[0].PrimaryKey;
    aaTBKey = aObjMPage[0].TBKey;
    localStorage.setItem("aaXKFX", aaKeyField);
    localStorage.setItem("aaXTBX", aaTBKey);
})
    .done(function (e) {
        aObjMPage = e;
        aaKeyField = aObjMPage[0].PrimaryKey;
        aaTBKey = aObjMPage[0].TBKey;
        localStorage.setItem("aaXKFX", aaKeyField);
        localStorage.setItem("aaXTBX", aaTBKey);
    })
    .fail(function () {
        // console.log("error");
    })
    .always(function () {
        // console.log("complete");
    });

var xxchkxx = typeof param1 === "undefined" ? "NO" : param1;
//var aaPXIXD = localStorage["aPXIXD"];
var aaPXIXD = xxchkxx === "NO" ? localStorage["aPXIXD"] : param1; var aaEnt = aaPXIXD.includes("X");
var aaKeyField = localStorage["aaXKFX"];
var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];

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

/*     function logEvent(eventName) {
        var logList = $("#events ul"),
            newItem = $("<li>", { text: eventName });
        logList.prepend(newItem);
    } */

    $("#gridContainer").dxDataGrid({

        dataSource: new DevExpress.data.CustomStore({
            key: "AgentID",
            loadMode: "omit",
            load: function () {
                return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all')
                    .fail(function () { throw "Data loading error" });
            },
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
                var ObjKeyData = { "AgentID": $.trim(key) };   //[aaKeyField] key.trim
                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
            },
            remove: function (key) {
                var ObjKeyData = { "AgentID": $.trim(key) };   //[aaKeyField] key.trim
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
            mode: 'single'// 'multiple'
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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'TRVAGENT' + '.xlsx');
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
                title: "Department Info",
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
                width: 80,
                buttons: ["edit", "delete"]
            },
            {
                dataField: "AgentID",  //"AgentID,CompanyIDNO,AgentName,ContactPerson,Email,Phone,Address,Country,RegistrationNo,LicenseExpiryDate,Website,Status,EntryDate,EntryBy"
                caption: "Agent ID",
                sortOrder: "asc",
                validationRules: [{ type: 'required', message: 'Agent ID is required' }],
                allowHiding: false,
                width: 100,
            },
            {
                dataField: "AgentName",
                caption: "Agent Name",
            },
            {
                dataField: "ContactPerson",
                caption: "Contact Person",
            },
            {
                dataField: "Email", //Phone,Address,Country,RegistrationNo,LicenseExpiryDate,Website,Status,EntryDate,EntryBy
                caption: "Email",
            },
            {
                dataField: "Phone",
                caption: "Phone",
            },  
                     
            {
                dataField: "Address",
                caption: "Address",
                editorType: "dxTextArea",
                width: 500,
            },
            {
                dataField: "Website",
                caption: "Website",
            },             
            {
                dataField: "Country",
                caption: "Country",
            },               

        ],
        // summary
        summary: {
            recalculateWhileEditing: true,
            skipEmptyValues: false,
            totalItems: [
                {
                    column: "AgentName",
                    summaryType: "count",
                    displayFormat: "{0} Items",
                },
            ],
            groupItems: [
                {
                    column: "AgentID",
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
                                doc.save('TravelAgent' + '.pdf');
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
