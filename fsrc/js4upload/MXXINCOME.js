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
var aaXToX = localStorage["aaXXoX"];
var aaERTYPE = "700" // Income
const aaRunPre = "G"

async function aaLoadData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, condition) {
    let aTokena = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
    let axqr2S = `Where ${aKeyfield} LIKE '%${aKeya}%'`;
    let axFullBody = "Select " + axFieldSelected + " From " + aDataBasea + " " + axqr2S;
    let response = await fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + aTokena, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "@": btoa(axFullBody) }),
        redirect: "follow"
    });
    let acData = await response.json();
    const filteredArray = acData.filter(condition);
    let abc;
    if (filteredArray.length === 0) { //pass                
        abc = 0;
    } else { // not pass

        abc = 1;
    }
    return abc;
}

const aTranTextJson = (aText, aFMark, aLMark) => { //"NAME:" "EMAIL:"
    var axHODFtext = aText;
    var xaChkName;
    var aatestChk = axHODFtext.replaceAll("|", '"')
    var xxChk1 = aatestChk.search(aFMark);
    var xxChk2 = aatestChk.search(aLMark);
    xxChk1 = aatestChk.search(aFMark)
    xxChk2 = aatestChk.search(aLMark)
    if (aLMark === "") {
        xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, 300)); //xxChk1+5, xxChk2-5);
    } else {
        xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, xxChk2 - xxChk1 - 5)); //xxChk1+5, xxChk2-5);
    }
    const xxNameArr = JSON.parse(xaChkName);
    return xxNameArr;
}
var aNowDte = new Date();

function showPreviousYearPopup(callback) {
    var today = new Date();
    var aTYear = new Date().getFullYear();
    var aLYear = aTYear - 1;
    var aNYear = aTYear + 1;
    var aTextThisYear = aTYear.toString() + "-" + aNYear.toString();
    var aTextLastYear = aLYear.toString() + "-" + aTYear.toString();
    var isAfterMay3 = (today.getMonth() === 4 && today.getDate() <= 3)
    if (isAfterMay3) {
        var options = [
            { id: true, text: "LAST YEAR (" + aTextLastYear + ")" },
            { id: false, text: "THIS YEAR (" + aTextThisYear + ")" }
        ];
        var popup = $("#popup").dxPopup({
            title: "Please Select Year",
            width: 250,
            height: "auto",
            position: { offset: "-100 -350" },
            contentTemplate: function (contentElement) {
                $("<div>").dxList({
                    dataSource: options,
                    height: "100%",
                    selectionMode: "single",
                    onSelectionChanged: function (e) {
                        var selectedOption = e.addedItems[0];
                        if (selectedOption.id) {
                            var year = new Date().getFullYear();
                            var month = 3; // April is month 3 (zero-based)
                            var day = 30;
                            var aNowDte = new Date(year, month, day);
                        } else {
                            var today = new Date();
                            var aNowDte = new Date(); //var aNowDte = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
                        }
                        popup.hide();
                        callback(aNowDte);
                    }
                }).appendTo(contentElement);
            }
        }).dxPopup("instance");
        $("#showPopupButton").dxButton({
            hint: "Please select your submitted year (LAST YEAR or THIS YEAR)",
            text: "Year Selection",
            icon: "fas fa-calendar-alt",
            type: "default",
            visible: isAfterMay3,
            onClick: function () {
                popup.show();
            }
        });
    } else {
        var aNowDte = new Date();
        $("#showPopupButton").hide();
        callback(aNowDte);
    }
}
/* const aaGetBusYear = (aFM, aLM, aNowDatev) => { // get Business year 
    let aCalYear = aNowDatev.getFullYear();
    let aCalMonth = aNowDatev.getMonth() + 1;
    if (aCalMonth >= aFM && aCalMonth <= aLM) {
        aCalYear = aCalYear - 1
    }
    return aCalYear;
}
const aaNowText = (aNowDatev) => {
    let aYear2 = String(aNowDatev.getFullYear());
    let aMonth2 = String(101 + aNowDatev.getMonth()).substring(1, 3);
    let aDate2 = String(100 + aNowDatev.getDate()).substring(1, 3);
    let aHour2 = String(100 + aNowDatev.getHours()).substring(1, 3);
    let aMinute2 = String(100 + aNowDatev.getMinutes()).substring(1, 3);
    let aSecond2 = String(100 + aNowDatev.getSeconds()).substring(1, 3);
    let aDateNow2 = aYear2 + "-" + aMonth2 + "-" + aDate2 + "T" + aHour2 + ":" + aMinute2 + ":" + aSecond2
    return aDateNow2;
} */

