// themeLoader.js
// Loads DevExtreme theme + user info (username, avatar) from encrypted usrProperty.
// Requires: CryptoJS (AES) and DevExtreme (dx.all.js) loaded BEFORE this file.

(function () {
    var THEME_KEY = "aDXTheme";
    var USR_KEY = "usrProperty";
    var AES_KEY = "sBxA017";
    var DEFAULT_THEME = "material.blue.light.compact";

    // Complete map of DevExtreme themes to CSS files
    var THEME_FILE_MAP = {'generic.light': 'dx.light.css', 'generic.dark': 'dx.dark.css', 'generic.carmine': 'dx.carmine.css', 'generic.softblue': 'dx.softblue.css', 'generic.darkmoon': 'dx.darkmoon.css', 'generic.darkviolet': 'dx.darkviolet.css', 'generic.greenmist': 'dx.greenmist.css', 'generic.contrast': 'dx.contrast.css', 'generic.light.compact': 'dx.light.compact.css', 'generic.dark.compact': 'dx.dark.compact.css', 'generic.carmine.compact': 'dx.carmine.compact.css', 'generic.softblue.compact': 'dx.softblue.compact.css', 'generic.darkmoon.compact': 'dx.darkmoon.compact.css', 'generic.darkviolet.compact': 'dx.darkviolet.compact.css', 'generic.greenmist.compact': 'dx.greenmist.compact.css', 'generic.contrast.compact': 'dx.contrast.compact.css', 'material.blue.light': 'dx.material.blue.light.css', 'material.blue.dark': 'dx.material.blue.dark.css', 'material.lime.light': 'dx.material.lime.light.css', 'material.lime.dark': 'dx.material.lime.dark.css', 'material.orange.light': 'dx.material.orange.light.css', 'material.orange.dark': 'dx.material.orange.dark.css', 'material.purple.light': 'dx.material.purple.light.css', 'material.purple.dark': 'dx.material.purple.dark.css', 'material.teal.light': 'dx.material.teal.light.css', 'material.teal.dark': 'dx.material.teal.dark.css', 'material.blue.light.compact': 'dx.material.blue.light.compact.css', 'material.blue.dark.compact': 'dx.material.blue.dark.compact.css', 'material.lime.light.compact': 'dx.material.lime.light.compact.css', 'material.lime.dark.compact': 'dx.material.lime.dark.compact.css', 'material.orange.light.compact': 'dx.material.orange.light.compact.css', 'material.orange.dark.compact': 'dx.material.orange.dark.compact.css', 'material.purple.light.compact': 'dx.material.purple.light.compact.css', 'material.purple.dark.compact': 'dx.material.purple.dark.compact.css', 'material.teal.light.compact': 'dx.material.teal.light.compact.css', 'material.teal.dark.compact': 'dx.material.teal.dark.compact.css', 'fluent.blue.light': 'dx.fluent.blue.light.css', 'fluent.blue.dark': 'dx.fluent.blue.dark.css', 'fluent.saas.light': 'dx.fluent.saas.light.css', 'fluent.saas.dark': 'dx.fluent.saas.dark.css', 'fluent.blue.light.compact': 'dx.fluent.blue.light.compact.css', 'fluent.blue.dark.compact': 'dx.fluent.blue.dark.compact.css', 'fluent.saas.light.compact': 'dx.fluent.saas.light.compact.css', 'fluent.saas.dark.compact': 'dx.fluent.saas.dark.compact.css'};

    function log(msg) {
        try { console.log("[themeLoader]", msg); } catch (e) {}
    }

    function safeParseJSON(str) {
        try { return JSON.parse(str); } catch (e) { return null; }
    }

    function getUsrProperty() {
        try {
            var storedJsonString = localStorage.getItem(USR_KEY);
            if (!storedJsonString) {
                log("usrProperty not found in localStorage");
                return null;
            }
            var decrypted = CryptoJS.AES.decrypt(storedJsonString, AES_KEY).toString(CryptoJS.enc.Utf8);
            if (!decrypted) {
                log("usrProperty decrypt returned empty string");
                return null;
            }
            var parsed = safeParseJSON(decrypted);
            if (!parsed || !parsed.length) {
                log("usrProperty JSON parse failed or empty array");
                return null;
            }
            // expose globally
            window.ausrProperty = parsed;
            return parsed;
        } catch (err) {
            log("Error reading usrProperty: " + err);
            return null;
        }
    }

    function resolveTheme() {
        var props = getUsrProperty();
        var themeFromUser = null;

        if (props && props[0] && typeof props[0].aaDXtm !== "undefined") {
            themeFromUser = String(props[0].aaDXtm).trim();
            if (themeFromUser === "") {
                themeFromUser = null; // treat empty as not set
            }
        }

        var theme = themeFromUser || localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
        localStorage.setItem(THEME_KEY, theme);
        return theme;
    }

    // function loadDxTheme(themeName) {
    //     var fileName = THEME_FILE_MAP[themeName] || ("dx." + themeName + ".css");
    //     var href = "DevExpressDevExtreme/Lib/css/" + fileName;

    //     var oldLink = document.getElementById("dx-theme-link");
    //     if (oldLink && oldLink.parentNode) oldLink.parentNode.removeChild(oldLink);

    //     var link = document.createElement("link");
    //     link.id = "dx-theme-link";
    //     link.rel = "stylesheet";
    //     link.href = href;
    //     document.head.appendChild(link);
    //     log("Applied CSS: " + href);
    // }

    function loadDxTheme(themeName) {
        var fileName = THEME_FILE_MAP[themeName] || ("dx." + themeName + ".css");
        var href = "DevExpressDevExtreme/Lib/css/" + fileName;
    
        var oldLink = document.getElementById("dx-theme-link");
        if (oldLink && oldLink.parentNode) oldLink.parentNode.removeChild(oldLink);
    
        var link = document.createElement("link");
        link.id = "dx-theme-link";
        link.rel = "stylesheet";
        link.href = href;
    
        // 🔥 When the CSS finishes loading, repaint all DevExtreme widgets
        link.onload = function () {
            log("Theme CSS loaded: " + href);
            if (window.DevExpress && DevExpress.ui) {
                DevExpress.ui.repaint();
            }
        };
    
        document.head.appendChild(link);
    }
    
    function setDevExtremeTheme(themeName) {
        if (window.DevExpress && DevExpress.ui && DevExpress.ui.themes) {
            try {
                DevExpress.ui.themes.current(themeName);
                log("DevExtreme current theme set to: " + themeName);
            } catch (e) {
                log("Failed to set DevExtreme theme: " + e);
            }
        }
    }

    function updateUserInfo() {
        if (!window.ausrProperty || !ausrProperty[0]) return;

        let user = ausrProperty[0];

        // Username
        if (user.aaXXuX && document.getElementById("aUsrName")) {
            document.getElementById("aUsrName").innerHTML = user.aaXXuX;
        }

        // Avatar
        let avatarPath = user.aaXpXt;
        if (!avatarPath || avatarPath.trim() === "") {
            avatarPath = "/images/userss.png";
        }
        if (document.getElementById("avatar")) {
            document.getElementById("avatar").src = avatarPath;
        }

        // Hide old logo
        const logoContainer = document.querySelector(".logo-container");
        if (logoContainer) logoContainer.style.display = "none";
    }

    // Public API
    window.setTheme = function (newTheme) {
        if (!newTheme) return;
        localStorage.setItem(THEME_KEY, newTheme);
        loadDxTheme(newTheme);
        setDevExtremeTheme(newTheme);
    };

    // ---- Boot ----
    var theme = resolveTheme();
    loadDxTheme(theme);
    setDevExtremeTheme(theme);
    updateUserInfo();

    window.addEventListener("load", function () {
        var latest = localStorage.getItem(THEME_KEY) || theme;
        setDevExtremeTheme(latest);
        updateUserInfo();
    });
})();
