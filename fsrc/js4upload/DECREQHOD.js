//HOD Approve Declaration Requisition

$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
const { PDFDocument } = PDFLib;
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
var aaHostName = window.location.href
var aaCheckON = aaHostName.includes("localhost")
//
const aaPurposeTable = [
    { "Purpose": "Conference", "TPurpose": "??????" },
    { "Purpose": "Training", "TPurpose": "????" },
    { "Purpose": "Traveling", "TPurpose": "??????????" },
    //{ "Purpose": "Others", "TPurpose": "?????" }
]
const aaYesNoList = [
    { "Code": "YES" },
    { "Code": "NO" },
]
var aaXToX = localStorage["aaXXoX"];

const aTranTextJson = (aText, aFMark, aLMark) => { //"NAME:" "EMAIL:"
    var axHODFtext = aText;
    var xaChkName;
    var aatestChk = axHODFtext.replaceAll("|", '"')
    var xxChk1 = aatestChk.search(aFMark);
    var xxChk2 = aatestChk.search(aLMark);

    xxChk1 = aatestChk.search(aFMark)
    xxChk2 = aatestChk.search(aLMark)

    //console.log(xxChk1, xxChk2)
    //console.log(aatestChk.substr(xxChk1+5, xxChk2-5))
    //aatestChk.substr(xxChk1+5, xxChk2-xxChk1-5)
    if (aLMark === "") {
        xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, 300)); //xxChk1+5, xxChk2-5);
    } else {
        xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, xxChk2 - xxChk1 - 5)); //xxChk1+5, xxChk2-5);
    }
    //console.log(xaChkName);
    const xxNameArr = JSON.parse(xaChkName);
    //console.log(xxNameArr)
    //console.log(xxNameArr[0])
    return xxNameArr;
}

