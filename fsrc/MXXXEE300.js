//HR Approve ER

$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
const aaSubGroup = [{ ExpSubGroup: "OPD" }, { ExpSubGroup: "Dental" }, { ExpSubGroup: "Dental (SSO)" }, { ExpSubGroup: "Maternity" }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }

//HR wait for Document HR Approved wait for FA
const arIPDOPD = [{ CODE: "OPD" }, { CODE: "Maternity" }, { CODE: "Others" }];
const arEMPTYPE = [{ CODE: "Employee" }, { CODE: "Spouse" }, { CODE: "Child" }];
const arSTATUS = ["Request for Supported Documents", "Please contact HR asap", "Incomplete Documents", "Incorrect Input", "Incomplete Documents & Incorrect Input", "Return to Edit and Resend", "Denied (Over 3 Months)", "Denied"];
const arSTANOTE = ["��س���㺹���, ������Ѻ�Թ�����Ѻ�ͧᾷ��鹩�Ѻ��� HR ���͵�Ǩ�ͺ", "��سҵԴ��͡�Ѻ......�´�ǹ", "��س����͡���������������¡�ô�ҹ��ҧ���͵�Ǩ�ͺ�ա����", "��س���䢢�������к�����������ա����", "��س���䢢�������к�������͡���������������¡�ô�ҹ��ҧ���͵�Ǩ�ͺ�ա����", "�ա�Ѻ��¡�������ô��Ǩ�ͺ/��䢢����ŵ������к�� HR Note ����������ա����", "��¡�ôѧ������������ö�ԡ�� ���ͧ�ҡ���ԡ��Ҫ���Թ���� 3 ��͹", "��¡�ôѧ������������ö�ԡ�� ���ͧ�ҡ"]
const arHBGColor = ["#FF7F01", "#FF7F01", "#FF7F01", "#FF7F01", "#FF7F01", "#FF7F01", "#FE0000", "#FE0000"] // front color #000000
const arBBGColor = ["#FFE7CE", "#FFE7CE", "#FFE7CE", "#FFE7CE", "#FFE7CE", "#FFE7CE", "#FFD2D2", "#FFD2D2"] // background color green #00C510 #EFFFEA
const arSTchangeTo = ["Register", "Register", "Register", "Register", "Register", "Register", "HR Denied", "HR Denied"] //Status Change To
const arButtonText = ["RETURN", "RETURN", "RETURN", "RETURN", "RETURN", "RETURN", "DENIED", "DENIED"] // Action Button Text
const arButtonIcon = ["fas fa-redo-alt", "fas fa-redo-alt", "fas fa-redo-alt", "fas fa-redo-alt", "fas fa-redo-alt", "fas fa-redo-alt", "fas fa-bullseye", "fas fa-bullseye"] // Icon List
//arSTchangeTo, arButtonText, arButtonIcon
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();

var aaXToX = localStorage["aaXXoX"];
var aaXNoX = localStorage["aaXXuX"];
//var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492"; // Master Page
var aaPXXI = localStorage["aPXIXD"];

