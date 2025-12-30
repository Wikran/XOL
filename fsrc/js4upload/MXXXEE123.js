// ภาษาไทย UTF-8
// window.onload = function() {
// 	setTimeout(function() {
// 		location.reload();
// 	}, 3000000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
// }          

$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});

window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();

var aaXToX = localStorage["aaXXoX"];
var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
var aaUsrN = localStorage["aaXXuX"];
let aNowDte = new Date()

var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var aaPFDMZz = "https://cbsdev3.locktonwattana.com"; //"https://cbsdev2.locktonwattana.com"; // API for DMZ only

var afqrFull = "pageID='" + aaPXIXD + "' "
var afURL = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/all' //+ aaPXXI
var afsettings = {
    "url": afURL,
    "method": "POST",
    "timeout": 0,
    "headers": { "Content-Type": "application/json" },
    "data": JSON.stringify({ "@": btoa(afqrFull) }), //"�pageID='Resigned'�"
};
var jqxhr = $.post(afsettings, function (e) { })
    .done(function (e) {
        //console.log("set aaTBKey");
        aObjMPage = e;
        var aaKeyField = aObjMPage[0].PrimaryKey;
        var aaTBKey = aObjMPage[0].TBKey;

        //$(function () { TOP PRG
        $(() => {
            // Load Data for [Expenses] DropDown Selection 
            //var aaPFDMI = localStorage["aPXIXD"];   //"https://cbsdev2.locktonwattana.com" 
            var aaDMZSn = "https://cbsdev2.locktonwattana.com";
            var aaPFDMI = isLocalHost();
            var aaXToX = localStorage["aaXXoX"];
            let aaEmpID = $.trim(localStorage["asSTFID"]);
            let aqr2S = "Where EmpID = '" + aaEmpID + "'"

            // start get Limit
            //let aaEmpID = $.trim(localStorage["asSTFID"]);
            //let aqr2S = "Where EmpID = '" + aaEmpID + "'" //"Where ExpGroupCode = '" + aaERTYPE + "' and " + "EmpID = '" + aaEmpID + "'"
            let aFieldSelected = "RefNo01,RefNo02,MonthlyLimited,LimitedPerTime,TotalLimited,AllowFamily,AllowSSO,FleetLimit,MedicalLimit,MaternityLimit,LimitPerCase"
            let aFullBody = "Select " + aFieldSelected + " From " + "ExtraOnLine.dbo.Limitation " + aqr2S; //alert(aFullBody)                                           

            fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                .then(response => response.json())
                //
                .then(aData => {
                    var aaLimited = aData;
                    if (jQuery.type(aaLimited[0]) === "undefined") {
                        DevExpress.ui.dialog.alert({
                            //showTitle: false,
                            title: "ACCESS DENIED!!",
                            messageHtml: "<div>Un-completed system setup, please contact Administrator <br> �к��Դ����������ó� ��سҵԴ��ͼ������к� </div>"
                        });
                        System.exit(0);
                    }
                    var aaPlateNo = aaLimited[0].RefNo01;
                    var aaFCardNo = aaLimited[0].RefNo02;
                    var aaLMontyly = aaLimited[0].MonthlyLimited;  //Maternity
                    var aaLPerTime = aaLimited[0].LimitedPerTime;  // Medical Per Time
                    var aaLTotal = aaLimited[0].TotalLimited; // Fleet Card or Medical
                    var aaMedical = aaLimited[0].MedicalLimit;
                    var aaMaternity = aaLimited[0].MaternityLimit; // Maternity
                    var aaFleet = aaLimited[0].FleetLimit; // Fleet Card Limit
                    var aaLimitPC = aaLimited[0].LimitPerCase;
                    var aaFamily = aaLimited[0].AllowFamily; // Allow family
                    var aaSSO = aaLimited[0].AllowSSO; // Allow SSO 
                    //aaLTotal = aaFleet

                    // View Limit Summary //let aaTT = if today = 20/11/2022
                    var aYearNum = aNowDte.getFullYear()  // 2022
                    var aMonthNum = aNowDte.getMonth() // 10
                    var aYearStr = aYearNum.toString() // 2022
                    var aYearNumS = aNowDte.getFullYear()
                    var aYearNumL = aNowDte.getFullYear()
                    var aYearStrS = "";
                    var aYearStrL = "";
                    //---- Year for Medical 5/2021 - 4/2022 
                    if (aMonthNum === 0 || aMonthNum === 1 || aMonthNum === 2 || aMonthNum === 3) {
                        aYearNumS = aYearNum - 1;
                        aYearStrS = aYearNumS.toString(); // 21
                    } else {
                        aYearStrS = aYearNum.toString(); // 22**
                    }
                    if (aMonthNum === 0 || aMonthNum === 1 || aMonthNum === 2 || aMonthNum === 3) {
                        aYearNumL = aYearNum;
                        aYearStrL = aYearNumL.toString(); // 22
                    } else {
                        aYearNumL = aYearNum + 1;
                        aYearStrL = aYearNumL.toString(); // 23**
                    }
                    var aFilterT = aYearStrS + '/05/01'  //2022/05/01
                    var aFilterT2 = aYearStrL + '/04/30'  //2023/04/01            

                    // aGetDataModel(aaPFDMI, atob(aaXToX), "95ee65ae-df03-46b0-85e0-980c511f4357", "aaOBJAccExp") //ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE
                    // var aaExpExp = JSON.parse(localStorage.getItem("aaOBJAccExp")); //JSON.parse(localStorage.getItem("names"))

                    //aGetDataAPI(aaDMZSn, "[lockthbnk-ap14].SIBISDB.dbo.Currency", "Code,Name,(select TOP 1 DefaultRate From [lockthbnk-ap14].SIBISDB.dbo.ExchangeRate Where FromCurrency = Currency.code and ToCurrency = 'THB' ORDER by PeriodYear Desc, PeriodMonth Desc) as xRate", "aaOBJCurr")
                    //var aaCurrency = JSON.parse(localStorage.getItem("aaOBJCurr"));
                    //select  Code,Name, (select TOP 1 DefaultRate From [lockthbnk-ap14].SIBISDB.dbo.ExchangeRate Where FromCurrency = Currency.code and ToCurrency = 'THB' ORDER by PeriodYear Desc, PeriodMonth Desc) as xRate from Currency

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
                    var aNowDatev = new Date()
                    //var aRunChar = "ER-" + String( aNowDatev.getFullYear()).substring(2, 4) + String( 100 + aNowDatev.getMonth()).substring(1,3) + String( 100 + aNowDatev.getDate()).substring(1,3) + String( 100 + aNowDatev.getHours()).substring(1,3) + String( 100 + aNowDatev.getMilliseconds()).substring(1,3);
                    //ar axRunRun = aGetDateRef();

                    var asFullName = localStorage["asFTNAME"];
                    var asStaffID = localStorage["asSTFID"];
                    var asDepartment = localStorage["asDEPT"];
                    var aqrFull = "rtrim(PayToCode) = '" + $.trim(asStaffID) + "'" // scopes based permission (View Only Login Name)  ExpensesCode LIKE aaOnInitAccCode
                    var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                    var aSettings = { "url": aurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };
                    //var aaAllData;

                    $("#gridContainer").dxDataGrid({

                        dataSource: new DevExpress.data.CustomStore({
                            key: "REFNO",
                            loadMode: "omit",
                            load: function () { return $.post(aSettings).done(); },   //function (resp) {  aaAllData = resp  } console.log(resp);
                            insert: function (values) {
                                if (aaEnt) {
                                    var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };
                                    var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                }
                                else {
                                    var ObjRowData = JSON.stringify(values);
                                }
                                sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            },
                            update: function (key, values) {
                                //console.log( aaKeyField );
                                var ObjKeyData = { "REFNO": $.trim(key) };   //[aaKeyField] key.trim
                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            },
                            remove: function (key) {
                                var ObjKeyData = { "REFNO": $.trim(key) };   //[aaKeyField] key.trim
                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                                sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            }
                        }),

                        allowColumnReordering: true,
                        allowColumnResizing: true,
                        columnMinWidth: 10,
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
                            visible: true,
                            allowSearch: true,
                        },
                        filterPanel: {
                            visible: true
                        },
                        filterBuilderPopup: {
                            position: {
                                of: window, at: 'top', my: 'top', offset: { y: 5 },
                            },
                            height: 500,
                            width: 1000,
                        },
                        filterValue: [['ReqDate', '>=', aFilterT], "and", ['ReqDate', '<=', aFilterT2]],  //     [Req.Date] Is any of('2022')                                   
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
                            allowedPageSizes: [10, 20, 50, 80],
                            showNavigationButtons: true,
                            showInfo: true
                        },
                        showBorders: true,
                        groupPaging: true,
                        showColumnLines: true,
                        showRowLines: true,
                        rowAlternationEnabled: true, //true, 2 tomes
                        focusedRowEnabled: false, // focus TAB Color

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
                                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ALL_EXPREIM' + '.xlsx');
                                });
                            });
                            e.cancel = true;
                        },
                        //onEditingStart: function(e){
                        //    grid.option("editing.popup.title", "Editing");
                        //},

                        onInitNewRow: function (e) {
                            //e.component.__addingStart = true; 
                            //gridContainer.option("editing.popup.title", "Adding Expenses Reimbursement");
                            let aaID = 1
                            let axRunRun = aGetDateRef();
                            let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                            e.data.ID = aaID
                            e.data.HeadRefNo = axRunRun
                            e.data.REFNO = axLineNo
                            e.data.PayToCode = asStaffID
                            e.data.PayToName = asFullName
                            e.data.Department = asDepartment
                            e.data.ReqDate = new Date()
                        },
                        onEditorPreparing: function (e) {
                            if (e.parentType === "dataRow" && arDataU === 0) {
                                e.editorOptions.disabled = true;
                            } else {
                                if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "ID" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department")) {
                                    e.editorOptions.disabled = true;
                                }
                            }
                        },
                        onCellPrepared: function (e) {
                            if (e.parentType === "dataRow" && e.dataField === "PBatchDate") {
                                e.cellElement.css("color", "white"); //e.data.Amount >= 10000 ? "green" : "red"
                                //e.data.PBatchDate = '';
                                // Tracks the `Amount` data field
                                //e.watch(function () {
                                //    return e.data.PBatchDate;
                                //}, function () {
                                //    e.cellElement.css("color", "white"); //e.data.Amount >= 10000 ? "green" : "red"
                                //})
                            }
                        },
                        // Editing
                        editing: {
                            mode: "popup",
                            useIcons: true,
                            allowUpdating: false, //true,
                            allowDeleting: false, //arDataD,
                            allowAdding: false, //arDataC,

                            popup: {
                                title: "Expenses Reimbursement Info",
                                fullScreen: false,
                                showTitle: true,
                                width: 1200,
                                height: 650,
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
                            },

                        },
                        // column list
                        columns: [
                            {
                                dataField: "HeadRefNo",
                                caption: "REF NO",
                                sortOrder: "desc",
                                dataType: "string",
                                groupIndex: 0,
                                width: 180,
                            },
                            {
                                dataField: "ID",
                                sortOrder: "asc",
                                caption: "NO",
                                dataType: "number",
                                editorOptions: { width: 40 },
                                width: 40
                            },
                            {
                                dataField: "ReqDate",
                                caption: "Req.Date",
                                dataType: "date",
                                format: "dd/MM/yyyy",
                                editorOptions: { width: 100 },
                                width: 100,
                            },

                            {
                                dataField: "ExpGroupDescEng", //"ExpensesDescription",
                                caption: "Expenses",
                                dataType: "string",
                                editorType: "dxTextArea",
                                editorOptions: { width: 100 },
                                width: 100,
                            },
                            {
                                dataField: "ERODate01",
                                caption: "Bill Date",
                                dataType: "date",
                                format: "dd/MM/yyyy",
                                editorOptions: { width: 100, readOnly: true },
                                width: 100,
                                visible: true,
                            },
                            {
                                dataField: "LocalAmount",
                                caption: "Bill Amount",
                                dataType: "number",
                                format: { type: "fixedPoint", precision: 2 },
                                editorOptions: { format: "#,##0.00", width: 120 },
                                width: 120,
                                visible: true,
                            },
                            {
                                dataField: "ERORefNo3",
                                caption: "Sub Expenses",
                                dataType: "string",
                                editorType: "dxTextArea",
                                editorOptions: { width: 150 },
                                width: 150,
                            },
                            {
                                dataField: "ERODesc02",
                                caption: "Description",
                                dataType: "string",
                                editorType: "dxTextArea",
                                editorOptions: { width: 200 },
                                width: 200,
                            },
                            {
                                dataField: "RefundedAmount",
                                caption: "Reimburse",
                                dataType: "number",
                                format: { type: "fixedPoint", precision: 2 },
                                editorOptions: { format: "#,##0.00", width: 120 },
                                width: 120,
                            },
                            {
                                dataField: "ERStatus",
                                caption: "Status",
                                dataType: "string",
                                width: 180,
                                visible: true,
                            },
                            {
                                caption: 'PAYMENT INFORMATION',
                                columns: [
                                    {
                                        dataField: "PBatchNo",
                                        caption: "Batch No",
                                        dataType: "string",
                                        editorOptions: { width: 100, readOnly: true },
                                        width: 150,
                                        visible: true,
                                    },
                                    {
                                        dataField: "PBatchDate",
                                        caption: "Batch Date",
                                        dataType: "date",
                                        calculateCellValue: function (rowData) {
                                            if (rowData.PBatchDate.substring(0, 4) === "1901") {
                                                return ''
                                            } else {
                                                // 1901-01-01
                                                //console.log(rowData.PBatchDate.substring(0, 4), rowData.PBatchDate.substring(5,7), rowData.PBatchDate.substring(8,10));
                                                //console.log(rowData.PBatchDate.substring(0,10));
                                                //console.log(formattedDate)                                                        
                                                let aDateF = new Date(rowData.PBatchDate.substring(0, 10))
                                                let formattedDate = aDateF.toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric"
                                                });
                                                return formattedDate //rowData.PBatchDate //+ " " + rowData.lastName;
                                            }

                                        },
                                        format: "dd/MM/yyyy",
                                        allowFiltering: false,
                                        width: 120,
                                        visible: true,
                                    },
                                    {
                                        dataField: "PSPvDate",
                                        caption: "EST.Payment",
                                        dataType: "date",
                                        calculateCellValue: function (rowData) {
                                            if (rowData.PSPvDate.substring(0, 4) === "1901") {
                                                return ''
                                            } else {
                                                let aDateF = new Date(rowData.PSPvDate.substring(0, 10))
                                                let formattedDate = aDateF.toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric"
                                                });
                                                return formattedDate
                                            }
                                        },
                                        format: "dd/MM/yyyy",
                                        allowFiltering: false,
                                        width: 120,
                                        visible: true,
                                    },
                                ],
                            },
                            {
                                dataField: "Amount",
                                caption: "Expenses Amount",
                                dataType: "number",
                                format: { type: "fixedPoint", precision: 2 },
                                editorType: "dxNumberBox",
                                editorOptions: { format: "#,##0.00", width: 320 },
                                visible: false,
                            },
                            {
                                dataField: "PayToCode",
                                caption: "Code",
                                dataType: "string",
                                editorOptions: { width: 150 },
                                visible: false,
                            },
                            {
                                dataField: "PayToName",
                                caption: "Name",
                                dataType: "string",
                                editorOptions: { width: 300 },
                                width: 250,
                                visible: false,
                            },
                            {
                                dataField: "Department",
                                caption: "Department",
                                dataType: "string",
                                editorOptions: { width: 150 },
                                width: 100,
                                visible: false,
                            },
                            {
                                dataField: "Division",
                                caption: "Division",
                                dataType: "string",
                                editorOptions: { width: 150 },
                                width: 150,
                                visible: false,
                            },
                            {
                                dataField: "ExpensesCode",
                                caption: "Expenses Code",
                                dataType: "string",
                                editorType: "dxTextArea",
                                editorOptions: { width: 120 },
                                width: 120,
                                visible: false,
                            },
                            {
                                dataField: "Currency",
                                caption: "Currency",
                                dataType: "string",
                                editorType: "dxTextArea",
                                editorOptions: { width: 100 },
                                width: 100,
                                visible: false,
                            },
                            {
                                dataField: "Xrate",
                                caption: "X-Rate",
                                dataType: "number",
                                format: { type: "fixedPoint", precision: 6 },
                                editorType: "dxNumberBox",
                                editorOptions: { format: "#,##0.000000", width: 100 },
                                width: 100,
                                visible: false,
                            },
                            {
                                dataField: "Note",
                                caption: "Note",
                                dataType: "string",
                                editorType: "dxTextArea",
                                editorOptions: { width: 400, height: 80 },
                                width: 100,
                                visible: false,
                            },

                            {
                                dataField: "PSPvNO",
                                caption: "PS PVNO",
                                dataType: "string",
                                editorOptions: { width: 120 },
                                width: 120,
                                visible: false,
                            },
                            /*
                            {
                                dataField: "PSPvDate",
                                caption: "PS PV Date",
                                dataType: "date",
                                format: "dd/MM/yyyy",
                                width: 100,
                                visible: false,
                            },
                            */
                            {
                                dataField: "EntryBy",
                                caption: "Entry By",
                                dataType: "string",
                                width: 100,
                                visible: false,
                            },
                            {
                                dataField: "EntryDate",
                                caption: "Entry Date",
                                dataType: "date",
                                format: "dd/MM/yyyy",
                                width: 100,
                                visible: false,
                            },
                            /*{
                                type: "buttons",
                                width: 80,
                                buttons: ["edit", "delete"],
                                visible: false,
                            },*/

                        ],
                        // summary
                        summary: {
                            recalculateWhileEditing: true,
                            skipEmptyValues: false,
                            totalItems: [
                                {
                                    column: "REFNO",
                                    summaryType: "count",
                                    /*
                                        summaryType: "max",
                                        valueFormat: "currency",
                                        showInGroupFooter: false,
                                        alignByColumn: true   
                                    */
                                    displayFormat: "{0} Items",

                                },
                                {
                                    column: "LocalAmount",
                                    summaryType: "sum",
                                    valueFormat: "#,##0.00",
                                    /*
                                        summaryType: "max",
                                        showInGroupFooter: false,
                                        alignByColumn: true 
                                    */
                                    displayFormat: "{0}",
                                },
                                {
                                    column: "RefundedAmount",
                                    summaryType: "sum",
                                    valueFormat: "#,##0.00",
                                    displayFormat: "{0}",
                                    //showInGroupFooter: true,
                                    //alignByColumn: true,           
                                },
                            ],
                            groupItems: [
                                {
                                    column: "ExpensesCode",
                                    summaryType: "count",
                                    displayFormat: "{0} Items",
                                },
                                {
                                    column: "LocalAmount",
                                    summaryType: "sum",
                                    valueFormat: "#,##0.00",
                                    showInGroupFooter: true,
                                    alignByColumn: true,
                                    displayFormat: "{0}",
                                },
                                {
                                    column: "RefundedAmount",
                                    summaryType: "sum",
                                    valueFormat: "#,##0.00",
                                    showInGroupFooter: true,
                                    alignByColumn: true,
                                    displayFormat: "{0}",
                                },
                            ],
                        },
                        // Tool Bar
                        onToolbarPreparing: function (e) {
                            var dataGrid = e.component;
                            e.toolbarOptions.items.unshift(
                                {
                                    location: "before",
                                    template: function () { return $("<div style='padding: 5px 5px;'/>") }
                                },
                                {
                                    location: "before",
                                    template: function () {
                                        return $("<div />")
                                            //.addClass("informer")
                                            .append(
                                                $("<span style='font-size: 13px; font-weight: bold; color: white; background-color: LightSeaGreen; border-radius: 3px; border: 0px; padding: 1px 30px; ' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px;
                                                    .text("ALL EXPENSES FOR"),
                                                $("<br><center />"),
                                                $("<i class= 'fas fa-user-circle''><span />")   //; style='color: DarkGreen;
                                                    //.addClass("name")
                                                    .text(" " + $.trim(asFullName)),
                                            );
                                    }
                                },
                                {
                                    location: "after",
                                    template: function () { return $("<div style='padding: 5px 95px;'/>") }
                                },
                                {
                                    location: "after",
                                    widget: "dxButton",
                                    options: {
                                        icon: "fas fa-star", //"fas fa-question-circle",
                                        text: "Benefits",
                                        type: "default",
                                        stylingMode: "contained", //outlined contained
                                        onClick: function () {
                                            //let aNewDate = new Date()
                                            //aPopUpAddForm(1, 1, aNewDate);
                                            aPopUpBenefits(aaLimited) //aaMedical,aaFamily,aaSSO,aaMaternity,aaFleet
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
                                        icon: "pdffile",
                                        text: "Export to PDF",
                                        onClick: function () {
                                            const doc = new jsPDF();
                                            //doc.addFont("font/ANGSA.ttf", "angsana", "normal");
                                            doc.addFont("font/Prompt-ExtraLight.ttf", "Prompt", "normal");
                                            doc.setFont("Prompt", "normal");
                                            DevExpress.pdfExporter.exportDataGrid({
                                                jsPDFDocument: doc,
                                                component: dataGrid,
                                                customizeCell: function (options) {
                                                    const { gridCell, pdfCell } = options;

                                                    //if(gridCell.rowType === 'data') {
                                                    pdfCell.styles = {
                                                        font: 'Prompt',
                                                        fontSize: 12
                                                    }
                                                    //}
                                                }
                                            }).then(function () {
                                                doc.save('EXPREIM' + '.pdf');
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

                    // Check Benefits Popup
                    function aPopUpBenefits(iData) { //aaMedical,aaFamily,aaSSO,aaMaternity,aaFleet
                        var aYearNum1 = aGetBusYear(1, 4) //aNowDte.getFullYear()
                        var aYearStr1 = aYearNum1.toString()
                        var aCalYear = aNowDte.getFullYear();
                        var aCalYearStr = aCalYear.toString();
                        //PayToCode = '101301' and ((ExpGroupDescEng Like '%SSO%' and (QYear = '2022' or QYear = '2023')) or QYear = '2022') AND (TAmount + TRefundAmt) <> 0
                        //var aaSqlS = "PayToCode LIKE '" + $.trim(aaEmpID) + "%' and QYear = " + aYearStr1 + " AND (TAmount + TRefundAmt) <> 0 "
                        var aaSqlS = "PayToCode LIKE '" + $.trim(aaEmpID) + "%' AND ((ExpGroupDescEng Like '%SSO%' and (QYear = " + aYearStr1 + " or QYear = " + aCalYearStr + ")) or QYear = " + aYearStr1 + ") AND (TAmount + TRefundAmt) <> 0 "
                        var aaqrFull = aaSqlS;
                        var aaurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "D8CAE826-9DFA-4446-A12C-0C42B1A95ADB" + '/all'
                        var aaSettings = { "url": aaurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aaqrFull) }), };

                        jQuery(function ($) {
                            const popup = $("#popupBenefitsView").dxPopup({
                                title: "My Benefits",
                                width: '900px',
                                height: '600px',
                                //container: '.dx-viewport',
                                focusStateEnabled: true,
                                position: { offset: "0 -165" }, //{offset: "0 -180"},
                                //shadingColor: "rgb(0, 0, 0, 0)", //rgba(0, 0, 0, 0.2) rgb(186, 242, 252)
                                //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                /*onShowing: function (e) {
                                    e.component.content().css("background-color", "rgb(242, 253, 255)");
                                },*/
                                visible: true,
                                fullScreen: false,
                                showCloseButton: false,
                                showTitle: true,
                                dragEnabled: true,
                                closeOnOutsideClick: false,
                                resizeEnabled: true,
                                //shadingColor:"rgb(190,190,190,0.9)",
                                //toolbarItems: [{toolbar:"top", html: "<span id='popupexit'></span>"}],
                                //toolbarItems: [
                                //    {toolbar:"top", html:"<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"}],            
                                contentTemplate: function () {
                                    return $("<div />").append(
                                        $("<p><div id='Benefits-View' background-color: grey></div></p>"), //'<hr>'
                                        $("<p><hr></p>"),
                                        $("<span style='font-size: 13px; font-weight: bold; color: darkblue; background-color: rgb(64, 224, 208); border-radius: 3px; border: 0px; padding: 1px 10px;' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px;
                                            .text("MEDICAL BENEFITS BALANCE"),
                                        $("<br>"),
                                        //$("<p>BENEFITS BALANCE</p>"),
                                        $("<span style='font-size: 9px;  color: darkblue;' />").text("[NOT SHOW = Never used, Medical = OPD+Dental]"),
                                        //$("<p><small>[NOT SHOW = Never used, Medical = OPD+Dental]</small></p>").text("BENEFITS BALANCE"),,
                                        $("<p><center><div id='Benefits-Movement'></div></center></p>"),
                                        //$("<p><span id='asave'></span></p>"),
                                        //$("<p><div id='Add-dxDataGrid'></div></p>"),
                                        // $("<p <div id='popover1'>Please get OTP from your register e-Mail, put here and then press [LOGIN]</div></p>"),
                                        // $("<p><span id='print'></span></p>"), 
                                        // $("<span id='popupexit'></span>")                              
                                    );
                                },
                                onContentReady: function () {
                                    // $("#Add-dxDataGrid").hide(); // hide dataGrid
                                },
                                toolbarItems: [
                                    {
                                        toolbar: "top",
                                        locateInMenu: 'always',
                                        //html: "<div padding-top: -7px;><img src='./images/locktonlogo70mmblack.png' width='85'></div>" // Logo
                                    },
                                    {
                                        toolbar: "top",
                                        locateInMenu: 'always',
                                        widget: "dxButton",
                                        //toolbar: "bottom",
                                        location: "after",
                                        options: {
                                            //text: "EXIT",
                                            icon: "fas fa-times",
                                            stylingMode: "outlined",
                                            type: "danger",
                                            onClick: function (e) {
                                                popup.hide()
                                            }
                                        }
                                    }]

                            }).dxPopup("instance");

                            //Benefits Form
                            const aform = $("#Benefits-View").dxForm({
                                formData: iData, //aXXData[0], //iData, aaLimited
                                showColonAfterLabel: false,
                                labelLocation: "left", //"top",
                                cssClass: "aMarkRef",
                                readOnly: true,
                                colCount: 1,
                                items: [{
                                    itemType: "group",
                                    //caption: "Refference",
                                    //cssClass: "second-group",
                                    //AllowFamily,AllowSSO,FleetLimit,MedicalLimit,MaternityLimit,LimitPerCase
                                    //IDNO,EmpID,EmpName,EmpDept,EmpPosition,ExpGroupCode,ExpGroupDesc,ExpCode,ExpDesc,RefNo01,RefNo02,RefNo03,RefNo04,RefDesc,LimitedPerTime,MonthlyLimited,TotalLimited,ApproverID,ApproverName,ApproverEmail,HRApproverID,HRApproverName,HRApproverEmail,FAApproverID,FAApproverName,FAApproverEmail,Note,AllowFamily,AllowSSO,FleetLimit,MedicalLimit,MaternityLimit,LimitPerCase
                                    colCount: 3,
                                    items: [
                                        {
                                            dataField: "EmpName",
                                            label: { text: "Name" },
                                            dataType: "string",
                                            editorType: "dxTextBox",
                                            editorOptions: { value: asFullName, width: 150 },
                                        },

                                        {
                                            dataField: "AllowFamily",
                                            label: { text: "Allow Family" },
                                            dataType: "boolean",
                                            editorOptions: { value: aaFamily, width: 100 },
                                        },

                                        {
                                            dataField: "AllowSSO",
                                            label: { text: "Allow SSO" },
                                            dataType: "boolean",
                                            editorOptions: { value: aaSSO, width: 100 },
                                        },

                                        {
                                            dataField: "MedicalLimit",
                                            label: { text: "Medical Limit" },
                                            dataType: "number",
                                            editorOptions: { value: aaMedical, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                            visible: true,
                                        },
                                        {
                                            dataField: "MaternityLimit",
                                            label: { text: "Maternity Limit" },
                                            dataType: "number",
                                            editorOptions: { value: aaMaternity, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                            visible: true,
                                        },

                                        {
                                            dataField: "LimitPerCase",
                                            label: { text: "Limit per time" },
                                            dateType: "number",
                                            editorOptions: { value: aaLimitPC, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                            visible: (aaLimitPC !== 0),
                                        },
                                        {
                                            itemType: "empty"
                                        },
                                        {
                                            dataField: "FleetLimit",
                                            label: { text: "Fleet Card Limit" },
                                            dataType: "number",
                                            editorOptions: { value: aaFleet, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                            visible: (aaFleet !== 0),
                                        },
                                        {
                                            dataField: "EmpPosition",
                                            label: { text: "Plate No" },
                                            dataType: "string",
                                            editorOptions: { value: aaPlateNo, width: 180 },
                                            visible: (aaFleet !== 0),
                                        },
                                        {
                                            dataField: "EmpDept",
                                            label: { text: "Fleet Card NO" },
                                            dataType: "string",
                                            editorType: "dxTextBox",
                                            editorOptions: { value: aaFCardNo, width: 180 },
                                            visible: (aaFleet !== 0),
                                        },

                                    ]

                                },

                                ]

                            }).dxForm("instance");

                            //Benefits DataGrid
                            $("#Benefits-Movement").dxDataGrid({
                                dataSource: new DevExpress.data.CustomStore({
                                    key: "PayToCode",
                                    loadMode: "omit",
                                    /*
                                    load: function () {
                                        return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "D8CAE826-9DFA-4446-A12C-0C42B1A95ADB" + '/all', { "@": aaSqlS }) // Change aaTBKey to TokenKey for this table 5102300001
                                            .fail(function () { throw "Data loading error" });
                                    },
                                    */
                                    load: function () { return $.post(aaSettings).done(); },
                                }),

                                ///dataSource: aaiData,
                                allowColumnReordering: true,
                                allowColumnResizing: false,
                                columnMinWidth: 20,
                                columnChooser: {
                                    enabled: false, //false // true
                                },
                                //PayToCode,PayToName,ExpGroupCode,ExpGroupDescEng,QYear,TAmount,TRefundAmt,LAmount,MRemained
                                showBorders: true,
                                showColumnLines: true,
                                columns: [
                                    {
                                        dataField: "ExpGroupDescEng",
                                        caption: "Expenese",
                                        sortOrder: "desc",
                                        editorOptions: { width: 120 },
                                        width: 120
                                    },
                                    {
                                        dataField: "QYear",
                                        caption: "Year",
                                        editorOptions: { width: 80 },
                                        width: 80,
                                        visible: true,
                                    },
                                    {
                                        dataField: "TAmount",
                                        caption: "Usage",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        width: 120,
                                        visible: true,
                                    },
                                    {
                                        dataField: "TRefundAmt",
                                        caption: "Reimbursement",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        width: 120,
                                        visible: true,
                                    },
                                    {
                                        dataField: "LAmount",
                                        caption: "Limit Amount",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        width: 120,
                                        visible: true,
                                    },
                                    {
                                        dataField: "MRemained",
                                        caption: "Remained",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        width: 120,
                                        visible: true,
                                    },

                                ],
                                // summary
                                summary: {
                                    recalculateWhileEditing: true,
                                    skipEmptyValues: false,
                                    totalItems: [
                                        {
                                            column: "ExpGroupDescEng",
                                            summaryType: "count",
                                            displayFormat: "TOTAL",
                                        },
                                        {
                                            column: "TAmount",
                                            cssClass: "colorGreen",
                                            summaryType: "sum",
                                            valueFormat: "#,##0.00",
                                            displayFormat: "{0}",
                                        },
                                        {
                                            column: "TRefundAmt",
                                            cssClass: "colorGreen",
                                            summaryType: "sum",
                                            valueFormat: "#,##0.00",
                                            displayFormat: "{0}",
                                        },
                                    ],

                                },

                            }).dxDataGrid("instance");

                        });
                    }

                    function aDataGridRF() {
                        dataGrid.refresh();
                    }

                    function aSearchjson(aObjArr, asID) {
                        return aObjArr.filter( //aaEmployee
                            function (data) {
                                return data.ACCCODE == asID
                            }
                        );
                    }

                    function aSearchXjson(aObjArr, asID) {
                        return aObjArr.filter( //aaEmployee
                            function (data) {
                                return data.Code == asID
                            }
                        );
                    }

                }) //then fetch (Limit)


        });
        // TOP PRG
    });  // ajax 