// Travel Requisition Input Form MXXXEETRF//
// Pre Approved (based for PS)

$(document).ready(function () {
    // var aDXTheme = localStorage["aDXTheme"]
    // DevExpress.ui.themes.current(aDXTheme);
    let aDXTheme = localStorage.getItem("aDXTheme");
    if (!aDXTheme) {
        aDXTheme = "material.blue.light.compact";
    }
    DevExpress.ui.themes.current(aDXTheme);
});
// document.addEventListener("DOMContentLoaded", () => {
//     let aDXTheme = localStorage.getItem("aDXTheme");
//     if (!aDXTheme) {
//         aDXTheme = "material.blue.light.compact";
//     }
//     DevExpress.ui.themes.current(aDXTheme);
// });

const { PDFDocument } = PDFLib;
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();

// Runtime environment
const hostName = window.location.href;
const aaCheckON = hostName.includes("localhost")

// Local storage values (mutable if you plan to update them later)
let aaXToX = localStorage.getItem("aaXXoX"); //localStorage["aaXXoX"];
let aaXNoX = localStorage.getItem("aaXXuX"); //localStorage["aaXXuX"];
let aaPXXI = localStorage.getItem("aPXIXD"); //localStorage["aPXIXD"];
let aaMXXT = localStorage.getItem("aDXMenuTitle"); //localStorage["aDXMenuTitle"]; // 
let asStaffID = localStorage.getItem("asSTFID"); //localStorage["asSTFID"];

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
//"Where ApproverCode = 'TRFO' OR (ApproverCode = '" + APV_TYPE + "' AND ApproveToDivision = '" + aDivisionC + "') Order By LRange02"
//const aaDIS = `Where ApproverCode = 'TRFO'OR (ApproverCode = '${APV_TYPE}' AND ApproveToDivision = '${aDivisionC}') Order By LRange02`;

// const aTranTextJson = (aText, aFMark, aLMark) => { // very Important** 
//     var axHODFtext = aText;
//     var xaChkName;
//     var aatestChk = axHODFtext.replaceAll("|", '"')
//     var xxChk1 = aatestChk.search(aFMark);
//     var xxChk2 = aatestChk.search(aLMark);
//     xxChk1 = aatestChk.search(aFMark)
//     xxChk2 = aatestChk.search(aLMark)
//     if (aLMark === "") {
//         xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, 300)); //xxChk1+5, xxChk2-5);
//     } else {
//         xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, xxChk2 - xxChk1 - 5)); //xxChk1+5, xxChk2-5);
//     }
//     const xxNameArr = JSON.parse(xaChkName);
//     return xxNameArr;
// }

// const aTranTextJson = (aText, aFMark, aLMark = "") => {
//     // Replace all | with "
//     const normalized = aText.replaceAll("|", '"');

//     // Find markers
//     const startIdx = normalized.indexOf(aFMark);
//     const endIdx = aLMark ? normalized.indexOf(aLMark, startIdx + aFMark.length) : -1;

//     if (startIdx === -1) {
//         throw new Error(`Start marker "${aFMark}" not found`);
//     }

//     // Extract substring safely
//     const raw = aLMark && endIdx !== -1
//         ? normalized.slice(startIdx + aFMark.length, endIdx)
//         : normalized.slice(startIdx + aFMark.length);

//     // Trim whitespace (native trim, no jQuery)
//     const cleaned = raw.trim();

//     // Parse JSON
//     return JSON.parse(cleaned);
// };
let jsonData = [];
let jsonDataSum = [];
let njsonDataSum = [];
let templateBuffer = null; // FlexibleTEMP.xlsx buffer
const PayByList = [
    { PayType: "Corporate Card" },
    { PayType: "Corporate Card 2" },
    { PayType: "Personal" },
];
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

function notify(type, message, ms = 2000) {
    if (window.DevExpress && DevExpress.ui && typeof DevExpress.ui.notify === 'function') {
        DevExpress.ui.notify(message, type, ms);
    } else {
        console.log(`[${type}]`, message);
    }
}

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
        var apopup1 = $("#popup").dxPopup({
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
                apopup1.show();
            }
        });

    } else {
        // If the current date is after May 3, hide the button
        var aNowDte = new Date();
        $("#showPopupButton").hide();
        callback(aNowDte);
    }
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

async function aaLoadData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, condition) {
    //let aDataBasea = "ExtraOnLine.dbo.EXPREIM";
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

const aSaveMemToDB = (iData, aaTBKey, aaPFDMI, aaXToX) => {
    let aObjRowData = JSON.stringify(iData);
    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
}

function handleIconClick(el) {
    try {
        const fnameOnly = el.getAttribute("data-fname");
        //const aVb = el.getAttribute("data-viewer")
        //aVb = aVb.replace('height:400px', 'height:800px')
        //alert(aVb.replace('height:400px', 'height:100%'))
        const viewerBody = JSON.parse(el.getAttribute("data-viewerF"));
        //const viewerBody = aVb //JSON.parse(aVb)
        //viewerBody = viewerBody.replace('height:400px', 'height:800px');

        const contentHtml = `
        <div style="border:1px solid #ccc; padding:8px; margin-top:10px;">
          <div style="font-weight:bold; font-size:16px; margin-bottom:8px;">
            &#10054; File Preview: ${fnameOnly}
          </div>
          ${viewerBody}
        </div>`;

        $("#popupViewer").remove();
        $("body").append('<div id="popupViewer"></div>');

        let isFullScreen = true;

        $("#popupViewer").dxPopup({
            title: "View Attached File",
            visible: true,
            width: "100%",
            height: "100%",
            fullScreen: isFullScreen,
            showCloseButton: true,
            dragEnabled: true,
            showTitle: true,
            contentTemplate: function (contentElement) {
                contentElement.append(contentHtml);
            },
            toolbarItems: [
                {
                    widget: "dxButton",
                    location: "after",
                    options: {
                        icon: "expand",
                        hint: "Enter Fullscreen",
                        onClick: function (e) {
                            isFullScreen = !isFullScreen;
                            const popup = $("#popupViewer").dxPopup("instance");

                            if (isFullScreen) {
                                popup.option("fullScreen", true);
                            } else {
                                popup.option({
                                    fullScreen: false,
                                    width: "80%",
                                    height: "80%"
                                });
                            }

                            e.component.option({
                                icon: isFullScreen ? "collapse" : "expand",
                                hint: isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"
                            });
                        }
                    }
                }
            ]
        });


    } catch (error) {
        console.error("Error in handleIconClick:", error);
        DevExpress.ui.dialog.alert("Unable to open the file. Please try again.", "Error");
    }
}

// 🔧 Load template file from server or localhost
const loadUrlTemp = async (Url, filename) => {
    const bust = "?v=" + Date.now();
    const fileUrl = Url + encodeURIComponent(filename) + bust;
    const serverInfo = getCurrentServerInfo();

    console.log("Server:", serverInfo.hostname);
    console.log("URL:", fileUrl);

    try {
        let response;
        if (serverInfo.hostname === "localhost") {
            alert("do for localhost")
            const localUrl = `http://localhost:8089/temp/uploads/${filename}${bust}`;
            response = await fetch(localUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("Local server not running");
            notify("success", "Template loaded from localhost server.", 2000);
        } else {
            response = await fetch(fileUrl, {
                method: "GET",
                credentials: "include",
                mode: "cors",
                cache: "no-store"
            });
            if (!response.ok) throw new Error("Failed to load file: " + response.status);
            notify("success", "Template loaded from server.", 2000);
        }

        return await response.arrayBuffer(); // ✅ return buffer
    } catch (err) {
        console.error(err);
        notify("error", "Failed to load template. Please upload manually.", 3000);
        return null;
    }
};

async function saveData() {
    console.log("Start saving...");
    await insertAllRecords();   // 👈 รอให้ทำงานเสร็จ
    console.log("Done saving!");
}

// ฟังก์ชันหลักที่ loop ส่งข้อมูลแบบ async/await
const insertAllRecords = async () => {
    for (let i = 0; i < njsonDataSum.length; i++) {
        const ObjKeyData = njsonDataSum[i];   // ใช้ record ตรง ๆ จาก array
        const ObjRowData = JSON.stringify(ObjKeyData);

        try {
            // 👇 ใช้ await เพื่อรอผลลัพธ์จาก API ก่อนจะไป record ถัดไป
            const response = await sendRequestNew(
                "Insert",
                ObjRowData,
                aaTBKey,
                aaPFDMI,
                atob(aaXToX)
            );
            //alert(`Record ${i} inserted successfully:, ${response}`)
            console.log(`Record ${i} inserted successfully:`, response);
        } catch (error) {
            console.error(`Failed to insert record ${i}:`, error);
        }
    }
};


// 🔧 Get current server info
function getCurrentServerInfo() {
    return {
        origin: window.location.origin,
        hostname: window.location.hostname,
        port: window.location.port
    };
}

// 🔧 Update Excel and upload

const UpdatePHExcel = async (fileUrl, filename, dlRefNO, replacements) => {
    try {
        if (!filename) {
            DevExpress.ui.dialog.alert("Please select a filename.", "error");
            return;
        }

        // Load template buffer
        const buffer = await loadUrlTemp(fileUrl, filename);
        if (!buffer) throw new Error("Template buffer not loaded.");

        // Load workbook
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        // Stamp replacements into DATA sheet
        const dataSheet = workbook.getWorksheet("DATA");
        if (!dataSheet) throw new Error('Sheet "DATA" not found.');

        const cellMap = {
            approver1: "C16",
            datenow1: "D16",
            approver2: "C17",
            datenow2: "D17",
            requester: "C18",
            datenowR: "D18",
        };

        for (const [key, val] of Object.entries(replacements)) {
            if (cellMap[key]) {
                dataSheet.getCell(cellMap[key]).value = val;
            }
        }

        // Keep only MEMO and DATA sheets
        workbook.worksheets.slice().forEach(ws => {
            if (!["MEMO", "DATA"].includes(ws.name)) workbook.removeWorksheet(ws.id);
        });

        // Save and upload
        const safeName = dlRefNO || "Unknown";
        if (safeName !== "Unknown") {
            const outBuffer = await workbook.xlsx.writeBuffer();
            const outFile = new File(
                [outBuffer],
                `${safeName}.xlsx`,
                { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
            );
            //await u2pload2File(outFile); // ✅ upload back to server
            saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), `${safeName}.xlsx`);
        }

        alert("done");
    } catch (err) {
        console.error(err);
        DevExpress.ui.notify("Processing failed.", "error", 2000);
    }
};

// ฟังก์ชัน AddTitle
const AddTitle = (noteText, title) => {
    const match = noteText.match(/NAME:\[(.*?)\]/);
    if (!match) return [];

    return match[1]
        .split('|')
        .map(name => name.trim())
        .filter(name => name !== "" && name !== ",")   // กรองช่องว่างและ comma ออก
        .map(name => `${title}${name}`);
};


// ฟังก์ชันใหม่สำหรับ stamp และ upload Excel
async function handleConfirmClick(iData) {
    try {
        const fileUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/";
        const filename = `${iData.HeadRefNo}.xlsx`;

        const replacements = {
            requester: iData?.PayToName || "Unknown",
            datenowR: new Date().toLocaleDateString("en-GB")
        };

        const buffer = await loadUrlTemp(fileUrl, filename);
        if (!buffer) throw new Error("Template buffer not loaded.");

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        const dataSheet = workbook.getWorksheet("DATA");
        if (!dataSheet) throw new Error('Sheet "DATA" not found.');

        const cellMap = {
            approver1: "C16",
            datenow1: "D16",
            approver2: "C17",
            datenow2: "D17",
            requester: "C18",
            datenowR: "D18",
        };

        for (const [key, val] of Object.entries(replacements)) {
            if (cellMap[key]) {
                dataSheet.getCell(cellMap[key]).value = val;
            }
        }

        workbook.worksheets.slice().forEach(ws => {
            if (!["MEMO", "DATA"].includes(ws.name)) workbook.removeWorksheet(ws.id);
        });

        const safeName = iData.HeadRefNo || "Unknown";
        if (safeName !== "Unknown") {
            const outBuffer = await workbook.xlsx.writeBuffer();
            const outFile = new File(
                [outBuffer],
                `${safeName}.xlsx`,
                { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
            );
            await u2pload2File(outFile);
            saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), `${safeName}.xlsx`);
        }

        DevExpress.ui.notify("Excel updated and uploaded successfully.", "success", 2000);
    } catch (err) {
        console.error("Error in handleConfirmClick:", err);
        DevExpress.ui.notify("Failed to update Excel.", "error", 2000);
    }
}
// Arrow function version of processTemplate
const processTemplate = async (
    buffer,
    replacements,
    sheetName = "DATA",
    filename = "processed.xlsx"
) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    alert(filename);

    // Reset tables and autofilter if present
    workbook.eachSheet(ws => {
        if (ws.tables) ws.tables = [];
        if (ws.autoFilter) ws.autoFilter = null;
    });

    // Get target sheet
    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) throw new Error(`Sheet "${sheetName}" not found.`);

    // Apply replacements
    sheet.eachRow(row => {
        row.eachCell(cell => {
            if (typeof cell.value === "string") {
                let newValue = cell.value;
                for (const [key, val] of Object.entries(replacements)) {
                    if (val) newValue = newValue.replaceAll(`{{${key}}}`, val);
                }
                cell.value = newValue;
            }
        });
    });

    // Write updated workbook to buffer
    const newBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([newBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    return new File([blob], filename, { type: blob.type });
};

function viewUploadedFile(filename) { // this is the version that clear cache 
    const baseUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/";
    const fileUrl = baseUrl + encodeURIComponent(filename);

    const ext = filename.split('.').pop().toLowerCase();
    let viewerUrl = "";

    // Add a cache-busting query string (timestamp)
    const bust = "?v=" + Date.now();

    if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
        viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src="
            + encodeURIComponent(fileUrl + bust);
    } else if (ext === "pdf") {
        viewerUrl = "https://docs.google.com/gview?embedded=true&url="
            + encodeURIComponent(fileUrl + bust);
    } else {
        viewerUrl = fileUrl + bust;
    }

    // Configure popup
    viewerPopup.option({
        title: "Viewing: " + filename,
        position: {
            my: "left top",
            at: "left top",
            of: window,
            offset: "40 50"
        }
    });
    viewerPopup.show();

    // Force iframe to reload fresh version
    $("#viewerFrame").attr("src", viewerUrl);
}


