/*  jQuery and Javascript Libraries  (ajQjsLib.js),by LWT IT Appliction*/
const acProjectCode = "XOL"
const acProjectName = "Extra OnLine"
const acMailAPI = "https://cbsdev2.locktonwattana.com/send-email/false"
const acGMailAPI = "https://golfmagic99-001-site1.dtempurl.com/send-email/false/gmail"
const aServerNamea = "[lockthbnk-ap14]" // [lockthbnk-db02] [lockthbnk-ap14]
const aWebSpaceAPI = "https://webspace.locktonwattana.com";  //https://webspace.locktonwattana.com
const aWebSpaceRptAPI = "https://webspace.locktonwattana.com";
const aaPFDMIs = isLocalHost();

// Travel & Entertainment & Other 
const aaSubGroup = [
	{ ExpSubGroup: "ค่าจัดประชุม", ACCCode: "5104150001" },
	{ ExpSubGroup: "ค่าไปรษณีย์ด่วน", ACCCode: "5107100001" },
	{ ExpSubGroup: "ค่าไปรษณีย์", ACCCode: "5107200001" },
	{ ExpSubGroup: "ค่าอาหารพนักงาน", ACCCode: "5206100001" },
	{ ExpSubGroup: "ค่าฝึกอบรม - ภายนอก", ACCCode: "5207400001" },
	{ ExpSubGroup: "ค่าเช่าที่จอดรถ", ACCCode: "5301400002" },
	{ ExpSubGroup: "ค่าซ่อมแซม - อุปกรณ์สำนักงาน", ACCCode: "5302500001" },
	{ ExpSubGroup: "ค่าซ่อมแซม - เครื่องคอมพิวเตอร์", ACCCode: "5303600001" },
	{ ExpSubGroup: "อุปกรณ์สำนักงาน", ACCCode: "5303700001" },
	{ ExpSubGroup: "อุปกรณ์ที่เกี่ยวกับคอมพิวเตอร์", ACCCode: "5303700002" },
	{ ExpSubGroup: "ค่าโทรศัพท์มือถือ", ACCCode: "5304100001" },
	{ ExpSubGroup: "ค่าการพิมพ์ - ทั่วไป", ACCCode: "5401100001" },
	{ ExpSubGroup: "ค่าการพิมพ์ - ถ่ายเอกสาร", ACCCode: "5401100002" },
	{ ExpSubGroup: "ค่าอุปกรณ์สำนักงาน", ACCCode: "5401100003" },
	{ ExpSubGroup: "ค่าสมาชิกสิ่งพิมพ์", ACCCode: "5402200001" },
	{ ExpSubGroup: "ค่าสมาชิกอื่นๆ", ACCCode: "5402200002" },
	{ ExpSubGroup: "ค่าหนังสือ", ACCCode: "5402200003" },
	{ ExpSubGroup: "ค่าใช้จ่ายเบ็ดเตล็ด", ACCCode: "5506200001" },
	{ ExpSubGroup: "Gift/Other given to customer", ACCCode: "5505200002" },
	{ ExpSubGroup: "Entertainment", ACCCode: "5105100001" },
	{ ExpSubGroup: "Taxi", ACCCode: "5101150004" },
	{ ExpSubGroup: "Local Travel", ACCCode: "5101150003" },
	{ ExpSubGroup: "Expressway", ACCCode: "5102300001" },
	{ ExpSubGroup: "Accom. Oversea Trav", ACCCode: "5101130001" }, //Hotel (Room&Tax Only)
	{ ExpSubGroup: "Breakfast/Lunch/Dinner-Oversea Trip", ACCCode: "5101110001" },
	{ ExpSubGroup: "Oversea Expense -Misc", ACCCode: "5101150001" },
	{ ExpSubGroup: "Per diem", ACCCode: "5204100004" }, //Expressway Bill Fleet Card Gasoline (5102300001) OPD/Dental/Maternity/Dental (SSO)/Others (5204100003)
	{ ExpSubGroup: "Ticket Oversea Trav", ACCCode: "5101110001" },
	{ ExpSubGroup: "Fleet Card", ACCCode: "5102300001" },
	{ ExpSubGroup: "Expressway Bill", ACCCode: "5102300001" },
	{ ExpSubGroup: "Gasoline", ACCCode: "5102300001" },
	{ ExpSubGroup: "OPD", ACCCode: "5204100003" },
	{ ExpSubGroup: "Dental", ACCCode: "5204100003" },
	{ ExpSubGroup: "Maternity", ACCCode: "5204100003" },
	{ ExpSubGroup: "Dental (SSO)", ACCCode: "5204100003" },
	{ ExpSubGroup: "Others", ACCCode: "5204100003" },
];


