window.onload = function() {
    setTimeout(function() {
        location.reload();
    }, 2400000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
} 
      
function unloadAllJS() {
    var jsArray = new Array();
    jsArray = document.getElementsByTagName('script');
    for (i = 0; i < jsArray.length; i++) {
        if (jsArray[i].id) {
            unloadJS(jsArray[i].id)
        } else {
            jsArray[i].parentNode.removeChild(jsArray[i]);
        }
    }
}

//$(document).ready(function () { // change to arrow function
$(document).ready(() => {    
    localStorage.clear();
    localStorage.clear();
    var aDXTheme = "generic.carmine";
    DevExpress.ui.themes.current(aDXTheme);
    document.getElementById("aUsrName").innerHTML = "User Name";
});

const aGoTo = function (newW) {
    window.location.assign(newW);
};
var aaPFDMI = isLocalHost();
var aMainPrj = "main.html"
//--- Function Group ---//
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
        "message": aMessage
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

function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    let aG = 0;
    for (let i = 0; i < 6; i++) {
        aG = Math.floor(Math.random() * 10);
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
*/
//$(function () { change to arrow
$(() => {    
    var apwds = "";
    var ausrs = "";
    var aOTP = "";
    var aaPFDMI = isLocalHost();
    var aOTPm = generateOTP();
    var aii = 0;
    var aForgotPWDs = 0;
    var aNextField = "#password";
    var aLtext;
    var aOTPph = "Input OTP and press LOGIN";
    var anPWDc = 0;
    var aMessErr = "";
    var aTtoChk = 2;
    //console.log(aMessErr)

    const popup = $("#popupContainer").dxPopup({
        height: '280px',
        width: '400px',
        position: { offset: "0 -150" },
        visible: true,
        fullScreen: false,
        onTitleRendered: 5,
        showCloseButton: false,
        showTitle: true,
        dragEnabled: true,
        closeOnOutsideClick: false,
        shadingColor: "rgb(190,190,190,0.9)",
        toolbarItems: [
            { toolbar: "top", html: "<div padding-top: -10px;><center><img src='./images/locktonlogo70mmblack.png' width='80'></center></div>" }],
        contentTemplate: function () {
            return $("<div />").append(
                $("<p><center><div id='username'></div></center></p>"),
                $("<p><center><div id='password'></div></center></p>"),
                $("<p><center><div id='OTP'></div></center></p>"),
                $("<p><div id='popover1'>Please get OTP from your register e-Mail, put here and then press [LOGIN] </div></p>"), //" + aOTPm + "
                $("<p><center><span id='icon-done'></span></span></center></p>"),
                $("<p><center><div id='forgotpassword'></div></center></p>"), //style='color: blue; font-size: 10px; padding-left: 205px;'
                
            );
        },
        onContentReady: function () {
            $("#OTP").hide();
            $("#forgotpassword").hide();
            //$("#errormsg").hide();
        },
        onShown: function(e) {
            // Focus on the first input element inside the popup when it is shown
            e.component.content().find("input").eq(0).focus();
        },   
        //onKeyDown: function(e) {
        //    if (e.event.key === "Enter") {
        //        e.event.preventDefault(); // prevent default behavior of enter key
        //        $(e.element).trigger($.Event("keydown", { key: "Tab" })); // trigger tab key event
        //    }
        //},             
        //onEnterKey: function() {
            // Trigger button click event when Enter key is pressed
        //    $("#icon-done").trigger("dxclick");
        //}

    }).dxPopup("instance");

    $("#username").dxTextBox({
        mode: "text",
        placeholder: "Enter username",
        showClearButton: true,
        onValueChanged: function (e) {
            const previousValue = e.previousValue;
            e.value = e.value.toLowerCase();
            ausrs = e.value;      
        },
        //onEnterKey: function() {
        //    // Trigger button click event when Enter key is pressed
        //    $("#password").trigger("dxclick");
        //},        
        onEnterKey: function(e) { //onKeyDown
            // Move the focus to the next input element when the Enter key is pressed
            //alert("test")
            if (e.event.key === "Enter") {                
                   $(aNextField).dxTextBox("instance").focus();
            }
        },             
        width: "250px",
        value: ""
    }).dxTextBox("instance");

    const passwordEditor = $("#password").dxTextBox({
        mode: "password",
        placeholder: "Enter password",
        showClearButton: true,
        onValueChanged: function (e) {
            const previousValue = e.previousValue;
            apwds = e.value;
        },
        onEnterKey: function(e) { 
            // Move the focus to the next input element when the Enter key is pressed
            if (e.event.key === "Enter") {
                $("#icon-done").trigger("dxclick");
            }
        },         
        width: "250px",
        value: "",
        buttons: [{
            name: 'password',
            location: 'after',
            options: {
              icon:  "fas fa-eye",
              type: 'text',
              onClick() {
                passwordEditor.option('mode', passwordEditor.option('mode') === 'text' ? 'password' : 'text');
              },
            },
          }],        
        //showPasswordMode: "always",
        /*
        buttons: [
            {
                name: "toggle",
                location: "after",
                options: {
                    icon: "fas fa-star",
                    type: "default",
                    onClick: function (e) {
                        const isPasswordMode = this.option("mode") === "password";
                        this.option("mode", isPasswordMode ? "text" : "password");
                        this.focus();
                        this._input().attr("type", isPasswordMode ? "text" : "password");    
                    },
                    stylingMode: "text"
                }
            }
        ]  
        */      
    }).dxTextBox("instance");

    $("#forgotpassword").dxButton({
        //icon: "fas fa-star", 
        elementAttr: {class: "forgotpwd" },        
        stylingMode:"text",
        type: "success", //"default", //
        rtlEnabled:true,
        text: "Forgot password",
        width: "400px",
        height: "25px",
        visible: true,
        onClick: function (e) {
            aMessErr = "";
            aForgotPWDs = 1;
            aNextField = "#OTP";
            aMessErr = aLoginProcess(aForgotPWDs);
            $("#username").dxTextBox("instance").focus();
        }
    });   

    $("#OTP").dxTextBox({
        mode: "text",
        placeholder: aOTPph,
        showClearButton: true,
        onValueChanged: function (e) {
            const previousValue = e.previousValue;
            aOTP = e.value;
        },
        onEnterKey: function(e) { 
            // Move the focus to the next input element when the Enter key is pressed
            if (e.event.key === "Enter") {
                $("#icon-done").trigger("dxclick");
            }
        },         
        width: "250px",
        value: ""
    }).dxTextBox("instance");

    $("#popover1").dxPopover({ // alert
        target: "#OTP",
        showEvent: "mouseenter",
        hideEvent: "mouseleave",
        position: "top",
        width: 300
    });

    $("#icon-done").dxButton({  //Login
        icon: "fas fa-key",
        type: "success", //"default", //
        text: "LOGIN",
        width: "120px",
        visible: true,
        onClick: function (e) {
            aMessErr = "";
            if(anPWDc === aTtoChk){
                $("#forgotpassword").show();
            }
            aMessErr = aLoginProcess(aForgotPWDs);
            //console.log(aMessErr);
            if(aMessErr !== ""){
                alert(aMessErr)
            //    DevExpress.ui.dialog.alert({
            //        showTitle: false,
            //        messageHtml: "<center><b style='color:Tomato;'>" + aMessErr + "</b></center>"
            //    });
            }
            $("#username").dxTextBox("instance").focus();
            anPWDc++
        }
    });

   function aLoginProcess(aForgotPWD) {
    var aUname;
    var aPswd;
    var aErrorLG = "";
    if (jQuery.type(ausrs) === "undefined") {
        aUname = ""
    } else {
        aUname = ausrs
    };
    if (jQuery.type(apwds) === "undefined") {
        aPswd = ""
    } else {
        aPswd = apwds;
    };

    if (aUname === "" || (aPswd === "" && aForgotPWD === 0)) {
        //DevExpress.ui.dialog.alert({
        //    showTitle: false,
        //    messageHtml: "<center style='color:Red;'>Username and Password can not be blank !!</center>"
        // });
        aErrorLG = "Username and Password can not be blank !!"
    } else {
        //localStorage.setItem("aaPFDMI", aaPFDMI);
        localStorage.setItem("aaXXuX", aUname);
        var aaXTGO = "c80bab4d-1578-4b72-82d9-3e4ebe940384" // UX03
        var aaTBXX = "01f518c9-c818-4e9f-85cb-6245ee1a2637";
        if(aForgotPWD === 0){
            aLtext = "IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
        } else {
            aLtext = "IDUsr='" + aUname + "'"
        }
        //alert(aLtext)
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({"@": btoa(aLtext)}); //"IDUsr='" + aUname + "' and Pword='" + aPswd + "'"
        var requestOptions = {method: 'POST',headers: myHeaders,body: raw,redirect: 'follow'};
        let aURL = aaPFDMI + "/DMQ/" + acPRJ + "/" + aaXTGO + "/" + aaTBXX + "/all"; // + aUname;
        fetch(aURL, requestOptions)
            .then(response => response.json())
            .then(aData => {
                //console.log(aData)
                if ((aUname === aData[0].IDUsr && aForgotPWD === 1) || (aPswd === aData[0].Pword && aForgotPWD === 0)) { //aPswd === aData[0].Pword
                    var aotpx = aData[0].otp;
                    var aLGName = aData[0].LGName;
                    var aemail = aData[0].email;
                    var aAct = aData[0].Active;
                    if (aAct === false) {
                        aotpx = "YES"
                    }
                    if (aotpx === "YES" || aotpx === "" || jQuery.type(aotpx) === "undefined" || aForgotPWD === 1) {
                        var aWOTP = 1;
                    } else {
                        var aWOTP = 0;
                    }
                    if (aOTP === aOTPm || aWOTP === 0) {
                        var aal = btoa(aData[0].Gright);
                        var aat = btoa(aData[0].Tkey);
                        var aftname = aData[0].Nickname;
                        var aDeptn = aData[0].Department;
                        var aDivn = aData[0].Division;
                        var aStaffID = aData[0].Scopebase;                                        
                        var aThemeSL = aData[0].Kright;
                        var apict = aData[0].PictureLoc;

                        localStorage.setItem("aaXrXg", aal);
                        localStorage.setItem("aaXXoX", aat);
                        localStorage.setItem("aaXpXt", apict);
                        localStorage.setItem("aaDXtm", aThemeSL);
                        localStorage.setItem("asFTNAME", aftname);
                        localStorage.setItem("asSTFID", aStaffID);
                        localStorage.setItem("asDEPT", aDeptn);
                        localStorage.setItem("asDIV", aDivn);
                        localStorage.setItem("asEMAIL", aemail);
                        localStorage.setItem("asAct", aAct);

                    
                        usrProperty = [
                            {
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
                            },
                          ];
                            // Convert the array to a JSON string
                            //var jsonString = JSON.stringify(usrProperty);
                            // Store the JSON string in LocalStorage
                            var encryptedData = CryptoJS.AES.encrypt(JSON.stringify(usrProperty), "sBxA017").toString();
                            //localStorage.setItem("myData", encryptedData);
                            localStorage.setItem("usrProperty", encryptedData);
                    
                        aGoTo(aMainPrj); 
                    } else if(aForgotPWD === 1){ 
                        aOTPph = "OTP for Forgotten Password"
                        aii++;
                        $("#password").hide();
                        $("#OTP").show(20);
                        if (aii <= 1) {
                            aOTPm = generateLOTP(8);
                            var aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#740328"><h2><span style="color: #ffffff;"><center><strong>FORGOTTEN PASSWORD - OTP =&nbsp;' + aOTPm + '</center></strong></span></h2></td></tr></tbody></table>'
                            var lSentM = aSendMailDMZ("Dear Khun " + aLGName, aemail, "XOL-admin@lockton.com", "", "", "FORGOTTEN PASSWORD - OTP = " + aOTPm, "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aLGName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");
                            //DevExpress.ui.dialog.alert({
                            //    showTitle: false,
                            //    messageHtml: "<center style='color:ForestGreen;'> Sending FORGOTTEN PASSWORD - OTP to your e-Mail , please check </center>" //(" + aemail + ")
                            //});
                            aErrorLG = aIndexAlert4UnP03
                        } else {
                            //DevExpress.ui.dialog.alert({
                            //    showTitle: false,
                            //    messageHtml: "<center style='color:Red;'> Please check OTP from your e-Mail again !!" + aii + "</center>"
                            //});
                            aErrorLG = aIndexAlert4UnP02
                        }
                    } else {
                        aii++;
                        $("#username").hide();
                        $("#password").hide();
                        $("#OTP").show(20);
                        if (aii <= 1) {
                            var aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>OTP =&nbsp;' + aOTPm + '</center></strong></span></h2></td></tr></tbody></table>'
                            var lSentM = aSendMailDMZ("Khun " + aLGName, aemail, "XOL-admin@lockton.com", "", "", "OTP = " + aOTPm, "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aLGName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");
                            //DevExpress.ui.dialog.alert({
                            //    showTitle: false,
                            //    messageHtml: "<center style='color:ForestGreen;'> Sending OTP to your e-Mail (" + aemail + "), please check </center>"
                            //});
                            aErrorLG = "" //"Sending OTP to your e-Mail"
                        } else {
                           // DevExpress.ui.dialog.alert({
                           //     showTitle: false,
                           //     messageHtml: "<center style='color:Red;'> Please check OTP from your e-Mail again !!" + aii + "</center>"
                           // });
                           aErrorLG = aIndexAlert4UnP02
                        }
                    }

                } else {
                    //anPWDc++
                    //DevExpress.ui.dialog.alert({
                    //    showTitle: false,
                    //    messageHtml: "<center><b style='color:Tomato;'>Please Try Again!!</b></center>"
                    //});
                    if(anPWDc >= aTtoChk + 1){
                        aErrorLG =  aIndexAlert4UnP01 + aIndexAlert4UnP11 //+ "\n(" + anPWDc + ")"
                    }else {
                        aErrorLG =  aIndexAlert4UnP01  //+ "\n(" + anPWDc + ")" + aPswd
                    }                     
                    alert(aErrorLG);
                }

            })
            .catch(error => {
                //anPWDc++
                console.error('Error:', error);
                //DevExpress.ui.dialog.alert({
                //    showTitle: false,
                //    messageHtml: "<center><b style='color:Tomato;'>Please Try Again!!</b></center>"
                //});
                //aErrorLG = "Please Try Again!! \nกรุณาลองใหม่อีกครั้ง ชื่อหรือพาสเวิร์ดผิด \nพาสเวิร์ดที่คุณใส่ไว้คือ " + aPswd
                if(anPWDc >= aTtoChk + 1){
                    aErrorLG =  aIndexAlert4UnP01 + aIndexAlert4UnP11 //+ "\n(" + anPWDc + ")" + aPswd 
                }else {
                    aErrorLG =  aIndexAlert4UnP01  //+ "\n(" + anPWDc + ")" + aPswd
                }
                alert(aErrorLG);
            });

    }
    return aErrorLG
   }

/*
    // Not Use
    function aaLoginGet(aaPFDMI, aUname, aPswd) {
        var aReturnVal = [];
        let aURL = aaPFDMI + "/pythonL/" + aUname + "/" + aPswd + "/true";
        var settings = {
            "url": aURL,
            "method": "GET",
            "timeout": 0,
        };
        $.ajax(settings).done(function (response) {
            localStorage.setItem("aaXXoX", response.TokenKey);
            aReturnVal = response;
        });
        return aReturnVal;
    }

    // Not Use
    function aaGetjson4Api(aaPFDMI, aaXTGO, aaTBXX, aSearch) {
        var aReturnVal1 = [];
        let aURL = aaPFDMI + "/pythonLT/" + aaXTGO + "/" + aaTBXX + "/" + aSearch;
        var settings = {
            "url": aURL,
            "method": "GET",
            "timeout": 0,
        };
        $.ajax(settings).done(function (response) {
            var aal = btoa(response[0].Gright);
            localStorage.setItem("aaXrXgU", aal);
            localStorage.setItem("aaXrXgT", response[0].Gright);
            eraseCookie("aaCrCg")
            setCookie("aaCrCg", aal, 1);
            aReturnVal1 = response;
        });
        return aReturnVal1;
    }
*/
    $("#icon-cancel").dxButton({
        icon: "fas fa-door-open",
        type: "danger",
        text: "EXIT",
        width: "150px",
        onClick: function (e) {
            DevExpress.ui.notify("The Cancel button was clicked");
            localStorage.clear();
            window.close();
        }
    });

});