var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
var aaUsrN = localStorage["aaXXuX"];
showPreviousYearPopup(function (aNowDte) {
    var aaPFDMI = isLocalHost();
    var afqrFull = "pageID='" + aaPXIXD + "' "
    var afURL = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/all' //+ aaPXXI
    var afsettings = {
        "url": afURL,
        "method": "POST",
        "timeout": 0,
        "headers": { "Content-Type": "application/json" },
        "data": JSON.stringify({ "@": btoa(afqrFull) }), //"pageID='Resigned'"
    };
    //var jqxhr = $.post(afsettings, function (e) { })
    $.post(afsettings, function (e) { })
        .done(function (e) {
            aObjMPage = e;
            var aaKeyField = aObjMPage[0].PrimaryKey;
            var aaTBKey = aObjMPage[0].TBKey;
            $(() => {
                var aDatabasea = "ExtraOnLine.dbo.TaskControl";
                var aKeyField = "TaskGroup";
                var aKeyIDa = aaPXIXD; //"main"; //aaPXIXD;
                var axFieldSelected = "IDNO,TaskName,TaskProgram,TaskGroup";
                var condition = "TaskProgram";
                var aVARs = {};
                var aArrays = {};
                var aObjects = {};
                LoadSQLData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected)
                    .then(result => {
                        for (let ii = 0; ii < result.length; ii++) {
                            let aMatch = result[ii].TaskName.match(/\[(.*?)\]/);
                            if (aMatch) {
                            } else {
                                continue;
                            }
                            if (result[ii].TaskName.includes("{ARRAY}")) {
                                aArrays[aMatch[1]] = result[ii].TaskProgram
                                    .replace(/`/g, "'") // Replace backticks with single quotes
                                    .split('\n')
                                    .map(item => {
                                        let trimmedItem = item.trim(); // Remove extra spaces
                                        if (trimmedItem === "") {
                                            return ""; // Keep blanks as blank
                                        } else if (!isNaN(trimmedItem)) {
                                            return +trimmedItem; // Convert numeric strings to numbers
                                        } else {
                                            return trimmedItem; // Keep non-numeric text unchanged
                                        }
                                    });
                            } else if (result[ii].TaskName.includes("{T2O}")) {
                                let lines = result[ii].TaskProgram
                                    .replace(/`/g, "'") // Replace backticks with single quotes
                                    .split('\n')
                                aObjects[aMatch[1]] = lines.map(line => { //aObjects[aMatch[1]]
                                    line = line.trim().replace(/,$/, "");
                                    line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                                    return JSON.parse(line);
                                });
                                aObjects[aMatch[1]] = aObjects[aMatch[1]].map(obj => {
                                    for (let key in obj) {
                                        if (key.includes('amt') && typeof obj[key] === 'string') {
                                            obj[key] = +obj[key]; // Convert the value to a number
                                        }
                                    }
                                    return obj;
                                });
                            } else if (result[ii].TaskName.includes("{OBJ}")) {
                                aObjects[aMatch[1]] = result[ii].TaskProgram
                                    .replace(/`/g, "'") // Replace backticks with single quotes
                                    .split('\n')
                                    .reduce((obj, item) => {
                                        let trimmedItem = item.trim(); // Remove extra spaces
                                        if (trimmedItem === "") {
                                            return obj; // Skip blank lines
                                        }
                                        let [key, value] = trimmedItem.split(':').map(part => part.trim());
                                        if (key && value !== undefined) {
                                            obj[key] = isNaN(value) ? value : +value;
                                        }
                                        return obj; // Return the accumulated object
                                    }, {});
                            } else {
                                if (result[ii].TaskName.includes("{num}")) {
                                    aVARs[aMatch[1]] = +(result[ii].TaskProgram.replace(/`/g, "'"));
                                } else {
                                    aVARs[aMatch[1]] = result[ii].TaskProgram.replace(/`/g, "'");
                                }
                            }
                        }
                        var aaOnInitExpGroupCode = "700"
                        var aaOnInitExpGroupDesc = "Gift&Entertain"
                        var aaOnInitAccCode = "4141000002" //"55101150003"
                        var aaOnInitAccDesc = "Sundry Income NON VATABLE" // "Other"
                        let axqr2S = "Where EXPGroup LIKE '%" + aaERTYPE + "%'" //"Where ExpGroupCode = '" + aaERTYPE + "' and " + "EmpID = '" + aaEmpID + "'"
                        let axFieldSelected = "ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE,EXPGroup,EXPDesc"
                        let axFullBody = "Select " + axFieldSelected + " From " + "ExtraOnLine.dbo.ACCOUNTCHART " + axqr2S; //alert(aFullBody)
                        fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(axFullBody) }), redirect: "follow" })
                            .then(response => response.json())
                            .then(acData => { //});
                                var aaSubGroup01 = acData;
                                let aDivisionC = localStorage["asDIV"];
                                let aDivS = "Where ApproverCode = 'HOD' AND ApproveToDivision = '" + aDivisionC + "' Order By LRange02"
                                let aFieldSelected = "ApproveToDivision,ApproverName,ApproverEmail,LRange01,LRange02"
                                let aFullBody = "Select " + aFieldSelected + " From " + "ExtraOnLine.dbo.Approver " + aDivS; //alert(aFullBody)                                           
                                fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                    .then(response => response.json())
                                    .then(hData => {
                                        var aaHODApprover = hData;
                                        if (jQuery.type(aaHODApprover[0]) === "undefined") {
                                            DevExpress.ui.dialog.alert({
                                                position: { offset: "-130 -310" },
                                                title: "ERROR SETTING!!",
                                                messageHtml: "<div>Un-completed system setup, please contact Administrator <br></div>"
                                            });
                                            System.exit(0);
                                        }
                                        var aaHODAppName = aaHODApprover[0].ApproverName
                                        var aaHODAppEmail = aaHODApprover[0].ApproverEmail //.LRange02
                                        var aaHODRAnge02 = aaHODApprover[0].LRange02

                                        var aYearNum = aNowDte.getFullYear()  // 2022
                                        var aMonthNum = aNowDte.getMonth() // 10
                                        var aYearStr = aYearNum.toString() // 2022
                                        var aYearNumS = aNowDte.getFullYear()
                                        var aYearNumL = aNowDte.getFullYear()
                                        var aYearStrS = "";
                                        var aYearStrL = "";
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
                                        var aMMaMx = atob(localStorage["aaXrXg"])
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
                                        var asDivision = localStorage["asDIV"];
                                        var asStaffEmail = localStorage["asEMAIL"];
                                        var aqrFull = "ExpGroupCode = '" + aaERTYPE + "' and " + "PayToCode = '" + asStaffID + "'" // Department = asDepartment ?scopes based permission (View Only Login Name)  ExpensesCode LIKE aaOnInitAccCode
                                        var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                        var aSettings = { "url": aurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };
                                        var aaAllData;

                                        $("#gridContainer").dxDataGrid({
                                            dataSource: new DevExpress.data.CustomStore({
                                                key: "REFNO",
                                                loadMode: "omit",
                                                load: function () { return $.post(aSettings).done(function (resp) { aaAllData = resp }); },   //console.log(resp);
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
                                                enabled: false,  //false // true
                                            },
                                            showBorders: true,
                                            sorting: {
                                                mode: "multiple"
                                            },
                                            selection: {
                                                mode: "single" //'multiple'
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
                                                allowedPageSizes: [10, 20, 50],
                                                showNavigationButtons: true,
                                                showInfo: true
                                            },
                                            showBorders: true,
                                            groupPaging: true,
                                            showColumnLines: true,
                                            showRowLines: true,
                                            rowAlternationEnabled: true, //true,
                                            wordWrapEnabled: false,
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
                                                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'TRAVELnENTERTAIN' + '.xlsx');
                                                    });
                                                });
                                                e.cancel = true;
                                            },
                                            onInitNewRow: function (e) {
                                                let aaID = 1
                                                let axRunRun = aGetDateRef("I");
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
                                                e.data.ExpensesDescription = aaOnInitAccDesc ////aaOnInitAccDesc
                                                e.data.Currency = "THB"
                                                e.data.Xrate = 1
                                                e.data.ExpGroupCode = aaOnInitExpGroupCode
                                                e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                                e.data.ERStatus = "Register"
                                                e.data.ERORefNo3 = ""
                                                e.data.EROCheck01 = true
                                                e.data.EROCheck02 = true
                                                e.data.NeedPayment = false
                                                e.data.RefundedAmount = 0
                                                e.data.LimitedAmount = 0 //aaLTotal // Fleet Card
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
                                            editing: {
                                                mode: "cell", // popup , row, cell (click to edit)
                                                useIcons: true,
                                                allowUpdating: false,
                                                allowDeleting: arDataD,
                                                allowAdding: 0, //arDataC, //arDataC, false, 
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
                                            columns: [
                                                {
                                                    type: "buttons",
                                                    width: 40,
                                                    buttons: [// Edit Record
                                                        {
                                                            hint: "Edit",
                                                            icon: "fas fa-pen",
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === false) //return !e.row.isEditing; //&& e.row.data.Confirmed === false
                                                            },
                                                            onClick: function (e) {
                                                                aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate);
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
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
                                                    type: "buttons",
                                                    width: 40,
                                                    buttons: [
                                                        {
                                                            hint: "Delete",
                                                            icon: "fas fa-trash", //"fas fa-trash-alt", //fas fa-trash //trash
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === false)
                                                            },
                                                            onClick: function (e) {
                                                                var aSQLCommand = "";
                                                                var aLocalMess = "<div style='color:Tomato; font-size: 14px'><center><b> Are you sure you want to delete this record?"
                                                                var aLocalTitle = "DELETE"
                                                                let result = DevExpress.ui.dialog.custom({
                                                                    title: aLocalTitle,
                                                                    message: aLocalMess,
                                                                    buttons: [
                                                                        { text: "YES", onClick: () => true },
                                                                        { text: "NO", onClick: () => false }
                                                                    ],
                                                                    position: {
                                                                        of: window,  // Position relative to the window
                                                                        my: "center", // Center horizontally
                                                                        at: "center", // Center vertically
                                                                        offset: "0 -250" // Move up by 250px (y-axis)
                                                                    }
                                                                }).show();
                                                                result.done(function (dresult) {
                                                                    if (dresult) {
                                                                        aSQLCommand = "use ExtraOnLine; DELETE FROM GIFTREC WHERE HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        aSQLCommand = "";
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "buttons",
                                                    width: 92,
                                                    visible: false,
                                                    buttons: [
                                                        {
                                                            name: "edit",
                                                            visible: function (e) { return (e.row.data.Confirmed === false) }, //aEditDelIcon //
                                                        },
                                                        {
                                                            name: "delete",
                                                            visible: function (e) { return (e.row.data.Confirmed === false) }, //aEditDelIcon //
                                                        },
                                                    ]
                                                },
                                                {
                                                    type: "buttons",
                                                    width: 60,
                                                    buttons: [
                                                        {
                                                            hint: "Change Division",
                                                            icon: "fas fa-people-arrows",//"card" //"fas fa-sync-alt", //<i class="fas fa-exchange-alt"></i> as fa-people-arrows <i class="fas fa-sync-alt"></i>
                                                            visible: false,
                                                            // visible: function (e) {
                                                            //     return (e.row.data.ID === 1 && e.row.data.Confirmed === false ) // && aVARs.CHGALLDIV === 1 return !e.row.isEditing; //&& e.row.data.Confirmed === false
                                                            // },
                                                            onClick: function (e) {
                                                                aPopUpChangeForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate); //popupChangeDiv
                                                            }
                                                        },
                                                        {
                                                            hint: "UN-Confirm Call Request Back to Edit",
                                                            icon: "fas fa-times-circle",
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === true && e.row.data.HODApproved === false) //return !e.row.isEditing;
                                                            },
                                                            onClick: function (e) {
                                                                let result = DevExpress.ui.dialog.confirm("Are you sure you want to Un-Confirmed to Edit this Record ? ", "UN-Confirm") //
                                                                result.done(function (dresult) {
                                                                    if (dresult) {
                                                                        let aERStatus = "Register" ///"Confirmed wait for HR"
                                                                        let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                        let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                        var aObjKeyData = { REFNO: e.row.data.REFNO, Confirmed: aTrueORFalseB, ERStatus: aERStatus };   //[aaKeyField] key.trim
                                                                        var aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //value
                                                                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                                        let aSQLCommand = "use ExtraOnLine; UPDATE GIFTREC  SET Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.event.preventDefault();
                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.event.preventDefault();
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        aMessageAlert("Already UN-Confirmed (Call Request back to Edit)", "Red")
                                                                    }
                                                                });
                                                            }
                                                        },
                                                        {
                                                            hint: "Upload File",
                                                            icon: "fas fa-file-upload", //"fas fa-marker", "fas fa-print", "print"
                                                            visible: false,
                                                            onClick: function (e) {
                                                                aPopUpUpLoad(e.row.data.HeadRefNo)
                                                                e.component.refresh(true);
                                                                e.component.refresh(true);
                                                                e.component.refresh(true);
                                                                e.component.refresh(true);
                                                                e.event.preventDefault();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                            }
                                                        },
                                                        {
                                                            hint: "Print",
                                                            icon: "fas fa-print", //"fas fa-marker", "fas fa-print", "print"
                                                            visible: false,
                                                            onClick: function (e) {
                                                                aRPTPrint2Pdf(e.row.data.HeadRefNo, aaPFDMI, "OMasterReport", "Other") //O2302284399 e.row.data.HeadRefNo
                                                                e.component.refresh(true);
                                                                e.component.refresh(true);
                                                                e.component.refresh(true);
                                                                e.component.refresh(true);
                                                                e.event.preventDefault();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                            }
                                                        }
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
                                                    dataType: "string",
                                                    editorType: "dxTextArea",
                                                    width: 250,
                                                    editorOptions: { width: 250, height: 80 }, //, height: 80 
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "ERODesc02",
                                                    caption: "Purpose",
                                                    dataType: "string",
                                                    editorType: "dxTextArea",
                                                    width: 250,
                                                    height: 80,
                                                    editorOptions: { width: 250, height: 80 }, //, height: 80 
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
                                                        valueFormat: "#,##0.00", //"currency",
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
                                                                        .text(aaOnInitExpGroupDesc.toUpperCase() + " INPUT FOR"),
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
                                                                .append( //<p><span style="font-family: Arial; font-size: 10pt;">โปรแกรมนี้ </span><strong style="font-family: Arial; color: rgb(252, 3, 3); font-size: 10pt;">ไม่ได้มีไว้เพื่อ </strong><span style="font-family: Arial; font-size: 10pt;">การบันทึกการเบิกเงิน</span></p>
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
                                                            icon: "fas fa-plus-circle",
                                                            text: "ADD NEW",
                                                            type: "success",
                                                            stylingMode: "contained",
                                                            onClick: () => {
                                                                let aNewDate = new Date()
                                                                aPopUpAddForm(1, 1, aNowDte);
                                                            }
                                                        }
                                                    },
                                                    {
                                                        location: "after",
                                                        widget: "dxButton",
                                                        options: {
                                                            icon: 'collapse',
                                                            text: 'Collapse All',
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
                                                            hint: "Export to PDF File",
                                                            onClick: () => {
                                                                const doc = new jsPDF();
                                                                doc.addFont("font/Prompt-ExtraLight.ttf", "Prompt", "normal"); // load thai font (in font location Google Font)
                                                                doc.setFont("Prompt", "normal"); // set to thai font
                                                                DevExpress.pdfExporter.exportDataGrid({
                                                                    jsPDFDocument: doc,
                                                                    component: dataGrid,
                                                                    customizeCell: function (options) {
                                                                        const { gridCell, pdfCell } = options;
                                                                        pdfCell.styles = {
                                                                            font: 'Prompt',
                                                                            fontSize: 10
                                                                        }
                                                                    }
                                                                }).then(function () {
                                                                    doc.save('GIFTREC' + '.pdf');
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
                                        // This is the first Popup Change Division  XXX
                                        const aPopUpChangeForm = (aRecNo, iData, idDate) => {
                                            var aaPFDMI = isLocalHost();
                                            var astr = localStorage["aDXTheme"]
                                            var aaiHeadRef = aRecNo;
                                            var aaaTitle = " [CHANGE]"
                                            var aaERStatuss = iData.ERStatus;
                                            var asDivisiona = iData.Division;
                                            var asDepartmenta = iData.Department;
                                            var aNewDiva = ""; //iData.EROCode04;
                                            var aNewDepta = ""; //iData.EROCode03;
                                            var aDivisionsListF;
                                            //asDepartment = iData.Department
                                            //asDivision 
                                            var asPREDepartment = iData.EROCode05; //(iData.EROCode05 === "" ? asDepartment : iData.EROCode05)
                                            var asPREDivision = iData.EROCode06; //(iData.EROCode06 === "" ? asDivision : iData.EROCode06)
                                            //insideAddNew = false;
                                            //}
                                            var aaSchRefx = "HeadRefNo LIKE '%" + aaiHeadRef + "%'" // (DataGrid View Only This New Item)
                                            aqrFull = aaSchRefx;
                                            var aaxurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                            var aaxSettings = { "url": aaxurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };
                                            // console.log(" use for save : asDivision = ", asDivision, " asDepartment = ", asDepartment)
                                            // console.log(" use for save : gbNewDiv   = ", gbNewDiv, " gbNewDept    = ", gbNewDept)
                                            // console.log("iData.Division = ", iData.Division, "iData.Department = ", iData.Department)
                                            // console.log("iData.EROCode06 = ", iData.EROCode06, "iData.EROCode05 = ", iData.EROCode05)
                                            // console.log("asPREDepartment = ", asPREDepartment, "asPREDivision = ", asPREDivision)
                                            $(() => {
                                                var aaLastLineNo = 1;
                                                var asNewDept = "";
                                                var asNewDiv = "";
                                                var aXXData = function () { return $.post(aaxSettings).done(); }
                                                if (iData === 1) {
                                                    iData = aXXData[0];
                                                }

                                                var gbxRateV = 1;
                                                const popup = $("#popupChangeDivForm").dxPopup({
                                                    title: "Travel & Expenses Change Division" + aaaTitle,
                                                    width: '1400px',
                                                    height: '480px',
                                                    position: { offset: "0 -150" }, //{offset: "0 -180"},
                                                    //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                                    visible: true,
                                                    fullScreen: false,
                                                    showCloseButton: false,
                                                    showTitle: true,
                                                    dragEnabled: true,
                                                    closeOnOutsideClick: false,
                                                    resizeEnabled: true,
                                                    onInitialized: function (e) { e.component.registerKeyHandler("escape", function (arg) { }) },     // ignore when press 'ESC'  

                                                    contentTemplate: function () {
                                                        return $("<div />").append(
                                                            $("<p><div id='PopupChangeDiv'></div></p>"),
                                                            //$("<p><div id='Add-dxDataGrid'></div></p>"),
                                                            $("<span id='CDIV-popupexit'></span>"),
                                                            $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                            $("<span id='aConfirmCDIV'></span>")
                                                        );
                                                    },
                                                    // onContentReady: function () {
                                                    // $("#Add-dxDataGrid").hide(); // hide dataGrid
                                                    // },
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
                                                                    //let cRes = aMessageSelect("Exit Without SAVE", "Press 'YES' to Not Save ")
                                                                    if (aRecNo === 1) {
                                                                        let result = DevExpress.ui.dialog.confirm("<center><i class='fas fa-save custom-icon-size'></i>" + " Press 'YES' To SAVE </center>", "SAVE BEFORE EXIT ?"); //+ "<br>?? 'YES' ???????????"
                                                                        result.done(function (dresult) {
                                                                            if (dresult) {
                                                                                // not delete
                                                                            } else {
                                                                                // delete data
                                                                                // DELETE FROM EXPREIM WHERE HeadRefNo = 'M2110120750'
                                                                                let aSQLCommand = "use ExtraOnLine; DELETE FROM EXPREIM WHERE HeadRefNo = '" + aaiHeadRef + "'"
                                                                                //alert(aSQLCommand)
                                                                                //console.log(aXXData[0].ERStatus)
                                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                            }
                                                                        });
                                                                    }
                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                    const aThisTheme = localStorage["aDXTheme"];
                                                                    changeTheme(aThisTheme);
                                                                    popup.hide()
                                                                }
                                                            }
                                                        }]
                                                }).dxPopup("instance");


                                                const aChangeForm = $("#PopupChangeDiv").dxForm({
                                                    formData: iData, //aXXData[0], //iData,
                                                    showColonAfterLabel: false,
                                                    labelLocation: "left", //"top",
                                                    //readOnly: false,
                                                    //cssClass: "custom-editor",
                                                    colCount: 1,
                                                    items: [
                                                        {
                                                            itemType: "group",
                                                            caption: "GENERAL INFO",
                                                            colCount: 4,
                                                            items: [
                                                                {
                                                                    dataField: "HeadRefNo",
                                                                    label: { text: "REF NO.." },
                                                                    value: aaiHeadRef,
                                                                    width: 150,
                                                                    editorType: "dxTextBox",
                                                                    editorOptions: { value: aaiHeadRef, width: 150, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                                },
                                                                {
                                                                    dataField: "ReqDate",
                                                                    label: { text: "Submitted Date" },
                                                                    width: 150,
                                                                    editorType: "dxDateBox",
                                                                    editorOptions: { value: idDate, readOnly: true, displayFormat: "dd/MM/yyyy", width: 150, elementAttr: { class: "custom-editor" } },	  //showClearButton: true,  //value: new Date(),                
                                                                },
                                                                {
                                                                    dataField: "PayToName",
                                                                    label: { text: "Pay To" },
                                                                    width: 180,
                                                                    editorType: "dxTextBox",
                                                                    editorOptions: { value: asFullName, readOnly: true, width: 180, elementAttr: { class: "custom-editor" } },
                                                                },
                                                                {
                                                                    dataField: "ERStatus",
                                                                    label: { text: "Status" },
                                                                    editorType: "dxTextBox",
                                                                    width: 200,
                                                                    editorOptions: { value: aaERStatuss, readOnly: true, width: 200, elementAttr: { class: "custom-editor" } },
                                                                },
                                                                {
                                                                    itemType: "empty",
                                                                    colSpan: 1,
                                                                },
                                                                {
                                                                    dataField: "Department",
                                                                    label: { text: "Department" },
                                                                    editorType: "dxTextBox",
                                                                    editorOptions: { value: asDepartmenta, readOnly: true, width: 180, elementAttr: { class: "custom-editor" } },
                                                                },

                                                                {
                                                                    dataField: "Division",
                                                                    label: { text: "Division" },
                                                                    editorType: "dxTextBox",
                                                                    editorOptions: { value: asDivisiona, readOnly: true, width: 180, elementAttr: { class: "custom-editor" } },
                                                                },

                                                                {
                                                                    itemType: "empty",
                                                                    colSpan: 1,
                                                                },

                                                            ]

                                                        },
                                                        {
                                                            itemType: "group",
                                                            caption: "CHANGE DIVISION",
                                                            cssClass: "custom-group-header",
                                                            //elementAttr: {class: "colorRed"},
                                                            colCount: 4,
                                                            items: [
                                                                {
                                                                    itemType: "empty",
                                                                    colSpan: 1,
                                                                },
                                                                {
                                                                    dataField: "EROCode03",
                                                                    label: { text: "New Department" },
                                                                    editorType: "dxSelectBox", //dxSelectBox dxLookup
                                                                    editorOptions: {
                                                                        dataSource: aaDeptList,
                                                                        searchExpr: "ENGNAME",
                                                                        valueExpr: "DeptCode",
                                                                        displayExpr: "ENGNAME",
                                                                        //displayExpr: function (item) { return item && item.DeptCode + " (" + item.ENGNAME + ")"; },
                                                                        searchEnabled: true,
                                                                        width: 200,
                                                                        //value: aNewDiva,
                                                                        onValueChanged: function (args) {

                                                                            //     let newDivision = args.value;
                                                                            //     let newDepartment = args.value.slice(0, 4) //calculateNewDepartment(newDivision);
                                                                            //     let formInstance = $("#PopupChangeDiv").dxForm("instance");
                                                                            asNewDept = args.value;
                                                                            aDivisionsListF = divisionsList.filter(item => item.code.startsWith(asNewDept));
                                                                            // console.log(asNewDept)
                                                                            var formInstance = $("#PopupChangeDiv").dxForm("instance");
                                                                            var secondSelectBox = formInstance.getEditor("EROCode04");
                                                                            secondSelectBox.option("dataSource", aDivisionsListF || []);
                                                                            //console.log(aDivisionsListF)
                                                                            //     var asNewDiv = args.value.slice(0, 4);
                                                                            //     gbNewDiv = args.value;
                                                                            gbNewDept = args.value; //.slice(0, 4);
                                                                            //     // Update NewDepartment in the form dynamically
                                                                            //     formInstance.updateData("EROCode03", newDepartment);
                                                                        }
                                                                    },
                                                                    setCellValue: function (newData, value, currentRowData) {
                                                                        //newData.EROCode04 = value;
                                                                        newData.EROCode03 = value; //value.slice(0, 4);                                                
                                                                        asNewDept = value
                                                                        //aDivisionsListF = divisionsList.filter(item => item.code.startsWith(value));
                                                                        //console.log(asNewDept)
                                                                        //console.log(aDivisionsListF)
                                                                    },
                                                                },
                                                                // {
                                                                //     itemType: "empty",
                                                                //     colSpan: 1,
                                                                // },
                                                                {
                                                                    dataField: "EROCode04",
                                                                    label: { text: "New Division" },
                                                                    editorType: "dxSelectBox", //dxSelectBox dxLookup                                                                          
                                                                    editorOptions: {
                                                                        dataSource: [],//aDivisionsListF, // //aDivisionsListF,
                                                                        searchExpr: "code",
                                                                        valueExpr: "code",
                                                                        displayExpr: "code",
                                                                        searchEnabled: true,
                                                                        width: 100,
                                                                        //value: aNewDiva,
                                                                        onValueChanged: function (args) {

                                                                            //     let newDivision = args.value;
                                                                            //     let newDepartment = args.value.slice(0, 4) //calculateNewDepartment(newDivision);
                                                                            //     let formInstance = $("#PopupChangeDiv").dxForm("instance");
                                                                            //     asNewDept = args.value;
                                                                            asNewDiv = args.value; //.slice(0, 4);
                                                                            gbNewDiv = args.value;
                                                                            //     gbNewDept = args.value.slice(0, 4);
                                                                            //     // Update NewDepartment in the form dynamically
                                                                            //     formInstance.updateData("EROCode03", newDepartment);
                                                                        }
                                                                    },
                                                                    setCellValue: function (newData, value, currentRowData) {
                                                                        newData.EROCode04 = value;
                                                                        //newData.EROCode03 = value.slice(0, 4);
                                                                    },
                                                                },
                                                                // {
                                                                //     dataField: "EROCode03",
                                                                //     label: { text: "New Department" },
                                                                //     editorType: "dxTextBox",
                                                                //     editorOptions: { value: aNewDepta, readOnly: false, width: 100, elementAttr: { class: "custom-editor" } },
                                                                // },
                                                                {
                                                                    itemType: "empty",
                                                                    colSpan: 2,
                                                                },
                                                                {
                                                                    itemType: "empty",
                                                                    colSpan: 1,
                                                                },
                                                                {
                                                                    dataField: "EROCode05",
                                                                    label: { text: "Previous Department" },
                                                                    editorType: "dxTextBox",
                                                                    editorOptions: { value: asDepartmenta, readOnly: true, width: 100, elementAttr: { class: "custom-editor" } },
                                                                },
                                                                {
                                                                    dataField: "EROCode06",
                                                                    label: { text: "Previous Division*" },
                                                                    editorType: "dxTextBox",
                                                                    editorOptions: { value: asDivisiona, readOnly: true, width: 100, elementAttr: { class: "custom-editor" } },
                                                                },

                                                                {
                                                                    itemType: "empty",
                                                                    colSpan: 1,
                                                                },
                                                            ],
                                                            // onFieldDataChanged: function (e) {
                                                            //     if (e.dataField === "EROCode04") {
                                                            //         let formInstance = $("#PopupChangeDiv").dxForm("instance");
                                                            //         formInstance.updateData("EROCode03", `Related to ${e.value}`);
                                                            //     }
                                                            // }
                                                        },
                                                    ]

                                                }).dxForm("instance");

                                                $("#CDIV-popupexit").dxButton({
                                                    icon: "fas fa-times",
                                                    type: "danger",
                                                    text: "EXIT",
                                                    visible: true,
                                                    onClick: function (e) {
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        //const aThisTheme = localStorage["aDXTheme"];
                                                        //changeTheme(aThisTheme);
                                                        popup.hide()
                                                    }
                                                });

                                                $("#aConfirmCDIV").dxButton({
                                                    hint: "Confirm to change Division",
                                                    icon: "fas fa-check-circle",
                                                    type: "success",
                                                    text: "CONFIRM",
                                                    visible: true,
                                                    onClick: function (e) {

                                                        var aDatabasea = "ExtraOnLine.dbo.EXPREIM";
                                                        var aKeyField = "HeadRefNo";
                                                        var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724"

                                                        let result = DevExpress.ui.dialog.confirm("Confirm Change Division <br> From Division " + asDivision + " to " + gbNewDiv + " <br> from Department " + asDepartment + " to " + gbNewDept + " ", "CHANGE DIVISION");;
                                                        result.done(function (dresult) {
                                                            if (dresult) {

                                                                let aFREF = aaiHeadRef + "-001"
                                                                // console.log(aaiHeadRef)
                                                                // console.log(aFREF)

                                                                var aObjKeyData = { REFNO: aFREF, Division: gbNewDiv, Department: gbNewDept, EROCode05: asDepartmenta, EROCode06: asDivisiona }; //ERStatus: aERStatus ,Confirmed: aTrueORFalseB, ReqDate: aNowDte
                                                                var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                                //alert("New Dept "+ gbNewDept + ", New Div gbNewDiv " + gbNewDiv + ", Last Dept "+ asDepartmenta +", Last Div " + asDivisiona)
                                                                let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM SET Department = '" + gbNewDept + "', Division = '" + gbNewDiv + "', EROCode05 = '" + asDepartmenta + "', EROCode06 = '" + asDivisiona + "' Where HeadRefNo = '" + aaiHeadRef + "'" //Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                //alert(aSQLCommand)
                                                                //let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                //alert(aSQLCommand)
                                                                localStorage.setItem("agbNewDiv", gbNewDiv);
                                                                localStorage.setItem("agbNewDept", gbNewDept); //
                                                                aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                aSQLAction(aaPFDMI, aSQLCommand)


                                                                aMessageAlert("Already Changed Division to " + gbNewDiv + "and will exit ", "DarkGreen") //+ aApproverName + " (" + aApproverEmail + ")"
                                                                // var aThisThemes = localStorage["aDXTheme"];
                                                                // changeTheme(aThisThemes)
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                popup.hide();
                                                                window.location.href = "about:blank";
                                                            }
                                                        });

                                                    } // OnClick
                                                }); //first aConfirmCDIV


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
                                            let nTime = 0; // Counter to track how many times we've hovered over the current column
                                            if (aRecNo === 1) {
                                                var aaaTitle = " [ADD]"
                                                let aaID = 1
                                                let axRunRun = aGetDateRef(aaOnInitExpGroupDesc.substring(0, 1));
                                                let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                var aaiHeadRef = axRunRun;
                                                var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), ERODate01: idDate, ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment, Division: asDivision, ERODesc06: asStaffEmail, ReqDate: idDate, Vendor02Note: aaHODAppName, ExpensesCode: "", ExpensesDescription: aaOnInitAccDesc, Currency: "THB", Xrate: 1, ExpGroupCode: aaOnInitExpGroupCode, ExpGroupDescEng: aaOnInitExpGroupDesc, ERStatus: "Register", ERORefNo1: "Receive", ERORefNo2: "", ERORefNo3: "", EROCheck01: 1, EROCheck02: 1, NeedPayment: 0, RefundedAmount: 0, LimitedAmount: 0 }
                                                var ObjRowData = JSON.stringify(ObjKeyData);
                                                sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                            } else {
                                                var aaiHeadRef = aRecNo;
                                                var aaaTitle = (iView === undefined) ? " [EDIT]" : " {VIEW}"; //" [EDIT]"
                                                var aagiftItem = aObjects.aaLimitedAmt.find(item => item.code === iData.EROCode01);
                                                var aagiftAmount = aagiftItem ? aagiftItem.lmtamt : null;
                                                var anLimitAmt = aagiftAmount;
                                                var aformattedNumber = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(anLimitAmt);
                                                asEROCode01 = iData.EROCode01;
                                            }
                                            var aaSchRefx = "HeadRefNo LIKE '%" + aaiHeadRef + "%'" // (DataGrid View Only This New Item)
                                            aqrFull = aaSchRefx;
                                            var aaxurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                            var aaxSettings = { "url": aaxurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };
                                            $(() => {
                                                var aaLastLineNo = 1;
                                                var aXXData = function () { return $.post(aaxSettings).done(); }
                                                if (iData === 1) {
                                                    iData = aXXData[0];
                                                }
                                                var gbxRateV = 1;
                                                const popup = $("#popupContainerAdd").dxPopup({
                                                    title: "Receiving" + aaaTitle,
                                                    width: '1300px',
                                                    position: { offset: "0 -140" },  //{offset: "0 -180"},
                                                    visible: true,
                                                    fullScreen: true,
                                                    showCloseButton: false,
                                                    showTitle: true,
                                                    dragEnabled: true,
                                                    closeOnOutsideClick: false,
                                                    resizeEnabled: true,
                                                    onInitialized: function (e) { e.component.registerKeyHandler("escape", function (arg) { }) },     // ignore when press 'ESC'  
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
                                                            location: "after",
                                                            options: {
                                                                icon: "fas fa-times",
                                                                stylingMode: "outlined",
                                                                type: "danger",
                                                                onClick: function (e) {
                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                    if (aRecNo === 1) {
                                                                        let result = DevExpress.ui.dialog.confirm(aArrays.aSaveBExit[0], aArrays.aSaveBExit[1]);
                                                                        result.done(function (dresult) {
                                                                            if (dresult) {
                                                                            } else {
                                                                                let aSQLCommand = "use ExtraOnLine; DELETE FROM GIFTREC WHERE HeadRefNo = '" + aaiHeadRef + "'"
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
                                                
                                                $("#Add-popupexit").dxButton({
                                                    icon: "fas fa-times",
                                                    type: "danger",
                                                    text: "EXIT",
                                                    visible: true,
                                                    onClick: function (e) {
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        if (aRecNo === 1) { //
                                                            let result = DevExpress.ui.dialog.confirm(aArrays.aSaveBExit[0], aArrays.aSaveBExit[1]);
                                                            result.done(function (dresult) {
                                                                if (dresult) {
                                                                } else {
                                                                    let aSQLCommand = "use ExtraOnLine; DELETE FROM GIFTREC WHERE HeadRefNo = '" + aaiHeadRef + "'"
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
                                                });

                                                $("#aConfirm").dxButton({
                                                    hint: "Confirm",
                                                    icon: "fas fa-check-circle",
                                                    type: "success",
                                                    text: "CONFIRM",
                                                    visible: aViewG, //true,
                                                    onClick: function (e) {
                                                        const dataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                        function getColumnByField(key) {
                                                            const columns = dataGrid.option("columns");
                                                            return columns.find(column => column.dataField === key);
                                                        }
                                                        const rowsData = dataGrid.getVisibleRows().map(row => row.data);
                                                        const isValidRows = rowsData.every(row => {
                                                            return Object.entries(row).every(([key, value]) => {
                                                                const column = getColumnByField(key);
                                                                const caption = column?.caption || key; // Use caption if available, fallback to key
                                                                if (key === "EROCode01" && value === "") {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "ERODesc01" && value === "" && !(row.EROCode01.includes("NO"))) {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "ERODesc02" && value === "" && !(row.EROCode01.includes("NO"))) { //ERODesc03
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "ERODesc03" && value === "" && !(row.EROCode01.includes("NO"))) { //ERODesc03
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.<br>E.g.. Names of client, Insurers,<br>Prospects and their family members<br>(please explain)`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "Amount" && value === 0 && !(row.EROCode01.includes("NO"))) {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be 0.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "EROAmount1" && value === 0 && !(row.EROCode01.includes("NO"))) {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be 0.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "Amount" && value < anLimitAmt && !(row.EROCode01.includes("NO"))) {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot less than ${aformattedNumber}.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                return true; // Field is valid
                                                            });
                                                        });
                                                        if (!isValidRows) {
                                                            return; // Stop further processing if validation fails
                                                        }
                                                        var aaTotalReim = 30000; //aaTotalValue[0].TotalReimburse                                                              
                                                        var aaiFoundApp = false;
                                                        var nnLno = 0;
                                                        var nnAdno = 0;
                                                        var aaHODEmail4Chk = ""; //aaHODAppName
                                                        var aaHODName4Chk = "";
                                                        var aaHODRange4Chk = "";
                                                        for (let i = 0; i < aaHODApprover.length; i++) {
                                                            if (aaHODApprover[i].ApproverName === asFullName) {
                                                                nnAdno = i
                                                                aaiFoundApp = true;
                                                                break;
                                                            }
                                                        }
                                                        if (aaiFoundApp === true && aaHODApprover.length > 1) {
                                                            nnAdno = nnAdno + 1
                                                        }
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
                                                        aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                        aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail;
                                                        var aDatabasea = "ExtraOnLine.dbo.GIFTREC";
                                                        var aKeyField = "HeadRefNo";
                                                        var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724"
                                                        var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";
                                                        if (asEROCode01.includes("NO")) {
                                                            var condition = item => item.EROCode01 === "";
                                                        } else {
                                                            var condition = item => (item.Amount === 0 || item.Amount < anLimitAmt || item.EROCode01 === "" || item.ERODesc01 === "" || item.ERODesc02 === "");
                                                        }
                                                        aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                            .then(atestCehcka => {
                                                                if (atestCehcka === 1) { DevExpress.ui.dialog.alert(aArrays.aIncomeAlert[0], aArrays.aIncomeAlert[1]); }
                                                                else {
                                                                    let result = DevExpress.ui.dialog.confirm(aArrays.ACONFIRM[0], aArrays.ACONFIRM[1])
                                                                    result.done(function (dresult) {
                                                                        if (dresult) {
                                                                            let aFREF = aaiHeadRef + "-001"
                                                                            let aERStatus = "Confirmed (finished)" //"Register"
                                                                            let aTrueORFalse = '1'
                                                                            let aTrueORFalseB = true
                                                                            var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus };
                                                                            var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                            let aSQLCommand = "use ExtraOnLine; UPDATE GIFTREC  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                            aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                                            aMessageAlert("Already Confirmed !!") //& send mail to Requester " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                                            popup.hide();
                                                                        } //if (dresult)
                                                                    }); //result.done
                                                                } //else if
                                                            }); // .then  
                                                    }
                                                });

                                                const aform = $("#Add-form").dxForm({
                                                    formData: iData, //aXXData[0], //iData,
                                                    showColonAfterLabel: false,
                                                    labelLocation: "left", //"top",                                                    
                                                    readOnly: true,
                                                    colCount: 1,
                                                    items: [{
                                                        itemType: "group",
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
                                                        {
                                                            dataField: "PayToName",
                                                            label: { text: "Associate Name", }, // template: labelTemplate("user"),
                                                            dataType: "string",
                                                            editorType: "dxTextBox",
                                                            editorOptions: { value: asFullName, width: 180, readOnly: true },
                                                        },
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
                                                        e.data.ERORefNo1 = "Receive" //Default
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
                                                    editing: {
                                                        mode: "cell",        // popup , row, cell (click to edit)
                                                        useIcons: true,
                                                        allowUpdating: aViewG,
                                                        allowDeleting: aViewG, //arDataD,
                                                        allowAdding: false,  //arDataC,
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
                                                    columns: [
                                                        {
                                                            type: "buttons",
                                                            width: 40,
                                                            buttons: [
                                                                {
                                                                    hint: "delete",
                                                                    icon: "fas fa-trash", //fa-trash-alt
                                                                    visible: function (e) {
                                                                        return (e.row.data.Confirmed === false) //return !e.row.isEditing;
                                                                    },
                                                                    onClick: function (e) {
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
                                                                                if (aFrecN === 1) {
                                                                                    aSQLCommand = "use ExtraOnLine; DELETE FROM GIFTREC WHERE HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                                } else {
                                                                                    aSQLCommand = "use ExtraOnLine; DELETE FROM GIFTREC WHERE REFNO = '" + e.row.data.REFNO + "'"
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
                                                                    onClick: async function (e) {
                                                                        var aUriV = `${aaPFDMI}/temp/uploads/${e.row.data.REFNO}.pdf`
                                                                        console.log(aUriV)
                                                                        const cacheBusterUrl = aUriV + "?t=" + new Date().getTime();
                                                                        aPopupPDF(cacheBusterUrl)
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            type: "buttons",
                                                            width: 40,
                                                            buttons: [ // Clone first record ID++
                                                                {
                                                                    hint: "Add More Line",
                                                                    icon: "fas fa-plus",
                                                                    visible: function (e) {
                                                                        return (e.row.data.ID === 1 && e.row.data.Confirmed === false) //return !e.row.isEditing;
                                                                    },
                                                                    onClick: function (e) {
                                                                        aaLastLineNo = aaLastLineNo + 1
                                                                        let aBlankDate = new Date(); //"1900-01-01T00:00:00" //new Date('1900-01-01T00:00')//console.log(aBlankDate) 
                                                                        let axRunRun = e.row.data.HeadRefNo
                                                                        let aFieldSelected = "NextID"
                                                                        let aFullTableName = "ExtraOnLine.dbo.GRnextIDview Where HeadRefNo LIKE '" + axRunRun + "%'"
                                                                        let aFullBody = "Select " + aFieldSelected + " From " + aFullTableName; //alert(aFullBody)                                           
                                                                        let myHeaders = new Headers(); myHeaders.append("Content-Type", "application/json");
                                                                        let raw = JSON.stringify({ "@": aFullBody });
                                                                        let requestOptions = { method: "POST", headers: myHeaders, body: raw, redirect: "follow" };
                                                                        let aURL = aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
                                                                        fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                                                            .then(response => response.json())
                                                                            .then(aData => {
                                                                                let aaID = aData[0].NextID //JSON.stringify(aData); //aData[0].NextID //next no 
                                                                                let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                                                let aObjKeyData = { REFNO: axLineNo, ID: aaID, RefundedAmount: 0, LocalAmount: 0, Amount: 0, AmountBeforeVAT: 0, VAT: 0, EROCode01: "", ERODesc05: "", ERODesc01: "", ERORefNo4: "", ERORefNo3: "", Note: "", ERORefNo1: "", ERORefNo3: "", ERODesc02: "", ERODesc03: "", Vendor01: "", ExpensesCode: "" }
                                                                                let aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //values 
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
                                                                displayExpr: "code",
                                                                valueExpr: "code"
                                                            },
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                newData.EROCode01 = value;
                                                                var giftItem = aObjects.aaLimitedAmt.find(item => item.code === value);
                                                                var giftAmount = giftItem ? giftItem.lmtamt : null;
                                                                anLimitAmt = giftAmount;
                                                                asEROCode01 = value;
                                                                newData.EROAmount1 = 0;
                                                                newData.EROAmount2 = 0;
                                                                newData.Amount = 0;
                                                            },
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "ERODesc01",
                                                            caption: "Details of Gift Or Entertain",
                                                            dataType: "string",
                                                            cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                            editorType: "dxTextArea",
                                                            width: 250,
                                                            height: 180,
                                                            editorOptions: { width: 248, height: 220 }, //, height: 80 ,className: "full-height-scrollbar"
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "ERODesc02",
                                                            caption: "Purpose",
                                                            dataType: "string",
                                                            cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                            editorType: "dxTextArea",
                                                            width: 250,
                                                            height: 180,
                                                            editorOptions: { width: 248, height: 220 },
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "ERODesc03",
                                                            caption: "From/With Whom", //Other Lockton Employees present?
                                                            dataType: "string",
                                                            cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                            editorType: "dxTextArea",
                                                            width: 150,
                                                            height: 180,
                                                            editorOptions: { width: 140, height: 220 },
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "ERODesc04",
                                                            caption: "Other Lockton Employees present", //Other Lockton Employees present?
                                                            dataType: "string",
                                                            cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                            editorType: "dxTextArea",
                                                            width: 200,
                                                            height: 180,
                                                            editorOptions: { width: 190, height: 220 },
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "ERORefNo1",
                                                            caption: "Given/Receive",
                                                            dataType: "string",
                                                            editorType: "dxSelectBox",
                                                            width: 100,
                                                            editorOptions: {
                                                                width: 100,
                                                                dataSource: aObjects.aGivenRec, //[{ code: "Given" }, { code: "Receive" }],
                                                                displayExpr: "code",
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

                                                    onCellHoverChanged: function (e) {
                                                        const columnHelp = aObjects.aGHeaderHelp;
                                                        if (e.rowType === "header") {
                                                            const columnDataField = e.column.dataField;
                                                            if (e.eventType === "mouseover") {
                                                                if (currentHoveredColumn !== columnDataField) {
                                                                    currentHoveredColumn = columnDataField;
                                                                    nTime = 1; // First time for this column
                                                                } else {
                                                                    nTime += 1; // Increment nTime if we're still in the same column
                                                                }
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
                                                                if (nTime === 1) {
                                                                    nTime = 0
                                                                } else {
                                                                    nTime = 0; // Reset the hover counter
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
                                                                displayFormat: "{0} Items",
                                                            },
                                                            {
                                                                column: "RefundedAmount",
                                                                summaryType: "sum",
                                                                valueFormat: "#,##0.00", //"currency",
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
                                    }) //then fetch (HOR or HR Email get inside better ?)
                            }) //then fetch (ACCCODE)
                    });
            });
        });  // ajax  
});  // FIRST PRG  
