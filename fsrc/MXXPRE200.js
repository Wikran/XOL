//HOD Approve for Pre-Approved

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
var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
//var aaKeyField = localStorage["aaXKFX"];
//var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var aaPFDMZz = aWebSpaceAPI; //"https://webspace.locktonwattana.com"; //"https://cbsdev2.locktonwattana.com"; // API for DMZ only
let aaMXXT = "pre"; //localStorage.getItem("aDXMenuTitle"); //localStorage["aDXMenuTitle"]; //

// aaMXXT is a string from localStorage check if Pre-Approved (PRE) or Travel Requisition (TRF) 
const CHK_CODE = aaMXXT.toLowerCase().includes("pre") ? "PRE" : "TRF";
const CHK_LABEL = CHK_CODE === "PRE" ? "Pre-Approved" : "Travel Requisition"; // at menu setup the title name must be one of these (it FIX)
const CHK_PRE_V = CHK_CODE === "PRE" ? true : false;
const CHK_TRF_V = CHK_CODE === "PRE" ? false : true;

// Fixed constants
const aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492";
const aaERTYPE = CHK_CODE === "PRE" ? "900" : "800"; //"800"
const aaRunPre = CHK_CODE === "PRE" ? "P" : "R"; // "R"
// if Menu is "Pre-Approved" then Approver = "PRE" else "HOD"
// let aDivS = "Where ApproverCode = 'TRFO' OR (ApproverCode = 'HOD' AND ApproveToDivision = '" + aDivisionC + "') Order By LRange02"
const APV_TYPE = CHK_PRE_V ? "PRE" : "HOD";
let jsonData = [];
let jsonDataSum = [];
let njsonDataSum = [];
let templateBuffer = null; // FlexibleTEMP.xlsx buffer
const PayByList = [
    { PayType: "Corporate Card" },
    { PayType: "Corporate Card 2" },
    { PayType: "Personal" },
];



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

// const aTranTextJson = (aText, aFMark, aLMark) => { //"NAME:" "EMAIL:"
//     var axHODFtext = aText;
//     var xaChkName;
//     var aatestChk = axHODFtext.replaceAll("|", '"')
//     var xxChk1 = aatestChk.search(aFMark);
//     var xxChk2 = aatestChk.search(aLMark);

//     xxChk1 = aatestChk.search(aFMark)
//     xxChk2 = aatestChk.search(aLMark)

//     //console.log(xxChk1, xxChk2)
//     //console.log(aatestChk.substr(xxChk1+5, xxChk2-5))
//     //aatestChk.substr(xxChk1+5, xxChk2-xxChk1-5)
//     if (aLMark === "") {
//         xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, 300)); //xxChk1+5, xxChk2-5);
//     } else {
//         xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, xxChk2 - xxChk1 - 5)); //xxChk1+5, xxChk2-5);
//     }
//     //console.log(xaChkName);
//     const xxNameArr = JSON.parse(xaChkName);
//     //console.log(xxNameArr)
//     //console.log(xxNameArr[0])
//     return xxNameArr;
// }

const aTranTextJson = (aText, aFMark, aLMark = "") => {
    // Replace all | with "
    let normalized = aText.replaceAll("|", '"');

    // Remove trailing commas inside brackets: [ ... ,] → [ ... ]
    normalized = normalized.replace(/(\[[^\]]*?),\s*\]/g, (match, group) => {
        return group + "]";
    });

    // Find markers
    const startIdx = normalized.indexOf(aFMark);
    const endIdx = aLMark ? normalized.indexOf(aLMark, startIdx + aFMark.length) : -1;

    if (startIdx === -1) {
        throw new Error(`Start marker "${aFMark}" not found`);
    }

    // Extract substring safely
    const raw = aLMark && endIdx !== -1
        ? normalized.slice(startIdx + aFMark.length, endIdx)
        : normalized.slice(startIdx + aFMark.length);

    // Trim whitespace
    const cleaned = raw.trim();

    // Parse JSON
    return JSON.parse(cleaned);
};

// Async version of aSQLAction
const dbSQLAction = async (aDMZServer, aCommands) => {
    const aLocalSQLToken = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";   // with select command
    const aLocalNonQueryToken = "9DE8BDB8-8EE0-48D0-A506-9AD24F151F9A"; // no select command
    const aaXPUB = "A75FCC75-8FB6-4460-B3F6-7070B4437930";            // Public Key

    const aFullBody = aCommands;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ "@": aFullBody });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    const aURL = `${aDMZServer}/DMQ/${acPRJ}/${aaXPUB}/${aLocalNonQueryToken}`;

    try {
        const response = await fetch(aURL, requestOptions);   // 👈 await fetch
        const aData = await response.json();                  // 👈 await json parse
        // 👉 handle your data here
        console.log("SQL Action result:", aData);
        return aData; // return result so caller can use it
    } catch (error) {
        console.error("SQL Action error:", error);
        throw error; // rethrow if you want caller to handle
    }
};

function lparseVendorNote(noteText) {
    const extractArray = (label, raw) => {
        const match = raw.match(new RegExp(`${label}:\\[(.*?)\\]`));
        if (!match) return [];
        const content = match[1];
        if (label === "NAME" || label === "MAIL") {
            return [...content.matchAll(/\|\s*(.*?)\s*\|/g)].map(m => m[1]);
        } else {
            return content.split(',').map(v => parseFloat(v.trim()));
        }
    };

    const names = extractArray("NAME", noteText);
    const mails = extractArray("MAIL", noteText);
    const rangs = extractArray("RANG", noteText);

    const result = names.map((name, i) => ({
        name,
        mail: mails[i] || null,
        rang: rangs[i] || null
    }));

    return result;
}

function nparseVendorNote(noteText) {
    const extractArray = (label, raw) => {
        const match = raw.match(new RegExp(`${label}:\\[(.*?)\\]`));
        if (!match) return [];
        const content = match[1];
        if (label === "NAME" || label === "MAIL" || label === "APPD") {
            return [...content.matchAll(/\|\s*(.*?)\s*\|/g)].map(m => m[1]);
        } else {
            return content.split(',').map(v => v.trim());
        }
    };

    const names = extractArray("NAME", noteText);
    const mails = extractArray("MAIL", noteText);
    const rangs = extractArray("RANG", noteText).map(v => parseFloat(v));
    const appds = extractArray("APPD", noteText); // optional Approved Date

    const result = names.map((name, i) => ({
        name,
        mail: mails[i] || null,
        rang: rangs[i] || null,
        appd: appds[i] || "01/01/1900"   // 👈 default date if missing
    }));

    return result;
}

function vnparseVendorNote(noteText) {
    if (!noteText || typeof noteText !== "string") {
        return []; // ถ้า null/undefined/ไม่ใช่ string → คืน array ว่าง
    }
    const extractArray = (label, raw) => {
        const match = raw.match(new RegExp(`${label}:\\[(.*?)\\]`));
        if (!match) return [];
        const content = match[1];

        // ใช้ regex สำหรับ NAME, MAIL, APPD
        if (label === "NAME" || label === "MAIL" || label === "APPD") {
            return [...content.matchAll(/\|\s*(.*?)\s*\|/g)].map(m => m[1]);
        } else {
            return content.split(',').map(v => v.trim());
        }
    };

    const names = extractArray("NAME", noteText);
    const mails = extractArray("MAIL", noteText);
    const rangs = extractArray("RANG", noteText).map(v => parseFloat(v));
    const appds = extractArray("APPD", noteText);

    const result = names.map((name, i) => {
        let appdVal = appds[i];

        // ถ้าไม่มีค่า → default
        if (appdVal === undefined || appdVal === null || appdVal === "") {
            appdVal = "01/01/1900";
        }

        return {
            name,
            mail: mails[i] || null,
            rang: rangs[i] || null,
            appd: appdVal
        };
    });

    return result;
}

