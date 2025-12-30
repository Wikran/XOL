// Declaration Requisition DECREQFRM.js
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

/*    const aaLimitedAmt = [ //Must Over
       { code: "Overseas", lmtamt: 10000 },
       { code: "Entertainment", lmtamt: 40000 }, // per head +
       { code: "Gift", lmtamt: 10000 } // per head
   ]
   const aaTypeOfGift = [
       { code: "Entertainment", thaname: "ความบันเทิง" },
       { code: "Gift", thaname: "ของขวัญ" },
       { code: "NO Gift/Receive", thaname: "ไม่มีรายการ" },
   ] */

// Purpose : จากแบบฟอร์มสามารถกรอกวัตถุประสงค์ของเรื่องนั้น ๆ ได้ทั้งจากการรับและการให้คะ
// Limit Gift ต่อคนไม่เกิน 10,000 บาท : หากต่ำกว่า 10,000 บาท ไม่ต้อง declare ให้ขึ้นข้อความว่า “ Under limit don’t need to declare “
// Limit Entertainment ต่อคนไม่เกิน 10,000 บาท : หากต่ำกว่า 40,000 ไม่ต้อง declare ให้ขึ้นข้อความว่า “ Under limit don’t need to declare “

window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
//console.log(aaLimitedAmt)
var aaHostName = window.location.href
var aaCheckON = aaHostName.includes("localhost")
var aaXToX = localStorage["aaXXoX"];
var aaERTYPE = "700" // Income
const aaRunPre = "D"

async function aaLoadData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, condition) {
    //let aDataBasea = "ExtraOnLine.dbo.REQDEC";
    //let aKeyfield = "HeadRefNo";
    let aTokena = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
    //console.log("Inside aaLoadData aKeya = ", aKeya);
    let axqr2S = `Where ${aKeyfield} LIKE '%${aKeya}%'`;
    //console.log("Inside aaLoadData axqr2S = ", axqr2S)
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
    //console.log("record ", acData.length);
    //console.log(acData);
    const filteredArray = acData.filter(condition);
    //console.log(filteredArray);
    //console.log(filteredArray.length);

    let abc;
    if (filteredArray.length === 0) { //pass                
        abc = 0;
    } else { // not pass
        // Extract and log the field name that caused the condition to fail
        /*let failedFields = [];
        acData.forEach(item => {
            for (let key in item) {
                let tempItem = { ...item };
                delete tempItem[key];
                //console.log("Temp item after deleting key", key, ":", tempItem); // Log tempItem after deletion                        
                if (condition(tempItem)) {
                    failedFields.push(key);
                }
            }
        });*/
        //console.log("Failed fields: ", failedFields);
        //console.log("not found ", filteredArray.length)
        //console.log("Filter Array ", filteredArray)
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
    //var xxChk3;

    xxChk1 = aatestChk.search(aFMark)
    xxChk2 = aatestChk.search(aLMark)

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

var aNowDte = new Date();

function showPreviousYearPopup(callback) {
    var today = new Date();
    var aTYear = new Date().getFullYear();
    var aLYear = aTYear - 1;
    var aNYear = aTYear + 1;
    var aTextThisYear = aTYear.toString() + "-" + aNYear.toString();
    var aTextLastYear = aLYear.toString() + "-" + aTYear.toString();
    // Check if the current date is after May 3 of this year
    //var isAfterMay3 = (today.getMonth() > 3) || (today.getMonth() === 3 && today.getDate() >= 3);
    var isAfterMay3 = (today.getMonth() === 4 && today.getDate() <= 3)
    //alert(isAfterMay3);
    // If the current date is not after May 3, show the button
    if (isAfterMay3) {
        // Create an array of possible options
        var options = [
            { id: true, text: "LAST YEAR (" + aTextLastYear + ")" },
            { id: false, text: "THIS YEAR (" + aTextThisYear + ")" }
        ];

        // Create a dxPopup widget with a list selection
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
                        // Get the selected option
                        var selectedOption = e.addedItems[0];
                        // Set the aNowDte variable based on the selected option
                        if (selectedOption.id) {
                            var year = new Date().getFullYear();
                            var month = 3; // April is month 3 (zero-based)
                            var day = 30;
                            var aNowDte = new Date(year, month, day);
                            //console.log("aNowDte: " + aNowDte);
                        } else {
                            var today = new Date();
                            var aNowDte = new Date(); //var aNowDte = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
                            //console.log("aNowDte: " + aNowDte);
                        }
                        // Close the popup
                        popup.hide();
                        // Call the callback function with the selected date
                        callback(aNowDte);
                    }
                }).appendTo(contentElement);
            }
        }).dxPopup("instance");

        // Show the pop-up when a button is clicked
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
        // If the current date is after May 3, hide the button
        var aNowDte = new Date();
        $("#showPopupButton").hide();
        callback(aNowDte);
    }
}

