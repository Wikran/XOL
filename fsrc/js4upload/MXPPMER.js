//T-Account PPM 

        $(document).ready(function () {
            var aDXTheme = localStorage["aDXTheme"]
            DevExpress.ui.themes.current(aDXTheme);
        });
     
        window.jsPDF = window.jspdf.jsPDF;
        applyPlugin(window.jsPDF);
        console.clear();
        var aaPFDMI = isLocalHost();
        var aaXToX = localStorage["aaXXoX"];

/*
        var jqxhr = $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaXTXB + '/' + aaPXXI, function (e) {
            console.log("success");
            aObjMPage = e;
            aaKeyField = aObjMPage[0].PrimaryKey;
            aaTBKey = aObjMPage[0].TBKey;
            localStorage.setItem("aaXKFX", aaKeyField);
            localStorage.setItem("aaXTBX", aaTBKey);
        })
            .done(function (e) {
                console.log("second success");
                aObjMPage = e;
                aaKeyField = aObjMPage[0].PrimaryKey;
                aaTBKey = aObjMPage[0].TBKey;
                localStorage.setItem("aaXKFX", aaKeyField);
                localStorage.setItem("aaXTBX", aaTBKey);
            })
            .fail(function () {
                console.log("error");
            })
            .always(function () {
                console.log("complete");
            });


        function aGetDataModel(aServerURL, aPUBToken, aTBToken, aOBJName) {
            let aaACcT = aTBToken //"95ee65ae-df03-46b0-85e0-980c511f4357"
            var jqOTHs = $.post(aServerURL + '/DMQ/XOL/' + aPUBToken + '/' + aTBToken + '/all', function (e) {
                //console.log( "success EXP" );
                aaExpLU = e;
                localStorage.setItem(aOBJName, JSON.stringify(aaExpLU));
                //localStorage.setItem("names", JSON.stringify(names)); 
            })
                .done(function (e) {
                    //console.log( "second success EXP" );   
                })
                .fail(function () {
                    console.log("error EXP");
                })
                .always(function () {
                    console.log("complete EXP");
                });
        }

        // Function for Load Master Data for dropdown and others 
        // "https://cbsdev2.locktonwattana.com","[lockthbnk-ap14].ExtraOnLine.dbo.XOLStaff","EMPCode,FullNameThai,FullNameEng,EffectiveDate,ResignDate,Dept,DivCode,EmailAddress","aaOBJDT"

        async function aGetDataAPI(aDMZServer, aFullTableName, aFieldSelected, aOBJsName) {
            let aLocalSQLToken = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232"; // with select command
            let aLocalNonQueryToken = "9DE8BDB8-8EE0-48D0-A506-9AD24F151F9A"; // no select command
            let aaXPUB = "A75FCC75-8FB6-4460-B3F6-7070B4437930"; //Public Key
            let aFullBody = "Select " + aFieldSelected + " From " + aFullTableName;

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "@": aFullBody
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            let aURL = aDMZServer + "/DMQ/XOL/" + aaXPUB + "/" + aLocalSQLToken;

            await fetch(aURL, requestOptions)
                .then(response => response.json())
                //
                .then(aData => {
                    localStorage.setItem(aOBJsName, JSON.stringify(aData));
                })
                .catch((e) => {
                    console.log(e)
                })
        }

        async function aGetD2V(aDMZServer, aFullTableName, aFieldSelected, aOBJsName) {
            let aLocalSQLToken = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232"; // with select command
            let aLocalNonQueryToken = "9DE8BDB8-8EE0-48D0-A506-9AD24F151F9A"; // no select command
            let aaXPUB = "A75FCC75-8FB6-4460-B3F6-7070B4437930"; //Public Key
            let aFullBody = "Select " + aFieldSelected + " From " + aFullTableName;
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "@": aFullBody
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            let aURL = aDMZServer + "/DMQ/XOL/" + aaXPUB + "/" + aLocalSQLToken;

            await fetch(aURL, requestOptions)
                .then(response => response.json())
                //
                .then(aData => {
                    localStorage.setItem(aOBJsName, JSON.stringify(aData));
                })
                .catch((e) => {
                    console.log(e)
                })

        }

       
                function aaGetAPIData(aaPFDMI, aaXTGO, aaTBXX, aSearch){
                        localStorage.setItem("aaPFDMI", aaPFDMI);
                        localStorage.setItem("aaXXuX", aUname);   
                        var aLocalSQLToken = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
                        var aLocalNonQueryToken	= "9DE8BDB8-8EE0-48D0-A506-9AD24F151F9A";
                        var aDMZServer = "https://cbsdev2.locktonwattana.com/DMQ/CBS/";
                        var aSQLServerName ="[lockthbnk-db09]"
                        var aSQLDatabaseName = ".SIBISDB.dbo."
                        var aPrefix4Table = aSQLDatabaseName + aSQLDatabaseName ;
        
                        var aaXTGO = "A75FCC75-8FB6-4460-B3F6-7070B4437930"; //Guest
                        var aaTBXX = "01f518c9-c818-4e9f-85cb-6245ee1a2637";                                          
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json"); 
                        var raw = JSON.stringify({
                            "@": aSearch 
                        });
                        
                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };
                        
                        let aURL = aaPFDMI + "/DMQ/XOL/" + aaXTGO +"/" + aaTBXX + "/all"; // + aUname;
                        
                        fetch( aURL , requestOptions)
                        .then(response => response.json())
                        //
                        .then(aData => {                
                            //var aal = btoa(aData[0].Gright);
                            var aReturnVal = aData                   
                            })
                            
                        .catch(error => {
                            console.error('Error:', error);
                            DevExpress.ui.dialog.alert({
                            showTitle: false,
                            messageHtml: "<center><b style='color:Tomato;'>Please Try Again!!</b></center>"});
                        }); 
                        return aReturnVal
        
                 }
                 
                function aaGetjson4Api(aaPFDMI, aaXTGO, aaTBXX, aSearch){
                    var aReturnVal1 = [];
                    let aURL = aaPFDMI + "/DMQ/XOL/" + aaXTGO + "/" + aaTBXX + "/" + aSearch;
                    var settings = {
                    "url": aURL,
                    "method": "POST",
                    "timeout": 0,
                    };
                    $.ajax(settings).done(function (response) {
                        var aal = btoa(response[0].Gright);
                        localStorage.setItem("aaXrXgU", aal); 
                        localStorage.setItem("aaXrXgT", response[0].Gright);
                        eraseCookie("aaCrCg")
                        setCookie("aaCrCg", aal, 1);
                        aReturnVal1 = response;
                    });
                    return aReturnVal1;
                } 
*/



