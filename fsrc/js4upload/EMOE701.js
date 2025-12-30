//Employee (live)
// window.onload = function() {
//     setTimeout(function() {
//         location.reload();
//     }, 3000000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
// }         
$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
var aaXToX = localStorage["aaXXoX"];
var xxchkxx = typeof param1 === "undefined" ? "NO" : param1;
//var aaPXIXD = localStorage["aPXIXD"];
var aaPXIXD = xxchkxx === "NO" ? localStorage["aPXIXD"] : param1;
var aaEnt = aaPXIXD.includes("X");
var aaKeyField = localStorage["aaXKFX"];
var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var aaPFDMZz = "https://webspace.locktonwattana.com"; //"https://cbsdev2.locktonwattana.com"; // API for DMZ only
//var aaPXIXD = param1;
var afqrFull = "pageID='" + aaPXIXD + "' "
var afURL = aaPFDMZz + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/all' //+ aaPXXI
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
        // console.log("set aaTBKey");
        aObjMPage = e;
        var aaaKeyField = aObjMPage[0].PrimaryKey;
        var aaaTBKey = aObjMPage[0].TBKey;
        // console.log(aaaTBKey)

        // TOP PRG
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

            var aqrFull = "Status != 'Resigned' " //"Status LIKE 'Active%'" //"Dept = '1196'" // "Password !LIKE '%\%"
            var aurl = aaPFDMZz + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaaTBKey + '/all'

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

            var requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "@": aqrFull }),
                redirect: "follow"
            };

            $("#gridContainer").dxDataGrid({

                dataSource: new DevExpress.data.CustomStore({
                    key: "EMPCode",
                    loadMode: "omit",
                    load: function () { //$.post(settings).done(function (response) { console.log(response); }); fetch(aurl,requestOptions).then(response => response.json()).then(data => {console.log(data)} );
                        return $.post(settings).done(function (response) {}); //console.log(response);$.post(aaPFDMZz + '/DMQ/XOL/'+ atob(aaXToX) +'/' + aaTBKey + '/all') //,{ "@": aqrFull  }
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
                        sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                    },
                    update: function (key, values) {
                        //console.log( aaKeyField );
                        var ObjKeyData = { "EMPCode": $.trim(key) };   //[aaKeyField] key.trim
                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                        sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                    },
                    remove: function (key) {
                        var ObjKeyData = { "EMPCode": $.trim(key) };   //[aaKeyField] key.trim
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
                    mode: 'single' //'multiple'
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
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Employee' + '.xlsx');
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
                onRowPrepared: function (e) {
                    if (e.rowType === "data" && e.data.Status === "Supervisor") {
                        e.rowElement.style.Color = "red";
                    }
                },
                //
                //
                // Editing
                editing: {
                    mode: "popup",
                    useIcons: true,
                    allowUpdating: false, //true,
                    allowDeleting: false, //arDataD,
                    allowAdding: false, //arDataC,
                    form: {
                        labelLocation: 'left',
                        showColonAfterLabel: false,
                        colCount: 2,
                    },
                    popup: {
                        title: "Employee Info",
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
                        dataField: "EMPCode",
                        caption: "Code",
                        dataType: "string",
                        width: "100",
                        allowHiding: false,
                    },
                    {
                        dataField: "Salutation",
                        caption: "Salutation",
                        dataType: "string",
                        width: 100,
                        visible: false,
                    },
                    {
                        dataField: "Name",
                        caption: "Name",
                        dataType: "string",
                        width: 200,
                        visible: false,
                    },
                    {
                        dataField: "Ename",
                        caption: "ENG Name",
                        dataType: "string",
                        width: 200,
                        visible: false,
                    },
                    {
                        dataField: "Surname",
                        caption: "Surname",
                        dataType: "string",
                        width: 200,
                        visible: false,
                    },
                    {
                        dataField: "Esurname",
                        caption: "ENG surname",
                        dataType: "string",
                        width: 200,
                        visible: false,
                    },
                    {
                        dataField: "FullNameEng",
                        caption: "Full Eng Name",
                        dataType: "string",
                        sortOrder: "asc",
                        width: 250,
                    },
                    {
                        dataField: "FullNameThai",
                        caption: "Full Thai Name",
                        dataType: "string",
                        width: 250,
                    },
                    {
                        dataField: "NickName",
                        caption: "Nick Name",
                        dataType: "string",
                        width: 100,
                    },
                    {
                        dataField: "EmpType",
                        caption: "Emp Type",
                        dataType: "string",
                        width: 100,
                        visible: false,
                    },
                    {
                        dataField: "IDCODE",
                        caption: "ID NO",
                        dataType: "string",
                        width: 100,
                        visible: false,
                    },
                    {
                        dataField: "BirthDate",
                        caption: "Birth Date",
                        dataType: "datetime",
                        format: "dd/MM/yyyy",
                        width: 120,
                        visible: false,
                    },
                    {
                        dataField: "Sex",
                        caption: "Sex",
                        dataType: "string",
                        width: 100,
                        visible: false,
                    },
                    {
                        dataField: "EmployDate",
                        caption: "Employed Date",
                        dataType: "datetime",
                        format: "dd/MM/yyyy",
                        width: 120,
                        visible: false,
                    },
                    {
                        dataField: "EffectiveDate",
                        caption: "Effective Date",
                        dataType: "datetime",
                        format: "dd/MM/yyyy",
                        width: 120,
                        visible: false,
                    },
                    {
                        dataField: "ResignDate",
                        caption: "Resigned Date",
                        dataType: "datetime",
                        format: "dd/MM/yyyy",
                        width: 120,
                        visible: false,
                    },
                    {
                        dataField: "Dept",
                        caption: "Department",
                        dataType: "string",
                        width: 100,
                        visible: false,
                    },
                    {
                        dataField: "DivCode",
                        caption: "Division Code",
                        dataType: "string",
                        width: 100,
                        visible: false,
                    },
                    {
                        dataField: "AccDeptCode",
                        caption: "AC Dept Code",   
                        dataType: "string",
                        editorType: "dxTextBox",
                        width: 90,
                        visible: true,
                    },
                    {
                        dataField: "AccDivCode",
                        caption: "AC Div Code",
                        //sortOrder: "asc",
                        dataType: "string",
                        editorType: "dxTextBox",
                        width: 90,
                        visible: true,
                    },                            
                    {
                        dataField: "Position",
                        caption: "Position",
                        dataType: "string",
                        width: 200,
                    },
                    {
                        dataField: "Username",
                        caption: "User name",
                        dataType: "string",
                        width: 100,
                        visible: false,
                    },
                    /*{  dataField: "Password",
                       caption:"Password",
                       visible: false,
                    },*/
                    {
                        dataField: "EmailAddress",
                        caption: "Email Address",
                        dataType: "string",
                        width: 250,
                        //visible: false,
                    },
                    {
                        dataField: "Status",
                        caption: "Status",
                        dataType: "string",
                        width: 100,
                        //visible: false,
                    },
                    {
                        dataField: "Signature",
                        caption: "Signature",
                        dataType: "string",
                        visible: false,
                    },
                    {
                        dataField: "NOTE",
                        caption: "NOTE",
                        dataType: "string",
                        visible: false,
                    },
                    {
                        type: "buttons",
                        width: 110,
                        buttons: ["edit", "delete"],
                        visible: false,
                    }
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
                                    //doc.addFont("font/ANGSA.ttf", "angsana", "normal");
                                    doc.addFont("font/Prompt-ExtraLight.ttf", "Prompt", "normal"); // load thai font (in font location Google Font)
                                    doc.setFont("Prompt", "normal"); // set to thai font
                                    DevExpress.pdfExporter.exportDataGrid({
                                        jsPDFDocument: doc,
                                        component: dataGrid,
                                        customizeCell: function (options) {
                                            const { gridCell, pdfCell } = options;

                                            //if(gridCell.rowType === 'data') {
                                            //set font and font size
                                            pdfCell.styles = {
                                                font: 'Prompt',
                                                fontSize: 9
                                            }
                                            //}
                                        }
                                    }).then(function () {
                                        doc.save('Employee' + '.pdf');
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
