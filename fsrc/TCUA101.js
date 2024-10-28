
window.onload = function() {
    setTimeout(function() {
        location.reload();
    }, 2400000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
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
var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492"; // MasterPage
var aaPXXI = localStorage["aPXIXD"];

var xxchkxx = typeof param1 === "undefined" ? "NO" : param1;
//var aaPXIXD = localStorage["aPXIXD"];
var aaPXIXD = xxchkxx === "NO" ? localStorage["aPXIXD"] : param1;
var aaEnt = aaPXIXD.includes("X");
//var aaKeyField = localStorage["aaXKFX"];
//var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];
//var aaPFDMI = "https://cbsdev3.locktonwattana.com";//= isLocalHost();
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var aaPFDMZz = "https://cbsdev3.locktonwattana.com"; //"https://cbsdev2.locktonwattana.com"; // API for DMZ only

var afqrFull = "pageID='" + aaPXIXD + "' "
var afURL = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/all' //+ aaPXXI
var afsettings = {
    "url": afURL,
    "method": "POST",
    "timeout": 0,
    "headers": { "Content-Type": "application/json" },
    "data": JSON.stringify({ "@": afqrFull }), 
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

            var aqrFull = "IDNO != '' " //"Status LIKE 'Active%'" //"Dept = '1196'" // "Password !LIKE '%\%" ACCCODE != ''
            var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all' //aaPFDMZz  aaPFDMI

            var settings = {
                "url": aurl,
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "@": aqrFull //" Status!='Resigned' "
                }),
            };

            $("#gridContainer").dxDataGrid({

                dataSource: new DevExpress.data.CustomStore({
                    key: "IDNO",  //"ACCCODE"
                    loadMode: "omit",
                    load: function () {
                        return $.post(settings).done(function (response) {  }); //console.log(response);
                        $("#gridContainer").dxDataGrid("instance").refresh();
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
                        $("#gridContainer").dxDataGrid("instance").refresh();
                    },
                    update: function (key, values) {
                        //console.log( aaKeyField );
                        var ObjKeyData = { "IDNO": $.trim(key) };   //[aaKeyField] key.trim ACCCODE
                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                        sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                        $("#gridContainer").dxDataGrid("instance").refresh();
                    },
                    remove: function (key) {
                        var ObjKeyData = { "IDNO": $.trim(key) };   //[aaKeyField] key.trim ACCCODE
                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                        sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                        $("#gridContainer").dxDataGrid("instance").refresh();
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ACCOUNTCHART' + '.xlsx');
                        });
                    });
                    e.cancel = true;
                },
                onInitNewRow: function (e) {
                            //e.component.__addingStart = true; 
                            //gridContainer.option("editing.popup.title", "Adding Expenses Reimbursement");
                            //IDNO,EmpID,EmpName,EmpDept,EmpPosition,ExpGroupCode,ExpGroupDesc,ExpCode,ExpDesc,RefNo01,RefNo02,RefNo03,RefNo04,RefDesc,LimitedPerTime,MonthlyLimited,TotalLimited,ApproverID,ApproverName,ApproverEmail,HRApproverID,HRApproverName,HRApproverEmail,FAApproverID,FAApproverName,FAApproverEmail,Note
                            let newIDNo = aGetDateRef("L")
                            e.data.IDNO = newIDNo;
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
                        title: "Accounting Chart Info",
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
                        dataField: "ACCCODE",
                        caption: "Accounting Code",
                        sortOrder: "asc",
                        validationRules: [{ type: 'required', message: 'Accounting Code is required' }],
                        width: 100,
                    },
                    {
                        dataField: "TDESC",
                        caption: "Description (THA)",
                        editorType: "dxTextArea",
                        width: 350,
                    },
                    {
                        dataField: "EDESC",
                        caption: "Description (ENG)",
                        editorType: "dxTextArea",
                        width: 350,
                    },
                    {
                        dataField: "ALTERACC",
                        caption: "Alternative Acc. Code",
                        width: 100,
                        visible: false,
                    },
                    {
                        dataField: "MAPPING",
                        caption: "MAPPING",
                        width: 100,
                        visible: false,
                    },
                    {
                        dataField: "NOTE",
                        caption: "NOTE",
                        editorType: "dxTextArea",
                        width: 500,
                        visible: false,
                    },
                    {
                        dataField: "EXPGroup",
                        caption: "Exp Group",
                        width: 100,
                    },
                    {
                        dataField: "EXPDesc",
                        caption: "Sub Group",
                        editorType: "dxTextArea",
                        width: 150,
                    },
                    {
                        dataField: "Active",
                        caption: "Used",
                        width: 80,
                    },
                    {
                        dataField: "IDNO",
                        caption: "IDNO",
                        width: 180,
                    },                            

                ],
                // summary
                summary: {
                    recalculateWhileEditing: true,
                    skipEmptyValues: false,
                    totalItems: [
                        {
                            column: "TDESC",
                            summaryType: "count",
                            displayFormat: "{0} Items",
                        },
                    ],
                    groupItems: [
                        {
                            column: "ACCCODE",
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
                                        doc.save('ACCOUNTCHART' + '.pdf');
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
