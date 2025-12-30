
// mains.optimized.v2.js - Fixes for theme application and TreeView slowness

// ===== Constants & Config =====
const REFRESH_INTERVAL = 24000000; // 40 minutes
const CRYPTO_KEY = "sBxA017";
const DEFAULT_THEME = "generic.light";
const DEFAULT_AVATAR = "/images/userss.png";
const PROGRAM_NAME = "Expenses Reimbursement";
const THEME_STORAGE_KEY = "aDXTheme";

// ===== Theme list (kept from original) =====
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
const aThemeListGroup = new DevExpress.data.DataSource({ store: aThemeList, key: "thid", group: "Category" });

// ===== On Load Refresh Prevention & Back Navigation Control =====
window.onload = () => setTimeout(() => location.reload(), REFRESH_INTERVAL);
history.pushState(null, null, location.href);
window.onpopstate = () => history.go(1);

// ===== Decrypt User Properties =====
const storedJsonString = localStorage.getItem("usrProperty");
let ausrProperty = [];
try {
    const decryptedData = CryptoJS.AES.decrypt(storedJsonString || "", CRYPTO_KEY).toString(CryptoJS.enc.Utf8) || "";
    ausrProperty = decryptedData ? JSON.parse(decryptedData) : [];
} catch (e) {
    console.error("Failed to parse usrProperty:", e);
}

// ===== Immediately set theme before building widgets (fixes 'first run' theme issue) =====
const initialTheme = ausrProperty?.[0]?.aaDXtm || DEFAULT_THEME;
localStorage.setItem(THEME_STORAGE_KEY, initialTheme);
// Set theme synchronously before initializing DevExtreme widgets
try {
    DevExpress.ui.themes.current(initialTheme);
} catch (e) {
    console.warn("DevExpress theme set failed at top-level (will retry later):", e);
}
// Ensure icon classes and logo reflect the theme ASAP
const applyThemeClasses = (themeName) => {
    if (!themeName) return;
    if (themeName.includes("dark")) {
        $("#mainlogo").attr("src", "./images/locktonlogo70mmwhite.png");
        $("#logobarid").removeClass("logobarwhite").addClass("logobarblack");
    } else {
        $("#mainlogo").attr("src", "./images/locktonlogo70mmwhite.png");
        $("#logobarid").removeClass("logobarwhite").addClass("logobarblack");
        $(".dx-icon").addClass("dx-theme-accent-as-text-color");
    }
};
// Apply theme classes once shortly after load (gives DevExtreme a moment to apply CSS)
setTimeout(() => applyThemeClasses(initialTheme), 60);

// ===== Cache Common Elements =====
const elUserName = document.getElementById("aUsrName");
const elAvatar = document.getElementById("avatar");
const elTFrame = $("#tframe");
const elWorkingLabel = $("#workinglabel");

