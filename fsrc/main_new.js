history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

var storedJsonString = localStorage.getItem("usrProperty");
var decryptedData = CryptoJS.AES.decrypt(storedJsonString, "sBxA017").toString(CryptoJS.enc.Utf8);
var ausrProperty = JSON.parse(decryptedData);
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
    };
    localStorage["aDXTheme"] = aDXTheme;
    DevExpress.ui.themes.current(aDXTheme); //'generic.light'
    $(".dx-icon").removeClass("dx-theme-accent-as-text-color").addClass("dx-theme-accent-as-text-color");
    let aUserNamea = ausrProperty[0].aaXXuX //localStorage["aaXXuX"];

    document.getElementById("aUsrName").innerHTML = aUserNamea;
    let aaIMGaa = ausrProperty[0].aaXpXt //localStorage["aaXpXt"];

    if (jQuery.type(aaIMGaa) === "undefined" || aaIMGaa === "") {
        aaIMGaa = "/images/userss.png"
    }

    document.getElementById("avatar").src = aaIMGaa;
    document.querySelector(".logo-container").style.display = "none";
    
});



const aGoTo = (newW) => {
    window.location.assign(newW);
};

function aaGOTO(newSite) {
    window.location.assign(newSite);
}

const aaLOGOUT = () => {
    window.location.assign("index.html");
}

var aaXToX = ausrProperty[0].aaXXoX //localStorage["aaXXoX"];
var aaXTBM = "d1a42aa7-349e-477c-8f26-75781206caeb";
var aaPFDMI = isLocalHost();
var aOPFDMI = window.location.origin;
var aFPFDMI = aOPFDMI.includes("localhost") ? `${aOPFDMI}/` : `${aOPFDMI}/${acPRJs}/`
console.log(window.location.origin, aFPFDMI)
var aOptionMenu = [{
    id: "menu01",
    icon: "fas fa-bullseye first-icon", // fa-cog
    text: "",
    items: [
        { ID: "101", text: "GEN OTP (TEXT & NUM)  ", type: "normal", icon: "fi fi-sr-rocket", visible: false, onClick: function () { var xxOTPxx = generateLOTP(); aMessageAlert('OTP =' + xxOTPxx, 'Teal'); } },
        { ID: "102", text: "GEN OTP (NUM ONLY)    ", type: "normal", icon: "fi fi-br-rocket", visible: false, onClick: function () { var xxOTPxx = generateOTP(); aMessageAlert('OTP =' + xxOTPxx, 'Teal'); } },
        { ID: "103", text: "LOGIN (OTP)           ", type: "normal", icon: "fas fa-lock", visible: false, onClick: function () { aRunLogin(1) } },
        { ID: "104", text: "New Login             ", type: "normal", icon: "fas fa-key", visible: false, onClick: function () { aRunLogin() } },
        { ID: "105", text: "Help                  ", type: "danger", icon: "help", visible: true, onClick: () => { aRuniFrame("./Help.html", "Help") } },
        { ID: "106", text: "Help (Phase 2)        ", type: "normal", icon: "help", visible: true, onClick: () => { aPopupHelp("HELP", `${aaPFDMI}/temp/uploads/upload.pdf`) } },
        { ID: "107", text: "Chatbot               ", type: "normal", icon: "fas fa-robot", visible: true, onClick: () => { aPopupHelp("Chatbot", `${aFPFDMI}TCHATBOT.html`) } }, //{ aRuniFrame("./TCHATBOT.html", "Chatbot") }
        { ID: "108", text: "Logout                ", type: "danger", icon: "fas fa-sign-out-alt", visible: true, onClick: () => { aaGOTO('index.html') } },
        { ID: "109", text: "Themes                ", type: "normal", badge: "12", icon: "fas fa-palette", visible: true, onClick: () => { aThemeSelect() } },
        { ID: "110", text: "Header Hide           ", type: "normal", icon: "fas fa-toggle-off", visible: true, onClick: () => { aHeaderHide() } },
        { ID: "111", text: "Header Show           ", type: "normal", icon: "fas fa-toggle-on", visible: true, onClick: () => { aHeaderShow() } },

    ]
}];