// For Type = 100 other
const aaSubGroupNM01 = [
	"ค่าจัดประชุม",
	"ค่าไปรษณีย์ด่วน",
	"ค่าไปรษณีย์",
	"ค่าอาหารพนักงาน",
	"ค่าฝึกอบรม - ภายนอก",
	"ค่าเช่าที่จอดรถ",
	"ค่าซ่อมแซม - อุปกรณ์สำนักงาน",
	"ค่าซ่อมแซม - เครื่องคอมพิวเตอร์",
	"อุปกรณ์สำนักงาน",
	"อุปกรณ์ที่เกี่ยวกับคอมพิวเตอร์",
	"ค่าโทรศัพท์มือถือ",
	"ค่าการพิมพ์ - ทั่วไป",
	"ค่าการพิมพ์ - ถ่ายเอกสาร",
	"ค่าอุปกรณ์สำนักงาน",
	"ค่าสมาชิกสิ่งพิมพ์",
	"ค่าสมาชิกอื่นๆ",
	"ค่าหนังสือ",
	"ค่าใช้จ่ายเบ็ดเตล็ด",
];
// For Type = 100 other
const aaSubGroup01 = [
	{ ExpSubGroup: "ค่าจัดประชุม", ACCCode: "5104150001" },
	{ ExpSubGroup: "ค่าไปรษณีย์ด่วน", ACCCode: "5107100001" },
	{ ExpSubGroup: "ค่าไปรษณีย์", ACCCode: "5107200001" },
	{ ExpSubGroup: "ค่าอาหารพนักงาน", ACCCode: "5206100001" },
	{ ExpSubGroup: "ค่าฝึกอบรม - ภายนอก", ACCCode: "5207400001" },
	{ ExpSubGroup: "ค่าเช่าที่จอดรถ", ACCCode: "5301400002" },
	{ ExpSubGroup: "ค่าซ่อมแซม - อุปกรณ์สำนักงาน", ACCCode: "5302500001" },
	{ ExpSubGroup: "ค่าซ่อมแซม - เครื่องคอมพิวเตอร์", ACCCode: "5303600001" },
	{ ExpSubGroup: "อุปกรณ์สำนักงาน", ACCCode: "5303700001" },
	{ ExpSubGroup: "อุปกรณ์ที่เกี่ยวกับคอมพิวเตอร์", ACCCode: "5303700002" },
	{ ExpSubGroup: "ค่าโทรศัพท์มือถือ", ACCCode: "5304100001" },
	{ ExpSubGroup: "ค่าการพิมพ์ - ทั่วไป", ACCCode: "5401100001" },
	{ ExpSubGroup: "ค่าการพิมพ์ - ถ่ายเอกสาร", ACCCode: "5401100002" },
	{ ExpSubGroup: "ค่าอุปกรณ์สำนักงาน", ACCCode: "5401100003" },
	{ ExpSubGroup: "ค่าสมาชิกสิ่งพิมพ์", ACCCode: "5402200001" },
	{ ExpSubGroup: "ค่าสมาชิกอื่นๆ", ACCCode: "5402200002" },
	{ ExpSubGroup: "ค่าหนังสือ", ACCCode: "5402200003" },
	{ ExpSubGroup: "ค่าใช้จ่ายเบ็ดเตล็ด", ACCCode: "5506200001" },
];
// for Type 200 fleet card
const aaSubGroup02 = [{ ExpSubGroup: "Fleet Card" }, { ExpSubGroup: "Expressway Bill" }, { ExpSubGroup: "Gasoline" }];
//for Type = 400
const aaSubGroupNM4 = [ 
	"Gift/Other given to customer",
	"Entertainment",
	"Taxi",
	"Local Travel",
	"Expressway",
	"Accom. Overseas Trav",
	"Breakfast/Lunch/Dinner-Overseas Trip",
	"Overseas Expense -Misc",
	"Per diem",
	"Ticket Overseas Trav",
];
// For Type = 400
const aaSubGroup4 = [ 
	{ ExpSubGroup: "Gift/Other given to customer", ACCCode: "5505200002" },
	{ ExpSubGroup: "Entertainment", ACCCode: "5105100001" },
	{ ExpSubGroup: "Taxi", ACCCode: "5101150004" },
	{ ExpSubGroup: "Local Travel", ACCCode: "5101150003" },
	{ ExpSubGroup: "Expressway", ACCCode: "5102300001" },
	{ ExpSubGroup: "Accom. Overseas Trav", ACCCode: "5101130001" }, //Hotel (Room&Tax Only)
	{ ExpSubGroup: "Breakfast/Lunch/Dinner-Overseas Trip", ACCCode: "5101110001" },
	{ ExpSubGroup: "Overseas Expense -Misc", ACCCode: "5101150001" },
	{ ExpSubGroup: "Per diem", ACCCode: "5204100004" },
	{ ExpSubGroup: "Ticket Overseas Trav", ACCCode: "5101110001" },
];
var profileSettings = [
	{ id: 1, name: "Profile", icon: "user" },
	{ id: 2, name: "WorkList", icon: "fas fa-calendar-alt", badge: "5" },
	{ id: 3, name: "Password", icon: "fas fa-key" },
	{ id: 4, name: "Themes", icon: "fas fa-brush" },
	{ id: 5, name: "Logout", icon: "runner" }
];