// ===== Document Ready (main init) =====
$(function () {
    // Ensure theme is set again right before widgets init (safe)
    const themeNow = localStorage.getItem(THEME_STORAGE_KEY) || initialTheme;
    try { DevExpress.ui.themes.current(themeNow); } catch (e) { /* ignore */ }
    applyThemeClasses(themeNow);

    // Set User Info
    if (elUserName) elUserName.textContent = ausrProperty?.[0]?.aaXXuX || "";
    if (elAvatar) elAvatar.src = ausrProperty?.[0]?.aaXpXt || DEFAULT_AVATAR;

    // ===== Menu & Rights Setup =====
    const aaXToX = ausrProperty?.[0]?.aaXXoX || "";
    const aaXTBM = "d1a42aa7-349e-477c-8f26-75781206caeb";
    const aaPFDMI = isLocalHost();

    const aaXrgX = ausrProperty?.[0]?.aaXrXg || "";
    const aRGarray = aaXrgX ? atob(aaXrgX).split(",") : [];

    const aPwdNoChange = ausrProperty?.[0]?.asAct;

    let aimages = [];
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    if (day <= 10 && month === 0) {
        aimages = ['xmas01.jpg', 'xmas02.jpg', 'xmas03.jpg', 'xmas04.jpg', 'xmas05.jpg', 'chny01.jpg', 'chny02.jpg', 'chny03.jpg', 'chny04.jpg'];
    } else if ((day > 10 && month === 0) || month >= 1) {
        aimages = ['chny01.jpg', 'chny02.jpg', 'chny03.jpg', 'chny04.jpg'];
    }

    // ===== Fetch Menu =====
    const requestOptions = {
        method: 'POST',
        headers: new Headers({ "Content-Type": "application/json" }),
        redirect: 'follow'
    };

    const menuUrl = `${aaPFDMI}/DMQ/${acPRJ}/${atob(aaXToX)}/${aaXTBM}/all`;
    fetch(menuUrl, requestOptions)
        .then(res => res.json())
        .then(menuData => {
            // light-weight sanitization and rights filtering
            let aObjMenuV = menuData.map(i => {
                if (!i.categoryid) delete i.categoryid;
                return i;
            });

            // Rights Filtering - use for loop (faster than $.each)
            for (let i = 0, len = aObjMenuV.length; i < len; i++) {
                const item = aObjMenuV[i];
                const aaMenuS = item.rightsgroup || "";
                if (aaMenuS) {
                    const aaMenuAr = aaMenuS.split(',');
                    if (!aArrayCompare(aaMenuAr, aRGarray)) {
                        item.visible = false; // prefer mutation over delete for stable indexes
                    }
                }
            }

            // Sort by ID (string compare)
            aObjMenuV.sort((a, b) => (a.ID > b.ID ? 1 : -1));

            // Force menu if password not changed
            if (aPwdNoChange === false) {
                aObjMenuV = [
                    { ID: '[990]', name: 'User Information', icon: 'fas fa-user-edit', alabel: 'User Information', url: './SSSU9019.html', rightsgroup: '', PageID: 'SSSU9019' },
                    { ID: '[99900]', name: 'Help', icon: 'help', alabel: 'Help', url: './Help.html', rightsgroup: '', PageID: '' },
                    { ID: '[999999]', name: 'Logout', icon: 'fas fa-sign-out-alt', alabel: 'Logout', url: 'aaLOGOUT()', rightsgroup: '', PageID: '' },
                ];
            }

            // DRAWER TEMPLATE - create TreeView once and avoid heavy DOM work in onItemClick
            const drawer = $("#drawer").dxDrawer({
                opened: true,
                height: 1000,
                closeOnOutsideClick: true,
                template: function () {
                    // Create container with id leftbar (keeps CSS intact)
                    const $list = $("<div id='leftbar' class='left-content'></div>");
                    // Create TreeView with minimal expensive operations inside events
                    $list.dxTreeView({
                        items: aObjMenuV,
                        keyExpr: "ID",
                        parentIdExpr: "categoryid",
                        dataStructure: "plain",
                        displayExpr: "name",
                        focusStateEnabled: false,
                        expandEvent: "click", // keep click expand behavior
                        searchEnabled: false,
                        height: 1000,
                        // Optimize: avoid calling heavy jQuery selectors on every click (no global .dx-icon changes here)
                        onItemClick: function (e) {
                            const item = e.itemData;
                            // Store minimal values; avoid expensive DOM writes
                            localStorage.setItem("aDXMenuTitle", item.name || "");
                            localStorage.setItem("aPXIXD", item.PageID || "");
                            localStorage.setItem("MMaMx", aArrayMatch((item.rightsgroup || "").split(","), aRGarray));

                            if (item.url) {
                                if (item.url.startsWith("./")) {
                                    elTFrame.attr("src", item.url);
                                    elWorkingLabel.text(item.alabel || "");
                                } else {
                                    // Evaluate existing behaviour for programatic calls
                                    try { eval(item.url); } catch (err) { console.error("Error evaluating menu URL:", err); }
                                }
                            } else {
                                elTFrame.attr("src", "");
                                elWorkingLabel.text(item.alabel || "");
                            }
                        }
                    });
                    return $list;
                }
            }).dxDrawer("instance");

            // Toolbar Init - lightweight menu items only
            $("#toolbar").dxToolbar({
                items: [
                    {
                        widget: "dxButton",
                        location: "before",
                        options: {
                            icon: "menu",
                            stylingMode: "text",
                            onClick: function () { drawer.toggle(); }
                        }
                    },
                    {
                        widget: "dxMenu",
                        location: "after",
                        options: {
                            dataSource: [
                                {
                                    id: "01",
                                    icon: "fas fa-bullseye",
                                    text: "",
                                    items: [
                                        { ID: "105", text: "Help", type: "danger", icon: "help", visible: true, onClick: function () { aRuniFrame("./Help.html", "Help"); } },
                                        { ID: "105", text: "Logout", type: "danger", icon: "fas fa-sign-out-alt", visible: true, onClick: function () { aaGOTO('index.html'); } },
                                        { ID: "106", text: "Themes", type: "normal", icon: "fas fa-palette", visible: true, onClick: function () { aThemeSelect(); } },
                                    ]
                                }
                            ],
                            hideSubmenuOnMouseLeave: true,
                            cssClass: "toolsmenu",
                            displayExpr: "text",
                            valueExpr: "ID",
                            showTitle: true,
                            stylingMode: "text"
                        }
                    },
                    {
                        location: "before",
                        locateInMenu: "never",
                        template: function () { return $("<div id='workinglabel' class='toolbar-label'></div>").text(PROGRAM_NAME); }
                    }
                ]
            });

        })
        .catch(err => {
            console.error("Menu Load Error:", err);
        });

}); // end ready

