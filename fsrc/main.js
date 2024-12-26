// MENU.js (index03) 
window.onload = function () {
    setTimeout(function () {
        location.reload();
    }, 24000000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
}

history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

// Retrieve the JSON string from LocalStorage
var storedJsonString = localStorage.getItem("usrProperty");
var decryptedData = CryptoJS.AES.decrypt(storedJsonString, "sBxA017").toString(CryptoJS.enc.Utf8);
//var parsedData = JSON.parse(decryptedData);
// Parse the JSON string back into a JavaScript array
var ausrProperty = JSON.parse(decryptedData);
// Access the values in the array
console.log(ausrProperty)
//var aDeptNamea = ausrProperty[0].asDEPT; // department
//var aRightsa = atob(ausrProperty[0].aaXrXg).includes("HOD");; // rights admin,nusert,nusero,nuserf,HODApp .include("HOD")

window.addEventListener('load', function (e) {
    localStorage.removeItem("aDXTheme");
    aDXTheme = ausrProperty[0].aaDXtm //localStorage["aaDXtm"]; //'generic.light'; //aaDXtm
    localStorage["aDXTheme"] = aDXTheme;
});

$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"] // Parameters
    var aUXTheme = ausrProperty[0].aaDXtm //localStorage["aaDXtm"]; // User Theme
    if (aUXTheme === undefined || aUXTheme === "") {
        aUXTheme = 'generic.light'
    }
    aDXTheme = aUXTheme;
    if (aDXTheme === undefined || aDXTheme === "") {
        window.location.reload();
        aDXTheme = aUXTheme //localStorage["aaDXtm"]; //'generic.light'; //aaDXtm
        //localStorage["aDXTheme"] = aDXTheme;
    };
    localStorage["aDXTheme"] = aDXTheme;
    DevExpress.ui.themes.current(aDXTheme); //'generic.light'
    $(".dx-icon").removeClass("dx-theme-accent-as-text-color").addClass("dx-theme-accent-as-text-color");
    //$(".context").hide();
    let aUserNamea = ausrProperty[0].aaXXuX //localStorage["aaXXuX"];

    document.getElementById("aUsrName").innerHTML = aUserNamea;
    //let aaIMGaa = "/images/" + aUserNamea + ".png";
    let aaIMGaa = ausrProperty[0].aaXpXt //localStorage["aaXpXt"];

    if (jQuery.type(aaIMGaa) === "undefined" || aaIMGaa === "") {
        aaIMGaa = "/images/userss.png"
    }

    document.getElementById("avatar").src = aaIMGaa;
    document.querySelector(".logo-container").style.display = "none";
    // Function to hide the header 
    // Attach click event handlers to the buttons 
    //$("#hideButton").click(function() { hideHeader(); }); 
    //$("#showButton").click(function() { showHeader(); });
});
//$(".dx-icon").addClass("dx-theme-accent-as-text-color");
//const aGoTo = function (newW) {
//function hideHeader() { $("#header").hide(); } 
// Function to show the header 
//function showHeader() { $("#header").show(); } 

const aGoTo = (newW) => {
    //window.open('','_self').close();
    window.location.assign(newW);
};

function aaGOTO(newSite) {
    window.location.assign(newSite);
}

const aaLOGOUT = () => {
    window.location.assign("index.html");
}


/*
    aaXXuX: aUname,
    aaXrXg: aal,
    aaXXoX: aat,
    asFTNAME: aftname,
    asDEPT: aDeptn,
    asDIV: aDivn,
    asSTFID: aStaffID,
    aaDXtm: aThemeSL,
    aaXpXt: apict,
    asEMAIL: aemail,
    asAct: aAct,
*/

var aaXToX = ausrProperty[0].aaXXoX //localStorage["aaXXoX"];
var aaXTBM = "d1a42aa7-349e-477c-8f26-75781206caeb";
var aaPFDMI = isLocalHost();
//var aaHeadShow = true;

var aOptionMenu = [{
    id: "01",
    icon: "fas fa-bullseye", // fa-cog
    text: "",
    items: [
        { ID: "101", text: "GEN OTP (TEXT & NUM)  ", type: "normal", icon: "fi fi-sr-rocket", visible: false, onClick: function () { var xxOTPxx = generateLOTP(); aMessageAlert('OTP =' + xxOTPxx, 'Teal'); } },
        { ID: "102", text: "GEN OTP (NUM ONLY)    ", type: "normal", icon: "fi fi-br-rocket", visible: false, onClick: function () { var xxOTPxx = generateOTP(); aMessageAlert('OTP =' + xxOTPxx, 'Teal'); } },
        { ID: "103", text: "LOGIN (OTP)           ", type: "normal", icon: "fas fa-lock", visible: false, onClick: function () { aRunLogin(1) } },
        { ID: "104", text: "New Login             ", type: "normal", icon: "fas fa-key", visible: false, onClick: function () { aRunLogin() } },
        { ID: "105", text: "Help                  ", type: "danger", icon: "help", visible: true, onClick: () => { aRuniFrame("./Help.html", "Help") } },
        { ID: "106", text: "Help (Phase 2)        ", type: "normal", icon: "help", visible: true, onClick: () => { aPopupHelp("HELP",`${aaPFDMI}/temp/uploads/upload.pdf`) } },
        { ID: "107", text: "Chatbot               ", type: "normal", icon: "fas fa-robot", visible: true, onClick: () => { aRuniFrame("./TCHATBOT.html", "Chatbot") } },
        { ID: "108", text: "Logout                ", type: "danger", icon: "fas fa-sign-out-alt", visible: true, onClick: () => { aaGOTO('index.html') } },
        { ID: "109", text: "Themes                ", type: "normal", badge: "12", icon: "fas fa-palette", visible: true, onClick: () => { aThemeSelect() } },
        { ID: "110", text: "Header Hide           ", type: "normal", icon: "fas fa-toggle-off", visible: true, onClick: () => { aHeaderHide() } },
        { ID: "111", text: "Header Show           ", type: "normal", icon: "fas fa-toggle-on", visible: true, onClick: () => { aHeaderShow() } },
        
    ]
}];

