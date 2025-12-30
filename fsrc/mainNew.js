
// mains.optimized.js - Optimized from mains.js

// ===== Constants & Config =====
const REFRESH_INTERVAL = 24000000; // 40 minutes
const CRYPTO_KEY = "sBxA017";
const DEFAULT_THEME = "generic.light";
const DEFAULT_AVATAR = "/images/userss.png";
const PROGRAM_NAME = "Expenses Reimbursement";
const THEME_STORAGE_KEY = "aDXTheme";

// ===== On Load Refresh Prevention & Back Navigation Control =====
window.onload = () => setTimeout(() => location.reload(), REFRESH_INTERVAL);

history.pushState(null, null, location.href);
window.onpopstate = () => history.go(1);

// ===== Decrypt User Properties =====
const storedJsonString = localStorage.getItem("usrProperty");
const decryptedData = CryptoJS.AES.decrypt(storedJsonString, CRYPTO_KEY).toString(CryptoJS.enc.Utf8);
const ausrProperty = JSON.parse(decryptedData);

// ===== Cache Common Elements =====
const elUserName = document.getElementById("aUsrName");
const elAvatar = document.getElementById("avatar");
const elTFrame = $("#tframe");
const elWorkingLabel = $("#workinglabel");

// ===== Set Theme on Window Load =====
window.addEventListener("load", () => {
    const theme = ausrProperty?.[0]?.aaDXtm || DEFAULT_THEME;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
});

// ===== Document Ready =====
$(function () {
    let theme = ausrProperty?.[0]?.aaDXtm || DEFAULT_THEME;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    DevExpress.ui.themes.current(theme);
    $(".dx-icon").addClass("dx-theme-accent-as-text-color");

    // Set User Info
    elUserName.textContent = ausrProperty?.[0]?.aaXXuX || "";
    elAvatar.src = ausrProperty?.[0]?.aaXpXt || DEFAULT_AVATAR;

    // ===== Menu & Rights Setup =====
    const aaXToX = ausrProperty?.[0]?.aaXXoX;
    const aaXTBM = "d1a42aa7-349e-477c-8f26-75781206caeb";
    const aaPFDMI = isLocalHost();

    const aaXrgX = ausrProperty?.[0]?.aaXrXg;
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

    fetch(`${aaPFDMI}/DMQ/${acPRJ}/${atob(aaXToX)}/${aaXTBM}/all`, requestOptions)
        .then(res => res.json())
        .then(menuData => {
            let aObjMenuV = menuData.map(item => {
                if (!item.categoryid) delete item.categoryid;
                return item;
            });

            // Rights Filtering
            aObjMenuV.forEach(item => {
                const menuRights = item.rightsgroup?.split(",") || [];
                if (!aArrayCompare(menuRights, aRGarray) && item.rightsgroup) {
                    item.visible = false;
                }
            });

            // Sort by ID
            aObjMenuV.sort((a, b) => (a.ID > b.ID ? 1 : -1));

            // Force menu if password not changed
            if (aPwdNoChange === false) {
                aObjMenuV = [
                    { ID: '[990]', name: 'User Information', icon: 'fas fa-user-edit', alabel: 'User Information', url: './SSSU9019.html', rightsgroup: '', PageID: 'SSSU9019' },
                    { ID: '[99900]', name: 'Help', icon: 'help', alabel: 'Help', url: './Help.html', rightsgroup: '', PageID: '' },
                    { ID: '[999999]', name: 'Logout', icon: 'fas fa-sign-out-alt', alabel: 'Logout', url: 'aaLOGOUT()', rightsgroup: '', PageID: '' },
                ];
            }

            // Drawer Init
            const drawer = $("#drawer").dxDrawer({
                opened: true,
                height: 1000,
                closeOnOutsideClick: true,
                template: () => $("<div class='left-content'>").dxTreeView({
                    items: aObjMenuV,
                    keyExpr: "ID",
                    parentIdExpr: "categoryid",
                    dataStructure: "plain",
                    displayExpr: "name",
                    focusStateEnabled: false,
                    height: 1000,
                    onItemClick: e => {
                        $(".dx-icon").addClass("dx-theme-accent-as-text-color");
                        localStorage.setItem("aDXMenuTitle", e.itemData.name);
                        localStorage.setItem("aPXIXD", e.itemData.PageID);
                        localStorage.setItem("MMaMx", aArrayMatch(e.itemData.rightsgroup?.split(",") || [], aRGarray));

                        if (e.itemData.url) {
                            e.itemData.url.startsWith("./")
                                ? (elTFrame.attr("src", e.itemData.url), elWorkingLabel.text(e.itemData.alabel))
                                : eval(e.itemData.url);
                        } else {
                            elTFrame.attr("src", "");
                            elWorkingLabel.text(e.itemData.alabel || "");
                        }
                    }
                })
            }).dxDrawer("instance");

            // Toolbar Init
            $("#toolbar").dxToolbar({
                items: [
                    {
                        widget: "dxButton",
                        location: "before",
                        options: { icon: "menu", stylingMode: "text", onClick: () => drawer.toggle() }
                    },
                    {
                        widget: "dxMenu",
                        location: "after",
                        options: {
                            dataSource: [{
                                id: "01",
                                icon: "fas fa-bullseye",
                                text: "",
                                items: [
                                    { ID: "105", text: "Help", type: "danger", icon: "help", visible: true, onClick: () => aRuniFrame("./Help.html", "Help") },
                                    { ID: "105", text: "Logout", type: "danger", icon: "fas fa-sign-out-alt", visible: true, onClick: () => aaGOTO('index.html') },
                                    { ID: "106", text: "Themes", type: "normal", icon: "fas fa-palette", visible: true, onClick: aThemeSelect },
                                ]
                            }],
                            hideSubmenuOnMouseLeave: true
                        }
                    },
                    { location: "before", template: () => $("<div id='workinglabel' class='toolbar-label'></div>").text(PROGRAM_NAME) }
                ]
            });
        })
        .catch(err => console.error("Menu Load Error:", err));
});

// ===== Utility Functions =====
const aGoTo = url => window.location.assign(url);
const aaGOTO = url => window.location.assign(url);
const aaLOGOUT = () => window.location.assign("index.html");

const aRuniFrame = (pageUrl, title) => {
    $("#tframe").attr("src", pageUrl);
    $("#workinglabel").text(title);
};

const aArrayCompare = (a, b) => b.some(val => a.includes(val.split("0")[0] || val));
const aArrayMatch = (a, b) => b.find(val => a.includes(val.split("0")[0] || val)) || "";

const aThemeSelect = () => {
    const aRgsValue = localStorage.getItem(THEME_STORAGE_KEY);
    $("#popupSelect").dxPopup({
        title: "THEMES",
        height: "140px",
        width: "250px",
        position: { offset: "0 -250" },
        visible: true,
        contentTemplate: () => $("<div />").append($("<p><center><div id='tselect'></div></center></p>"))
    }).dxPopup("instance");

    $("#tselect").dxSelectBox({
        width: 200,
        dataSource: new DevExpress.data.DataSource({ store: aThemeList, key: "thid", group: "Category" }),
        valueExpr: "thid",
        displayExpr: "text",
        grouped: true,
        value: aRgsValue,
        onValueChanged: e => {
            DevExpress.ui.themes.current(e.value);
            localStorage.setItem(THEME_STORAGE_KEY, e.value);
            $("#tframe").attr("src", $("#tframe").attr("src")); // Refresh iFrame
            $("#popupSelect").dxPopup("hide");
        }
    }).dxSelectBox("instance");
};
