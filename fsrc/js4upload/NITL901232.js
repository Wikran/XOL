//LImit Program
// window.onload = function () {
//     setTimeout(function () {
//         location.reload();
//     }, 2400000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
// }

$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
/**
 * Global variables
 * aaPFDMI = URL for API (https://cbsdev2.locktonwattana.com)
 * aaXToX = user public token key
 * */
var aaPFDMI = isLocalHost();
var aaXToX = localStorage["aaXXoX"];

/**
 * @param {array} Employee
 * @param {string} "EMPID   "
 * @param {string} "EMPNAME"
 * @param {string} "Employee ID value"
 * return string results
 * example aArrfindValByKey(aaEmployee, "EMPCode", "EMPNAME", value) value = employee code value
 * @copyright wikran 2023
 */
const aArrfindValByKey = (arr, searchKey, returnValue, searchValue) => {
    const item = arr.find(e => e[searchKey] === searchValue); // Search for the object with the matching key-value pair
    if (item) {
        return item[returnValue]; // Return the value of the specified key if the object is found
    } else {
        return null; // Return null if the object is not found
    }
};

/**
 * @param {array} Employee
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

var xxchkxx = typeof param1 === "undefined" ? "NO" : param1;
//var aaPXIXD = localStorage["aPXIXD"];
var aaPXIXD = xxchkxx === "NO" ? localStorage["aPXIXD"] : param1;
var aaEnt = aaPXIXD.includes("X");
//var aaKeyField = localStorage["aaXKFX"];
//var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var aDBServerName;
var aDBEMPServerName;
var aEMPPDFI = aaPFDMI;
if (aaPFDMI === "https://webspace.locktonwattana.com") {
    aDBServerName = "[lockthbnk-db02]"
    aDBEMPServerName = aDBServerName;
} else if (aaPFDMI === "https://cbsdev3.locktonwattana.com") {
    aDBServerName = "[lockthbnk-db02]"
    aDBEMPServerName = aDBServerName;
} else if (aaPFDMI === "https://cbsdev2.locktonwattana.com") {
    aDBServerName = "[lockthbnk-ap14]"
    aDBEMPServerName = aDBServerName;
} else {
    aDBServerName = "[WIKRAN-W10]"
    aDBEMPServerName = "[lockthbnk-ap14]"
    aEMPPDFI = "https://cbsdev2.locktonwattana.com";
}
var aaPFDMZz = "https://cbsdev3.locktonwattana.com"; //"https://cbsdev2.locktonwattana.com"; // API for DMZ only

var aDatabasea = "ExtraOnLine.dbo.TRVREQF";
var aKeyField = "HeadRefNo"
var aKeyIDa = "T2408152724" //aaiHeadRef //
var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";

async function aaLoadData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, condition) {
    //let aDataBasea = "ExtraOnLine.dbo.EXPREIM";
    //let aKeyfield = "HeadRefNo";
    let aTokena = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
    // console.log("Inside aaLoadData aKeya = ", aKeya);
    let axqr2S = `Where ${aKeyfield} LIKE '%${aKeya}%'`;
    // console.log("Inside aaLoadData axqr2S = ", axqr2S)
    //let axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";
    let axFullBody = "Select " + axFieldSelected + " From " + aDataBasea + " " + axqr2S;

    let response = await fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + aTokena, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "@": btoa(axFullBody) }),
        redirect: "follow"
    });

    let acData = await response.json();
    //const filteredArray = acData.filter(item => item.Amount === 0 || item.ERODesc02 === "" || item.ERODesc03 === "" || item.ERODesc04 === "" || item.ERORefNo3 === "" || item.RefundedAmount === 0 || item.Xrate === 0);
    // console.log("record ", acData.length);
    // console.log(acData);
    const filteredArray = acData.filter(condition);
    //console.log(filteredArray);
    //console.log(filteredArray.length);

    let abc;
    if (filteredArray.length === 0) { //pass                
        abc = 0;
    } else {
        // console.log("not found ", filteredArray.length)
        // console.log("Filter Array ", filteredArray)
        abc = 1;
    }
    return filteredArray;
}

var afqrFull = "pageID='" + aaPXIXD + "' "
var afURL = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/all' //+ aaPXXI
var afsettings = {
    "url": afURL,
    "method": "POST",
    "timeout": 0,
    "headers": { "Content-Type": "application/json" },
    "data": JSON.stringify({ "@": afqrFull }), //"�pageID='Resigned'�"
};
var jqxhr = $.post(afsettings, function (e) { })
    .done(function (e) {
        //console.log("set aaTBKey");
        aObjMPage = e;
        var aaKeyField = aObjMPage[0].PrimaryKey;
        var aaTBKey = aObjMPage[0].TBKey;
        //console.log(aaTBKey) 63971412-c4e4-4d35-8e79-3293fe59dac8



        //$(function () { TOP PRG 
        $(() => {
            //document.addEventListener("DOMContentLoaded", () => {    

            let aqr2S = "Where Status != 'Resigned'"
            let aFieldSelected = "EMPCode,FullNameThai,FullNameEng,Dept,DivCode,EmailAddress,Position,AccDeptCode,AccDivCode"
            let aFullBody = "Select " + aFieldSelected + " From " + aDBEMPServerName + ".ExtraOnLine.dbo.XOLStaffs " + aqr2S;
            //aaPFDMZz
            fetch(aEMPPDFI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": aFullBody }), redirect: "follow" })
                .then(response => response.json())
                //
                .then(aData => {
                    var aaEmployee = aData;
                    // console.log("aaEmployee ", aaEmployee)
                    let aqr2S1 = "Where IDNO <> ''" //"Where ExpGroupCode = '" + aaERTYPE + "' and " + "EmpID = '" + aaEmpID + "'"
                    let aFieldSelected1 = "IDNO,BenefitLevel,FamilyReimbursement,AllowSSO,OPDLimitperrequest,OPDLimitperyear,MaternityLimitperyear,IPDLimitpercase,FleetLimit,PositionGroup,NOTE,EntryBy,EntryDate"
                    let aFullBody1 = "Select " + aFieldSelected1 + " From " + aDBServerName + ".ExtraOnLine.dbo.PositionBenefitLevel " + aqr2S1;
                    // console.log(aFullBody1)
                    let achecktt = "170005         ".trim(); let paddedStr = achecktt.padEnd(15, ' '); let xResultxx = aSearch2json(aaEmployee, "EMPCode", paddedStr); //"170005         "
                    // console.log("xResultxx ", xResultxx, xResultxx[0].Position)
                    //let rst = xResultxx[0].Position; 
                    //console.log("Search ",rst)
                    fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": aFullBody1 }), redirect: "follow" })
                        .then(response => response.json())
                        //
                        .then(aData => {
                            var aaBenefitLevel = aData;
                            // console.log("aaBenefitLevel ", aaBenefitLevel)
                            const aaExpGroup = [{ "ExpGroupCode": "100", "ExpGroupDescEng": "General", "ExpGroupDescOth": "????????????????", "ExpAccCode": "", "ExpAccDesc": "" }, { "ExpGroupCode": "200", "ExpGroupDescEng": "Fleet Card", "ExpGroupDescOth": "Fleet Card", "ExpAccCode": "5102300001", "ExpAccDesc": "???????? - ?????????" }, { "ExpGroupCode": "300", "ExpGroupDescEng": "Medical", "ExpGroupDescOth": "??????????????", "ExpAccCode": "5204100003", "ExpAccDesc": "??????????????" }, { "ExpGroupCode": "400", "ExpGroupDescEng": "Entertainment", "ExpGroupDescOth": "Entertainment", "ExpAccCode": "", "ExpAccDesc": "" }, { "ExpGroupCode": "500", "ExpGroupDescEng": "Overseas", "ExpGroupDescOth": "??????????", "ExpAccCode": "", "ExpAccDesc": "" }]

                            // console.log(aaExpGroup)
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

                            var aqrFull = "IDNO != '' " //"Status LIKE 'Active%'" //"Dept = '1196'" // "Password !LIKE '%\%"
                            var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all' //aaPFDMZz  aaPFDMI
                            var settings = { "url": aurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": aqrFull }), };//"�Status!='Resigned'�"

                            $("#gridContainer").dxDataGrid({

                                dataSource: new DevExpress.data.CustomStore({
                                    key: "IDNO",
                                    loadMode: "omit",
                                    load: function () {
                                        return $.post(settings).done(function (response) { var xDatax = response;  });//console.log("xDatax ", xDatax);
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
                                        var ObjKeyData = { "IDNO": $.trim(key) };   //[aaKeyField] key.trim
                                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                        sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                    },
                                    remove: function (key) {
                                        var ObjKeyData = { "IDNO": $.trim(key) };   //[aaKeyField] key.trim
                                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                                        sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                    }
                                }),

                                allowColumnReordering: true,
                                allowColumnResizing: true,
                                columnMinWidth: 40,
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
                                    showSearchText: true,
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
                                    allowedPageSizes: [5, 10, 20, 50, 100],
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
                                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Limitation' + '.xlsx');
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
                                    e.data.LimitedPerTime = 0;
                                    e.data.MonthlyLimited = 0;
                                    e.data.TotalLimited = 0;
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
                                        title: "Limitation Setup",
                                        fullScreen: false,
                                        showTitle: true,
                                        width: 1250,
                                        height: 705,
                                        position: { offset: "0 -140" },
                                        /*position: {
                                            my: "top",
                                            at: "top",
                                            of: "window"
                                        },*/
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
                                // column list ,AllowFamily,AllowSSO,FleetLimit,MedicalLimit,MaternityLimit,LimitPerCase
                                columns: [
                                    {
                                        type: "buttons",
                                        width: 80,
                                        buttons: ["edit", "delete"]
                                    },
                                    {
                                        type: "buttons",
                                        width: 20,
                                        buttons: [// Clone first record ID++
                                            {
                                                hint: "Clone Data",
                                                icon: "add",
                                                visible: function (e) {
                                                    return !e.row.isEditing; //return !e.row.isEditing; //(e.row.data.ID === 1)
                                                },
                                                onClick: function (e) {
                                                    //REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,RemitTo1,RemitTo2,RemitTo1Amount,RemitTo2Amount,RemitTo1Diff,RemitTo2Diff,RemitTo1Note,RemitTo2Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6
                                                    //let aBlankDate = "1900-01-01T00:00:00" //new Date('1900-01-01T00:00')
                                                    //console.log(aBlankDate)
                                                    let axRunRun = aGetDateRef("L") //e.row.data.HeadRefNo                        
                                                    //let aaTT = aGetD2V(aaPFDMI,"[WIKRAN-W10].ExtraOnLine.dbo.ERnextIDview Where HeadRefNo LIKE '" + axRunRun + "%'","NextID","aaOBJnn")
                                                    //let aNextNOa = JSON.parse(localStorage.getItem("aaOBJnn"));
                                                    //let aaID = aNextNOa[0].NextID //next no
                                                    //let axLineNo = axRunRun.trim() + "-" + String(aaID).padStart(3, '0')
                                                    //let aObjKeyData = { ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, EROAmount: 0, PBatchDate: aBlankDate,PSPvDate: aBlankDate,ERODate01: aBlankDate,ERODate02: aBlankDate,ERODate03: aBlankDate,ERODate04: aBlankDate,ERODate05: aBlankDate,ERODate06: aBlankDate} //{EntryBy: aaUsrN , EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };
                                                    let aObjKeyData = { IDNO: axRunRun }
                                                    let aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //values
                                                    //var clonedItem = $.extend({}, e.row.data, { REFNO: axRunRun }); //++maxID
                                                    //alert(aObjRowData)
                                                    sendRequestNew("Insert", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                    //employees.splice(e.row.rowIndex, 0, clonedItem);
                                                    e.component.refresh(true);
                                                    e.component.refresh(true);
                                                    e.component.refresh(true);
                                                    e.event.preventDefault();
                                                }
                                            },
                                            {
                                                hint: "Extra Edit",
                                                icon: "print", //"fas fa-marker",
                                                visible: function (e) {
                                                    //return !e.row.isEditing;
                                                    return (e.row.data.ID === 1) //false;
                                                },
                                                onClick: function (e) {
                                                    aPopUpForm(e.row.data);
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
                                    {
                                        dataField: "IDNO",
                                        caption: "IDNO",
                                        sortOrder: "asc",
                                        allowHiding: false,
                                        width: 110,
                                    },
                                    {
                                        dataField: "EmpID",
                                        caption: "Employee ID",
                                        //groupIndex: 0,
                                        validationRules: [{ type: 'required', message: 'Employee ID is required' }],
                                        /*lookup: {
                                            dataSource: aaEmployee, //EMPCode,FullNameThai
                                            valueExpr: "EMPCode",
                                            displayExpr: "EMPCode",
                                        },*/
                                        editCellTemplate: dropDownBoxEMP,
                                        setCellValue: function (newData, value, currentRowData) {
                                            let aResult = aSearch2json(aaEmployee, "EMPCode", value)
                                            newData.EmpID = value;
                                            newData.EmpName = $.trim(aResult[0].FullNameThai);
                                            newData.EmpPosition = $.trim(aResult[0].Position);
                                            newData.EmpDept = $.trim(aResult[0].AccDeptCode);

                                        },
                                        width: 110,
                                    },
                                    {
                                        dataField: "EmpName",
                                        caption: "Name",
                                        width: 170,
                                    },
                                    {
                                        dataField: "EmpDept",
                                        caption: "Department",
                                        sortOrder: "asc",
                                        groupIndex: 0,
                                        width: 100,
                                        //visible: false,
                                    },
                                    {
                                        dataField: "EmpPosition",
                                        caption: "Position",
                                        width: 150,
                                        visible: false,
                                    },
                                    // /*{
                                    //     dataField: "ExpGroupDesc",
                                    //     caption: "Expenses Group Desc",
                                    //     lookup: {
                                    //         dataSource: aaExpGroup,
                                    //         valueExpr: "ExpGroupDescEng",
                                    //         displayExpr: "ExpGroupDescEng" //ExpGroupDescEng
                                    //     },
                                    //     setCellValue: function (newData, value, currentRowData) {
                                    //         newData.ExpGroupDesc = value;
                                    //         let aResult = getExpGroup(value) //aSearchjson2(aaExpGroup, value); //words.filter(word => word.length > 6); aaExpGroup.fliter(data => data.ExpGroupDescEng === value) 
                                    //         newData.ExpGroupCode = aResult[0].ExpGroupCode;
                                    //         newData.ExpCode = aResult[0].ExpAccCode;
                                    //         newData.ExpDesc = aResult[0].ExpAccDesc; //ExpAccCode,ExpAccDesc
                                    //     },
                                    //     visible: false,
                                    // },*/
                                    {
                                        dataField: "RefNo03", //aaBenefitLevel ,AllowFamily,AllowSSO,FleetLimit,MedicalLimit,MaternityLimit,LimitPerCase
                                        caption: "Benefit Level",
                                        lookup: {
                                            dataSource: aaBenefitLevel, //axdataSource, //aaBenefitLevel,
                                            valueExpr: "BenefitLevel",
                                            displayExpr: "BenefitLevel" //ExpGroupDescEng
                                        },
                                        editCellTemplate: dropDownBoxBNF,
                                        setCellValue: function (newData, value, currentRowData) {
                                            let aResult = aSearch2json(aaBenefitLevel, "BenefitLevel", value) //,AllowFamily,AllowSSO,FleetLimit,MedicalLimit,MaternityLimit,LimitPerCase
                                            newData.RefNo03 = value;
                                            newData.AllowFamily = aResult[0].FamilyReimbursement;
                                            newData.AllowSSO = aResult[0].AllowSSO;
                                            newData.FleetLimit = aResult[0].FleetLimit;
                                            newData.MedicalLimit = aResult[0].OPDLimitperyear;
                                            newData.MaternityLimit = aResult[0].MaternityLimitperyear;
                                            newData.LimitPerCase = aResult[0].OPDLimitperrequest;
                                        },
                                        width: 280,
                                        //visible: false,
                                    },
                                    {
                                        dataField: "AllowFamily",
                                        caption: "Family Allow",
                                        editorType: "dxSwitch",
                                        editorOptions: { width: 60 },
                                        width: 60,
                                        visible: false,
                                    },
                                    {
                                        dataField: "AllowSSO",
                                        caption: "SSO Allow",
                                        editorType: "dxSwitch",
                                        editorOptions: { width: 60 },
                                        width: 60,
                                        visible: false,
                                    },
                                    {
                                        dataField: "FleetLimit",
                                        caption: "Fleet Card Limit",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        editorType: "dxNumberBox",
                                        editorOptions: { format: "#,##0.00", width: 150 },
                                        width: 150,
                                    },
                                    {
                                        dataField: "MedicalLimit",
                                        caption: "Medical Limit",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        editorType: "dxNumberBox",
                                        editorOptions: { format: "#,##0.00", width: 150 },
                                        width: 150,
                                    },
                                    {
                                        dataField: "MaternityLimit",
                                        caption: "Maternity Limit",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        editorType: "dxNumberBox",
                                        editorOptions: { format: "#,##0.00", width: 150 },
                                        width: 150,
                                    },
                                    {
                                        dataField: "LimitPerCase",
                                        caption: "Limit Per Case",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        editorType: "dxNumberBox",
                                        editorOptions: { format: "#,##0.00", width: 150 },
                                        width: 150,
                                    },
                                    // {
                                    //     dataField: "TEXTTEST2", //aaEmployee
                                    //     caption: "NEW POSITION",
                                    //     calculateCellValue: function (data) { let achecktt = data.EmpID.trim(); let paddedStr = achecktt.padEnd(15, ' '); let xResultxx = aSearch2json(aaEmployee, "EMPCode", paddedStr); return xResultxx.length === 0 ? "RESIGNED" : xResultxx[0].Position.trim() },//{let xResultxx = aSearch2json(aaEmployee, "EMPCode", data.EmpID); let rst = xResultxx[0].Position; return rst; }, //$.trim(aResult[0].Position) data.EmpPosition aSearch2json(aaEmployee, "EMPCode", data.EmpID)
                                    //     editorType: "dxTextBox",
                                    //     width: 100,
                                    //     visible: false,
                                    // },
                                    // {
                                    //     dataField: "TEXTTEST", //aaEmployee
                                    //     caption: "STATUS",
                                    //     calculateCellValue: function (data) { let achecktt = data.EmpID.trim(); let paddedStr = achecktt.padEnd(15, ' '); let xResultxx = aSearch2json(aaEmployee, "EMPCode", paddedStr); /* console.log(xResultxx, xResultxx.length); */ return xResultxx.length === 0 ? "RESIGNED" : (xResultxx[0].Position.trim() === data.EmpPosition.trim() ? "SAME" : "CHANGE") },//{let xResultxx = aSearch2json(aaEmployee, "EMPCode", data.EmpID); let rst = xResultxx[0].Position; return rst; }, //$.trim(aResult[0].Position) data.EmpPosition aSearch2json(aaEmployee, "EMPCode", data.EmpID)
                                    //     editorType: "dxTextBox",
                                    //     width: 100,
                                    // },

                                    /*{
                                        dataField: "ExpGroupCode",
                                        caption: "Expenses Group Code",
                                        visible: false,
                                    },
                                    {
                                        dataField: "ExpCode",
                                        caption: "Expenses Code",
                                        visible: false,
                                    },
                                    {
                                        dataField: "ExpDesc",
                                        caption: "Expenses Description",
                                        visible: false,
                                    },*/
                                    {
                                        dataField: "RefNo01",
                                        caption: "(Fleet) Plate No",
                                        visible: false,
                                    },
                                    {
                                        dataField: "RefNo02",
                                        caption: "Fleet Card No",
                                        visible: false,
                                    },
                                    {
                                        dataField: "Note",
                                        caption: "Note",
                                        editorType: "dxTextArea",
                                        editorOptions: { width: 400, height: 80 },
                                        visible: false,
                                    },
                                    /*{
                                        dataField: "RefNo04",
                                        caption: "Email Address",
                                        visible: false,
                                    },
                                    {
                                        dataField: "RefDesc",
                                        caption: "Description",
                                        visible: false,
                                    },
                                    {
                                        dataField: "TotalLimited",
                                        caption: "Limit Amount",
                                        editorOptions: { format: "#,##0.00" },
                                        format: { type: "fixedPoint", precision: 2 },
                                        visible: false,
                                    },
                                    {
                                        dataField: "LimitedPerTime",
                                        caption: "Limit Per Time",
                                        editorOptions: { format: "#,##0.00" },
                                        format: { type: "fixedPoint", precision: 2 },
                                        visible: false,
                                    },
                                    {
                                        dataField: "MonthlyLimited",
                                        caption: "Maternity Limit",
                                        editorOptions: { format: "#,##0.00" },
                                        format: { type: "fixedPoint", precision: 2 },
                                        visible: false,
                                    },
                                    {
                                        dataField: "ApproverID",
                                        caption: "Approver ID",
                                        visible: false,
                                    },
                                    {
                                        dataField: "ApproverName",
                                        caption: "Approver Name",
                                        visible: false,
                                    },
                                    {
                                        dataField: "ApproverEmail",
                                        caption: "Approver Email",
                                        visible: false,
                                    },
                                    {
                                        dataField: "HRApproverID",
                                        caption: "HR Approver ID",
                                        visible: false,
                                    },
                                    {
                                        dataField: "HRApproverName",
                                        caption: "HR Approver Name",
                                        visible: false,
                                    },
                                    {
                                        dataField: "HRApproverEmail",
                                        caption: "HR Approver Email",
                                        visible: false,
                                    },
                                    {
                                        dataField: "FAApproverID",
                                        caption: "FA Approver ID",
                                        visible: false,
                                    },
                                    {
                                        dataField: "FAApproverName",
                                        caption: "FA Approver Name",
                                        visible: false,
                                    },
                                    {
                                        dataField: "FAApproverEmail",
                                        caption: "FA Approver Email",
                                        visible: false,
                                    },
                                    */



                                ],
                                // summary
                                summary: {
                                    recalculateWhileEditing: true,
                                    skipEmptyValues: false,
                                    totalItems: [
                                        {
                                            column: "IDNO",
                                            summaryType: "count",
                                            displayFormat: "{0} Items",
                                        },
                                    ],
                                    groupItems: [
                                        {
                                            column: "IDNO",
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
                                                        doc.save('Limitation' + '.pdf');
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
                                                
                                                function aSearchEmp(asSearch) {
                                                    return aaEmployee.filter( //aaEmployee
                                                        function (data) {
                                                            return data.EMPCode == asSearch
                                                        }
                                                    );
                                                }
                            
                                                function aSearchBNF(asSearch) {
                                                    return aaBenefitLevel.filter( //aaEmployee
                                                        function (data) {
                                                            return data.BenefitLevel == asSearch
                                                        }
                                                    );
                                                }
                            
                                                function getExpGroup(aSearch) {
                                                    return aaExpGroup.filter(
                                                        function (data) {
                                                            return data.ExpGroupDescEng == aSearch
                                                        }
                                                    );
                                                }
                                                function getaaBenefit(aSearch) {
                                                    return aaBenefitLevel.filter(
                                                        function (data) {
                                                            return data.BenefitLevel == aSearch
                                                        }
                                                    );
                                                }
                                                function aSearchjsonB(aObjArr, asID) {
                                                    return Object.values(aObjArr).filter( //aaEmployee
                                                        function (data) {
                                                            return data.BenefitLevel == asID
                                                        }
                                                    );
                                                }
                            
                                                function getTaxRates(state) {
                                                    var promise = $.ajax({
                                                        // The URL returns { State: 1, Tax: 10 }
                                                        url: "https://www.mywebsite.com/api/getTaxRates",
                                                        dataType: "json",
                                                        data: { BenefitLevel: state }
                                                    });
                                                    return promise;
                                                }
                            
                                                function aSearchjson(aObjArr, asID) {
                                                    return Object.values(aObjArr).filter( //aaEmployee
                                                        function (data) {
                                                            return data.EMPCode == asID
                                                        }
                                                    );
                                                }
                            */
                            /**
                             * @param cellElement (datagrid)
                             * @param cellinfo (datagrid)
                             * @return Employee value
                             * 
                             * Dropdown Employee array for DataGrid
                             */
                            function dropDownBoxEMP(cellElement, cellInfo) {
                                return $("<div>").dxDropDownBox({
                                    dropDownOptions: { width: 900 },
                                    dataSource: aaEmployee,
                                    value: [cellInfo.value],
                                    valueExpr: "EMPCode",
                                    displayExpr: "EMPCode",
                                    contentTemplate: function (e) {
                                        return $("<div>").dxDataGrid({
                                            dataSource: aaEmployee,
                                            //remoteOperations: true, // EMPCode,FullNameThai
                                            columns: [
                                                { dataField: "EMPCode", caption: "ID", width: 100 },
                                                { dataField: "AccDeptCode", caption: "Dept.", width: 100 },
                                                { dataField: "FullNameEng", caption: "ENG.Name", width: 200 },
                                                { dataField: "FullNameThai", caption: "THI.Name", width: 200 },
                                                { dataField: "Position", caption: "Position", width: 300 },
                                            ], //"EMPCode,FullNameThai,FullNameEng,Dept,DivCode,EmailAddress,Position,AccDeptCode,AccDivCode"
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
                                                e.component.option("value", sArgs.selectedRowKeys[0].EMPCode); // Works but Error Need to correct next time !!!
                                                cellInfo.setValue(sArgs.selectedRowKeys[0].EMPCode);
                                                if (sArgs.selectedRowKeys.length > 0) {
                                                    e.component.close();
                                                }
                                            }
                                        });
                                    },
                                });
                            }

                            /**
                              * @param cellElement (datagrid)
                              * @param cellinfo (datagrid)
                              * @return Benefits Code
                              * 
                              * Dropdown Benefits array for DataGrid
                             */
                            function dropDownBoxBNF(cellElement, cellInfo) {
                                return $("<div>").dxDropDownBox({
                                    dropDownOptions: { width: 800, 
                                        //dragEnabled: true,
                                        //resizeEnabled: true,
                                        //showTitle: true,
                                        //title: "Select Benefit Level" 
                                    },
                                    dataSource: aaBenefitLevel,
                                    value: [cellInfo.value],
                                    valueExpr: "BenefitLevel",
                                    displayExpr: "BenefitLevel",
                                    contentTemplate: function (e) {
                                        return $("<div>").dxDataGrid({
                                            dataSource: aaBenefitLevel,
                                            //remoteOperations: true, // IDNO,BenefitLevel,FamilyReimbursement,AllowSSO,OPDLimitperrequest,OPDLimitperyear,MaternityLimitperyear,IPDLimitpercase,FleetLimit,PositionGroup,NOTE,EntryBy,EntryDate
                                            columns: [{ dataField: "IDNO", caption: "ID NO", width: 80, sortOrder: "asc" }, { dataField: "BenefitLevel", caption: "Benefit", width: 280 }, { dataField: "OPDLimitperyear", caption: "OPD/Year", width: 100 }, { dataField: "FleetLimit", caption: "Fleet Limit", width: 100 }, { dataField: "MaternityLimitperyear", caption: "Maternity", width: 100 }, { dataField: "FamilyReimbursement", caption: "Allow Family", width: 50 }, { dataField: "AllowSSO", caption: "Allow SSO", width: 50 }], //"EMPCode,FullNameThai,FullNameEng,EffectiveDate,ResignDate,Dept,DivCode,EmailAddress" 
                                            hoverStateEnabled: true,
                                            searchPanel: { visible: true },
                                            headerFilter: { visible: true },
                                            paging: { enabled: true, pageSize: 15 },
                                            filterRow: { visible: true },
                                            showBorders: true,
                                            scrolling: { mode: "virtual" },
                                            selection: { mode: "single" },
                                            height: 580,
                                            selectedRowKeys: [cellInfo.value],
                                            //selectedRowKeys: [value],
                                            //focusedRowEnabled: true,
                                            focusedRowKey: cellInfo.value,
                                            onSelectionChanged: function (sArgs) {
                                                //console.log(sArgs.selectedRowKeys[0].EMPCode)
                                                e.component.option("value", sArgs.selectedRowKeys[0].BenefitLevel); // Works but Error Need to correct next time !!!
                                                cellInfo.setValue(sArgs.selectedRowKeys[0].BenefitLevel);
                                                if (sArgs.selectedRowKeys.length > 0) {
                                                    e.component.close();
                                                }
                                            }
                                        });
                                    },
                                });
                            }
                        }) //then fetch (Employee)
                }) //then fetch (Limitation)
        });
        // TOP PRG
    });  // ajax          