// function createLogoContainer() { 
//     var logoContainerHTML = ` <div class="logo-container"> <img src=".\images\locktonlogo70mmwhite.png" class="logo-toolbar"> </div> `; 
//     document.getElementById("toolbar").innerHTML = logoContainerHTML; 
// }
// function removeLogoContainer() { 
//     var aToolbar = document.getElementById("toolbar"); 
//     var logoContainer = document.querySelector(".logo-container"); 
//     if (logoContainer) {aToolbar.removeChild(logoContainer);}
//  }
const achkdate = new Date();
var adayx = achkdate.getDate();
var amonthx = achkdate.getMonth();

async function a4LoadData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, aReturnField) {
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
    let abc = acData;
    return abc;
}

async function axLoadData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, condition) {
    let aTokena = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
    console.log("Inside axLoadData condition = ", condition);
    let axqr2S = condition //`Where ${aKeyfield} LIKE '%${aKeya}%'`;
    let axFullBody = "Select " + axFieldSelected + " From " + aDataBasea + " " + axqr2S;
    console.log("Inside axLoadData condition = ", "Select " + axFieldSelected + " From " + aDataBasea + " " + axqr2S);
    let response = await fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + aTokena, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "@": btoa(axFullBody) }),
        redirect: "follow"
    });

    let acData = await response.json();
    //console.log("record ", acData.length);
    //console.log(acData);
    const filteredArray = acData //.filter(condition);
    //console.log(filteredArray);
    //console.log(filteredArray.length);

    let abc;
    if (filteredArray.length === 0) { //pass                
        abc = 0;
    } else { // not pass
        console.log("not found ", filteredArray.length)
        console.log("Filter Array ", filteredArray)
        abc = 1;
    }
    return abc;
}


const updateLogoClasses = () => {
    //$("#toolbar").removeClass("logo-disappear").addClass("logo-toolbar");
    var logoImage = document.querySelector(".logo-disappear");
    if (logoImage) {
        logoImage.classList.add("logo-toolbar");
        logoImage.classList.remove("logo-disappear");
    }
}
const aHeaderShow = () => {
    document.getElementById("header").style.display = "block";
    document.getElementById("setb").style.display = "block";
    document.querySelector(".logo-container").style.display = "none";
    //createLogoContainer();
}
const aHeaderHide = () => {
    document.getElementById("header").style.display = "none";
    document.getElementById("setb").style.display = "none";
    updateLogoClasses();
    document.querySelector(".logo-container").style.display = "block";
    //removeLogoContainer();
}
const aRuniFrame = (aPageUrl, aTMessage) => {
    $("#tframe").attr("src", aPageUrl);
    $("#workinglabel").text(aTMessage);
}



if (adayx <= 10 && amonthx === 0) {
    var aimages = ['xmas01.jpg', 'xmas02.jpg', 'xmas03.jpg', 'xmas04.jpg', 'xmas05.jpg', 'chny01.jpg', 'chny02.jpg', 'chny03.jpg', 'chny04.jpg'];
} else if ((adayx > 10 && amonthx === 0) || amonthx >= 1) {
    var aimages = ['chny01.jpg', 'chny02.jpg', 'chny03.jpg', 'chny04.jpg'];
} else { var aimages = []; }

var aThemeList = [
    { thid: "generic.light", text: "light", icon: "fas fa-paint-roller", Category: "Generic", visible: true },
    { thid: "generic.dark", text: "dark", icon: "fas fa-paint-roller", Category: "Generic", visible: false },
    { thid: "generic.softblue", text: "Soft blue", icon: "fas fa-paint-roller", Category: "Generic", visible: false },
    { thid: "generic.darkmoon", text: "Darkmoon", icon: "fas fa-paint-roller", Category: "Generic", visible: false },
    { thid: "generic.darkviolet", text: "Darkviolet", icon: "fas fa-paint-roller", Category: "Generic", visible: false },
    { thid: "generic.carmine", text: "Carmine", icon: "fas fa-paint-roller", Category: "Generic", visible: false },
    { thid: "generic.carmine.compact", text: "Carmine Compact", icon: "fas fa-paint-roller", Category: "Generic Compact", visible: false },
    { thid: "generic.darkmoon.compact", text: "Darkmoon Compact", icon: "fas fa-paint-roller", Category: "Generic Compact", visible: false },
    { thid: "generic.darkviolet.compact", text: "Darkviolet Compact", icon: "fas fa-paint-roller", Category: "Generic Compact", visible: false },
    { thid: "material.blue.dark.compact", text: "Blue dark", icon: "fas fa-palette", Category: "Material Compact", visible: false },
    { thid: "material.blue.light.compact", text: "Blue light compact", icon: "fas fa-palette", Category: "Material Compact", visible: true },
    { thid: "material.teal.dark.compact", text: "Teal dark compact", icon: "fas fa-palette", Category: "Material Compact", visible: false },
    { thid: "material.orange.light.compact", text: "Orange Light compact", icon: "fas fa-palette", Category: "Material Compact", visible: true },
    { thid: "material.purple.light.compact", text: "Purple Light compact", icon: "fas fa-palette", Category: "Material Compact", visible: true },
    { thid: "material.teal.light.compact", text: "Teal Light compact", icon: "fas fa-palette", Category: "Material Compact", visible: true },
    { thid: "material.lime.light.compact", text: "Lime Light compact", icon: "fas fa-palette", Category: "Material Compact", visible: true }
];
var aThemeListGroup = new DevExpress.data.DataSource({
    store: aThemeList,
    key: "thid",
    group: "Category"
});

