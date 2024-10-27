//Division
$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
//console.log(param1)
var aaXToX = localStorage["aaXXoX"];
var xxchkxx = typeof param1 === "undefined" ? "NO" : param1;
//var aaPXIXD = localStorage["aPXIXD"];
var aaPXIXD = xxchkxx === "NO" ? localStorage["aPXIXD"] : param1;
var aaEnt = aaPXIXD.includes("X");
var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var aaPFDMZz = "https://cbsdev2.locktonwattana.com"; //"https://cbsdev3.locktonwattana.com"; // API for DMZ only        
var aaPFDMIZz = isLocalHost();
//var aaPXIXD = param1;
var afqrFull = "pageID='" + aaPXIXD + "' "
var afURL = aaPFDMZz + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/all' //+ aaPXXI
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
        //var aaaKeyField = aObjMPage[0].PrimaryKey;
        var aaaTBKey = aObjMPage[0].TBKey;
        // console.log(aaaTBKey)
        // console.log(aaaKeyField)

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
            //var aaPFDMZz = "https://cbsdev2.locktonwattana.com";

            var aqrFull = "DivCode != '' " //"Status LIKE 'Active%'" //"Dept = '1196'" // "Password !LIKE '%\%"
            var aurl = aaPFDMZz + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaaTBKey + '/all'

            var settings = {
                "url": aurl,
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "@": aqrFull //"Status!='Resigned'"
                }),
            };

            var requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "@": aqrFull }),
                redirect: "follow"
            };


            $("#gridContainer").dxDataGrid({

                dataSource: new DevExpress.data.CustomStore({
                    key: "DivCode", //aaaKeyField, //"DivCode",
                    loadMode: "omit",
                    load: function () { //$.post(settings).done(function (response) { console.log(response); }); fetch(aurl,requestOptions).then(response => response.json()).then(data => {console.log(data)} );
                        return $.post(settings).done(function (response) {}); //console.log("DATA = ", response);.post(aaPFDMZz + '/DMQ/XOL/'+ atob(aaXToX) +'/' + aaTBKey + '/all') //,{ "@": aqrFull  }
                        //.fail(function() { throw "Data loading error" });
                    },
                    insert: function (values) {

                        if (aaEnt) {
                            var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date() };
                            var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                        }
                        else {
                            var ObjRowData = JSON.stringify(values);
                        }
                        sendRequestNew("Insert", ObjRowData, aaaTBKey, aaPFDMI, atob(aaXToX));
                    },
                    update: function (key, values) {
                        // console.log(key, values);
                        var ObjKeyData = { "DivCode": $.trim(key) };   //[aaKeyField] key.trim
                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                        // console.log("Update row data ", ObjRowData)
                        sendRequestNew(aUpdateText, ObjRowData, aaaTBKey, aaPFDMI, atob(aaXToX));
                    },
                    remove: function (key) {
                        var ObjKeyData = { "DivCode": $.trim(key) };   //[aaKeyField] key.trim
                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                        sendRequestNew("Delete", ObjRowData, aaaTBKey, aaPFDMI, atob(aaXToX));
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
                    mode: "row", // row, popup
                    useIcons: true,
                    allowUpdating: true, //true,
                    allowDeleting: false, //arDataD,
                    allowAdding: false, //arDataC,
                    form: {
                        labelLocation: 'left',
                        showColonAfterLabel: false,
                        colCount: 2,
                    },
                },
                // column list
                columns: [
                    {
                        type: "buttons",
                        width: 110,
                        buttons: ["edit", "delete"],
                        visible: false,
                    },
                    {
                        dataField: "DivCode",
                        caption: "Division",
                        sortOrder: "asc",
                        allowHiding: false,
                        width: 150,
                    },
                    {
                        dataField: "DivName",
                        caption: "Division Name",
                        width: 350,
                    },
                    {
                        dataField: "AccDeptCode",
                        caption: "Acc Department",
                        dataType: "string",
                        width: 150,
                    },
                    {
                        dataField: "AccDivCode",
                        caption: "Acc Division",
                        dataType: "string",
                        width: 150,
                    },
                    {
                        dataField: "DepCode",
                        caption: "Department",
                        //groupIndex: 0,
                        width: 150,
                    },
                    {
                        dataField: "Note",
                        caption: "Note",
                        editorType: "dxTextArea",
                        width: 400,
                        visible: false,
                    },

                ],
                // summary
                summary: {
                    recalculateWhileEditing: true,
                    skipEmptyValues: false,
                    totalItems: [
                        {
                            column: "DivCode",
                            summaryType: "count",
                            displayFormat: "{0} Items",
                        },
                    ],
                    groupItems: [
                        {
                            column: "DivName",
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
        // TOP PRG
    });  // ajax   