var actionSheetItems = [
	{ ID: "01", text: "GEN OTP (TEXT & NUM)  ", type: "normal", icon: "fi fi-sr-rocket", visible: false, onClick: function () { var xxOTPxx = generateLOTP(); aMessageAlert('OTP =' + xxOTPxx, 'Teal'); } }, //aMessageAlert("ERROR","red"); 
	{ ID: "02", text: "GEN OTP (NUM ONLY)    ", type: "normal", icon: "fi fi-br-rocket", visible: false, onClick: function () { var xxOTPxx = generateOTP(); aMessageAlert('OTP =' + xxOTPxx, 'Teal'); } },
	{ ID: "04", text: "LOGIN (OTP)           ", type: "normal", icon: "fi fi-sr-lock", visible: true, onClick: function () { aRunLogin(1) } },
	{ ID: "05", text: "LOGIN                 ", type: "normal", icon: "fi fi-br-key", visible: true, onClick: function () { aRunLogin() } },
	{ ID: "03", text: "THEMES                ", type: "normal", visible: true, icon: "fi fi-sr-palette", onClick: function () { aThemeSelect() } }
	//var xxOTPxx = generateOTP(); aRunJQ(); aSendMailDMZ('Wikran', 'wikran@hotmail.com','wikran@asia.lockton.com','','','OTP =' + xxOTPxx ,'<div><b>OTP = </b><i>'+ xxOTPxx +'</i></div>'); aMessageAlert('Mail send OTP =' + xxOTPxx,'Teal')
];

var aOptionMenu = [{
	id: "01",
	icon: "fas fa-cog",
	text: "",
	items: [
		{ ID: "101", text: "GEN OTP (TEXT & NUM)  ", type: "normal", icon: "fi fi-sr-rocket", visible: false, onClick: function () { var xxOTPxx = generateLOTP(); aMessageAlert('OTP =' + xxOTPxx, 'Teal'); } }, //aMessageAlert("ERROR","red"); 
		{ ID: "102", text: "GEN OTP (NUM ONLY)    ", type: "normal", icon: "fi fi-br-rocket", visible: false, onClick: function () { var xxOTPxx = generateOTP(); aMessageAlert('OTP =' + xxOTPxx, 'Teal'); } },
		{ ID: "103", text: "LOGIN (OTP)           ", type: "normal", icon: "fas fa-lock", visible: false, onClick: function () { aRunLogin(1) } },
		{ ID: "104", text: "New Login             ", type: "normal", icon: "fas fa-key", visible: true, onClick: function () { aRunLogin() } },
		{ ID: "105", text: "Logout                ", type: "danger", icon: "fas fa-sign-out-alt", visible: true, onClick: function () { aaGOTO('index.html') } },
		{ ID: "106", text: "Themes                ", type: "normal", badge: "12", icon: "fas fa-palette", visible: true, onClick: function () { aThemeSelect() } }
	]
}];


function isLocalHost() {
	//"http://wikran-w10:8081"; //"http://wikran-w10:8081"; // https://cbsdev2.locktonwattana.com // https://cbsdev3.locktonwattana.com
	let aHostName = window.location.href  //$(location).attr('host');
	if (aHostName.includes("localhost") || aHostName.includes("wikran-w10")) {
		return "http://wikran-w10:8081"; 
	}
	else {
		return "https://cbsdev2.locktonwattana.com"; 
		//return "https://webspace.locktonwattana.com";
	};

};

