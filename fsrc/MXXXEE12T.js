//Travel & Expenses MXXXEE12T

$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});

window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
//console.log(aCurrenciesList)
//Accom. Overseas                  10,000 B. per Person / Night 
//Accom. Local                      4,500 B. per Person / Night
//Entertainment                    10,000 per Person  
//Gift Provide and/or Receive      10,000 per Person 

// const aaLimitedAmt = [
//     { code: "Overseas", lmtamt: 10000 },
//     { code: "Entertainment", lmtamt: 50000 },
//     { code: "Gift", lmtamt: 50000 }
// ]
// const aaGiftLmt = 10000;
// const aaEntertainLmt = 40000;
// const sendRequestNew = (action, data, table, url, token) => {
//     return $.ajax({
//         url: `${url}/DMQ/${action}/${token}/${table}`,
//         method: "POST",
//         contentType: "application/json",
//         data: data
//     });
// };


//REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate

const aaOverLAmt = [  //if over then save to Declaration DB
    { code: "Overseas", lmtamt: 10000 },
    { code: "Entertainment", lmtamt: 40000 },
    { code: "Gift", lmtamt: 40000 } // new limit 10000
]

const aaLocalTravel = [
    { code: "Travel", lmtamt: 100000 },
    { code: "Accommodation", lmtamt: 4500 },
]

const aTranTextJson = (aText, aFMark, aLMark) => { //"NAME:" "EMAIL:"
    var axHODFtext = aText;
    var xaChkName;
    var aatestChk = axHODFtext.replaceAll("|", '"')
    var xxChk1 = aatestChk.search(aFMark);
    var xxChk2 = aatestChk.search(aLMark);

    xxChk1 = aatestChk.search(aFMark)
    xxChk2 = aatestChk.search(aLMark)

    //// console.log(xxChk1, xxChk2)
    //// console.log(aatestChk.substr(xxChk1+5, xxChk2-5))
    //aatestChk.substr(xxChk1+5, xxChk2-xxChk1-5)
    if (aLMark === "") {
        xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, 300)); //xxChk1+5, xxChk2-5);
    } else {
        xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, xxChk2 - xxChk1 - 5)); //xxChk1+5, xxChk2-5);
    }
    //// console.log(xaChkName);
    const xxNameArr = JSON.parse(xaChkName);
    //// console.log(xxNameArr)
    //// console.log(xxNameArr[0])
    return xxNameArr;
}

const aSaveMemToDB = (iData, aaTBKey, aaPFDMI, aaXToX) => {
    let aObjRowData = JSON.stringify(iData);
    alert(aObjRowData);
    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
}

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
    if (filteredArray.length === 0) {
        abc = 0;
    } else {
        abc = 1;
    }
    return abc;
}

function showPreviousYearPopup(callback) {
    var today = new Date();
    var aTYear = new Date().getFullYear();
    var aLYear = aTYear - 1;
    var aNYear = aTYear + 1;
    var aTextThisYear = aTYear.toString() + "-" + aNYear.toString();
    var aTextLastYear = aLYear.toString() + "-" + aTYear.toString();
    // Check if the current date is after May 3 of this year
    // var isAfterMay3 = (today.getMonth() > 3) || (today.getMonth() === 3 && today.getDate() >= 3);
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
                            // console.log("aNowDte: " + aNowDte);
                        } else {
                            var today = new Date();
                            var aNowDte = new Date(); //var aNowDte = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
                            // console.log("aNowDte: " + aNowDte);
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

const searchExpenses = (array, searchTerms) => {
    return array.filter(item =>
        searchTerms.some(term => item.EXPDesc.includes(term))
    ).map(item => ({
        ACCCODE: item.ACCCODE,
        ALTERACC: item.ALTERACC,
        EDESC: item.EDESC,
        EXPDesc: item.EXPDesc,
        EXPGroup: item.EXPDesc,
        MAPPING: item.MAPPING,
        NOTE: item.NOTE,
        TDESC: item.TDESC,
    }));
}; /*  ACCCODE ALTERACC EDESC EXPDesc EXPGroup MAPPING NOTE TDESC */

function handleSelections(aArrays) {
    try {
        // Validate array length
        if (!Array.isArray(aArrays) || aArrays.length < 6) {
            throw new Error("aArrays must be an array with at least 6 elements (0–5).");
        }

        let alertMessage = aArrays[0];   // fixed alert
        let notSelect = aArrays[5];   // fixed fallback
        let choices = aArrays.slice(1, 5).filter(Boolean); // only keep defined values

        // Validate alert and notSelect
        if (!alertMessage) {
            throw new Error("Alert message [0] is missing.");
        }
        if (!notSelect) {
            throw new Error("Not select [5] is missing.");
        }

        // Build dialog options
        let dialogOptions = {
            title: "NEW TRAVEL EXPENSES",
            messageHtml: alertMessage,
            buttons: []
        };

        // Add dynamic buttons for selections 1–4
        choices.forEach(choice => {
            dialogOptions.buttons.push({
                text: choice,
                onClick: function () {
                    aPopUpAddForm(1, 1, new Date(), true, choice.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()));
                }
            });
        });

        // Always add the "Not select" option
        dialogOptions.buttons.push({
            text: notSelect,
            onClick: function () {
                aPopUpAddForm(1, 1, new Date(), false, "");
            }
        });

        // Debug: log the dialogOptions so you can inspect it
        console.log("Dialog Options:", dialogOptions);

        // Show dialog (requires DevExtreme version that supports custom)
        if (DevExpress.ui.dialog.custom) {
            DevExpress.ui.dialog.custom(dialogOptions);
        } else {
            // Fallback if custom() is not available
            alert("DevExpress.ui.dialog.custom is not available in this version.\n\n" +
                "Dialog Options:\n" + JSON.stringify(dialogOptions, null, 2));
        }

    } catch (err) {
        // Catch and show any errors
        console.error("Error in handleSelections:", err);
        alert("Error in handleSelections:\n" + err.message);
    }
}

var aNowDte = new Date()
// Local storage values (mutable if you plan to update them later)
let aaXToX = localStorage.getItem("aaXXoX"); //localStorage["aaXXoX"];
let aaXNoX = localStorage.getItem("aaXXuX"); //localStorage["aaXXuX"];
let aaPXXI = localStorage.getItem("aPXIXD"); //localStorage["aPXIXD"];
let aaMXXT = localStorage.getItem("aDXMenuTitle"); //localStorage["aDXMenuTitle"]; // 
let aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492"; // Master Page
let aaERTYPE = "400" //Accounting code group  

let aaPXIXD = localStorage.getItem("aPXIXD"); //localStorage["aPXIXD"];
let aaEnt = aaPXIXD.includes("X");
let aaUsrN = localStorage.getItem("aaXXuX"); //localStorage["aaXXuX"];
let aaFullName = localStorage.getItem("asFTNAME"); //localStorage["asFTNAME"];
let aaSFID = localStorage.getItem("asSTFID").trim(); //let asStaffID = localStorage.getItem("asSTFID"); //localStorage["asSTFID"];