var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
var aaKeyField = localStorage["aaXKFX"];
var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];

var afqrFull = "pageID='" + aaPXIXD + "' "
var afURL = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/all' //+ aaPXXI
var afsettings = {
    "url": afURL,
    "method": "POST",
    "timeout": 0,
    "headers": { "Content-Type": "application/json" },
    "data": JSON.stringify({ "@": afqrFull }), //"?pageID='Resigned'?"
};
var jqxhr = $.post(afsettings, function (e) { })
    .done(function (e) {
        console.log("set aaTBKey");
        aObjMPage = e;
        var aaKeyField = aObjMPage[0].PrimaryKey;
        var aaTBKey = aObjMPage[0].TBKey;
        console.log(aaTBKey)        

//$(function () { TOP PRG
$(() => {
    // Load Data for [Expenses] DropDown Selection 
    //var aaPFDMI = localStorage["aPXIXD"];   //"https://cbsdev2.locktonwattana.com" 
    var aaDMZSn = "https://cbsdev2.locktonwattana.com";
    var aaPFDMI = isLocalHost();
    var aaXToX = localStorage["aaXXoX"];
    let aNowDte = new Date()
/*            
    // Load - ACCOUNTCHART
    //aGetDataModel(aaPFDMI, atob(aaXToX), "95ee65ae-df03-46b0-85e0-980c511f4357", "aaOBJAccExp") //ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE
    //var aaExpExp = JSON.parse(localStorage.getItem("aaOBJAccExp")); //JSON.parse(localStorage.getItem("names"))

    //aGetDataAPI(aaDMZSn, "[lockthbnk-ap14].SIBISDB.dbo.Currency", "Code,Name,(select TOP 1 DefaultRate From [lockthbnk-ap14].SIBISDB.dbo.ExchangeRate Where FromCurrency = Currency.code and ToCurrency = 'THB' ORDER by PeriodYear Desc, PeriodMonth Desc) as xRate", "aaOBJCurr")
    //var aaCurrency = JSON.parse(localStorage.getItem("aaOBJCurr"));
    //select  Code,Name, (select TOP 1 DefaultRate From [lockthbnk-ap14].SIBISDB.dbo.ExchangeRate Where FromCurrency = Currency.code and ToCurrency = 'THB' ORDER by PeriodYear Desc, PeriodMonth Desc) as xRate from Currency
*/
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
    var aFilterT = aYearStrS + '/05/01'   //2022/05/01
    var aFilterT2 = aYearStrL + '/04/30'  //2023/04/01

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
    var asFullName = localStorage["asFTNAME"];
    var asStaffID = localStorage["asSTFID"];
    var asDepartment = localStorage["asDEPT"];            
    //var aRunChar = "ER-" + String( aNowDatev.getFullYear()).substring(2, 4) + String( 100 + aNowDatev.getMonth()).substring(1,3) + String( 100 + aNowDatev.getDate()).substring(1,3) + String( 100 + aNowDatev.getHours()).substring(1,3) + String( 100 + aNowDatev.getMilliseconds()).substring(1,3);
    //var axRunRun = aGetDateRef();
    //"PayToCode = '" + asStaffID + "'" // scopes based permission (View Only Login Name)  ExpensesCode LIKE aaOnInitAccCode
    // "ERStatus = 'HOD Approved wait for FA'  OR ERStatus = 'HR Approved wait for FA'"
    
    var aqrFull = "LEN(HeadRefNo) > 10" 
    var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
    var aSettings = {"url": aurl,"method": "POST","timeout": 0,"headers": {"Content-Type": "application/json"},"data": JSON.stringify({"@": aqrFull}), };

    /*
    var requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "@": aqrFull }),
        redirect: "follow"
    };             
    */
    $("#gridContainer").dxDataGrid({

        dataSource: new DevExpress.data.CustomStore({
            key: "PBatchNo",
            loadMode: "omit",
            /*
            load: function () {
                return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all', { "@": aqrFull }) // Change aaTBKey to TokenKey for this table
                    .fail(function () { throw "Data loading error" });
            },*/
            load: function () { return $.post(aSettings).done(); },     //function (resp) { console.log(resp); }                 
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
            visible: true
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
        filterValue: [['PBatchDate', '>=', aFilterT], "and", ['PBatchDate', '<=', aFilterT2]],  //     [Req.Date] Is any of('2022')                                   
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
        rowAlternationEnabled: false, //true,

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
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PPM_ERDATA' + '.xlsx');
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
                if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "ID" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department" || e.dataField === "ERStatus" || e.dataField === "ExpGroupDescEng" || e.dataField === "Amount" || e.dataField === "RefundedAmount")) {  //ERStatus 
                    e.editorOptions.disabled = true;
                }
            }
        },
        //
        //
        // Editing
        editing: {
            mode: "cell", // popup cell
            useIcons: true,
            allowUpdating: false,
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
        //HeadRefNo,DC,ExpensesCode,TAccDesc,EAccDesc,Division,DRAMT,CRAMT,PayToCode,PayToName,PBatchNo,PBatchDate,PPMREFNO,ExpGroupCode

        columns: [
            {
                type: "buttons",
                width: 80,
                buttons: ["edit", "delete"],
                visible: false,
            },

            {
                dataField: "HeadRefNo",
                caption: "REF NO",
                //sortOrder: "desc",
                groupIndex: 1,
                width: 150,
            },

            {
                dataField: "DC",
                caption: " ",
                sortOrder: "desc",
                editorOptions: { width: 50, readOnly: true },
                width: 50,
                visible: true,
            },
            {
                dataField: "ExpensesCode",
                caption: "Account Code",
                editorType: "dxTextBox",
                editorOptions: { width: 100 },
                width: 100,
                visible: true,
            },
            {
                dataField: "TAccDesc",
                caption: "Account Name [THA]",
                editorType: "dxTextBox",
                editorOptions: { width: 200 },
                width: 200,
                visible: true,
            },
            {
                dataField: "EAccDesc",
                caption: "Account Name [ENG]",
                editorType: "dxTextBox",
                editorOptions: { width: 200 },
                width: 200,
                visible: true,
            },
            {
                dataField: "Division",
                caption: "Division",
                editorOptions: { width: 80, readOnly: true },
                width: 80,
                visible: true,
            },
            {
                dataField: "DRAMT",  //DRAMT,CRAMT
                caption: "Debit",
                dataType: "number",
                format: { type: "fixedPoint", precision: 2 },
                editorType: "dxNumberBox",
                editorOptions: { format: "#,##0.00", width: 120, readOnly: true },
                width: 120,
                visible: true,
            },
            {
                dataField: "CRAMT",  //DRAMT,CRAMT
                caption: "Credit",
                dataType: "number",
                format: { type: "fixedPoint", precision: 2 },
                editorType: "dxNumberBox",
                editorOptions: { format: "#,##0.00", width: 120, readOnly: true },
                width: 120,
                visible: true,
            },
            {
                dataField: "PayToCode",
                caption: "AP Code",
                editorOptions: { width: 100, readOnly: true },
                width: 100,
                visible: true,
            },
            {
                dataField: "PayToName",
                caption: "AP Name",
                editorOptions: { width: 150, readOnly: true },
                width: 150,
                visible: true,
            },
            {
                dataField: "PBatchNo",
                sortOrder: "desc",
                groupIndex: 0,
                caption: "Batch No",
                editorOptions: { width: 120, readOnly: true },
                width: 120
            },
            {
                dataField: "PBatchDate",
                caption: "Batch Date",
                dataType: "date",
                format: "dd/MM/yyyy",
                editorOptions: { width: 100, readOnly: true },
                width: 100,
                visible: true,
            },
            {
                dataField: "PSPvDate",
                caption: "EST.Payment Date",
                dataType: "date",
                format: "dd/MM/yyyy",
                editorOptions: { width: 100, readOnly: true },
                width: 100,
                visible: true,
            },
            {
                dataField: "PPMREFNO",
                caption: "PPM REFNO",
                editorType: "dxTextBox",
                editorOptions: { width: 120, readOnly: true },
                width: 120,
                visible: false,
            },
            {
                dataField: "ExpGroupCode",
                caption: "Expenses Type",
                editorType: "dxTextBox",
                editorOptions: { width: 100, readOnly: true },
                width: 100,
                visible: false,
            },


        ],
        // summary
        summary: {
            recalculateWhileEditing: true,
            skipEmptyValues: false,
            totalItems: [
                /*{
                    column: "ExpensesCode",
                    summaryType: "count",
                    //          summaryType: "max",
                    //          valueFormat: "currency",
                    showInGroupFooter: true,
                    alignByColumn: true,           
                    displayFormat: "{0} Items",
                },
                /*{
                    column: "DRAMT",
                    summaryType: "sum",
                    //summaryType: "max",
                    valueFormat: "#,##0.00",
                    showInGroupFooter: true,
                    alignByColumn: true,            
                    displayFormat: "{0}",
                },
                {
                    column: "CRAMT",
                    summaryType: "sum",
                    valueFormat: "#,##0.00",
                    showInGroupFooter: true,
                    alignByColumn: true,           
                    displayFormat: "{0}",
                },*/
            ],
            groupItems: [
                {
                    column: "ExpensesCode",
                    summaryType: "count",
                    showInGroupFooter: true,
                    alignByColumn: true,
                    displayFormat: "Total",
                },
                {
                    column: "DRAMT",
                    summaryType: "sum",
                    valueFormat: "#,##0.00",
                    showInGroupFooter: true,
                    alignByColumn: true,
                    displayFormat: "{0}",
                },
                {
                    column: "CRAMT",
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
                /*{
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
                    location: "before",
                    template: function () { return $("<div style='padding: 5px 95px;'/>") }
                },*/
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
    /*
    function sendRequestNew(Action, Data, TokenKey, domain, AccessKey) {
        let Url = domain + '/DMP/XOL/' + AccessKey + '/' + Action + '/' + TokenKey + '/true/true';
        console.log('Goal...Repuest Web API : ' + Data);
        var settings = { "url": Url, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": Data, };
        $.ajax(settings).done(function (response) { console.log(response); });
    }
    */
    function aDataGridRF() {
        dataGrid.refresh();
    }

    function aSearchjson(aObjArr, asID) {
        return aObjArr.filter( //aaEmployee ExpSubGroup, ACCCode
            function (data) {
                return data.EDESC == asID
            }
        );
    }

    function aSearchBothjson(aObjArr, asID) {
        return aObjArr.filter( //aaEmployee ExpSubGroup, ACCCode
            function (data) {
                return data.ExpSubGroup == asID
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


    function dropDownBoxEditorTemplate(cellElement, cellInfo) { //dropDownBoxCURR
        //   console.log("cellInfo")
        //   console.log(cellInfo.value)
        return $("<div>").dxDropDownBox({
            dropDownOptions: { width: 600 },
            dataSource: aaExpExp,
            value: cellInfo.value,
            valueExpr: "EDESC", //"ACCCODE",
            displayExpr: "EDESC", //"ACCCODE",
            contentTemplate: function (e) {
                return $("<div>").dxDataGrid({
                    dataSource: aaExpExp,
                    //remoteOperations: true,
                    columns: [{ dataField: "EDESC", caption: "Description", width: 400 }, { dataField: "ACCCODE", caption: "Exp. Code", width: 100 }], //ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE
                    hoverStateEnabled: true,
                    paging: { enabled: true, pageSize: 15 },
                    filterRow: { visible: true },
                    showBorders: true,
                    scrolling: { mode: "virtual" },
                    selection: { mode: "single" },
                    height: 250,
                    selectedRowKeys: [cellInfo.value],
                    //focusedRowEnabled: true,
                    focusedRowKey: cellInfo.value,
                    onSelectionChanged: function (sArgs) {
                        //console.log(aArgs.selectedRowKeys[0])
                        e.component.option("value", sArgs.selectedRowKeys[0].ACCCODE);
                        cellInfo.setValue(sArgs.selectedRowKeys[0].ACCCODE);
                        //console.log("v")
                        //console.log(cellInfo.value)
                        if (sArgs.selectedRowKeys.length > 0) {
                            e.component.close();
                        }

                    }
                });
            },
        });
    }

    function dropDownBoxCURR(cellElement, cellInfo) { //dropDownBoxCURR
        //   console.log("cellInfo")
        //   console.log(cellInfo.value)
        return $("<div>").dxDropDownBox({
            dropDownOptions: { width: 500 },
            dataSource: aaCurrency,
            value: cellInfo.value,
            valueExpr: "Code",
            displayExpr: "Code",
            contentTemplate: function (e) {
                return $("<div>").dxDataGrid({
                    dataSource: aaCurrency,
                    //remoteOperations: true,
                    columns: [{ dataField: "Name", caption: "Currency", width: 200 }, { dataField: "Code", caption: "Code", width: 100 }, { dataField: "xRate", caption: "X-Rate", width: 100, format: "#,##0.000000" }], //ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE
                    hoverStateEnabled: true,
                    paging: { enabled: true, pageSize: 15 },
                    filterRow: { visible: true },
                    showBorders: true,
                    scrolling: { mode: "virtual" },
                    selection: { mode: "single" },
                    height: 250,
                    selectedRowKeys: [cellInfo.value],
                    //focusedRowEnabled: true,
                    focusedRowKey: cellInfo.value,
                    onSelectionChanged: function (sArgs) {
                        //console.log(aArgs.selectedRowKeys[0])
                        e.component.option("value", sArgs.selectedRowKeys[0].Code);
                        cellInfo.setValue(sArgs.selectedRowKeys[0].Code);
                        //console.log("v")
                        //console.log(cellInfo.value)
                        if (sArgs.selectedRowKeys.length > 0) {
                            e.component.close();
                        }

                    }
                });
            },
        });
    }

    function aPopUpForm(iData, aWithOTP) {
        if (aWithOTP === undefined) {
            var aWOTP = 0;
        } else {
            var aWOTP = 1;
        }
        //alert(iData.HeadRefNo )
        var apwds = "";
        var ausrs = "";
        var aOTP = "";
        var aaPFDMI = isLocalHost();
        //var aOTPm = generateOTP();
        var aii = 0;
        var astr = localStorage["aDXTheme"]
        if (astr.includes("dark")) {
            var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmwhite.png' width='88'></center></div>"
        } else {
            var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"
        }
        // define the $ as jQuery for multiple uses
        jQuery(function ($) {
            // ...
            var gbxRateV = 1;
            const popup = $("#popupContainer").dxPopup({
                title: "Expenses Reimbursement",
                width: '1300px',
                position: { offset: "0 -140" }, //{offset: "0 -180"},
                //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                visible: true,
                fullScreen: true,
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
                        $("<p><div id='form'></div></p>"),
                        $("<p><span id='asave'></span></p>"),
                        // $("<p><div id='visibleform'></div></p>"),
                        //$("<p><center><div id='username'></div></center></p>"),
                        // $("<p><center><div id='password'></div></center></p>"),
                        // $("<p><center><div id='OTP'></div></center></p>"),
                        // $("<p <div id='popover1'>Please get OTP from your register e-Mail, put here and then press [LOGIN]</div></p>"),
                        // $("<p><span id='print'></span></p>"), 
                        // $("<span id='popupexit'></span>")                              
                    );
                },
                toolbarItems: [
                    {
                        toolbar: "top",
                        locateInMenu: 'always',
                        html: "<div padding-top: -7px;><img src='./images/locktonlogo70mmblack.png' width='85'></div>"
                    },
                    {
                        toolbar: "top",
                        locateInMenu: 'always',
                        widget: "dxButton",
                        //toolbar: "bottom",
                        location: "right",
                        options: {
                            icon: "print",
                            //text: "Print",
                            onClick: function () {
                                window.print()
                            }
                        }
                    }, {
                        toolbar: "top",
                        locateInMenu: 'always',
                        widget: "dxButton",
                        //toolbar: "bottom",
                        location: "after",
                        options: {
                            //text: "EXIT",
                            icon: "fas fa-times",
                            //type: "danger",                
                            onClick: function (e) {
                                popup.hide();
                            }
                        }
                    }]

                /* onContentReady: function() { 
                         $("#OTP").hide(); 
                 }*/
            }).dxPopup("instance");

            $("#visibleform").dxCheckBox({
                text: "Visible Form",
                value: true,
                onValueChanged: function (data) {
                    //visible:true,
                    form.option("visible", data.value);
                }
            });

            $("#popupexit").dxButton({
                icon: "fas fa-times",
                type: "danger",
                //text: "EXIT",
                //width: "120px",
                visible: true,
                onClick: function () {
                    popup.hide();
                }
            });

            $("#print").dxButton({
                icon: "print",
                //text: "Print",
                onClick: function () {
                    window.print();
                }
            });

            $("#asave").dxButton({
                icon: "save",
                text: "SAVE",
                type: "success",
                onClick: function (e) {
                    //window.print();
                    //let aUpdateText = "Update"
                    //var ObjKeyData = {"REFNO": $.trim(key)};   //[aaKeyField] key.trim
                    //var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                    //sendRequestNew(aUpdateText,ObjRowData,aaTBKey,aaPFDMI,atob(aaXToX));            
                    //alert (iData.REFNO)
                    //alert (iData.LocalAmount)
                    //alert (jQuery.type(iData.LocalAmount))
                    let ObjRowD = JSON.stringify(iData)
                    sendRequestNew("Update", ObjRowD, aaTBKey, aaPFDMI, atob(aaXToX));
                    //e.component.refresh(true);
                    //e.component.refresh(true);
                    //e.component.refresh(true);
                    //e.event.preventDefault();
                    popup.hide();

                }
            });


            const aform = $("#form").dxForm({
                formData: iData,
                showColonAfterLabel: false,
                labelLocation: "top",
                colCount: 1,
                items: [{
                    itemType: "group",
                    //caption: "Refference",
                    colCount: 4,
                    items: [{
                        dataField: "HeadRefNo",
                        label: { text: "REF NO" },
                        disabled: true,
                        editorOptions: { width: 150 },
                    },
                    {
                        dataField: "ReqDate",
                        label: { text: "Date" },
                        disabled: true,
                        editorType: "dxDateBox",
                        editorOptions: { displayFormat: "dd/MM/yyyy", width: 150 },	  //showClearButton: true,                  
                    },
                    {
                        dataField: "PayToName",
                        label: { text: "Pay To" },
                        disabled: true,
                        editorOptions: { width: 250 },
                    },
                    //{
                    //    itemType: "empty"
                    //},                           
                    {
                        dataField: "ExpensesDescription",
                        label: { text: "Expenses" },
                        disabled: true,
                        editorOptions: { width: 250 },
                    },


                    ]

                },
                {
                    itemType: "group",
                    //caption: "Amount",
                    colCount: 4,
                    items: [{
                        dataField: "Currency",
                        //label: {text: "Currency"},
                        value: "THB",
                        width: 80,
                        validationRules: [{ type: "required" }],
                        /*lookup: {
                                    dataSource: aaCurrency, //Code,Name
                                    valueExpr: "Code",
                                    displayExpr: "Code",
                                },                            
                        editCellTemplate: dropDownBoxCURR,*/

                        editorType: "dxDropDownBox",
                        editorOptions: {
                            dataSource: aaCurrency, //Code,Name
                            valueExpr: "Code",
                            displayExpr: "Code",
                            width: 380,
                            contentTemplate: function (e) {
                                return $("<div>").dxDataGrid({
                                    dataSource: aaCurrency,
                                    //remoteOperations: true,
                                    columns: [{ dataField: "Code", caption: "Code", width: 80 }, { dataField: "Name", caption: "Currency", width: 150 }, { dataField: "xRate", caption: "X-Rate", width: 80, format: "#,##0.000000" }], //ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE
                                    hoverStateEnabled: true,
                                    paging: { enabled: true, pageSize: 15 },
                                    searchPanel: { visible: true },
                                    headerFilter: { visible: true },
                                    filterRow: { visible: true },
                                    showBorders: true,
                                    scrolling: { mode: "virtual" },
                                    selection: { mode: "single" },
                                    height: 250,
                                    //selectedRowKeys: [cellInfo.value],                                      
                                    //focusedRowKey: cellInfo.value,
                                    onSelectionChanged: function (sArgs) {
                                        //alert(gbxRateV)
                                        console.log(sArgs.selectedRowKeys[0].xRate)
                                        gbxRateV = sArgs.selectedRowKeys[0].xRate
                                        //alert(gbxRateV)
                                        e.component.option("value", sArgs.selectedRowKeys[0].Code);
                                        //cellInfo.setValue(sArgs.selectedRowKeys[0].Code);
                                        //console.log("v")
                                        //console.log(cellInfo.value)
                                        if (sArgs.selectedRowKeys.length > 0) {
                                            e.component.close();
                                        }

                                    }
                                });
                            },
                        },

                        onFieldDataChanged: function (e) {
                            var updatedField = e.dataField;
                            var newValue = e.value;
                            alert(updatedField)
                            alert(newValue)
                            // Event handling commands go here
                        },
                        setCellValue: function (newData, value, currentRowData) {

                            if (arDataU === 1) {
                                newData.Currency = value;
                                let aResult = aSearchXjson(aaCurrency, value);
                                newData.Xrate = aResult[0].xRate;
                                //newData.LocalAmount = currentRowData.Amount * (1/aResult[0].xRate);
                            }
                        },

                    },
                    //{
                    //itemType: "empty"
                    //},                             
                    {
                        dataField: "Xrate",
                        label: { text: "X-Rate" },
                        dataType: "number",
                        //format:{ type:"fixedPoint", precision: 6 },
                        editorType: "dxNumberBox",
                        editorOptions: {
                            value: gbxRateV,
                            format: "#,##0.000000",
                            width: 150,
                        },
                        onValueChanged: function (data) {
                            console.log(data.value);
                        }
                        //value: gbxRateV,
                        //visible: false,
                    },
                    //{
                    //    itemType: "empty"                               
                    //},
                    {
                        itemType: "tabbed",
                        width: 350,
                        tabPanelOptions: {
                            deferRendering: false
                        },
                        tabs: [{
                            title: "HOD Approval",
                            items: ["Confirmed"]
                        },
                        {
                            title: "HR Approval",
                            items: [
                                {
                                    dataField: "HRApproved",
                                    label: { text: "HR Approved" },
                                    allowEditing: false,
                                },
                            ]
                        },
                        {
                            title: "FA Approval",
                            items: [
                                {
                                    dataField: "Approved",
                                    label: { text: "FA Approved" },
                                },
                                {
                                    dataField: "PBatchNo",
                                    label: { text: "Pay Batch NO" },
                                    editorOptions: { width: 150 },
                                },
                                {
                                    dataField: "PBatchDate",
                                    label: { text: "Data" },
                                    disabled: true,
                                    editorType: "dxDateBox",
                                    editorOptions: { displayFormat: "dd/MM/yyyy", width: 150 },
                                }
                            ]
                        }
                        ]
                    }

                    ]
                },
                {
                    itemType: "group",
                    caption: "Details",
                    colCount: 7,
                    items: [
                        {
                            dataField: "ID",
                            sortOrder: "asc",
                            label: { text: "NO" },
                            editorOptions: { format: "###0", rtlEnabled: true, width: 40 },
                        },
                        {
                            dataField: "ERORefNo1",
                            label: { text: "Fleet Card NO" },
                            //disabled: true,
                            editorOptions: { width: 150 },
                        },
                        {
                            dataField: "ERORefNo2",
                            label: { text: "Plate No" },
                            editorOptions: { width: 150 },
                        },
                        {
                            dataField: "ERODate01",
                            label: { text: "Date" },
                            editorType: "dxDateBox",
                            editorOptions: { displayFormat: "dd/MM/yyyy", width: 150 },
                        },
                        {
                            dataField: "LocalAmount",
                            label: { text: "Amount" },
                            editorType: "dxNumberBox",
                            //format:{ type:"fixedPoint", precision: 2 },
                            //format: "#,##0.00",
                            editorOptions: { format: "#,##0.00", rtlEnabled: true, width: 150 },
                        },
                        {
                            dataField: "EROCheck01",
                            label: { text: "Pay Slip" },
                        },
                        {
                            dataField: "EROCheck02",
                            label: { text: "Tax Invoice" },
                        },
                    ]

                },
                {
                    itemType: "group",
                    //caption: "Details",
                    colCount: 2,
                    items: [
                        {
                            dataField: "ERODesc01",
                            label: { text: "Note" },
                            editorType: "dxTextArea",
                            editorOptions: { width: 800, height: 100 },

                        },
                        // {
                        //      itemType: "button",
                        //      buttonOptions: {
                        //          icon: "save",
                        //          text: "SAVE",
                        //          useSubmitBehavior: true
                        //      }
                        //  }
                    ]
                }

                ]

            }).dxForm("instance");

            $("#aformSave").on("submit", function (e) {
                console.log("Done")
                alert(e)
                setTimeout(function () {
                    alert("Submitted");
                    alert(e)
                }, 1000);

                e.preventDefault();
            });

            /*$("#username").dxTextBox({
                    mode: "text",
                    placeholder: "Enter username",
                    showClearButton: true,
                    onValueChanged: function (e) {
                        const previousValue = e.previousValue;
                        ausrs = e.value;
                        // Event handling commands go here
                        // DevExpress.ui.notify(newValue);
                    },
                    width: "250px",
                    value: ""
            }).dxTextBox("instance");
                    
            $("#password").dxTextBox({
                    mode: "password",
                    placeholder: "Enter password",
                    showClearButton: true,
                    onValueChanged: function (e) {
                        const previousValue = e.previousValue;
                        apwds = e.value;
                        // Event handling commands go here
                        // DevExpress.ui.notify(newValue);
                    },
                    width: "250px",
                    value: ""
            }).dxTextBox("instance");
        
            $("#OTP").dxTextBox({
                    mode: "text",
                    placeholder: "put OTP and press LOGIN",
                    showClearButton: true,
                    onValueChanged: function (e) {
                        const previousValue = e.previousValue;
                        aOTP = e.value;
                        // Event handling commands go here
                        // DevExpress.ui.notify(newValue);
                    },
                    width: "250px",
                    value: ""
            }).dxTextBox("instance");
        
            $("#popover1").dxPopover({
                target: "#OTP",
                showEvent: "mouseenter",
                hideEvent: "mouseleave",
                position: "top",
                width: 300
            });*/


            $("#icon-dones").dxButton({
                icon: "fas fa-key",
                type: "success",
                text: "LOGIN",
                width: "120px",
                visible: true,
                onClick: function (e) {
                    //console.clear();	
                    //var aUname = document.getElementById("uname").value;
                    //var aPswd = document.getElementById("pswd").value; 			
                    if (jQuery.type(ausrs) === "undefined") {
                        var aUname = ""
                    } else {
                        var aUname = ausrs
                    };
                    if (jQuery.type(apwds) === "undefined") {
                        var aPswd = ""
                    } else {
                        var aPswd = apwds;
                    };
                    if (aUname === "" || aPswd === "") {
                        DevExpress.ui.dialog.alert({
                            showTitle: false,
                            messageHtml: "<center style='color:Red;'>Username and Password can not be blank !!</center>"
                        });
                    }
                    else {
                        localStorage.setItem("aaPFDMI", aaPFDMI);
                        localStorage.setItem("aaXXuX", aUname);
                        var aaXTGO = "A75FCC75-8FB6-4460-B3F6-7070B4437930"; //Guest
                        var aaTBXX = "01f518c9-c818-4e9f-85cb-6245ee1a2637";
                        //var aaLng = aaLoginGet(aaPFDMI,aUname, aPswd); //aaLoginaa(aUname,aPswd);
                        //alert(aUname);
                        var aLtext = "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
                        //alert(aLtext);
                        //"@": "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        var raw = JSON.stringify({
                            "@": "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
                        });

                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };

                        let aURL = aaPFDMI + "/DMQ/XOL/" + aaXTGO + "/" + aaTBXX + "/all"; // + aUname;

                        fetch(aURL, requestOptions)
                            .then(response => response.json())
                            //  .then(data => {console.log(data)});
                            .then(aData => {
                                //console.log('Success:', aData);
                                //console.log(aData[0].IDUsr);
                                //console.log(aData[0].Gright);
                                //console.log(aData[0].Pword);
                                //console.log(result);
                                //localStorage.setItem("aaXXoX", aData[0].TKey); 
                                //localStorage.setItem("aaXrXg", response.KeyRights);                        
                                if (aPswd === aData[0].Pword) {
                                    var aal = btoa(aData[0].Gright);
                                    var aat = btoa(aData[0].Tkey);
                                    var aLGName = aData[0].LGName;
                                    var aemail = aData[0].email;
                                    var aotpx = aData[0].otp;
                                    var apict = aData[0].PictureLoc;
                                    //console.log(aLGName)
                                    //console.log(aemail)
                                    //console.log(aotpx)
                                    //alert(aal);
                                    //alert(aData[0].Pword);
                                    //alert(aPswd === aData[0].Pword);
                                    localStorage.setItem("aaXrXg", aal);
                                    localStorage.setItem("aaXXoX", aat);
                                    localStorage.setItem("aaXpXt", apict);

                                    if (aOTP === aOTPm || aWOTP === 0) {
                                        //aGoTo("index02.html");
                                        aGoTo("index03.html");
                                    } else {
                                        aii++;
                                        $("#username").hide();
                                        $("#password").hide();
                                        $("#OTP").show(20);
                                        if (aii <= 1) {
                                            var aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>OTP =&nbsp;' + aOTPm + '</center></strong></span></h2></td></tr></tbody></table>'
                                            // 
                                            //                                       aRecipient, aRCPeMail               ,aSendereMail        , aCCeMail, aBcceMail,aSubject,aMessage "Dear Wikran <br/><br/>&nbsp;&nbsp; OTP = <br/><br/><br/>Regards,<br />XOL Admin."
                                            var lSentM = aSendMailDMZ("Khun " + aLGName, aemail, "XOL-admin@lockton.com", "wikran@hotmail.com", "", "OTP = " + aOTPm, "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aLGName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");

                                            DevExpress.ui.dialog.alert({
                                                showTitle: false,
                                                messageHtml: "<center style='color:ForestGreen;'> Sendind OTP to your e-Mail, please check </center>"
                                            });
                                        } else {
                                            DevExpress.ui.dialog.alert({
                                                showTitle: false,
                                                messageHtml: "<center style='color:Red;'> Please check OTP from your e-Mail again !!" + aii + "</center>"
                                            });
                                        }
                                    }

                                } else {

                                    DevExpress.ui.dialog.alert({
                                        showTitle: false,
                                        messageHtml: "<center><b style='color:Tomato;'>Please Try Again!!</b></center>"
                                    });
                                }

                            })
                            .catch(error => {
                                console.error('Error:', error);
                                DevExpress.ui.dialog.alert({
                                    showTitle: false,
                                    messageHtml: "<center><b style='color:Tomato;'>Please Try Again!!</b></center>"
                                });
                            });

                    }
                }
            });

        });
    }
/*            
    // DataGrid > Editing > Custome Editor
    function dropDownBoxEMP(cellElement, cellInfo) {
        return $("<div>").dxDropDownBox({
            dropDownOptions: { width: 600 },
            dataSource: aaSubGroup, //aaEmployee,
            value: [cellInfo.value],
            valueExpr: "ExpSubGroup", //"EMPCode",
            displayExpr: "ExpSubGroup", //"EMPCode",
            contentTemplate: function (e) {
                return $("<div>").dxDataGrid({
                    dataSource: aaSubGroup,
                    //remoteOperations: true, // EMPCode,FullNameThai ACCCode
                    columns: [{ dataField: "ExpSubGroup", caption: "Account Name", width: 250 }, { dataField: "ACCCode", caption: "Account Code", width: 70 }], //"EMPCode,FullNameThai,FullNameEng,EffectiveDate,ResignDate,Dept,DivCode,EmailAddress" 
                    hoverStateEnabled: true,
                    searchPanel: { visible: true },
                    headerFilter: { visible: true },
                    paging: { enabled: true, pageSize: 15 },
                    filterRow: { visible: true },
                    showBorders: true,
                    scrolling: { mode: "virtual" },
                    selection: { mode: "single" },
                    height: 450,
                    selectedRowKeys: [cellInfo.value],
                    //selectedRowKeys: [value],
                    //focusedRowEnabled: true,
                    focusedRowKey: cellInfo.value,
                    onSelectionChanged: function (sArgs) {
                        //console.log(sArgs.selectedRowKeys[0].EMPCode)
                        e.component.option("value", sArgs.selectedRowKeys[0].ExpSubGroup); // Works but Error Need to correct next time !!!
                        cellInfo.setValue(sArgs.selectedRowKeys[0].ExpSubGroup);
                        if (sArgs.selectedRowKeys.length > 0) {
                            e.component.close();
                        }
                    }
                });
            },
        });
    }
*/

});
});  // ajax  