var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
//var aaKeyField = localStorage["aaXKFX"];
//var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var aaPFDMZz = aWebSpaceAPI; //"https://webspace.locktonwattana.com"; //"https://cbsdev2.locktonwattana.com"; // API for DMZ only

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
        console.log("set aaTBKey");
        aObjMPage = e;
        var aaKeyField = aObjMPage[0].PrimaryKey;
        var aaTBKey = aObjMPage[0].TBKey;

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
                    const arSTATUS = aArrays.arSTATUS;
                    const arSTANOTE = aArrays.arSTANOTE;
                    // console.log(aArrays.ACONFIRM[0])
                    // console.log(aArrays.ACONFIRM[1])
                    var currentHoveredColumn = null; // Variable to track the currently hovered column
                    var nTime = 0; // Counter to track how many times we've hovered over the current column
                    var aaERTYPE = "700"
                    var aaOnInitExpGroupCode = "700"
                    var aaOnInitExpGroupDesc = "Declaration Requisition"
                    var aaOnInitAccCode = "5102300001"
                    var aaOnInitAccDesc = ""
                    var aaPFDMI = isLocalHost();
                    var aaXToX = localStorage["aaXXoX"];
                    let aDivS = "Where ApproverCode = 'AD' OR ApproverCode = 'HR' OR ApproverCode = 'FA' "  //let aDivS = "Where ApproverCode = 'HR' OR ApproverCode = 'FA' "
                    let aFieldSelected = "ApproveToDivision,ApproverName,ApproverEmail,ApproverCode"
                    let aFullBody = "Select " + aFieldSelected + " From " + "ExtraOnLine.dbo.Approver " + aDivS;

                    fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                        .then(response => response.json())
                        //
                        .then(hData => {
                            var aaFAApprover = hData;
                            var aaFAAppName = aaFAApprover[0].ApproverName
                            var aaFAAppEmail = aaFAApprover[0].ApproverEmail

                            var aaHRApprover = hData.find(item => item.ApproverCode === 'HR'); //= aaaHODApprover[1]
                            var aaHRAppName = aaHRApprover.ApproverName
                            var aaHRAppEmail = aaHRApprover.ApproverEmail
                            var aaFXApprover = hData.find(item => item.ApproverCode === 'FA'); //aaaHODApprover[0]
                            var aaFXAppName = aaFXApprover.ApproverName
                            var aaFXAppEmail = aaFXApprover.ApproverEmail
                            var aaADApprover = hData.find(item => item.ApproverCode === 'AD'); //aaaHODApprover[0]
                            var aaADAppName = aaADApprover.ApproverName
                            var aaADAppEmail = aaADApprover.ApproverEmail

                            console.log("--------------")
                            //console.log(hData)
                            console.log(aaFAAppName)
                            console.log(aaFAAppEmail)
                            console.log("--------------")
                            console.log("aaHRApprover ", aaHRApprover)
                            // aaHRAppName, aaHRAppEmail, aaFXAppName, aaFXAppEmail, aaADAppName, aaADAppEmail
                            console.log("aaHRAppName ", aaHRAppName)
                            console.log("aaHRAppEmail ", aaHRAppEmail)
                            console.log("--------------")
                            console.log("aaFXApprover ", aaFXApprover)
                            console.log("aaFXAppName ", aaFXAppName)
                            console.log("aaFXAppEmail ", aaFXAppEmail)
                            // alert(aaFXApprover)
                            // alert(aaFXAppEmail)
                            // alert(aaFXAppName)
                            console.log("--------------")
                            console.log("aaADApprover ", aaADApprover)
                            console.log("aaADAppName ", aaADAppName)
                            console.log("aaADAppEmail ", aaADAppEmail)
                            console.log("--------------")
                            var aNowDte = new Date()
                            // Date Filter 
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
                            var aFilterT = aYearStrS + '/01/01'  //2022/05/01
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
                            let isHODApproving = false; // Global or outer scope
                            var asFullName = localStorage["asFTNAME"];
                            var asStaffID = $.trim(localStorage["asSTFID"]);
                            var asDepartment = localStorage["asDEPT"];
                            var asDivision = $.trim(localStorage["asDIV"]);
                            var asStaffEmail = localStorage["asEMAIL"];
                            var aaHODAppName = asFullName
                            var aaHODAppEmail = asStaffEmail // send by login email
                            //var aHODDivGrp = "(select ApproveToDivision from Approver Where ApproverCode = 'HOD' and ApproverEmpID = '" + asStaffID + "')"
                            //var aHODEORRefNo6 = " ERORefNo6 = '" + $.trim(asStaffEmail) +"'"
                            //let aHODApproveSS_Running = false; // Declare globally
                            var asERStatus = 'Confirmed wait for HOD'
                            //var aqrFull = "ERStatus = '" + asERStatus + "' and Division IN " + aHODDivGrp  // scopes based permission (View Only Login Name)  ExpensesCode LIKE aaOnInitAccCode Division "ExpGroupCode LIKE '%" + aaERTYPE + "%' and " +
                            //var aqrFull = "ERStatus = '" + asERStatus + "' and ERORefNo6 = '" +  $.trim(asStaffEmail) + "'"
                            var aqrFull = "ERStatus = '" + asERStatus + "' and rtrim(Vendor02Note) LIKE '%" + $.trim(asFullName) + "%'"
                            //console.log(aqrFull)
                            //var aqrFull = "Status != 'Resigned' " //"Status LIKE 'Active%'" //"Dept = '1196'" // "Password !LIKE '%\%"
                            var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'

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

                            $("#gridContainer").dxDataGrid({

                                dataSource: new DevExpress.data.CustomStore({
                                    key: "REFNO",
                                    loadMode: "omit",
                                    load: function () {
                                        return $.post(settings).done(); //function (response) { console.log(response); }
                                    },
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
                                    visible: false //false // can't select other group
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
                                filterValue: [['ReqDate', '>=', aFilterT], "and", ['ReqDate', '<=', aFilterT2], "and", ['ID', '=', '1']],  //     [Req.Date] Is any of('2022')                                   
                                //filterValue: [['ReqDate', '>=', aFilterT], "and", ['ReqDate', '<=', aFilterT2], "and", ['ID', '=', '1'], "and", ['ERStatus', 'contains', 'finish']],  //     [Req.Date] Is any of('2022') and show only first record of the group                                  
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
                                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'EXPREIM' + '.xlsx');
                                        });
                                    });
                                    e.cancel = true;
                                },
                                onInitNewRow: function (e) {
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
                                        e.editorOptions.disabled = true; //
                                    } else {
                                        if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ERODate01" || e.dataField === "Currency" || e.dataField === "Xrate" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "ID" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department" || e.dataField === "ExpensesCode" || e.dataField === "ExpGroupDescEng" || e.dataField === "LocalAmount" || e.dataField === "ERStatus" || e.dataField === "ERORefNo3")) {
                                            e.editorOptions.disabled = true;
                                        }
                                    }
                                },
                                //
                                //
                                // Editing
                                editing: {
                                    mode: "row",
                                    useIcons: true,
                                    allowUpdating: false,
                                    allowDeleting: false, //arDataD,
                                    allowAdding: false, //arDataC,

                                    popup: {
                                        title: "Declaration Requisition",
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
                                        type: "buttons",
                                        width: 80,
                                        buttons: [// Edit Record
                                            {
                                                hint: "Email to Requester",
                                                icon: "fas fa-envelope",
                                                visible: function (e) {
                                                    return (e.row.data.ID === 1) //return !e.row.isEditing; && e.row.data.Confirmed === false
                                                },
                                                onClick: function (e) {
                                                    aPopUpSENDMail2REQ(e.row.data);
                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                }
                                            },
                                            {
                                                hint: "Approve",
                                                icon: "fas fa-check-circle",
                                                visible: function (e) {
                                                    return (e.row.data.ID === 1 && e.row.data.HODApproved === false)
                                                },
                                                onClick: function (e) {
                                                    if (isHODApproving) return;
                                                    isHODApproving = true;

                                                    aHODApproveSS(e.row.data);

                                                    // Reset the flag after 2 seconds (or when async dialog resolves)
                                                    setTimeout(() => { isHODApproving = false }, 2000);
                                                }
                                            },
                                            {
                                                hint: "view",
                                                icon: "fas fa-search",
                                                visible: function (e) {
                                                    return (e.row.data.ID === 1 && e.row.data.Confirmed === true) //return !e.row.isEditing; //&& e.row.data.Confirmed === false
                                                },
                                                onClick: function (e) {
                                                    aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate, true);
                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        dataField: "HeadRefNo",
                                        caption: "REF NO",
                                        dataType: "string",
                                        sortOrder: "desc",
                                        groupIndex: 0,
                                        width: 180,
                                    },
                                    {
                                        dataField: "ID",
                                        sortOrder: "asc",
                                        caption: "NO",
                                        dataType: "string",
                                        editorOptions: { width: 40 },
                                        width: 40
                                    },
                                    {
                                        dataField: "ReqDate", //ReqDate
                                        caption: "Req. Date",
                                        dataType: "date",
                                        format: "dd/MM/yyyy",
                                        editorOptions: { width: 100 },
                                        width: 100,
                                        visible: false,
                                    },
                                    {
                                        dataField: "ERORefNo4",
                                        caption: "Bill No",
                                        dataType: "string",
                                        width: 180,
                                        visible: false,
                                    },
                                    {
                                        dataField: "ERODate01", //ReqDate
                                        caption: "Date",
                                        dataType: "date",
                                        format: "dd/MM/yyyy",
                                        editorOptions: { width: 100 },
                                        validationRules: [{ type: "required" }],
                                        width: 100,
                                    },
                                    {
                                        dataField: "Department", //ReqDate
                                        caption: "Dept.",
                                        dataType: "dxTextBox",
                                        editorOptions: { width: 100 },
                                        width: 80,
                                    },
                                    {
                                        dataField: "EROCode01",
                                        caption: "Type of Gift & Entertain",
                                        dataType: "string",
                                        editorType: "dxSelectBox",
                                        width: 150,
                                        editorOptions: {
                                            width: 150,
                                            dataSource: aObjects.aaTypeOfGift, //aaTypeOfGift
                                            displayExpr: function (item) { return item && item.code + " (" + item.thaname + ")"; },
                                            valueExpr: "code"
                                        },
                                        visible: true
                                    },
                                    {
                                        dataField: "ERODesc01",
                                        caption: "Details of gift or entertainment",
                                        //dataType: "string",
                                        editorType: "dxTextArea",
                                        cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                        width: 200,
                                        editorOptions: { width: 200, height: 80 }, //, height: 80 
                                        //validationRules: [{ type: "required" }],
                                        visible: true,
                                    },
                                    {
                                        dataField: "ERODesc02",
                                        caption: "Purpose",
                                        //dataType: "string",
                                        editorType: "dxTextArea",
                                        cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                        width: 200,
                                        //height: 80,
                                        editorOptions: { width: 200, height: 80 }, //, height: 80 
                                        //validationRules: [{ type: "required" }],
                                        visible: true,
                                    },
                                    {
                                        dataField: "ERORefNo1",
                                        caption: "Given/Receive", //
                                        dataType: "string",
                                        width: 100,
                                        editorOptions: {
                                            width: 100,
                                        }
                                    },
                                    {
                                        dataField: "EROAmount1",
                                        caption: "Approximate Value",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        editorType: "dxNumberBox",
                                        width: 150,
                                    },
                                    {
                                        dataField: "EROAmount2",
                                        caption: "Head Count",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 0 },
                                        editorType: "dxNumberBox",
                                        width: 80,
                                    },
                                    {
                                        dataField: "Amount",
                                        caption: "Average Value",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        editorType: "dxNumberBox",
                                        editorOptions: { format: "#,##0.00", width: 150 },
                                        width: 150,
                                        visible: true,
                                    },
                                    {
                                        dataField: "ERStatus",
                                        caption: "Status",
                                        dataType: "string",
                                        width: 250,
                                        visible: true,
                                    },
                                ],
                                // summary
                                summary: {
                                    recalculateWhileEditing: true,
                                    skipEmptyValues: false,
                                    totalItems: [
                                        {
                                            column: "REFNO",
                                            summaryType: "count",

                                            displayFormat: "{0} Items",
                                        },
                                        {
                                            column: "Amount",
                                            summaryType: "sum",
                                            //summaryType: "max",
                                            valueFormat: "#,##0.00", //"currency",
                                            //showInGroupFooter: false,
                                            //alignByColumn: true            
                                            displayFormat: "{0}",
                                        },
                                    ],
                                    groupItems: [
                                        {
                                            column: "ID",
                                            summaryType: "count",
                                            displayFormat: "{0} Items",
                                        },

                                        {
                                            column: "ERORefNo4",
                                            summaryType: "count",
                                            showInGroupFooter: true,
                                            displayFormat: "Total {0} Items",
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
                                            location: "after",
                                            widget: "dxButton",
                                            options: {
                                                icon: "fas fa-info",
                                                text: "HELP",
                                                type: "default",
                                                stylingMode: "contained", // "outlined" contained
                                                onClick: function () {
                                                    aPopupHelp("HELP", aVARs.HELP01) //"./images/All Slide-Training Expense Reimbursement System.pdf#view=FitH" //"./Help.html" "https://cbsdev2.locktonwattana.com/xol/index.html"
                                                }
                                            }
                                        },
                                        {
                                            location: "before",
                                            template: () => { return $("<div style='padding: 5px 5px;'/>") }
                                        },
                                        {
                                            location: "before",
                                            template: () => {
                                                return $("<div />")
                                                    .append(
                                                        $("<span style='font-size: 13px; font-weight: bold; color: white; background-color: Purple; border-radius: 3px; border: 0px; padding: 1px 30px; ' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px;
                                                            .text(aaOnInitExpGroupDesc.toUpperCase() + " APPROVAL"),
                                                        $("<br><center />"),
                                                        $("<i class= 'fas fa-user-circle''><span />")   //; style='color: DarkGreen;
                                                            .text(" " + $.trim(asFullName)),
                                                    );
                                            }
                                        },
                                        {
                                            location: "before",
                                            template: () => { return $("<div style='padding: 5px 8px; '/>") }
                                        },
                                        {
                                            location: "before",
                                            template: () => {
                                                return $("<div />")
                                                    .append(
                                                        $(aVARs.HeadAlertMessage),
                                                    );
                                            }
                                        },
                                        {
                                            location: "before",
                                            template: () => { return $("<div style='padding: 5px 8px; '/>") }
                                        },

                                        {
                                            location: "before",
                                            template: () => { return $("<div style='padding: 5px 8px; '/>") }
                                        },
                                        {
                                            location: "before",
                                            template: () => { return $("<div style='padding: 5px 85px;'/>") }
                                        },
                                        {
                                            location: "after",
                                            widget: "dxButton",
                                            options: {
                                                icon: 'collapse',
                                                text: 'Collapse All',
                                                //type: "danger",
                                                width: 140,
                                                onClick: (e) => {
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
                                                //text: "Export to PDF",
                                                hint: "Export to PDF File",
                                                onClick: () => {
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
                                                                fontSize: 10
                                                            }
                                                            //}
                                                        }
                                                    }).then(function () {
                                                        doc.save('REQDEC' + '.pdf');
                                                    });
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


                            }).dxDataGrid("instance");

                            // Send Mail To Requester
                            function aPopUpSENDMail2REQ(iData) { // popup Send Mail
                                var aaPFDMI = isLocalHost();
                                var aanewNoteValue = "";

                                $(() => {
                                    const popup = $("#popupContainerAdd").dxPopup({
                                        title: "Notification Mail",
                                        width: '1300px',
                                        height: '600px',
                                        position: { offset: "0 -160" }, //{offset: "0 -180"},
                                        visible: true,
                                        fullScreen: false,
                                        showCloseButton: false,
                                        showTitle: true,
                                        dragEnabled: true,
                                        closeOnOutsideClick: false,
                                        resizeEnabled: true,
                                        contentTemplate: function () {
                                            return $("<div />").append(
                                                $("<p><div id='SM-form'></div></p>"),
                                                $("<div id='aSendMail'></div>"),
                                                $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                $("<span id='SM-Exit'></span>"),
                                            );
                                        },
                                        toolbarItems: [
                                            {
                                                toolbar: "top",
                                                locateInMenu: 'always',
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
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        popup.hide();
                                                    }
                                                }
                                            }]

                                    }).dxPopup("instance");

                                    // Exit 
                                    $("#SM-Exit").dxButton({
                                        icon: "fas fa-times",
                                        type: "danger",
                                        text: "EXIT",
                                        visible: true,
                                        onClick: function () {
                                            popup.hide();
                                        }
                                    });

                                    $("#aSendMail").dxButton({
                                        icon: "fas fa-paper-plane",
                                        type: "success",
                                        text: "SEND",
                                        visible: true,
                                        onClick: function () {
                                            //send Email
                                            console.log(aaHODAppEmail)
                                            console.log(aaHODAppName)
                                            console.log(asFullName)
                                            console.log(asStaffEmail)
                                            console.log(iData.ERStatus)
                                            var aaMailTitle = iData.ERStatus; //iData.ExpGroupDescEng.toUpperCase() + " Travel Requisition"
                                            let aApproverName = aaHODAppName //+ " [HR]"         //aaHRAppName //"Wikran" + " [HR]"         // HR Approver Name
                                            let aApproverEmail = $.trim(aaHODAppEmail) // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                            let aRequesterName = iData.PayToName //e.data.PayToName //"Wikran Intaraprajaks"
                                            let aRequesterEmail = iData.ERODesc06 //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                            let aSubject = iData.ExpGroupDescEng.toUpperCase() + " - " + aaMailTitle //aaOnInitExpGroupDesc 
                                            let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>"; //<a href='https://www.w3schools.com'>Visit W3Schools</a>
                                            let aMessage01 = "<div>To " + $.trim(aRequesterName) + "<br><br>" + iData.Note + " <br> REFNO = [" + iData.HeadRefNo + "] <br> LINK --> (" + aAddress2Do + ")" + " <br><br><br><b>" + aaHODAppName + " [HOD]</b>" + "</div>"
                                            //let aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>Please Approve at &nbsp;'+ aAddress2Do +'</center></strong></span></h2></td></tr></tbody></table>'                          
                                            //aSendMailDMZ("Khun " + aApproverName , aApproverEmail ,"XOL-Requester",aRequesterEmail,"","Please approve a Medical Travel Requisition" , "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aApproverName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");
                                            var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #FF7F01;color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + iData.ExpGroupDescEng.toUpperCase() + "  <br>" + aaMailTitle + "</small></center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#FDE4E4;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                            //aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)
                                            aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)
                                            //console.log(ERODesc06)
                                            //console.log(aMessage)
                                            aMessageAlert("Already send Mail !!", "Red")
                                            popup.hide();
                                        }
                                    });

                                    $("#SM-form").dxForm({
                                        formData: iData, //iData, aXXData[0],
                                        showColonAfterLabel: false,
                                        labelLocation: "top",
                                        onFieldDataChanged: function (e) {
                                            let aaDataRowNo
                                            if (e.dataField === "ERStatus") {
                                                aaDataRowNo = $.inArray(e.value, arSTATUS) //e.component.getEditor("Note");
                                                aaDataRowNo = $.inArray(e.value, arSTATUS)
                                                aanewNoteValue = arSTANOTE[aaDataRowNo]
                                                e.component.updateData("Note", aanewNoteValue);
                                            }

                                        },
                                        colCount: 1,
                                        items: [{
                                            itemType: "group",
                                            colCount: 4,
                                            items: [{
                                                dataField: "HeadRefNo",
                                                label: { text: "REF NO" },
                                                editorType: "dxTextBox",
                                                editorOptions: { readOnly: true, width: 150 }, //value: aaiHeadRef,
                                            },
                                            {
                                                dataField: "ReqDate",
                                                label: { text: "Submitted Date" },
                                                editorType: "dxDateBox",
                                                editorOptions: { readOnly: true, displayFormat: "dd/MM/yyyy", width: 150 },
                                            },
                                            {
                                                dataField: "PayToName",
                                                label: { text: "Requester" },
                                                editorType: "dxTextBox",
                                                editorOptions: { readOnly: true, width: 180 },
                                            },

                                            {
                                                dataField: "ExpensesDescription",
                                                label: { text: "Description" },
                                                editorOptions: { readOnly: true, width: 180 }, //value: aaOnInitAccDesc,
                                            },


                                            ]

                                        },
                                        // {
                                        //     itemType: "group",
                                        //     colCount: 4,
                                        //     items: [{
                                        //         dataField: "Currency",
                                        //         label: { text: "Currency" },
                                        //         value: "THB",
                                        //         editorOptions: { readOnly: true, value: 'THB', width: 100 },
                                        //         visible: false,
                                        //     },
                                        //     {
                                        //         dataField: "Xrate",
                                        //         label: { text: "X-Rate" },
                                        //         editorType: "dxNumberBox",
                                        //         editorOptions: { readOnly: true, value: 1, format: "#,##0.000000", width: 100 },
                                        //         visible: false,
                                        //     },


                                        //     ]
                                        // },
                                        {
                                            itemType: "group",
                                            caption: " ",
                                            colCount: 4,
                                            items: [
                                                {
                                                    dataField: "ERODesc06",
                                                    label: { text: "Email TO" },
                                                    editorType: "dxTextBox", //editorType:"dxDropDownBox", "dxTextBox"
                                                    editorOptions: { width: 250 },

                                                },
                                                {
                                                    dataField: "ERStatus",
                                                    label: { text: "Subject" },
                                                    editorType: "dxSelectBox", //editorType:"dxDropDownBox", "dxTextBox"
                                                    validationRules: [{ type: 'required', message: 'Subject is required' }],
                                                    editorOptions: { items: arSTATUS, width: 250 },
                                                    lookup: {
                                                        dataSource: arSTATUS,
                                                        valueExpr: "CODE",
                                                        displayExpr: "CODE",
                                                    },

                                                },
                                                {
                                                    itemType: "empty"
                                                },
                                                {
                                                    itemType: "empty"
                                                },
                                                {
                                                    dataField: "Note",
                                                    label: { text: "Body/Comment" },
                                                    validationRules: [{ type: 'required', message: 'Body/Comment is required' }],
                                                    editorType: "dxTextArea",
                                                    editorOptions: { width: 800, height: 200 },
                                                },
                                                {
                                                    itemType: "empty"
                                                },

                                            ]
                                        },
                                        ]
                                    }).dxForm("instance");

                                });
                            }

                            function aPopUpAddForm(aRecNo, iData, idDate, iView) { // popup Add New
                                var aaPFDMI = isLocalHost();
                                var astr = localStorage["aDXTheme"]
                                var aViewF = (iView === undefined) ? false : iView;
                                var aViewG = (iView === undefined) ? true : !iView;
                                var anLimitAmt = 0;
                                var asEROCode01 = "";

                                let currentHoveredColumn = null; // Variable to track the currently hovered column
                                let nTime = 0;
                                // Counter to track how many times we've hovered over the current column
                                //confole.log(asDepartment)
                                //confole.log(aaHODAppName)
                                //aaHODAppName asDepartment
                                if (aRecNo === 1) {
                                    // var aaaTitle = " [ADD]"
                                    // let aaID = 1
                                    // let axRunRun = aGetDateRef(aaOnInitExpGroupDesc.substring(0, 1));
                                    // let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                    // var aaiHeadRef = axRunRun;
                                    //aaOnInitAccCode            aaOnInitAccDesc         Currency: "THB", Xrate: 1,                                                                                                                                                                     
                                    // var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), ERODate01: idDate, ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment, Division: asDivision, ERODesc06: asStaffEmail, ReqDate: idDate, Vendor02Note: aaHODAppName, ExpensesCode: "", ExpensesDescription: aaOnInitAccDesc, Currency: "THB", Xrate: 1, ExpGroupCode: aaOnInitExpGroupCode, ExpGroupDescEng: aaOnInitExpGroupDesc, ERStatus: "Register", ERORefNo1: "Receive", ERORefNo2: "", ERORefNo3: "", EROCheck01: 1, EROCheck02: 1, NeedPayment: 0, RefundedAmount: 0, LimitedAmount: 0 }
                                    // var ObjRowData = JSON.stringify(ObjKeyData);
                                    //console.log(ObjRowData)
                                    //console.log("Access Key :",atob(aaXToX), "aaTBKey ", aaTBKey)
                                    // sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                } else {
                                    var aaiHeadRef = aRecNo;
                                    //var aaaTitle = " [EDIT]"
                                    var aaaTitle = (iView === undefined) ? " [EDIT]" : " {VIEW}"; //" [EDIT]"
                                    //var aagiftItem = aaLimitedAmt.find(item => item.code === iData.EROCode01);
                                    var aagiftItem = aObjects.aaLimitedAmt.find(item => item.code === iData.EROCode01);
                                    //aObjects.aaLIMITed.find(item => item.code === aVcheck) ? aObjects.aaLIMITed.find(item => item.code === aVcheck).lmtamt : null 
                                    var aagiftAmount = aagiftItem ? aagiftItem.lmtamt : null;
                                    var anLimitAmt = aagiftAmount;
                                    var aformattedNumber = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(anLimitAmt);
                                    asEROCode01 = iData.EROCode01;
                                }
                                var aaSchRefx = "HeadRefNo LIKE '%" + aaiHeadRef + "%'" // (DataGrid View Only This New Item)
                                aqrFull = aaSchRefx;
                                var aaxurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                var aaxSettings = { "url": aaxurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };
                                // Define help text for columns

                                $(() => {
                                    var aaLastLineNo = 1;

                                    var aXXData = function () { return $.post(aaxSettings).done(); }
                                    if (iData === 1) {
                                        iData = aXXData[0];
                                    }

                                    var gbxRateV = 1;
                                    const popup = $("#popupContainerAdd").dxPopup({
                                        title: "HOD Approval " + aaaTitle,
                                        width: '1300px',
                                        position: { offset: "0 -140" },  //{offset: "0 -180"},
                                        //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                        visible: true,
                                        fullScreen: true,
                                        showCloseButton: false,
                                        showTitle: true,
                                        dragEnabled: true,
                                        closeOnOutsideClick: false,
                                        resizeEnabled: true,
                                        onInitialized: function (e) { e.component.registerKeyHandler("escape", function (arg) { }) },     // ignore when press 'ESC'  
                                        //shadingColor:"rgb(190,190,190,0.9)",
                                        //toolbarItems: [{toolbar:"top", html: "<span id='popupexit'></span>"}],
                                        //toolbarItems: [
                                        //{toolbar:"top", html:"<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"}],            
                                        contentTemplate: () => {
                                            return $("<div />").append(
                                                $("<p><div id='Add-form'></div></p>"),
                                                $("<p><div id='Add-dxDataGrid'></div></p>"),
                                                $("<span id='Add-popupexit'></span>"),
                                                $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                $("<span id='aConfirm'></span>")
                                            );
                                        },
                                        onContentReady: () => {
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
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        popup.hide()
                                                    }
                                                }
                                            }]

                                    }).dxPopup("instance");

                                    $("#Add-popupexit").dxButton({
                                        icon: "fas fa-times",
                                        type: "danger",
                                        text: "EXIT",
                                        visible: true,
                                        onClick: function (e) {
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            // let cRes = aMessageSelect("Exit Without SAVE", "Press 'YES' to Not Save ")
                                            // if (aRecNo === 1) { //
                                            //     let result = DevExpress.ui.dialog.confirm(aArrays.aSaveBExit[0], aArrays.aSaveBExit[1]);
                                            //     result.done(function (dresult) {
                                            //         if (dresult) {
                                            //             // not delete
                                            //         } else {
                                            //             let aSQLCommand = "use ExtraOnLine; DELETE FROM REQDEC WHERE HeadRefNo = '" + aaiHeadRef + "'"
                                            //             aSQLAction(aaPFDMI, aSQLCommand)
                                            //             aSQLAction(aaPFDMI, aSQLCommand)
                                            //             aSQLAction(aaPFDMI, aSQLCommand)
                                            //             $("#gridContainer").dxDataGrid("instance").refresh();
                                            //         }
                                            //     });
                                            // }
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            popup.hide()
                                        }
                                    });

                                    $("#aConfirm").dxButton({
                                        hint: "Approve",
                                        icon: "fas fa-check-circle",
                                        type: "success",
                                        text: "APPROVE",
                                        visible: true,
                                        onClick: function (e) {
                                            aHODApproveSS(iData);
                                        }
                                    });

                                    // const aform = $("#Add-form").dxForm("instance");
                                    $("#Add-form").dxForm({
                                        formData: iData, //aXXData[0], //iData,
                                        showColonAfterLabel: false,
                                        labelLocation: "left", //"top",                                                    
                                        readOnly: true,
                                        colCount: 1,
                                        items: [{
                                            itemType: "group",
                                            //caption: "Refference",
                                            //cssClass: "second-group",
                                            colCount: 3,
                                            items: [{
                                                dataField: "HeadRefNo",
                                                label: { text: "REF NO" },
                                                dataType: "string",
                                                value: aaiHeadRef,
                                                editorType: "dxTextBox",
                                                editorOptions: { value: aaiHeadRef, width: 150 },
                                            },
                                            {
                                                dataField: "ReqDate",
                                                label: { text: "Submitted Date" },
                                                dataType: "date",
                                                editorType: "dxDateBox",
                                                editorOptions: { value: idDate, displayFormat: "dd/MM/yyyy", width: 150, readOnly: true },	  //showClearButton: true,  //value: new Date(),                
                                            },
                                            /*
                                            {
                                                itemType: "empty"
                                            },
                                            */
                                            {
                                                dataField: "PayToName",
                                                label: { text: "Associate Name", }, // template: labelTemplate("user"),
                                                dataType: "string",
                                                editorType: "dxTextBox",
                                                editorOptions: { width: 180, readOnly: true },
                                            },
                                            // {
                                            //     itemType: "empty",
                                            //     colSpan: 1,
                                            // }, 
                                            {
                                                dataField: "Department", //ReqDate
                                                label: { text: "Dept." },
                                                dataType: "dxTextBox",
                                                editorOptions: { value: asDepartment, width: 80, readOnly: true },
                                                width: 80,
                                            },
                                            {
                                                dataField: "Vendor02Note",
                                                label: { text: "HOD" },
                                                editorType: "dxTextBox",
                                                editorOptions: { value: aaHODAppName, readOnly: true, width: 180 },
                                                width: 180,
                                            },
                                            {
                                                dataField: "ERStatus",
                                                label: { text: "Status" },
                                                editorType: "dxTextBox",
                                                editorOptions: { value: "Register", readOnly: true, width: 250 },
                                            },


                                            ]

                                        },

                                        ]

                                    }).dxForm("instance");

                                    $("#Add-dxDataGrid").dxDataGrid({

                                        dataSource: new DevExpress.data.CustomStore({
                                            key: "REFNO",
                                            loadMode: "omit",

                                            load: function () { return $.post(aaxSettings).done(); },
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
                                        allowColumnResizing: true, //true,
                                        columnMinWidth: 10,
                                        columnChooser: {
                                            enabled: false //false // true
                                        },
                                        showBorders: true,
                                        sorting: {
                                            mode: "single" //"multiple"
                                        },
                                        selection: {
                                            mode: 'single' //'multiple'
                                        },
                                        groupPanel: {
                                            visible: false //true //false // can't select other group
                                        },
                                        filterRow: {
                                            visible: false,
                                            applyFilter: "auto"
                                        },
                                        headerFilter: {
                                            visible: false //true
                                        },
                                        grouping: {
                                            autoExpandAll: true,
                                        },
                                        searchPanel: {
                                            visible: false //true
                                        },
                                        paging: {
                                            pageSize: 10
                                        },
                                        pager: {
                                            showPageSizeSelector: true,
                                            allowedPageSizes: [10, 20, 50, 100],
                                            showNavigationButtons: true,
                                            showInfo: true
                                        },
                                        showBorders: true,
                                        groupPaging: true,
                                        showColumnLines: true,
                                        showRowLines: true,
                                        rowAlternationEnabled: false, //true, 2 colors
                                        focusedRowEnabled: false,
                                        wordWrapEnabled: true,
                                        cacheEnabled: false,
                                        columnAutoWidth: true,
                                        //rowAutoHeight: true,
                                        // onRowPrepared: function (e) {
                                        //     if (e.rowType === "data") {
                                        //         e.rowElement.css("height", "auto"); // ✅ Force row to auto height
                                        //     }
                                        // },

                                        onInitNewRow: function (e) {
                                            let aaID = 1
                                            let axRunRun = aGetDateRef(aaOnInitExpGroupDesc.substring(0, 1));
                                            let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                            e.data.ID = aaID
                                            e.data.HeadRefNo = axRunRun
                                            e.data.REFNO = axLineNo
                                            e.data.PayToCode = asStaffID
                                            e.data.PayToName = asFullName
                                            e.data.Department = asDepartment
                                            e.data.Division = asDivision
                                            e.data.ERODesc06 = asStaffEmail
                                            e.data.ReqDate = aNowDte //new Date()
                                            e.data.ExpensesCode = "" //aaOnInitAccCode
                                            e.data.ExpensesDescription = aaOnInitAccDesc //aaOnInitAccDesc
                                            e.data.Currency = "THB"
                                            e.data.Xrate = 1
                                            e.data.ExpGroupCode = aaOnInitExpGroupCode
                                            e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                            e.data.ERORefNo3 = "" // type of expenses
                                            e.data.NeedPayment = false
                                            e.data.RefundedAmount = 0
                                            e.data.LimitedAmount = 0 //aaLTotal
                                            e.data.ERORefNo1 = "Given" //Default
                                            e.data.ERStatus = "Register"
                                        },
                                        onEditorPreparing: function (e) {
                                            if (e.parentType === "dataRow" && arDataU === 0) {
                                                e.editorOptions.disabled = true;
                                            } else {     //PSPvNO,PSPvDate
                                                if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ERStatus" || e.dataField === "PSPvNO" || e.dataField === "PSPvDate" || e.dataField === "LocalAmount" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department")) {
                                                    e.editorOptions.disabled = true;
                                                }
                                            }
                                        },
                                        onCellPrepared: function (e) {
                                            if (e.rowType === "data") {
                                                e.cellElement.css("vertical-align", "top");
                                            }
                                        },
                                        //
                                        //
                                        // Editing
                                        editing: {
                                            mode: "cell",        // popup , row, cell (click to edit)
                                            useIcons: true,
                                            allowUpdating: aViewG,
                                            //allowUpdating: true,
                                            allowDeleting: aViewG, //arDataD,
                                            allowAdding: false,  //arDataC,

                                            popup: {
                                                title: "Declaration Requisition Info",
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
                                                type: "buttons",
                                                //caption: "Editor",
                                                width: 40,
                                                buttons: [
                                                    {
                                                        hint: "delete",
                                                        icon: "fas fa-trash", //fa-trash-alt
                                                        visible: function (e) {
                                                            return (e.row.data.Confirmed === false) //return !e.row.isEditing;
                                                        },
                                                        onClick: function (e) {
                                                            //$("#gridContainer").dxDataGrid("instance").refresh();
                                                            var aLocalMess = "";
                                                            var aLocalTitle = "";
                                                            var aSQLCommand = "";
                                                            var aExitMessage = "All rows of this Reimbursement have deleted !!";
                                                            var aFrecN = e.row.data.ID;
                                                            if (aFrecN === 1) {
                                                                aLocalMess = "<div style='color:Tomato; font-size: 16px'><center><b>THIS IS THE FIRST ROW (NO = 1)</b><br>If you delete first row, program will delete all rows [REFNO = <u>" + e.row.data.HeadRefNo + "</u>]</div> <br> Are you sure you want to delete all rows ?"
                                                                aLocalTitle = "DELETE ALL ROWS"
                                                            } else {
                                                                aLocalMess = "Are you sure you want to delete this row (ROW =" + e.row.data.ID + " )?"
                                                                aLocalTitle = "DELETE THIS ROW"
                                                            }
                                                            let result = DevExpress.ui.dialog.confirm(aLocalMess, aLocalTitle); //+ "<br>?? 'YES' ???????????"
                                                            result.done(function (dresult) {
                                                                if (dresult) {
                                                                    // delete data
                                                                    // DELETE FROM REQDEC WHERE HeadRefNo = 'M2110120750'
                                                                    if (aFrecN === 1) {
                                                                        aSQLCommand = "use ExtraOnLine; DELETE FROM REQDEC WHERE HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                    } else {
                                                                        aSQLCommand = "use ExtraOnLine; DELETE FROM REQDEC WHERE REFNO = '" + e.row.data.REFNO + "'"
                                                                    }

                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                    aaLastLineNo = aaLastLineNo - 1
                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                    if (aFrecN === 1) {
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        DevExpress.ui.dialog.alert({ showTitle: false, messageHtml: aExitMessage }); //title: "OVER LIMITATION",
                                                                        popup.hide();
                                                                    }
                                                                }
                                                            });
                                                        }

                                                    },

                                                ]
                                            },
                                            {
                                                type: "buttons",
                                                width: 60,
                                                buttons: [
                                                    {
                                                        hint: "Add Attach file",
                                                        icon: "fas fa-upload", //fa-trash-alt
                                                        type: "success",
                                                        visible: function (e) {
                                                            return (e.row.data.Confirmed === false) //return !e.row.isEditing;
                                                        },
                                                        onClick: function (e) {
                                                            //aPopUpPrintForm(e.row.data, e.row.data.HeadRefNo); //, arTAccount[0]
                                                            //aRPTPrint2Pdf(e.row.data.HeadRefNo, aaPFDMI, "OMasterReport", "Other") //O2302284399 e.row.data.HeadRefNo
                                                            aPopUpUpLoad(e.row.data.REFNO)
                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.event.preventDefault();
                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                        }
                                                    },
                                                    {
                                                        hint: "View Attach file",
                                                        icon: "fas fa-file", //fa-trash-alt fa-book-reader fa-file-invoice fa-file-pdf fa-share-square
                                                        type: "default",
                                                        visible: true,
                                                        // visible: async function (e) {
                                                        //     var aUriV = `https://cbsdev2.locktonwattana.com/temp/uploads/${e.row.data.REFNO}.pdf`
                                                        //     const fileAvailable = await isFileAvailable(aUriV);
                                                        //     if (fileAvailable) {
                                                        //        return (e.row.data.Confirmed === false ) //return !e.row.isEditing;
                                                        //     } else {
                                                        //        return false;
                                                        //     }
                                                        // },
                                                        onClick: async function (e) {
                                                            var aUriV = `${aaPFDMI}/temp/uploads/${e.row.data.REFNO}.pdf`
                                                            console.log(aUriV)
                                                            const cacheBusterUrl = aUriV + "?t=" + new Date().getTime();
                                                            // if (!aaCheckON) {
                                                            //     const fileAvailable = await isFileAvailable(aUriV);
                                                            //     //alert(fileAvailable ? "Found" : "Not found")
                                                            //     if (fileAvailable) {
                                                            //         aPopupPDF(cacheBusterUrl) //showPdf(aUriV) //'https://cbsdev2.locktonwattana.com/temp/uploads/R2411145070-001.pdf'
                                                            //     } else {
                                                            //         aMessageAlert("<b>The requested file is not available on the server.", "red");
                                                            //     }
                                                            // } else {
                                                            aPopupPDF(cacheBusterUrl)
                                                            // }
                                                        }
                                                    }
                                                ]
                                            },
                                            // {
                                            //     type: "buttons",
                                            //     width: 40,
                                            //     buttons: [ // Clone first record ID++
                                            //         {
                                            //             hint: "Add More Line",
                                            //             icon: "fas fa-plus",
                                            //             visible: function (e) {
                                            //                 return (e.row.data.ID === 1 && e.row.data.Confirmed === false) //return !e.row.isEditing;
                                            //             },
                                            //             onClick: function (e) {
                                            //                 aaLastLineNo = aaLastLineNo + 1
                                            //                 // alert(aaLastLineNo)
                                            //                 // REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,RemitTo1,RemitTo2,RemitTo1Amount,RemitTo2Amount,RemitTo1Diff,RemitTo2Diff,RemitTo1Note,RemitTo2Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6
                                            //                 let aBlankDate = new Date(); //"1900-01-01T00:00:00" //new Date('1900-01-01T00:00')//console.log(aBlankDate) 
                                            //                 let axRunRun = e.row.data.HeadRefNo
                                            //                 let aFieldSelected = "NextID"
                                            //                 let aFullTableName = "ExtraOnLine.dbo.GRnextIDview Where HeadRefNo LIKE '" + axRunRun + "%'"
                                            //                 let aFullBody = "Select " + aFieldSelected + " From " + aFullTableName; //alert(aFullBody)                                           
                                            //                 let myHeaders = new Headers(); myHeaders.append("Content-Type", "application/json");
                                            //                 let raw = JSON.stringify({ "@": aFullBody });
                                            //                 let requestOptions = { method: "POST", headers: myHeaders, body: raw, redirect: "follow" };
                                            //                 let aURL = aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";

                                            //                 fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                            //                     .then(response => response.json())
                                            //                     //
                                            //                     .then(aData => {
                                            //                         // start process
                                            //                         let aaID = aData[0].NextID //JSON.stringify(aData); //aData[0].NextID //next no 
                                            //                         let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                            //                         //let aObjKeyData = { ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, EROAmount: 0, PBatchDate: aBlankDate,PSPvDate: aBlankDate,ERODate01: aBlankDate,ERODate02: aBlankDate,ERODate03: aBlankDate,ERODate04: aBlankDate,ERODate05: aBlankDate,ERODate06: aBlankDate} //{EntryBy: aaUsrN , EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };
                                            //                         let aObjKeyData = { REFNO: axLineNo, ID: aaID, RefundedAmount: 0, LocalAmount: 0, Amount: 0, AmountBeforeVAT: 0, VAT: 0, EROCode01: "", ERODesc05: "", ERODesc01: "", ERORefNo4: "", ERORefNo3: "", Note: "", ERORefNo1: "", ERORefNo3: "", ERODesc02: "", ERODesc03: "", Vendor01: "", ExpensesCode: "" }
                                            //                         let aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //values 
                                            //                         //var clonedItem = $.extend({}, e.row.data, { REFNO: axRunRun }); //++maxID
                                            //                         //confole.log("new line ", axLineNo)
                                            //                         sendRequestNew("Insert", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));

                                            //                         e.component.refresh(true); //employees.splice(e.row.rowIndex, 0, clonedItem);
                                            //                         e.component.refresh(true);
                                            //                         e.component.refresh(true);
                                            //                         e.event.preventDefault();

                                            //                         $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                            //                         $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                            //                         $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                            //                         $("#Add-dxDataGrid").dxDataGrid("instance").refresh();

                                            //                     })
                                            //                     .catch(e => {
                                            //                         console.log(e);
                                            //                     })
                                            //                 $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                            //                 $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                            //             }
                                            //         },
                                            //     ]
                                            // },
                                            {
                                                type: "buttons",
                                                width: 40,
                                                buttons: [
                                                    {
                                                        hint: "Add More Line",
                                                        icon: "fas fa-plus",
                                                        visible: function (e) {
                                                            return (e.row.data.ID === 1 && e.row.data.Confirmed === false);
                                                        },
                                                        onClick: function (e) {
                                                            const axRunRun = e.row.data.HeadRefNo; // current HeadRefNo
                                                            const aTableName = "REQDEC"; // actual table
                                                            const aSQL = `SELECT ISNULL(MAX(ID), 0) + 1 AS NextID FROM ${aTableName} WHERE HeadRefNo = '${axRunRun}'`;

                                                            const aURL = `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232`;

                                                            fetch(aURL, {
                                                                method: "POST",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify({ "@": btoa(aSQL) }),
                                                                redirect: "follow"
                                                            })
                                                                .then(response => response.json())
                                                                .then(aData => {
                                                                    if (!aData || !aData[0] || !aData[0].NextID) {
                                                                        throw new Error("No valid NextID returned.");
                                                                    }

                                                                    const aaID = aData[0].NextID;
                                                                    const axLineNo = `${$.trim(axRunRun)}-${String(aaID).padStart(3, '0')}`;
                                                                    const aBlankDate = new Date(); //new Date("1900-01-01T00:00:00");

                                                                    const aObjKeyData = {
                                                                        REFNO: axLineNo,
                                                                        ID: aaID,
                                                                        RefundedAmount: 0,
                                                                        LocalAmount: 0,
                                                                        Amount: 0,
                                                                        AmountBeforeVAT: 0,
                                                                        VAT: 0,
                                                                        Note: "",
                                                                        EROCode01: "",
                                                                        ERODesc01: "",
                                                                        ERODesc02: "",
                                                                        ERODesc03: "",
                                                                        ERODesc04: "",
                                                                        ERODesc05: "",
                                                                        ERORefNo1: "",
                                                                        ERORefNo3: "",
                                                                        ERORefNo4: "",
                                                                        Vendor01: "",
                                                                        ExpensesCode: "",
                                                                        PSPvDate: aBlankDate,
                                                                        PBatchDate: aBlankDate,
                                                                        ERODate01: aBlankDate,
                                                                        ERODate02: aBlankDate,
                                                                        ERODate03: aBlankDate,
                                                                        ERODate04: aBlankDate,
                                                                        ERODate05: aBlankDate,
                                                                        ERODate06: aBlankDate
                                                                    };

                                                                    const aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData));

                                                                    sendRequestNew("Insert", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));

                                                                    const gridInstance = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                                    gridInstance.refresh();

                                                                    e.event.preventDefault();
                                                                })
                                                                .catch(error => {
                                                                    console.error("Error fetching NextID:", error);
                                                                    DevExpress.ui.notify("Failed to fetch next ID from REQDEC", "error", 3000);
                                                                });
                                                        }
                                                    }
                                                ]
                                            },

                                            {
                                                dataField: "ID",
                                                sortOrder: "asc",
                                                dataType: "string",
                                                caption: "#",
                                                editorOptions: { width: 50 },
                                                width: 50
                                            },
                                            {
                                                dataField: "ERODate01",
                                                caption: "Date",
                                                dataType: "date",
                                                format: "dd/MM/yyyy",
                                                width: 120,
                                                stylingMode: 'filled',
                                                editorType: "dxDateBox", //"dxDateBox", //"dxCalendar", function (){return null}
                                                editorOptions: {
                                                    showClearButton: true,
                                                    format: "dd/MM/yyyy",
                                                    width: 120,
                                                    showTodayButton: false,
                                                },
                                                validationRules: [{ type: "required" }, {
                                                    type: "range",
                                                    min: new Date(aYearStrS + "-04-30"), //aYearStrS
                                                    max: new Date(aYearStrL + "-04-30"), //aYearStrL
                                                    message: "Please Change Bill Date"
                                                }],
                                                visible: true,
                                            },
                                            {
                                                dataField: "EROCode01",
                                                caption: "Type of Gift/Entertain",
                                                dataType: "string",
                                                editorType: "dxSelectBox",
                                                width: 150,
                                                editorOptions: {
                                                    width: 150,
                                                    dataSource: aObjects.aaTypeOfGift, //aaTypeOfGift
                                                    //displayExpr: function (item) { return item && item.code + " (" + item.thaname + ")"; },
                                                    displayExpr: "code",
                                                    valueExpr: "code"
                                                },
                                                setCellValue: function (newData, value, currentRowData) {
                                                    newData.EROCode01 = value;
                                                    //ar giftItem = aaLimitedAmt.find(item => item.code === value);
                                                    var giftItem = aObjects.aaLimitedAmt.find(item => item.code === value);
                                                    var giftAmount = giftItem ? giftItem.lmtamt : null;
                                                    anLimitAmt = giftAmount;
                                                    asEROCode01 = value;
                                                    //confole.log(anLimitAmt)
                                                    newData.EROAmount1 = 0;
                                                    newData.EROAmount2 = 0;
                                                    newData.Amount = 0;
                                                },
                                                visible: true,
                                                //validationRules: [{ type: "required" }],
                                            },
                                            {
                                                dataField: "ERODesc01",
                                                caption: "Details of Gift Or Entertain.",
                                                //dataType: "string",
                                                rowAutoHeight: true,
                                                //cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                cellTemplate: function (container, options) {
                                                    const text = options.value ? options.value.replace(/\n/g, "<br>") : "";
                                                    container.addClass("full-height-text").html(text);
                                                },
                                                editorType: "dxTextArea",
                                                width: 180,
                                                height: 180,
                                                editorOptions: { width: 178, height: 220 }, //, height: 80 ,className: "full-height-scrollbar"
                                                visible: true,
                                            },
                                            {
                                                dataField: "ERODesc02",
                                                caption: "Purpose.",
                                                dataType: "string",
                                                rowAutoHeight: true,
                                                cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                editorType: "dxTextArea",
                                                width: 180,
                                                height: 180,
                                                editorOptions: { width: 179, height: 220 },
                                                visible: true,
                                            },
                                            {
                                                dataField: "ERODesc03",
                                                caption: "From/With Whom", //Other Lockton Employees present?
                                                dataType: "string",
                                                rowAutoHeight: true,
                                                cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                editorType: "dxTextArea",
                                                width: 150,
                                                //height: 180,
                                                editorOptions: { width: 140, height: 220 },
                                                visible: true,
                                                // validationRules: [
                                                //     {
                                                //         type: "required",
                                                //         message: "This field is required.", // Will not show alert but logs the issue
                                                //         reevaluate: true, // Ensures the caption updates when validation status changes
                                                //     }
                                                // ],
                                            },
                                            {
                                                dataField: "ERODesc04",
                                                caption: "Other Lockton Employees present", //Other Lockton Employees present?
                                                dataType: "string",
                                                rowAutoHeight: true,
                                                cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                editorType: "dxTextArea",
                                                width: 150,
                                                height: 180,
                                                editorOptions: { width: 150, height: 220 },
                                                visible: true,
                                            },
                                            {
                                                dataField: "ERORefNo1",
                                                caption: "Given/Receive", //
                                                dataType: "string",
                                                editorType: "dxSelectBox",
                                                width: 100,
                                                editorOptions: {
                                                    width: 100,
                                                    dataSource: aObjects.aGivenRec, //[{ code: "Given" }, { code: "Receive" }],
                                                    displayExpr: "code",
                                                    //displayExpr: function (item) { return item && item.code + " (" + item.thaname + ")"; },
                                                    valueExpr: "code"
                                                },
                                                visible: true,
                                            },
                                            {
                                                dataField: "ERODesc05",
                                                caption: "Vendor Name", //Other Lockton Employees present?
                                                dataType: "string",
                                                cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                editorType: "dxTextArea",
                                                width: 150,
                                                height: 180,
                                                editorOptions: { width: 140, height: 220 },
                                                visible: true,
                                            },
                                            {
                                                dataField: "EROAmount1",
                                                caption: "Approximate Value",
                                                dataType: "number",
                                                format: { type: "fixedPoint", precision: 2 },
                                                editorType: "dxNumberBox",
                                                editorOptions: { format: "#,##0.00", width: 130 },
                                                setCellValue: function (newData, value, currentRowData) {
                                                    newData.EROAmount1 = value;
                                                    newData.EROAmount2 = (currentRowData.EROAmount2 === 0 ? 1 : currentRowData.EROAmount2)
                                                    newData.Amount = (value / (currentRowData.EROAmount2 === 0 ? 1 : currentRowData.EROAmount2));
                                                    newData.EROAmount2 = currentRowData.EROAmount2 === 0 ? 1 : currentRowData.EROAmount2;
                                                },
                                                width: 130,
                                                visible: true,
                                            },
                                            {
                                                dataField: "EROAmount2",
                                                caption: "Number of Attendee",
                                                dataType: "number",
                                                format: { type: "fixedPoint", precision: 0 },
                                                editorType: "dxNumberBox",
                                                editorOptions: {
                                                    format: "#,##0",
                                                    width: 130,
                                                },
                                                setCellValue: function (newData, value, currentRowData) {
                                                    newData.EROAmount2 = value;
                                                    newData.Amount = (currentRowData.EROAmount1 / value);
                                                },
                                                width: 130,
                                                visible: true,
                                            },
                                            {
                                                dataField: "Amount",
                                                caption: "Average Value",
                                                dataType: "number",
                                                format: { type: "fixedPoint", precision: 2 },
                                                editorType: "dxNumberBox",
                                                editorOptions: { format: "#,##0.00", width: 130 },
                                                width: 130,
                                                validationRules: [
                                                    {
                                                        type: "custom",
                                                        validationCallback: function (e) {
                                                            if (e.value < anLimitAmt && e.value > 0) { //
                                                                aMessageAlert("<b>Under limit (" + aformattedNumber + ") don’t need to declare.", "Red");//aMessageAlert("Already UN-Confirmed (Call Request back to Edit)", "Red")
                                                                e.data.Amount = 0;
                                                                e.data.EROAmount1 = 0;
                                                                e.data.EROAmount2 = 1;
                                                                return true;
                                                            }
                                                            return true;
                                                        }
                                                    }
                                                ],
                                                visible: true,
                                            },


                                        ],
                                        /* onCellClick: function (e) {
                                            // Check if the clicked cell is a header
                                            const columnHelp = {
                                                "ERODesc03": "From/With Whom",
                                                "EROCode01": "Type of Gift/Entertain<br>E.g.. Names of client, Insurers,<br> Prospects and their family members<br> (please explain)",                                                
                                            };
                                            if (e.rowType === "header") {
                                                const columnCaption = e.column.caption;
                                                const helpText = columnHelp[columnCaption];
                                                alert("Help Text", helpText, "column ", columnCaption)
                                                if (helpText) {
                                                    // Show popup with help text
                                                    $("#popup").dxPopup({
                                                        title: `Help: ${columnCaption}`,
                                                        contentTemplate: function () {
                                                            return $("<div>").text(helpText);
                                                        },
                                                        width: 400,
                                                        height: 200,
                                                        visible: true,
                                                        dragEnabled: true,
                                                        closeOnOutsideClick: true,
                                                    });
                                                }
                                            }
                                        }, */
                                        /* onCellClick: function (e) {
                                            // Check if the clicked cell is a header
                                            const columnHelp = {
                                                "ERODesc03": "From/With Whom<br>E.g.. Names of client, Insurers,<br> Prospects and their family members<br> (please explain)",
                                                "EROCode01": "Type of Gift/Entertain"
                                            };
                                        
                                            if (e.rowType === "header") {
                                                // Use dataField to match the columnHelp keys
                                                const columnDataField = e.column.dataField;
                                                const columnCaption = e.column.caption; // For popup title
                                                const helpText = columnHelp[columnDataField]; // Match dataField with help text
                                        
                                                if (helpText) {
                                                    // Show popup with help text
                                                    $("#popup").dxPopup({
                                                        title: `Help: ${columnCaption}`, // Use caption for the popup title
                                                        contentTemplate: function () {
                                                            return $("<div>").html(helpText); // Use html to render line breaks
                                                        },
                                                        width: 400,
                                                        height: 200,
                                                        visible: true,
                                                        dragEnabled: true,
                                                        closeOnOutsideClick: true,
                                                    }).dxPopup("show"); // Show the popup
                                        
                                                } else {
                                                    alert(`No help text found for column: ${columnCaption}`);
                                                }
                                            }
                                        }, */


                                        onCellHoverChanged: function (e) {
                                            //console.log(aObjects.aGHeaderHelp)
                                            // const columnHelp = {
                                            //     "ERODesc03": "From/With Whom<br>E.g.. Names of client, Insurers,<br> Prospects and their family members<br> (please explain)",
                                            //     "EROCode01": "Type of Gift/Entertain"
                                            // };
                                            const columnHelp = aObjects.aGHeaderHelp;
                                            if (e.rowType === "header") {
                                                const columnDataField = e.column.dataField;

                                                if (e.eventType === "mouseover") {
                                                    if (currentHoveredColumn !== columnDataField) {
                                                        // New column hover, reset nTime and update currentHoveredColumn
                                                        currentHoveredColumn = columnDataField;
                                                        nTime = 1; // First time for this column
                                                    } else {
                                                        nTime += 1; // Increment nTime if we're still in the same column
                                                    }

                                                    // Show the popup only when nTime === 1
                                                    if (nTime === 1) {
                                                        const columnCaption = e.column.caption; // For popup title
                                                        const helpText = columnHelp[columnDataField]; // Match dataField with help text

                                                        if (helpText) {
                                                            $("#popup").dxPopup({
                                                                title: `Help: ${columnCaption}`, // Use caption for the popup title
                                                                contentTemplate: function () {
                                                                    return $("<div>").html(helpText); // Use html to render line breaks
                                                                },
                                                                width: 400,
                                                                height: 200,
                                                                visible: true,
                                                                dragEnabled: true,
                                                                closeOnOutsideClick: true,
                                                                wrapperAttr: { class: "rounded-popup" }, // Add a custom class
                                                            }).dxPopup("show"); // Show the popup
                                                        }
                                                    }
                                                }

                                                if (e.eventType === "mouseout") {
                                                    // Hide the popup and reset the hover counter
                                                    if (nTime === 1) {
                                                        //alert("ntime ", nTime)
                                                        nTime = 0
                                                        //$("#popup").dxPopup("hide");
                                                        //console.log(nTime, currentHoveredColumn) 
                                                    } else {
                                                        // alert(`help ${nTime}`)
                                                        // aPopupHelp(`Help: ${columnCaption}`, helpText);   
                                                        // $("#popup").dxPopup("hide");
                                                        // currentHoveredColumn = null; // Reset to indicate no column is currently hovered
                                                        nTime = 0; // Reset the hover counter
                                                        //$("#popup").dxPopup("hide");
                                                        //console.log(nTime, currentHoveredColumn)  
                                                    }

                                                }
                                            }
                                        },

                                        summary: {
                                            recalculateWhileEditing: true,
                                            skipEmptyValues: false,
                                            totalItems: [
                                                {
                                                    column: "REFNO",
                                                    summaryType: "count",
                                                    //summaryType: "max",
                                                    //valueFormat: "currency",
                                                    //showInGroupFooter: false,
                                                    //alignByColumn: true            
                                                    displayFormat: "{0} Items",
                                                },

                                                {
                                                    column: "RefundedAmount",
                                                    summaryType: "sum",
                                                    //summaryType: "max",
                                                    valueFormat: "#,##0.00", //"currency",
                                                    //showInGroupFooter: false,
                                                    //alignByColumn: true            
                                                    displayFormat: "{0}",
                                                },
                                            ],
                                            groupItems: [
                                                {
                                                    column: "ID",
                                                    summaryType: "count",
                                                    displayFormat: "{0} Items",
                                                },
                                                {
                                                    column: "ERORefNo4",
                                                    summaryType: "count",
                                                    showInGroupFooter: true,
                                                    displayFormat: "Total {0} Items",
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
                                                    widget: "dxButton",
                                                    options: {
                                                        icon: "refresh",
                                                        text: "REFRESH",
                                                        stylingMode: "outlined",
                                                        onClick: () => {
                                                            dataGrid.refresh();
                                                        }
                                                    }
                                                },
                                                {
                                                    location: "before",
                                                    template: () => { return $("<div style='padding: 5px 15px;'/>") }
                                                },
                                                {
                                                    location: "after",
                                                    widget: "dxButton",
                                                    options: {
                                                        icon: "fas fa-info",
                                                        text: "HELP",
                                                        type: "success",
                                                        stylingMode: "contained",
                                                        onClick: () => {
                                                            if (typeof aVARs.HELP02 !== undefined) {
                                                                //     console.log("Type is undefined");                                                                                                                                                       
                                                                // } else {
                                                                aPopupHelp("HELP", aVARs.HELP02);
                                                            }
                                                        }
                                                    }
                                                }

                                            );
                                        }

                                    }).dxDataGrid("instance");

                                });
                            }

                            const aHODApproveSS = (iData) => { // HOD Approve
                                var aRequesterName = iData.PayToName //"Wikran Intaraprajaks" iData.HeadRefNo
                                var aRequesterEmail = iData.ERODesc06 //"wikran@asia.lockton.com"
                                var aaHODAll4Chk = iData.Vendor01Note
                                var aApprovalDateFN = "ERODate02";
                                var aNowDateT = aNowText()
                                if (aaHODAll4Chk === "") {
                                    DevExpress.ui.dialog.alert("This record is not valid, no approval group", "ERROR");
                                }
                                const aTableName = "REQDEC";
                                const aOTHTableName = "GIFTREC";
                                var aRefNo = iData.HeadRefNo; // "D2108063704"
                                var aiFoundA = false;
                                var xxChkEmailxx = aTranTextJson(aaHODAll4Chk, "MAIL:", "RANG:")
                                var xxNofChk = xxChkEmailxx.length
                                var xxChkNamexx = aTranTextJson(aaHODAll4Chk, "NAME:", "MAIL:")
                                var xxChkRangexx = aTranTextJson(aaHODAll4Chk, "RANG:", "")
                                var aTrueORFalse = "0"; //(iData.HODApproved === true ? '0' : '1');
                                var aTrueORFalseB = false; //(iData.HODApproved === true ? false : true);
                                var xxNextAppEmailxx;
                                var xxNextApproverxx;
                                var aERStatus = ""; //"Register" // Confirmed wait for HOD // "HOD Approved wait for FA";
                                //var aApprovalDateFN = "ERODate02";
                                //var aNowDateT = aNowText()

                                var anLno;
                                for (let i = 0; i < xxChkNamexx.length; i++) {
                                    if (asFullName === xxChkNamexx[i]) {
                                        anLno = i
                                        aiFoundA = true;
                                        break;
                                    }
                                }
                                var aaCnfTitle = "ERROR !!";
                                var aaCnfBody = "ERROR - Approval Process, this is not your approval record please contact administrator <br> Approver should be " + xxChkNamexx[0];
                                // console.log("found=", anLno, "No of Arr=", xxNofChk)
                                // console.log(aiFoundA)

                                if (anLno === 0) { // found in 1  
                                    aApprovalDateFN = "ERODate02";
                                    if (xxNofChk === 1) { //1 Approver
                                        aaCnfTitle = "APPROVE ?"
                                        aaCnfBody = "Press 'YES' to Approve and Send Mail to " + aRequesterName + " Email " + aRequesterEmail
                                        aTrueORFalse = "1"; // approval date = ERODate02
                                        aTrueORFalseB = true;
                                        aERStatus = aArrays.DECSTATUS[1]; // "HOD Approved";
                                        //console.log("Next A to Requester");
                                    } else { // more than 1 Approver 
                                        xxNextApproverxx = xxChkNamexx[anLno + 1]
                                        xxNextAppEmailxx = xxChkEmailxx[anLno + 1] // to ERORefNo06 xxChkEmailxx                                            
                                        aaCnfTitle = "VERIFY ?"
                                        aaCnfBody = "Press 'YES' to Verify and Send Mail to " + xxNextApproverxx + " [Email " + xxNextAppEmailxx + "] <br> For next verify or approve."
                                        aTrueORFalse = "0"; // approval date = ERODate02
                                        aTrueORFalseB = false;
                                        aERStatus = aArrays.DECSTATUS[0]; //"Confirmed wait for HOD";
                                        //console.log("Next A", xxNextApproverxx)
                                    }
                                } else if (anLno === 1) { // found in 2
                                    aApprovalDateFN = "ERODate03";
                                    if (xxNofChk === 2) { // 2 Approvers
                                        aaCnfTitle = "APPROVE ?"
                                        aaCnfBody = "Press 'YES' to Approve and Send Mail to " + aRequesterName + " Email " + aRequesterEmail
                                        aTrueORFalse = "1"; // approval date = ERODate03
                                        aTrueORFalseB = true;
                                        aERStatus = aArrays.DECSTATUS[1]; // "HOD Approved";
                                        //console.log("Next A to Requester");
                                    } else { // more than 2 Approver
                                        xxNextApproverxx = xxChkNamexx[anLno + 1]
                                        xxNextAppEmailxx = xxChkEmailxx[anLno + 1] // to ERORefNo06 xxChkEmailxx                                            
                                        aaCnfTitle = "VERIFY ?"
                                        aaCnfBody = "Press 'YES' to Verify and Send Mail to " + xxNextApproverxx + " [Email " + xxNextAppEmailxx + "] <br> For next verify or approve."
                                        aTrueORFalse = "0"; // approval date = ERODate03
                                        aTrueORFalseB = false;
                                        aERStatus = aArrays.DECSTATUS[0]; //"Confirmed wait for HOD";
                                        //console.log("Next A", xxNextApproverxx)
                                    }
                                } else if (anLno === 2) {       // found in 3 
                                    aApprovalDateFN = "ERODate04";
                                    aaCnfTitle = "APPROVE ?"
                                    aaCnfBody = "Press 'YES' to Approve and Send Mail to " + aRequesterName + " Email " + aRequesterEmail
                                    aTrueORFalse = "1"; // approval date = ERODate04
                                    aTrueORFalseB = true;
                                    aERStatus = aArrays.DECSTATUS[1]; // "HOD Approved";
                                    //console.log("Next A to Requester");
                                }
                                //console.log("TEST", xxChkNamexx, xxChkEmailxx, xxChkRangexx)


                                if (aaCnfTitle === "ERROR !!") {
                                    DevExpress.ui.dialog.alert(aaCnfBody, aaCnfTitle);
                                } else {

                                    let result = DevExpress.ui.dialog.confirm(aaCnfBody, aaCnfTitle); //+ "<br>?? 'YES' 
                                    result.done(function (dresult) {
                                        if (dresult) {

                                            var aGDescENG = iData.ExpGroupDescEng
                                            if (aApprovalDateFN === "ERODate02") {
                                                var aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, ERODate02: new Date() }; //ReqDate: new Date()
                                            } if (aApprovalDateFN === "ERODate03") {
                                                var aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, ERODate03: new Date() }; //ReqDate: new Date()
                                            } if (aApprovalDateFN === "ERODate04") {
                                                var aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, ERODate04: new Date() }; //ReqDate: new Date()
                                            }
                                            var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                            sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO

                                            //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704' ", " + aApprovalDateFN + " = " + aNowDateT
                                            // + "', " + aApprovalDateFN + " = '" + aNowDateT 
                                            let aSQLCommand = "";
                                            if (aTrueORFalse === "1") {
                                                aSQLCommand = `use ExtraOnLine; UPDATE ${aTableName} SET HODApproved = ${aTrueORFalse}, ERStatus = '${aERStatus}', ${aApprovalDateFN} = '${aNowDateT}' WHERE HeadRefNo = '${iData.HeadRefNo}'`;
                                                aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                if (iData.ERORefNo1 === "Receives") {
                                                    // First: insert all matching records from REQDEC into REQDEC_BACKUP
                                                    let aSQLCommand = `USE ExtraOnLine; INSERT INTO ${aOTHTableName} SELECT * FROM ${aTableName} WHERE HeadRefNo = '${aRefNo}';`;
                                                    aSQLAction(aaPFDMI, aSQLCommand);
                                                    aSQLAction(aaPFDMI, aSQLCommand);
                                                    aSQLAction(aaPFDMI, aSQLCommand);

                                                    // Second: update HeadRefNo and REFNO to start with 'G' instead of 'D'
                                                    aSQLCommand = `USE ExtraOnLine; UPDATE ${aOTHTableName} SET HeadRefNo = 'G' + SUBSTRING(HeadRefNo, 2, LEN(HeadRefNo)), REFNO = 'G' + SUBSTRING(REFNO, 2, LEN(REFNO)) WHERE HeadRefNo = '${aRefNo}';`;
                                                    aSQLAction(aaPFDMI, aSQLCommand);
                                                    aSQLAction(aaPFDMI, aSQLCommand);   
                                                    aSQLAction(aaPFDMI, aSQLCommand); 
                                                }
                                            } else {
                                                aSQLCommand = `use ExtraOnLine; UPDATE ${aTableName} SET HODApproved = ${aTrueORFalse}, ERStatus = '${aERStatus}', ${aApprovalDateFN} = '${aNowDateT}', Vendor02Note = '${xxNextApproverxx}', ERORefNo6 = '${xxNextAppEmailxx}' WHERE HeadRefNo = '${iData.HeadRefNo}'`;

                                                aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                aSQLAction(aaPFDMI, aSQLCommand)
                                            }
                                            //console.log(aSQLCommand)


                                            // e.component.refresh(true);
                                            // e.component.refresh(true);
                                            // e.component.refresh(true);
                                            // e.event.preventDefault();

                                            //send Email
                                            var aRefNoa = iData.HeadRefNo;
                                            var aMessage01;
                                            var aaMailTitle;
                                            var aaMessTitle;
                                            let aApproverName = aaHODAppName
                                            let aApproverEmail = $.trim(aaHODAppEmail)
                                            //  
                                            // xxNextApproverxx = aApproverName  + " [test]"; // if not defined use ApproverName
                                            // xxNextAppEmailxx = aApproverEmail; 
                                            //   
                                            let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Declaration Requisition</a>";

                                            //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                            let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName, aaMessTitle: aaMessTitle, xxNextApproverxx: xxNextApproverxx, xxNextAppEmailxx: xxNextAppEmailxx, aGDescENG: aGDescENG, aMessage01: aMessage01 };
                                            //aMessage01 = aArrays.ACONFIRM[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match)
                                            //aTrueORFalse = "0"; // default  "1"
                                            if (aTrueORFalse === "1") {
                                                aaMailTitle = aGDescENG.toUpperCase() + " - HOD APPROVED";
                                                aaMessTitle = aGDescENG.toUpperCase() + " <br> HOD APPROVED";
                                                aMessage01 = aArrays.ACONFIRM[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match)
                                                //aMessage01 = "<div>TO " + aRequesterName + "<br><br>  Already Approved " + aGDescENG + " Expenses Refno " + iData.HeadRefNo + "<br> LINK -->" + aAddress2Do + "<br><br><b>" + aApproverName + "</b></div>"
                                            } else {
                                                aaMailTitle = aGDescENG.toUpperCase() + " - NEED VERIFY/APPROVE";
                                                aaMessTitle = aGDescENG.toUpperCase() + " <br> NEED VERIFY/APPROVE";
                                                aMessage01 = aArrays.ACONFIRM[1].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match)
                                                //aMessage01 = "<div>Dear Khun " + xxNextApproverxx + "<br><br>  Please verify or approve " + aGDescENG + " Expenses Refno " + iData.HeadRefNo + "<br> LINK -->" + aAddress2Do + "<br><br><b>" + aApproverName + "</b></div>"
                                            }

                                            var aSubject = aaMailTitle
                                            var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #00C510; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMessTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#CEFDD2;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                            // To FA 
                                            //var aFASubject = aaMailTitle + " (For FA)"
                                            //var aMessageFA01 = "<div><br>TO <b>FA Administrator</b><br><br>&nbsp;&nbsp;&nbsp;" + aGDescENG + " Declaration Requisition <br>&nbsp;&nbsp;&nbsp;REFNO = [" + iData.HeadRefNo + "] already approved by HOD <br><br>&nbsp;&nbsp;&nbsp;Verify at " + aAddress2Do + " (menu FA Approve) <br><br><br><b>HR Administrator</b><br></div>"
                                            //var aMessageFA = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #00C510; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaOnInitExpGroupDesc.toUpperCase() + " Declaration Requisition <br>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EFFFEA;'><div style='margin: 5px 2px 10px 10px;'>" + aMessageFA01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                            if (aTrueORFalse === "1") {
                                                aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)
                                                //aSendMailDMZ(" " + aaFAAppName, aaFAAppEmail, aApproverEmail, "", "", aFASubject, aMessageFA)
                                            } else {
                                                aSendMailDMZ(" " + xxNextApproverxx, xxNextAppEmailxx, aApproverEmail, "", "", aSubject, aMessage)
                                                //aSendMailDMZ(" " + aaFAAppName, aaFAAppEmail, aApproverEmail, "", "", aFASubject, aMessageFA)
                                            }
                                            // e.component.refresh(true);
                                            // e.component.refresh(true);
                                            // e.component.refresh(true);
                                            // e.event.preventDefault();

                                            //aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)                                    
                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                            if (aTrueORFalse === "1") {
                                                //aMessageAlert("Already Approved & Send Mail to " + aRequesterName + " (" + aRequesterEmail + ")", "DarkGreen")
                                                //aMessageAlert("Already Approved <br> EMAIL <br>" + aMessage, "DarkGreen")
                                            } else {
                                                //aMessageAlert("Already Verified and Send Mail to " + xxNextApproverxx + " (" + xxNextAppEmailxx + ")", "DarkGreen")
                                            }
                                            aMessageAlert("Already Approved <br> EMAIL <br>" + aMessage, "DarkGreen")
                                        }
                                    });
                                }

                            };

                        }) //then fetch (HOR or HR Email get inside better ?)
                        .catch(error => console.error("Error fetching SQL data:", error)); // load loadsqldata
                }); // load content    
        });
        // TOP PRG
    });  // ajax        
