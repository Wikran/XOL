
// Medical - Expenses Reimbursement

$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});

var insideAddNew = false;
const arIPDOPD = [{ CODE: "OPD&Dental" }, { CODE: "Maternity" }, { CODE: "Others" }];

//dx.material.purple.light.compact.css
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();

var aaXToX = localStorage["aaXXoX"];
//var aaXNoX = localStorage["aaXXuX"];
//var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492";
//var aaPXXI = localStorage["aPXIXD"];
//var aaMXXT = localStorage["aDXMenuTitle"];
//var aLNQToken = "9DE8BDB8-8EE0-48D0-A506-9AD24F151F9A";
var aaERTYPE = "300"  // General    = "100" Fleet Card = "200" Medical = "300" Travel & Entertain  = "400" 

async function aaLoadData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, condition) {
    let aTokena = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
    //console.log(aKeya);
    let axqr2S = `Where ${aKeyfield} LIKE '%${aKeya}%'`;
    //console.log(axqr2S)            
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
    //console.log("check ",acData);
    //console.log(acData[0][condition]);
    //console.log(acData[0].TaskProgram)
    //console.log(acData.TaskProgram)
    //const filteredArray = acData.filter(condition);
    //console.log(filteredArray);
    //console.log(filteredArray.length);

    let abc = acData;
    return abc;
}