// ===== Utility Functions =====
const aGoTo = url => window.location.assign(url);
const aaGOTO = url => window.location.assign(url);
const aaLOGOUT = () => window.location.assign("index.html");

const aRuniFrame = (pageUrl, title) => {
    $("#tframe").attr("src", pageUrl);
    $("#workinglabel").text(title);
};

const aArrayCompare = (a, b) => {
    if (!a || !b) return false;
    for (let i = 0; i < b.length; i++) {
        const val = b[i];
        const key = String(val).split("0")[0] || val;
        if (a.indexOf(key) !== -1) return true;
    }
    return false;
};
const aArrayMatch = (a, b) => {
    if (!a || !b) return "";
    for (let i = 0; i < b.length; i++) {
        const val = b[i];
        const key = String(val).split("0")[0] || val;
        if (a.indexOf(key) !== -1) return val;
    }
    return "";
};

const aThemeSelect = () => {
    const aRgsValue = localStorage.getItem(THEME_STORAGE_KEY) || initialTheme;
    $("#popupSelect").dxPopup({
        title: "THEMES",
        height: '140px',
        width: '250px',
        position: { offset: "0 -250" },
        visible: true,
        contentTemplate: function () {
            return $("<div />").append($("<p><center><div id='tselect'></div></center></p>"));
        }
    }).dxPopup("instance");

    $("#tselect").dxSelectBox({
        width: 200,
        dataSource: aThemeListGroup,
        valueExpr: "thid",
        displayExpr: "text",
        grouped: true,
        value: aRgsValue,
        onValueChanged: function (args) {
            // Apply theme and update UI quickly but lightly
            try { DevExpress.ui.themes.current(args.value); } catch (e) { console.warn("Theme change failed:", e); }
            localStorage.setItem(THEME_STORAGE_KEY, args.value);
            // Update logos / icons to match theme
            applyThemeClasses(args.value);
            // Force refresh of the iframe only, not the whole page
            const cur = $("#tframe").attr("src");
            $("#tframe").attr("src", cur);
            $("#popupSelect").dxPopup("hide");
        }
    }).dxSelectBox("instance");
};