const achkdate = new Date();
var adayx = achkdate.getDate();
var amonthx = achkdate.getMonth();

async function a4LoadData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, aReturnField) {
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
    let abc = acData;
    return abc;
}

async function axLoadData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, condition) {
    let aTokena = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
    let axqr2S = condition //`Where ${aKeyfield} LIKE '%${aKeya}%'`;
    let axFullBody = "Select " + axFieldSelected + " From " + aDataBasea + " " + axqr2S;
    let response = await fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + aTokena, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "@": btoa(axFullBody) }),
        redirect: "follow"
    });

    let acData = await response.json();
    const filteredArray = acData //.filter(condition);

    let abc;
    if (filteredArray.length === 0) { //pass                
        abc = 0;
    } else { // not pass
        console.log("not found ", filteredArray.length)
        abc = 1;
    }
    return abc;
}


const updateLogoClasses = () => {
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
}
const aHeaderHide = () => {
    document.getElementById("header").style.display = "none";
    document.getElementById("setb").style.display = "none";
    updateLogoClasses();
    document.querySelector(".logo-container").style.display = "block";
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
}
var aaXXrgX = atob(aaXrgX); //// console.log( aaXXrgX );
var aRGarray = aaXXrgX.split(',');

const aaProgramName = "Expenses Reimbursement"