var aNowDte = new Date();
function showPreviousYearPopup(callback) {
    // Get the current date 
    // = new Date(year, month, day);
    //var today = new Date(2023, 4, 3); //= new Date();
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
                            console.log("aNowDte: " + aNowDte);
                        } else {
                            var today = new Date();
                            var aNowDte = new Date(); //var aNowDte = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
                            console.log("aNowDte: " + aNowDte);
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
//var aaKeyField = localStorage["aaXKFX"];
//var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];
//let aNowDte = new Date()
//aNowDte = showPreviousYearPopup()
//console.log("second: ", aNowDte) 
showPreviousYearPopup(function (aNowDte) {
    //console.log("Selected date: " + aNowDte);
    var aDatabasea = "ExtraOnLine.dbo.TaskControl";
    var aKeyField = "TaskGroup";
    var aKeyIDa = aaPXIXD; //"main"; //aaPXIXD;
    var axFieldSelected = "IDNO,TaskName,TaskProgram,TaskGroup";
    var aVARs = {};
    var aArrays = {};
    var aObjects = {};
    // var aaEmailArr;
    // var aaMessage2Show;
    // var aaMess2Show;
    // var aaMess3Show;

    LoadSQLData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected)
        .then(result => {
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
                    console.log("aArrays.", aMatch[1], aArrays[aMatch[1]]);
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
                    console.log(aObjects[aMatch[1]])

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
            }
            //const aaMessage2Show = result[0][condition];  //aMedicalAlert01
            //const aaMess2Show = aaMessage2Show.replace(/`/g, "'");
            //const aaEmailArr = result[1][condition].split(',');
            //console.log("ALERT01 ", aVARs.ALERT01)
            //console.log("ALERT02 ", aVARs.ALERT02)
            //console.log("ACONFIRM ", aVARs.ACONFIRM)

            var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
            //var aaPFDMZz = "https://cbsdev3.locktonwattana.com"; //"https://cbsdev3.locktonwattana.com"; // API for DMZ only

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
                        //var aaPFDMI = localStorage["aPXIXD"];   //"https://cbsdev3.locktonwattana.com" 
                        var aaDMZSn = "https://cbsdev2.locktonwattana.com";
                        var aaPFDMI = isLocalHost();
                        //aaPFDMI = aaPFDMZz
                        var aaXToX = localStorage["aaXXoX"];
                        //let aaEmpID = $.trim(localStorage["asSTFID"]);
                        //---- LOAD DATA to json ----- // Start
                        //var start = performance.now();
                        var aaOnInitExpGroupCode = "300"
                        var aaOnInitExpGroupDesc = "Medical"
                        var aaOnInitAccCode = "5204100003"
                        var aaOnInitAccDesc = "����ѡ�Ҿ�Һ��"
                        let aaEmpID = $.trim(localStorage["asSTFID"]);
                        //alert(aaEmpID)
                        // start get Employee details
                        let aqr2Sx = "Where EMPCode = '" + aaEmpID + "'" //Status != 'Resigned'
                        let aFieldSelectedx = "EMPCode,FullNameThai,FullNameEng,Dept,DivCode,EmailAddress,Position,EffectiveDate,EmployDate,Status"
                        let aFullBodyx = "Select " + aFieldSelectedx + " From " + "[lockthbnk-ap14].ExtraOnLine.dbo.XOLStaff " + aqr2Sx;
                        fetch(aaDMZSn + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyx) }), redirect: "follow" })
                            .then(response => response.json())
                            //
                            .then(aData => {
                                var aaEmployee = aData;
                                var aEffDate = aaEmployee[0].EffectiveDate;
                                var aEffDateD = Date.parse(aEffDate);
                                var aProbation = (aEffDateD >= new Date())
                                //alert (aEffDateD)
                                //alert(aProbation)
                                if (aProbation) {
                                    DevExpress.ui.dialog.alert({
                                        //showTitle: false, aArrays.APROBATION[1]
                                        title: aArrays.APROBATION[1], //"ACCESS DENIED!!",
                                        messageHtml: aArrays.APROBATION[0], //"<div>You are not entitled to reimburse medical expense since you are in probation period<br>��ҹ�������ö�ԡ����ѡ�Ҿ�Һ���� ���ͧ�ҡ��ҹ������������ҷ��ͧ�ҹ</div>"
                                    });
                                    System.exit(0);
                                }

                                // start get Limit
                                // Limitation
                                let aqr2S = "Where EmpID = '" + aaEmpID + "'" //"Where ExpGroupCode = '" + aaERTYPE + "' and " + "EmpID = '" + aaEmpID + "'"
                                let aFieldSelected = "RefNo01,RefNo02,MonthlyLimited,LimitedPerTime,TotalLimited,AllowFamily,AllowSSO,FleetLimit,MedicalLimit,MaternityLimit,LimitPerCase"
                                let aFullBody = "Select " + aFieldSelected + " From " + "ExtraOnLine.dbo.Limitation " + aqr2S; //alert(aFullBody)                                           

                                fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                    .then(response => response.json())
                                    //
                                    .then(aData => {
                                        var aaLimited = aData;
                                        if (jQuery.type(aaLimited[0]) === "undefined") {
                                            DevExpress.ui.dialog.alert({
                                                //showTitle: false, aArrays.ADENIED[1]
                                                title: aArrays.ADENIED[1], //"ACCESS DENIED!!",
                                                messageHtml: aArrays.ADENIED[0], //"<div>Un-completed system setup, please contact Administrator <br> �к��Դ����������ó� ��سҵԴ��ͼ������к� </div>"
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
                                        aaLTotal = aaFleet
                                        console.log("Mar Limited ==", aaMaternity)
                                        // start get Approver
                                        let aDivisionC = localStorage["asDIV"];
                                        //let aDivS = "Where ApproveToDivision = '" + aDivisionC + "'"
                                        var aDivS = "Where ApproverCode = 'HR'"
                                        let aFieldSelected = "ApproveToDivision,ApproverName,ApproverEmail"
                                        let aFullBody = "Select " + aFieldSelected + " From " + "ExtraOnLine.dbo.Approver " + aDivS; //alert(aFullBody)                                           

                                        fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                            .then(response => response.json())
                                            //
                                            .then(hData => {
                                                var aaHRApprover = hData;
                                                if (jQuery.type(aaHRApprover[0]) === "undefined") {
                                                    DevExpress.ui.dialog.alert({
                                                        //showTitle: false,
                                                        title: aArrays.ADENIED[1], //"ACCESS DENIED!!",
                                                        messageHtml: aArrays.ADENIED[0], // "<div>Un-completed system setup, please contact Administrator <br> �к��Դ����������ó� ��سҵԴ��ͼ������к� </div>"
                                                    });
                                                    System.exit(0);
                                                }
                                                var aaHRAppName = aaHRApprover[0].ApproverName
                                                var aaHRAppEmail = aaHRApprover[0].ApproverEmail
                                                /*
                                                console.log("----HOD--------")
                                                console.log(aaPlateNo)
                                                console.log(aaFCardNo)
                                                console.log(aaLTotal)
                                                console.log(aaHRAppName)
                                                console.log(aaHRAppEmail)
                                                console.log("----HOD--------")
                                                */
                                                //---- LOAD DATA to json ----- // END

                                                // View Limit Summary //let aaTT = if today = 20/11/2022
                                                var aYearNum = aNowDte.getFullYear()  // 2022
                                                var aMonthNum = aNowDte.getMonth() // 10
                                                var aYearStr = aaGetBusYear(1, 4, aNowDte); //aYearNum.toString() // 2022

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
                                                console.log(aFilterT)
                                                console.log(aYearStr)

                                                // Load Remain Medical
                                                var aDivS1 = "Where PayToCode LIKE '%" + $.trim(aaEmpID) + "%' and QYear = " + aYearStr
                                                let aFieldSelected1 = "TAmount,TRefundAmt,LAmount,MRemained"
                                                let aFullBody1 = "Select " + aFieldSelected1 + " From ExtraOnLine.dbo.MSumDView " + aDivS1; //alert(aFullBody)                                           

                                                fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody1) }), redirect: "follow" })
                                                    .then(response => response.json())
                                                    //
                                                    .then(tData => {
                                                        var arResult = tData;
                                                        if (jQuery.type(arResult[0]) === "undefined") {
                                                            var aaTTAmt = 0//Total Amount 
                                                            var aaTTRm = aaMedical //Total Remaining 
                                                            var aaTTUsed = 0 // Total Reimbursement
                                                        } else {
                                                            var aaTTAmt = arResult[0].TAmount //Total Amount 
                                                            var aaTTRm = arResult[0].MRemained //Total Remaining 
                                                            var aaTTUsed = arResult[0].TRefundAmt // Total Reimbursement
                                                        }
                                                        var adisableMED = false;
                                                        var adisableMAR;
                                                        var adisableSSO;
                                                        if (aaTTAmt === 0 && aaTTRm !== 0) {
                                                            adisableMED = false
                                                        } else if (aaTTAmt === 0 && aaTTRm === 0) {
                                                            adisableMED = false
                                                        } else if (aaTTAmt !== 0 && aaTTRm === 0) {
                                                            adisableMED = true
                                                        } else if (aaTTAmt !== 0 && aaTTRm !== 0) {
                                                            adisableMED = false
                                                        }
                                                        /*
                                                        console.log("--Medical---")
                                                        console.log(aaTTAmt)
                                                        console.log(aaTTRm)
                                                        console.log(aaTTUsed)
                                                        console.log(adisableMED)
                                                        console.log("---------")
                                                        */
                                                        // Load Remain Maternity
                                                        var aDivS2 = "Where PayToCode = '" + $.trim(aaEmpID) + "' and QYear = " + aYearStr
                                                        let aFieldSelected2 = "TAmount,TRefundAmt,LAmount,MRemained"
                                                        let aFullBody2 = "Select " + aFieldSelected2 + " From ExtraOnLine.dbo.MSumDView2 " + aDivS2; //alert(aFullBody)                                           

                                                        fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody2) }), redirect: "follow" })
                                                            .then(response => response.json())
                                                            //
                                                            .then(gData => {
                                                                var arResult2 = gData;
                                                                //console.log("Result ARR = ", arResult2[0])
                                                                //alert(jQuery.type(arResult2[0]))
                                                                if (jQuery.type(arResult2[0]) === "undefined") {
                                                                    var aaMMAmt2 = 0//Total Amount 
                                                                    var aaMMRm2 = aaMaternity //Total Remaining 
                                                                    var aaMMUsed2 = 0 // Total Reimbursement
                                                                } else {
                                                                    var aaMMAmt2 = arResult2[0].TAmount //Total Amount 
                                                                    var aaMMRm2 = arResult2[0]?.MRemained ?? 0; //Total Remaining ES6 style if null then 0  //var aaMMRm2 = arResult2[0].MRemained 
                                                                    var aaMMUsed2 = arResult2[0].TRefundAmt // Total Reimbursement
                                                                }
                                                                if (aaMMAmt2 === 0 && aaMMRm2 !== 0) {
                                                                    adisableMAR = false
                                                                } else if (aaMMAmt2 === 0 && aaMMRm2 === 0) {
                                                                    adisableMAR = false
                                                                } else if (aaMMAmt2 !== 0 && aaMMRm2 === 0) {
                                                                    adisableMAR = true
                                                                } else if (aaMMAmt2 !== 0 && aaMMRm2 !== 0) {
                                                                    adisableMAR = false
                                                                }
                                                                console.log("--Maternity--")
                                                                console.log("M use1 ", aaMMAmt2)
                                                                console.log("M Remain ", aaMMRm2)
                                                                console.log("M uses ", aaMMUsed2)
                                                                console.log("adisable M ", adisableMAR)
                                                                console.log("---------")

                                                                //Load Remain Dental SSO YEAR Must be Calendar Year 
                                                                var aSSODate = new Date()
                                                                var aSSOYearNum = aSSODate.getFullYear()  // 2022
                                                                var aSSOYearStr = aSSOYearNum.toString()  // 2022 

                                                                var aDivS3 = "Where PayToCode LIKE '%" + $.trim(aaEmpID) + "%' and QYear = " + aSSOYearStr
                                                                let aFieldSelected3 = "TAmount,TRefundAmt,LAmount,MRemained"
                                                                let aFullBody3 = "Select " + aFieldSelected3 + " From ExtraOnLine.dbo.MSumDView3 " + aDivS3; //alert(aFullBody)                                           

                                                                fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody3) }), redirect: "follow" })
                                                                    .then(response => response.json())
                                                                    //
                                                                    .then(jData => {
                                                                        var arResult3 = jData;
                                                                        console.log("result arr =", arResult3[0])
                                                                        if (jQuery.type(arResult3[0]) === "undefined") {
                                                                            var aaMMAmt3 = 0//Total Amount 
                                                                            var aaMMRm3 = aaSSO //Total Remaining 
                                                                            var aaMMUsed3 = 0 // Total Reimbursement
                                                                        } else {
                                                                            var aaMMAmt3 = arResult3[0].TAmount //Total Amount 
                                                                            var aaMMRm3 = arResult3[0].MRemained //Total Remaining 
                                                                            var aaMMUsed3 = arResult3[0].TRefundAmt
                                                                        }
                                                                        if (aaMMAmt3 === 0 && aaMMRm3 !== 0) {
                                                                            adisableSSO = false
                                                                        } else if (aaMMAmt3 === 0 && aaMMRm3 === 0) {
                                                                            adisableSSO = false
                                                                        } else if (aaMMAmt3 !== 0 && aaMMRm3 === 0) {
                                                                            adisableSSO = true
                                                                        } else if (aaMMAmt3 !== 0 && aaMMRm3 !== 0) {
                                                                            adisableSSO = false
                                                                        }
                                                                        // console.log("--Dental(SSO)--")
                                                                        // console.log(aaMMAmt3)
                                                                        // console.log("---Remained---")
                                                                        // console.log("SSO Remain ", aaMMRm3)
                                                                        // console.log("SSO Use ", aaMMUsed3)
                                                                        // console.log("adisable SSO ", adisableSSO)
                                                                        // console.log("---------")

                                                                        var arEMPTYPE = [{ CODE: "Employee" }, { CODE: "Spouse" }, { CODE: "Child" }];
                                                                        var aaSubGroup = [{ ExpSubGroup: "OPD" }, { ExpSubGroup: "Dental" }, { ExpSubGroup: "Dental (SSO)" }, { ExpSubGroup: "Maternity" }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }

                                                                        if (aaFamily) {
                                                                            arEMPTYPE = [{ CODE: "Employee" }, { CODE: "Spouse" }, { CODE: "Child" }];
                                                                        } else {
                                                                            arEMPTYPE = [{ CODE: "Employee" }];
                                                                        }

                                                                        if (aaSSO && aaMaternity !== 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD", disabled: (adisableMED) }, { ExpSubGroup: "Dental", disabled: (adisableMED) }, { ExpSubGroup: "Dental (SSO)", disabled: (adisableSSO) }, { ExpSubGroup: "Maternity", disabled: (adisableMAR) }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }
                                                                        } else if (aaSSO && aaMaternity === 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD", disabled: (adisableMED) }, { ExpSubGroup: "Dental", disabled: (adisableMED) }, { ExpSubGroup: "Dental (SSO)", disabled: (adisableSSO) }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }
                                                                        } else if (!aaSSO && aaMaternity !== 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD", disabled: (adisableMED) }, { ExpSubGroup: "Dental", disabled: (adisableMED) }, { ExpSubGroup: "Maternity", disabled: (adisableMAR) }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }
                                                                        } else if (!aaSSO && aaMaternity === 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD", disabled: (adisableMED) }, { ExpSubGroup: "Dental", disabled: (adisableMED) }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }
                                                                        }
                                                                        console.log("Last SubGroup = ", aaSubGroup)
                                                                        console.log("arEMPTYPE = ", arEMPTYPE);
                                                                        // ���͹� �ӹǹ�Թ ���������Ѻ Medical + Maternity // Limit !== 0 && Remain !== 0 ���� disable = false // Limit !== 0 && Remain === 0 disable = true //
                                                                        //                   ����Ѻ Dental (SSO)        // aaSSO && Usage !== 0 && Remain !== 0 ���� disable = false // aaSSO && Usage !== 0 && Remain === 0 disable = true //
                                                                        /*
                                                                        if (aaMMRm3 > 0 && aaMMRm2 !== 0 && aaTTRm !== 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD" }, { ExpSubGroup: "Dental" }, { ExpSubGroup: "Dental (SSO)" }, { ExpSubGroup: "Maternity" }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }
                                                                        } else if (aaMMRm3 > 0 && aaMMRm2 === 0 && aaTTRm !== 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD" }, { ExpSubGroup: "Dental" }, { ExpSubGroup: "Dental (SSO)" }, { ExpSubGroup: "Maternity", disabled: true }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }
                                                                        } else if (aaMMRm3 === 0 && aaMMRm2 !== 0 && aaTTRm !== 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD" }, { ExpSubGroup: "Dental" }, { ExpSubGroup: "Dental (SSO)", disabled: true }, { ExpSubGroup: "Maternity" }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }
                                                                        } else if (aaMMRm3 === 0 && aaMMRm2 === 0 && aaTTRm !== 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD" }, { ExpSubGroup: "Dental" }, { ExpSubGroup: "Dental (SSO)", disabled: true }, { ExpSubGroup: "Maternity", disabled: true }, { ExpSubGroup: "Others" }];
                                                                        } else if (aaMMRm3 > 0 && aaMMRm2 !== 0 && aaTTRm === 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD", disabled: true }, { ExpSubGroup: "Dental", disabled: true }, { ExpSubGroup: "Dental (SSO)" }, { ExpSubGroup: "Maternity" }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }
                                                                        } else if (aaMMRm3 > 0 && aaMMRm2 === 0 && aaTTRm === 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD", disabled: true }, { ExpSubGroup: "Dental", disabled: true }, { ExpSubGroup: "Dental (SSO)" }, { ExpSubGroup: "Maternity", disabled: true }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }
                                                                        } else if (aaMMRm3 === 0 && aaMMRm2 !== 0 && aaTTRm === 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD", disabled: true }, { ExpSubGroup: "Dental", disabled: true }, { ExpSubGroup: "Dental (SSO)", disabled: true }, { ExpSubGroup: "Maternity" }, { ExpSubGroup: "Others" }]; //, { ExpSubGroup: "Others" }
                                                                        } else if (aaMMRm3 === 0 && aaMMRm2 === 0 && aaTTRm === 0) {
                                                                            aaSubGroup = [{ ExpSubGroup: "OPD", disabled: true }, { ExpSubGroup: "Dental", disabled: true }, { ExpSubGroup: "Dental (SSO)", disabled: true }, { ExpSubGroup: "Maternity", disabled: true }, { ExpSubGroup: "Others" }];
                                                                        }
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
                                                                        var asDivision = localStorage["asDIV"];
                                                                        var asStaffEmail = localStorage["asEMAIL"];

                                                                        var aqrFull = "ExpGroupCode LIKE '%" + aaERTYPE + "%' and " + "PayToCode = '" + asStaffID + "'" // scopes based permission (View Only Login Name)  ExpensesCode LIKE aaOnInitAccCode
                                                                        var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                                                        var aSettings = { "url": aurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };

                                                                        var aEditDelIcon = true

                                                                        // Main DataGrid
                                                                        $("#gridContainer").dxDataGrid({

                                                                            dataSource: new DevExpress.data.CustomStore({
                                                                                key: "REFNO",
                                                                                loadMode: "omit",
                                                                                /*load: function () {
                                                                                    return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all', { "@": aqrFull }) // Change aaTBKey to TokenKey for this table 5102300001
                                                                                        .fail(function () { throw "Data loading error" });
                                                                                },*/
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
                                                                                visible: true, // false true
                                                                                applyFilter: "auto"
                                                                            },
                                                                            headerFilter: {
                                                                                visible: true  // false true
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
                                                                                allowedPageSizes: [5, 10, 20, 50, 100],
                                                                                showNavigationButtons: true,
                                                                                showInfo: true
                                                                            },
                                                                            showBorders: true,
                                                                            groupPaging: true,
                                                                            showColumnLines: true,
                                                                            showRowLines: true,
                                                                            rowAlternationEnabled: false, // 2 Tones Line Color
                                                                            focusedRowEnabled: false,

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
                                                                            /*
                                                                            onRowPrepared(e) {
                                                                                if(e.rowType === "groupFooter") {  
                                                                                    e.cells[1].cellElement.innerText = "Total:"
                                                                                    e.cells[1].cellElement.style.overflow = "visible"
                                                                                }  
                                                                            },
                                                                            */
                                                                            onInitNewRow: function (e) {
                                                                                //e.component.__addingStart = true; 
                                                                                //gridContainer.option("editing.popup.title", "Adding Expenses Reimbursement");
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
                                                                                e.data.ExpensesCode = aaOnInitAccCode
                                                                                e.data.ExpensesDescription = aaOnInitAccDesc
                                                                                e.data.Currency = "THB" // not for overseas
                                                                                e.data.Xrate = 1        // not for overseas
                                                                                e.data.ExpGroupCode = aaOnInitExpGroupCode
                                                                                e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                                                                e.data.ERStatus = "Register"
                                                                                e.data.EROCheck03 = true // have a bill
                                                                                e.data.EROCheck04 = true // doctor recommend
                                                                                e.data.NeedPayment = true
                                                                                e.data.RefundedAmount = 0
                                                                                e.data.LimitedAmount = aaMedical //aaLTotal //Medical Only
                                                                                e.data.EROCode01 = "OPD"
                                                                                //e.data.ERODate01 = new Date()
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
                                                                            /*
                                                                            onRowPrepared: function(e) {
                                                                                if (e.rowType === "data" ){ //e.rowElement.style.backgroundColor = 'yellow'
                                                                                e.cellElement.css("color", e.data.Confirmed === true ? "grey" : "black");
                                                                                    e.rowElement.css("backgroud", "grey" );
                                                                                    e.rowElement.find("td").css('background', 'grey' );
                                                                                    e.rowElement.style.backgroundColor = 'grey'
                                                                                }
                                                                            },
                                                                            */

                                                                            // Editing
                                                                            editing: {
                                                                                mode: "row", // popup , row, cell (click to edit)
                                                                                useIcons: true,
                                                                                allowUpdating: true,
                                                                                allowDeleting: arDataD,
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
                                                                            // column list aPopUpAddForm();
                                                                            columns: [
                                                                                {
                                                                                    type: "buttons",
                                                                                    width: 40,
                                                                                    buttons: [// Edit Record
                                                                                        {
                                                                                            hint: "Edit",
                                                                                            icon: "fas fa-pen", //"fas fa-search"
                                                                                            visible: function (e) {
                                                                                                return (e.row.data.ID === 1 && (e.row.data.Confirmed === false && e.row.data.ERStatus !== "HR Denied")) //return !e.row.isEditing;
                                                                                            },
                                                                                            onClick: function (e) {
                                                                                                aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate, e.row.data.HRApprovedDate);
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
                                                                                                        // Need to change the tablename DELETE FROM <TABLE> TRVREQF,GIFTREC,EXPREIM
                                                                                                        aSQLCommand = "use ExtraOnLine; DELETE FROM EXPREIM WHERE HeadRefNo = '" + e.row.data.HeadRefNo + "'"
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
                                                                                    width: 40,
                                                                                    buttons: [// Edit Record
                                                                                        {
                                                                                            hint: "Edit",
                                                                                            icon: "fas fa-search",
                                                                                            visible: function (e) {
                                                                                                return (e.row.data.ID === 1 && (e.row.data.Confirmed === true && e.row.data.ERStatus === "HR Denied")) //return !e.row.isEditing;
                                                                                            },
                                                                                            onClick: function (e) {
                                                                                                aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate, e.row.data.HRApprovedDate);
                                                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                            }
                                                                                        },
                                                                                    ]
                                                                                },
                                                                                {
                                                                                    type: "buttons",
                                                                                    //caption: "Editor",
                                                                                    width: 60,
                                                                                    buttons: ["delete"], //["edit", "delete"],
                                                                                    visible: false, //function (e) { return (e.row.data.Confirmed === false) }, //false,  { visible: function (e) { return (e.row.data.Confirmed === false) } 
                                                                                },
                                                                                { // UN-Confirmed - NOT USE
                                                                                    type: "buttons",
                                                                                    width: 60,
                                                                                    buttons: [
                                                                                        {
                                                                                            hint: "UN-Confirm",
                                                                                            icon: "fas fa-times-circle",
                                                                                            visible: false,
                                                                                            /*visible: function (e) {
                                                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === true && e.row.data.HRApproved === false) //return !e.row.isEditing;
                                                                                            },*/
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
                                                                                                let aMessage = "<div>���¹ �س" + $.trim(aApproverName) + "<br>Please noted that Medical Expenses for REFNO = [" + e.row.data.HeadRefNo + "]<br> at (" + aAddress2Do + "). has un-confirmed <br><br>Regards,<br>" + aRequesterName + "</div>"
                                                                                                //let aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>Please Approve at &nbsp;'+ aAddress2Do +'</center></strong></span></h2></td></tr></tbody></table>'                          
                                                                                                //aSendMailDMZ("Khun " + aApproverName , aApproverEmail ,"XOL-Requester",aRequesterEmail,"","Please approve a Medical Expenses Reimbursement" , "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aApproverName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");

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
                                                                                        { // Confirm wait for HR
                                                                                            hint: "Confirm", // Confirmed = true
                                                                                            icon: "fas fa-check-circle",
                                                                                            visible: false, // - NOT USE
                                                                                            /*visible: function (e) {
                                                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === false && e.row.data.Amount !== 0) //return !e.row.isEditing;
                                                                                            },*/
                                                                                            onClick: function (e) {
                                                                                                let aContinueChk = (e.row.data.ERDesc03 === "" || e.row.data.EROData01 === new Date("01/01/1901") || e.row.data.EROCode02 === "" || e.row.data.ERORefNo3 === "" || e.row.data.ERODesc02 === "" || e.row.data.Amount === 0)
                                                                                                //alert(aContinueChk)
                                                                                                if (aContinueChk !== true) {
                                                                                                    // mark Confirmed field
                                                                                                    let aERStatus = "Confirmed wait for HR" //"Register"
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
                                                                                                    let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>"; //<a href='https://www.w3schools.com'>Visit W3Schools</a>
                                                                                                    let aMessage = "<div>���¹ �س" + $.trim(aApproverName) + ",<br>Please verify and approve " + aaOnInitExpGroupDesc + " for REFNO = [" + e.row.data.HeadRefNo + "]<br> at (" + aAddress2Do + "). <br><br>Regards,<br>" + aRequesterName + "</div>"

                                                                                                    //aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                                                    e.component.refresh(true);
                                                                                                    e.component.refresh(true);
                                                                                                    e.component.refresh(true);
                                                                                                    e.event.preventDefault();
                                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                                    aMessageAlert("Already Confirmed", "DarkGreen")
                                                                                                } else {
                                                                                                    DevExpress.ui.dialog.alert({
                                                                                                        //showTitle: false,
                                                                                                        title: "CAN NOT CONFIRM BLANK DATA !!",
                                                                                                        messageHtml: "<div>Please check the blank data, Bill Date can not be '01/01/1901', Hospital/Clinic Name can not be blank, Patient can not be blank, Actual Amount can not be 0</div>"
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        },
                                                                                        { // Send Mail to HR - NOT USE
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
                                                                                                let aSubject = "Please approve a Medical Expenses Reimbursement"
                                                                                                let aAddress2Do = aaPFDMI + "/XOL/index.html";
                                                                                                let aMessage = "<div>Dear Khun " + $.trim(aApproverName) + "<br>Please verify and approve " + aaOnInitExpGroupDesc + " for REFNO = [" + e.row.data.HeadRefNo + "]<br> at (" + aAddress2Do + "). <br><br>Regards,<br>" + aRequesterName + "</div>"
                                                                                                //let aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>Please Approve at &nbsp;'+ aAddress2Do +'</center></strong></span></h2></td></tr></tbody></table>'                          
                                                                                                //aSendMailDMZ("Khun " + aApproverName , aApproverEmail ,"XOL-Requester",aRequesterEmail,"","Please approve a Medical Expenses Reimbursement" , "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aApproverName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");
                                                                                                aSendMailDMZ("Khun " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)
                                                                                                aMessageAlert("Already Send Mail", "Orange")
                                                                                            }
                                                                                        },
                                                                                        { // Print Document
                                                                                            hint: "Print",
                                                                                            icon: "fas fa-print", //"fas fa-marker", "fas fa-print", "print" HR Approved wait for FA //Confirmed wait for HR //HR Denied || e.row.data.ERStatus === "Register" || e.row.data.ERStatus === "Confirmed wait for HR"
                                                                                            visible: function (e) {
                                                                                                return (e.row.data.ID === 1 && (e.row.data.ERStatus !== "HR Denied")) //false; && e.row.data.Confirmed === true //return !e.row.isEditing;
                                                                                            },
                                                                                            onClick: function (e) {
                                                                                                //console.log(e.row.data.HeadRefNo)
                                                                                                console.log("TOP")
                                                                                                //aPopUpPrintForm(e.row.data, e.row.data.HeadRefNo); //, arTAccount[0]
                                                                                                aRPTPrint2Pdf(e.row.data.HeadRefNo, aaPFDMI, "MMasterReport", "Medical") //"F2301313870" e.row.data.HeadRefNo
                                                                                                //aCryPdfPrint(e.row.data.HeadRefNo)
                                                                                                //aPopUpForm(e.row.data, e.row.data.HeadRefNo);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.component.refresh(true);
                                                                                                e.event.preventDefault();
                                                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                                //dataGrid.refresh();
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
                                                                                    dataType: "number",
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
                                                                                    dataType: "string",
                                                                                    editorOptions: { width: 150 },
                                                                                    width: 150,
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
                                                                                    editorOptions: { width: 200 },
                                                                                    width: 120,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ExpensesDescription",
                                                                                    caption: "Expenses",
                                                                                    dataType: "string",
                                                                                    editorType: "dxTextArea",
                                                                                    editorOptions: { width: 300 },
                                                                                    width: 250,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERORefNo1",
                                                                                    caption: "Plate NO",
                                                                                    dataType: "string",
                                                                                    width: 150,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERORefNo2",
                                                                                    caption: "Fleet Card NO",
                                                                                    dataType: "string",
                                                                                    width: 150,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERODesc03",
                                                                                    caption: "Hospital/Clinic Name",
                                                                                    dataType: "string",
                                                                                    validationRules: [{ type: "required" }],
                                                                                    //editCellTemplate: dropDownHospital,
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 120 }, //, height: 80
                                                                                    width: 120,
                                                                                },
                                                                                {
                                                                                    dataField: "ERORefNo4",
                                                                                    caption: "Bill No",
                                                                                    dataType: "string",
                                                                                    width: 110,
                                                                                    editorOptions: { width: 110 },
                                                                                    validationRules: [{ type: "required" }],
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
                                                                                // Medical
                                                                                {
                                                                                    dataField: "EROCode01",
                                                                                    caption: "IPD/OPD",
                                                                                    dataType: "string",
                                                                                    lookup: {
                                                                                        dataSource: arIPDOPD,
                                                                                        valueExpr: "CODE",
                                                                                        displayExpr: "CODE",
                                                                                    },
                                                                                    editorOptions: { width: 100 },
                                                                                    width: 100,
                                                                                    validationRules: [{ type: "required" }],
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "EROCode02",
                                                                                    caption: "Patient",
                                                                                    dataType: "string",
                                                                                    lookup: {
                                                                                        dataSource: arEMPTYPE,
                                                                                        valueExpr: "CODE",
                                                                                        displayExpr: "CODE",
                                                                                    },
                                                                                    setCellValue: function (newData, value, currentRowData) {
                                                                                        newData.EROCode02 = value;
                                                                                        if ($.trim(value) === "Employee") {
                                                                                            newData.EROCode02 = value;
                                                                                            //newData.ERODesc01 = currentRowData.PayToName // use PayToName only
                                                                                        }
                                                                                    },
                                                                                    editorOptions: { width: 110 },
                                                                                    width: 110,
                                                                                    //visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERODesc01",
                                                                                    caption: "Patient Name",
                                                                                    dataType: "string",
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 150 }, //, height: 80
                                                                                    width: 150,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "ERODesc06",
                                                                                    caption: "User Email",
                                                                                    dataType: "string",
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 150 }, //, height: 80
                                                                                    width: 150,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "Currency",
                                                                                    caption: "Currency",
                                                                                    dataType: "string",
                                                                                    value: "THB",
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
                                                                                    value: 1,
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
                                                                                    dataType: "string",
                                                                                    validationRules: [{ type: "required" }],
                                                                                    editorOptions: { width: 120 },
                                                                                    width: 120,
                                                                                },
                                                                                {
                                                                                    dataField: "ERODesc02",
                                                                                    caption: "Disease", //dropDownDisease
                                                                                    dataType: "string",
                                                                                    validationRules: [{ type: "required" }],
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 250 }, //, height: 80
                                                                                    width: 250,
                                                                                    //visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "Note",
                                                                                    caption: "Note",
                                                                                    dataType: "string",
                                                                                    //editorType:"dxTextArea",
                                                                                    editorOptions: { width: 100 }, //, height: 80
                                                                                    width: 100,
                                                                                    visible: false,
                                                                                },
                                                                                {
                                                                                    dataField: "NeedPayment",
                                                                                    caption: "Refunded",
                                                                                    dataType: "number",
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
                                                                                    dataField: "ERStatus",
                                                                                    caption: "Status",
                                                                                    dataType: "string",
                                                                                    width: 180,
                                                                                },
                                                                                {
                                                                                    dataField: "ERODesc05",
                                                                                    caption: "HR NOTE",
                                                                                    dataType: "string",
                                                                                    cssClass: "colorRED",
                                                                                    editorOptions: { width: 250, height: 80, readOnly: true }, //, height: 80
                                                                                    width: 250,
                                                                                    visible: true,
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
                                                                                        /*
                                                                                        summaryType: "max",
                                                                                        valueFormat: "currency",
                                                                                        showInGroupFooter: false,
                                                                                        alignByColumn: true  
                                                                                        */
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
                                                                                        valueFormat: "#,##0.00", //"currency",
                                                                                        /*
                                                                                        //          summaryType: "max",
                                                                                        //          showInGroupFooter: false,
                                                                                        //          alignByColumn: true
                                                                                        */
                                                                                        displayFormat: "{0}",
                                                                                    },
                                                                                    {
                                                                                        column: "RefundedAmount",
                                                                                        summaryType: "sum",
                                                                                        valueFormat: "#,##0.00", //"currency",
                                                                                        /*
                                                                                        summaryType: "max",
                                                                                        showInGroupFooter: false,
                                                                                        alignByColumn: true 
                                                                                        */
                                                                                        displayFormat: "{0}",
                                                                                    },
                                                                                ],
                                                                                groupItems: [
                                                                                    {
                                                                                        column: "ID",
                                                                                        summaryType: "count",
                                                                                        displayFormat: "{0} Items",
                                                                                        /*
                                                                                        alignByColumn: true, 
                                                                                        showInGroupFooter: true,
                                                                                        */
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
                                                                                        showInGroupFooter: false,
                                                                                        showInGroupFooter: true,
                                                                                        alignByColumn: true,
                                                                                        displayFormat: "{0}",
                                                                                    },
                                                                                    {
                                                                                        column: "RefundedAmount",
                                                                                        summaryType: "sum",
                                                                                        valueFormat: "#,##0.00", //"currency",
                                                                                        //showInGroupFooter: false,
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
                                                                                                        //.addClass("count")
                                                                                                        //.text(getGroupCount("CustomerStoreState")),
                                                                                                        .text(aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES FOR"),
                                                                                                    $("<br><center />"),
                                                                                                    $("<i class= 'fas fa-user-circle''><span />")   //; style='color: DarkGreen;
                                                                                                        //.addClass("name")
                                                                                                        .text(" " + $.trim(asFullName)),
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
                                                                                                    $("<span style='font-size: 13px; font-weight: bold; color: lightgrey; background-color: Indigo; border-radius: 3px; border: 0px; padding: 1px 10px;' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px;
                                                                                                        .text("LIMIT/YEAR"),
                                                                                                    $("<br>"),
                                                                                                    $("<i class= 'fas fa-coins'; style='color: Indigo;'>;"),
                                                                                                    $("<span />")
                                                                                                        .text('   ' + String(aaMedical).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '.00'), //aaLTotal
                                                                                                );
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        location: "before",
                                                                                        template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                                                    },
                                                                                    /*
                                                                                    { // Benefits Popup
                                                                                        location: "before",
                                                                                        widget: "dxButton",
                                                                                        options: {
                                                                                            icon: "fas fa-star", //"fas fa-question-circle",
                                                                                            text: "Previous",
                                                                                            type: "default",
                                                                                            stylingMode: "contained", //outlined contained
                                                                                            onClick: function () {
                                                                                                //let aNewDate = new Date()
                                                                                                //aPopUpAddForm(1, 1, aNewDate);
                                                                                                aPopUpBenefits(aaLimited) //aaMedical,aaFamily,aaSSO,aaMaternity,aaFleet
                                                                                            }
                                                                                        }
                                                                                    },   
                                                                                    */
                                                                                    { // Benefits Popup
                                                                                        location: "before",
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
                                                                                        options: {
                                                                                            icon: "fas fa-info",
                                                                                            text: "HELP",
                                                                                            type: "default",
                                                                                            stylingMode: "contained", // "outlined" contained
                                                                                            onClick: function () {
                                                                                                aPopupHelp("HELP", aVARs.HELP01)
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    //aPopUpAddForm
                                                                                    { // Add Popup
                                                                                        location: "after",
                                                                                        widget: "dxButton",
                                                                                        options: {
                                                                                            icon: "fas fa-plus-circle",
                                                                                            text: "Add New",
                                                                                            type: "success",
                                                                                            stylingMode: "contained", // contained outlined
                                                                                            onClick: function () {
                                                                                                //let aNewDate = new Date()
                                                                                                //alert(aNowDte)
                                                                                                aPopUpAddForm(1, 1, aNowDte, 0);
                                                                                                //aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate, e.row.data.HRApprovedDate);
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
                                                                                            hint: "Export to PDF File",
                                                                                            onClick: function () {
                                                                                                const doc = new jsPDF();
                                                                                                //doc.addFont("font/ANGSA.ttf", "angsana", "normal");
                                                                                                doc.addFont("font/Pridi-Regular.ttf", "Pridi", "normal"); // load thai font (in font location Google Font)
                                                                                                doc.setFont("Pridi", "normal"); // set to thai font
                                                                                                DevExpress.pdfExporter.exportDataGrid({
                                                                                                    jsPDFDocument: doc,
                                                                                                    component: dataGrid,
                                                                                                    customizeCell: function (options) {
                                                                                                        const { gridCell, pdfCell } = options;

                                                                                                        //if(gridCell.rowType === 'data') {
                                                                                                        //set font and font size
                                                                                                        pdfCell.styles = {
                                                                                                            font: 'Pridi',
                                                                                                            fontSize: 10
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
                                                                                    },

                                                                                );
                                                                            }

                                                                        }).dxDataGrid("instance");

                                                                        //----[END Main Program]======================================================================

                                                                        // Edit Popup         
                                                                        function aPopUpAddForm(aRecNo, iData, idDate, HRApproveD) { // popup Add New & Edit
                                                                            //var aaPFDMI = isLocalHost();
                                                                            var astr = localStorage["aDXTheme"]

                                                                            var aArrRecord = [];
                                                                            var anPMedSumUsedAmt = 0;
                                                                            var aaCheckAmt = 0;
                                                                            var nThisAmount = 0;

                                                                            if (aRecNo === 1) {
                                                                                let aaID = 1
                                                                                let axRunRun = aGetDateRef(aaOnInitExpGroupDesc.substring(0, 1));
                                                                                let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                                                var aaiHeadRef = axRunRun;

                                                                                var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, ERODate01: idDate, PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment, Division: asDivision, ERODesc06: asStaffEmail, ReqDate: idDate, ExpensesCode: aaOnInitAccCode, ExpensesDescription: aaOnInitAccDesc, Currency: "THB", Xrate: 1, ExpGroupCode: aaOnInitExpGroupCode, ExpGroupDescEng: aaOnInitExpGroupDesc, ERStatus: "Register", EROCheck03: 1, EROCheck04: 1, NeedPayment: 0, RefundedAmount: 0, LimitedAmount: aaMedical, EROCode01: "" } // aaLTotal ERODate01: new Date(),                                                                                                           
                                                                                var ObjRowData = JSON.stringify(ObjKeyData);
                                                                                console.log(ObjRowData)
                                                                                sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX)); //employees.splice(e.row.rowIndex, 0, clonedItem);                                                                                                                                    
                                                                                insideAddNew = true;
                                                                            } else {
                                                                                var aaiHeadRef = aRecNo;
                                                                                insideAddNew = false;
                                                                            }

                                                                            var aaSchRefx = "HeadRefNo LIKE '%" + aaiHeadRef + "%'" // (DataGrid View Only This New Item) 
                                                                            aqrFull = aaSchRefx;
                                                                            var aaxurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                                                            var aaxSettings = { "url": aaxurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };

                                                                            // define the $ as jQuery for multiple uses
                                                                            //jQuery(function ($) {
                                                                            $(() => {

                                                                                var aaLastLineNo = 1;
                                                                                var aXXData = function () { return $.post(aaxSettings).done(result => console.log(result)); }
                                                                                if (iData === 1) {
                                                                                    iData = aXXData[0];
                                                                                }

                                                                                //console.log("----iData-----")
                                                                                //console.log(iData)
                                                                                //console.log(aXXData[0])
                                                                                var gbxRateV = 1;

                                                                                const popup = $("#popupContainerAdd").dxPopup({
                                                                                    title: "Medical Expenses Reimbursement",
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
                                                                                    onInitialized: function (e) { e.component.registerKeyHandler("escape", function (arg) { }) },     // ignore when press 'ESC'                                                                          
                                                                                    //shadingColor:"rgb(190,190,190,0.9)",
                                                                                    //toolbarItems: [{toolbar:"top", html: "<span id='popupexit'></span>"}],
                                                                                    //toolbarItems: [
                                                                                    //    {toolbar:"top", html:"<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"}],            
                                                                                    contentTemplate: function () {
                                                                                        return $("<div />").append(
                                                                                            $("<p><div id='Add-form'></div></p>"),
                                                                                            $("<p><div id='Add-dxDataGrid'></div></p>"),
                                                                                            $("<span id='Add-popupexit'></span>"), //<p>&nbsp;</p>
                                                                                            $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                                                            $("<span id='aConfirm'></span>")

                                                                                        );
                                                                                    },
                                                                                    onContentReady: function () {
                                                                                        if (aRecNo === 1) {
                                                                                            // $("#Add-dxDataGrid").hide(); // hide dataGrid
                                                                                        } else {
                                                                                            if (iData.ERStatus === "HR Denied") {
                                                                                                $("#aConfirm").hide();
                                                                                            }
                                                                                        }
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


                                                                                                        /*
                                                                                                        aaresult.show().done(function (dialogResult) {
                                                                                                            console.log(dialogResult.buttonText);
                                                                                                        });
                                                                                                        */

                                                                                                        let result = DevExpress.ui.dialog.confirm("<i>" + "Press 'YES' To SAVE " + "</i>", "SAVE BEFORE EXIT ?"); // "<br>�� 'YES' ���ͺѹ�֡" +
                                                                                                        result.done(function (dresult) {
                                                                                                            //alert(dialogResult ? "Confirmed" : "Canceled");
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
                                                                                                    popup.hide()
                                                                                                }
                                                                                            }
                                                                                        }]

                                                                                }).dxPopup("instance");  // (And and Edit Popup)

                                                                                const aform = $("#Add-form").dxForm({
                                                                                    formData: iData, //aXXData[0], //iData,
                                                                                    showColonAfterLabel: false,
                                                                                    labelLocation: "top", //"top",
                                                                                    readOnly: true,
                                                                                    colCount: 1,
                                                                                    items: [{
                                                                                        itemType: "group",
                                                                                        //caption: "Refference",
                                                                                        //cssClass: "second-group",
                                                                                        //cssClass: "colorBGlightgrey",
                                                                                        colCount: 10,
                                                                                        items: [{
                                                                                            dataField: "HeadRefNo",
                                                                                            label: { text: "REF NO" },
                                                                                            value: aaiHeadRef,
                                                                                            editorType: "dxTextBox",
                                                                                            editorOptions: { value: aaiHeadRef, width: 150, readOnly: true },
                                                                                        },
                                                                                        {
                                                                                            dataField: "ReqDate",
                                                                                            label: { text: "Submitted Date" },
                                                                                            editorType: "dxDateBox",
                                                                                            editorOptions: { value: idDate, displayFormat: "dd/MM/yyyy", width: 150, readOnly: true },	  //showClearButton: true,                  
                                                                                        },
                                                                                        {
                                                                                            dataField: "PayToName",
                                                                                            label: { text: "Pay To" },
                                                                                            editorType: "dxTextBox",
                                                                                            editorOptions: { value: asFullName, width: 180, readOnly: true },
                                                                                        },

                                                                                        {
                                                                                            itemType: "empty",
                                                                                            colCount: 3,
                                                                                        },

                                                                                        //e.data.LimitedAmount = aaLMontyly  
                                                                                        {
                                                                                            dataField: "LimitedAmount",
                                                                                            label: { text: "Limit" },
                                                                                            //disabled: true,
                                                                                            editorOptions: { value: aaLMontyly, width: 180 },
                                                                                            visible: false,
                                                                                        },

                                                                                        ]

                                                                                    },

                                                                                    ]

                                                                                }).dxForm("instance");

                                                                                // Add New DataGrid 
                                                                                $("#Add-dxDataGrid").dxDataGrid({

                                                                                    dataSource: new DevExpress.data.CustomStore({
                                                                                        key: "REFNO",
                                                                                        loadMode: "omit",
                                                                                        /*
                                                                                        load: function () {
                                                                                            return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all', { "@": aaSchRefx }) // Change aaTBKey to TokenKey for this table 5102300001
                                                                                                .fail(function () { throw "Data loading error" });
                                                                                        },
                                                                                        */
                                                                                        load: function () { return $.post(aaxSettings).done(result => console.log(result)); },
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
                                                                                        enabled: false,//false // true
                                                                                        columnChooserModes: 'select' // "dragAndDrop"
                                                                                    },
                                                                                    showBorders: true,
                                                                                    sorting: {
                                                                                        mode: "single", //"multiple"
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
                                                                                    groupPaging: false, //true,
                                                                                    showColumnLines: true,
                                                                                    showRowLines: true,
                                                                                    rowAlternationEnabled: false, // 2 Tones Line Color
                                                                                    repaintChangesOnly: true,

                                                                                    onInitNewRow: function (e) {
                                                                                        //e.component.__addingStart = true; 
                                                                                        //gridContainer.option("editing.popup.title", "Adding Expenses Reimbursement");
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
                                                                                        e.data.ExpensesCode = aaOnInitAccCode
                                                                                        e.data.ExpensesDescription = aaOnInitAccDesc
                                                                                        e.data.Currency = "THB" // not for overseas
                                                                                        e.data.Xrate = 1        // not for overseas
                                                                                        e.data.ExpGroupCode = aaOnInitExpGroupCode
                                                                                        e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                                                                        e.data.ERStatus = "Register"
                                                                                        e.data.EROCheck03 = true // have a bill
                                                                                        e.data.EROCheck04 = true // doctor recommend
                                                                                        e.data.NeedPayment = true
                                                                                        e.data.RefundedAmount = 0
                                                                                        e.data.LimitedAmount = aaMedical //Medical Only aLTotal
                                                                                        e.data.EROCode01 = "OPD"
                                                                                    },
                                                                                    onEditorPreparing: function (e) {
                                                                                        if (e.parentType === "dataRow" && arDataU === 0) {
                                                                                            e.editorOptions.disabled = true;
                                                                                        } else {     //PSPvNO,PSPvDate
                                                                                            if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ERStatus" || e.dataField === "PSPvNO" || e.dataField === "PSPvDate" || e.dataField === "LocalAmount" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department" || e.dataField === "EROCode01")) { //|| e.dataField === "RefundedAmount"
                                                                                                e.editorOptions.disabled = true;
                                                                                            }
                                                                                        }
                                                                                    },

                                                                                    //
                                                                                    //
                                                                                    // Editing
                                                                                    editing: {
                                                                                        mode: "cell", // popup , row, cell (click to edit)
                                                                                        useIcons: true,
                                                                                        //allowUpdating: true,
                                                                                        //allowDeleting: arDataD,
                                                                                        allowUpdating(e) {
                                                                                            return (e.row.data.Confirmed === false);
                                                                                        },
                                                                                        allowDeleting(e) {
                                                                                            return (e.row.data.Confirmed === false);
                                                                                        },
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
                                                                                                            //aLocalMess = "<div style='color:Tomato; font-size: 13px'>���ź�������á��ҡѺ�繡��ź�����ŷ������ͧ REFNO = <u>" + e.row.data.HeadRefNo + "</u></div><br><b><center>�׹�ѹ����ź�����ŷ����� ?</center></b>"
                                                                                                            aLocalMess = "<div style='color:Tomato; font-size: 16px'><center><b>THIS IS THE FIRST ROW (NO = 1)</b><br>If you delete first row, program will delete all rows [REFNO = <u>" + e.row.data.HeadRefNo + "</u>]</div> <br> Are you sure you want to delete all rows ?"
                                                                                                            aLocalTitle = "DELETE ALL ROWS"
                                                                                                        } else {
                                                                                                            aLocalMess = "Are you sure you want to delete this row (ROW =" + e.row.data.ID + " )?"
                                                                                                            aLocalTitle = "DELETE THIS ROW"
                                                                                                        }
                                                                                                        let result = DevExpress.ui.dialog.confirm(aLocalMess, aLocalTitle);
                                                                                                        result.done(function (dresult) {
                                                                                                            if (dresult) {
                                                                                                                // delete data
                                                                                                                // DELETE FROM EXPREIM WHERE HeadRefNo = 'M2110120750'

                                                                                                                nThisAmount = 0;
                                                                                                                // replace 0 to array order by ID sample (list.splice(4, 1, "May");)
                                                                                                                if (e.row.data.ERORefNo3 === "OPD" || e.row.data.ERORefNo3 === "Dental") {
                                                                                                                    aArrRecord.splice(e.row.data.ID - 2, 1, 0)
                                                                                                                }
                                                                                                                if (aFrecN === 1) {
                                                                                                                    aSQLCommand = "use ExtraOnLine; DELETE FROM EXPREIM WHERE HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                                                                } else {
                                                                                                                    aSQLCommand = "use ExtraOnLine; DELETE FROM EXPREIM WHERE REFNO = '" + e.row.data.REFNO + "'"
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
                                                                                                                    DevExpress.ui.dialog.alert({ showTitle: false, messageHtml: aExitMessage }); //title: "OVER LIMITATION",
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
                                                                                            width: 40,
                                                                                            buttons: [// Clone first record ID++
                                                                                                {
                                                                                                    hint: "Add More Line",
                                                                                                    icon: "fas fa-plus",
                                                                                                    visible: function (e) {
                                                                                                        const aadataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                                                                        const aapageSize = aadataGrid.option('paging.pageSize'); // check page size [5,10,15]
                                                                                                        return (((e.row.data.ID - 1) % aapageSize === 0 && e.row.data.ID >= 1) && e.row.data.Confirmed === false) // count which record to show +                                                                                                         
                                                                                                        //return (e.row.data.ID === 1 && e.row.data.Confirmed === false) //return !e.row.isEditing;
                                                                                                    },
                                                                                                    onClick: function (e) {
                                                                                                        aaLastLineNo = aaLastLineNo + 1
                                                                                                        aaCheckAmt = 0;
                                                                                                        //add to array (sample fruits.push("Kiwi", "Lemon"));
                                                                                                        if (e.row.data.ERORefNo3 === "OPD" || e.row.data.ERORefNo3 === "Dental") {
                                                                                                            aArrRecord.push(nThisAmount)
                                                                                                        }
                                                                                                        nThisAmount = 0;

                                                                                                        //REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,RemitTo1,RemitTo2,RemitTo1Amount,RemitTo2Amount,RemitTo1Diff,RemitTo2Diff,RemitTo1Note,RemitTo2Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6
                                                                                                        let aBlankDate = new Date(); //"1900-01-01T00:00:00" //new Date('1900-01-01T00:00')//console.log(aBlankDate) 
                                                                                                        let axRunRun = e.row.data.HeadRefNo
                                                                                                        let aFieldSelected = "NextID"
                                                                                                        let aFullTableName = "ExtraOnLine.dbo.ERnextIDview Where HeadRefNo LIKE '" + axRunRun + "%'"
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
                                                                                                                //REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,RemitTo1,RemitTo2,RemitTo1Amount,RemitTo2Amount,RemitTo1Diff,RemitTo2Diff,RemitTo1Note,RemitTo2Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6
                                                                                                                //let aBlankDate = "1900-01-01T00:00:00" //new Date('1900-01-01T00:00') //console.log(aBlankDate) //"Confirmed wait for HR"
                                                                                                                //let axRunRun = e.row.data.HeadRefNo
                                                                                                                //aGetD2V(aaPFDMI, "ExtraOnLine.dbo.ERnextIDview Where HeadRefNo LIKE '" + axRunRun + "%'", "NextID", "aaOBJnn") //[WIKRAN-W10]. searh from view
                                                                                                                //let aNextNOa = aData[0].NextID; //JSON.parse(localStorage.getItem("aaOBJnn"));
                                                                                                                let aaID = aData[0].NextID; //aNextNOa[0].NextID //next no
                                                                                                                let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                                                                                console.log(aaID, axLineNo)
                                                                                                                //let aObjKeyData = { ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, EROAmount: 0, PBatchDate: aBlankDate,PSPvDate: aBlankDate,ERODate01: aBlankDate,ERODate02: aBlankDate,ERODate03: aBlankDate,ERODate04: aBlankDate,ERODate05: aBlankDate,ERODate06: aBlankDate} //{EntryBy: aaUsrN , EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };
                                                                                                                let aObjKeyData = { REFNO: axLineNo, ID: aaID, LocalAmount: 0, Amount: 0, EROCode02: "", RefundedAmount: 0, ERODesc03: "", ERORefNo3: "", ERODesc02: "", ERODesc05: "", ERODate01: aNowDte }
                                                                                                                let aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //values //var clonedItem = $.extend({}, e.row.data, { REFNO: axRunRun }); //++maxID

                                                                                                                sendRequestNew("Insert", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX)); //employees.splice(e.row.rowIndex, 0, clonedItem);

                                                                                                                e.component.refresh(true);
                                                                                                                e.component.refresh(true);
                                                                                                                e.component.refresh(true);
                                                                                                                e.event.preventDefault();
                                                                                                                $("Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                                                $("Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                                                $("Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                                                $("Add-dxDataGrid").dxDataGrid("instance").refresh();
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
                                                                                            dataField: "HeadRefNo",
                                                                                            caption: "REF NO",
                                                                                            //sortOrder: "desc",
                                                                                            //groupIndex: 0,
                                                                                            dataType: "string",
                                                                                            width: 180,
                                                                                            visible: false,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ID",
                                                                                            sortOrder: "asc",
                                                                                            caption: "#",
                                                                                            dataType: "number",
                                                                                            editorOptions: { width: 40 },
                                                                                            validationRules: [{ type: "required" }, {
                                                                                                type: "range",
                                                                                                min: 1,
                                                                                                message: "ID must greater than 0"
                                                                                            }],
                                                                                            width: 40
                                                                                        },
                                                                                        {
                                                                                            dataField: "ReqDate",
                                                                                            caption: "Submitted Date",
                                                                                            dataType: "date",
                                                                                            format: "dd/MM/yyyy",
                                                                                            editorOptions: { format: "dd/MM/yyyy", width: 120 },
                                                                                            validationRules: [{ type: "required" }],
                                                                                            width: 120,
                                                                                            visible: false,
                                                                                        },
                                                                                        {
                                                                                            dataField: "PayToCode",
                                                                                            caption: "Code",
                                                                                            dataType: "string",
                                                                                            editorOptions: { width: 150 },
                                                                                            width: 150,
                                                                                            validationRules: [{ type: "required" }],
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
                                                                                            editorOptions: { width: 200 },
                                                                                            validationRules: [{ type: "required" }],
                                                                                            width: 120,
                                                                                            visible: false,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ExpensesDescription",
                                                                                            caption: "Expenses",
                                                                                            dataType: "string",
                                                                                            editorType: "dxTextArea",
                                                                                            editorOptions: { width: 300 },
                                                                                            width: 250,
                                                                                            visible: false,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERORefNo1",
                                                                                            caption: "Plate NO",
                                                                                            dataType: "string",
                                                                                            width: 150,
                                                                                            visible: false,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERORefNo2",
                                                                                            caption: "Fleet Card NO",
                                                                                            dataType: "string",
                                                                                            width: 150,
                                                                                            visible: false,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERODesc03",
                                                                                            caption: "Hospital/Clinic Name",
                                                                                            dataType: "string",
                                                                                            editorOptions: { width: 180 }, //, height: 80 validationRules: [{ type: "required" }],
                                                                                            width: 180,
                                                                                            //validationRules: [{ type: "required" }],
                                                                                            /*validationRules: [{
                                                                                                type: "custom",
                                                                                                validationCallback: function (options) {
                                                                                                    var selectText = options.value;
                                                                                                    var isInvalid = selectText === "";
                                                                                                    return !isInvalid;
                                                                                                },
                                                                                                message: "Hospital/Clinic Name can not be blank."
                                                                                            }],*/

                                                                                            //visible: false,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERORefNo4",
                                                                                            caption: "Bill No",
                                                                                            dataType: "string",
                                                                                            width: 110,
                                                                                            editorOptions: { width: 110 },
                                                                                            visible: false,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERODate01",
                                                                                            caption: "Treatment Date",
                                                                                            dataType: 'date',
                                                                                            value: null,
                                                                                            format: "dd/MM/yyyy",
                                                                                            width: 150,
                                                                                            stylingMode: 'filled',

                                                                                            editorType: "dxDateBox", //"dxDateBox", //"dxCalendar", function (){return null}
                                                                                            editorOptions: {
                                                                                                //value: null,
                                                                                                showClearButton: true,
                                                                                                format: "dd/MM/yyyy",
                                                                                                width: 150,
                                                                                                showTodayButton: false,
                                                                                            },
                                                                                            validationRules: [{ type: "required" }, {
                                                                                                type: "range",
                                                                                                min: new Date(aYearStrS + "-04-30"), //aYearStrS
                                                                                                max: new Date(aYearStrL + "-04-30"), //aYearStrL
                                                                                                message: "Please Change Treatment Date"
                                                                                            }],
                                                                                        },
                                                                                        // Medical
                                                                                        {
                                                                                            dataField: "EROCode02",
                                                                                            caption: "Patient",
                                                                                            dataType: "string",
                                                                                            lookup: {
                                                                                                dataSource: arEMPTYPE,
                                                                                                valueExpr: "CODE",
                                                                                                displayExpr: "CODE",
                                                                                            },
                                                                                            setCellValue: function (newData, value, currentRowData) {
                                                                                                newData.EROCode02 = value;
                                                                                                if ($.trim(value) === "Employee") {
                                                                                                    newData.EROCode02 = value;
                                                                                                    //newData.ERODesc01 = currentRowData.PayToName // use PayToName only
                                                                                                }
                                                                                            },
                                                                                            editorOptions: { width: 110 },
                                                                                            //validationRules: [{ type: "required" }],
                                                                                            width: 110,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERODesc01",
                                                                                            caption: "Patient Name",
                                                                                            dataType: "string",
                                                                                            //editorType:"dxTextArea",
                                                                                            editorOptions: { width: 150 }, //, height: 80
                                                                                            width: 150,
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
                                                                                                newData.ERORefNo3 = "";
                                                                                                newData.RefundedAmount = 0;
                                                                                                aaCheckAmt = 0;
                                                                                            },
                                                                                            editorType: "dxNumberBox",
                                                                                            editorOptions: { format: "#,##0.00", width: 130 },
                                                                                            /*
                                                                                            validationRules: [{ type: "required" }, {
                                                                                                type: "range",
                                                                                                min: 1,
                                                                                                message: "Actual Amount must > 0"
                                                                                            }],
                                                                                            */
                                                                                            width: 130,
                                                                                            visible: true,
                                                                                        },
                                                                                        { // very high == Calculation for OPD/Dental/Maternity/Dental (SSO)/Others
                                                                                            dataField: "ERORefNo3",
                                                                                            caption: "Exp. Type*",
                                                                                            dataType: "string",
                                                                                            lookup: {
                                                                                                dataSource: aaSubGroup,
                                                                                                valueExpr: "ExpSubGroup",
                                                                                                displayExpr: "ExpSubGroup"
                                                                                            },
                                                                                            setCellValue: function (newData, value, currentRowData) {
                                                                                                newData.ERORefNo3 = value;
                                                                                                // sum all amount
                                                                                                anPMedSumUsedAmt = aArrRecord.reduce((partialSum, a) => partialSum + a, 0);
                                                                                                console.log(anPMedSumUsedAmt); // 6

                                                                                                nThisAmount = currentRowData.Amount; // 100
                                                                                                let aaRemainx = aaTTRm                 // 500      real time remaining 
                                                                                                let aaTTAmt = aaTTUsed               // 29500    Total Reimbursement Amount (used)
                                                                                                let aaRemain = (aaMedical - aaTTAmt)  // 500 (30000 - 29500) (LimitAmount - Total Used Amount)                                                                                    

                                                                                                var ccOverPC = false;

                                                                                                if ($.trim(value) === "Dental (SSO)") {
                                                                                                    newData.RefundedAmount = 0;
                                                                                                    newData.NeedPayment = false; //(value = "Fleet Card" ? false : true);
                                                                                                    newData.EROCheck01 = true;
                                                                                                    newData.EROCheck02 = true;
                                                                                                } else if ($.trim(value) === "Others") {
                                                                                                    let nOthersAmount = currentRowData.LocalAmount;
                                                                                                    newData.RefundedAmount = nOthersAmount;
                                                                                                    newData.NeedPayment = true; //(value = "Fleet Card" ? false : true);
                                                                                                    newData.EROCheck01 = true;
                                                                                                    newData.EROCheck02 = true;
                                                                                                } else if ($.trim(value) === "Maternity") { //Maternity Check

                                                                                                    let aaTotalmat = aaMMAmt2 //Total Amount 
                                                                                                    let aaRemainm = aaMMRm2  //Total Remaining 
                                                                                                    let aaTotalUsemat = aaMMUsed2 // Total Reimbursement

                                                                                                    let aaAMessagem = "<div  style='color:Tomato;'><center><b><i class='fas fa-exclamation-triangle'></i> MATERNITY OVER LIMITATION - �Թǧ�Թ</b></br></br> The remaining amount = " + aaRemainm + "</br>Please Try again !!!</center></div>";
                                                                                                    if (aaRemainm > 0) {
                                                                                                        newData.NeedPayment = true;
                                                                                                        newData.RefundedAmount = aaMaternity;
                                                                                                    } else {
                                                                                                        newData.RefundedAmount = 0;
                                                                                                        DevExpress.ui.dialog.alert({
                                                                                                            showTitle: false,
                                                                                                            messageHtml: aaAMessagem
                                                                                                        });
                                                                                                    }
                                                                                                    newData.EROCheck01 = false;
                                                                                                    newData.EROCheck02 = false;
                                                                                                    //}) //f

                                                                                                }

                                                                                                else { // Medical Expenses Check

                                                                                                    if (aaLimitPC !== 0 && nThisAmount > aaLimitPC) {
                                                                                                        aMessageAlert("<b>OVER LIMITATION</b> <br><br> Limit Amount per case = " + aaLimitPC, "red")
                                                                                                        ccOverPC = true;
                                                                                                        console.log(ccOverPC)
                                                                                                        //alert("OVER LIMIT PC")
                                                                                                        //newData.RefundedAmount = aaLimitPC;
                                                                                                    }

                                                                                                    aaCheckAmt = aaRemain - (nThisAmount + anPMedSumUsedAmt) // 400 30000-(29500+100+0) (Limit Amount - (Total Usage + This Value) ) : if  check amt < 0 then OVER Limitation **
                                                                                                    var aaRemainChk = (aaRemain - anPMedSumUsedAmt)

                                                                                                    let aTRem = (aaRemainChk === 0 ? "0" : aaRemainChk.toString());

                                                                                                    if (aaCheckAmt >= 0) {
                                                                                                        newData.NeedPayment = true;
                                                                                                        if (ccOverPC === true) {
                                                                                                            newData.RefundedAmount = aaLimitPC;
                                                                                                            ccOverPC = false;
                                                                                                        } else {
                                                                                                            newData.RefundedAmount = nThisAmount;
                                                                                                            //anPMedSumUsedAmt = anPMedSumUsedAmt + nThisAmount;
                                                                                                        }
                                                                                                    } else {
                                                                                                        // Overlimited
                                                                                                        let getvalues = { aTRem: aTRem }
                                                                                                        let aaAMessage = aVARs.ALERT02.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                                                        //let aaAMessage2 = "<div  style='color:Tomato; font-size: 16px;'><center><b><i class='fas fa-exclamation-triangle'></i> OVER LIMITATION - �Թǧ�Թ</b></center><hr></div> �ʹ�Թ������� (The Remaining amount) = " + aTRem + "</br>�ѧ�������ö�ԡ����§ (The Reimbursement Amount will be) " + aTRem + " ��ҹ��</div>";
                                                                                                        DevExpress.ui.dialog.alert({
                                                                                                            showTitle: false,
                                                                                                            //title: "OVER LIMITATION",
                                                                                                            messageHtml: aaAMessage
                                                                                                        });
                                                                                                        nThisAmount = aaRemainChk;
                                                                                                        newData.RefundedAmount = nThisAmount; //aaRemainx;
                                                                                                        newData.LocalAmount = nThisAmount;
                                                                                                    }
                                                                                                    newData.EROCheck01 = false;
                                                                                                    newData.EROCheck02 = false;
                                                                                                    //}) 
                                                                                                }

                                                                                            },
                                                                                            //validationRules: [{ type: "required" }],
                                                                                            editorOptions: { width: 120 },
                                                                                            width: 120,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERODesc02",
                                                                                            caption: "Disease", //dropDownDisease
                                                                                            dataType: "string",
                                                                                            editorOptions: { width: 150 }, //, height: 80
                                                                                            width: 150,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "RefundedAmount",
                                                                                            caption: "Reimbursement",
                                                                                            dataType: "number",
                                                                                            format: { type: "fixedPoint", precision: 2 },
                                                                                            editorOptions: { readOnly: false, format: "#,##0.00", width: 120 },
                                                                                            /*
                                                                                            calculateCellValue: function (rowData) {                                                  
                                                                                                if (rowData.ERORefNo3 === "Dental (SSO)"){                                                                           
                                                                                                    return { value: 0,
                                                                                                        editorOptions: { readOnly: true, format: "#,##0.00", width: 120  }
                                                                                                    };
                                                                                                } else {
                                                                                                    return { value: rowData.RefundedAmount,
                                                                                                        editorOptions: { readOnly: false, format: "#,##0.00", width: 120  }
                                                                                                    };
                                                                                                }
                                                                                            },
                                                                                            */
                                                                                            setCellValue: function (newData, value, currentRowData) {
                                                                                                if (currentRowData.ERORefNo3 !== "Dental (SSO)" && currentRowData.ERORefNo3 !== "Maternity") {
                                                                                                    if (value > currentRowData.LocalAmount) {
                                                                                                        newData.RefundedAmount = currentRowData.LocalAmount;
                                                                                                    } else {
                                                                                                        newData.RefundedAmount = value
                                                                                                    }
                                                                                                } else if (currentRowData.ERORefNo3 === "Dental (SSO)") {
                                                                                                    newData.RefundedAmount = 0;
                                                                                                } else if (currentRowData.ERORefNo3 === "Maternity") {
                                                                                                    newData.RefundedAmount = aaMaternity //currentRowData.LocalAmount;
                                                                                                }
                                                                                            },
                                                                                            width: 120,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERStatus",
                                                                                            caption: "Status",
                                                                                            dataType: "string",
                                                                                            width: 180,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERODesc05",
                                                                                            caption: "HR NOTE",
                                                                                            dataType: "string",
                                                                                            cssClass: "colorRED",
                                                                                            editorOptions: { width: 250, height: 80, readOnly: true }, //, height: 80
                                                                                            width: 250,
                                                                                            visible: true,
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
                                                                                                template: function () {
                                                                                                    return $("<div />")  //    height: 70px; width: 130px; text-align: center;  color: #fff;
                                                                                                        .append(
                                                                                                            $("<span style='font-size: 13px; font-weight: bold; color: lightgrey; background-color: Indigo; border-radius: 3px; border: 0px; padding: 1px 10px;' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px;
                                                                                                                .text("LIMIT/YEAR"),
                                                                                                            $("<br>"),
                                                                                                            $("<i class= 'fas fa-coins'; style='color: Indigo;'>;"),
                                                                                                            $("<span />")
                                                                                                                .text('   ' + String(aaMedical).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '.00'),
                                                                                                        );
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                location: "before",
                                                                                                template: function () { return $("<div style='padding: 5px 10px; '/>") }
                                                                                            },

                                                                                            {
                                                                                                location: "before",
                                                                                                widget: "dxButton",
                                                                                                options: {
                                                                                                    icon: "fas fa-star", //"fas fa-question-circle",
                                                                                                    text: "Benefits",
                                                                                                    type: "default",
                                                                                                    stylingMode: "contained", //outlined contained
                                                                                                    onClick: function () {
                                                                                                        //let aNewDate = new Date()
                                                                                                        //aPopUpAddForm(1, 1, aNewDate);
                                                                                                        //aPopUpBenefitsIN(aaLimited) //aaMedical,aaFamily,aaSSO,aaMaternity,aaFleet
                                                                                                        aPopUpBenefits(aaLimited)
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                location: "before",
                                                                                                template: function () { return $("<div style='padding: 5px 5px;'/>") }
                                                                                            },
                                                                                            {
                                                                                                location: "before",
                                                                                                widget: "dxButton",
                                                                                                options: {
                                                                                                    icon: "refresh",
                                                                                                    text: "Refresh",
                                                                                                    stylingMode: "outlined", //outlined contained
                                                                                                    onClick: function () {
                                                                                                        dataGrid.refresh();
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                location: "after",
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
                                                                                    },

                                                                                }).dxDataGrid("instance");

                                                                                // Exit and ask for SAVE or not
                                                                                $("#Add-popupexit").dxButton({
                                                                                    icon: "fas fa-times",
                                                                                    type: "danger",
                                                                                    text: "EXIT",
                                                                                    //width: "120px",
                                                                                    visible: true,
                                                                                    onClick: function (e) {
                                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                        //let cRes = aMessageSelect("Exit Without SAVE", "Press 'YES' to Not Save ")
                                                                                        if (aRecNo === 1) { //
                                                                                            let result = DevExpress.ui.dialog.confirm("<i>" + "Press 'YES' To SAVE " + "</i>", "SAVE BEFORE EXIT ?"); // "<br>�� 'YES' ���ͺѹ�֡" +
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
                                                                                        popup.hide()
                                                                                    }
                                                                                });

                                                                                // Confimred = true
                                                                                $("#aConfirm").dxButton({
                                                                                    hint: "Confirm and send to HR",
                                                                                    icon: "fas fa-check-circle",
                                                                                    type: "success",
                                                                                    text: "CONFIRM",
                                                                                    //width: "120px",
                                                                                    visible: true,
                                                                                    onClick: function (e) {
                                                                                        // Retrieve the DataGrid instance
                                                                                        const dataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");

                                                                                        // Utility function to get column by key
                                                                                        function getColumnByField(key) {
                                                                                            const columns = dataGrid.option("columns");
                                                                                            return columns.find(column => column.dataField === key);
                                                                                        }

                                                                                        // Get all rows from the grid
                                                                                        const rowsData = dataGrid.getVisibleRows().map(row => row.data);
                                                                                        //var condition = item => item.Amount === 0 || item.ERORefNo3 === "" || item.EROCode02 === "" || item.ERODesc02 === "" || item.ERODesc03 === "";    
                                                                                        // Validate each field in every row
                                                                                        const isValidRows = rowsData.every(row => {
                                                                                            return Object.entries(row).every(([key, value]) => {
                                                                                                // Get column configuration and caption
                                                                                                const column = getColumnByField(key);
                                                                                                const caption = column?.caption || key; // Use caption if available, fallback to key

                                                                                                // Validation logic with key, value, and caption
                                                                                                if (key === "Amount" && value === 0) {
                                                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be 0. `, "ERROR"); //(Key: ${key}, Value: ${value})
                                                                                                    return false;
                                                                                                }
                                                                                                if (key === "ERORefNo3" && value === "") {
                                                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR");
                                                                                                    return false;
                                                                                                }
                                                                                                if (key === "EROCode02" && value === "") {
                                                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR");
                                                                                                    return false;
                                                                                                }
                                                                                                if (key === "ERODesc02" && value === "") {
                                                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR");
                                                                                                    return false;
                                                                                                }
                                                                                                if (key === "ERODesc03" && value === "") {
                                                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR");
                                                                                                    return false;
                                                                                                }
                                                                                                // Example: Log key, value, and caption for debugging
                                                                                                //console.log(`Key: ${key}, Value: ${value}, Caption: ${caption}`);

                                                                                                return true; // Field is valid
                                                                                            });
                                                                                        });

                                                                                        if (!isValidRows) {
                                                                                            return; // Stop further processing if validation fails
                                                                                        }
                                                                                        //var aDatabasea = "ExtraOnLine.dbo.TaskControl";
                                                                                        //var aKeyField = "TaskGroup";
                                                                                        //var aKeyIDa = "aMedicalAlert01" //  T2408177541 "T2408152724" EROCode02 ERODesc02
                                                                                        //var axFieldSelected = "IDNO,TaskName,TaskProgram,TaskGroup";
                                                                                        ////var condition = item => item.Amount === 0 || item.ERORefNo3 === "" || item.EROCode02 === "" || item.ERODesc02 === "" || item.ERODesc03 === "";    
                                                                                        //var condition = "TaskProgram";
                                                                                        //aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                                                        //    .then(abc => {
                                                                                        //console.log(abc[0][condition])
                                                                                        //console.log(abc[1][condition])
                                                                                        //let aMessage2Show = abc[0][condition];  //aMedicalAlert01
                                                                                        //let aMess2Show = aMessage2Show.replace(/`/g, "'");
                                                                                        //let aEmailArr = abc[1][condition].split(',');
                                                                                        //aEmailArr = aEmailArr.join('');
                                                                                        //console.log(aaEmailArr) aaMess2Show aVARs.ALERT01
                                                                                        let result = DevExpress.ui.dialog.confirm(aArrays.ALERT01[0], aArrays.ALERT01[1]); // "<br>�� 'YES' ���ͺѹ�֡" +
                                                                                        result.done(function (dresult) {
                                                                                            if (dresult) {

                                                                                                //if (aContinueChk !== true) {
                                                                                                let aFREF = aaiHeadRef + "-001"
                                                                                                console.log("--- Inside ---")
                                                                                                //console.log(iData)
                                                                                                //console.log(iData.HeadRefNo)
                                                                                                //console.log(iData.EROCheck06)
                                                                                                //console.log(aRecNo)
                                                                                                //let aYeara = iData.HRApprovedDate.getFullYear()
                                                                                                //console.log(aYeara)
                                                                                                //let aCheck2Time = (iData.HRApprovedDate.getFullYear() === 1900 && iData.HRApprovedDate.getHours() === 11 && iData.HRApprovedDate.getMinutes() === 11);

                                                                                                //let aCheck2Time = false;
                                                                                                //console.log(aaiHeadRef)
                                                                                                //console.log(aFREF)
                                                                                                //console.log(aCheck2Time)
                                                                                                let aERStatus = "Confirmed wait for HR" //"Register"
                                                                                                let aTrueORFalse = '1'
                                                                                                let aTrueORFalseB = true
                                                                                                let aBlankDate = "1900-01-01T00:00:00" //new Date('1900-01-01T00:00') 
                                                                                                let aNowDateT = aaNowText(aNowDte)
                                                                                                //alert(aNowDateT)
                                                                                                //let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                                                //let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                                                var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus, ReqDate: aNowDte };
                                                                                                var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                                                //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO

                                                                                                //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704'
                                                                                                let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                                                aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                                                aSQLAction(aaPFDMI, aSQLCommand)
                                                                                                aSQLAction(aaPFDMI, aSQLCommand)

                                                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                                //console.log("aRecNo ", aRecNo)
                                                                                                //console.log("iData.EROCheck06", iData.EROCheck06)
                                                                                                if (aRecNo !== 1) {
                                                                                                    let aCheck2Time = iData.EROCheck06;
                                                                                                    if (aCheck2Time) {
                                                                                                        //send Email
                                                                                                        var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT";
                                                                                                        let aApproverName = aaHRAppName + ", [HR]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                                                        let aApproverEmail = $.trim(aaHRAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                                                        let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                                                        let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                                                                        //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                                                                                        var aSubject = aaMailTitle + " - " + "Request For Approve"
                                                                                                        let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                                                        let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>"; //<a href='https://www.w3schools.com'>Visit W3Schools</a>

                                                                                                        let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName }
                                                                                                        let aMessage01 = aVARs.ACONFIRM.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                                                        //let aMessage01 = aaEmailArr[0] + $.trim(aApproverName) + ",<br>&nbsp;&nbsp;&nbsp;&nbsp;��سҵ�Ǩ�ͺ ���͹��ѵ���¡�� " + aaOnInitExpGroupDesc + " Expenses Reimbursement ����Ѻ REFNO = [" + aRefNoa + "] ��������������� <br> ����ö�������������� " + aAddress2Do + " (��Ǣ�� HR Approve) <br><br>���ʴ������Ѻ���<br><b>" + aRequesterName + "</b></div>"
                                                                                                        //console.log("aMessage01 ",aMessage01)
                                                                                                        //var aMessage = "<!DOCTYPE html><html><head><style>table { bprder: 1px solid; border-collapse: collapse; width: 50%;}th, td {  text-align: left;  padding: 8px;}tr:nth-child(even){background-color: #ffe6ff }th {  background-color: #027DFC; color: white;}</style></head><body><table><tr><th  style = 'font-size: 22px;'><center />&#9728; " + aaMailTitle + " &#9728;</th></tr><tr><td style = 'font-size: 13px; background-color:#EAF4FF'>"+ aMessage01 +"</td>  </tr></tr></table></body></html>" //#fff7e6 #e6e6e6 #fff7e6    
                                                                                                        var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "<br><small>Request For Approve</small>" + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                                                        aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)
                                                                                                        aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                                                    }
                                                                                                }
                                                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                                //aMessageAlert("Already Confirmed To HR", "DarkGreen")
                                                                                                //aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                                                popup.hide();

                                                                                            } // if
                                                                                        }); // result
                                                                                        //    });

                                                                                    } // onclick
                                                                                    //     onClick: function (e) {
                                                                                    //         $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    //         $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    //         //var avresult = $("#Add-dxDataGrid").dxDataGrid("validate");
                                                                                    //         //if(avresult.length.isInvalid){var avTextR =""} else {var avTextR ="Not Valid"}
                                                                                    //         //"<div style='color:Red; font-size: 13.2px;' > ��سҵ�Ǩ�ͺ��úѹ�֡��¡�����ç�Ѻ�͡��� ��кѹ�֡���ú�ء��ͧ�ء��÷Ѵ <br><u>���蹹��</u> �з������¡�ù���ԡ������������</b></div><br><div style = 'border: 1px solid lightgrey;'></div>&nbsp;&nbsp;��ѧ�ҡ�׹�ѹ��������� ��س���觾�������ػ��¡�� �¤�ԡ &nbsp;" + "<i class='fas fa-print'></i>" + "&nbsp; ˹����¡�÷���ԡ<br>&nbsp; ���Ṻ������Ѻ�Թ�����Ѻ�ͧᾷ��鹩�Ѻ &nbsp;(���§����ӴѺ��¡�����ú��ǹ)<br>&nbsp; ŧ���㹪�ͧ����͹��ѵ� �������� HR ��Ǩ�ͺ�ѹ�� <br><div style = 'border: 1px solid lightgrey;'></div><br><center><b>�׹�ѹ����� ? </b></center>"        
                                                                                    //         // Check empty fields
                                                                                    //         var aDatabasea = "ExtraOnLine.dbo.EXPREIM";
                                                                                    //         var aKeyField = "HeadRefNo";
                                                                                    //         var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724" EROCode02 ERODesc02
                                                                                    //         var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";  
                                                                                    //         var condition = item => item.Amount === 0 || item.ERORefNo3 === "" || item.EROCode02 === "" || item.ERODesc02 === "" || item.ERODesc03 === "";    

                                                                                    //         aaLoadData(isLocalHost(),aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                                                    //             .then(atestCehcka => {                                                         
                                                                                    //         if (atestCehcka === 1) { DevExpress.ui.dialog.alert(aMedicalAlert02, "INPUT ERROR"); }  //(aAllTChecked === "") || (aAllChecked === 0) DevExpress.ui.dialog.alert({ showTitle: false, messageHtml: "�س��ͧ�ѹ�֡���������ú�ء��¡�á�͹ �� Confirm" });
                                                                                    //         //DevExpress.ui.dialog.alert(messageHtml, title);
                                                                                    //         else {                                                                                        
                                                                                    //         let result = DevExpress.ui.dialog.confirm( aMedicalAlert01 , "CONFIRM TO HR"); // "<br>�� 'YES' ���ͺѹ�֡" +
                                                                                    //         result.done(function (dresult) {
                                                                                    //             if (dresult) {
                                                                                    //                 //if (aContinueChk !== true) {
                                                                                    //                 let aFREF = aaiHeadRef + "-001"
                                                                                    //                 console.log("--- Inside ---")
                                                                                    //                 console.log(iData)
                                                                                    //                 //console.log(iData.HeadRefNo)
                                                                                    //                 //console.log(iData.EROCheck06)
                                                                                    //                 console.log(aRecNo)
                                                                                    //                 //let aYeara = iData.HRApprovedDate.getFullYear()
                                                                                    //                 //console.log(aYeara)
                                                                                    //                 //let aCheck2Time = (iData.HRApprovedDate.getFullYear() === 1900 && iData.HRApprovedDate.getHours() === 11 && iData.HRApprovedDate.getMinutes() === 11);

                                                                                    //                 //let aCheck2Time = false;
                                                                                    //                 console.log(aaiHeadRef)
                                                                                    //                 console.log(aFREF)
                                                                                    //                 //console.log(aCheck2Time)
                                                                                    //                 let aERStatus = "Confirmed wait for HR" //"Register"
                                                                                    //                 let aTrueORFalse = '1'
                                                                                    //                 let aTrueORFalseB = true
                                                                                    //                 let aBlankDate = "1900-01-01T00:00:00" //new Date('1900-01-01T00:00') 
                                                                                    //                 let aNowDateT = aaNowText(aNowDte)
                                                                                    //                 //alert(aNowDateT)
                                                                                    //                 //let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                                    //                 //let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                                    //                 var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus, ReqDate: aNowDte };
                                                                                    //                 var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                                    //                 //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO

                                                                                    //                 //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704'
                                                                                    //                 let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                                    //                 aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                                    //                 aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    //                 aSQLAction(aaPFDMI, aSQLCommand)

                                                                                    //                 $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    //                 $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    //                 $("#Add-dxDataGrid").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                                    //                 $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                    //                 $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                    //                 if (aRecNo !== 1) {
                                                                                    //                     let aCheck2Time = iData.EROCheck06;
                                                                                    //                     if (aCheck2Time) {
                                                                                    //                         //send Email
                                                                                    //                         var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT";
                                                                                    //                         let aApproverName = aaHRAppName + ", [HR]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                                    //                         let aApproverEmail = $.trim(aaHRAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                                    //                         let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                                    //                         let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                                                    //                         //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                                                                    //                         var aSubject = aaMailTitle + " - " + "Request For Approve"
                                                                                    //                         let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                                    //                         let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>"; //<a href='https://www.w3schools.com'>Visit W3Schools</a>
                                                                                    //                         let aMessage01 = "<div>���¹ �س" + $.trim(aApproverName) + ",<br>&nbsp;&nbsp;&nbsp;&nbsp;��سҵ�Ǩ�ͺ ���͹��ѵ���¡�� " + aaOnInitExpGroupDesc + " Expenses Reimbursement ����Ѻ REFNO = [" + aRefNoa + "] ��������������� <br> ����ö�������������� " + aAddress2Do + " (��Ǣ�� HR Approve) <br><br>���ʴ������Ѻ���<br><b>" + aRequesterName + "</b></div>"
                                                                                    //                         //var aMessage = "<!DOCTYPE html><html><head><style>table { bprder: 1px solid; border-collapse: collapse; width: 50%;}th, td {  text-align: left;  padding: 8px;}tr:nth-child(even){background-color: #ffe6ff }th {  background-color: #027DFC; color: white;}</style></head><body><table><tr><th  style = 'font-size: 22px;'><center />&#9728; " + aaMailTitle + " &#9728;</th></tr><tr><td style = 'font-size: 13px; background-color:#EAF4FF'>"+ aMessage01 +"</td>  </tr></tr></table></body></html>" //#fff7e6 #e6e6e6 #fff7e6    
                                                                                    //                         var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "<br><small>Request For Approve</small>" + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                                    //                         aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)
                                                                                    //                     }
                                                                                    //                 }
                                                                                    //                 $("#Add-dxDataGrid").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                                    //                 $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                    //                 aMessageAlert("Already Confirmed To HR", "DarkGreen")
                                                                                    //                 popup.hide();

                                                                                    //             }
                                                                                    //         }); // result
                                                                                    //         } //else if
                                                                                    //     });  

                                                                                    // } // on click

                                                                                });

                                                                            });
                                                                        }

                                                                        function aCryPdfPrint(aaHeadRefNo) {
                                                                            var aMRptFilex = "MMasterReport.rpt"
                                                                            var aSearchFieldNamex = "REFNO"
                                                                            var aREFNO = aaHeadRefNo
                                                                            console.log("NEXT")
                                                                            console.log(aREFNO)
                                                                            aPrintCrystal2Pdf(aMRptFilex, aSearchFieldNamex, aREFNO);

                                                                        }

                                                                        // Print Popup
                                                                        function aPopUpPrintForm(iData, aaHeadRefNo) { //, taData
                                                                            //var aWOTP = aWithOTP || 0;
                                                                            var aaiHeadRef = aaHeadRefNo;
                                                                            var aaSchRef = "HeadRefNo LIKE '%" + aaHeadRefNo + "%'" // scopes based permission (View Only Login Name)
                                                                            var aaPFDMI = isLocalHost();
                                                                            //var aii = 0;
                                                                            var astr = localStorage["aDXTheme"]
                                                                            if (astr.includes("dark")) {
                                                                                var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmwhite.png' width='88'></center></div>"
                                                                            } else {
                                                                                var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"
                                                                            }

                                                                            // define the $ as jQuery for multiple uses
                                                                            //jQuery(function ($) {
                                                                            // ...
                                                                            $(() => {
                                                                                // ...
                                                                                var gbxRateV = 1;
                                                                                var aWarningMessage = "<span style= 'black;'><big>*�ôṺ�͡���������Ѻ�Թ�����Ѻ�ͧᾷ��鹩�Ѻ �����§����ӴѺ��¡�����ú��ǹ��й������ HR �ѹ��*</big></span>"  // border: 2.5px solid gray; padding: 2.5px 5px; border-radius: 3px;
                                                                                let atopmargin = "22px";
                                                                                let abodyleftm = "22px";
                                                                                let abodylefts = "55px";
                                                                                let aSubD = iData.ReqDate.toString();
                                                                                let aSubmitD = aSubD.substring(8, 10) + "/" + aSubD.substring(5, 7) + "/" + aSubD.substring(0, 4)
                                                                                //let aSubmitD =  aSubD.getFullYear() + "/" + aSubD.getMonth() + "/" + aSubD.getDate()
                                                                                var aaqrFull = aaSchRef;
                                                                                var aaurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                                                                var aaSettings = { "url": aaurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aaqrFull) }), };

                                                                                var aaxurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "B1DE21C1-DCF1-4278-9C26-BEEC7B1DDEA4" + '/all'
                                                                                var aaxSettings = { "url": aaxurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aaqrFull) }), };

                                                                                let atitledtl = "Medical Expenses Reimbursement";
                                                                                let aAlertMessage = aWarningMessage; //"<big>��س�Ṻ���������͡��÷������Ҵ��� ����蹹�鹨��������ö�ӡ���ԡ�� **</big>";
                                                                                let arectanglehtml = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect x='1' y='1' width='100' height='100' stroke='black' stroke-width='0.2' fill='none' /></svg>"
                                                                                let arspace = (no) => { return "&nbsp;".repeat(no) }; //= "&nbsp;".repeat(30);
                                                                                let arlineno = (nor) => { return "<br>".repeat(nor) };
                                                                                let aaEName = "<span style = 'border-bottom: 1px dotted #000;'>" + iData.PayToName + " (ID NO:" + iData.PayToCode + ")</span>";
                                                                                let aaDept = "<span style = 'border-bottom: 1px dotted #000;'>" + iData.Department + arspace(15) + arspace(14) + "</span>";
                                                                                var afullhtml = "<h2><img src='data:image/png;base64,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' height='42.30000000000001' width='94'> Formatted Text Editor (HTML Editor)</h2><p><br></p><p>DevExtreme JavaScript HTML Editor is a client-side WYSIWYG text editor that allows its users to format textual and visual content and store it as HTML or Markdown.</p><p>Supported features:</p><ul><li>Inline formats:<ul><li><strong>Bold</strong>, <em>italic</em>, <s>strikethrough</s> text formatting</li><li>Font, size, color changes (HTML only)</li></ul></li><li>Block formats:<ul><li>Headers</li><li>Text alignment</li><li>Lists (ordered and unordered)</li><li>Code blocks</li><li>Quotes</li></ul></li><li>Custom formats</li><li>HTML and Markdown support</li><li>Mail-merge placeholders (for example, %username%)</li><li>Adaptive toolbar for working images, links, and color formats</li><li>Image upload: drag-and-drop images onto the form, select files from the file system, or specify a URL.</li><li>Copy-paste rich content (unsupported formats are removed)</li><li>Tables support</li></ul><p><br></p><p>Supported frameworks and libraries</p><table><tbody><tr><td><p><strong>jQuery</strong></p></td><td><p style='text-align: right;'>v2.1 - v2.2 and v3.x</p></td></tr><tr><td><p><strong>Angular</strong></p></td><td><p style='text-align: right;'>v7.0.x - v10.0.x</p></td></tr><tr><td><p><strong>React</strong></p></td><td><p style='text-align: right;'>v16.2+</p></td></tr><tr><td><p><strong>Vue</strong></p></td><td><p style='text-align: right;'>v2.6.3+</p></td></tr></tbody></table>"
                                                                                var aheaderhtml = "<h4 style='text-align: left;'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAz4AAAF6CAYAAADYnY2LAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AABVEklEQVR42u3dz68k2Zvf9c8ZvjIDHvvmFyOPkRnd7BkLEEhUtuQFC6TK9gpZiM6vjJBlIVe25Q0/pM7+CzqLFRJInb1gg4Q7CyGzAX+zxA4WnZc10HktIS9g6LxIg2YWaDKlwXiBdVjEybpRt+6PExEn4ok48X5JV11dFZnxRN7MyPOcH89x3nsBAPLnnJuX/ncafsrmzzx8Kmki6bck/RMRp/sTSf9f+Pl/wt+dws/fl/T3Ln/nvT9YvzYAgPw5Eh8AGDbn3ExFUjLVfYIyC/88k3RlHWOkO0nH8OeDiiTpePnx3h+rPyUAAAUSHwAYgJDcTFUkMtPSz7V1bB27JEcHFYnRXiRFAIAIJD4A0CPOuamK5ObyM5X0yjqugbjVfVK0FwkRAKCExAcAjIRRnPLPa+uYMnTWfSJ0kHQgGQKAcSLxAYAOOOcmKooHzMJ/SXLsnHWfCO2993vrgAAA7SPxAYAWlBKdyw/T1frtVkUytFeRDJ2sAwIApEXiAwAJkOhk51bSTowIAUA2SHwAoKawRmcuaSGmruXuvYrRoB1rhABgmEh8AKAC59xC98nO2EpJo3CZFrdl81UAGA4SHwB4QUh2Lj9D2QwU3bjT/UjQzjoYAMDTSHwA4BE9Tnb+X0n/WNJvGcdxlrRSsc/QSv16jaycVawLIgkCgB4i8QGAwDk3l7RUP5Kdy/4zB0l/JOlflPRXJP2OcVyX2OaXaV5h09WNpC8NY/p9Sf9A0p9RP9Zb3alIgpgOBwA9QeIDYNRCo30l2zU7j26yGWJbqx+J2MWtpMVjC/xD4riV7dqnOxWv2f8i6Xd1v2/STHav4Z2KxJDCCABgiMQHwCg555YqRncsRgfKe8YcHjaGSwnPG7MX6Om458/tcRPKeq8lfW0c61lFsrG5xBuq8M10nwhZlBx/r2IUaGf8+gDA6JD4ABiN0ujOUt32/t/ofmPM/TPxzVUkDX2YqvXQO+/9MvbgcC0b2e9ndFYxCrV5JMGcyG7vpbsQ15ZRIADoBokPgOyFQgUrdZdQXEZ0djGbX/Y84ZEqJj0Prm0j+9GfD9chaf1UovEgEVqouyl771QkQHvj1wcAskbiAyBLoRG7VJHwtN2AvVTz2qtIdk6RMc7V74RHkr7x3m+aPEFP1v6UPZsAleKe6j4J6qJww62Kkamt6asDAJki8QGQlQ6ns12qdkWN6jyIca7+JzyS9FWqRnhIRDfq17qlqASodA0LFUnQXO0mcZ+sTwIANEfiAyALHRUEuExhq1WiuMdFCx6TLOl58BosVTTq6ySlvy/pTyl9Se9KCVC4jpnuS5+3lQQ9uT4JAFAdiQ+AQQsN0JXaSyYa78cysIRHainpefB67FSvmMCtpP9Y0l9X2ulntUdZOkqCKidnAICPkfgAGKTQ2Nyonelil572RptPhuldq/DTl314XtJq0nPRcOrbWcV0s5PS73N0VpFgbGpe1yLEkzKmMhIgAKiJxAfAoLQ8epJsj5WGU7oe848k/WYL11zWSdJT1uB1Oktaeu93LSWYd5JWdd8LIaaF2tsrigQIACoi8QEwCC0mPHcqGt67FI3IFvav+Z8l/UuS/nTi636o86TnIoze7VRvmthHcYdEal3zuR5zoyIBOjS4vqnaKbhBEQQAqIDEB0CvlXrzv0381MlGd0KcUxWN0FTrTm4k/VeS/lO1P03OLOm5CL/nneqNjnwSfwsJ0PcqRlhODa9zqfSjQGcVyc864XMCQHZIfAD0lnNupaLxmnL9xlaJq2Q559ZKN83qJlzzVNIPqWJ8hnnSU+ac26reqN7bxxr+iTevPasY/dkmuM6Z0hflaDQ9DwByR+IDoHda2PDyTkUyEb25qEGcNypGFPZhVGB0Sc9Fg+t/571fPvGcc6X9XTWa/laKa6L065OSxQcAOSHxAdAbLU0X26Zu3CfejPNDwhOee6kRJz0XIVHZqXoy8GTyE553qXRT4N4q4fqavk7PA4BckPgA6IU2potdkonEcS5UjBw0jfNORVWyDzF2mPQ8mxz0RZgOtlfi5Cc891JpkoxPfo8JrjtVbFLC6XkAMHQkPgBMJa6C1mbCM1WR8DRdK3IXYtw+eP6lSHo+0WCz05jkZ6J008ySj64kToBuVCRox1TxAcDQkPgAMBEanWtJXyd4utYSnhDrSs2LLDxZerjDpOfGez/v4DxJhffKXi0kP6XnX6v5ezH56E+Ib6k0CRDV3wCMGokPgM4lXGh+q2Iaz76lOCchzqZrjp7cbDJM5/qpjfgfuJU0H+p6jwblrt/GNvQTjup9771ftfAaLJUmAbpVkaAdUscIAH1G4gOgM4l71tdtrltItJbn2cSswRqWqs6SpkNNespqlruuVMgh/O43apZgtJZcJFwPF50UAkAOSHwAdCI08ndq1phsfapOooptZxWJ2eaF12OvbpKeeU69+x0lPxM13zj3xfdBg9dgojSdCLeSFqz9ATAGJD4AWhd6qJs0IKViutiqzVGLRMnZi3E2WLNSR6/LVtdVM/n5VdXNPRNNf3uvYvTn1MLrkCI+Kr8BGAUSHwCtSdQoa3UdTynWlaTvGjxF1ML2jpOerKcy1Uh+ao9+hfU1G9UfobtTMbJS+dyR8S3UfHpeawkaAPQBiQ+AViRYI9PaNKEHcU7UvIBBdCnjmiMVdbz33i86OI+pmsnPrM7UrkTvldZG4BJNz2s1QQMASyQ+AJJzzm3UbO1BJz3PCaa2VVrAnmjKX2xcg63gVlWN5KfR65MgqW91L6Xwvt6o2UhrllMkAYwbiQ+AZBqUHL44q0gkdh3EulSzqUuVppGFxvKv274uZVjMIIZzbq9q77tGI2IJRn9aT04T7D/V+ro6AOgSiQ+AJBJUKetsfUHDEanKU4E6rOAmjbSnvubaqcb77TRMoFtPUhOss6PqG4Bs/IZ1AACGLzT+9qrf+PuV937RwdS2SRgZqJv0fK9ifcihyjnVfD+g6PjGmPRIUnjvzFU01GN9Hd67Tc67lTSreN6LK0n7pjG8EN/Rez+X9I2Kz1pVryQdQvIOAIPGiA+ARhqOnnQ5yjNTkYDUqaZWewqec26nZovhY91672cdnKfXwgjHQfGJZrJRl4afhW86KOQxU/3PgDTS0UQA+SDxAVBLgo0+W2/olWKdqf6I1I2KqT6nGuddqVmJ7FijXNfzlBq/7zsVI3mnBOeeq1jnVue91mrRg1KMGzUY9Ww6PRAArDDVDUBlpfUUdZKeW0mfd5j0LCX9pHoN0bfe+1oL0EPju4ukRypKaR86OlfvhddiWeEh1ypGQlKce6/6U9/ehAp1rQqJyxeqN/Xt6y5iBIA2MOIDoJIwlWinetNlOq0SFZKeH2o89KxilGdf87wTdbdJ6Sj266mjxohb0lHIBns2dVKOvGEVxlGVTAeQBxIfANEaThnrbGpbiHWr+o3ORlWsEuxjFOssaUrj82k13gefpxw9a5B8d5ZYNHi/kvwAGBQSHwBRGiQ9na8/aZD0NB6R6nC/Hqmohrfr6FyD5Zw7KH70Ldl6n9L5Z6r32eky+VmqXlluyl0DGAwSHwAvGkLDrRTrVvWSnsYjUmHq0FHdlK5milukGpXekhcZaDBFtMvkZxZivK74UIprABgEihsAeFaDpOedhpH0nCV9kWga3lbdJD1nVVu8P2phNGJR4SFvwshd6hjmKqoEVvFKxV4/k7Zen1KMB9UrzHDZj2jWdowA0ASJD4AnNUh63nrvO9mfJ8R52Zi0atJzpyI52yeIYaFu9uuROtr7KCfhd/y2wkO2qZMN7/0pbCb6ruJDu0x+TmE/qKoxkvwA6D2mugF4VIOkp/NNDmtuEppsClFokB5UfYpQHUxxayAkyLFVzFp7rWsWFOh06mjNGJn2BqC3SHwAfKJm0nNWMRKx6zjWraqP9LxXwlGTjqu4zVhIXl+NdVitFZCoWfHtNozIdKJmjLxPAfQSU90AfKRB0jMfSNLzznu/SJj0zNRN0iMVG5UeOzpXlsLvfVnhIcmnvJVi2Ur6quLDXnW5gWjNGK8k7bqYmgcAVZD4APigYdJz6DjWreolPcvEoWw6uuTbLvdByllI0L+PPPxKLf6OayYWbwySny9UfNZjdbYuCQBiMdUNgKQPU4D2qlZu1yrpWUv6tuLD2ihRvFS9zSnr+CJFEQYUaqzLavX1r/le6nQ9Xc2OkU6n5gHAc0h8AAwt6VmqegOx8R49j8QxUVEV7s92cNltjFSNnnNuLunHyMNbb8DXfG93uoltzeSH9y+AXmCqGwCpmMozhKRnoXq94psWwlmpm6RHktYdnWdUwghO7JS3V865VcvxbFV92tu2yxLS4TM/V7Vpb2/CKC0AmGLEBxi5GtPGrJKemar3NL/13q9biGUq6e9L+jMdXHor14BCxSlvZ0nTtstJ1xj5uVNRRa3VuB7EOFP1z2Pnpe4BoIwRH2DEQgNrCEnPRNJO1afXrFsKaa1ukp6zuiueMEoVq7y1WuigFNNW1TZbvVbx+ehMuAcsKj5swwanACyR+AAjFRogmwoPsdyYcKdqm4O2tqYgjPZUrSZX17rLXvyxClPe3kce/ia8B9qOaS3pXYWHvO56Oll43apMzaPMNQBTTHUDRqhGRSvJqKpYjc1BW11IXbOMdh133vtpB+eBPiS0B8WNKt547+cdxbWT9GWFh3T+Oa0xNa+z1w8AyhjxAcZpq2pJz1dGSc9C1ZKe25aTnqk6HO3p6DyQFDaG3UQe/jpUhOvCUtJtheM7H1EJU/Nii0RIBqNTACAx4gOMTqhM9V2Fh5gsrq/YAy8VjcN5m1PDGO3Jn3PuqLhOgS5Hfaaq9ll4771fdBHbgzi3qvb5YG8qAJ0i8QFGJKzr+anCQ8z233DOHRRfYvusoqrVscV4ppJ+7ujyqX5lJIwy/jry8M4a7hX3HJJa2LsqIsaJqu0H1kmVPAC4YKobMBKhUbKt8JBbFXvVWMS6UbV9heZtJj3BuqPLvyPpsRM2A72JPHzdYVx7Sd9UeMi6iyIMD2I8qdoeP1fquBodgHEj8QHGY61qPbELi57Y0LNdZV3PV21XmmNtz+isI4/rcq2PwghObPW5K1Xr6EgV40lF8hPrddsbwwLABYkPMAI1kolFByMoj8U5UbXG2ruORkeWHb0EZ9EDbq5ieet1x+EtVWxYGsMkqQgdEb0enQIwTqzxATJXo3S1STGDEOtO8aV7Wy9mEGKaSPq/JP1THbwEZq89PlZxTdfnXe5vVXGtntk6moqfZ0pcA2gdIz5A/taKT3puDJOeueIbSV1OxVuom6RHqrahLFoURjxjNxBddRzbQdLbyMNNprwFS/V8dArAuDDiA2SsYiUoy57hiaqNSnVW9cw5979L+r0OTmVWQQ+Pqzjq81nX00MrVj602oB4pgGMTgEYB0Z8gLxtKhy7NGxwrBSf9LzvMOmZqZukR2K0p3dCIhNb4W1pEGKVc24M4hvS6BSAEWDEB8hUxY1KTTY8DHFOFd+rfqdiv55TR7H9N5L+WgenuvXez7q4JlRTYdT07L2fGMS3lvRt5OFm+0MNYXQKQP5IfIAMhaljR8Xt9G46vcQ5t5f0OvLwLjeMnEj6Q0n/ZAenY8PSHqvwHjX5PVZIKiyns84UP+Xtzns/7TpGAPljqhuQp43ikh7JcIqbc26h+KTn+457gf+Gukl6KGHdf9vI45ZG8a0ij7uqcGxSFae8XVPoAEAbGPEBMlNx6pjZFLcQ61Fxa3s676l2zv2fkn6ng1NR1GAAKrxXOy9yEOLbKm6TXesR3oN6PjoFIF+M+AD52UQed5ZR768kOeeWii9o0OmoVEgeu0h6JIoaDMU28riVUXwrFZ/pl5iN+pTijGEdJ4AMkfgAGam4F87Gomc6xDlR/I73N977Xcch/q2OznPX5caXaGQTedzCIrjQMRAb4yp8Bi3i3KvC/khWcQLIE4kPkJd15HF3VhuVBivFj/asDOL79zo6z87g2lBDSCzeRxx6HdauWdgobsNQ69GUlYYxOgUgMyQ+QCbCaE9soYCVYZyTCud/1/WISJjm9s92dLpNl9eGxraRxy0sggvJ2TrycMtRn5MGMDoFID8kPkA+1pHHWUwdK1sovsz2yiC+/6Cj89xaTTVEPeFzEzOisjCMcRsZ45VlnBrO6BSAjJD4ABkIoxSxoz1r43Bjz78xqui07Og8W4NrQ3O7iGOuDKe7SfGfsdjjkhvK6BSAvJD4AHlYRx53Y7kjeoVKbmcZTAPreJrbvuvrQxLbyOMWVgFWGPW5DlNk+x7nlez2SAKQERIfYOBCT2jM/h2S/WjPMvI4q9Gev9nReajmNlDh99br6W7BNvK4pXGc68jjVsZxAsgAiQ8wfKvI46xHe2aKm45nMtoT/I2OzrMzuj6ksYs45iq8561sFFc57Y3lNLKKo1NLqzgB5IHEBxi+ZeRxa+M4V5HHWY32SNJf6ug8e6PrQxrbyOMWVgGGz9Au8vClVZzBeiBxAhg45723jgFATWEB9a8jDr313s8M45xIOiqumttnFtXOnHP/pqT/rotzee9d19eHtJxzR728Xs36czeV9HPEodZxTtTz+wOAPDDiAwzbMvK4jXGcC8U1at4ZNmr+dkfnuTG6PqS1jzjmlfE0sqPi3m+vQpJkFedJFfb1sYoTwPCR+AADFRpUX0Yceg7z6C2tIo/bGMb4r3V0nr3hNSKdXeRxc+M4t5HHrQYS58I4TgADRuIDDNcy8ritZZChJ/lVxKG3xpXOfruj8+wNrxHp7COPmxvHuVNckQPTOMPo1PuIQ01LcAMYNhIfYLiWkcdtjONc9D1O59xf7+pclpX1kE6YnhUzjWzegzh3EYeaTncLtpHHLY3jBDBQJD7AAFUYRbnpwULgZeRxO8MY/62OzsP6nrzsI44xXecT7CKPW1gG6b3fKW50yjROAMNF4gMM0yLyuK1lkBUStPeGJawl6V/v6Dx7w2tEevvI42aWQQ4sodhGHHPFdDcAdZD4AMM0jzxuR5xRulrfczC+TiRUYdri3DpWxSVpMRsMt20bedzCOlAAw0PiAwxMhWpu1qMoUnzjZGcVYHg9/1RHpztYXSdacxtxzMw6SEV+xqxHUkKBk7uIQxeWcQIYJhIfYHjmkcftrAONjNU6QVt2dJ5zD9ZbIb19xDEz6yA1nPLbsbFe96AYA4CBIfEBhmceedzeMsjQcxyzaenOMk5J/0ZH5zkYXyfacYg45tq6wEHoXIgZnZpbxhnsIo/rQ6wABoTEBxieecQxtz0YXYiJU7Jf8P8vd3Qe6+tEOw6Rx82sA9VA1vmEtVNDKcYAYEBIfIABCb3GMVXSdtaxajgJ2i87Oo/1daIFFTbdnVnHqsjk23qdT4VY+xAngAEh8QGGZR553N46UMU19PoQ5291dJ6j9YWiNTFTyKbWQWog5bcrxHrFOh8AVZD4AMMyizmoQpndVjjnZopb32Md51/t8HQHy2tFq44Rx8ysgwzrfGIqppnHqvh7w9w6UADDQeIDDMs84pgb6yAV33A6GMf5L3R1oh6UFkd7DhHHTK2DHFKsYQphzDqfmXWsAIaDxAcYllnEMQfrICPjvOvB+p6uKrr1IRlFe44Rx1xbBxkcIo4xL3BQIdaZdZAAhoPEBxiIMJe999PHglnEMQfrICVNrANAFo4xB/VkPco+s1hn1kECGA4SH2A4ppHHHa0D1XASn9/r6Dx76wtFqw6Rx02tA1X8/aEPsR4ijqHAAYBov7AOAEC0ecxBFcrrtilmZKoPcf5mR+eZO+fW1hcLcxPrALz3R+dczKEz2Sfsh8jjpupHhw+AniPxAYZjEnGM+VqSCnuAHK1jVXelrF+rP+sm0I4/kvTbLxwzUz/22LrVy/uBTayDHFiSBmAAmOoGDMcs4piTdZCKbDD1ZGQKSOVPrAOo4BRxzNQ6yCBmj6SJdZAAhoHEBxiOScQxB+sgFVnRzTrIsNcQkErMDIqpdZDBYUCxniKOmVkHCWAYSHyA4XhpaorUj+ljMfoQ51+2DgBZ+cOIY6bWQQYn6wAq2EccM7EOEsAwkPgAeTlaB6DhTMnran0PxuEvWAdQwSnimCGtSZtaBwBgGEh8gAEYWLnWScQxB+sgxfQYjNfBOoDEsfZlc1gAPee899YxAHhBqJT2o3UcAJ50JxrgZrz3UeXfAIwbIz4AADR3sg4AAPA8Eh8AAJr7S9YBjBlVGgHEIPEBAKC5P20dwMhNrAMA0H8kPsAwTK0DAAAAGDISH2AYptYBAAAADBmJDwAAAIDskfgAAAAAyB6JDzAMB+sAAAAAhuwX1gEAiHKKPO4L60AVt9HqN7JP5paS3hjHgHz8kaTfjjiuD5/RvyDpv444rg+fU4nNmwEkQuIDZMR7v7eOwbmoDdQP1rE65+aW50d2/lARiY/1+16Kf+977zc9iHUWeejJOlYA/cdUNwAWJtYBAIn9VsQxd9ZBDtAk5iDv/cE6UAD9R+IDZMQ5N7GOQdJtxDEz6yAl7a0DQFZiZlAcrYMEgDEj8QGG4RB53Mw6UDHlBOi7qXUAmcYKoOdIfIAB8N6frGMA8Kw/tA6ggmnEMTEjt8QKYFBIfIC8zKwDUNyIz9w6SCCxScQxJ+sgK+hLrJMBxQqg50h8gOG4iThmYh2k+lH+NmWc70SPMl72mxHHHKyDDOYRx5ysgwxmEcccrYMEMAyUswbyMrcOINLMOgDv/Smy9PbWe78PhSNmKqbeTK3jR+/8O9YBJHawDiCYRBxztA4SwDCQ+ADDsZf0+oVjJtZBhji/feGYK+sgK5hJ2od1VnvrYNBPzrmX3vNSfxroL91HpP6M+LyKOOZoHSSAYWCqGzAcp4hjYhoJvdCTDUSHMn0QeThaB1Ch5P2hB7HOIg89WscKYBhIfIDhOMQcVKGx0IoKO9NPLOOsYGYdAPqtQhJ/so5V8e/no3WgFWI9WAcKYBhIfIDhOEQeN7MOVNJ5IHEeIo6ZWAeJPHjvD9YxKPJz570/WgcaGeuZcv8AYpH4AAMRvtzvIg6dWcequIRibh2k4nrgZ9ZBovfmEcfEdAZ0YRZxTF+qGMbEerAOEsBwkPgAw3KIOGZuHWRknFPrIBVXrOCqwroIjNM04piDdZDBbECxxhRh2FsHCWA4SHyAYTlEHPOqBw31mDivnXNT4zhPkcfNjONEv00jjjlaBxnuCzEFUA49iHUeeah5rACGg8QHGJZ95HFz4zgPkcfNLIOssObCNE70XszIxNE6SA2rWMA88ri9daAAhoPEBxiQChXT5sZxHoYQZxCznmFqHST6qcKo5cE6VkV+3ircZ6xjvaOwAYAqSHyA4YnZe2ZhHWRknHPrIBXXEz+zDhK9NYs87mAdqOI+b+aFDcKUPNb3AEiOxAcYnn3EMX1YPxMT51DWI8U0wjBOs5iDrMtDDyyZmEce14dYAQwIiQ8wPPvI4xbEGeUQc5D1xrDorXnEMTGjn32IU+pHMrGIPG5nHSiAYSHxAQYmzL+P2RNk2YM4Y8wt41T8FCTrONFPs4hjDtZBKj6Z2FsHGhnrLet7AFRF4gMM0z7imFc9mO7W+/VIYQrSUDaGRY+EUcCriEMP1rFqIMmEc26huNd0ZxkngGEi8QGGaRd53GIAcV6Fxo6lQ8Qxc+MY0T/zyOP2lkEOLJlYRB7Xh1gBDAyJDzBMu8jjVsZx7iOPWwwgzj4UjEC/zCOOOVsXNtBAkolQgCEm1rsKJfMB4INfWAcAoDrv/ck5917Sly8ceu2cm1k1Erz3B+fcnaTrFw5dWMRXso88bi5paxxrUqGxOXvkn576++ec9Pjo2SnThuo84pi9dZAaTjKx0HBGpgAMEIkPMFw7vZz4SMWoz9I4zq9fOObKObfw3u8sAgwJ2lkvN7oW6nni8yCRmYf/lv9OMijP7Zwr/++d7vdPOuk+WTqGn94nShXW9+yN41xExrmzjDNYRR63tQ4UwDA57711DABqCA3co15u1JwlTa0WLYcG4k8Rh7733i8sYgxx7vRyInn23k+sYizFOtd9MjMt/bw0sjZElwIZ+9J/zRMj59xK0ncRh35uGWvk+7oPcc4Ud5+49d7PrOIEMGwkPsCAOee2kt5EHPqN935jGOdRcY3yz6zWQ1RoyH5RoVR3k3gmKhKbue4Tm5nieu/H4jJytA//PXbxu5Ek59xeL4+cmSbKYU3azxGH3nnvp1Zxhli3GsC9DMCwkfgAA1ahl9S0YeOcW0v6NuLQt977tVGMU8U1Er/33q8Sn3umIqkp/5Dg1HenYvrch5+UCXVISv844tB33vul1YswhM9diHOiuNdTkn5pXXIbwHCR+AADV2E05Svv/dYoxqkG0PMc+Vo2ijG8FjMVIzkzGay3GamziiRof/lv3Qa0c24p6YeIQ80+cyHOk+ISaLOR1hDnWnEJmmkiCWD4SHyAgavQCLNOKvaKa+RbJmgbvVyIQaqwHiKM5sx1n+jkuA5nqO70cSJ0iHlQhXUzZqMTFe4LN977uUWMIc6J4tYqSh1NMwWQLxIfYOCG0nAYQoIWKmD9OuLQJ6e7PUh05mLK2pCcVSRCez2RCFWYlmWdUBzV85HgEOdacaM9FDUA0BiJD5CBoTQeKjTGLBO0k15OVj4kZ2Hq2lxFqet5xGMxHJdEaKciETpWSODNFuEPoZMhxDlRfKeNaYIGIA8kPkAGKqyhkWynkq0Vl6CZ9ZZXqC71dyX9K5JeWcTZkZuKx0+V91S+O0n/WNLvRhxrWaHwqLjfg3VRg7Xi7gfmVecA5IHEB8hEhQa75VSyieKrN5mM+lSY7jYElwX9Cv89hT8fdb+BqFRUPTvFPWV1YfrfpPRX89KfL/82UT5JpNnIaoXRHuv9vSaKH+2hhDWAJEh8gExUHPWxnIazVVyCZtl4PGkYU9Yu+9gcVCQ1H/475JK/pUTpsf8O4fdi+fk6Km60x7rU9lZx9wHTBA1AXkh8gIwMoTHR52l5oRd6Iek/kvQ7Hb80z7nR/SjNXtIptgJZjpxzc328qetU/Rot+geS/nNJuy6nu1UY7ZFsp+LNFLf/mGQ8HQ9AXkh8gIxUTCqSb8RZIc6tejItr5TsLBRXorhND/eaOY45wamqlBDN1J89km4lbdVyElRx6pj1aM9ecb+bO0kzRnsApELiA2SmQlIhVdiPJnGMU8UnaK30+IZG8lJFwmMxfephknOw3EQyV6WqezPZJ0OXJGibujFfoVCAZDvas1D8GjoquQFIisQHyEzFnl/LdTRbxU/Lm6VoqIVG8DL8dF19rNZmmUgvJL0z2e619F5FArRLcD1TxXckmI32VLw3UckNQHIkPkCGKvb+mizErthYe++9XzQ411JFstNlb/8l0dkr7AHT4blRQWlU6PLTZVJ8VjEKtKn7Hqkwdcy6kttG0teRh/8qRVIIAGUkPkCmKlR3SjaiUiPGteITtEoNodCYXalIeLrq0X+v+0Tn0NE5kVhYfD8PP12u+7pVkQBtK8S6UPzUMbNCAWGU7cfIw8328QKQNxIfIFMVG0QmDY2qU18UsdA5NLBW6rbB+g8l/UUWYeenYqW0VKJGgdr4/LQhxHlQ/Eia2RokAHn7DesAALQjjI7cRB7+2jm3MojxJGkdefj1U8c65ybOuWUY5fpR3Vdn+6dVJFvIz9rgnFcqpoT97Jzbh06Mx2wVP5q5NkzMN4pPet6S9ABoCyM+QMbCdK+D4htHVlXeDorfh+XDlLdSsYJVhWtsy9l7PzGOAQlVGO35hyqS3zbdqUggtt770xBGdKXKI8+UrwbQKkZ8gIyFntN1hYdsw7SUrq0qxvivhqpwP6tYI9RG0nMr6RtJn6lokL3kymLUDK1aRx73n3jvnaRfSXrXUizXkr6TdHTO/R1J/2WFx67aeoGeEzomthUesiTpAdAmRnyAEag4omJS7rZixae2XHrVP9psskIRBtOqWUinwmjPJ7/znm2Ka1nQ4KD4+06jyo0AEIPEBxiBUKXqpwoP6XzjwBoLoFO5LCTfPjXNr+IicrOGJtKpUBXx2d93KQlaKT4JSMWyoMFG8R0ZdBgA6ASJDzASYRrWdxUe0vl6n4olb5t6r2JkZxsZ21qM+oxCxUpu0RXISiXWF+omwf/Ce7/v4DwPr3OpapXwTOIEMD4kPsCIVNjoUDJqwLc85e1O96M7x4pxTRQ/6vO9937V0jWgRRVHHmtPCw2L/pdqbyrcf+u9/7dbeu7nrmumYi+r2HV3fFYAdIbiBsC4LFQkNDGuJO27LHYQesT/fAtPfaNi+t7Ue7+uUy43JICbyMO/DteC4VkpfjRmXfck3vtdWNPyS0lvFVdAo4q/Fkphz5O/Qk8I94q94pOeW9mUCwcwUoz4ACNTsbys1EGxg5AkrCW9Sfi0Z0k7FfuXHBPFOVH8qA+LtQemYvn35J+LFkeBblR8DvaJn7cc+0RF0hO7juksaW5RPh/AeDHiA4xM2APn+woPeROmnyUXNh5dq2hspkp67lT0oE+998uUmyFWHPX5ssvediSxVlzSc1YLJaJLo0CfqfiMxo7OvuS1pB/DCNA0ddzBRtWKN6xIegB0jREfYKQqrveREld6CwugN0q7B89/4b3/2wmf76nYj4qbDnXnvZ+2HQ+aq1hYo5PKfc65f1/Sf9bCU79T2pHQrap1XJiUzAcAEh9gpCpO27ponPyEBuZG7ZX2bb0aXcWqVZS3HoAKe850UvSjxpTUqs4qPoebJtdSodrhxa33ftbidQHAk0h8gBGrUYFJkn4VpstVPddERUMr5Tqex3SydqDiiFl0yWN0r2LjvfU9rmp+Lus6q5h2VvmaapStptQ7AFOs8QFGLCQHq4oP24aGWbSwh9BR7Sc90n01ukox1rCucOy2g+tGDaW9dWLcZpb0KJznh6oV4GomPXOSHgCWSHyAkQsNubcVHhKdWDjnZmEK0Xdq3pD7gxoxTlO+VmWhQta7yMNfh+QP/bNV/Htz1WYgNZOe7xX/PnzOpQDC9qUS9jWSHoliBgB6gMQHgMIalCqNp2eTn1CtbSPpJzVfy3OjYmf3f17S+4ox7lreh2il+Mpba/b26ZeQjMZOV3zfcjnomaonPe+896tQKOAzpUmA3kg6huTmsTiXqp70fNP2SBkAxGCND4APalR6+2Q9TZgus1X8JpBPuZO0LDc2a+wVIhWbJLY2xSY0nr+LPPzGez9vIw5UU3HPnrOkWVvrtGomPY8WCQjXtVW1z/FTblR8Bo/huZeqnvRQwQ1AbzDiA6BsoSJRiHUl6Sfn3LI0yvOjmiU9dyoWkE8f9rCH5GWuarvcv1LRgz1r4wXz3m9UNBBjvA4L6WFvq/hEI1np54fqJj0qPgef8N4fQ3L9heLfl095Leln59yapAdADhjxAfCRmqMqkvR/S/pzDU4dXV63ZmOxtWpvIZ6fKjyk9ZLbeFrFKm6tlV9u8D6OroyWcAS2KspWA+gdEh8AnwjJz0HdNZbeq1j8fKwQ40z9Sn7Wim9M36mYOnVKHQee15cktev3b0sbBj+l1emlAFAXU90AfCI0WBaKX7hf162KwgWLqlOJQuNvXjHGS1GGReoLCQUiYqcJXqtohKJDIaHfVXjI25aSnqWK5KuzpD0UF5iqWgXHOkh6APQWIz4AntTiniJnFVPa1oYxJt+IssZoQuubYeKec24n6cvIw1uZqlVzrUzSkcpQAGFT4bWIRdIDoNcY8QHwpJqjKi95r2Ka1zphjKsaD/0hdaGBEMs3FR6y6WCjVehD9b0qDf1lCzFsZZz0SB8KICxUFECoUijkOSQ9AHqPER8ALwqN862a7clzVlEad9dSjAtVq9R18U7F+qJTwlj2ii8nzHqfltUYifsmVOtLdf6Jivdm1RGW1takPYhvrfj1aY8h6QEwCCQ+AKI0qPYmFY3Ov9J2w6jBtLekDbfwWh0rxMH+Pi2x/l2EaWU7Vf/cdJL0lOL8O5K+qvHQG0kLkh4AQ8BUNwBRSnvoVNnn5+JzFdO6Ji3HeFC9qXlJ9/oJr9WywkNehz2QkN5e8UnPWUVRjyRCKemDepz0hP239qqX9Lzz3jPSA2AwSHwARCslP+9rPPyNiopq05ZjPKhe8nPZjHWVKI6dpO8rPOTrsPAdiYQ1NVWSjmQjF+F99KOqjz7eqbukZ6ZiNCx2WmYZm5MCGBwSHwCVeO9PYWH0uxoPfyXp0EY56QcxHlR/dOo759w2xeiU935VMYYfwigBGgrrVt5UeMhb7/0+wXknoXrcdzUefqtivdeho9enaknti29IegAMEWt8ANTWcFF08qICj8Q3Uf11SbcqijEcEsRwVLXpVp2t7chRjZLRSdb1hBGUnept/NvJWpnSXkZ1RnnOKj6z2zZjBIC2kPgAaKThjvB3Khp7hxbjm4T4qvT+X5wlrZtW+AqjOD9WfF2o9FZDjQpuZ0nTpq91mNpWZ5RH6mjaWIPKhxIJOYAMMNUNQCOh93euenv9XKtYV7NuMb5TaFRWWW9zcaVi6tuuydS3MIWqyv4+1yrWQ9U+5xiVqvpV0Whxfqk4QN2k523bSU+IcSvp16qX9HQ2BQ8A2sSID4AkGk4rkxJNLXshxqWqbyB5cVYxOrVvcP6tqo08sT9KpFA046BqDfuvmkzbSjCC0tq+VqUY5yHGOtPvpA6mpAJAVxjxAZBEGFmZqd7IilQkTG2P/mxVlNauMzp1JelH51ztstyhZ79KsYNXKqbp4RmldStVEpDv6yY9CUZQLpXbdm2+JiHGH1U/6fnGe78k6QGQC0Z8ACTXcN2PVDQMlymqbD0R30T1F3g3iq/myBilg59Q8/V8HyoT1jnfXM1GUFovYtBwJEpiPQ+ATDHiAyC50rqfOuWkpaJR+WOqstKPxHcKVbzqjk5d4qs8+lPa3LTKqNOb0HuPkppJz62qbS774VwJRlDetrnhp3NuGtYb1R2JkorEbErSAyBHjPgAaE1omK4lfd3gaZJUVnsmxoWa9Y7fqVgDsat43pmKRnuV8zLyE9RMempVy0s0gtJofVjEa7FS/dLyF9+09TkDgD4g8QHQugQNR6noqV+10XgMC+N3ql+YQZLeh/iOFc67VPViC6NPfmomPZWnb4X3xVb1p0RKLU9tC5+tjeqPQkkdlJUHgD5gqhuA1oXRkKmK5KCuVyqml+1CgzRlfMdQmOFtg6f5UtKhSnGGMCXwq4rnGfW0tw6TnrWKKnFNkp7WprY55+alaW1Nkp7vRalqACPBiA+AToWNHtdqNvojFQ22depGZYLF61LF4geM/MRpUDL9iwq/i7k6/v1XfA2mKj4/dTbk7SRGAOgrRnwAdCqsIZipmALUxNeSjs65dcoCCKEhOFOz0alL8YOo0akw8vOu4jneOOdGs8lpg6Tnq5jGfakwQJPiBdL9CMqL56x6/c65jaSf1TzpaSVGAOg7RnwAmElQ9vriHJ5nk3IEKNHaJKmYQvdibDU2OJVGsMlpzUIQUsQGpYkKcEgtbUhaKlywqnH9DzHKA2DUSHwAmAoNu62KNTJNJU+AEsYXVZ2O5OeT12Om9pKetdIkFO9VJBSnhNc9UbqER2ppaigADAmJD4BeSLS24qKNBGihNKM/dyoaoNtnzrVV9eQnu00nG4wIfvXC67tUMcrT9L2WfAQlTI1cKl3Cc6Oi2uAhVYwAMFQkPgB6JWEvvHSfAG2rlJl+JraJ0kyLkl5oNDdIflrbL6ZLNQs+SM8kPYlKP18kHUFJWLTg4qwi4dk2fSIAyAWJD4DeaaERKBXFA9aJEqC5igZ0k31/Lm5CXPtHzrOt+Rq8OM2rz1Jfd/h9rdWsNPXFrYqE9ZDoWucqEv0UUz0vmNYGAI8g8QHQW4kbrBc3KqbA7RLEt1Ka0tyXuD5JgMII2Lc1nm9w5a7DiNpO9X7fnyQ9id8/UWu0KlzrUkXCkyJ5vrhRkZQdEz4nAGSDxAdA7yVck1F2p2LNTqN1QKGxvlG60akbFVPztg+uv860rxsVU99qX19XQhGDraonAp9UU2shqXinYtrYqeE1TkNcS6VJli+eHDUEANwj8QEwGIlHWMreSdo1GQVqYXTqoyIIDZKfOxXJzyFRXMk1KBzxUUGHFhLkJIUBQlxLpR25lCIKZQAA7pH4ABiUFsr8ll1GgWoXQ2ih8f1hZErSXPUThF4udA+bctYpFnEOr8dR96MoKV/zRglFGMFaKv3oTpL4AGCMSHwADFLLCZBULGLfqBgJOvUgtrOKpOe/l/R3az5vb9b9NFzPcyvpb0r6W0qbWJxVTH1c17ymqaRFiCnl2p0LEh4AaIDEB8CgdZAAScUGlTtVTIJKsdUpTvCc/0HS70r6vRqPvVUx9e2Y/mWKfl3mKl7POr+vW0l/IOmvJg7rrWqs9wq/46XaS3YkEh4ASILEB0AWSg3QldIWQXiochLUUnluSfpHkn6zxuPMpr41qFInSX8i6bcSh1S5zHlpZGeh9Ot2ykh4ACAhEh8A2WmpVPBjbnSfBB0j4pqqnQSoriTVymKEa9+p/d9JlWuPTnjCmp1F+OnifUWVNgBIjMQHQLZa2hzyKXcqGvb7l6rD9SwBulNRDnrf1glarMZXR1TCE0YQ5yoSnbnaHUUsx7bpcwU+ABgyEh8A2Wtx/5TnXEaD9k81ZHuWAL2tu6j/KeH6tmp3OlisFxOekCjP1c2ozkWS/aQAAC8j8QEwKh1Ogys7S9qHn8PD0ZUeJUC3KkZ/Dk2fqCejPGcVyeejCU8p0Zmr++TsvYqy6Tu7lwcAxoXEB8AoGY0Cld0oJEIqkqFjRxXqYtSqcCb1ZpTnrKIU+YdrCHHNJc3Cfy3WGjXeJwoAUB+JD4DRc84tVCRAXawFespZRRK0l/S/SfrnJP2H6mZtyWMqr/0JFdtWskva7lSMMv2+pD+n+yRnZhjTZdRpS7ECALBF4gMAQRhxWaj7qXDP+V8lTST9RaPzv1j5LUwZ28o2Sfs/JP2G+rGeSKq59xMAoD0kPgDwiNJeLUv1JwmyclaxTmZT/svwGm1kO1LWJyQ7ANBjJD4A8AKSoA/+QNK/q2JK3kr1NyLNCckOAAwEiQ8AVFCaDrdQsX6kD3vToDuXNTs7FaXKT9YBAQDikPgAQANhfctCdpXC0L5b3Y/qHKyDAQDUQ+IDAImUSiZffqwW+6OZO4URHTGqAwDZIPEBgJaQCA3Gre73VNqzxw4A5InEBwA6EtYHzXW/v0xfSi+PSXm/pL2KzWNP1kEBANpH4gMAhpxzMxWJ0OWHZCidcpJzUJHkHK2DAgDYIPEBgJ4JU+Smuh8dmoiE6CU3ko7hZy9GcgAAD5D4AMBAlBKimYpkaB7+aSxJ0Y2kk4rRm2P4IcEBAEQh8QGATITS2tJ9YjQJf5aKhKmvxRVuVSQ0UpHUnHSf2JwoIQ0ASIHEBwBGJhRZmD346/kzD5lL+mck/VkVSclJ0m9K+vMq1tGcdT8S85hP/s17v7d+HQAA40LiAwAAACB7v2EdAAAAAAC0jcQHAAAAQPZIfAAAAABkj8QHAAAAQPZIfAAAAABkj8QHAAAAQPZIfAAAAABkj8QHAAAAQPZIfAAAAABk7xfWAQAAAACAJDnnJpIWkuaSZpJePXLYjaSDpL33fhf93N576+sDAAAAMGLOuamktYqk56rCQ8+SNpI23vvTs+cg8QEAAABgxTm3lvTtE/98VjG6c/H6meOWz40AkfgAAAAA6FyY1rbXp9PZbiRtVUxlOz7yuKmKkaHlI499571fPno+Eh8AAIB0QqNsKkne+711PEAfPZH03Ehaee8PFZ5nrmKqW/l5biXNH059I/GBpA9vmomKRWSX/yr8+VXEU9yU/rwP/z1IOnHTH7ZwY5qp+BIv/0jx74+n3Eo6lf7/pPvh7GP4OVW5AQJAG5xzMxX3vpk+/p6cqdp6BOn+3ndS+K4M/z28tEYByMETSc833vtNg+fcSPq69FfvvfeLj44h8RmXUiN2Hv47k3TdwanvFG7qKoYt99avBT4Veinnun9vzFT9C70tdyoSob3uGwhH66AA5CckOXPd3webdPBUdVnPsNf9d+bJ+jUBUnLO7SR9Gf73rGJ05pDgeZeSfij91Vvv/frDv6vovVhavwB1lS8GjwujOQsVN/Eub94vuVFxY9/Ro2+jlOhcfrpIglO6U/Ee2qt4H53CdV2uZ5C6uK+FTpCV9bW24H+S9Jetg8BHet/ZVVovMA8/fenwubhVuNdVKd0L9NEjycmvyu9r51zMqMylQ33nvd8+eP6VpO9Kf/V5uZ05l+SH+uO9Fz+f/qi4gW9VDJ+b/54ifo4h3oX1a5f7j4rOjlW4YVj/3lP/bMM1rnsQS6/va0N/jZ742WV6XUP/WVvf9574DMxUrAs49uA1qvNeX0qaWL+OFV/zfQ9eu5Q/S167qJ/9g2spf+bWj1xr1ec/PPwshM/IJ+f/DSEbzrmZc27jnDtJ+rWkN+pfr9VTrkO8v3bOHcN1TK2DyoVzbuKcWznnDpJ+VtET8so6rhZMrQMYgkxHe84a8OwFdMM5Nw33wqOkn1SsB7i2jquGL1X0mP+xc27nnFtYBzRSS+sAhiaM9lw+c3f+5RkON4/8nB8c80pFJ0bZqnTc6zB9lcQnB865ZWjQXm7iQ0l2nnIdruNn59w+fEhQg3Nu7pzbSvpj5ZvsoLqVhn+feGjtWQeBJ5TuhZeOnyEmO0/5UvedhuvQsYFuvA5TqxFvVfrz+qWDvffzR34mkn4p6V3p0MWDxx1VzCT66LwkPgNV6sE/quj1ybVB+1rSD+GGvrQOZihKyfCPKkbSAEkf1jKsrONI7MY3qASEfI3sXnitYgPIP3bObZk10Zm1dQBDEd6Tl/bq2T9Ym1OF9/7ki7167sJfPdaZtyn9eS6R+AxOSHjWKuZH5tZr9ZxrkQC9KHzJH5V3Moxm1spvtGdpHQD6hXuh3qiYNUEC1L7XvMbR5qU/7xI95+mpfwijPrfhf6+dc1MSnwEJDf6Dih6d3BousUiAHvHgS34syTAqCl/OufV6v/WUNUcQprQdxb3wopwATayDydjaOoCBmJb+vG/yRKWBgA8jSE8cWj7PjMRnAELRgr24kZddEqD9ZcHaGIUv+b14byDO2jqAxGIWxmIEQtGCvYopbdwLP/VG0jE0FJHeG0Z9osxKfz7GPMA55x/7UbF2+dvSodsnnuJUPj+JT4+FbHajomjBa+t4euq1pJ9CFbiJdTBdCe+NrYoved4beFFYgJvbaM/SOgDYC435n8W98CVXkr4NMybm1sFkaGkdwABMWnreWz3dsbcv/w+JT0+Fm9JBRXUzvOxrSYcx3MxD2dKj8mvEol1r6wASe+d7vikm2hVmQxz1ca8vXnYt6cexdRh2YNXy63mwvsCeOasobf2N934WW9WTxKeHQu8Vw/XVXW7ma+tA2hBGeXYq9mga6xov1BA6BHLqDT8rv8p0qCDc538S35NNXDoMZ9aBZOJK7Y76nKwv0OIavPfu8qOPy1cfQmnrzQtPMS//D4lPj4SG7V70XjX1rXPukFNPVmi4HlXs1wBUtbYOILEle/aMU1jLcxDfk6lcq5guvrIOJBMr6wB67lD687TG49elP8fuoTQp/XlP4tMTocflqLx6ZS29UrGQc2YdSFOlEUBGeVBZmBqZ033lxnu/sw4C3StNAR9jeeq2feec2+XUYWjkmoqzzzqU/jyv+uBQwfNt6a+2EQ8rn+dI4tMD4UPyk2jYpnaloidraR1IHaWpbfRsoomNdQAJncUC4lEK93E6gNr1paQ91ckaW1sH0GOH0p8XNZ9jo/vS1c8mmg82TL3z3pP4WAvDyz9Yx5G5H0J1vMEIH9a9mNqGBsIXQk5rIDbs2TM+oYIl35PdeCXW/TR1PYZCS3U82FD0qk7HdJjmvC791fqZkcrycTuJNT6mws38O+s4RuLr8Hr3XvjCOYjpHGhubR1AQrfs2TM+4b5NBctuXakY+ZlbBzJga+sAemxT+vO6zhOEggZ34X+v9cjaqkc27N5KJD5muJmbeNP35Cd80ezFdA40FNaG5TTas7IOAN0pFfvhe9LGlYoqqUvrQAbqNaNmj/Peb1VKWhpU4i0/7rFS4tvSn2+89weJxMcESY+p3iY/zGFHKuELYGUdR0Lfs2fPeIT37155FeUYqh9IfmpbWQfQY6vSn7+tOeVtq2IfH6loN20u/xaSqfL948P5fmF95WMT1pqQ9Nh645yT935pHchF+NAzhx2prJRPAn0npo2MzUZM9e2TH8J35tY6kIF545xbsy7xU977nXPuve7XMW+cc6dSxc4vIp9qqfuy2CfpQ3uqXBTq7WW0R2LEp1Phl/G1dRyQVNyQNtZBSB/KDZP0IIkMR3tW7NkzHsyI6K0NU7dqWVsH0GNLlQodSPr1ZT8p7/3+8vPcE3jvj6VjD48UQnn3cG0oiU9HaNz20tfWQ/jhi2Rr/UIgKxvlM9rznj17xoMZEb12KXgwsw5kYBbsjfS40KE1133yIxX7SVUurOGcmzvnjvr4/nGrRzoBSXw6QOO2136wqlwT3hd75dNIhbFHqtgM2Vl5jVzhGcyIGIQrSVsa8pVcifvYk0rJz03pr1+rKKyxd84tn9pXyjk3c86tQsLzoz4u5vPOez97bLYAiU/Lwg1iKxq3fbbresO28L7YifcF0lpbB5DyWpgbPw6hE4gZEcPwSmE/FERbWQfQZ977k/d+Lumt7jcmlYoE6AdJPzvnfEiELj9e0k8qtoQpJzxnSb96bg03iU/7tmKRZt9dqfsb+U55lRqGsdB4zGW05zbs04DMlSq4YTheNyhBPEa1Nuocm7AWZybpnT5OgC5el34eOqtInKYvTY8m8WlRWKT1ZdPnQSdedVXsIJyHMq1IbWMdQEJL6wDQma0Y+R6ib9ngtJK1dQBDEIoVLFVUavtKRRJ0+8ThN5K+VzHCM/Her2MK4VDOuiVh6tTaOg5U8rVzbtfmfiGhyAXz2JFUaIDkkkx/VHoU+aJzcPB2zrkpVRejXDvnlpQEjxPeU1u1sD6eEZ/2bEUv1hC1tnAzJMNb6wtEltbWASRyp7xGrvAEOgezcCW+06pYWgcARnxaEXqxcul9HZtrFV/GqxaeeyuS4TtJx2f+nc9NRZmN9izpPR6Nrbgf5uBL59yCsvNRXjvn5m3OKsHLSHwSC6MFa+s40EjyKW8jTYZvVSxa3ks6xk5fCj3BMxUlLheiCMRLttYBJPKeBsE4hIXeY7sf5mzjnNvTaRFlJYp5mCLxSW8jerFysFHR+G5sZFM6blU0xHd1SxGHxx1VVL5bhWply/DDZ6skNCBzSAzPYhrIKITOwY11HC277ElykDRRsVB7qjw+q4+5VtGgX1sHMgBfhnVRR+tAxoo1Pglltnlg2XtJ30j6QtIvvffOe+8kfa77qhvnBs/fR68Slp/cKP8G+ztJX4QNwzYpb+re+4P3fqWi4fCwzv/Yra0DSHUd9BaPxlp53g/fq6gu5bz38/Cz8t4vw5+nkj5T8V16Zx1sC77tej+8AVtbBzBmJD5pba0DSOydpM+894vQmP1oKDs0SLel0oO5NUrXTZ8grL/IuWrRjYr3yLLtaUphk7O17t9roxamT+bQg3zDnj3jEBrGuVW1vFXR6fPiOpdQqncTkqDcvi8lGvSx3pAk2iHxSSSzBcZnFTfyZWzP/YNG6U3MYwbgOjQum9haX0RLLrsjz7sesi+91z7X0/X9s5bZWsKldQDozNo6gMTehVHufdUHhnvYXHmN/tCgj7e0DmCsWOOTzto6gERuJS0arM84SZo757bKY9rfSjXno2e0/uKh9+pB9a1QLGEWdhD/1vpF6dhKeUwXettC4rxVN4uHZ5K+6+A8bblVO9UrH3PMcCr4V033ZPHeH8Iaxr2kV9YXlMhaNOpjrJxzG+vv0TEi8Ukg3NBzGO05S5qn+CB675fOOWn4X3S1Nh3LeAHvN32bluS9Xzvn9iqKIWQvvLdW1nEkcBd6vZMqFcdoVbi/Ddmpyyp6oTMsF+9SbUTpvT+FGSNH5dGZ8cY5t2bx/ouuVCSIG+tAxoapbmmsrQNIJEnSU7JSHlOR1jWvPYcvsbKv+pb0XIQG3FxFFaXcrZXHe2tpHQC6EZL1oXeCXdyEda3JhO/dhfWFJbS2DmAgVtYBjBGJT0MZ3dDfxu6zEivczJfWF5bAtXNuUfExOVx3WeNpHW0rVX/LVkaLw9+xZ8+orKwDSKS1suvh8/C99QUm8ia0jfC864TVYxGJxKe5pXUACbQy5UT6sA4jhwpcy9gDM1zb0/ukZ0TW1gEkcFY+DWHEWVoHkEjSUv2PWCufSm9L6wAGYm0dwNiQ+DS3sg4ggWXLz7/R8G/mX1aoVrO2Djahb0h6+iGjxeHmhTHQnTBankNH0Fktr8cIn4uV9YUmkst1tO06rPGKcbIONgckPg2EaixDv6HfdrH/ivJYwLd46YBwAxv6e+LifV/X9IzUxjqABG5e2usE2VlaB5BIJxW4QkfT0DsKpaJBP7MOYiDWkccdrAPNAYlPM0vrABLYZHaeNi0THTMEdxldy+BlshFua+sj0E9hncfQ37cXm0zP1aaldQAD8ZoksTskPs0srANo6NzVNKbQU/bO+oIbevXcdLeMCl1ITEfqm7V1AAm0vT4C/bOwDiCRdx3fD7fWF5zIwjqAAVlZBzAWJD41ZTLNbZf5+dqwqPlvQ0LFrR4Joz1D3yfstq0CKui1hXUAiey6PFnoILixvugEmO4W702FdcRogMSnvoV1AAnsujxZmNs/9LnLy2f+bWEdXAJn5TG6kJO1dQAJrKwDgIm5dQAJnI3WpVmcsw1L6wAGZG0dwBiQ+NQ3tw6gIaub+d76wht69dj+BBnNZWc6Uo+E0uhDH+35nhHE8QkjlTlstLs3Ou/O+sITmVsHMCAL9j9qH4lPfUNvjOyNzruzvvAE5o/83cI6qEQ21gHgI2vrABq6y+AaUM/cOoBE9hYnDR1Qd9YXn8ArGvPRrsToeOtIfGqoUHO9zw5G591bX3gC88i/G5quF/DiGZlshLviPTVac+sAEtmP9Nwpza0DGJCVdQC5I/GpZ24dQAJ7i5OGXqyhr/OZP/J3C+ugEthYB4CPrK0DaOg9e/aM2tBnRUjFlPCD4fn31i9AIjPrAAbkKnR6oSUkPvXMrQNoynjO/cH6+ht6Vf6fULVm6HPZb42/4FHinFtr2KM9Z9FzOVoZVfI6jPz8qcytAxiYtXUAOSPxqWdmHUBDt8bn31u/AE09mO44s44nga11APjIyjqAhtYUyRi1mXUAiewtT55RZ9TMOoCBuWbUpz0kPhWFRXpD790/jvz8KUxLf55bB5PAzjoAfGTI95hb7/3GOgiYmlkHkMjROgDZd1SmcMUeNZUtrQPIFYlPdTPrABI4GJ//aP0CJDAt/XlmHUxDd/TOI6GldQAwN7MOIJGjdQCSTtYBJDK1DmBgXmdSSKt3SHyqm1kHkMDJ+PwH6xcggXnpz6/qPklP7K0DQDbeZjQ9B/VNrQNI5GgdgPK5P8+tAxiglXUAOSLxqW5iHUACB8uTZ1LediJls4h3bx0AsnAnKgOiMOTCHB8wEg5jXzJFMD0Sn+pm1gFkYugbs11GeSbWgSRwsA4AWVhm0qmBBjJqqPVl24WDdQCJzK0DGKi1dQC5IfGpbmIdQAIH6wDUjykEKcytA2iKqUlI4L1xiXz0x9Q6gEQO1gEEJ+sAYOpNKKqFREh8qptYB9AUvbJpZLLwcOgjb7B3FgUNADxvah3AgK2sA8gJiU91Q1/IjrTm1gE0dLQOAIO3pjMFJTPrADJzsg4gkSzWfRlZMeqTDokPrBytA4CkfL5UYeOGPXvwwMQ6gJwwFRkq9nVbWgeRCxIfWDlaB5DAxDqABA7WAWDQ1tYBAC3ZWwcAlKysA8gFiQ9Q30zMW8a4La0DAIARuBb32yRIfMbn1jqAzDBvGWP2JpMiHwDQd2+sA8gBic/4UJwBQEob6wAAAIhB4gMAaOKVc25lHQSQ2NQ6AADpkfjAytQ6AEii9CzSWFNuFZmZWgcgSXyugLRIfGBlah1AAifrABKYWAeALFyJKW9AG2bWAQA5IfEB6jtIurMOoqGZdQDIBoUOAOTuRsP/3h81Ep8Rcs5NrWPIyNE6gIaumEqBhDbWAcDc0TqARCbWAaC3ttYBoD4Sn+rO1gEkMLUOQIw09MncOgBkg0IHOFoHkEhfKqDOrANI5MY6gIQ2yqMtOEokPtUdrAPIxJV1AAmcrANIZG4dALJCoQMgnYl1APiY9/4kaWcdB+oh8RmnueXJc5lq570/SNpbx5HA3DoAZIVCB+N2tA4glZ6sWZtaB5DIyTqAxNbWAaAeEp/qDtYBZGBqHQA+8iqXZBS98cY5N7MOAt3z3h+tY0hoYh2A8vm+PFgHkFJ4n+c0fW80SHyqO1kHkMDc+Pwz6xcggcsNb28dSCIL6wCQnY11ADCTS9WrmXUAkl5bB5DI0TqAFqytA0B1JD7VHawDSGA68vOncAr/PVoHksjKOgBk57VzbmkdBEwcrQNIZGZ58sxG4o/WAaTmvd8rnyR/NEh8qjtZB5DAtfHi45n1C5DAQcpqWsd1T+azo5DLFIoNhQ5G6WAdQCKzkZ8/pYN1AC1ZWweAakh8KgoZfg5mhufOYej+WPpzLo3UtXUA+GBtHUAiVxldC+IdrQNIhE7CNO5CJbQc7URp60Eh8ann1jqABOYWJ81owfPhiT8P2WtGffohdLDkklB/ndHnHnEO1gEkNB/puVM6WAfQlpDQbazjQDwSn3oO1gEkMB/ZeZMKpawv9tbxJLS2DgAfrK0DSGhjHQC6k9HMCMmuk3CiPGZHSHl9Rz5max0A4pH41HOwDiABqxvq3PrCE3jYE3+wDiih1865hXUQyG7Uh0IH45PDzAjJruLl3PrCEzpYB9CmsNb3nXUciEPiU8/eOoAUjBq4X1pfdwL78v+Em14uX/ISC9L7ZG0dQEK8r8Zlbx1AItdGUzUX1heeyDmzEcCnbKwDQBwSnxrCNKccFrMtujxZRiMJ+8i/G6pr5dXgHqzMRn0odDAue+sAEloanHNhfdGJ7K0D6EJoF+Zyr84aiU99e+sAElh03AO7tL7gFJ7ovdpax5XY1xklqkO3tg4goa8z25sET9tbB5DQosuThWmhV9YXncjeOoAOba0DwMtIfOrbWQeQwJU6uqGHBCuHaW7vH/vLjEYBy7Y0Uu1lNuoj0TgYhVDtKpf37XXHa9RW1hec0M46gK5477diQ9PeI/Gpb28dQCKrzM7Ttv0z/7a1Di6xK0k71mX0wto6gIQooDEeO+sAElp1cZKwpcAr64tN5DajTb5jbawDwPNIfGrKaEH7q7b3bgkN55X1hSaye+bfttbBteCVpD3Jj60MR30odDAOO+sAEnrVUcK+tr7QhLbWARhdc26zP7JC4tPM1jqARNYtP/9KecxXvnmu9ypMd8txmPuVimlvE+tARm5tHUBC1xp4Z8hIKlU1klEH4UWrCXuYTpfL3j1SPm2kaGGK5846DjyNxKeZrXUAibx2zq3aeOKwRqSV5zawjThmbR1kS74UIz+mMhz1+ZY1ZKOwsQ4godYqXoZ768b6AhN6H5KAMVpbB4Cnkfg0ED7U75s+T0+sW2qEbJXHaM9Zcb04O+U7zH2Z9ja1DmTE1tYBJLa1DgCt2ymve2JbFS93yuO78mJrHYCVMNKZS9swOyQ+zW2tA0gk+UJ259xa+Qzb72J6r8IxG+tgW/RK0qHtdWF15Z6UZTjqQ6GDzGU69WebclNT59xW+XxXStKd935nHYSxjXUAeByJT0Phw53Luo5XSvRhDXOVv7W+oIQ2FY7dWgfbsitJP4bEthecc1Pn3E75v/ZSfqM+FDrI38Y6gMSuVIx+z5o+UUh63lhfUGJr6wCshU6qnNa3ZYPEJ421dQAJvXHONRr5CeuFfrC+kIRuQuGCKGGY+5110B341jl3tBz9cc5NQgJ2UB77RL0ow1GfwRc6wPMy3dX+StJPdTuAQmfNQfklPeewnw3yS/izQOKTxk55zWH+UjWmM5V63b+zvoDE1jUes1Je74mnXKsY/dl3mQCFhGepIuH5VnnNjY+xtg4gMQod5G9tHUBLLh1Ay5iDw/fkWtLPyme/nrKNdQB9ERLAMbQDBoXEJ4FM13WUG7SL5w50zs2ccxvl2et+U6dsbabviee81v37ZdnWSUKjYSPpqGJU8dr6wi1kOOojjevzMjqZvmcvriX94Jw7Oee2zrmVc25e+lk459ZhhOdn5TUNvOzOe7+2DqJnNtYB4GNO0lzSj9aBNPDWOoDg70n6H5V3z/ONigbnMfz/XNJUeTc+v6i7X0eYLnhQ3q/PU86S9pefKlMFHwojSXNJC73cQ3rjvZ+HHtXBNi689y7ydRnyvfsxtT9vFpxz3jqGBm689/MuT5jpexb3vnppmptzbq9hF3Ko9LkJ7YA/tg66Bzq/3zzlF9YBJNCXxs1exfSmnNa2PPRaw75hVVVrtOfCe38K651+bX0hBq5UjP59KUnOOakoAnKUdFKRED5nLmmiPKeCJOG93zvnbpTXZ3KrojMFGcr0PYvCLWt7PhXaAe+U31quwcoh8ekN7/029DSPsYc/R6umT+C93/FF/8G17j8buU2JtLJWXj3o1865NdNlsraS9JN1EEhuZR1Aj21E4tMbrPFJb2kdAJL4vsn0rAeWYoEjWpDpuokVhQ7yFe6r31vHgaS+H9IU1a5lWtVwsEh8Egsf/jGUMs7ZWQkrEIXy1smeD3hgbR1AYldiQXDu1spn/7uxu1N+96A2bKwDQIHEpx0r0cM/ZMtQlS0Z7/1G0nvrC0N+Mh31+dJyfyi0K9xfl9ZxIInk35c5ymyz+0Ej8WkBN/VBexduUG1Yihsf2rGyDqAFW+sA0J6QsDPlbdiY4lbNxjoAkPi0JjSeuakPy51abECGhHhhfZHIT5hDntsU2+tQLAb5WovOoKG69d6vrIMYmK2YDWSOxKdda0m31kEg2qLtIfvQQP3K+kKRpbV1AC1YhX0wkKFSZxCNwWE5q9hyABWE9/vWOo6xI/FpETf1QfkqYRW3Z4W9DhgNRFKhiEZuoz4UOshcuO+urONAJXPW9dS2sQ5g7Eh8WhYaIwvrOPCsd11vvBamCOTWSIW9tXUALXhDoYO80Rk0KJ11EuYo0w6qQSHx6UBY/Mf0pn56771fWpw4nDe3alwwlPGX6sY6ALSLzqBB+KrrTsJMba0DGDMSn46Em8Vb6zjwkVvZV99biHVgSGttHUALXjnnVtZBoHUrcT/sq+9JetIIneG8z42Q+HTIe78WPVp9casezFMO55+LmyASyXjUZ02hg7xxP+ytd1RwS25jHcBYkfh0LExvyrFRMiS9SHouSl/2vC+Qyto6gBZQ6GAESH56563VdPCchdEzSrkbIPExEG4iLOS00auk58J7fyIpRioZj/pQ6GAESH5646swUwXt2FoHMEYkPkbCsDEFD7r1Xj1MespC8sNaMKSwtg6gJRvrANC+UvLz3jqWETqLQgZd2FgHMEYkPobCTeUrsc9PF95571vfoDSF0MPG+wKNZDzqQ6GDkQgj4Qvl+T7uq7OKDsKtdSC5C+0R3tsdI/ExFm4uczHXs01fDW2Ocul9wVQPNLG2DqCt66LQwXiE+zczJNp3I2nKPj2dWlsHMDYkPj0QbjIzMaSf2p2kz4facxXeF3PRI4SaMh71uRINhlEJ9/HPRSdhW95673s9FTxH4R7Nfn4dIvHpidKQ/jfWsWTivaTZ0HuuSkUPfiWmvqGetXUALfnaOTezDgLdoZOwFXeSvqCIgam1dQBjQuLTM977jYpeLaY41XOW9KuhrOeJ5b3fSZqKL3xUlPGoj8Ti4NF50ElIZ1Az36voINxbBzJm4fVnJLMjJD495L0/eO9n4sZe1XsV85N31oG0ofSF/ytxk0Q1a+sAWvLaObe0DgLdC52EM9EZVMetilGeVU4dhAO3tg5gLEh8eqx0Y8+1tzaVy1B9VqM8TwmJ3UxF2WsSY7wo91EfCh2Mk/f+GDqDvhCdQTEuZaoZ5emfnfg+7wSJT8+FG/tSxY2dBXAfu1NxE5+O7SYeRn/WKqa/5dqgRVpr6wBaQqGDkfPe7733UzFL4ilnFR1l06EW+8ld6LTdWMcxBiQ+AxFu7HORAElFwvNWxdzkrXUwlkrFDz4TCRCekfmoD4UOcJklMRWj4RflhGc9hhkRA7e1DmAMSHwGZuQJUHmEh5t4SWlk8DPxpY+nra0DaNHGOgDYezAa/lbjnAJ3p2L0i+/KAcm8c6o3SHwGqpQAfaaiMkvODd33KtbwMEz/gpAArVV86X8lqgOiJPMvVgod4INLAhSmwH2lcXQUvldR1XTqvd+Q8AzS1jqA3JH4DFxo6K689xMVN/dcKtzcquix+mUoWrC3DmhIwpf+NlQH/FxFcpxzz+dl+uPSOpABWFsH0CIKHeAT4V44131HYU73wst35Wfhu3JnHRDqC22dMSTpZkh8MhJu7gtJv9R9EjSkkaAb3d/AZ/RYpRHKo69Cz2dOSdCNimTn89L0x6N1UH2X+ajPlaSVdRDop1JH4VTDvheWk53Ld+XROigks7UOIGdO0lzSj9aBZOCLvo5KOOfmKn7Pc0mvreMpuZW0v/yQ5HTLOTeVtND9e+PKOqZn3Ek6hJ/9S58159xa0rfWQdflvXdtPn/43f9sfZ0t+qyLhqBzzltfaAM3YRRk9MLnYa77+2Hf7oW3Ku59Ow38u9I5t1e/2iFVdfK5cc4dJV1bX2xCvbnfOO+HfN9GHaH60cOftm/0N5KO4Wcv6TDkm3eOSl/+M3X3vnjoRtJJxZf8UdKxTodCuJZpx7En09dOFGAMSvfCy39n6u5eeKvi3ndQht+VYR3e1DqOmiaS5L1ftX0i59xCxfsuF8e+rNEm8cEHYWRIKm70euTPLzmoaLSW/5zVTXtswnqJmYob/iz89eX/Vfr/xxoFt7p/P1wc9Ol75OS9P1hfKwA8J3xHTnR/L5yX/nki6dULT1Feu3EMPyeFeyH3QaB9/z8HTqR6lJK8XgAAAABJRU5ErkJggg==' height='42.30000000000001' width='97'> </h4>"

                                                                                const popup = $("#popupContainer").dxPopup({
                                                                                    title: atitledtl,
                                                                                    width: '1000px',
                                                                                    height: "1000px",
                                                                                    position: { offset: "0 -20" }, //{offset: "0 -180"},
                                                                                    //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                                                                    visible: true,
                                                                                    fullScreen: true, //false, //true,
                                                                                    showCloseButton: false, //false, true //iData.ReqDate
                                                                                    showTitle: false,
                                                                                    dragEnabled: true,
                                                                                    closeOnOutsideClick: false,
                                                                                    resizeEnabled: true,
                                                                                    //shadingColor:"rgb(190,190,190,0.9)",
                                                                                    //toolbarItems: [{toolbar:"top", html: "<span id='popupexit'></span>"}],
                                                                                    //toolbarItems: [
                                                                                    //    {toolbar:"top", html:"<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"}],            
                                                                                    contentTemplate: function () {
                                                                                        return $("<div />").append(
                                                                                            /*
                                                                                            $("<p><div id='form'></div></p>"),
                                                                                            //$("<p><span id='asave'></span></p>"),
                                                                                            $("<p>DETAILS</p>"),
                                                                                            $("<p><center><div id='detail-dxDataGrid'></div></center></p>"),
                                                                                            $("<p>ACCOUNTING INFORMATION</p>"),
                                                                                            $("<p><center><div id='ACCChart-dxDataGrid'></div></center></p>"), //#ACCChart-dxDataGri alastLine
                                                                                            //$("<P>width: 320px; padding: 10px; border: 5px solid gray;margin: 0;</p>").text("PLEASE ATTACH YOUR BILL WITH THIS COVER PAGE"),
                                                                                            $("<center><span style='font-size: 20px; font-weight: bold; color: black; border: 5px solid gray; padding: 1px 10px;'>" + aWarningMessage + "</span></center>"), //.text("��س�Ṻ ����� �Ҿ�����Ѻ�͡��é�Ѻ��� | Please attach the receipt with this document."),
                                                                                            $("<p><div id='alastLine' style='padding-top: -10px; font-size: 9pt;'></div></p>"),
                                                                                            //$("<p><div id='account-chart' style='padding-top: -10px; font-size: 9pt;'></div></p>"),
                                                                                            //$("<p><div id='line-signature'></div></p>"),
                                                                                            // $("<p><center><div id='username'></div></center></p>"),
                                                                                            // $("<p><center><div id='password'></div></center></p>"),
                                                                                            // $("<p><center><div id='OTP'></div></center></p>"),
                                                                                            // $("<p <div id='popover1'>Please get OTP from your register e-Mail, put here and then press [LOGIN]</div></p>"),
                                                                                            // $("<p><span id='print'></span></p>"), 
                                                                                            // $("<span id='popupexit'></span>") 
                                                                                            */
                                                                                            $("<div style = ' float:right;'>" + aheaderhtml + "</div>"), //margin-left: " + atopmargin + ";
                                                                                            $(" " + arlineno(4) + "<b><div style = 'font-size: 22px; margin-left: " + atopmargin + "; text-align:left; border-left: 10px solid grey;  border-bottom: 2px solid grey;'>" + arspace(1) + atitledtl + "</div></b>"),
                                                                                            //$("<div style = 'margin-left: " + atopmargin + "'><centr>" + aheaderhtml + "</center></div>"),                                    
                                                                                            //$("<span style='float:right;'><div id='popupprint'></div></span>"),
                                                                                            //$("<b><div style = 'font-size: 22px; margin-left: " + atopmargin + "; text-align:left;'>" + atitledtl + "</div></b><span style='float:right;' id='popupprint'></span><br>"), 
                                                                                            //$("<p style='margin-left: " + atopmargin + "; text-align:left;'>REF.NO: <b>" + aaiHeadRef + "</b><span style='float:right;'>DATE: <b>" + aSubmitD + "</b></span></p>"),
                                                                                            $("<p style='margin-left: " + atopmargin + "; font-size: 18; '>REF.NO: <b>" + aaiHeadRef + "</b>" + arspace(10) + "<span style='float:right;'>Submitted Date: <b>" + aSubmitD + "</b></span>"), //style='float:right;'
                                                                                            //$("<div style = 'font-size: 15px; margin-left: " + atopmargin + "'>" +  arectanglehtml  + "</div><br>" ),
                                                                                            $("<p style='margin-left: " + atopmargin + "; font-size: 18; '>Pay To: <b>" + aaEName + "</b>" + arspace(10) + "<span style='float:right;'>Dept.: <b>" + aaDept + "</b></span>"), //style='float:right;'
                                                                                            //$("<div style = 'margin-left: " + abodyleftm + "' id='form'></div>" + arlineno(2)),
                                                                                            $(" " + arlineno(1) + "<div style = 'margin-left: " + abodyleftm + "'><b>��������´ - DESCRIPTIONS</b>" + arspace(1) + "<span style='float:right;' id='popupprint'></span></div>"),
                                                                                            $("<p><div style = 'margin-left: " + abodyleftm + "' id='detail-dxDataGrid'></div></p>" + arlineno(2)),
                                                                                            $("<p style = 'margin-left: " + abodyleftm + "'><b>F&A Use Only: �����ŷҧ�/� - ACCOUNTING INFORMATION</b></p>"),
                                                                                            $("<p><div style = 'margin-left: " + abodyleftm + "' id='ACCChart-dxDataGrid'></div></p>"), //#ACCChart-dxDataGri alastLine
                                                                                            $(" " + arlineno(1) + "<span style='font-size: 12.3px; font-weight: bold; color: black; margin-left: " + abodyleftm + "'>" + aAlertMessage + "</span>" + arlineno(2)), //.text("��س�Ṻ ����� �Ҿ�����Ѻ�͡��é�Ѻ��� | Please attach the receipt with this document."),  border: 0px solid gray; padding: 1px 1px;
                                                                                            //$("<p><div id='alastLine' style='padding-top: -10px; font-size: 9pt;'></div></p>"),
                                                                                            //$(" "+ arlineno(8) + "<center><div style = 'margin-left: " + abodylefts + "'>Requester ___________________________________________ <span style='padding: 100px 20px;'>" + arspace(25) + "Approver ___________________________________________</span></div></center>"),
                                                                                            $(" " + arlineno(2) + "<span>" + arspace(8) + "</span><div class='colorRBGlightgrey';><b>" + arspace(3) + " ����͹��ѵ� (Requester)&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;�ѹ��� (Date)</b></div>"),
                                                                                            $("<span>" + arspace(53) + "</span>"),
                                                                                            $("<div class='colorRBGlightgrey';><b>" + arspace(3) + " HR Approval&nbsp;&nbsp;&nbsp;&nbsp;  / &nbsp;&nbsp;&nbsp;&nbsp; �ѹ��� (Date) </b></div>"),

                                                                                        );
                                                                                    },
                                                                                    toolbarItems: [

                                                                                    ]

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
                                                                                        //Check if Local Amount = 0 then delete Records
                                                                                        popup.hide();
                                                                                    }
                                                                                });
                                                                                $("#popupprint").dxButton({
                                                                                    icon: "print",
                                                                                    //text: "Print",
                                                                                    onClick: function () {
                                                                                        window.print()
                                                                                        popup.hide();
                                                                                    }
                                                                                });

                                                                                $("#print").dxButton({
                                                                                    icon: "print",
                                                                                    text: "Print",
                                                                                    onClick: function () {
                                                                                        //window.print();
                                                                                        printJS('popupContainer', 'html');
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
                                                                                        let ObjRowD = JSON.stringify(iData)
                                                                                        sendRequestNew("Update", ObjRowD, aaTBKey, aaPFDMI, atob(aaXToX));
                                                                                        // refresh before close popup ?
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
                                                                                        cssClass: "colorBGlightgrey",
                                                                                        colCount: 4,
                                                                                        items: [

                                                                                            {
                                                                                                dataField: "PayToName",
                                                                                                label: { text: "Pay To" },
                                                                                                //editorOptions: { width: 180 },
                                                                                                editorOptions: { value: iData.PayToName + " (" + iData.PayToCode + ")", width: 200, readOnly: true },
                                                                                            },

                                                                                        ]

                                                                                    },



                                                                                    ]

                                                                                }).dxForm("instance");

                                                                                $("#detail-dxDataGrid").dxDataGrid({

                                                                                    dataSource: new DevExpress.data.CustomStore({
                                                                                        key: "REFNO",
                                                                                        loadMode: "omit",
                                                                                        load: function () { return $.post(aaSettings).done(); },
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
                                                                                            headerCellTemplate: $('<b style="color: white">NO</b>'),
                                                                                            editorOptions: { width: 60 },
                                                                                            width: 60
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERODesc03",
                                                                                            caption: "Hospital/Clinic Name",
                                                                                            dataType: "string",
                                                                                            width: 140,
                                                                                        },
                                                                                        {
                                                                                            dataField: "ERODate01",
                                                                                            caption: "Treatment Date",
                                                                                            dataType: "date",
                                                                                            format: "dd/MM/yyyy",
                                                                                            width: 120,
                                                                                            editorOptions: { width: 120 },
                                                                                        },

                                                                                        {
                                                                                            dataField: "EROCode02",
                                                                                            caption: "Employee Type",
                                                                                            dataType: "string",
                                                                                            width: 110,

                                                                                        },
                                                                                        {
                                                                                            dataField: "ERORefNo3",
                                                                                            caption: "Exp. Type",
                                                                                            width: 120,
                                                                                        },
                                                                                        {
                                                                                            dataField: "Amount",
                                                                                            caption: "Actual Amount",
                                                                                            dataType: "number",
                                                                                            format: { type: "fixedPoint", precision: 2 },
                                                                                            width: 120,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "RefundedAmount",
                                                                                            caption: "Reimbursement Amount",
                                                                                            dataType: "number",
                                                                                            format: { type: "fixedPoint", precision: 2 },
                                                                                            editorOptions: { format: "#,##0.00", width: 160 },
                                                                                            width: 160,
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

                                                                                $("#ACCChart-dxDataGrid").dxDataGrid({

                                                                                    dataSource: new DevExpress.data.CustomStore({
                                                                                        key: "HeadRefNo",
                                                                                        loadMode: "omit",
                                                                                        load: function () { return $.post(aaxSettings).done(); },
                                                                                    }),

                                                                                    ///dataSource: aaiData,
                                                                                    allowColumnReordering: true,
                                                                                    allowColumnResizing: false,
                                                                                    columnMinWidth: 20,
                                                                                    columnChooser: {
                                                                                        enabled: false //false // true
                                                                                    },
                                                                                    //HeadRefNo,DR,ExpensesCode,EAccDesc,DRAMT,CR,CRCODE,CRName,CRAMT
                                                                                    showBorders: true,
                                                                                    showColumnLines: true,
                                                                                    showRowLines: true,
                                                                                    columns: [
                                                                                        {
                                                                                            dataField: "DC",
                                                                                            caption: " ",
                                                                                            dataType: "string",
                                                                                            width: 60
                                                                                        },
                                                                                        {
                                                                                            dataField: "ExpensesCode",
                                                                                            caption: "CODE",
                                                                                            dataType: "string",
                                                                                            width: 150,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "EAccDesc",
                                                                                            caption: "Account Name",
                                                                                            dataType: "string",
                                                                                            width: 150,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "Division",
                                                                                            caption: "Department",
                                                                                            editorType: "dxTextBox",
                                                                                            width: 150,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "DRAMT",
                                                                                            caption: "Debit Amount",
                                                                                            dataType: "number",
                                                                                            format: { type: "fixedPoint", precision: 2 },
                                                                                            width: 140,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "CRAMT",
                                                                                            caption: "Credit Amount",
                                                                                            dataType: "number",
                                                                                            format: { type: "fixedPoint", precision: 2 },
                                                                                            width: 140,
                                                                                            visible: true,
                                                                                        },

                                                                                    ],
                                                                                    // summary
                                                                                    summary: {
                                                                                        recalculateWhileEditing: true,
                                                                                        skipEmptyValues: false,
                                                                                        totalItems: [
                                                                                            {
                                                                                                column: "Division",
                                                                                                //summaryType: "count",
                                                                                                displayFormat: "BALANCE",
                                                                                            },
                                                                                            {
                                                                                                column: "DRAMT",
                                                                                                summaryType: "sum",
                                                                                                valueFormat: "#,##0.00",
                                                                                                displayFormat: "{0}",
                                                                                            },

                                                                                            {
                                                                                                column: "CRAMT",
                                                                                                summaryType: "sum",
                                                                                                valueFormat: "#,##0.00",
                                                                                                displayFormat: "{0}",
                                                                                            },
                                                                                        ],

                                                                                    },

                                                                                }).dxDataGrid("instance");

                                                                            });
                                                                        }
                                                                        function aPopUpBenefits(iData) {
                                                                            let selectedYear = new Date().getFullYear(); // default year
                                                                            
                                                                            const reloadBenefitsGrid = (year) => {
                                                                                const currentYear = new Date().getFullYear();
                                                                                const lastYear = currentYear - 1;
                                                                                const yearStr = year.toString();
                                                                                const lastYearStr = (year - 1).toString();
                                                                            
                                                                                let aaSqlS = "";
                                                                            
                                                                                if (year === currentYear) {
                                                                                    // Selected year is this year (e.g. 2025)
                                                                                    aaSqlS = `
                                                                                        PayToCode LIKE '${$.trim(aaEmpID)}%'
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
                                                                                } else if (year === lastYear) {
                                                                                    // Selected year is last year (e.g. 2024)
                                                                                    aaSqlS = `
                                                                                        PayToCode LIKE '${$.trim(aaEmpID)}%'
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
                                                                                    // For older years: only show that year's data
                                                                                    aaSqlS = `
                                                                                        PayToCode LIKE '${$.trim(aaEmpID)}%'
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
                                                                                    data: JSON.stringify({ "@": btoa(aaSqlS) }),
                                                                                };
                                                                            
                                                                                const grid = $("#Benefits-Movement").dxDataGrid("instance");
                                                                                grid.option("dataSource", new DevExpress.data.CustomStore({
                                                                                    key: "PayToCode",
                                                                                    loadMode: "omit",
                                                                                    load: () => $.post(aaSettings).done()
                                                                                }));
                                                                            };
                                                                            

                                                                            // const reloadBenefitsGrid = (year) => {
                                                                            //     const year1 = year;
                                                                            //     const year2 = year + 1;
                                                                            //     const yearStr1 = year1.toString();
                                                                            //     const yearStr2 = year2.toString();
                                                                            //     const thisYear = new Date().getFullYear();
                                                                            //     const thisYearStr = thisYear.toString();

                                                                            //     // Build WHERE condition:
                                                                            //     const aaSqlS = `
                                                                            //         PayToCode LIKE '${$.trim(aaEmpID)}%'
                                                                            //         AND (
                                                                            //             (
                                                                            //                 ExpGroupDescEng LIKE '%Dental (SSO)%'
                                                                            //                 AND (QYear = ${yearStr1} OR QYear = ${yearStr2})
                                                                            //             )
                                                                            //             OR (
                                                                            //                 ExpGroupDescEng NOT LIKE '%Dental (SSO)%'
                                                                            //                 AND (QYear = ${yearStr1} OR QYear = ${thisYearStr})
                                                                            //             )
                                                                            //         )
                                                                            //         AND (TAmount + TRefundAmt) <> 0
                                                                            //     `;

                                                                            //     const aaqrFull = aaSqlS;
                                                                            //     const aaurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "D8CAE826-9DFA-4446-A12C-0C42B1A95ADB" + '/all';
                                                                            //     const aaSettings = {
                                                                            //         url: aaurl,
                                                                            //         method: "POST",
                                                                            //         timeout: 0,
                                                                            //         headers: { "Content-Type": "application/json" },
                                                                            //         data: JSON.stringify({ "@": btoa(aaqrFull) }),
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
                                                                                    title: "My Benefits",
                                                                                    width: '900px',
                                                                                    height: '600px',
                                                                                    visible: true,
                                                                                    fullScreen: false,
                                                                                    showCloseButton: false,
                                                                                    showTitle: true,
                                                                                    dragEnabled: true,
                                                                                    resizeEnabled: true,
                                                                                    closeOnOutsideClick: false,
                                                                                    position: { offset: "0 -165" },

                                                                                    contentTemplate: () => {
                                                                                        return $("<div />").append(
                                                                                            // Year SelectBox with auto refresh
                                                                                            $("<div>").css({ marginBottom: "10px" }).append(
                                                                                                $("<div>").attr("id", "Benefits-YearBox").css({ width: "200px" })
                                                                                            ),
                                                                                            $("<div>").attr("id", "Benefits-View"),
                                                                                            $("<hr>"),
                                                                                            $("<span>").css({
                                                                                                fontSize: "13px",
                                                                                                fontWeight: "bold",
                                                                                                color: "darkblue",
                                                                                                backgroundColor: "rgb(64, 224, 208)",
                                                                                                borderRadius: "3px",
                                                                                                padding: "1px 10px",
                                                                                            }).text("MEDICAL BENEFITS BALANCE"),
                                                                                            $("<br>"),
                                                                                            $("<span>").css({ fontSize: "9px", color: "darkblue" })
                                                                                                .text("[NOT SHOW = Never used, Medical = OPD+Dental]"),
                                                                                            $("<div>").attr("id", "Benefits-Movement").css("margin-top", "10px")
                                                                                        );
                                                                                    },

                                                                                    toolbarItems: [
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

                                                                                // Initialize Year SelectBox with auto-refresh
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

                                                                                // Basic Info Form
                                                                                $("#Benefits-View").dxForm({
                                                                                    formData: iData,
                                                                                    readOnly: true,
                                                                                    labelLocation: "left",
                                                                                    colCount: 1,
                                                                                    items: [{
                                                                                        itemType: "group",
                                                                                        colCount: 3,
                                                                                        items: [
                                                                                            {
                                                                                                dataField: "EmpName",
                                                                                                label: { text: "Name" },
                                                                                                editorType: "dxTextBox",
                                                                                                editorOptions: { value: asFullName, width: 150 }
                                                                                            },
                                                                                            {
                                                                                                dataField: "AllowFamily",
                                                                                                label: { text: "Allow Family" },
                                                                                                editorOptions: { value: aaFamily, width: 100 }
                                                                                            },
                                                                                            {
                                                                                                dataField: "AllowSSO",
                                                                                                label: { text: "Allow SSO" },
                                                                                                editorOptions: { value: aaSSO, width: 100 }
                                                                                            },
                                                                                            {
                                                                                                dataField: "MedicalLimit",
                                                                                                label: { text: "Medical Limit" },
                                                                                                editorOptions: { value: aaMedical, format: "#,##0.00", width: 150 },
                                                                                                visible: true
                                                                                            },
                                                                                            {
                                                                                                dataField: "LimitPerCase",
                                                                                                label: { text: "Medical Limit per time" },
                                                                                                editorOptions: { value: aaLimitPC, format: "#,##0.00", width: 150 },
                                                                                                visible: aaLimitPC !== 0
                                                                                            },
                                                                                            {
                                                                                                dataField: "MaternityLimit",
                                                                                                label: { text: "Maternity Limit" },
                                                                                                editorOptions: { value: aaMaternity, format: "#,##0.00", width: 150 },
                                                                                                visible: aaMaternity !== 0
                                                                                            },
                                                                                            { itemType: "empty" },
                                                                                            {
                                                                                                dataField: "FleetLimit",
                                                                                                label: { text: "Fleet Card Limit" },
                                                                                                editorOptions: { value: aaFleet, format: "#,##0.00", width: 150 },
                                                                                                visible: aaFleet !== 0
                                                                                            },
                                                                                            {
                                                                                                dataField: "EmpPosition",
                                                                                                label: { text: "Plate No" },
                                                                                                editorType: "dxTextBox",
                                                                                                editorOptions: { value: aaPlateNo, width: 180 },
                                                                                                visible: aaFleet !== 0
                                                                                            },
                                                                                            {
                                                                                                dataField: "EmpDept",
                                                                                                label: { text: "Fleet Card NO" },
                                                                                                editorType: "dxTextBox",
                                                                                                editorOptions: { value: aaFCardNo, width: 180 },
                                                                                                visible: aaFleet !== 0
                                                                                            }
                                                                                        ]
                                                                                    }]
                                                                                });

                                                                                // DataGrid Setup
                                                                                $("#Benefits-Movement").dxDataGrid({
                                                                                    dataSource: [],
                                                                                    allowColumnReordering: true,
                                                                                    showBorders: true,
                                                                                    rowAlternationEnabled: true,
                                                                                    columns: [
                                                                                        { dataField: "ExpGroupDescEng", caption: "Expense", width: 120 },
                                                                                        { dataField: "QYear", caption: "Year", width: 80 },
                                                                                        { dataField: "LAmount", caption: "Limit Amount", format: "#,##0.00", width: 120 },
                                                                                        { dataField: "TAmount", caption: "Actual Amount", format: "#,##0.00", width: 120 },
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

                                                                                // Initial Load
                                                                                reloadBenefitsGrid(selectedYear);
                                                                            });
                                                                        }

                                                                        // Helper: Generate year list for SelectBox
                                                                        function generateYearList() {
                                                                            const now = new Date().getFullYear();
                                                                            const list = [];
                                                                            for (let i = now - 5; i <= now + 1; i++) {
                                                                                list.push(i);
                                                                            }
                                                                            return list;
                                                                        }



                                                                        // Check Benefits Popup //aaMedical,aaFamily,aaSSO,aaMaternity,aaFleet
                                                                        function axPopUpBenefits(iData) {
                                                                            var aYearNum1 = aaGetBusYear(1, 4, aNowDte);
                                                                            var aYearStr1 = aYearNum1.toString()
                                                                            var aCalYear = aNowDte.getFullYear();
                                                                            var aCalYearStr = aCalYear.toString();
                                                                            var aaSqlS = "PayToCode LIKE '" + $.trim(aaEmpID) + "%' AND ((ExpGroupDescEng Like '%SSO%' and (QYear = " + aYearStr1 + " or QYear = " + aCalYearStr + ")) or QYear = " + aYearStr1 + ") AND (TAmount + TRefundAmt) <> 0 "
                                                                            var aaqrFull = aaSqlS;
                                                                            var aaurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "D8CAE826-9DFA-4446-A12C-0C42B1A95ADB" + '/all'
                                                                            var aaSettings = { "url": aaurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aaqrFull) }), };

                                                                            $(() => {
                                                                                const popup = $("#popupBenefitsView").dxPopup({
                                                                                    title: "My Benefits",
                                                                                    width: '900px',
                                                                                    height: '600px',
                                                                                    focusStateEnabled: true,
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

                                                                                //Benefits Popup
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
                                                                                                editorType: "dxTextBox",
                                                                                                editorOptions: { value: asFullName, width: 150 },
                                                                                            },

                                                                                            {
                                                                                                dataField: "AllowFamily",
                                                                                                label: { text: "Allow Family" },
                                                                                                editorOptions: { value: aaFamily, width: 100 },
                                                                                            },

                                                                                            {
                                                                                                dataField: "AllowSSO",
                                                                                                label: { text: "Allow SSO" },
                                                                                                editorOptions: { value: aaSSO, width: 100 },
                                                                                            },

                                                                                            {
                                                                                                dataField: "MedicalLimit",
                                                                                                label: { text: "Medical Limit" },
                                                                                                editorOptions: { value: aaMedical, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                                                                visible: true,
                                                                                            },
                                                                                            {
                                                                                                dataField: "LimitPerCase",
                                                                                                label: { text: "Medical Limit per time" },
                                                                                                editorOptions: { value: aaLimitPC, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                                                                visible: (aaLimitPC !== 0),
                                                                                            },
                                                                                            {
                                                                                                dataField: "MaternityLimit",
                                                                                                label: { text: "Maternity Limit" },
                                                                                                editorOptions: { value: aaMaternity, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                                                                visible: (aaMaternity !== 0),
                                                                                            },
                                                                                            {
                                                                                                itemType: "empty"
                                                                                            },
                                                                                            {
                                                                                                dataField: "FleetLimit",
                                                                                                label: { text: "Fleet Card Limit" },
                                                                                                editorOptions: { value: aaFleet, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                                                                visible: (aaFleet !== 0),
                                                                                            },
                                                                                            {
                                                                                                dataField: "EmpPosition",
                                                                                                label: { text: "Plate No" },
                                                                                                editorType: "dxTextBox",
                                                                                                editorOptions: { value: aaPlateNo, width: 180 },
                                                                                                visible: (aaFleet !== 0),
                                                                                            },
                                                                                            {
                                                                                                dataField: "EmpDept",
                                                                                                label: { text: "Fleet Card NO" },
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
                                                                                    rowAlternationEnabled: true, // 2 Tones Line Color
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
                                                                                        {  //LAmount,MRemained
                                                                                            dataField: "LAmount",
                                                                                            caption: "Limit Amount",
                                                                                            dataType: "number",
                                                                                            format: { type: "fixedPoint", precision: 2 },
                                                                                            width: 120,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "TAmount",
                                                                                            caption: "Actual Amount",
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
                                                                                        /*{
                                                                                            dataField: "CR",
                                                                                            caption: "CR",
                                                                                            editorOptions: { width: 70 },
                                                                                            width: 70
                                                                                        },
                                                                                        {
                                                                                            dataField: "CRCODE",
                                                                                            caption: "CODE",
                                                                                            editorOptions: { width: 100 },
                                                                                            width: 100,
                                                                                            visible: true,
                                                                                        },                          
                                                                                        {
                                                                                            dataField: "CRName",
                                                                                            caption: "Account Name",
                                                                                            editorType: "dxTextBox",
                                                                                            width: 200,
                                                                                            visible: true,
                                                                                        },   
                                                                                        {
                                                                                            dataField: "CRDivision",
                                                                                            caption: "Division",
                                                                                            editorType: "dxTextBox",
                                                                                            width: 80,
                                                                                            visible: true,
                                                                                        }, */

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
                                                                        // Benefits List - Inside
                                                                        function aPopUpBenefitsIN(iData) { //aaMedical,aaFamily,aaSSO,aaMaternity,aaFleet
                                                                            var aYearNum1 = aaGetBusYear(1, 4, aNowDte) //aNowDte.getFullYear()
                                                                            var aYearStr1 = aYearNum1.toString()
                                                                            var aCalYear = aNowDte.getFullYear();
                                                                            var aCalYearStr = aCalYear.toString();

                                                                            //PayToCode = '101301' and ((ExpGroupDescEng Like '%SSO%' and (QYear = '2022' or QYear = '2023')) or QYear = '2022') AND (TAmount + TRefundAmt) <> 0
                                                                            //var aaSqlS = "PayToCode LIKE '" + $.trim(aaEmpID) + "%' and QYear = " + aYearStr1 + " AND (TAmount + TRefundAmt) <> 0 "
                                                                            var aaSqlS = "PayToCode LIKE '" + $.trim(aaEmpID) + "%' AND ((ExpGroupDescEng Like '%SSO%' and (QYear = " + aYearStr1 + " or QYear = " + aCalYearStr + ")) or QYear = " + aYearStr1 + ") AND (TAmount + TRefundAmt) <> 0 "

                                                                            var aaSqlS = "PayToCode LIKE '" + $.trim(aaEmpID) + "%' AND ((ExpGroupDescEng Like '%SSO%' and (QYear = " + aYearStr1 + " or QYear = " + aCalYearStr + ")) or QYear = " + aYearStr1 + ") AND (TAmount + TRefundAmt) <> 0 "
                                                                            var aaqrFull = aaSqlS;
                                                                            var aaurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "D8CAE826-9DFA-4446-A12C-0C42B1A95ADB" + '/all'
                                                                            var aaSettings = { "url": aaurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aaqrFull) }), };

                                                                            // define the $ as jQuery for multiple uses
                                                                            //jQuery(function ($) {
                                                                            // ...
                                                                            $(() => {
                                                                                const popup = $("#popupBenefitsViewIN").dxPopup({
                                                                                    title: "My Benefits",
                                                                                    width: '900px',
                                                                                    height: '600px',
                                                                                    focusStateEnabled: true,
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
                                                                                            $("<p><div id='Benefits-ViewIN' background-color: grey></div></p>"), //'<hr>'
                                                                                            $("<p><hr></p>"),
                                                                                            $("<span style='font-size: 13px; font-weight: bold; color: darkblue; background-color: rgb(64, 224, 208); border-radius: 3px; border: 0px; padding: 1px 10px;' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px;
                                                                                                .text("MEDICAL BENEFITS BALANCE"),
                                                                                            $("<br>"),
                                                                                            //$("<p>BENEFITS BALANCE</p>"),
                                                                                            $("<span style='font-size: 9px;  color: darkblue;' />").text("[NOT SHOW = Never used, Medical = OPD+Dental]"),
                                                                                            //$("<p><small>[NOT SHOW = Never used, Medical = OPD+Dental]</small></p>").text("BENEFITS BALANCE"),,
                                                                                            $("<p><center><div id='Benefits-MovementIN'></div></center></p>"),
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

                                                                                //Benefits Popup
                                                                                const aform = $("#Benefits-ViewIN").dxForm({
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
                                                                                                editorType: "dxTextBox",
                                                                                                editorOptions: { value: asFullName, width: 150 },
                                                                                            },
                                                                                            {
                                                                                                dataField: "AllowFamily",
                                                                                                label: { text: "Allow Family" },
                                                                                                //editorType: "dxTextBox",
                                                                                                editorOptions: { value: aaFamily, width: 100 },
                                                                                            },

                                                                                            {
                                                                                                dataField: "AllowSSO",
                                                                                                label: { text: "Allow SSO" },
                                                                                                //editorType: "dxTextBox",
                                                                                                editorOptions: { value: aaSSO, width: 100 },
                                                                                            },
                                                                                            {
                                                                                                dataField: "MedicalLimit",
                                                                                                label: { text: "Medical Limit" },
                                                                                                editorOptions: { value: aaMedical, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                                                                visible: true,
                                                                                            },

                                                                                            {
                                                                                                dataField: "LimitPerCase",
                                                                                                label: { text: "Medical Limit per time" },
                                                                                                editorOptions: { value: aaLimitPC, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                                                                visible: (aaLimitPC !== 0),
                                                                                            },
                                                                                            {
                                                                                                dataField: "MaternityLimit",
                                                                                                label: { text: "Maternity Limit" },
                                                                                                editorOptions: { value: aaMaternity, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                                                                visible: (aaMaternity !== 0),
                                                                                            },
                                                                                            {
                                                                                                itemType: "empty"
                                                                                            },
                                                                                            {
                                                                                                dataField: "FleetLimit",
                                                                                                label: { text: "Fleet Card Limit" },
                                                                                                editorOptions: { value: aaFleet, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                                                                                visible: (aaFleet !== 0),
                                                                                            },
                                                                                            {
                                                                                                dataField: "EmpPosition",
                                                                                                label: { text: "Plate No" },
                                                                                                editorType: "dxTextBox",
                                                                                                editorOptions: { value: aaPlateNo, width: 180 },
                                                                                                visible: (aaFleet !== 0),
                                                                                            },
                                                                                            {
                                                                                                dataField: "EmpDept",
                                                                                                label: { text: "Fleet Card NO" },
                                                                                                editorType: "dxTextBox",
                                                                                                editorOptions: { value: aaFCardNo, width: 180 },
                                                                                                visible: (aaFleet !== 0),
                                                                                            },

                                                                                            /*{
                                                                                                dataField: "ExpensesDescription",
                                                                                                label: { text: "Expenses" },
                                                                                                //disabled: true,
                                                                                                editorOptions: { value: aaOnInitAccDesc, width: 180 },
                                                                                                validationRules: [{ type: "required" }],
                                                                                            }, */
                                                                                            //e.data.LimitedAmount = aaLMontyly                                                   
                                                                                            /*{
                                                                                                dataField: "ReqDate",
                                                                                                label: { text: "Submitted Date" },
                                                                                                //disabled: true,
                                                                                                editorType: "dxDateBox",
                                                                                                editorOptions: { value: idDate, displayFormat: "dd/MM/yyyy", width: 150 },	  //showClearButton: true,                  
                                                                                            },*/
                                                                                        ]

                                                                                    },
                                                                                        /*{
                                                                                            itemType: "group",
                                                                                            //caption: "Amount",
                                                                                            colCount: 4,
                                                                                            items: [{
                                                                                                dataField: "Currency",
                                                                                                label: { text: "Currency" },
                                                                                                value: "THB",
                                                                                                editorOptions: { value: 'THB', width: 100 },
                                                                                            },
                                                                                            {
                                                                                                dataField: "Xrate",
                                                                                                label: { text: "X-Rate" },
                                                                                                editorType: "dxNumberBox",
                                                                                                editorOptions: { value: 1, format: "#,##0.000000", width: 100 },
                                                                                                //visible: false,
                                                                                            },
                                                                                                
                                                                                                //{
                                                                                                //    dataField: "ERORefNo1",
                                                                                                 //   label: { text: "Plate No" },
                                                                                                 //   editorType: "dxTextBox",
                                                                                                //    editorOptions: { value: aaPlateNo, width: 180 },
                                                                                                //},
                                                                                                /{
                                                                                               //     dataField: "ERORefNo2",
                                                                                               //     label: { text: "Fleet Card NO" },
                                                                                               //     editorType: "dxTextBox",
                                                                                                //    editorOptions: { value: aaFCardNo, width: 180 },
                                                                                               // },
                                                                                                
                                                                                            ]
                                                                                        },*/
                                                                                        //{
                                                                                        //    itemType: "group",
                                                                                        //    caption: "Details",
                                                                                        //}
                                                                                    ]

                                                                                }).dxForm("instance");

                                                                                //Benefits DataGrid
                                                                                $("#Benefits-MovementIN").dxDataGrid({

                                                                                    dataSource: new DevExpress.data.CustomStore({
                                                                                        key: "PayToCode",
                                                                                        loadMode: "omit",
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
                                                                                    rowAlternationEnabled: true, // 2 Tones Line Color
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
                                                                                        {  //LAmount,MRemained
                                                                                            dataField: "LAmount",
                                                                                            caption: "Limit Amount",
                                                                                            dataType: "number",
                                                                                            format: { type: "fixedPoint", precision: 2 },
                                                                                            width: 120,
                                                                                            visible: true,
                                                                                        },
                                                                                        {
                                                                                            dataField: "TAmount",
                                                                                            caption: "Actual Amount",
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
                                                                                        /*{
                                                                                            dataField: "CR",
                                                                                            caption: "CR",
                                                                                            editorOptions: { width: 70 },
                                                                                            width: 70
                                                                                        },
                                                                                        {
                                                                                            dataField: "CRCODE",
                                                                                            caption: "CODE",
                                                                                            editorOptions: { width: 100 },
                                                                                            width: 100,
                                                                                            visible: true,
                                                                                        },                          
                                                                                        {
                                                                                            dataField: "CRName",
                                                                                            caption: "Account Name",
                                                                                            editorType: "dxTextBox",
                                                                                            width: 200,
                                                                                            visible: true,
                                                                                        },   
                                                                                        {
                                                                                            dataField: "CRDivision",
                                                                                            caption: "Division",
                                                                                            editorType: "dxTextBox",
                                                                                            width: 80,
                                                                                            visible: true,
                                                                                        }, */

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

                                                                        //=====[Function]
                                                                        function DataGridRefresh() {
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        }
                                                                        //sendRequestNew     ("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                                        function sendRequestNew(Action, Data, TokenKey, domain, AccessKey) {
                                                                            let Url = domain + '/DMP/XOL/' + AccessKey + '/' + Action + '/' + TokenKey + '/true/true';
                                                                            console.log(Url)
                                                                            console.log('Goal...Repuest Web API : ' + Data);
                                                                            var settings = { "url": Url, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": Data, };
                                                                            $.ajax(settings).done(function (response) { console.log(response); });
                                                                        }

                                                                        function aSendMailDMZ(aRecipient, aRCPeMail, aSendereMail, aCCeMail, aBcceMail, aSubject, aMessage) {
                                                                            var myHeaders = new Headers();
                                                                            myHeaders.append("Content-Type", "application/json");

                                                                            var raw = JSON.stringify({
                                                                                "toname": aRecipient,
                                                                                "toemail": aRCPeMail,
                                                                                "fromemail": aSendereMail,
                                                                                "ccemail": aCCeMail,
                                                                                "bccemail": aBcceMail,
                                                                                "subject": aSubject,
                                                                                "message": aMessage //"Dear Wachiraphan <br/><br/>&nbsp;&nbsp;Test send Email from web API.<br/><br/><br/>Thanks and Regards,<br />Wachiraphan."
                                                                            });

                                                                            var requestOptions = {
                                                                                method: 'POST',
                                                                                headers: myHeaders,
                                                                                body: raw,
                                                                                redirect: 'follow'
                                                                            };

                                                                            fetch("https://cbsdev3.locktonwattana.com/send-email/false", requestOptions)
                                                                                .then(response => response.text())
                                                                                .then(result => console.log(result))
                                                                                .catch(error => console.log('error', error));
                                                                        }

                                                                        function aDataGridRF() {
                                                                            dataGrid.refresh();
                                                                        }

                                                                        function aSchDisease(aObjArr, asTYPE) {
                                                                            return aObjArr.filter(  //aaDisease
                                                                                function (data) {
                                                                                    return data.Type == asTYPE
                                                                                }
                                                                            );
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

                                                                        function dropDownHospital(cellElement, cellInfo) { //ID,HOSPITAL,ADDRESS,TEL,DISTRICT,PROVINCE,NOTE
                                                                            return $("<div>").dxDropDownBox({
                                                                                dropDownOptions: { width: 500 },
                                                                                dataSource: aaHospital,
                                                                                value: cellInfo.value,
                                                                                valueExpr: "HOSPITAL",
                                                                                displayExpr: "HOSPITAL",
                                                                                contentTemplate: function (e) {
                                                                                    return $("<div>").dxDataGrid({
                                                                                        dataSource: aaHospital,
                                                                                        //remoteOperations: true,
                                                                                        hoverStateEnabled: true,
                                                                                        searchPanel: { visible: true },
                                                                                        paging: { enabled: true, pageSize: 15 },
                                                                                        filterRow: { visible: true },
                                                                                        showBorders: true,
                                                                                        scrolling: { mode: "virtual" },
                                                                                        selection: { mode: "single" },
                                                                                        height: 250,
                                                                                        headerFilter: { visible: true },
                                                                                        columns: [{ dataField: "PROVINCE", caption: "Province", width: 100 }, { dataField: "HOSPITAL", caption: "Hospital", width: 120 }], //"ID,Disease,Type,Note" //{ dataField: "Type", caption: "TYPE", width: 100},
                                                                                        selectedRowKeys: [cellInfo.value],
                                                                                        //focusedRowEnabled: true,
                                                                                        focusedRowKey: cellInfo.value,
                                                                                        onSelectionChanged: function (sArgs) {
                                                                                            //console.log(aArgs.selectedRowKeys[0])
                                                                                            e.component.option("value", sArgs.selectedRowKeys[0].HOSPITAL);
                                                                                            cellInfo.setValue(sArgs.selectedRowKeys[0].HOSPITAL);
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
                                                                        /*  function aPopupHelp() {
                                                                             const popup = $("#popupHelp").dxPopup({
                                                                                 title: " HELP - Data Input",
                                                                                 height: 400,
                                                                                 width: 800,
                                                                                 position: { offset: "40 -100" }, //{my:"top", at:"top", of:window}, <ul><li>
                                                                                 visible: true,
                                                                                 showCloseButton: true,
                                                                                 contentTemplate:
                                                                                     "<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-plus'></i>" + " ADD MORE ROW</div>" +
                                                                                     "<p style = 'color: green; font-size: 14px;'><ul><li>����� icon " + "<i class='fas fa-plus'></i>" + " �������� ��¡�� </li><li>������¡�� ��������բ����� ¡��� ��Ǣ���ѹ��� ���ʴ����ѹ���</li></ul></br></p>" +
                                                                                     "<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-trash'></i>" + " DELETE ROW</div>" +
                                                                                     "<p style = 'color: green; font-size: 14px;'><ul><li>����� icon " + "<i class='fas fa-trash'></i>" + " ����ź��¡��㹺�÷Ѵ������͡</li><li>�������͡ź ��÷Ѵ��� 1 �ж������繡��ź�����ŷ����� ** ��ͧ���Ѵ���ѧ </ul></li></br></p>" +
                                                                                     "<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-redo'></i>" + " REFRESH</div>" +
                                                                                     "<p style = 'color: green; font-size: 14px;'><ul><li>����� icon " + "<i class='fas fa-redo'></i>" + " �繡�����ê˹�Ҩ� ���˹�ҨͶ١��ͧ�ç������ԧ </li><li>��͹ Confirm ��á����� REFRESH ��͹���͵�Ǩ�ͺ���������ç�����ԧ</li></ul></br></p>" +
                                                                                     "<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-star'></i>" + " ADD/EDIT (VDO SAMPLE) </div><br>" //+
                                                                                 //"<center><div style='max-width: 560px'><div style='position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;'><iframe src='./images/MedicalERInput.webm' width='640' height='480' frameborder='0' scrolling='no' allowfullscreen title='PVSUB.mp4' style='border:none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; height: 100%; max-width: 100%;'></iframe></div></div></center>"
                                                                             }).dxPopup("instance");
                                                                             //'./images/locktonlogo70mmblack.png'
                                                                             //'https://lockton-my.sharepoint.com/personal/wikran_lockton_com/_layouts/15/embed.aspx?UniqueId=245d6310-2b34-4609-8c15-4f00051c98fe&embed=%7B%22hvm%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create'

                                                                         } */
                                                                        //=====[Function]
                                                                    }) //then fetch (HOD or HR Email get inside better ?)
                                                            }) //then fetch (Limit)
                                                    }) //Employee Details
                                            }) // Medical
                                    }) // Maternity
                            }) // Dental SSO
                    });
                    // TOP PRG
                });  // ajax 
        }); // end FUN
    // last 
})
// .catch(error => {
//     console.error("Error:", error);
// });