var aaXrgX = ausrProperty[0].aaXrXg //localStorage["aaXrXg"]; // getCookie("aaCrCg") //
if (jQuery.type(aaXrgX) === "undefined") {
    //aRunLogin();     //parent.history.back();    //alert("aaXrgX = undefined");
}
var aaXXrgX = atob(aaXrgX); //// console.log( aaXXrgX );
var aRGarray = aaXXrgX.split(',');

const aaProgramName = "Expenses Reimbursement"

// TOP PRG
$(() => {
    var aDatabasea = "ExtraOnLine.dbo.TaskControl";
    var aKeyField = "TaskGroup";
    var aKeyIDa = "main"; //aaPXIXD;
    var axFieldSelected = "IDNO,TaskName,TaskProgram,TaskGroup";
    var aVARs = {};
    var aArrays = {};
    var aObjects = {};
    //var aaEmailArr;
    //var aaMessage2Show;
    //var aaMess2Show;
    //var aaMess3Show;
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
                    console.log("aVARs ", aVARs[aMatch[1]])
                }
            }

            var aPwdNoChange = ausrProperty[0].asAct  //localStorage["asAct"]
            var aDeptNamea = ausrProperty[0].asDEPT; // department
            var aRightsa = atob(ausrProperty[0].aaXrXg).includes(aVARs.ACHKRIGHTS);; // rights admin,nusert,nusero,nuserf,HODApp .include("HOD")
            if (aPwdNoChange === false) {
                //aaCnfBody = "<div style = 'color: red; font-size: 14px;'>Please change your default password to new password <br>first<br> To change password select MENU [ <i class='fas fa-user-edit'></i> User Information ] <br><div style = 'background: #fff0ff;'><hr>second<br>If you have not changed your password yet The program will not work. <hr></div><br><center><p style = 'font-size: 13px;'>VDO - How To Change Password</p><video style='margin-top:-20px;' width='320' height='240' controls><source src='./images/ChangePassword.mp4' type='video/mp4'></video></center>"
                aaCnfBody = aArrays.ACHGPWDS[0]
                DevExpress.ui.dialog.alert({
                    position: { offset: "0 -90" },
                    title: aArrays.ACHGPWDS[1], //"PLEASE CHANGE DEFAULT PASSWORD",
                    messageHtml: aaCnfBody
                });
                localStorage["aDXMenuTitle"] = "User Information"; // Parameters for Blankpage
                localStorage["aPXIXD"] = "SSSU9019";     // Parameters  
                aRuniFrame("./SSSU9019.html", "User Information")

                //aiFrameWOTP("./SSSU9019.html", "SSSU9019", "User Information")   
                //aRunLoginOTP()
                //runiFOTP();
                //alert("OTP")
            }

            //console.log(aRightsa)
            //console.log("check day=", adayx, "today > ",aVARs.ACHKDAYS," =", adayx > aVARs.ACHKDAYS)
            //console.log('have to check ', aRightsa)
            if (aPwdNoChange === true && aRightsa && aVARs.ACHKDAYS > 0) {
                var aDatabasea = "ExtraOnLine.dbo.GIFTREC";
                var aKeyField = "ExpGroupCode" //"HeadRefNo"; "REFNO"
                var aKeyIDa = "700" //  T2408177541 "T2408152724" +"-001" 
                var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";
                var aaCondition = ` where ${aKeyField} = '${aKeyIDa}' and Department = '${aDeptNamea}' and ERStatus LIKE '%finish%' and (MONTH(ReqDate) = MONTH(GETDATE()) AND YEAR(ReqDate) = YEAR(GETDATE()));`
                var condition = aaCondition
                axLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                    .then(atestCehcka => {

                        if (atestCehcka === 1) {
                            //DevExpress.ui.dialog.alert("Have Gift/Receive Data for this month", "OK"); 
                        } else {
                            if (adayx > aVARs.ACHKDAYS) {
                                //let result = DevExpress.ui.dialog.alert("<p style='color: darkblue; font-size: 20px;' ><i class='fas fa-info-circle custom-icon-size'></i> No Gift/Receive Data for your Department this month!! <br></b></p><span style='color: red; font-size: 40px;'>&#x275D;</span><span style='color: darkgreen; font-size: 14px;'>You must [ADD NEW] Gift/Receive transaction for this month, If you have no Gift/Receive transaction<br>you must select &#x275D;NO Gift/Receive&#x275E; for Type Of Receive/Gift</span><br><center><video style='margin-top:-20px;' width='320' height='240' controls><source src='./images/GiftReceive.mp4' type='video/mp4'></video></center>", "MUST ADD NEW RECORD FOR Gift/Receive");
                                let result = DevExpress.ui.dialog.alert(aArrays.ALERT01[0], aArrays.ALERT01[1]);
                                //alert("run")
                                //localStorage["aDXTheme"] = aDXTheme;
                                localStorage["aDXMenuTitle"] = "Gift / Receive"; // Parameters for Blankpage
                                localStorage["aPXIXD"] = "MXXINCOME";     // Parameters                          
                                aRuniFrame("./MXXINCOME.html", "Gift / Receive")

                                //alert("run")
                            } else if (adayx <= aVARs.ACHKDAYS) { //
                                //console.log(aArrays.ALERT02[0])
                                //let result = DevExpress.ui.dialog.confirm("<p style='color: darkblue; font-size: 18px;' ><i class='fas fa-info-circle custom-icon-size'></i> No Gift/Receive Data for your Department this month!! <br></b></p><p style='color: darkgreen; font-size: 14px;'>Please [ADD NEW] Gift/Receive transaction for this month</p>", "PLEASE ADD NEW RECORD FOR Gift/Receive");
                                let result = DevExpress.ui.dialog.confirm(aArrays.ALERT02[0], aArrays.ALERT02[1]);
                                result.done(function (dresult) {//                                                                                                                                                                                                                    
                                    if (dresult) {
                                        //aMessageAlert("There are no Gift/Receive, Please Input", "DarkGreen")
                                        //localStorage["aDXTheme"] = aDXTheme;
                                        localStorage["aDXMenuTitle"] = "Gift / Receive"; // Parameters for Blankpage
                                        localStorage["aPXIXD"] = "MXXINCOME";     // Parameters  
                                        aRuniFrame("./MXXINCOME.html", "Gift / Receive")
                                        //popup.hide();  
                                    }
                                });

                            }
                            //1
                        } //axLoadData
                    }); // then check           
            }

            // ---chk            
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12 
            const currentYear = currentDate.getFullYear();
            //alert(aimages[Math.floor(Math.random() * aimages.length)])
            //if (amonthx <= 1) {
            //$('body').css({ 'background-image': 'url(./images/' + aimages[Math.floor(Math.random() * aimages.length)] + ')' }); // random background Image
            //$('body').css({ 'background-image': 'url(./images/LWT40Years.png)' });
            if ((currentYear === 2024 && currentMonth >= 12) || (currentYear === 2025 && currentMonth <= 4)) {
                $(document).ready(function () {
                    $('body').css({
                        'background-image': 'url(./images/LWT40Years.png)',
                        'background-position': 'center', // Center horizontally and vertically
                        'background-repeat': 'no-repeat', // Prevent tiling
                        'background-size': '27%', // Resize the image to 40% of the viewport
                        'background-attachment': 'fixed', // Keep the background fixed
                        'opacity': '1' // Ensure the background is fully visible
                    });
                });
            }

            var aUserNamex = ausrProperty[0].aaXXuX //localStorage["aaXXuX"];
            var aaIMGax = "/images/" + aUserNamex + ".png";

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                // "@": "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                //body: raw,
                redirect: 'follow'
            };

            let aURL = aaPFDMI + "/DMQ/" + acPRJ + "/" + atob(aaXToX) + "/" + aaXTBM + "/all"

            fetch(aURL, requestOptions)
                .then(response => response.json())
                .then(e => {
                    //// console.log('fetch Success'); //, e
                    //// console.log(e);
                    aObjMenuV = e;
                    $.each(aObjMenuV, function (i) {
                        if (!e[i].categoryid) {
                            delete aObjMenuV[i].categoryid;
                        };
                    });

                    $.each(aObjMenuV, function (i) {
                        var aaMenuS = e[i].rightsgroup;
                        //// console.log(aaMenuS);
                        var aaMenuAr = aaMenuS.split(',');
                        //// console.log(jQuery.type(aaMenuAr));   
                        var aPassRg = aArrayCompare(aaMenuAr, aRGarray);
                        if (!aPassRg && aaMenuS != "") {
                            var ObjVSData = { visible: false };
                            $.extend(aObjMenuV[i], ObjVSData);
                            //delete aObjMenuV[i];
                            //// console.log(aObjMenuV[i].ID);
                            //// console.log(aObjMenuV[i].visible);
                        }

                    });

                    aObjMenuV.sort(function (a, b) {
                        var a1 = a.ID, b1 = b.ID;
                        if (a1 == b1) return 0;
                        return a1 > b1 ? 1 : -1;
                    });

                    if (aPwdNoChange === false) {
                        aObjMenuV = [
                            { ID: '[990]', name: 'User Information', icon: 'fas fa-user-edit', alabel: 'User Information', url: './SSSU9019.html', rightsgroup: '', PageID: 'SSSU9019' },
                            { ID: '[99900]', name: 'Help', icon: 'help', alabel: 'Help', url: './Help.html', rightsgroup: '', PageID: '' },
                            { ID: '[999999]', name: 'Logout', icon: 'fas fa-sign-out-alt', alabel: 'Logout', url: 'aaLOGOUT()', rightsgroup: '', PageID: '' },
                        ]
                    }
                    // console.log(aObjMenuV)
                    var drawer = $("#drawer").dxDrawer({
                        opened: true, //false,
                        height: 1000,
                        closeOnOutsideClick: true, //true,
                        template: function () {
                            var $list = $("<div class = 'left-content'>")//.addClass("dx-theme-accent-as-text-color");//.width(250).addClass("dx-icon"); //id='leftbar' .addClass("dx-theme-accent-as-text-color").addClass("dx-icon")
                            //$(".dx-icon").addClass("dx-theme-accent-as-text-color");
                            return $list.dxTreeView({
                                items: aObjMenuV,
                                //items: aTreeViewMenus,
                                keyExpr: "ID",
                                parentIdExpr: "categoryid",
                                dataStructure: "plain",
                                searchEnabled: false,
                                expandEvent: "click",
                                displayExpr: "name",
                                focusStateEnabled: false,
                                //rootValue: -1,
                                //expandedRowKeys: [1],
                                //columns: ["name"],         
                                //width: 220,
                                height: 1000,
                                onItemClick: function (e) {
                                    $(".dx-icon").addClass("dx-theme-accent-as-text-color");
                                    var item = e.itemData;
                                    //alert( jQuery.type(item))
                                    localStorage["aDXMenuTitle"] = item.name; // Parameters for Blankpage
                                    localStorage["aPXIXD"] = item.PageID;     // Parameters
                                    var aaMnuSa = item.rightsgroup;
                                    var aaMArr = aaMnuSa.split(',');
                                    var aaMTg = aArrayMatch(aaMArr, aRGarray);
                                    localStorage["MMaMx"] = aaMTg;
                                    if (item.url) {
                                        var aiU = item.url;
                                        var aFchk = aiU.substring(0, 2);
                                        if (aFchk === "./") {
                                            $("#tframe").attr("src", item.url);
                                            $("#workinglabel").text(item.alabel); //"<i class=<'" + item.icon + "'></i>" + " " +
                                        } else {
                                            //item.url;
                                            //alert(jQuery.type(e.itemData.url))
                                            eval(item.url);
                                        }
                                    } else {
                                        $("#tframe").attr("src", "");
                                        $("#workinglabel").text(item.alabel); //""
                                    }

                                }
                            });

                        }
                    }).dxDrawer("instance");

                    $("#toolbar").dxToolbar({  //elementAttr: { class: "dx-theme-text-color" },

                        items: [{
                            widget: "dxButton",
                            location: "before",
                            options: {
                                icon: "menu",
                                stylingMode: "text", //"outlined",
                                elementAttr: { class: "xmenu" },
                                onClick: function () {
                                    drawer.toggle();
                                }
                            }
                        }, {
                            widget: "dxMenu", //"dxDropDownBox", //dxSelectBox", .dxDropDownButton, dxMenu
                            location: 'after',
                            options: {
                                dataSource: aOptionMenu, //actionSheetItems,
                                hideSubmenuOnMouseLeave: true,
                                cssClass: "toolsmenu",
                                showFirstSubmenuMode: {
                                    delay: { hide: 300, show: 50 },
                                    name: "onHover"
                                },
                                displayExpr: "text",
                                valueExpr: "ID",
                                //placeholder:"OPTIONS",
                                showTitle: true, //true,
                                stylingMode: "text", //"filled",
                                //value: null,
                                width: 10,
                                onItemClick: function (value) {
                                    //var str = value.itemData.text;
                                    //var res = str.substring(0, 1);
                                    var aResult = value.itemData.onClick;
                                }
                            }
                            /*locateInMenu: 'never',
                            template: function() {
                                aSetupList();
                            } */
                        },
                        {
                            location: 'before',
                            locateInMenu: 'never',
                            template: function () {
                                return $("<div id='workinglabel' class='toolbar-label'></div>").text(aaProgramName);
                            }
                        }

                        ]
                    });

                }) //load MENU
                .catch(error => {
                    console.error('Error:', error);
                    //DevExpress.ui.dialog.alert({
                    //showTitle: false,
                    //messageHtml: "<center><b style='color:Tomato;'>Please Try Again!!</b></center>"});
                });

        }); // load content

});
// TOP PRG
/* All Functions */
/*
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

    fetch("https://cbsdev2.locktonwattana.com/send-email/false", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
*/
function aArrayCompare(a, b) {
    let aPass = false;
    $.each(b, function (i, val) {  // each(a,function(i,val)
        let aValArr = val.split('0');
        let aval2s = aValArr[0];
        if (jQuery.type(aval2s) === "undefined") {
            aval2s = val;
        }
        var result = $.inArray(aval2s, a); //var result=$.inArray(val,b);

        if (result != -1) {
            //// console.log('Exit');
            aPass = true;
            return false;
        } else {
            aPass = false;
        }
    })
    return aPass;
};

