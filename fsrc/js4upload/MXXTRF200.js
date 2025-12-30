//HOD Approve Travel Requisition
//const { loadAndProcessSQLData } = require("./src/dataLoader");
// window.onload = function () {
//     setTimeout(function () {
//         location.reload();
//     }, 3000000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
// }

$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
const { PDFDocument } = PDFLib;
// const arSTATUS = ["Please send the Document to ADMIN", "Please contact back asap", "Please check your limit", "Please Check the Record"];
// const arSTANOTE = ["กรุณาส่งเอกสารไปให้แผนกบัญชีทันที", "กรุณาติดต่อกลับโดยด่วน", "กรุณาตรวจสอบวงเงิน", "กรุณาตรวจสอบรายการ "]

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
                    var aaERTYPE = "800"
                    var aaOnInitExpGroupCode = "800"
                    var aaOnInitExpGroupDesc = "Travel Requisition"
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
                            var aHODDivGrp = "(select ApproveToDivision from Approver Where ApproverCode = 'HOD' and ApproverEmpID = '" + asStaffID + "')"
                            //var aHODEORRefNo6 = " ERORefNo6 = '" + $.trim(asStaffEmail) +"'"
                            let aHODApproveSS_Running = false; // Declare globally
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
                                        title: "Travel Requisition Info",
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
                                        buttons: [
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
                                            /// HIGH !!!!
                                            // {
                                            //     hint: "Approve",
                                            //     icon: "fas fa-check-circle",
                                            //     visible: function (e) {
                                            //         return (e.row.data.ID === 1 && e.row.data.HODApproved === false) //return !e.row.isEditing; && e.row.data.HODApproved === false
                                            //     },
                                            //     onClick: function (e) {
                                            //         //aHODApprove(e)
                                            //         aHODApproveSS(e.row.data)
                                            //     }
                                            // },
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
                                            
                                            {  // approve false
                                                hint: "Approve",
                                                icon: "fas fa-check-circle",
                                                visible: false,
                                                //visible: function (e) {
                                                //    return (e.row.data.ID === 1 && e.row.data.HODApproved === false) //return !e.row.isEditing; && e.row.data.HODApproved === false
                                                //},
                                                onClick: function (e) {
                                                    // mark Confirmed field
                                                    console.log(e.row.data.Vendor01Note, e.row.data.ERORef6, e.row.data.ExpGroupCode)
                                                    console.log(asFullName)
                                                    var aRequesterName = e.row.data.PayToName //"Wikran Intaraprajaks" e.row.data.HeadRefNo
                                                    var aRequesterEmail = e.row.data.ERODesc06 //"wikran@asia.lockton.com"
                                                    var aaHODAll4Chk = e.row.data.Vendor01Note
                                                    var aApprovalDateFN = "HODApprovedDate"; // ERODate02
                                                    var aNowDateT = aNowText()
                                                    if (aaHODAll4Chk === "" && e.row.data.ExpGroupCode !== "200") {
                                                        DevExpress.ui.dialog.alert("This record is not valid, no approval group", "ERROR");
                                                    }
                                                    if (e.row.data.ExpGroupCode === "200") {
                                                        aaCnfTitle = "APPROVE ?"
                                                        aaCnfBody = "Press 'YES' to Approve Fleet Card and Send Mail to " + aRequesterName + " Email " + aRequesterEmail
                                                        aTrueORFalse = "1";
                                                        aTrueORFalseB = true;
                                                        aERStatus = "HOD Approved wait for ADMIN";
                                                        console.log("Fleet Card / Next A to Requester");
                                                    } else {
                                                        var aiFoundA = false;
                                                        var xxChkEmailxx = aTranTextJson(aaHODAll4Chk, "MAIL:", "RANG:")
                                                        var xxNofChk = xxChkEmailxx.length
                                                        var xxChkNamexx = aTranTextJson(aaHODAll4Chk, "NAME:", "MAIL:")
                                                        var xxChkRangexx = aTranTextJson(aaHODAll4Chk, "RANG:", "")
                                                        var aTrueORFalse = "0"; //(e.row.data.HODApproved === true ? '0' : '1');
                                                        var aTrueORFalseB = false; //(e.row.data.HODApproved === true ? false : true);
                                                        var xxNextAppEmailxx;
                                                        var xxNextApproverxx;
                                                        var aERStatus = ""; //"Register" // Confirmed wait for HOD // "HOD Approved wait for FA";
                                                        //var aApprovalDateFN = "ERODate02";
                                                        //var aNowDateT = aNowText()
                                                        console.log(xxChkNamexx.length)
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
                                                        console.log("found=", anLno, "No of Arr=", xxNofChk)
                                                        console.log(aiFoundA)

                                                        if (anLno === 0) { // found in 1  
                                                            aApprovalDateFN = "HODApprovedDate"; //ERoDate02
                                                            if (xxNofChk === 1) { //1 Approver
                                                                aaCnfTitle = "APPROVE ?"
                                                                aaCnfBody = "Press 'YES' to Approve and Send Mail to " + aRequesterName + " Email " + aRequesterEmail + "<br> and Send Mail to ADMIN Dept." + aaFAAppName + `[${aaFAAppEmail}]`
                                                                aTrueORFalse = "1"; // approval date = ERODate02
                                                                aTrueORFalseB = true;
                                                                aERStatus = "HOD Approved wait for ADMIN";
                                                                console.log("Next A to Requester");
                                                            } else { // more than 1 Approver 
                                                                xxNextApproverxx = xxChkNamexx[anLno + 1]
                                                                xxNextAppEmailxx = xxChkEmailxx[anLno + 1] // to ERORefNo06 xxChkEmailxx                                            
                                                                aaCnfTitle = "VERIFY ?"
                                                                aaCnfBody = "Press 'YES' to Verify and Send Mail to " + xxNextApproverxx + " [Email " + xxNextAppEmailxx + "] <br> For next verify or approve."
                                                                aTrueORFalse = "0"; // approval date = ERODate02
                                                                aTrueORFalseB = false;
                                                                aERStatus = "Confirmed wait for HOD";
                                                                console.log("Next A", xxNextApproverxx)
                                                            }
                                                        } else if (anLno === 1) { // found in 2
                                                            aApprovalDateFN = "ERODate04"; //EORDate03
                                                            if (xxNofChk === 2) { // 2 Approvers
                                                                aaCnfTitle = "APPROVE ?"
                                                                aaCnfBody = "Press 'YES' to Approve and Send Mail to " + aRequesterName + " Email " + aRequesterEmail + "<br> and Send Mail to ADMIN Dept."
                                                                aTrueORFalse = "1"; // approval date = ERODate03
                                                                aTrueORFalseB = true;
                                                                aERStatus = "HOD Approved wait for ADMIN";
                                                                console.log("Next A to Requester");
                                                            } else { // more than 2 Approver
                                                                xxNextApproverxx = xxChkNamexx[anLno + 1]
                                                                xxNextAppEmailxx = xxChkEmailxx[anLno + 1] // to ERORefNo06 xxChkEmailxx                                            
                                                                aaCnfTitle = "VERIFY ?"
                                                                aaCnfBody = "Press 'YES' to Verify and Send Mail to " + xxNextApproverxx + " [Email " + xxNextAppEmailxx + "] <br> For next verify or approve."
                                                                aTrueORFalse = "0"; // approval date = ERODate03
                                                                aTrueORFalseB = false;
                                                                aERStatus = "Confirmed wait for HOD";
                                                                console.log("Next A", xxNextApproverxx)
                                                            }
                                                        } else if (anLno === 2) {       // found in 3 
                                                            aApprovalDateFN = "PBatchDate"; //ERODate04
                                                            aaCnfTitle = "APPROVE ?"
                                                            aaCnfBody = "Press 'YES' to Approve and Send Mail to " + aRequesterName + " Email " + aRequesterEmail + "<br> and Send Mail to ADMIN Dept."
                                                            aTrueORFalse = "1"; // approval date = ERODate04
                                                            aTrueORFalseB = true;
                                                            aERStatus = "HOD Approved wait for ADMIN";
                                                            console.log("Next A to Requester");
                                                        }
                                                        console.log("TEST", xxChkNamexx, xxChkEmailxx, xxChkRangexx)
                                                    }

                                                    if (aaCnfTitle === "ERROR !!") {
                                                        DevExpress.ui.dialog.alert(aaCnfBody, aaCnfTitle);
                                                    } else {

                                                        let result = DevExpress.ui.dialog.confirm(aaCnfBody, aaCnfTitle); //+ "<br>?? 'YES' 
                                                        result.done(function (dresult) {
                                                            if (dresult) {

                                                                var aGDescENG = e.row.data.ExpGroupDescEng
                                                                if (aApprovalDateFN === "HODApprovedDate") { //ERODate02
                                                                    var aObjKeyData = { REFNO: e.row.data.REFNO, HODApproved: aTrueORFalseB, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, HODApprovedDate: new Date() }; //ReqDate: new Date()
                                                                } if (aApprovalDateFN === "ERODate04") { //ERODate03
                                                                    var aObjKeyData = { REFNO: e.row.data.REFNO, HODApproved: aTrueORFalseB, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, ERODate04: new Date() }; //ReqDate: new Date()
                                                                } if (aApprovalDateFN === "PBatchDate") { //ERODate01
                                                                    var aObjKeyData = { REFNO: e.row.data.REFNO, HODApproved: aTrueORFalseB, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, PBatchDate: new Date() }; //ReqDate: new Date()
                                                                }
                                                                var aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData));
                                                                sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                if (aTrueORFalse === "1") {
                                                                    var aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET HODApproved = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "', " + aApprovalDateFN + " = '" + aNowDateT + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                } else {
                                                                    var aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET HODApproved = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "', " + aApprovalDateFN + " = '" + aNowDateT + "', Vendor02Note = '" + xxNextApproverxx + "', ERORefNo6 = '" + xxNextAppEmailxx + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                }
                                                                console.log(aSQLCommand)
                                                                aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                aSQLAction(aaPFDMI, aSQLCommand)

                                                                e.component.refresh(true);
                                                                e.component.refresh(true);
                                                                e.component.refresh(true);
                                                                e.event.preventDefault();

                                                                //send Email
                                                                var aMessage01;
                                                                var aaMailTitle;
                                                                var aaMessTitle;
                                                                let aApproverName = aaHODAppName //+ ", [HOD]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver

                                                                //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"

                                                                let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Travel Requisition</a>"; //<a href='https://www.w3schools.com'>Visit W3Schools</a>
                                                                if (aTrueORFalse === "1") {
                                                                    aaMailTitle = aGDescENG.toUpperCase() + " - HOD APPROVED";
                                                                    aaMessTitle = aGDescENG.toUpperCase() + " <br> HOD APPROVED";
                                                                    aMessage01 = "<div>TO " + aRequesterName + "<br><br>  Already Approved " + aGDescENG + " Refno " + e.row.data.HeadRefNo + "<br> LINK -->" + aAddress2Do + "<br><br><b>" + aApproverName + "</b></div>"
                                                                } else {
                                                                    aaMailTitle = aGDescENG.toUpperCase() + "  - NEED VERIFY/APPROVE";
                                                                    aaMessTitle = aGDescENG.toUpperCase() + " <br> NEED VERIFY/APPROVE";
                                                                    aMessage01 = "<div>Dear Khun " + xxNextApproverxx + "<br><br>  Please verify or approve " + aGDescENG + " Refno " + e.row.data.HeadRefNo + "<br> LINK -->" + aAddress2Do + "<br><br><b>" + aApproverName + "</b></div>"
                                                                }
                                                                var aSubject = aaMailTitle
                                                                var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #00C510; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMessTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#CEFDD2;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                // To ADMIN 
                                                                var aFASubject = aaMailTitle + " (For ADMIN)"
                                                                var aMessageFA01 = aEmailTRF[0] + aaFAAppName + "</b><br><br>&nbsp;&nbsp;&nbsp;" + aGDescENG + " <br>&nbsp;&nbsp;&nbsp;REFNO = [" + e.row.data.HeadRefNo + "] already approved by HOD <br><br>&nbsp;&nbsp;&nbsp;Verify at " + aAddress2Do + " (menu ADMIN Approve) <br><br><br><b>HOD</b><br></div>"
                                                                var aMessageFA = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #00C510; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaOnInitExpGroupDesc.toUpperCase() + " <br>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EFFFEA;'><div style='margin: 5px 2px 10px 10px;'>" + aMessageFA01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                                                if (aTrueORFalse === "1") {
                                                                    aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)
                                                                    aSendMailDMZ(" " + aaFAAppName, aaFAAppEmail, aApproverEmail, "", "", aFASubject, aMessageFA)
                                                                } else {
                                                                    aSendMailDMZ(" " + xxNextApproverxx, xxNextAppEmailxx, aApproverEmail, "", "", aSubject, aMessage)
                                                                    //aSendMailDMZ(" " + aaFAAppName, aaFAAppEmail, aApproverEmail, "", "", aFASubject, aMessageFA)
                                                                }
                                                                e.component.refresh(true);
                                                                e.component.refresh(true);
                                                                e.component.refresh(true);
                                                                e.event.preventDefault();
                                                                //aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)                                    
                                                                $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                if (aTrueORFalse === "1") {
                                                                    aMessageAlert("Already Approved & Send Mail to " + aRequesterName + " (" + aRequesterEmail + ")", "DarkGreen")
                                                                } else {
                                                                    aMessageAlert("Already Verified and Send Mail to " + xxNextApproverxx + " (" + xxNextAppEmailxx + ")", "DarkGreen")
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            },
                                            {
                                                hint: "View Details & Approve",
                                                icon: "fas fa-search",
                                                visible: function (e) {
                                                    return (e.row.data.ID === 1) //return !e.row.isEditing; && e.row.data.Confirmed === false
                                                },
                                                onClick: function (e) {
                                                    aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate);
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
                                        //groupIndex: 0,
                                        width: 120,
                                        visible: true,
                                    },
                                    {
                                        dataField: "ID",
                                        sortOrder: "asc",
                                        caption: "NO",
                                        //disabled: true,
                                        visible: false,
                                        width: 40
                                    },
                                    {
                                        dataField: "PayToName",
                                        caption: "Name",
                                        width: 150,
                                    },
                                    {
                                        dataField: "Department",
                                        caption: "Dept",
                                        dataType: "string",
                                        editorType: "dxTextBox",
                                        width: 70,
                                        visible: true,
                                    },
                                    {
                                        dataField: "ReqDate",
                                        caption: "Req. Date",
                                        dataType: "date",
                                        format: "dd/MM/yyyy",
                                        width: 100,
                                        visible: true,
                                    },
                                    {
                                        dataField: "EROCheck03",
                                        caption: "BOOKING",
                                        cellTemplate: function (container, options) {
                                            var value = options.value ? "SELF BOOKING" : "ADMIN BOOKING";
                                            $("<div>")
                                                .text(value)
                                                .css("text-align", "left")
                                                .appendTo(container);
                                        },
                                        width: 130,
                                    },
                                    {
                                        dataField: "ERORefNo1", //ERODesc03
                                        caption: "Purpose Of Trip",
                                        dataType: "string",
                                        width: 100,
                                        visible: true,
                                    },
                                    {
                                        dataField: "EROCheck01",
                                        caption: "O/L",
                                        cellTemplate: function (container, options) {
                                            var value = options.value ? "Overseas" : "Local";
                                            $("<div>")
                                                .text(value)
                                                .css("text-align", "left")
                                                .appendTo(container);
                                        },
                                        width: 90,
                                    },
                                    {
                                        dataField: "EROCheck02",
                                        caption: "ROAMING",
                                        cellTemplate: function (container, options) {
                                            var value = options.value ? "YES" : "NO";
                                            $("<div>")
                                                .text(value)
                                                .css("text-align", "left")
                                                .appendTo(container);
                                        },
                                        width: 110,
                                    },
                                    {
                                        dataField: "ERODesc02",
                                        caption: "Destination",
                                        dataType: "string",
                                        width: 120,
                                        visible: true,
                                    },
                                    {
                                        dataField: "ERODate02",
                                        caption: "Travel Start Date",
                                        dataType: "date",
                                        format: "dd/MM/yyyy",
                                        width: 110,
                                        visible: true,
                                    },
                                    {
                                        dataField: "ERODate03",
                                        caption: "Travel End Date",
                                        dataType: "date",
                                        format: "dd/MM/yyyy",
                                        width: 110,
                                        visible: true,
                                    },
                                    {
                                        dataField: "RefundedAmount",
                                        caption: "Estimated Cost",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        width: 120,
                                        visible: true,
                                    },
                                    {
                                        dataField: "ERStatus",
                                        caption: "Status",
                                        dataType: "string",
                                        width: 220,
                                        visible: true,
                                    },
                                    {
                                        dataField: "Vendor01Note",
                                        caption: "Approvers",
                                        cellTemplate: function (container, options) {
                                            // Extract the names from the Vendor01Note field
                                            const names = options.value.match(/NAME:\[(.*?)\]/)[1]
                                                .split('|')
                                                .filter(name => name.trim() !== "");
                                            // Join the names with a comma and display them
                                            container.text(names.join(' '));
                                        },
                                        width: 200,
                                        visible: true,
                                    },


                                ],

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
                                                        position: {
                                                            my: "center top",
                                                            at: "center top",
                                                            of: window,
                                                            offset: "0 120" // Move it up by 200px
                                                        }
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

                                // summary
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
                                            column: "Amount",
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
                                    groupItems: [
                                        {
                                            column: "ExpensesCode",
                                            summaryType: "count",
                                            displayFormat: "{0} Items",
                                        },
                                        {
                                            column: "Amount",
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
                                                            .text("TRAVEL REQUISITION APPROVAL (HOD)"),
                                                        $("<br><center />"),
                                                        $("<i class= 'fas fa-user-circle''><span />")   //; style='color: DarkGreen;
                                                            //.addClass("name")
                                                            .text(" " + $.trim(asFullName)),
                                                    );
                                            }
                                        },
                                        {
                                            location: "after",
                                            widget: "dxButton",
                                            options: {
                                                icon: "fas fa-info",
                                                text: "HELP",
                                                type: "default",
                                                stylingMode: "contained",
                                                onClick: function () {
                                                    // let aHelpMessage = `<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-plus'></i>" + " ADD MORE ROW</div>`
                                                    aPopupHelp("HELP", aVARs.HELP01)
                                                }
                                            }
                                        },
                                        {
                                            location: "before",
                                            template: function () { return $("<div style='padding: 5px 95px;'/>") }
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
                                                //text: "Export to PDF",
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

                            // function aDataGridRF() {
                            //     dataGrid.refresh();
                            // }

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

                            /*
                                                function dropDownBoxEditorTemplate(cellElement, cellInfo) { //dropDownBoxCURR
                                                    //   console.log("cellInfo")
                                                    //   console.log(cellInfo.value)
                                                    return $("<div>").dxDropDownBox({
                                                        dropDownOptions: { width: 600 },
                                                        dataSource: aaExpExp,
                                                        value: cellInfo.value,
                                                        valueExpr: "ACCCODE",
                                                        displayExpr: "ACCCODE",
                                                        contentTemplate: function (e) {
                                                            return $("<div>").dxDataGrid({
                                                                dataSource: aaExpExp,
                                                                //remoteOperations: true,
                                                                columns: [{ dataField: "TDESC", caption: "Description", width: 400 }, { dataField: "ACCCODE", caption: "Exp. Code", width: 100 }], //ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE
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
                            */
                            // Not Use
                            // function aPopUpForm(iData, aWithOTP) {
                            //     if (aWithOTP === undefined) {
                            //         var aWOTP = 0;
                            //     } else {
                            //         var aWOTP = 1;
                            //     }
                            //     //alert(iData.HeadRefNo )
                            //     var apwds = "";
                            //     var ausrs = "";
                            //     var aOTP = "";
                            //     var aaPFDMI = isLocalHost();
                            //     //var aOTPm = generateOTP();
                            //     var aii = 0;
                            //     var astr = localStorage["aDXTheme"]
                            //     if (astr.includes("dark")) {
                            //         var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmwhite.png' width='88'></center></div>"
                            //     } else {
                            //         var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"
                            //     }
                            //     // define the $ as jQuery for multiple uses
                            //     jQuery(function ($) {
                            //         // ...
                            //         var gbxRateV = 1;
                            //         const popup = $("#popupContainer").dxPopup({
                            //             title: "Travel Requisition",
                            //             width: '1300px',
                            //             position: { offset: "0 -140" }, //{offset: "0 -180"},
                            //             //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                            //             visible: true,
                            //             fullScreen: true,
                            //             showCloseButton: false,
                            //             showTitle: true,
                            //             dragEnabled: true,
                            //             closeOnOutsideClick: false,
                            //             resizeEnabled: true,            
                            //             contentTemplate: function () {
                            //                 return $("<div />").append(
                            //                     $("<p><div id='form'></div></p>"),
                            //                     $("<p><span id='asave'></span></p>"),                             
                            //                 );
                            //             },
                            //             toolbarItems: [
                            //                 {
                            //                     toolbar: "top",
                            //                     locateInMenu: 'always',
                            //                     html: "<div padding-top: -7px;><img src='./images/locktonlogo70mmblack.png' width='85'></div>"
                            //                 },
                            //                 {
                            //                     toolbar: "top",
                            //                     locateInMenu: 'always',
                            //                     widget: "dxButton",
                            //                     //toolbar: "bottom",
                            //                     location: "right",
                            //                     options: {
                            //                         icon: "print",
                            //                         //text: "Print",
                            //                         onClick: function () {
                            //                             window.print()
                            //                         }
                            //                     }
                            //                 }, {
                            //                     toolbar: "top",
                            //                     locateInMenu: 'always',
                            //                     widget: "dxButton",
                            //                     //toolbar: "bottom",
                            //                     location: "after",
                            //                     options: {
                            //                         //text: "EXIT",
                            //                         icon: "fas fa-times",
                            //                         //type: "danger",                
                            //                         onClick: function (e) {
                            //                             popup.hide();
                            //                         }
                            //                     }
                            //                 }]

                            //         }).dxPopup("instance");

                            //         $("#visibleform").dxCheckBox({
                            //             text: "Visible Form",
                            //             value: true,
                            //             onValueChanged: function (data) {
                            //                 //visible:true,
                            //                 form.option("visible", data.value);
                            //             }
                            //         });

                            //         $("#popupexit").dxButton({
                            //             icon: "fas fa-times",
                            //             type: "danger",
                            //             //text: "EXIT",
                            //             //width: "120px",
                            //             visible: true,
                            //             onClick: function () {
                            //                 popup.hide();
                            //             }
                            //         });

                            //         $("#print").dxButton({
                            //             icon: "print",
                            //             //text: "Print",
                            //             onClick: function () {
                            //                 window.print();
                            //             }
                            //         });

                            //         $("#asave").dxButton({
                            //             icon: "save",
                            //             text: "SAVE",
                            //             type: "success",
                            //             onClick: function (e) {
                            //                 //window.print();
                            //                 //let aUpdateText = "Update"
                            //                 //var ObjKeyData = {"REFNO": $.trim(key)};   //[aaKeyField] key.trim
                            //                 //var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                            //                 //sendRequestNew(aUpdateText,ObjRowData,aaTBKey,aaPFDMI,atob(aaXToX));            
                            //                 //alert (iData.REFNO)
                            //                 //alert (iData.LocalAmount)
                            //                 //alert (jQuery.type(iData.LocalAmount))
                            //                 let ObjRowD = JSON.stringify(iData)
                            //                 sendRequestNew("Update", ObjRowD, aaTBKey, aaPFDMI, atob(aaXToX));
                            //                 //e.component.refresh(true);
                            //                 //e.component.refresh(true);
                            //                 //e.component.refresh(true);
                            //                 //e.event.preventDefault();
                            //                 popup.hide();

                            //             }
                            //         });


                            //         const aform = $("#form").dxForm({
                            //             formData: iData,
                            //             showColonAfterLabel: false,
                            //             labelLocation: "top",
                            //             colCount: 1,
                            //             items: [{
                            //                 itemType: "group",
                            //                 //caption: "Refference",
                            //                 colCount: 4,
                            //                 items: [{
                            //                     dataField: "HeadRefNo",
                            //                     label: { text: "REF NO" },
                            //                     disabled: true,
                            //                     editorOptions: { width: 150 },
                            //                 },
                            //                 {
                            //                     dataField: "ReqDate",
                            //                     label: { text: "Date" },
                            //                     disabled: true,
                            //                     editorType: "dxDateBox",
                            //                     editorOptions: { displayFormat: "dd/MM/yyyy", width: 150 },	  //showClearButton: true,                  
                            //                 },
                            //                 {
                            //                     dataField: "PayToName",
                            //                     label: { text: "Pay To" },
                            //                     disabled: true,
                            //                     editorOptions: { width: 250 },
                            //                 },
                            //                 //{
                            //                 //    itemType: "empty"
                            //                 //},                           
                            //                 {
                            //                     dataField: "ExpensesDescription",
                            //                     label: { text: "Expenses" },
                            //                     disabled: true,
                            //                     editorOptions: { width: 250 },
                            //                 },


                            //                 ]

                            //             },
                            //             {
                            //                 itemType: "group",
                            //                 //caption: "Amount",
                            //                 colCount: 4,
                            //                 items: [{
                            //                     dataField: "Currency",
                            //                     //label: {text: "Currency"},
                            //                     value: "THB",
                            //                     width: 80,
                            //                     validationRules: [{ type: "required" }],
                            //                     /*lookup: {
                            //                                 dataSource: aaCurrency, //Code,Name
                            //                                 valueExpr: "Code",
                            //                                 displayExpr: "Code",
                            //                             },                            
                            //                     editCellTemplate: dropDownBoxCURR,*/

                            //                     editorType: "dxDropDownBox",
                            //                     editorOptions: {
                            //                         dataSource: aaCurrency, //Code,Name
                            //                         valueExpr: "Code",
                            //                         displayExpr: "Code",
                            //                         width: 380,
                            //                         contentTemplate: function (e) {
                            //                             return $("<div>").dxDataGrid({
                            //                                 dataSource: aaCurrency,
                            //                                 //remoteOperations: true,
                            //                                 columns: [{ dataField: "Code", caption: "Code", width: 80 }, { dataField: "Name", caption: "Currency", width: 150 }, { dataField: "xRate", caption: "X-Rate", width: 80, format: "#,##0.000000" }], //ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE
                            //                                 hoverStateEnabled: true,
                            //                                 paging: { enabled: true, pageSize: 15 },
                            //                                 searchPanel: { visible: true },
                            //                                 headerFilter: { visible: true },
                            //                                 filterRow: { visible: true },
                            //                                 showBorders: true,
                            //                                 scrolling: { mode: "virtual" },
                            //                                 selection: { mode: "single" },
                            //                                 height: 250,
                            //                                 //selectedRowKeys: [cellInfo.value],                                      
                            //                                 //focusedRowKey: cellInfo.value,
                            //                                 onSelectionChanged: function (sArgs) {
                            //                                     //alert(gbxRateV)
                            //                                     console.log(sArgs.selectedRowKeys[0].xRate)
                            //                                     gbxRateV = sArgs.selectedRowKeys[0].xRate
                            //                                     //alert(gbxRateV)
                            //                                     e.component.option("value", sArgs.selectedRowKeys[0].Code);
                            //                                     //cellInfo.setValue(sArgs.selectedRowKeys[0].Code);
                            //                                     //console.log("v")
                            //                                     //console.log(cellInfo.value)
                            //                                     if (sArgs.selectedRowKeys.length > 0) {
                            //                                         e.component.close();
                            //                                     }

                            //                                 }
                            //                             });
                            //                         },
                            //                     },

                            //                     onFieldDataChanged: function (e) {
                            //                         var updatedField = e.dataField;
                            //                         var newValue = e.value;
                            //                         alert(updatedField)
                            //                         alert(newValue)
                            //                         // Event handling commands go here
                            //                     },
                            //                     setCellValue: function (newData, value, currentRowData) {

                            //                         if (arDataU === 1) {
                            //                             newData.Currency = value;
                            //                             let aResult = aSearchXjson(aaCurrency, value);
                            //                             newData.Xrate = aResult[0].xRate;
                            //                             //newData.LocalAmount = currentRowData.Amount * (1/aResult[0].xRate);
                            //                         }
                            //                     },

                            //                 },
                            //                 //{
                            //                 //itemType: "empty"
                            //                 //},                             
                            //                 {
                            //                     dataField: "Xrate",
                            //                     label: { text: "X-Rate" },
                            //                     dataType: "number",
                            //                     //format:{ type:"fixedPoint", precision: 6 },
                            //                     editorType: "dxNumberBox",
                            //                     editorOptions: {
                            //                         value: gbxRateV,
                            //                         format: "#,##0.000000",
                            //                         width: 150,
                            //                     },
                            //                     onValueChanged: function (data) {
                            //                         console.log(data.value);
                            //                     }
                            //                     //value: gbxRateV,
                            //                     //visible: false,
                            //                 },
                            //                 {
                            //                     itemType: "tabbed",
                            //                     width: 350,
                            //                     tabPanelOptions: {
                            //                         deferRendering: false
                            //                     },
                            //                     tabs: [{
                            //                         title: "HOD Approval",
                            //                         items: ["Confirmed"]
                            //                     },
                            //                     {
                            //                         title: "HR Approval",
                            //                         items: [
                            //                             {
                            //                                 dataField: "HRApproved",
                            //                                 label: { text: "HR Approved" },
                            //                                 allowEditing: false,
                            //                             },
                            //                         ]
                            //                     },
                            //                     {
                            //                         title: "FA Approval",
                            //                         items: [
                            //                             {
                            //                                 dataField: "Approved",
                            //                                 label: { text: "FA Approved" },
                            //                             },
                            //                             {
                            //                                 dataField: "PBatchNo",
                            //                                 label: { text: "Pay Batch NO" },
                            //                                 editorOptions: { width: 150 },
                            //                             },
                            //                             {
                            //                                 dataField: "PBatchDate",
                            //                                 label: { text: "Data" },
                            //                                 disabled: true,
                            //                                 editorType: "dxDateBox",
                            //                                 editorOptions: { displayFormat: "dd/MM/yyyy", width: 150 },
                            //                             }
                            //                         ]
                            //                     }
                            //                     ]
                            //                 }

                            //                 ]
                            //             },
                            //             {
                            //                 itemType: "group",
                            //                 caption: "Details",
                            //                 colCount: 7,
                            //                 items: [
                            //                     {
                            //                         dataField: "ID",
                            //                         sortOrder: "asc",
                            //                         label: { text: "NO" },
                            //                         editorOptions: { format: "###0", rtlEnabled: true, width: 40 },
                            //                     },
                            //                     {
                            //                         dataField: "ERORefNo1",
                            //                         label: { text: "Fleet Card NO" },
                            //                         //disabled: true,
                            //                         editorOptions: { width: 150 },
                            //                     },
                            //                     {
                            //                         dataField: "ERORefNo2",
                            //                         label: { text: "Plate No" },
                            //                         editorOptions: { width: 150 },
                            //                     },
                            //                     {
                            //                         dataField: "ERODate01",
                            //                         label: { text: "Date" },
                            //                         editorType: "dxDateBox",
                            //                         editorOptions: { displayFormat: "dd/MM/yyyy", width: 150 },
                            //                     },
                            //                     {
                            //                         dataField: "LocalAmount",
                            //                         label: { text: "Amount" },
                            //                         editorType: "dxNumberBox",
                            //                         //format:{ type:"fixedPoint", precision: 2 },
                            //                         //format: "#,##0.00",
                            //                         editorOptions: { format: "#,##0.00", rtlEnabled: true, width: 150 },
                            //                     },
                            //                     {
                            //                         dataField: "EROCheck01",
                            //                         label: { text: "Pay Slip" },
                            //                     },
                            //                     {
                            //                         dataField: "EROCheck02",
                            //                         label: { text: "Tax Invoice" },
                            //                     },
                            //                 ]

                            //             },
                            //             {
                            //                 itemType: "group",
                            //                 //caption: "Details",
                            //                 colCount: 2,
                            //                 items: [
                            //                     {
                            //                         dataField: "ERODesc01",
                            //                         label: { text: "Note" },
                            //                         editorType: "dxTextArea",
                            //                         editorOptions: { width: 800, height: 100 },

                            //                     },

                            //                 ]
                            //             }

                            //             ]

                            //         }).dxForm("instance");

                            //         $("#aformSave").on("submit", function (e) {
                            //             console.log("Done")
                            //             alert(e)
                            //             setTimeout(function () {
                            //                 alert("Submitted");
                            //                 alert(e)
                            //             }, 1000);

                            //             e.preventDefault();
                            //         });


                            //     });
                            // }

                            // Send Mail To Requester

                            function aPopUpSENDMail2REQ(iData) { // popup Send Mail
                                var aaPFDMI = isLocalHost();
                                //var astr = localStorage["aDXTheme"]
                                var aanewNoteValue = "ccccc"

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
                                                $("<p><div id='sAdd-form'></div></p>"),//aSendMail
                                                $("<div id='aSendMail'></div>"),
                                                $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                $("<span id='sAdd-popupexit'></span>"),
                                            );
                                        },
                                        //onContentReady: function () {
                                        // $("#Add-dxDataGrid").hide(); // hide dataGrid
                                        //},
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

                                    // $("#visibleform").dxCheckBox({
                                    //     text: "Visible Form",
                                    //     value: true,
                                    //     onValueChanged: function (data) {
                                    //         form.option("visible", data.value);
                                    //     }
                                    // });

                                    // Exit 

                                    $("#sAdd-popupexit").dxButton({
                                        icon: "fas fa-times",
                                        type: "danger",
                                        text: "EXIT",
                                        //width: "120px",
                                        visible: true,
                                        onClick: function () {
                                            popup.hide();
                                        }
                                    });

                                    // $("#print").dxButton({
                                    //     icon: "print",
                                    //     //text: "Print",
                                    //     onClick: function () {
                                    //         window.print();
                                    //     }
                                    // });

                                    // $("#asave").dxButton({
                                    //     icon: "fas fa-thumbs-up",
                                    //     text: "CONFIRM",
                                    //     hint: "Confirm and Save",
                                    //     stylingMode: "outlined",
                                    //     type: "default",
                                    //     onClick: function (e) {

                                    //         var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment, Division: asDivision, ERODesc06: asStaffEmail, ReqDate: new Date(), ExpensesCode: aaOnInitAccCode, ExpensesDescription: aaOnInitAccDesc, Currency: "THB", Xrate: 1, ExpGroupCode: aaOnInitExpGroupCode, ExpGroupDescEng: aaOnInitExpGroupDesc, ERStatus: "Register", EROCheck03: 1, EROCheck04: 1, NeedPayment: 0, RefundedAmount: 0, LimitedAmount: aaLMontyly, EROCode01: "OPD" }
                                    //         //{ EntryBy: aaUsrN, EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };
                                    //         //var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                    //         var ObjRowData = JSON.stringify(ObjKeyData);
                                    //         console.log(ObjRowData)
                                    //         sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                    //         /*
                                    //             let aaID = 1
                                    //             let axRunRun = aGetDateRef(aaOnInitExpGroupDesc.substring(0, 1));
                                    //             let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                    //             e.data.ID = aaID //
                                    //             e.data.HeadRefNo = axRunRun //
                                    //             e.data.REFNO = axLineNo //
                                    //             e.data.PayToCode = asStaffID //
                                    //             e.data.PayToName = asFullName //
                                    //             e.data.Department = asDepartment //
                                    //             e.data.Division = asDivision //
                                    //             e.data.ERODesc06 = asStaffEmail //
                                    //             e.data.ReqDate = new Date() //
                                    //             e.data.ExpensesCode = aaOnInitAccCode //
                                    //             e.data.ExpensesDescription = aaOnInitAccDesc //
                                    //             e.data.Currency = "THB" // not for overseas
                                    //             e.data.Xrate = 1        // not for overseas
                                    //             e.data.ExpGroupCode = aaOnInitExpGroupCode
                                    //             e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                    //             e.data.ERStatus = "Register"
                                    //             //e.data.ERORefNo1 = aaPlateNo
                                    //             //e.data.ERORefNo2 = aaFCardNo
                                    //             //e.data.ERORefNo3 = "Fleet Card"
                                    //             e.data.EROCheck03 = true // have a bill
                                    //             e.data.EROCheck04 = true // doctor recommend
                                    //             e.data.NeedPayment = true
                                    //             e.data.RefundedAmount = 0
                                    //             e.data.LimitedAmount = aaLTotal //Medical Only
                                    //             e.data.EROCode01 = "OPD"
                                    //         */

                                    //         $("#Add-dxDataGrid").show();
                                    //         $("#asave").hide();
                                    //         $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                    //     }
                                    // });

                                    $("#aSendMail").dxButton({
                                        icon: "fas fa-paper-plane",
                                        type: "success",
                                        text: "SEND",
                                        //width: "120px",
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

                                    const aform = $("#sAdd-form").dxForm({
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
                                                label: { text: "Pay To" },
                                                editorType: "dxTextBox",
                                                editorOptions: { readOnly: true, width: 180 },
                                            },

                                            {
                                                dataField: "ExpensesDescription",
                                                label: { text: "Expenses" },
                                                editorOptions: { readOnly: true, width: 180 }, //value: aaOnInitAccDesc,
                                            },
                                            {
                                                dataField: "LimitedAmount",
                                                label: { text: "Limit" },
                                                visible: false,
                                            },

                                            ]

                                        },
                                        {
                                            itemType: "group",
                                            colCount: 4,
                                            items: [{
                                                dataField: "Currency",
                                                label: { text: "Currency" },
                                                value: "THB",
                                                editorOptions: { readOnly: true, value: 'THB', width: 100 },
                                                visible: false,
                                            },
                                            {
                                                dataField: "Xrate",
                                                label: { text: "X-Rate" },
                                                editorType: "dxNumberBox",
                                                editorOptions: { readOnly: true, value: 1, format: "#,##0.000000", width: 100 },
                                                visible: false,
                                            },


                                            ]
                                        },
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
                                                    label: { text: "Comment" },
                                                    validationRules: [{ type: 'required', message: 'Comment is required' }],
                                                    editorType: "dxTextArea",
                                                    editorOptions: { width: 500, height: 150 },
                                                },
                                                {
                                                    itemType: "empty"
                                                },

                                            ]
                                        },
                                        ]
                                    }).dxForm("instance");
                                    /* 
                                                                        $("#Add-dxDataGrid").dxDataGrid({
                                    
                                                                            dataSource: new DevExpress.data.CustomStore({
                                                                                key: "REFNO",
                                                                                loadMode: "omit",
                                                                                load: function () {
                                                                                    return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all', { "@": aaSchRefx }) // Change aaTBKey to TokenKey for this table 5102300001
                                                                                        .fail(function () { throw "Data loading error" });
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
                                                                                enabled: false //false // true
                                                                            },
                                                                            showBorders: true,
                                                                            sorting: {
                                                                                mode: "multiple"
                                                                            },
                                                                            selection: {
                                                                                mode: 'single' // single //multiple
                                                                            },
                                                                            groupPanel: {
                                                                                visible: false // false can't select other group
                                                                            },
                                                                            filterRow: {
                                                                                visible: false, // false true
                                                                                applyFilter: "auto"
                                                                            },
                                                                            headerFilter: {
                                                                                visible: false //true  // false true
                                                                            },
                                                                            grouping: {
                                                                                autoExpandAll: true //false //true,
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
                                                                            rowAlternationEnabled: false, // 2 Tones Line Color
                                                                            onInitNewRow: function (e) {
                                                                                //e.component.__addingStart = true; 
                                                                                //gridContainer.option("editing.popup.title", "Adding Travel Requisition");
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
                                                                                e.data.ReqDate = new Date()
                                                                                e.data.ExpensesCode = aaOnInitAccCode
                                                                                e.data.ExpensesDescription = aaOnInitAccDesc
                                                                                e.data.Currency = "THB" // not for overseas
                                                                                e.data.Xrate = 1        // not for overseas
                                                                                e.data.ExpGroupCode = aaOnInitExpGroupCode
                                                                                e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                                                                e.data.ERStatus = "Register"
                                                                                //e.data.ERORefNo1 = aaPlateNo
                                                                                //e.data.ERORefNo2 = aaFCardNo
                                                                                //e.data.ERORefNo3 = "Fleet Card"
                                                                                e.data.EROCheck03 = true // have a bill
                                                                                e.data.EROCheck04 = true // doctor recommend
                                                                                e.data.NeedPayment = true
                                                                                e.data.RefundedAmount = 0
                                                                                e.data.LimitedAmount = aaLTotal //Medical Only
                                                                                e.data.EROCode01 = "OPD"
                                                                                e.data.ERODate01 = new Date()
                                                                            },
                                                                            onEditorPreparing: function (e) {
                                                                                if (e.parentType === "dataRow" && arDataU === 0) {
                                                                                    e.editorOptions.disabled = true;
                                                                                } else {     //PSPvNO,PSPvDate
                                                                                    if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ERStatus" || e.dataField === "PSPvNO" || e.dataField === "PSPvDate" || e.dataField === "LocalAmount" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department" || e.dataField === "EROCode01" || e.dataField === "RefundedAmount")) {
                                                                                        e.editorOptions.disabled = true;
                                                                                    }
                                                                                }
                                                                            },
                                                                            // Editing
                                                                            editing: {
                                                                                mode: "row", // popup , row, cell (click to edit)
                                                                                useIcons: true,
                                                                                allowUpdating: true,
                                                                                allowDeleting: arDataD,
                                                                                allowAdding: false, //arDataC,
                                    
                                                                                popup: {
                                                                                    title: "Travel Requisition Info",
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
                                                                                    caption: "Editor",
                                                                                    width: 80,
                                                                                    buttons: ["edit", "delete"],
                                                                                    visible: { visible: function (e) { return (e.row.data.Confirmed === false) } }
                                                                                },
                                                                                {
                                                                                    type: "buttons",
                                                                                    //caption: "+",
                                                                                    width: 40,
                                                                                    buttons: [// Clone first record ID++
                                                                                        {
                                                                                            hint: "Add More Line",
                                                                                            icon: "add",
                                                                                            visible: function (e) {
                                                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === false) //return !e.row.isEditing;
                                                                                            },
                                                                                            onClick: function (e) {
                                                                                                //REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,RemitTo1,RemitTo2,RemitTo1Amount,RemitTo2Amount,RemitTo1Diff,RemitTo2Diff,RemitTo1Note,RemitTo2Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6
                                                                                                let aBlankDate = "1900-01-01T00:00:00" //new Date('1900-01-01T00:00') //console.log(aBlankDate) //"Confirmed wait for HR"
                                                                                                let axRunRun = e.row.data.HeadRefNo
                                                                                                aGetD2V(aaPFDMI, "ExtraOnLine.dbo.ERnextIDview Where HeadRefNo LIKE '" + axRunRun + "%'", "NextID", "aaOBJnn") //[WIKRAN-W10]. searh from view
                                                                                                let aNextNOa = JSON.parse(localStorage.getItem("aaOBJnn"));
                                                                                                let aaID = aNextNOa[0].NextID //next no
                                                                                                let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                                                                //let aObjKeyData = { ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, EROAmount: 0, PBatchDate: aBlankDate,PSPvDate: aBlankDate,ERODate01: aBlankDate,ERODate02: aBlankDate,ERODate03: aBlankDate,ERODate04: aBlankDate,ERODate05: aBlankDate,ERODate06: aBlankDate} //{EntryBy: aaUsrN , EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };
                                                                                                let aObjKeyData = { REFNO: axLineNo, ID: aaID, LocalAmount: 0, Amount: 0 }
                                                                                                let aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //values //var clonedItem = $.extend({}, e.row.data, { REFNO: axRunRun }); //++maxID
                                    
                                                                                                sendRequestNew("Insert", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX)); //employees.splice(e.row.rowIndex, 0, clonedItem);
                                    
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.event.preventDefault();
                                                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                            }
                                                                                        },
                                                                                    ]
                                    
                                                                                },
                                                                                {
                                                                                    dataField: "HeadRefNo",
                                                                                    caption: "REF NO",
                                                                                    sortOrder: "desc",
                                                                                    groupIndex: 0,
                                                                                    width: 180,
                                                                                },
                                                                                {
                                                                                    dataField: "ID",
                                                                                    sortOrder: "asc",
                                                                                    caption: "NO",
                                                                                    editorOptions: { width: 40 },
                                                                                    width: 40
                                                                                },
                                                                                {
                                                                                    dataField: "ReqDate",
                                                                                    caption: "Submitted Date",
                                                                                    dataType: "date",
                                                                                    format: "dd/MM/yyyy",
                                                                                    editorOptions: { width: 100 },
                                                                                    validationRules: [{ type: "required" }],
                                                                                    width: 100,
                                                                                },
                                                                                {
                                                                                    dataField: "PayToCode",
                                                                                    caption: "Code",
                                                                                    editorOptions: { width: 150 },
                                                                                    width: 150,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "PayToName",
                                                                                    caption: "Name",
                                                                                    editorOptions: { width: 300 },
                                                                                    width: 250,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "Department",
                                                                                    caption: "Department",
                                                                                    editorOptions: { width: 150 },
                                                                                    width: 100,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "Division",
                                                                                    caption: "Division",
                                                                                    editorOptions: { width: 150 },
                                                                                    width: 150,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ExpensesCode",
                                                                                    caption: "Expenses Code",
                                                                                    editorType: "dxTextArea",
                                                                                    editorOptions: { width: 200 },
                                                                                    width: 120,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ExpensesDescription",
                                                                                    caption: "Expenses",
                                                                                    editorType: "dxTextArea",
                                                                                    editorOptions: { width: 300 },
                                                                                    width: 250,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERORefNo1",
                                                                                    caption: "Plate NO",
                                                                                    width: 150,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERORefNo2",
                                                                                    caption: "Fleet Card NO",
                                                                                    width: 150,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERODesc03",
                                                                                    caption: "Hospital/Clinic Name",
                                                                                    validationRules: [{ type: "required" }],
                                                                                    //editCellTemplate: dropDownHospital,
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 120 }, //, height: 80
                                                                                    width: 120,
                                                                                    //visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERORefNo4",
                                                                                    caption: "Bill No",
                                                                                    width: 110,
                                                                                    editorOptions: { width: 110 },
                                                                                    validationRules: [{ type: "required" }],
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERODate01",
                                                                                    caption: "Bill Date",
                                                                                    dataType: "date",
                                                                                    format: "dd/MM/yyyy",
                                                                                    width: 120,
                                                                                    editorOptions: { width: 120 },
                                                                                    validationRules: [{ type: "required" }],
                                                                                },
                                                                                {
                                                                                    dataField: "EROCode01",
                                                                                    caption: "IPD/OPD",
                                                                                    editorOptions: { width: 100 },
                                                                                    width: 100,
                                                                                    validationRules: [{ type: "required" }],
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "EROCode02",
                                                                                    caption: "Emp. Type",
                                                                                    editorOptions: { width: 110 },
                                                                                    width: 110,
                                                                                    //visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERODesc01",
                                                                                    caption: "Patient Name",
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 150 }, //, height: 80
                                                                                    width: 150,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERODesc06",
                                                                                    caption: "User Email",
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 150 }, //, height: 80
                                                                                    width: 150,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "Currency",
                                                                                    caption: "Currency",
                                                                                    editorOptions: { width: 100 },
                                                                                    width: 100,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "Xrate",
                                                                                    caption: "X-Rate",
                                                                                    dataType: "number",
                                                                                    //format:{ type:"fixedPoint", precision: 6 },
                                                                                    editorType: "dxNumberBox",
                                                                                    editorOptions: { format: "#,##0.000000", width: 100 },
                                                                                    format: "#,##0.000000",
                                                                                    width: 100,
                                                                                    //value: 1,
                                                                                    visible: false,
                                                                                },
                                    
                                                                                {
                                                                                    dataField: "Amount",
                                                                                    caption: "Actual Amount",
                                                                                    dataType: "number",
                                                                                    format: { type: "fixedPoint", precision: 2 },
                                                                                    setCellValue: function (newData, value, currentRowData) {
                                                                                        let aaLocalAmt = value * (1 / currentRowData.Xrate);
                                                                                        newData.Amount = value;
                                                                                        newData.LocalAmount = aaLocalAmt //value * (1/currentRowData.Xrate); 
                                                                                        newData.ERORefNo3 = ""
                                    
                                                                                    },
                                                                                    editorType: "dxNumberBox",
                                                                                    editorOptions: { format: "#,##0.00", width: 130 },
                                                                                    width: 130,
                                                                                    //visible: true,	
                                                                                },
                                                                                {
                                                                                    dataField: "LocalAmount",
                                                                                    caption: "Local Amount",
                                                                                    dataType: "number",
                                                                                    format: { type: "fixedPoint", precision: 2 },
                                                                                    editorOptions: { format: "#,##0.00", width: 120 },
                                                                                    width: 120,
                                                                                    visible: false,
                                                                                },
                                    
                                                                                {
                                                                                    dataField: "ERORefNo3",
                                                                                    caption: "Exp. Type",
                                                                                    validationRules: [{ type: "required" }],
                                                                                    editorOptions: { width: 120 },
                                                                                    width: 120,
                                                                                    //editorOptions: {width: 150},
                                                                                },
                                                                                {
                                                                                    dataField: "ERODesc02",
                                                                                    caption: "Disease", //dropDownDisease
                                                                                    validationRules: [{ type: "required" }],
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 250 }, //, height: 80
                                                                                    width: 150,
                                                                                    //visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "Note",
                                                                                    caption: "Note",
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 100 }, //, height: 80
                                                                                    width: 100,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "NeedPayment",
                                                                                    caption: "Refunded",
                                                                                    //alignment: "center",
                                                                                    width: 110,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "RefundedAmount",
                                                                                    caption: "Reimbursement",
                                                                                    dataType: "number",
                                                                                    format: { type: "fixedPoint", precision: 2 },
                                                                                    editorOptions: { format: "#,##0.00", width: 120 },
                                                                                    width: 120,
                                                                                    //visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "LimitedAmount",
                                                                                    caption: "Limited",
                                                                                    dataType: "number",
                                                                                    format: { type: "fixedPoint", precision: 2 },
                                                                                    editorOptions: { format: "#,##0.00", width: 120 },
                                                                                    width: 120,
                                                                                    visible: false,
                                                                                },
                                    
                                                                                //PBatchNo,PBatchDate,PSPvNO,PSPvDate
                                                                                {
                                                                                    dataField: "PSPvNO",
                                                                                    caption: "PS PVNO",
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 120 },
                                                                                    width: 120,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "PSPvDate",
                                                                                    caption: "PS PV Date",
                                                                                    dataType: "date",
                                                                                    format: "dd/MM/yyyy",
                                                                                    width: 120,
                                                                                    editorOptions: { width: 120 },
                                                                                    visible: false,
                                                                                    //validationRules: [{ type: "required" }],
                                                                                },
                                                                                {
                                                                                    dataField: "Confirmed",
                                                                                    caption: "CF",
                                                                                    //filterOperations: ["contains", "="],
                                                                                    //selectedFilterOperation: "contains",
                                                                                    //filterValue: false,   
                                                                                    width: 60,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "HODApproved",
                                                                                    caption: "HD",
                                                                                    width: 60,
                                                                                    //filterValue: false, 
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "HRApproved",
                                                                                    caption: "HR",
                                                                                    filterValue: false,
                                                                                    width: 60,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "Approved",
                                                                                    caption: "FA",
                                                                                    filterValue: false,
                                                                                    width: 60,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERStatus",
                                                                                    caption: "Status",
                                                                                    width: 180,
                                                                                    //editorType:"dxTextArea",
                                                                                    //editorOptions: {width: 400, height: 80},
                                                                                    //visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "EntryBy",
                                                                                    caption: "Entry By",
                                                                                    //alue: [aaUsrN],
                                                                                    editorOptions: { width: 150 },
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "EntryDate",
                                                                                    caption: "Entry Date",
                                                                                    //value: [aNowDatev],
                                                                                    dataType: "date",
                                                                                    format: "dd/MM/yyyy",
                                                                                    editorOptions: { width: 150 },
                                                                                    visible: false,
                                                                                },
                                    
                                                                                {
                                                                                    type: "buttons",
                                                                                    width: 60,
                                                                                    visible: false,
                                                                                    buttons: [
                                                                                        {
                                                                                            hint: "UN-Confirm",
                                                                                            icon: "fas fa-times-circle",
                                                                                            visible: function (e) {
                                                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === true) //return !e.row.isEditing;
                                                                                            },
                                                                                            onClick: function (e) {
                                                                                                // mark Confirmed field
                                                                                                let aERStatus = "Register" ///"Confirmed wait for HR"
                                                                                                let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                                                let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                                                var aObjKeyData = { REFNO: e.row.data.REFNO, Confirmed: aTrueORFalseB, ERStatus: aERStatus };   //[aaKeyField] key.trim
                                                                                                var aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //value
                                                                                                sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                    
                                                                                                //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704'
                                                                                                let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                    
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.event.preventDefault();
                                    
                                                                                                //send Email
                                                                                                console.log(aaHRAppEmail)
                                                                                                console.log(aaHRAppName)
                                                                                                console.log(asFullName)
                                                                                                console.log(asStaffEmail)
                                                                                                let aApproverName = aaHRAppName + " [HR]"         //aaHRAppName //"Wikran" + " [HR]"         // HR Approver Name
                                                                                                let aApproverEmail = $.trim(aaHRAppEmail) // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                                                let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                                                let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                                                                let aSubject = aaOnInitExpGroupDesc + " (UN-Confirmed)"
                                                                                                let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>"; //<a href='https://www.w3schools.com'>Visit W3Schools</a>
                                                                                                let aMessage = "<div>????? ???" + $.trim(aApproverName) + "<br>Please noted that Medical Expenses for REFNO = [" + e.row.data.HeadRefNo + "]<br> at (" + aAddress2Do + "). has un-confirmed <br><br>Regards,<br>" + aRequesterName + "</div>"
                                                                                                //let aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>Please Approve at &nbsp;'+ aAddress2Do +'</center></strong></span></h2></td></tr></tbody></table>'                          
                                                                                                //aSendMailDMZ("Khun " + aApproverName , aApproverEmail ,"XOL-Requester",aRequesterEmail,"","Please approve a Medical Travel Requisition" , "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aApproverName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");
                                    
                                                                                                //aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)
                                    
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.event.preventDefault();
                                                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                                aMessageAlert("Already UN-Confirmed", "Red")
                                    
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            hint: "Confirm",
                                                                                            icon: "fas fa-check-circle",
                                                                                            visible: function (e) {
                                                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === false) //return !e.row.isEditing;
                                                                                            },
                                                                                            onClick: function (e) {
                                                                                                // mark Confirmed field
                                                                                                let aERStatus = "Confirmed wait for ADMIN" //"Register"
                                                                                                let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                                                let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                                                var aObjKeyData = { REFNO: e.row.data.REFNO, Confirmed: aTrueORFalseB, ERStatus: aERStatus };
                                                                                                var aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData));
                                                                                                sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                    
                                                                                                //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704'
                                                                                                let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                                                aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                    
                                    
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.event.preventDefault();
                                    
                                                                                                //send Email
                                                                                                console.log(aaHRAppEmail)
                                                                                                console.log(aaHRAppName)
                                                                                                console.log(asFullName)
                                                                                                console.log(asStaffEmail)
                                                                                                let aApproverName = aaHRAppName + " [HR]"     //aaHRAppName //"Wikran" + " [HR]"         // HR Approver Name
                                                                                                let aApproverEmail = $.trim(aaHRAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                                                let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                                                let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                                                                let aSubject = aaOnInitExpGroupDesc + " Reimbursement Requested"
                                                                                                let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Travel Requisition </a>";
                                                                                                let aMessage = "<div>ถึ�� ��ุณ" + $.trim(aApproverName) + ",<br>Please verify and approve " + aaOnInitExpGroupDesc + " สำหรั�� REFNO = [" + e.row.data.HeadRefNo + "]<br> at (" + aAddress2Do + "). <br><br>Regards,<br>" + aRequesterName + "</div>"
                                    
                                                                                                //aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)
                                    
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.event.preventDefault();
                                                                                                $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                                aMessageAlert("Already Confirmed", "DarkGreen")
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            hint: "send mail",
                                                                                            icon: "fas fa-envelope",
                                                                                            visible: false,
                                                                                            //visible: function(e) {                        
                                                                                            //    return (e.row.data.ID === 1) //return !e.row.isEditing;
                                                                                            //},
                                                                                            onClick: function (e) {
                                                                                                //send Email
                                                                                                let aApproverName = "Wikran"                   // HR Approver Name
                                                                                                let aApproverEmail = "wikran@asia.lockton.com" // HR Approver
                                                                                                let aRequesterName = "Wikran Intaraprajaks"
                                                                                                let aRequesterEmail = "wikran@asia.lockton.com"
                                                                                                let aSubject = "Please approve a Medical Travel Requisition"
                                                                                                let aAddress2Do = aaPFDMI + "/XOL/index.html";
                                                                                                let aMessage = "<div>Dear Khun " + $.trim(aApproverName) + "<br>Please verify and approve " + aaOnInitExpGroupDesc + " for REFNO = [" + e.row.data.HeadRefNo + "]<br> at (" + aAddress2Do + "). <br><br>Regards,<br>" + aRequesterName + "</div>"
                                                                                                //let aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>Please Approve at &nbsp;'+ aAddress2Do +'</center></strong></span></h2></td></tr></tbody></table>'                          
                                                                                                //aSendMailDMZ("Khun " + aApproverName , aApproverEmail ,"XOL-Requester",aRequesterEmail,"","Please approve a Medical Travel Requisition" , "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aApproverName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");
                                                                                                //aSendMailDMZ("Khun " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)
                                                                                                aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)
                                                                                                aMessageAlert("Already Send Mail", "Orange")
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            hint: "Print",
                                                                                            icon: "fas fa-print", //"fas fa-marker", "fas fa-print", "print"
                                                                                            visible: function (e) {
                                                                                                //return !e.row.isEditing;
                                                                                                return (e.row.data.ID === 1) //false; && e.row.data.Confirmed === true
                                                                                            },
                                                                                            onClick: function (e) {
                                                                                                aPopUpForm(e.row.data, e.row.data.HeadRefNo);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.event.preventDefault();
                                                                                                dataGrid.refresh();
                                                                                            }
                                    
                                                                                        }
                                    
                                                                                    ]
                                                                                },
                                                                            ],
                                                                            //
                                                                            // summary
                                                                            summary: {
                                                                                recalculateWhileEditing: true,
                                                                                skipEmptyValues: false,
                                                                                totalItems: [
                                                                                    {
                                                                                        column: "ERODesc01",
                                                                                        summaryType: "count",
                                                                                        //          summaryType: "max",
                                                                                        //          valueFormat: "currency",
                                                                                        //          showInGroupFooter: false,
                                                                                        //          alignByColumn: true            
                                                                                        displayFormat: "Grand Total {0} Items",
                                                                                    },
                                                                                    {
                                                                                        column: "Amount",
                                                                                        summaryType: "sum",
                                                                                        valueFormat: "#,##0.00",
                                                                                        displayFormat: "{0}",
                                                                                    },
                                                                                    {
                                                                                        column: "LocalAmount",
                                                                                        summaryType: "sum",
                                                                                        //          summaryType: "max",
                                                                                        valueFormat: "#,##0.00", //"currency",
                                                                                        //          showInGroupFooter: false,
                                                                                        //          alignByColumn: true            
                                                                                        displayFormat: "{0}",
                                                                                    },
                                                                                    {
                                                                                        column: "RefundedAmount",
                                                                                        summaryType: "sum",
                                                                                        //          summaryType: "max",
                                                                                        valueFormat: "#,##0.00", //"currency",
                                                                                        //          showInGroupFooter: false,
                                                                                        //          alignByColumn: true            
                                                                                        displayFormat: "{0}",
                                                                                    },
                                                                                ],
                                                                                groupItems: [
                                                                                    {
                                                                                        column: "ID",
                                                                                        summaryType: "count",
                                                                                        //alignByColumn: true, 
                                                                                        //showInGroupFooter: true,
                                                                                        displayFormat: "{0} Items",
                                                                                    },
                                                                                    {
                                                                                        column: "ERODesc01",
                                                                                        summaryType: "count",
                                                                                        alignByColumn: true,
                                                                                        showInGroupFooter: true,
                                                                                        displayFormat: "Total {0} Items",
                                                                                    },
                                                                                    {
                                                                                        column: "Amount",
                                                                                        summaryType: "sum",
                                                                                        valueFormat: "#,##0.00",
                                                                                        alignByColumn: true,
                                                                                        showInGroupFooter: true,
                                                                                        displayFormat: "{0}",
                                                                                    },
                                                                                    {
                                                                                        column: "LocalAmount",
                                                                                        summaryType: "sum",
                                                                                        valueFormat: "#,##0.00", //"currency",
                                                                                        //          showInGroupFooter: false,
                                                                                        showInGroupFooter: true,
                                                                                        alignByColumn: true,
                                                                                        displayFormat: "{0}",
                                                                                    },
                                                                                    {
                                                                                        column: "RefundedAmount",
                                                                                        summaryType: "sum",
                                                                                        valueFormat: "#,##0.00", //"currency",
                                                                                        //          showInGroupFooter: false,
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
                                                                                        template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                                                    },
                                                                                    {
                                                                                        location: "before",
                                                                                        template: function () {
                                                                                            return $("<div />")  //    height: 70px; width: 130px; text-align: center;  color: #fff;
                                                                                                .append(
                                                                                                    $("<span style='font-size: 13px; font-weight: bold; color: lightgrey; background-color: Indigo; border-radius: 3px; border: 0px; padding: 1px 10px;' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px;
                                                                                                        .text("LIMIT/YEAR"),
                                                                                                    $("<br>"),
                                                                                                    $("<i class= 'fas fa-coins'; style='color: Indigo;'>;"),
                                                                                                    $("<span />")
                                                                                                        .text('   ' + String(aaLTotal).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '.00'),
                                                                                                );
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        location: "before",
                                                                                        template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                                                    },
                                                                                    {
                                                                                        location: "before",
                                                                                        template: function () {
                                                                                            return $("<div />")  //    height: 70px; width: 130px; text-align: center;  color: #fff;
                                                                                                .append(
                                                                                                    $("<span style='font-size: 13px; font-weight: bold; color: LightYellow; background-color: Red; border-radius: 3px; border: 0px; padding: 1px 12px; ' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px; opacity: 0.5;
                                                                                                        .text("USAGE AMT"),
                                                                                                    $("<br>"),
                                                                                                    $("<i class= 'fas fa-coins'; style='color: OrangeRed;' >;"),
                                                                                                    $("<span />")
                                                                                                        .text('   ' + String(aaTTUsed).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '.00'),
                                                                                                );
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        location: "before",
                                                                                        template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                                                    },
                                                                                    {
                                                                                        location: "before",
                                                                                        template: function () {
                                                                                            return $("<div />")  //    height: 70px; width: 130px; text-align: center;  color: #fff;
                                                                                                .append(
                                                                                                    $("<span style='font-size: 13px; font-weight: bold; color: lightblue; background-color: RoyalBlue; border-radius: 3px; border: 0px; padding: 1px 10px;' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px;
                                                                                                        .text("REMAINING "),
                                                                                                    $("<br>"),
                                                                                                    $("<i class= 'fas fa-coins'; style='color: DodgerBlue;' >;"),
                                                                                                    $("<span />")
                                                                                                        .text('   ' + String(aaTTRm).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '.00'),
                                                                                                );
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        location: "before",
                                                                                        template: function () { return $("<div style='padding: 5px 85px;'/>") }
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
                                     */

                                });
                            }

                            // popup Add New and Edit Travel Requisition  
                            const aPopUpAddForm = (aRecNo, iData, idDate) => {
                                console.log("R iData = ", iData)
                                var aaPFDMI = isLocalHost();
                                var astr = localStorage["aDXTheme"]
                                console.log("aRecNo = ", aRecNo)
                                console.log("iData = ", iData)
                                if (aRecNo === 1) {
                                    var aaaTitle = " [ADD]"
                                    let aaID = 1
                                    let axRunRun = aGetDateRef(aaRunPre); // aaOnInitExpGroupDesc.substring(0, 1)
                                    let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                    var aaiHeadRef = axRunRun;
                                    var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), ERODate01: idDate, ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment, Division: asDivision, ERODesc06: asStaffEmail, ReqDate: aNowDte, ExpensesCode: "", ExpensesDescription: aaOnInitAccDesc, Currency: "THB", Xrate: 1, ExpGroupCode: aaOnInitExpGroupCode, ExpGroupDescEng: aaOnInitExpGroupDesc, ERStatus: asERStatus, ERORefNo1: asERORefNo1, ERORefNo2: "", ERORefNo3: "", EROCheck01: 0, EROCheck02: 0, NeedPayment: 0, RefundedAmount: asRefundedAmount, LimitedAmount: 0, ERODesc02: asERODesc02, ERODesc03: asERODesc03, ERODesc04: asERODesc04, ERODesc05: asERODesc05, ERODate02: new Date(), ERODate03: new Date(), Vendor01: asVendor01, Note: asNote, EROAmount1: asEROAmount1 }
                                    var ObjRowData = JSON.stringify(ObjKeyData);
                                    console.log("ObjRowData = ", ObjRowData)
                                    sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                    iData = ObjKeyData;
                                    console.log("iData = ", iData)
                                    insideAddNew = true;
                                } else {
                                    var aaiHeadRef = aRecNo;
                                    var aaaTitle = " [HOD]"
                                    insideAddNew = false;
                                    asERStatus = iData.ERStatus;
                                    asERODesc02 = iData.ERODesc02; //Destination	ERODesc02
                                    asERODesc03 = iData.ERDesc03; //Purpose of Trip
                                    asEROCheck01 = iData.EROCheck01; //Overseas
                                    asEROCheck02 = iData.EROCheck02; //Need Roaming     
                                    asEROCheck03 = iData.EROCheck03; //SELF, ADMIN Booking                                   
                                    asERODate02 = iData.ERODate02 //Travel Start Date	
                                    asERODate03 = iData.ERODate03 //Travel End Date	
                                    asERORefNo1 = iData.ERORefNo1; // Purpose of Trip List
                                    asRefundedAmount = iData.RefundedAmount; //Estimated Cost	
                                    asVendor01 = iData.Vendor01; //Departure Flight	
                                    asERODesc04 = iData.ERODesc04; //Arrival Flight	
                                    asEROAmount1 = iData.EROAmount1; //Ticket Price	EROAmount1
                                    asERODesc05 = iData.ERODesc05; //Hotel	ERODesc05
                                    asNote = iData.Note; //Remark	Note  
                                    //console.log("asERODesc02 = ", asERODesc02)
                                }
                                var aaSchRefx = "HeadRefNo LIKE '%" + aaiHeadRef + "%'" // (DataGrid View Only This New Item)
                                aqrFull = aaSchRefx;
                                var aaxurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                var aaxSettings = { "url": aaxurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };

                                $(() => {
                                    var aaLastLineNo = 1;
                                    var gbxRateV = 1;

                                    const popup = $("#popupContainerAdd").dxPopup({
                                        title: "Travel Requisition Form" + aaaTitle,
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
                                        readOnly: true,  //all are readOnly
                                        onInitialized: function (e) { e.component.registerKeyHandler("escape", function (arg) { }) }, // ignore when press 'ESC'  

                                        contentTemplate: function (e) {
                                            //console.log("before ",e)
                                            return $("<div />").append(
                                                $("<p><div id='Add-form'></div></p>"),
                                                $("<span style='padding: 0px 8px;'></span>").text(" "),
                                                $("<span id='Add-Upload'></span>"),
                                                $("<span style='padding: 0px 5px;'></span>").text(" "),
                                                $("<span id='Add-ViewFile'></span>"),
                                                $("<p><div id='Add-dxDataGrid'></div></p>"),
                                                $("<span id='Add-popupexit'></span>"),
                                                $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                $("<span id='aConfirm'></span>"),
                                            );
                                        },
                                        //onContentReady: function () {
                                        // $("#Add-dxDataGrid").hide(); // hide dataGrid
                                        //},
                                        toolbarItems: [
                                            {
                                                toolbar: "top",
                                                locateInMenu: 'always',
                                                //html: "<div padding-top: -7px;><img src='./images/locktonlogo70mmblack.png' width='85'></div>" // Logo
                                            },

                                            {
                                                toolbar: "top", // exit (x)
                                                locateInMenu: 'always',
                                                widget: "dxButton",
                                                //toolbar: "bottom",
                                                location: "after",
                                                visible: false,
                                                options: {
                                                    //text: "EXIT",
                                                    icon: "fas fa-times",
                                                    stylingMode: "outlined",
                                                    type: "danger",
                                                    onClick: function (e) {
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        //alert(iData.ERODesc03) //ReqDate ERODesc03
                                                        if (aRecNo === 1) {
                                                            let result = DevExpress.ui.dialog.confirm("<i>" + "Press 'YES' To SAVE " + "</i>", "SAVE BEFORE EXIT ?");
                                                            result.done(function (dresult) {
                                                                if (dresult) {
                                                                    // not delete
                                                                    // save first row
                                                                    alert("Save First Row")
                                                                } else {
                                                                    // delete data
                                                                    let aSQLCommand = "use ExtraOnLine; DELETE FROM TRVREQF WHERE HeadRefNo = '" + aaiHeadRef + "'"
                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                }
                                                            });
                                                        }
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        popup.hide()
                                                    }
                                                }
                                            }]

                                    }).dxPopup("instance");

                                    $("#Add-Upload").dxButton({
                                        icon: "fas fa-upload",
                                        type: "success",
                                        hint: "Add Attach File",
                                        //visible: true,
                                        visible: false, //aViewG, //true,
                                        onClick: function (e) {
                                            aPopUpUpLoad(iData.HeadRefNo)
                                            //popup.hide()
                                        }
                                    });

                                    $("#Add-ViewFile").dxButton({
                                        icon: "fas fa-file",
                                        type: "default",
                                        hint: "View Attach File",
                                        visible: true,
                                        onClick: async function (e) {
                                            var aUriV = `${aaPFDMI}/temp/uploads/${iData.HeadRefNo}.pdf` //`https://cbsdev2.locktonwattana.com/temp/uploads/${iData.HeadRefNo}.pdf`
                                            const cacheBusterUrl = aUriV + "?t=" + new Date().getTime();
                                            const fileAvailable = await isFileAvailable(aUriV);
                                            //alert(fileAvailable ? "Found" : "Not found")
                                            if (fileAvailable || aaCheckON) {
                                                aPopupPDF(cacheBusterUrl) //showPdf(aUriV) //'https://cbsdev2.locktonwattana.com/temp/uploads/R2411145070-001.pdf'
                                            } else {
                                                aMessageAlert("<b>The requested file is not available on the server.", "red");
                                            }

                                        }

                                    });
                                    //$(function() {
                                    //$("#popupAccordion").dxPopup({
                                    //    title: "Accordion in Popup",
                                    //    visible: true,
                                    //    width: 600,
                                    //    height: 400,

                                    //    contentTemplate: function() {
                                    //return $("<div>").dxAccordion({
                                    $("#popupAccordion").dxAccordion({
                                        dataSource: [
                                            { title: "Personal Information", formData: { firstName: "John", lastName: "Doe" } },
                                            { title: "Contact Information", formData: { email: "john.doe@example.com", phone: "123-456-7890" } }
                                        ],
                                        animationDuration: 300,
                                        collapsible: true,
                                        multiple: true,
                                        itemTemplate: function (data) {
                                            return $("<div>").dxForm({
                                                formData: data.formData,
                                                items: [
                                                    { dataField: "firstName", label: { text: "First Name" } },
                                                    { dataField: "lastName", label: { text: "Last Name" } },
                                                    { dataField: "email", label: { text: "Email" } },
                                                    { dataField: "phone", label: { text: "Phone" } }
                                                ]
                                            });
                                        },
                                        onInitialized: function (e) {
                                            accordion = e.component;
                                        }
                                    });
                                    //}
                                    //});
                                    //});
                                    $("#expandButton").on("click", function () {
                                        accordion.expandItem(0); // Expand the first item
                                        accordion.expandItem(1); // Expand the second item
                                    });

                                    $("#collapseButton").on("click", function () {
                                        accordion.collapseItem(0); // Collapse the first item
                                        accordion.collapseItem(1); // Collapse the second item
                                    });

                                    $("#Add-popupexit").dxButton({
                                        icon: "fas fa-times",
                                        type: "danger",
                                        text: "EXIT",
                                        visible: true,
                                        onClick: function (e) {
                                            popup.hide()
                                        }
                                    });

                                    //// internal Confirm
                                    $("#aConfirm").dxButton({
                                        hint: "Confirm and send Email",
                                        icon: "fas fa-check-circle",
                                        type: "success",
                                        text: "APPROVE",
                                        visible: true,
                                        onClick: function (e) {
                                            aHODApproveSS(iData) //both internal/external
                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            popup.hide()
                                        }
                                    });

                                    $("#axConfirm").dxButton({
                                        hint: "Confirm and send to HOD",
                                        icon: "fas fa-check-circle",
                                        type: "success",
                                        text: "CONFIRM",
                                        visible: true,
                                        onClick: function (e) {
                                            aaHODApprover = aaaHODApprover
                                            let aObjRowData = JSON.stringify(iData); //EROCode04
                                            console.log("Update when Confirm ", aObjRowData)
                                            sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                            sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                            sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                .then(response => {
                                                    console.log("Update response: ", response);
                                                    if (response.success) {
                                                        // Assuming you have a data source variable
                                                        let dataSource = $("#gridContainer").dxDataGrid("instance").getDataSource();
                                                        dataSource.reload().done(() => {
                                                            console.log("Data source reloaded");
                                                        });
                                                    } else {
                                                        console.error("Update failed: ", response.error);
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error("Request error: ", error);
                                                });
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            // clear variables
                                            //asERStatus = iData.ERStatus;
                                            asERODesc02 = ""; //Destination	ERODesc02
                                            asERODesc03 = ""; //Purpose of Trip
                                            asEROCheck01 = false; //Overseas
                                            asEROCheck02 = false; //Need Roaming                                        
                                            asERODate02 = new Date() //Travel Start Date	
                                            asERODate03 = new Date() //Travel End Date	
                                            asRefundedAmount = 0; //Estimated Cost	
                                            asVendor01 = ""; //Departure Flight	
                                            asERODesc04 = ""; //Arrival Flight	
                                            asEROAmount1 = 0; //Ticket Price	EROAmount1
                                            asERODesc05 = ""; //Hotel	ERODesc05
                                            asNote = ""; //Remark	Note

                                            //*/
                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                            let aDivSxx = "Where REFNO = '" + aaiHeadRef + "-001'" //HeadRefNo Check RefundedAmount for the first record only
                                            let aFieldSelectedxx = "HeadRefNo,RefundedAmount,EROCheck01" //ExtraOnLine].[dbo].[EXPREIM_400] TotalReimburse,
                                            let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.TRVREQF " + aDivSxx; //alert(aFullBody)  Estimated Amount                                         
                                            console.log(aFullBodyxx, aaHODApprover);
                                            fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                .then(response => response.json())
                                                //
                                                .then(ppData => {
                                                    var aaTotalValue = ppData;
                                                    var aaTotalReim = aaTotalValue[0].RefundedAmount //TotalReimburse
                                                    var aaCheckOverseas = aaTotalValue[0].EROCheck01 ? "TRFO" : "TRF";
                                                    console.log(aaCheckOverseas)
                                                    //alert(aaTotalReim)
                                                    //alert(aaHODApprover.length)
                                                    // check if aaCheckOverseas = "TRFO"
                                                    var aaChkA = aaHODApprover.filter(item => item.ApproverCode === "TRFO")
                                                    if (aaCheckOverseas === 'TRFO') {
                                                        if (aaChkA.length > 0) {
                                                            aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "TRFO");
                                                            // use only "TRFO" if overseas
                                                        }  // if not found TRFO use TRF instead
                                                    } else if (aaCheckOverseas === 'TRF') {
                                                        if (aaChkA.length > 0) {
                                                            aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "TRF");
                                                            // use only "TRF"
                                                        }

                                                    }

                                                    //console.log(aaHODApprover)                                                                
                                                    var aaiFoundApp = false;
                                                    var nnLno = 0;
                                                    var nnAdno = 0;
                                                    var aaHODEmail4Chk = ""; //aaHODAppName
                                                    var aaHODName4Chk = "";
                                                    var aaHODRange4Chk = "";
                                                    for (let i = 0; i < aaHODApprover.length; i++) {
                                                        if ($.trim(aaHODApprover[i].ApproverName) === $.trim(asFullName)) {
                                                            nnAdno = i
                                                            aaiFoundApp = true;
                                                            //console.log(nnAdno)
                                                            //console.log(aaHODApprover[nnAdno].ApproverName)                                                    
                                                            break;
                                                        }
                                                    }
                                                    console.log("asFullName ", asFullName)
                                                    console.log(aaHODApprover[0].ApproverName)
                                                    console.log(nnAdno)
                                                    if (aaiFoundApp === true && aaHODApprover.length > 1) {
                                                        nnAdno = nnAdno + 1
                                                    }
                                                    //console.log(i)
                                                    for (let i = nnAdno; i < aaHODApprover.length; i++) {
                                                        if (aaTotalReim <= aaHODApprover[i].LRange02) {
                                                            aaHODEmail4Chk = aaHODEmail4Chk + "|" + aaHODApprover[i].ApproverEmail + "|"
                                                            aaHODName4Chk = aaHODName4Chk + "|" + aaHODApprover[i].ApproverName + "|"
                                                            aaHODRange4Chk = aaHODRange4Chk + aaHODApprover[i].LRange02
                                                            nnLno = i
                                                            break;
                                                        } else {
                                                            aaHODEmail4Chk = aaHODEmail4Chk + "|" + aaHODApprover[i].ApproverEmail + "|" + ","
                                                            aaHODName4Chk = aaHODName4Chk + "|" + aaHODApprover[i].ApproverName + "|" + ","
                                                            aaHODRange4Chk = aaHODRange4Chk + aaHODApprover[i].LRange02 + ","
                                                        }
                                                    }
                                                    var aaHODAll4Chk = "NAME:[" + aaHODName4Chk + "] MAIL:[" + aaHODEmail4Chk + "] RANG:[" + aaHODRange4Chk + "]";
                                                    var xxChkEmailxx = aTranTextJson(aaHODAll4Chk, "MAIL:", "RANG:")
                                                    var xxChkNamexx = aTranTextJson(aaHODAll4Chk, "NAME:", "MAIL:")
                                                    var xxChkRangexx = aTranTextJson(aaHODAll4Chk, "RANG:", "")
                                                    var xxChkLenxx = xxChkNamexx.length;
                                                    console.log(aaHODAll4Chk)
                                                    console.log(xxChkNamexx, xxChkEmailxx, xxChkRangexx)

                                                    // send mail to first Approver 
                                                    aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                    aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail;

                                                    console.log(aaHODAppEmail)
                                                    // Check empty fields
                                                    var aDatabasea = "ExtraOnLine.dbo.TRVREQF";
                                                    var aKeyField = "HeadRefNo" //"HeadRefNo"; "REFNO"
                                                    var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724" +"-001" 
                                                    var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";
                                                    var aaCondition = item => (item.ID === 1 && (item.ERODesc02 === "" || item.ERODesc03 === "" || item.RefundedAmount === 0)) || (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === ""))
                                                    var condition = aaCondition  //|| (item.ERODate06 && !isNaN(new Date(item.ERODate05).getTime()))
                                                    //|| item.Xrate === 0 || (item.Xrate === 1 && item.Currency !== "THB") || (item.Xrate !== 1 && item.Currency === "THB"); !isNaN(item.ERODate01);    

                                                    aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                        .then(atestCehcka => {
                                                            console.log("xx", atestCehcka); // Logs the actual message

                                                            if (atestCehcka === 1) { DevExpress.ui.dialog.alert(aTravelEnAlert01, "INPUT ERROR"); }
                                                            else {
                                                                let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm (" + aaCheckOverseas + ") & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' ></b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>?? 'YES' ????????????" +
                                                                //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' > ??? ???????????????????????????????????????????????????** <br><b><u>???????????</u> ?????????????????????????????? </b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>?? 'YES' ???????????" +
                                                                result.done(function (dresult) {//                                                                                                                                                                                                                          
                                                                    if (dresult) {
                                                                        //if (aContinueChk !== true) {
                                                                        let aFREF = aaiHeadRef + "-001"
                                                                        console.log(aaiHeadRef)
                                                                        console.log(aFREF)
                                                                        let aERStatus = "Confirmed wait for HOD" //"Register"
                                                                        let aTrueORFalse = '1'
                                                                        let aTrueORFalseB = true
                                                                        let aNowDateT = aaNowText(aNowDte)
                                                                        //let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                        //let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                        var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus }; //, ReqDate: aNowDte
                                                                        var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                        //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                        //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704' ERORefNo6
                                                                        let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + aaiHeadRef + "'" //+ "', ReqDate = '" + aNowDateT
                                                                        aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();

                                                                        //send Email
                                                                        var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " ";
                                                                        let aApproverName = aaHODAppName //+ ", [HOD]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                        let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                        let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                        let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@lockton.com"
                                                                        //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                                                        var aSubject = aaMailTitle
                                                                        let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                        let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>";
                                                                        let aMessage01 = aEmailTRF[0] + $.trim(aApproverName) + aEmailTRF[1] + aaOnInitExpGroupDesc + aEmailTRF[2] + aRefNoa + aEmailTRF[3] + aAddress2Do + aEmailTRF[4] + aRequesterName + aEmailTRF[5];
                                                                        //let aMessage01 = "<div>????? ???" + $.trim(aApproverName) + ",<br>&nbsp;&nbsp;&nbsp;&nbsp;???????????? ???????????????? " + aaOnInitExpGroupDesc + " Expenses ?????? REFNO = [" + aRefNoa + "]<br> ?????????????????????????? " + aAddress2Do + " (?????? Approve --> HOD Approve) <br><br>????????????????<br>" + aRequesterName + "</div>"
                                                                        var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                        aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();

                                                                        aMessageAlert("Already Confirmed & send mail to Approver " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                        popup.hide();
                                                                    }
                                                                });
                                                                //1
                                                            } //aaLoadData
                                                        }); // then check                                                                 
                                                });
                                        }
                                    });

                                    const aform = $("#Add-form").dxForm({
                                        formData: iData, //aXXData[0], //iData,                                              
                                        showColonAfterLabel: false,
                                        labelLocation: "top",//"left", //"top",
                                        readOnly: true,
                                        items: [
                                            {
                                                itemType: "group",
                                                colCount: 5,
                                                items: [
                                                    {
                                                        itemType: "simple",
                                                        label: { text: " " },
                                                        template: function () {
                                                            return $("<div>").text(asEROCheck03 ? "SELF BOOKING" : "ADMIN BOOKING").css({
                                                                "color": asEROCheck03 ? "purple" : "darkgreen",
                                                                "font-size": "15px",
                                                                "font-weight": "bold",
                                                                "background-color": "AliceBlue",
                                                                "text-align": "center",
                                                                "border": "1px solid lightblue",
                                                                "border-radius": "4px",
                                                                "width": "130px",
                                                                "padding": "5px"
                                                            });
                                                        }
                                                    },
                                                    {
                                                        dataField: "HeadRefNo",
                                                        label: { text: "REF NO", cssClass: "custom-label" },
                                                        editorType: "dxTextBox",
                                                        editorOptions: { width: 150, readOnly: true }, //value: aaiHeadRef,
                                                        cssClass: "verylight-blue",
                                                        colSpan: 1,
                                                    },
                                                    {
                                                        dataField: "PayToName",
                                                        label: { text: "Requester." },
                                                        editorType: "dxTextBox",
                                                        editorOptions: { width: 150, readOnly: true }, //value: asFullName,
                                                        cssClass: "verylight-blue",
                                                        colSpan: 1,
                                                    },
                                                    {
                                                        dataField: "ReqDate",
                                                        label: { text: "Requested Date" },
                                                        editorType: "dxDateBox",
                                                        editorOptions: { displayFormat: "dd/MM/yyyy", width: 150, readOnly: true },//showClearButton: true, value: idDate, 
                                                        cssClass: "verylight-blue",
                                                        colSpan: 1,
                                                    },

                                                    {
                                                        dataField: "ERStatus",
                                                        label: { text: "STATUS" },
                                                        editorType: "dxTextBox",
                                                        editorOptions: { Width: 300, readOnly: true },
                                                        cssClass: "verylight-blue",
                                                        colSpan: 1,
                                                    },
                                                ]
                                            },
                                            {
                                                itemType: "tabbed",
                                                tabPanelOptions: { deferRendering: false },
                                                tabs: [
                                                    {
                                                        title: "TRAVEL INFO",
                                                        icon: "fas fa-info-circle",
                                                        iconPosition: "start",
                                                        colCount: 5,
                                                        items: [
                                                            {
                                                                dataField: "ERORefNo1",
                                                                label: { text: "Purpose of Trip." }, //,cssClass: "bold-label" }, 
                                                                editorType: "dxSelectBox", //dxSelectBox dxLookup
                                                                editorOptions: {
                                                                    dataSource: aaPurposeTable,
                                                                    searchExpr: "Purpose",
                                                                    valueExpr: "Purpose",
                                                                    displayExpr: "Purpose",
                                                                    searchEnabled: true,
                                                                    width: 180,
                                                                    //value: aNewDiva,
                                                                    onValueChanged: function (e) {
                                                                        asERORefNo1 = e.value;
                                                                    }

                                                                },
                                                                cssClass: "verylight-blue",
                                                                visible: true,
                                                                colSpan: 2,
                                                                validationRules: [{ type: "required", message: "Purpose of Trip is required" }]
                                                            },

                                                            {
                                                                dataField: "ERODate02",
                                                                label: { text: "Travel Start Date" },
                                                                editorType: "dxDateBox",
                                                                editorOptions: {
                                                                    displayFormat: "dd/MM/yyyy",
                                                                    width: 150,
                                                                    onValueChanged: function (e) {
                                                                        var formInstance = $("#Add-form").dxForm("instance");
                                                                        formInstance.updateData("ERODate03", e.value);
                                                                        formInstance.updateData("ERODate05", e.value);
                                                                        asERODate02 = e.value;
                                                                        iData.ERODate05 = e.value;
                                                                        //var xdataGrid = $("#Add-dxDataGrid").dxDataGrid({}).dxDataGrid("instance");                                                                         
                                                                        //var xdataSource = xdataGrid.getDataSource();
                                                                        //xdataSource.reload();                                                                                    

                                                                        aSaveMemToDB(iData, aaTBKey, aaPFDMI, aaXToX)
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        //var formInstance2 = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                                        //formInstance2.updateData("ERODate05", e.value);                                                                                    
                                                                    },

                                                                },
                                                                showClearButton: true,
                                                                colSpan: 1,
                                                                validationRules: [{ type: "required", message: "Travel Start Date is required" }]
                                                            },
                                                            {
                                                                dataField: "ERODate03",
                                                                label: { text: "Travel End Date" },
                                                                editorType: "dxDateBox",
                                                                editorOptions: {
                                                                    displayFormat: "dd/MM/yyyy", width: 150,
                                                                    onValueChanged: function (e) {
                                                                        var formInstance = $("#Add-form").dxForm("instance");
                                                                        formInstance.updateData("ERODate06", e.value);
                                                                        asERODate03 = e.value;
                                                                        iData.ERODate06 = e.value;
                                                                        aSaveMemToDB(iData, aaTBKey, aaPFDMI, aaXToX)
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                    }
                                                                },	  //showClearButton: true,  //value: new Date(), 
                                                                showClearButton: true,
                                                                colSpan: 1,
                                                                validationRules: [{ type: "required", message: "Travel End Date is required" }]
                                                            },
                                                            {
                                                                itemType: "Empty",
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                dataField: "ERODesc03",
                                                                label: { text: "Purpose Of Trip Description" }, //,cssClass: "bold-label" }, Purpose of Trip
                                                                editorType: "dxTextArea",
                                                                editorOptions: {
                                                                    width: 400,
                                                                    height: 50,
                                                                    onValueChanged: function (e) {
                                                                        asERODesc03 = e.value;
                                                                    }
                                                                },
                                                                cssClass: "verylight-blue",
                                                                visible: true,
                                                                colSpan: 5,
                                                                //validationRules: [{ type: "required", message: "Purpose of Trip is required" }]
                                                            },
                                                            {
                                                                dataField: "ERODesc02",
                                                                label: { text: "Destination/Country" },
                                                                editorType: "dxTextArea",
                                                                editorOptions: {
                                                                    width: 400, height: 50,
                                                                    onValueChanged: function (e) {
                                                                        asERODesc02 = e.value;
                                                                    }
                                                                },
                                                                cssClass: "verylight-blue",
                                                                validationRules: [{ type: "required", message: "Destination is required" }],
                                                                visible: true,
                                                                colSpan: 2,
                                                            },
                                                            {
                                                                dataField: "EROCheck01",
                                                                label: { text: "Overseas" },
                                                                editorType: "dxCheckBox",
                                                                editorOptions: {
                                                                    //value: false, // Initial value
                                                                    onValueChanged: function (e) {
                                                                        asEROCheck01 = e.value;
                                                                        aAddStaff.columnOption("PSPvDate", "visible", e.value);
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                    }
                                                                }
                                                            },

                                                            {
                                                                dataField: "EROCheck02",
                                                                label: { text: "Need Roaming" },
                                                                editorType: "dxCheckBox",
                                                                editorOptions: {
                                                                    //readOnly: asEROCheck01,
                                                                    onValueChanged: function (e) {
                                                                        asEROCheck02 = e.value;
                                                                        aAddStaff.columnOption("ROAMING INFORMATION", "visible", e.value); //HR Arrange for Roaming
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                    }


                                                                }, //readOnly: !aRoamL // Initial value, can be true or false
                                                                visible: true, //true // Initially hidden
                                                            },
                                                            {
                                                                dataField: "RefundedAmount",
                                                                label: { text: "Estimated Cost" },
                                                                dataType: "dxNumberBox",
                                                                //format: { type: "fixedPoint", precision: 2 },
                                                                hint: "Estimated Cost can not be zero !!!",
                                                                editorOptions: {
                                                                    format: "#,##0.00", width: 150, elementAttr: { class: "right-align-number" },
                                                                    hint: "Estimated Cost can not be zero !!!",
                                                                    onValueChanged: function (e) {
                                                                        asRefundedAmount = e.value;
                                                                    }
                                                                }, //showSpinButtons: true, readOnly: true,
                                                                cssClass: "verylight-blue",
                                                                colSpan: 1,
                                                                validationRules: [{ type: "required" }, {
                                                                    type: "range",
                                                                    min: 1, //aYearStrS
                                                                    max: 9999999, //aYearStrL
                                                                    message: "Please ensure that the estimated cost is entered and is greater than zero.",
                                                                }],
                                                            },
                                                            {
                                                                dataField: "ERODate05",
                                                                label: { text: "Date" },
                                                                dataType: "dxNumberBox",
                                                                visible: false
                                                            },
                                                            {
                                                                dataField: "ERODate06",
                                                                label: { text: "Date" },
                                                                dataType: "dxNumberBox",
                                                                visible: false
                                                            },

                                                        ],
                                                        onFieldDataChanged: function (e) {
                                                            if (e.dataField === "ERODate02") {
                                                                e.component.updateData("ERODate03", e.value);
                                                            }
                                                        },

                                                    },
                                                    {
                                                        title: "FLIGHT & HOTEL",
                                                        icon: "fas fa-clock",
                                                        iconPosition: "start",
                                                        colCount: 6,
                                                        items: [
                                                            {
                                                                dataField: "Vendor01",
                                                                label: { text: "Departure Flight" }, //,cssClass: "bold-label" }, 
                                                                editorType: "dxTextArea",
                                                                editorOptions: {
                                                                    width: 400,
                                                                    height: 50,
                                                                }, //value: asFullName, //asEROCheck03
                                                                cssClass: "verylight-green",
                                                                colSpan: 1,
                                                                //validationRules: [{ type: "required" }],
                                                            },
                                                            {
                                                                itemType: "Empty",
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                dataField: "ERODesc04",
                                                                label: { text: "Arrival Flight" },
                                                                editorType: "dxTextArea",
                                                                editorOptions: {
                                                                    width: 400, height: 50,
                                                                },
                                                                cssClass: "verylight-green",
                                                                visible: true,
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                itemType: "Empty",
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                dataField: "EROAmount1",
                                                                label: { text: "Ticket Price (per person)" },
                                                                dataType: "dxNumberBox",
                                                                editorOptions: {
                                                                    format: "#,##0.00", width: 150,
                                                                    elementAttr: { class: "right-align-number" }
                                                                }, //showSpinButtons: true, readOnly: true,
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                itemType: "Empty",
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                dataField: "ERODesc05",
                                                                label: { text: "HOTEL" },
                                                                editorType: "dxTextArea",
                                                                editorOptions: {
                                                                    width: 400, height: 50,
                                                                },
                                                                cssClass: "verylight-green",
                                                                visible: true,
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                itemType: "Empty",
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                dataField: "Note",
                                                                label: { text: "Remark" },
                                                                editorType: "dxTextArea",
                                                                editorOptions: {
                                                                    width: 400, height: 50,
                                                                },
                                                                cssClass: "verylight-green",
                                                                visible: true,
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                itemType: "Empty",
                                                                colSpan: 3,
                                                            },

                                                        ]
                                                    },
                                                    {
                                                        title: "AGENT INFO", // for SELF BOOKING
                                                        icon: "fas fa-user-circle",
                                                        iconPosition: "start",
                                                        /*Travel Agent EROCode06,InvoicNo	ERORefNo5,InvoiceDate	ERODate04
                                                        InvoiceAmt	EROAmount6,InvoiceNote	ERORefNo6,Travel Agent Name	ERORefNo4*/
                                                        colCount: 8,
                                                        items: [
                                                            {
                                                                dataField: "ERORefNo4", // Updated field name
                                                                label: { text: "Travel Agent" }, // Label for the field
                                                                editorType: "dxSelectBox", // Using dxSelectBox
                                                                editorOptions: {
                                                                    width: 250,
                                                                    placeholder: "Select or enter an agent...",
                                                                    searchEnabled: true, // Enables search functionality
                                                                    acceptCustomValue: true, // Allow manual input
                                                                    dataSource: aArrays.aTravelAgent, // The travel agents data array
                                                                    onCustomItemCreating: function (e) {
                                                                        let newAgent = e.text.trim();
                                                                        if (newAgent.length > 0) {
                                                                            //let dataSource = e.component.option("dataSource");
                                                                            // Prevent duplicate entries
                                                                            let dataSource = e.component.option("dataSource");
                                                                            if (!dataSource.includes(newAgent)) {
                                                                                //if (!dataSource.some(item => item.AgentName === newAgent)) {
                                                                                //let newItem = { AgentID: newAgent, AgentName: newAgent }; // Create new entry
                                                                                dataSource.push(newAgent); // Add to list
                                                                                e.component.option("dataSource", dataSource); // Update list
                                                                            }
                                                                            e.customItem = newAgent; // Set user input as the value
                                                                        }
                                                                    }
                                                                },
                                                                cssClass: "verylight-green", // Styling
                                                                colSpan: 2 // Layout control
                                                            },
                                                            {
                                                                itemType: "Empty",
                                                                colSpan: 6,
                                                            },
                                                            {
                                                                dataField: "ERORefNo5",
                                                                label: { text: "InvoicNo" },
                                                                editorType: "dxTextBox",
                                                                editorOptions: {
                                                                    width: 100,
                                                                },
                                                                cssClass: "verylight-green",
                                                                visible: true,
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                dataField: "ERODate04", //InvoiceDate	ERODate04
                                                                label: { text: "Invoice Date" },
                                                                editorType: "dxDateBox",
                                                                editorOptions: {
                                                                    displayFormat: "dd/MM/yyyy",
                                                                    width: 150,
                                                                    showClearButton: true,
                                                                },
                                                                cssClass: "verylight-green",
                                                                showClearButton: true,
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                dataField: "EROAmount6",
                                                                label: { text: "Invoice Amount" },
                                                                dataType: "dxNumberBox",
                                                                editorOptions: {
                                                                    format: "#,##0.00",
                                                                    width: 150,
                                                                    elementAttr: { class: "right-align-number" },
                                                                },
                                                                cssClass: "verylight-green",
                                                                colSpan: 1,
                                                            },
                                                            {
                                                                itemType: "Empty",
                                                                colSpan: 5,
                                                            },
                                                        ]
                                                    },
                                                    {
                                                        title: "",
                                                        icon: "fas fa-minus-circle",
                                                        iconPosition: "start",
                                                    }
                                                ]


                                            } // tab here }]
                                        ],
                                        onInitialized: function (e) {
                                            // Trigger validation immediately using the defined validation group
                                            //const validationResult = DevExpress.validationEngine.validateGroup("formValidationGroup");

                                            //if (!validationResult.isValid) {
                                            //    console.log("Form is invalid upon initialization.");
                                            // }
                                        }

                                    }).dxForm("instance");

                                    const aAddStaff = $("#Add-dxDataGrid").dxDataGrid({

                                        dataSource: new DevExpress.data.CustomStore({
                                            key: "REFNO",
                                            loadMode: "omit",
                                            load: function () { return $.post(aaxSettings).done(function (response) { console.log(response); }); },
                                            insert: function (values) {
                                                if (aaEnt) {
                                                    var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };
                                                    var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                                }
                                                else {
                                                    var ObjRowData = JSON.stringify(values);
                                                }
                                                sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                            },
                                            update: function (key, values) {
                                                //console.log(key)
                                                //console.log(key.slice(-3))
                                                //console.log(values)
                                                //console.log("json value = ",JSON.stringify(values))
                                                //console.log("iData = ",iData)

                                                if (key.slice(-3) === "001") {
                                                    let obj = values; //JSON.stringify(values); //{"EROCode04": "NO"};
                                                    const aKey = Object.keys(obj)[0];
                                                    const aVal = obj[aKey];
                                                    //console.log("xx ", Object.keys(values)[0])
                                                    console.log("aKey =", aKey); // Output: "fst = EROCode04"
                                                    console.log("aVal =", aVal); // Output: "scd = NO"
                                                    iData[aKey] = aVal;
                                                    console.log("new iData =", iData);
                                                    console.log(iData.ERODate02, iData.ERODate03)
                                                }

                                                var ObjKeyData = { "REFNO": $.trim(key) };   //[aaKeyField] key.trim
                                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                                sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                // Refresh the DataGrid after the update is successful
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                            },
                                            remove: function (key) {
                                                var ObjKeyData = { "REFNO": $.trim(key) };   //[aaKeyField] key.trim
                                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                                                sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                            }

                                        }),

                                        allowColumnReordering: false, //true false
                                        allowReordering: false,
                                        allowColumnResizing: false, //true,
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
                                            allowedPageSizes: [10, 20],
                                            showNavigationButtons: true,
                                            showInfo: true
                                        },
                                        showBorders: true,
                                        groupPaging: true,
                                        showColumnLines: true,
                                        showRowLines: true,
                                        rowAlternationEnabled: false, //true,
                                        /*onRowPrepared: function (e) {
                                            e.rowElement.css({ height: 100 });
                                        },*/
                                        wordWrapEnabled: true,
                                        cacheEnabled: false,
                                        columnAutoWidth: true,
                                        // check for disable column
                                        customizeColumns: function (columns) {
                                            columns.forEach(function (column) {
                                                if (column.dataField === "PSPvDate") {
                                                    column.visible = asEROCheck01; //false asEROCheck01
                                                }
                                                if (column.caption === "ROAMING INFORMATION") { //HR Arrange for Roaming
                                                    column.visible = asEROCheck02;
                                                }
                                            });
                                        },
                                        // Export to Excel

                                        onInitNewRow: function (e) {
                                            //e.component.__addingStart = true; 
                                            //gridContainer.option("editing.popup.title", "Adding Expenses Reimbursement");
                                            let aaID = 1
                                            let axRunRun = aGetDateRef(aaRunPre); // aaOnInitExpGroupDesc.substring(0, 1)
                                            let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                            e.data.ID = aaID
                                            e.data.HeadRefNo = axRunRun
                                            e.data.REFNO = axLineNo
                                            e.data.PayToCode = asStaffID
                                            e.data.PayToName = asFullName
                                            e.data.Department = asDepartment
                                            e.data.Division = asDivision
                                            e.data.ERODesc06 = asStaffEmail
                                            e.data.ReqDate = new Date()
                                            e.data.ExpensesCode = "" //aaOnInitAccCode
                                            e.data.ExpensesDescription = aaOnInitAccDesc //aaOnInitAccDesc
                                            e.data.Currency = "THB"
                                            e.data.Xrate = 1
                                            e.data.ExpGroupCode = aaOnInitExpGroupCode
                                            e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                            e.data.ERStatus = "Register"
                                            e.data.ERORefNo3 = "" // type of expenses
                                            //e.data.EROCheck01 = true
                                            //e.data.EROCheck02 = true
                                            e.data.ERODate05 = asERODate02
                                            e.data.ERODate06 = asERODate03
                                            e.data.NeedPayment = false
                                            e.data.RefundedAmount = 0
                                            e.data.LimitedAmount = 0 //aaLTotal
                                        },
                                        onEditorPreparing: function (e) {
                                            if (e.parentType === "dataRow" && arDataU === 0) {
                                                e.editorOptions.disabled = true;
                                            } else {     //PSPvNO,PSPvDate //|| e.dataField === "PSPvDate" 
                                                if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ERStatus" || e.dataField === "PSPvNO" || e.dataField === "LocalAmount" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department")) {
                                                    e.editorOptions.disabled = true;
                                                }
                                            }
                                        },
                                        // Editing
                                        editing: {
                                            mode: "cell", // popup , row, cell (click to edit)
                                            useIcons: true,
                                            allowUpdating: false, //aViewG,
                                            //allowUpdating: true,
                                            allowDeleting: false, //aViewG, //arDataD,
                                            allowAdding: false, //arDataC,

                                            popup: {
                                                title: "Travel Requisition FormInfo",
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
                                        onRowValidating: function (e) {
                                            var isValid = true;
                                            e.brokenRules.forEach(function (rule) {
                                                if (rule.type === "custom" && !rule.isValid) {
                                                    isValid = false;
                                                }
                                            });
                                            if (!isValid) {
                                                e.isValid = false;
                                            }
                                        },
                                        // column list
                                        columns: [
                                            {
                                                type: "buttons",
                                                width: 30, //80
                                                buttons: [
                                                    {
                                                        hint: "delete",
                                                        icon: "trash", //"fas fa-trash-alt", //fa-trash
                                                        /*elementAttr: { class: "custom-icon-size"}, // Apply the custom icon size class
                                                        cssClass: "custom-icon-size",*/
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
                                                                    // DELETE FROM TRVREQF WHERE HeadRefNo = 'M2110120750'
                                                                    if (aFrecN === 1) {
                                                                        aSQLCommand = "use ExtraOnLine; DELETE FROM TRVREQF WHERE HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                    } else {
                                                                        aSQLCommand = "use ExtraOnLine; DELETE FROM TRVREQF WHERE REFNO = '" + e.row.data.REFNO + "'"
                                                                    }
                                                                    //alert(aSQLCommand)
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
                                                                        var aThisThemes = localStorage["aDXTheme"];
                                                                        //changeTheme(aThisThemes)
                                                                        DevExpress.ui.dialog.alert({ showTitle: false, messageHtml: aExitMessage });
                                                                        popup.hide();
                                                                    }
                                                                }
                                                            });
                                                        }

                                                    }
                                                ]
                                            },
                                            {
                                                type: "buttons",
                                                width: 30,
                                                buttons: [// Clone first record ID++
                                                    {
                                                        hint: "Add More Line",
                                                        icon: "fas fa-plus",
                                                        visible: function (e) {
                                                            const aadataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                            const aapageSize = aadataGrid.option('paging.pageSize'); // check page size [5,10,15]
                                                            return (((e.row.data.ID - 1) % aapageSize === 0 && e.row.data.ID >= 1) && e.row.data.Confirmed === false)
                                                        },
                                                        onClick: (e) => {
                                                            aaLastLineNo = aaLastLineNo + 1
                                                            //alert(aaLastLineNo)
                                                            //REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,RemitTo1,RemitTo2,RemitTo1Amount,RemitTo2Amount,RemitTo1Diff,RemitTo2Diff,RemitTo1Note,RemitTo2Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6
                                                            let aBlankDate = new Date(); //"1900-01-01T00:00:00" //new Date('1900-01-01T00:00')//console.log(aBlankDate) 
                                                            let axRunRun = e.row.data.HeadRefNo
                                                            let aFieldSelected = "NextID"
                                                            let aFullTableName = "ExtraOnLine.dbo.TRnextIDview Where HeadRefNo LIKE '" + axRunRun + "%'"
                                                            let aFullBody = "Select " + aFieldSelected + " From " + aFullTableName; //alert(aFullBody)                                           
                                                            let myHeaders = new Headers(); myHeaders.append("Content-Type", "application/json");
                                                            let raw = JSON.stringify({ "@": btoa(aFullBody) });
                                                            let requestOptions = { method: "POST", headers: myHeaders, body: raw, redirect: "follow" };
                                                            let aURL = aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";

                                                            fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                                                .then(response => response.json())
                                                                //
                                                                .then(aData => {
                                                                    // start process
                                                                    let aaID = aData[0].NextID //JSON.stringify(aData); //aData[0].NextID //next no 
                                                                    let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                                    //let aObjKeyData = { ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, EROAmount: 0, PBatchDate: aBlankDate,PSPvDate: aBlankDate,ERODate01: aBlankDate,ERODate02: aBlankDate,ERODate03: aBlankDate,ERODate04: aBlankDate,ERODate05: aBlankDate,ERODate06: aBlankDate} //{EntryBy: aaUsrN , EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };                                                                             
                                                                    let aObjKeyData = { REFNO: axLineNo, ID: aaID, LocalAmount: 0, Amount: 0, RefundedAmount: 0, Note: "", ERORefNo1: "", ERORefNo2: "", ERORefNo3: "", ERORefNo4: "", ERODesc02: "", ERODesc03: "", ERODesc04: "", ExpensesCode: "", Currency: "THB", Xrate: 1, Vendor02: "", EROCode01: "", EROCode02: "", EROCode03: "", EROCode04: "", EROCode05: "" }
                                                                    let aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //values 
                                                                    //var clonedItem = $.extend({}, e.row.data, { REFNO: axRunRun }); //++maxID
                                                                    //console.log("aObjKeyData = ",aObjKeyData)
                                                                    sendRequestNew("Insert", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));

                                                                    e.component.refresh(true); //employees.splice(e.row.rowIndex, 0, clonedItem);
                                                                    e.component.refresh(true);
                                                                    e.component.refresh(true);
                                                                    e.event.preventDefault();

                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();

                                                                })
                                                                .catch(e => {
                                                                    console.log(e);
                                                                })
                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                        }
                                                    },
                                                ]
                                            },
                                            {
                                                dataField: "ID",
                                                sortOrder: "asc",
                                                caption: "#",
                                                editorOptions: { width: 40, readOnly: true },
                                                //alignment: 'top',
                                                width: 40
                                            },
                                            {
                                                dataField: "Vendor02",
                                                caption: "Full name (as show in passport)*",
                                                editorType: "dxTextBox",
                                                width: 180,
                                                editorOptions: { width: 180, },
                                                visible: true,
                                            },
                                            {
                                                dataField: "EROCode01",
                                                caption: "Department",
                                                width: 120,
                                                editorType: "dxTextBox",
                                                editorOptions: { width: 150, },
                                                visible: true,
                                            },
                                            {
                                                dataField: "EROCode06",
                                                caption: "Passport No",
                                                width: 200,
                                                editorType: "dxTextBox",
                                                editorOptions: { width: 200, },
                                                visible: false,
                                            },
                                            {
                                                dataField: "PSPvDate",
                                                caption: "Send Passport Copy to Admin*",
                                                dataType: "date",
                                                format: "dd/MM/yyyy",
                                                value: new Date(),
                                                width: 120,
                                                editorOptions: {
                                                    width: 120,
                                                    showClearButton: true,
                                                    useMaskBehavior: true,
                                                    pickerType: "calendar",
                                                    value: new Date(),
                                                    hint: "Select the send Email Date"
                                                },
                                                visible: true,
                                            },
                                            {
                                                caption: "Frequent Flyer Program",
                                                visible: true,
                                                width: 300,
                                                headerCellTemplate: function (header, info) {
                                                    $('<div>')
                                                        .html(info.column.caption)
                                                        .addClass('centered-header')
                                                        .appendTo(header);
                                                    header.parent().css("backgroundColor", "#efb4fce5"); //#f4d2fce5; #e7d5ff #efb4fce5
                                                },
                                                columns: [
                                                    {
                                                        dataField: "ERORefNo3",
                                                        caption: "Airline Name",
                                                        editorType: "dxSelectBox",
                                                        width: 130,
                                                        headerCellTemplate: function (header, info) {
                                                            $('<div>')
                                                                .html(info.column.caption)
                                                                .addClass('centered-header')
                                                                .appendTo(header);
                                                            header.parent().css("backgroundColor", "#f2c4fce5"); //#f4d2fce5; #e7d5ff #efb4fce5
                                                        },
                                                        editorOptions: {
                                                            width: 130,
                                                            placeholder: "Select or type an airline...",
                                                            searchEnabled: true,  // Enables live search
                                                            acceptCustomValue: true, // Allow typing new values
                                                            // dataSource: [
                                                            //     "American Airlines", "Delta Airlines", "United Airlines", "Emirates",
                                                            //     "Qatar Airways", "Lufthansa", "Singapore Airlines", "British Airways"
                                                            // ],
                                                            dataSource: aArrays.aAirLinesList, // Use your array here
                                                            onCustomItemCreating: function (e) {
                                                                let newAirline = e.text.trim();
                                                                if (newAirline.length > 0) {
                                                                    let dataSource = e.component.option("dataSource");
                                                                    if (!dataSource.includes(newAirline)) {
                                                                        dataSource.push(newAirline); // Add new airline to list
                                                                        e.component.option("dataSource", dataSource); // Update list
                                                                    }
                                                                    e.customItem = newAirline; // Set new value
                                                                }
                                                            }
                                                        },
                                                        visible: true
                                                    },
                                                    {
                                                        dataField: "EROCode02",
                                                        caption: "Frequent #",
                                                        editorType: "dxTextBox",
                                                        headerCellTemplate: function (header, info) {
                                                            $('<div>')
                                                                .html(info.column.caption)
                                                                .addClass('centered-header')
                                                                .appendTo(header);
                                                            header.parent().css("backgroundColor", "#f2c4fce5"); //#f4d2fce5; #e7d5ff #efb4fce5
                                                        },
                                                        width: 100,
                                                        editorOptions: { width: 80 },
                                                        visible: true,
                                                    },
                                                ],
                                            },
                                            {
                                                dataField: "OtherRefNo",
                                                caption: "Seat Class",  // Updated caption to reflect seat class
                                                editorType: "dxSelectBox",
                                                width: 120,
                                                editorOptions: {
                                                    width: 120,
                                                    placeholder: "Select or type a seat class...",
                                                    searchEnabled: true,  // Enables live search
                                                    acceptCustomValue: true, // Allow typing new values
                                                    dataSource: aArrays.aSeatClassList, // Use your class list array
                                                    onCustomItemCreating: function (e) {
                                                        let newClass = e.text.trim();
                                                        if (newClass.length > 0) {
                                                            let dataSource = e.component.option("dataSource");
                                                            if (!dataSource.includes(newClass)) {
                                                                dataSource.push(newClass); // Add new class to list
                                                                e.component.option("dataSource", dataSource); // Update list
                                                            }
                                                            e.customItem = newClass; // Set new value
                                                        }
                                                    }
                                                },
                                                visible: true
                                            },
                                            {
                                                dataField: "EROAmount2",
                                                caption: "Ticket Price",
                                                dataType: "number",
                                                format: { type: "fixedPoint", precision: 2 },
                                                editorType: "dxNumberBox",
                                                editorOptions: { format: "#,##0.00", width: 120 },
                                                width: 110,
                                                visible: true,
                                            }, 
                                            {
                                                dataField: "ERODesc01",
                                                caption: "Hotel",
                                                headerCellTemplate: function (header, info) {
                                                    $('<div>')
                                                        .html(info.column.caption)
                                                        .addClass('centered-header')
                                                        .appendTo(header);
                                                    header.css("text-align", "center"); // Ensure text is centered
                                                    header.parent().css("backgroundColor", "#f2c4fce5");
                                                },
                                                width: 120,
                                                editorType: "dxTextBox",
                                                editorOptions: { width: 150, },
                                                visible: true,
                                            },
                                            {
                                                dataField: "EROAmount4",
                                                caption: "Hotel Price",
                                                headerCellTemplate: function (header, info) {
                                                    $('<div>')
                                                        .html(info.column.caption)
                                                        .appendTo(header);
                                                    header.parent().css("backgroundColor", "#f2c4fce5");
                                                },
                                                dataType: "number",
                                                format: { type: "fixedPoint", precision: 2 },
                                                editorType: "dxNumberBox",
                                                editorOptions: { format: "#,##0.00", width: 120 },
                                                width: 100,
                                                visible: true,
                                            },
                                            {
                                                dataField: "ERODate05",
                                                caption: "Date From",
                                                dataType: "date",
                                                format: "dd/MM/yyyy",
                                                width: 110,
                                                editorOptions: { width: 110, }, // showClearButton: true, value: iData.ERODate02,
                                                visible: true,
                                            },
                                            {
                                                dataField: "ERODate06",
                                                caption: "Date To",
                                                dataType: "date",
                                                format: "dd/MM/yyyy",
                                                //value: iData.ERODate03,
                                                width: 110,
                                                editorOptions: { width: 110, }, //showClearButton: true, value: iData.ERODate03
                                                visible: true,
                                            },
                                            {
                                                dataField: "EROCode03",
                                                caption: "Company's Mobile Phone*",
                                                editorType: "dxTextBox",
                                                width: 100,
                                                editorOptions: { width: 100 },
                                                visible: true,
                                            },
                                            {
                                                caption: "ROAMING INFORMATION",
                                                visible: true,
                                                width: 300,
                                                headerCellTemplate: function (header, info) {
                                                    $('<div>')
                                                        .html(info.column.caption)
                                                        .addClass('centered-header')
                                                        .appendTo(header);
                                                    header.parent().css("backgroundColor", "#e7d5ff");
                                                },
                                                columns: [
                                                    {
                                                        dataField: "EROCode04",
                                                        caption: "Call",
                                                        headerCellTemplate: function (header, info) {
                                                            $('<div>')
                                                                .html(info.column.caption)
                                                                .addClass('centered-header')
                                                                .appendTo(header);
                                                            header.parent().css("backgroundColor", "#e7d5ff");
                                                        },
                                                        editorType: "dxSelectBox",
                                                        width: 80,
                                                        editorOptions: {
                                                            width: 80,
                                                            dataSource: aObjects.aaYesNoList, //aaYesNoList
                                                            searchExpr: "Code",
                                                            valueExpr: "Code",
                                                            displayExpr: "Code",
                                                            searchEnabled: true,
                                                        }, // readOnly: !aRoamL
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "EROCode05",
                                                        caption: "Internet",
                                                        headerCellTemplate: function (header, info) {
                                                            $('<div>')
                                                                .html(info.column.caption)
                                                                .addClass('centered-header')
                                                                .appendTo(header);
                                                            header.parent().css("backgroundColor", "#e7d5ff");
                                                        },
                                                        editorType: "dxSelectBox",
                                                        width: 80,
                                                        editorOptions: {
                                                            width: 80,
                                                            dataSource: aObjects.aaYesNoList, //aaYesNoList
                                                            searchExpr: "Code",
                                                            valueExpr: "Code",
                                                            displayExpr: "Code",
                                                            searchEnabled: true,
                                                        }, // readOnly: !aRoamL
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "ERORefNo2",
                                                        caption: "HR Arrangement",
                                                        headerCellTemplate: function (header, info) {
                                                            $('<div>')
                                                                .html(info.column.caption)
                                                                .addClass('centered-header')
                                                                .appendTo(header);
                                                            header.parent().css("backgroundColor", "#e1cbf5");
                                                        },
                                                        editorType: "dxTextBox",
                                                        width: 180,
                                                        editorOptions: { width: 180, }, // readOnly: !aRoamL
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "EROAmount5",
                                                        caption: "Amount",
                                                        headerCellTemplate: function (header, info) {
                                                            $('<div>')
                                                                .html(info.column.caption)
                                                                .addClass('centered-header')
                                                                .appendTo(header);
                                                            header.parent().css("backgroundColor", "#e1cbf5");
                                                        },
                                                        dataType: "number",
                                                        format: { type: "fixedPoint", precision: 2 },
                                                        editorType: "dxNumberBox",
                                                        editorOptions: { format: "#,##0.00", width: 120 },
                                                        width: 120,
                                                        visible: true,
                                                    },
                                                ],
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
                                                    //          summaryType: "max",
                                                    //          valueFormat: "currency",
                                                    //          showInGroupFooter: false,
                                                    //          alignByColumn: true            
                                                    displayFormat: "{0} Items",
                                                },
                                                {
                                                    column: "RefundedAmount",
                                                    summaryType: "sum",
                                                    //          summaryType: "max",
                                                    valueFormat: "#,##0.00", //"currency",
                                                    //          showInGroupFooter: false,
                                                    //          alignByColumn: true            
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
                                                        onClick: function () {
                                                            aAddStaff.refresh();
                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                            $("#Add-Form").dxDataGrid("instance").refresh();
                                                        }
                                                    }
                                                },
                                                {
                                                    location: "before",
                                                    template: function () { return $("<div style='padding: 5px 15px;'/>") }
                                                },
                                                /*{
                                                    location: "after",
                                                    widget: "dxButton",
                                                    options: {
                                                        icon: "fas fa-info",
                                                        text: "HELP",
                                                        type: "success",
                                                        stylingMode: "contained",
                                                        onClick: function () {
                                                            //dataGrid.refresh();
                                                            aPopupHelp()
                                                        }
                                                    }
                                                }*/
                                            );
                                        }

                                    }).dxDataGrid("instance");

                                    /**
                                        * @param cellElement (datagrid)
                                        * @param cellinfo (datagrid)
                                        * @return AccountCode 
                                        * 
                                        * Dropdown Benefits array for DataGrid
                                    */
                                    function dropDownBoxACC(cellElement, cellInfo) {
                                        return $("<div>").dxDropDownBox({
                                            dropDownOptions: { width: 800 },
                                            dataSource: aaSubGroup01,
                                            value: [cellInfo.value],
                                            valueExpr: "EDESC",
                                            displayExpr: "EDESC",
                                            contentTemplate: function (e) {
                                                return $("<div>").dxDataGrid({
                                                    dataSource: aaSubGroup01,
                                                    //remoteOperations: true, // IDNO,BenefitLevel,FamilyReimbursement,AllowSSO,OPDLimitperrequest,OPDLimitperyear,MaternityLimitperyear,IPDLimitpercase,FleetLimit,PositionGroup,NOTE,EntryBy,EntryDate
                                                    columns: [{ dataField: "EDESC", caption: "Eng Desc. ", width: 200, sortOrder: "asc" }, { dataField: "TDESC", caption: "Thai  Desc", width: 280 }, { dataField: "ACCCODE", caption: "Account Code", width: 100 }],
                                                    hoverStateEnabled: true,
                                                    searchPanel: { visible: true },
                                                    headerFilter: { visible: true },
                                                    paging: { enabled: true, pageSize: 20 },
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
                                                        //console.log(sArgs.selectedRowKeys[0].EDESC)
                                                        e.component.option("value", sArgs.selectedRowKeys[0].EDESC); // Works but Error Need to correct next time !!!
                                                        cellInfo.setValue(sArgs.selectedRowKeys[0].EDESC);
                                                        if (sArgs.selectedRowKeys.length > 0) {
                                                            e.component.close();
                                                        }
                                                    }
                                                });
                                            },
                                        });
                                    }

                                    /**
                                        * @param {array} ACCOUNT
                                        * @param {string} "NAME"
                                        * @param {string} "name value"
                                        * return json array results
                                        * example aSearch2json(aaEmployee, "EMPCode", value) value = employee code value
                                        * @copyright wikran 2023
                                        */
                                    const aSearch2json = (arr, searchKey, searchValue) => {
                                        const results = []; // Initialize an empty array to store the matching objects
                                        for (const obj of arr) { // Loop through each object in the array
                                            if (obj[searchKey] === searchValue) { // Check if the object has the matching search key
                                                results.push(obj); // Add the matching object to the results array
                                            }
                                        }
                                        return results; // Return the array of matching objects
                                    }

                                });
                            }
                            

                        /*     const aHODApproveSS = (iData) => {
                                if (aHODApproveSS_Running) return;
                                aHODApproveSS_Running = true;
                            
                                console.log(iData.Vendor01Note, iData.ERORefNo6, iData.ExpGroupCode);
                                console.log(asFullName);
                            
                                let aERStatusCH = "HOD Approved wait for ADMIN";
                                if (iData.EROCheck03 && !iData.EROCheck02) {
                                    aERStatusCH = "HOD Approved (finished)";
                                } else if (iData.EROCheck03 && iData.EROCheck02) {
                                    aERStatusCH = "HOD Approved wait for HR";
                                }
                                console.log(`aERStatusCH = ${aERStatusCH}`);
                            
                                const aRequesterName = iData.PayToName;
                                const aRequesterEmail = iData.ERODesc06;
                                const aaHODAll4Chk = iData.Vendor01Note;
                                let aApprovalDateFN = "HODApprovedDate";
                                const aNowDateT = aNowText();
                            
                                if (aaHODAll4Chk === "" && iData.ExpGroupCode !== "200") {
                                    DevExpress.ui.dialog.alert("This record is not valid, no approval group", "ERROR")
                                        .done(() => { aHODApproveSS_Running = false; });
                                    return;
                                }
                            
                                let aaCnfTitle = "ERROR !!";
                                let aaCnfBody = "";
                                let aTrueORFalse = "0";
                                let aTrueORFalseB = false;
                                let aTrueORFalse3 = iData.EROCheck03 ? "1" : "0";
                                let aTrueORFalseB3 = iData.EROCheck03;
                                let aERStatus = "";
                                let xxNextAppEmailxx = "", xxNextApproverxx = "";
                            
                                if (iData.ExpGroupCode === "200") {
                                    aaCnfTitle = "APPROVE ?";
                                    aaCnfBody = `Press 'YES' to Approve Fleet Card and Send Mail to ${aRequesterName} Email ${aRequesterEmail}`;
                                    aTrueORFalse = "1";
                                    aTrueORFalseB = true;
                                    aERStatus = aERStatusCH;
                                    console.log("Fleet Card / Next A to Requester");
                                } else {
                                    const xxChkEmailxx = aTranTextJson(aaHODAll4Chk, "MAIL:", "RANG:");
                                    const xxChkNamexx = aTranTextJson(aaHODAll4Chk, "NAME:", "MAIL:");
                                    const xxNofChk = xxChkNamexx.length;
                                    let anLno, aiFoundA = false;
                            
                                    for (let i = 0; i < xxChkNamexx.length; i++) {
                                        if (asFullName === xxChkNamexx[i]) {
                                            anLno = i;
                                            aiFoundA = true;
                                            break;
                                        }
                                    }
                            
                                    if (!aiFoundA) {
                                        aaCnfBody = `ERROR - Approval Process, this is not your approval record. Please contact administrator.<br> Approver should be ${xxChkNamexx[0]}`;
                                    } else {
                                        const buildBody = (role, emailNote) =>
                                            `Press [YES] to Approve and Send Mail to ${aRequesterName} Email [${aRequesterEmail}]<br>${emailNote}<br>UPDATED STATUS = ${aERStatusCH}`;
                            
                                        switch (anLno) {
                                            case 0:
                                                aApprovalDateFN = "HODApprovedDate";
                                                if (xxNofChk === 1) {
                                                    aaCnfTitle = "APPROVE ?";
                                                    if (iData.EROCheck03 && !iData.EROCheck02) {
                                                        aaCnfBody = buildBody("FA", `Send INFO eMail to FA Dept. ${aaFXAppName} [${aaFXAppEmail}]<br>[SELF BOOKING]`);
                                                    } else if (iData.EROCheck03 && iData.EROCheck02) {
                                                        aaCnfBody = buildBody("HR", `Send Mail to HR Dept. ${aaHRAppName} [${aaHRAppEmail}]<br>[SELF BOOKING]`);
                                                    } else {
                                                        aaCnfBody = buildBody("ADMIN", `Send Mail to ADMIN Dept. ${aaADAppName} [${aaADAppEmail}]<br>[ADMIN BOOKING]`);
                                                    }
                                                    aTrueORFalse = "1";
                                                    aTrueORFalseB = true;
                                                    aERStatus = aERStatusCH;
                                                } else {
                                                    xxNextApproverxx = xxChkNamexx[anLno + 1];
                                                    xxNextAppEmailxx = xxChkEmailxx[anLno + 1];
                                                    aaCnfTitle = "VERIFY ?";
                                                    aaCnfBody = `Press 'YES' to Verify and Send Mail to ${xxNextApproverxx} [Email ${xxNextAppEmailxx}] <br> For next verify or approve.`;
                                                    aERStatus = "Confirmed wait for HOD";
                                                }
                                                break;
                            
                                            case 1:
                                                aApprovalDateFN = "ERODate04";
                                                if (xxNofChk === 2) {
                                                    aaCnfTitle = "APPROVE ?";
                                                    if (iData.EROCheck03 && !iData.EROCheck02) {
                                                        aaCnfBody = buildBody("FA", `Send INFO eMail to FA Dept. ${aaFXAppName} [${aaFXAppEmail}]<br>[SELF BOOKING]`);
                                                    } else if (iData.EROCheck03 && iData.EROCheck02) {
                                                        aaCnfBody = buildBody("HR", `Send Mail to HR Dept. ${aaHRAppName} [${aaHRAppEmail}]<br>[SELF BOOKING]`);
                                                    } else {
                                                        aaCnfBody = buildBody("ADMIN", `Send Mail to ADMIN Dept. ${aaADAppName} [${aaADAppEmail}]<br>[ADMIN BOOKING]`);
                                                    }
                                                    aTrueORFalse = "1";
                                                    aTrueORFalseB = true;
                                                    aERStatus = aERStatusCH;
                                                } else {
                                                    xxNextApproverxx = xxChkNamexx[anLno + 1];
                                                    xxNextAppEmailxx = xxChkEmailxx[anLno + 1];
                                                    aaCnfTitle = "VERIFY ?";
                                                    aaCnfBody = `Press 'YES' to Verify and Send Mail to ${xxNextApproverxx} [Email ${xxNextAppEmailxx}] <br> For next verify or approve.`;
                                                    aERStatus = "Confirmed wait for HOD";
                                                }
                                                break;
                            
                                            case 2:
                                                aApprovalDateFN = "PBatchDate";
                                                aaCnfTitle = "APPROVE ?";
                                                if (iData.EROCheck03 && !iData.EROCheck02) {
                                                    aaCnfBody = buildBody("FA", `Send INFO eMail to FA Dept. ${aaFXAppName} [${aaFXAppEmail}]<br>[SELF BOOKING]`);
                                                } else if (iData.EROCheck03 && iData.EROCheck02) {
                                                    aaCnfBody = buildBody("HR", `Send Mail to HR Dept. ${aaHRAppName} [${aaHRAppEmail}]<br>[SELF BOOKING]`);
                                                } else {
                                                    aaCnfBody = buildBody("ADMIN", `Send Mail to ADMIN Dept. ${aaADAppName} [${aaADAppEmail}]<br>[ADMIN BOOKING]`);
                                                }
                                                aTrueORFalse = "1";
                                                aTrueORFalseB = true;
                                                aERStatus = aERStatusCH;
                                                break;
                                        }
                                    }
                                }
                            
                                // 🔔 Show Confirmation or Alert
                                const finalize = () => { aHODApproveSS_Running = false; };
                                if (aaCnfTitle === "ERROR !!") {
                                    DevExpress.ui.dialog.alert(aaCnfBody, aaCnfTitle).done(finalize);
                                    return;
                                }
                            
                                DevExpress.ui.dialog.confirm(aaCnfBody, aaCnfTitle).done(function (dresult) {
                                    if (!dresult) {
                                        finalize();
                                        return;
                                    }
                            
                                    const aGDescENG = iData.ExpGroupDescEng;
                                    let aObjKeyData = {
                                        REFNO: iData.REFNO,
                                        HODApproved: aTrueORFalseB,
                                        Approved: aTrueORFalseB3,
                                        ERStatus: aERStatus,
                                        Vendor02Note: xxNextApproverxx
                                    };
                                    aObjKeyData[aApprovalDateFN] = new Date();
                            
                                    const aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            
                                    let aSQLCommand = `use ExtraOnLine; UPDATE EXPREIM SET HODApproved = ${aTrueORFalse}, Approved = ${aTrueORFalse3}, ERStatus = '${aERStatus}', ${aApprovalDateFN} = '${aNowDateT}'`;
                                    if (aTrueORFalse === "0") {
                                        aSQLCommand += `, Vendor02Note = '${xxNextApproverxx}', ERORefNo6 = '${xxNextAppEmailxx}'`;
                                    }
                                    aSQLCommand += ` Where HeadRefNo = '${iData.HeadRefNo}'`;
                            
                                    for (let i = 0; i < 3; i++) aSQLAction(aaPFDMI, aSQLCommand);
                            
                                    $("#gridContainer").dxDataGrid("instance").refresh();
                            
                                    // ✉️ Send Emails (same logic as before) — keep or optimize further
                                    // 📢 ALERTS — Show result and then finalize
                                    setTimeout(() => {
                                        if (aTrueORFalse === "1") {
                                            aMessageAlert("Already Approved", "DarkGreen").then(finalize);
                                        } else {
                                            aMessageAlert("Already Verified and sent to " + xxNextApproverxx, "DarkGreen").then(finalize);
                                        }
                                        popup.hide();
                                    }, 500);
                                });
                            }; */
                            


                            // function for TRF HOD Approve INTERNAL only
                             const aHODApproveSS = (iData) => {
                                console.log(iData.Vendor01Note, iData.ERORefNo6, iData.ExpGroupCode)
                                console.log(asFullName)
                                //alert(`SELF BOOKING = ${iData.EROCheck03} ROAMING = ${iData.EROCheck02}`)
                                var aERStatusCH = "HOD Approved wait for ADMIN" //ADMIN BOOKING

                                if (iData.EROCheck03 && !iData.EROCheck02) { // SELF BOOKING no Roaming
                                    aERStatusCH = "HOD Approved (finished)"
                                } else if (iData.EROCheck03 && iData.EROCheck02) { // SELF BOOKING with Roaming
                                    aERStatusCH = "HOD Approved wait for HR"
                                }
                                console.log(`aERStatusCH =${aERStatusCH}`)
                                // aaHRAppName, aaHRAppEmail, aaFXAppName, aaFXAppEmail, aaADAppName, aaADAppEmail
                                var aRequesterName = iData.PayToName //"Wikran Intaraprajaks" iData.HeadRefNo
                                var aRequesterEmail = iData.ERODesc06 //"wikran@lockton.com"
                                var aaHODAll4Chk = iData.Vendor01Note
                                var aApprovalDateFN = "HODApprovedDate"; // ERODate02
                                var aNowDateT = aNowText()
                                if (aaHODAll4Chk === "" && iData.ExpGroupCode !== "200") { // not use
                                    DevExpress.ui.dialog.alert("This record is not valid, no approval group", "ERROR");
                                }
                                if (iData.ExpGroupCode === "200") { // not use
                                    aaCnfTitle = "APPROVE ?"
                                    aaCnfBody = "Press 'YES' to Approve Fleet Card and Send Mail to " + aRequesterName + " Email " + aRequesterEmail
                                    aTrueORFalse = "1";
                                    aTrueORFalseB = true;
                                    aERStatus = aERStatusCH; //"HOD Approved wait for ADMIN";
                                    console.log("Fleet Card / Next A to Requester");
                                } else {
                                    var aiFoundA = false;
                                    var xxChkEmailxx = aTranTextJson(aaHODAll4Chk, "MAIL:", "RANG:")
                                    var xxNofChk = xxChkEmailxx.length
                                    var xxChkNamexx = aTranTextJson(aaHODAll4Chk, "NAME:", "MAIL:")
                                    var xxChkRangexx = aTranTextJson(aaHODAll4Chk, "RANG:", "")
                                    var aTrueORFalse = "0"; //(iData.HODApproved === true ? '0' : '1');
                                    var aTrueORFalseB = false; //(iData.HODApproved === true ? false : true);
                                    var aTrueORFalse3 = iData.EROCheck03 ? "1" : "0";     // let ADMIN Approve true if SELF Booking
                                    var aTrueORFalseB3 = iData.EROCheck03 ? true : false; // let ADMIN Approve true if SELF Booking
                                    var xxNextAppEmailxx;
                                    var xxNextApproverxx;
                                    var aERStatus = ""; //"Register" // Confirmed wait for HOD // "HOD Approved wait for FA";
                                    //var aApprovalDateFN = "ERODate02";
                                    //var aNowDateT = aNowText()
                                    // aaHRAppName, aaHRAppEmail, aaFXAppName, aaFXAppEmail, aaADAppName, aaADAppEmail

                                    //console.log(xxChkNamexx.length)
                                    var anLno;
                                    for (let i = 0; i < xxChkNamexx.length; i++) {
                                        if (asFullName === xxChkNamexx[i]) {
                                            anLno = i
                                            aiFoundA = true;
                                            break;
                                        }
                                    }
                                    //console.log(asFullName)
                                    var aaCnfTitle = "ERROR !!";
                                    var aaCnfBody = "ERROR - Approval Process, this is not your approval record please contact administrator <br> Approver should be " + xxChkNamexx[0];
                                    console.log("found=", anLno, "No of Arr=", xxNofChk)
                                    console.log(aiFoundA)
                                    //alert(`SELF BOOKING = ${asEROCheck03} ROAMING = ${asEROCheck02}`)  // aERStatus = "HOD Approved wait for HR"/ "HOD Approved (finished)"
                                    // aaHRAppName, aaHRAppEmail, aaFXAppName, aaFXAppEmail, aaADAppName, aaADAppEmail

                                    if (anLno === 0) { // found in 1 (first approver)
                                        aApprovalDateFN = "HODApprovedDate"; //ERoDate02
                                        if (xxNofChk === 1) { //1 Approver
                                            aaCnfTitle = "APPROVE ?"
                                            aaCnfBody = "Press [YES] to Approve and Send Mail to ";
                                            if (iData.EROCheck03 && !iData.EROCheck02) { // self no roaming
                                                aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send INFO eMail to FA Dept. ${aaFXAppName} [${aaFXAppEmail}]<br> UPDATED STATUS = ${aERStatusCH}<br>[SELF BOOKING]`;
                                            } else if (iData.EROCheck03 && iData.EROCheck02) { // self roaming
                                                aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to HR Dept. ${aaHRAppName} [${aaHRAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [SELF BOOKING]`;
                                            }
                                            if (!iData.EROCheck03) { // ADMIN BOOKING
                                                aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to ADMIN Dept. ${aaADAppName} [${aaADAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [ADMIN BOOKING]`;
                                            }
                                            aTrueORFalse = "1"; // approval date = ERODate02
                                            aTrueORFalseB = true;
                                            aERStatus = aERStatusCH; //"HOD Approved wait for ADMIN";
                                            //console.log("Next A to Requester");
                                        } else { // more than 1 Approver 
                                            xxNextApproverxx = xxChkNamexx[anLno + 1]
                                            xxNextAppEmailxx = xxChkEmailxx[anLno + 1] // to ERORefNo06 xxChkEmailxx                                            
                                            aaCnfTitle = "VERIFY ?"
                                            aaCnfBody = "Press 'YES' to Verify and Send Mail to " + xxNextApproverxx + " [Email " + xxNextAppEmailxx + "] <br> For next verify or approve."
                                            aTrueORFalse = "0"; // approval date = ERODate02
                                            aTrueORFalseB = false;
                                            aERStatus = "Confirmed wait for HOD";
                                            console.log("Next A", xxNextApproverxx)
                                        }
                                    } else if (anLno === 1) { // found in 2 (second approver)
                                        aApprovalDateFN = "ERODate04"; //EORDate03
                                        if (xxNofChk === 2) { // 2 Approvers
                                            aaCnfTitle = "APPROVE ?"
                                            aaCnfBody = "Press [YES] to Approve and Send Mail to ";
                                            if (iData.EROCheck03 && !iData.EROCheck02) { // self no roaming
                                                aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send INFO eMail to FA Dept. ${aaFXAppName} [${aaFXAppEmail}]<br> UPDATED STATUS = ${aERStatusCH}<br>[SELF BOOKING]`;
                                            } else if (iData.EROCheck03 && iData.EROCheck02) { // self roaming
                                                aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to HR Dept. ${aaHRAppName} [${aaHRAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [SELF BOOKING]`;
                                            }
                                            if (!iData.EROCheck03) { // admin booking
                                                aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to ADMIN Dept. ${aaADAppName} [${aaADAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [ADMIN BOOKING]`;
                                            }

                                            aTrueORFalse = "1"; // approval date = ERODate03
                                            aTrueORFalseB = true;
                                            aERStatus = aERStatusCH; //"HOD Approved wait for ADMIN";
                                            console.log("Next A to Requester");
                                        } else { // more than 2 Approvers
                                            xxNextApproverxx = xxChkNamexx[anLno + 1]
                                            xxNextAppEmailxx = xxChkEmailxx[anLno + 1] // to ERORefNo06 xxChkEmailxx                                            
                                            aaCnfTitle = "VERIFY ?"
                                            aaCnfBody = "Press 'YES' to Verify and Send Mail to " + xxNextApproverxx + " [Email " + xxNextAppEmailxx + "] <br> For next verify or approve."
                                            aTrueORFalse = "0"; // approval date = ERODate03
                                            aTrueORFalseB = false;
                                            aERStatus = "Confirmed wait for HOD";
                                            console.log("Next A", xxNextApproverxx)
                                        }
                                    } else if (anLno === 2) {       // found in 3 (third approver)
                                        aApprovalDateFN = "PBatchDate"; //ERODate04
                                        aaCnfTitle = "APPROVE ?"
                                        aaCnfBody = "Press [YES] to Approve and Send Mail to ";
                                        if (iData.EROCheck03 && !iData.EROCheck02) {
                                            aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send INFO eMail to FA Dept. ${aaFXAppName} [${aaFXAppEmail}]<br> UPDATED STATUS = ${aERStatusCH}<br>[SELF BOOKING]`;
                                        } else if (iData.EROCheck03 && iData.EROCheck02) {
                                            aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to HR Dept. ${aaHRAppName} [${aaHRAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [SELF BOOKING]`;
                                        }
                                        if (!iData.EROCheck03) {
                                            aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to ADMIN Dept. ${aaADAppName} [${aaADAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [ADMIN BOOKING]`;
                                        }

                                        aTrueORFalse = "1"; // approval date = ERODate04
                                        aTrueORFalseB = true;
                                        aERStatus = aERStatusCH; //"HOD Approved wait for ADMIN";
                                        console.log("Next A to Requester");
                                    }
                                    //console.log("TEST", xxChkNamexx, xxChkEmailxx, xxChkRangexx)
                                }

                                if (aaCnfTitle === "ERROR !!") {
                                    DevExpress.ui.dialog.alert(aaCnfBody, aaCnfTitle);
                                } else {

                                    let result = DevExpress.ui.dialog.confirm(aaCnfBody, aaCnfTitle); //+ "<br>?? 'YES' 
                                    result.done(function (dresult) {
                                        if (dresult) {
                                            //Approved = " + aTrueORFalse 
                                            var aGDescENG = iData.ExpGroupDescEng
                                            if (aApprovalDateFN === "HODApprovedDate") { //ERODate02
                                                var aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, Approved: aTrueORFalseB3, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, HODApprovedDate: new Date() }; //ReqDate: new Date()
                                            } if (aApprovalDateFN === "ERODate04") { //ERODate03
                                                var aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, Approved: aTrueORFalseB3, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, ERODate04: new Date() }; //ReqDate: new Date()
                                            } if (aApprovalDateFN === "PBatchDate") { //ERODate01
                                                var aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, Approved: aTrueORFalseB3, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, PBatchDate: new Date() }; //ReqDate: new Date()
                                            }
                                            var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                            //update to table
                                            sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                            if (aTrueORFalse === "1") {
                                                var aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET HODApproved = " + aTrueORFalse + ", Approved = " + aTrueORFalse3 + ", ERStatus = '" + aERStatus + "', " + aApprovalDateFN + " = '" + aNowDateT + "' Where HeadRefNo = '" + iData.HeadRefNo + "'"
                                            } else {
                                                var aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET HODApproved = " + aTrueORFalse + ", Approved = " + aTrueORFalse3 + ", ERStatus = '" + aERStatus + "', " + aApprovalDateFN + " = '" + aNowDateT + "', Vendor02Note = '" + xxNextApproverxx + "', ERORefNo6 = '" + xxNextAppEmailxx + "' Where HeadRefNo = '" + iData.HeadRefNo + "'"
                                            }
                                            console.log(aSQLCommand)
                                            //alert(aSQLCommand)
                                            // update to table

                                            aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                            aSQLAction(aaPFDMI, aSQLCommand)
                                            aSQLAction(aaPFDMI, aSQLCommand)

                                            //e.component.refresh(true);
                                            //e.component.refresh(true);
                                            //e.component.refresh(true);
                                            //e.event.preventDefault();
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            $("#gridContainer").dxDataGrid("instance").refresh();

                                            //send Email
                                            var aRefNoa = iData.HeadRefNo;
                                            var aMessage01;
                                            var aaMailTitle;
                                            var aaMessTitle;
                                            let aApproverName = aaHODAppName //+ ", [HOD]"  
                                            let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                            // aaHRAppName, aaHRAppEmail, aaFXAppName, aaFXAppEmail, aaADAppName, aaADAppEmail
                                            //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"

                                            let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Travel Requisition</a>";
                                            if (aTrueORFalse === "1") {
                                                aaMailTitle = aGDescENG.toUpperCase() + " - HOD APPROVED";
                                                aaMessTitle = aGDescENG.toUpperCase() + " <br> HOD APPROVED";
                                                aMessage01 = "<div>TO " + aRequesterName + "<br><br>  Already Approved " + aGDescENG + " Refno " + iData.HeadRefNo + "<br> LINK -->" + aAddress2Do + "<br><br><b>" + aApproverName + "</b></div>"
                                            } else {
                                                aaMailTitle = aGDescENG.toUpperCase() + "  - NEED VERIFY/APPROVE";
                                                aaMessTitle = aGDescENG.toUpperCase() + " <br> NEED VERIFY/APPROVE";
                                                aMessage01 = "<div>Dear Khun " + xxNextApproverxx + "<br><br>  Please verify or approve " + aGDescENG + " Refno " + iData.HeadRefNo + "<br> LINK -->" + aAddress2Do + "<br><br><b>" + aApproverName + "</b></div>"
                                            }
                                            // Mail To Requester OR 2/3 HOD
                                            var aBookingOptions = iData.EROCheck03 ? "SELF BOOKING [HOD->HR]" : "ADMIN BOOKING [HOD->ADMIN->HR]"
                                            let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName, aaADAppName: aaADAppName, aaFAAppName: aaFAAppName, aaFXAppName: aaFXAppName, aaHRAppName: aaHRAppName, aBookingOptions: aBookingOptions, aaMessTitle: aaMessTitle, aMessage01: aMessage01 }
                                            aMessage01 = aArrays.ACONFIRM[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match)
                                            var aMessageAD01 = aArrays.ACONFIRM[1].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match)
                                            var aMessageHR01 = aArrays.ACONFIRM[2].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match)
                                            var aMessageFA01 = aArrays.ACONFIRM[3].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match)
                                            
                                            // Mail to Requester or next HOD
                                            var aSubject = aaMailTitle
                                            var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #00C510; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMessTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#CEFDD2;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                            // Mail To ADMIN 
                                            var aADSubject = aaMailTitle + " (For ADMIN)"
                                            //var aMessageAD01 = aEmailTRF[0] + aaADAppName + "</b><br><br>&nbsp;&nbsp;&nbsp;" + aGDescENG + " <br>&nbsp;&nbsp;&nbsp;REFNO = [" + iData.HeadRefNo + "] already approved by HOD <br><br>&nbsp;&nbsp;&nbsp;Verify at " + aAddress2Do + " (menu ADMIN Approve) <br><br><br><b>HOD</b><br></div>"
                                            var aMessageAD = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #00C510; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EFFFEA;'><div style='margin: 5px 2px 10px 10px;'>" + aMessageAD01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
               
                                            // Mail To HR
                                            var aHRSubject = aaMailTitle + " (For HR)"
                                            //var aMessageHR01 = aEmailTRF[0] + aaHRAppName + "</b><br><br>&nbsp;&nbsp;&nbsp;" + aGDescENG + " <br>&nbsp;&nbsp;&nbsp;REFNO = [" + iData.HeadRefNo + "] already approved by HOD <br><br>&nbsp;&nbsp;&nbsp;Verify at " + aAddress2Do + " (menu ADMIN Approve) <br><br><br><b>HOD</b><br></div>"
                                            var aMessageHR = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #00C510; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EFFFEA;'><div style='margin: 5px 2px 10px 10px;'>" + aMessageHR01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                            // Mail To FA
                                            var aFASubject = aaMailTitle + " (TO FA - Information Only)"
                                            //var aMessageFA01 = aEmailTRF[0] + aaADAppName + "</b><br><br>&nbsp;&nbsp;&nbsp;" + aGDescENG + " <br>&nbsp;&nbsp;&nbsp;REFNO = [" + iData.HeadRefNo + "] already approved by HOD <br><br>&nbsp;&nbsp;&nbsp;Verify at " + aAddress2Do + " (menu ADMIN Approve) <br><br><br><b>HOD</b><br></div>"
                                            var aMessageFA = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #00C510; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EFFFEA;'><div style='margin: 5px 2px 10px 10px;'>" + aMessageFA01 + "</div></td></tr></table></center><br><br><br></div></body></html>"


                                            if (aTrueORFalse === "1") {
                                                //send mail to requester & (if ADMIN BOOKING send to admin) OR HR if roaming
                                              
                                                aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)
                                                aMessageAlert("Already Approved and send EMAIL TO ADMIN <br>" + aMessage, "DarkGreen");
                                                if (!iData.EROCheck03) { //ADMIN BOOKING send to ADMIN
                                                    aSendMailDMZ(" " + aaADAppName, aaADAppEmail, aRequesterEmail, "", "", aADSubject, aMessageAD)                                                    
                                                    aMessageAlert("Already Approved and send EMAIL TO ADMIN <br>" + aMessageAD, "DarkGreen");
                                                }
                                                if (iData.EROCheck03 && iData.EROCheck02) { //SELF and Roaming SEND TO HR
                                                    aSendMailDMZ(" " + aaHRAppName, aaHRAppEmail, aRequesterEmail, "", "", aHRSubject, aMessageHR)
                                                    aMessageAlert("Already Approved and send EMAIL TO HR <br>" + aMessageHR, "DarkGreen");
                                                }
                                                if (iData.EROCheck03 && !iData.EROCheck02) { //SELF BOOKING Only not send to HR Send to FA
                                                    aSendMailDMZ(" " + aaFXAppName, aaFXAppEmail, aRequesterEmail, "", "", aFASubject, aMessageFA)
                                                    aMessageAlert("Already Approved send Infomation EMAIL TO FA <br>" + aMessageFA, "DarkGreen");
                                                }

                                            } else { //send mail to next HOD
                                                aSendMailDMZ(" " + xxNextApproverxx, xxNextAppEmailxx, aApproverEmail, "", "", aSubject, aMessage)
                                                aMessageAlert("Already Verified and Send Mail to " + xxNextApproverxx + " (" + xxNextAppEmailxx + ")", "DarkGreen");
                                            }
                                            //e.component.refresh(true);
                                            //e.component.refresh(true);
                                            //e.component.refresh(true);
                                            //e.event.preventDefault();
                                            //aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)                                    
                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            //ALERT to show the email 
                                           /*  if (aTrueORFalse === "1") {
                                                (async () => {
                                                    if (!iData.EROCheck03) { //&& !iData.EROCheck02
                                                        await aMessageAlert("Already Approved and send EMAIL TO ADMIN <br>" + aMessageAD, "DarkGreen");
                                                    } else if (iData.EROCheck03 && iData.EROCheck02) {
                                                        await aMessageAlert("Already Approved and send EMAIL TO HR <br>" + aMessageHR, "DarkGreen");
                                                    } else if (iData.EROCheck03 && !iData.EROCheck02) {
                                                        await aMessageAlert("Already Approved send Infomation EMAIL TO FA <br>" + aMessageFA, "DarkGreen");
                                                    }
                                                    await aMessageAlert("Already Approved and send EMAIL Requester <br>" + aMessage, "DarkGreen");
                                                    // popup.hide(); // Uncomment if needed after all messages
                                                })();
                                            } else {
                                                aMessageAlert("Already Verified and Send Mail to " + xxNextApproverxx + " (" + xxNextAppEmailxx + ")", "DarkGreen");
                                                // popup.hide();
                                            } */
                                            //popup.hide();
                                        }
                                    });
                                }

                            } //func hod 

                        }) //then fetch (HOR or HR Email get inside better ?)
                        .catch(error => console.error("Error fetching SQL data:", error)); // load loadsqldata
                }); // load content    
        });
        // TOP PRG
    });  // ajax        