showPreviousYearPopup(function (aNowDte) {
    var aDatabasea = "ExtraOnLine.dbo.TaskControl";
    var aKeyField = "TaskGroup";
    var aKeyIDa = aaPXIXD; // program name
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
                            try {
                                line = line.trim().replace(/,$/, "");
                                line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                                return JSON.parse(line);
                            } catch (err) {
                                if (!line || line.trim() === "") {
                                    DevExpress.ui.dialog.alert("Variables = " + item.TaskName + " there is EMPTY line (need to delete)", "Error");
                                } else {
                                    DevExpress.ui.dialog.alert("Variables = " + item.TaskName + " parsing line: " + line, "Error");
                                }
                                return null; // Skip this line
                            }
                        })
                        .filter(obj => obj !== null) // Remove any failed parses
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
            //const aaresult = aObjects.aaLimitGrp.find(item => item.code === "O/Seas Trav-Accom.");
            //const aalmtamt = aaresult ? aaresult.lmtamt : null; // Get lmtamt if found, otherwise null
            const aaLimitedAmt = aObjects.aaLimitedAmt;

            const aCurrenciesList = aObjects.aCurrenciesList;
            const divisionsList = aObjects.divisionsList;
            const aaDeptList = aObjects.aaDeptList;

            const aaGiftLmt = aVARs.aaGiftLmt;
            const aaEntertainLmt = aVARs.aaEntertainLmt;
            const aaDECSTATUS = aVARs.DECSTATUS;

            //==== Corporate Card Setup ==========================
            let aaCARDIDaa = "";
            const trimmedStaffID = aaSFID.trim(); //aaSFID
            // ค้นหาข้อมูลพนักงานจาก EMPID
            const aaRESULaa = aObjects.CORPREG.find(item => item.EMPID.trim() === trimmedStaffID);
            const cardIdList = aaRESULaa && aaRESULaa.CardID
                ? ["", aaRESULaa.CardID] // "" = no card
                : [""];
            const aBankIDNO = aaRESULaa && aaRESULaa.VCode ? aaRESULaa.VCode : "";
            const aBankName = aaRESULaa && aaRESULaa.VName ? aaRESULaa.VName : "";

            const cardIdOptions = cardIdList.map(id => ({
                CardID: id,
                Label: id === "" ? "NOT USE" : id  // not use
            }));
            if (!aaRESULaa) {
                console.log("No Staff ID: " + trimmedStaffID);
            } else if (aaRESULaa.CardID && aaRESULaa.CardID !== "" && aaRESULaa.CardID !== "0") {
                aaCARDIDaa = aaRESULaa.CardID;
                console.log("CardID: " + aaCARDIDaa);
            } else {
                console.log("found Staff ID but CardID is empty or = 0");
            }
            let HAVECORPCARD = (aaCARDIDaa === "" ? false : true);
            //=============================================================
            var aaPFDMI = isLocalHost();
            var afqrFull = "pageID='" + aaPXIXD + "' "
            var afURL = `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/${aaXTXB}/all`;

            fetch(afURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "@": btoa(afqrFull) })
            })
                .then(response => response.json()) // Assuming the response is JSON
                .then(data => {
                    aObjMPage = data;
                    var aaKeyField = aObjMPage[0].PrimaryKey;
                    var aaTBKey = aObjMPage[0].TBKey;
                    // TOP PRG
                    $(() => {
                        var aaPFDMI = isLocalHost();
                        //var aaXToX = localStorage["aaXXoX"];
                        //let aaXToX = localStorage.getItem("aaXXoX"); //localStorage["aaXXoX"];
                        var aaOnInitExpGroupCode = "400"
                        var aaOnInitExpGroupDesc = "Travel & Entertainment"
                        var aaOnInitAccDesc = "Travel & Entertainment"
                        var TaaERTYPE = "800" // TRF Group

                        // //TRF Loading (for dropdown) <-- START HERE
                        // let Taxqr2S = `Where PayToCode LIKE '%${aaSFID}' and ID = 1`; //ExpGroupCode LIKE '%${TaaERTYPE}%' and  ERODesc01
                        // let TaxFieldSelected = "HeadRefNo,ExpGroupCode,Department,Division,ERODesc01,ERODesc02,ERODesc03,EROCheck01,EROCheck03,ERORefNo1,PBatchNo,EROAmount1,RefundedAmount"
                        // let TaxFullBody = `Select ${TaxFieldSelected} From ExtraOnLine.dbo.TRVREQF ${Taxqr2S}`;
                        // fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(TaxFullBody) }), redirect: "follow" })
                        //     .then(response => response.json())
                        //     //
                        //     .then(TacData => { //TRF 
                        //         //Account Code Loading (dropdown)
                        //         let aaTRFGroup01 = TacData; //<-- to this

                        let axqr2S = `Where EXPGroup LIKE '%${aaERTYPE}%'`; //"Where EXPGroup LIKE '%" + aaERTYPE + "%'" 
                        let axFieldSelected = "ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE,EXPGroup,EXPDesc"
                        let axFullBody = `Select ${axFieldSelected} From ExtraOnLine.dbo.ACCOUNTCHART ${axqr2S}`
                        fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(axFullBody) }), redirect: "follow" })
                            .then(response => response.json())
                            .then(acData => {
                                var aaSubGroup01 = acData; //Account Code 
                                let aaDivisionC = (localStorage["agbNewDiv"] === undefined) ? localStorage["asDIV"] : localStorage["agbNewDiv"];
                                let aaDeptC = (localStorage["agbNewDept"] === undefined) ? localStorage["asDEPT"] : localStorage["agbNewDept"];
                                let aDivisionC = aaDivisionC;
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

                                        var aMMaMx = localStorage["MMaMx"];
                                        var aRRgRs = aMMaMx.split("0");
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
                                        var asDepartment = aaDeptC    //localStorage["asDEPT"];
                                        var asDivision = localStorage["asDIV"];
                                        var gbNewDiv = asDivision;    // for change div
                                        var gbNewDept = asDepartment; // for change div
                                        var asStaffEmail = localStorage["asEMAIL"];
                                        //----- Variables for Check Gift/Entertain Limit
                                        var asOverLimitAmt = 0;
                                        //----------------------------------------------
                                        var aqrFull = "ExpGroupCode = '" + aaERTYPE + "' and " + "PayToCode = '" + asStaffID + "'" // scopes based permission (View Only Login Name)  ExpensesCode LIKE aaOnInitAccCode
                                        var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                        var aSettings = { "url": aurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };
                                        var aaAllData;
                                        var aaDropdownData;
                                        var aaDropdownTRF;

                                        $("#gridContainer").dxDataGrid({

                                            dataSource: new DevExpress.data.CustomStore({
                                                key: "REFNO",
                                                loadMode: "omit",
                                                //load: function () { return $.post(aSettings).done(function (resp) { aaAllData = resp }); },   //console.log(resp);
                                                load: function () { // summary
                                                    return $.post(aSettings).then(function (resp) {
                                                        aaAllData = resp;

                                                        const grouped = {};
                                                        aaAllData.forEach(row => {
                                                            const key = row.HeadRefNo;
                                                            if (!grouped[key]) {
                                                                grouped[key] = {
                                                                    ...row,
                                                                    sumRefund: 0,
                                                                    sumAmount: 0,
                                                                    countRefund: 0
                                                                };
                                                            }
                                                            grouped[key].sumRefund += row.RefundedAmount || 0; //Amount
                                                            grouped[key].sumAmount += row.Amount || 0;
                                                            grouped[key].countRefund += 1;
                                                        });

                                                        const finalData = Object.values(grouped).filter(row => row.ID === 1);
                                                        return finalData;
                                                    });
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
                                            elementAttr: {
                                                class: "custom-datagrid"
                                            },
                                            allowColumnReordering: true,
                                            allowColumnResizing: true,
                                            columnMinWidth: 10,
                                            columnChooser: {
                                                enabled: true,  //false // true
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
                                                allowedPageSizes: [10, 15],
                                                showNavigationButtons: true,
                                                showInfo: true
                                            },
                                            showBorders: true,
                                            groupPaging: true,
                                            showColumnLines: true,
                                            showRowLines: true,
                                            rowAlternationEnabled: false,// true, //true,
                                            focusedRowEnabled: false,
                                            wordWrapEnabled: true,
                                            cacheEnabled: false,
                                            columnAutoWidth: true,

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
                                                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'TRAVELnEXPENSES' + '.xlsx');
                                                    });
                                                });
                                                e.cancel = true;
                                            },
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
                                                e.data.ReqDate = new Date()
                                                e.data.ExpensesCode = "" //aaOnInitAccCode
                                                e.data.ExpensesDescription = aaOnInitAccDesc ////aaOnInitAccDesc
                                                e.data.Currency = "THB"
                                                e.data.Xrate = 1
                                                e.data.Amount = 0;
                                                e.data.EROAmount1 = 1
                                                e.data.EROAmount2 = 0
                                                e.data.ERODesc02 = ""
                                                e.data.ERODesc03 = ""
                                                e.data.ERODesc04 = ""
                                                e.data.ERORefNo1 = ""
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
                                                    if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ERStatus" || e.dataField === "PSPvNO" || e.dataField === "PSPvDate" || e.dataField === "LocalAmount" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "PayToCode" || e.dataField === "PayToName")) { //|| e.dataField === "Department"
                                                        e.editorOptions.disabled = true;
                                                    }
                                                }
                                            },
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
                                                { // Edit and View Button
                                                    type: "buttons",
                                                    width: 40,
                                                    buttons: [
                                                        { // Edit Button
                                                            hint: "Edit",
                                                            icon: "fas fa-pen", //"fas fa-pen", // 
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === false) //return !e.row.isEditing; //&& e.row.data.Confirmed === false
                                                            },
                                                            onClick: function (e) {
                                                                asDepartment = e.row.data.Department;
                                                                asDivision = e.row.data.Division; //xxddxx
                                                                //$("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate, e.row.data.ERORefNo5);
                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                            }
                                                        },
                                                        { // View Button
                                                            hint: "View",
                                                            icon: "fas fa-search", //"fas fa-pen", // 
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === true); //return !e.row.isEditing; //&& e.row.data.Confirmed === false
                                                            },
                                                            onClick: function (e) {
                                                                asDepartment = e.row.data.Department;
                                                                asDivision = e.row.data.Division; //xxddxx
                                                                aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate, e.row.data.ERORefNo5);
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                            }
                                                        },
                                                    ]
                                                },
                                                { // Del button
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
                                                        },
                                                        { // UN-Confirm
                                                            hint: "UN-Confirm",
                                                            icon: "fas fa-times-circle",
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === true && e.row.data.HODApproved === false) //return !e.row.isEditing;
                                                            },
                                                            onClick: function (e) {
                                                                let axHODName = e.row.data.Vendor02Note;
                                                                let getvalues = { aaHODAppEmail: aaHODAppEmail, axHODName: axHODName } // aAddress2Do: aRequesterName + "</div>"
                                                                let aAlertUnC = aVARs.ALERT04.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                let result = DevExpress.ui.dialog.confirm(aAlertUnC, "UN-CONFIRMED ?");
                                                                // let result = DevExpress.ui.dialog.confirm("Are you sure you want to Un-Confirmed to Edit this Record ? <br> Send Email to <br>" + e.row.data.Vendor02Note + "[" + aaHODAppEmail + "]" + " <br><p style='color:Red; font-size: 12px;' ><br><p style='color: grey; font-size: 10px;'></p>Call back this record to Edit YES/NO ?", "UN-CONFIRMED ?"); // 
                                                                result.done(function (dresult) {
                                                                    if (dresult) {
                                                                        // mark Confirmed field
                                                                        let aERStatus = "Register" /// "Confirmed wait for HR"
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
                                                                        let aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES REIMBURSEMENT <br> CALLBACK";
                                                                        let aApproverName = aaHODAppName         //aaHRAppName //"Wikran" + " [HR]"         // HR Approver Name
                                                                        let aApproverEmail = $.trim(aaHODAppEmail) // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                        let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                        let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                                        let aSubject = aaOnInitExpGroupDesc + " EXPENSES REIMBURSEMENT - CALLBACK"
                                                                        let aTHeadRefNo = e.row.data.HeadRefNo
                                                                        let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>"; //<a href='https://www.w3schools.com'>Visit W3Schools</a>
                                                                        let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName, aTHeadRefNo: aTHeadRefNo } // aAddress2Do: aRequesterName + "</div>"
                                                                        let aMessage01 = aVARs.UNCONFIRM.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);

                                                                        var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #9700F9; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#F5E6FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                                                        aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.event.preventDefault();
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        aMessageAlert("EMAIL" + aMessage, "grey")
                                                                    }
                                                                });

                                                            }
                                                        },
                                                    ]
                                                },
                                                { // Change Division / Print
                                                    type: "buttons",
                                                    visible: (aVARs.BTPPDF === 0 || aVARs.CHGALLDIV === 1),
                                                    width: 60,
                                                    buttons: [
                                                        {
                                                            hint: "Change Division",
                                                            icon: "fas fa-people-arrows",//"card" //"fas fa-sync-alt", //<i class="fas fa-exchange-alt"></i> as fa-people-arrows <i class="fas fa-sync-alt"></i>
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === false && aVARs.CHGALLDIV === 1) //return !e.row.isEditing; //&& e.row.data.Confirmed === false
                                                            },
                                                            onClick: function (e) {
                                                                aPopUpChangeForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate); //popupChangeDiv
                                                            }
                                                        }, 
                                                        {
                                                            hint: "Print",
                                                            icon: "fas fa-print",
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === true) && (aVARs.BTPPDF === 0)//false; && e.row.data.Confirmed === true aGenPDF4HTML
                                                            },
                                                            onClick: function (e) {
                                                                aRPTPrint2Pdf(e.row.data.HeadRefNo, aaPFDMI, "TMasterReport", "Travel & Entertainment") //T2302163889 Cylstal Report
                                                                e.component.refresh(true);
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
                                                    dataType: "string",
                                                    sortOrder: "desc",
                                                    //groupIndex: 0,
                                                    width: 120,
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "countRefund", //"ID",
                                                    //sortOrder: "asc",
                                                    dataType: "number",
                                                    caption: "Item",
                                                    width: 90,
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "ReqDate",
                                                    caption: "Requested Date",
                                                    dataType: "date",
                                                    format: "dd/MM/yyyy",
                                                    width: 90,
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "ERORefNo5",
                                                    caption: "LINK REF#",
                                                    editorType: "dxTextBox",
                                                    width: 110,
                                                    editorOptions: { width: 110, readOnly: true, },
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "Department",
                                                    caption: "Dept.",
                                                    dataType: "strimg",
                                                    width: 70,
                                                    visible: false,
                                                },
                                                {
                                                    dataField: "ERORefNo4",
                                                    caption: "Bill No",
                                                    dataType: "string",
                                                    width: 110,
                                                    visible: false,
                                                },
                                                {
                                                    dataField: "ERODate01",
                                                    caption: "Bill Date",
                                                    dataType: "date",
                                                    format: "dd/MM/yyyy",
                                                    width: 100,
                                                    visible: false,
                                                },
                                                {
                                                    dataField: "ERORefNo3",
                                                    caption: "Expenses Type.",
                                                    dataType: "string",
                                                    width: 200,
                                                    visible: false,
                                                },
                                                {
                                                    dataField: "ERODesc02",
                                                    caption: "Description",
                                                    dataType: "string",
                                                    width: 200,
                                                    visible: true,
                                                    cellTemplate: function (container, options) {
                                                        $("<div>")
                                                            .addClass("no-wrap")
                                                            .text(options.value)
                                                            .appendTo(container);
                                                    }
                                                },
                                                {
                                                    dataField: "sumAmount",
                                                    caption: "Original currency",
                                                    dataType: "number",
                                                    format: { type: "fixedPoint", precision: 2 },
                                                    width: 150,
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "Currency",
                                                    caption: "Currency",
                                                    dataType: "string",
                                                    width: 100,
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "Xrate",
                                                    caption: "X-Rate",
                                                    dataType: "number",
                                                    format: { type: "fixedPoint", precision: 6 },
                                                    width: 100,
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "sumRefund", //"RefundedAmount",
                                                    caption: "Reimburse",
                                                    dataType: "number",
                                                    format: { type: "fixedPoint", precision: 2 },
                                                    width: 150,
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "ERStatus",
                                                    caption: "Status",
                                                    dataType: "string",
                                                    width: 180,
                                                    visible: true,
                                                },

                                            ],
                                            // summary
                                            summary: {
                                                recalculateWhileEditing: true,
                                                skipEmptyValues: false,
                                                totalItems: [
                                                    {
                                                        column: "sumAmount",
                                                        summaryType: "sum",
                                                        valueFormat: "#,##0.00",
                                                        showInGroupFooter: true,
                                                        alignByColumn: true,
                                                        displayFormat: "{0}",
                                                    },
                                                    {
                                                        column: "sumRefund",
                                                        summaryType: "sum",
                                                        valueFormat: "#,##0.00",
                                                        showInGroupFooter: true,
                                                        alignByColumn: true,
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
                                                        template: function () { return $("<div style='padding: 5px 5px;'/>") }
                                                    },
                                                    // {
                                                    //     location: "before",
                                                    //     template: function () {
                                                    //         return $("<div />")
                                                    //             //.addClass("informer")
                                                    //             .append(
                                                    //                 $("<span style='font-size: 13px; font-weight: bold; color: white; background-color: Purple; border-radius: 3px; border: 0px; padding: 1px 30px; ' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px;
                                                    //                     .text(aaOnInitExpGroupDesc.toUpperCase() + " EXPENSES FOR"),
                                                    //                 $("<br><center />"),
                                                    //                 $("<i class= 'fas fa-user-circle'><span />")   //; style='color: DarkGreen;
                                                    //                     //.addClass("name")
                                                    //                     .text(" " + $.trim(asFullName)),
                                                    //             );
                                                    //     }
                                                    // },
                                                    // {
                                                    //     location: "after",
                                                    //     widget: "dxButton",
                                                    //     options: {
                                                    //         icon: "fas fa-info",
                                                    //         text: "HELP",
                                                    //         type: "default",
                                                    //         stylingMode: "contained", // "outlined" contained
                                                    //         onClick: function () {
                                                    //             aPopupHelp("HELP", aVARs.HELP01)
                                                    //         }
                                                    //     }
                                                    // },
                                                    // {
                                                    //     location: "before",
                                                    //     template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                    // },
                                                    // {
                                                    //     location: "before",
                                                    //     template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                    // },
                                                    // {
                                                    //     location: "before",
                                                    //     template: function () { return $("<div style='padding: 5px 85px;'/>") }
                                                    // },
                                                    // {
                                                    //     location: "after",
                                                    //     widget: "dxButton",
                                                    //     visible: false,
                                                    //     options: {
                                                    //         icon: "fas fa-plus-circle",
                                                    //         text: "Add New",
                                                    //         hint: "Add new record",
                                                    //         type: "success",
                                                    //         stylingMode: "contained", // "outlined" contained
                                                    //         onClick: function () {
                                                    //             var aSelectVal1 = aArrays.aSELECTPRE[5] === 0 ? false : true
                                                    //             var aSelectVal2 = aArrays.aSELECTPRE[6] === 0 ? false : true
                                                    //             var aSelectVal3 = aArrays.aSELECTPRE[7] === "null" ? null : aArrays.aSELECTPRE[7]
                                                    //             if (aArrays.aSELECTPRE[8] === "YES") {
                                                    //                 var aTRFresult = DevExpress.ui.dialog.custom({
                                                    //                     title: aArrays.aSELECTPRE[1],  // Title from array
                                                    //                     message: aArrays.aSELECTPRE[0], // Message from array
                                                    //                     buttons: [
                                                    //                         { text: aArrays.aSELECTPRE[2], onClick: () => aSelectVal1 },   // Custom "YES"
                                                    //                         { text: aArrays.aSELECTPRE[3], onClick: () => aSelectVal2 }, // Custom "NO"
                                                    //                         { text: aArrays.aSELECTPRE[4], onClick: () => aSelectVal3 }  // Exit without doing anything
                                                    //                     ],
                                                    //                     position: {
                                                    //                         of: window,  // Position relative to the window
                                                    //                         my: "center", // Center horizontally
                                                    //                         at: "center", // Center vertically
                                                    //                         offset: "0 -250" // Move up by 100px (y-axis)
                                                    //                     }
                                                    //                 }).show();

                                                    //                 aTRFresult.done(function (dresult) {
                                                    //                     if (dresult !== null) { // Ignore if "CANCEL" was clicked
                                                    //                         // //
                                                    //                         aPopUpAddForm(1, 1, aNowDte, dresult);
                                                    //                         alert(dresult)
                                                    //                     }
                                                    //                 });
                                                    //             } else {
                                                    //                 //aPopUpAddForm(1, 1, aNowDte, false, false);
                                                    //             }


                                                    //         }

                                                    //     }
                                                    // },
                                                    //);

                                                    //e.toolbarOptions.items.push(
                                                    // {
                                                    //     location: "before",
                                                    //     template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                    // },
                                                    // {
                                                    //     location: "before",
                                                    //     template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                    // },
                                                    // {
                                                    //     location: "before",
                                                    //     template: function () { return $("<div style='padding: 5px 85px;'/>") }
                                                    // },
                                                    { // Add New
                                                        location: "after",
                                                        locateInMenu: "auto",
                                                        widget: "dxButton",
                                                        options: {
                                                            icon: "fas fa-plus-circle",
                                                            text: "Add New",
                                                            hint: "Add New Record",
                                                            type: "success",
                                                            stylingMode: "contained", //"outlined", //
                                                            onClick: function () {
                                                                try {
                                                                    let alertMessage = aArrays.aSELECTMUL[0];   // fixed alert
                                                                    let dialogTitle = aArrays.aSELECTMUL[1];   // fixed title
                                                                    let notSelect = aArrays.aSELECTMUL[6];   // fixed fallback
                                                                    // filter out null/undefined/empty strings from [2]–[5]
                                                                    let choices = aArrays.aSELECTMUL.slice(2, 6).filter(v => v && v.trim() !== "");

                                                                    // create popup container dynamically
                                                                    let $popup = $("<div>").appendTo("body");

                                                                    $popup.dxPopup({
                                                                        title: dialogTitle,
                                                                        contentTemplate: function (contentElement) {
                                                                            // show alert message (HTML)
                                                                            $("<div>")
                                                                                .html(alertMessage)
                                                                                .css({ "margin-bottom": "15px" })
                                                                                .appendTo(contentElement);

                                                                            // container for horizontal buttons
                                                                            let $buttonRow = $("<div>")
                                                                                .css({
                                                                                    display: "flex",
                                                                                    "justify-content": "center",
                                                                                    "gap": "10px",
                                                                                    "flex-wrap": "wrap"
                                                                                })
                                                                                .appendTo(contentElement);

                                                                            // add dynamic choice buttons
                                                                            choices.forEach(choice => {
                                                                                $("<div>").dxButton({
                                                                                    text: choice,
                                                                                    type: "default",
                                                                                    stylingMode: "contained",
                                                                                    onClick: function () { //xxddxx
                                                                                        $popup.dxPopup("instance").hide();
                                                                                        aPopUpAddForm(1, 1, new Date(), true, `Refer to ${choice}`);
                                                                                    }
                                                                                }).appendTo($buttonRow);
                                                                            });

                                                                            // add "Not select" button
                                                                            $("<div>").dxButton({
                                                                                text: notSelect,
                                                                                type: "danger",
                                                                                stylingMode: "outlined",
                                                                                onClick: function () {
                                                                                    $popup.dxPopup("instance").hide();
                                                                                    aPopUpAddForm(1, 1, new Date(), false);
                                                                                }
                                                                            }).appendTo($buttonRow);
                                                                        },
                                                                        width: "auto",
                                                                        height: "auto",
                                                                        maxWidth: 700,
                                                                        showTitle: true,
                                                                        visible: true,
                                                                        dragEnabled: true,
                                                                        closeOnOutsideClick: true,
                                                                        resizeEnabled: true,
                                                                        position: {
                                                                            my: "top center",
                                                                            at: "top center",
                                                                            of: window,
                                                                            offset: "0 75"
                                                                        }
                                                                    });
                                                                } catch (err) {
                                                                    console.error("Error in onClick:", err);
                                                                    alert("Error: " + err.message);
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {  // Help?
                                                        location: "after",          // right side
                                                        locateInMenu: "auto",       // ✅ will move into the overflow/settings menu if space is tight
                                                        widget: "dxButton",
                                                        options: {
                                                            icon: "help", //"fas fa-question",    // any DevExtreme icon or your own CSS class
                                                            hint: "Help",
                                                            text: "Help",   // ✅ text to display
                                                            //type: "success",
                                                            //stylingMode: "contained",
                                                            //showText: "Help, how to use",   // ✅ ensures text is shown alongside icon
                                                            onClick: function () {
                                                                aPopupHelp("HELP", aVARs.HELP01)
                                                            }
                                                        }
                                                    },
                                                    {
                                                        location: "after",
                                                        locateInMenu: "auto",
                                                        visible: (aVARs.BTPPDF === 1),
                                                        widget: "dxButton",
                                                        options: {
                                                            hint: "Print",
                                                            icon: "print", //"fas fa-print",
                                                            text: "PDF Print",
                                                            onClick: function(ev) {
                                                                // Get selected rows
                                                                var selected = dataGrid.getSelectedRowsData();
                                                
                                                                if (selected.length === 0) {
                                                                    DevExpress.ui.dialog.alert("Please select a row to print", "warning");
                                                                    return;
                                                                }
                                                
                                                                var rowData = selected[0]; // take the first selected row
                                                                if (rowData.ID === 1 && rowData.Confirmed === true) {
                                                                    aRPTPrint2Pdf(
                                                                        rowData.HeadRefNo,
                                                                        aaPFDMI,
                                                                        "TMasterReport",
                                                                        "Travel & Entertainment"
                                                                    );
                                                                    dataGrid.refresh();
                                                                } else {
                                                                    //DevExpress.ui.alert("Row not eligible for printing", "error", 2000);
                                                                    DevExpress.ui.dialog.alert("Row not eligible for printing", "error");
                                                                }
                                                            }
                                                        }
                                                    },
                                                    { //collapse
                                                        location: "after",
                                                        locateInMenu: "auto",
                                                        widget: "dxButton",
                                                        visible: false,
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
                                                    { // refresh
                                                        location: "after",
                                                        locateInMenu: "auto",
                                                        widget: "dxButton",
                                                        options: {
                                                            icon: "refresh",
                                                            hint: "Refresh",
                                                            onClick: function () {
                                                                dataGrid.refresh();
                                                            }
                                                        }
                                                    },
                                                    { //Export PDF
                                                        location: "after",
                                                        locateInMenu: "auto",
                                                        widget: "dxButton",
                                                        visible: arPDFEx,
                                                        options: {
                                                            icon: "exportpdf",
                                                            //text: "Export to PDF",
                                                            hint: "Export to PDF File",
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
                                                                            fontSize: 10
                                                                        }
                                                                        //}
                                                                    }
                                                                }).then(function () {
                                                                    doc.save('TravelANDExpenses' + '.pdf');
                                                                });
                                                            }
                                                        }
                                                    },
                                                    // {
                                                    //     location: "after",
                                                    //     locateInMenu: "auto",
                                                    //     widget: "dxButtonGroup",
                                                    //     options: {
                                                    //         items: [
                                                    //             { icon: "collapse", hint: "Collapse/Expand" },
                                                    //             { icon: "refresh", hint: "Refresh" },
                                                    //             { icon: "exportpdf", hint: "Export to PDF" }
                                                    //         ],
                                                    //         keyExpr: "icon",   // optional, helps identify items
                                                    //         onItemClick: function (ev) {
                                                    //             switch (ev.itemData.icon) {
                                                    //                 case "collapse":
                                                    //                     const expanding = e.component.option("grouping.autoExpandAll") === false;
                                                    //                     e.component.option("grouping.autoExpandAll", expanding);
                                                    //                     break;
                                                    //                 case "refresh":
                                                    //                     e.component.refresh();
                                                    //                     break;
                                                    //                 case "exportpdf":
                                                    //                     const doc = new jsPDF();
                                                    //                     DevExpress.pdfExporter.exportDataGrid({
                                                    //                         jsPDFDocument: doc,
                                                    //                         component: e.component
                                                    //                     }).then(() => doc.save("Export.pdf"));
                                                    //                     break;
                                                    //             }
                                                    //         }
                                                    //     }
                                                    // },
                                                    //     {
                                                    //     location: "after",
                                                    //     widget: "dxDropDownButton",
                                                    //     options: {
                                                    //         icon: "favorites",          // main icon for the dropdown button
                                                    //         //text: "Actions",         // optional label
                                                    //         displayExpr: "text",     // field to display in the list
                                                    //         keyExpr: "id",           // unique key for items
                                                    //         items: [
                                                    //             { id: "collapse", text: "Collapse/Expand", icon: "collapse" },
                                                    //             { id: "refresh", text: "Refresh", icon: "refresh" },
                                                    //             { id: "pdf", text: "Export to PDF", icon: "exportpdf" }
                                                    //         ],
                                                    //         onItemClick: function (ev) {
                                                    //             switch (ev.itemData.id) {
                                                    //                 case "collapse":
                                                    //                     const expanding = e.component.option("grouping.autoExpandAll") === false;
                                                    //                     e.component.option("grouping.autoExpandAll", expanding);
                                                    //                     break;
                                                    //                 case "refresh":
                                                    //                     e.component.refresh();
                                                    //                     break;
                                                    //                 case "pdf":
                                                    //                     const doc = new jsPDF();
                                                    //                     DevExpress.pdfExporter.exportDataGrid({
                                                    //                         jsPDFDocument: doc,
                                                    //                         component: e.component
                                                    //                     }).then(() => doc.save("Export.pdf"));
                                                    //                     break;
                                                    //             }
                                                    //         },
                                                    //         dropDownOptions: {
                                                    //             width: 200 // optional: control dropdown width
                                                    //         }
                                                    //     }
                                                    // }
                                                );


                                            }

                                        }).dxDataGrid("instance");

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
                                                                    dataField: "Vendor01",
                                                                    label: { text: "Corporate Card" },
                                                                    visible: HAVECORPCARD, // true,
                                                                    width: 150,
                                                                    editorType: "dxSelectBox",
                                                                    //editorType: "dxTextBox",
                                                                    editorOptions: {
                                                                        width: 150,
                                                                        readOnly: false,
                                                                        dataSource: cardIdOptions,
                                                                        valueExpr: "CardID",
                                                                        displayExpr: "Label",
                                                                        searchEnabled: true,
                                                                        value: asCardIDNO,
                                                                        onValueChanged: function (e) {
                                                                            asCardIDNO = e.value;
                                                                        },
                                                                        elementAttr: { class: "custom-editor" }
                                                                    }, //value: asDepartment,
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
                                                                    visible: false,
                                                                    editorOptions: { value: asDepartmenta, readOnly: true, width: 180, elementAttr: { class: "custom-editor" } },
                                                                },

                                                                {
                                                                    dataField: "Division",
                                                                    label: { text: "Division" },
                                                                    editorType: "dxTextBox",
                                                                    visible: false,
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

                                        // ADD/EDIT PopUp Form
                                        const aPopUpAddForm = (aRecNo, iData, idDate, aSetTravel, ReferText) => {
                                            var asTotalRecords;// = 0;
                                            var asFilterRec;// = 0;
                                            var asAllRow = [];
                                            var asFilterRow = [];
                                            var aaOverseasxx;
                                            var aaConferencexx;
                                            var aaPurposexx = "";
                                            var aaPurposeDescxx = "";
                                            var aaAccom = false;
                                            var aaNight = 0;
                                            var vNightv = false;
                                            var vPNightv = false;
                                            var aaTOFR;
                                            var aaLocalTC = false;
                                            var aaPFDMI = isLocalHost();
                                            var aTravelSC = aSetTravel;
                                            var editingMode = aTravelSC ? "popup" : "cell";
                                            var chooserMode = aTravelSC ? false : true;
                                            let CHK_PRE_V = false;
                                            let aTRFREFNO = "";
                                            let aTRFPRENO = "";
                                            let abConfirmed = false;
                                            if (ReferText && typeof ReferText === "string") {
                                                CHK_PRE_V = ReferText.toLowerCase().includes("pre");
                                                editingMode = CHK_PRE_V ? "cell" : "popup";
                                                chooserMode = editingMode === "cell" ? true : false;
                                                aTRFPRENO = CHK_PRE_V ? "P" : "";
                                                aTRFREFNO = CHK_PRE_V ? "" : "R";
                                            }

                                            let CHK_LABEL = CHK_PRE_V ? "PRE#[" : "TRF#[";

                                            var searchTermsLC = ['441', '404'];  // local & conference
                                            var searchTermsOC = ['401', '403'];  // overseas & Conference
                                            var searchTermsOT = ['.', '402', '403'];   // overseas & Training
                                            var searchTermsO = ['.', '403'];   // overseas traveling
                                            var searchTermsL = ['.', '404'];   // local traveling

                                            var xxxSubGroup01 = aaSubGroup01; //searchExpenses(aaSubGroup01, aaSrchTerm);
                                            let asCardIDNO = aaCARDIDaa;
                                            if (aRecNo === 1) {
                                                var aaaTitle = " [ADD]"
                                                let aaID = 1
                                                let axRunRun = aGetDateRef(aaOnInitExpGroupDesc.substring(0, 1));
                                                let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                var aaiHeadRef = axRunRun;
                                                asDepartment = localStorage["asDEPT"];
                                                asDivision = localStorage["asDIV"];
                                                var asOverLimitAmt = 0; // Check Over Limit
                                                var aaERStatuss = "Register"
                                                let aTrueORFalseB = false;
                                                abConfirmed = false;

                                                aTRFREFNO = aTravelSC ? "R" : "";
                                                if (aTRFREFNO === "") {
                                                    aTRFPRENO = "";
                                                } else {
                                                    aTRFPRENO = CHK_PRE_V ? "P" : "R";
                                                }

                                                var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), ERODate01: idDate, ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment, Division: asDivision, ERODesc06: asStaffEmail, ERODesc02: "", ERODesc03: "", ERODesc04: "", ReqDate: aNowDte, ExpensesCode: "", ExpensesDescription: aaOnInitAccDesc, Currency: "THB", Xrate: 1, ExpGroupCode: aaOnInitExpGroupCode, ExpGroupDescEng: aaOnInitExpGroupDesc, ERStatus: aaERStatuss, ERORefNo1: "", ERORefNo2: "", ERORefNo3: "", ERORefNo5: aTRFPRENO, EROAmount1: 1, EROAmount2: 0, EROCheck01: 1, EROCheck02: 1, NeedPayment: 0, RefundedAmount: 0, LimitedAmount: 0, Confirmed: aTrueORFalseB };
                                                var ObjRowData = JSON.stringify(ObjKeyData);
                                                sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                var aXXData = function () { return $.post(aaxSettings).done(); }
                                                iData = aXXData[0];

                                            } else {

                                                var aaiHeadRef = aRecNo;
                                                var aaaTitle = " [EDIT]"
                                                aaOverseasxx = iData.EROCode01.charAt(0) === "O";
                                                aaConferencexx = iData.EROCode02.charAt(0) === "C";
                                                aaPurposexx = iData.EROCode02; //Conference,Training,Traveling
                                                asOverLimitAmt = 0; //Corporate Gifts// And Donations //Over Limited
                                                if (iData.ERORefNo3 === "Corporate Gifts" && iData.EROAmount2 > aaGiftLmt) {
                                                    asOverLimitAmt = iData.EROAmount2;
                                                }
                                                if (iData.ERORefNo3 === "Entertainment" && iData.EROAmount2 > aaEntertainLmt) {
                                                    asOverLimitAmt = iData.EROAmount2;
                                                }
                                                if (aaOverseasxx && aaPurposexx === "Conference") { // 2.OverseasConference
                                                    xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsOC);
                                                } else if (!aaOverseasxx && aaPurposexx === "Conference") { // 1.LocalConference
                                                    xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsLC);
                                                } else if (aaOverseasxx && aaPurposexx === "Training") { //3.OverseasTraining
                                                    xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsOT);
                                                } else if (aaOverseasxx && aaPurposexx === "Traveling") { // 4.OverseasTraveling
                                                    xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsO);
                                                } else if (!aaOverseasxx && aaPurposexx === "Traveling") { // 5.LocalTraveling
                                                    xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsL);
                                                } else { //not match
                                                    xxxSubGroup01 = aaSubGroup01; //searchExpenses(aaSubGroup01, searchTermsL);
                                                }
                                                asDivision = iData.Division;
                                                asCardIDNO = iData.Vendor01;
                                                aaAccom = iData.ERORefNo3.includes("Accom.");
                                                aaTOFR = iData.ERORefNo3;
                                                abConfirmed = iData.Confirmed;
                                                let aaReadOnly = iData.Confirmed;

                                                aTRFREFNO = iData.ERORefNo5;
                                                var firstChar = aTRFREFNO ? aTRFREFNO.substring(0, 1).toUpperCase() : "";
                                                editingMode = (firstChar === "R") ? "popup" : "cell"; //|| firstChar === "P"
                                                chooserMode = editingMode === "cell" ? true : false;
                                                CHK_LABEL = firstChar === "P" ? "PRE#[" : "TRF#[";
                                                aTRFPRENO = firstChar
                                                ReferText = firstChar === "P" ? "Refer to Pre-Approved" : "Refer to Travel Requisition"
                                                CHK_PRE_V = firstChar === "P" ? true : false;

                                            }
                                            var aaSchRefx = "HeadRefNo LIKE '%" + aaiHeadRef + "%'" // (DataGrid View Only This New Item)
                                            aqrFull = aaSchRefx;
                                            var aaxurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                            var aaxSettings = { "url": aaxurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };

                                            $(() => {
                                                var aaLastLineNo = 1;
                                                if (aTRFPRENO === "") { //editingMode === "cell" //aTRFPRENO === ""
                                                    var aForm2Add = "Add-form01"
                                                } else {
                                                    var aForm2Add = "Add-form"
                                                }
                                                if (editingMode === "cell") {
                                                    var aSwitch2Add = "editModeSwitch01"
                                                } else {
                                                    var aSwitch2Add = "editModeSwitch"
                                                }

                                                var gbxRateV = 1;
                                                var activeTabIndex = 0;
                                                const popup = $("#popupContainerAdd").dxPopup({
                                                    title: "Travel &  Expenses Reimbursement" + aaaTitle,
                                                    width: '1300px',
                                                    position: { offset: "0 -140" }, //{offset: "0 -180"}, position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                                    visible: true,
                                                    fullScreen: true,
                                                    showCloseButton: false,
                                                    showTitle: true,
                                                    dragEnabled: true,
                                                    closeOnOutsideClick: false,
                                                    resizeEnabled: true,
                                                    onInitialized: function (e) { e.component.registerKeyHandler("escape", function (arg) { }) },     // ignore when press 'ESC'  

                                                    contentTemplate: function () {
                                                        return $("<div />").append(
                                                            $("<p><div id='" + aForm2Add + "'></div></p>"),   //aSwitch2Add
                                                            $("<p><div id='" + aSwitch2Add + "'></div></p>"), //editModeSwitch <div id='row-alternation'></div>
                                                            $("<p><div id='Add-dxDataGrid'></div></p>"),
                                                            $("<span id='Add-popupexit'></span>"),
                                                            $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                            $("<span id='aConfirm'></span>")
                                                        );
                                                    },
                                                    onContentReady: function (e) {
                                                        //
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
                                                                    if (aRecNo === 1) {
                                                                        let result = DevExpress.ui.dialog.confirm("<center><i class='fas fa-save custom-icon-size'></i>" + " Press 'YES' To SAVE </center>", "SAVE BEFORE EXIT ?");
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

                                                $("#Add-popupexitx").dxButton({
                                                    icon: "fas fa-times",
                                                    type: "danger",
                                                    text: "EXIT",
                                                    visible: true,
                                                    onClick: function (e) {
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        if (aRecNo === 1) {
                                                            let result = DevExpress.ui.dialog.confirm("<center><i class='fas fa-save custom-icon-size'></i>" + " Press 'YES' To SAVE </center>", "SAVE BEFORE EXIT ?"); // 
                                                            result.done(function (dresult) {
                                                                if (dresult) {
                                                                    // not delete 
                                                                } else {
                                                                    // delete data
                                                                    let aSQLCommand = "use ExtraOnLine; DELETE FROM EXPREIM WHERE HeadRefNo = '" + aaiHeadRef + "'"
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
                                                });

                                                $("#Add-popupexit").dxButton({
                                                    icon: "fas fa-times",
                                                    type: "danger",
                                                    text: "EXIT",
                                                    visible: true,
                                                    onClick: function (e) {
                                                        $("#gridContainer").dxDataGrid("instance").refresh();

                                                        if (aRecNo === 1) {
                                                            let result = DevExpress.ui.dialog.confirm("<center><i class='fas fa-save custom-icon-size'></i>" + " Press 'YES' To SAVE </center>", "SAVE BEFORE EXIT ?");
                                                            result.done(function (dresult) {
                                                                if (dresult) {
                                                                    /* old 
                                                                    // not delete 
                                                                    let aObjRowData = JSON.stringify(iData);
                                                                    console.log("aObjRowData = ", aObjRowData)
                                                                    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX)); //EROCode04
                                                                    */
                                                                    // console.log("==YES---")
                                                                    let aObjRowData = JSON.stringify(iData); //EROCode04
                                                                    console.log("JSON.stringify(iData) = ", aObjRowData)
                                                                    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                                        .then(response => {
                                                                            console.log("First Update: ", response);
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
                                                                } else {
                                                                    // delete data
                                                                    let aSQLCommand = "use ExtraOnLine; DELETE FROM EXPREIM WHERE HeadRefNo = '" + aaiHeadRef + "'"
                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                }
                                                            });
                                                        } else {
                                                            // edit mode
                                                            let aObjRowData = JSON.stringify(iData); //EROCode04
                                                            console.log("Edit Mode = ", aObjRowData)
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
                                                                        //console.error("Update failed: ", response.error);
                                                                    }
                                                                })
                                                                .catch(error => {
                                                                    console.error("Request error: ", error);
                                                                });
                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                        }
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        // clear variables
                                                        //asERStatus = iData.ERStatus;
                                                        // asERODesc02 = ""; //Destination	ERODesc02
                                                        // asERODesc03 = ""; //Purpose of Trip
                                                        // asERORefNo1 = ""; //Purpose of Trip List
                                                        // asEROCheck01 = false; //Overseas
                                                        // asEROCheck02 = false; //Need Roaming    
                                                        // asEROCheck03 = false; //Self-Booking                                    
                                                        // asERODate02 = new Date() //Travel Start Date	
                                                        // asERODate03 = new Date() //Travel End Date	
                                                        // asRefundedAmount = 0; //Estimated Cost	
                                                        // asVendor01 = ""; //Departure Flight	
                                                        // asERODesc04 = ""; //Arrival Flight	
                                                        // asEROAmount1 = 0; //Ticket Price	EROAmount1
                                                        // asERODesc05 = ""; //Hotel	ERODesc05
                                                        // asNote = ""; //Remark	Note
                                                        // asCardIDNO = "";

                                                        popup.hide()
                                                    }
                                                });

                                                $("#aConfirm").dxButton({
                                                    hint: "Confirm and send to HOD",
                                                    icon: "fas fa-check-circle",
                                                    type: "success",
                                                    text: "CONFIRM",
                                                    visible: true,
                                                    onClick: function (e) {
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
                                                                if (key === "ERODesc02" && value === "") {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "ERODesc04" && value === "") {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "ERODesc03" && value === "") {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "Amount" && value === 0) {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be 0.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "Xrate" && value === 0) {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be 0.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "RefundedAmount" && value === 0) {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be 0.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "ERORefNo3" && value === "") {
                                                                    DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "ERORefNo3" && !value.includes("Accom.") && row.EROAmount4 !== 0) {
                                                                    DevExpress.ui.dialog.alert(`Night must be 0.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                    return false;
                                                                }
                                                                if (key === "ERORefNo3" && value.includes("Accom.") && row.EROAmount4 === 0) {
                                                                    DevExpress.ui.dialog.alert(`Night cannot be 0.`, "ERROR"); // (Key: ${key}, Value: ${value})
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

                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                        let aDivSxx = "Where HeadRefNo = '" + aaiHeadRef + "'"
                                                        let aFieldSelectedxx = "HeadRefNo,TotalReimburse"
                                                        let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.EXPREIM_400 " + aDivSxx; //alert(aFullBody)                                           
                                                        //console.log(aFullBodyxx, aaHODApprover);
                                                        fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                            .then(response => response.json())
                                                            //
                                                            .then(ppData => {
                                                                var aaTotalValue = ppData;
                                                                var aaTotalReim = aaTotalValue[0].TotalReimburse
                                                                //alert(aaTotalReim)
                                                                //alert(aaHODApprover.length)
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
                                                                        break;
                                                                    }
                                                                }
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
                                                                // send mail to first Approver 
                                                                aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                                aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail; || aCheckXrnC === false

                                                                // Check empty fields
                                                                var aDatabasea = "ExtraOnLine.dbo.EXPREIM";
                                                                var aKeyField = "HeadRefNo";
                                                                var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724"
                                                                var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";
                                                                var condition = item => item.Amount === 0 || item.ERODesc02 === "" || item.ERODesc03 === "" || item.ERODesc04 === "" || item.ERORefNo3 === "" || item.RefundedAmount === 0 || item.Xrate === 0 || (item.Xrate === 1 && item.Currency !== "THB") || (item.Xrate !== 1 && item.Currency === "THB");

                                                                aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                                    .then(atestCehcka => {
                                                                        if (atestCehcka === 1) { DevExpress.ui.dialog.alert(aVARs.ALERT01, "INPUT ERROR"); }
                                                                        else {
                                                                            if (asFilterRec > 0) {
                                                                                //asFilterRow  asOverLimitAmt asFilterRec asTotal
                                                                                // DevExpress.ui.dialog.alert("<p style='color: darkblue; font-size: 18px;' ><i class='fas fa-info-circle custom-icon-size'></i> " + "Please wait while generate Gift/Receive Data","GEN GIFT/RECEIVE")                                                                                        
                                                                            }
                                                                            let newGiftREFNO = aaiHeadRef.replace(/T/g, "G")
                                                                            let agetvalues1 = { newGiftREFNO: newGiftREFNO }
                                                                            //let aGiftAlertW = `and <b>Generate Gift/Receive</b>,<u> please completed [${newGiftREFNO}] at Gift/Receive MENU</u>` //aVARs.ALERT03 //
                                                                            let aGiftAlertW = aVARs.ALERT03.replace(/\${(.*?)}/g, (amatch, pp1) => agetvalues1[pp1] || amatch);
                                                                            // console.log("aGiftAlertW ", aGiftAlertW)
                                                                            let aGenGiftWord = asFilterRec > 0 ? aGiftAlertW : ".";
                                                                            // console.log("aGenGiftWord ", aGenGiftWord)

                                                                            let getvalues = { newGiftREFNO: newGiftREFNO, aGenGiftWord: aGenGiftWord, aaHODAppName: aaHODAppName, aaHODAppEmail: aaHODAppEmail, xxChkLenxx: xxChkLenxx }
                                                                            // console.log("getvalues ", getvalues)

                                                                            let aTrvAlert02 = aVARs.ALERT02.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                            //let aTrvAlert = "<p style='color: darkblue; font-size: 18px;' ><i class='fas fa-info-circle custom-icon-size'></i> " + " Press [YES] to confirm and send email to HOD " + aaHODAppName + " (" + aaHODAppEmail + ") <br> " + aGenGiftWord + "</b></p><p style='color: darkgreen; font-size: 14px;'>(" + (xxChkLenxx) + " HOD to approve)</p>";
                                                                            let result = DevExpress.ui.dialog.confirm(aTrvAlert02, "CONFIRM TO HOD");
                                                                            result.done(function (dresult) {
                                                                                if (dresult) {
                                                                                    if (asFilterRec > 0) {  //sOverLimitAmt
                                                                                        //Generate Gift/Receive Function()
                                                                                        //console.log("asFilterRec ", asFilterRec, "asFilterRow ",asFilterRow)
                                                                                        //const obj = { a: 1, b: 2, c: 3 }; 
                                                                                        let aaPFDMIGR = isLocalHost();
                                                                                        let aaTBKeyGR = "5ad2685d-4114-4aa5-aa87-67368f4a3559";

                                                                                        let aNowDateGR = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
                                                                                        let aNowDateTGR = aaNowText(aNowDte)
                                                                                        let aGRID; // = 1;                                                                                                
                                                                                        let aGivenGR = "Given" //ERORefNo1 Given EROAmount1
                                                                                        let aTypeGR; // = "Gift" //EROCode01
                                                                                        let aDeptGR; //= iData.Department; //  1
                                                                                        let aDivGR; // = iData.Division; // 2                                                                                                                                                                                             
                                                                                        let aGRREF; // = aGRPre + "-001"
                                                                                        let aPayCGR; // = iData.PayToCode
                                                                                        let aPayNGR; // = iData.PayToName
                                                                                        let aEmailGR; // = iData.ERODesc06;
                                                                                        let aGRPre; // = aaiHeadRef.replace(/T/g, "G"); //3 aGRPre
                                                                                        let aAmountGR; // = asOverLimitAmt; 
                                                                                        let aHeadGR; // = iData.EROAmount1 //EROAmount2 head
                                                                                        let aAverageGR; // = iData.EROAmount2 // Amount
                                                                                        let aGRStatus = aaDECSTATUS; //"Confirmed (finished)"; //"Register"; //
                                                                                        let aPurposeGR;
                                                                                        let aDetailGR;
                                                                                        let aWhomGR;

                                                                                        for (let key in asFilterRow) {
                                                                                            aGRID = Number(key) + 1; //asFilterRow[key].HeadRefNo.replace(/T/g, "G") + "-" + (Number(key) + 1).toString().padStart(3, '0'), //REFNO
                                                                                            aGRPre = asFilterRow[key].HeadRefNo.replace(/T/g, "G");
                                                                                            aGRREF = asFilterRow[key].HeadRefNo.replace(/T/g, "G") + "-" + (Number(key) + 1).toString().padStart(3, '0'), //REFNO
                                                                                                aTypeGR = asFilterRow[key].ERORefNo3 === "Corporate Gifts" ? "Gift" : "Entertainment"; // Check Here
                                                                                            aDeptGR = asFilterRow[key].Department;
                                                                                            aDivGR = asFilterRow[key].Division;
                                                                                            aPayCGR = asFilterRow[key].PayToCode;
                                                                                            aPayNGR = asFilterRow[key].PayToName;
                                                                                            aEmailGR = asFilterRow[key].ERODesc06;
                                                                                            aAmountGR = asFilterRow[key].Amount;
                                                                                            aHeadGR = asFilterRow[key].EROAmount1;
                                                                                            aAverageGR = asFilterRow[key].EROAmount2;
                                                                                            aPurposeGR = asFilterRow[key].ERODesc03;
                                                                                            aDetailGR = asFilterRow[key].ERODesc02;
                                                                                            aWhomGR = asFilterRow[key].ERODesc04;
                                                                                            //ERODesc02 purpose /Purpose
                                                                                            //ERODesc01 detail of gift /Description
                                                                                            var ObjKDGR = { "EntryBy": aaUsrN, "EntryDate": new Date(), "ERODate01": new Date(), "ID": aGRID, "HeadRefNo": aGRPre, "REFNO": aGRREF, "PayToCode": aPayCGR, "PayToName": aPayNGR, "Department": aDeptGR, "Division": aDivGR, "ERODesc06": aEmailGR, "ReqDate": new Date(), "ExpensesCode": "", "ExpensesDescription": "Sundry Income NON VATABLE", "Currency": "THB", "Xrate": 1, "ExpGroupCode": "700", "ExpGroupDescEng": "Gift/Receive", "ERStatus": aGRStatus, "ERORefNo1": aGivenGR, "ERORefNo2": "", "ERORefNo3": "", "EROCheck01": 1, "EROCheck02": 1, "EROCode01": aTypeGR, "NeedPayment": 0, "RefundedAmount": 0, "LimitedAmount": 0, "EROAmount1": aAmountGR, "EROAmount2": aHeadGR, "Amount": aAverageGR, "ERODesc01": aDetailGR, "ERODesc02": aPurposeGR, "ERODesc03": aWhomGR, "Confirmed": true }
                                                                                            var ObjRowDataGR = JSON.stringify(ObjKDGR);  //ObjKeyDataGR ObjKDGR
                                                                                            //console.log(ObjRowDataGR)
                                                                                            sendRequestNew("Insert", ObjRowDataGR, aaTBKeyGR, aaPFDMIGR, atob(aaXToX));
                                                                                        }

                                                                                    }

                                                                                    let aFREF = aaiHeadRef + "-001"
                                                                                    let aaGRREF = aaiHeadRef.replace(/T/g, "G");
                                                                                    // console.log(aaiHeadRef)
                                                                                    // console.log(aFREF)
                                                                                    let aERStatus = "Confirmed wait for HOD" //"Register"
                                                                                    let aTrueORFalse = '1'
                                                                                    let aTrueORFalseB = true
                                                                                    let aNowDateT = aaNowText(aNowDte)

                                                                                    var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus, ReqDate: aNowDte }; //HODApproved: aTrueORFalseB,
                                                                                    var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));

                                                                                    let aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'" //", HODApproved = " + aTrueORFalse +
                                                                                    aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();

                                                                                    //send Email
                                                                                    var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " REIMBURSEMENT REQUEST";
                                                                                    let aApproverName = aaHODAppName //+ ", [HOD]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                                    let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                                    let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                                    let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                                                    //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                                                                    var aSubject = aaMailTitle
                                                                                    let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                                    let aAddress2Do = "<a href='" + aaPFDMI + "/XOL/index.html'>Expenses Reimburse</a>"; //<a href='https://www.w3schools.com'>Visit W3Schools</a>
                                                                                    let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName, aaGRREF: aaGRREF } // aAddress2Do: aRequesterName + "</div>"
                                                                                    //let aMessage01 = aVARs.ACONFIRM.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match); //aaMess3Show
                                                                                    let aMessage01 = asOverLimitAmt > 0 ? aVARs.ACONFIRM2.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match) : aVARs.ACONFIRM.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match)
                                                                                    //let aMessageX1 = "<div>เรียน คุณ" + $.trim(aApproverName) + ",<br>&nbsp;&nbsp;&nbsp;&nbsp;กรุณาตรวจสอบ และอนุมัติรายการ " + aaOnInitExpGroupDesc + " Expenses สำหรับ REFNO = [" + aRefNoa + "]<br> สามารถเข้าดูรายการได้ที่ " + aAddress2Do + " (หัวข้อ Approve --> HOD Approve) <br><br>ขอแสดงความนับถือ<br>" + aRequesterName + "</div>"
                                                                                    //let aMessage01 = aEmailTRF[0] + $.trim(aApproverName) + aEmailTRF[1] + aaOnInitExpGroupDesc + " Expenses REFNO = [" + aRefNoa + aEmailTRF[3] + aAddress2Do + aEmailTRF[4] + aEmailTRF[12] + aRequesterName + aEmailTRF[5]                                                                       //var aMessage = "<!DOCTYPE html><html><head><style>table { bprder: 1px solid; border-collapse: collapse; width: 50%;}th, td {  text-align: left;  padding: 8px;}tr:nth-child(even){background-color: #ffe6ff }th {  background-color: #027DFC; color: white;}</style></head><body><table><tr><th  style = 'font-size: 22px;'><center />&#9728; " + aaMailTitle + " &#9728;</th></tr><tr><td style = 'font-size: 13px; background-color:#EAF4FF'>"+ aMessage01 +"</td>  </tr></tr></table></body></html>" //#fff7e6 #e6e6e6 #fff7e6    
                                                                                    var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                                    aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                    if (asOverLimitAmt > 0) {
                                                                                        //aMessageAlert("Already Generate Gift/Receive Data","DarkBlue")
                                                                                        //aMessageAlert("Already Generate Gift/Receive Data & Confirmed & send mail to Approver " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                                        aMessageAlert(aVARs.AMESSYES + aMessage, "grey")
                                                                                    } else {
                                                                                        //aMessageAlert("Already Confirmed & send mail to Approver " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                                        aMessageAlert(aVARs.AMESSNO + aMessage, "grey")
                                                                                    }
                                                                                    var aThisThemes = localStorage["aDXTheme"];
                                                                                    changeTheme(aThisThemes)
                                                                                    popup.hide();
                                                                                }
                                                                            }); // result
                                                                            //1
                                                                        } //aaLoadData
                                                                    }); // then check  
                                                            });
                                                        //} // if (aRecNo === 1) {
                                                        //}
                                                    }//validate
                                                });


                                                const aform = $("#Add-form").dxForm({
                                                    formData: iData,
                                                    showColonAfterLabel: false,
                                                    labelLocation: "left", //"top",
                                                    readOnly: abConfirmed, //iData.Confirmed ?? false, // false, true,
                                                    colCount: 1,
                                                    items: [{
                                                        itemType: "group",
                                                        //caption: "Refference",
                                                        //cssClass: "second-group",
                                                        colCount: 6,
                                                        items: [
                                                            {
                                                                itemType: "simple",
                                                                colSpan: 2,
                                                                //label: { text: " " },
                                                                template: function () { //"Refer To Travel Requisition" editingMode === "cell"
                                                                    return $("<div>").text(aTRFPRENO === "" ? "" : ReferText).css({
                                                                        "color": "darkblue", //asEROCheck03 ? "purple" : "darkgreen",
                                                                        "font-size": "18px",
                                                                        "font-weight": "bold",
                                                                        "background-color": "AliceBlue",
                                                                        "text-align": "center",
                                                                        "border": "1px solid lightblue",
                                                                        "border-radius": "8px",
                                                                        "width": "280px",
                                                                        "padding": "1px"
                                                                    });
                                                                }
                                                            },
                                                            {
                                                                itemType: "empty",
                                                                colSpan: 4,
                                                            },
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
                                                                editorOptions: { value: idDate, displayFormat: "dd/MM/yyyy", readOnly: true, width: 150, },	  //showClearButton: true,  //value: new Date(),  elementAttr: { class: "custom-editor" }               
                                                            },
                                                            {
                                                                dataField: "PayToName",
                                                                label: { text: "Pay To" },
                                                                width: 180,
                                                                editorType: "dxTextBox",
                                                                editorOptions: { value: asFullName, width: 180, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                            },
                                                            {
                                                                dataField: "Vendor01",
                                                                label: { text: "Corporate Card" },
                                                                visible: HAVECORPCARD, // true,
                                                                width: 150,
                                                                editorType: "dxSelectBox",
                                                                //editorType: "dxTextBox",
                                                                editorOptions: {
                                                                    width: 150,
                                                                    //readOnly: abConfirmed, //iData.Confirmed, //iData.Confirmed, //!iData.Confirmed, //
                                                                    dataSource: cardIdOptions,
                                                                    valueExpr: "CardID",
                                                                    displayExpr: "Label",
                                                                    searchEnabled: true,
                                                                    value: asCardIDNO,
                                                                    onValueChanged: function (e) {
                                                                        asCardIDNO = e.value;
                                                                    },
                                                                    elementAttr: { class: "custom-editor" }
                                                                }, //value: asDepartment,
                                                            },
                                                            {
                                                                dataField: "Department",
                                                                label: { text: "Dept." },
                                                                visible: false,
                                                                width: 40,
                                                                editorType: "dxTextBox",
                                                                editorOptions: { value: asDepartment, width: 180, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                            },
                                                            {
                                                                dataField: "Division",
                                                                label: { text: "Division" },
                                                                visible: false,
                                                                width: 40,
                                                                editorType: "dxTextBox",
                                                                editorOptions: { value: asDivision, width: 180, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                            },
                                                            {
                                                                dataField: "ERStatus",
                                                                label: { text: "Status" },
                                                                editorType: "dxTextBox",
                                                                width: 200,
                                                                editorOptions: { value: aaERStatuss, width: 200, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                            },
                                                            // Full working dxDropDownBox + dxForm update code
                                                            // {
                                                            //     dataField: "ERORefNo5",
                                                            //     label: { text: "TRF REF#" },
                                                            //     editorType: "dxDropDownBox",
                                                            //     cssClass: "custom-editor",
                                                            //     width: 150,
                                                            //     visible: true,
                                                            //     editorOptions: {
                                                            //         dataSource: aaTRFGroup01,
                                                            //         valueExpr: "HeadRefNo",
                                                            //         displayExpr: "HeadRefNo",
                                                            //         dropDownOptions: { width: 950 },
                                                            //         contentTemplate: function (e) {
                                                            //             return $("<div>").dxDataGrid({
                                                            //                 dataSource: aaTRFGroup01,
                                                            //                 columns: [
                                                            //                     { dataField: "HeadRefNo", caption: "TRF REF#", width: 150 },
                                                            //                     { dataField: "Department", caption: "Department", width: 80 },
                                                            //                     { dataField: "ERODesc03", caption: "Purpose Desc", width: 200 },
                                                            //                     { dataField: "ERODesc02", caption: "Destination", width: 200 },
                                                            //                     {
                                                            //                         dataField: "EROCheck01",
                                                            //                         caption: "Location",
                                                            //                         width: 150,
                                                            //                         calculateCellValue: data => data.EROCheck01 ? "Overseas" : "Local"
                                                            //                     },
                                                            //                     { dataField: "ERORefNo1", caption: "Purpose", width: 150 }
                                                            //                 ],
                                                            //                 searchPanel: { visible: true },
                                                            //                 filterRow: { visible: true },
                                                            //                 selection: { mode: "single" },
                                                            //                 height: 450,
                                                            //                 hoverStateEnabled: true,
                                                            //                 onSelectionChanged: function (sArgs) {
                                                            //                     const selected = sArgs.selectedRowsData[0];
                                                            //                     if (!selected) return;

                                                            //                     e.component.option("value", selected.HeadRefNo);

                                                            //                     const formInstance = $("#Add-form").dxForm("instance");
                                                            //                     let oldData = formInstance.option("formData") || {};
                                                            //                     let newData = { ...oldData };

                                                            //                     // Extract fields
                                                            //                     newData.ERORefNo5 = selected.HeadRefNo;
                                                            //                     newData.ERORefNo3 = "";

                                                            //                     const aaOverseasxx = selected.EROCheck01;
                                                            //                     const aaPurposexx = selected.ERORefNo1;
                                                            //                     const aaPurposeDescxx = selected.ERODesc03;
                                                            //                     const aaDestinationxx = selected.ERODesc02;

                                                            //                     // Subgroup logic
                                                            //                     if (aaOverseasxx && aaPurposexx === "Conference") {
                                                            //                         xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsOC);
                                                            //                     } else if (!aaOverseasxx && aaPurposexx === "Conference") {
                                                            //                         xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsLC);
                                                            //                     } else if (aaOverseasxx && aaPurposexx === "Training") {
                                                            //                         xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsOT);
                                                            //                     } else if (aaOverseasxx && aaPurposexx === "Traveling") {
                                                            //                         xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsO);
                                                            //                     } else if (!aaOverseasxx && aaPurposexx === "Traveling") {
                                                            //                         xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsL);
                                                            //                     } else {
                                                            //                         xxxSubGroup01 = aaSubGroup01;
                                                            //                     }

                                                            //                     // Apply calculated fields
                                                            //                     Object.assign(newData, {
                                                            //                         EROCode01: aaOverseasxx ? "Overseas" : "Local",
                                                            //                         EROCode02: aaPurposexx,
                                                            //                         ERODesc03: `${aaPurposexx}, ${aaOverseasxx ? "Overseas" : "Local"}, Destination = ${aaDestinationxx} / ${aaPurposeDescxx}`,
                                                            //                         ERORefNo2: "",
                                                            //                         Amount: 0,
                                                            //                         Currency: "THB",
                                                            //                         Xrate: 1,
                                                            //                         RefundedAmount: 0,
                                                            //                         EROAmount1: 1,
                                                            //                         EROAmount2: 0,
                                                            //                         EROAmount3: 0,
                                                            //                         EROAmount4: 0
                                                            //                     });

                                                            //                     aaLocalTC = !aaOverseasxx;

                                                            //                     formInstance.option("formData", newData);
                                                            //                     formInstance.repaint();
                                                            //                     iData = newData;

                                                            //                     // Save to DB
                                                            //                     aSaveMemToDB(iData, aaTBKey, aaPFDMI, aaXToX);


                                                            //                     // Optional refresh other grids
                                                            //                     $("#gridContainer").dxDataGrid("instance").refresh();
                                                            //                     $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                            //                     $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                            //                     $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                            //                     // Close dropdown
                                                            //                     e.component.close();
                                                            //                 }
                                                            //             });
                                                            //         }
                                                            //     }
                                                            // },

                                                            {
                                                                dataField: "ERORefNo5",
                                                                label: { text: `${CHK_PRE_V ? "PRE" : "TRF"} REF#` },
                                                                editorType: "dxTextBox",
                                                                editorOptions: { width: 150, readOnly: true, },
                                                                visible: false,
                                                            },
                                                            {
                                                                dataField: "EROCode01",
                                                                label: { text: "TRF Destination." },
                                                                editorType: "dxTextBox",
                                                                editorOptions: { width: 130, readOnly: true, },
                                                                visible: false,
                                                            },
                                                            {
                                                                dataField: "EROCode02",
                                                                label: { text: "TRF Purpose" },
                                                                editorType: "dxTextBox",
                                                                editorOptions: { width: 130, readOnly: true, },
                                                                visible: false,
                                                            },
                                                        ]

                                                    },

                                                    ]
                                                }).dxForm("instance");

                                                const aform01 = $("#Add-form01").dxForm({
                                                    formData: iData, //aXXData[0], //iData, //function () { return $.post(aaxSettings).done(); },
                                                    showColonAfterLabel: false,
                                                    labelLocation: "left", //"top",
                                                    readOnly: abConfirmed, //iData.Confirmed ?? false, // false, true,
                                                    //cssClass: "custom-editor",
                                                    colCount: 1,
                                                    items: [{
                                                        itemType: "group",
                                                        //caption: "Refference",
                                                        //cssClass: "second-group",
                                                        colCount: 6,
                                                        items: [{
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
                                                            editorOptions: { value: idDate, displayFormat: "dd/MM/yyyy", readOnly: true, width: 150, },	  //showClearButton: true,  //value: new Date(),  elementAttr: { class: "custom-editor" }               
                                                        },
                                                        {
                                                            dataField: "PayToName",
                                                            label: { text: "Pay To" },
                                                            width: 180,
                                                            editorType: "dxTextBox",
                                                            editorOptions: { value: asFullName, width: 180, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                        },
                                                        {
                                                            dataField: "Vendor01",
                                                            label: { text: "Corporate Card" },
                                                            visible: HAVECORPCARD, // true,
                                                            width: 150,
                                                            editorType: "dxSelectBox",
                                                            //editorType: "dxTextBox",
                                                            editorOptions: {
                                                                width: 150,
                                                                dataSource: cardIdOptions,
                                                                valueExpr: "CardID",
                                                                displayExpr: "Label",
                                                                searchEnabled: true,
                                                                value: asCardIDNO,
                                                                onValueChanged: function (e) {
                                                                    asCardIDNO = e.value;
                                                                },
                                                                elementAttr: { class: "custom-editor" }
                                                            }, //value: asDepartment,
                                                        },
                                                        {
                                                            dataField: "Department",
                                                            label: { text: "Dept." },
                                                            width: 40,
                                                            editorType: "dxTextBox",
                                                            editorOptions: { value: asDepartment, width: 180, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                        },
                                                        {
                                                            dataField: "Division",
                                                            label: { text: "Division" },
                                                            width: 40,
                                                            editorType: "dxTextBox",
                                                            editorOptions: { value: asDivision, width: 180, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                        },
                                                        {
                                                            dataField: "ERStatus",
                                                            label: { text: "Status" },
                                                            editorType: "dxTextBox",
                                                            width: 200,
                                                            editorOptions: { value: aaERStatuss, width: 200, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                        },
                                                        ]

                                                    },

                                                    ]


                                                }).dxForm("instance");

                                                var aAddGrid = $("#Add-dxDataGrid").dxDataGrid({  // dataGrid for Add , Edit
                                                    dataSource: new DevExpress.data.CustomStore({
                                                        key: "REFNO",
                                                        loadMode: "raw", //"omit",

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
                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                        },
                                                        update: function (key, values) {
                                                            var ObjKeyData = { "REFNO": $.trim(key) };   //[aaKeyField] key.trim
                                                            var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                                            sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX)); //nsAPIPOST = async (Action, Data, aKeyToken, Domain, AccessKey, aPJCode)
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
                                                    //elementAttr: {
                                                    //    class: "custom-datagrid"
                                                    //},
                                                    allowColumnReordering: true,
                                                    allowColumnResizing: true, // false, //true,
                                                    columnMinWidth: 10,
                                                    scrolling: {
                                                        columnRenderingMode: "virtual" // efficient for many columns
                                                    },
                                                    columnChooser: {
                                                        enabled: chooserMode, //false // true 
                                                        mode: "select",
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
                                                        pageSize: 5
                                                    },
                                                    pager: {
                                                        showPageSizeSelector: true,
                                                        allowedPageSizes: [5, 10, 15], //, 15
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
                                                    // Export to Excel

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
                                                        e.data.ReqDate = new Date()
                                                        e.data.ExpensesCode = "" //aaOnInitAccCode
                                                        e.data.ExpensesDescription = aaOnInitAccDesc //aaOnInitAccDesc
                                                        e.data.Currency = "THB"
                                                        e.data.Xrate = 1
                                                        e.data.ExpGroupCode = aaOnInitExpGroupCode
                                                        e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                                        e.data.ERStatus = "Register"
                                                        e.data.ERORefNo3 = "" // type of expenses
                                                        e.data.ERODesc02 = ""
                                                        e.data.ERODesc03 = ""
                                                        e.data.ERODesc04 = ""
                                                        e.data.Amount = 0;
                                                        e.data.EROAmount1 = 1
                                                        e.data.EROAmount2 = 0
                                                        e.data.EROCheck01 = true
                                                        e.data.EROCheck02 = true
                                                        e.data.EROCheck05 = false
                                                        e.data.NeedPayment = false
                                                        e.data.RefundedAmount = 0
                                                        e.data.LimitedAmount = 0 //aaLTotal
                                                    },
                                                    onEditorPreparing: function (e) {
                                                        if (e.parentType === "dataRow" && arDataU === 0) {
                                                            e.editorOptions.disabled = true;
                                                        } else {
                                                            if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ERStatus" || e.dataField === "PSPvNO" || e.dataField === "LocalAmount" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "PSPvDate")) { //|| e.dataField === "Department"
                                                                e.editorOptions.disabled = true;
                                                            }
                                                        }
                                                    },
                                                    // if (e.dataField === "EROAmount3" || e.dataField === "EROAmount4") {
                                                    //     if (e.row && e.row.data && e.row.data.ERORefNo3?.includes("Accom")) {
                                                    //         e.editorOptions.visible = false; // Make invisible
                                                    //     } else {
                                                    //         e.editorOptions.visible = true; // Make visible
                                                    //     }
                                                    // }

                                                    //},
                                                    onCellPrepared: function (e) {
                                                        if (e.rowType === "data") {
                                                            e.cellElement.css("vertical-align", "top");
                                                        }
                                                    },
                                                    //
                                                    // Editing
                                                    editing: {
                                                        mode: editingMode, //"cell", // popup , row, cell (click to edit) var editingMode = aTravelSC ? "popup" : "cell";
                                                        useIcons: true,

                                                        //allowUpdating: true,
                                                        //allowDeleting: true, //arDataD,
                                                        allowAdding: false, //arDataC,
                                                        allowUpdating: !abConfirmed, //(iData.Confirmed !== true),
                                                        allowDeleting: !abConfirmed, //(iData.Confirmed !== true),
                                                        onRowValidating: function (e) {
                                                            if (!e.isValid) {
                                                                alert("Please correct the validation errors.");
                                                            }
                                                        },
                                                        popup: {
                                                            title: "Travel & Expenses Reimbursement",
                                                            fullScreen: true, //false,
                                                            showCloseButton: false,
                                                            showTitle: true,
                                                            width: 1650,
                                                            height: 500,

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
                                                                // Add custom CSS class to the popup content
                                                                //e.component.content().addClass('custom-popup-content');
                                                                //e.element.addClass("vertical-grid");                                                               
                                                            },
                                                            toolbarItems: [
                                                                {
                                                                    widget: "dxButton",
                                                                    toolbar: "top",
                                                                    location: "after",

                                                                    options: {
                                                                        text: "SAVE",
                                                                        type: "default",
                                                                        stylingMode: "contained",
                                                                        visible: !abConfirmed, //(iData.Confirmed !== true), //!iData.Confirmed, //(iData.Confirmed !== true),
                                                                        onClick: function (e) {
                                                                            // Save logic
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").saveEditData();
                                                                            $("#Add-form").dxForm("instance").refresh();
                                                                            $("#Add-form").dxForm("instance").refresh();
                                                                            $("#Add-form").dxForm("instance").refresh();
                                                                            $("#Add-form01").dxForm("instance").refresh();
                                                                            $("#Add-form01").dxForm("instance").refresh();
                                                                            $("#Add-form01").dxForm("instance").refresh();
                                                                            //$("#popup").dxPopup("instance").hide();
                                                                        }
                                                                    }
                                                                },
                                                                // {
                                                                //     widget: "dxButton",
                                                                //     toolbar: "top",
                                                                //     location: "after",
                                                                //     options: {
                                                                //         text: "SAVE",
                                                                //         type: "default",
                                                                //         stylingMode: "contained",
                                                                //         onClick: function (e) {
                                                                //             // Save DataGrid edits
                                                                //             const dataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                                //             dataGrid.saveEditData();

                                                                //             // Example: Fetch updated data (e.g., from selected row or API)
                                                                //             const selectedRow = dataGrid.getSelectedRowsData()[0]; // or use other source

                                                                //             // Refresh #Add-form if it exists
                                                                //             const form = $("#Add-form").dxForm("instance");
                                                                //             if (form && selectedRow) {
                                                                //                 form.option("formData", selectedRow); // ✅ Rebind with new data
                                                                //                 form.refresh();                      // ✅ Optional: Refresh layout
                                                                //             }

                                                                //             // Refresh #Add-form01 if it exists
                                                                //             const form01 = $("#Add-form01").dxForm("instance");
                                                                //             if (form01 && selectedRow) {
                                                                //                 form01.option("formData", selectedRow); // optional: use different data
                                                                //                 form01.refresh();
                                                                //             }

                                                                //             // Optional: Close popup after save
                                                                //             // $("#popup").dxPopup("instance").hide();
                                                                //         }
                                                                //     }
                                                                // },

                                                                {
                                                                    widget: "dxButton",
                                                                    toolbar: "top",
                                                                    location: "after",
                                                                    options: {
                                                                        text: "CANCLE",
                                                                        type: "danger",
                                                                        stylingMode: "contained",
                                                                        onClick: function (e) {
                                                                            // Cancel logic
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").cancelEditData();
                                                                            $("#Add-form").dxForm("instance").refresh();
                                                                            $("#Add-form01").dxForm("instance").refresh();
                                                                        }
                                                                    }
                                                                }
                                                            ],
                                                        },

                                                        form: {
                                                            readOnly: abConfirmed, //iData.Confirmed ?? false,
                                                            showColonAfterLabel: false,
                                                            labelLocation: "top",//"left", //"top",
                                                            labelMode: 'floating',
                                                            items: [{
                                                                itemType: 'tabbed', //"group" itemType: "tabbed"
                                                                tabPanelOptions: {
                                                                    deferRendering: true,
                                                                    selectedIndex: 1,//activeTabIndex, // Use the stored active tab index                                                                          
                                                                    width: 1550, // Set the desired width here
                                                                    height: 800, // Set the desired height here
                                                                },

                                                                tabs: [
                                                                    {
                                                                        title: "TRF REFNO,",
                                                                        icon: "fas fa-check-circle",
                                                                        iconPosition: "start",
                                                                        colCount: 10,
                                                                        visible: false, //(editingMode === "cell" ? false : true),
                                                                        items: [
                                                                            {
                                                                                dataField: "ERORefNo5",
                                                                                label: { text: "TRF REF#" },
                                                                                colSpan: 1,
                                                                                visible: true,
                                                                            },
                                                                            {
                                                                                dataField: "EROCode01",
                                                                                label: { text: "TRF Destination" },
                                                                                editorType: "dxTextBox",
                                                                                editorOptions: { width: 150, readOnly: true },
                                                                                colSpan: 1,
                                                                                visible: true,
                                                                            },
                                                                            {
                                                                                itemType: "empty",
                                                                                colSpan: 1,
                                                                            },
                                                                            {
                                                                                dataField: "EROCode02",
                                                                                label: { text: "TRF Purpose" },
                                                                                editorType: "dxTextBox",
                                                                                editorOptions: { width: 150, readOnly: true },
                                                                                colSpan: 1,
                                                                                visible: true,
                                                                            },

                                                                        ],
                                                                    },
                                                                    {
                                                                        title: "Original Info",
                                                                        icon: "fas fa-info-circle",
                                                                        iconPosition: "start",
                                                                        colCount: 1,
                                                                        items: [
                                                                            {
                                                                                itemType: "group",
                                                                                caption: "GENERAL INFO",
                                                                                cssClass: "custom-group",
                                                                                colCount: 11,
                                                                                items: [
                                                                                    {
                                                                                        dataField: "ERORefNo5",
                                                                                        label: { text: `${CHK_PRE_V ? "PRE" : "TRF"} REF#` },
                                                                                        editorOptions: { width: 120 },
                                                                                        colSpan: 1,
                                                                                        visible: (editingMode === "cell" ? false : true),
                                                                                    },
                                                                                    {
                                                                                        dataField: "EROCode01",
                                                                                        label: { text: "TRF Destination" },
                                                                                        editorType: "dxTextBox",
                                                                                        editorOptions: { width: 100, readOnly: true },
                                                                                        colSpan: 1,
                                                                                        visible: !CHK_PRE_V, //(editingMode === "cell" ? false : true),
                                                                                    },
                                                                                    // {
                                                                                    //     itemType: "empty",
                                                                                    //     colSpan: 1,
                                                                                    //     visible: (editingMode === "cell" ? false : true) ,
                                                                                    // },
                                                                                    {
                                                                                        dataField: "EROCode02",
                                                                                        //label: { text: "TRF Purpose" },
                                                                                        label: { text: `${CHK_PRE_V ? "PRE Client Code" : "TRF Purpose"}` },
                                                                                        editorType: "dxTextBox",
                                                                                        editorOptions: { width: 150, readOnly: true },
                                                                                        colSpan: (CHK_PRE_V ? 2 : 1),
                                                                                        visible: (editingMode === "cell" ? false : true),
                                                                                    },
                                                                                    {
                                                                                        itemType: "empty",
                                                                                        colSpan: 8,
                                                                                        visible: (editingMode === "cell" ? false : true),
                                                                                    },
                                                                                    {
                                                                                        dataField: "ID",
                                                                                        label: { text: "NO" },
                                                                                        elementAttr: { class: "colorRed" },
                                                                                        editorOptions: { width: 60, readOnly: true, },
                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        dataField: "ERORefNo4",
                                                                                        label: { text: "Bill NO" },
                                                                                        editorOptions: { width: 100, }, // elementAttr: {class: "custom-editor"}
                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        dataField: "ERODate01",
                                                                                        label: { text: "Bill Date" },
                                                                                        editorType: "dxDateBox",
                                                                                        editorOptions: {
                                                                                            displayFormat: "dd/MM/yyyy",
                                                                                            width: 140,
                                                                                            showTodayButton: true,
                                                                                        },
                                                                                        validationRules: [{ type: "required" }, {
                                                                                            type: "range",
                                                                                            min: new Date(aYearStrS + "-04-30"), //aYearStrS
                                                                                            max: new Date(aYearStrL + "-04-30"), //aYearStrL
                                                                                            message: "Bill Date is required"
                                                                                        }],
                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        itemType: "empty",
                                                                                        colSpan: 1,
                                                                                    },

                                                                                    {
                                                                                        dataField: "ERORefNo3",
                                                                                        label: { text: "Type of Reimbursement" },
                                                                                        editorType: "dxTextBox",
                                                                                        editorOptions: {
                                                                                            width: 250,
                                                                                            showClearButton: true,
                                                                                        },
                                                                                        editCellTemplate: dropDownBoxACCC,
                                                                                        setCellValue: function (newData, value, currentRowData) {
                                                                                            let aResult = aSearch2json(xxxSubGroup01, "EDESC", value)
                                                                                            aaAccom = value.includes("Accom.")
                                                                                            aaNight = aaAccom ? 1 : 0;
                                                                                            vNightv = aaAccom;
                                                                                            vPNightv = aaAccom;
                                                                                            newData.ERORefNo3 = value;
                                                                                            newData.ExpensesCode = aResult[0].ACCCODE
                                                                                            newData.ERORefNo2 = ""; //EROCode03
                                                                                            newData.Amount = 0;
                                                                                            newData.LocalAmount = 0;
                                                                                            newData.RefundedAmount = 0;
                                                                                            newData.EROAmount1 = 1;
                                                                                            newData.EROAmount2 = 0;
                                                                                            newData.EROAmount3 = aaNight; //value.includes("Accom.") ? 1 : 0;
                                                                                            newData.EROAmount4 = 0;
                                                                                        },

                                                                                        validationRules: [{ type: "required", message: "." }],
                                                                                        colSpan: 2,
                                                                                    },
                                                                                    {
                                                                                        itemType: "empty",
                                                                                        colSpan: 2,
                                                                                    },
                                                                                    {
                                                                                        dataField: "OtherRefNo",
                                                                                        label: { text: "Declaration" },
                                                                                        editorType: "dxSelectBox",
                                                                                        colSpan: 2,
                                                                                        visible: true,
                                                                                    },
                                                                                    {
                                                                                        dataField: "ERORefNo2",  //OtherRefNo //ERORefNo2 //EROCode03
                                                                                        label: { text: "Sub Code" },
                                                                                        cssClass: "custom-editor",
                                                                                        editorType: "dxSelectBox",
                                                                                        editorOptions: {
                                                                                            dataSource: aaLocalTravel,
                                                                                            searchExpr: "code",
                                                                                            valueExpr: "code",
                                                                                            displayExpr: "code",
                                                                                            searchEnabled: true,
                                                                                            width: 120,
                                                                                            elementAttr: { class: "custom-editor" },
                                                                                        },
                                                                                        width: 120,
                                                                                        //visible: [aaLocalTC],
                                                                                        colSpan: 2,
                                                                                        visible: false
                                                                                    },

                                                                                    {
                                                                                        itemType: "empty",
                                                                                        colSpan: 1,
                                                                                        visible: [!aaLocalTC],
                                                                                    },
                                                                                    // {
                                                                                    //     itemType: "empty",
                                                                                    //     colSpan: 3,
                                                                                    // },
                                                                                    {
                                                                                        dataField: "ERODesc02",
                                                                                        label: { text: "Description" },
                                                                                        editorType: "dxTextArea",
                                                                                        alignment: 'top',
                                                                                        editorOptions: { width: 390, height: 180, },     //elementAttr: {class: "custom-editor"}
                                                                                        validationRules: [{ type: "required", message: "Description is required" }],
                                                                                        cssClass: "verylight-blue",
                                                                                        colSpan: 3,
                                                                                    },
                                                                                    {
                                                                                        itemType: "empty",
                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        dataField: "ERODesc03",
                                                                                        label: { text: "Purpose" },
                                                                                        alignment: 'top',
                                                                                        editorType: "dxTextArea",
                                                                                        editorOptions: { width: 390, height: 180, },
                                                                                        validationRules: [{ type: "required", message: "Purpose is required" }],
                                                                                        cssClass: "verylight-blue",
                                                                                        colSpan: 3,
                                                                                    },
                                                                                    {
                                                                                        itemType: "empty",
                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        dataField: "ERODesc04",
                                                                                        label: { text: "Company/Personal Name" },
                                                                                        editorType: "dxTextArea",
                                                                                        editorOptions: {
                                                                                            width: 390,
                                                                                            height: 180,

                                                                                        },
                                                                                        validationRules: [{ type: "required", message: "Company/Personal Name is required" }],
                                                                                        cssClass: "verylight-blue",
                                                                                        setCellValue: function (newData, value, currentRowData) {
                                                                                            // Remove spaces and newlines from the value
                                                                                            const cleanValue = value.replace(/\s+/g, '');

                                                                                            // Set the ERODesc04 value
                                                                                            newData.ERODesc04 = value;

                                                                                            // Extract all content inside square brackets, allowing for newlines
                                                                                            const matches = cleanValue.match(/\[(.*?)\]/g);
                                                                                            if (matches) {
                                                                                                // Combine all content inside brackets and split by commas
                                                                                                const allMembers = matches
                                                                                                    .map(match => match.replace(/[\[\]]/g, '')) // Remove brackets
                                                                                                    .join(',') // Combine all content
                                                                                                    .split(',') // Split into individual members
                                                                                                    .map(member => member.trim()); // Trim each member

                                                                                                newData.EROAmount1 = allMembers.length;
                                                                                            } else {
                                                                                                // If no brackets found, set member count to 1
                                                                                                newData.EROAmount1 = 1;
                                                                                            }
                                                                                        },

                                                                                        colSpan: 3,
                                                                                    },
                                                                                ], // items of group 1
                                                                            }, // item
                                                                            {
                                                                                itemType: "group",
                                                                                caption: "CALCULATION",
                                                                                icon: "fas fa-info-circle",
                                                                                cssClass: "custom-group-header",
                                                                                colCount: 5,
                                                                                items: [
                                                                                    {
                                                                                        dataField: "Amount",
                                                                                        label: { text: "Original currency" },
                                                                                        dataType: "number",
                                                                                        format: { type: "fixedPoint", precision: 2 },
                                                                                        setCellValue: function (newData, value, currentRowData) {
                                                                                            // console.log(value)

                                                                                            newData.Amount = value;
                                                                                            newData.LocalAmount = value * (currentRowData.Xrate);
                                                                                            newData.RefundedAmount = value * (currentRowData.Xrate);
                                                                                            aaRefunda = value * (currentRowData.Xrate);
                                                                                            newData.EROAmount2 = (value * (currentRowData.Xrate)) / currentRowData.EROAmount1; // average expenses // amount1 = head
                                                                                            newData.EROAmount3 = currentRowData.ERORefNo3.includes("Accom.") ? 1 : 0;
                                                                                            newData.EROAmount4 = currentRowData.ERORefNo3.includes("Accom.") ? ((value * (currentRowData.Xrate)) / currentRowData.EROAmount1) : 0;
                                                                                        },
                                                                                        editorType: "dxNumberBox",
                                                                                        editorOptions: { format: "#,##0.00", width: 120, elementAttr: { class: "right-align-number" }, }, //onValueChanged: function (e) {formInstance.getEditor("tabPanelOptions").option("selectedIndex", 1)} 
                                                                                        validationRules: [
                                                                                            { type: "required", message: "This field is required." },
                                                                                            {
                                                                                                type: "range",
                                                                                                min: -999999,
                                                                                                max: 9999999,
                                                                                                message: "Value must be between -999999 and 9999999.",
                                                                                            },
                                                                                            {
                                                                                                type: "custom",
                                                                                                validationCallback: function (e) {
                                                                                                    return e.value !== 0; // Exclude 0
                                                                                                },
                                                                                                message: "Value cannot be 0.",
                                                                                            },
                                                                                        ],
                                                                                        //colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        dataField: "Currency",
                                                                                        label: { text: "Currency" },
                                                                                        editorType: "dxSelectBox", //dxSelectBox dxLookup
                                                                                        editorOptions: {
                                                                                            dataSource: aCurrenciesList,
                                                                                            searchExpr: "code",
                                                                                            valueExpr: "code",
                                                                                            displayExpr: "code",
                                                                                            searchEnabled: true,
                                                                                            width: 100,
                                                                                        },
                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        dataField: "Xrate",
                                                                                        label: { text: "X-Rate" },
                                                                                        //dataType: "number",
                                                                                        editorType: "dxNumberBox",
                                                                                        editorOptions: { format: "#,##0.000000", width: 120, elementAttr: { class: "right-align-number" } },
                                                                                        format: "#,##0.000000",
                                                                                        setCellValue: function (newData, value, currentRowData) {
                                                                                            //let anewX = 1; //anewX = currentRowData.Amount; //newData.Xrate = value
                                                                                            newData.Xrate = value;
                                                                                            newData.LocalAmount = value * currentRowData.Amount;
                                                                                            newData.RefundedAmount = value * currentRowData.Amount;
                                                                                            aaRefunda = value * currentRowData.Amount;
                                                                                            newData.EROAmount2 = (value * currentRowData.Amount) / currentRowData.EROAmount1; // average=(xrate*origin)/head
                                                                                        },
                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        dataField: "RefundedAmount",
                                                                                        label: { text: "Reimburse" },
                                                                                        dataType: "number",
                                                                                        //ormat: { type: "fixedPoint", precision: 2 },
                                                                                        editorType: "dxNumberBox",
                                                                                        editorOptions: { format: "#,##0.00", width: 120, readOnly: false, elementAttr: { class: "right-align-number" } }, //aaDiffa
                                                                                        setCellValue: function (newData, value, currentRowData) {
                                                                                            //let anewX = 1; //anewX = currentRowData.Amount; //newData.Xrate = value
                                                                                            newData.RefundedAmount = value;
                                                                                            newData.EROAmount2 = (value) / currentRowData.EROAmount1; //reimburse/head
                                                                                            //newData.EROAmount4 = ((currentRowData.RefundedAmount)/(currentRowData.EROAmount1)) / currentRowData.EROAmount3; //per night
                                                                                        },
                                                                                        validationRules: [
                                                                                            { type: "required" },
                                                                                            {
                                                                                                type: "custom",
                                                                                                validationCallback: function (e) {
                                                                                                    const aalocalAmount = e.data.LocalAmount;
                                                                                                    return e.value >= (aalocalAmount - 10) && e.value <= (aalocalAmount + 10) && (e.value !== 0);
                                                                                                },
                                                                                                message: "Refunded Amount must be within ?10 of Calc of Refunded "
                                                                                            }
                                                                                        ],

                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        itemType: "empty",
                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        dataField: "EROAmount1",
                                                                                        label: { text: "Number of Attendees" },
                                                                                        dataType: "number",
                                                                                        format: { type: "fixedPoint", precision: 0 },
                                                                                        setCellValue: function (newData, value, currentRowData) {
                                                                                            newData.EROAmount1 = value;
                                                                                            newData.EROAmount2 = (currentRowData.RefundedAmount / value);
                                                                                        },
                                                                                        editorType: "dxNumberBox",
                                                                                        width: 100,
                                                                                        editorOptions: { format: "#,##0", width: 100, elementAttr: { class: "right-align-number" } },
                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        dataField: "EROAmount2",
                                                                                        label: { text: "Average Expenses" },
                                                                                        dataType: "number",
                                                                                        format: { type: "fixedPoint", precision: 2 },
                                                                                        width: 120,
                                                                                        editorType: "dxNumberBox",
                                                                                        editorOptions: { format: "#,##0.00", width: 120, elementAttr: { class: "right-align-number" }, readOnly: true },
                                                                                        colSpan: 1,
                                                                                        validationRules: [
                                                                                            { type: "required" },
                                                                                            {
                                                                                                type: "custom",
                                                                                                validationCallback: function (e) { //EROCode01
                                                                                                    let aaChkCodexx = (e.data.ERORefNo3 === "Entertainment" ? "Entertainment" : "NONE") //e.data.EROCode01  === "Overseas" ? "Overseas" :                                                                                                                     
                                                                                                    //alert(`len of ERORefN03 ${e.data.ERORefNo3.length}`)
                                                                                                    if (e.data.ERORefNo3 === "Entertainment") { //e.data.EROCode01  === "Overseas" ||
                                                                                                        let aResultxxx = aSearch2json(aaLimitedAmt, "code", aaChkCodexx); //"Overseas"
                                                                                                        //console.log("Entertainment ",aResultxxx[0].lmtamt)
                                                                                                        let aLimitAmtaa = (aResultxxx.length === 0 ? 10000000 : aResultxxx[0].lmtamt);
                                                                                                        //let aLimitAmtaa = 10000;
                                                                                                        return e.value <= (aLimitAmtaa);
                                                                                                    } else { return true }
                                                                                                },
                                                                                                message: "Entertainment Over Limited"
                                                                                            }
                                                                                        ],
                                                                                        /* validationRules: [
                                                                                            { type: "required" } // Keep required validation
                                                                                        ],
                                                                                        editorOptions: {
                                                                                            format: "#,##0.00", width: 120, elementAttr: { class: "right-align-number" }, readOnly: true ,
                                                                                            onValueChanged: function (e) {
                                                                                                // Custom warning logic
                                                                                                let aaChkCodexx = e.component.option("ERORefNo3") === "Entertainment" ? "Entertainment" : "NONE";
                                                                                                if (aaChkCodexx === "Entertainment") {
                                                                                                    let aResultxxx = aSearch2json(aaLimitedAmt, "code", aaChkCodexx);
                                                                                                    let aLimitAmtaa = aResultxxx.length === 0 ? 10000000 : aResultxxx[0].lmtamt;

                                                                                                    if (e.value > aLimitAmtaa) {
                                                                                                        DevExpress.ui.notify({
                                                                                                            message: "Warning: Entertainment amount exceeds the limit, but submission is allowed.",
                                                                                                            type: "warning",
                                                                                                            displayTime: 3000
                                                                                                        });
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        } */
                                                                                    },
                                                                                    {
                                                                                        dataField: "EROAmount3", // O/Seas Trav-Accom. ERORefNo3  "EROAmount4"
                                                                                        label: { text: "Night for Accom." },
                                                                                        dataType: "number",
                                                                                        format: { type: "fixedPoint", precision: 0 },
                                                                                        setCellValue: function (newData, value, currentRowData) {
                                                                                            newData.EROAmount3 = value;
                                                                                            if (value === 0) {
                                                                                                newData.EROAmount4 = 0
                                                                                            }
                                                                                            else {
                                                                                                newData.EROAmount4 = ((currentRowData.RefundedAmount) / (currentRowData.EROAmount1)) / value;
                                                                                            }
                                                                                        },
                                                                                        visible: true,
                                                                                        width: 80,
                                                                                        editorType: "dxNumberBox",
                                                                                        editorOptions: { format: "#,##0", width: 80, elementAttr: { class: "right-align-number" }, }, //readOnly: [!aaAccom], 
                                                                                        validationRules: [
                                                                                            { type: "required" },
                                                                                            {
                                                                                                type: "custom",
                                                                                                validationCallback: function (e) {
                                                                                                    let message = "";
                                                                                                    // Condition 1: If "Accom." is included in ERORefNo3, the value must not be 0
                                                                                                    if (e.data.ERORefNo3.includes("Accom.")) {
                                                                                                        if (e.value === 0) {
                                                                                                            //message = "Night cannot be 0 for Accom.";
                                                                                                            e.rule.message = "Night cannot be 0";
                                                                                                            //DevExpress.ui.dialog.alert({ showTitle: true, title: "Invalid !!", messageHtml: message });
                                                                                                            //aMessageAlert("Value canot be 0 for Accom.","red")
                                                                                                            return false; // Fail validation
                                                                                                        }
                                                                                                        return true; // Pass validation
                                                                                                    }

                                                                                                    // Condition 2: If "Accom." is not included, the value must be 0
                                                                                                    else {
                                                                                                        if (e.value !== 0) {
                                                                                                            //message = "Night is not allowed when not related to Accom.";
                                                                                                            e.rule.message = "Night must be 0";
                                                                                                            //aMessageAlert(message,"red")
                                                                                                            //DevExpress.ui.dialog.alert({ showTitle: true, title: "Invalid !!", messageHtml: message });
                                                                                                            //e.data.EROAmount3 = 0; // Reset the value
                                                                                                            //aMessageAlert("Only 0 is allowed when not related to Accom.","red")
                                                                                                            return false; // Fail validation
                                                                                                        }
                                                                                                        return true; // Pass validation
                                                                                                    }
                                                                                                },
                                                                                                message: "Invalid value." // Default message (overridden by `e.rule.message` dynamically)
                                                                                            }
                                                                                        ],
                                                                                        colSpan: 1,
                                                                                    },
                                                                                    {
                                                                                        dataField: "EROAmount4",
                                                                                        label: { text: "per Night" },
                                                                                        dataType: "number",
                                                                                        format: { type: "fixedPoint", precision: 2 },
                                                                                        width: 120,
                                                                                        editorType: "dxNumberBox",
                                                                                        editorOptions: {
                                                                                            format: "#,##0.00", width: 120,
                                                                                            elementAttr: { class: "right-align-number" },
                                                                                            readOnly: true,
                                                                                        },
                                                                                        visible: true,
                                                                                        validationRules: [
                                                                                            {
                                                                                                type: "custom",
                                                                                                validationCallback: function (e) { //EROCode01
                                                                                                    //aMessageAlert(e.data.ERORefNo3, "red")
                                                                                                    let aaChkCodexx = (e.data.ERORefNo3 === "O/Seas Trav-Accom." ? "Overseas" : "NONE")
                                                                                                    if (e.data.ERORefNo3 === "O/Seas Trav-Accom.") {
                                                                                                        aaChkCodexx = "Overseas"
                                                                                                    } else if (e.data.ERORefNo3 === "Local  Trav-Accom.") {
                                                                                                        aaChkCodexx = "LocalAccom"
                                                                                                    } else {
                                                                                                        aaChkCodexx = "NONE"
                                                                                                    }
                                                                                                    let aaaChkCodexx = "NONE"; // default value
                                                                                                    const found = aObjects.aaACMatch.find(opt => opt.code === e.data.ERORefNo3);
                                                                                                    if (found) {
                                                                                                        aaaChkCodexx = found.linkcode;
                                                                                                        alert(aaaChkCodexx)
                                                                                                    }
                                                                                                    // console.log(aaChkCodexx)
                                                                                                    if (e.data.ERORefNo3 === "O/Seas Trav-Accom." || e.data.ERORefNo3 === "Local  Trav-Accom.") {
                                                                                                        let aResultxxx = aSearch2json(aaLimitedAmt, "code", aaChkCodexx); //"Overseas"
                                                                                                        let aLimitAmtaa = (aResultxxx.length === 0 ? 10000000 : aResultxxx[0].lmtamt);
                                                                                                        return e.value <= (aLimitAmtaa);
                                                                                                    }
                                                                                                    // else if (e.data.ERORefNo3 === "Local Trav-Accom.") { //	 Local Travel EROCode03 && e.data.ERORefNo2 === "Accommodation"
                                                                                                    //     return e.value <= 4500;
                                                                                                    else { return true }
                                                                                                },
                                                                                                message: "Over Limited"
                                                                                            }
                                                                                        ],
                                                                                        colSpan: 1,
                                                                                    },

                                                                                ],
                                                                            }, //group 2

                                                                        ], // tabbed Items

                                                                    },// tabbed Group
                                                                    {

                                                                        title: "CHANGE DEPT.",
                                                                        icon: "fas fa-check-circle",
                                                                        iconPosition: "start",
                                                                        colCount: 5,
                                                                        visible: true, //(editingMode === "cell" ? false : true),
                                                                        items: [
                                                                            {
                                                                                dataField: "Department",
                                                                                label: { text: "Department." },
                                                                                editorType: "dxSelectBox", //dxSelectBox dxLookup
                                                                                editorOptions: {
                                                                                    dataSource: aaDeptList,
                                                                                    searchExpr: "DeptCode",
                                                                                    valueExpr: "DeptCode",
                                                                                    //displayExpr: "ENGNAME",
                                                                                    displayExpr: function (item) { return item && item.DeptCode + " (" + item.ENGNAME + ")"; },
                                                                                    searchEnabled: true,
                                                                                    width: 250,
                                                                                    //value: aNewDiva,
                                                                                    // onValueChanged: function (args) {

                                                                                    //     //     let newDivision = args.value;
                                                                                    //     //     let newDepartment = args.value.slice(0, 4) //calculateNewDepartment(newDivision);
                                                                                    //     //     let formInstance = $("#PopupChangeDiv").dxForm("instance");
                                                                                    //     asNewDept = args.value;
                                                                                    //     aDivisionsListF = divisionsList.filter(item => item.code.startsWith(asNewDept));
                                                                                    //     console.log(asNewDept)
                                                                                    //     var formInstance = $("#PopupChangeDiv").dxForm("instance");
                                                                                    //     var secondSelectBox = formInstance.getEditor("EROCode04");
                                                                                    //     secondSelectBox.option("dataSource", aDivisionsListF || []);
                                                                                    //     //console.log(aDivisionsListF)
                                                                                    //     //     var asNewDiv = args.value.slice(0, 4);
                                                                                    //     //     gbNewDiv = args.value;
                                                                                    //     gbNewDept = args.value; //.slice(0, 4);
                                                                                    //     //     // Update NewDepartment in the form dynamically
                                                                                    //     //     formInstance.updateData("EROCode03", newDepartment);
                                                                                    // }
                                                                                },
                                                                                setCellValue: function (newData, value, currentRowData) {
                                                                                    newData.Department = value;
                                                                                },
                                                                                colSpan: 1,
                                                                                visible: true,
                                                                            },
                                                                        ],
                                                                    },
                                                                ], //tabbed

                                                            }], //form Items

                                                        }, // form
                                                    },

                                                    // column list
                                                    columns: [
                                                        {
                                                            type: "buttons",
                                                            width: 30,
                                                            // fixed: true,          // also frozen
                                                            // fixedPosition: "left",
                                                            showInColumnChooser: false, // 👈 This hides it from the column chooser
                                                            //buttons: ["edit"] //"delete" 
                                                            buttons: [
                                                                {
                                                                    hint: "Edit this row", // Add a hint for the edit button
                                                                    icon: abConfirmed ? "fas fa-search" : "fas fa-pen",//(iData.Confirmed ?? true)
                                                                    //icon: "fas fa-pen",
                                                                    visible: function (e) { return (editingMode === "popup" ? true : false) },
                                                                    onClick: function (e) {
                                                                        // var aThisThemes = localStorage["aDXTheme"];
                                                                        // changeTheme(aThisThemes)
                                                                        e.component.editRow(e.row.rowIndex); // Default edit functionality
                                                                    }
                                                                },
                                                            ],
                                                        },
                                                        {
                                                            type: "buttons",
                                                            showInColumnChooser: false,
                                                            // fixed: true,          // also frozen
                                                            // fixedPosition: "left",
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
                                                                        let result = DevExpress.ui.dialog.confirm(aLocalMess, aLocalTitle);
                                                                        result.done(function (dresult) {
                                                                            if (dresult) {
                                                                                // delete data
                                                                                // DELETE FROM EXPREIM WHERE HeadRefNo = 'M2110120750'
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
                                                                                    var aThisThemes = localStorage["aDXTheme"];
                                                                                    changeTheme(aThisThemes)
                                                                                    //DevExpress.ui.dialog.alert({ showTitle: false, messageHtml: aExitMessage }); 
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
                                                            showInColumnChooser: false,
                                                            width: 30,
                                                            // fixed: true,          // also frozen
                                                            // fixedPosition: "left",
                                                            buttons: [
                                                                {
                                                                    hint: "Add More Line",
                                                                    icon: "fas fa-plus", // "add", //"fas fa-plus", //
                                                                    visible: (e) => {
                                                                        const aadataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                                        const aapageSize = aadataGrid.option('paging.pageSize'); // check page size [5,10,15]
                                                                        return (((e.row.data.ID - 1) % aapageSize === 0 && e.row.data.ID >= 1) && e.row.data.Confirmed === false);
                                                                        // count which record to show +
                                                                    },
                                                                    onClick: async (e) => {
                                                                        aaLastLineNo = aaLastLineNo + 1
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

                                                                        await fetch(aURL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                                                            .then(response => response.json())
                                                                            .then(aData => {
                                                                                let aaID = aData[0].NextID // next number
                                                                                let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                                                let aObjKeyData;
                                                                                if (CHK_PRE_V) { //pre-approved
                                                                                    aObjKeyData = {
                                                                                        REFNO: axLineNo, ID: aaID, LocalAmount: 0,
                                                                                        Amount: 0, RefundedAmount: 0, Note: "", ERORefNo1: "", ERORefNo3: "",
                                                                                        ERORefNo4: "", ERODesc02: "", ERODesc04: "", ExpensesCode: "", Currency: "THB",
                                                                                        Xrate: 1, EROAmount1: 1, EROAmount2: 0
                                                                                    }
                                                                                } else {
                                                                                    aObjKeyData = {
                                                                                        REFNO: axLineNo, ID: aaID, LocalAmount: 0, Amount: 0,
                                                                                        RefundedAmount: 0, Note: "", ERORefNo1: "",
                                                                                        ERORefNo3: "", ERORefNo4: "", ERORefNo5: "",
                                                                                        ERODesc02: "", ERODesc03: "", ERODesc04: "", ExpensesCode: "",
                                                                                        Currency: "THB", Xrate: 1, EROAmount1: 1, EROAmount2: 0
                                                                                    }
                                                                                }
                                                                                let aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); // 
                                                                                try {
                                                                                    sendRequestNew("Insert", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                                                } catch {
                                                                                }
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
                                                                                // console.log(e);
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
                                                            // fixed: true,
                                                            showInColumnChooser: false,
                                                            editorOptions: { width: 30, readOnly: false, elementAttr: { class: "custom-editor" } },
                                                            width: 40,
                                                        },
                                                        {
                                                            dataField: "HeadRefNo",
                                                            caption: "REFNO",
                                                            showInColumnChooser: false,
                                                            cssClass: "custom-editor",
                                                            editorOptions: { width: 30, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                            width: 40,
                                                            visible: false,
                                                        },
                                                        {
                                                            dataField: "ERORefNo5",
                                                            caption: (CHK_PRE_V ? "PRE REF#" : "TRF REF#"),
                                                            editorType: "dxTextBox",
                                                            width: 120,
                                                            // fixed: true,          // also frozen
                                                            //fixedPosition: "left",
                                                            visible: (editingMode !== "cell") || CHK_PRE_V,
                                                            //visible: CHK_PRE_V,
                                                            //showInColumnChooser: CHK_PRE_V,
                                                            cssClass: "custom-editor",
                                                            editorOptions: { width: 150, cssClass: "custom-editor" },
                                                            editCellTemplate: dropDownBoxNTRF,

                                                            setCellValue: function (newData, value, currentRowData) {
                                                                // Find the selected object in the dropdown data
                                                                const selectedItem = aaDropdownTRF.find(row => row.HeadRefNo === value);

                                                                newData.ERORefNo5 = value;
                                                                newData.ERORefNo3 = "";
                                                                aaPurposexx = "";

                                                                if (!selectedItem) return; // nothing to do if not found

                                                                // Destructure once instead of repeating selectedItem.xxx
                                                                const {
                                                                    HeadRefNo: aaTRFNO,
                                                                    EROCheck01: aaOverseas,
                                                                    EROCheck03: aaConference,
                                                                    ERORefNo1: aaPurpose,
                                                                    ERODesc03: aaPurposeDesc,
                                                                    ERODesc02: aaDestination,
                                                                    PBatchNo: aaCorpCardNo,
                                                                    RefundedAmount,
                                                                    EROAmount1,
                                                                    ERODesc01: aFileUrl
                                                                } = selectedItem;
                                                                // Example: alert a single variable
                                                                // alert(aaTRFNO);
                                                                // alert(JSON.stringify(selectedItem, null, 2));

                                                                // Example: alert multiple variables in one string
                                                                // alert(
                                                                //     "TRF No: " + aaTRFNO +
                                                                //     "\nOverseas: " + aaOverseas +
                                                                //     "\nConference: " + aaConference +
                                                                //     "\nPurpose: " + aaPurpose +
                                                                //     "\nPurpose Desc: " + aaPurposeDesc +
                                                                //     "\nDestination: " + aaDestination +
                                                                //     "\nCorp Card No: " + aaCorpCardNo +
                                                                //     "\nRefunded Amount: " + RefundedAmount +
                                                                //     "\nERO Amount: " + EROAmount1 +
                                                                //     "\nFile URL: " + aFileUrl
                                                                // );

                                                                aaOverseasxx = aaOverseas;
                                                                aaConferencexx = aaConference;
                                                                aaPurposexx = aaPurpose;
                                                                aaPurposeDescxx = aaPurposeDesc;

                                                                //aBankIDNO = aaCorpCardNo === "" ? "" : aBankIDNO;
                                                                //aBankName = aaCorpCardNo === "" ? "" : aBankName; 
                                                                const aClientCode = aaPurpose;
                                                                const aCashAdvance = RefundedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                                const aLimitAmt = EROAmount1.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                                const aAdvReason = aaPurposeDesc;

                                                                // Choose subgroup based on conditions
                                                                if (aaOverseas && aaPurpose === "Conference") {
                                                                    xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsOC);
                                                                } else if (!aaOverseas && aaPurpose === "Conference") {
                                                                    xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsLC);
                                                                } else if (aaOverseas && aaPurpose === "Training") {
                                                                    xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsOT);
                                                                } else if (aaOverseas && aaPurpose === "Traveling") {
                                                                    xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsO);
                                                                } else if (!aaOverseas && aaPurpose === "Traveling") {
                                                                    xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsL);
                                                                } else {
                                                                    xxxSubGroup01 = aaSubGroup01;
                                                                }

                                                                // Assign newData fields
                                                                newData.EROCode01 = aaOverseas ? "Overseas" : "Local";
                                                                newData.EROCode02 = aaPurpose;
                                                                //const aaPreVToSave = `BankID: "${aBankIDNO}",BankName: "${aBankName}",ClientCode: "${aClientCode}",ClientName: "${aaDestination}",AdvanceAmt: ${aCashAdvance},ClientALimit: ${aLimitAmt},Reason: "${aAdvReason}"`;
                                                                const aaPreVToSave = `Client Code = ${aClientCode}\nAdvance Amt. = ${aCashAdvance}\nClient Limit Amt. = ${aLimitAmt}\nReason = ${aAdvReason}`;

                                                                //alert(aaPreVToSave)
                                                                // aaPreVToSave ERODesc04 Client, Department, ERORefNo3 = Suspense Account - Flexible
                                                                if (CHK_PRE_V) {
                                                                    newData.ERODesc04 = aaDestination; //Company Name
                                                                    newData.Department = aArrays.PREACCSEL[0]; //"1130"
                                                                    newData.ERORefNo3 = aArrays.PREACCSEL[1]; //"Suspense Account - Flexible"
                                                                }
                                                                newData.ERODesc03 = CHK_PRE_V
                                                                    ? aaPreVToSave //`BankID:${aBankIDNO},BankName:${aBankName},ClientCode:${aClientCode},ClientName:${aaDestination},Advance:${aCashAdvance},Limit:${aLimitAmt},Reason:${aAdvReason}`
                                                                    : `${aaPurpose}, ${CHK_LABEL}${aaTRFNO}],${aaOverseas ? "Overseas" : "Local"}, Destination = ${aaDestination} / ${aaPurposeDesc}`;

                                                                // Reset amounts
                                                                Object.assign(newData, {
                                                                    ERORefNo2: "",
                                                                    Amount: 0,
                                                                    Currency: "THB",
                                                                    Xrate: 1,
                                                                    RefundedAmount: 0,
                                                                    EROAmount1: 1,
                                                                    EROAmount2: 0,
                                                                    EROAmount3: 0,
                                                                    EROAmount4: 0
                                                                });

                                                                aaLocalTC = !aaOverseas;
                                                            }
                                                        },

                                                        // {
                                                        //     dataField: "ERORefNo5",
                                                        //     caption: "TRF REF#",
                                                        //     editorType: "dxTextBox",
                                                        //     width: 120,
                                                        //     visible: (editingMode === "cell" ? false : true),
                                                        //     cssClass: "custom-editor",
                                                        //     editorOptions: { width: 150, cssClass: "custom-editor", },
                                                        //     editCellTemplate: dropDownBoxNTRF,
                                                        //     setCellValue: function (newData, value, currentRowData) {
                                                        //         //let aResult = aSearch2json(aaTRFGroup01, "HeadRefNo", value)
                                                        //         //console.log("value ",value)
                                                        //         // Find the selected object in the dropdown data
                                                        //         //alert(aaDropdownTRF)
                                                        //         const selectedItem = aaDropdownTRF.find(row => row.HeadRefNo === value);
                                                        //         newData.ERORefNo5 = value;
                                                        //         newData.ERORefNo3 = "";
                                                        //         aaPurposexx = "";
                                                        //         if (selectedItem) {
                                                        //             // newData.OtherRefNo = selectedItem.HeadRefNo;   // set your key field
                                                        //             //newData.ERODesc02 = `${aaLastDescription} [Declaration NO:${selectedItem.HeadRefNo}/${selectedItem.EROCode01}/${selectedItem.ERORefNo1}/${formattedAmount}]`;
                                                        //             // from dropdown row /${selectedItem.ERODesc01}/${selectedItem.ERODesc02}
                                                        //             //
                                                        //             let aaResultx = aSearch2json(aaTRFGroup01, "HeadRefNo", value) //aaTRFGroup01
                                                        //             //let aaResultx = selectedItem;
                                                        //             let aaTRFNO = aaResultx[0].HeadRefNo;
                                                        //             aaOverseasxx = aaResultx[0].EROCheck01;
                                                        //             aaConferencexx = aaResultx[0].EROCheck03;
                                                        //             aaPurposexx = aaResultx[0].ERORefNo1; //ERODesc03
                                                        //             aaPurposeDescxx = aaResultx[0].ERODesc03; //RefundedAmount
                                                        //             let aaDestinationxx = aaResultx[0].ERODesc02;

                                                        //             let aCorpCardNo = aaResultx[0].PBatchNO;
                                                        //             let aBankIDNO = aCorpCardNo === "" ? "" : "BANKIDNO";
                                                        //             let aClientCode = aaResultx[0].ERORefNo1;
                                                        //             let aCashAdvance = aaResultx[0].RefundedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                        //             let aLimitAmt = aaResultx[0].EROAmount1.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                        //             let aAdvReason = aaResultx[0].ERODesc03;
                                                        //             let aFileUrl = aaResultx[0].ERODesc01;

                                                        //             // "B-ID:" + aBankIDNO + ",C:" aClientCode + ",ADV:" + aCashAdvance + ",LMT:" + aLimitAmt + ",Reason:" + aAdvReason;
                                                        //             //    
                                                        //             if (aaOverseasxx && aaPurposexx === "Conference") { // 2.OverseasConference
                                                        //                 xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsOC);
                                                        //             } else if (!aaOverseasxx && aaPurposexx === "Conference") { // 1.LocalConference
                                                        //                 xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsLC);
                                                        //             } else if (aaOverseasxx && aaPurposexx === "Training") { //3.OverseasTraining
                                                        //                 xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsOT);
                                                        //             } else if (aaOverseasxx && aaPurposexx === "Traveling") { // 4.OverseasTraveling
                                                        //                 xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsO);
                                                        //             } else if (!aaOverseasxx && aaPurposexx === "Traveling") { // 5.LocalTraveling
                                                        //                 xxxSubGroup01 = searchExpenses(aaSubGroup01, searchTermsL);
                                                        //             } else { //not match
                                                        //                 xxxSubGroup01 = aaSubGroup01; //searchExpenses(aaSubGroup01, searchTermsL);
                                                        //             }
                                                        //             newData.EROCode01 = aaOverseasxx ? "Overseas" : "Local"
                                                        //             newData.EROCode02 = aaPurposexx;
                                                        //             if (CHK_PRE_V) {
                                                        //                 newData.ERODesc03 = "B:" + aBankIDNO + ",C:" + aClientCode + ",ADV:" + aCashAdvance + ",LMT:" + aLimitAmt + ",Reason:" + aAdvReason;
                                                        //             } else {
                                                        //                 newData.ERODesc03 = aaPurposexx + " ," + CHK_LABEL + aaTRFNO + "]," + (aaOverseasxx ? "Overseas" : "Local") + ", Destination = " + aaDestinationxx + " / " + aaPurposeDescxx; //ERODesc02
                                                        //             }

                                                        //             // Reset all amount to 0
                                                        //             newData.ERORefNo2 = ""; //EROCode03
                                                        //             newData.Amount = 0;
                                                        //             newData.Currency = "THB";
                                                        //             newData.Xrate = 1;
                                                        //             newData.RefundedAmount = 0;
                                                        //             newData.EROAmount1 = 1; //head
                                                        //             newData.EROAmount2 = 0; //Average
                                                        //             newData.EROAmount3 = 0; //Night
                                                        //             newData.EROAmount4 = 0; //Per Night
                                                        //             aaLocalTC = !aaOverseasxx;
                                                        //         }
                                                        //     },
                                                        // },
                                                        {
                                                            dataField: "ERORefNo4",
                                                            caption: "Bill No",
                                                            cssClass: "custom-editor",
                                                            editorOptions: { width: 70, elementAttr: { class: "custom-editor" } },
                                                            width: 70,
                                                            visible: (editingMode === "cell" ? true : false),
                                                        },
                                                        {
                                                            dataField: "ERODate01",
                                                            caption: "Bill Date*",
                                                            dataType: "date",
                                                            format: "dd/MM/yyyy",
                                                            width: 95,
                                                            stylingMode: 'filled',
                                                            editorType: "dxDateBox", //"dxDateBox", //"dxCalendar", function (){return null}
                                                            cssClass: "custom-editor",
                                                            editorOptions: {
                                                                //value: null,
                                                                //showClearButton: true,
                                                                format: "dd/MM/yyyy",
                                                                width: 95,
                                                                showTodayButton: false,
                                                                stylingMode: "outlined",
                                                                //cssClass: "custom-editor",
                                                                elementAttr: { class: "custom-editor" }
                                                            },
                                                            validationRules: [{ type: "required" }, {
                                                                type: "range",
                                                                min: new Date(aYearStrS + "-04-30"), //aYearStrS
                                                                max: new Date(aYearStrL + "-04-30"), //aYearStrL
                                                                //message: "Please Change Bill Date"
                                                            }],
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "Department",
                                                            caption: "Dept.",
                                                            //fixed: true,          // also frozen
                                                            //fixedPosition: "left",
                                                            editorType: "dxSelectBox", //dxSelectBox dxLookup
                                                            editorOptions: {
                                                                dataSource: aaDeptList,
                                                                searchExpr: "DeptCode",
                                                                valueExpr: "DeptCode",
                                                                displayExpr: "DeptCode",
                                                                //displayExpr: "ENGNAME",
                                                                //displayExpr: function (item) { return item && item.DeptCode + " (" + item.ENGNAME.slice(0,10) + ")"; },
                                                                searchEnabled: true,
                                                                width: 80,
                                                            },
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                newData.Department = value;
                                                            },
                                                            width: 80,
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "ERODesc02",
                                                            caption: "Description",
                                                            editorType: "dxTextArea",
                                                            alignment: 'top',
                                                            cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                            width: 210,
                                                            height: 200,
                                                            cssClass: "custom-editor",
                                                            editorOptions: { width: 208, height: 200, cssClass: "custom-editor", }, //elementAttr: { class: "custom-editor" }
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "ERODesc03",
                                                            caption: "Purpose*",
                                                            alignment: 'top',
                                                            cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                            editorType: "dxTextArea",
                                                            width: 230,
                                                            height: 200,
                                                            cssClass: "custom-editor",
                                                            editorOptions: { width: 228, height: 200, cssClass: "custom-editor", },  //elementAttr: { class: "custom-editor" } 
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "ERODesc04",
                                                            caption: "Company/Personal Name*",
                                                            width: 230,
                                                            height: 200,
                                                            editorType: "dxDropDownBox",
                                                            editorOptions: {
                                                                dataSource: aObjects.CashAdvanceClient,
                                                                valueExpr: "CompanyName",
                                                                displayExpr: "CompanyName",
                                                                width: 228,   // input box width
                                                                dropDownOptions: {
                                                                    width: 700   // popup width
                                                                },
                                                                contentTemplate: function (e) {
                                                                    return $("<div>").dxDataGrid({
                                                                        dataSource: aObjects.CashAdvanceClient,
                                                                        columns: [
                                                                            { dataField: "CompanyGroup", caption: "Group", width: 100 },
                                                                            { dataField: "CompanyName", caption: "Company", width: 400 },
                                                                            { dataField: "CashAdvance", caption: "Limit", width: 150, dataType: "number", format: { type: "fixedPoint", precision: 2 } }, // gives 12,345.67 }
                                                                        ],
                                                                        paging: { enabled: true, pageSize: 15 },
                                                                        searchPanel: { visible: true },
                                                                        headerFilter: { visible: true },
                                                                        filterRow: { visible: true },
                                                                        showBorders: true,
                                                                        scrolling: { mode: "virtual" },
                                                                        selection: { mode: "single" },
                                                                        height: 550,
                                                                        onSelectionChanged: function (sArgs) {
                                                                            e.component.option("value", sArgs.selectedRowKeys[0].CompanyName);
                                                                            if (sArgs.selectedRowKeys.length > 0) {
                                                                                e.component.close();
                                                                            }
                                                                        }
                                                                    });
                                                                },
                                                                // onValueChanged: function (e) {
                                                                //     const matchedClient = aObjects.CashAdvanceClient.find(
                                                                //         item => item.ClientCode === e.value
                                                                //     );
                                                                //     const form = $("#Add-formPRE").dxForm("instance");
                                                                //     form.updateData("EROAmount1", matchedClient ? matchedClient.CashAdvance : null);
                                                                //     form.updateData("ERODesc02", matchedClient ? matchedClient.CompanyName : null);
                                                                // }

                                                            },
                                                            visible: CHK_PRE_V,
                                                        },
                                                        {
                                                            dataField: "ERODesc04",
                                                            caption: "Company/Personal Name*",
                                                            cellTemplate: function (container, options) { var text = options.value ? options.value.replace(/\n/g, "<br>") : ""; container.html(text); },
                                                            editorType: "dxTextArea",
                                                            width: 230,
                                                            height: 200,
                                                            // editorOptions: {
                                                            //     width: 228,
                                                            //     height: 200,
                                                            //     onValueChanged: function (e) {
                                                            //         // Trigger setCellValue explicitly to update EROAmount1
                                                            //         const value = e.value || '';
                                                            //         const match = value.match(/\[(.*?)\]/);
                                                            //         let memberCount = 1; // Default to 1 if no brackets are found

                                                            //         if (match) {
                                                            //             const members = match[1].split(',').map(member => member.trim());
                                                            //             memberCount = members.length;
                                                            //         }

                                                            //         // Update the row data
                                                            //         const data = e.component.option('data');
                                                            //         if (data) {
                                                            //             data.EROAmount1 = memberCount;
                                                            //             e.component.option('data', data); // Update the data source
                                                            //         }
                                                            //     }
                                                            // },
                                                            cssClass: "custom-editor",
                                                            editorOptions: { width: 228, height: 200, cssClass: "custom-editor", }, // elementAttr: { class: "custom-editor" } 
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                // Remove spaces and newlines from the value
                                                                const cleanValue = value.replace(/\s+/g, '');

                                                                // Set the ERODesc04 value
                                                                newData.ERODesc04 = value;

                                                                // Extract all content inside square brackets, allowing for newlines
                                                                const matches = cleanValue.match(/\[(.*?)\]/g);
                                                                if (matches) {
                                                                    // Combine all content inside brackets and split by commas
                                                                    const allMembers = matches
                                                                        .map(match => match.replace(/[\[\]]/g, '')) // Remove brackets
                                                                        .join(',') // Combine all content
                                                                        .split(',') // Split into individual members
                                                                        .map(member => member.trim()); // Trim each member

                                                                    newData.EROAmount1 = allMembers.length;
                                                                } else {
                                                                    // If no brackets found, set member count to 1
                                                                    newData.EROAmount1 = 1;
                                                                }
                                                            },
                                                            visible: !CHK_PRE_V,
                                                            showInColumnChooser: !CHK_PRE_V,
                                                        },
                                                        {
                                                            dataField: "EROAmount1",
                                                            caption: "Number of Attendees",
                                                            dataType: "number",
                                                            format: { type: "fixedPoint", precision: 0 },
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                newData.EROAmount1 = value;
                                                                newData.EROAmount2 = (currentRowData.RefundedAmount) / value;
                                                            },
                                                            editorType: "dxNumberBox",
                                                            editorOptions: { format: "#,##0", width: 120, elementAttr: { class: "custom-editor" } },
                                                            width: 120,
                                                            visible: !CHK_PRE_V,
                                                            showInColumnChooser: !CHK_PRE_V,
                                                        },
                                                        {
                                                            dataField: "EROCode01",
                                                            caption: "Overseas",
                                                            showInColumnChooser: false,
                                                            visible: false,
                                                        },
                                                        {
                                                            dataField: "EROCode02",
                                                            caption: "Purpose",
                                                            showInColumnChooser: false,
                                                            visible: false,
                                                        },
                                                        {
                                                            dataField: "ERORefNo3",
                                                            caption: "Type of Reimbursement",
                                                            width: 250,
                                                            editorType: "dxTextBox",
                                                            cssClass: "custom-editor",
                                                            editorOptions: {
                                                                width: 250,
                                                                //value: "Suspense Account - Flexible" ,
                                                                showClearButton: true,
                                                                elementAttr: { class: "custom-editor" }
                                                            },
                                                            editCellTemplate: dropDownBoxACC,
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                let aaHeadCount = currentRowData.EROAmount1 === 0 ? 1 : currentRowData.EROAmount1;
                                                                let aResult = aSearch2json(xxxSubGroup01, "EDESC", value)
                                                                aaAccom = value.includes("Accom.")
                                                                aaNight = aaAccom ? 1 : 0;
                                                                newData.ERORefNo3 = value;
                                                                newData.ExpensesCode = aResult[0].ACCCODE
                                                                newData.ERORefNo2 = ""; //EROCode03
                                                                //newData.ERODesc02 = currentRowData.ERODesc02 + "Over Limited"
                                                                newData.Amount = 0;
                                                                newData.LocalAmount = 0;
                                                                newData.RefundedAmount = 0;
                                                                newData.EROAmount1 = aaHeadCount;
                                                                newData.EROAmount2 = 0;
                                                                newData.EROAmount3 = aaNight; //value.includes("Accom.") ? 1 : 0;
                                                                newData.EROAmount4 = 0;
                                                            },
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "OtherRefNo", //dropDownBoxDEC
                                                            caption: "Declaration",
                                                            editorType: "dxSelectBox",
                                                            width: 250,
                                                            editorType: "dxTextBox",
                                                            cssClass: "custom-editor",
                                                            editorOptions: { width: 250, showClearButton: true, elementAttr: { class: "custom-editor" } },
                                                            editCellTemplate: dropDownBoxDEC,
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                // Find the selected object in the dropdown data
                                                                const selectedItem = aaDropdownData.find(row => row.HeadRefNo === value);
                                                                const aaLastDescription = currentRowData.ERODesc02.replace(/\[Declaration NO:.*?\]/g, ''); //.replace(/\s*\*\*\[.*?\]\s*/, ''); // Remove any existing declaration description
                                                                // "ERODesc01" "Details" ERODesc02 ERORefNo1
                                                                const formattedAmount = selectedItem.Amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                                if (selectedItem) {
                                                                    newData.OtherRefNo = selectedItem.HeadRefNo;   // set your key field
                                                                    newData.ERODesc02 = `${aaLastDescription} [Declaration NO:${selectedItem.HeadRefNo}/${selectedItem.EROCode01}/${selectedItem.ERORefNo1}/${formattedAmount}]`;
                                                                    // from dropdown row /${selectedItem.ERODesc01}/${selectedItem.ERODesc02}

                                                                }
                                                            },
                                                            visible: !CHK_PRE_V,
                                                            showInColumnChooser: !CHK_PRE_V,
                                                        },
                                                        {
                                                            dataField: "ERORefNo2", //EROCode03
                                                            caption: "Sub Code",
                                                            showInColumnChooser: false,
                                                            editorType: "dxCheckBox",
                                                            cssClass: "custom-editor",
                                                            editorType: "dxSelectBox", //dxSelectBox dxLookup
                                                            editorOptions: {
                                                                dataSource: aaLocalTravel,
                                                                searchExpr: "code",
                                                                valueExpr: "code",
                                                                displayExpr: "code",
                                                                searchEnabled: true,
                                                                width: 120,
                                                                elementAttr: { class: "custom-editor" },
                                                            },
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                newData.ERORefNo2 = value; //EROCode03
                                                                newData.EROAmount3 = 0;
                                                                newData.EROAmount4 = 0;
                                                            },
                                                            width: 120,
                                                            visible: false,
                                                            // validationRules: [
                                                            //     {
                                                            //         type: "custom",
                                                            //         validationCallback: function (e) {
                                                            //             if (e.data.ERORefNo3 === "Local Travel" && e.data.ERORefNo2.length === 0) { //EROCode03
                                                            //                 return false
                                                            //             } else { return true }
                                                            //         },
                                                            //         message: "Please Entry"
                                                            //     }
                                                            // ],
                                                        },
                                                        {
                                                            dataField: "Amount",
                                                            caption: "Original currency*",
                                                            dataType: "number",
                                                            cssClass: "custom-editor",
                                                            format: { type: "fixedPoint", precision: 2 },
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                let categories = {
                                                                    "Gift": "Gift",
                                                                    "Entertain": "Entertainment",
                                                                    "O/Seas Trav-Accom": "Overseas",
                                                                    "Local  Trav-Accom": "LocalAccom"
                                                                };
                                                                let aFindResult = Object.keys(categories).find(key => currentRowData.ERORefNo3.includes(key)) || "NONE";
                                                                aFindResult = categories[aFindResult] || aFindResult;

                                                                let aOSText = (aFindResult === "Overseas") ? "Overseas Accom. per night"
                                                                    : (aFindResult === "LocalAccom") ? "Local Accom. per night"
                                                                        : aFindResult + " avr.";

                                                                let aResultxxx = aSearch2json(aaLimitedAmt, "code", aFindResult);
                                                                let aLimitAmt = aResultxxx[0]?.lmtamt ?? 0;
                                                                let formattedLimitAmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(aLimitAmt);

                                                                let xxxRate = Math.max(currentRowData.Xrate, 1);
                                                                newData.Amount = value;
                                                                newData.Xrate = xxxRate;
                                                                newData.LocalAmount = newData.RefundedAmount = value * xxxRate;
                                                                let aAverageAmta = newData.LocalAmount / currentRowData.EROAmount1;

                                                                newData.EROAmount2 = aAverageAmta;
                                                                newData.EROAmount3 = currentRowData.ERORefNo3.includes("Accom.") ? 1 : 0;
                                                                newData.EROAmount4 = newData.EROAmount3 ? aAverageAmta : 0;

                                                                let baseDesc = currentRowData.ERODesc02.replace(/\s*\*\*\[.*?\]\s*/, '');
                                                                newData.ERODesc02 = (aFindResult === "NONE" || aAverageAmta <= aLimitAmt)
                                                                    ? baseDesc
                                                                    : ` **[${aOSText} Over ${formattedLimitAmt}] ${baseDesc}`;
                                                            },
                                                            editorType: "dxNumberBox",
                                                            editorOptions: { format: "#,##0.00", width: 100, elementAttr: { class: "custom-editor" } },
                                                            width: 100,
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "Currency",
                                                            caption: "Currency", //aCurrenciesList
                                                            lookup: {
                                                                dataSource: aCurrenciesList,
                                                                valueExpr: "code",
                                                                displayExpr: "code"
                                                            },
                                                            //editorType: 'dxSelectBox', //"dxLookup", //
                                                            /*editorOptions: {
                                                                items: aCurrList,
                                                                searchEnabled: true,
                                                                title: 'Select Currency',
                                                                value: "THB",
                                                                width: 100
                                                            },*/
                                                            editorOptions: { width: 100 },
                                                            width: 100,
                                                            visible: !CHK_PRE_V,
                                                            showInColumnChooser: !CHK_PRE_V,
                                                        },
                                                        {
                                                            dataField: "Xrate",
                                                            caption: "X-Rate*",
                                                            dataType: "number",
                                                            editorType: "dxNumberBox",
                                                            editorOptions: { format: "#,##0.000000", width: 80, elementAttr: { class: "custom-editor" } },
                                                            format: "#,##0.000000",
                                                            cssClass: "custom-editor",
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                newData.Xrate = value;
                                                                newData.LocalAmount = value * currentRowData.Amount;
                                                                newData.RefundedAmount = value * currentRowData.Amount;
                                                                aaRefunda = value * currentRowData.Amount;
                                                                newData.EROAmount2 = (value * currentRowData.Amount) / currentRowData.EROAmount1;
                                                            },
                                                            width: 80,
                                                            visible: !CHK_PRE_V,
                                                            showInColumnChooser: !CHK_PRE_V,
                                                        },
                                                        {
                                                            dataField: "RefundedAmount",
                                                            caption: "Reimburse*",
                                                            dataType: "number",
                                                            format: { type: "fixedPoint", precision: 2 },
                                                            editorType: "dxNumberBox",
                                                            editorOptions: { format: "#,##0.00", width: 100, readOnly: false, elementAttr: { class: "custom-editor" } }, //aaDiffa
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                newData.RefundedAmount = value;
                                                                newData.EROAmount2 = (value) / currentRowData.EROAmount1;
                                                            },
                                                            validationRules: [
                                                                //{ type: "required" },
                                                                {
                                                                    type: "custom",
                                                                    validationCallback: function (e) {
                                                                        if (e.data.EROCheck05 === false) {
                                                                            const aalocalAmount = e.data.LocalAmount;
                                                                            return e.value >= (aalocalAmount - 10) && e.value <= (aalocalAmount + 10);
                                                                        } else { return true }
                                                                    },
                                                                    message: "Refunded Amount must be within (+-)10 "
                                                                }
                                                            ],

                                                            width: 100,
                                                        },

                                                        {
                                                            dataField: "EROAmount2",
                                                            caption: "Average Expenses",
                                                            dataType: "number",
                                                            format: { type: "fixedPoint", precision: 2 },
                                                            editorType: "dxNumberBox",
                                                            editorOptions: { format: "#,##0.00", width: 100, elementAttr: { class: "custom-editor" }, readOnly: true },
                                                            width: 100,
                                                            visible: !CHK_PRE_V,
                                                            showInColumnChooser: !CHK_PRE_V,
                                                            validationRules: [
                                                                //{ type: "required" },
                                                                {
                                                                    type: "custom",
                                                                    validationCallback: function (e) { //EROCode01                                                                                
                                                                        let aaChkCodexx = (e.data.ERORefNo3 === "Entertainment" ? "Entertainment" : "NONE") //e.data.EROCode01  === "Overseas" ? "Overseas" : 
                                                                        aaChkCodexx = e.data.ERORefNo3.includes("Gift") ? "Gift" : aaChkCodexx
                                                                        //console.log(aaChkCodexx)
                                                                        if (aaChkCodexx === "Entertainment" || aaChkCodexx === "Gift") { //e.data.EROCode01  === "Overseas" ||
                                                                            let aResultxxx = aSearch2json(aaLimitedAmt, "code", aaChkCodexx); //"Overseas"
                                                                            let aLimitAmtaa = (aResultxxx.length === 0 ? 10000000 : aResultxxx[0].lmtamt);
                                                                            let formattedNumber = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(aLimitAmtaa);
                                                                            let getvalues = { formattedNumber: formattedNumber } // aAddress2Do: aRequesterName + "</div>"
                                                                            let aAlertUnC = aArrays.aOVERLIMIT[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                            //let result = DevExpress.ui.dialog.alert(aAlertUnC, "UN-CONFIRMED ?");

                                                                            if (e.value > (aLimitAmtaa)) { //ERODesc02
                                                                                //aMessageAlert(`Please check, Average amount is over ${formattedNumber}<br>กรุณาตรวจสอบ โปรแกรมจะสร้าง Recode ที่ Gift&Entertain `,"Red") 
                                                                                DevExpress.ui.dialog.alert(aAlertUnC, aArrays.aOVERLIMIT[1]);
                                                                                //e.data.ERODesc02 = e.data.ERODesc02 + "Over Limited";
                                                                                //e.component.cellValue(e.rowIndex, "ERODesc02", e.data.ERODesc02 + "Over Limited");
                                                                            }

                                                                            return true //e.value <= (aLimitAmtaa); // true
                                                                        } else { return true }
                                                                    },
                                                                    message: "Over Limited "
                                                                }
                                                            ],
                                                            /* validationRules: [
                                                                { type: "required" } // Keep required validation
                                                            ],
                                                            editorOptions: {
                                                                format: "#,##0.00", width: 120, elementAttr: { class: "right-align-number" }, readOnly: true ,
                                                                onValueChanged: function (e) {
                                                                    // Custom warning logic
                                                                    let aaChkCodexx = e.component.option("ERORefNo3") === "Entertainment" ? "Entertainment" : "NONE";
                                                                    if (aaChkCodexx === "Entertainment") {
                                                                        let aResultxxx = aSearch2json(aaLimitedAmt, "code", aaChkCodexx);
                                                                        let aLimitAmtaa = aResultxxx.length === 0 ? 10000000 : aResultxxx[0].lmtamt;

                                                                        if (e.value > aLimitAmtaa) {
                                                                            DevExpress.ui.notify({
                                                                                message: "Warning: Entertainment amount exceeds the limit, but submission is allowed.",
                                                                                type: "warning",
                                                                                displayTime: 3000
                                                                            });
                                                                        }
                                                                    }
                                                                }
                                                            } */
                                                        },
                                                        {
                                                            dataField: "EROAmount3",
                                                            caption: "Night for Accom.",
                                                            dataType: "number",
                                                            format: { type: "fixedPoint", precision: 0 },
                                                            setCellValue: function (newData, value, currentRowData) {
                                                                newData.EROAmount3 = value;

                                                                // Step 1: Map code to linkcode using aaACMatch
                                                                const matched = aObjects.aaACMatch.find(item => item.code === currentRowData.ERORefNo3);
                                                                const aaChkCodexx = matched ? matched.linkcode : "NONE";

                                                                // Step 2: Find the matching limit with justfor === "perNight"
                                                                const foundLimit = aaLimitedAmt.find(item =>
                                                                    item.code === aaChkCodexx && item.justfor === "perNight"
                                                                );

                                                                if (foundLimit) {
                                                                    // perNight category
                                                                    const aLimitAmt = foundLimit.lmtamt ?? 0;
                                                                    const formattedLimitAmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(aLimitAmt);
                                                                    const aOSText = `${aaChkCodexx} Accom. per night`;

                                                                    if (value === 0) {
                                                                        newData.EROAmount4 = 0;
                                                                    } else {
                                                                        const aPerNightAmt = (currentRowData.RefundedAmount / currentRowData.EROAmount1) / value;
                                                                        newData.EROAmount4 = aPerNightAmt;

                                                                        const baseDesc = currentRowData.ERODesc02?.replace(/\s*\*\*\[.*?\]\s*/, '') || '';
                                                                        newData.ERODesc02 = aPerNightAmt <= aLimitAmt
                                                                            ? baseDesc
                                                                            : ` **[${aOSText} Over ${formattedLimitAmt}] ${baseDesc}`;
                                                                    }
                                                                } else {
                                                                    // Not a perNight category — reset related fields
                                                                    newData.EROAmount4 = 0;
                                                                    newData.ERODesc02 = currentRowData.ERODesc02?.replace(/\s*\*\*\[.*?\]\s*/, '') || '';
                                                                }
                                                            },
                                                            visible: !CHK_PRE_V,
                                                            showInColumnChooser: !CHK_PRE_V,
                                                            editorType: "dxNumberBox",
                                                            editorOptions: {
                                                                format: "#,##0",
                                                                width: 70,
                                                                elementAttr: { class: "custom-editor" },
                                                            },
                                                            width: 70,
                                                            validationRules: [
                                                                { type: "required" },
                                                                {
                                                                    type: "custom",
                                                                    validationCallback: function (e) {
                                                                        const matched = aObjects.aaACMatch.find(item => item.code === e.data.ERORefNo3);
                                                                        const aaChkCodexx = matched ? matched.linkcode : "NONE";

                                                                        const isPerNight = aaLimitedAmt.some(item =>
                                                                            item.code === aaChkCodexx && item.justfor === "perNight"
                                                                        );

                                                                        if (isPerNight) {
                                                                            if (e.value === 0) {
                                                                                e.rule.message = "Night cannot be 0";
                                                                                return false;
                                                                            }
                                                                            return true;
                                                                        } else {
                                                                            if (e.value !== 0) {
                                                                                e.rule.message = "Only allowed for perNight categories";
                                                                                return false;
                                                                            }
                                                                            return true;
                                                                        }
                                                                    },
                                                                    message: "Invalid value."
                                                                }
                                                            ]
                                                        },

                                                        // {
                                                        //     dataField: "EROAmount3",
                                                        //     caption: "Night for Accom.",
                                                        //     dataType: "number",
                                                        //     format: { type: "fixedPoint", precision: 0 },
                                                        //     setCellValue: function (newData, value, currentRowData) {
                                                        //         newData.EROAmount3 = value;

                                                        //         let categories = {
                                                        //             "Gift": "Gift",
                                                        //             "Entertain": "Entertainment",
                                                        //             "O/Seas Trav-Accom": "Overseas",
                                                        //             "Local  Trav-Accom": "LocalAccom"
                                                        //         };
                                                        //         let aFindResult = Object.keys(categories).find(key => currentRowData.ERORefNo3.includes(key)) || "NONE";
                                                        //         aFindResult = categories[aFindResult] || aFindResult;

                                                        //         let aOSText = (aFindResult === "Overseas") ? "Overseas Accom. per night"
                                                        //             : (aFindResult === "LocalAccom") ? "Local Accom. per night"
                                                        //                 : aFindResult + " avr.";

                                                        //         let aResultxxx = aSearch2json(aaLimitedAmt, "code", aFindResult);
                                                        //         let aLimitAmt = aResultxxx[0]?.lmtamt ?? 0;
                                                        //         let formattedLimitAmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(aLimitAmt);

                                                        //         if (value === 0) {
                                                        //             newData.EROAmount4 = 0;
                                                        //         } else {
                                                        //             let aPerNightAmt = (currentRowData.RefundedAmount / currentRowData.EROAmount1) / value;
                                                        //             newData.EROAmount4 = aPerNightAmt;

                                                        //             let baseDesc = currentRowData.ERODesc02.replace(/\s*\*\*\[.*?\]\s*/, '');
                                                        //             newData.ERODesc02 = aPerNightAmt <= aLimitAmt
                                                        //                 ? baseDesc
                                                        //                 : ` **[${aOSText} Over ${formattedLimitAmt}] ${baseDesc}`;
                                                        //         }
                                                        //     },
                                                        //     visible: true,
                                                        //     editorType: "dxNumberBox",
                                                        //     editorOptions: {
                                                        //         format: "#,##0",
                                                        //         width: 70,
                                                        //         elementAttr: { class: "custom-editor" },
                                                        //         //readOnly: [!aaAccom],
                                                        //     },
                                                        //     width: 70,
                                                        //     validationRules: [
                                                        //         { type: "required" },
                                                        //         {
                                                        //             type: "custom",
                                                        //             validationCallback: function (e) {
                                                        //                 let message = "";
                                                        //                 // Condition 1: If "Accom." is included in ERORefNo3, the value must not be 0
                                                        //                 if (e.data.ERORefNo3.includes("Accom.")) {
                                                        //                     if (e.value === 0) {
                                                        //                         //message = "Night cannot be 0 for Accom.";
                                                        //                         e.rule.message = "Night cannot be 0";
                                                        //                         //DevExpress.ui.dialog.alert({ showTitle: true, title: "Invalid !!", messageHtml: message });
                                                        //                         //aMessageAlert("Value canot be 0 for Accom.","red")
                                                        //                         return false; // Fail validation
                                                        //                     }
                                                        //                     return true; // Pass validation
                                                        //                 }

                                                        //                 // Condition 2: If "Accom." is not included, the value must be 0
                                                        //                 else {
                                                        //                     if (e.value !== 0) {
                                                        //                         //message = "Night is not allowed when not related to Accom.";
                                                        //                         e.rule.message = "Night must be 0";
                                                        //                         //aMessageAlert(message,"red")
                                                        //                         //DevExpress.ui.dialog.alert({ showTitle: true, title: "Invalid !!", messageHtml: message });
                                                        //                         //e.data.EROAmount3 = 0; // Reset the value
                                                        //                         //aMessageAlert("Only 0 is allowed when not related to Accom.","red")
                                                        //                         return false; // Fail validation
                                                        //                     }
                                                        //                     return true; // Pass validation
                                                        //                 }
                                                        //             },
                                                        //             message: "Invalid value." // Default message (overridden by `e.rule.message` dynamically)
                                                        //         }
                                                        //     ],
                                                        // },
                                                        {
                                                            dataField: "EROAmount4",
                                                            caption: "per Night",
                                                            dataType: "number",
                                                            format: { type: "fixedPoint", precision: 2 },
                                                            editorType: "dxNumberBox",
                                                            editorOptions: {
                                                                format: "#,##0.00",
                                                                width: 90,
                                                                elementAttr: { class: "custom-editor" },
                                                                readOnly: true,
                                                            },
                                                            width: 90,
                                                            visible: !CHK_PRE_V,
                                                            showInColumnChooser: !CHK_PRE_V,
                                                            validationRules: [
                                                                {
                                                                    type: "custom",
                                                                    validationCallback: function (e) {
                                                                        // Step 1: Map code to linkcode
                                                                        let aaChkCodexx = "NONE";
                                                                        const foundLink = aObjects.aaACMatch.find(opt => opt.code === e.data.ERORefNo3);
                                                                        if (foundLink) {
                                                                            aaChkCodexx = foundLink.linkcode;
                                                                        }

                                                                        // Step 2: Default high limit
                                                                        let aLimitAmtaa = 100000000;

                                                                        // Step 3: Find matching limit only if justfor === "perNight"
                                                                        const foundLimit = aaLimitedAmt.find(limit =>
                                                                            limit.code === aaChkCodexx && limit.justfor === "perNight"
                                                                        );

                                                                        if (foundLimit) {
                                                                            aLimitAmtaa = foundLimit.lmtamt;
                                                                        }

                                                                        // Step 4: Validation
                                                                        if (e.value > aLimitAmtaa) {
                                                                            DevExpress.ui.dialog.alert(e.data.ERORefNo3 + " Over Limit", "OVER LIMIT");
                                                                        }

                                                                        return true; // Always pass the validation rule; alert handles logic
                                                                    },
                                                                    message: "Over Limited"
                                                                }
                                                            ],
                                                        },

                                                        // {
                                                        //     dataField: "EROAmount4",
                                                        //     caption: "per Night",
                                                        //     dataType: "number",
                                                        //     format: { type: "fixedPoint", precision: 2 },
                                                        //     editorType: "dxNumberBox",
                                                        //     editorOptions: { format: "#,##0.00", width: 90, elementAttr: { class: "custom-editor" }, readOnly: true, },
                                                        //     width: 90,
                                                        //     visible: true,
                                                        //     /*  visible: function (e) {
                                                        //         return false //(e.row.data.ERORefNo3.includes("Accom"));
                                                        //     }, */
                                                        //     validationRules: [
                                                        //         {
                                                        //             type: "custom",
                                                        //             validationCallback: function (e) { //EROCode01
                                                        //                 //aMessageAlert(e.data.ERORefNo3, "red")
                                                        //                 let aaChkCodexx = (e.data.ERORefNo3 === "O/Seas Trav-Accom." ? "Overseas" : "NONE")
                                                        //                 if (e.data.ERORefNo3 === "O/Seas Trav-Accom.") {
                                                        //                     aaChkCodexx = "Overseas"
                                                        //                 } else if (e.data.ERORefNo3 === "Local  Trav-Accom.") {
                                                        //                     aaChkCodexx = "LocalAccom"
                                                        //                 } else {
                                                        //                     aaChkCodexx = "NONE"
                                                        //                 }
                                                        //                 let aaaChkCodexx = "NONE"; // default value
                                                        //                 const found = aObjects.aaACMatch.find(opt => opt.code === e.data.ERORefNo3);
                                                        //                 if (found) {
                                                        //                     aaaChkCodexx = found.linkcode;
                                                        //                     //alert(aaaChkCodexx)
                                                        //                 }
                                                        //                 let aLimitAmtaa = 100000000; // default if not matched

                                                        //                 // Find the matching item
                                                        //                 const foundLimit = aaLimitedAmt.find(limit => limit.code === aaaChkCodexx);

                                                        //                 // Assign only if justfor === "perNight"
                                                        //                 if (foundLimit && foundLimit.justfor === "perNight") {
                                                        //                     aLimitAmtaa = foundLimit.lmtamt;
                                                        //                     //alert(aLimitAmtaa)
                                                        //                 }
                                                        //                 if (e.value > (aLimitAmtaa)) {
                                                        //                     DevExpress.ui.dialog.alert(e.data.ERORefNo3 + " Over Limit", "OVER LIMIT");
                                                        //                 }
                                                        //                 //console.log(aaChkCodexx)
                                                        //                 if (e.data.ERORefNo3 === "O/Seas Trav-Accom." || e.data.ERORefNo3 === "Local  Trav-Accom.") {
                                                        //                     let aResultxxx = aSearch2json(aaLimitedAmt, "code", aaChkCodexx); //"Overseas"
                                                        //                     let aLimitAmtaa = (aResultxxx.length === 0 ? 10000000 : aResultxxx[0].lmtamt);
                                                        //                     if (e.value > (aLimitAmtaa)) {
                                                        //                         DevExpress.ui.dialog.alert(e.data.ERORefNo3 + " Over Limit", "OVER LIMIT");
                                                        //                     }
                                                        //                     return true //e.value <= (aLimitAmtaa);
                                                        //                 }
                                                        //                 // else if (e.data.ERORefNo3 === "Local Trav-Accom.") { //	 Local Travel EROCode03 && e.data.ERORefNo2 === "Accommodation"
                                                        //                 //     return e.value <= 4500;
                                                        //                 else { return true }
                                                        //             },
                                                        //             message: "Over Limited"
                                                        //         }
                                                        //     ],
                                                        //     // visible: function (e) {
                                                        //     //     return (e.row && e.row.data && e.row.data.ERORefNo3?.includes("Accom"));
                                                        //     // },
                                                        // },
                                                        {
                                                            dataField: "ERODesc05",
                                                            caption: "FA NOTE",
                                                            showInColumnChooser: false,
                                                            dataType: "string",
                                                            cssClass: "colorRED",
                                                            alignment: "top",
                                                            editorType: "dxTextArea",
                                                            editorOptions: { width: 60, height: 100, readOnly: true, elementAttr: { class: "custom-editor" } },
                                                            width: 60,
                                                            height: 100,
                                                            visible: false, // true, //[aaOverseasxx],
                                                        },

                                                    ],
                                                    onContentReady: function (e) { // Get the data source  //ERORefNo4 ERODate01 Department ERODesc02 ERODesc03 ERODesc04
                                                        // let aaID = 1
                                                        // let axRunRun = aGetDateRef(aaOnInitExpGroupDesc.substring(0, 1));
                                                        // let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                        // e.data.ID = aaID
                                                        //console.log("inside data ", e.row.data.HeadRefNo)
                                                        //console.log("inside REFNO ", e.row.data.REFNO)
                                                        // e.data.REFNO = axLineNo

                                                        // e.data.Currency = "THB"
                                                        // e.data.Xrate = 1
                                                        // e.data.ExpGroupCode = aaOnInitExpGroupCode
                                                        // e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                                        // e.data.ERStatus = "Register"
                                                        // e.element.on("paste", function (event) {
                                                        //     // ERORefNo3 Amount Currency Xrate RefundedAmount EROAmount1(HEAD) EROAmount2(avr) EROAmount3(night) EROAmount4(per night)
                                                        //     navigator.clipboard.readText().then((text) => {
                                                        //         const rows = text.trim().split("\n").map(row => row.split("\t"));
                                                        //         console.log("excel paste rows", rows);

                                                        //         const data = rows.map((row, index) => ({ // `index` provides the line number
                                                        //             //LineNumber: index + 1, // Add the line number (starting from 1)

                                                        //             ERORefNo4: row[0]?.trim(), //Bill No
                                                        //             ERODate01: row[1]?.trim(),
                                                        //             Department: row[2]?.trim(), //Department
                                                        //             ERODesc02: row[3]?.trim(), //Description
                                                        //             ERODesc03: row[4]?.trim(), //Purpose
                                                        //             ERODesc04: row[5]?.trim(), 
                                                        //             ERORefNo3: row[6]?.trim(),                                
                                                        //             Amount: row[7]?.trim().replace(/,/g, "").replace(/\r/g, ""), // Clean and convert
                                                        //             Currency: row[8]?.trim(),                                                                            
                                                        //             Xrate: row[9]?.trim().replace(/\r/g, ""), // Remove \r from Xrate as well
                                                        //             RefundedAmount: row[10]?.trim().replace(/,/g, "").replace(/\r/g, ""), // Clean RefundedAmount
                                                        //             EROAmount1: 1,
                                                        //             ID: index + 1, //row[0],
                                                        //             HeadRefNo: aaiHeadRef, //"T2412060390", //row[1], // T2411265850
                                                        //             REFNO: aaiHeadRef + "-" + String(index + 1).padStart(3, '0'), //$.trim(axRunRun) + "-" + String(index + 1).padStart(3, '0'),
                                                        //             ERStatus: "Register",
                                                        //             Confirmed: false,
                                                        //             PayToCode: asStaffID,
                                                        //             PayToName: asFullName,
                                                        //             Division: asDivision,
                                                        //             ERODesc06: asStaffEmail,
                                                        //             //Department: '1182', //row[4],
                                                        //             ReqDate: new Date(),
                                                        //             ExpensesCode: "", // aaOnInitAccCode
                                                        //             ExpensesDescription: aaOnInitAccDesc // aaOnInitAccDesc
                                                        //         }));

                                                        //         console.log("data with line numbers", data, "data len ", data.length, "data type", typeof data);
                                                        //         e.component.option("dataSource", data);
                                                        //         var ObjRowData1 = JSON.stringify(data);
                                                        //         sendRequestNew("Update",ObjRowData1, aaTBKey, aaPFDMI, atob(aaXToX));
                                                        //     }).catch(error => {
                                                        //         console.error("Error reading clipboard data:", error);
                                                        //     });
                                                        // });
                                                        let dataSource = e.component.getDataSource(); // Get all rows 
                                                        let allRows = dataSource.items(); // Get the total number of records 
                                                        let filteredRows = allRows.filter(row => (row.ERORefNo3 === "Entertainment" && row.EROAmount2 > aaEntertainLmt) || (row.ERORefNo3 === "Corporate Gifts" && row.EROAmount2 > aaGiftLmt)); //aaEntertainLmt
                                                        let totalRecords = allRows.length;
                                                        //console.log("Total Records:", totalRecords);
                                                        //console.log("All Rows:", allRows);
                                                        //console.log("Filter Row:", filteredRows)
                                                        //---------------------------------//
                                                        asTotalRecords = totalRecords;
                                                        asAllRow = allRows;
                                                        asFilterRow = filteredRows;
                                                        asFilterRec = filteredRows.length
                                                        //console.log(asFilterRow, asFilterRec, asTotalRecords)
                                                    },

                                                    //onContentReady: function(e) {
                                                    //    e.element.addClass("vertical-grid");
                                                    //},
                                                    /*
                                                    onRowValidating: function(e) {
                                                        var errors = [];
    
                                                        // Check if Name is blank
                                                        if (!e.newData.Amount || e.newData.Name.trim() === "") {
                                                            errors.push({
                                                                column: "Amount",
                                                                message: "Amount cannot be 0."
                                                            });
                                                        }
    
                                                        // Check if Amount is 0
                                                        if (e.newData.Currency === "") {
                                                            errors.push({
                                                                column: "Currency",
                                                                message: "Currency cannot be BLANK."
                                                            });
                                                        }
    
                                                        // If there are errors, add them to the validation errors
                                                        if (errors.length > 0) {
                                                            e.isValid = false; // Prevent saving the row
                                                            e.errorText = errors.map(error => error.message).join("<br>");
                                                        }
                                                    }, 
                                                    */
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
                                                            /*
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
                                                                                    .text("LIMIT/MONTH"),
                                                                                $("<br>"),
                                                                                $("<i class= 'fas fa-coins'; style='color: Indigo;'>;"),
                                                                                $("<span />")
                                                                                    .text('   ' + String(aaLTotal).replace(/(.)(?=(\d{3})+$)/g, '$1,') + '.00'),
                                                                            );
                                                                    }
                                                                },
                                                                {
                                                                    location: "before",
                                                                    template: function () { return $("<div style='padding: 5px 95px;'/>") }
                                                                },*/
                                                            //aPopUpAddForm
                                                            /*
                                                            {
                                                                location: "after",
                                                                widget: "dxButton",
                                                                options: {
                                                                    icon: "check",
                                                                    onClick: function () {
                                                                        aPopUpAddForm(1);
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
                                                                    //text: "Export to PDF",
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
                                                        */
                                                            {
                                                                location: "before",
                                                                widget: "dxButton",
                                                                options: {
                                                                    icon: "refresh",
                                                                    text: "REFRESH",
                                                                    stylingMode: "outlined",
                                                                    onClick: function () {
                                                                        dataGrid.refresh();
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                location: "before",
                                                                template: function () { return $("<div style='padding: 5px 15px;'/>") }
                                                            },
                                                            {
                                                                location: "after",
                                                                locateInMenu: "auto",
                                                                widget: "dxButton",
                                                                options: {
                                                                    icon: "help", //fas fa-info //info
                                                                    //text: "HELP",
                                                                    //type: "success",
                                                                    //stylingMode: "contained",
                                                                    onClick: function () {
                                                                        //dataGrid.refresh();
                                                                        //let aHelpMessage = `<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-plus'></i>" + " ADD MORE ROW</div>`
                                                                        aPopupHelp("HELP", aVARs.HELP02)
                                                                    }
                                                                }
                                                            }
                                                        );
                                                    }

                                                }).dxDataGrid("instance");

                                                $('#row-alternation').dxCheckBox({
                                                    text: 'Alternating Row Color',
                                                    value: true,
                                                    onValueChanged(data) {
                                                        aAddGrid.option('rowAlternationEnabled', data.value);
                                                    },
                                                });

                                                $('#editModeSwitch').dxCheckBox({ //editingMode
                                                    text: ' POPUP EDITING',
                                                    value: true, //editingMode, //(editingMode = "cell" ? true : false), //, // Default to "cell" mode
                                                    onValueChanged: function (data) {
                                                        var newMode = data.value ? "popup" : "cell";
                                                        var newChooser = data.value ? false : true;
                                                        editingMode = newMode;
                                                        chooserMode = newChooser;

                                                        // switch editing mode
                                                        aAddGrid.option('editing.mode', newMode);

                                                        // toggle columnChooser.enabled dynamically
                                                        aAddGrid.option('columnChooser.enabled', newChooser);

                                                        /*if (newMode === "popup") {
                                                            const aThisTheme = localStorage["aDXTheme"];
                                                            changeTheme(aThisTheme);
                                                        } else {
                                                            changeTheme("generic.carmine.compact")     
                                                        }*/

                                                    }
                                                });

                                                $('#editModeSwitch01').dxCheckBox({
                                                    text: ' POPUP EDITING',
                                                    value: false, // default "cell" mode
                                                    onValueChanged: function (data) {
                                                        var newMode = data.value ? "popup" : "cell";
                                                        var newChooser = data.value ? false : true;
                                                        editingMode = newMode;
                                                        chooserMode = newChooser;

                                                        // switch editing mode
                                                        aAddGrid.option('editing.mode', newMode);

                                                        // toggle columnChooser.enabled dynamically
                                                        aAddGrid.option('columnChooser.enabled', newChooser);


                                                    }
                                                });


                                                function dropDownBoxTRF(cellElement, cellInfo) {
                                                    return $("<div>").dxDropDownBox({
                                                        dropDownOptions: { width: 950 },
                                                        dataSource: aaTRFGroup01,
                                                        value: [cellInfo.value],
                                                        valueExpr: "HeadRefNo",
                                                        displayExpr: "HeadRefNo",
                                                        contentTemplate: (e) => {
                                                            console.log("inside var ", aaTRFGroup01);
                                                            return $("<div>").dxDataGrid({
                                                                dataSource: aaTRFGroup01,
                                                                columns: [
                                                                    { dataField: "HeadRefNo", caption: "TRF REF#", width: 150, sortOrder: "asc" },
                                                                    { dataField: "Department", caption: "Department", width: 80 },
                                                                    { dataField: "ERODesc03", caption: "Purpose Desc", width: 200 },
                                                                    { dataField: "ERODesc02", caption: "Destination", width: 200 },
                                                                    { dataField: "EROCheck01", caption: "Location", width: 150, calculateCellValue: function (data) { return data.EROCheck01 ? "Overseas" : "Local"; } },
                                                                    { dataField: "ERORefNo1", caption: "Purpose", width: 150 },
                                                                ],
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
                                                                focusedRowKey: cellInfo.value,
                                                                onSelectionChanged: (sArgs) => {
                                                                    const selectedRow = sArgs.selectedRowKeys[0];
                                                                    if (selectedRow) {
                                                                        e.component.option("value", selectedRow.HeadRefNo);
                                                                        cellInfo.setValue(selectedRow.HeadRefNo);
                                                                        e.component.close();
                                                                    }
                                                                }
                                                            });
                                                        },
                                                    });
                                                }

                                                function dropDownBoxNTRF(cellElement, cellInfo) {
                                                    const aaTBKey = "e8938376-fb56-4e19-bc85-468cbb6dba78";
                                                    const aqrFull = `ID = 1 and PayToCode = '${asStaffID}' and HeadRefNo LIKE '${aTRFPRENO}%'`;
                                                    //const aqrFull = `ID = 1 AND PayToCode = '${asStaffID}' AND HeadRefNo IS NOT NULL AND HeadRefNo <> '' AND HeadRefNo LIKE '%${aTRFPRENO}%'`;
                                                    // "B-ID:" + aBankIDNO + ",C:" aClientCode + ",ADV:" + aCashAdvance + ",LMT:" + aLimitAmt + ",Reason:" + aAdvReason;
                                                    let aViewTRF = aTRFPRENO === "P" ? false : true;
                                                    let aCorpCardNo = aTRFPRENO === "P" ? "PBatchNO" : "";
                                                    // let aBankIDNO = aCorpCardNo === "" ? "" : "BANKIDNO";
                                                    let aClientCode = aTRFPRENO === "P" ? "ERORefNo1" : "ERORefNo1";//
                                                    let aClientCodeT = aTRFPRENO === "P" ? "Client Code" : "Purpose";//
                                                    // let aCashAdvance = aaResultx[0].RefundedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                    // let aLimitAmt = aaResultx[0].EROAmount1.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                                    let aAdvReason = aTRFPRENO === "P" ? "ERODesc03" : "ERODesc03";//aaResultx[0].ERODesc03;
                                                    let aADvReasonT = aTRFPRENO === "P" ? "Reason" : "Purpose Desc";
                                                    // let aFileUrl = aaResultx[0].ERODesc01;
                                                    // { dataField: "HeadRefNo", caption: "REF#", width: 150 },
                                                    // { dataField: "Department", caption: "Department", width: 80 },
                                                    // { dataField: "ERODesc03", caption: "Purpose Desc", width: 200 },
                                                    // { dataField: "ERODesc02", caption: "Destination", width: 200 },
                                                    // {
                                                    //   dataField: "EROCheck01",
                                                    //   caption: "Location",
                                                    //   width: 150,
                                                    //   calculateCellValue: data => data.EROCheck01 ? "Overseas" : "Local"
                                                    // },
                                                    // { dataField: "ERORefNo1", caption: "Purpose", width: 150 }

                                                    const aurl = `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/${aaTBKey}/all`;
                                                    const aSettings = {
                                                        url: aurl,
                                                        method: "POST",
                                                        timeout: 0,
                                                        headers: { "Content-Type": "application/json" },
                                                        data: JSON.stringify({ "@": btoa(aqrFull) })
                                                    };
                                                    return $("<div>").dxDropDownBox({
                                                        dropDownOptions: { width: 950 },
                                                        dataSource: new DevExpress.data.CustomStore({
                                                            key: "HeadRefNo", // ensure this matches your data
                                                            loadMode: "raw",
                                                            load: () => $.post(aSettings).then(resp => {
                                                                aaDropdownTRF = resp || []; // make sure it's an array
                                                                // 🔹 Add empty option at the beginning
                                                                aaDropdownTRF.unshift({
                                                                    HeadRefNo: "",        // key field must exist
                                                                    ERORefNo1: "",        // fill with empty values
                                                                    ERODesc02: "(empty)"  // or you can just ""
                                                                });
                                                                return aaDropdownTRF;
                                                            })
                                                        }),

                                                        value: cellInfo.value,
                                                        valueExpr: "HeadRefNo",
                                                        displayExpr: "HeadRefNo",
                                                        contentTemplate: (e) => {
                                                            //let aCorpCard = e.row.data.PBatchNO;
                                                            return $("<div>").dxDataGrid({
                                                                dataSource: e.component.option("dataSource"),
                                                                showColumnLines: true,
                                                                showBorders: true,
                                                                showRowLines: true,
                                                                columns: [
                                                                    { dataField: "HeadRefNo", caption: "REF#", width: 150 },
                                                                    //{ dataField: "Department", caption: "Department", width: 80 , visible: aViewTRF,},
                                                                    { dataField: "ERODesc03", caption: aADvReasonT, width: 200 },
                                                                    { dataField: "ERODesc02", caption: "Destination", width: 200, visible: aViewTRF, },
                                                                    {
                                                                        dataField: "EROCheck01",
                                                                        caption: "Location",
                                                                        visible: aViewTRF,
                                                                        width: 150,
                                                                        calculateCellValue: data => data.EROCheck01 ? "Overseas" : "Local"
                                                                    },
                                                                    { dataField: "ERORefNo1", caption: aClientCodeT, width: 150 },
                                                                    {
                                                                        caption: "Corp Card",
                                                                        dataField: "PBatchNo",
                                                                        width: 150,
                                                                        // calculateCellValue: data => data.PBatchNO === "" ? "NOT USE" : data.PBatchNO,
                                                                        // cellTemplate: function (container, options) {
                                                                        //     const value = options.data.PBatchNO;
                                                                        //     const displayText = value && value.trim() !== "" ? value : "NOT USE";
                                                                        //     container.text(displayText);
                                                                        // }
                                                                    }

                                                                ],
                                                                searchPanel: { visible: true },
                                                                filterRow: { visible: true },
                                                                selection: { mode: "single" },
                                                                hoverStateEnabled: true,
                                                                height: 450,
                                                                showBorders: true,
                                                                selectedRowKeys: [cellInfo.value],
                                                                focusedRowKey: cellInfo.value,
                                                                onSelectionChanged: (sArgs) => {
                                                                    const selected = sArgs.selectedRowsData[0];
                                                                    if (selected) {
                                                                        e.component.option("value", selected.HeadRefNo);
                                                                        cellInfo.setValue(selected.HeadRefNo);
                                                                        e.component.close();
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                }

                                                function dropDownBoxDEC(cellElement, cellInfo) {
                                                    var aaTBKey = "caca1c40-d252-41b9-ac13-abfedb61dcf1" //"5ad2685d-4114-4aa5-aa87-67368f4a3559";
                                                    const aqrFull = `ID = 1 and ERStatus LIKE '%ed%'and ERORefNo1 = 'Given' and PayToCode = '${asStaffID}'`;
                                                    var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all';
                                                    var aSettings = {
                                                        url: aurl,
                                                        method: "POST",
                                                        timeout: 0,
                                                        headers: { "Content-Type": "application/json" },
                                                        data: JSON.stringify({ "@": btoa(aqrFull) })
                                                    };
                                                    return $("<div>").dxDropDownBox({
                                                        dropDownOptions: { width: 1100 },
                                                        dataSource: new DevExpress.data.CustomStore({
                                                            key: "REFNO",
                                                            loadMode: "raw",
                                                            load: function () {
                                                                return $.post(aSettings).then(function (resp) {
                                                                    aaAllData = resp; // Optional: store globally
                                                                    aaDropdownData = resp;     // 👈 Now available globally
                                                                    return resp;
                                                                });
                                                            }
                                                        }),
                                                        value: cellInfo.value,
                                                        valueExpr: "HeadRefNo",
                                                        displayExpr: "HeadRefNo",
                                                        contentTemplate: function (e) {
                                                            return $("<div>").dxDataGrid({
                                                                dataSource: e.component.option("dataSource"),
                                                                columns: [
                                                                    { dataField: "HeadRefNo", caption: "REF#", width: 120, sortOrder: "asc" },
                                                                    { dataField: "ERODate01", dataType: "date", format: "dd/MM/yyyy", width: 120, stylingMode: 'filled' },
                                                                    { dataField: "EROCode01", caption: "Type", width: 100 },
                                                                    { dataField: "ERODesc01", caption: "Details", width: 150 },
                                                                    { dataField: "ERODesc02", caption: "Purpose", width: 150 },
                                                                    { dataField: "ERORefNo1", caption: "Given", width: 120 }, //EROAmount10
                                                                    {
                                                                        dataField: "EROAmount1",
                                                                        caption: "Value",
                                                                        width: 85,
                                                                        format: { type: "fixedPoint", precision: 2 }, // <-- formatted with comma and 2 decimals
                                                                        alignment: "right" // optional: align numbers to the right
                                                                    },
                                                                    {
                                                                        dataField: "EROAmount2",
                                                                        caption: "Head Count",
                                                                        width: 50,
                                                                        format: { type: "fixedPoint", precision: 0 }, // <-- formatted with comma and 2 decimals
                                                                        alignment: "right" // optional: align numbers to the right
                                                                    },
                                                                    {
                                                                        dataField: "Amount",
                                                                        caption: "Average Value",
                                                                        width: 80,
                                                                        format: { type: "fixedPoint", precision: 0 }, // <-- formatted with comma and 2 decimals
                                                                        alignment: "right" // optional: align numbers to the right
                                                                    },
                                                                ],
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
                                                                focusedRowKey: cellInfo.value,
                                                                // ✅ Add your color styling here
                                                                onRowPrepared: function (info) {
                                                                    if (info.rowType === "data") {
                                                                        info.rowElement.css("background-color", "#fdfde3"); // pale yellow
                                                                        info.rowElement.css("color", "#333");
                                                                    }
                                                                },
                                                                onSelectionChanged: function (sArgs) {
                                                                    const selectedRow = sArgs.selectedRowsData[0];
                                                                    if (selectedRow) {
                                                                        e.component.option("value", selectedRow.HeadRefNo);
                                                                        cellInfo.setValue(selectedRow.HeadRefNo);
                                                                        e.component.close();// selectedRow.ERODesc02 = EROCode01 
                                                                    }
                                                                }
                                                            });
                                                        },
                                                    });
                                                }

                                                function dropDownBoxACC(cellElement, cellInfo) {
                                                    return $("<div>").dxDropDownBox({
                                                        dropDownOptions: { width: 750 },
                                                        dataSource: xxxSubGroup01, //aaSubGroup01 
                                                        value: [cellInfo.value],
                                                        valueExpr: "EDESC",
                                                        displayExpr: "EDESC",
                                                        contentTemplate: (e) => {
                                                            return $("<div>").dxDataGrid({
                                                                dataSource: xxxSubGroup01, //aaSubGroup01
                                                                columns: [
                                                                    { dataField: "EDESC", caption: "Eng Desc.", width: 300 },
                                                                    { dataField: "TDESC", caption: "Thai Desc", width: 300 },
                                                                    { dataField: "ACCCODE", caption: "Account Code", width: 100, sortOrder: "asc" },
                                                                    //{ dataField: "EXPDesc", caption: "Group", width: 100 }
                                                                ],
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
                                                                focusedRowKey: cellInfo.value,
                                                                onSelectionChanged: (sArgs) => {
                                                                    const selectedRow = sArgs.selectedRowKeys[0];
                                                                    if (selectedRow) {
                                                                        e.component.option("value", selectedRow.EDESC);
                                                                        cellInfo.setValue(selectedRow.EDESC);
                                                                        e.component.close();
                                                                    }
                                                                }
                                                            });
                                                        },
                                                    });
                                                }

                                                // let axqr2S = `Where EXPGroup LIKE '%${aaERTYPE}%'`; //"Where EXPGroup LIKE '%" + aaERTYPE + "%'" 
                                                // let axFieldSelected = "ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE,EXPGroup,EXPDesc"
                                                // let axFullBody = `Select ${axFieldSelected} From ExtraOnLine.dbo.ACCOUNTCHART ${axqr2S}`
                                                // fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(axFullBody) }), redirect: "follow" })

                                                function dropDownBoxACCC(cellElement, cellInfo) {
                                                    var aaTBKey = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232" //"caca1c40-d252-41b9-ac13-abfedb61dcf1" //"5ad2685d-4114-4aa5-aa87-67368f4a3559";
                                                    const aqrFull = `EXPGroup LIKE '%${aaERTYPE}%'`;
                                                    var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all';
                                                    var aSettings = {
                                                        url: aurl,
                                                        method: "POST",
                                                        timeout: 0,
                                                        headers: { "Content-Type": "application/json" },
                                                        data: JSON.stringify({ "@": btoa(aqrFull) })
                                                    };
                                                    return $("<div>").dxDropDownBox({
                                                        dropDownOptions: { width: 1100 },
                                                        dataSource: new DevExpress.data.CustomStore({
                                                            key: "ACCCODE",
                                                            loadMode: "raw",
                                                            load: function () {
                                                                return $.post(aSettings).then(function (resp) {
                                                                    aaAllData = resp; // Optional: store globally
                                                                    aaDropdownData = resp;     // 👈 Now available globally
                                                                    return resp;
                                                                });
                                                            }
                                                        }),
                                                        value: cellInfo.value,
                                                        valueExpr: "EDESC",
                                                        displayExpr: "EDESC",
                                                        contentTemplate: function (e) {
                                                            return $("<div>").dxDataGrid({
                                                                dataSource: e.component.option("dataSource"),
                                                                columns: [
                                                                    { dataField: "EDESC", caption: "Eng Desc.", width: 300 },
                                                                    { dataField: "TDESC", caption: "Thai Desc", width: 300 },
                                                                    { dataField: "ACCCODE", caption: "Account Code", width: 100, sortOrder: "asc" },
                                                                    //{ dataField: "EXPDesc", caption: "Group", width: 100 }
                                                                ],
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
                                                                focusedRowKey: cellInfo.value,
                                                                // ✅ Add your color styling here
                                                                onRowPrepared: function (info) {
                                                                    if (info.rowType === "data") {
                                                                        info.rowElement.css("background-color", "#fdfde3"); // pale yellow
                                                                        info.rowElement.css("color", "#333");
                                                                    }
                                                                },
                                                                onSelectionChanged: (sArgs) => {
                                                                    const selectedRow = sArgs.selectedRowKeys[0];
                                                                    if (selectedRow) {
                                                                        e.component.option("value", selectedRow.EDESC);
                                                                        cellInfo.setValue(selectedRow.EDESC);
                                                                        e.component.close();
                                                                    }
                                                                }
                                                            });
                                                        },
                                                    });
                                                }

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

                                        const aPopupHelp = (aHTitle, aHelpMessageOrFile, useFullScreen = false) => {
                                            const isPdf = typeof aHelpMessageOrFile === "string" && aHelpMessageOrFile.includes(".pdf");
                                            const isHtml = typeof aHelpMessageOrFile === "string" && aHelpMessageOrFile.includes(".html");

                                            const popup = $("#popupHelp").dxPopup({
                                                title: aHTitle,
                                                height: 800,
                                                width: 1200,
                                                position: { offset: "-40 -100" },
                                                fullScreen: useFullScreen, // Toggle full-screen mode based on the parameter
                                                visible: true,
                                                showCloseButton: true,
                                                focusStateEnabled: false, // disable focusing of popup overlay
                                                toolbarItems: [
                                                    {
                                                        widget: "dxButton",
                                                        location: "after",
                                                        options: {
                                                            //text: "Toggle Fullscreen",
                                                            icon: "fas fa-expand", // Use font-expand icon for fullscreen toggle <i class="fas fa-window-maximize"></i>
                                                            onClick: function () {
                                                                const currentState = popup.option("fullScreen");
                                                                popup.option("fullScreen", !currentState);
                                                            },
                                                        },
                                                    },
                                                ],
                                                contentTemplate: function (contentElement) {
                                                    const container = $("<div>").css({ height: "100%", overflowY: "auto" });

                                                    if (isPdf || isHtml) {
                                                        // If the input is a PDF or HTML file, embed it in the popup
                                                        const iframe = $("<iframe>")
                                                            .attr("src", aHelpMessageOrFile)
                                                            .css({ width: "100%", height: "100%", border: "none" });
                                                        container.append(iframe);
                                                    } else {
                                                        // If the input is a message, display it as text
                                                        container.append(aHelpMessageOrFile);
                                                    }

                                                    container.appendTo(contentElement);
                                                },
                                            }).dxPopup("instance");
                                        };

                                        // const aPopUpUpLoad = (aFolder) => {
                                        //     $(() => {
                                        //         const popup = $("#popupUL").dxPopup({
                                        //             title: "Upload File",
                                        //             height: 400,
                                        //             width: 800,
                                        //             position: { offset: "0 -10" }, //{offset: "0 -180"},
                                        //             //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                        //             visible: true,
                                        //             fullScreen: false,
                                        //             showCloseButton: true,
                                        //             showTitle: true,
                                        //             dragEnabled: true,
                                        //             closeOnOutsideClick: false,
                                        //             resizeEnabled: true,
                                        //             //shadingColor:"rgb(190,190,190,0.9)",

                                        //             contentTemplate: () => {
                                        //                 return $("<div />").append(
                                        //                     // $("<div style = 'margin-left: 10px'>รายละเอียด - DESCRIPTIONS</div>"),
                                        //                     // $("<p><div style = 'margin-left: 10px' id='first-name'></div></p>"),
                                        //                     $("<p><div style = 'margin-left: 10px' id='fileUploader'></div></p>"),

                                        //                 );
                                        //             },
                                        //             /*
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
                                        //                 }
                                        //             ]
                                        //         */
                                        //         }).dxPopup("instance");

                                        //         const fileUploader = $('#file-uploader').dxFileUploader({
                                        //             multiple: false,
                                        //             accept: 'image/*', //'*',
                                        //             value: [],
                                        //             uploadMode: 'instantly', //'instantly', 'useButtons'
                                        //             uploadUrl: 'https://js.devexpress.com/Demos/NetCore/FileUploader/Upload',
                                        //             onValueChanged(e) {
                                        //                 const files = e.value;
                                        //                 if (files.length > 0) {
                                        //                     $('#selected-files .selected-item').remove();
                                        //                     $.each(files, (i, file) => {
                                        //                         const $selectedItem = $('<div />').addClass('selected-item');
                                        //                         $selectedItem.append(
                                        //                             $('<span />').html(`Name: ${file.name}<br/>`),
                                        //                             $('<span />').html(`Size ${file.size} bytes<br/>`),
                                        //                             $('<span />').html(`Type ${file.type}<br/>`),
                                        //                             $('<span />').html(`Last Modified Date: ${file.lastModifiedDate}`),
                                        //                         );
                                        //                         $selectedItem.appendTo($('#selected-files'));
                                        //                     });
                                        //                     $('#selected-files').show();
                                        //                 } else { $('#selected-files').hide(); }
                                        //             },
                                        //         }).dxFileUploader('instance');

                                        //         /*
                                        //                     var myHeaders = new Headers();
                                        //                     myHeaders.append("ref", "44095B6C-CC17-47FD-895B-649E0EAA2BAE");
                                        //                     myHeaders.append("Content-Type", "multipart/form-data");
                                        //                     var formdata = new FormData();
                                        //                     formdata.append("file", fileInput.files[0], "file:///C:/HTML/XOL/images/avatar.png");
                                        //                     //formdata.append("file", fileInput.files[0], "file:///C:/HTML/XOL/images/userw007.png");
                                        //                     formdata.append("FilePath", "test");
                                        //                     var requestOptions = {  method: 'POST',  headers: myHeaders,  body: formdata,  redirect: 'follow'};
                                        //                     fetch("https://cbsdev3.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAExx", requestOptions)  
                                        //                         .then(response => response.text())  .then(result => console.log(result))  
                                        //                         .catch(error => console.log('error', error));
                                        //         */

                                        //         $("#fileUploader").dxFileUploader({
                                        //             multiple: false,
                                        //             accept: 'image/*',
                                        //             //allowedFileExtensions: [".jpg", ".jpeg", ".png"],
                                        //             maxFileSize: 4000000, // 4 MB
                                        //             uploadUrl: "https://cbsdev3.locktonwattana.com/wwwroot/Uploads",
                                        //             onValueChanged: function (e) {
                                        //                 var files = e.value;
                                        //                 if (files.length > 0) {
                                        //                     var file = files[0];
                                        //                     var formData = new FormData();
                                        //                     formData.append("file", file);
                                        //                     //formdata.append("FilePath", "test");
                                        //                     $.ajax({
                                        //                         url: "https://cbsdev3.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAExx", //"http://wikran-w10:8081/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAExx",
                                        //                         type: "POST",
                                        //                         timeout: 0,
                                        //                         headers: { "ref": "44095B6C-CC17-47FD-895B-649E0EAA2BAE", "Content-Type": "multipart/form-data;boundary=<calculated when request is sent>" }, //"Content-Type", "multipart/form-data;boundary=<calculated when request is sent>" //"multipart/form-data"
                                        //                         mimeType: "multipart/form-data",
                                        //                         data: formData,
                                        //                         processData: false,
                                        //                         contentType: false,
                                        //                         success: function (response) {
                                        //                             console.log("File uploaded successfully!");
                                        //                         },
                                        //                         error: function (error) {
                                        //                             console.log("Error uploading file: " + error);
                                        //                         }
                                        //                     });
                                        //                 }
                                        //             }
                                        //         });


                                        //         $('#first-name').dxTextBox({
                                        //             value: 'John',
                                        //             name: 'FirstName',
                                        //         });

                                        //         $('#last-name').dxTextBox({
                                        //             value: 'Smith',
                                        //             name: 'LastName',
                                        //         });
                                        //         /*
                                        //         $('#file-uploader').dxFileUploader({
                                        //             selectButtonText: 'Select photo',
                                        //             labelText: '',
                                        //             accept: 'image/*',
                                        //             uploadMode: 'useForm',
                                        //         });
                                        //         */
                                        //         $('#button').dxButton({
                                        //             text: 'Update profile',
                                        //             type: 'success',
                                        //             onClick() {
                                        //                 DevExpress.ui.dialog.alert('Uncomment the line to enable sending a form to the server.', 'Click Handler');
                                        //                 // $("#form").submit();
                                        //             },
                                        //         });
                                        //     });
                                        // }

                                    }) //then fetch (HOR or HR Email get inside better ?)
                            }) //then fetch (ACCCODE)
                        //    }) // then fetch (TRF)
                    });
                    // TOP PRG

                }); //});  // ajax  
            // .catch(err => {
            //     console.error("Startup fetch error:", err);
            // });
        }) //then fetch aaLoadSQL
        .catch(error => console.error("Error fetching SQL data:", error)); // load loadsqldata  
});  // FIRST PRG 