function aArrayMatch(a, b) {
    let aPass = "";
    $.each(b, function (i, val) {

        let aValArr = val.split('0');
        let aval2s = aValArr[0];
        if (jQuery.type(aval2s) === "undefined") {
            aval2s = val;
        }
        var result = $.inArray(aval2s, a);
        if (result != -1) {
            //// console.log('Exit');       
            aPass = val;
            //alert(aPass)
            return false;
        } else {
            aPass = "";
        }
    })
    return aPass;
};

const aThemeSelect = () => {
    //var aTItemNo = 2;
    var aRgsValue = localStorage["aDXTheme"];
    //jQuery(function ($) {
    $(() => {
        $("#popupSelect").dxPopup({
            title: "THEMES",
            height: '140px',
            width: '250px',
            position: { offset: "0 -250" }, //{offset: "0 -180"},
            //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
            visible: true,
            contentTemplate: function () {
                return $("<div />").append(
                    $("<p><center><div id='tselect'></div></center></p>"),
                );
            },
        }).dxPopup("instance");

        $("#tselect").dxSelectBox({
            width: 200,
            //grouped: true,					
            //items: aThemeList, //
            dataSource: aThemeListGroup,
            //group: "Category",
            valueExpr: "thid",
            displayExpr: "text",
            grouped: true,
            value: aRgsValue, // aThemeList[aTItemNo].thid, //
            onValueChanged: function (args) {
                //DevExpress.ui.themes.current('generic.light');
                DevExpress.ui.themes.current(args.value);
                localStorage["aDXTheme"] = args.value;
                var str = args.value;
                //var ano = args.key;
                //alert( ano)
                if (str.includes("dark")) {
                    $("#mainlogo").attr("src", "./images/locktonlogo70mmwhite.png");
                    $("#logobarid").removeClass("logobarwhite").addClass("logobarblack");
                    $("#leftbar").removeClass("left-content").addClass("dx-theme-accent-as-background-color");
                    /*                            
                    $("#mainlogo").attr("src", "./images/locktonlogo70mmblack.png"); 
                    $("#logobarid").removeClass("logobarblack").addClass("logobarwhite");
                    $("#leftbar").removeClass("left-content").addClass("dx-theme-accent-as-background-color");
                    $("#leftbar").removeClass("dx-theme-accent-as-background-color").addClass("left-content");
                    */
                } else {
                    $("#mainlogo").attr("src", "./images/locktonlogo70mmwhite.png");
                    $("#logobarid").removeClass("logobarwhite").addClass("logobarblack");
                    $(".dx-icon").addClass("dx-theme-accent-as-text-color");
                    //$(".fas").addClass("dx-theme-accent-as-text-color");
                    //$("#leftbar").removeClass("dx-theme-accent-as-background-color").addClass("left-content");
                    //$("#leftbar").removeClass("left-content").addClass("dx-theme-accent-as-background-color");
                }
                $("#tframe").attr("src", $("#tframe").attr("src"));  // refresh iFrame
                $("#popupSelect").dxPopup("hide");
            }
        }).dxSelectBox("instance");


    });
}

