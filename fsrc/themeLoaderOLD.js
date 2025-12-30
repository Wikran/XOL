// themeLoader.js
// Loads DevExtreme theme + user info (username, avatar) from encrypted usrProperty.
// Requires: CryptoJS (AES) and DevExtreme (dx.all.js) loaded BEFORE this file.

(function () {
    var THEME_KEY = "aDXTheme";
    var USR_KEY = "usrProperty";
    var AES_KEY = "sBxA017";

    // Default theme if user theme is empty or not set
    var DEFAULT_THEME = "material.blue.light.compact";

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

    function loadDxTheme(themeName) {
        var href = "DevExpressDevExtreme/Lib/css/dx." + themeName + ".css";

        var oldLink = document.getElementById("dx-theme-link");
        if (oldLink && oldLink.parentNode) oldLink.parentNode.removeChild(oldLink);

        var link = document.createElement("link");
        link.id = "dx-theme-link";
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
        log("Applied CSS: " + href);
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