const aaGetBusYear = (aFM, aLM, aNowDatev) => { // get Business year 
    //let aNowDatev = new Date()
    let aCalYear = aNowDatev.getFullYear();
    let aCalMonth = aNowDatev.getMonth() + 1;
    //console.log(aCalYear, aCalMonth, aFM, aLM);
    if (aCalMonth >= aFM && aCalMonth <= aLM) {
        aCalYear = aCalYear - 1
    }
    //console.log(aCalYear)
    return aCalYear;
}

const aaNowText = (aNowDatev) => {
    //let aNowDatev = new Date()
    let aYear2 = String(aNowDatev.getFullYear());
    let aMonth2 = String(101 + aNowDatev.getMonth()).substring(1, 3);
    let aDate2 = String(100 + aNowDatev.getDate()).substring(1, 3);
    let aHour2 = String(100 + aNowDatev.getHours()).substring(1, 3);
    let aMinute2 = String(100 + aNowDatev.getMinutes()).substring(1, 3);
    let aSecond2 = String(100 + aNowDatev.getSeconds()).substring(1, 3);
    let aDateNow2 = aYear2 + "-" + aMonth2 + "-" + aDate2 + "T" + aHour2 + ":" + aMinute2 + ":" + aSecond2
    return aDateNow2;
}

