
// Prevent back button navigation
history.pushState(null, null, location.href);
window.onpopstate = () => history.go(1);

// Load user properties from localStorage
const storedJsonString = localStorage.getItem("usrProperty");
const decryptedData = CryptoJS.AES.decrypt(storedJsonString, "sBxA017").toString(CryptoJS.enc.Utf8);
const ausrProperty = JSON.parse(decryptedData);

// Apply theme + user info on load
window.addEventListener("load", () => {
    const { aaDXtm: userTheme = "generic.light", aaXXuX: userName, aaXpXt: avatarPath } = ausrProperty[0];
    localStorage.setItem("aDXTheme", userTheme);
    DevExpress.ui.themes.current(userTheme);

    document.querySelector("#aUsrName").textContent = userName;
    document.querySelector("#avatar").src = avatarPath || "/images/userss.png";
    document.querySelector(".logo-container").style.display = "none";
});

// Navigation helpers
const goTo = url => window.location.assign(url);
const logout = () => goTo("index.html");

// API fetch helper
const fetchJSON = async (url, options) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("Fetch failed:", err);
        return null;
    }
};

// Globals from decrypted user data
const aaXToX = ausrProperty[0]?.aaXXoX;
const aaXTBM = "d1a42aa7-349e-477c-8f26-75781206caeb";
const aaPFDMI = isLocalHost();
const aOPFDMI = window.location.origin;
const aFPFDMI = aOPFDMI.includes("localhost") ? `${aOPFDMI}/` : `${aOPFDMI}/${acPRJs}/`;

console.log(window.location.origin, aFPFDMI);

// Option Menu
const aOptionMenu = [{
    id: "menu01",
    icon: "fas fa-bullseye first-icon",
    text: "",
    items: [
        { ID: "101", text: "GEN OTP (TEXT & NUM)", type: "normal", icon: "fi fi-sr-rocket", visible: false, onClick: () => aMessageAlert(`OTP =${generateLOTP()}`, "Teal") },
        { ID: "102", text: "GEN OTP (NUM ONLY)", type: "normal", icon: "fi fi-br-rocket", visible: false, onClick: () => aMessageAlert(`OTP =${generateOTP()}`, "Teal") },
        { ID: "103", text: "LOGIN (OTP)", type: "normal", icon: "fas fa-lock", visible: false, onClick: () => aRunLogin(1) },
        { ID: "104", text: "New Login", type: "normal", icon: "fas fa-key", visible: false, onClick: () => aRunLogin() },
        { ID: "105", text: "Help", type: "danger", icon: "help", visible: true, onClick: () => aRuniFrame("./Help.html", "Help") },
        { ID: "106", text: "Help (Phase 2)", type: "normal", icon: "help", visible: true, onClick: () => aPopupHelp("HELP", `${aaPFDMI}/temp/uploads/upload.pdf`) },
        { ID: "107", text: "Chatbot", type: "normal", icon: "fas fa-robot", visible: true, onClick: () => aPopupHelp("Chatbot", `${aFPFDMI}TCHATBOT.html`) },
        { ID: "108", text: "Logout", type: "danger", icon: "fas fa-sign-out-alt", visible: true, onClick: () => goTo("index.html") },
        { ID: "109", text: "Themes", type: "normal", badge: "12", icon: "fas fa-palette", visible: true, onClick: () => aThemeSelect() },
        { ID: "110", text: "Header Hide", type: "normal", icon: "fas fa-toggle-off", visible: true, onClick: () => aHeaderHide() },
        { ID: "111", text: "Header Show", type: "normal", icon: "fas fa-toggle-on", visible: true, onClick: () => aHeaderShow() },
    ]
}];

// Date setup
const achkdate = new Date();
const adayx = achkdate.getDate();
const amonthx = achkdate.getMonth();

// Database helpers
const a4LoadData = async (aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, aReturnField) => {
    const aTokena = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
    const axqr2S = `Where ${aKeyfield} LIKE '%${aKeya}%'`;
    const axFullBody = `Select ${axFieldSelected} From ${aDataBasea} ${axqr2S}`;
    const url = `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/${aTokena}`;
    return await fetchJSON(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "@": btoa(axFullBody) }),
        redirect: "follow"
    });
};

const axLoadData = async (aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, condition) => {
    const aTokena = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
    const axFullBody = `Select ${axFieldSelected} From ${aDataBasea} ${condition}`;
    const url = `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/${aTokena}`;
    const data = await fetchJSON(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "@": btoa(axFullBody) }),
        redirect: "follow"
    });
    return (data?.length ?? 0) > 0 ? 1 : 0;
};

// UI Helpers
const updateLogoClasses = () => {
    const logoImage = document.querySelector(".logo-disappear");
    if (logoImage) {
        logoImage.classList.add("logo-toolbar");
        logoImage.classList.remove("logo-disappear");
    }
};
const aHeaderShow = () => {
    document.querySelector("#header").style.display = "block";
    document.querySelector("#setb").style.display = "block";
    document.querySelector(".logo-container").style.display = "none";
};
const aHeaderHide = () => {
    document.querySelector("#header").style.display = "none";
    document.querySelector("#setb").style.display = "none";
    updateLogoClasses();
    document.querySelector(".logo-container").style.display = "block";
};
const aRuniFrame = (aPageUrl, aTMessage) => {
    document.querySelector("#tframe").src = aPageUrl;
    document.querySelector("#workinglabel").textContent = aTMessage;
};

// Seasonal images
let aimages = [];
if (adayx <= 10 && amonthx === 0) {
    aimages = ['xmas01.jpg','xmas02.jpg','xmas03.jpg','xmas04.jpg','xmas05.jpg','chny01.jpg','chny02.jpg','chny03.jpg','chny04.jpg'];
} else if ((adayx > 10 && amonthx === 0) || amonthx >= 1) {
    aimages = ['chny01.jpg','chny02.jpg','chny03.jpg','chny04.jpg'];
}

// Theme list + grouped datasource
const aThemeList = [
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

const aThemeListGroup = new DevExpress.data.DataSource({
    store: aThemeList,
    key: "thid",
    group: "Category"
});

// Array compare helpers
const aArrayCompare = (a, b) => b.some(val => {
    const aval2s = val.split("0")[0] || val;
    return a.includes(aval2s);
});
const aArrayMatch = (a, b) => {
    for (const val of b) {
        const aval2s = val.split("0")[0] || val;
        if (a.includes(aval2s)) return val;
    }
    return "";
};

// Theme selector
const aThemeSelect = () => {
    const aRgsValue = localStorage["aDXTheme"];
    $(() => {
        $("#popupSelect").dxPopup({
            title: "THEMES",
            height: "140px",
            width: "250px",
            position: { offset: "0 -250" },
            visible: true,
            contentTemplate: () => $("<div />").append("<p><center><div id='tselect'></div></center></p>"),
        }).dxPopup("instance");

        $("#tselect").dxSelectBox({
            width: 200,
            dataSource: aThemeListGroup,
            valueExpr: "thid",
            displayExpr: "text",
            grouped: true,
            value: aRgsValue,
            onValueChanged: args => {
                DevExpress.ui.themes.current(args.value);
                localStorage["aDXTheme"] = args.value;
                if (args.value.includes("dark")) {
                    $("#mainlogo").attr("src", "./images/locktonlogo70mmwhite.png");
                    $("#logobarid").removeClass("logobarwhite").addClass("logobarblack");
                    $("#leftbar").removeClass("left-content").addClass("dx-theme-accent-as-background-color");
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
};