$(() => {
    var aDatabasea = "ExtraOnLine.dbo.TaskControl";
    var aKeyField = "TaskGroup";
    var aKeyIDa = "main"; //aaPXIXD;
    var axFieldSelected = "IDNO,TaskName,TaskProgram,TaskGroup";
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

            var aPwdNoChange = ausrProperty[0].asAct  //localStorage["asAct"]
            var aDeptNamea = ausrProperty[0].asDEPT; // department
            var aRightsa = atob(ausrProperty[0].aaXrXg).includes(aVARs.ACHKRIGHTS); // rights admin,nusert,nusero,nuserf,HODApp .include("HOD")
            if (aPwdNoChange === false) {
                aaCnfBody = aArrays.ACHGPWDS[0]
                DevExpress.ui.dialog.alert({
                    position: { offset: "0 -90" },
                    title: aArrays.ACHGPWDS[1], //"PLEASE CHANGE DEFAULT PASSWORD",
                    messageHtml: aaCnfBody
                });
                localStorage["aDXMenuTitle"] = "User Information"; // Parameters for Blankpage
                localStorage["aPXIXD"] = "SSSU9019";     // Parameters  
                aRuniFrame("./SSSU9019.html", "User Information")
            }
            if (aPwdNoChange === true && aRightsa && aVARs.ACHKDAYS > 0) {
                var aDatabasea = "ExtraOnLine.dbo.GIFTREC";
                var aKeyField = "ExpGroupCode" //"HeadRefNo"; "REFNO"
                var aKeyIDa = "700" //  T2408177541 "T2408152724" +"-001" 
                var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";
                var aaCondition = ` where ${aKeyField} = '${aKeyIDa}' and Department = '${aDeptNamea}' and ERStatus LIKE '%finish%' and (MONTH(ReqDate) = MONTH(GETDATE()) AND YEAR(ReqDate) = YEAR(GETDATE()));`
                var condition = aaCondition
                axLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                    .then(atestCehcka => {

                        if (atestCehcka === 1 && aVARs.ALLALERT === "NO") {
                        } else {
                            if (adayx > aVARs.ACHKDAYS) {
                                let result = DevExpress.ui.dialog.alert(aArrays.ALERT01[0], aArrays.ALERT01[1]);
                                localStorage["aDXMenuTitle"] = "Gift & Entertain"; // Parameters for Blankpage
                                localStorage["aPXIXD"] = "MXXINCOME";     // Parameters                          
                                aRuniFrame("./MXXINCOME.html", "Gift & Entertain")
                            } else if (adayx <= aVARs.ACHKDAYS) { //
                                let result = DevExpress.ui.dialog.confirm(aArrays.ALERT02[0], aArrays.ALERT02[1]);
                                result.done(function (dresult) {//                                                                                                                                                                                                                    
                                    if (dresult) {
                                        localStorage["aDXMenuTitle"] = "Gift & Entertain"; // Parameters for Blankpage
                                        localStorage["aPXIXD"] = "MXXINCOME";     // Parameters  
                                        aRuniFrame("./MXXINCOME.html", "Gift & Entertain")
                                    }
                                });

                            }
                        } //axLoadData
                    }); // then check           
            }
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12 
            const currentYear = currentDate.getFullYear();
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
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
            };

            let aURL = aaPFDMI + "/DMQ/" + acPRJ + "/" + atob(aaXToX) + "/" + aaXTBM + "/all"

            fetch(aURL, requestOptions)
                .then(response => response.json())
                .then(e => {
                    aObjMenuV = e;
                    $.each(aObjMenuV, function (i) {
                        if (!e[i].categoryid) {
                            delete aObjMenuV[i].categoryid;
                        };
                    });

                    $.each(aObjMenuV, function (i) {
                        var aaMenuS = e[i].rightsgroup;
                        var aaMenuAr = aaMenuS.split(',');
                        var aPassRg = aArrayCompare(aaMenuAr, aRGarray);
                        if (!aPassRg && aaMenuS != "") {
                            var ObjVSData = { visible: false };
                            $.extend(aObjMenuV[i], ObjVSData);
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
                    var drawer = $("#drawer").dxDrawer({
                        opened: true, //false,
                        height: 1000,
                        closeOnOutsideClick: true, //true,
                        template: function () {
                            var $list = $("<div class = 'left-content'>")//.addClass("dx-theme-accent-as-text-color");//.width(250).addClass("dx-icon"); //id='leftbar' .addClass("dx-theme-accent-as-text-color").addClass("dx-icon")
                            return $list.dxTreeView({
                                items: aObjMenuV,
                                keyExpr: "ID",
                                parentIdExpr: "categoryid",
                                dataStructure: "plain",
                                searchEnabled: false,
                                expandEvent: "click",
                                displayExpr: "name",
                                focusStateEnabled: false,
                                height: 1000,
                                onItemClick: function (e) {
                                    $(".dx-icon").addClass("dx-theme-accent-as-text-color");
                                    var item = e.itemData;
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
                                showTitle: true, //true,
                                stylingMode: "text", //"filled",
                                width: 10,
                                onItemClick: function (value) {
                                    var aResult = value.itemData.onClick;
                                }
                            }
                            
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
                });

        }); // load content

});

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
            aPass = val;
            return false;
        } else {
            aPass = "";
        }
    })
    return aPass;
};

const aThemeSelect = () => {
    var aRgsValue = localStorage["aDXTheme"];
    $(() => {
        $("#popupSelect").dxPopup({
            title: "THEMES",
            height: '140px',
            width: '250px',
            position: { offset: "0 -250" }, //{offset: "0 -180"},
            visible: true,
            contentTemplate: function () {
                return $("<div />").append(
                    $("<p><center><div id='tselect'></div></center></p>"),
                );
            },
        }).dxPopup("instance");

        $("#tselect").dxSelectBox({
            width: 200,
            dataSource: aThemeListGroup,
            valueExpr: "thid",
            displayExpr: "text",
            grouped: true,
            value: aRgsValue, // aThemeList[aTItemNo].thid, //
            onValueChanged: function (args) {
                DevExpress.ui.themes.current(args.value);
                localStorage["aDXTheme"] = args.value;
                var str = args.value;
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
                }
                $("#tframe").attr("src", $("#tframe").attr("src"));  // refresh iFrame
                $("#popupSelect").dxPopup("hide");
            }
        }).dxSelectBox("instance");


    });
}
