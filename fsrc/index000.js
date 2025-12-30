// index000.js (refactored, ES2025 style)

document.addEventListener("DOMContentLoaded", () => {
    localStorage.clear();

    const aDXTheme = "generic.softblue"; // default theme
    DevExpress.ui.themes.current(aDXTheme);

    document.getElementById("aUsrName").textContent = "User Name";
});

// --- Helpers ---
const aGoTo = newW => window.location.assign(newW);
const aMainPrj = "main.html";
const aaPFDMI = isLocalHost();

let ausrs = "", apwds = "", aOTP = "";
let aOTPm = generateOTP();
let aForgotPWDs = 0, aNextField = "#password";
let aii = 0, anPWDc = 0;
let aMessErr = "";
const aTtoChk = 2;
let aLtext = "";
let aOTPph = "Input OTP and press LOGIN";

// --- Popup ---
const popup = $("#popupContainer").dxPopup({
    height: 280,
    width: 400,
    position: { offset: "0 -150" },
    visible: true,
    showCloseButton: false,
    showTitle: true,
    dragEnabled: true,
    shadingColor: "rgba(190,190,190,0.9)",
    toolbarItems: [
        { toolbar: "top", html: `
            <div style="width:100%;height:120px;">
                <center><img src="./images/locktonlogo70mmblack.png" width="85"></center>
            </div>` }
    ],
    contentTemplate: () => $("<div>").append(
        "<p><center><div id='username'></div></center></p>",
        "<p><center><div id='password'></div></center></p>",
        "<p><center><div id='OTP'></div></center></p>",
        "<p><div id='popover1'>Please get OTP from your registered e-Mail, put here and then press [LOGIN]</div></p>",
        "<p><center><span id='icon-done'></span></center></p>",
        "<p><center><div id='forgotpassword'></div></center></p>"
    ),
    onContentReady: () => $("#OTP").hide(),
    onShown: e => e.component.content().find("input").first().focus(),
}).dxPopup("instance");

// --- Username ---
$("#username").dxTextBox({
    placeholder: "Enter username",
    showClearButton: true,
    width: 250,
    value: "",
    onValueChanged: e => { ausrs = e.value.toLowerCase(); },
    onEnterKey: () => $(aNextField).dxTextBox("instance").focus()
}).dxTextBox("instance");

// --- Password ---
const passwordEditor = $("#password").dxTextBox({
    mode: "password",
    placeholder: "Enter password",
    showClearButton: true,
    width: 250,
    value: "",
    onValueChanged: e => { apwds = e.value; },
    onEnterKey: e => {
        if (e.event.key === "Enter") $("#icon-done").trigger("dxclick");
    },
    buttons: [{
        name: "togglePassword",
        location: "after",
        options: {
            icon: "fas fa-eye",
            type: "text",
            onClick: () => {
                const isPassword = passwordEditor.option("mode") === "password";
                passwordEditor.option("mode", isPassword ? "text" : "password");
                passwordEditor.getButton("togglePassword")
                    .option("icon", isPassword ? "fas fa-eye-slash" : "fas fa-eye");
            }
        }
    }]
}).dxTextBox("instance");

// --- Forgot Password Button ---
$("#forgotpassword").dxButton({
    stylingMode: "text",
    type: "success",
    rtlEnabled: true,
    text: "Forgot password",
    width: 400,
    height: 25,
    visible: true,
    elementAttr: {
        style: "font-family: Tahoma, sans-serif; background-color: white; color: green; font-size: 12px; margin-left: 35%;"
    },
    onClick: () => {
        aMessErr = "";
        aForgotPWDs = 1;
        aNextField = "#OTP";
        aMessErr = aLoginProcess(aForgotPWDs);
        $("#username").dxTextBox("instance").focus();
    }
});

// --- OTP Field ---
$("#OTP").dxTextBox({
    placeholder: aOTPph,
    showClearButton: true,
    width: 250,
    value: "",
    onValueChanged: e => { aOTP = e.value; },
    onEnterKey: e => {
        if (e.event.key === "Enter") $("#icon-done").trigger("dxclick");
    }
}).dxTextBox("instance");

// --- Popover ---
$("#popover1").dxPopover({
    target: "#OTP",
    showEvent: "mouseenter",
    hideEvent: "mouseleave",
    position: "top",
    width: 300
});

// --- Login Button ---
$("#icon-done").dxButton({
    icon: "fas fa-key fa-2xs",
    type: "default",
    text: "LOGIN",
    width: 120,
    height: 35,
    visible: true,
    elementAttr: {
        style: "font-family: Lucida Console, Courier New, monospace; background-color: #5cb85c; color: #E9F5E9;"
    },
    onContentReady: e => {
        $(e.element).find(".dx-icon").css("color", "#E9F5E9");
    },
    onClick: async () => {
        aMessErr = "";
        if (anPWDc === aTtoChk) $("#forgotpassword").show();

        aMessErr = await aLoginProcess(aForgotPWDs);
        if (aMessErr) {
            DevExpress.ui.dialog.alert({
                showTitle: false,
                messageHtml: aMessErr
            });
        }
        $("#username").dxTextBox("instance").focus();
        anPWDc++;
    }
});