function generateOTP() {
	// Declare a digits variable
	// which stores all digits
	var digits = '0123456789';
	let OTP = '';
	let aG = 0;
	for (let i = 0; i < 6; i++) {
		aG = Math.floor(Math.random() * 10);
		OTP += digits[Math.floor(Math.random() * 10)];
	}
	return OTP;
};

function generateLOTP() {
	// Declare a string variable 
	// which stores all string         
	var string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let OTP = '';

	// Find the length of string
	var len = string.length;
	for (let i = 0; i < 6; i++) {
		OTP += string[Math.floor(Math.random() * len)];
	}
	return OTP;
};

const aGetDateRef = (aERSuf) => {
	//axRunRun = ""
	let aNowDatev = new Date()
	let aYear2 = String(aNowDatev.getFullYear()).substring(2, 4);
	let aMonth2 = String(101 + aNowDatev.getMonth()).substring(1, 3);
	let aDate2 = String(100 + aNowDatev.getDate()).substring(1, 3);
	let aHour2 = String(100 + aNowDatev.getHours()).substring(1, 3);
	let aDateNow2 = aYear2 + aMonth2 + aDate2 + String(Date.now()).substring(5, 9) // 5,16
	//let aERCode = "5102300001"
	//let aERSuf = "F"
	//axRunRun = "ER" + aDateNow2
	return aERSuf + aDateNow2 //+ aYear2 + aMonth2 + aDate2 + aHour2;
}

function aRPTPrint2Pdf(aaHeadRefNo, aHServer, aMasterReport, aTitle) { //M2212131876 M2212131876 M2211248313 M2211042447 M2210317530
	var aHRefNo = aaHeadRefNo //"M2210317530" //" 2 - M2302161559" M2212131876
	var aReportSuffix = "test"
	var aMasterRPT = aMasterReport + ".rpt" //"MMasterReport.rpt"
	var aResultFilePDF = aHRefNo + ".pdf"
	var aSearchT = "REFNO=" + aHRefNo
	var aDBTokenXX = "Extraonline-db02"
	if (aHServer === "https://cbsdev3.locktonwattana.com") {
		aDBTokenXX = "Extraonline-db02"
	} else if (aHServer === "https://webspace.locktonwattana.com"){
		aDBTokenXX = "Extraonline-db02"
	} else {
		aDBTokenXX = "Extraonline-ap14"
	}

	var aAPIsrv = "https://cbsdev2.locktonwattana.com/GenRpt/XOL" //"http://localhost:8081/GenRpt/XOL" , mode: 'no-cors'

	var myHeaders = new Headers();
	myHeaders.append("ref", "44095B6C-CC17-47FD-895B-649E0EAA2BAE");
	myHeaders.append("Content-Type", "application/json");
	var raw = JSON.stringify({ "ReportName": aMasterRPT, "FileName": aResultFilePDF, "?": aSearchT, "DBToken": aDBTokenXX }); //MMasterReporttest.rpt Extraonline-ap14 // MMasterReport.rpt Extraonline-db02
	var requestOptions = { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };
	fetch("https://cbsdev2.locktonwattana.com/GenRpt/XOL", requestOptions)
		.then(response => response.text())
		.then(result => aPopupPDFReport(result, aResultFilePDF, aTitle))   //console.log(result)
		.catch(error => console.log('error', error));

}

function aPopupPDFRpt(aText, aResultFilePDF) {
	window.open("https://cbsdev2.locktonwattana.com/temp/uploads/reports/" + aResultFilePDF);
}