var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
var aaUsrN = localStorage["aaXXuX"];
//
showPreviousYearPopup(function (aNowDte) {
    var aaPFDMI = isLocalHost();
    //console.log("aaPFDMI ", aaPFDMI)
    var afqrFull = "pageID='" + aaPXIXD + "' "
    var afURL = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/all' //+ aaPXXI
    var afsettings = {
        "url": afURL,
        "method": "POST",
        "timeout": 0,
        "headers": { "Content-Type": "application/json" },
        "data": JSON.stringify({ "@": btoa(afqrFull) }), //"pageID='Resigned'"
    };
    var jqxhr = $.post(afsettings, function (e) { })
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
                        //console.log(result.length, result)
                        //console.log(result);
                        for (let ii = 0; ii < result.length; ii++) {
                            //console.log(result[ii]); 
                            let aMatch = result[ii].TaskName.match(/\[(.*?)\]/);
                            if (aMatch) {
                                //
                            } else {
                                // Skip this iteration and move to the next one
                                continue;
                            }
                            //console.log("aMatch ", aMatch[1])
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
                                //console.log("aArrays.", aMatch[1], aArrays[aMatch[1]]);
                            } else if (result[ii].TaskName.includes("{T2O}")) {
                                let lines = result[ii].TaskProgram
                                    .replace(/`/g, "'") // Replace backticks with single quotes
                                    .split('\n')
                                aObjects[aMatch[1]] = lines.map(line => { //aObjects[aMatch[1]]
                                    // Remove the trailing comma and extra spaces
                                    line = line.trim().replace(/,$/, "");
                                    // Add quotes around keys and values to make it JSON-compliant
                                    line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                                    // Parse the cleaned line into an object
                                    return JSON.parse(line);
                                });
                                // Iterate through the array and modify the objects
                                aObjects[aMatch[1]] = aObjects[aMatch[1]].map(obj => {
                                    for (let key in obj) {
                                        // Check if the key includes 'amt' and the value is a string
                                        if (key.includes('amt') && typeof obj[key] === 'string') {
                                            obj[key] = +obj[key]; // Convert the value to a number
                                        }
                                    }
                                    return obj;
                                });
                                //console.log(aObjects[aMatch[1]])

                            } else if (result[ii].TaskName.includes("{OBJ}")) {
                                //console.log(result[ii].TaskProgram.split('\n'))
                                aObjects[aMatch[1]] = result[ii].TaskProgram
                                    .replace(/`/g, "'") // Replace backticks with single quotes
                                    .split('\n')
                                    .reduce((obj, item) => {
                                        let trimmedItem = item.trim(); // Remove extra spaces
                                        if (trimmedItem === "") {
                                            return obj; // Skip blank lines
                                        }

                                        // Split the line by colon (:) to get key and value
                                        let [key, value] = trimmedItem.split(':').map(part => part.trim());

                                        if (key && value !== undefined) {
                                            // Check if value is numeric and convert it, otherwise keep as string
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
                                //console.log("aVARs ", aVARs[aMatch[1]])
                            }
                            //console.log(aObjects[aMatch[1]])
                        }
                        ////confole.log("HELP2 " , typeof aVARs.HELP02)
                        var aaOnInitExpGroupCode = "700"
                        var aaOnInitExpGroupDesc = "Declaration Requisition"
                        //var aaOnInitAccCode = "4141000002" //"55101150003"
                        var aaOnInitAccDesc = "Declaration Requisition" // "Other"
                        //var acData;

                        let axqr2S = "Where EXPGroup LIKE '%" + aaERTYPE + "%'" //"Where ExpGroupCode = '" + aaERTYPE + "' and " + "EmpID = '" + aaEmpID + "'"
                        let axFieldSelected = "ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE,EXPGroup,EXPDesc"
                        let axFullBody = "Select " + axFieldSelected + " From " + "ExtraOnLine.dbo.ACCOUNTCHART " + axqr2S; //alert(aFullBody)
                        fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(axFullBody) }), redirect: "follow" })
                            .then(response => response.json())
                            //
                            .then(acData => { //});
                                var aaSubGroup01 = acData;
                                //console.log(aaSubGroup01);
                                let aDivisionC = localStorage["asDIV"];
                                let aDivS = "Where ApproverCode = 'HOD' AND ApproveToDivision = '" + aDivisionC + "' Order By LRange02"
                                let aFieldSelected = "ApproveToDivision,ApproverName,ApproverEmail,LRange01,LRange02"
                                let aFullBody = "Select " + aFieldSelected + " From " + "ExtraOnLine.dbo.Approver " + aDivS; //alert(aFullBody)                                           

                                fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                    .then(response => response.json())
                                    //
                                    .then(hData => {

                                        var aaHODApprover = hData;
                                        if (jQuery.type(aaHODApprover[0]) === "undefined") {
                                            DevExpress.ui.dialog.alert({
                                                //showTitle: false,
                                                position: { offset: "-130 -310" },
                                                //position: { my: "top",  at: "top", of: "window"  },
                                                title: "ERROR SETTING!!",
                                                messageHtml: "<div>Un-completed system setup, please contact Administrator <br></div>"
                                            });
                                            System.exit(0);
                                        }
                                        var aaHODAppName = aaHODApprover[0].ApproverName
                                        var aaHODAppEmail = aaHODApprover[0].ApproverEmail //.LRange02
                                        var aaHODRAnge02 = aaHODApprover[0].LRange02
                                        /*
                                            console.log("----HOD--------")
                                            console.log(aaHODApprover)
                                            console.log(aaHODAppName)
                                            console.log(aaHODAppEmail)
                                            console.log(aaHODApprover.length) //length
                                            console.log(aaHODRAnge02)
                                            console.log("----HOD--------")
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
                                        var aFilterT = aYearStrS + '/05/01'  //2022/05/01
                                        var aFilterT2 = aYearStrL + '/04/30'  //2023/04/01            
                                        //---- LOAD DATA to json ----- // END

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
                                                    //console.log( aaKeyField );
                                                    //console.log(values)
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
                                                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DECLARA' + '.xlsx');
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
                                            //
                                            //
                                            // Editing
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
                                            // column list
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
                                                                        // Need to change the tablename DELETE FROM <TABLE> TRVREQF,REQDEC,EXPREIM
                                                                        aSQLCommand = "use ExtraOnLine; DELETE FROM REQDEC WHERE HeadRefNo = '" + e.row.data.HeadRefNo + "'"
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
                                                    //caption: "Editor",
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
                                                            hint: "UN-Confirm Call Request Back to Edit",
                                                            icon: "fas fa-times-circle",
                                                            //visible: false,
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === true && e.row.data.HODApproved === false) //return !e.row.isEditing;
                                                            },
                                                            onClick: function (e) {
                                                                let result = DevExpress.ui.dialog.confirm("Are you sure you want to Un-Confirmed to Edit this Record ? ", "UN-Confirm") //
                                                                result.done(function (dresult) {
                                                                    if (dresult) {
                                                                        // mark Confirmed field
                                                                        let aERStatus = "Register" ///"Confirmed wait for HR"
                                                                        let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                        let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                        var aObjKeyData = { REFNO: e.row.data.REFNO, Confirmed: aTrueORFalseB, ERStatus: aERStatus };   //[aaKeyField] key.trim
                                                                        var aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //value
                                                                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));

                                                                        //use ExtraOnLine; UPDATE REQDEC  SET Confirmed = 1 Where HeadRefNo = 'M2108063704'
                                                                        let aSQLCommand = "use ExtraOnLine; UPDATE REQDEC  SET Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)

                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.event.preventDefault();

                                                                        //send Email check the send main

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
                                                            // visible: function (e) {
                                                            //     //return !e.row.isEditing;
                                                            //     return (e.row.data.ID === 1) //false; && e.row.data.Confirmed === true
                                                            // },
                                                            onClick: function (e) {
                                                                //aPopUpPrintForm(e.row.data, e.row.data.HeadRefNo); //, arTAccount[0]
                                                                //aRPTPrint2Pdf(e.row.data.HeadRefNo, aaPFDMI, "OMasterReport", "Other") //O2302284399 e.row.data.HeadRefNo
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
                                                            // visible: function (e) {
                                                            //     //return !e.row.isEditing;
                                                            //     return (e.row.data.ID === 1) //false; && e.row.data.Confirmed === true
                                                            // },
                                                            onClick: function (e) {
                                                                //aPopUpPrintForm(e.row.data, e.row.data.HeadRefNo); //, arTAccount[0]
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
                                                    //validationRules: [{ type: "required" }],
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
                                                    caption: "Given/Receive", //Associate Name & Signature
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
                                                                        .text(aaOnInitExpGroupDesc.toUpperCase() + " FORM"),
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
                                                                    //$("<p><strong style='font-size: 12pt; color: rgb(2, 2, 250);'>❋ </strong><span style='font-family: Arial; font-size: 10pt;'>โปรแกรมนี้ </span><strong style='font-family: Arial; font-size: 10pt; color: rgb(252, 3, 3);'>ไม่ได้มีไว้เพื่อ </strong><span style='font-family: Arial; font-size: 10pt;'>การบันทึกการเบิกเงิน / </span><strong style='color: rgb(3, 0, 0); font-family: Arial; font-size: 10pt;'>This </strong><strong style='color: rgb(252, 8, 8); font-family: Arial; font-size: 10pt;'>is not for </strong><strong style='color: rgb(3, 0, 0); font-family: Arial; font-size: 10pt;'>Expenses Reimbursement </strong><strong style='color: rgb(2, 2, 250); font-size: 12pt;'>❋</strong> </p>"),
                                                                    //$("<strong style='font-size: 10pt; color: rgb(3, 0, 0); font-family: Arial;'>This </strong><strong style='font-size: 10pt; color: rgb(252, 8, 8); font-family: Arial;'>is not for </strong><strong style='font-size: 10pt; color: rgb(3, 0, 0); font-family: Arial;'>Expenses Reimbursement</strong></p>"), 
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

                                                    //aPopUpAddForm
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

                                        // Not use
                                        /* $("#action-add").dxSpeedDialAction({
                                            label: "Add",
                                            icon: "fas fa-plus-circle",
                                            index: 1,
                                            position: {
                                                offset: "-990 -950"
                                            },
                                            elementAttr: {
                                                //class: "addEmpty"
                                            },
                                            onClick: function () {
                                                aPopUpAddForm(1, 1, new Date());
                                            }
                                        }).dxSpeedDialAction("instance"); */

                                        /* function aDataGridRF() {
                                            dataGrid.refresh();
                                        } */

                                        /* function aSearchjson(aObjArr, asID) {
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
                                        } */


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
                                                var aaaTitle = " [ADD]"
                                                let aaID = 1
                                                let axRunRun = aGetDateRef(aaOnInitExpGroupDesc.substring(0, 1));
                                                let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                var aaiHeadRef = axRunRun;
                                                //aaOnInitAccCode            aaOnInitAccDesc         Currency: "THB", Xrate: 1,                                                                                                                                                                     
                                                var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), ERODate01: idDate, ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment, Division: asDivision, ERODesc06: asStaffEmail, ReqDate: idDate, Vendor02Note: aaHODAppName, ExpensesCode: "", ExpensesDescription: aaOnInitAccDesc, Currency: "THB", Xrate: 1, ExpGroupCode: aaOnInitExpGroupCode, ExpGroupDescEng: aaOnInitExpGroupDesc, ERStatus: "Register", ERORefNo1: "Given", ERORefNo2: "", ERORefNo3: "", EROCheck01: 1, EROCheck02: 1, NeedPayment: 0, RefundedAmount: 0, LimitedAmount: 0 }
                                                var ObjRowData = JSON.stringify(ObjKeyData);
                                                //console.log(ObjRowData)
                                                //console.log("Access Key :",atob(aaXToX), "aaTBKey ", aaTBKey)
                                                sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
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
                                                    title: "Receiving" + aaaTitle,
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
                                                                    //let cRes = aMessageSelect("Exit Without SAVE", "Press 'YES' to Not Save ")
                                                                    if (aRecNo === 1) {
                                                                        let result = DevExpress.ui.dialog.confirm(aArrays.aSaveBExit[0], aArrays.aSaveBExit[1]);
                                                                        result.done(function (dresult) {
                                                                            if (dresult) {
                                                                                // not delete
                                                                            } else {
                                                                                // delete data
                                                                                // DELETE FROM REQDEC WHERE HeadRefNo = 'M2110120750'
                                                                                let aSQLCommand = "use ExtraOnLine; DELETE FROM REQDEC WHERE HeadRefNo = '" + aaiHeadRef + "'"
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
                                                        
                                                        if (aRecNo === 1) { //
                                                            let result = DevExpress.ui.dialog.confirm(aArrays.aSaveBExit[0], aArrays.aSaveBExit[1]);
                                                            result.done(function (dresult) {
                                                                if (dresult) {
                                                                    // not delete
                                                                } else {
                                                                    let aSQLCommand = "use ExtraOnLine; DELETE FROM REQDEC WHERE HeadRefNo = '" + aaiHeadRef + "'"
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
                                                    //width: "120px",
                                                    //visible: true,
                                                    onClick: function (e) {
                                                        //let aDivSxx = "Where HeadRefNo = '" + aaiHeadRef + "'"
                                                        //let aFieldSelectedxx = "HeadRefNo,TotalReimburse" //
                                                        //let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.EXPREIM_ALL " + aDivSxx; 
                                                        ////alert(asEROCode01)
                                                        //fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                        //.then(response => response.json())
                                                        //
                                                        //.then(ppData => {
                                                        //var aaTotalValue = ppData;
                                                        //var dataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                        //var isValid = true;

                                                        //dataGrid.getController("validating").validate(true).then(function (validationResult) {
                                                        //    isValid = validationResult.isValid;
                                                        //});
                                                        //if (!isValid) { alert("test") } else {
                                                        // Retrieve the DataGrid instance
                                                        const dataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");

                                                        // Utility function to get column by key
                                                        function getColumnByField(key) {
                                                            const columns = dataGrid.option("columns");
                                                            return columns.find(column => column.dataField === key);
                                                        }

                                                        // Get all rows from the grid
                                                        const rowsData = dataGrid.getVisibleRows().map(row => row.data);

                                                        // Validate each field in every row
                                                        const isValidRows = rowsData.every(row => {
                                                            return Object.entries(row).every(([key, value]) => {
                                                                // Get column configuration and caption
                                                                const column = getColumnByField(key);
                                                                const caption = column?.caption || key; // Use caption if available, fallback to key

                                                                //             ERODesc02: row[3]?.trim(), //Description
                                                                //             ERODesc03: row[4]?.trim(), //Purpose
                                                                //var condition = item => item.Amount === 0 || item.ERODesc02 === "" || item.ERODesc03 === "" || item.ERODesc04 === "" || item.ERORefNo3 === "" || item.RefundedAmount === 0 || item.Xrate === 0 || (item.Xrate === 1 && item.Currency !== "THB") || (item.Xrate !== 1 && item.Currency === "THB");
                                                                // Validation logic with key, value, and caption
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
                                                                // if (key === "ERORefNo3" && value === "") {
                                                                //     DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                //     return false;
                                                                // }
                                                                // if (key === "ERORefNo3" && !value.includes("Accom.") && row.EROAmount4 !== 0) {
                                                                //     DevExpress.ui.dialog.alert(`Night must be 0.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                //     return false;
                                                                // }
                                                                // if (key === "ERORefNo3" && value.includes("Accom.") && row.EROAmount4 === 0) {
                                                                //     DevExpress.ui.dialog.alert(`Night cannot be 0.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                //     return false;
                                                                // }
                                                                // Example: Log key, value, and caption for debugging
                                                                //console.log(`Key: ${key}, Value: ${value}, Caption: ${caption}`);

                                                                return true; // Field is valid
                                                            });
                                                        });

                                                        if (!isValidRows) {
                                                            return; // Stop further processing if validation fails
                                                        }
                                                        var aaTotalReim = 30000; //aaTotalValue[0].TotalReimburse      //40000; //                                                        

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
                                                        //console.log(nnAdno)
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
                                                        // alert(aaHODAll4Chk)
                                                    
                                                        // send mail to first Approver 
                                                        aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                        aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail;

                                                        //console.log(aaHODAppEmail, aaHODAppName)
                                                        // loop aaLoad
                                                        //
                                                        var aDatabasea = "ExtraOnLine.dbo.REQDEC";
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
                                                                            //if (aContinueChk !== true) {
                                                                            let aFREF = aaiHeadRef + "-001"
                                                                            //confole.log(aaiHeadRef)
                                                                            //confole.log(aFREF)
                                                                            let aERStatus = "Confirmed wait for HOD" //"Register" "Confirmed wait for HOD"
                                                                            let aTrueORFalse = '1'
                                                                            let aTrueORFalseB = true
                                                                            //let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                            //let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                            var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus };
                                                                            var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                            //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                            //use ExtraOnLine; UPDATE REQDEC  SET Confirmed = 1 Where HeadRefNo = 'M2108063704' ERORefNo6
                                                                            let aSQLCommand = "use ExtraOnLine; UPDATE REQDEC  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                            aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();

                                                                            //send Email

                                                                            var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " DECLARATION REQUISITION CONFIRMATION";
                                                                            let aApproverName = aaHODAppName //+ ", [HOD]"        // aaHRAppName  //"Wikran" + " [HOD]"       // HOD Approver Name
                                                                            let aApproverEmail = $.trim(aaHODAppEmail)            // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                            let aRequesterName = asFullName //e.data.PayToName    //"Wikran Intaraprajaks"
                                                                            let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                                            let aSubject = aaOnInitExpGroupDesc + " Declaration Requisition Confirmation"; //aaMailTitle
                                                                            //var aSubject = aaMailTitle
                                                                            let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                            let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'> Declaration Requisition</a>"; 
                                                                            let aMessage01 = "<div>เรียน คุณ" + $.trim(aApproverName) + ",<br>&nbsp;&nbsp;&nbsp;&nbsp;" + aaOnInitExpGroupDesc + " Expenses<br>" + aRequesterName + "</div>"
                                                                            //// var aMessage = "<!DOCTYPE html><html><head><style>table { bprder: 1px solid; border-collapse: collapse; width: 50%;}th, td {  text-align: left;  padding: 8px;}tr:nth-child(even){background-color: #ffe6ff }th {  background-color: #027DFC; color: white;}</style></head><body><table><tr><th  style = 'font-size: 22px;'><center />&#9728; " + aaMailTitle + " &#9728;</th></tr><tr><td style = 'font-size: 13px; background-color:#EAF4FF'>"+ aMessage01 +"</td>  </tr></tr></table></body></html>" //#fff7e6 #e6e6e6 #fff7e6    
                                                                            var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                            aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)
                                                                            //

                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();

                                                                            //aMessageAlert("Already Confirmed !!") //& send mail to Requester " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                            aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                                            popup.hide();
                                                                        } //if (dresult)
                                                                    }); //result.done
                                                                } //else if
                                                            }); // .then  
                                                        // loop aaLoad
                                                        //}); //fetch()
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
                                                            label: { text: "Associate Name", }, // template: labelTemplate("user"), "Associate Name"
                                                            dataType: "string",
                                                            editorType: "dxTextBox",
                                                            editorOptions: { value: asFullName, width: 180, readOnly: true },
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
                                                                    visible: false,
                                                                    //function (e) {
                                                                        //return (e.row.data.ID === 1 && e.row.data.Confirmed === false);
                                                                    //},
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
                                                            caption: "Given/Receive", //Associate Name & Signature
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

                                    }) //then fetch (HOR or HR Email get inside better ?)
                            }) //then fetch (ACCCODE)

                    });
                // TOP PRG
            });
        });  // ajax  
    //    
});  // FIRST PRG  