// --- EXIT Button ---
$("#icon-cancel").dxButton({
    icon: "fas fa-door-open",
    type: "danger",
    text: "EXIT",
    width: 150,
    onClick: () => {
        DevExpress.ui.notify("The Cancel button was clicked");
        localStorage.clear();
        window.close();
    }
});

// --- Login Process ---
async function aLoginProcess(aForgotPWD) {
    let aErrorLG = "";
    const aUname = ausrs || "";
    const aPswd = apwds || "";

    if (!aUname || (!aPswd && aForgotPWD === 0)) {
        return aIndexAlert4Emp; // Username/Password blank
    }

    localStorage.setItem("aaXXuX", aUname);

    const aaXTGO = "c80bab4d-1578-4b72-82d9-3e4ebe940384"; // UX03
    let aaTBXX = aForgotPWD === 0
        ? "01f518c9-c818-4e9f-85cb-6245ee1a2637"
        : "01f518c9-c818-4e9f-85cb-6245ee1a2999";

    aLtext = aForgotPWD === 0
        ? `IDUsr='${aUname}' and Pword='${aPswd}'`
        : `IDUsr='${aUname}'`;

    const myHeaders = new Headers({ "Content-Type": "application/json" });
    const raw = JSON.stringify({ "@": btoa(aLtext) });

    const aURL = `${aaPFDMI}/DMQ/${acPRJ}/${aaXTGO}/${aaTBXX}/all`;

    try {
        const response = await fetch(aURL, {
            method: "POST",
            headers: myHeaders,
            body: raw
        });

        const aData = await response.json();
        const user = aData?.[0];
        if (!user) throw new Error("No user data");

        // --- Validation
        const validLogin = (aForgotPWD === 0 && user.Pword === aPswd) ||
                           (aForgotPWD === 1 && user.IDUsr === aUname);

        if (!validLogin) {
            return aIndexAlert4UnP01;
        }

        const { otp: aotpx, LGName, email, Active, Gright, Tkey,
                Nickname, Department, Division, Scopebase, Kright, PictureLoc } = user;

        const aWOTP = (aotpx === "YES" || !aotpx || aForgotPWD === 1) ? 1 : 0;

        if (aOTP === aOTPm || aWOTP === 0) {
            // --- Success: Save
            localStorage.setItem("aaXrXg", btoa(Gright));
            localStorage.setItem("aaXXoX", btoa(Tkey));
            localStorage.setItem("aaXpXt", PictureLoc);
            localStorage.setItem("aaDXtm", Kright);
            localStorage.setItem("asFTNAME", Nickname);
            localStorage.setItem("asSTFID", Scopebase);
            localStorage.setItem("asDEPT", Department);
            localStorage.setItem("asDIV", Division);
            localStorage.setItem("asEMAIL", email);
            localStorage.setItem("asAct", Active);

            const usrProperty = [{
                aaXXuX: aUname, aaXrXg: btoa(Gright), aaXXoX: btoa(Tkey),
                asFTNAME: Nickname, asDEPT: Department, asDIV: Division,
                asSTFID: Scopebase, aaDXtm: Kright, aaXpXt: PictureLoc,
                asEMAIL: email, asAct: Active
            }];

            const encryptedData = CryptoJS.AES.encrypt(
                JSON.stringify(usrProperty), "sBxA017"
            ).toString();
            localStorage.setItem("usrProperty", encryptedData);

            aGoTo(aMainPrj);
            return "";
        }

        // --- OTP Required
        $("#password").hide();
        $("#OTP").show(200);

        aii++;
        if (aii <= 1) {
            aOTPm = generateLOTP(8);
            const aOTPy = encodeHtmlEntities(`FORGOTTEN PASSWORD - OTP = ${aOTPm}`);
            const aSbody = encodeHtmlEntities(` Dear Khun ${LGName}`);
            const aP1Body = `
                <table border="0" width="200" cellspacing="0" cellpadding="0">
                    <tr><td bgcolor="#740328" style="height:40px;">
                        <center><strong style="color:white;">${aOTPy}</strong></center>
                    </td></tr>
                </table>`;
            aSendMailDMZ(`Dear Khun ${LGName}`, email, "XOL-admin@lockton.com",
                "", "", "FORGOTTEN PASSWORD OTP",
                `<div style="font-family:tahoma;font-size:12px;">
                    ${aSbody}, <br/><br/>${aP1Body}<br/><br/>
                    Regards,<br/>XOL Admin.<br/><br/><i>(Please do not reply this mail !!)</i>
                </div>`);
            return aIndexAlert4UnP03;
        }

        return aIndexAlert4UnP02;

    } catch (error) {
        console.error("Login Error:", error);
        return aIndexAlert4UnP01;
    }
}