const aaNowText = (aNowDatev) => { // use
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
                            // let lines = taskProgram.split("\n");
                            // aObjects[aMatch[1]] = lines
                            //     .map(line => {
                            //         line = line.trim().replace(/,$/, "");
                            //         line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                            //         return JSON.parse(line);
                            //     })
                            //     .map(obj => {
                            //         for (let key in obj) {
                            //             if (key.includes("amt") && typeof obj[key] === "string") {
                            //                 obj[key] = +obj[key];
                            //             }
                            //         }
                            //         return obj;
                            //     });
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
                    const jsonStr = aVARs.TEMPJSBF || "[]";
                    const aHeaders = aArrays.HEADERSETS[1] || ["", "", "Product", "Quantity", "Price", "Amount", "Payment"];
                    const arSTATUS = aArrays.arSTATUS;
                    const arSTANOTE = aArrays.arSTANOTE;
                    // console.log(aArrays.ACONFIRM[0])
                    // console.log(aArrays.ACONFIRM[1])
                    let asFullName = localStorage["asFTNAME"];
                    let asStaffID = $.trim(localStorage["asSTFID"]);
                    let asDepartment = localStorage["asDEPT"];
                    let asDivision = $.trim(localStorage["asDIV"]);
                    let asStaffEmail = localStorage["asEMAIL"];
                    //==== Corporate Card Setup ==========================
                    try {
                        let aaCARDIDaa = "";
                        const trimmedStaffID = asStaffID.trim();
                        // ค้นหาข้อมูลพนักงานจาก EMPID
                        const aaRESULaa = aObjects.CORPREG.find(item => item.EMPID === trimmedStaffID);
                        //alert(aaRESULaa.CardID)
                        const cardIdList = aaRESULaa && aaRESULaa.CardID
                            ? ["", aaRESULaa.CardID] // "" = no card
                            : [""];
                        const cardIdOptions = cardIdList.map(id => ({
                            CardID: id,
                            Label: id === "" ? "NOT USE" : id  // not use
                        }));
                        if (!aaRESULaa) {
                            console.log("No Staff ID: " + trimmedStaffID);
                        } else if (aaRESULaa.CardID && aaRESULaa.CardID !== "" && aaRESULaa.CardID !== "0") {
                            aaCARDIDaa = aaRESULaa.CardID;
                            //aaRESULaa.CardID.unshift(""); // Result: ["", "12345"]
                            console.log("CardID: " + aaCARDIDaa);
                        } else {
                            console.log("found Staff ID but CardID is empty or = 0");
                        }
                        let HAVECORPCARD = (aaCARDIDaa === "" ? false : true);
                    } catch (err) {
                        //console.error("Invalid Note JSON", err);
                        alert(`Warning invalid Corporate Card. ${aaPXIXD}`);
                        return;
                    }
                    //======================================================

                    function parseVendorNote(noteText) {
                        if (!noteText || typeof noteText !== "string") {
                            return []; // ถ้า null/undefined/ไม่ใช่ string → คืน array ว่าง
                        }
                        const extractArray = (label, raw) => {
                            const match = raw.match(new RegExp(`${label}:\\[(.*?)\\]`));
                            if (!match) return [];
                            const content = match[1];

                            // ใช้ regex สำหรับ NAME, MAIL, APPD
                            if (label === "NAME" || label === "MAIL" || label === "APPD") {
                                return [...content.matchAll(/\|\s*(.*?)\s*\|/g)].map(m => m[1]);
                            } else {
                                return content.split(',').map(v => v.trim());
                            }
                        };

                        const names = extractArray("NAME", noteText);
                        const mails = extractArray("MAIL", noteText);
                        const rangs = extractArray("RANG", noteText).map(v => parseFloat(v));
                        const appds = extractArray("APPD", noteText);

                        const result = names.map((name, i) => {
                            let appdVal = appds[i];

                            // ถ้าไม่มีค่า → default
                            if (appdVal === undefined || appdVal === null || appdVal === "") {
                                appdVal = "01/01/1900";
                            }

                            return {
                                name,
                                mail: mails[i] || null,
                                rang: rangs[i] || null,
                                appd: appdVal
                            };
                        });

                        return result;
                    }


                    function jsonToBuffer(jsonString) {
                        if (!jsonString || typeof jsonString !== "string") {
                            throw new Error("Invalid JSON string");
                        }
                        const arr = JSON.parse(jsonString);       // parse string -> array of numbers
                        const uint8Array = new Uint8Array(arr);   // convert -> Uint8Array
                        return uint8Array.buffer;                 // return ArrayBuffer
                    }

                    // รองรับทั้ง ISO string ("2025-11-30T00:00") หรือ "dd/mm/yyyy"
                    function toUTCDateOnly(input) {
                        let y, m, d;

                        if (typeof input === "string" && input.includes("/")) {
                            // "dd/mm/yyyy"
                            const [dd, mm, yyyy] = input.split("/").map(Number);
                            d = dd; m = mm; y = yyyy;
                        } else {
                            // ISO/Date: ใช้ Date เพื่ออ่าน component แบบโลคอล แล้วสร้างใหม่เป็น UTC date
                            const dt = new Date(input);
                            y = dt.getFullYear();
                            m = dt.getMonth() + 1;
                            d = dt.getDate();
                        }

                        // สร้าง Date ที่ 00:00 UTC
                        return new Date(Date.UTC(y, m - 1, d));
                    }

                    function isEmpty(jsHOD) {
                        // null หรือ undefined
                        if (jsHOD === null || jsHOD === undefined) return true;

                        // Array ว่าง []
                        if (Array.isArray(jsHOD) && jsHOD.length === 0) return true;

                        // Object ว่าง {}
                        if (typeof jsHOD === "object" && !Array.isArray(jsHOD) && Object.keys(jsHOD).length === 0) {
                            return true;
                        }

                        // ค่าอื่น ๆ ถือว่ามีข้อมูล
                        return false;
                    }

                    function replacePipeOrderWithDate(text, order, dateText) {
                        const regex = new RegExp(`\\|${order}\\|`);
                        return text.replace(regex, `|${dateText}|`);
                    }

                    const ULbCustomerGrp = async (iData, jsHOD, ToNames) => {
                        //alert("inside ULbCustomerGrp")
                        const groupRecord = iData;
                        //alert("in check iData")
                        //alert("inside ULb")
                        //alert(JSON.stringify(iData, null, 2));
                        const customerGroupName = iData.ERORefNo1;
                        //const ToNames = AddTitle(iData.Vendor01Note, aVARs.THTITLE)
                        //alert("in customer group = " + customerGroupName)
                        let ljsHOD = isEmpty(jsHOD)
                        //alert("in alert ljsHOD")
                        //alert(JSON.stringify(jnHOD, null, 2));
                        //alert(ljsHOD)
                        //alert("in jsHOD len = ")
                        //alert("in jsHOD len = ")
                        //alert(jsHOD.length)
                        let nofjsHOD = !ljsHOD ? jsHOD.length : 0;
                        // let nextName = ljsHOD ? "NO" : jsHOD[1].name
                        // let nextDate = ljsHOD ? "01/01/1900" : jsHOD[1].appd
                        //alert(nofjsHOD)
                        //alert("in jsonStr")
                        //alert(isEmpty(jsonStr))


                        try {
                            const templateBuffer = jsonToBuffer(jsonStr);
                            const today = new Date();
                            // 👉 แบบใส่วันที่+เวลา (dd/MM/yyyy HH:mm:ss)
                            const formattedDateTime = today.toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric"
                            });

                            //alert("format date")
                            //alert(customerGroupName)
                            //njsonDataSum.push(iData);
                            // Find the selected group record from njsonDataSum
                            // const groupRecord = njsonDataSum.find(r => r.ERORefNo1 === customerGroupName);

                            let lOverLimit = (groupRecord.RefundedAmount > groupRecord.EROAmount1);
                            //alert("lOverLimit")

                            try {
                                // Load template workbook
                                const templateWb = new ExcelJS.Workbook();
                                await templateWb.xlsx.load(templateBuffer);

                                const memoSheet = templateWb.getWorksheet("MEMO");
                                const dataSheet = templateWb.getWorksheet("DATA");
                                if (!memoSheet || !dataSheet) {
                                    alert("Error,Template missing MEMO or DATA sheet.");
                                    return;
                                }
                                //alert("MEMO , DATA found")

                                const aSt = 1;

                                //alert("before fFCorpC")
                                // Parse Note JSON for the selected group
                                let noteItems = [];
                                try {
                                    noteItems = JSON.parse(groupRecord.Note || "[]");
                                } catch (err) {
                                    console.error("Invalid Note JSON", err);
                                    alert(`Warning Skip ${customerGroupName}: invalid Note JSON.`);
                                    return;
                                }
                                const bFCorpC = noteItems.some(item => item.PayBy === PayByList[0].PayType);
                                const bFCorpC2 = noteItems.some(item => item.PayBy === PayByList[1].PayType);
                                const bFPers = noteItems.some(item => item.PayBy === PayByList[2].PayType);
                                //alert("past noteItems")


                                // Group items by company inside Note
                                const byCompany = noteItems.reduce((acc, r) => {
                                    const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                                    const qty = Number(r.Quantity) || 0;
                                    const cost = Number(r.ProductCost) || 0;
                                    const price = qty ? cost / qty : 0;
                                    (acc[companyName] ||= []).push({
                                        ProductName: r.ProductName,
                                        Quantity: qty,
                                        Price: price,
                                        ProductCost: cost,
                                        DateText: r.PayBy || "Unknown"
                                    });
                                    return acc;
                                }, {});

                                // Clear previous content from row 18 down
                                const LIGHT_GREY = { argb: "FFEFEFEF" };
                                for (let r = 18; r <= (memoSheet.lastRow?.number || 0); r++) {
                                    const row = memoSheet.getRow(r);
                                    row.eachCell(c => { c.value = null; c.fill = null; c.font = null; c.border = null; });
                                    row.values = [];
                                }

                                let rowIndex = 18;
                                let grandQty = 0;
                                let grandCost = 0;
                                const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));

                                companies.forEach(companyName => {
                                    // spacer
                                    if (grandQty !== 0) memoSheet.getRow(rowIndex++).values = ["", "", "", "", "", "", ""];

                                    // header
                                    //alert("headerRow")
                                    const headerRow = memoSheet.getRow(rowIndex++);
                                    headerRow.values = aHeaders //["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];
                                    for (let c = 2; c <= 7; c++) {
                                        const cell = headerRow.getCell(c);
                                        cell.font = { bold: true };
                                        cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                                        if ([4, 5, 6].includes(c)) cell.alignment = { horizontal: "right" };
                                        if (c === 7) cell.alignment = { indent: 2 };
                                    }

                                    // data
                                    let subtotalQty = 0;
                                    let subtotalCost = 0;
                                    byCompany[companyName].forEach(item => {
                                        const row = memoSheet.getRow(rowIndex++);
                                        row.values = ["", item.ProductName, undefined, item.Quantity, item.Price, item.ProductCost, item.DateText];
                                        row.getCell(4).numFmt = "#,##0";
                                        row.getCell(5).numFmt = "#,##0.00";
                                        row.getCell(6).numFmt = "#,##0.00";
                                        row.getCell(7).alignment = { indent: 2 };
                                        subtotalQty += item.Quantity;
                                        subtotalCost += item.ProductCost;
                                        grandQty += item.Quantity;
                                        grandCost += item.ProductCost;
                                    });

                                    // subtotal
                                    //alert("subtotal")
                                    const subtotalRow = memoSheet.getRow(rowIndex++);
                                    subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
                                    for (let c = 2; c <= 7; c++) {
                                        subtotalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                                    }
                                    subtotalRow.getCell(2).font = { bold: true };
                                    subtotalRow.getCell(4).numFmt = "#,##0";
                                    subtotalRow.getCell(6).numFmt = "#,##0.00";
                                });

                                // grand total
                                //alert("grand total")
                                memoSheet.addRow([]);
                                const grandRow = memoSheet.addRow(["", "Grand Total", "", grandQty, "", grandCost, ""]);
                                for (let c = 2; c <= 7; c++) {
                                    const cell = grandRow.getCell(c);
                                    cell.font = { bold: true };
                                    cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                                }
                                grandRow.getCell(4).numFmt = "#,##0";
                                grandRow.getCell(6).numFmt = "#,##0.00";

                                let summaryStartRow = memoSheet.lastRow.number + 2;

                                // แถวแรกของสรุป (ใช้เป็นจุดเริ่มต้นช่วง SUM ของ Total)
                                const firstSummaryRow = summaryStartRow;

                                // นับจำนวน summary items ที่ถูกสร้าง (Corp/Corp2/Personal)
                                let summaryItemCount = 0;

                                // Corporate Card
                                //alert("Corporate Card")
                                if (bFCorpC) {
                                    const corpRow = memoSheet.getRow(summaryStartRow++);
                                    summaryItemCount++;

                                    corpRow.getCell(3).value = PayByList[0].PayType;
                                    corpRow.getCell(3).alignment = { indent: 15 };

                                    // SUMIF จากข้อมูลดิบ เพื่อได้ค่ายอดรวมตาม PayType
                                    corpRow.getCell(4).value = {
                                        formula: `SUMIF(G:G,"Corporate Card",D:D)`
                                    };
                                    corpRow.getCell(6).value = {
                                        formula: `SUMIF(G:G,"Corporate Card",F:F)`
                                    };

                                    corpRow.getCell(4).numFmt = "#,##0";
                                    corpRow.getCell(6).numFmt = "#,##0.00";

                                    if (!bFPers && !bFCorpC2) {
                                        [4, 6].forEach(col => { corpRow.getCell(col).border = { bottom: { style: "thin" } }; });
                                    }
                                }

                                // Corporate Card 2
                                if (bFCorpC2) {
                                    const corp2Row = memoSheet.getRow(summaryStartRow++);
                                    summaryItemCount++;

                                    corp2Row.getCell(3).value = PayByList[1].PayType;
                                    corp2Row.getCell(3).alignment = { indent: 15 };

                                    corp2Row.getCell(4).value = {
                                        formula: `SUMIF(G:G,"Corporate Card 2",D:D)`
                                    };
                                    corp2Row.getCell(6).value = {
                                        formula: `SUMIF(G:G,"Corporate Card 2",F:F)`
                                    };

                                    corp2Row.getCell(4).numFmt = "#,##0";
                                    corp2Row.getCell(6).numFmt = "#,##0.00";

                                    if (!bFPers && !bFCorpC) {
                                        [4, 6].forEach(col => { corp2Row.getCell(col).border = { bottom: { style: "thin" } }; });
                                    }
                                }

                                // Personal
                                if (bFPers) {
                                    const personalRow = memoSheet.getRow(summaryStartRow++);
                                    summaryItemCount++;

                                    personalRow.getCell(3).value = PayByList[2].PayType;
                                    personalRow.getCell(3).alignment = { indent: 15 };

                                    personalRow.getCell(4).value = {
                                        formula: `SUMIF(G:G,"Personal",D:D)`
                                    };
                                    personalRow.getCell(6).value = {
                                        formula: `SUMIF(G:G,"Personal",F:F)`
                                    };

                                    personalRow.getCell(4).numFmt = "#,##0";
                                    personalRow.getCell(6).numFmt = "#,##0.00";

                                    [4, 6].forEach(col => { personalRow.getCell(col).border = { bottom: { style: "thin" } }; });
                                }

                                // Total Row
                                //alert("total row")
                                const totalRow = memoSheet.getRow(summaryStartRow++);
                                totalRow.getCell(3).value = "Total";
                                totalRow.getCell(3).alignment = { indent: 15 };
                                totalRow.getCell(3).font = { bold: true };

                                // ถ้ามีอย่างน้อย 1 item → SUM ช่วงแถวสรุปที่สร้างขึ้น
                                if (summaryItemCount > 0) {
                                    totalRow.getCell(4).value = {
                                        formula: `SUM(D${firstSummaryRow}:D${totalRow.number - 1})`
                                    };
                                    totalRow.getCell(6).value = {
                                        formula: `SUM(F${firstSummaryRow}:F${totalRow.number - 1})`
                                    };
                                } else {
                                    // ไม่มี item ใดถูกสร้าง → ให้ Total เป็น 0 เพื่อกัน error/วงเล็บว่าง
                                    totalRow.getCell(4).value = 0;
                                    totalRow.getCell(6).value = 0;
                                }

                                totalRow.getCell(4).numFmt = "#,##0";
                                totalRow.getCell(6).numFmt = "#,##0.00";

                                // เส้น double border สำหรับ Total
                                [4, 6].forEach(col => {
                                    totalRow.getCell(col).border = { bottom: { style: "double" } };
                                });

                                // regards + prepared/approved + dates + verify rows

                                const regardsRow = memoSheet.getRow(summaryStartRow++);
                                regardsRow.getCell(2).value = "Regards,";

                                summaryStartRow += 2;

                                const preparedRow = memoSheet.getRow(summaryStartRow++);
                                preparedRow.getCell(2).value = "Prepared by";
                                preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" }; // Reuester Name
                                preparedRow.getCell(3).alignment = { horizontal: "center" };
                                preparedRow.getCell(3).font = { bold: true };
                                preparedRow.getCell(3).border = { bottom: { style: "thin" } };

                                preparedRow.getCell(5).value = "Approved by"; // first HOD
                                preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" };
                                preparedRow.getCell(6).font = { bold: true };
                                preparedRow.getCell(6).alignment = { horizontal: "center" };
                                preparedRow.getCell(6).border = { bottom: { style: "thin" } };

                                memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                                const dateRow = memoSheet.getRow(summaryStartRow++);
                                dateRow.getCell(3).value = { formula: "DATA!E18" }; // Requested Date
                                dateRow.getCell(3).numFmt = "dd/mm/yyyy";
                                dateRow.getCell(3).alignment = { horizontal: "center" };
                                dateRow.getCell(6).value = { formula: "DATA!E16" };  // Approved Date
                                dateRow.getCell(6).alignment = { horizontal: "center" };
                                memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);
                                //alert("OverLimit")
                                //alert(lOverLimit)
                                if (lOverLimit) { // second HOD
                                    summaryStartRow += 2;

                                    const verifyRow = memoSheet.getRow(summaryStartRow++);
                                    //verifyRow.getCell(5).value = { formula: "DATA!C13" };
                                    verifyRow.getCell(5).value = "Approved by";
                                    verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" }; // Second Approved Name
                                    verifyRow.getCell(6).font = { bold: true };
                                    verifyRow.getCell(6).alignment = { horizontal: "center" };
                                    verifyRow.getCell(6).border = { bottom: { style: "thin" } };

                                    memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                                    const xdateRow = memoSheet.getRow(summaryStartRow++);
                                    xdateRow.getCell(6).value = { formula: "DATA!C15" }; // Second Approved Date
                                    xdateRow.getCell(6).alignment = { horizontal: "center" };
                                    memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);
                                }
                                // Stamp MEMO Sheet for Memo TO:
                               //memoSheet.getCell("C11").value = ToNames; // Memo To:
                                // Stamp DATA sheet from njsonDataSum fields
                                dataSheet.getCell("C1").value = groupRecord.HeadRefNo;    // PRE REF#
                                dataSheet.getCell("C2").value = groupRecord.ERORefNo1;    // Company Group
                                dataSheet.getCell("C4").value = groupRecord.EROAmount2;   // Outstanding
                                dataSheet.getCell("C7").value = groupRecord.RefundedAmount; // Cash Advance
                                dataSheet.getCell("C12").value = ToNames.join(', '); // Memo To:
                                //dataSheet.getCell("E5").value = groupRecord.ERODate02;    // Period
                                // ใช้งาน Change date to UTC
                                const aPeriodD = toUTCDateOnly(groupRecord.ERODate02);
                                const cell = dataSheet.getCell("E5");
                                cell.value = aPeriodD;           // ✅ เป็น Date object จริง
                                cell.numFmt = "dd/mm/yyyy";      // ✅ Excel จะแสดงเฉพาะวันที่

                                dataSheet.getCell("E6").value = groupRecord.ERODesc05;    // LOT
                                dataSheet.getCell("C7").value = groupRecord.EROAmount1;   // Limit C8
                                //alert("empty Requester")
                                //if (ljsHOD) { //empty jsHOD means for Requester process
                                if (groupRecord.Confirmed === true) {
                                    dataSheet.getCell("C18").value = groupRecord.PayToName;   // Requester
                                    const aConfirmDate = toUTCDateOnly(groupRecord.ReqDate);
                                    dataSheet.getCell("C19").value = aConfirmDate;   // Requester Date
                                    dataSheet.getCell("D18").value = aConfirmDate;   // Requester Date
                                    // // ✅ เขียนลง C19
                                    // const cellC19 = dataSheet.getCell("C19");
                                    // cellC19.value = aConfirmDate;
                                    // cellC19.numFmt = "dd/mm/yyyy";

                                    // // ✅ เขียนลง D18
                                    // const cellD18 = dataSheet.getCell("D18");
                                    // cellD18.value = aConfirmDate;
                                    // cellD18.numFmt = "dd/mm/yyyy";
                                    // //dataSheet.getCell("C19").value = formattedDateTime;   // Requester Date
                                    // //dataSheet.getCell("D18").value = formattedDateTime;   // Requester Date
                                }
                                //}
                                if (!ljsHOD) { // not empty jsHOD for HOD Approval process
                                    if (nofjsHOD >= 1 && jsHOD[0].appd.includes("/")) {
                                        dataSheet.getCell("C16").value = jsHOD[0].name;   // Approve 1 "name"//
                                        dataSheet.getCell("D16").value = jsHOD[0].appd;   // Approve Date 1 "10/12/2025"//                                        
                                    }
                                    if (nofjsHOD >= 2 && jsHOD[1].appd.includes("/")) {
                                        dataSheet.getCell("C17").value = jsHOD[1].name;   // Approve 2
                                        dataSheet.getCell("D17").value = jsHOD[1].appd;   // Approve Date 2
                                    }
                                }
                                // Column widths
                                [5, 12, 35, 8, 12, 13, 22].forEach((w, i) => memoSheet.getColumn(i + 1).width = w);

                                // Keep only MEMO & DATA sheets
                                templateWb.worksheets.slice().forEach(ws => {
                                    if (!["MEMO", "DATA"].includes(ws.name)) templateWb.removeWorksheet(ws.id);
                                });
                                //alert("before save")
                                // Save for selected group using HeadRefNo
                                //const safeName = groupRecord.HeadRefNo || "Unknown";
                                const safeName = groupRecord.HeadRefNo || "Unknown";
                                const fileName = safeName + ".xlsx"
                                //const safeName = iData.HeadRefNo
                                if (safeName !== "Unknown") {
                                    const outBuffer = await templateWb.xlsx.writeBuffer();
                                    const outFile = new File(
                                        [outBuffer],
                                        `${safeName}.xlsx`,
                                        { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                                    );
                                    const uploadedName = await u2pload2File(outFile);
                                    //if (uploadedName && typeof viewUploadedFile === "function") {
                                    //viewUploadedFile(uploadedName);
                                    //}
                                    //saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), fileName);
                                }

                                //notify("success", `DL Customer Group completed for ${customerGroupName}.`, 2500);

                            } catch (err) {
                                console.error(err);
                                //notify("error", `Failed group export for ${customerGroupName}.`, 3000);
                            }


                            // 3) Load buffer into ExcelJS
                            // const workbook = new ExcelJS.Workbook();
                            // await workbook.xlsx.load(buffer);
                            // const safeName = "TEMPLATE"
                            // const outBuffer = await workbook.xlsx.writeBuffer();
                            //saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), `${safeName}.xlsx`);
                            // const outFile = new File(
                            //     [outBuffer],
                            //     `${safeName}.xlsx`,
                            //     { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                            // );
                            //const uploadedName = await u2pload2File(outFile);

                        } catch (err) {
                            console.error("Error transforming JSON to Excel:", err);
                            alert("Failed to transform JSON to Excel.");
                        }
                    }

                    async function u2pload2File(file, prefix) { //= "RPT"
                        try {
                            if (!file) {
                                console.log("No file provided.");
                                return false;
                            }

                            const originalFileName = file.name;
                            const fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                            const baseName = originalFileName.substring(0, originalFileName.lastIndexOf("."));
                            const prefixUnderscore = prefix ? `_${prefix}` : "";

                            // Always append "_RPT"
                            const newFileName = `${baseName}${prefixUnderscore}${fileExtension}`;

                            const simulatedFile = new File([file], newFileName, { type: file.type });

                            const formData = new FormData();
                            formData.append("file", simulatedFile);

                            const myHeaders = new Headers();
                            myHeaders.append("ref", "44095B6C-CC17-47FD-895B-649E0EAA2BAE");

                            const requestOptions = {
                                method: "POST",
                                headers: myHeaders,
                                body: formData,
                            };

                            //const response = await fetch("https://cbsdev2.locktonwattana.com/temp/uploads/",requestOptions);
                            const response = await fetch(
                                //"https://cbsdev2.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                                isLocalHost() + "/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                                requestOptions
                            );

                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }

                            const result = await response.text();
                            console.log(result);
                            //aMessageAlert(`Upload file ${newFileName} successful!`, "blue");
                            return newFileName;
                        } catch (error) {
                            console.error("Error:", error);
                            return null;
                        }
                    }
                    // ฟังก์ชัน AddTitle
                    const AddTitle = (noteText, title) => {
                        const match = noteText.match(/NAME:\[(.*?)\]/);
                        if (!match) return [];

                        return match[1]
                            .split('|')
                            .filter(name => name.trim() !== "")
                            .map(name => `${title}${name.trim()}`);
                    };

                    //var currentHoveredColumn = null; // Variable to track the currently hovered column
                    var nTime = 0; // Counter to track how many times we've hovered over the current column
                    var aaERTYPE = "900"
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

                            var aaHODAppName = asFullName
                            var aaHODAppEmail = asStaffEmail // send by login email
                            var aHODDivGrp = "(select ApproveToDivision from Approver Where ApproverCode = 'HOD' and ApproverEmpID = '" + asStaffID + "')"
                            //var aHODEORRefNo6 = " ERORefNo6 = '" + $.trim(asStaffEmail) +"'"
                            let aHODApproveSS_Running = false; // Declare globally
                            var asERStatus = 'Confirmed wait for HOD'
                            //var aqrFull = "ERStatus = '" + asERStatus + "' and Division IN " + aHODDivGrp  // scopes based permission (View Only Login Name)  ExpensesCode LIKE aaOnInitAccCode Division "ExpGroupCode LIKE '%" + aaERTYPE + "%' and " +
                            //var aqrFull = "ERStatus = '" + asERStatus + "' and ERORefNo6 = '" +  $.trim(asStaffEmail) + "'"
                            let HeadCheck = "HeadRefNo LIKE '%" + aaRunPre + "%' and "
                            var aqrFull = HeadCheck + "ERStatus = '" + asERStatus + "' and rtrim(Vendor02Note) LIKE '%" + $.trim(asFullName) + "%'"
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
                                                visible: false,
                                                // visible: function (e) {
                                                //     return (e.row.data.ID === 1) //return !e.row.isEditing; && e.row.data.Confirmed === false
                                                // },
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
                                                    if (e.row.data.ExpGroupCode === "900") {
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
                                                    if (CHK_PRE_V) {
                                                        aPopUpAddFormPRE(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate, false, true);
                                                    } else {
                                                        aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate);
                                                    }
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
                                        visible: false,
                                        width: 150,
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
                                        dataField: "ERODate02", //1
                                        caption: "Period",
                                        dataType: "date",
                                        format: "dd/MM/yyyy",
                                        width: 100,
                                        editorOptions: { readOnly: true },
                                        visible: CHK_PRE_V,
                                    },
                                    {
                                        dataField: "ERORefNo1", //1
                                        caption: "Company Group",
                                        width: 220,
                                        editorOptions: { readOnly: true },
                                        visible: CHK_PRE_V,
                                    },
                                    {
                                        dataField: "Department",
                                        caption: "Dept",
                                        dataType: "string",
                                        editorType: "dxTextBox",
                                        width: 70,
                                        visible: CHK_TRF_V,
                                    },
                                    {
                                        dataField: "PBatchNo",
                                        caption: CHK_TRF_V ? "Corp Card" : "Corporate Card",//"Corp Card",
                                        width: CHK_TRF_V ? 120 : 150,
                                        visible: false, //HAVECORPCARD,
                                        calculateCellValue: (rowData) => {
                                            return rowData.PBatchNo === "" ? "Not Use" : "Use";
                                        }
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
                                        visible: false,
                                    },
                                    // {
                                    //     dataField: "ERORefNo1", //ERODesc03
                                    //     caption: "Purpose Of Trip",
                                    //     dataType: "string",
                                    //     width: 100,
                                    //     visible: false,
                                    // },
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
                                        visible: false,
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
                                        visible: false,
                                    },
                                    {
                                        dataField: "ERODesc02",
                                        caption: "Destination",
                                        dataType: "string",
                                        width: 120,
                                        visible: false,
                                    },
                                    // {
                                    //     dataField: "ERODate02",
                                    //     caption: "Travel Start Date",
                                    //     dataType: "date",
                                    //     format: "dd/MM/yyyy",
                                    //     width: 110,
                                    //     visible: false,
                                    // // },
                                    // {
                                    //     dataField: "ERODate03",
                                    //     caption: "Travel End Date",
                                    //     dataType: "date",
                                    //     format: "dd/MM/yyyy",
                                    //     width: 110,
                                    //     visible: false,
                                    // },
                                    {
                                        dataField: "RefundedAmount",
                                        caption: "Advance Amt", //visible: CHK_TRF_V, CHK_TRF_V ? "Estimated Cost" : 
                                        dataType: "number",
                                        format: { type: "fixedPoint", precision: 2 },
                                        width: 140, //CHK_TRF_V ? 120 :
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
                                            // const names = options.value.match(/NAME:\[(.*?)\]/)[1]
                                            //     .split('|')
                                            //     .filter(name => name.trim() !== "");
                                            // // Join the names with a comma and display them
                                            // container.text(names.join(' '));
                                            const titledNames = AddTitle(options.value, aVARs.THTITLE);
                                            // ใช้ comma คั่นชื่อ
                                            container.text(titledNames.join(', '));
                                        },
                                        width: 200,
                                        visible: true,
                                    },
                                    // {
                                    //     dataField: "Vendor01Note",
                                    //     caption: "Approvers",
                                    //     // cellTemplate: function (container, options) {
                                    //     //     // Extract the names from the Vendor01Note field
                                    //     //     const names = options.value.match(/NAME:\[(.*?)\]/)[1]
                                    //     //         .split('|')
                                    //     //         .filter(name => name.trim() !== "");
                                    //     //     // Join the names with a comma and display them
                                    //     //     container.text(names.join(' '));
                                    //     // },
                                    //     width: 200,
                                    //     visible: true,
                                    // },

                                ],

                                // onCellHoverChanged: function (e) {
                                //     //console.log(aObjects.aGHeaderHelp)
                                //     // const columnHelp = {
                                //     //     "ERODesc03": "From/With Whom<br>E.g.. Names of client, Insurers,<br> Prospects and their family members<br> (please explain)",
                                //     //     "EROCode01": "Type of Gift/Entertain"
                                //     // };
                                //     const columnHelp = aObjects.aGHeaderHelp;
                                //     if (e.rowType === "header") {
                                //         const columnDataField = e.column.dataField;

                                //         if (e.eventType === "mouseover") {
                                //             if (currentHoveredColumn !== columnDataField) {
                                //                 // New column hover, reset nTime and update currentHoveredColumn
                                //                 currentHoveredColumn = columnDataField;
                                //                 nTime = 1; // First time for this column
                                //             } else {
                                //                 nTime += 1; // Increment nTime if we're still in the same column
                                //             }

                                //             // Show the popup only when nTime === 1
                                //             if (nTime === 1) {
                                //                 const columnCaption = e.column.caption; // For popup title
                                //                 const helpText = columnHelp[columnDataField]; // Match dataField with help text

                                //                 if (helpText) {
                                //                     $("#popup").dxPopup({
                                //                         title: `Help: ${columnCaption}`, // Use caption for the popup title
                                //                         contentTemplate: function () {
                                //                             return $("<div>").html(helpText); // Use html to render line breaks
                                //                         },
                                //                         width: 400,
                                //                         height: 200,
                                //                         visible: true,
                                //                         dragEnabled: true,
                                //                         closeOnOutsideClick: true,
                                //                         wrapperAttr: { class: "rounded-popup" }, // Add a custom class
                                //                         position: {
                                //                             my: "center top",
                                //                             at: "center top",
                                //                             of: window,
                                //                             offset: "0 120" // Move it up by 200px
                                //                         }
                                //                     }).dxPopup("show"); // Show the popup
                                //                 }
                                //             }
                                //         }

                                //         if (e.eventType === "mouseout") {
                                //             // Hide the popup and reset the hover counter
                                //             if (nTime === 1) {
                                //                 //alert("ntime ", nTime)
                                //                 nTime = 0
                                //                 //$("#popup").dxPopup("hide");
                                //                 //console.log(nTime, currentHoveredColumn) 
                                //             } else {
                                //                 // alert(`help ${nTime}`)
                                //                 // aPopupHelp(`Help: ${columnCaption}`, helpText);   
                                //                 // $("#popup").dxPopup("hide");
                                //                 // currentHoveredColumn = null; // Reset to indicate no column is currently hovered
                                //                 nTime = 0; // Reset the hover counter
                                //                 //$("#popup").dxPopup("hide");
                                //                 //console.log(nTime, currentHoveredColumn)  
                                //             }

                                //         }
                                //     }
                                // },

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
                                            visible: false,
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
                                            locateInMenu: 'always',
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
                                            locateInMenu: 'always',
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
                                            locateInMenu: 'always',
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
                                            locateInMenu: 'always',
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
                                    asPBatchNo = iData.PBatchNo;
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
                                                        itemType: "simple",
                                                        visible: function () {
                                                            return asPBatchNo !== undefined && asPBatchNo !== null && asPBatchNo !== "";
                                                        },
                                                        //visible: false,
                                                        template: function () {
                                                            if (asPBatchNo === "") {
                                                                return $("<div>"); // ไม่แสดงอะไรเลยถ้าไม่มีข้อมูล
                                                            }

                                                            return $("<div>")
                                                                .append($("<div>")
                                                                    .text("Corporate Card") // ✅ label
                                                                    .css({
                                                                        "color": "black",              // ✅ สีของ label
                                                                        "font-weight": "bold",
                                                                        "text-align": "left",
                                                                        "font-size": "12px",
                                                                        "margin-top": "6px",
                                                                        "margin-bottom": "6px"
                                                                    }))
                                                                .append($("<div>")
                                                                    .text(asPBatchNo)              // ✅ value
                                                                    .css({
                                                                        "color": asEROCheck03 ? "purple" : "darkgreen",
                                                                        "background": "linear-gradient(to bottom, #fcfcfc, #d6dff7)",
                                                                        "font-size": "13px",
                                                                        //"font-weight": "bold",
                                                                        "text-align": "left",
                                                                        "width": "160px",
                                                                        //"padding": "5px"
                                                                    }));
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

                            // PRE popup
                            // popup Add New and Edit  
                            const aPopUpAddFormPRE = (aRecNo, iData, idDate, iView, aSelfBooking) => {
                                var aaPFDMI = isLocalHost();
                                var astr = localStorage["aDXTheme"]
                                let aaCARDIDaa = "";
                                var aViewF = (iView === undefined) ? false : iView;
                                var aViewG = (iView === undefined) ? true : !iView;
                                var axSelfBooking = (aSelfBooking === undefined) ? false : aSelfBooking;
                                console.log("aSelfBooking ", aSelfBooking)
                                console.log("axSelfBooking ", axSelfBooking)
                                console.log("iView - ", iView)
                                //alert(`aSelfBooking , ${aSelfBooking}`)
                                //let currentHoveredColumn = null; // Variable to track the currently hovered column
                                //let nTime = 0; // Counter to track how many times we've hovered over the current column
                                //console.log("aRecNo = ", aRecNo)
                                //console.log("iData = ", iData)
                                if (aRecNo === 1) {
                                    var aaaTitle = " [ADD]"
                                    let aaID = 1
                                    let axRunRun = aGetDateRef(aaRunPre); // aaOnInitExpGroupDesc.substring(0, 1)
                                    let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                    var aaiHeadRef = axRunRun;
                                    var asERStatus = "Register";
                                    var asERODesc02 = ""; //Destination	ERODesc02
                                    var asERODesc03 = ""; //Purpose of Trip
                                    var asERORefNo1 = ""; // Purpose of Trip List
                                    var asEROCheck01 = false; //Overseas
                                    var asEROCheck02 = false; //Need Roaming   
                                    var asEROCheck03 = axSelfBooking; //Self-Booking                                     
                                    var asERODate02 = new Date() //Travel Start Date	
                                    var asERODate03 = new Date() //Travel End Date	
                                    var asRefundedAmount = 0; //Estimated Cost	
                                    var asVendor01 = ""; //Departure Flight	
                                    var asERODesc04 = ""; //Arrival Flight	
                                    var asEROAmount1 = 0; //Ticket Price	EROAmount1
                                    var asERODesc05 = ""; //Hotel	ERODesc05
                                    var asNote = ""; //Remark	Note
                                    var asPBatchNo = aaCARDIDaa; //aaRESULaa.CardID;
                                    /*
                                        ,ERODesc02: asERODesc02, ERODesc03: asERODesc03, ERODesc04: asERODesc04, ERODesc05: asERODesc05, ERODate02: asERODate02, ERODate03: asERODate03,  Vendor01: asVendor01, Note: asNote, EROAmount1: asEROAmount1
                                    */

                                    var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), ERODate01: idDate, ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment, Division: asDivision, ERODesc06: asStaffEmail, ReqDate: aNowDte, ExpensesCode: "", ExpensesDescription: aaOnInitAccDesc, Currency: "THB", Xrate: 1, ExpGroupCode: aaOnInitExpGroupCode, ExpGroupDescEng: aaOnInitExpGroupDesc, ERStatus: asERStatus, ERORefNo1: asERORefNo1, ERORefNo2: "", ERORefNo3: "", EROCheck01: 0, EROCheck02: 0, EROCheck03: axSelfBooking, NeedPayment: 0, RefundedAmount: asRefundedAmount, LimitedAmount: 0, ERODesc02: asERODesc02, ERODesc03: asERODesc03, ERODesc04: asERODesc04, ERODesc05: asERODesc05, ERODate02: new Date(), ERODate03: new Date(), ERODate05: new Date(), ERODate06: new Date(), Vendor01: asVendor01, Note: asNote, EROAmount1: asEROAmount1, PBatchNo: asPBatchNo }
                                    var ObjRowData = JSON.stringify(ObjKeyData);
                                    //console.log("ObjRowData = ", ObjRowData)
                                    sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                    iData = ObjKeyData;
                                    insideAddNew = true;
                                } else {
                                    var aaiHeadRef = aRecNo;
                                    var aaaTitle = (iView === undefined || iView === false) ? " [EDIT]" : " {VIEW}";

                                    insideAddNew = false;
                                    asERStatus = iData.ERStatus;
                                    asERODesc02 = iData.ERODesc02; //Destination	ERODesc02
                                    asERODesc03 = iData.ERDesc03; //Purpose of Trip
                                    asERORefNo1 = iData.ERORefNo1; //Purpose of Trip List
                                    asEROCheck01 = iData.EROCheck01; //Overseas
                                    asEROCheck02 = iData.EROCheck02; //Need Roaming     
                                    asEROCheck03 = iData.EROCheck03; //Self-Booking                                   
                                    asERODate02 = iData.ERODate02 //Travel Start Date	
                                    asERODate03 = iData.ERODate03 //Travel End Date	
                                    asRefundedAmount = iData.RefundedAmount; //Estimated Cost	
                                    asVendor01 = iData.Vendor01; //Departure Flight	
                                    asERODesc04 = iData.ERODesc04; //Arrival Flight	
                                    asEROAmount1 = iData.EROAmount1; //Ticket Price	EROAmount1
                                    asERODesc05 = iData.ERODesc05; //Hotel	ERODesc05
                                    asNote = iData.Note; //Remark	Note 
                                    asPBatchNo = iData.PBatchNo; //aaRESULaa.CardID; 
                                    aaCARDIDaa = iData.PBatchNo;
                                    //console.log("asERODesc02 = ", asERODesc02)
                                }
                                var aaSchRefx = "HeadRefNo LIKE '%" + aaiHeadRef + "%'" // (DataGrid View Only This New Item)
                                aqrFull = aaSchRefx;
                                var aaxurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                var aaxSettings = { "url": aaxurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };

                                $(() => {
                                    var aaLastLineNo = 1;
                                    //var gbxRateV = 1;
                                    let aForm2Add = "Add-form";
                                    let aFormConfirm = "aConfirm";// + (CHK_PRE_V ? "PRE" : "");
                                    if (CHK_PRE_V) {
                                        aForm2Add = "Add-formPRE" //+ (CHK_PRE_V ? "PRE" : "")
                                        aFormConfirm = "aConfirm"//+ (CHK_PRE_V ? "PRE" : "");
                                    } else {
                                        //1 Add-form (No Card), Add-form01 (use corp card)
                                        aForm2Add = "Add-form" + (aaCARDIDaa === "" ? "" : "01")
                                        aFormConfirm = "aConfirm" + (aaCARDIDaa === "" ? "" : "01");
                                    }
                                    let aFormExit = "Add-popupexit" + (CHK_PRE_V ? "PRE" : "");
                                    let aDataGridForm = CHK_PRE_V ? "noform" : "Add-dxDataGrid"

                                    //alert(`${aForm2Add}, ${aFormExit}, ${aDataGridForm}, ${aFormConfirm}`)
                                    const popup = $("#popupContainerAdd").dxPopup({
                                        title: `${CHK_LABEL} Form ${aaaTitle}`,
                                        width: '1300px',
                                        position: { offset: "0 -140" }, //{offset: "0 -180"},
                                        //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                        //contentTemplate: function(contentElement) {
                                        //    contentElement.css("background-color", "#f5f5f5");
                                        //},
                                        visible: true,
                                        fullScreen: true,
                                        showCloseButton: false,
                                        showTitle: true,
                                        dragEnabled: true,
                                        closeOnOutsideClick: false,
                                        resizeEnabled: true,
                                        onInitialized: function (e) { e.component.registerKeyHandler("escape", function (arg) { }) }, // ignore when press 'ESC'  

                                        // contentTemplate: function () {
                                        //     return $("<div />").append(
                                        //         //$("<p><div id='Add-form'></div></p>"),
                                        //         $("<p><div id='" + aForm2Add + "'></div></p>"),   //check corporate card
                                        //         $("<span style='padding: 0px 8px;'></span>").text(" "),
                                        //         $("<span id='Add-Upload'></span>"),
                                        //         // $("<span style='padding: 0px 5px;'></span>").text(" "),
                                        //         // $("<span id='Add-ViewFile'></span>"),
                                        //         $("<span style='padding: 0px 5px;'></span>").text(" "),
                                        //         $("<span id='Add-ViewFile_OO'></span>"),
                                        //         $("<p><div id='" + aDataGridForm + "'></div></p>"),
                                        //         $("<div style='display:flex; justify-content:flex-end; gap:15px; padding:5px;'>")
                                        //         .append($("<span id='" + aFormExit + "'></span>"))
                                        //         .append($("<span id='" + aFormConfirm + "'></span>")),

                                        //         $("<p><div id='customViewerArea'></span>"),
                                        //         // $("<span id='" + aFormExit + "'></span>"),
                                        //         // $("<span style='padding: 5px 15px;'></span>").text(" "),
                                        //         // $("<span id='" + aFormConfirm + "'></span>"),
                                        //     );
                                        // },
                                        contentTemplate: function () {
                                            // Create the root container
                                            const $container = $("<div />");

                                            // Always add these
                                            $container.append(
                                                //$("<p><div id='" + aForm2Add + "'></div></p>"),   // check corporate card
                                                $("<p><div id='Add-formPRE'></div></p>"),   // check corporate card
                                                $("<span style='padding: 0px 8px;'></span>").text(" "),
                                                //$("<span id='Add-Upload'></span>"),
                                                //$("<span style='padding: 0px 5px;'></span>").text(" "),
                                                //$("<span id='Add-ViewFile_OO'></span>")
                                            );

                                            // Conditional part
                                            if (CHK_TRF_V) {
                                                $container.append(
                                                    $("<p><div id='" + aDataGridForm + "'></div></p>"),
                                                    $("<span id='" + aFormExit + "'></span>"),
                                                    $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                    $("<span id='" + aFormConfirm + "'></span>")
                                                );
                                            } else {
                                                $container.append(
                                                    // $("<div style='display:flex; justify-content:flex-end; gap:15px; padding:5px;'>")
                                                    //     .append($("<span id='" + aFormExit + "'></span>"))
                                                    //     .append($("<span id='" + aFormConfirm + "'></span>")),
                                                    $("<span id='Add-ViewFile_OO'></span>"),
                                                    $("<span style='padding: 0px 20px;'></span>").text(" "),
                                                    $("<span id='" + aFormExit + "'></span>"),
                                                    $("<span style='padding: 5px 5px;'></span>").text(" "),
                                                    $("<span id='" + aFormConfirm + "'></span>"),
                                                    $("<span style='padding: 5px 5px;'></span>").text(" "),
                                                    //$("<p><div id='customViewerArea'></div></p>")
                                                    $("<p><div id='customViewerArea' style='width:80%; text-align:left;'></div></p>")
                                                );
                                            }

                                            return $container;
                                        },

                                        //onContentReady: function () {
                                        // $("#Add-dxDataGrid").hide(); // hide dataGrid
                                        //aform.validate();
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
                                                            //let result = DevExpress.ui.dialog.confirm("<i>" + "Press 'YES' To SAVE " + "</i>", "SAVE BEFORE EXIT ?");
                                                            let result = DevExpress.ui.dialog.confirm("<center><i class='fas fa-save custom-icon-size'></i>" + " Press 'YES' To SAVE </center>", "SAVE BEFORE EXIT ?");
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

                                    }).dxPopup("instance"); // popupContainerAdd
                                    /* 
                                    $("#Self-Booking").dxButton({
                                        icon: "fas fa-check-square", //(iData.EROCheck03 ? "fas fa-toggle-off" : "fas fa-toggle-on"),
                                        type: "success",
                                        text: asEROCheck03 ? "Self Booking" : "Admin Booking",
                                        hint: "Self Booking/Admin Booking",
                                        visible: aViewG,
                                        onClick: function (e) {
                                            iData.EROCheck03 = !asEROCheck03; // Toggle the value
                                            asEROCheck03 = iData.EROCheck03
                                            var formInstance = $(`#${aForm2Add}`).dxForm("instance");
                                            formInstance.updateData("EROCheck03", iData.EROCheck03);
                            
                                            $(`#${aForm2Add}`).dxForm("instance").refresh(); // Refresh the form
                                            $(`#${aForm2Add}`).dxForm("instance").refresh();
                                            $(`#${aForm2Add}`).dxForm("instance").refresh();
                                        }
                                    }); */

                                    $("#Add-Upload").dxButton({
                                        icon: "fas fa-upload",
                                        type: "success",
                                        hint: "Add Attach File",
                                        //visible: true,
                                        visible: true,//aViewG,
                                        onClick: function (e) {
                                            aPopUpUpLoad(iData.HeadRefNo)
                                            //popup.hide()
                                        }
                                    });

                                    // === View Button ===
                                    $("#view-button").dxButton({ //view-button
                                        //text: "View File",
                                        type: "default",
                                        icon: "fas fa-eye",
                                        onClick: function () {

                                            const filename = filenameInput.option("value").trim();
                                            if (!filename) {
                                                DevExpress.ui.notify("Please enter a filename.", "error", 2000);
                                                return;
                                            }

                                            const ext = filename.split('.').pop().toLowerCase();
                                            const fileUrl = baseUrl + encodeURIComponent(filename);
                                            let viewerUrl = "";

                                            // Decide viewer based on extension
                                            if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
                                                // Office Online Viewer
                                                viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(fileUrl);
                                            } else if (ext === "pdf") {
                                                // Google Docs Viewer for PDF
                                                viewerUrl = "https://docs.google.com/gview?embedded=true&url=" + encodeURIComponent(fileUrl);
                                            } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
                                                // Direct image
                                                viewerUrl = fileUrl;
                                            } else {
                                                // Fallback: direct link
                                                viewerUrl = fileUrl;
                                            }

                                            // Call popup renderer
                                            showFilePopup(viewerUrl, filename);
                                        }
                                    });

                                    // === Popup Viewer ===
                                    function showFilePopup(viewerUrl, filename) {
                                        $("#popupHelp").dxPopup({
                                            title: "File Viewer - " + filename,
                                            width: "80%",
                                            height: "90%",
                                            fullScreen: true,
                                            visible: true,
                                            closeOnOutsideClick: true,
                                            resizeEnabled: true,
                                            showCloseButton: true,
                                            contentTemplate: function () {
                                                return $("<iframe>")
                                                    .attr("src", viewerUrl)
                                                    .css("width", "100%")
                                                    .css("height", "100%");
                                            }
                                        }).dxPopup("instance");
                                    }

                                    // Your existing function (slightly shortened here)
                                    async function findAvailableFiles(baseUrl, baseName) {
                                        //const EXTENSIONS = ["xlsx", "xls", "pptx", "ppt", "doc", "docx", "pdf", "jpg", "png", "txt", "csv"];
                                        const EXTENSIONS = ["xlsx", "pptx", "docx", "jpg", "png", "txt", "pdf"];
                                        const foundFiles = [];

                                        for (const ext of EXTENSIONS) {
                                            const fileUrl = `${baseUrl}${baseName}.${ext}`;
                                            try {
                                                const response = await fetch(fileUrl, { method: "HEAD" });
                                                if (response.status === 200) {
                                                    foundFiles.push({ name: `${baseName}.${ext}`, url: fileUrl });
                                                }
                                            } catch (error) {
                                                console.warn(`Error checking ${fileUrl}:`, error);
                                            }
                                        }
                                        // alert(foundFiles.length)
                                        // alert(JSON.stringify(foundFiles, null, 2));

                                        return foundFiles;
                                    }

                                    // function showFileSelectionPopup(files) {
                                    //     if (!files || !files.length) {
                                    //         DevExpress.ui.dialog.alert("No files available.", "Info");
                                    //         return;
                                    //     }

                                    //     $("#popupFileList").remove();
                                    //     $("body").append('<div id="popupFileList"></div>');

                                    //     $("#popupFileList").dxPopup({
                                    //         title: "Select a file to view",
                                    //         visible: true,
                                    //         width: 500,
                                    //         height: 300,
                                    //         showCloseButton: true,
                                    //         closeOnOutsideClick: true,
                                    //         contentTemplate: function (contentElement) {
                                    //             $("<div>")
                                    //                 .appendTo(contentElement)
                                    //                 .dxDataGrid({
                                    //                     dataSource: files,
                                    //                     columns: ["name"],
                                    //                     showBorders: true,
                                    //                     selection: { mode: "single" },
                                    //                     hoverStateEnabled: true,
                                    //                     onSelectionChanged: function (e) {
                                    //                         if (e.selectedRowsData.length > 0) {
                                    //                             const file = e.selectedRowsData[0];
                                    //                             $("#popupFileList").dxPopup("instance").hide();
                                    //                             //showViewerUrl(file.url); // pass filename to viewer
                                    //                             formViewerUrl(file.url); // pass filename to viewer
                                    //                         }
                                    //                     }
                                    //                 });
                                    //         }
                                    //     });
                                    // }
                                    function showFileSelectionPopup(files) {
                                        if (!files || !files.length) {
                                            DevExpress.ui.dialog.alert("No files available.", "Info");
                                            return;
                                        }

                                        $("#popupFileList").remove();
                                        $("body").append('<div id="popupFileList"></div>');

                                        $("#popupFileList").dxPopup({
                                            title: "Select a file to view",
                                            visible: true,
                                            width: 500,
                                            height: 300,
                                            showCloseButton: true,
                                            closeOnOutsideClick: true,
                                            contentTemplate: function (contentElement) {
                                                $("<div>")
                                                    .appendTo(contentElement)
                                                    .dxDataGrid({
                                                        dataSource: files,
                                                        columns: ["name"],
                                                        showBorders: true,
                                                        selection: { mode: "single" },
                                                        hoverStateEnabled: true,
                                                        onSelectionChanged: function (e) {
                                                            if (e.selectedRowsData.length > 0) {
                                                                const file = e.selectedRowsData[0];
                                                                $("#popupFileList").dxPopup("instance").hide();

                                                                // Call the unified handler
                                                                onFileSelected(file.url);
                                                            }
                                                        }
                                                    });
                                            }
                                        });
                                    }

                                    function onFileSelected(filename) {
                                        // Get dxForm instance
                                        const form = $("#Add-formPRE").dxForm("instance");

                                        if (form) {
                                            // Update the formData field directly
                                            form.updateData("ERODesc01", filename);
                                        }

                                        // Show the preview
                                        if (CHK_TRF_V) {
                                            showViewerUrl(filename);
                                        } else {
                                            formViewerUrl(filename);
                                        }
                                    }



                                    async function viewaFile(filename) {
                                        try {
                                            if (!filename) {
                                                throw new Error("Filename is required");
                                            }
                                            //alert(filename)
                                            const ext = filename.split('.').pop().toLowerCase();
                                            const fileUrl = encodeURIComponent(filename); //baseUrl + encodeURIComponent(filename);
                                            //alert(fileUrl)
                                            let viewerUrl = "";

                                            // Decide viewer based on extension
                                            if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
                                                // Office Online Viewer
                                                viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(fileUrl);
                                            } else if (ext === "pdf") {
                                                // Direct PDF with cache-busting
                                                viewerUrl = fileUrl + "?t=" + Date.now();
                                            } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
                                                // Direct image
                                                viewerUrl = encodeURIComponent("https://cbsdev2.locktonwattana.com/temp/uploads/P2510177390.pdf") + "?t=" + Date.now();
                                            } else {
                                                // Fallback: direct link
                                                viewerUrl = fileUrl + "?t=" + Date.now();
                                            }
                                            // DevExtreme alert dialog
                                            DevExpress.ui.dialog.alert(
                                                `Viewer URL:\n${filename}`, //viewerUrl
                                                "File Viewer"
                                            );
                                            //aPopupPDF(viewerUrl);
                                            showViewerUrl(filename) //viewerUrl
                                        } catch (error) {
                                            console.error("Error in viewaFile:", error);
                                            aMessageAlert("<b>Unable to open the file. Please try again.</b>", "red");
                                        }
                                    }

                                    $("#Add-ViewFileDD").dxButton({
                                        icon: "fas fa-file",
                                        type: "default",
                                        hint: "View Attach File",
                                        visible: true,
                                        onClick: async function (e) {
                                            var aUriV = `${aaPFDMI}/temp/uploads/${iData.HeadRefNo}.pdf`
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

                                    //Add-viewfile error
                                    $("#Add-ViewFile_OO").dxButton({
                                        icon: "fas fa-file",
                                        type: "default",
                                        hint: "View Attach File",
                                        visible: true,
                                        onClick: async function (e) {
                                            const baseUrl = `${aaPFDMI}/temp/uploads/`; // initialize ${aaPFDMI} ${aserverName}
                                            (async () => {
                                                const result = await findAvailableFiles(
                                                    baseUrl, // folder path
                                                    iData.HeadRefNo // base filename without extension
                                                );

                                                if (!result || result.length === 0) {
                                                    DevExpress.ui.notify("No files found", "warning", 2000);
                                                } else if (result.length === 1) {
                                                    // Only one file → skip popup, open directly
                                                    showViewerUrl(result[0].url);
                                                } else {
                                                    // Multiple files → show popup with dxDataGrid
                                                    showFileSelectionPopup(result);
                                                    //showViewerUrl(result[0].url);
                                                }
                                            })();
                                        }
                                    });

                                    function showViewerUrl(filename) {
                                        try {
                                            if (!filename) throw new Error("Filename is required");

                                            const baseUrl = `${aaPFDMI}/temp/uploads/`;
                                            const ext = filename.split('.').pop().toLowerCase();
                                            const fileUrl = filename; // no encodeURIComponent baseUrl + 

                                            let viewerUrl = "";
                                            let contentHtml = "";

                                            if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
                                                // Office Online Viewer still needs the full URL encoded once
                                                viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src=" + fileUrl; //encodeURIComponent(fileUrl);
                                                contentHtml = `<iframe src="${viewerUrl}" style="width:100%;height:100%;border:none;"></iframe>`;
                                            } else if (ext === "pdf") {
                                                viewerUrl = fileUrl + "#view=FitH" //+ "?t=" + Date.now();
                                                contentHtml = `<iframe src="${viewerUrl}" style="width:100%;height:100%;border:none;"></iframe>`;
                                            } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
                                                viewerUrl = fileUrl //+ "?t=" + Date.now();
                                                contentHtml = `<div style="text-align:center;height:100%">
                                 <img src="${viewerUrl}" style="max-width:100%;max-height:100%"/>
                               </div>`;
                                            } else {
                                                viewerUrl = fileUrl + "?t=" + Date.now();
                                                contentHtml = `<iframe src="${viewerUrl}" style="width:100%;height:100%;border:none;"></iframe>`;
                                            }

                                            //console.log("Viewer URL:", fileUrl); //viewerUrl
                                            $("#popupViewer").remove();
                                            $("body").append('<div id="popupViewer"></div>');

                                            let isFullScreen = false;

                                            $("#popupViewer").dxPopup({
                                                title: "View Attached File",
                                                visible: true,
                                                width: "80%",
                                                height: "80%",
                                                fullScreen: isFullScreen,
                                                showCloseButton: true,
                                                dragEnabled: true,
                                                showTitle: true,
                                                position: {
                                                    my: "top center",
                                                    at: "top center",
                                                    offset: "0 20"
                                                },
                                                contentTemplate: function (contentElement) {
                                                    contentElement.append(contentHtml);
                                                },
                                                toolbarItems: [
                                                    {
                                                        widget: "dxButton",
                                                        location: "after",
                                                        options: {
                                                            icon: isFullScreen ? "collapse" : "expand",
                                                            hint: isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen",
                                                            onClick: function () {
                                                                isFullScreen = !isFullScreen;
                                                                const popup = $("#popupViewer").dxPopup("instance");
                                                                popup.option("fullScreen", isFullScreen);
                                                                popup.option("toolbarItems[0].options.icon", isFullScreen ? "collapse" : "expand");
                                                                popup.option("toolbarItems[0].options.hint", isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen");
                                                            }
                                                        }
                                                    }
                                                ]
                                            });


                                        } catch (error) {
                                            console.error("Error in showViewerUrl:", error);
                                            DevExpress.ui.dialog.alert("Unable to open the file. Please try again.", "Error");
                                        }
                                    }

                                    /**
                                     * Generate viewer URL and inject preview content into a dxForm layout area with header and border.
                                     * @param {string} filename - Name of the file to preview
                                     */
                                    function xformViewerUrl(filename) {
                                        try {
                                            if (!filename) throw new Error("Filename is required");

                                            const baseUrl = `${aaPFDMI}/temp/uploads/`;
                                            const ext = filename.split('.').pop().toLowerCase();
                                            const fileUrl = filename;
                                            const fnameOnly = filename.split("/").pop();

                                            let viewerUrl = "";
                                            let viewerBody = "";

                                            if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
                                                viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src=" + fileUrl;
                                                viewerBody = `<iframe src="${viewerUrl}" style="width:100%;height:500px;border:none;"></iframe>`;
                                            } else if (ext === "pdf") {
                                                viewerUrl = fileUrl + "#view=FitH";
                                                viewerBody = `<iframe src="${viewerUrl}" style="width:100%;height:500px;border:none;"></iframe>`;
                                            } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
                                                viewerUrl = fileUrl;
                                                viewerBody = `<div style="text-align:center;height:400px">
                                    <img src="${viewerUrl}" style="max-width:100%;max-height:100%"/>
                                </div>`;
                                            } else {
                                                viewerUrl = fileUrl + "?t=" + Date.now();
                                                viewerBody = `<iframe src="${viewerUrl}" style="width:100%;height:500px;border:none;"></iframe>`;
                                            }

                                            const xcontentHtml = `
                        <div style="border:1px solid #ccc; padding:8px; margin-top:10px;">
                        <div style="font-weight:bold; font-size:16px; margin-bottom:8px;">
                            &#10054; File Preview: ${fnameOnly}
                        </div>
                        ${viewerBody}
                        </div>
                    `;

                                            const contentHtml = `
                        <div style="border:1px solid #ccc; padding:8px; margin-top:10px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:18px; margin-bottom:8px;">
                            <div>
                                File Preview: ${fnameOnly}
                            </div>
                            <div>
                                <i 
                                class="fas fa-external-link-square-alt" 
                                style="cursor:pointer;" 
                                title="Open in popup" 
                                data-fname="${fnameOnly}"
                                data-viewer='${JSON.stringify(viewerBody)}'
                                onclick="handleIconClick(this)"
                                ></i>
                            </div>
                            </div>
                            ${viewerBody}
                        </div>
                        `;

                                            const viewerContainer = $("#customViewerArea");
                                            if (viewerContainer.length) {
                                                viewerContainer.empty().append(contentHtml);
                                            } else {
                                                console.warn("Viewer container not found: #customViewerArea");
                                            }

                                        } catch (error) {
                                            console.error("Error in formViewerUrl:", error);
                                            DevExpress.ui.dialog.alert("Unable to open the file. Please try again.", "Error");
                                        }
                                    }

                                    function formViewerUrl(filename) {
                                        try {
                                            if (!filename) throw new Error("Filename is required");

                                            const baseUrl = `${aaPFDMI}/temp/uploads/`;
                                            const ext = filename.split('.').pop().toLowerCase();
                                            const fileUrl = filename;
                                            const fnameOnly = filename.split("/").pop();

                                            let viewerUrl = "";
                                            let viewerBody = "";
                                            let viewerFull = "";
                                            // Add a cache-busting query string (timestamp)
                                            const bust = "?v=" + Date.now();

                                            if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
                                                viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src=" + fileUrl + bust;
                                                viewerBody = `<iframe src="${viewerUrl}" style="width:100%;height:400px;border:none;"></iframe>`;
                                                viewerFull = `<iframe src="${viewerUrl}" style="width:100%;height:750px;border:none;"></iframe>`;
                                            } else if (ext === "pdf") {
                                                viewerUrl = fileUrl + "#view=FitH";
                                                viewerBody = `<iframe src="${viewerUrl}" style="width:100%;height:400px;border:none;"></iframe>`;
                                                viewerFull = `<iframe src="${viewerUrl}" style="width:100%;height:750px;border:none;"></iframe>`;
                                            } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
                                                viewerUrl = fileUrl;
                                                viewerBody = `<div style="text-align:center;height:400px">
                                                                <img src="${viewerUrl}" style="max-width:100%;max-height:100%"/>
                                                            </div>`;
                                                viewerFull = `<div style="text-align:center;height:750px">
                                                            <img src="${viewerUrl}" style="max-width:100%;max-height:100%"/>
                                                        </div>`;
                                            } else {
                                                viewerUrl = fileUrl + "?t=" + Date.now();
                                                viewerBody = `<iframe src="${viewerUrl}" style="width:100%;height:400px;border:none;"></iframe>`;
                                                viewerFull = `<iframe src="${viewerUrl}" style="width:100%;height:750px;border:none;"></iframe>`;
                                            }

                                            const xcontentHtml = `
                                                    <div style="border:1px solid #ccc; padding:8px; margin-top:10px;">
                                                    <div style="font-weight:bold; font-size:16px; margin-bottom:8px;">
                                                        &#10054; File Preview: ${fnameOnly}
                                                    </div>
                                                    ${viewerBody}
                                                    </div>
                                                `;

                                            const contentHtml = `
                                                    <div style="border:1px solid #ccc; padding:8px; margin-top:10px;">
                                                        <div style="display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:18px; margin-bottom:8px;">
                                                        <div>
                                                            File Preview: ${fnameOnly}
                                                        </div>
                                                        <div>
                                                            <i 
                                                            class="fas fa-external-link-square-alt" 
                                                            style="cursor:pointer;" 
                                                            title="Open in popup" 
                                                            data-fname="${fnameOnly}"
                                                            data-viewer='${JSON.stringify(viewerBody)}'
                                                            data-viewerF='${JSON.stringify(viewerFull)}'
                                                            onclick="handleIconClick(this)"
                                                            ></i>
                                                        </div>
                                                        </div>
                                                        ${viewerBody}
                                                    </div>
                                                    `;

                                            const viewerContainer = $("#customViewerArea");
                                            if (viewerContainer.length) {
                                                viewerContainer.empty().append(contentHtml);
                                            } else {
                                                console.warn("Viewer container not found: #customViewerArea");
                                            }

                                        } catch (error) {
                                            console.error("Error in formViewerUrl:", error);
                                            DevExpress.ui.dialog.alert("Unable to open the file. Please try again.", "Error");
                                        }
                                    }

                                    //xxxx
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

                                    $("#Add-popupexit").dxButton({
                                        icon: "fas fa-times",
                                        type: "danger",
                                        text: "EXIT",
                                        visible: true,
                                        onClick: function (e) {
                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                            //alert(iData.ERODesc03)
                                            //alert(iData.ERODesc02)
                                            //console.log("---Click Exit---")
                                            //console.log("iData = ",iData)
                                            //console.log("iData.ERODesc02 = ", iData.ERODesc02)
                                            //console.log("iData.ERODesc03 = ", iData.ERODesc03)
                                            //console.log("iData.EROCheck01 = ", iData.EROCheck01)
                                            //console.log("iData.EROCheck02 = ", iData.EROCheck02)
                                            //console.log("iData.EROCheck03 = ", iData.EROCheck03)
                                            //console.log("iData.EROCode04 =  ",iData.EROCode04)
                                            //console.log("asERODesc03 = ", asERODesc03)
                                            //console.log("asERODesc02 = ", asERODesc02)

                                            if (aRecNo === 1) {
                                                let result = DevExpress.ui.dialog.confirm("<center><i class='fas fa-save custom-icon-size'></i>" + " Press 'YES' To SAVE </center>", "SAVE BEFORE EXIT ?"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
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
                                                        let aSQLCommand = "use ExtraOnLine; DELETE FROM TRVREQF WHERE HeadRefNo = '" + aaiHeadRef + "'"
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
                                            asERODesc02 = ""; //Destination	ERODesc02
                                            asERODesc03 = ""; //Purpose of Trip
                                            asERORefNo1 = ""; //Purpose of Trip List
                                            asEROCheck01 = false; //Overseas
                                            asEROCheck02 = false; //Need Roaming    
                                            asEROCheck03 = false; //Self-Booking                                    
                                            asERODate02 = new Date() //Travel Start Date	
                                            asERODate03 = new Date() //Travel End Date	
                                            asRefundedAmount = 0; //Estimated Cost	
                                            asVendor01 = ""; //Departure Flight	
                                            asERODesc04 = ""; //Arrival Flight	
                                            asEROAmount1 = 0; //Ticket Price	EROAmount1
                                            asERODesc05 = ""; //Hotel	ERODesc05
                                            asNote = ""; //Remark	Note
                                            asPBatchNo = "";

                                            popup.hide()
                                        }
                                    });

                                    $("#aConfirmx").dxButton({
                                        hint: "Confirm and send to HOD",
                                        icon: "fas fa-check-circle",
                                        type: "success",
                                        text: "CONFIRM",
                                        visible: aViewG, //true,false
                                        onClick: function (e) {
                                            // validation
                                            const validationResult = aform.validate();
                                            if (validationResult.isValid) {
                                                console.log("Form is valid. Proceed with submission.");
                                                // Proceed with your submission logic here
                                            } else {
                                                console.log("Form is invalid. Please correct the errors.");
                                                // Optionally, you can show the error messages or highlight invalid fields
                                            }
                                            console.log("validationResult: ", validationResult)
                                            // check dataGrid
                                            const rows = aAddStaff.getDataSource().items(); // Get all rows in the data grid aAddStaff
                                            let allValid = true;
                                            console.log("aAddStaff rows = ", rows)
                                            rows.forEach(row => {
                                                // Make sure that 'id' is the keyExpr you specified in the DataGrid
                                                const rowIndex = aAddStaff.getRowIndexByKey(row.ID); // This should now work, as the keyExpr is set

                                                // Validate the row using the row index
                                                if (rowIndex !== -1) {  // Ensure the row index is valid
                                                    const rowValidationResult = aAddStaff.validateRow(rowIndex);

                                                    if (!rowValidationResult.isValid) {
                                                        allValid = false;
                                                        console.log(`Row ${rowIndex} is invalid. Errors:`, rowValidationResult.brokenRules);
                                                        // Optionally, handle the error (highlight invalid row, show message)
                                                    }
                                                } else {
                                                    console.log(`Row with id ${row.id} not found in the grid.`);
                                                }
                                            });

                                            if (allValid) {
                                                console.log("All rows are valid. Proceed with submission.");
                                                // Proceed with your submission logic here
                                            } else {
                                                console.log("Some rows are invalid. Please correct the errors.");
                                            }
                                            // validation
                                            var aBookingOptions = iData.EROCheck03 ? `SELF BOOKING [REQ->HOD${iData.EROCheck02 ? "->HR" : ""}]` : `ADMIN BOOKING [REQ->HOD->ADMIN${iData.EROCheck02 ? "->HR" : ""}]`
                                            var result = $("#Add-form").dxForm("instance").validate(); //Add-dxDataGrid
                                            if (!result.isValid) { DevExpress.ui.dialog.alert("Required Fields not valid, please check", "VALIDATION ERROR") } else {
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

                                                //*/ check dxDataGrid field
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

                                                        //ERODesc02: row[3]?.trim(), //Description
                                                        //ERODesc03: row[4]?.trim(), //Purpose
                                                        //var condition = item => item.Amount === 0 || item.ERODesc02 === "" || item.ERODesc03 === "" || item.ERODesc04 === "" || item.ERORefNo3 === "" || item.RefundedAmount === 0 || item.Xrate === 0 || (item.Xrate === 1 && item.Currency !== "THB") || (item.Xrate !== 1 && item.Currency === "THB");
                                                        //Validation logic with key, value, and caption
                                                        if (key === "Vendor02" && value === "") {
                                                            DevExpress.ui.dialog.alert(`Field <b>${caption}</b> cannot be empty.`, "Warning !!"); // (Key: ${key}, Value: ${value})
                                                            return false;
                                                        }
                                                        // if (key === "PsPvDate" && value === "01/01/1901") { //(key === "EROCheck01" && value === true) && 
                                                        //     DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                        //     return false;
                                                        // }
                                                        if (key === "EROCode03" && value === "") {
                                                            DevExpress.ui.dialog.alert(`Field <b>${caption}</b> cannot be empty.`, "Warning !!"); // (Key: ${key}, Value: ${value})
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
                                                //*/ **
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                let aDivSxx = "Where REFNO = '" + aaiHeadRef + "-001'" //HeadRefNo Check RefundedAmount for the first record only
                                                let aFieldSelectedxx = "HeadRefNo,RefundedAmount,EROCheck01" //ExtraOnLine].[dbo].[EXPREIM_400] TotalReimburse,
                                                let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.TRVREQF " + aDivSxx; //alert(aFullBody)  Estimated Amount                                         
                                                //console.log(aFullBodyxx, aaHODApprover);
                                                fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                    .then(response => response.json())
                                                    //
                                                    .then(ppData => {
                                                        var aaTotalValue = ppData;
                                                        var aaTotalReim = aaTotalValue[0].RefundedAmount //TotalReimburse
                                                        var aaCheckOverseas = aaTotalValue[0].EROCheck01 ? "TRFO" : "HOD";
                                                        //console.log(aaCheckOverseas)
                                                        //alert(aaTotalReim)
                                                        //alert(aaHODApprover.length)
                                                        //check if aaCheckOverseas = "TRFO"
                                                        var aaChkA = aaHODApprover.filter(item => item.ApproverCode === "TRFO")
                                                        if (aaCheckOverseas === 'TRFO') {
                                                            if (aaChkA.length > 0) {
                                                                aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "TRFO");
                                                                // use only "TRFO" if overseas
                                                            }  // if not found TRFO use TRF instead
                                                        } else if (aaCheckOverseas === 'HOD') {
                                                            if (aaChkA.length > 0) {
                                                                aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "HOD");
                                                                // use only "TRF"
                                                            }
                                                        }
                                                        //console.log("aaHODApprover ", aaHODApprover)
                                                        //console.log(aaHODApprover)                                                                
                                                        var aaiFoundApp = false;
                                                        var nnLno = 0;
                                                        var nnAdno = 0;
                                                        var aaHODEmail4Chk = "";
                                                        var aaHODName4Chk = "";
                                                        var aaHODRange4Chk = "";
                                                        for (let i = 0; i < aaHODApprover.length; i++) {
                                                            if ($.trim(aaHODApprover[i].ApproverName) === $.trim(asFullName)) {
                                                                nnAdno = i
                                                                aaiFoundApp = true;
                                                                break;
                                                            }
                                                        }
                                                        //console.log("asFullName ", asFullName)
                                                        //console.log(aaHODApprover[0].ApproverName)
                                                        //console.log(nnAdno)
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
                                                        //console.log(aaHODAll4Chk)
                                                        //console.log(xxChkNamexx, xxChkEmailxx, xxChkRangexx)

                                                        // send mail to first Approver 
                                                        aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                        aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail;

                                                        //console.log("HOD App Email = ", aaHODAppEmail)
                                                        //console.log("Overseas = ", aaCheckOverseas)
                                                        // Check empty fields
                                                        var aDatabasea = "ExtraOnLine.dbo.TRVREQF";
                                                        var aKeyField = "HeadRefNo" //"HeadRefNo"; "REFNO"
                                                        var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724" +"-001" 
                                                        var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";

                                                        if (aaCheckOverseas === 'TRFO') {
                                                            var aaCondition = item =>
                                                                (item.ID === 1 && (item.ERODesc02 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROCode03 === "" || item.Vendor02 === "" || (item.PSPvDate && new Date(item.PSPvDate).getTime() === new Date('01/01/1901').getTime())))
                                                                ||
                                                                (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === "" || (item.PSPvDate && new Date(item.PSPvDate).getTime() === new Date('01/01/1901').getTime())))
                                                        } else {
                                                            var aaCondition = item =>
                                                                (item.ID === 1 && (item.ERODesc02 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROCode03 === "" || item.Vendor02 === ""))
                                                                ||
                                                                (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === ""))
                                                        }

                                                        var condition = aaCondition
                                                        aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                            .then(atestCehcka => {
                                                                //console.log("aTestChehcka = ", atestCehcka); // Logs the actual message
                                                                // { DevExpress.ui.dialog.alert(aTRFnAlert01, "INPUT ERROR"); }
                                                                if (atestCehcka === 1) { DevExpress.ui.dialog.alert(aVARs.ALERT01, "INPUT ERROR"); }
                                                                else {
                                                                    //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm (" + aaCheckOverseas + ") & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' ></b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ֡��ั��ทึ��" +
                                                                    let getvalues = { aaCheckOverseas: aaCheckOverseas, aaHODAppName: aaHODAppName, aaHODAppEmail: aaHODAppEmail, xxChkLenxx: xxChkLenxx, aBookingOptions: aBookingOptions }
                                                                    //console.log("getvalues ", getvalues)
                                                                    let aTrfAlert02 = aVARs.ALERT02.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                    let result = DevExpress.ui.dialog.confirm(aTrfAlert02, "CONFIRM TO HOD");
                                                                    //let result = DevExpress.ui.dialog.confirm("<p style='color: darkblue; font-size: 18px;' ><i class='fas fa-info-circle custom-icon-size'></i> " + " Press [YES] to confirm (" + aaCheckOverseas + ") and send email to " + aaHODAppName + " (" + aaHODAppEmail + ") <br></b></p><p style='color: darkgreen; font-size: 14px;'>(" + (xxChkLenxx) + " HOD to approve)</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                                    //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' > ��ละ ��รุณาตรว��สอ����าร��ั��ทึ��ราย��าร��ห����ร��ทุ������อ������ทุ����รรทัด** <br><b><u>��ม��เ��������ั����</u> ��ะทำ��ห��ราย��าร��ี��เ��ิ������าย��ม����ด�� </b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                                    result.done(function (dresult) {//                                                                                                                                                                                                                    
                                                                        if (dresult) {
                                                                            //if (aContinueChk !== true) {
                                                                            let aFREF = aaiHeadRef + "-001"
                                                                            //console.log(aaiHeadRef)
                                                                            //console.log(aFREF)
                                                                            let aERStatus = "Confirmed wait for HOD" //"Register"
                                                                            let aTrueORFalse = '1'
                                                                            let aTrueORFalseB = true
                                                                            let aNowDateT = aaNowText(aNowDte)
                                                                            //let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                            //let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                            var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus, ReqDate: aNowDte };
                                                                            var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                            //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                            //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704' ERORefNo6
                                                                            let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                            aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();

                                                                            //send Email
                                                                            var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " TRAVEL REQUISITION ";
                                                                            let aApproverName = aaHODAppName //+ ", [HOD]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                            let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                            let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                            let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"

                                                                            //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                                                            var aSubject = aaMailTitle
                                                                            let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                            let aAddress2Do = `<a href='${aaPFDMI}/XOL/index.html'>${aaOnInitExpGroupDesc}</a>`;
                                                                            let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName, aBookingOptions: aBookingOptions }
                                                                            let aMessage01 = aArrays.ACONFIRM[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                            var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                            aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();

                                                                            //aMessageAlert("Already Confirmed & send mail to Approver " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                            aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                            popup.hide();
                                                                        }
                                                                    });
                                                                    //1
                                                                } //aaLoadData
                                                            }); // then check                                                                 
                                                    });
                                            }
                                        } // validationrule
                                    });

                                    $("#aConfirm01x").dxButton({
                                        hint: "Confirm and send to HOD",
                                        icon: "fas fa-check-circle",
                                        type: "success",
                                        text: "CONFIRM",
                                        visible: aViewG, //true,false
                                        onClick: function (e) {
                                            // validation
                                            const validationResult = aform01.validate();
                                            if (validationResult.isValid) {
                                                console.log("Form is valid. Proceed with submission.");
                                                // Proceed with your submission logic here
                                            } else {
                                                console.log("Form is invalid. Please correct the errors.");
                                                // Optionally, you can show the error messages or highlight invalid fields
                                            }
                                            console.log("validationResult: ", validationResult)
                                            // check dataGrid
                                            const rows = aAddStaff.getDataSource().items(); // Get all rows in the data grid aAddStaff
                                            let allValid = true;
                                            console.log("aAddStaff rows = ", rows)
                                            rows.forEach(row => {
                                                // Make sure that 'id' is the keyExpr you specified in the DataGrid
                                                const rowIndex = aAddStaff.getRowIndexByKey(row.ID); // This should now work, as the keyExpr is set

                                                // Validate the row using the row index
                                                if (rowIndex !== -1) {  // Ensure the row index is valid
                                                    const rowValidationResult = aAddStaff.validateRow(rowIndex);

                                                    if (!rowValidationResult.isValid) {
                                                        allValid = false;
                                                        console.log(`Row ${rowIndex} is invalid. Errors:`, rowValidationResult.brokenRules);
                                                        // Optionally, handle the error (highlight invalid row, show message)
                                                    }
                                                } else {
                                                    console.log(`Row with id ${row.id} not found in the grid.`);
                                                }
                                            });

                                            if (allValid) {
                                                console.log("All rows are valid. Proceed with submission.");
                                                // Proceed with your submission logic here
                                            } else {
                                                console.log("Some rows are invalid. Please correct the errors.");
                                            }
                                            // validation
                                            var aBookingOptions = iData.EROCheck03 ? `SELF BOOKING [REQ->HOD${iData.EROCheck02 ? "->HR" : ""}]` : `ADMIN BOOKING [REQ->HOD->ADMIN${iData.EROCheck02 ? "->HR" : ""}]`
                                            var result = $("#Add-form01").dxForm("instance").validate(); //Add-dxDataGrid
                                            if (!result.isValid) { DevExpress.ui.dialog.alert("Required Fields not valid, please check", "VALIDATION ERROR") } else {
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

                                                //*/ check dxDataGrid field
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

                                                        //ERODesc02: row[3]?.trim(), //Description
                                                        //ERODesc03: row[4]?.trim(), //Purpose
                                                        //var condition = item => item.Amount === 0 || item.ERODesc02 === "" || item.ERODesc03 === "" || item.ERODesc04 === "" || item.ERORefNo3 === "" || item.RefundedAmount === 0 || item.Xrate === 0 || (item.Xrate === 1 && item.Currency !== "THB") || (item.Xrate !== 1 && item.Currency === "THB");
                                                        //Validation logic with key, value, and caption
                                                        if (key === "Vendor02" && value === "") {
                                                            DevExpress.ui.dialog.alert(`Field <b>${caption}</b> cannot be empty.`, "Warning !!"); // (Key: ${key}, Value: ${value})
                                                            return false;
                                                        }
                                                        // if (key === "PsPvDate" && value === "01/01/1901") { //(key === "EROCheck01" && value === true) && 
                                                        //     DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                        //     return false;
                                                        // }
                                                        if (key === "EROCode03" && value === "") {
                                                            DevExpress.ui.dialog.alert(`Field <b>${caption}</b> cannot be empty.`, "Warning !!"); // (Key: ${key}, Value: ${value})
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
                                                //*/ **
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                let aDivSxx = "Where REFNO = '" + aaiHeadRef + "-001'" //HeadRefNo Check RefundedAmount for the first record only
                                                let aFieldSelectedxx = "HeadRefNo,RefundedAmount,EROCheck01" //ExtraOnLine].[dbo].[EXPREIM_400] TotalReimburse,
                                                let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.TRVREQF " + aDivSxx; //alert(aFullBody)  Estimated Amount                                         
                                                //console.log(aFullBodyxx, aaHODApprover);
                                                fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                    .then(response => response.json())
                                                    //
                                                    .then(ppData => {
                                                        var aaTotalValue = ppData;
                                                        var aaTotalReim = aaTotalValue[0].RefundedAmount //TotalReimburse
                                                        var aaCheckOverseas = aaTotalValue[0].EROCheck01 ? "TRFO" : "HOD";
                                                        //console.log(aaCheckOverseas)
                                                        //alert(aaTotalReim)
                                                        //alert(aaHODApprover.length)
                                                        //check if aaCheckOverseas = "TRFO"
                                                        var aaChkA = aaHODApprover.filter(item => item.ApproverCode === "TRFO")
                                                        if (aaCheckOverseas === 'TRFO') {
                                                            if (aaChkA.length > 0) {
                                                                aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "TRFO");
                                                                // use only "TRFO" if overseas
                                                            }  // if not found TRFO use TRF instead
                                                        } else if (aaCheckOverseas === 'HOD') {
                                                            if (aaChkA.length > 0) {
                                                                aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "HOD");
                                                                // use only "TRF"
                                                            }
                                                        }
                                                        //console.log("aaHODApprover ", aaHODApprover)
                                                        //console.log(aaHODApprover)                                                                
                                                        var aaiFoundApp = false;
                                                        var nnLno = 0;
                                                        var nnAdno = 0;
                                                        var aaHODEmail4Chk = "";
                                                        var aaHODName4Chk = "";
                                                        var aaHODRange4Chk = "";
                                                        for (let i = 0; i < aaHODApprover.length; i++) {
                                                            if ($.trim(aaHODApprover[i].ApproverName) === $.trim(asFullName)) {
                                                                nnAdno = i
                                                                aaiFoundApp = true;
                                                                break;
                                                            }
                                                        }
                                                        //console.log("asFullName ", asFullName)
                                                        //console.log(aaHODApprover[0].ApproverName)
                                                        //console.log(nnAdno)
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
                                                        //console.log(aaHODAll4Chk)
                                                        //console.log(xxChkNamexx, xxChkEmailxx, xxChkRangexx)

                                                        // send mail to first Approver 
                                                        aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                        aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail;

                                                        //console.log("HOD App Email = ", aaHODAppEmail)
                                                        //console.log("Overseas = ", aaCheckOverseas)
                                                        // Check empty fields
                                                        var aDatabasea = "ExtraOnLine.dbo.TRVREQF";
                                                        var aKeyField = "HeadRefNo" //"HeadRefNo"; "REFNO"
                                                        var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724" +"-001" 
                                                        var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";

                                                        if (aaCheckOverseas === 'TRFO') {
                                                            var aaCondition = item =>
                                                                (item.ID === 1 && (item.ERODesc02 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROCode03 === "" || item.Vendor02 === "" || (item.PSPvDate && new Date(item.PSPvDate).getTime() === new Date('01/01/1901').getTime())))
                                                                ||
                                                                (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === "" || (item.PSPvDate && new Date(item.PSPvDate).getTime() === new Date('01/01/1901').getTime())))
                                                        } else {
                                                            var aaCondition = item =>
                                                                (item.ID === 1 && (item.ERODesc02 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROCode03 === "" || item.Vendor02 === ""))
                                                                ||
                                                                (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === ""))
                                                        }

                                                        var condition = aaCondition
                                                        aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                            .then(atestCehcka => {
                                                                //console.log("aTestChehcka = ", atestCehcka); // Logs the actual message
                                                                // { DevExpress.ui.dialog.alert(aTRFnAlert01, "INPUT ERROR"); }
                                                                if (atestCehcka === 1) { DevExpress.ui.dialog.alert(aVARs.ALERT01, "INPUT ERROR"); }
                                                                else {
                                                                    //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm (" + aaCheckOverseas + ") & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' ></b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ֡��ั��ทึ��" +
                                                                    let getvalues = { aaCheckOverseas: aaCheckOverseas, aaHODAppName: aaHODAppName, aaHODAppEmail: aaHODAppEmail, xxChkLenxx: xxChkLenxx, aBookingOptions: aBookingOptions }
                                                                    //console.log("getvalues ", getvalues)
                                                                    let aTrfAlert02 = aVARs.ALERT02.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                    let result = DevExpress.ui.dialog.confirm(aTrfAlert02, "CONFIRM TO HOD");
                                                                    //let result = DevExpress.ui.dialog.confirm("<p style='color: darkblue; font-size: 18px;' ><i class='fas fa-info-circle custom-icon-size'></i> " + " Press [YES] to confirm (" + aaCheckOverseas + ") and send email to " + aaHODAppName + " (" + aaHODAppEmail + ") <br></b></p><p style='color: darkgreen; font-size: 14px;'>(" + (xxChkLenxx) + " HOD to approve)</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                                    //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' > ��ละ ��รุณาตรว��สอ����าร��ั��ทึ��ราย��าร��ห����ร��ทุ������อ������ทุ����รรทัด** <br><b><u>��ม��เ��������ั����</u> ��ะทำ��ห��ราย��าร��ี��เ��ิ������าย��ม����ด�� </b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                                    result.done(function (dresult) {//                                                                                                                                                                                                                    
                                                                        if (dresult) {
                                                                            //if (aContinueChk !== true) {
                                                                            let aFREF = aaiHeadRef + "-001"
                                                                            //console.log(aaiHeadRef)
                                                                            //console.log(aFREF)
                                                                            let aERStatus = "Confirmed wait for HOD" //"Register"
                                                                            let aTrueORFalse = '1'
                                                                            let aTrueORFalseB = true
                                                                            let aNowDateT = aaNowText(aNowDte)
                                                                            //let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                            //let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                            var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus, ReqDate: aNowDte };
                                                                            var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                            //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                            //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704' ERORefNo6
                                                                            let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                            aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();

                                                                            //send Email
                                                                            var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " TRAVEL REQUISITION ";
                                                                            let aApproverName = aaHODAppName //+ ", [HOD]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                            let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                            let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                            let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"

                                                                            //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                                                            var aSubject = aaMailTitle
                                                                            let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                            let aAddress2Do = `<a href='${aaPFDMI}/XOL/index.html'>${aaOnInitExpGroupDesc}</a>`;
                                                                            let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName, aBookingOptions: aBookingOptions }
                                                                            let aMessage01 = aArrays.ACONFIRM[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                            var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                            aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();

                                                                            //aMessageAlert("Already Confirmed & send mail to Approver " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                            aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                            popup.hide();
                                                                        }
                                                                    });
                                                                    //1
                                                                } //aaLoadData
                                                            }); // then check                                                                 
                                                    });
                                            }
                                        } // validationrule
                                    });

                                    const aform = $("#Add-formx").dxForm({
                                        formData: iData, //aXXData[0], //iData,                                              
                                        showColonAfterLabel: false,
                                        labelLocation: "top",//"left", //"top",
                                        readOnly: aViewF, //true e.row.data.Confirmed

                                        //elementAttr: {
                                        //    style: "background-color: #F5F5F5; color: black;"
                                        //},
                                        //validationGroup: "formValidationGroup", // Define a validation group here
                                        items: [
                                            {
                                                itemType: "group",
                                                colCount: 6,
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
                                                        itemType: "simple",
                                                        visible: false,
                                                        // visible: function() {
                                                        //     return asPBatchNo !== undefined && asPBatchNo !== null && asPBatchNo !== "";
                                                        // },
                                                        //visible: false,
                                                        template: function () {
                                                            if (asPBatchNo === "") {
                                                                return $("<div>"); // ไม่แสดงอะไรเลยถ้าไม่มีข้อมูล
                                                            }

                                                            return $("<div>")
                                                                .append($("<div>")
                                                                    .text("Corporate Card") // ✅ label
                                                                    .css({
                                                                        "color": "black",              // ✅ สีของ label
                                                                        "font-weight": "bold",
                                                                        "text-align": "left",
                                                                        "font-size": "12px",
                                                                        "margin-top": "6px",
                                                                        "margin-bottom": "6px"
                                                                    }))
                                                                .append($("<div>")
                                                                    .text(asPBatchNo)              // ✅ value
                                                                    .css({
                                                                        "color": asEROCheck03 ? "purple" : "darkgreen",
                                                                        "background": "linear-gradient(to bottom, #fcfcfc, #d6dff7)",
                                                                        "font-size": "13px",
                                                                        //"font-weight": "bold",
                                                                        "text-align": "left",
                                                                        "width": "160px",
                                                                        //"padding": "5px"
                                                                    }));
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
                                                                    dataSource: aObjects.aaPurposeTable, //aaPurposeTable
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
                                                                        var formInstance = $(`#${aForm2Add}`).dxForm("instance");
                                                                        formInstance.updateData("ERODate03", e.value);
                                                                        formInstance.updateData("ERODate05", e.value);
                                                                        asERODate02 = e.value;
                                                                        iData.ERODate05 = e.value;

                                                                        aSaveMemToDB(iData, aaTBKey, aaPFDMI, aaXToX)
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
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
                                                                        var formInstance = $(`#${aForm2Add}`).dxForm("instance");
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
                                                                    onValueChanged: function (e) {
                                                                        asEROCheck01 = e.value;
                                                                        console.log("asEROCheck01 ", asEROCheck01)
                                                                        aAddStaff.columnOption("PSPvDate", "visible", e.value);
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        if (asEROCheck02 && !e.value) {
                                                                            aMessageAlert("<b><p style=font-size: 20px;>Roaming just for Overseas Only !! ", "Red")
                                                                            var formInstance = $(`#${aForm2Add}`).dxForm("instance");
                                                                            formInstance.updateData("EROCheck02", false);
                                                                            asEROCheck02 = false;
                                                                        }
                                                                        $(`#${aForm2Add}`).dxDataGrid("instance").refresh();
                                                                    }
                                                                }
                                                            },

                                                            {
                                                                dataField: "EROCheck02",
                                                                label: { text: "Need Roaming" },
                                                                editorType: "dxCheckBox",
                                                                editorOptions: {
                                                                    //readOnly: function (e){return (asEROCheck01 === true ? false : true)},
                                                                    onValueChanged: function (e) {
                                                                        if (!asEROCheck01 && e.value) {
                                                                            aMessageAlert("<b><p style=font-size: 20px;>Roaming just for Overseas Only !! ", "Red")
                                                                            var formInstance = $(`#${aForm2Add}`).dxForm("instance");
                                                                            formInstance.updateData("EROCheck02", false);
                                                                            asEROCheck02 = false;

                                                                        } else {

                                                                            asEROCheck02 = e.value;
                                                                            aAddStaff.columnOption("ROAMING INFORMATION", "visible", e.value); //HR Arrange for Roaming
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        }
                                                                    }

                                                                },
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "RefundedAmount",
                                                                label: { text: "Estimated Cost" },
                                                                dataType: "dxNumberBox",
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
                                                        visible: iData.EROCheck03,
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
                                                                },
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
                                                        title: "FLIGHT & HOTEL",
                                                        icon: "fas fa-clock",
                                                        iconPosition: "start",
                                                        colCount: 6,
                                                        visible: !iData.EROCheck03,
                                                        items: [
                                                            {
                                                                dataField: "Vendor01",
                                                                label: { text: "Departure Flight" }, //,cssClass: "bold-label" }, 
                                                                editorType: "dxTextArea",
                                                                editorOptions: {
                                                                    width: 400,
                                                                    height: 50,
                                                                    readOnly: true,
                                                                }, //value: asFullName, //asEROCheck03
                                                                cssClass: "verylight-green",
                                                                visible: true,
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
                                                                    readOnly: true,
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
                                                                    readOnly: true,
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
                                                                    readOnly: true,
                                                                },
                                                                cssClass: "verylight-green",
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
                                                                    readOnly: true,
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
                                                        title: "AGENT INFO", // FOR ADMIN BOOKING
                                                        icon: "fas fa-user-circle",
                                                        iconPosition: "start",
                                                        visible: !iData.EROCheck03,
                                                        colCount: 8,
                                                        items: [
                                                            {
                                                                dataField: "ERORefNo4", // Updated field name
                                                                label: { text: "Travel Agent" }, // Label for the field
                                                                editorType: "dxTextBox", // Using dxSelectBox
                                                                editorOptions: {
                                                                    width: 250,
                                                                    readOnly: true,
                                                                },
                                                                cssClass: "verylight-green", // Styling
                                                                colSpan: 2 // Layout control
                                                            },

                                                            // {
                                                            //     itemType: "simple",
                                                            //     label: { text: "Travel Name" },
                                                            //     template: function () {
                                                            //         return $("<div>").text(iData.ERORefNo4).css({
                                                            //             "color": "darkgreen",
                                                            //             "width": "150",
                                                            //             "height": "20",
                                                            //             //"font-size": "15px",
                                                            //             //"font-weight": "bold",
                                                            //             "background": "linear-gradient(to bottom, #fcfcfc, #d6f7d9)",
                                                            //             //"text-align": "center",
                                                            //             "border-bottom:": "2px solid blue",
                                                            //             // "border-radius": "4px",
                                                            //             // "width": "130px",
                                                            //             // "padding": "5px"
                                                            //         });
                                                            //     },
                                                            //     cssClass: "verylight-green", //linear-gradient(to bottom, #fcfcfc, #d6f7d9)
                                                            //     colSpan: 1
                                                            // },
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
                                                                    readOnly: true,
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
                                                                    displayFormat: "dd/MM/yyyy", width: 150, showClearButton: true,
                                                                    readOnly: true,

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
                                                                    format: "#,##0.00", width: 150,
                                                                    elementAttr: { class: "right-align-number" },
                                                                    readOnly: true,
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
                                                        title: "AGENT INFO", // for SELF BOOKING
                                                        icon: "fas fa-user-circle",
                                                        iconPosition: "start",
                                                        /*Travel Agent EROCode06,InvoicNo	ERORefNo5,InvoiceDate	ERODate04
                                                        InvoiceAmt	EROAmount6,InvoiceNote	ERORefNo6,Travel Agent Name	ERORefNo4*/
                                                        visible: iData.EROCheck03,
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
                                                                dataField: "ERODate04",
                                                                label: { text: "Invoice Date" },
                                                                editorType: "dxDateBox",
                                                                dataType: "date",
                                                                format: "dd/MM/yyyy",
                                                                width: 120,
                                                                editorOptions: {
                                                                    width: 120,
                                                                    showClearButton: true,
                                                                    useMaskBehavior: true,
                                                                    pickerType: "calendar",
                                                                    displayFormat: "dd/MM/yyyy",
                                                                    hint: "Select the Invoice Date",
                                                                    //value: new Date(), // Default to blank initially
                                                                    onOpened: function (e) {
                                                                        if (!e.component.option("value")) {
                                                                            e.component.option("value", new Date()); // Set today’s date if empty
                                                                        }
                                                                    }
                                                                },
                                                                visible: true,
                                                                colSpan: 1
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
                                        // onInitialized: function (e) {
                                        //     // Trigger validation immediately using the defined validation group
                                        //     //const validationResult = DevExpress.validationEngine.validateGroup("formValidationGroup");

                                        //     //if (!validationResult.isValid) {
                                        //     //    console.log("Form is invalid upon initialization.");
                                        //     // }
                                        // }

                                    }).dxForm("instance");

                                    const aform01 = $("#Add-form01x").dxForm({
                                        formData: iData, //aXXData[0], //iData,                                              
                                        showColonAfterLabel: false,
                                        labelLocation: "top",//"left", //"top",
                                        readOnly: aViewF, //true e.row.data.Confirmed
                                        items: [
                                            {
                                                itemType: "group",
                                                colCount: 6,
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
                                                        itemType: "simple",
                                                        visible: false,
                                                        template: function () {
                                                            if (asPBatchNo === "") {
                                                                return $("<div>"); // ไม่แสดงอะไรเลยถ้าไม่มีข้อมูล
                                                            }

                                                            return $("<div>")
                                                                .append($("<div>")
                                                                    .text("Corporate Card") // ✅ label
                                                                    .css({
                                                                        "color": "black",              // ✅ สีของ label
                                                                        "font-weight": "bold",
                                                                        "text-align": "left",
                                                                        "font-size": "12px",
                                                                        "margin-top": "6px",
                                                                        "margin-bottom": "6px"
                                                                    }))
                                                                .append($("<div>")
                                                                    .text(asPBatchNo)              // ✅ value
                                                                    .css({
                                                                        "color": asEROCheck03 ? "purple" : "darkgreen",
                                                                        "background": "linear-gradient(to bottom, #fcfcfc, #d6dff7)",
                                                                        "font-size": "13px",
                                                                        //"font-weight": "bold",
                                                                        "text-align": "left",
                                                                        "width": "160px",
                                                                        //"padding": "5px"
                                                                    }));
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
                                                        dataField: "PBatchNo",
                                                        label: { text: "Corporate Card", cssClass: "custom-label" },
                                                        // label: {
                                                        //     cssClass: "custom-label",
                                                        //     template: function (data, element) {
                                                        //       // Render the visible label text
                                                        //       const label = $("<span>")
                                                        //         .text("Corporate Card")
                                                        //         .css({ cursor: "help", "text-decoration": "underline dotted" });

                                                        //       const showHelp = () => {
                                                        //         const helpText = aObjects.aGHeaderHelp["PBatchNo"];
                                                        //         if (helpText) {
                                                        //           $("#popup").dxPopup({
                                                        //             title: `Help: ${data.text || "Corporate Card"}`,
                                                        //             contentTemplate: () => $("<div>").html(helpText),
                                                        //             width: 400,
                                                        //             height: 200,
                                                        //             dragEnabled: true,
                                                        //             closeOnOutsideClick: true,
                                                        //             wrapperAttr: { class: "rounded-popup" },
                                                        //             position: {
                                                        //               my: "center top",
                                                        //               at: "center top",
                                                        //               of: window,
                                                        //               offset: "0 120"
                                                        //             }
                                                        //           }).dxPopup("show");
                                                        //         }
                                                        //       };

                                                        //       // Trigger on hover
                                                        //       label.on("mouseenter", showHelp);
                                                        //       label.on("mouseleave", () => $("#popup").dxPopup("hide"));

                                                        //       // Trigger on click (for touch devices or explicit action)
                                                        //       label.on("click", showHelp);

                                                        //       element.append(label);
                                                        //     }
                                                        //   },
                                                        editorType: "dxSelectBox",
                                                        // editorOptions: { width: 150, showClearButton: true, readOnly: false,
                                                        //     dataSource: aaRESULaa, //aObjects.CORPREG, //aaPurposeTable aaRESULaa.CardId
                                                        //             searchExpr: "CardID",
                                                        //             valueExpr: "CardID",
                                                        //             displayExpr: "CardID",
                                                        //             searchEnabled: true,
                                                        //             onValueChanged: function (e) {
                                                        //                 asPBatchNo = e.value;
                                                        //             }
                                                        //  },
                                                        editorOptions: {
                                                            width: 180,
                                                            //showClearButton: true,
                                                            readOnly: true,
                                                            // dataSource: cardIdOptions,
                                                            // valueExpr: "CardID",
                                                            // displayExpr: "Label",
                                                            // searchEnabled: true,
                                                            // value: asPBatchNo,
                                                            // onValueChanged: function (e) {
                                                            //     asPBatchNo = e.value;
                                                            // },
                                                        },
                                                        cssClass: "verylight-blue",
                                                        colSpan: 1,
                                                        visible: false,
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
                                                                    dataSource: aObjects.aaPurposeTable, //aaPurposeTable
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
                                                                        var formInstance = $(`#${aForm2Add}`).dxForm("instance");
                                                                        formInstance.updateData("ERODate03", e.value);
                                                                        formInstance.updateData("ERODate05", e.value);
                                                                        asERODate02 = e.value;
                                                                        iData.ERODate05 = e.value;

                                                                        aSaveMemToDB(iData, aaTBKey, aaPFDMI, aaXToX)
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
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
                                                                        var formInstance = $(`#${aForm2Add}`).dxForm("instance");
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
                                                                    onValueChanged: function (e) {
                                                                        asEROCheck01 = e.value;
                                                                        console.log("asEROCheck01 ", asEROCheck01)
                                                                        aAddStaff.columnOption("PSPvDate", "visible", e.value);
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        if (asEROCheck02 && !e.value) {
                                                                            aMessageAlert("<b><p style=font-size: 20px;>Roaming just for Overseas Only !! ", "Red")
                                                                            var formInstance = $(`#${aForm2Add}`).dxForm("instance");
                                                                            formInstance.updateData("EROCheck02", false);
                                                                            asEROCheck02 = false;
                                                                        }
                                                                        $(`#${aForm2Add}`).dxDataGrid("instance").refresh();
                                                                    }
                                                                }
                                                            },

                                                            {
                                                                dataField: "EROCheck02",
                                                                label: { text: "Need Roaming" },
                                                                editorType: "dxCheckBox",
                                                                editorOptions: {
                                                                    //readOnly: function (e){return (asEROCheck01 === true ? false : true)},
                                                                    onValueChanged: function (e) {
                                                                        if (!asEROCheck01 && e.value) {
                                                                            aMessageAlert("<b><p style=font-size: 20px;>Roaming just for Overseas Only !! ", "Red")
                                                                            var formInstance = $(`#${aForm2Add}`).dxForm("instance");
                                                                            formInstance.updateData("EROCheck02", false);
                                                                            asEROCheck02 = false;

                                                                        } else {

                                                                            asEROCheck02 = e.value;
                                                                            aAddStaff.columnOption("ROAMING INFORMATION", "visible", e.value); //HR Arrange for Roaming
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        }
                                                                    }

                                                                },
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "RefundedAmount",
                                                                label: { text: "Estimated Cost" },
                                                                dataType: "dxNumberBox",
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
                                                        visible: iData.EROCheck03,
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
                                                                },
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
                                                        title: "FLIGHT & HOTEL",
                                                        icon: "fas fa-clock",
                                                        iconPosition: "start",
                                                        colCount: 6,
                                                        visible: !iData.EROCheck03,
                                                        items: [
                                                            {
                                                                dataField: "Vendor01",
                                                                label: { text: "Departure Flight" }, //,cssClass: "bold-label" }, 
                                                                editorType: "dxTextArea",
                                                                editorOptions: {
                                                                    width: 400,
                                                                    height: 50,
                                                                    readOnly: true,
                                                                }, //value: asFullName, //asEROCheck03
                                                                cssClass: "verylight-green",
                                                                visible: true,
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
                                                                    readOnly: true,
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
                                                                    readOnly: true,
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
                                                                    readOnly: true,
                                                                },
                                                                cssClass: "verylight-green",
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
                                                                    readOnly: true,
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
                                                        title: "AGENT INFO", // FOR ADMIN BOOKING
                                                        icon: "fas fa-user-circle",
                                                        iconPosition: "start",
                                                        visible: !iData.EROCheck03,
                                                        colCount: 8,
                                                        items: [
                                                            {
                                                                dataField: "ERORefNo4", // Updated field name
                                                                label: { text: "Travel Agent" }, // Label for the field
                                                                editorType: "dxTextBox", // Using dxSelectBox
                                                                editorOptions: {
                                                                    width: 250,
                                                                    readOnly: true,
                                                                },
                                                                cssClass: "verylight-green", // Styling
                                                                colSpan: 2 // Layout control
                                                            },

                                                            // {
                                                            //     itemType: "simple",
                                                            //     label: { text: "Travel Name" },
                                                            //     template: function () {
                                                            //         return $("<div>").text(iData.ERORefNo4).css({
                                                            //             "color": "darkgreen",
                                                            //             "width": "150",
                                                            //             "height": "20",
                                                            //             //"font-size": "15px",
                                                            //             //"font-weight": "bold",
                                                            //             "background": "linear-gradient(to bottom, #fcfcfc, #d6f7d9)",
                                                            //             //"text-align": "center",
                                                            //             "border-bottom:": "2px solid blue",
                                                            //             // "border-radius": "4px",
                                                            //             // "width": "130px",
                                                            //             // "padding": "5px"
                                                            //         });
                                                            //     },
                                                            //     cssClass: "verylight-green", //linear-gradient(to bottom, #fcfcfc, #d6f7d9)
                                                            //     colSpan: 1
                                                            // },
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
                                                                    readOnly: true,
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
                                                                    displayFormat: "dd/MM/yyyy", width: 150, showClearButton: true,
                                                                    readOnly: true,

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
                                                                    format: "#,##0.00", width: 150,
                                                                    elementAttr: { class: "right-align-number" },
                                                                    readOnly: true,
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
                                                        title: "AGENT INFO", // for SELF BOOKING
                                                        icon: "fas fa-user-circle",
                                                        iconPosition: "start",
                                                        /*Travel Agent EROCode06,InvoicNo	ERORefNo5,InvoiceDate	ERODate04
                                                        InvoiceAmt	EROAmount6,InvoiceNote	ERORefNo6,Travel Agent Name	ERORefNo4*/
                                                        visible: iData.EROCheck03,
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
                                                                dataField: "ERODate04",
                                                                label: { text: "Invoice Date" },
                                                                editorType: "dxDateBox",
                                                                dataType: "date",
                                                                format: "dd/MM/yyyy",
                                                                width: 120,
                                                                editorOptions: {
                                                                    width: 120,
                                                                    showClearButton: true,
                                                                    useMaskBehavior: true,
                                                                    pickerType: "calendar",
                                                                    displayFormat: "dd/MM/yyyy",
                                                                    hint: "Select the Invoice Date",
                                                                    //value: new Date(), // Default to blank initially
                                                                    onOpened: function (e) {
                                                                        if (!e.component.option("value")) {
                                                                            e.component.option("value", new Date()); // Set today’s date if empty
                                                                        }
                                                                    }
                                                                },
                                                                visible: true,
                                                                colSpan: 1
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
                                        // onInitialized: function (e) {
                                        //     // Trigger validation immediately using the defined validation group
                                        //     //const validationResult = DevExpress.validationEngine.validateGroup("formValidationGroup");

                                        //     //if (!validationResult.isValid) {
                                        //     //    console.log("Form is invalid upon initialization.");
                                        //     // }
                                        // }

                                    }).dxForm("instance");

                                    const aAddStaff = $("#Add-dxDataGridx").dxDataGrid({

                                        dataSource: new DevExpress.data.CustomStore({
                                            key: aaKeyField, //"REFNO",
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

                                                var ObjKeyData = { [aaKeyField]: $.trim(key) };   //[aaKeyField] key.trim
                                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                                sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                // Refresh the DataGrid after the update is successful
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                            },
                                            remove: function (key) {
                                                var ObjKeyData = { [aaKeyField]: $.trim(key) };   //[aaKeyField] key.trim
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
                                            //e.data.EROCheck03 = true
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
                                            allowUpdating: aViewG,
                                            //allowUpdating: true,
                                            allowDeleting: aViewG, //arDataD,
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
                                                width: 40
                                            },
                                            {
                                                dataField: "Vendor02",
                                                caption: "Full name (as show in passport)*",
                                                editorType: "dxTextBox",
                                                width: 180,
                                                height: 80,
                                                editorOptions: { width: 180, height: 80, },
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
                                                        height: 80,
                                                        editorOptions: { width: 180, readOnly: true }, // readOnly: !aRoamL
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
                                                        editorOptions: { format: "#,##0.00", width: 120, readOnly: true },
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
                                                    // summaryType: "max",
                                                    // valueFormat: "currency",
                                                    // showInGroupFooter: false,
                                                    // alignByColumn: true            
                                                    displayFormat: "{0} Items",
                                                },
                                                {
                                                    column: "RefundedAmount",
                                                    summaryType: "sum",
                                                    // summaryType: "max",
                                                    valueFormat: "#,##0.00", //"currency",
                                                    // showInGroupFooter: false,
                                                    // alignByColumn: true            
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
                                                            $(`#${aForm2Add}`).dxDataGrid("instance").refresh();
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

                                    const formPRE = $("#Add-formPRE").dxForm({
                                        formData: iData, //aXXData[0], //iData, 
                                        onContentReady: function (e) {
                                            const data = e.component.option("formData");
                                            if (data.ERODesc01 && data.ERODesc01.trim() !== "") {
                                                formViewerUrl(data.ERODesc01);
                                            }
                                        },
                                        showColonAfterLabel: false,
                                        labelLocation: "top",//"left", //"top",
                                        readOnly: true, //aViewF, //true e.row.data.Confirmed
                                        items: [
                                            {
                                                itemType: "group",
                                                colCount: 7,
                                                items: [
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
                                                    // {
                                                    //     dataField: "PBatchNo",
                                                    //     label: { text: "Corporate Card", cssClass: "custom-label" },
                                                    //     editorType: "dxSelectBox",
                                                    //     editorOptions: {
                                                    //         width: 180,
                                                    //         readOnly: true,
                                                    //     },
                                                    //     cssClass: "verylight-blue",
                                                    //     colSpan: 1,
                                                    //     visible: false,
                                                    // },
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
                                                        width: 300,
                                                        editorOptions: { Width: 300, readOnly: true },
                                                        cssClass: "verylight-blue",
                                                        colSpan: 1,
                                                    },
                                                    {
                                                        itemType: "Empty",
                                                        colSpan: 3,
                                                    },
                                                    {
                                                        dataField: "ERODate02",
                                                        label: { text: "Period" },
                                                        editorType: "dxDateBox",
                                                        editorOptions: {
                                                            displayFormat: "dd/MM/yyyy",
                                                            width: 150,
                                                            readOnly: false,
                                                        },
                                                        cssClass: "verylight-blue",
                                                        //showClearButton: true,
                                                        colSpan: 1,
                                                        //validationRules: [{ type: "required", message: "Period is required" }]
                                                    },

                                                    {
                                                        dataField: "ERORefNo1",
                                                        label: { text: "Client" }, //,cssClass: "bold-label" }, 
                                                        //editorType: "dxSelectBox", //dxSelectBox dxLookup
                                                        width: 350,
                                                        cssClass: "verylight-blue",
                                                        visible: true,
                                                        colSpan: 1,
                                                        //validationRules: [{ type: "required", message: "Client is required" }]
                                                    },
                                                    {
                                                        dataField: "EROAmount1", //"RefundedAmount", //"ERODesc03", //ERORefNo1
                                                        label: { text: "Limit Amount for this Client" },
                                                        dataType: "number",   // use "number" here, not "dxNumberBox"
                                                        format: { type: "fixedPoint", precision: 2 },
                                                        dataType: "dxNumberBox",
                                                        editorOptions: {
                                                            format: "#,##0.00", width: 150, elementAttr: { class: "right-align-number" },
                                                            hint: "Limit Amount can not be zero !!!",
                                                            readOnly: true,
                                                        },
                                                        cssClass: "verylight-blue",
                                                        colSpan: 1,
                                                        validationRules: [{ type: "required" }, {
                                                            type: "range",
                                                            min: 1, //aYearStrS
                                                            max: 9999999, //aYearStrL
                                                            message: "Please ensure that the Limit Amount is entered and is greater than zero.",
                                                        }],
                                                    },
                                                    {
                                                        dataField: "EROAmount2", //"RefundedAmount", //"ERODesc03", //ERORefNo1
                                                        label: { text: "Outstanding" },
                                                        dataType: "number",   // use "number" here, not "dxNumberBox"
                                                        format: { type: "fixedPoint", precision: 2 },
                                                        editorType: "dxNumberBox",
                                                        editorOptions: {
                                                            format: { type: "fixedPoint", precision: 2 }, // → 12,345.67
                                                            width: 150,
                                                            elementAttr: { class: "right-align-number" },
                                                            hint: "Outstanding can not be zero !!!",
                                                        },
                                                        cssClass: "verylight-blue",
                                                        colSpan: 1,
                                                        validationRules: [{ type: "required" }, {
                                                            type: "range",
                                                            min: 1, //aYearStrS
                                                            max: 9999999, //aYearStrL
                                                            message: "Please ensure that the Outstanding is entered and is greater than zero.",
                                                        }],
                                                    },
                                                    {
                                                        dataField: "RefundedAmount", //"ERODesc03", //ERORefNo1
                                                        label: { text: "Advance Amount" },
                                                        dataType: "number",   // use "number" here, not "dxNumberBox"
                                                        format: { type: "fixedPoint", precision: 2 },
                                                        dataType: "dxNumberBox",
                                                        hint: "Advance Amount can not be zero !!!",
                                                        editorOptions: {
                                                            format: "#,##0.00", width: 150, elementAttr: { class: "right-align-number" },
                                                            hint: "Advance Amount can not be zero !!!",
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
                                                            message: "Please ensure that the Advance Amount is entered and is greater than zero.",
                                                        }],
                                                    },
                                                    {
                                                        dataField: "ERODesc03", //ERORefNo1
                                                        label: { text: "Cash Advance Reason" }, //,cssClass: "bold-label" }, Purpose of Trip
                                                        editorType: "dxTextArea",
                                                        editorOptions: {
                                                            width: 300,
                                                            height: 50,
                                                            onValueChanged: function (e) {
                                                                asERODesc03 = e.value;
                                                            }
                                                        },
                                                        cssClass: "verylight-blue",
                                                        visible: true,
                                                        validationRules: [{ type: "required", message: "Reason is required" }],
                                                        colSpan: 2,
                                                    },
                                                    {
                                                        dataField: "ERODesc01", //"EROAmount1", //"RefundedAmount", //"ERODesc03", //ERORefNo1
                                                        label: { text: "URL FILENAME" },
                                                        width: 550,
                                                        editorType: "dxTextBox",
                                                        editorOptions: { width: 550, },
                                                        visible: false,
                                                    },
                                                ]
                                            },
                                            {
                                                itemType: "tabbed",
                                                tabPanelOptions: { deferRendering: false },
                                                visible: false,
                                                tabs: [
                                                    {
                                                        title: "DESCRIPTIONS",
                                                        icon: "fas fa-info-circle",
                                                        iconPosition: "start",
                                                        colCount: 5,
                                                        items: [
                                                            // {
                                                            //     dataField: "ERORefNo1",
                                                            //     label: { text: "Client" }, //,cssClass: "bold-label" }, 
                                                            //     editorType: "dxSelectBox", //dxSelectBox dxLookup
                                                            //     editorOptions: {
                                                            //         dataSource: aObjects.CashAdvanceClient,
                                                            //         searchExpr: "CompanyName",
                                                            //         valueExpr: "ClientCode",
                                                            //         displayExpr: "CompanyName",
                                                            //         searchEnabled: true,
                                                            //         width: 350,
                                                            //         onValueChanged: function (e) {
                                                            //             // store selected client code
                                                            //             asERORefNo1 = e.value;

                                                            //             // find the matching client
                                                            //             const matchedClient = aObjects.CashAdvanceClient.find(
                                                            //                 item => item.ClientCode === e.value
                                                            //             );

                                                            //             // get CashAdvance value
                                                            //             const cashAdvance = matchedClient ? matchedClient.CashAdvance : null;

                                                            //             // update the form field "EROAmount1" in Add-formPRE
                                                            //             const form = $("#Add-formPRE").dxForm("instance");
                                                            //             const formData = form.option("formData");
                                                            //             formData.EROAmount1 = cashAdvance;

                                                            //             // push the updated formData back into the form
                                                            //             form.option("formData", formData);
                                                            //         }
                                                            //     },
                                                            //     cssClass: "verylight-blue",
                                                            //     visible: true,
                                                            //     colSpan: 2,
                                                            //     validationRules: [{ type: "required", message: "Purpose of Trip is required" }]
                                                            // },
                                                            // {
                                                            //     dataField: "EROAmount1",
                                                            //     label: { text: "Limit Amount for this Client" },
                                                            //     dataType: "number",   // use "number" here, not "dxNumberBox"
                                                            //     format: { type: "fixedPoint", precision: 2 },
                                                            //     dataType: "dxNumberBox",
                                                            //     editorOptions: {
                                                            //         format: "#,##0.00", width: 150, elementAttr: { class: "right-align-number" },
                                                            //         hint: "Limit Amount can not be zero !!!",
                                                            //         readOnly: true,
                                                            //     },
                                                            //     cssClass: "verylight-blue",
                                                            //     colSpan: 1,
                                                            //     validationRules: [{ type: "required" }, {
                                                            //         type: "range",
                                                            //         min: 1, //aYearStrS
                                                            //         max: 9999999, //aYearStrL
                                                            //         message: "Please ensure that the Limit Amount is entered and is greater than zero.",
                                                            //     }],
                                                            // },
                                                            // {
                                                            //     dataField: "RefundedAmount",
                                                            //     label: { text: "Advance Amount" },
                                                            //     dataType: "number",   // use "number" here, not "dxNumberBox"
                                                            //     format: { type: "fixedPoint", precision: 2 },
                                                            //     dataType: "dxNumberBox",
                                                            //     hint: "Advance Amount can not be zero !!!",
                                                            //     editorOptions: {
                                                            //         format: "#,##0.00", width: 150, elementAttr: { class: "right-align-number" },
                                                            //         hint: "Advance Amount can not be zero !!!",
                                                            //         onValueChanged: function (e) {
                                                            //             asRefundedAmount = e.value;
                                                            //         }
                                                            //     }, //showSpinButtons: true, readOnly: true,
                                                            //     cssClass: "verylight-blue",
                                                            //     colSpan: 2,
                                                            //     validationRules: [{ type: "required" }, {
                                                            //         type: "range",
                                                            //         min: 1, //aYearStrS
                                                            //         max: 9999999, //aYearStrL
                                                            //         message: "Please ensure that the Advance Amount is entered and is greater than zero.",
                                                            //     }],
                                                            // },
                                                            // {
                                                            //     dataField: "ERODesc03",
                                                            //     label: { text: "Purpose For Advance" }, //,cssClass: "bold-label" }, Purpose of Trip
                                                            //     editorType: "dxTextArea",
                                                            //     editorOptions: {
                                                            //         width: 400,
                                                            //         height: 50,
                                                            //         onValueChanged: function (e) {
                                                            //             asERODesc03 = e.value;
                                                            //         }
                                                            //     },
                                                            //     cssClass: "verylight-blue",
                                                            //     visible: true,
                                                            //     colSpan: 2,
                                                            // },
                                                            {
                                                                dataField: "ERODate02",
                                                                label: { text: "Travel Start Date" },
                                                                editorType: "dxDateBox",
                                                                visible: false,
                                                                editorOptions: {
                                                                    displayFormat: "dd/MM/yyyy",
                                                                    width: 150,
                                                                    onValueChanged: function (e) {
                                                                        var formInstance = $(`#${aForm2Add}`).dxForm("instance");
                                                                        formInstance.updateData("ERODate03", e.value);
                                                                        formInstance.updateData("ERODate05", e.value);
                                                                        asERODate02 = e.value;
                                                                        iData.ERODate05 = e.value;

                                                                        aSaveMemToDB(iData, aaTBKey, aaPFDMI, aaXToX)
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                    },

                                                                },
                                                                showClearButton: true,
                                                                colSpan: 1,
                                                                visible: false,
                                                                validationRules: [{ type: "required", message: "Travel Start Date is required" }]
                                                            },
                                                            {
                                                                dataField: "ERODate03",
                                                                label: { text: "Travel End Date" },
                                                                editorType: "dxDateBox",
                                                                visible: false,
                                                                editorOptions: {
                                                                    displayFormat: "dd/MM/yyyy", width: 150,
                                                                    onValueChanged: function (e) {
                                                                        var formInstance = $(`#${aForm2Add}`).dxForm("instance");
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
                                                                visible: false,
                                                                colSpan: 2,
                                                            },
                                                            {
                                                                dataField: "EROCheck01",
                                                                label: { text: "Overseas" },
                                                                visible: false,
                                                                editorType: "dxCheckBox",
                                                                editorOptions: {
                                                                    onValueChanged: function (e) {
                                                                        asEROCheck01 = e.value;
                                                                        console.log("asEROCheck01 ", asEROCheck01)
                                                                        aAddStaff.columnOption("PSPvDate", "visible", e.value);
                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        if (asEROCheck02 && !e.value) {
                                                                            aMessageAlert("<b><p style=font-size: 20px;>Roaming just for Overseas Only !! ", "Red")
                                                                            var formInstance = $(`#${aForm2Add}`).dxForm("instance");
                                                                            formInstance.updateData("EROCheck02", false);
                                                                            asEROCheck02 = false;
                                                                        }
                                                                        $(`#${aForm2Add}`).dxDataGrid("instance").refresh();
                                                                    }
                                                                }
                                                            },

                                                            {
                                                                dataField: "EROCheck02",
                                                                label: { text: "Need Roaming" },
                                                                editorType: "dxCheckBox",
                                                                editorOptions: {
                                                                    //readOnly: function (e){return (asEROCheck01 === true ? false : true)},
                                                                    onValueChanged: function (e) {
                                                                        if (!asEROCheck01 && e.value) {
                                                                            aMessageAlert("<b><p style=font-size: 20px;>Roaming just for Overseas Only !! ", "Red")
                                                                            var formInstance = $(`#${aForm2Add}`).dxForm("instance");
                                                                            formInstance.updateData("EROCheck02", false);
                                                                            asEROCheck02 = false;

                                                                        } else {

                                                                            asEROCheck02 = e.value;
                                                                            aAddStaff.columnOption("ROAMING INFORMATION", "visible", e.value); //HR Arrange for Roaming
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        }
                                                                    }

                                                                },
                                                                visible: false,
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
                                                        //visible: iData.EROCheck03,
                                                        visible: false,
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
                                                                dataField: "EROAmount1", // already used for Limit Amount
                                                                label: { text: "Ticket Price (per person)" },
                                                                dataType: "dxNumberBox",
                                                                editorOptions: {
                                                                    format: "#,##0.00", width: 150,
                                                                    elementAttr: { class: "right-align-number" }
                                                                },
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
                                                        title: "FLIGHT & HOTEL",
                                                        icon: "fas fa-clock",
                                                        iconPosition: "start",
                                                        colCount: 6,
                                                        //visible: !iData.EROCheck03,
                                                        visible: false,
                                                        items: [
                                                            {
                                                                dataField: "Vendor01",
                                                                label: { text: "Departure Flight" }, //,cssClass: "bold-label" }, 
                                                                editorType: "dxTextArea",
                                                                editorOptions: {
                                                                    width: 400,
                                                                    height: 50,
                                                                    readOnly: true,
                                                                }, //value: asFullName, //asEROCheck03
                                                                cssClass: "verylight-green",
                                                                visible: true,
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
                                                                    readOnly: true,
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
                                                                    readOnly: true,
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
                                                                    readOnly: true,
                                                                },
                                                                cssClass: "verylight-green",
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
                                                                    readOnly: true,
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
                                                        title: "AGENT INFO", // FOR ADMIN BOOKING
                                                        icon: "fas fa-user-circle",
                                                        iconPosition: "start",
                                                        //visible: !iData.EROCheck03,
                                                        visible: false,
                                                        colCount: 8,
                                                        items: [
                                                            {
                                                                dataField: "ERORefNo4", // Updated field name
                                                                label: { text: "Travel Agent" }, // Label for the field
                                                                editorType: "dxTextBox", // Using dxSelectBox
                                                                editorOptions: {
                                                                    width: 250,
                                                                    readOnly: true,
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
                                                                    readOnly: true,
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
                                                                    displayFormat: "dd/MM/yyyy", width: 150, showClearButton: true,
                                                                    readOnly: true,

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
                                                                    format: "#,##0.00", width: 150,
                                                                    elementAttr: { class: "right-align-number" },
                                                                    readOnly: true,
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
                                                        title: "AGENT INFO", // for SELF BOOKING
                                                        icon: "fas fa-user-circle",
                                                        iconPosition: "start",
                                                        /*Travel Agent EROCode06,InvoicNo	ERORefNo5,InvoiceDate	ERODate04
                                                        InvoiceAmt	EROAmount6,InvoiceNote	ERORefNo6,Travel Agent Name	ERORefNo4*/
                                                        //: iData.EROCheck03,
                                                        visible: false,
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
                                                                dataField: "ERODate04",
                                                                label: { text: "Invoice Date" },
                                                                editorType: "dxDateBox",
                                                                dataType: "date",
                                                                format: "dd/MM/yyyy",
                                                                width: 120,
                                                                editorOptions: {
                                                                    width: 120,
                                                                    showClearButton: true,
                                                                    useMaskBehavior: true,
                                                                    pickerType: "calendar",
                                                                    displayFormat: "dd/MM/yyyy",
                                                                    hint: "Select the Invoice Date",
                                                                    //value: new Date(), // Default to blank initially
                                                                    onOpened: function (e) {
                                                                        if (!e.component.option("value")) {
                                                                            e.component.option("value", new Date()); // Set today’s date if empty
                                                                        }
                                                                    }
                                                                },
                                                                visible: true,
                                                                colSpan: 1
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

                                    }).dxForm("instance");

                                    $("#Add-popupexitPRE").dxButton({
                                        hint: "Exit from Pre-Approved",
                                        icon: "fas fa-times",
                                        type: "danger",
                                        text: "EXIT",
                                        visible: true,
                                        onClick: function (e) {
                                            $("#gridContainer").dxDataGrid("instance").refresh();

                                            if (aRecNo === 1) {
                                                let result = DevExpress.ui.dialog.confirm("<center><i class='fas fa-save custom-icon-size'></i>" + " Press 'YES' To SAVE </center>", "SAVE BEFORE EXIT ?"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                result.done(function (dresult) {
                                                    if (dresult) {
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
                                                        let aSQLCommand = "use ExtraOnLine; DELETE FROM TRVREQF WHERE HeadRefNo = '" + aaiHeadRef + "'"
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
                                            asERODesc02 = ""; //Destination	ERODesc02
                                            asERODesc03 = ""; //Purpose of Trip
                                            asERORefNo1 = ""; //Purpose of Trip List
                                            asEROCheck01 = false; //Overseas
                                            asEROCheck02 = false; //Need Roaming    
                                            asEROCheck03 = false; //Self-Booking                                    
                                            asERODate02 = new Date() //Travel Start Date	
                                            asERODate03 = new Date() //Travel End Date	
                                            asRefundedAmount = 0; //Estimated Cost	
                                            asVendor01 = ""; //Departure Flight	
                                            asERODesc04 = ""; //Arrival Flight	
                                            asEROAmount1 = 0; //Ticket Price	EROAmount1
                                            asERODesc05 = ""; //Hotel	ERODesc05
                                            asNote = ""; //Remark	Note
                                            asPBatchNo = "";

                                            popup.hide()
                                        }
                                    });

                                    $("#aConfirmPREx").dxButton({
                                        hint: "Pre-Approved Confirm and send to HOD",
                                        icon: "fas fa-check-circle",
                                        type: "success",
                                        text: "CONFIRM",
                                        visible: aViewG, //true,false
                                        onClick: function (e) {
                                            try {
                                                // Validate the form
                                                const validationResult = formPRE.validate();

                                                if (!validationResult.isValid) {
                                                    console.log("Form is invalid. Please correct the errors.");
                                                    // Continue to row validation even if form is invalid
                                                } else {
                                                    console.log("Form is valid. Proceeding to validate grid rows...");
                                                }
                                                // Validate each row in the data grid
                                                const rows = formPRE.getDataSource().items();
                                                let allValid = true;

                                                rows.forEach(row => {
                                                    try {
                                                        const rowIndex = formPRE.getRowIndexByKey(row.ID); // Ensure 'ID' matches your keyExpr

                                                        if (rowIndex === -1) {
                                                            console.log(`Row with ID ${row.ID} not found in the grid.`);
                                                            allValid = false;
                                                            return;
                                                        }

                                                        const rowValidationResult = formPRE.validateRow(rowIndex);

                                                        if (!rowValidationResult.isValid) {
                                                            allValid = false;
                                                            console.log(`Row ${rowIndex} is invalid. Errors:`, rowValidationResult.brokenRules);
                                                        }
                                                    } catch (rowError) {
                                                        console.log(`Error validating row with ID ${row.ID}:`, rowError);
                                                        allValid = false;
                                                    }
                                                });

                                                if (allValid) {
                                                    console.log("All rows are valid. Proceed with submission.");
                                                    // Add submission logic here
                                                } else {
                                                    console.log("Some rows are invalid. Please correct the errors.");
                                                }
                                            } catch (error) {
                                                console.log("Unexpected error during form validation:", error);
                                                // Continue execution even after error
                                            }


                                            //Why have to update the data ==========================

                                            aaHODApprover = aaaHODApprover // repeat ?

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

                                            let aDivSxx = "Where REFNO = '" + aaiHeadRef + "-001'" //HeadRefNo Check for the first record only
                                            let aFieldSelectedxx = "HeadRefNo,RefundedAmount,EROCheck01,EROAmount1" //ExtraOnLine].[dbo].[EXPREIM_400] TotalReimburse,
                                            let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.TRVREQF " + aDivSxx;

                                            fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                .then(response => response.json())
                                                //
                                                .then(ppData => {
                                                    let aaTotalValue = ppData;
                                                    let aaTotalReim = aaTotalValue[0].RefundedAmount //Cash Advance need Limit Amount

                                                    // use Client Cash Advance Limit for HOD Range 
                                                    const baseAmt = aaTotalValue[0].EROAmount1; // Limit Amount LRange02 Last HOD
                                                    if (aaHODApprover?.[0]) aaHODApprover[0].LRange02 = baseAmt;
                                                    if (aaHODApprover?.[1] && aaHODApprover[1] !== 0) aaHODApprover[1].LRange02 = baseAmt + 0.01;
                                                    // =============================================
                                                    //let aaCheckOverseas = aaTotalValue[0].EROCheck01 ? "TRFO" : "HOD";
                                                    let aaiFoundApp = false;
                                                    let nnLno = 0;
                                                    let nnAdno = 0;
                                                    let aaHODEmail4Chk = "";
                                                    let aaHODName4Chk = "";
                                                    let aaHODRange4Chk = "";

                                                    // check that you (login name) is not a approver (can not approve yourself)
                                                    for (let i = 0; i < aaHODApprover.length; i++) {
                                                        if ($.trim(aaHODApprover[i].ApproverName) === $.trim(asFullName)) {
                                                            nnAdno = i
                                                            aaiFoundApp = true;
                                                            break;
                                                        }
                                                    }
                                                    // ========================================================================
                                                    // check for All Approvers
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
                                                    // =============================================================

                                                    let aaHODAll4Chk = "NAME:[" + aaHODName4Chk + "] MAIL:[" + aaHODEmail4Chk + "] RANG:[" + aaHODRange4Chk + "]";
                                                    alert(aaHODAll4Chk)
                                                    let xxChkEmailxx = aTranTextJson(aaHODAll4Chk, "MAIL:", "RANG:")
                                                    let xxChkNamexx = aTranTextJson(aaHODAll4Chk, "NAME:", "MAIL:")
                                                    let xxChkRangexx = aTranTextJson(aaHODAll4Chk, "RANG:", "")
                                                    let xxChkLenxx = xxChkNamexx.length;

                                                    // send mail to first Approver 
                                                    aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                    aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //

                                                    // Check empty fields
                                                    let aDatabasea = "ExtraOnLine.dbo.TRVREQF";
                                                    let aKeyField = "HeadRefNo" //"HeadRefNo"; "REFNO"
                                                    let aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724" +"-001" 
                                                    let axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";

                                                    let aaCondition = item =>
                                                        (item.ID === 1 && (item.ERODesc01 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROAmount1 === 0 || item.ERODesc03 === ""))

                                                    //("fiellds check")
                                                    let condition = aaCondition
                                                    aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                        .then(atestCehcka => {
                                                            if (atestCehcka === 1) { DevExpress.ui.dialog.alert(aVARs.ALERT01, "INPUT ERROR"); }
                                                            else {

                                                                let getvalues = { aaHODAppName: aaHODAppName, aaHODAppEmail: aaHODAppEmail, xxChkLenxx: xxChkLenxx }
                                                                //console.log("getvalues ", getvalues)
                                                                let aTrfAlert02 = aVARs.ALERT02PRE.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                let result = DevExpress.ui.dialog.confirm(aTrfAlert02, "CONFIRM TO HOD");
                                                                result.done(function (dresult) {//                      
                                                                    if (dresult) {
                                                                        //if (aContinueChk !== true) {
                                                                        let aFREF = aaiHeadRef + "-001"
                                                                        let aERStatus = "Confirmed wait for HOD" //"Register"
                                                                        let aTrueORFalse = '1'
                                                                        let aTrueORFalseB = true
                                                                        let aNowDateT = aaNowText(aNowDte)
                                                                        //let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                        //let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                        let aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus, ReqDate: aNowDte };
                                                                        let aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                        //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704' ERORefNo6
                                                                        let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                        aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();

                                                                        //send Email
                                                                        let aaMailTitle = aaOnInitExpGroupDesc.toUpperCase(); //+ " TRAVEL REQUISITION "
                                                                        let aApproverName = aaHODAppName //+ ", [HOD]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                        let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                        let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                        let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"

                                                                        //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                                                        let aSubject = aaMailTitle
                                                                        let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                        let aAddress2Do = `<a href='${aaPFDMI}/XOL/index.html'>${aaOnInitExpGroupDesc}</a>`;
                                                                        let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName }
                                                                        let aMessage01 = aArrays.ACONFIRMPRE[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                        let aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                        aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                        $("#Add-formPRE").dxForm("instance").refresh();
                                                                        $("#Add-formPRE").dxForm("instance").refresh();
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();

                                                                        //aMessageAlert("Already Confirmed & send mail to Approver " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                        aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                        popup.hide();
                                                                        return;
                                                                    }
                                                                });
                                                                //1
                                                            } //aaLoadData
                                                        }); // then check                                                                 
                                                });


                                        } //onClick
                                    });

                                    $("#aConfirmPRExdd").dxButton({
                                        hint: "Confirm and send to HOD",
                                        icon: "fas fa-check-circle",
                                        type: "success",
                                        text: "CONFIRM",
                                        visible: aViewG, //true,false
                                        onClick: function (e) {
                                            // validation
                                            const validationResult = formPRE.validate();
                                            if (validationResult.isValid) {
                                                console.log("Form is valid. Proceed with submission.");
                                                // Proceed with your submission logic here
                                            } else {
                                                console.log("Form is invalid. Please correct the errors.");
                                                // Optionally, you can show the error messages or highlight invalid fields
                                            }
                                            console.log("validationResult: ", validationResult)
                                            // check dataGrid
                                            // const rows = aAddStaff.getDataSource().items(); // Get all rows in the data grid aAddStaff
                                            // let allValid = true;
                                            // console.log("aAddStaff rows = ", rows)
                                            // rows.forEach(row => {
                                            //     // Make sure that 'id' is the keyExpr you specified in the DataGrid
                                            //     const rowIndex = aAddStaff.getRowIndexByKey(row.ID); // This should now work, as the keyExpr is set

                                            //     // Validate the row using the row index
                                            //     if (rowIndex !== -1) {  // Ensure the row index is valid
                                            //         const rowValidationResult = aAddStaff.validateRow(rowIndex);

                                            //         if (!rowValidationResult.isValid) {
                                            //             allValid = false;
                                            //             console.log(`Row ${rowIndex} is invalid. Errors:`, rowValidationResult.brokenRules);
                                            //             // Optionally, handle the error (highlight invalid row, show message)
                                            //         }
                                            //     } else {
                                            //         console.log(`Row with id ${row.id} not found in the grid.`);
                                            //     }
                                            // });

                                            // if (allValid) {
                                            //     console.log("All rows are valid. Proceed with submission.");
                                            //     // Proceed with your submission logic here
                                            // } else {
                                            //     console.log("Some rows are invalid. Please correct the errors.");
                                            // }
                                            // validation
                                            var aBookingOptions = iData.EROCheck03 ? `SELF BOOKING [REQ->HOD${iData.EROCheck02 ? "->HR" : ""}]` : `ADMIN BOOKING [REQ->HOD->ADMIN${iData.EROCheck02 ? "->HR" : ""}]`
                                            var result = $("#Add-formPRE").dxForm("instance").validate(); //Add-dxDataGrid
                                            if (!result.isValid) { DevExpress.ui.dialog.alert("Required Fields not valid, please check", "VALIDATION ERROR") } else {
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

                                                //*/ check dxDataGrid field
                                                // const dataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");

                                                // // Utility function to get column by key
                                                // function getColumnByField(key) {
                                                //     const columns = dataGrid.option("columns");
                                                //     return columns.find(column => column.dataField === key);
                                                // }

                                                // // Get all rows from the grid
                                                // const rowsData = dataGrid.getVisibleRows().map(row => row.data);

                                                // // Validate each field in every row
                                                // const isValidRows = rowsData.every(row => {
                                                //     return Object.entries(row).every(([key, value]) => {
                                                //         // Get column configuration and caption
                                                //         const column = getColumnByField(key);
                                                //         const caption = column?.caption || key; // Use caption if available, fallback to key

                                                //         //ERODesc02: row[3]?.trim(), //Description
                                                //         //ERODesc03: row[4]?.trim(), //Purpose
                                                //         //var condition = item => item.Amount === 0 || item.ERODesc02 === "" || item.ERODesc03 === "" || item.ERODesc04 === "" || item.ERORefNo3 === "" || item.RefundedAmount === 0 || item.Xrate === 0 || (item.Xrate === 1 && item.Currency !== "THB") || (item.Xrate !== 1 && item.Currency === "THB");
                                                //         //Validation logic with key, value, and caption
                                                //         if (key === "Vendor02" && value === "") {
                                                //             DevExpress.ui.dialog.alert(`Field <b>${caption}</b> cannot be empty.`, "Warning !!"); // (Key: ${key}, Value: ${value})
                                                //             return false;
                                                //         }
                                                //         // if (key === "PsPvDate" && value === "01/01/1901") { //(key === "EROCheck01" && value === true) && 
                                                //         //     DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                //         //     return false;
                                                //         // }
                                                //         if (key === "EROCode03" && value === "") {
                                                //             DevExpress.ui.dialog.alert(`Field <b>${caption}</b> cannot be empty.`, "Warning !!"); // (Key: ${key}, Value: ${value})
                                                //             return false;
                                                //         }
                                                //         // Example: Log key, value, and caption for debugging
                                                //         //console.log(`Key: ${key}, Value: ${value}, Caption: ${caption}`);
                                                //         return true; // Field is valid
                                                //     });
                                                // });

                                                // if (!isValidRows) {
                                                //     return; // Stop further processing if validation fails
                                                // }
                                                // //*/ **
                                                // $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                // $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                let aDivSxx = "Where REFNO = '" + aaiHeadRef + "-001'" //HeadRefNo Check RefundedAmount for the first record only
                                                let aFieldSelectedxx = "HeadRefNo,RefundedAmount,EROCheck01,EROAmoun1" //ExtraOnLine].[dbo].[EXPREIM_400] TotalReimburse,
                                                let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.TRVREQF " + aDivSxx; //alert(aFullBody)  Estimated Amount                                         
                                                //console.log(aFullBodyxx, aaHODApprover);
                                                fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                    .then(response => response.json())
                                                    //
                                                    .then(ppData => {
                                                        var aaTotalValue = ppData;
                                                        var aaTotalReim = aaTotalValue[0].RefundedAmount //TotalReimburse
                                                        // use Client Cash Advance Limit for HOD Range 
                                                        const baseAmt = aaTotalValue[0].EROAmount1; // Limit Amount LRange02 Last HOD
                                                        if (aaHODApprover?.[0]) aaHODApprover[0].LRange02 = baseAmt;
                                                        if (aaHODApprover?.[1] && aaHODApprover[1] !== 0) aaHODApprover[1].LRange02 = baseAmt + 0.01;
                                                        var aaCheckOverseas = aaTotalValue[0].EROCheck01 ? "TRFO" : "HOD";
                                                        //console.log(aaCheckOverseas)
                                                        //alert(aaTotalReim)
                                                        //alert(aaHODApprover.length)
                                                        //check if aaCheckOverseas = "TRFO"
                                                        var aaChkA = aaHODApprover.filter(item => item.ApproverCode === "TRFO")
                                                        if (aaCheckOverseas === 'TRFO') {
                                                            if (aaChkA.length > 0) {
                                                                aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "TRFO");
                                                                // use only "TRFO" if overseas
                                                            }  // if not found TRFO use TRF instead
                                                        } else if (aaCheckOverseas === 'HOD') {
                                                            if (aaChkA.length > 0) {
                                                                aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "HOD");
                                                                // use only "TRF"
                                                            }
                                                        }
                                                        //console.log("aaHODApprover ", aaHODApprover)
                                                        //console.log(aaHODApprover)                                                                
                                                        var aaiFoundApp = false;
                                                        var nnLno = 0;
                                                        var nnAdno = 0;
                                                        var aaHODEmail4Chk = "";
                                                        var aaHODName4Chk = "";
                                                        var aaHODRange4Chk = "";
                                                        for (let i = 0; i < aaHODApprover.length; i++) {
                                                            if ($.trim(aaHODApprover[i].ApproverName) === $.trim(asFullName)) {
                                                                nnAdno = i
                                                                aaiFoundApp = true;
                                                                break;
                                                            }
                                                        }
                                                        //console.log("asFullName ", asFullName)
                                                        //console.log(aaHODApprover[0].ApproverName)
                                                        //console.log(nnAdno)
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
                                                        //console.log(aaHODAll4Chk)
                                                        //console.log(xxChkNamexx, xxChkEmailxx, xxChkRangexx)

                                                        // send mail to first Approver 
                                                        aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                        aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail;

                                                        //console.log("HOD App Email = ", aaHODAppEmail)
                                                        //console.log("Overseas = ", aaCheckOverseas)
                                                        // Check empty fields
                                                        var aDatabasea = "ExtraOnLine.dbo.TRVREQF";
                                                        var aKeyField = "HeadRefNo" //"HeadRefNo"; "REFNO"
                                                        var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724" +"-001" 
                                                        var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";

                                                        // if (aaCheckOverseas === 'TRFO') {
                                                        //     var aaCondition = item =>
                                                        //         (item.ID === 1 && (item.ERODesc02 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROCode03 === "" || item.Vendor02 === "" || (item.PSPvDate && new Date(item.PSPvDate).getTime() === new Date('01/01/1901').getTime())))
                                                        //         ||
                                                        //         (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === "" || (item.PSPvDate && new Date(item.PSPvDate).getTime() === new Date('01/01/1901').getTime())))
                                                        // } else {
                                                        //     var aaCondition = item =>
                                                        //         (item.ID === 1 && (item.ERODesc02 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROCode03 === "" || item.Vendor02 === ""))
                                                        //         ||
                                                        //         (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === ""))
                                                        // }
                                                        let aaCondition = item =>
                                                            (item.ID === 1 && (item.ERODesc01 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROAmount1 === 0 || item.ERODesc03 === ""))

                                                        var condition = aaCondition
                                                        aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                            .then(atestCehcka => {
                                                                //console.log("aTestChehcka = ", atestCehcka); // Logs the actual message
                                                                // { DevExpress.ui.dialog.alert(aTRFnAlert01, "INPUT ERROR"); }
                                                                // if (atestCehcka === 1) { DevExpress.ui.dialog.alert(aVARs.ALERT01, "INPUT ERROR"); }
                                                                // else {
                                                                //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm (" + aaCheckOverseas + ") & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' ></b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ֡��ั��ทึ��" +
                                                                let getvalues = { aaCheckOverseas: aaCheckOverseas, aaHODAppName: aaHODAppName, aaHODAppEmail: aaHODAppEmail, xxChkLenxx: xxChkLenxx, aBookingOptions: aBookingOptions }
                                                                //console.log("getvalues ", getvalues)
                                                                let aTrfAlert02 = aVARs.ALERT02.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                let result = DevExpress.ui.dialog.confirm(aTrfAlert02, "CONFIRM TO HOD");
                                                                //let result = DevExpress.ui.dialog.confirm("<p style='color: darkblue; font-size: 18px;' ><i class='fas fa-info-circle custom-icon-size'></i> " + " Press [YES] to confirm (" + aaCheckOverseas + ") and send email to " + aaHODAppName + " (" + aaHODAppEmail + ") <br></b></p><p style='color: darkgreen; font-size: 14px;'>(" + (xxChkLenxx) + " HOD to approve)</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                                //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' > ��ละ ��รุณาตรว��สอ����าร��ั��ทึ��ราย��าร��ห����ร��ทุ������อ������ทุ����รรทัด** <br><b><u>��ม��เ��������ั����</u> ��ะทำ��ห��ราย��าร��ี��เ��ิ������าย��ม����ด�� </b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                                result.done(function (dresult) {//                                                                                                                                                                                                                    
                                                                    if (dresult) {
                                                                        //if (aContinueChk !== true) {
                                                                        let aFREF = aaiHeadRef + "-001"
                                                                        //alert(aFREF)
                                                                        //console.log(aaiHeadRef)
                                                                        //console.log(aFREF)
                                                                        let aERStatus = "Confirmed wait for HOD" //"Register"
                                                                        let aTrueORFalse = '1'
                                                                        let aTrueORFalseB = true
                                                                        let aNowDateT = aaNowText(aNowDte)
                                                                        //let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                        //let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                        var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus, ReqDate: aNowDte };
                                                                        var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of 
                                                                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                        //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704' ERORefNo6
                                                                        let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                        aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();

                                                                        //send Email
                                                                        var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " TRAVEL REQUISITION ";
                                                                        let aApproverName = aaHODAppName //+ ", [HOD]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                        let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                        let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                        let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"

                                                                        //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                                                        var aSubject = aaMailTitle
                                                                        let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                        let aAddress2Do = `<a href='${aaPFDMI}/XOL/index.html'>${aaOnInitExpGroupDesc}</a>`;
                                                                        let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName, aBookingOptions: aBookingOptions }
                                                                        let aMessage01 = aArrays.ACONFIRM[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                        var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                        aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                        // $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        // $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();

                                                                        //aMessageAlert("Already Confirmed & send mail to Approver " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                        aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                        popup.hide();
                                                                    }
                                                                });
                                                                //1
                                                                //} //aaLoadData
                                                            }); // then check                                                                 
                                                    });
                                            }
                                        } // validationrule
                                    });


                                    function dropDownBoxAGT(cellElement, cellInfo) {
                                        return $("<div>").dxDropDownBox({
                                            dropDownOptions: { width: 600 },
                                            dataSource: aaSubGroup01,
                                            value: [cellInfo.value],
                                            valueExpr: "AgentID",
                                            displayExpr: "AgentID",
                                            contentTemplate: function (e) {
                                                return $("<div>").dxDataGrid({
                                                    dataSource: aaSubGroup01, //"AgentID, CompanyIDNO, AgentName, ContactPerson, Email, Phone, Address, Country, RegistrationNo, LicenseExpiryDate, Website, Status, EntryDate, EntryBy"
                                                    //remoteOperations: true, // IDNO,BenefitLevel,FamilyReimbursement,AllowSSO,OPDLimitperrequest,OPDLimitperyear,MaternityLimitperyear,IPDLimitpercase,FleetLimit,PositionGroup,NOTE,EntryBy,EntryDate
                                                    columns: [{ dataField: "AgentID", caption: "Agent Code", width: 200, sortOrder: "asc" }, { dataField: "AgentName", caption: "Agent Name", width: 380 },],
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
                                                        e.component.option("value", sArgs.selectedRowKeys[0].AgentID); // Works but Error Need to correct next time !!!
                                                        cellInfo.setValue(sArgs.selectedRowKeys[0].AgentID);
                                                        if (sArgs.selectedRowKeys.length > 0) {
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

                                    //var accordion;
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

                                    $("#expandButton").on("click", function () {
                                        accordion.expandItem(0); // Expand the first item
                                        accordion.expandItem(1); // Expand the second item
                                    });

                                    $("#collapseButton").on("click", function () {
                                        accordion.collapseItem(0); // Collapse the first item
                                        accordion.collapseItem(1); // Collapse the second item
                                    });

                                });
                            }
                            // popup form

                            // function for TRF HOD Approve INTERNAL only
                            const aaHODApproveSS = (iData) => {
                                console.log(iData.Vendor01Note, iData.ERORefNo6, iData.ExpGroupCode)
                                console.log(asFullName)
                                //alert(iData.Vendor01Note)
                                //alert(`SELF BOOKING = ${iData.EROCheck03} ROAMING = ${iData.EROCheck02}`)
                                var aERStatusCH = "HOD Approved wait for ADMIN" //ADMIN BOOKING

                                if ((iData.EROCheck03 && !iData.EROCheck02) || CHK_PRE_V) { // SELF BOOKING no Roaming
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


                            // Make the function async so we can use await inside
                            const aHODApproveSS = async (iData) => {
                                try {
                                    console.log(iData.Vendor01Note, iData.ERORefNo6, iData.ExpGroupCode);
                                    console.log(asFullName);
                                    let aERStatusCH = "HOD Approved (finished)";
                                    // let aERStatusCH = "HOD Approved wait for ADMIN";
                                    // if ((iData.EROCheck03 && !iData.EROCheck02) || CHK_PRE_V) {
                                    //     aERStatusCH = "HOD Approved (finished)";
                                    // } else if (iData.EROCheck03 && iData.EROCheck02) {
                                    //     aERStatusCH = "HOD Approved wait for HR";
                                    // }
                                    console.log(`aERStatusCH =${aERStatusCH}`);

                                    let aRequesterName = iData.PayToName;
                                    let aRequesterEmail = iData.ERODesc06;
                                    let aaHODAll4Chk = iData.Vendor01Note;
                                    let aApprovalDateFN = "HODApprovedDate";
                                    let aNowDateT = aNowText();
                                    let jHOD = parseVendorNote(iData.Vendor01Note)
                                    let nofHOD = jHOD.length;
                                    let aTrueORFalse = "1"
                                    let aTrueORFalseB = true
                                    const todayText = new Date().toLocaleDateString("en-GB");
                                    let xxNextAppEmailxx;
                                    let xxNextApproverxx;
                                    let aERStatus = "";
                                    //alert(JSON.stringify(jHOD, null, 2));

                                    if (aaHODAll4Chk === "") {//&& iData.ExpGroupCode !== "200"
                                        DevExpress.ui.dialog.alert("This record is not valid, no approval group", "ERROR");
                                        return;
                                    }

                                    if (iData.ExpGroupCode === "900") {
                                        const aHODorder = jHOD.findIndex(p => p.name === asFullName); // 1 first 
                                        const xxNofChk = nofHOD; // number to HOD
                                        const bLastHOD = (aHODorder + 1) === nofHOD;
                                        const aBarInside = xxNofChk === 1 ? "|0|" : xxNofChk === 2 ? "|0|,|1|" : "|0|,|1|,|2|";
                                        const aPPDText = " APPD:[" + aBarInside + "]";
                                        //alert(aPPDText)
                                        //var idVendor01Note = aaHODAll4Chk + aPPDText; //NAME:[|วารุณี บันลือรัตน์|,|จงจิตต์ เดชอุดมวิทยา|,|สุรดี มลายอริศูนย์|] MAIL:[|wikran@hotmail.com|,|wikran@hotmail.com|,|wikran@hotmail.com|] RANG:[15000,30000,9999999]
                                        let bHaveAPPD = aaHODAll4Chk.includes("APPD:[")
                                        var idVendor01Note = bHaveAPPD //aaHODAll4Chk.includes("APPD:[")
                                            ? aaHODAll4Chk
                                            : aaHODAll4Chk + aPPDText;
                                        //let aTrueORFalseB3 = iData.EROCheck03 ? true : false
                                        //alert(`before replace ${idVendor01Note}`)
                                        if (xxNofChk === 1 || bLastHOD) { // finish
                                            aApprovalDateFN = "HODApprovedDate"
                                            //replaceOrderWithDate(text, order, datetext)
                                            //if (bHaveAPPD) {
                                            idVendor01Note = replacePipeOrderWithDate(idVendor01Note, aHODorder, todayText); //.replace(String(aHODorder), todayText); // Vendor01Note
                                            //} else {
                                            //    idVendor01Note = aaHODAll4Chk + aPPDText.replace(String(aHODorder), todayText); // Vendor01Note
                                            //}
                                            aaCnfTitle = "APPROVE ?" //
                                            aaCnfBody = "Press 'YES' to Approve and Send Mail to " + aRequesterName + " Email " + aRequesterEmail
                                            aTrueORFalse = "1"
                                            aTrueORFalseB = true
                                            aERStatus = aERStatusCH
                                            xxNextApproverxx = jHOD[aHODorder].name //xxChkNamexx[aHODorder + 1]
                                            xxNextAppEmailxx = jHOD[aHODorder].mail //xxChkEmailxx[aHODorder + 1]
                                            //alert("last HOD Approved")
                                            //alert("aHODorder")
                                            //alert(replacePipeOrderWithDate(aPPDText, aHODorder, todayText))
                                            //alert(aERStatus)
                                            //alert("idVendor01Note = ")
                                            //alert(`after replace ${idVendor01Note}`)
                                            //alert(`after replace ${idVendor01Note}`)
                                        } else { // not finish if(xxNofChk > 1)
                                            //if (!bLastHOD) {
                                            aApprovalDateFN = "ERODate04"
                                            //idVendor01Note = aaHODAll4Chk + aPPDText.replace(String(aHODorder), todayText); // Vendor01Note
                                            idVendor01Note = replacePipeOrderWithDate(idVendor01Note, aHODorder, todayText);
                                            xxNextApproverxx = jHOD[aHODorder + 1].name //xxChkNamexx[aHODorder + 1]
                                            xxNextAppEmailxx = jHOD[aHODorder + 1].mail //xxChkEmailxx[aHODorder + 1]
                                            aaCnfTitle = "APPROVE ?" //"VERIFY ?"
                                            aaCnfBody = "Press 'YES' to Approve and Send Mail to " + xxNextApproverxx + " [Email " + xxNextAppEmailxx + "]"
                                            aTrueORFalse = "0"
                                            aTrueORFalseB = false
                                            aERStatus = "Confirmed wait for HOD"
                                            //alert("not last")
                                            //alert(aERStatus)
                                            //alert(idVendor01Note)
                                            //}
                                        }
                                    }
                                    //  else {
                                    //     let xxChkEmailxx = aTranTextJson(aaHODAll4Chk, "MAIL:", "RANG:")
                                    //     let xxNofChk = nofHOD; //xxChkEmailxx.length
                                    //     let xxChkNamexx = aTranTextJson(aaHODAll4Chk, "NAME:", "MAIL:")
                                    //     let aTrueORFalse = "0"
                                    //     let aTrueORFalseB = false
                                    //     let aTrueORFalse3 = iData.EROCheck03 ? "1" : "0"
                                    //     let aTrueORFalseB3 = iData.EROCheck03 ? true : false
                                    //     let xxNextAppEmailxx
                                    //     let xxNextApproverxx
                                    //     let aERStatus = ""

                                    //     let anLno
                                    //     for (let i = 0; i < xxChkNamexx.length; i++) {
                                    //         if (asFullName === xxChkNamexx[i]) {
                                    //             anLno = i
                                    //             break
                                    //         }
                                    //     }
                                    //     alert(`${anLno} = ${nofHOD} ${asFullName},${xxChkNamexx[0]}`)
                                    //     let aaCnfTitle = "ERROR !!"
                                    //     let aaCnfBody = "ERROR - Approval Process, this is not your approval record please contact administrator <br> Approver should be " + xxChkNamexx[0]

                                    //     if (anLno === 0) {
                                    //         aApprovalDateFN = "HODApprovedDate"
                                    //         if (xxNofChk === 1) {
                                    //             aaCnfTitle = "APPROVE ?"
                                    //             aaCnfBody = "Press [YES] to Approve and Send Mail to "
                                    //             if (iData.EROCheck03 && !iData.EROCheck02) {
                                    //                 aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send INFO eMail to FA Dept. ${aaFXAppName} [${aaFXAppEmail}]<br> UPDATED STATUS = ${aERStatusCH}<br>[SELF BOOKING]`
                                    //             } else if (iData.EROCheck03 && iData.EROCheck02) {
                                    //                 aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to HR Dept. ${aaHRAppName} [${aaHRAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [SELF BOOKING]`
                                    //             }
                                    //             if (!iData.EROCheck03) {
                                    //                 aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to ADMIN Dept. ${aaADAppName} [${aaADAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [ADMIN BOOKING]`
                                    //             }
                                    //             aTrueORFalse = "1"
                                    //             aTrueORFalseB = true
                                    //             aERStatus = aERStatusCH
                                    //         } else {
                                    //             xxNextApproverxx = xxChkNamexx[anLno + 1]
                                    //             xxNextAppEmailxx = xxChkEmailxx[anLno + 1]
                                    //             aaCnfTitle = "VERIFY ?"
                                    //             aaCnfBody = "Press 'YES' to Verify and Send Mail to " + xxNextApproverxx + " [Email " + xxNextAppEmailxx + "]"
                                    //             aTrueORFalse = "0"
                                    //             aTrueORFalseB = false
                                    //             aERStatus = "Confirmed wait for HOD"
                                    //         }
                                    //     } else if (anLno === 1) {
                                    //         aApprovalDateFN = "ERODate04"
                                    //         if (xxNofChk === 2) {
                                    //             aaCnfTitle = "APPROVE ?"
                                    //             aaCnfBody = "Press [YES] to Approve and Send Mail to "
                                    //             if (iData.EROCheck03 && !iData.EROCheck02) {
                                    //                 aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send INFO eMail to FA Dept. ${aaFXAppName} [${aaFXAppEmail}]<br> UPDATED STATUS = ${aERStatusCH}<br>[SELF BOOKING]`
                                    //             } else if (iData.EROCheck03 && iData.EROCheck02) {
                                    //                 aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to HR Dept. ${aaHRAppName} [${aaHRAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [SELF BOOKING]`
                                    //             }
                                    //             if (!iData.EROCheck03) {
                                    //                 aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to ADMIN Dept. ${aaADAppName} [${aaADAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [ADMIN BOOKING]`
                                    //             }
                                    //             aTrueORFalse = "1"
                                    //             aTrueORFalseB = true
                                    //             aERStatus = aERStatusCH
                                    //         } else {
                                    //             xxNextApproverxx = xxChkNamexx[anLno + 1]
                                    //             xxNextAppEmailxx = xxChkEmailxx[anLno + 1]
                                    //             aaCnfTitle = "VERIFY ?"
                                    //             aaCnfBody = "Press 'YES' to Verify and Send Mail to " + xxNextApproverxx + " [Email " + xxNextAppEmailxx + "]"
                                    //             aTrueORFalse = "0"
                                    //             aTrueORFalseB = false
                                    //             aERStatus = "Confirmed wait for HOD"
                                    //         }
                                    //     } else if (anLno === 2) {
                                    //         aApprovalDateFN = "PBatchDate"
                                    //         aaCnfTitle = "APPROVE ?"
                                    //         aaCnfBody = "Press [YES] to Approve and Send Mail to "
                                    //         if (iData.EROCheck03 && !iData.EROCheck02) {
                                    //             aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send INFO eMail to FA Dept. ${aaFXAppName} [${aaFXAppEmail}]<br> UPDATED STATUS = ${aERStatusCH}<br>[SELF BOOKING]`
                                    //         } else if (iData.EROCheck03 && iData.EROCheck02) {
                                    //             aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to HR Dept. ${aaHRAppName} [${aaHRAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [SELF BOOKING]`
                                    //         }
                                    //         if (!iData.EROCheck03) {
                                    //             aaCnfBody += `${aRequesterName} Email [${aRequesterEmail}]<br> and Send Mail to ADMIN Dept. ${aaADAppName} [${aaADAppEmail}]<br>UPDATED STATUS = ${aERStatusCH}<br> [ADMIN BOOKING]`
                                    //         }
                                    //         aTrueORFalse = "1"
                                    //         aTrueORFalseB = true
                                    //         aERStatus = aERStatusCH
                                    //     }
                                    // }

                                    if (aaCnfTitle === "ERROR !!") {
                                        DevExpress.ui.dialog.alert(aaCnfBody, aaCnfTitle);
                                    } else {
                                        let result = DevExpress.ui.dialog.confirm(aaCnfBody, aaCnfTitle);
                                        result.done(async (dresult) => {   // 👈 async callback
                                            if (dresult) {
                                                let aGDescENG = iData.ExpGroupDescEng;
                                                let aObjKeyData;
                                                if (aApprovalDateFN === "HODApprovedDate") {
                                                    aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, HODApprovedDate: new Date(), Vendor01Note: idVendor01Note };
                                                }
                                                if (aApprovalDateFN === "ERODate04") {
                                                    aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, ERODate04: new Date(), Vendor01Note: idVendor01Note };
                                                }
                                                if (aApprovalDateFN === "PBatchDate") {
                                                    aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, PBatchDate: new Date(), Vendor01Note: idVendor01Note }; //Approved: aTrueORFalseB3, 
                                                }
                                                let aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                try {
                                                    if (true) { // save data
                                                        // 👇 Await sendRequestNew once
                                                        const updateResult = await sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                        console.log("Update result:", updateResult);
                                                        // Build SQL command
                                                        let aSQLCommand;
                                                        if (aTrueORFalse === "1") { // finished
                                                            aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM SET HODApproved = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "', Vendor01Note = '" + idVendor01Note + "', " + aApprovalDateFN + " = '" + aNowDateT + "' Where HeadRefNo = '" + iData.HeadRefNo + "'"; // Approved = " + aTrueORFalse3 + ",
                                                        } else {
                                                            aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM SET HODApproved = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "', Vendor01Note = '" + idVendor01Note + "', " + aApprovalDateFN + " = '" + aNowDateT + "', Vendor02Note = '" + xxNextApproverxx + "', ERORefNo6 = '" + xxNextAppEmailxx + "' Where HeadRefNo = '" + iData.HeadRefNo + "'";
                                                        }
                                                        console.log("SQL:", aSQLCommand);

                                                        // 👇 Await aSQLAction once
                                                        const sqlResult = await dbSQLAction(aaPFDMI, aSQLCommand);
                                                        console.log("SQL result:", sqlResult);

                                                        // Refresh grid after DB updates
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                    }
                                                    //let uiData = $.extend({}, iData, aObjKeyData);
                                                    // แสดงทั้ง object iData เป็น JSON
                                                    //alert(JSON.stringify(uiData, null, 2));
                                                    //alert("befor end")
                                                    //alert(uiData.Vendor01Note);
                                                    //let jnHOD = parseVendorNote(uiData.Vendor01Note)
                                                    //let nofnHOD = jnHOD.length;
                                                    //alert(nofnHOD)
                                                    //alert(JSON.stringify(jnHOD, null, 2));
                                                    //alert(iData.ERORefNo1)
                                                    let ToNames = AddTitle(iData.Vendor01Note, aVARs.THTITLE)
                                                    //alert(ToNames)
                                                    let jnHOD = parseVendorNote(idVendor01Note)
                                                    let nofnHOD = jnHOD.length;
                                                    //alert("new json")
                                                    //alert(JSON.stringify(jnHOD, null, 2));
                                                    //alert(nofnHOD)
                                                    //alert(JSON.stringify(jnHOD, null, 2));
                                                    //update Excel
                                                    //alert(JSON.stringify(iData, null, 2));
                                                    //alert("updte excel customer = " + iData.ERORefNo1)
                                                    ULbCustomerGrp(iData, jnHOD, ToNames)
                                                    //aMessageAlert("Already Updated EXCEL for " + iData.ERORefNo1, "DarkGreen");
                                                    //return alert("DONE")
                                                    // --- Mail sending logic (Requester always, ADMIN/HR/FA optional) ---
                                                    if (true) {
                                                        let aSubject = aGDescENG.toUpperCase() + " - HOD APPROVED";
                                                        let aMessage = "<!DOCTYPE html><html><body>TO " + aRequesterName + "<br><br>Already Approved " + aGDescENG + " Refno " + iData.HeadRefNo + "</body></html>";

                                                        if (aTrueORFalse === "1") { // finished send mail to requester
                                                            aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aaHODAppEmail, "", "", aSubject, aMessage);
                                                            aMessageAlert("Already Approved and send EMAIL TO Requester <br>" + aMessage, "DarkGreen");
                                                            // if (false) {// --- MAIL TO ADMIN ---
                                                            //     if (!iData.EROCheck03) {
                                                            //         aSendMailDMZ(" " + aaADAppName, aaADAppEmail, aRequesterEmail, "", "", aSubject, aMessage);
                                                            //     }

                                                            //     // --- MAIL TO HR ---
                                                            //     if (iData.EROCheck03 && iData.EROCheck02) {
                                                            //         aSendMailDMZ(" " + aaHRAppName, aaHRAppEmail, aRequesterEmail, "", "", aSubject, aMessage);
                                                            //     }

                                                            //     // --- MAIL TO FA ---
                                                            //     if (iData.EROCheck03 && !iData.EROCheck02) {
                                                            //         aSendMailDMZ(" " + aaFXAppName, aaFXAppEmail, aRequesterEmail, "", "", aSubject, aMessage);
                                                            //     }
                                                            // }
                                                        } else { // first or second Approver send mail to next Approver
                                                            aSendMailDMZ(" " + xxNextApproverxx, xxNextAppEmailxx, aaHODAppEmail, "", "", aSubject, aMessage);
                                                            aMessageAlert("Already Approved and Send Mail to Khun" + xxNextApproverxx + " (" + xxNextAppEmailxx + ")", "DarkGreen");
                                                        }

                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                    }


                                                } catch (err) {
                                                    console.error("Error in approval flow:", err);
                                                    alert(`Error ${err}`)
                                                }
                                            }
                                        });
                                    }
                                } catch (err) {
                                    console.error("Error in approval flow:", err);
                                    alert(`Error ${err}`)
                                }
                            }

                            const anHODApproveSS = async (iData) => {
                                console.log(iData.Vendor01Note, iData.ERORefNo6, iData.ExpGroupCode);
                                console.log(asFullName);

                                let aERStatusCH = "HOD Approved wait for ADMIN";
                                if ((iData.EROCheck03 && !iData.EROCheck02) || CHK_PRE_V) {
                                    aERStatusCH = "HOD Approved (finished)";
                                } else if (iData.EROCheck03 && iData.EROCheck02) {
                                    aERStatusCH = "HOD Approved wait for HR";
                                }

                                let aRequesterName = iData.PayToName;
                                let aRequesterEmail = iData.ERODesc06;
                                let aaHODAll4Chk = iData.Vendor01Note;
                                let aApprovalDateFN = "HODApprovedDate";
                                let aNowDateT = aNowText();

                                if (aaHODAll4Chk === "" && iData.ExpGroupCode !== "900") {
                                    DevExpress.ui.dialog.alert("This record is not valid, no approval group", "ERROR");
                                    //return;
                                }

                                if (aaCnfTitle === "ERROR !!") {
                                    DevExpress.ui.dialog.alert(aaCnfBody, aaCnfTitle);
                                } else {
                                    let result = DevExpress.ui.dialog.confirm(aaCnfBody, aaCnfTitle);
                                    result.done(async (dresult) => {
                                        if (dresult) {
                                            let aObjKeyData;
                                            if (aApprovalDateFN === "HODApprovedDate") {
                                                aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, Approved: aTrueORFalseB3, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, HODApprovedDate: new Date() };
                                            }
                                            if (aApprovalDateFN === "ERODate04") {
                                                aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, Approved: aTrueORFalseB3, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, ERODate04: new Date() };
                                            }
                                            if (aApprovalDateFN === "PBatchDate") {
                                                aObjKeyData = { REFNO: iData.REFNO, HODApproved: aTrueORFalseB, Approved: aTrueORFalseB3, ERStatus: aERStatus, Vendor02Note: xxNextApproverxx, PBatchDate: new Date() };
                                            }

                                            let aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));

                                            // Build SQL command
                                            let aSQLCommand;
                                            if (aTrueORFalse === "1") {
                                                aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM SET HODApproved = " + aTrueORFalse + ", Approved = " + aTrueORFalse3 + ", ERStatus = '" + aERStatus + "', " + aApprovalDateFN + " = '" + aNowDateT + "' Where HeadRefNo = '" + iData.HeadRefNo + "'";
                                            } else {
                                                aSQLCommand = "use ExtraOnLine; UPDATE EXPREIM SET HODApproved = " + aTrueORFalse + ", Approved = " + aTrueORFalse3 + ", ERStatus = '" + aERStatus + "', " + aApprovalDateFN + " = '" + aNowDateT + "', Vendor02Note = '" + xxNextApproverxx + "', ERORefNo6 = '" + xxNextAppEmailxx + "' Where HeadRefNo = '" + iData.HeadRefNo + "'";
                                            }

                                            try {
                                                // 🚀 Run sendRequestNew and aSQLAction in parallel
                                                const [updateResult, sqlResult] = await Promise.all([
                                                    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX)),
                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                ]);
                                                console.log("Update result:", updateResult);
                                                console.log("SQL result:", sqlResult);

                                                // Refresh grid after both succeed
                                                $("#gridContainer").dxDataGrid("instance").refresh();

                                                // --- Mail sending logic ---
                                                let aSubject = aGDescENG.toUpperCase() + " - HOD APPROVED";
                                                let aMessage = "<!DOCTYPE html><html><body>TO " + aRequesterName + "<br><br>Already Approved " + aGDescENG + " Refno " + iData.HeadRefNo + "</body></html>";

                                                if (aTrueORFalse === "1") {
                                                    aSendMailDMZ(" " + aRequesterName, aRequesterEmail, aaHODAppEmail, "", "", aSubject, aMessage);
                                                    aMessageAlert("Already Approved and send EMAIL TO Requester <br>" + aMessage, "DarkGreen");

                                                    // Not send mail to ADMIN, HR, FA for Pre-Approve
                                                    if (false) {
                                                        // --- MAIL TO ADMIN ---
                                                        if (!iData.EROCheck03) {
                                                            aSendMailDMZ(" " + aaADAppName, aaADAppEmail, aRequesterEmail, "", "", aSubject, aMessage);
                                                        }

                                                        // --- MAIL TO HR ---
                                                        if (iData.EROCheck03 && iData.EROCheck02) {
                                                            aSendMailDMZ(" " + aaHRAppName, aaHRAppEmail, aRequesterEmail, "", "", aSubject, aMessage);
                                                        }

                                                        // --- MAIL TO FA ---
                                                        if (iData.EROCheck03 && !iData.EROCheck02) {
                                                            aSendMailDMZ(" " + aaFXAppName, aaFXAppEmail, aRequesterEmail, "", "", aSubject, aMessage);
                                                        }
                                                    }

                                                } else {
                                                    // send mail to other HOD
                                                    aSendMailDMZ(" " + xxNextApproverxx, xxNextAppEmailxx, aaHODAppEmail, "", "", aSubject, aMessage);
                                                    aMessageAlert("Already Verified and Send Mail to " + xxNextApproverxx + " (" + xxNextAppEmailxx + ")", "DarkGreen");
                                                }

                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                            } catch (err) {
                                                console.error("Error in approval flow:", err);
                                            }
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