/*
const aRunLoginOTP = () => {
    var aOTPm = generateOTP();
    var aii = 0;
    var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmwhite.png' width='88'></center></div>"
    let aaP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>OTP =&nbsp;' + aOTPm + '</center></strong></span></h2></td></tr></tbody></table>'
    // 
    //                                       aRecipient, aRCPeMail               ,aSendereMail        , aCCeMail, aBcceMail,aSubject,aMessage "Dear Wikran <br/><br/>&nbsp;&nbsp; OTP = <br/><br/><br/>Regards,<br />XOL Admin."
    let aSentM = aSendMailDMZ("Khun " + aLGName, aemail, "XOL-admin@lockton.com", "", "", "OTP = " + aOTPm, "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aLGName + ", <br/><br/>" + aaP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");

    //jQuery(function ($) {
    $(() => {
        // ...
        $("#popupOTP").dxPopup({
            //title:  "PLEASE LOGIN",
            height: '250px',
            width: '400px',
            position: { offset: "0 -150" }, //{offset: "0 -180"},
            //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
            visible: true,
            fullScreen: false,
            showCloseButton: true,
            showTitle: true,
            dragEnabled: true,
            closeOnOutsideClick: false,
            shadingColor: "rgb(190,190,190,0.9)",
            toolbarItems: [{ toolbar: "top", html: alImg }],
            contentTemplate: function () {
                return $("<div />").append(
                    //$("<p><center><div id='username'></div></center></p>"),
                    //$("<p><center><div id='password'></div></center></p>"),
                    $("<p><center><div id='OTP'></div></center></p>"),
                    $("<p <div id='Opopover1'>Please get OTP from your register e-Mail, put here and then press [LOGIN]</div></p>"),
                    $("<p><center><span id='Oicon-done'></span></span></center></p>")
                );
            },
            //onContentReady: function () {
            //    $("#OTP").hide();
            //}
        }).dxPopup("instance");

        $("#OTP").dxTextBox({
            mode: "text",
            placeholder: "put OTP and press LOGIN",
            showClearButton: true,
            onValueChanged: function (e) {
                const previousValue = e.previousValue;
                aOTP = e.value;
                // Event handling commands go here
                // DevExpress.ui.notify(newValue);
            },
            width: "250px",
            value: ""
        }).dxTextBox("instance");

        $("#Opopover1").dxPopover({
            target: "#OTP",
            showEvent: "mouseenter",
            hideEvent: "mouseleave",
            position: "top",
            width: 300
        });

        $("#Oicon-done").dxButton({
            icon: "fas fa-key",
            type: "success",
            text: "LOGIN",
            width: "120px",
            visible: true,
            //showCloseButton: false,
            onClick: function (e) {
                if (aOTP === aOTPm) {
                    //aGoTo("index03.html");
                    //aiFrameWOTP("./SSSU9019.html", "SSSU9019", "User Information") //./Help.html  Help  
                    aaCnfBody = "<div style = 'color: red; font-size: 14px;'>Please change your default password to new password <br> ???????????? ???????????????? ???????????????? <br> To change password select MENU [ <i class='fas fa-user-edit'></i> User Information ] <br><div style = 'background: #fff0ff;'><hr> ??????????????????????????? ??????????????????????????? <br>If you have not changed your password yet The program will not work. <hr></div><br><center><p style = 'font-size: 13px;'>VDO - How To Change Password</p><video style='margin-top:-20px;' width='320' height='240' controls><source src='./images/ChangePassword.mp4' type='video/mp4'></video></center>"
                    DevExpress.ui.dialog.alert({
                        position: { offset: "0 -90" },
                        title: "PLEASE CHANGE DEFAULT PASSWORD",
                        messageHtml: aaCnfBody
                    });
                    localStorage["aDXMenuTitle"] = "User Information"; // Parameters for Blankpage
                    localStorage["aPXIXD"] = "SSSU9019";     // Parameters  
                    aRuniFrame("./SSSU9019.html", "User Information")
                } else {
                    aii++;
                    $("#OTP").show(20);
                    if (aii <= 1) {
                        var aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>OTP =&nbsp;' + aOTPm + '</center></strong></span></h2></td></tr></tbody></table>'
                        // 
                        //                                       aRecipient, aRCPeMail               ,aSendereMail        , aCCeMail, aBcceMail,aSubject,aMessage "Dear Wikran <br/><br/>&nbsp;&nbsp; OTP = <br/><br/><br/>Regards,<br />XOL Admin."
                        var lSentM = aSendMailDMZ("Khun " + aLGName, aemail, "XOL-admin@lockton.com", "", "", "OTP = " + aOTPm, "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aLGName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");
                        DevExpress.ui.dialog.alert({
                            showTitle: false,
                            messageHtml: "<center style='color:ForestGreen;'> Sendind OTP to your e-Mail, please check </center>"
                        });
                    } else {
                        DevExpress.ui.dialog.alert({
                            showTitle: false,
                            messageHtml: "<center style='color:Red;'> Please check OTP from your e-Mail again !!" + aii + "</center>"
                        });
                    }
                }

            }
        });

    });
}
*/
/*
function aRunLogin(aWithOTP) {
    if (aWithOTP === undefined) {
        var aWOTP = 0;
    } else {
        var aWOTP = 1;
    }
    var apwds = "";
    var ausrs = "";
    var aOTP = "";
    var aaPFDMI = isLocalHost();
    var aOTPm = generateOTP();
    var aii = 0;
    var astr = localStorage["aDXTheme"]
    if (astr.includes("dark")) {
        var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmwhite.png' width='88'></center></div>"
    } else {
        var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"
    }
    // define the $ as jQuery for multiple uses
    jQuery(function ($) {
        // ...
        $("#popupContainer").dxPopup({
            //title:  "PLEASE LOGIN",
            height: '250px',
            width: '400px',
            position: { offset: "0 -150" }, //{offset: "0 -180"},
            //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
            visible: true,
            fullScreen: false,
            showCloseButton: true,
            showTitle: true,
            dragEnabled: true,
            closeOnOutsideClick: false,
            shadingColor: "rgb(190,190,190,0.9)",
            toolbarItems: [{ toolbar: "top", html: alImg }],
            contentTemplate: function () {
                return $("<div />").append(
                    $("<p><center><div id='username'></div></center></p>"),
                    $("<p><center><div id='password'></div></center></p>"),
                    $("<p><center><div id='OTP'></div></center></p>"),
                    $("<p <div id='popover1'>Please get OTP from your register e-Mail, put here and then press [LOGIN]</div></p>"),
                    $("<p><center><span id='icon-done'></span></span></center></p>")
                );
            },
            onContentReady: function () {
                $("#OTP").hide();
            }
        }).dxPopup("instance");

        $("#username").dxTextBox({
            mode: "text",
            placeholder: "Enter username",
            showClearButton: true,
            onValueChanged: function (e) {
                const previousValue = e.previousValue;
                ausrs = e.value;
                // Event handling commands go here
                // DevExpress.ui.notify(newValue);
            },
            width: "250px",
            value: ""
        }).dxTextBox("instance");

        $("#password").dxTextBox({
            mode: "password",
            placeholder: "Enter password",
            showClearButton: true,
            onValueChanged: function (e) {
                const previousValue = e.previousValue;
                apwds = e.value;
                // Event handling commands go here
                // DevExpress.ui.notify(newValue);
            },
            width: "250px",
            value: ""
        }).dxTextBox("instance");

        $("#OTP").dxTextBox({
            mode: "text",
            placeholder: "put OTP and press LOGIN",
            showClearButton: true,
            onValueChanged: function (e) {
                const previousValue = e.previousValue;
                aOTP = e.value;
                // Event handling commands go here
                // DevExpress.ui.notify(newValue);
            },
            width: "250px",
            value: ""
        }).dxTextBox("instance");

        $("#popover1").dxPopover({
            target: "#OTP",
            showEvent: "mouseenter",
            hideEvent: "mouseleave",
            position: "top",
            width: 300
        });

        $("#icon-done").dxButton({
            icon: "fas fa-key",
            type: "success",
            text: "LOGIN",
            width: "120px",
            visible: true,
            onClick: function (e) {
                //console.clear();	
                //var aUname = document.getElementById("uname").value;
                //var aPswd = document.getElementById("pswd").value; 			
                if (jQuery.type(ausrs) === "undefined") {
                    var aUname = ""
                } else {
                    var aUname = ausrs
                };
                if (jQuery.type(apwds) === "undefined") {
                    var aPswd = ""
                } else {
                    var aPswd = apwds;
                };
                if (aUname === "" || aPswd === "") {
                    DevExpress.ui.dialog.alert({
                        showTitle: false,
                        messageHtml: "<center style='color:Red;'>Username and Password can not be blank !!</center>"
                    });
                }
                else {
                    localStorage.setItem("aaPFDMI", aaPFDMI);
                    localStorage.setItem("aaXXuX", aUname);
                    var aaXTGO = "A75FCC75-8FB6-4460-B3F6-7070B4437930"; //Guest
                    var aaTBXX = "01f518c9-c818-4e9f-85cb-6245ee1a2637";
                    //var aaLng = aaLoginGet(aaPFDMI,aUname, aPswd); //aaLoginaa(aUname,aPswd);
                    //alert(aUname);
                    var aLtext = "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
                    //alert(aLtext);
                    //"@": "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    var raw = JSON.stringify({
                        "@": "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
                    });

                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };

                    let aURL = aaPFDMI + "/DMQ/" + acPRJ + "/" + aaXTGO + "/" + aaTBXX + "/all"; // + aUname;

                    fetch(aURL, requestOptions)
                        .then(response => response.json())
                        //  .then(data => {console.log(data)});
                        .then(aData => {
                            //console.log('Success:', aData);
                            //console.log(aData[0].IDUsr);
                            //console.log(aData[0].Gright);
                            //console.log(aData[0].Pword);
                            //console.log(result);
                            //localStorage.setItem("aaXXoX", aData[0].TKey); 
                            //localStorage.setItem("aaXrXg", response.KeyRights);                        
                            if (aPswd === aData[0].Pword) {
                                var aal = btoa(aData[0].Gright);
                                var aat = btoa(aData[0].Tkey);
                                var aLGName = aData[0].LGName;
                                var aemail = aData[0].email;
                                var aotpx = aData[0].otp;
                                var apict = aData[0].PictureLoc;
                                //console.log(aLGName)
                                //console.log(aemail)
                                //console.log(aotpx)
                                //alert(aal);
                                //alert(aData[0].Pword);
                                //alert(aPswd === aData[0].Pword);
                                localStorage.setItem("aaXrXg", aal);
                                localStorage.setItem("aaXXoX", aat);
                                localStorage.setItem("aaXpXt", apict);

                                if (aOTP === aOTPm || aWOTP === 0) {
                                    //aGoTo("index02.html");
                                    aGoTo("index03.html");
                                } else {
                                    aii++;
                                    $("#username").hide();
                                    $("#password").hide();
                                    $("#OTP").show(20);
                                    if (aii <= 1) {
                                        var aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>OTP =&nbsp;' + aOTPm + '</center></strong></span></h2></td></tr></tbody></table>'
                                        // 
                                        //                                       aRecipient, aRCPeMail               ,aSendereMail        , aCCeMail, aBcceMail,aSubject,aMessage "Dear Wikran <br/><br/>&nbsp;&nbsp; OTP = <br/><br/><br/>Regards,<br />XOL Admin."
                                        var lSentM = aSendMailDMZ("Khun " + aLGName, aemail, "XOL-admin@lockton.com", "", "", "OTP = " + aOTPm, "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aLGName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");

                                        DevExpress.ui.dialog.alert({
                                            showTitle: false,
                                            messageHtml: "<center style='color:ForestGreen;'> Sendind OTP to your e-Mail, please check </center>"
                                        });
                                    } else {
                                        DevExpress.ui.dialog.alert({
                                            showTitle: false,
                                            messageHtml: "<center style='color:Red;'> Please check OTP from your e-Mail again !!" + aii + "</center>"
                                        });
                                    }
                                }

                            } else {

                                DevExpress.ui.dialog.alert({
                                    showTitle: false,
                                    messageHtml: "<center><b style='color:Tomato;'>Please Try Again!!</b></center>"
                                });
                            }

                        })
                        .catch(error => {
                            console.error('Error:', error);
                            DevExpress.ui.dialog.alert({
                                showTitle: false,
                                messageHtml: "<center><b style='color:Tomato;'>Please Try Again!!</b></center>"
                            });
                        });

                }
            }
        });

    });
}
*/
/*
//$(function(){
function aSetupList() {
    //const processClick = function (name) {
    //      DevExpress.ui.notify(name + " clicked", "success", 3000);
    //};  

    jQuery(function ($) {
        var actionSheet = $("#action-sheet").dxActionSheet({
            dataSource: actionSheetItems,
            title: "Options",
            showTitle: true,
            usePopover: true,
            cancelText: "Cancel",
            width: 300,
            showCancelButton: true,
            //target: "#aButton",
            onItemClick: function (value) {
                //if (value.itemData.text === 'Theme'){
                //processClick(value.itemData.text);
                //var aOTP = generateLOTP(); 
                //alert( aOTP);
                var str = value.itemData.text;
                var res = str.substring(0, 1);
                //alert(res);
                //if (res === "1" || res === "2") {
                var aResult = value.itemData.onClick;
                //aMessageAlert("OTP =" + aOTP, "green");
                //} else if (res === "3" ) {
                //    var aOTP = value.itemData.onClick;
                //var aOTP = generateOTP();
                //aMessageAlert("SEND MAIL with OTP =" + aOTP , "blue");
                //} else {
                //    aMessageAlert("ERROR","red");    
                //}        
                //    var aOTP = "";
                //} else {
                //    DevExpress.ui.notify("The \"" + value.itemData.text + "\" button is clicked.");
                //}
            }
        }).dxActionSheet("instance");

        $("#aButton").dxButton({
            //stylingMode: "Options",
            stylingMode: "text",
            //text: "Outlined",
            icon: "fi fi-sr-settings",
            type: "success",
            width: 60,
            onClick: function (e) {
                //actionSheet.option("target", e.itemElement);
                actionSheet.option("visible", true);
            }
        });

    });
};
*/