var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var aaPFDMZz = "https://webspace.locktonwattana.com"; //"https://cbsdev2.locktonwattana.com"; // API for DMZ only

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
        aObjMPage = e;
        var aaKeyField = aObjMPage[0].PrimaryKey;
        var aaTBKey = aObjMPage[0].TBKey;

        // TOP PRG
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
                    const arBBGColor = aArrays.arBBGColor;
                    const arHBGColor = aArrays.arHBGColor;
                    const arSTchangeTo = aArrays.arSTchangeTo
                    const arButtonText = aArrays.arButtonText
                    //const arButtonIcon = aArrays.arButtonIcon

                    //alert(aaarSTchangeTo);
                    //console.log(aArrays.arSTANOTE);
                    var aaOnInitExpGroupDesc = "Medical"
                    var aaPFDMI = isLocalHost();
                    var aaXToX = localStorage["aaXXoX"];

                    // start get Approver
                    //let aDivisionC = localStorage["asDIV"];
                    let aDivS = "Where ApproverCode = 'FA' "
                    let aFieldSelected = "ApproveToDivision,ApproverName,ApproverEmail"
                    let aFullBody = "Select " + aFieldSelected + " From " + "ExtraOnLine.dbo.Approver " + aDivS;

                    fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": aFullBody }), redirect: "follow" })
                        .then(response => response.json())
                        //
                        .then(hData => {

                            var aaFAApprover = hData;
                            var aaFAAppName = aaFAApprover[0].ApproverName
                            var aaFAAppEmail = aaFAApprover[0].ApproverEmail
                            /*
                            console.log("----FA--------")
                            console.log(aaFAAppName)
                            console.log(aaFAAppEmail)
                            console.log("----FA--------")
                            */
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
                            var aFilterT = aYearStrS + '/05/01'  //2022/05/01
                            var aFilterT2 = aYearStrL + '/04/30'  //2023/04/01            
                            /*
                            aGetDataModel(aaPFDMI, atob(aaXToX), "95ee65ae-df03-46b0-85e0-980c511f4357", "aaOBJAccExp") //ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE
                            var aaExpExp = JSON.parse(localStorage.getItem("aaOBJAccExp")); //JSON.parse(localStorage.getItem("names"))
                
                            aGetDataAPI(aaDMZSn, "[lockthbnk-ap14].SIBISDB.dbo.Currency", "Code,Name,(select TOP 1 DefaultRate From [lockthbnk-ap14].SIBISDB.dbo.ExchangeRate Where FromCurrency = Currency.code and ToCurrency = 'THB' ORDER by PeriodYear Desc, PeriodMonth Desc) as xRate", "aaOBJCurr")
                            var aaCurrency = JSON.parse(localStorage.getItem("aaOBJCurr"));
                            //select  Code,Name, (select TOP 1 DefaultRate From [lockthbnk-ap14].SIBISDB.dbo.ExchangeRate Where FromCurrency = Currency.code and ToCurrency = 'THB' ORDER by PeriodYear Desc, PeriodMonth Desc) as xRate from Currency
                            */
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
                            var asStaffID = $.trim(localStorage["asSTFID"]);
                            var asDepartment = localStorage["asDEPT"];
                            var asDivision = $.trim(localStorage["asDIV"]);
                            var asStaffEmail = localStorage["asEMAIL"];
                            var aaHRAppName = asFullName
                            var aaHRAppEmail = asStaffEmail
                            var aHRDivGrp = "(select ApproveToDivision from Approver Where ApproverCode = 'HR' and ApproverEmpID = '" + asStaffID + "')"

                            var asERStatus = 'Confirmed wait for HR' // FA Verified and Approved //Confirmed wait for HR
                            var aqrFull = "ERStatus = '" + asERStatus + "'" //" and Division IN " + aHODDivGrp  // scopes based permission (View Only Login Name)  ExpensesCode LIKE aaOnInitAccCode Division "ExpGroupCode LIKE '%" + aaERTYPE + "%' and " +

                            //var aaTBKey = "ec0f26bc-c294-4928-ac02-227b512b7401"

                            //let aNowDte = new Date()
                            var aYearNum = aNowDte.getFullYear()
                            var aYearStr = aYearNum.toString()
                            var aFilterT = aYearStr + '/01/01'


                            $("#gridContainer").dxDataGrid({

                                dataSource: new DevExpress.data.CustomStore({
                                    key: "REFNO",
                                    loadMode: "omit",
                                    load: function () {
                                        return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all', { "@": aqrFull }) // Change aaTBKey to TokenKey for this table
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
                                        if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "ID" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department" || e.dataField === "ExpensesCode" || e.dataField === "ExpGroupDescEng" || e.dataField === "ERStatus")) { //ERODesc02 || e.dataField === "EROCode02" || e.dataField === "ERORefNo3" || e.dataField === "EROCode02"
                                            e.editorOptions.disabled = true;
                                        } //|| e.dataField === "ExpensesCode" || e.dataField === "ExpGroupDescEng" || e.dataField === "LocalAmount" || e.dataField === "ERStatus" || e.dataField === "ERORefNo3"
                                    }
                                },
                                //
                                //
                                // Editing
                                editing: {
                                    mode: "cell",
                                    useIcons: true,
                                    allowUpdating: true,
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
                                        type: "buttons",
                                        width: 80,
                                        buttons: [
                                            {
                                                hint: "Email to Requester", // Send Mail
                                                icon: "fas fa-envelope",
                                                visible: function (e) {
                                                    return (e.row.data.ID === 1) //return !e.row.isEditing; && e.row.data.Confirmed === false
                                                },
                                                onClick: function (e) {
                                                    aPopUpAddForm(e.row.data, e.row.data.HeadRefNo);
                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                }
                                            },
                                            {
                                                hint: "Approve - Send to FA (mail to Requester & FA)",
                                                icon: "fas fa-check-circle",
                                                visible: function (e) {
                                                    return (e.row.data.ID === 1 && e.row.data.HRApproved === false) //return !e.row.isEditing; && e.row.data.HODApproved === false
                                                },
                                                onClick: function (e) {
                                                    // mark HR Approve field
                                                    let result = DevExpress.ui.dialog.confirm("Are you sure you want to approve this request?", "APPROVE"); //+ "<br>?? 'YES' 
                                                    result.done(function (dresult) {
                                                        if (dresult) {
                                                            let aERStatus = "HR Approved wait for FA" //"Register"
                                                            let aTrueORFalse = (e.row.data.HRApproved === true ? '0' : '1');
                                                            let aTrueORFalseB = (e.row.data.HRApproved === true ? false : true);
                                                            var aObjKeyData = { REFNO: e.row.data.REFNO, HRApproved: aTrueORFalseB, ERStatus: aERStatus };
                                                            var aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData));
                                                            //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                            var aaNowTexta = aNowText()

                                                            //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704'
                                                            let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET HRApproved = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "', HRApprovedDate = '" + aaNowTexta + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                            aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                            //alert(aSQLCommand)

                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.event.preventDefault();

                                                            //send Email
                                                            var aaMailTitle = "HR Approved"
                                                            let aApproverName = aaHRAppName + ", [HR]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                            let aApproverEmail = $.trim(aaHRAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                            let aRequesterName = e.row.data.PayToName //e.data.PayToName //"Wikran Intaraprajaks"
                                                            let aRequesterEmail = e.row.data.ERODesc06 //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                            let aSubject = aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT - " + aaMailTitle
                                                            let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>";
                                                            // To Requester
                                                            let aMessage01 = "<div><br>เรียน คุณ" + $.trim(aRequesterName) + ",<br>รายการ: " + aaOnInitExpGroupDesc + " REFNO = [" + e.row.data.HeadRefNo + "] ได้รับการอนุมัติแล้ว <br>ตรวจสอบรายละเอียดได้ที่ " + aAddress2Do + " <br><br><br><b>HR Administrator</b><br></div>"
                                                            //let aMessage01 = "<div><br>���? �?" + $.trim(aRequesterName) + ",<br>��?��: " + aaOnInitExpGroupDesc + " REFNO = [" + e.row.data.HeadRefNo + "] ���?���?��?����� <br>��?�?��������?���� " + aAddress2Do + " <br><br><br><b>HR Administrator</b><br></div>"
                                                            var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #00C510; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT <br>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EFFFEA;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                            aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)
                                                            // To FA (Ignore)
                                                            //
                                                            //aMessage01 = "<div><br>TO <b>FA Administrator</b><br><br>&nbsp;&nbsp;&nbsp;" + aaOnInitExpGroupDesc + " Expenses Reimbursement <br>&nbsp;&nbsp;&nbsp;REFNO = [" + e.row.data.HeadRefNo + "] already approved by HR <br><br>&nbsp;&nbsp;&nbsp;Verify at " + aAddress2Do + " (menu FA Approve) <br><br><br><b>HR Administrator</b><br></div>"
                                                            //aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #00C510; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT <br>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EFFFEA;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                            //aSendMailDMZ(" " + aaFAAppName, aaFAAppEmail, aApproverEmail, "", "", aSubject, aMessage)

                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.event.preventDefault();
                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                            aMessageAlert("Already Approved & send mail to Requester, FA", "DarkGreen")
                                                        }
                                                    });
                                                }
                                            },

                                        ]
                                    },
                                    {
                                        type: "buttons",
                                        width: 40,
                                        buttons: [
                                            { // Reject 1 page
                                                hint: "Return & Send Mail to Requester - Change status to 'Register'",
                                                icon: "fas fa-redo-alt", //"fas fa-ghost", // "fas fa-redo-alt"
                                                type: "danger",
                                                visible: function (e) {
                                                    return (e.row.data.ID === 1 && e.row.data.HRApproved === false) //return !e.row.isEditing; && e.row.data.HODApproved === false
                                                },
                                                onClick: function (e) {
                                                    // mark HR Reject field
                                                    let aBlankDate = "1901-01-01T00:00:00"
                                                    let result = DevExpress.ui.dialog.confirm("Are you sure you want to reject this request?", "REJECT"); // "<br>?? 'YES' ???????????" +
                                                    result.done(function (dresult) {
                                                        if (dresult) {
                                                            let aERStatus = "Register" //"HR Approved wait for FA" //"Register"
                                                            //let aTrueORFalse = (e.row.data.HRApproved === true ? '0' : '1');
                                                            //let aTrueORFalseB = (e.row.data.HRApproved === true ? false : true);
                                                            var aObjKeyData = { REFNO: e.row.data.REFNO, Confirmed: false, ERStatus: aERStatus, EROCheck06: true }; //HRApproved: aTrueORFalseB,
                                                            var aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData));
                                                            sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO

                                                            //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704'
                                                            let aTrueORFalse = '0'
                                                            let aTrueORFalseB = '1'
                                                            let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET HRApproved = " + aTrueORFalse + ", EROCheck06 = " + aTrueORFalseB + ", Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "', HRApprovedDate = '" + aBlankDate + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                            //let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                            aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo return status to Register
                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                            aSQLAction(aaPFDMI, aSQLCommand)

                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.event.preventDefault();

                                                            //send Email -------------------------------
                                                            console.log("----x-----")
                                                            console.log("HR Name   " + aaHRAppName)
                                                            console.log("HR Email  " + aaHRAppEmail)
                                                            console.log("Requester Name " + asFullName)
                                                            console.log("Requester Email " + asStaffEmail)
                                                            //console.log(e.row.data.Note)
                                                            console.log("----x-----")
                                                            var aaMailTitle = "Return to Edit and Resend" //aaOnInitExpGroupDesc.toUpperCase() + " REIMBURSEMENT REJECT"; // REIMBURSEMENT
                                                            var aApproverName = aaHRAppName //+ " [HR]"         //aaHRAppName //"Wikran" + " [HR]"         // HR Approver Name
                                                            var aApproverEmail = $.trim(aaHRAppEmail) // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                            var aRequesterName = e.row.data.PayToName //e.data.PayToName //"Wikran Intaraprajaks"
                                                            var aRequesterEmail = e.row.data.ERODesc06 //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                            var aSubject = aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT - " + aaMailTitle //aDataR.ERStatus //aaOnInitExpGroupDesc 
                                                            var aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>"; //<a href='https://www.w3schools.com'>Visit W3Schools</a>
                                                            var vRefNo = e.row.data.HeadRefNo
                                                            var aBodyWCode = "ตีกลับรายการเพื่อโปรดตรวจสอบ/แก้ไขข้อมูลตามที่ระบุใน HR Note และส่งใหม่อีกครั้ง" //e.row.data.Note
                                                            //var aBodyWCode = "�?�?��?�������?��?�?/��?����?������?�� HR Note ����������?����" //e.row.data.Note
                                                            let getvalues = { vRefNo: vRefNo, aBodyWCode: aBodyWCode, aApproverName: aApproverName, aApproverEmail: aApproverEmail, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName }
                                                            //aBodyWCode = aBodyWCode.replace("<#vRefNo#>", vRefNo)
                                                            //alert(aBodyWCode)
                                                            //var aMessage01 = "<div>เรียน คุณ" + $.trim(aRequesterName) + "<br>&nbsp;&nbsp;&nbsp;&nbsp;รายการ " + aaOnInitExpGroupDesc + " Expenses Reimbursement REFNO = [" + e.row.data.HeadRefNo + "] ถูกตีกลับเพื่อโปรดตรวจสอบ/แก้ไขข้อมูลตามที่ระบุใน HR Note และส่งใหม่อีกครั้ง<br><br><br> สามารถใช้งานโปรแกรมได้ที่ " + aAddress2Do + " (เมนู Medical Expenses) <br><br><br><br><b> HR Administrator </b></div>" // <br>Regards,<br> //" + aaHRAppName + "
                                                            //var aMessage01 = "<div>���? �?" + $.trim(aRequesterName) + "<br>&nbsp;&nbsp;&nbsp;&nbsp;��?�� " + aaOnInitExpGroupDesc + " Expenses Reimbursement REFNO = [" + e.row.data.HeadRefNo + "] �?�?�?�����?��?�?/��?����?������?�� HR Note ����������?����<br><br><br> ����?��?��������� " + aAddress2Do + " (���� Medical Expenses) <br><br><br><br><b> HR Administrator </b></div>" // <br>Regards,<br> //" + aaHRAppName + "
                                                            //let aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>Please Approve at &nbsp;'+ aAddress2Do +'</center></strong></span></h2></td></tr></tbody></table>'              
                                                            //var aMessage =  "<table border=0 cellpadding=1 cellspacing=1 style=width:500px background-color: lightgrey><tbody><tr><td style='width:454px'><p style='text-align:center'><span style='font-size:20px'><strong><span style='color:#d35400'>Reimbursement REJECT !!!</span></strong></span></p></td></tr><tr><td style='width:454px'>"+ aMessage01 + "</td></tr></tbody></table>"
                                                            //var aMessage = "<!DOCTYPE html><html><head><style>table { border: 1px; border-radius: 5px; border-collapse: collapse; width: 50%;} th, td {  text-align: left;  padding: 8px;}tr:nth-child(even){background-color: #ffe6ff }th {  background-color: #FF0D02; color: white;}</style></head><body><table><tr><th style = 'font-size: 22px;'><center />&#9728; " + aaMailTitle + " &#9728;</th></tr><tr><td style = 'font-size: 13px; background-color:#FFEBEA'>" + aMessage01 + "</td>  </tr></tr></table></body></html>" //#fff7e6 #e6e6e6 #fff7e6
                                                            let aMessage01 = aArrays.RJMAIL[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                            var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #FF7F01;color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT <br><small>" + aaMailTitle + "</small></center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#FFE7CE;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                                            // send mail API
                                                            //alert(aMessage)
                                                            //                   aRequesterName aRequesterEmail aApproverEmail     
                                                            //                   aRecipient,    aRCPeMail,      aSendereMail, aCCeMail, aBcceMail, aSubject, aMessage
                                                            //aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)
                                                            aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)

                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                            //aMessageAlert("Already Reject , Please Send Mail to confirm to Requester <br> Record will gone!!", "DarkGreen")
                                                            //send Mail ------------------------------
                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.component.refresh(true);
                                                            e.event.preventDefault();
                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                            //aMessageAlert("Already Reject and Send a less Details Mail to Requester <br> the Rejected Record will move from this List!!", "DarkRed")
                                                            aMessageAlert("Already Reject <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                        }
                                                    });
                                                }

                                            },
                                        ]
                                    },
                                    {
                                        type: "buttons",
                                        width: 40,
                                        visible: true,
                                        buttons: [
                                            {
                                                hint: "Benefits",
                                                icon: "fas fa-star",
                                                visible: function (e) {
                                                    return (e.row.data.ID === 1 && e.row.data.HRApproved === false) //return !e.row.isEditing; && e.row.data.HODApproved === false
                                                },
                                                onClick: function (e) {

                                                    var aEmpIDxx = $.trim(e.row.data.PayToCode)
                                                    let aqr2S = "Where EmpID LIKE '%" + $.trim(aEmpIDxx) + "%'" //"Where EmpID = '" + aaEmpID + "'" //"Where ExpGroupCode = '" + aaERTYPE + "' and " + "EmpID = '" + aaEmpID + "'"
                                                    let aFieldSelected = "EmpName,RefNo01,RefNo02,MonthlyLimited,LimitedPerTime,TotalLimited,AllowFamily,AllowSSO,FleetLimit,MedicalLimit,MaternityLimit,LimitPerCase"
                                                    let aFullBody = "Select " + aFieldSelected + " From " + "ExtraOnLine.dbo.Limitation " + aqr2S; //alert(aFullBody)                                           

                                                    fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": aFullBody }), redirect: "follow" })
                                                        .then(response => response.json())
                                                        //
                                                        .then(aData => {
                                                            var aaLimited = aData;
                                                            /*
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
                                                            */

                                                            console.log("--- before popup ---")
                                                            console.log(aaLimited)
                                                            aPopUpBenefits(aaLimited, e.row.data.PayToCode) //aaMedical,aaFamily,aaSSO,aaMaternity,aaFleet
                                                        })
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
                                        dataType: "number",
                                        caption: "NO",
                                        disabled: true,
                                        width: 40
                                    },
                                    {
                                        dataField: "ReqDate",
                                        caption: "Submitted Date",
                                        dataType: "date",
                                        format: "dd/MM/yyyy",
                                        editorOptions: { width: 100 },
                                        validationRules: [{ type: "required" }],
                                        //editorType:"dxCalendar",
                                        width: 100,
                                    },
                                    {
                                        dataField: "PayToCode",
                                        caption: "Code",
                                        dataType: "string",
                                        editorOptions: { width: 130 },
                                        visible: false,
                                    },
                                    {
                                        dataField: "PayToName",
                                        caption: "Name",
                                        dataType: "string",
                                        width: 150,
                                        visible: true,
                                    },
                                    {
                                        dataField: "Department",
                                        caption: "Dept.",
                                        dataType: "string",
                                        editorOptions: { width: 80 },
                                        width: 70,
                                        visible: false,
                                    },
                                    {
                                        dataField: "Division",
                                        caption: "Division",
                                        dataType: "string",
                                        editorOptions: { width: 150 },
                                        width: 80,
                                        visible: false,
                                    },
                                    {
                                        dataField: "ExpensesCode",
                                        caption: "Expenses Code",
                                        dataType: "string",
                                        editorType: "dxTextArea",
                                        editorOptions: { width: 200 },
                                        width: 120,
                                        visible: false,
                                    },
                                    {
                                        dataField: "ExpGroupDescEng",// "ExpensesDescription",
                                        caption: "Expenses",
                                        dataType: "string",
                                        width: 150,
                                        visible: false,
                                    },
                                    {
                                        dataField: "Amount",
                                        caption: "Expenses Amount",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        setCellValue: function (newData, value, currentRowData) {
                                            newData.Amount = value;
                                            newData.LocalAmount = value * (1 / currentRowData.Xrate);
                                        },
                                        editorType: "dxNumberBox",
                                        editorOptions: { format: "#,##0.00", width: 120 },
                                        visible: false,
                                    },
                                    {
                                        dataField: "ERODate01",
                                        caption: "Treatment Date",
                                        dataType: "date",
                                        format: "dd/MM/yyyy",
                                        width: 150,
                                        editorOptions: { width: 150 },
                                    },
                                    {
                                        dataField: "ERODesc03",
                                        caption: "Hospital/Clinic Name",
                                        dataType: "string",
                                        editorOptions: { width: 120 }, //, height: 80
                                        width: 120,
                                        visible: true,
                                    },
                                    {
                                        dataField: "ERORefNo3",//"ExpensesDescription",
                                        caption: "Sub Expenses",
                                        dataType: "string", //
                                        lookup: {
                                            dataSource: aaSubGroup,
                                            valueExpr: "ExpSubGroup",
                                            displayExpr: "ExpSubGroup"
                                        },
                                        width: 140,
                                        editorOptions: { width: 140 },
                                    },
                                    {
                                        dataField: "EROCode02",
                                        caption: "Patient",
                                        dataType: "string",
                                        lookup: {
                                            dataSource: arEMPTYPE,
                                            valueExpr: "CODE",
                                            displayExpr: "CODE"
                                        },
                                        width: 110,
                                        visible: true,
                                    },
                                    {
                                        dataField: "ERODesc02",
                                        caption: "Disease", //dropDownDisease
                                        dataType: "string",
                                        width: 170,
                                    },

                                    {
                                        dataField: "LocalAmount",
                                        caption: "Actual Amount",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        editorOptions: { format: "#,##0.00", width: 120 },
                                        width: 120,
                                    },
                                    {
                                        dataField: "RefundedAmount", //ERORefNo3
                                        caption: "Reimburse",
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        editorOptions: { format: "#,##0.00", width: 120 },
                                        width: 120,
                                    },
                                    {
                                        dataField: "ERODesc05",
                                        caption: "HR NOTE",
                                        dataType: "string",
                                        editorType: "dxTextArea",
                                        editorOptions: { width: 200 }, //, height: 80
                                        width: 200,
                                        visible: true,
                                    },
                                    {
                                        dataField: "ERStatus",
                                        caption: "Status",
                                        dataType: "string",
                                        visible: false,
                                        width: 180,
                                    },
                                    /*
                                    /*{
                                        dataField: "ERODesc06",//"Email",
                                        caption: "Email",
                                        width: 200,
                                        visible: false,
                                    },                    
                                    {
                                        dataField: "Confirmed",
                                        caption: "Confirm",
                                        width: 30,
                                        visible: false,
                                    },
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
                                    },
                
                                    {
                                        dataField: "EntryBy",
                                        caption: "Entry By",
                                        value: [aaUsrN],
                                        editorOptions: { width: 150 },
                                        visible: false,
                                    },
                                    {
                                        dataField: "Approved",
                                        caption: "Approve",
                                        //width: 10,
                                        visible: false,
                                    },
                                    {
                                        dataField: "EntryDate",
                                        caption: "Entry Date",
                                        value: [aNowDatev],
                                        dataType: "date",
                                        format: "dd/MM/yyyy",
                                        editorOptions: { width: 150 },
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
                                            column: "Amount",
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
                                                            .text("HR MEDICAL APPROVAL"),
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
                                                //text: "Export to PDF", // transfer to PDF
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

                            // crud
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
                            
                            function aPopUpBenefits(iData, aaEmpIDx) {
                                let selectedYear = new Date().getFullYear(); // Default to current year
                                
                                const reloadBenefitsGrid = (year) => {
                                    const currentYear = new Date().getFullYear();
                                    const yearStr = year.toString();
                                    const lastYearStr = (year - 1).toString();
                                
                                    let aaSqlS = "";
                                
                                    if (year === currentYear) {
                                        // Selected year is current year (e.g. 2025)
                                        aaSqlS = `
                                            PayToCode LIKE '${$.trim(aaEmpIDx)}%'
                                            AND (
                                                (
                                                    ExpGroupDescEng LIKE '%Dental (SSO)%'
                                                    AND (QYear = ${yearStr} OR QYear = ${lastYearStr})
                                                )
                                                OR (
                                                    ExpGroupDescEng NOT LIKE '%Dental (SSO)%'
                                                    AND QYear = ${yearStr}
                                                )
                                            )
                                            AND (TAmount + TRefundAmt) <> 0
                                        `;
                                    } else if (year === currentYear - 1) {
                                        // Selected year is last year (e.g. 2024)
                                        aaSqlS = `
                                            PayToCode LIKE '${$.trim(aaEmpIDx)}%'
                                            AND (
                                                (
                                                    ExpGroupDescEng LIKE '%Dental (SSO)%'
                                                    AND QYear = ${yearStr}
                                                )
                                                OR (
                                                    ExpGroupDescEng NOT LIKE '%Dental (SSO)%'
                                                    AND QYear = ${yearStr}
                                                )
                                            )
                                            AND (TAmount + TRefundAmt) <> 0
                                        `;
                                    } else {
                                        // Older than last year (e.g. 2023, 2022, etc.)
                                        aaSqlS = `
                                            PayToCode LIKE '${$.trim(aaEmpIDx)}%'
                                            AND QYear = ${yearStr}
                                            AND (TAmount + TRefundAmt) <> 0
                                        `;
                                    }
                                
                                    const aaurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "D8CAE826-9DFA-4446-A12C-0C42B1A95ADB" + '/all';
                                    const aaSettings = {
                                        url: aaurl,
                                        method: "POST",
                                        timeout: 0,
                                        headers: { "Content-Type": "application/json" },
                                        data: JSON.stringify({ "@": btoa(aaSqlS) })
                                    };
                                
                                    const grid = $("#Benefits-Movement").dxDataGrid("instance");
                                    grid.option("dataSource", new DevExpress.data.CustomStore({
                                        key: "PayToCode",
                                        loadMode: "omit",
                                        load: () => $.post(aaSettings).done()
                                    }));
                                };
                                
                                // const reloadBenefitsGrid = (year) => {
                                //     const thisYear = new Date().getFullYear();
                                //     //const thisYearStr = thisYear.toString();
                                //     const nextYear = thisYear === year ? year + 1 : year; // Adjust year2 based on current year //year + 1;
                                //     const yearStr = year.toString();
                                //     const nextYearStr = nextYear.toString();
                            
                                //     const aaSqlS = `
                                //         PayToCode LIKE '${$.trim(aaEmpIDx)}%'
                                //         AND (
                                //             (
                                //                 ExpGroupDescEng LIKE '%Dental (SSO)%'
                                //                 AND (QYear = ${yearStr} OR QYear = ${nextYearStr})
                                //             )
                                //             OR (
                                //                 ExpGroupDescEng NOT LIKE '%Dental (SSO)%'
                                //                 AND QYear = ${yearStr}
                                //             )
                                //         )
                                //         AND (TAmount + TRefundAmt) <> 0
                                //     `;
                            
                                //     const aaurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "D8CAE826-9DFA-4446-A12C-0C42B1A95ADB" + '/all';
                                //     const aaSettings = {
                                //         url: aaurl,
                                //         method: "POST",
                                //         timeout: 0,
                                //         headers: { "Content-Type": "application/json" },
                                //         data: JSON.stringify({ "@": btoa(aaSqlS) })
                                //     };
                            
                                //     const grid = $("#Benefits-Movement").dxDataGrid("instance");
                                //     grid.option("dataSource", new DevExpress.data.CustomStore({
                                //         key: "PayToCode",
                                //         loadMode: "omit",
                                //         load: () => $.post(aaSettings).done()
                                //     }));
                                // };
                            
                                $(() => {
                                    const popup = $("#popupBenefitsView").dxPopup({
                                        title: "Benefits",
                                        width: '900px',
                                        height: '600px',
                                        position: { offset: "0 -165" },
                                        visible: true,
                                        fullScreen: false,
                                        showCloseButton: false,
                                        showTitle: true,
                                        dragEnabled: true,
                                        closeOnOutsideClick: false,
                                        resizeEnabled: true,
                            
                                        contentTemplate: () => {
                                            return $("<div />").append(
                                                $("<div>").css({ marginBottom: "10px" }).append(
                                                    $("<div>").attr("id", "Benefits-YearBox").css({ width: "200px" })
                                                ),
                                                $("<div id='Benefits-View'></div>"),
                                                $("<hr>"),
                                                $("<span>").css({
                                                    fontSize: "13px",
                                                    fontWeight: "bold",
                                                    color: "darkblue",
                                                    backgroundColor: "rgb(64, 224, 208)",
                                                    borderRadius: "3px",
                                                    padding: "1px 10px"
                                                }).text("MEDICAL BENEFITS BALANCE"),
                                                $("<br>"),
                                                $("<span>").css({ fontSize: "9px", color: "darkblue" }).text("[NOT SHOW = Never used, Medical = OPD+Dental]"),
                                                $("<div id='Benefits-Movement' style='margin-top:10px;'></div>")
                                            );
                                        },
                            
                                        toolbarItems: [
                                            {
                                                toolbar: "top",
                                                locateInMenu: 'always'
                                            },
                                            {
                                                toolbar: "top",
                                                locateInMenu: 'always',
                                                widget: "dxButton",
                                                location: "after",
                                                options: {
                                                    icon: "fas fa-times",
                                                    stylingMode: "outlined",
                                                    type: "danger",
                                                    onClick: () => popup.hide()
                                                }
                                            }
                                        ]
                                    }).dxPopup("instance");
                            
                                    // Year SelectBox with auto-refresh
                                    $("#Benefits-YearBox").dxSelectBox({
                                        dataSource: generateYearList(),
                                        value: selectedYear,
                                        width: 200,
                                        stylingMode: "outlined",
                                        onValueChanged: function (e) {
                                            if (e.value && e.value !== selectedYear) {
                                                selectedYear = e.value;
                                                reloadBenefitsGrid(selectedYear);
                                            }
                                        }
                                    });
                            
                                    // Info Form
                                    $("#Benefits-View").dxForm({
                                        formData: iData,
                                        showColonAfterLabel: false,
                                        labelLocation: "left",
                                        cssClass: "aMarkRef",
                                        readOnly: true,
                                        colCount: 1,
                                        items: [{
                                            itemType: "group",
                                            colCount: 3,
                                            items: [
                                                {
                                                    dataField: "EmpName",
                                                    label: { text: "Name" },
                                                    editorType: "dxTextBox",
                                                    editorOptions: { value: iData[0].EmpName, width: 150 }
                                                },
                                                {
                                                    dataField: "AllowFamily",
                                                    label: { text: "Allow Family" },
                                                    editorOptions: { value: iData[0].AllowFamily, width: 100 }
                                                },
                                                {
                                                    dataField: "AllowSSO",
                                                    label: { text: "Allow SSO" },
                                                    editorOptions: { value: iData[0].AllowSSO, width: 100 }
                                                },
                                                {
                                                    dataField: "MedicalLimit",
                                                    label: { text: "Medical Limit" },
                                                    editorOptions: { value: iData[0].MedicalLimit, format: "#,##0.00", rtlEnabled: true, width: 150 },
                                                    visible: true
                                                },
                                                {
                                                    dataField: "LimitPerCase",
                                                    label: { text: "Medical Limit per time" },
                                                    editorOptions: { value: iData[0].LimitPerCase, format: "#,##0.00", rtlEnabled: true, width: 150 },
                                                    visible: iData[0].LimitPerCase !== 0
                                                },
                                                {
                                                    dataField: "MaternityLimit",
                                                    label: { text: "Maternity Limit" },
                                                    editorOptions: { value: iData[0].MaternityLimit, format: "#,##0.00", rtlEnabled: true, width: 150 },
                                                    visible: iData[0].MaternityLimit !== 0
                                                },
                                                { itemType: "empty" },
                                                {
                                                    dataField: "FleetLimit",
                                                    label: { text: "Fleet Card Limit" },
                                                    editorOptions: { value: iData[0].FleetLimit, format: "#,##0.00", rtlEnabled: true, width: 150 },
                                                    visible: iData[0].FleetLimit !== 0
                                                },
                                                {
                                                    dataField: "RefNo01",
                                                    label: { text: "Plate No" },
                                                    editorType: "dxTextBox",
                                                    editorOptions: { value: iData[0].RefNo01, width: 150 },
                                                    visible: iData[0].FleetLimit !== 0
                                                },
                                                {
                                                    dataField: "RefNo02",
                                                    label: { text: "Fleet Card NO" },
                                                    editorType: "dxTextBox",
                                                    editorOptions: { value: iData[0].RefNo02, width: 150 },
                                                    visible: iData[0].FleetLimit !== 0
                                                }
                                            ]
                                        }]
                                    });
                            
                                    // DataGrid for movement
                                    $("#Benefits-Movement").dxDataGrid({
                                        dataSource: [],
                                        allowColumnReordering: true,
                                        showBorders: true,
                                        rowAlternationEnabled: true,
                                        columns: [
                                            { dataField: "ExpGroupDescEng", caption: "Expense", sortOrder: "desc", width: 120 },
                                            { dataField: "QYear", caption: "Year", width: 80 },
                                            { dataField: "LAmount", caption: "Limit Amount", format: "#,##0.00", width: 120 },
                                            { dataField: "TAmount", caption: "Usage", format: "#,##0.00", width: 120 },
                                            { dataField: "TRefundAmt", caption: "Reimbursement", format: "#,##0.00", width: 120 },
                                            { dataField: "MRemained", caption: "Remained", format: "#,##0.00", width: 120 }
                                        ],
                                        summary: {
                                            totalItems: [
                                                { column: "ExpGroupDescEng", summaryType: "count", displayFormat: "TOTAL" },
                                                { column: "TAmount", summaryType: "sum", valueFormat: "#,##0.00" },
                                                { column: "TRefundAmt", summaryType: "sum", valueFormat: "#,##0.00" }
                                            ]
                                        }
                                    });
                            
                                    // First load
                                    reloadBenefitsGrid(selectedYear);
                                });
                            }
                            
                            // Helper: Generate year list
                            function generateYearList() {
                                const now = new Date().getFullYear();
                                const list = [];
                                for (let i = now - 5; i <= now + 1; i++) {
                                    list.push(i);
                                }
                                return list;
                            }
                            
                            // benefit popup (x)
                            function axPopUpBenefits(iData, aaEmpIDx) { //aaMedical,aaFamily,aaSSO,aaMaternity,aaFleet
                                var aYearNum1 = aGetBusYear(1, 4) //aNowDte.getFullYear()
                                var aYearStr1 = aYearNum1.toString()
                                var aCalYear = aNowDte.getFullYear();
                                var aCalYearStr = aCalYear.toString();
                                //PayToCode = '101301' and ((ExpGroupDescEng Like '%SSO%' and (QYear = '2022' or QYear = '2023')) or QYear = '2022') AND (TAmount + TRefundAmt) <> 0
                                //var aaSqlS = "PayToCode LIKE '" + $.trim(aaEmpIDx) + "%' and QYear = " + aYearStr1 + " AND (TAmount + TRefundAmt) <> 0 "
                                var aaSqlS = "PayToCode LIKE '" + $.trim(aaEmpIDx) + "%' AND ((ExpGroupDescEng Like '%SSO%' and (QYear = " + aYearStr1 + " or QYear = " + aCalYearStr + ")) or QYear = " + aYearStr1 + ") AND (TAmount + TRefundAmt) <> 0 "
                                var aaqrFull = aaSqlS;
                                var aaurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "D8CAE826-9DFA-4446-A12C-0C42B1A95ADB" + '/all'
                                var aaSettings = { "url": aaurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": aaqrFull }), };

                                var aaDataRR = iData

                                $(() => {
                                    const popup = $("#popupBenefitsView").dxPopup({
                                        title: "Benefits",
                                        width: '900px',
                                        height: '600px',
                                        position: { offset: "0 -165" }, //{offset: "0 -180"},
                                        //shadingColor: "rgb(186, 242, 252)", //rgba(0, 0, 0, 0.2)
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
                                                $("<span style='font-size: 9px;  color: darkblue;' />").text("[NOT SHOW = Never used, Medical = OPD+Dental]"),
                                                $("<p><center><div id='Benefits-Movement'></div></center></p>"),
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
                                                    editorOptions: { value: aaDataRR[0].EmpName, width: 150 }, //value: asFullName,
                                                },
                                                {
                                                    dataField: "AllowFamily",
                                                    label: { text: "Allow Family" },
                                                    dataType: "boolean",
                                                    //editorType: "dxTextBox",
                                                    editorOptions: { value: aaDataRR[0].AllowFamily, width: 100 }, //value: aaFamily,
                                                },

                                                {
                                                    dataField: "AllowSSO",
                                                    label: { text: "Allow SSO" },
                                                    dataType: "boolean",
                                                    //editorType: "dxTextBox",
                                                    editorOptions: { value: aaDataRR[0].AllowSSO, width: 100 }, //value: aaSSO,
                                                },
                                                {
                                                    dataField: "MedicalLimit",
                                                    label: { text: "Medical Limit" },
                                                    dataType: "number",
                                                    //disabled: true,
                                                    editorOptions: { value: aaDataRR[0].MedicalLimit, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                    visible: true, //value: aaMedical,
                                                },
                                                {
                                                    dataField: "LimitPerCase",
                                                    dtatype: "integer",
                                                    label: { text: "Medical Limit per time" },
                                                    editorOptions: { value: aaDataRR[0].LimitPerCase, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                    visible: (aaDataRR[0].LimitPerCase !== 0),
                                                },
                                                {
                                                    dataField: "MaternityLimit",
                                                    label: { text: "Maternity Limit" },
                                                    dataType: "number",
                                                    //disabled: true,
                                                    editorOptions: { value: aaDataRR[0].MaternityLimit, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                    visible: (aaDataRR[0].MaternityLimit !== 0), //value: aaMaternity,
                                                },
                                                {
                                                    itemType: "empty"
                                                },
                                                {
                                                    dataField: "FleetLimit",
                                                    label: { text: "Fleet Card Limit" },
                                                    dataType: "number",
                                                    //disabled: true,
                                                    editorOptions: { value: aaDataRR[0].FleetLimit, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                    visible: (aaDataRR[0].FleetLimit !== 0),
                                                },
                                                {
                                                    dataField: "RefNo01",
                                                    label: { text: "Plate No" },
                                                    editorType: "dxTextBox",
                                                    editorOptions: { value: aaDataRR[0].RefNo01, width: 150 },
                                                    visible: (aaDataRR[0].FleetLimit !== 0),
                                                },
                                                {
                                                    dataField: "RefNo02",
                                                    label: { text: "Fleet Card NO" },
                                                    editorType: "dxTextBox",
                                                    editorOptions: { value: aaDataRR[0].RefNo02, width: 150 },
                                                    visible: (aaDataRR[0].FleetLimit !== 0),
                                                },
                                            ]

                                        },

                                        ]

                                    }).dxForm("instance");

                                    //Benefits Popup
                                    $("#Benefits-Movement").dxDataGrid({

                                        dataSource: new DevExpress.data.CustomStore({
                                            key: "PayToCode",
                                            loadMode: "omit",
                                            /*load: function () {
                                                return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "D8CAE826-9DFA-4446-A12C-0C42B1A95ADB" + '/all', { "@": aaSqlS }) // Change aaTBKey to TokenKey for this table 5102300001
                                                    .fail(function () { throw "Data loading error" });
                                            },*/
                                            load: function () { return $.post(aaSettings).done(); },
                                        }),

                                        ///dataSource: aaiData,
                                        allowColumnReordering: true,
                                        allowColumnResizing: false,
                                        columnMinWidth: 20,
                                        columnChooser: {
                                            enabled: false //false // true
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
                                                dataField: "LAmount",
                                                caption: "Limit Amount",
                                                dataType: "number",
                                                format: { type: "fixedPoint", precision: 2 },
                                                width: 120,
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

                            // Send Mail & Action
                            function aPopUpAddForm(iData, aHeadRefNO) { // popup Add New
                                var aDataR = iData
                                let aaHeadRefNo = aHeadRefNO
                                var aaPFDMI = isLocalHost();
                                var astr = localStorage["aDXTheme"]
                                var aanewNoteValue = "ccccc"
                                var aanewNoteCode = ""
                                var aanewNoteHBGColor = "#000000"
                                var aanewNoteBGBColor = "#000000" //arSTchangeTo, arButtonText, arButtonIcon
                                var aanewSTChangeTo = ""
                                var aanewSubject = ""
                                var aanewButtonText = ""
                                var aanewButtonIcon = "fas fa-redo-alt"
                                var aaAction = "";
                                var aaSubject = "";

                                var aaSchRef = "HeadRefNo LIKE '%" + aaHeadRefNo + "%'" // scopes based permission (View Only Login Name)
                                
                                // define the $ as jQuery for multiple uses
                                $(() => {
                                    const popup = $("#popupContainerAdd").dxPopup({
                                        title: "Notification Mail & Action",
                                        width: '1500px',
                                        height: '750px',
                                        position: { offset: "0 -120" }, //{offset: "0 -180"},
                                        //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
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
                                                $("<p><div id='Mail-form'></div></p>"),// View in Form
                                                $("<div id='aSendMail_bt'></div>"), // button cssClass: 'second-group',
                                                //$("<span style='padding: 5px 15px;'></span>").text(" "),
                                                $("<div id='aReject_SendMail_bt'></div>"),
                                                $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                $("<span id='Add-popupexit'></span>"),
                                                $("<p><hr></p>"), // Line
                                                $("<p><center><div id='detail-dxDataGrid'></div></center></p>"),
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
                                                hint: "EXIT",
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

                                    // Form Detail
                                    const aform = $("#Mail-form").dxForm({
                                        formData: iData,
                                        showColonAfterLabel: false,
                                        labelLocation: "top",
                                        onFieldDataChanged: function (e) {
                                            let aaDataRowNo
                                            if (e.dataField === "aaAction") { //"ERStatus"
                                                aaDataRowNo = $.inArray(e.value, arSTATUS) // Action List
                                                aanewSubject = arSTATUS[aaDataRowNo] // Subject List
                                                aanewNoteValue = arSTANOTE[aaDataRowNo] // Note List
                                                aanewSTChangeTo = arSTchangeTo[aaDataRowNo] // Change Status List
                                                aanewButtonText = arButtonText[aaDataRowNo] // Action List
                                                aanewButtonIcon = arButtonIcon[aaDataRowNo] // Button Icon List
                                                aanewNoteHBGColor = arHBGColor[aaDataRowNo] // Popup Title Background Color List
                                                aanewNoteBBGColor = arBBGColor[aaDataRowNo] // Comment Background Color List

                                                $('.color-BBG').css('background-color', aanewNoteBBGColor);
                                                e.component.updateData("Note", aanewNoteValue);
                                                e.component.updateData("ERODesc01", aanewSubject);
                                                if (aanewButtonText.toUpperCase().includes("SEND MAIL")) {
                                                    $("#aReject_SendMail_bt").dxButton("instance").option("visible", false);
                                                    $("#aSendMail_bt").dxButton("instance").option("visible", true);
                                                } else {
                                                    $("#aReject_SendMail_bt").dxButton("instance").option("visible", true);
                                                    $("#aSendMail_bt").dxButton("instance").option("visible", false);
                                                }
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
                                                editorOptions: { readOnly: true, width: 150 },
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
                                                dataField: "ExpGroupDescEng", // ExpensesDescription
                                                label: { text: "Expenses" },
                                                //disabled: true,
                                                editorOptions: { readOnly: true, width: 180 },
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
                                            items: [
                                                {
                                                    dataField: "ERODesc06",
                                                    label: { text: "Email TO" },
                                                    editorType: "dxTextBox",
                                                    editorOptions: { width: 350 },
                                                    width: 350,
                                                },
                                                {
                                                    dataField: "aaAction", 
                                                    label: { text: "Action" },
                                                    editorType: "dxSelectBox",
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
                                                    colSpan: 4,
                                                    dataField: "ERODesc01",
                                                    label: { text: "Subject" },
                                                    cssClass: "color-BBG",
                                                    editorType: "dxTextBox",
                                                    editorOptions: {
                                                        width: 350,
                                                        showClearButton: true,
                                                        placeholder: "Enter subject..." // optional but improves clarity
                                                    }
                                                },
                                                {
                                                    colSpan: 4,
                                                    dataField: "Note",
                                                    label: { text: "Comment/Body" },
                                                    cssClass: "color-BBG",
                                                    validationRules: [{ type: 'required', message: 'Comment is required' }],
                                                    editorType: "dxTextArea",
                                                    editorOptions: { width: 1200, height: 140 },
                                                },

                                            ]
                                        },

                                        ]

                                    }).dxForm("instance")

                                    // Send Mail Only Button
                                    $("#aSendMail_bt").dxButton({
                                        hint: "Send Mail to Requester.",
                                        icon: "fas fa-paper-plane",
                                        type: "success",
                                        text: "SEND MAIL ONLY    ", 
                                        //text: "ACTION & SEND MAIL",
                                        width: "190px",
                                        visible: true,
                                        onClick: function (e) {
                                            if (aanewButtonText === "" || !aanewButtonText.toUpperCase().includes("SEND MAIL")) { //
                                                DevExpress.ui.dialog.alert({
                                                    showTitle: false,
                                                    messageHtml: "<center style='color:LightRed;'> Please Select Subject for Send Mail !! </center>"
                                                });
                                            } else {
                                                // Send Mail Function
                                                var aaMailTitle = iData.ERODesc01; //iData.ERStatus; // aOnInitExpGroupDesc.toUpperCase()  + " REIMBURSEMENT ALERT"
                                                var aApproverName = aaHRAppName
                                                var aApproverEmail = $.trim(aaHRAppEmail)
                                                var aRequesterName = iData.PayToName
                                                var aRequesterEmail = iData.ERODesc06 //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                var aHColorBG = aanewNoteHBGColor
                                                var aBColorBG = aanewNoteBBGColor
                                                var aSubject = aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT - " + aaMailTitle
                                                var aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>";
                                                var aBodyWCode = iData.Note
                                                var vRefNo = iData.HeadRefNo
                                                let getvalues = { vRefNo: vRefNo, aBodyWCode: aBodyWCode, aApproverName: aApproverName, aApproverEmail: aApproverEmail, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName }

                                                let aMessage01 = aArrays.AEMAIL[1].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color:" + aHColorBG + ";color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT <br><small>" + aaMailTitle + "</small></center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:" + aBColorBG + ";'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                                var result = DevExpress.ui.dialog.custom({
                                                    title: "[ATTENTION] , please check before Confirm !!",
                                                    message: aMessage,
                                                    buttons: [
                                                        { text: "SEND MAIL", onClick: () => true },
                                                        { text: "CANCEL", onClick: () => false }
                                                    ],
                                                    position: {
                                                        of: window,  // Position relative to the window
                                                        my: "center", // Center horizontally
                                                        at: "center", // Center vertically
                                                        offset: "0 -150" // Move up by 100px (y-axis)
                                                    }
                                                }).show();

                                                result.done(function (dresult) {
                                                    if (dresult) {
                                                        aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)
                                                        aMessageAlert("Already send Mail !!", "Red")
                                                        popup.hide();
                                                    }
                                                    
                                                })
                                                // Send Mail Function End
                                                
                                            }
                                        }
                                    });

                                    // Action & Send Mail button
                                    $("#aReject_SendMail_bt").dxButton({
                                        hint: "Action (RETURN or DENIED then Send mail to Requester ", //+ "[chang status to " + aanewSTChangeTo + "]",
                                        icon: aanewButtonIcon, //"fas fa-redo-alt", //bullseye
                                        type: "default",
                                        text: "ACTION & SEND MAIL", // aanewButtonText
                                        width: "190px",                       
                                        visible: false,
                                        onClick: function (e) {
                                            if (aanewButtonText === "" ||
                                                aanewButtonText.toUpperCase().includes("SEND MAIL")) {
                                                DevExpress.ui.dialog.alert({
                                                    showTitle: false,
                                                    messageHtml: "<center style='color:LightRed;'> Please Select Subject for Action !! </center>"
                                                });
                                            } else {
                                                let result = DevExpress.ui.dialog.confirm("Are you sure you want to " + aanewButtonText + " and send mail to requester?", aanewButtonText + ": Change Status to " + aanewSTChangeTo);
                                                result.done(function (dresult) {
                                                    if (dresult) {

                                                        let aERStatus = aanewSTChangeTo //"Register" //"HR Denied" // "Confirmed wait for HR"

                                                        var aTrueORFalse = '0'
                                                        var aTrueValue = '1'
                                                        var aSQLCommand = ""

                                                        // Action & Send Mail Function
                                                        var aaMailTitle = iData.ERODesc01; //iData.ERStatus; // aOnInitExpGroupDesc.toUpperCase()  + " REIMBURSEMENT ALERT"
                                                        var aApproverName = aaHRAppName
                                                        var aApproverEmail = $.trim(aaHRAppEmail)
                                                        var aRequesterName = iData.PayToName
                                                        var aRequesterEmail = iData.ERODesc06 //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                        var aHColorBG = aanewNoteHBGColor
                                                        var aBColorBG = aanewNoteBBGColor
                                                        var aSubject = aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT - " + aaMailTitle
                                                        var aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>";
                                                        var aBodyWCode = iData.Note
                                                        var vRefNo = iData.HeadRefNo
                                                        let getvalues = { vRefNo: vRefNo, aBodyWCode: aBodyWCode, aApproverName: aApproverName, aApproverEmail: aApproverEmail, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName }

                                                        let aMessage01 = aArrays.AEMAIL[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                        var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color:" + aHColorBG + ";color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT <br><small>" + aaMailTitle + "</small></center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:" + aBColorBG + ";'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                                        var result = DevExpress.ui.dialog.custom({
                                                            title: "[ATTENTION] , please Confirm again before Action !!",
                                                            message: aMessage,
                                                            buttons: [
                                                                { text: "Action & Send Mail", onClick: () => true },
                                                                { text: "Cancel", onClick: () => false }
                                                            ],
                                                            position: {
                                                                of: window,  // Position relative to the window
                                                                my: "center", // Center horizontally
                                                                at: "center", // Center vertically
                                                                offset: "0 -150" // Move up by 100px (y-axis)
                                                            }
                                                        }).show();

                                                        result.done(function (dresult) {
                                                            if (dresult) {
                                                                if (aERStatus === "HR Denied") {
                                                                    //alert(aERStatus)
                                                                    aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET HRApproved = " + aTrueORFalse + ", Confirmed = " + aTrueValue + ", ERStatus = '" + aERStatus + "', LocalAmount = 0, RefundedAmount = 0 Where HeadRefNo = '" + aaHeadRefNo + "'"
                                                                    // alert(aSQLCommand)
                                                                } else {
                                                                    aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET HRApproved = " + aTrueORFalse + ", EROCheck06 = " + aTrueValue + ", Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + aaHeadRefNo + "'"
                                                                    //alert(aSQLCommand)
                                                                    //let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET HRApproved = " + aTrueORFalse + ", Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'" 
                                                                }
                                                                // take // off for action
                                                                aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo return status to Register
                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();

                                                                // Send Mail
                                                                aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)
                                                                aMessageAlert("Already Action & Send Mail !!", "Red")
                                                                popup.hide();
                                                            }
                                                        })
                                                        // Action & Send Mail Function End



                                                        // Send Mail Function
                                                        // var aaMailTitle = iData.ERStatus.toUpperCase();
                                                        // //var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " REIMBURSEMENT REJECT"; // REIMBURSEMENT
                                                        // var aApproverName = aaHRAppName //+ " [HR]"         //aaHRAppName //"Wikran" + " [HR]"         // HR Approver Name
                                                        // var aApproverEmail = $.trim(aaHRAppEmail) // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                        // var aRequesterName = aDataR.PayToName //e.data.PayToName //"Wikran Intaraprajaks"
                                                        // var aRequesterEmail = iData.ERODesc06 //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                        // var aHColorBG = aanewNoteHBGColor
                                                        // var aBColorBG = aanewNoteBBGColor
                                                        // var aSubject = aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT - " + aaMailTitle //aDataR.ERStatus //aaOnInitExpGroupDesc 
                                                        // var aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>"; //<a href='https://www.w3schools.com'>Visit W3Schools</a>
                                                        // var vRefNo = aDataR.HeadRefNo
                                                        // var aBodyWCode = iData.Note
                                                        // //aBodyWCode = aBodyWCode.replace("<#vRefNo#>", vRefNo)
                                                        // //alert(aBodyWCode)
                                                        // var aMessage01 = "<div>���? �?" + $.trim(aRequesterName) + "<br>&nbsp;&nbsp;&nbsp;&nbsp;" + aBodyWCode + "<br><br>��?�?���?��� REFNO = [" + vRefNo + "]<br> ����?��?��������� " + aAddress2Do + " " + "(���� -> Medical Expenses)<br><br><br><b> HR Administrator </b><br></div>" // <br>Regards,<br> //" + aaHRAppName + "
                                                        // //let aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>Please Approve at &nbsp;'+ aAddress2Do +'</center></strong></span></h2></td></tr></tbody></table>'              
                                                        // //var aMessage =  "<table border=0 cellpadding=1 cellspacing=1 style=width:500px background-color: lightgrey><tbody><tr><td style='width:454px'><p style='text-align:center'><span style='font-size:20px'><strong><span style='color:#d35400'>Reimbursement REJECT !!!</span></strong></span></p></td></tr><tr><td style='width:454px'>"+ aMessage01 + "</td></tr></tbody></table>"
                                                        // //var aMessage = "<!DOCTYPE html><html><head><style>table { border: 1px; border-radius: 5px; border-collapse: collapse; width: 50%;}th, td {  text-align: left;  padding: 8px;}tr:nth-child(even){background-color: #ffe6ff }th {  background-color: #dc1403;  color: white;}</style></head><body><table><tr><th  style = 'font-size: 22px;'><center />&#9728; " + aaMailTitle + " &#9728;</th></tr><tr><td style = 'font-size: 13px; background-color:#e6e6e6'>" + aMessage01 + "</td>  </tr></tr></table></body></html>" //#fff7e6 #e6e6e6 #fff7e6
                                                        // //var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #dc1403;color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT <br><small>" + aaMailTitle + "</small></center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#fde4e4;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                        // var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color:" + aHColorBG + ";color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT <br><small>" + aaMailTitle + "</small></center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:" + aBColorBG + ";'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                        // // send mail API
                                                        // //alert(aMessage)

                                                        // ////aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)
                                                        // aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aApproverEmail, "", "", aSubject, aMessage)


                                                        // $("#gridContainer").dxDataGrid("instance").refresh();
                                                        // $("#gridContainer").dxDataGrid("instance").refresh();
                                                        // aMessageAlert("Already Changed Status to " + aERStatus + " and Send Mail", "Red")
                                                        // popup.hide();
                                                    }
                                                }
                                                )
                                            }
                                        }
                                    });

                                    // Exit 
                                    $("#Add-popupexit").dxButton({
                                        icon: "fas fa-times",
                                        type: "danger",
                                        text: "EXIT",
                                        //width: "120px",
                                        visible: true,
                                        onClick: function () {
                                            popup.hide();
                                        }
                                    });

                                    $("#detail-dxDataGrid").dxDataGrid({

                                        dataSource: new DevExpress.data.CustomStore({
                                            key: "REFNO",
                                            loadMode: "omit",
                                            load: function () {
                                                return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all', { "@": aaSchRef }) // Change aaTBKey to TokenKey for this table 5102300001
                                                    .fail(function () { throw "Data loading error" });
                                            },
                                        }),

                                        ///dataSource: aaiData,
                                        allowColumnReordering: true,
                                        allowColumnResizing: false,
                                        columnMinWidth: 20,
                                        columnChooser: {
                                            enabled: false //false // true
                                        },

                                        showBorders: true,
                                        showColumnLines: true,
                                        showRowLines: true,
                                        columns: [

                                            {
                                                dataField: "ID",
                                                sortOrder: "asc",
                                                caption: "NO",
                                                dataType: "number",
                                                editorOptions: { width: 60 },
                                                width: 60
                                            },
                                            {
                                                dataField: "ReqDate",
                                                caption: "Submitted Date",
                                                dataType: "date",
                                                format: "dd/MM/yyyy",
                                                editorOptions: { width: 100 },
                                                validationRules: [{ type: "required" }],
                                                width: 100,
                                                visible: false,
                                            },

                                            {
                                                dataField: "ERODesc03",
                                                caption: "Hospital/Clinic Name",
                                                dataType: "string",
                                                //editorType:"dxTextArea",
                                                //editorOptions: {width: 200}, //, height: 80
                                                width: 150,
                                                validationRules: [{ type: "required" }],
                                                //visible: false,
                                            },
                                            {
                                                dataField: "ERORefNo4",
                                                caption: "Bill No",
                                                dataType: "string",
                                                width: 100,
                                                visible: false,
                                            },
                                            {
                                                dataField: "ERODate01",
                                                caption: "Treatment Date",
                                                dataType: "date",
                                                format: "dd/MM/yyyy",
                                                width: 150,
                                                editorOptions: { width: 150 },
                                                validationRules: [{ type: "required" }],
                                            },
                                            {
                                                dataField: "EROCode01",
                                                caption: "IPD/OPD",
                                                dataType: "string",
                                                width: 90,
                                                visible: false,
                                            },
                                            {
                                                dataField: "EROCode02",
                                                caption: "Employee Type",
                                                dataType: "string",
                                                width: 110,
                                                //validationRules: [{ type: "required" }],
                                                //visible: false,
                                            },
                                            {
                                                dataField: "ERORefNo3",
                                                caption: "Exp. Type",
                                                dataType: "string",
                                                width: 150,
                                            },
                                            {
                                                dataField: "ERODesc01",
                                                caption: "Patient Name",
                                                dataType: "string",
                                                //editorType:"dxTextArea",
                                                //editorOptions: {width: 200}, //, height: 80
                                                width: 150,
                                                visible: false,
                                            },
                                            {
                                                dataField: "ERODesc02",
                                                caption: "Disease",
                                                dataType: "string",
                                                //editorType:"dxTextArea",
                                                editorOptions: { width: 250 }, //, height: 80
                                                width: 250,
                                                validationRules: [{ type: "required" }],
                                                //visible: false,
                                            },
                                            {
                                                dataField: "Amount",
                                                caption: "Actual Amount",
                                                dataType: "number",
                                                format: { type: "fixedPoint", precision: 2 },
                                                editorType: "dxNumberBox",
                                                editorOptions: { format: "#,##0.00", width: 120 },
                                                width: 120,
                                                validationRules: [{ type: "required" }],
                                                visible: true,
                                            },

                                            {
                                                dataField: "NeedPayment",
                                                caption: "Refunded",
                                                dataType: "number",
                                                width: 110,
                                                visible: false,
                                            },
                                            {
                                                dataField: "RefundedAmount",
                                                caption: "Reimbursement",
                                                dataType: "number",
                                                format: { type: "fixedPoint", precision: 2 },
                                                editorOptions: { format: "#,##0.00", width: 120 },
                                                validationRules: [{ type: "required" }],
                                                width: 120,
                                            },
                                            {
                                                dataField: "ERODesc05",
                                                caption: "HR NOTE",
                                                dataType: "string",
                                                width: 250,
                                                height: 80,
                                                visible: true,
                                            },

                                        ],
                                        // summary
                                        summary: {//ReqDate
                                            recalculateWhileEditing: true,
                                            skipEmptyValues: false,
                                            totalItems: [
                                                {
                                                    column: "ERORefNo4",
                                                    summaryType: "count",
                                                    displayFormat: "TOTAL",
                                                },
                                                {
                                                    column: "ERODate01",
                                                    summaryType: "count",
                                                    displayFormat: "{0} Items",
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

                                        },

                                    }).dxDataGrid("instance");

                                });
                            }

                            // not use
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
                            //             title: "Expenses Reimbursement",
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
                            //             //shadingColor:"rgb(190,190,190,0.9)",
                            //             //toolbarItems: [{toolbar:"top", html: "<span id='popupexit'></span>"}],
                            //             //toolbarItems: [
                            //             //    {toolbar:"top", html:"<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"}],            
                            //             contentTemplate: function () {
                            //                 return $("<div />").append(
                            //                     $("<p><div id='form'></div></p>"),
                            //                     $("<p><span id='asave'></span></p>"),
                            //                     // $("<p><div id='visibleform'></div></p>"),
                            //                     //$("<p><center><div id='username'></div></center></p>"),
                            //                     // $("<p><center><div id='password'></div></center></p>"),
                            //                     // $("<p><center><div id='OTP'></div></center></p>"),
                            //                     // $("<p <div id='popover1'>Please get OTP from your register e-Mail, put here and then press [LOGIN]</div></p>"),
                            //                     // $("<p><span id='print'></span></p>"), 
                            //                     // $("<span id='popupexit'></span>")                              
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

                            //             /* onContentReady: function() { 
                            //                      $("#OTP").hide(); 
                            //              }*/
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

                            //         // not use
                            //         // const aform = $("#form").dxForm({
                            //         //     formData: iData,
                            //         //     showColonAfterLabel: false,
                            //         //     labelLocation: "top",
                            //         //     colCount: 1,
                            //         //     items: [{
                            //         //         itemType: "group",
                            //         //         //caption: "Refference",
                            //         //         colCount: 4,
                            //         //         items: [{
                            //         //             dataField: "HeadRefNo",
                            //         //             label: { text: "REF NO" },
                            //         //             disabled: true,
                            //         //             editorOptions: { width: 150 },
                            //         //         },
                            //         //         {
                            //         //             dataField: "ReqDate",
                            //         //             label: { text: "Date" },
                            //         //             disabled: true,
                            //         //             editorType: "dxDateBox",
                            //         //             editorOptions: { displayFormat: "dd/MM/yyyy", width: 150 },	  //showClearButton: true,                  
                            //         //         },
                            //         //         {
                            //         //             dataField: "PayToName",
                            //         //             label: { text: "Pay To" },
                            //         //             disabled: true,
                            //         //             editorOptions: { width: 250 },
                            //         //         },
                            //         //         //{
                            //         //         //    itemType: "empty"
                            //         //         //},                           
                            //         //         {
                            //         //             dataField: "ExpensesDescription",
                            //         //             label: { text: "Expenses" },
                            //         //             disabled: true,
                            //         //             editorOptions: { width: 250 },
                            //         //         },


                            //         //         ]

                            //         //     },
                            //         //     {
                            //         //         itemType: "group",
                            //         //         //caption: "Amount",
                            //         //         colCount: 4,
                            //         //         items: [{
                            //         //             dataField: "Currency",
                            //         //             //label: {text: "Currency"},
                            //         //             value: "THB",
                            //         //             width: 80,
                            //         //             validationRules: [{ type: "required" }],
                            //         //             /*lookup: {
                            //         //                         dataSource: aaCurrency, //Code,Name
                            //         //                         valueExpr: "Code",
                            //         //                         displayExpr: "Code",
                            //         //                     },                            
                            //         //             editCellTemplate: dropDownBoxCURR,*/

                            //         //             editorType: "dxDropDownBox",
                            //         //             editorOptions: {
                            //         //                 dataSource: aaCurrency, //Code,Name
                            //         //                 valueExpr: "Code",
                            //         //                 displayExpr: "Code",
                            //         //                 width: 380,
                            //         //                 contentTemplate: function (e) {
                            //         //                     return $("<div>").dxDataGrid({
                            //         //                         dataSource: aaCurrency,
                            //         //                         //remoteOperations: true,
                            //         //                         columns: [{ dataField: "Code", caption: "Code", width: 80 }, { dataField: "Name", caption: "Currency", width: 150 }, { dataField: "xRate", caption: "X-Rate", width: 80, format: "#,##0.000000" }], //ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE
                            //         //                         hoverStateEnabled: true,
                            //         //                         paging: { enabled: true, pageSize: 15 },
                            //         //                         searchPanel: { visible: true },
                            //         //                         headerFilter: { visible: true },
                            //         //                         filterRow: { visible: true },
                            //         //                         showBorders: true,
                            //         //                         scrolling: { mode: "virtual" },
                            //         //                         selection: { mode: "single" },
                            //         //                         height: 250,
                            //         //                         //selectedRowKeys: [cellInfo.value],                                      
                            //         //                         //focusedRowKey: cellInfo.value,
                            //         //                         onSelectionChanged: function (sArgs) {
                            //         //                             //alert(gbxRateV)
                            //         //                             console.log(sArgs.selectedRowKeys[0].xRate)
                            //         //                             gbxRateV = sArgs.selectedRowKeys[0].xRate
                            //         //                             //alert(gbxRateV)
                            //         //                             e.component.option("value", sArgs.selectedRowKeys[0].Code);
                            //         //                             //cellInfo.setValue(sArgs.selectedRowKeys[0].Code);
                            //         //                             //console.log("v")
                            //         //                             //console.log(cellInfo.value)
                            //         //                             if (sArgs.selectedRowKeys.length > 0) {
                            //         //                                 e.component.close();
                            //         //                             }

                            //         //                         }
                            //         //                     });
                            //         //                 },
                            //         //             },

                            //         //             onFieldDataChanged: function (e) {
                            //         //                 var updatedField = e.dataField;
                            //         //                 var newValue = e.value;
                            //         //                 alert(updatedField)
                            //         //                 alert(newValue)
                            //         //                 // Event handling commands go here
                            //         //             },
                            //         //             setCellValue: function (newData, value, currentRowData) {

                            //         //                 if (arDataU === 1) {
                            //         //                     newData.Currency = value;
                            //         //                     let aResult = aSearchXjson(aaCurrency, value);
                            //         //                     newData.Xrate = aResult[0].xRate;
                            //         //                     //newData.LocalAmount = currentRowData.Amount * (1/aResult[0].xRate);
                            //         //                 }
                            //         //             },

                            //         //         },
                            //         //         //{
                            //         //         //itemType: "empty"
                            //         //         //},                             
                            //         //         {
                            //         //             dataField: "Xrate",
                            //         //             label: { text: "X-Rate" },
                            //         //             dataType: "number",
                            //         //             //format:{ type:"fixedPoint", precision: 6 },
                            //         //             editorType: "dxNumberBox",
                            //         //             editorOptions: {
                            //         //                 value: gbxRateV,
                            //         //                 format: "#,##0.000000",
                            //         //                 width: 150,
                            //         //             },
                            //         //             onValueChanged: function (data) {
                            //         //                 console.log(data.value);
                            //         //             }
                            //         //             //value: gbxRateV,
                            //         //             //visible: false,
                            //         //         },
                            //         //         //{
                            //         //         //    itemType: "empty"                               
                            //         //         //},
                            //         //         {
                            //         //             itemType: "tabbed",
                            //         //             width: 350,
                            //         //             tabPanelOptions: {
                            //         //                 deferRendering: false
                            //         //             },
                            //         //             tabs: [{
                            //         //                 title: "HOD Approval",
                            //         //                 items: ["Confirmed"]
                            //         //             },
                            //         //             {
                            //         //                 title: "HR Approval",
                            //         //                 items: [
                            //         //                     {
                            //         //                         dataField: "HRApproved",
                            //         //                         label: { text: "HR Approved" },
                            //         //                         allowEditing: false,
                            //         //                     },
                            //         //                 ]
                            //         //             },
                            //         //             {
                            //         //                 title: "FA Approval",
                            //         //                 items: [
                            //         //                     {
                            //         //                         dataField: "Approved",
                            //         //                         label: { text: "FA Approved" },
                            //         //                     },
                            //         //                     {
                            //         //                         dataField: "PBatchNo",
                            //         //                         label: { text: "Pay Batch NO" },
                            //         //                         editorOptions: { width: 150 },
                            //         //                     },
                            //         //                     {
                            //         //                         dataField: "PBatchDate",
                            //         //                         label: { text: "Data" },
                            //         //                         disabled: true,
                            //         //                         editorType: "dxDateBox",
                            //         //                         editorOptions: { displayFormat: "dd/MM/yyyy", width: 150 },
                            //         //                     }
                            //         //                 ]
                            //         //             }
                            //         //             ]
                            //         //         }

                            //         //         ]
                            //         //     },
                            //         //     {
                            //         //         itemType: "group",
                            //         //         caption: "Details",
                            //         //         colCount: 7,
                            //         //         items: [
                            //         //             {
                            //         //                 dataField: "ID",
                            //         //                 sortOrder: "asc",
                            //         //                 label: { text: "NO" },
                            //         //                 editorOptions: { format: "###0", rtlEnabled: true, width: 40 },
                            //         //             },
                            //         //             {
                            //         //                 dataField: "ERORefNo1",
                            //         //                 label: { text: "Fleet Card NO" },
                            //         //                 //disabled: true,
                            //         //                 editorOptions: { width: 150 },
                            //         //             },
                            //         //             {
                            //         //                 dataField: "ERORefNo2",
                            //         //                 label: { text: "Plate No" },
                            //         //                 editorOptions: { width: 150 },
                            //         //             },
                            //         //             {
                            //         //                 dataField: "ERODate01",
                            //         //                 label: { text: "Date" },
                            //         //                 editorType: "dxDateBox",
                            //         //                 editorOptions: { displayFormat: "dd/MM/yyyy", width: 150 },
                            //         //             },
                            //         //             {
                            //         //                 dataField: "LocalAmount",
                            //         //                 label: { text: "Amount" },
                            //         //                 editorType: "dxNumberBox",
                            //         //                 //format:{ type:"fixedPoint", precision: 2 },
                            //         //                 //format: "#,##0.00",
                            //         //                 editorOptions: { format: "#,##0.00", rtlEnabled: true, width: 150 },
                            //         //             },
                            //         //             {
                            //         //                 dataField: "EROCheck01",
                            //         //                 label: { text: "Pay Slip" },
                            //         //             },
                            //         //             {
                            //         //                 dataField: "EROCheck02",
                            //         //                 label: { text: "Tax Invoice" },
                            //         //             },
                            //         //         ]

                            //         //     },
                            //         //     {
                            //         //         itemType: "group",
                            //         //         //caption: "Details",
                            //         //         colCount: 2,
                            //         //         items: [
                            //         //             {
                            //         //                 dataField: "ERODesc01",
                            //         //                 label: { text: "Note" },
                            //         //                 editorType: "dxTextArea",
                            //         //                 editorOptions: { width: 800, height: 100 },

                            //         //             },
                            //         //             /* {
                            //         //             //      itemType: "button",
                            //         //             //      buttonOptions: {
                            //         //             //          icon: "save",
                            //         //             //          text: "SAVE",
                            //         //             //          useSubmitBehavior: true
                            //         //             //      }
                            //         //             //  }*/
                            //         //         ]
                            //         //     }

                            //         //     ]

                            //         // }).dxForm("instance");

                            //         // not use
                            //         /*
                            //         $("#aformSave").on("submit", function (e) {
                            //             console.log("Done")
                            //             alert(e)
                            //             setTimeout(function () {
                            //                 alert("Submitted");
                            //                 alert(e)
                            //             }, 1000);
        
                            //             e.preventDefault();
                            //         });
                            //         */
                            //         /*$("#username").dxTextBox({
                            //                 mode: "text",
                            //                 placeholder: "Enter username",
                            //                 showClearButton: true,
                            //                 onValueChanged: function (e) {
                            //                     const previousValue = e.previousValue;
                            //                     ausrs = e.value;
                            //                     // Event handling commands go here
                            //                     // DevExpress.ui.notify(newValue);
                            //                 },
                            //                 width: "250px",
                            //                 value: ""
                            //         }).dxTextBox("instance");
                                            
                            //         $("#password").dxTextBox({
                            //                 mode: "password",
                            //                 placeholder: "Enter password",
                            //                 showClearButton: true,
                            //                 onValueChanged: function (e) {
                            //                     const previousValue = e.previousValue;
                            //                     apwds = e.value;
                            //                     // Event handling commands go here
                            //                     // DevExpress.ui.notify(newValue);
                            //                 },
                            //                 width: "250px",
                            //                 value: ""
                            //         }).dxTextBox("instance");
                                
                            //         $("#OTP").dxTextBox({
                            //                 mode: "text",
                            //                 placeholder: "put OTP and press LOGIN",
                            //                 showClearButton: true,
                            //                 onValueChanged: function (e) {
                            //                     const previousValue = e.previousValue;
                            //                     aOTP = e.value;
                            //                     // Event handling commands go here
                            //                     // DevExpress.ui.notify(newValue);
                            //                 },
                            //                 width: "250px",
                            //                 value: ""
                            //         }).dxTextBox("instance");
                                
                            //         $("#popover1").dxPopover({
                            //             target: "#OTP",
                            //             showEvent: "mouseenter",
                            //             hideEvent: "mouseleave",
                            //             position: "top",
                            //             width: 300
                            //         });*/

                            //         // not use
                            //         /*
                            //         $("#icon-dones").dxButton({
                            //             icon: "fas fa-key",
                            //             type: "success",
                            //             text: "LOGIN",
                            //             width: "120px",
                            //             visible: true,
                            //             onClick: function (e) {
                            //                 //console.clear();	
                            //                 //var aUname = document.getElementById("uname").value;
                            //                 //var aPswd = document.getElementById("pswd").value; 			
                            //                 if (jQuery.type(ausrs) === "undefined") {
                            //                     var aUname = ""
                            //                 } else {
                            //                     var aUname = ausrs
                            //                 };
                            //                 if (jQuery.type(apwds) === "undefined") {
                            //                     var aPswd = ""
                            //                 } else {
                            //                     var aPswd = apwds;
                            //                 };
                            //                 if (aUname === "" || aPswd === "") {
                            //                     DevExpress.ui.dialog.alert({
                            //                         showTitle: false,
                            //                         messageHtml: "<center style='color:Red;'>Username and Password can not be blank !!</center>"
                            //                     });
                            //                 }
                            //                 else {
                            //                     localStorage.setItem("aaPFDMI", aaPFDMI);
                            //                     localStorage.setItem("aaXXuX", aUname);
                            //                     var aaXTGO = "A75FCC75-8FB6-4460-B3F6-7070B4437930"; //Guest
                            //                     var aaTBXX = "01f518c9-c818-4e9f-85cb-6245ee1a2637";
                            //                     //var aaLng = aaLoginGet(aaPFDMI,aUname, aPswd); //aaLoginaa(aUname,aPswd);
                            //                     //alert(aUname);
                            //                     var aLtext = "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
                            //                     //alert(aLtext);
                            //                     //"@": "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
                            //                     var myHeaders = new Headers();
                            //                     myHeaders.append("Content-Type", "application/json");
                            //                     var raw = JSON.stringify({
                            //                         "@": "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
                            //                     });
        
                            //                     var requestOptions = {
                            //                         method: 'POST',
                            //                         headers: myHeaders,
                            //                         body: raw,
                            //                         redirect: 'follow'
                            //                     };
        
                            //                     let aURL = aaPFDMI + "/DMQ/XOL/" + aaXTGO + "/" + aaTBXX + "/all"; // + aUname;
        
                            //                     fetch(aURL, requestOptions)
                            //                         .then(response => response.json())
                            //                         //  .then(data => {console.log(data)});
                            //                         .then(aData => {
                            //                             //console.log('Success:', aData);
                            //                             //console.log(aData[0].IDUsr);
                            //                             //console.log(aData[0].Gright);
                            //                             //console.log(aData[0].Pword);
                            //                             //console.log(result);
                            //                             //localStorage.setItem("aaXXoX", aData[0].TKey); 
                            //                             //localStorage.setItem("aaXrXg", response.KeyRights);                        
                            //                             if (aPswd === aData[0].Pword) {
                            //                                 var aal = btoa(aData[0].Gright);
                            //                                 var aat = btoa(aData[0].Tkey);
                            //                                 var aLGName = aData[0].LGName;
                            //                                 var aemail = aData[0].email;
                            //                                 var aotpx = aData[0].otp;
                            //                                 var apict = aData[0].PictureLoc;
                            //                                 //console.log(aLGName)
                            //                                 //console.log(aemail)
                            //                                 //console.log(aotpx)
                            //                                 //alert(aal);
                            //                                 //alert(aData[0].Pword);
                            //                                 //alert(aPswd === aData[0].Pword);
                            //                                 localStorage.setItem("aaXrXg", aal);
                            //                                 localStorage.setItem("aaXXoX", aat);
                            //                                 localStorage.setItem("aaXpXt", apict);
        
                            //                                 if (aOTP === aOTPm || aWOTP === 0) {
                            //                                     //aGoTo("index02.html");
                            //                                     aGoTo("index03.html");
                            //                                 } else {
                            //                                     aii++;
                            //                                     $("#username").hide();
                            //                                     $("#password").hide();
                            //                                     $("#OTP").show(20);
                            //                                     if (aii <= 1) {
                            //                                         var aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>OTP =&nbsp;' + aOTPm + '</center></strong></span></h2></td></tr></tbody></table>'
                            //                                         // 
                            //                                         //                                       aRecipient, aRCPeMail               ,aSendereMail        , aCCeMail, aBcceMail,aSubject,aMessage "Dear Wikran <br/><br/>&nbsp;&nbsp; OTP = <br/><br/><br/>Regards,<br />XOL Admin."
                            //                                         var lSentM = aSendMailDMZ("Khun " + aLGName, aemail, "XOL-admin@lockton.com", "wikran@hotmail.com", "", "OTP = " + aOTPm, "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aLGName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");
        
                            //                                         DevExpress.ui.dialog.alert({
                            //                                             showTitle: false,
                            //                                             messageHtml: "<center style='color:ForestGreen;'> Sendind OTP to your e-Mail, please check </center>"
                            //                                         });
                            //                                     } else {
                            //                                         DevExpress.ui.dialog.alert({
                            //                                             showTitle: false,
                            //                                             messageHtml: "<center style='color:Red;'> Please check OTP from your e-Mail again !!" + aii + "</center>"
                            //                                         });
                            //                                     }
                            //                                 }
        
                            //                             } else {
        
                            //                                 DevExpress.ui.dialog.alert({
                            //                                     showTitle: false,
                            //                                     messageHtml: "<center><b style='color:Tomato;'>Please Try Again!!</b></center>"
                            //                                 });
                            //                             }
        
                            //                         })
                            //                         .catch(error => {
                            //                             console.error('Error:', error);
                            //                             DevExpress.ui.dialog.alert({
                            //                                 showTitle: false,
                            //                                 messageHtml: "<center><b style='color:Tomato;'>Please Try Again!!</b></center>"
                            //                             });
                            //                         });
        
                            //                 }
                            //             }
                            //         });
                            //         */
                            //     });
                            // }

                        }) //then fetch (HOR or HR Email get inside better ?)
                }); // load content  
        });
        // TOP PRG
    });  // ajax          