async function xu2pload2File(file) {
    try {
        if (!file) {
            console.log("No file provided.");
            return false;
        }

        // Use the original filename exactly as provided
        const newFileName = file.name;

        const formData = new FormData();
        formData.append("file", file);

        const myHeaders = new Headers();
        myHeaders.append("ref", "44095B6C-CC17-47FD-895B-649E0EAA2BAE");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };

        // Upload to the same server location
        const response = await fetch(
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

var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
var aaUsrN = localStorage["aaXXuX"];

// TOP PRG
showPreviousYearPopup(function (aNowDte) {
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
            //alert(aHeaders)
            //const jsonStr = e.row.data.TaskProgram;

            // โชว์แค่ 200 ตัวแรก + ความยาวทั้งหมด
            //alert("Preview JSON string:\n\n" + jsonStr.substring(0, 200) + "...\n\nLength: " + jsonStr.length);

            // aObjects.UniqueCashAdvanceClient = [
            //     ...new Set(aObjects.CashAdvanceClient.map(c => c.CompanyGroup))
            //   ].map(g => ({ CompanyGroup: g }));
            aObjects.UniqueCashAdvanceClient = [
                ...new Map(
                    aObjects.CashAdvanceClient.map(c => [
                        c.CompanyGroup,
                        {
                            CompanyGroup: c.CompanyGroup,
                            ClientCode: c.ClientCode,
                            ClientName: c.ClientName,
                            CompanyName: c.CompanyName,
                            CashAdvance: c.CashAdvance
                        }
                    ])
                ).values()
            ];

            //==== Corporate Card Setup ==========================
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
            //======================================================

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

            const ULbCustomerGrp = async (iData, ToNames) => {
                try {
                    
                    //njsonDataSum.push(iData);        // เพิ่ม object เข้าไป
                    // แปลง array เป็น JSON string
                    //const previewStr = JSON.stringify(njsonDataSum);
                    // โชว์แค่ 200 ตัวแรก + ความยาวทั้งหมด
                    //alert("Preview JSON string:\n\n" + previewStr.substring(0, 200) + "...\n\nLength: " + previewStr.length);
                    // 2) Convert JSON string -> Buffer
                    const customerGroupName = iData.ERORefNo1;
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
                    const groupRecord = iData;
                    // if (!groupRecord) {
                    //     return alert(`No records found for ${customerGroupName}`);
                    // }
                    //alert(ToNames)
                    let lOverLimit = (groupRecord.RefundedAmount > groupRecord.EROAmount1);
                    //let lOverLimit = (iData.RefundedAmount > iData.EROAmount1)
                    //alert(`Processing ${customerGroupName}`);
                    //alert(`${iData.RefundedAmount} > ${iData.EROAmount1}`)
                    //alert(`${groupRecord.RefundedAmount} > ${groupRecord.EROAmount1}`)
                    //const cChk = "N";

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
                        preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" };
                        preparedRow.getCell(3).font = { bold: true };
                        preparedRow.getCell(3).border = { bottom: { style: "thin" } };

                        preparedRow.getCell(5).value = "Approved by";
                        preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" };
                        preparedRow.getCell(6).font = { bold: true };
                        preparedRow.getCell(6).border = { bottom: { style: "thin" } };

                        memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                        const dateRow = memoSheet.getRow(summaryStartRow++);
                        dateRow.getCell(3).value = { formula: "DATA!E18" };
                        dateRow.getCell(6).value = { formula: "DATA!E16" };
                        //alert("OverLimit")
                        //alert(lOverLimit)
                        if (lOverLimit) {
                            summaryStartRow += 2;

                            const verifyRow = memoSheet.getRow(summaryStartRow++);
                            //verifyRow.getCell(5).value = { formula: "DATA!C13" };
                            verifyRow.getCell(5).value = "Approved by";
                            verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" };
                            verifyRow.getCell(6).font = { bold: true };
                            verifyRow.getCell(6).border = { bottom: { style: "thin" } };

                            memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                            const xdateRow = memoSheet.getRow(summaryStartRow++);
                            xdateRow.getCell(6).value = { formula: "DATA!C15" };
                        }

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
                        //if (groupRecord.Confirmed === true) {
                        dataSheet.getCell("C18").value = groupRecord.PayToName;   // Requester
                        dataSheet.getCell("C19").value = formattedDateTime;   // Requester Date
                        dataSheet.getCell("D18").value = formattedDateTime;   // Requester Date
                        //}
                        // Column widths
                        [5, 12, 35, 8, 12, 13, 22].forEach((w, i) => memoSheet.getColumn(i + 1).width = w);

                        // Keep only MEMO & DATA sheets
                        templateWb.worksheets.slice().forEach(ws => {
                            if (!["MEMO", "DATA"].includes(ws.name)) templateWb.removeWorksheet(ws.id);
                        });
                        //alert("before save")
                        //if (cChk === "Y") {
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
                            //saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), fileName);
                            const uploadedName = await u2pload2File(outFile);
                            //if (uploadedName && typeof viewUploadedFile === "function") {
                            //viewUploadedFile(uploadedName);
                            //}
                        }

                        //notify("success", `DL Customer Group completed for ${customerGroupName}.`, 2500);
                        //} // ifchk
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
                    DevExpress.ui.alert("Failed to transform JSON to Excel.");
                }
            }

            // const xULbCustomerGrp = async (customerGroupName, iData) => {
            //     //if (!lLoadTemp) return notify("error", "Please load Excel Template before.", 4000);
            //     //if (!njsonDataSum?.length) return notify("warning", "No data to export.", 2000);
            //     //jsonStr = aVARs.TEMPJSBF;
            //     njsonDataSum.push(iData);        // เพิ่ม object เข้าไป
            //     // แปลง array เป็น JSON string
            //     const previewStr = JSON.stringify(njsonDataSum);
            //     // โชว์แค่ 200 ตัวแรก + ความยาวทั้งหมด
            //     alert("Preview JSON string:\n\n" + previewStr.substring(0, 200) + "...\n\nLength: " + previewStr.length);
            //     // 2) Convert JSON string -> Buffer
            //     //const buffer = jsonToBuffer(jsonStr);
            //     templateBuffer = jsonToBuffer(jsonStr);
            //     if (!templateBuffer) {
            //         notify("error", "Template not loaded. Cannot proceed.", 3000);
            //         alert("Not working")
            //         return;
            //     }
            //     if (!templateBuffer) return notify("warning", "Load FlexibleTEMP.xlsx first.", 2000);

            //     console.log(njsonDataSum);
            //     const today = new Date();
            //     // 👉 แบบใส่วันที่+เวลา (dd/MM/yyyy HH:mm:ss)
            //     const formattedDateTime = today.toLocaleString("en-GB", {
            //         day: "2-digit",
            //         month: "2-digit",
            //         year: "numeric"
            //     });
            //     // Find the selected group record from njsonDataSum
            //     const groupRecord = njsonDataSum.find(r => r.ERORefNo1 === customerGroupName);
            //     if (!groupRecord) {
            //         return notify("warning", `No records found for ${customerGroupName}`, 2000);
            //     }
            //     let lOverLimit = (groupRecord.RefundedAmount > groupRecord.EROAmount1);
            //     notify("info", `Processing ${customerGroupName}`, 1500);

            //     try {
            //         // Load template workbook
            //         const templateWb = new ExcelJS.Workbook();
            //         await templateWb.xlsx.load(templateBuffer);

            //         const memoSheet = templateWb.getWorksheet("MEMO");
            //         const dataSheet = templateWb.getWorksheet("DATA");
            //         if (!memoSheet || !dataSheet) {
            //             notify("error", "Template missing MEMO or DATA sheet.", 4000);
            //             return;
            //         }

            //         // Parse Note JSON for the selected group
            //         let noteItems = [];
            //         try {
            //             noteItems = JSON.parse(groupRecord.Note || "[]");
            //         } catch (err) {
            //             console.error("Invalid Note JSON", err);
            //             notify("warning", `Skip ${customerGroupName}: invalid Note JSON.`, 2000);
            //             return;
            //         }
            //         const bFCorpC = noteItems.some(item => item.PayBy === PayByList[0].PayType);
            //         const bFCorpC2 = noteItems.some(item => item.PayBy === PayByList[1].PayType);
            //         const bFPers = noteItems.some(item => item.PayBy === PayByList[2].PayType);

            //         // Group items by company inside Note
            //         const byCompany = noteItems.reduce((acc, r) => {
            //             const companyName = (r.CompanyName || r.Company || "Unknown").trim();
            //             const qty = Number(r.Quantity) || 0;
            //             const cost = Number(r.ProductCost) || 0;
            //             const price = qty ? cost / qty : 0;
            //             (acc[companyName] ||= []).push({
            //                 ProductName: r.ProductName,
            //                 Quantity: qty,
            //                 Price: price,
            //                 ProductCost: cost,
            //                 DateText: r.PayBy || "Unknown"
            //             });
            //             return acc;
            //         }, {});

            //         // Clear previous content from row 18 down
            //         const LIGHT_GREY = { argb: "FFEFEFEF" };
            //         for (let r = 18; r <= (memoSheet.lastRow?.number || 0); r++) {
            //             const row = memoSheet.getRow(r);
            //             row.eachCell(c => { c.value = null; c.fill = null; c.font = null; c.border = null; });
            //             row.values = [];
            //         }

            //         let rowIndex = 18;
            //         let grandQty = 0;
            //         let grandCost = 0;
            //         const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));

            //         companies.forEach(companyName => {
            //             // spacer
            //             if (grandQty !== 0) memoSheet.getRow(rowIndex++).values = ["", "", "", "", "", "", ""];

            //             // header
            //             const headerRow = memoSheet.getRow(rowIndex++);
            //             headerRow.values = aHeaders //["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];
            //             for (let c = 2; c <= 7; c++) {
            //                 const cell = headerRow.getCell(c);
            //                 cell.font = { bold: true };
            //                 cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
            //                 if ([4, 5, 6].includes(c)) cell.alignment = { horizontal: "right" };
            //                 if (c === 7) cell.alignment = { indent: 2 };
            //             }

            //             // data
            //             let subtotalQty = 0;
            //             let subtotalCost = 0;
            //             byCompany[companyName].forEach(item => {
            //                 const row = memoSheet.getRow(rowIndex++);
            //                 row.values = ["", item.ProductName, undefined, item.Quantity, item.Price, item.ProductCost, item.DateText];
            //                 row.getCell(4).numFmt = "#,##0";
            //                 row.getCell(5).numFmt = "#,##0.00";
            //                 row.getCell(6).numFmt = "#,##0.00";
            //                 row.getCell(7).alignment = { indent: 2 };
            //                 subtotalQty += item.Quantity;
            //                 subtotalCost += item.ProductCost;
            //                 grandQty += item.Quantity;
            //                 grandCost += item.ProductCost;
            //             });

            //             // subtotal
            //             const subtotalRow = memoSheet.getRow(rowIndex++);
            //             subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
            //             for (let c = 2; c <= 7; c++) {
            //                 subtotalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
            //             }
            //             subtotalRow.getCell(2).font = { bold: true };
            //             subtotalRow.getCell(4).numFmt = "#,##0";
            //             subtotalRow.getCell(6).numFmt = "#,##0.00";
            //         });

            //         // grand total
            //         memoSheet.addRow([]);
            //         const grandRow = memoSheet.addRow(["", "Grand Total", "", grandQty, "", grandCost, ""]);
            //         for (let c = 2; c <= 7; c++) {
            //             const cell = grandRow.getCell(c);
            //             cell.font = { bold: true };
            //             cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
            //         }
            //         grandRow.getCell(4).numFmt = "#,##0";
            //         grandRow.getCell(6).numFmt = "#,##0.00";

            //         // summary block (Corporate/Personal/Total)
            //         // หาจุดเริ่มต้นของสูตรแบบ dynamic
            //         // สมมติว่าข้อมูลเริ่มหลัง header 1 แถว → ใช้ row 2
            //         // หรือคุณสามารถกำหนดเป็น row แรกของข้อมูลจริงได้
            //         // Anchor ของส่วน summary (วางหลังข้อมูลจริง 2 แถว)
            //         let summaryStartRow = memoSheet.lastRow.number + 2;

            //         // แถวแรกของสรุป (ใช้เป็นจุดเริ่มต้นช่วง SUM ของ Total)
            //         const firstSummaryRow = summaryStartRow;

            //         // นับจำนวน summary items ที่ถูกสร้าง (Corp/Corp2/Personal)
            //         let summaryItemCount = 0;

            //         // Corporate Card
            //         if (bFCorpC) {
            //             const corpRow = memoSheet.getRow(summaryStartRow++);
            //             summaryItemCount++;

            //             corpRow.getCell(3).value = PayByList[0].PayType;
            //             corpRow.getCell(3).alignment = { indent: 15 };

            //             // SUMIF จากข้อมูลดิบ เพื่อได้ค่ายอดรวมตาม PayType
            //             corpRow.getCell(4).value = {
            //                 formula: `SUMIF(G:G,"Corporate Card",D:D)`
            //             };
            //             corpRow.getCell(6).value = {
            //                 formula: `SUMIF(G:G,"Corporate Card",F:F)`
            //             };

            //             corpRow.getCell(4).numFmt = "#,##0";
            //             corpRow.getCell(6).numFmt = "#,##0.00";

            //             if (!bFPers && !bFCorpC2) {
            //                 [4, 6].forEach(col => { corpRow.getCell(col).border = { bottom: { style: "thin" } }; });
            //             }
            //         }

            //         // Corporate Card 2
            //         if (bFCorpC2) {
            //             const corp2Row = memoSheet.getRow(summaryStartRow++);
            //             summaryItemCount++;

            //             corp2Row.getCell(3).value = PayByList[1].PayType;
            //             corp2Row.getCell(3).alignment = { indent: 15 };

            //             corp2Row.getCell(4).value = {
            //                 formula: `SUMIF(G:G,"Corporate Card 2",D:D)`
            //             };
            //             corp2Row.getCell(6).value = {
            //                 formula: `SUMIF(G:G,"Corporate Card 2",F:F)`
            //             };

            //             corp2Row.getCell(4).numFmt = "#,##0";
            //             corp2Row.getCell(6).numFmt = "#,##0.00";

            //             if (!bFPers && !bFCorpC) {
            //                 [4, 6].forEach(col => { corp2Row.getCell(col).border = { bottom: { style: "thin" } }; });
            //             }
            //         }

            //         // Personal
            //         if (bFPers) {
            //             const personalRow = memoSheet.getRow(summaryStartRow++);
            //             summaryItemCount++;

            //             personalRow.getCell(3).value = PayByList[2].PayType;
            //             personalRow.getCell(3).alignment = { indent: 15 };

            //             personalRow.getCell(4).value = {
            //                 formula: `SUMIF(G:G,"Personal",D:D)`
            //             };
            //             personalRow.getCell(6).value = {
            //                 formula: `SUMIF(G:G,"Personal",F:F)`
            //             };

            //             personalRow.getCell(4).numFmt = "#,##0";
            //             personalRow.getCell(6).numFmt = "#,##0.00";

            //             [4, 6].forEach(col => { personalRow.getCell(col).border = { bottom: { style: "thin" } }; });
            //         }

            //         // Total Row
            //         const totalRow = memoSheet.getRow(summaryStartRow++);
            //         totalRow.getCell(3).value = "Total";
            //         totalRow.getCell(3).alignment = { indent: 15 };
            //         totalRow.getCell(3).font = { bold: true };

            //         // ถ้ามีอย่างน้อย 1 item → SUM ช่วงแถวสรุปที่สร้างขึ้น
            //         if (summaryItemCount > 0) {
            //             totalRow.getCell(4).value = {
            //                 formula: `SUM(D${firstSummaryRow}:D${totalRow.number - 1})`
            //             };
            //             totalRow.getCell(6).value = {
            //                 formula: `SUM(F${firstSummaryRow}:F${totalRow.number - 1})`
            //             };
            //         } else {
            //             // ไม่มี item ใดถูกสร้าง → ให้ Total เป็น 0 เพื่อกัน error/วงเล็บว่าง
            //             totalRow.getCell(4).value = 0;
            //             totalRow.getCell(6).value = 0;
            //         }

            //         totalRow.getCell(4).numFmt = "#,##0";
            //         totalRow.getCell(6).numFmt = "#,##0.00";

            //         // เส้น double border สำหรับ Total
            //         [4, 6].forEach(col => {
            //             totalRow.getCell(col).border = { bottom: { style: "double" } };
            //         });

            //         // regards + prepared/approved + dates + verify rows

            //         const regardsRow = memoSheet.getRow(summaryStartRow++);
            //         regardsRow.getCell(2).value = "Regards,";

            //         summaryStartRow += 2;

            //         const preparedRow = memoSheet.getRow(summaryStartRow++);
            //         preparedRow.getCell(2).value = "Prepared by";
            //         preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" };
            //         preparedRow.getCell(3).font = { bold: true };
            //         preparedRow.getCell(3).border = { bottom: { style: "thin" } };

            //         preparedRow.getCell(5).value = "Approved by";
            //         preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" };
            //         preparedRow.getCell(6).font = { bold: true };
            //         preparedRow.getCell(6).border = { bottom: { style: "thin" } };

            //         memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

            //         const dateRow = memoSheet.getRow(summaryStartRow++);
            //         dateRow.getCell(3).value = { formula: "DATA!E18" };
            //         dateRow.getCell(6).value = { formula: "DATA!E16" };
            //         //alert("OverLimit")
            //         //alert(lOverLimit)
            //         if (lOverLimit) {
            //             summaryStartRow += 2;

            //             const verifyRow = memoSheet.getRow(summaryStartRow++);
            //             //verifyRow.getCell(5).value = { formula: "DATA!C13" };
            //             verifyRow.getCell(5).value = "Approved by";
            //             verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" };
            //             verifyRow.getCell(6).font = { bold: true };
            //             verifyRow.getCell(6).border = { bottom: { style: "thin" } };

            //             memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

            //             const xdateRow = memoSheet.getRow(summaryStartRow++);
            //             xdateRow.getCell(6).value = { formula: "DATA!C15" };
            //         }

            //         // Stamp DATA sheet from njsonDataSum fields
            //         dataSheet.getCell("C1").value = groupRecord.HeadRefNo;    // PRE REF#
            //         dataSheet.getCell("C2").value = groupRecord.ERORefNo1;    // Company Group
            //         dataSheet.getCell("C4").value = groupRecord.EROAmount2;   // Outstanding
            //         dataSheet.getCell("C7").value = groupRecord.RefundedAmount; // Cash Advance
            //         dataSheet.getCell("E5").value = groupRecord.ERODate02;    // Period
            //         dataSheet.getCell("E6").value = groupRecord.ERODesc05;    // LOT
            //         dataSheet.getCell("C7").value = groupRecord.EROAmount1;   // Limit C8
            //         //if (groupRecord.Confirmed === true) {
            //         dataSheet.getCell("C18").value = groupRecord.PayToName;   // Requester
            //         dataSheet.getCell("D18").value = formattedDateTime;   // Requester Date
            //         //}
            //         // Column widths
            //         [5, 12, 35, 8, 12, 13, 22].forEach((w, i) => memoSheet.getColumn(i + 1).width = w);

            //         // Keep only MEMO & DATA sheets
            //         templateWb.worksheets.slice().forEach(ws => {
            //             if (!["MEMO", "DATA"].includes(ws.name)) templateWb.removeWorksheet(ws.id);
            //         });

            //         // Save for selected group using HeadRefNo
            //         const safeName = groupRecord.HeadRefNo || "Unknown";
            //         //const safeName = "PREAPPTEMP" || "Unknown";
            //         const fileName = safeName + ".xlsx"
            //         //const safeName = iData.HeadRefNo
            //         if (safeName !== "Unknown") {
            //             const outBuffer = await templateWb.xlsx.writeBuffer();
            //             // const outFile = new File(
            //             //     [outBuffer],
            //             //     `${safeName}.xlsx`,
            //             //     { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
            //             // );
            //             saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), fileName);
            //             //const uploadedName = await u2pload2File(outFile);
            //             //if (uploadedName && typeof viewUploadedFile === "function") {
            //             //viewUploadedFile(uploadedName);
            //             //}
            //         }

            //         notify("success", `DL Customer Group completed for ${customerGroupName}.`, 2500);
            //     } catch (err) {
            //         console.error(err);
            //         notify("error", `Failed group export for ${customerGroupName}.`, 3000);
            //     }
            // };

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

            var aaPFDMI = isLocalHost();
            var afqrFull = "pageID='" + aaPXIXD + "' ";

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
                        let currentHoveredColumn = null; // Variable to track the currently hovered column
                        let nTime = 0; // Counter to track how many times we've hovered over the current column
                        var aaPFDMI = isLocalHost()
                        var aaXToX = localStorage["aaXXoX"];
                        var aaOnInitExpGroupCode = aaERTYPE; //"800" 
                        var aaOnInitExpGroupDesc = `${CHK_LABEL} Form` // "Travel Requisition Form"  
                        //var aaOnInitAccCode = "55101150003" //not used 
                        var aaOnInitAccDesc = `${CHK_LABEL} Form`;  // Travel Requisition Form" 
                        // Travel Agent
                        let axqr2S = "Where AgentID <> ''" //"Where ExpGroupCode = '" + aaERTYPE + "' and " + "EmpID = '" + aaEmpID + "'"                        
                        let axFieldSelected = "AgentID, CompanyIDNO, AgentName, ContactPerson, Email, Phone, Address, Country, RegistrationNo, LicenseExpiryDate, Website, Status, EntryDate, EntryBy"
                        let axFullBody = "Select " + axFieldSelected + " From " + "ExtraOnLine.dbo.TravelAgent " + axqr2S; //alert(aFullBody)
                        fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(axFullBody) }), redirect: "follow" })
                            .then(response => response.json())
                            .then(acData => {
                                var aaSubGroup01 = acData;//
                                //console.log(aaSubGroup01)

                                // Approver
                                let aDivisionC = localStorage["asDIV"]; // check ApproverCode = 'PRE' and change the LRange01, LRange02
                                //let aDivS = "Where ApproverCode = 'TRFO' OR (ApproverCode = 'HOD' AND ApproveToDivision = '" + aDivisionC + "') Order By LRange02"
                                let aDivS = `Where ApproverCode = 'TRFO' OR (ApproverCode = '${APV_TYPE}' AND ApproveToDivision = '${aDivisionC}') Order By LRange02`
                                let aFieldSelected = "ApproverCode,ApproveToDivision,ApproverName,ApproverEmail,LRange01,LRange02"
                                let aFullBody = "Select " + aFieldSelected + " From " + "ExtraOnLine.dbo.Approver " + aDivS;

                                fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                    .then(response => response.json())
                                    .then(hData => {
                                        var aaaHODApprover = hData; //aaHODApprover //console.log(aaaHODApprover)
                                        if (jQuery.type(aaaHODApprover[0]) === "undefined") {
                                            DevExpress.ui.dialog.alert({
                                                //showTitle: false,
                                                position: { offset: "-130 -310" },
                                                //position: { my: "top",  at: "top", of: "window"  },
                                                title: "ERROR SETTING!!",
                                                messageHtml: "<div>Un-completed system setup, please contact Administrator</div>"
                                            });
                                            System.exit(0); // if not found the Approver
                                        }
                                        //===== HOD / PRE =============================================
                                        let aaHODApprover = aaaHODApprover
                                        let aaHODAppName = aaHODApprover[0].ApproverName
                                        let aaHODAppEmail = aaHODApprover[0].ApproverEmail //.LRange02
                                        let aaHODRange02 = aaHODApprover[0].LRange02 // LRange01 - LRage02 (between)
                                        //=============================================================
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
                                        // set global variable for dx-form (add-form) nRecno = 1
                                        var asFullName = localStorage["asFTNAME"];
                                        var asStaffID = $.trim(localStorage["asSTFID"]);
                                        var asDepartment = localStorage["asDEPT"];
                                        var asDivision = localStorage["asDIV"];
                                        var asStaffEmail = localStorage["asEMAIL"];
                                        var asERStatus = "Register";

                                        //----- Variables for TRF dxForm ---------------
                                        var asERODesc02 = ""; //Destination	ERODesc02
                                        var asERODesc03 = ""; //Purpose of Trip
                                        var asERORefNo1 = ""; //Purpose of Trip List
                                        var asEROCheck01 = false; //Overseas
                                        var asEROCheck02 = false; //Need Roaming  
                                        var asEROCheck03 = false; //Self-Booking                                      
                                        var asERODate02 = new Date() //Travel Start Date	
                                        var asERODate03 = new Date() //Travel End Date	
                                        var asRefundedAmount = 0; //Estimated Cost	
                                        var asVendor01 = ""; //Departure Flight	
                                        var asERODesc04 = ""; //Arrival Flight	
                                        var asEROAmount1 = 0; //Ticket Price	EROAmount1
                                        var asERODesc05 = ""; //Hotel	ERODesc05
                                        var asNote = ""; //Remark	Note
                                        //---- Variable for dataGrid ------------------
                                        //Full name (as show in passport)	vendor02
                                        //Self-Booking	EROCheck03
                                        //Send Date	ERODate01
                                        //Frequent Flyer Program	EROCode02
                                        //Ticket Price	EROAmount2
                                        //Hotel	ERODesc01
                                        //Hotel Price	EROAmount4
                                        //Date From	ERODate05
                                        //Date To	ERODate06
                                        //Mobile phone	EROCode03

                                        var aqrFull = "ExpGroupCode = '" + aaERTYPE + "' and " + "PayToCode = '" + asStaffID + "'"
                                        // scopes based permission (View Only Login Name)  ExpensesCode LIKE aaOnInitAccCode
                                        var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                        var aSettings = { "url": aurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };
                                        var aaAllData;

                                        $("#gridContainer").dxDataGrid({
                                            dataSource: new DevExpress.data.CustomStore({
                                                key: aaKeyField, //"REFNO",
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
                                                    var ObjKeyData = { [aaKeyField]: $.trim(key) };   //[aaKeyField] key.trim
                                                    var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                                    sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                },
                                                remove: function (key) {
                                                    var ObjKeyData = { [aaKeyField]: $.trim(key) };   //[aaKeyField] key.trim
                                                    var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                                                    sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                }
                                            }),
                                            //elementAttr: {class: "custom-datagrid" },
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
                                            filterValue: [['ReqDate', '>=', aFilterT], "and", ['ReqDate', '<=', aFilterT2], "and", ['ID', '=', '1']],
                                            //              [Req.Date] Is any of('2022') and show only first record of the group  (ID=1)                                
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
                                                allowedPageSizes: [10, 20, 50, 100],
                                                showNavigationButtons: true,
                                                showInfo: true
                                            },
                                            showBorders: true,
                                            groupPaging: true,
                                            showColumnLines: true,
                                            showRowLines: true,
                                            rowAlternationEnabled: false, //true,
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
                                                        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'TravelRequisition' + '.xlsx');
                                                    });
                                                });
                                                e.cancel = true;
                                            },
                                            onInitNewRow: function (e) {
                                                //e.component.__addingStart = true; 
                                                //gridContainer.option("editing.popup.title", "Adding Expenses Reimbursement");
                                                let aaID = 1
                                                let axRunRun = aGetDateRef(aaRunPre); //aaRunPre aaOnInitExpGroupDesc.substring(0, 1)
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
                                                e.data.PSPvDate = new Date()
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
                                                e.data.EROCheck03 = false
                                                e.data.NeedPayment = false
                                                e.data.RefundedAmount = 0
                                                e.data.LimitedAmount = 0 //aaLTotal // Fleet Card
                                            },
                                            onEditorPreparing: function (e) {
                                                if (e.parentType === "dataRow" && arDataU === 0) {
                                                    e.editorOptions.disabled = true;
                                                } else {
                                                    if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ERStatus" || e.dataField === "PSPvNO" || e.dataField === "LocalAmount" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department")) {
                                                        e.editorOptions.disabled = true;
                                                    }
                                                }
                                            },

                                            // Editing
                                            editing: {
                                                mode: "cell", // popup , row, cell (click to edit)
                                                useIcons: true,
                                                allowUpdating: false, //U
                                                allowDeleting: arDataD, //D
                                                allowAdding: 0, //C //arDataC, //arDataC, false, 
                                                popup: {
                                                    title: `${CHK_LABEL} Form Info`,
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
                                                            hint: "Edit",
                                                            icon: "fas fa-pen", //<i class="fa-solid fa-magnifying-glass"></i>
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === false) //return !e.row.isEditing; //&& e.row.data.Confirmed === false
                                                            },
                                                            onClick: function (e) {
                                                                aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate, false, e.row.data.EROCheck03);
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
                                                                aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate, true, e.row.data.EROCheck03); // true = readOnly
                                                            }
                                                        },
                                                    ]
                                                },
                                                { // Delete / UN-Confirm
                                                    type: "buttons",
                                                    width: 40,
                                                    buttons: [
                                                        { // Delete
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
                                                                        aSQLCommand = "use ExtraOnLine; DELETE FROM TRVREQF WHERE HeadRefNo = '" + e.row.data.HeadRefNo + "'"
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
                                                            //visible: false,
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === true && e.row.data.HODApproved === false) //return !e.row.isEditing;
                                                            },
                                                            onClick: function (e) {
                                                                //send Email
                                                                let aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + "<br> CALLBACK";
                                                                let aApproverName = aaHODAppName         //aaHRAppName //"Wikran" + " [HR]"         // HR Approver Name
                                                                let aApproverEmail = $.trim(aaHODAppEmail) // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"  aRefNoa
                                                                let aSubject = aaOnInitExpGroupDesc + " - CALLBACK"
                                                                let aRefNoa = e.row.data.HeadRefNo //iData.HeadRefNo aaiHeadRef

                                                                let aAddress2Do = `<a href='${aaPFDMI}/XOL/index.html'>${aaOnInitExpGroupDesc}</a>`;
                                                                let getvalues = { aApproverName: aApproverName, aApproverEmail: aApproverEmail, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName }
                                                                let aAlertUNC = aArrays.ALERT03[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                let result = DevExpress.ui.dialog.confirm(aAlertUNC, aArrays.ALERT03[1]);
                                                                result.done(function (dresult) {
                                                                    if (dresult) {
                                                                        // mark Confirmed field
                                                                        let aERStatus = "Register"
                                                                        let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                        let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                        var aObjKeyData = { REFNO: e.row.data.REFNO, Confirmed: aTrueORFalseB, ERStatus: aERStatus };   //[aaKeyField] key.trim
                                                                        var aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //value
                                                                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));

                                                                        //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704'
                                                                        let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF  SET Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)

                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.event.preventDefault();


                                                                        let aMessage01 = aArrays.ACONFIRM[1].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                        var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #9700F9; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#F5E6FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                                                        aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.component.refresh(true);
                                                                        e.event.preventDefault();
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        //aMessageAlert("Already UN-Confirmed", "Red")
                                                                        aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                    }
                                                                });

                                                            }

                                                        },
                                                    ]
                                                },

                                                { // Print
                                                    type: "buttons",
                                                    width: 40,
                                                    visible: CHK_TRF_V,
                                                    buttons: [
                                                        {
                                                            hint: "Print",
                                                            icon: "fas fa-print",
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && e.row.data.Confirmed === true && CHK_TRF_V) //false; && e.row.data.ERStatus.includes("(finished)") //&& e.row.data.Confirmed === true aGenPDF4HTML
                                                            },
                                                            onClick: function (e) {
                                                                aRPTPrint2Pdf(e.row.data.HeadRefNo, aaPFDMI, "RMasterReport", "Travel Requisition Form") //T2302163889 e.row.data.HeadRefNo
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
                                                { // View Attach File
                                                    type: "buttons",
                                                    width: 40,
                                                    visible: CHK_TRF_V,
                                                    buttons: [

                                                        {
                                                            hint: "View Attach File",
                                                            icon: "fas fa-file",
                                                            // visible: true,
                                                            visible: function (e) {
                                                                return (e.row.data.ID === 1 && CHK_TRF_V)//&& e.row.data.Confirmed === true && e.row.data.ERStatus.includes("(finished)")) //false; && e.row.data.Confirmed === true aGenPDF4HTML
                                                            },
                                                            onClick: async function (e) {
                                                                var aUriV = `${aaPFDMI}/temp/uploads/${e.row.data.HeadRefNo}.pdf`
                                                                const cacheBusterUrl = aUriV + "?t=" + new Date().getTime();
                                                                const fileAvailable = await isFileAvailable(aUriV);
                                                                //alert(fileAvailable ? "Found" : "Not found")
                                                                if (fileAvailable || aaCheckON) {
                                                                    aPopupPDF(cacheBusterUrl) //showPdf(aUriV) //'https://cbsdev2.locktonwattana.com/temp/uploads/R2411145070-001.pdf'
                                                                } else {
                                                                    aMessageAlert("<b>The requested file is not available on the server.", "red");
                                                                }

                                                            }
                                                        }
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
                                                    dataType: "number",
                                                    caption: "NO",
                                                    width: 40,
                                                    visible: false,
                                                },
                                                {
                                                    dataField: "ReqDate",
                                                    caption: "Req. Date",
                                                    dataType: "date",
                                                    format: "dd/MM/yyyy",
                                                    width: CHK_TRF_V ? 90 : 120,
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "PayToName",
                                                    caption: "Requesters",
                                                    editorType: "dxTextBox",
                                                    width: CHK_TRF_V ? 120 : 200,
                                                    visible: false, //CHK_TRF_V,
                                                },
                                                {
                                                    dataField: "ERODate02",
                                                    caption: "Period",
                                                    dataType: "date",
                                                    format: "dd/MM/yyyy",
                                                    width: 100,
                                                    editorOptions: { readOnly: true },
                                                    visible: CHK_PRE_V,
                                                },
                                                {
                                                    dataField: "ERORefNo1",
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
                                                    visible: HAVECORPCARD, //HAVECORPCARD
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
                                                    width: 120,
                                                    visible: CHK_TRF_V,
                                                },
                                                {
                                                    dataField: "ERORefNo1", //ERODesc03
                                                    caption: "Purpose Of Trip",
                                                    dataType: "string",
                                                    lookup: {
                                                        dataSource: aObjects.aaPurposeTable,
                                                        valueExpr: "Purpose",
                                                        displayExpr: "Purpose",
                                                    },
                                                    width: 100,
                                                    visible: CHK_TRF_V,
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
                                                    visible: CHK_TRF_V,
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
                                                    visible: CHK_TRF_V,
                                                },
                                                {
                                                    dataField: "ERODesc02",
                                                    caption: "Destination",
                                                    dataType: "string",
                                                    width: 120,
                                                    visible: CHK_TRF_V,
                                                },
                                                {
                                                    dataField: "ERODate02",
                                                    caption: "Travel Start Date",
                                                    dataType: "date",
                                                    format: "dd/MM/yyyy",
                                                    width: 110,
                                                    visible: CHK_TRF_V,
                                                },
                                                {
                                                    dataField: "ERODate03",
                                                    caption: "Travel End Date",
                                                    dataType: "date",
                                                    format: "dd/MM/yyyy",
                                                    width: 110,
                                                    visible: CHK_TRF_V,
                                                },
                                                {
                                                    dataField: "EROAmount1",
                                                    caption: "Limit",
                                                    dataType: "number",
                                                    format: { type: "fixedPoint", precision: 2 },
                                                    width: 140,
                                                    visible: CHK_PRE_V,
                                                },
                                                {
                                                    dataField: "RefundedAmount",
                                                    caption: CHK_TRF_V ? "Estimated Cost" : "Advance Amt", //visible: CHK_TRF_V,
                                                    dataType: "number",
                                                    format: { type: "fixedPoint", precision: 2 },
                                                    width: CHK_TRF_V ? 120 : 140,
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "Vendor02Note",
                                                    caption: "Last Approver",
                                                    // editorOptions: { width: 120 },
                                                    width: CHK_TRF_V ? 120 : 180,
                                                    visible: true,
                                                },
                                                {
                                                    dataField: "ERStatus",
                                                    caption: "Status",
                                                    dataType: "string",
                                                    width: 220,
                                                    visible: true,
                                                },

                                            ],
                                            // onCellHoverChanged: function (e) {
                                            //     // Only act on header cells
                                            //     if (e.rowType !== "header") return;

                                            //     const columnHelp = aObjects.aGHeaderHelp;
                                            //     const columnDataField = e.column.dataField;

                                            //     // Only show help for PBatchNo column
                                            //     if (columnDataField !== "PBatchNo") return;

                                            //     if (e.eventType === "mouseover") {
                                            //         const columnCaption = e.column.caption;
                                            //         const helpText = columnHelp[columnDataField];

                                            //         if (helpText) {
                                            //             $("#popup").dxPopup({
                                            //                 title: `Help: ${columnCaption}`,
                                            //                 contentTemplate: () => $("<div>").html(helpText),
                                            //                 width: 400,
                                            //                 height: 200,
                                            //                 visible: true,
                                            //                 dragEnabled: true,
                                            //                 closeOnOutsideClick: true,
                                            //                 wrapperAttr: { class: "rounded-popup" },
                                            //                 position: {
                                            //                     my: "center top",
                                            //                     at: "center top",
                                            //                     of: window,
                                            //                     offset: "0 120"
                                            //                 }
                                            //             }).dxPopup("show");
                                            //         }
                                            //     }

                                            //     if (e.eventType === "mouseout") {
                                            //         $("#popup").dxPopup("hide");
                                            //     }
                                            // },

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
                                                        /*
                                                        summaryType: "max",
                                                        valueFormat: "currency",
                                                        showInGroupFooter: false,
                                                        alignByColumn: true  
                                                        */
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
                                                        template: function () { return $("<div style='padding: 5px 5px;'/>") }
                                                    },
                                                    {
                                                        location: "before",
                                                        template: function () {
                                                            return $("<div />")
                                                                //.addClass("informer")
                                                                .append(
                                                                    $("<span style='font-size: 13px; font-weight: bold; color: white; background-color: darkgreen; border-radius: 3px; border: 0px; padding: 1px 30px; ' />")
                                                                        .text(aaOnInitExpGroupDesc.toUpperCase()), //" FOR "
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
                                                        visible: false,
                                                        options: {
                                                            icon: "fas fa-plus",
                                                            text: "TEST",
                                                            type: "success",
                                                            stylingMode: "contained",
                                                            onClick: function () {
                                                                try {
                                                                    var arr = aArrays.aSELECTTRF;
                                                                    console.log("aSELECTTRF length = " + arr.length);

                                                                    var aMessage = arr[0];
                                                                    var aTitle = arr[1];

                                                                    // Labels (with optional color)
                                                                    var btnLabel1 = arr[2];   // e.g. "ADMIN BOOKING|Green"
                                                                    var btnLabel2 = arr[3];   // e.g. "SELF BOOKING|Green"
                                                                    var btnLabel3 = arr[4];   // Cancel
                                                                    var btnValue1 = arr[5];
                                                                    var btnValue2 = arr[6];
                                                                    var btnValue3 = arr[7];   // Cancel value (null)
                                                                    var showDialog = arr[8];

                                                                    var btnLabel4 = arr[9];   // e.g. "PRE-APPROVED|Red"
                                                                    var btnValue4 = arr[10];  // +2

                                                                    // Helper: split "Label|Color"
                                                                    function parseLabel(labelText) {
                                                                        if (!labelText) return { text: "", color: null };
                                                                        var parts = labelText.split("|");
                                                                        return {
                                                                            text: parts[0].trim(),
                                                                            color: parts.length > 1 ? parts[1].trim().toLowerCase() : null
                                                                        };
                                                                    }

                                                                    if (showDialog === "YES") {
                                                                        var buttons = [];

                                                                        // Button 1
                                                                        if (btnLabel1) {
                                                                            var b1 = parseLabel(btnLabel1);
                                                                            buttons.push({
                                                                                text: b1.text,
                                                                                onClick: () => btnValue1,
                                                                                elementAttr: b1.color ? { style: "background-color:" + b1.color + "; color:white;" } : {}
                                                                            });
                                                                        }

                                                                        // Button 2
                                                                        if (btnLabel2) {
                                                                            var b2 = parseLabel(btnLabel2);
                                                                            buttons.push({
                                                                                text: b2.text,
                                                                                onClick: () => btnValue2,
                                                                                elementAttr: b2.color ? { style: "background-color:" + b2.color + "; color:white;" } : {}
                                                                            });
                                                                        }

                                                                        // Button 4 (PRE-APPROVED)
                                                                        if (btnLabel4 && typeof btnValue4 !== "undefined") {
                                                                            var b4 = parseLabel(btnLabel4);
                                                                            buttons.push({
                                                                                text: b4.text,
                                                                                onClick: () => btnValue4,
                                                                                elementAttr: b4.color ? { style: "background-color:" + b4.color + "; color:white;" } : {}
                                                                            });
                                                                        }

                                                                        // Cancel button → always last
                                                                        if (btnLabel3) {
                                                                            var b3 = parseLabel(btnLabel3);
                                                                            buttons.push({
                                                                                text: b3.text,
                                                                                onClick: () => null,
                                                                                // Cancel forced to default style
                                                                                elementAttr: {}
                                                                            });
                                                                        }

                                                                        var aTRFresult = DevExpress.ui.dialog.custom({
                                                                            title: aTitle,
                                                                            message: aMessage,
                                                                            buttons: buttons,
                                                                            position: {
                                                                                of: window,
                                                                                my: "center",
                                                                                at: "center",
                                                                                offset: "0 -250"
                                                                            }
                                                                        }).show();

                                                                        aTRFresult.done(function (dresult) {
                                                                            if (dresult !== null) {
                                                                                aPopUpAddForm(1, 1, aNowDte, false, dresult);
                                                                            }
                                                                        });
                                                                    } else {
                                                                        aPopUpAddForm(1, 1, aNowDte, false, false);
                                                                    }
                                                                } catch (e) {
                                                                    alert("Error in TEST button:\n" + e.message);
                                                                    console.error(e);
                                                                }
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
                                                            stylingMode: "contained",
                                                            onClick: function () {
                                                                //dataGrid.refresh();
                                                                let aHelpMessage = `<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-plus'></i>" + " ADD MORE ROW</div>`
                                                                aPopupHelp("HELP", aVARs.HELP01)
                                                            }
                                                        }
                                                    },
                                                    {
                                                        location: "before",
                                                        template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                    },
                                                    {
                                                        location: "before",
                                                        template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                    },
                                                    {
                                                        location: "before",
                                                        template: function () { return $("<div style='padding: 5px 85px;'/>") }
                                                    },

                                                    // Add New Record
                                                    {
                                                        location: "after",
                                                        widget: "dxButton",
                                                        visible: CHK_PRE_V,
                                                        options: {
                                                            icon: "fas fa-plus-circle",
                                                            text: "Add New",
                                                            hint: "Add new record",
                                                            type: "success",
                                                            stylingMode: "contained", // "outlined" contained
                                                            onClick: function () {
                                                                aPopUpAddForm(1, 1, aNowDte, false, false);
                                                            }

                                                        }
                                                    },
                                                    {
                                                        location: "after",
                                                        widget: "dxButton",
                                                        visible: CHK_TRF_V,
                                                        options: {
                                                            icon: "fas fa-plus-circle",
                                                            text: "Add New",
                                                            hint: "Add new record",
                                                            type: "success",
                                                            stylingMode: "contained", // "outlined" contained
                                                            onClick: function () {
                                                                var aSelectVal1 = aArrays.aSELECTTRF[5] === 0 ? false : true
                                                                var aSelectVal2 = aArrays.aSELECTTRF[6] === 0 ? false : true
                                                                var aSelectVal3 = aArrays.aSELECTTRF[7] === "null" ? null : aArrays.aSELECTTRF[7]
                                                                if (aArrays.aSELECTTRF[8] === "YES") {
                                                                    var aTRFresult = DevExpress.ui.dialog.custom({
                                                                        title: aArrays.aSELECTTRF[1],  // Title from array
                                                                        message: aArrays.aSELECTTRF[0], // Message from array
                                                                        buttons: [
                                                                            { text: aArrays.aSELECTTRF[2], onClick: () => aSelectVal1 },   // Custom "YES"
                                                                            { text: aArrays.aSELECTTRF[3], onClick: () => aSelectVal2 }, // Custom "NO"
                                                                            { text: aArrays.aSELECTTRF[4], onClick: () => aSelectVal3 }  // Exit without doing anything
                                                                        ],
                                                                        position: {
                                                                            of: window,  // Position relative to the window
                                                                            my: "center", // Center horizontally
                                                                            at: "center", // Center vertically
                                                                            offset: "0 -250" // Move up by 100px (y-axis)
                                                                        }
                                                                    }).show();

                                                                    aTRFresult.done(function (dresult) {
                                                                        if (dresult !== null) { // Ignore if "CANCEL" was clicked
                                                                            aPopUpAddForm(1, 1, aNowDte, false, dresult);
                                                                        }
                                                                    });
                                                                } else {
                                                                    aPopUpAddForm(1, 1, aNowDte, false, false);
                                                                }


                                                            }
                                                            // onClick: function () {
                                                            //     // Parse the JSON string from the database
                                                            //     const config = JSON.parse(aVARs.aSELECTTRF); // aSELECTTRF is a text field

                                                            //     // Validate and transform buttons
                                                            //     const buttons = Array.isArray(config.buttons)
                                                            //         ? config.buttons.map(btn => ({
                                                            //             text: btn.label || "Unnamed",
                                                            //             onClick: () => {
                                                            //                 // Return value as-is (number, null, string)
                                                            //                 return btn.value;
                                                            //             }
                                                            //         }))
                                                            //         : [];

                                                            //     // Show dialog only if flag is "YES"
                                                            //     if (config.showDialog === "YES") {
                                                            //         const aTRFresult = DevExpress.ui.dialog.custom({
                                                            //             title: config.title || "Untitled",
                                                            //             message: config.message || "",
                                                            //             buttons: buttons,
                                                            //             position: {
                                                            //                 of: window,
                                                            //                 my: "center",
                                                            //                 at: "center",
                                                            //                 offset: "0 -250"
                                                            //             }
                                                            //         }).show();

                                                            //         aTRFresult.done(function (dresult) {
                                                            //             if (dresult !== null) {
                                                            //                 aPopUpAddForm(1, 1, aNowDte, false, dresult);
                                                            //             }
                                                            //         });
                                                            //     } else {
                                                            //         aPopUpAddForm(1, 1, aNowDte, false, false);
                                                            //     }
                                                            // }

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
                                                                    doc.save(CHK_TRF_V ? "TRVREQF" : "PREAPPROVE" + '.pdf'); //
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
                                                            onClick: function () {
                                                                dataGrid.refresh();
                                                            }
                                                        }
                                                    }
                                                );
                                            }

                                        }).dxDataGrid("instance");

                                        // Not use
                                        $("#action-add").dxSpeedDialAction({
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
                                        }).dxSpeedDialAction("instance");

                                        // popup Add New and Edit  
                                        const aPopUpAddForm = (aRecNo, iData, idDate, iView, aSelfBooking) => {
                                            var aaPFDMI = isLocalHost();
                                            var astr = localStorage["aDXTheme"]
                                            var aViewF = (iView === undefined) ? false : iView;
                                            var aViewG = (iView === undefined) ? true : !iView;
                                            var axSelfBooking = (aSelfBooking === undefined) ? false : aSelfBooking;
                                            if (CHK_PRE_V) { axSelfBooking = true };
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
                                                    aFormConfirm = "aConfirmPRE"//+ (CHK_PRE_V ? "PRE" : "");
                                                } else {
                                                    //1 Add-form (No Card), Add-form01 (use corp card)
                                                    aForm2Add = "Add-form" + (aaCARDIDaa === "" ? "" : "01")
                                                    aFormConfirm = "aConfirm" + (aaCARDIDaa === "" ? "" : "01");
                                                }
                                                let aFormExit = "Add-popupexit" + (CHK_PRE_V ? "PRE" : "");
                                                let aDataGridForm = CHK_PRE_V ? "Add-dxDataGridPRE" : "Add-dxDataGrid"

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
                                                            $("<p><div id='" + aForm2Add + "'></div></p>"),   // check corporate card
                                                            // $("<span style='padding: 0px 8px;'></span>").text(" "),
                                                            // $("<span id='Add-Upload'></span>"),
                                                            // $("<span style='padding: 0px 5px;'></span>").text(" "),
                                                            // $("<span id='Add-ViewFile_OO'></span>"),
                                                        );

                                                        // Conditional part
                                                        if (CHK_TRF_V) {
                                                            $container.append(
                                                                $("<span style='padding: 0px 8px;'></span>").text(" "),
                                                                $("<span id='Add-Upload'></span>"),
                                                                $("<span style='padding: 0px 5px;'></span>").text(" "),
                                                                $("<span id='Add-ViewFile_OO'></span>"),
                                                                $("<p><div id='" + aDataGridForm + "'></div></p>"),
                                                                $("<span id='" + aFormExit + "'></span>"),
                                                                $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                                $("<span id='" + aFormConfirm + "'></span>")
                                                            );
                                                        } else {
                                                            $container.append(
                                                                //$("<p><div id='" + aDataGridForm + "'></div></p>"),
                                                                $("<span style='padding: 0px 8px;'></span>").text(" "),
                                                                $("<span id='Add-Upload'></span>"),
                                                                $("<span style='padding: 0px 5px;'></span>").text(" "),
                                                                $("<span id='Add-ViewFile_OO'></span>"),
                                                                $("<span style='padding: 0px 20px;'></span>").text(" "),
                                                                $("<span id='" + aFormExit + "'></span>"),
                                                                $("<span style='padding: 5px 5px;'></span>").text(" "),
                                                                $("<span id='" + aFormConfirm + "'></span>"),
                                                                $("<span style='padding: 5px 5px;'></span>").text(" "),
                                                                $("<span id='aUXLSXPRE'></span>"),
                                                                // $("<span style='display:flex; justify-content:flex-end; gap:15px; padding:5px;'>")
                                                                //     .append($("<span id='" + aFormExit + "'></span>"))
                                                                //     .append($("<span id='" + aFormConfirm + "'></span>")),
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

                                                $("#Add-ViewFile").dxButton({
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
                                                                //showViewerUrl(result[0].url);
                                                                showFileSelectionPopup(result);
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
                                                // function formViewerUrl(filename) {
                                                //     try {
                                                //         if (!filename) throw new Error("Filename is required");

                                                //         const baseUrl = `${aaPFDMI}/temp/uploads/`;
                                                //         const ext = filename.split('.').pop().toLowerCase();
                                                //         const fileUrl = filename;
                                                //         const fnameOnly = filename.split("/").pop();

                                                //         let viewerUrl = "";
                                                //         let viewerBody = "";

                                                //         // Decide viewer type
                                                //         if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
                                                //             viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src=" + fileUrl;
                                                //             viewerBody = `<iframe class="viewerContent" src="${viewerUrl}" style="width:100%;height:500px;border:none;"></iframe>`;
                                                //         } else if (ext === "pdf") {
                                                //             viewerUrl = fileUrl + "#view=FitH";
                                                //             viewerBody = `<iframe class="viewerContent" src="${viewerUrl}" style="width:100%;height:500px;border:none;"></iframe>`;
                                                //         } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
                                                //             viewerUrl = fileUrl;
                                                //             viewerBody = `<div style="text-align:center;height:500px;overflow:auto">
                                                //                             <img class="viewerContent" src="${viewerUrl}" style="max-width:100%;height:auto"/>
                                                //                           </div>`;
                                                //         } else {
                                                //             viewerUrl = fileUrl + "?t=" + Date.now();
                                                //             viewerBody = `<iframe class="viewerContent" src="${viewerUrl}" style="width:100%;height:500px;border:none;"></iframe>`;
                                                //         }

                                                //         // Toolbar with zoom dropdown
                                                //         const toolbarHtml = `
                                                //             <div style="display:flex; justify-content:space-between; align-items:center; font-weight:bold; font-size:16px; margin-bottom:8px;">
                                                //                 <div>File Preview: ${fnameOnly}</div>
                                                //                 <div>
                                                //                     <label for="zoomSelect">Zoom:</label>
                                                //                     <select id="zoomSelect">
                                                //                         <option value="50">50%</option>
                                                //                         <option value="60">60%</option>
                                                //                         <option value="70">70%</option>
                                                //                         <option value="80">80%</option>
                                                //                         <option value="90">90%</option>
                                                //                         <option value="100" selected>100%</option>
                                                //                         <option value="120">120%</option>
                                                //                     </select>
                                                //                 </div>
                                                //             </div>
                                                //         `;

                                                //         const contentHtml = `
                                                //             <div style="border:1px solid #ccc; padding:8px; margin-top:10px;">
                                                //                 ${toolbarHtml}
                                                //                 <div id="viewerWrapper" style="width:100%; height:500px; overflow:auto;">
                                                //                     ${viewerBody}
                                                //                 </div>
                                                //             </div>
                                                //         `;

                                                //         const viewerContainer = $("#customViewerArea");
                                                //         if (viewerContainer.length) {
                                                //             viewerContainer.empty().append(contentHtml);

                                                //             // Attach zoom event AFTER rendering
                                                //             document.getElementById("zoomSelect").addEventListener("change", function () {
                                                //                 applyZoom(this.value);
                                                //             });
                                                //         } else {
                                                //             console.warn("Viewer container not found: #customViewerArea");
                                                //         }

                                                //     } catch (error) {
                                                //         console.error("Error in formViewerUrl:", error);
                                                //         DevExpress.ui.dialog.alert("Unable to open the file. Please try again.", "Error");
                                                //     }
                                                // }

                                                // // Zoom function
                                                // function applyZoom(percent) {
                                                //     const wrapper = document.getElementById("viewerWrapper");
                                                //     const content = wrapper.querySelector(".viewerContent");

                                                //     if (content) {
                                                //         const zoom = parseInt(percent, 10);

                                                //         if (content.tagName.toLowerCase() === "iframe") {
                                                //             // Resize iframe by percentage
                                                //             content.style.width = zoom + "%";
                                                //             content.style.height = (zoom * 5) + "px"; 
                                                //             // Example: 100% → 500px, 120% → 600px
                                                //         }

                                                //         if (content.tagName.toLowerCase() === "img") {
                                                //             // Resize image by percentage
                                                //             content.style.width = zoom + "%";
                                                //             content.style.height = "auto";
                                                //         }
                                                //     }
                                                // }



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

                                                $("#aConfirm").dxButton({
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

                                                $("#aConfirm01").dxButton({
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

                                                const aform = $("#Add-form").dxForm({
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

                                                const aform01 = $("#Add-form01").dxForm({
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
                                                                        readOnly: false,
                                                                        dataSource: cardIdOptions,
                                                                        valueExpr: "CardID",
                                                                        displayExpr: "Label",
                                                                        searchEnabled: true,
                                                                        value: asPBatchNo,
                                                                        onValueChanged: function (e) {
                                                                            asPBatchNo = e.value;
                                                                        },
                                                                    },
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

                                                const aAddStaff = $("#Add-dxDataGrid").dxDataGrid({

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
                                                    readOnly: aViewF, //true e.row.data.Confirmed
                                                    items: [
                                                        {
                                                            itemType: "group",
                                                            colCount: 8,
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
                                                                {
                                                                    dataField: "ReqDate",
                                                                    label: { text: "Requested Date" },
                                                                    editorType: "dxDateBox",
                                                                    editorOptions: { displayFormat: "dd/MM/yyyy", width: 150, readOnly: true },//showClearButton: true, value: idDate, 
                                                                    cssClass: "verylight-blue",
                                                                    colSpan: 1,
                                                                },
                                                                {
                                                                    dataField: "PBatchNo",
                                                                    label: { text: "Corporate Card", cssClass: "custom-label" },
                                                                    editorType: "dxSelectBox",
                                                                    editorOptions: {
                                                                        width: 180,
                                                                        //showClearButton: true,
                                                                        readOnly: false,
                                                                        dataSource: cardIdOptions,
                                                                        valueExpr: "CardID",
                                                                        displayExpr: "Label",
                                                                        searchEnabled: true,
                                                                        value: asPBatchNo,
                                                                        onValueChanged: function (e) {
                                                                            asPBatchNo = e.value;
                                                                        },
                                                                    },
                                                                    visible: HAVECORPCARD,
                                                                    cssClass: "verylight-blue",
                                                                    colSpan: 1,
                                                                },
                                                                {
                                                                    dataField: "ERStatus",
                                                                    label: { text: "STATUS" },
                                                                    editorType: "dxTextBox",
                                                                    width: 190,
                                                                    editorOptions: { Width: 190, readOnly: true },
                                                                    //cssClass: "verylight-blue",
                                                                    visible: true,
                                                                    colSpan: 1,
                                                                },
                                                                // {
                                                                //     itemType: "empty",
                                                                //     colSpan: 3,
                                                                // },
                                                            ]
                                                        },
                                                        {
                                                            itemType: "group",
                                                            colCount: 8,
                                                            items: [
                                                                {
                                                                    dataField: "ERODate02",
                                                                    label: { text: "Period" },
                                                                    editorType: "dxDateBox",
                                                                    editorOptions: {
                                                                        displayFormat: "dd/MM/yyyy",
                                                                        width: 150,
                                                                    },
                                                                    cssClass: "verylight-blue",
                                                                    showClearButton: true,
                                                                    colSpan: 1,
                                                                    validationRules: [{ type: "required", message: "Period is required" }]
                                                                },
                                                                {
                                                                    dataField: "ERORefNo1",
                                                                    label: { text: "Client Group" },
                                                                    width: 180,
                                                                    editorType: "dxDropDownBox",
                                                                    editorOptions: {
                                                                        dataSource: aObjects.UniqueCashAdvanceClient,
                                                                        valueExpr: "CompanyGroup",
                                                                        displayExpr: "CompanyGroup",
                                                                        width: 180,   // input box width
                                                                        dropDownOptions: {
                                                                            width: 350   // popup width
                                                                        },
                                                                        contentTemplate: function (e) {
                                                                            return $("<div>").dxDataGrid({
                                                                                dataSource: aObjects.UniqueCashAdvanceClient,
                                                                                columns: [
                                                                                    { dataField: "CompanyGroup", caption: "Group", width: 200 },
                                                                                    //{ dataField: "CompanyName", caption: "Company", width: 400 },
                                                                                    { dataField: "CashAdvance", caption: "Limit", width: 100, dataType: "number", format: { type: "fixedPoint", precision: 2 } }, // gives 12,345.67 }
                                                                                ],
                                                                                paging: { enabled: true, pageSize: 15 },
                                                                                searchPanel: { visible: true },
                                                                                headerFilter: { visible: true },
                                                                                filterRow: { visible: true },
                                                                                showBorders: true,
                                                                                showColumnLines: true,
                                                                                scrolling: { mode: "virtual" },
                                                                                selection: { mode: "single" },
                                                                                height: 550,
                                                                                onSelectionChanged: function (sArgs) {
                                                                                    e.component.option("value", sArgs.selectedRowKeys[0].CompanyGroup);
                                                                                    if (sArgs.selectedRowKeys.length > 0) {
                                                                                        e.component.close();
                                                                                    }
                                                                                }
                                                                            });
                                                                        },

                                                                        onValueChanged: function (e) {
                                                                            const matchedClient = aObjects.UniqueCashAdvanceClient.find(
                                                                                item => item.CompanyGroup === e.value
                                                                            );
                                                                            const form = $("#Add-formPRE").dxForm("instance");
                                                                            form.updateData("EROAmount1", matchedClient ? matchedClient.CashAdvance : null);
                                                                            form.updateData("ERODesc02", matchedClient ? matchedClient.CompanyGroup : null);
                                                                        }

                                                                    },
                                                                    cssClass: "verylight-blue",
                                                                    visible: true,
                                                                    colSpan: 1,
                                                                    validationRules: [{ type: "required", message: "Client is required" }]
                                                                },
                                                                {
                                                                    dataField: "EROAmount1", //"RefundedAmount", //"ERODesc03", //ERORefNo1
                                                                    label: { text: "Limit Amount for this Client" },
                                                                    dataType: "number",   // use "number" here, not "dxNumberBox"
                                                                    format: { type: "fixedPoint", precision: 2 },
                                                                    editorType: "dxNumberBox",
                                                                    editorOptions: {
                                                                        //format: "#,##0.00",
                                                                        format: { type: "fixedPoint", precision: 2 }, // → 12,345.67
                                                                        width: 150,
                                                                        elementAttr: { class: "right-align-number" },
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
                                                                    editorType: "dxNumberBox",
                                                                    hint: "Advance Amount can not be zero !!!",
                                                                    editorOptions: {
                                                                        format: "#,##0.00", width: 150, elementAttr: { class: "right-align-number" },
                                                                        hint: "Advance Amount can not be zero !!!",
                                                                        // onValueChanged: function (e) {
                                                                        //     asRefundedAmount = e.value;
                                                                        // }
                                                                        onValueChanged: function (e) {
                                                                            asRefundedAmount = e.value;
                                                                            const form = $("#Add-formPRE").dxForm("instance");

                                                                            // get the whole formData object
                                                                            const data = form.option("formData");

                                                                            // access EROAmount2 value
                                                                            const advanceAmt = data.EROAmount2;
                                                                            //alert(advanceAmt)
                                                                            // example: update another field using both values
                                                                            form.updateData("EROAmount4", advanceAmt - e.value);
                                                                            form.repaint()
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
                                                                    dataField: "EROAmount4", //"RefundedAmount", //"ERODesc03", //ERORefNo1
                                                                    label: { text: "B/F" },
                                                                    dataType: "number",   // use "number" here, not "dxNumberBox"
                                                                    format: { type: "fixedPoint", precision: 2 },
                                                                    editorType: "dxNumberBox",
                                                                    editorOptions: {
                                                                        format: { type: "fixedPoint", precision: 2 }, // → 12,345.67
                                                                        width: 150,
                                                                        elementAttr: { class: "right-align-number" },
                                                                        hint: "B/F is greater than zero !!!",
                                                                        readOnly: true,
                                                                    },
                                                                    cssClass: "verylight-blue",
                                                                    colSpan: 1,
                                                                    validationRules: [{ type: "required" }, {
                                                                        type: "range",
                                                                        min: 0, //aYearStrS
                                                                        max: 9999999, //aYearStrL
                                                                        message: "Please ensure that the B/F is entered and is greater than zero.",
                                                                    }],
                                                                    visible: false,
                                                                },
                                                                {
                                                                    dataField: "ERODesc03", //ERORefNo1
                                                                    label: { text: "Cash Advance Reason" }, //,cssClass: "bold-label" }, Purpose of Trip
                                                                    editorType: "dxTextArea",
                                                                    width: 400,
                                                                    height: 60,
                                                                    editorOptions: {
                                                                        width: 400,
                                                                        height: 60,
                                                                        onValueChanged: function (e) {
                                                                            asERODesc03 = e.value;
                                                                        }
                                                                    },
                                                                    cssClass: "verylight-blue",
                                                                    visible: true,
                                                                    validationRules: [{ type: "required", message: "Reason is required" }],
                                                                    colSpan: 3,
                                                                },
                                                                // {
                                                                //     itemType: "empty",
                                                                //     colSpan: 2,
                                                                // },

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

                                                    ],

                                                }).dxForm("instance");

                                                const aAddClient = $("#Add-dxDataGridPRE").dxDataGrid({
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
                                                            $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
                                                        },
                                                        update: function (key, values) {
                                                            if (key.slice(-3) === "001") {
                                                                let obj = values; //JSON.stringify(values); //{"EROCode04": "NO"};
                                                                const aKey = Object.keys(obj)[0];
                                                                const aVal = obj[aKey];
                                                                iData[aKey] = aVal;
                                                            }
                                                            var ObjKeyData = { [aaKeyField]: $.trim(key) };   //[aaKeyField] key.trim
                                                            var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                                            sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                            // Refresh the DataGrid after the update is successful
                                                            $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
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
                                                        // columns.forEach(function (column) {
                                                        //     if (column.dataField === "PSPvDate") {
                                                        //         column.visible = asEROCheck01; //false asEROCheck01
                                                        //     }
                                                        //     if (column.caption === "ROAMING INFORMATION") { //HR Arrange for Roaming
                                                        //         column.visible = asEROCheck02;
                                                        //     }
                                                        // });
                                                    },
                                                    onInitNewRow: function (e) {
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
                                                            title: "Pre-Approved Form Info",
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
                                                                                $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
                                                                                $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
                                                                                $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
                                                                                if (aFrecN === 1) {
                                                                                    $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
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
                                                                        const aadataGrid = $("#Add-dxDataGridPRE").dxDataGrid("instance");
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

                                                                                $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
                                                                                $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
                                                                                $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
                                                                                $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();

                                                                            })
                                                                            .catch(e => {
                                                                                console.log(e);
                                                                            })
                                                                        $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
                                                                        $("#Add-dxDataGridPRE").dxDataGrid("instance").refresh();
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
                                                            caption: "Full name (Vendor02)*",
                                                            editorType: "dxTextBox",
                                                            width: 180,
                                                            height: 80,
                                                            editorOptions: { width: 180, height: 80, },
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "EROCode01",
                                                            caption: "Department EROCode01",
                                                            width: 120,
                                                            editorType: "dxTextBox",
                                                            editorOptions: { width: 150, },
                                                            visible: true,
                                                        },
                                                        {
                                                            dataField: "EROCode06",
                                                            caption: "Passport No EROCode06",
                                                            width: 200,
                                                            editorType: "dxTextBox",
                                                            editorOptions: { width: 200, },
                                                            visible: false,
                                                        },
                                                        {
                                                            dataField: "PSPvDate",
                                                            caption: "Send Passport PSPvDate*",
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
                                                            visible: false,
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
                                                                    visible: false,
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
                                                            visible: false,
                                                        },
                                                        {
                                                            dataField: "EROAmount2",
                                                            caption: "Ticket Price",
                                                            dataType: "number",
                                                            format: { type: "fixedPoint", precision: 2 },
                                                            editorType: "dxNumberBox",
                                                            editorOptions: { format: "#,##0.00", width: 120 },
                                                            width: 110,
                                                            visible: false,
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
                                                            visible: false,
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
                                                                // let aaHODEmail4Chk = "";
                                                                // let aaHODName4Chk = "";
                                                                // let aaHODRange4Chk = "";

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
                                                                // if (aaiFoundApp === true && aaHODApprover.length > 1) {
                                                                //     nnAdno = nnAdno + 1
                                                                // }
                                                                // for (let i = nnAdno; i < aaHODApprover.length; i++) {
                                                                //     if (aaTotalReim <= aaHODApprover[i].LRange02) {
                                                                //         aaHODEmail4Chk = aaHODEmail4Chk + "|" + aaHODApprover[i].ApproverEmail + "|"
                                                                //         aaHODName4Chk = aaHODName4Chk + "|" + aaHODApprover[i].ApproverName + "|"
                                                                //         aaHODRange4Chk = aaHODRange4Chk + aaHODApprover[i].LRange02
                                                                //         nnLno = i
                                                                //         break;
                                                                //     } else {
                                                                //         aaHODEmail4Chk = aaHODEmail4Chk + "|" + aaHODApprover[i].ApproverEmail + "|" + ","
                                                                //         aaHODName4Chk = aaHODName4Chk + "|" + aaHODApprover[i].ApproverName + "|" + ","
                                                                //         aaHODRange4Chk = aaHODRange4Chk + aaHODApprover[i].LRange02 + ","
                                                                //     }
                                                                // }
                                                                // Initialize arrays to collect values
                                                                // Initialize arrays to collect values
                                                                let hodEmails = [];
                                                                let hodNames = [];
                                                                let hodRanges = [];

                                                                if (aaiFoundApp === true && aaHODApprover.length > 1) {
                                                                    nnAdno += 1;
                                                                }

                                                                for (let i = nnAdno; i < aaHODApprover.length; i++) {
                                                                    const approver = aaHODApprover[i];

                                                                    hodEmails.push(`|${approver.ApproverEmail}|`);
                                                                    hodNames.push(`|${approver.ApproverName}|`);
                                                                    hodRanges.push(approver.LRange02);

                                                                    if (aaTotalReim <= approver.LRange02) {
                                                                        nnLno = i;
                                                                        break;
                                                                    }
                                                                }

                                                                // Build string without trailing commas
                                                                const aaHODEmail4Chk = `MAIL:[${hodEmails.join(",")}]`;
                                                                const aaHODName4Chk = `NAME:[${hodNames.join(",")}]`;
                                                                const aaHODRange4Chk = `RANG:[${hodRanges.join(",")}]`;

                                                                // Combine into one string
                                                                const aaHODAll4Chk = `${aaHODName4Chk} ${aaHODEmail4Chk} ${aaHODRange4Chk}`;
                                                                //alert(aaHODAll4Chk)
                                                                // Now it's safe to parse
                                                                const result = aTranTextJson(aaHODAll4Chk);
                                                                console.log("Parsed JSON:", result);

                                                                //alert(result)
                                                                // =============================================================

                                                                // let aaHODAll4Chk = "NAME:[" + aaHODName4Chk + "] MAIL:[" + aaHODEmail4Chk + "] RANG:[" + aaHODRange4Chk + "]";
                                                                //alert(aaHODAll4Chk)
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
                                                                            // หลังจาก popup ถูกสร้าง
                                                                            $(".dx-dialog").dxPopup("instance").option("position", {
                                                                                my: "center",
                                                                                at: "center",
                                                                                of: window,
                                                                                offset: "0 -50"   // เลื่อนขึ้น 50px
                                                                            });
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

                                                $("#aConfirmPREoo").dxButton({
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
                                                            //alert(aObjRowData)
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
                                                            //alert(aDivSxx)
                                                            let aFieldSelectedxx = "HeadRefNo,RefundedAmount,EROCheck01,EROAmount1" //ExtraOnLine].[dbo].[EXPREIM_400] TotalReimburse,
                                                            let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.TRVREQF " + aDivSxx; //alert(aFullBody)  Estimated Amount                                         
                                                            //console.log(aFullBodyxx, aaHODApprover);
                                                            fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                                .then(response => response.json())
                                                                //
                                                                .then(ppData => {
                                                                    var aaTotalValue = ppData;
                                                                    var aaTotalReim = aaTotalValue[0].RefundedAmount //TotalReimburse
                                                                    // use Client Cash Advance Limit for HOD Range
                                                                    // alert(ppData[0].RefundedAmount)
                                                                    // alert(aaTotalReim) 
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
                                                                    //alert(aaHODAll4Chk)
                                                                    var xxChkEmailxx = aTranTextJson(aaHODAll4Chk, "MAIL:", "RANG:")
                                                                    var xxChkNamexx = aTranTextJson(aaHODAll4Chk, "NAME:", "MAIL:")
                                                                    var xxChkRangexx = aTranTextJson(aaHODAll4Chk, "RANG:", "")
                                                                    var xxChkLenxx = xxChkNamexx.length;
                                                                    //console.log(aaHODAll4Chk)
                                                                    //console.log(xxChkNamexx, xxChkEmailxx, xxChkRangexx)

                                                                    // send mail to first Approver 
                                                                    aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                                    aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail;
                                                                    //alert(aaHODAppName)
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
                                                                                    //alert(aObjRowData)
                                                                                    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of 
                                                                                    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                                    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                                    //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704' ERORefNo6
                                                                                    let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                                    aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();

                                                                                    const fileUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/FlexibleIME.xlsx";
                                                                                    const filename = iData.HeadRefNo + ".xlsx";

                                                                                    // Build replacements dynamically
                                                                                    const replacements = {
                                                                                        approver1: iData.PayToName,   // requester name from your grid row
                                                                                        datenowR: new Date().toLocaleDateString("en-GB") // today's date in dd/MM/yyyy
                                                                                    };
                                                                                    alert(JSON.stringify(replacements, null, 2));

                                                                                    UpdatePHExcel(fileUrl, filename, replacements);

                                                                                    //send Email
                                                                                    var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() //+ " TRAVEL REQUISITION ";
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
                                                // ปุ่ม CONFIRM
                                                $("#aConfirmPREvnew").dxButton({
                                                    hint: "Confirm and send to HOD",
                                                    icon: "fas fa-check-circle",
                                                    type: "success",
                                                    text: "CONFIRM",
                                                    visible: aViewG,
                                                    onClick: async function (e) {
                                                        try {
                                                            const validationResult = formPRE.validate();
                                                            if (!validationResult.isValid) {
                                                                DevExpress.ui.dialog.alert("Form is invalid. Please correct the errors.", "VALIDATION ERROR");
                                                                return;
                                                            }

                                                            const result = $("#Add-formPRE").dxForm("instance").validate();
                                                            if (!result.isValid) {
                                                                DevExpress.ui.dialog.alert("Required Fields not valid, please check", "VALIDATION ERROR");
                                                                return;
                                                            }

                                                            aaHODApprover = aaaHODApprover;
                                                            const aObjRowData = JSON.stringify(iData);

                                                            // ✅ ใช้ async/await สำหรับ sendRequestNew
                                                            const response = await sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                            console.log("Update response:", response);

                                                            if (response?.success) {
                                                                const grid = $("#gridContainer").dxDataGrid("instance");
                                                                await grid.getDataSource().reload();
                                                                grid.refresh();
                                                            } else {
                                                                console.error("Update failed:", response?.error);
                                                            }

                                                            // ✅ เรียก handleConfirmClick ก่อนถึงส่วนส่งเมล
                                                            await handleConfirmClick(iData);

                                                            // -------------------------
                                                            // Send mail (workflow เดิม)
                                                            // -------------------------
                                                            const aDivSxx = `Where REFNO = '${aaiHeadRef}-001'`;
                                                            const aFieldSelectedxx = "HeadRefNo,RefundedAmount,EROCheck01,EROAmount1";
                                                            const aFullBodyxx = `Select ${aFieldSelectedxx} From ExtraOnLine.dbo.TRVREQF ${aDivSxx}`;

                                                            const ppResponse = await fetch(
                                                                `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232`,
                                                                {
                                                                    method: "POST",
                                                                    headers: { "Content-Type": "application/json" },
                                                                    body: JSON.stringify({ "@": btoa(aFullBodyxx) }),
                                                                    redirect: "follow"
                                                                }
                                                            );

                                                            const ppData = await ppResponse.json();
                                                            const aaTotalValue = ppData;
                                                            const aaTotalReim = aaTotalValue[0].RefundedAmount;
                                                            const baseAmt = aaTotalValue[0].EROAmount1;

                                                            if (aaHODApprover?.[0]) aaHODApprover[0].LRange02 = baseAmt;
                                                            if (aaHODApprover?.[1]) aaHODApprover[1].LRange02 = baseAmt + 0.01;

                                                            const aaCheckOverseas = aaTotalValue[0].EROCheck01 ? "TRFO" : "HOD";
                                                            if (aaCheckOverseas === "TRFO") {
                                                                aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "TRFO");
                                                            } else {
                                                                aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "HOD");
                                                            }

                                                            const approver = aaHODApprover.find(item => $.trim(item.ApproverName) === $.trim(asFullName)) || aaHODApprover[0];
                                                            aaHODAppName = approver?.ApproverName;
                                                            aaHODAppEmail = approver?.ApproverEmail;

                                                            const getvalues = { aaCheckOverseas, aaHODAppName, aaHODAppEmail };
                                                            const aTrfAlert02 = aVARs.ALERT02.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                            await DevExpress.ui.dialog.confirm(aTrfAlert02, "CONFIRM TO HOD");

                                                        } catch (err) {
                                                            console.error("Error in CONFIRM:", err);
                                                            DevExpress.ui.notify("Processing failed.", "error", 2000);
                                                        }
                                                    }
                                                });

                                                $("#aConfirmPRE").dxButton({
                                                    hint: "Confirm and send to HOD",
                                                    icon: "fas fa-check-circle",
                                                    type: "success",
                                                    text: "CONFIRM",
                                                    visible: aViewG, //true,false
                                                    onClick: async function (e) {
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
                                                        // validation
                                                        var aBookingOptions = iData.EROCheck03 ? `SELF BOOKING [REQ->HOD${iData.EROCheck02 ? "->HR" : ""}]` : `ADMIN BOOKING [REQ->HOD->ADMIN${iData.EROCheck02 ? "->HR" : ""}]`
                                                        var result = $("#Add-formPRE").dxForm("instance").validate(); //Add-dxDataGrid
                                                        if (!result.isValid) { DevExpress.ui.dialog.alert("Required Fields not valid, please check", "VALIDATION ERROR") } else {
                                                            aaHODApprover = aaaHODApprover
                                                            let aObjRowData = JSON.stringify(iData); //EROCode04
                                                            console.log("Update when Confirm ", aObjRowData)
                                                            //alert(aObjRowData)
                                                            await sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                                //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                                //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
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
                                                            let aDivSxx = "Where REFNO = '" + aaiHeadRef + "-001'" //HeadRefNo Check RefundedAmount for the first record only
                                                            //alert(aDivSxx)
                                                            let aFieldSelectedxx = "HeadRefNo,RefundedAmount,EROCheck01,EROAmount1" //ExtraOnLine].[dbo].[EXPREIM_400] TotalReimburse,
                                                            let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.TRVREQF " + aDivSxx; //alert(aFullBody)  Estimated Amount                                         
                                                            //console.log(aFullBodyxx, aaHODApprover);
                                                            fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                                .then(response => response.json())
                                                                //
                                                                .then(ppData => {
                                                                    var aaTotalValue = ppData;
                                                                    var aaTotalReim = aaTotalValue[0].RefundedAmount || 0; //TotalReimburse
                                                                    var aaLimitAmount = aaTotalValue[0].EROAmount1 || 0;

                                                                    const baseAmt = aaTotalValue[0].EROAmount1; // Limit Amount LRange02 Last HOD
                                                                    if (aaHODApprover?.[0]) aaHODApprover[0].LRange02 = baseAmt;
                                                                    if (aaHODApprover?.[1] && aaHODApprover[1] !== 0) aaHODApprover[1].LRange02 = baseAmt + 0.01;
                                                                    var aaCheckOverseas = aaTotalValue[0].EROCheck01 ? "TRFO" : "HOD";

                                                                    var aaChkA = aaHODApprover.filter(item => item.ApproverCode === "TRFO")
                                                                    if (aaCheckOverseas === 'TRFO') {
                                                                        if (aaChkA.length > 0) {
                                                                            aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "TRFO");
                                                                        }
                                                                    } else if (aaCheckOverseas === 'HOD') {
                                                                        if (aaChkA.length > 0) {
                                                                            aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "HOD");
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

                                                                    // send mail to first Approver 
                                                                    //aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                                    //aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail;

                                                                    // Names
                                                                    const aaHODAppName = (xxChkNamexx && xxChkNamexx[0]) ? xxChkNamexx[0] : "";
                                                                    const aaHODAppName1 = (xxChkNamexx && xxChkNamexx[1]) ? xxChkNamexx[1] : "";
                                                                    const aaHODAppName2 = (xxChkNamexx && xxChkNamexx[2]) ? xxChkNamexx[2] : "";

                                                                    // Emails
                                                                    const aaHODAppEmail = (xxChkEmailxx && xxChkEmailxx[0]) ? xxChkEmailxx[0] : "";
                                                                    const aaHODAppEmail1 = (xxChkEmailxx && xxChkEmailxx[1]) ? xxChkEmailxx[1] : "";
                                                                    const aaHODAppEmail2 = (xxChkEmailxx && xxChkEmailxx[2]) ? xxChkEmailxx[2] : "";

                                                                    // Count
                                                                    const aaHODCount = (xxChkNamexx) ? xxChkNamexx.length : 0;
                                                                    // Show in 
                                                                    const aADVAMT = aaTotalReim.toLocaleString("en-US", {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2
                                                                    });
                                                                    const aTHT = aVARs.THTITLE;
                                                                    const aLIMITAMT = aaLimitAmount.toLocaleString("en-US", {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2
                                                                    });;
                                                                    const aOLMT = (((aaLimitAmount - aaTotalReim) > 0) ? " " : "[OVER LIMIT]") || " "
                                                                    const aHODApp =
                                                                        xxChkLenxx === 1
                                                                            ? `${aTHT}${aaHODAppName}(${aaHODAppEmail})`
                                                                            : xxChkLenxx === 2
                                                                                ? `${aTHT}${aaHODAppName}(${aaHODAppEmail}), ${aTHT}${aaHODAppName1}(${aaHODAppEmail1})`
                                                                                : xxChkLenxx === 3
                                                                                    ? `${aTHT}${aaHODAppName}(${aaHODAppEmail}), ${aTHT}${aaHODAppName1}(${aaHODAppEmail1}), ${aTHT}${aaHODAppName2}(${aaHODAppEmail2})`
                                                                                    : "";

                                                                    //alert(aHODApp)
                                                                    // Check empty fields
                                                                    //alert(aaHODAll4Chk)
                                                                    let ToNames = AddTitle(aaHODAll4Chk, aTHT)
                                                                    //alert(ToNames)
                                                                    //let aApproverName = aaHODAppName
                                                                    var aDatabasea = "ExtraOnLine.dbo.TRVREQF";
                                                                    var aKeyField = "HeadRefNo" //"HeadRefNo"; "REFNO"
                                                                    var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724" +"-001" 
                                                                    var aRefNoa = aaiHeadRef
                                                                    var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";

                                                                    let aaCondition = item =>
                                                                        (item.ID === 1 && (item.ERODesc01 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROAmount1 === 0 || item.ERODesc03 === ""))

                                                                    var condition = aaCondition
                                                                    aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                                        .then(atestCehcka => {
                                                                            //let getvalues = { aaCheckOverseas: aaCheckOverseas, aaHODAppName: aaHODAppName, aaHODAppEmail: aaHODAppEmail, xxChkLenxx: xxChkLenxx, aBookingOptions: aBookingOptions }
                                                                            let getvalues = {
                                                                                //aApproverName: aApproverName,
                                                                                aaOnInitExpGroupDesc: aaOnInitExpGroupDesc,
                                                                                aRefNoa: aRefNoa,
                                                                                //aAddress2Do: aAddress2Do,
                                                                                //aRequesterName: aRequesterName,
                                                                                aBookingOptions: aBookingOptions,
                                                                                xxChkLenxx: xxChkLenxx,

                                                                                // เพิ่มชื่อและอีเมล
                                                                                aaHODAppName: aaHODAppName,
                                                                                aaHODAppName1: aaHODAppName1,
                                                                                aaHODAppName2: aaHODAppName2,

                                                                                aaHODAppEmail: aaHODAppEmail,
                                                                                aaHODAppEmail1: aaHODAppEmail1,
                                                                                aaHODAppEmail2: aaHODAppEmail2,

                                                                                // เพิ่ม count
                                                                                aaHODCount: aaHODCount,
                                                                                aHODApp: aHODApp,
                                                                                aADVAMT: aADVAMT,
                                                                                aLIMITAMT: aLIMITAMT,
                                                                                aOLMT: aOLMT

                                                                            };
                                                                            let aTrfAlert02 = aVARs.ALERT02PRE.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                            let result = DevExpress.ui.dialog.confirm(aTrfAlert02, "CONFIRM TO HOD");

                                                                            result.done(async function (dresult) {//                                                                                                                                                                                                                    
                                                                                if (dresult) {
                                                                                    let aFREF = aaiHeadRef + "-001"
                                                                                    let aERStatus = "Confirmed wait for HOD" //"Register"
                                                                                    let aTrueORFalse = '1'
                                                                                    let aTrueORFalseB = true
                                                                                    let aNowDateT = aaNowText(aNowDte)
                                                                                    var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus, ReqDate: aNowDte };
                                                                                    var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                                    //alert(aObjRowData)
                                                                                    await sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of 
                                                                                    //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                                    //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO

                                                                                    let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                                    aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                    //let uiData = $.extend({}, iData, aObjKeyData);
                                                                                     
                                                                                    ULbCustomerGrp(iData, ToNames) // update excel file
                                                                                    //send Email
                                                                                    var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() //+ " TRAVEL REQUISITION ";
                                                                                    let aApproverName = aaHODAppName //+ ", [HOD]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                                    let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                                    let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                                    let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"

                                                                                    var aSubject = aaMailTitle
                                                                                    let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                                    let aAddress2Do = `<a href='${aaPFDMI}/XOL/index.html'>${aaOnInitExpGroupDesc}</a>`;
                                                                                    //let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName, aBookingOptions: aBookingOptions }
                                                                                    // รวมทั้งหมดเข้าไปใน getvalues
                                                                                    let getvalues = {
                                                                                        aApproverName: aApproverName,
                                                                                        aaOnInitExpGroupDesc: aaOnInitExpGroupDesc,
                                                                                        aRefNoa: aRefNoa,
                                                                                        aAddress2Do: aAddress2Do,
                                                                                        aRequesterName: aRequesterName,
                                                                                        aBookingOptions: aBookingOptions,
                                                                                        xxChkLenxx: xxChkLenxx,

                                                                                        // เพิ่มชื่อและอีเมล
                                                                                        aaHODAppName: aaHODAppName,
                                                                                        aaHODAppName1: aaHODAppName1,
                                                                                        aaHODAppName2: aaHODAppName2,

                                                                                        aaHODAppEmail: aaHODAppEmail,
                                                                                        aaHODAppEmail1: aaHODAppEmail1,
                                                                                        aaHODAppEmail2: aaHODAppEmail2,

                                                                                        // เพิ่ม count
                                                                                        aaHODCount: aaHODCount
                                                                                    };
                                                                                    let aMessage01 = aArrays.ACONFIRM[2].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                                    var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                                    aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();

                                                                                    //aMessageAlert("Already Confirmed & send mail to Approver " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                                    aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                                    popup.hide();
                                                                                }
                                                                            });
                                                                        }); // then check                                                                 
                                                                });
                                                        }
                                                    } // validationrule
                                                });

                                                $("#aUXLSXPRE").dxButton({
                                                    hint: "TEST UPDATE EXCEL",
                                                    icon: "fas fa-check-circle",
                                                    type: "success",
                                                    text: "UPDATE",
                                                    visible: false, //aViewG, // true,false
                                                    onClick: async function (e) {
                                                        ULbCustomerGrp(iData)
                                                        if (false) {
                                                        try {
                                                            //ULbCustomerGrp(iData.ERORefNo1, iData)

                                                            //njsonDataSum.push(iData);        // เพิ่ม object เข้าไป
                                                            // แปลง array เป็น JSON string
                                                            //const previewStr = JSON.stringify(njsonDataSum);
                                                            // โชว์แค่ 200 ตัวแรก + ความยาวทั้งหมด
                                                            //alert("Preview JSON string:\n\n" + previewStr.substring(0, 200) + "...\n\nLength: " + previewStr.length);
                                                            // 2) Convert JSON string -> Buffer
                                                            const customerGroupName = iData.ERORefNo1;
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
                                                            const groupRecord = iData;
                                                            // if (!groupRecord) {
                                                            //     return alert(`No records found for ${customerGroupName}`);
                                                            // }

                                                            let lOverLimit = (groupRecord.RefundedAmount > groupRecord.EROAmount1);
                                                            //let lOverLimit = (iData.RefundedAmount > iData.EROAmount1)
                                                            //alert(`Processing ${customerGroupName}`);
                                                            //alert(`${iData.RefundedAmount} > ${iData.EROAmount1}`)
                                                            //alert(`${groupRecord.RefundedAmount} > ${groupRecord.EROAmount1}`)
                                                            //const cChk = "N";

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
                                                                preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" };
                                                                preparedRow.getCell(3).font = { bold: true };
                                                                preparedRow.getCell(3).border = { bottom: { style: "thin" } };

                                                                preparedRow.getCell(5).value = "Approved by";
                                                                preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" };
                                                                preparedRow.getCell(6).font = { bold: true };
                                                                preparedRow.getCell(6).border = { bottom: { style: "thin" } };

                                                                memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                                                                const dateRow = memoSheet.getRow(summaryStartRow++);
                                                                dateRow.getCell(3).value = { formula: "DATA!E18" };
                                                                dateRow.getCell(6).value = { formula: "DATA!E16" };
                                                                //alert("OverLimit")
                                                                //alert(lOverLimit)
                                                                if (lOverLimit) {
                                                                    summaryStartRow += 2;

                                                                    const verifyRow = memoSheet.getRow(summaryStartRow++);
                                                                    //verifyRow.getCell(5).value = { formula: "DATA!C13" };
                                                                    verifyRow.getCell(5).value = "Approved by";
                                                                    verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" };
                                                                    verifyRow.getCell(6).font = { bold: true };
                                                                    verifyRow.getCell(6).border = { bottom: { style: "thin" } };

                                                                    memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                                                                    const xdateRow = memoSheet.getRow(summaryStartRow++);
                                                                    xdateRow.getCell(6).value = { formula: "DATA!C15" };
                                                                }

                                                                // Stamp DATA sheet from njsonDataSum fields
                                                                dataSheet.getCell("C1").value = groupRecord.HeadRefNo;    // PRE REF#
                                                                dataSheet.getCell("C2").value = groupRecord.ERORefNo1;    // Company Group
                                                                dataSheet.getCell("C4").value = groupRecord.EROAmount2;   // Outstanding
                                                                dataSheet.getCell("C7").value = groupRecord.RefundedAmount; // Cash Advance
                                                                //dataSheet.getCell("E5").value = groupRecord.ERODate02;    // Period
                                                                // ใช้งาน Change date to UTC
                                                                const aPeriodD = toUTCDateOnly(groupRecord.ERODate02);
                                                                const cell = dataSheet.getCell("E5");
                                                                cell.value = aPeriodD;           // ✅ เป็น Date object จริง
                                                                cell.numFmt = "dd/mm/yyyy";      // ✅ Excel จะแสดงเฉพาะวันที่

                                                                dataSheet.getCell("E6").value = groupRecord.ERODesc05;    // LOT
                                                                dataSheet.getCell("C7").value = groupRecord.EROAmount1;   // Limit C8
                                                                //if (groupRecord.Confirmed === true) {
                                                                dataSheet.getCell("C18").value = groupRecord.PayToName;   // Requester
                                                                dataSheet.getCell("C19").value = formattedDateTime;   // Requester Date
                                                                dataSheet.getCell("D18").value = formattedDateTime;   // Requester Date
                                                                //}
                                                                // Column widths
                                                                [5, 12, 35, 8, 12, 13, 22].forEach((w, i) => memoSheet.getColumn(i + 1).width = w);

                                                                // Keep only MEMO & DATA sheets
                                                                templateWb.worksheets.slice().forEach(ws => {
                                                                    if (!["MEMO", "DATA"].includes(ws.name)) templateWb.removeWorksheet(ws.id);
                                                                });
                                                                //alert("before save")
                                                                //if (cChk === "Y") {
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
                                                                    saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), fileName);
                                                                    const uploadedName = await u2pload2File(outFile);
                                                                    //if (uploadedName && typeof viewUploadedFile === "function") {
                                                                    //viewUploadedFile(uploadedName);
                                                                    //}
                                                                }

                                                                notify("success", `DL Customer Group completed for ${customerGroupName}.`, 2500);
                                                                //} // ifchk
                                                            } catch (err) {
                                                                console.error(err);
                                                                notify("error", `Failed group export for ${customerGroupName}.`, 3000);
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
                                                            DevExpress.ui.alert("Failed to transform JSON to Excel.");
                                                        }}
                                                        
                                                    }
                                                });

                                                // $("#aConfirmPRE").dxButton({
                                                //     hint: "Confirm and send to HOD",
                                                //     icon: "fas fa-check-circle",
                                                //     type: "success",
                                                //     text: "CONFIRM",
                                                //     visible: aViewG, //true,false
                                                //     // onClick: async function (e) {
                                                //     //     try {
                                                //     //         const fileUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/";
                                                //     //         const filename = `${iData.HeadRefNo}.xlsx`;

                                                //     //         // Build replacements dynamically
                                                //     //         const replacements = {
                                                //     //             requester: iData?.PayToName || "Unknown", // safe access
                                                //     //             datenowR: new Date().toLocaleDateString("en-GB") // dd/MM/yyyy
                                                //     //         };

                                                //     //         // Call your async function
                                                //     //         await UpdatePHExcel(fileUrl, filename, iData.HeadRefNo, replacements);

                                                //     //         DevExpress.ui.notify("Excel updated and uploaded successfully.", "success", 2000);
                                                //     //     } catch (err) {
                                                //     //         console.error("Error in onClick:", err);
                                                //     //         DevExpress.ui.notify("Failed to update Excel.", "error", 2000);
                                                //     //     }
                                                //     // }
                                                //     onClick: function (e) {
                                                //         // validation
                                                //         const validationResult = formPRE.validate();
                                                //         if (validationResult.isValid) {
                                                //             console.log("Form is valid. Proceed with submission.");
                                                //             // Proceed with your submission logic here
                                                //         } else {
                                                //             console.log("Form is invalid. Please correct the errors.");
                                                //             // Optionally, you can show the error messages or highlight invalid fields
                                                //         }
                                                //         console.log("validationResult: ", validationResult)
                                                //         // check dataGrid
                                                //         // const rows = aAddStaff.getDataSource().items(); // Get all rows in the data grid aAddStaff
                                                //         // let allValid = true;
                                                //         // console.log("aAddStaff rows = ", rows)
                                                //         // rows.forEach(row => {
                                                //         //     // Make sure that 'id' is the keyExpr you specified in the DataGrid
                                                //         //     const rowIndex = aAddStaff.getRowIndexByKey(row.ID); // This should now work, as the keyExpr is set

                                                //         //     // Validate the row using the row index
                                                //         //     if (rowIndex !== -1) {  // Ensure the row index is valid
                                                //         //         const rowValidationResult = aAddStaff.validateRow(rowIndex);

                                                //         //         if (!rowValidationResult.isValid) {
                                                //         //             allValid = false;
                                                //         //             console.log(`Row ${rowIndex} is invalid. Errors:`, rowValidationResult.brokenRules);
                                                //         //             // Optionally, handle the error (highlight invalid row, show message)
                                                //         //         }
                                                //         //     } else {
                                                //         //         console.log(`Row with id ${row.id} not found in the grid.`);
                                                //         //     }
                                                //         // });

                                                //         // if (allValid) {
                                                //         //     console.log("All rows are valid. Proceed with submission.");
                                                //         //     // Proceed with your submission logic here
                                                //         // } else {
                                                //         //     console.log("Some rows are invalid. Please correct the errors.");
                                                //         // }
                                                //         // validation
                                                //         var aBookingOptions = iData.EROCheck03 ? `SELF BOOKING [REQ->HOD${iData.EROCheck02 ? "->HR" : ""}]` : `ADMIN BOOKING [REQ->HOD->ADMIN${iData.EROCheck02 ? "->HR" : ""}]`
                                                //         var result = $("#Add-formPRE").dxForm("instance").validate(); //Add-dxDataGrid
                                                //         if (!result.isValid) { DevExpress.ui.dialog.alert("Required Fields not valid, please check", "VALIDATION ERROR") } else {
                                                //             aaHODApprover = aaaHODApprover
                                                //             let aObjRowData = JSON.stringify(iData); //EROCode04
                                                //             console.log("Update when Confirm ", aObjRowData)
                                                //             //alert(aObjRowData)
                                                //             sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                //             sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                //             sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                //                 .then(response => {
                                                //                     console.log("Update response: ", response);
                                                //                     if (response.success) {
                                                //                         // Assuming you have a data source variable
                                                //                         let dataSource = $("#gridContainer").dxDataGrid("instance").getDataSource();
                                                //                         dataSource.reload().done(() => {
                                                //                             console.log("Data source reloaded");
                                                //                         });
                                                //                     } else {
                                                //                         console.error("Update failed: ", response.error);
                                                //                     }
                                                //                 })
                                                //                 .catch(error => {
                                                //                     console.error("Request error: ", error);
                                                //                 });
                                                //             $("#gridContainer").dxDataGrid("instance").refresh();
                                                //             $("#gridContainer").dxDataGrid("instance").refresh();
                                                //             $("#gridContainer").dxDataGrid("instance").refresh();
                                                //             $("#gridContainer").dxDataGrid("instance").refresh();
                                                //             // clear variables
                                                //             //asERStatus = iData.ERStatus;
                                                //             // asERODesc02 = ""; //Destination	ERODesc02
                                                //             // asERODesc03 = ""; //Purpose of Trip
                                                //             // asERORefNo1 = ""; //Purpose of Trip List
                                                //             // asEROCheck01 = false; //Overseas
                                                //             // asEROCheck02 = false; //Need Roaming     
                                                //             // asEROCheck03 = false; //Self-Booking                                   
                                                //             // asERODate02 = new Date() //Travel Start Date	
                                                //             // asERODate03 = new Date() //Travel End Date	
                                                //             // asRefundedAmount = 0; //Estimated Cost	
                                                //             // asVendor01 = ""; //Departure Flight	
                                                //             // asERODesc04 = ""; //Arrival Flight	
                                                //             // asEROAmount1 = 0; //Ticket Price	EROAmount1
                                                //             // asERODesc05 = ""; //Hotel	ERODesc05
                                                //             // asNote = ""; //Remark	Note

                                                //             //*/ check dxDataGrid field
                                                //             // const dataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");

                                                //             // // Utility function to get column by key
                                                //             // function getColumnByField(key) {
                                                //             //     const columns = dataGrid.option("columns");
                                                //             //     return columns.find(column => column.dataField === key);
                                                //             // }

                                                //             // // Get all rows from the grid
                                                //             // const rowsData = dataGrid.getVisibleRows().map(row => row.data);

                                                //             // // Validate each field in every row
                                                //             // const isValidRows = rowsData.every(row => {
                                                //             //     return Object.entries(row).every(([key, value]) => {
                                                //             //         // Get column configuration and caption
                                                //             //         const column = getColumnByField(key);
                                                //             //         const caption = column?.caption || key; // Use caption if available, fallback to key

                                                //             //         //ERODesc02: row[3]?.trim(), //Description
                                                //             //         //ERODesc03: row[4]?.trim(), //Purpose
                                                //             //         //var condition = item => item.Amount === 0 || item.ERODesc02 === "" || item.ERODesc03 === "" || item.ERODesc04 === "" || item.ERORefNo3 === "" || item.RefundedAmount === 0 || item.Xrate === 0 || (item.Xrate === 1 && item.Currency !== "THB") || (item.Xrate !== 1 && item.Currency === "THB");
                                                //             //         //Validation logic with key, value, and caption
                                                //             //         if (key === "Vendor02" && value === "") {
                                                //             //             DevExpress.ui.dialog.alert(`Field <b>${caption}</b> cannot be empty.`, "Warning !!"); // (Key: ${key}, Value: ${value})
                                                //             //             return false;
                                                //             //         }
                                                //             //         // if (key === "PsPvDate" && value === "01/01/1901") { //(key === "EROCheck01" && value === true) && 
                                                //             //         //     DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                //             //         //     return false;
                                                //             //         // }
                                                //             //         if (key === "EROCode03" && value === "") {
                                                //             //             DevExpress.ui.dialog.alert(`Field <b>${caption}</b> cannot be empty.`, "Warning !!"); // (Key: ${key}, Value: ${value})
                                                //             //             return false;
                                                //             //         }
                                                //             //         // Example: Log key, value, and caption for debugging
                                                //             //         //console.log(`Key: ${key}, Value: ${value}, Caption: ${caption}`);
                                                //             //         return true; // Field is valid
                                                //             //     });
                                                //             // });

                                                //             // if (!isValidRows) {
                                                //             //     return; // Stop further processing if validation fails
                                                //             // }
                                                //             // //*/ **
                                                //             // $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                //             // $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                //             let aDivSxx = "Where REFNO = '" + aaiHeadRef + "-001'" //HeadRefNo Check RefundedAmount for the first record only
                                                //             //alert(aDivSxx)
                                                //             let aFieldSelectedxx = "HeadRefNo,RefundedAmount,EROCheck01,EROAmount1" //ExtraOnLine].[dbo].[EXPREIM_400] TotalReimburse,
                                                //             let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.TRVREQF " + aDivSxx; //alert(aFullBody)  Estimated Amount                                         
                                                //             //console.log(aFullBodyxx, aaHODApprover);
                                                //             fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                //                 .then(response => response.json())
                                                //                 //
                                                //                 .then(ppData => {
                                                //                     var aaTotalValue = ppData;
                                                //                     var aaTotalReim = aaTotalValue[0].RefundedAmount //TotalReimburse
                                                //                     // use Client Cash Advance Limit for HOD Range
                                                //                     // alert(ppData[0].RefundedAmount)
                                                //                     // alert(aaTotalReim) 
                                                //                     const baseAmt = aaTotalValue[0].EROAmount1; // Limit Amount LRange02 Last HOD
                                                //                     if (aaHODApprover?.[0]) aaHODApprover[0].LRange02 = baseAmt;
                                                //                     if (aaHODApprover?.[1] && aaHODApprover[1] !== 0) aaHODApprover[1].LRange02 = baseAmt + 0.01;
                                                //                     var aaCheckOverseas = aaTotalValue[0].EROCheck01 ? "TRFO" : "HOD";
                                                //                     //console.log(aaCheckOverseas)
                                                //                     //alert(aaTotalReim)
                                                //                     //alert(aaHODApprover.length)
                                                //                     //check if aaCheckOverseas = "TRFO"
                                                //                     var aaChkA = aaHODApprover.filter(item => item.ApproverCode === "TRFO")
                                                //                     if (aaCheckOverseas === 'TRFO') {
                                                //                         if (aaChkA.length > 0) {
                                                //                             aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "TRFO");
                                                //                             // use only "TRFO" if overseas
                                                //                         }  // if not found TRFO use TRF instead
                                                //                     } else if (aaCheckOverseas === 'HOD') {
                                                //                         if (aaChkA.length > 0) {
                                                //                             aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "HOD");
                                                //                             // use only "TRF"
                                                //                         }
                                                //                     }
                                                //                     //console.log("aaHODApprover ", aaHODApprover)
                                                //                     //console.log(aaHODApprover)                                                                
                                                //                     var aaiFoundApp = false;
                                                //                     var nnLno = 0;
                                                //                     var nnAdno = 0;
                                                //                     var aaHODEmail4Chk = "";
                                                //                     var aaHODName4Chk = "";
                                                //                     var aaHODRange4Chk = "";
                                                //                     for (let i = 0; i < aaHODApprover.length; i++) {
                                                //                         if ($.trim(aaHODApprover[i].ApproverName) === $.trim(asFullName)) {
                                                //                             nnAdno = i
                                                //                             aaiFoundApp = true;
                                                //                             break;
                                                //                         }
                                                //                     }
                                                //                     //console.log("asFullName ", asFullName)
                                                //                     //console.log(aaHODApprover[0].ApproverName)
                                                //                     //console.log(nnAdno)
                                                //                     if (aaiFoundApp === true && aaHODApprover.length > 1) {
                                                //                         nnAdno = nnAdno + 1
                                                //                     }
                                                //                     for (let i = nnAdno; i < aaHODApprover.length; i++) {
                                                //                         if (aaTotalReim <= aaHODApprover[i].LRange02) {
                                                //                             aaHODEmail4Chk = aaHODEmail4Chk + "|" + aaHODApprover[i].ApproverEmail + "|"
                                                //                             aaHODName4Chk = aaHODName4Chk + "|" + aaHODApprover[i].ApproverName + "|"
                                                //                             aaHODRange4Chk = aaHODRange4Chk + aaHODApprover[i].LRange02
                                                //                             nnLno = i
                                                //                             break;
                                                //                         } else {
                                                //                             aaHODEmail4Chk = aaHODEmail4Chk + "|" + aaHODApprover[i].ApproverEmail + "|" + ","
                                                //                             aaHODName4Chk = aaHODName4Chk + "|" + aaHODApprover[i].ApproverName + "|" + ","
                                                //                             aaHODRange4Chk = aaHODRange4Chk + aaHODApprover[i].LRange02 + ","
                                                //                         }
                                                //                     }
                                                //                     var aaHODAll4Chk = "NAME:[" + aaHODName4Chk + "] MAIL:[" + aaHODEmail4Chk + "] RANG:[" + aaHODRange4Chk + "]";
                                                //                     //alert(aaHODAll4Chk)
                                                //                     var xxChkEmailxx = aTranTextJson(aaHODAll4Chk, "MAIL:", "RANG:")
                                                //                     var xxChkNamexx = aTranTextJson(aaHODAll4Chk, "NAME:", "MAIL:")
                                                //                     var xxChkRangexx = aTranTextJson(aaHODAll4Chk, "RANG:", "")
                                                //                     var xxChkLenxx = xxChkNamexx.length;
                                                //                     //console.log(aaHODAll4Chk)
                                                //                     //console.log(xxChkNamexx, xxChkEmailxx, xxChkRangexx)

                                                //                     // send mail to first Approver 
                                                //                     aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                //                     aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail;
                                                //                     //alert(aaHODAppName)
                                                //                     //console.log("HOD App Email = ", aaHODAppEmail)
                                                //                     //console.log("Overseas = ", aaCheckOverseas)
                                                //                     // Check empty fields
                                                //                     var aDatabasea = "ExtraOnLine.dbo.TRVREQF";
                                                //                     var aKeyField = "HeadRefNo" //"HeadRefNo"; "REFNO"
                                                //                     var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724" +"-001" 
                                                //                     var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";

                                                //                     // if (aaCheckOverseas === 'TRFO') {
                                                //                     //     var aaCondition = item =>
                                                //                     //         (item.ID === 1 && (item.ERODesc02 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROCode03 === "" || item.Vendor02 === "" || (item.PSPvDate && new Date(item.PSPvDate).getTime() === new Date('01/01/1901').getTime())))
                                                //                     //         ||
                                                //                     //         (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === "" || (item.PSPvDate && new Date(item.PSPvDate).getTime() === new Date('01/01/1901').getTime())))
                                                //                     // } else {
                                                //                     //     var aaCondition = item =>
                                                //                     //         (item.ID === 1 && (item.ERODesc02 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROCode03 === "" || item.Vendor02 === ""))
                                                //                     //         ||
                                                //                     //         (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === ""))
                                                //                     // }
                                                //                     let aaCondition = item =>
                                                //                         (item.ID === 1 && (item.ERODesc01 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROAmount1 === 0 || item.ERODesc03 === ""))

                                                //                     var condition = aaCondition
                                                //                     aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                //                         .then(atestCehcka => {
                                                //                             //console.log("aTestChehcka = ", atestCehcka); // Logs the actual message
                                                //                             // { DevExpress.ui.dialog.alert(aTRFnAlert01, "INPUT ERROR"); }
                                                //                             // if (atestCehcka === 1) { DevExpress.ui.dialog.alert(aVARs.ALERT01, "INPUT ERROR"); }
                                                //                             // else {
                                                //                             //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm (" + aaCheckOverseas + ") & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' ></b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ֡��ั��ทึ��" +
                                                //                             let getvalues = { aaCheckOverseas: aaCheckOverseas, aaHODAppName: aaHODAppName, aaHODAppEmail: aaHODAppEmail, xxChkLenxx: xxChkLenxx, aBookingOptions: aBookingOptions }
                                                //                             //console.log("getvalues ", getvalues)
                                                //                             let aTrfAlert02 = aVARs.ALERT02PRE.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                //                             let result = DevExpress.ui.dialog.confirm(aTrfAlert02, "CONFIRM TO HOD");
                                                //                             //let result = DevExpress.ui.dialog.confirm("<p style='color: darkblue; font-size: 18px;' ><i class='fas fa-info-circle custom-icon-size'></i> " + " Press [YES] to confirm (" + aaCheckOverseas + ") and send email to " + aaHODAppName + " (" + aaHODAppEmail + ") <br></b></p><p style='color: darkgreen; font-size: 14px;'>(" + (xxChkLenxx) + " HOD to approve)</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                //                             //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' > ��ละ ��รุณาตรว��สอ����าร��ั��ทึ��ราย��าร��ห����ร��ทุ������อ������ทุ����รรทัด** <br><b><u>��ม��เ��������ั����</u> ��ะทำ��ห��ราย��าร��ี��เ��ิ������าย��ม����ด�� </b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                //                             result.done(function (dresult) {//                                                                                                                                                                                                                    
                                                //                                 if (dresult) {
                                                //                                     //if (aContinueChk !== true) {
                                                //                                     let aFREF = aaiHeadRef + "-001"
                                                //                                     //alert(aFREF)
                                                //                                     //console.log(aaiHeadRef)
                                                //                                     //console.log(aFREF)
                                                //                                     let aERStatus = "Confirmed wait for HOD" //"Register"
                                                //                                     let aTrueORFalse = '1'
                                                //                                     let aTrueORFalseB = true
                                                //                                     let aNowDateT = aaNowText(aNowDte)
                                                //                                     //let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                //                                     //let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                //                                     var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus, ReqDate: aNowDte };
                                                //                                     var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                //                                     //alert(aObjRowData)
                                                //                                     sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of 
                                                //                                     sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                //                                     sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                //                                     //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704' ERORefNo6
                                                //                                     let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                //                                     aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                //                                     aSQLAction(aaPFDMI, aSQLCommand)
                                                //                                     aSQLAction(aaPFDMI, aSQLCommand)
                                                //                                     $("#gridContainer").dxDataGrid("instance").refresh();

                                                //                                     // const fileUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/FlexibleIME.xlsx";
                                                //                                     // const filename = iData.HeadRefNo + ".xlsx";

                                                //                                     // // Build replacements dynamically
                                                //                                     // const replacements = {
                                                //                                     //     approver1: iData.PayToName,   // requester name from your grid row
                                                //                                     //     datenowR: new Date().toLocaleDateString("en-GB") // today's date in dd/MM/yyyy
                                                //                                     // };
                                                //                                     // alert(JSON.stringify(replacements, null, 2));

                                                //                                     // UpdatePHExcel(fileUrl, filename, replacements);

                                                //                                     //send Email
                                                //                                     var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() //+ " TRAVEL REQUISITION ";
                                                //                                     let aApproverName = aaHODAppName //+ ", [HOD]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                //                                     let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                //                                     let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                //                                     let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"

                                                //                                     //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                                //                                     var aSubject = aaMailTitle
                                                //                                     let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                //                                     let aAddress2Do = `<a href='${aaPFDMI}/XOL/index.html'>${aaOnInitExpGroupDesc}</a>`;
                                                //                                     let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName, aBookingOptions: aBookingOptions }
                                                //                                     let aMessage01 = aArrays.ACONFIRM[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                //                                     var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                //                                     aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                //                                     // $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                //                                     // $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                //                                     $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                //                                     $("#gridContainer").dxDataGrid("instance").refresh();

                                                //                                     //aMessageAlert("Already Confirmed & send mail to Approver " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                //                                     aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                //                                     popup.hide();
                                                //                                 }
                                                //                             });
                                                //                             //1
                                                //                             //} //aaLoadData
                                                //                         }); // then check                                                                 
                                                //                 });
                                                //         }
                                                //     } // validationrule
                                                // });

                                                function dropDownBoxCLN(cellElement, cellInfo) {
                                                    return $("<div>").dxDropDownBox({
                                                        dropDownOptions: { width: 400 },
                                                        dataSource: aObjects.UniqueCashAdvanceClient,
                                                        value: [cellInfo.value],
                                                        valueExpr: "ClientCode",
                                                        displayExpr: "CompanyName",
                                                        contentTemplate: function (e) {
                                                            return $("<div>").dxDataGrid({
                                                                dataSource: aObjects.UniqueCashAdvanceClient,
                                                                //remoteOperations: true,
                                                                columns: [
                                                                    { dataField: "CompanyGroup", caption: "Group", width: 200 },
                                                                    //{ dataField: "CompanyName", caption: "Company", width: 200 },
                                                                    { dataField: "CashAdvance", caption: "Limit", width: 100, format: "#,##0.000000" }
                                                                ],
                                                                paging: { enabled: true, pageSize: 15 },
                                                                searchPanel: { visible: true },
                                                                headerFilter: { visible: true },
                                                                filterRow: { visible: true },
                                                                showBorders: true,
                                                                showColumnLines: true,
                                                                scrolling: { mode: "virtual" },
                                                                selection: { mode: "single" },
                                                                height: 350,
                                                                //selectedRowKeys: [cellInfo.value],                                      
                                                                //focusedRowKey: cellInfo.value,
                                                                onSelectionChanged: function (sArgs) {
                                                                    gbxRateV = sArgs.selectedRowKeys[0].CompanyGroup
                                                                    e.component.option("value", sArgs.selectedRowKeys[0].CompanyGroup);
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

                                        const aPopUpUpLoad = (aRefNoForName) => {
                                            $(() => {
                                                var aaFileN;
                                                var aaFileN2;
                                                var aaNewNamePF = aRefNoForName;
                                                const popup = $("#popupUL").dxPopup({
                                                    title: `File Attachment [${aaNewNamePF}]`,
                                                    height: 280,
                                                    width: 600,
                                                    position: { offset: "-50 -80" }, //{offset: "0 -180"},
                                                    //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                                    visible: true,
                                                    fullScreen: false,
                                                    showCloseButton: true,
                                                    showTitle: true,
                                                    dragEnabled: true,
                                                    closeOnOutsideClick: false,
                                                    resizeEnabled: true,
                                                    //shadingColor:"rgb(190,190,190,0.9)",

                                                    contentTemplate: () => {
                                                        return $("<div />").append(
                                                            // $("<div style = 'margin-left: 10px'>��������´ - DESCRIPTIONS</div>"),
                                                            // $("<p><div style = 'margin-left: 10px' id='first-name'></div></p>"),
                                                            //$("<p><div style = 'margin-left: 20px' id='fileUploader'></div></p>"),
                                                            //$("<p><div style = 'margin-left: 400px; margin-top: 36px;' id='scbutton'></div></p>"),
                                                            $("<div style='border: 1px solid grey; padding: 10px; display: inline-block; margin-left: 20px; margin-right: 10px;' id='fileUploaderContainer'><div id='fileUploader'></div></div>").appendTo("body"),
                                                            //$("<div style='border: 150px solid black; padding: 10px; display: inline-block; margin-left: 20px; margin-right: 10px;' id='fileUploaderContainer'><div id='fileUploader'></div></div>").appendTo("body"),
                                                            //$("<div style='display: inline-block; margin-top: 36px;' id='scbutton'></div>").appendTo("body");
                                                            $("<div style='position: fixed; left: 440px; top: 240px;' id='scbutton'></div>").appendTo("body"),
                                                        )
                                                    },

                                                }).dxPopup("instance");

                                                const aauploader = $("#fileUploader").dxFileUploader({
                                                    multiple: false,
                                                    selectButtonText: 'Select File',
                                                    labelText: '',
                                                    //accept: 'image/*',
                                                    uploadMode: 'useForm',
                                                    height: "130px",
                                                    uploadedMessage: "Uploaded",
                                                    uploadFailedMessage: "Upload failed",
                                                    accept: ".pdf",
                                                    allowedFileExtensions: [".pdf", ".PDF", ".xlsx", ".XLSX", "docx", "DOCX", "pptx", "PPTX", "jpg", "JPG", "PNG", "png", "txt", "TXT"],
                                                    //uploadUrl: "https://cbsdev2.locktonwattana.com/",
                                                    uploadUrl: `${aaPFDMI}/temp/uploads`, //`${aaPFDMI}/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE`, //"https://cbsdev2.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                                                });

                                                $('#scbutton').dxButton({
                                                    text: 'Upload File',
                                                    type: 'success',
                                                    onClick() {
                                                        //u2ploadFile();
                                                        u2ploadFile().then(result => {
                                                            if (result) {
                                                                //aMessageAlert("Upload successful!","blue");                                                                
                                                                //$("##popupUL").hide();
                                                                popup.hide()
                                                            } else {
                                                                aMessageAlert("Upload failed.", "red");
                                                            }
                                                        });
                                                    },
                                                });

                                                async function u2ploadFile() {
                                                    try {
                                                        // Get the dxFileUploader instance
                                                        const fileUploader = $("#fileUploader").dxFileUploader("instance");
                                                        const files = fileUploader.option("value");

                                                        // Validate file selection
                                                        if (!files.length) {
                                                            console.log("No files selected.");
                                                            return false;
                                                        }

                                                        // Extract original file and extension
                                                        const originalFile = files[0];
                                                        const originalFileName = originalFile.name;
                                                        const fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")); // Extract extension
                                                        const newFileName = `${aaNewNamePF}${fileExtension}`; // New name with same extension `updated_${Date.now()}${fileExtension}`

                                                        // Create a new file with the updated name
                                                        const simulatedFile = new File([originalFile], newFileName, {
                                                            type: originalFile.type,
                                                        });

                                                        // Check if it's a PDF
                                                        if (fileExtension.toLowerCase() === ".pdf") {
                                                            // Load and modify PDF metadata
                                                            const pdfBytes = await originalFile.arrayBuffer(); // Convert file to ArrayBuffer
                                                            const pdfDoc = await PDFDocument.load(pdfBytes); // Load the PDF document

                                                            // Update metadata
                                                            pdfDoc.setTitle(newFileName); // Set the new title
                                                            pdfDoc.setSubject("Updated PDF"); // Optional: Set subject
                                                            pdfDoc.setAuthor("TRF"); // Optional: Set author

                                                            // Save the updated PDF
                                                            updatedFileContent = await pdfDoc.save(); // Save the updated PDF as a Uint8Array
                                                        }

                                                        // Create FormData and append the new file
                                                        const formData = new FormData();
                                                        formData.append("file", simulatedFile);

                                                        // Request headers (DO NOT set Content-Type when using FormData)
                                                        const myHeaders = new Headers();
                                                        myHeaders.append("ref", "44095B6C-CC17-47FD-895B-649E0EAA2BAE");

                                                        // Request options
                                                        const requestOptions = {
                                                            method: "POST",
                                                            headers: myHeaders,
                                                            body: formData, // Use FormData as the body
                                                        };

                                                        // Send the request
                                                        const response = await fetch(
                                                            `${aaPFDMI}/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE`, //"https://cbsdev2.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                                                            requestOptions
                                                        );

                                                        // Check response status
                                                        if (!response.ok) {
                                                            throw new Error(`HTTP error! status: ${response.status}`);
                                                        }

                                                        // Handle success
                                                        const result = await response.text();
                                                        console.log(result);
                                                        aMessageAlert(`Upload file ${newFileName} successful!`, "blue");
                                                        fileUploader.reset(); // Clear the uploader
                                                        return true; // Success
                                                    } catch (error) {
                                                        console.error("Error:", error);
                                                        return false; // Error
                                                    }
                                                }


                                            });
                                        }

                                        async function isFileAvailable(fileUrl) {
                                            try {
                                                const response = await fetch(fileUrl, { method: 'GET' });
                                                if (response.status === 200) {
                                                    return true; // File is available
                                                } else {
                                                    console.warn("File not found. Status:", response.status);
                                                    return false; // File is not available
                                                }
                                            } catch (error) {
                                                console.error("Error checking file availability:", error);
                                                return false; // Treat as unavailable on error
                                            }
                                        }


                                        function aPopupPDF(fileUrl) {
                                            const popup = $("#popupHelp").dxPopup({
                                                title: "Files Attachment",
                                                width: "80%",
                                                height: "90%",
                                                fullScreen: true, // Enable full-screen mode
                                                visible: false, // Initially hidden
                                                closeOnOutsideClick: true,
                                                resizeEnabled: true, // Allow resizin
                                                //position: { offset: "40 -100" }, //{my:"top", at:"top", of:window}, <ul><li>
                                                visible: true,
                                                showCloseButton: true, //return $("<iframe>").attr("src", "https://cbsdev2.locktonwattana.com/temp/uploads/" + aResultFilePDF + "#view=FitH").css("width", "100%").css("height", "100%");
                                                contentTemplate: function () {
                                                    const asetupa = fileUrl.includes("pdf") ? "#view=FitH" : ""
                                                    // alert(fileUrl) //["xlsx", "xls", "pptx", "ppt", "doc", "docx"]
                                                    // if (fileUrl.includes("xlsx")) {
                                                    //     // Office Online Viewer
                                                    //     viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src=" + fileUrl; //encodeURIComponent(
                                                    // } else if (ext === "pdf") {
                                                    //     // Direct PDF with cache-busting
                                                    //     viewerUrl = fileUrl + "?t=" + Date.now();
                                                    // }
                                                    //alert(asetupa)
                                                    return $("<iframe>")
                                                        .attr("src", fileUrl + asetupa)
                                                        .css("width", "100%")
                                                        .css("height", "100%");
                                                },
                                            }).dxPopup("instance");
                                        }

                                    }) //then fetch (HOR or HR Email get inside better ?)
                            }) //then fetch (ACCCODE)

                    });
                    // TOP PRG
                });  //  fetch ajax 

        }) //then fetch aaLoadSQL
        .catch(error => console.error("Error fetching SQL data:", error)); // load loadsqldata  
});  // TOP PRG 