function aPopupPDFReport(aText, aResultFilePDF, aaTitle) {
	$(() => {
		const popup = $("#popupPrintPDF").dxPopup({
			title: aaTitle + " Expenses Reimbursement Cover Page",
			width: '900px',
			height: '600px',
			focusStateEnabled: true,
			position: { offset: "0 -165" }, //{offset: "0 -180"},
			visible: true,
			fullScreen: true,
			showCloseButton: false,
			showTitle: true,
			dragEnabled: true,
			closeOnOutsideClick: false,
			resizeEnabled: true,
			contentTemplate: function () {
				//return $("<iframe>").attr("src", "./images/Emp-Training Expense Reimbursement System.pdf").css("width", "100%").css("height", "100%"); 
				return $("<iframe>").attr("src", "https://cbsdev2.locktonwattana.com/temp/uploads/reports/" + aResultFilePDF + "#view=FitH").css("width", "100%").css("height", "100%");
			},
			toolbarItems: [
				{
					toolbar: "top",
					locateInMenu: 'always',
				},
				{
					toolbar: "top",
					locateInMenu: 'always',
					widget: "dxButton",
					//toolbar: "bottom",
					location: "after",
					options: {
						//text: "EXIT",
						icon: "fas fa-times",
						stylingMode: "outlined",
						type: "danger",
						onClick: function (e) {
							popup.hide()
						}
					}
				}]

		}).dxPopup("instance");

	});
} 
function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "=" + value + expires + "; path=/";
};

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
};

function eraseCookie(name) {
	createCookie(name, "", -1);
};


function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
};

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
};

function jqClearAllCookie() {
	var cookies = $.cookie();
	for (var cookie in cookies) {
		$.removeCookie(cookie);
	}
}

function aMessageAlert(aaMessage, aaColor) {
	DevExpress.ui.dialog.alert({
		showTitle: false,
		messageHtml: "<center style='color:" + aaColor + ";'>" + aaMessage + "</center>"
	});
}

function APIPOST(Action, Data, aKeyToken, Domain, AccessKey, aPJCode) {
	let Url = Domain + '/DMP/'+ aPJCode +'/' + AccessKey + '/' + Action + '/' + aKeyToken + '/true/true';
	//console.log('API: ' + Data);
	var settings = { "url": Url, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": Data, };
	$.ajax(settings).done(function (response) { console.log(response); });
}


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

	fetch(acMailAPI, requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
}

function aSendMailGM(aRecipient, aRCPeMail, aSendereMail, aCCeMail, aBcceMail, aSubject, aMessage) {
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

	fetch(acGMailAPI, requestOptions)
		.then(response => response.text())
		.then(result => console.log(result))
		.catch(error => console.log('error', error));
}


/*function aRolesAction(aRoles,anPos,anChkPos){
	/* aRoles = All of Roles "277B", anPos 1=Data,2=Excel,3=PDF,4=REPORT , anChk = Position of Roles 1 from "000" */
/* 1ReadOnly  2CRU 3CRUD  4Disable   5Import   6Export   7Import and Export  8Printable    9Export2PDF  AExport2Excel    BReport Full Rights 
let aRolesM = ["0","ReadOnly","CRU","CRUD","Disable","Import","Export","Import and Export","Printable","Export2PDF","Export2Excel","Report Full Rights"];
let aRolesD = ["0","000","110","111","0","10","01","11","100","110","101","111"];
let aFR = ["Data:","Excel:","PDF:","REPORT:"];
let aPass = 0;
let nP = anChkPos - 1;
let i = anPos -1;
let arRoles = aRoles.substring(i,i+1);
if (arRoles === "A"){
	aCC = 10;
}  else if (arRoles === "B"){
	aCC = 11;   
} else {
	aCC = Number(arRoles);
}
let arRRR = aRolesD[aCC];
let arLast = arRRR.substring(nP,nP + 1);
	aPass = Number(arLast);
return aPass;
}*/

eval(function (p, a, c, k, e, d) { e = function (c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) { d[e(c)] = k[c] || e(c) } k = [function (e) { return d[e] }]; e = function () { return '\\w+' }; c = 1 }; while (c--) { if (k[c]) { p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]) } } return p }('N t(e,d,c){2 o=["0","x","w","v","s","b","a","b u a","p","r","q","z y D"];2 j=["0","E","8","9","0","f","F","m","G","8","H","9"];2 I=["J:","C:","L:","M:"];2 5=0;2 6=c-1;2 i=d-1;2 4=e.n(i,i+1);7(4==="A"){3=f}h 7(4==="B"){3=m}h{3=l(4)}2 k=j[3];2 g=k.n(6,6+1);5=l(g);K 5}', 50, 50, '||let|aCC|arRoles|aPass|nP|if|110|111|Export|Import|anChkPos|anPos|aRoles|10|arLast|else||aRolesD|arRRR|Number|11|substring|aRolesM|Printable|Export2Excel|Export2PDF|Disable|aRolesAction|and|CRUD|CRU|ReadOnly|Full|Report|||Excel|Rights|000|01|100|101|aFR|Data|return|PDF|REPORT|function'.split('|'), 0, {}))
