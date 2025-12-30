    // Travel Requisition Input Form //
        window.onload = function () {
            setTimeout(function () {
                location.reload();
            }, 2400000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
        }

        $(document).ready(function () {
            var aDXTheme = localStorage["aDXTheme"]
            DevExpress.ui.themes.current(aDXTheme);
        });
        const { PDFDocument } = PDFLib;
        window.jsPDF = window.jspdf.jsPDF;
        applyPlugin(window.jsPDF);
        console.clear();
        var aaHostName = window.location.href
        var aaCheckON = aaHostName.includes("localhost")
        //
        // const aaPurposeTable = [
        //     { "Purpose": "Conference", "TPurpose": "��Ъ��" },
        //     { "Purpose": "Training", "TPurpose": "ͺ��" },
        //     { "Purpose": "Traveling", "TPurpose": "����Թ�ҧ" },
        // ]
        // const aaPurposeTableaa = [
        //     { "Purpose": "Conference", "TPurpose": "��Ъ��" },
        //     { "Purpose": "Training", "TPurpose": "ͺ��" },
        //     { "Purpose": "Traveling", "TPurpose": "����Թ�ҧ" },
        //     { "Purpose": "Client visit", "TPurpose": "�������١���" },
        //     { "Purpose": "Product launch", "TPurpose": "�Դ��Ǽ�Ե�ѳ��" },
        //     { "Purpose": "Site visit", "TPurpose": "�֡�Ҵ٧ҹ" },
        //     { "Purpose": "Negotiation", "TPurpose": "�èҵ���ͧ" },
        //     { "Purpose": "Troubleshooting", "TPurpose": "��䢻ѭ��" },
        //     { "Purpose": "Exhibition", "TPurpose": "��������ҹ�ʴ��Թ���" },
        //     { "Purpose": "Market research", "TPurpose": "�Ԩ�µ�Ҵ" },
        //     { "Purpose": "Others", "TPurpose": "����" }
        // ]
        // const aaYesNoList = [
        //     { "Code": "YES" },
        //     { "Code": "NO" },
        // ]
        //
        var aaXToX = localStorage["aaXXoX"];
        var aaXNoX = localStorage["aaXXuX"];
        var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492";
        var aaPXXI = localStorage["aPXIXD"];
        var aaMXXT = localStorage["aDXMenuTitle"];

        var aaERTYPE = "800"
        const aaRunPre = "R"

        const aTranTextJson = (aText, aFMark, aLMark) => { // very Important** 
            var axHODFtext = aText;
            var xaChkName;
            var aatestChk = axHODFtext.replaceAll("|", '"')
            var xxChk1 = aatestChk.search(aFMark);
            var xxChk2 = aatestChk.search(aLMark);
            xxChk1 = aatestChk.search(aFMark)
            xxChk2 = aatestChk.search(aLMark)
            if (aLMark === "") {
                xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, 300)); //xxChk1+5, xxChk2-5);
            } else {
                xaChkName = $.trim(aatestChk.substr(xxChk1 + 5, xxChk2 - xxChk1 - 5)); //xxChk1+5, xxChk2-5);
            }
            const xxNameArr = JSON.parse(xaChkName);
            return xxNameArr;
        }

        function aPDFFromHTML(source) {
            var doc = new jsPDF();

            // get HTML code to convert to PDF
            var htmlCode = "<html><body><h1>Hello World!</h1><p>This is a PDF generated from HTML code using jsPDF.</p></body></html>"; //" + source +"
            //htmlCode = "test test"
            // set options for jsPDF
            var options = {
                pagesplit: true,
                async: false,
                onrendered: function () {
                    // do something once the HTML is rendered
                }
            };
            //console.log(htmlCode)
            // convert HTML code to PDF
            doc.html(htmlCode, options);

            //doc.html(htmlCode, options).then(() => doc.save('fileName.pdf'));
            //});

            // save PDF to local drive
            doc.save('myPDF.pdf');

        }

        function aTestUploadFile() {
            var fileInput = document.createElement("INPUT");
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute("id", "file");
            document.body.appendChild(fileInput);
            var myHeaders = new Headers();
            myHeaders.append("ref", "44095B6C-CC17-47FD-895B-649E0EAA2BAE");
            myHeaders.append("Content-Type", "multipart/form-data");
            var formdata = new FormData();
            formdata.append("file", fileInput.files[0], "file:///C:/HTML/XOL/images/avatar.png");
            formdata.append("FilePath", "test");
            var requestOptions = { method: 'POST', headers: myHeaders, body: formdata, redirect: 'follow' };
            fetch("https://cbsdev3.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAExx", requestOptions)
                .then(response => response.text()).then(result => console.log(result))
                .catch(error => console.log('error', error));
        }

        function showPreviousYearPopup(callback) {
            var today = new Date();
            var aTYear = new Date().getFullYear();
            var aLYear = aTYear - 1;
            var aNYear = aTYear + 1;
            var aTextThisYear = aTYear.toString() + "-" + aNYear.toString();
            var aTextLastYear = aLYear.toString() + "-" + aTYear.toString();
            // Check if the current date is after May 3 of this year
            //var isAfterMay3 = (today.getMonth() > 3) || (today.getMonth() === 3 && today.getDate() >= 3);
            var isAfterMay3 = (today.getMonth() === 4 && today.getDate() <= 3)
            //alert(isAfterMay3);
            // If the current date is not after May 3, show the button
            if (isAfterMay3) {
                // Create an array of possible options
                var options = [
                    { id: true, text: "LAST YEAR (" + aTextLastYear + ")" },
                    { id: false, text: "THIS YEAR (" + aTextThisYear + ")" }
                ];

                // Create a dxPopup widget with a list selection
                var apopup1 = $("#popup").dxPopup({
                    title: "Please Select Year",
                    width: 250,
                    height: "auto",
                    position: { offset: "-100 -350" },
                    contentTemplate: function (contentElement) {
                        $("<div>").dxList({
                            dataSource: options,
                            height: "100%",
                            selectionMode: "single",
                            onSelectionChanged: function (e) {
                                // Get the selected option
                                var selectedOption = e.addedItems[0];
                                // Set the aNowDte variable based on the selected option
                                if (selectedOption.id) {
                                    var year = new Date().getFullYear();
                                    var month = 3; // April is month 3 (zero-based)
                                    var day = 30;
                                    var aNowDte = new Date(year, month, day);
                                    console.log("aNowDte: " + aNowDte);
                                } else {
                                    var today = new Date();
                                    var aNowDte = new Date(); //var aNowDte = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
                                    console.log("aNowDte: " + aNowDte);
                                }
                                // Close the popup
                                popup.hide();
                                // Call the callback function with the selected date
                                callback(aNowDte);
                            }
                        }).appendTo(contentElement);
                    }
                }).dxPopup("instance");

                // Show the pop-up when a button is clicked
                $("#showPopupButton").dxButton({
                    hint: "Please select your submitted year (LAST YEAR or THIS YEAR)",
                    text: "Year Selection",
                    icon: "fas fa-calendar-alt",
                    type: "default",
                    visible: isAfterMay3,
                    onClick: function () {
                        apopup1.show();
                    }
                });

            } else {
                // If the current date is after May 3, hide the button
                var aNowDte = new Date();
                $("#showPopupButton").hide();
                callback(aNowDte);
            }
        }

        const aaNowText = (aNowDatev) => { // use
            //let aNowDatev = new Date()
            let aYear2 = String(aNowDatev.getFullYear());
            let aMonth2 = String(101 + aNowDatev.getMonth()).substring(1, 3);
            let aDate2 = String(100 + aNowDatev.getDate()).substring(1, 3);
            let aHour2 = String(100 + aNowDatev.getHours()).substring(1, 3);
            let aMinute2 = String(100 + aNowDatev.getMinutes()).substring(1, 3);
            let aSecond2 = String(100 + aNowDatev.getSeconds()).substring(1, 3);
            let aDateNow2 = aYear2 + "-" + aMonth2 + "-" + aDate2 + "T" + aHour2 + ":" + aMinute2 + ":" + aSecond2
            return aDateNow2;
        }

        async function aaLoadData(aaPFDMI, aDataBasea, aKeya, aKeyfield, axFieldSelected, condition) {
            //let aDataBasea = "ExtraOnLine.dbo.EXPREIM";
            //let aKeyfield = "HeadRefNo";
            let aTokena = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";
            console.log("Inside aaLoadData aKeya = ", aKeya);
            let axqr2S = `Where ${aKeyfield} LIKE '%${aKeya}%'`;
            console.log("Inside aaLoadData axqr2S = ", axqr2S)
            //let axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";
            let axFullBody = "Select " + axFieldSelected + " From " + aDataBasea + " " + axqr2S;

            let response = await fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + aTokena, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "@": btoa(axFullBody) }),
                redirect: "follow"
            });

            let acData = await response.json();
            //const filteredArray = acData.filter(item => item.Amount === 0 || item.ERODesc02 === "" || item.ERODesc03 === "" || item.ERODesc04 === "" || item.ERORefNo3 === "" || item.RefundedAmount === 0 || item.Xrate === 0);
            console.log("record ", acData.length);
            console.log(acData);
            const filteredArray = acData.filter(condition);
            //console.log(filteredArray);
            //console.log(filteredArray.length);

            let abc;
            if (filteredArray.length === 0) { //pass                
                abc = 0;
            } else { // not pass
                // Extract and log the field name that caused the condition to fail
                /*let failedFields = [];
                acData.forEach(item => {
                    for (let key in item) {
                        let tempItem = { ...item };
                        delete tempItem[key];
                        //console.log("Temp item after deleting key", key, ":", tempItem); // Log tempItem after deletion                        
                        if (condition(tempItem)) {
                            failedFields.push(key);
                        }
                    }
                });*/
                //console.log("Failed fields: ", failedFields);
                console.log("not found ", filteredArray.length)
                console.log("Filter Array ", filteredArray)
                abc = 1;
            }
            return abc;
        }

        const aSaveMemToDB = (iData, aaTBKey, aaPFDMI, aaXToX) => {
            let aObjRowData = JSON.stringify(iData);
            sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
            sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
            sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
        }
    // </script>
    // <script>
    var aaPXIXD = localStorage["aPXIXD"];
    var aaEnt = aaPXIXD.includes("X");
    var aaUsrN = localStorage["aaXXuX"];

    // FIRST PRG
    showPreviousYearPopup(function (aNowDte) {
        var aDatabasea = "ExtraOnLine.dbo.TaskControl";
        var aKeyField = "TaskGroup";
        var aKeyIDa = aaPXIXD; //"main"; //aaPXIXD;
        var axFieldSelected = "IDNO,TaskName,TaskProgram,TaskGroup";
        var aVARs = {};
        var aArrays = {};
        var aObjects = {};
        var aaEmailArr;
        var aaMessage2Show;
        var aaMess2Show;
        var aaMess3Show;
        LoadSQLData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected)
            .then(result => {
                for (let ii = 0; ii < result.length; ii++) {
                    let aMatch = result[ii].TaskName.match(/\[(.*?)\]/);
                    if (aMatch) {
                        //
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
                        console.log("aArrays.", aMatch[1], aArrays[aMatch[1]]);
                    } else if (result[ii].TaskName.includes("{T2O}")) {
                        let lines = result[ii].TaskProgram
                            .replace(/`/g, "'") // Replace backticks with single quotes
                            .split('\n')
                        aObjects[aMatch[1]] = lines.map(line => {
                            line = line.trim().replace(/,$/, "");
                            line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                            return JSON.parse(line);
                        });
                        aObjects[aMatch[1]] = aObjects[aMatch[1]].map(obj => {
                            for (let key in obj) {
                                if (key.includes('amt') && typeof obj[key] === 'string') {
                                    obj[key] = +obj[key];
                                }
                            }
                            return obj;
                        });

                    } else if (result[ii].TaskName.includes("{OBJ}")) {
                        aObjects[aMatch[1]] = result[ii].TaskProgram
                            .replace(/`/g, "'")
                            .split('\n')
                            .reduce((obj, item) => {
                                let trimmedItem = item.trim(); // Remove extra spaces
                                if (trimmedItem === "") {
                                    return obj;
                                }
                                let [key, value] = trimmedItem.split(':').map(part => part.trim());
                                if (key && value !== undefined) {
                                    obj[key] = isNaN(value) ? value : +value;
                                }
                                return obj;
                            }, {});
                    } else {
                        if (result[ii].TaskName.includes("{num}")) {
                            aVARs[aMatch[1]] = +(result[ii].TaskProgram.replace(/`/g, "'"));
                        } else {
                            aVARs[aMatch[1]] = result[ii].TaskProgram.replace(/`/g, "'");
                        }
                    }
                }
                var aaPFDMI = isLocalHost();
                var aaPFDMZz = aAPIServer2;
                //aaPFDMI = aaPFDMZz
                var afqrFull = "pageID='" + aaPXIXD + "' "
                var afURL = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaXTXB + '/all' //+ aaPXXI
                var afsettings = {
                    "url": afURL,
                    "method": "POST",
                    "timeout": 0,
                    "headers": { "Content-Type": "application/json" },
                    "data": JSON.stringify({ "@": btoa(afqrFull) }),
                };
                var jqxhr = $.post(afsettings, function (e) { })
                    .done(function (e) {
                        aObjMPage = e;
                        var aaKeyField = aObjMPage[0].PrimaryKey;
                        var aaTBKey = aObjMPage[0].TBKey;

                        // TOP PRG
                        $(() => {
                            var aaPFDMI = isLocalHost()
                            var aaXToX = localStorage["aaXXoX"];

                            var aaOnInitExpGroupCode = "800"
                            var aaOnInitExpGroupDesc = "Travel Requisition Form"
                            var aaOnInitAccCode = "55101150003"
                            var aaOnInitAccDesc = "Travel Requisition Form"

                            let axqr2S = "Where EXPGroup LIKE '%" + aaERTYPE + "%'" //"Where ExpGroupCode = '" + aaERTYPE + "' and " + "EmpID = '" + aaEmpID + "'"
                            let axFieldSelected = "ACCCODE,EDESC,ALTERACC,MAPPING,TDESC,NOTE,EXPGroup,EXPDesc"
                            let axFullBody = "Select " + axFieldSelected + " From " + "ExtraOnLine.dbo.ACCOUNTCHART " + axqr2S; //alert(aFullBody)
                            fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(axFullBody) }), redirect: "follow" })
                                .then(response => response.json())
                                //
                                .then(acData => {
                                    var aaSubGroup01 = acData;
                                    // ACCOUNT code
                                    let aDivisionC = localStorage["asDIV"];
                                    let aDivS = "Where ApproverCode = 'TRFO' OR (ApproverCode = 'HOD' AND ApproveToDivision = '" + aDivisionC + "') Order By LRange02"
                                    let aFieldSelected = "ApproverCode,ApproveToDivision,ApproverName,ApproverEmail,LRange01,LRange02"
                                    let aFullBody = "Select " + aFieldSelected + " From " + "ExtraOnLine.dbo.Approver " + aDivS;

                                    fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                        .then(response => response.json())
                                        //
                                        .then(hData => {

                                            var aaaHODApprover = hData; //aaHODApprover
                                            console.log(aaaHODApprover)
                                            //aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "TRFO");
                                            //console.log(aaHODApprover)
                                            if (jQuery.type(aaaHODApprover[0]) === "undefined") {
                                                DevExpress.ui.dialog.alert({
                                                    //showTitle: false,
                                                    position: { offset: "-130 -310" },
                                                    //position: { my: "top",  at: "top", of: "window"  },
                                                    title: "ERROR SETTING!!",
                                                    messageHtml: "<div>Un-completed system setup, please contact Administrator</div>"
                                                });
                                                System.exit(0); // if not found the Approver
                                            }
                                            var aaHODApprover = aaaHODApprover
                                            var aaHODAppName = aaHODApprover[0].ApproverName
                                            var aaHODAppEmail = aaHODApprover[0].ApproverEmail //.LRange02
                                            var aaHODRAnge02 = aaHODApprover[0].LRange02

                                            var aYearNum = aNowDte.getFullYear()  // 2022
                                            var aMonthNum = aNowDte.getMonth() // 10
                                            var aYearStr = aYearNum.toString() // 2022
                                            var aYearNumS = aNowDte.getFullYear()
                                            var aYearNumL = aNowDte.getFullYear()
                                            var aYearStrS = "";
                                            var aYearStrL = "";
                                            //---- Year for Medical 5/2021 - 4/2022 
                                            if (aMonthNum === 0 || aMonthNum === 1 || aMonthNum === 2 || aMonthNum === 3) {
                                                aYearNumS = aYearNum - 1;
                                                aYearStrS = aYearNumS.toString(); // 21
                                            } else {
                                                aYearStrS = aYearNum.toString(); // 22**
                                            }
                                            if (aMonthNum === 0 || aMonthNum === 1 || aMonthNum === 2 || aMonthNum === 3) {
                                                aYearNumL = aYearNum;
                                                aYearStrL = aYearNumL.toString(); // 22
                                            } else {
                                                aYearNumL = aYearNum + 1;
                                                aYearStrL = aYearNumL.toString(); // 23**
                                            }
                                            var aFilterT = aYearStrS + '/05/01'  //2022/05/01
                                            var aFilterT2 = aYearStrL + '/04/30'  //2023/04/01            
                                            //---- LOAD DATA to json ----- // END

                                            var aMMaMx = localStorage["MMaMx"];
                                            var aRRgRs = aMMaMx.split("0");
                                            var aDDeDx = aRRgRs[0];
                                            var aRrgSx = aRRgRs[1];
                                            if (jQuery.type(aRrgSx) === "undefined") {
                                                aRrgSx = "377B";
                                            }
                                            let nDataPos = 1;
                                            let nExcelPos = 2;
                                            let nPDFPos = 3;
                                            let nRPTPos = 4;
                                            var arDataC = aRolesAction(aRrgSx, nDataPos, 1);
                                            var arDataU = aRolesAction(aRrgSx, nDataPos, 2);
                                            if (arDataU === 1) {
                                                var aUpdateText = "Update";
                                                var aSaveVisible = 1;
                                                var aCancelText = "Cancel";
                                                var aCancelicon = "close";
                                                var aCancelType = "danger";
                                            } else {
                                                var aUpdateText = "xxx";
                                                var aSaveVisible = 0;
                                                var aCancelText = "EXIT";
                                                var aCancelicon = "fas fa-sign-out-alt";
                                                var aCancelType = "success";
                                            }
                                            var arDataD = aRolesAction(aRrgSx, nDataPos, 3);
                                            var arExcelEx = aRolesAction(aRrgSx, nExcelPos, 2);
                                            var arPDFEx = aRolesAction(aRrgSx, nPDFPos, 2);
                                            var aNowDatev = new Date()
                                            // set global variable for dx-form (add-form) nRecno = 1
                                            var asFullName = localStorage["asFTNAME"];
                                            var asStaffID = $.trim(localStorage["asSTFID"]);
                                            var asDepartment = localStorage["asDEPT"];
                                            var asDivision = localStorage["asDIV"];
                                            var asStaffEmail = localStorage["asEMAIL"];
                                            var asERStatus = "Register";

                                            //----- Variables for TRF dxForm ---------------
                                            var asERODesc02 = ""; //Destination	ERODesc02
                                            var asERODesc03 = ""; //Purpose of Trip
                                            var asERORefNo1 = ""; //Purpose of Trip List
                                            var asEROCheck01 = false; //Overseas
                                            var asEROCheck02 = false; //Need Roaming                                        
                                            var asERODate02 = new Date() //Travel Start Date	
                                            var asERODate03 = new Date() //Travel End Date	
                                            var asRefundedAmount = 0; //Estimated Cost	
                                            var asVendor01 = ""; //Departure Flight	
                                            var asERODesc04 = ""; //Arrival Flight	
                                            var asEROAmount1 = 0; //Ticket Price	EROAmount1
                                            var asERODesc05 = ""; //Hotel	ERODesc05
                                            var asNote = ""; //Remark	Note
                                            //---- Variable for dataGrid ------------------
                                            //Full name (as show in passport)	vendor02
                                            //Send	EROCheck03
                                            //Send Date	ERODate01
                                            //Royal Orchid Plus	EROCode02
                                            //Ticket Price	EROAmount2
                                            //Hotel	ERODesc01
                                            ///Hotel Price	EROAmount4
                                            //Date From	ERODate05
                                            //Date To	ERODate06
                                            //Mobile phone	EROCode03

                                            var aqrFull = "ExpGroupCode = '" + aaERTYPE + "' and " + "PayToCode = '" + asStaffID + "'"
                                            // scopes based permission (View Only Login Name)  ExpensesCode LIKE aaOnInitAccCode
                                            var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                            var aSettings = { "url": aurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };
                                            var aaAllData;

                                            $("#gridContainer").dxDataGrid({

                                                dataSource: new DevExpress.data.CustomStore({
                                                    key: "REFNO",
                                                    loadMode: "omit",
                                                    load: function () { return $.post(aSettings).done(function (resp) { aaAllData = resp }); },   //console.log(resp);
                                                    insert: function (values) {
                                                        if (aaEnt) {
                                                            var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };
                                                            var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                                        }
                                                        else {
                                                            var ObjRowData = JSON.stringify(values);
                                                        }
                                                        sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                    },
                                                    update: function (key, values) {
                                                        var ObjKeyData = { "REFNO": $.trim(key) };   //[aaKeyField] key.trim
                                                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                                        sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                    },
                                                    remove: function (key) {
                                                        var ObjKeyData = { "REFNO": $.trim(key) };   //[aaKeyField] key.trim
                                                        var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                                                        sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                    }
                                                }),
                                                //elementAttr: {class: "custom-datagrid" },
                                                allowColumnReordering: true,
                                                allowColumnResizing: true,
                                                columnMinWidth: 10,
                                                columnChooser: {
                                                    enabled: false,  //false // true
                                                },
                                                showBorders: true,
                                                sorting: {
                                                    mode: "multiple"
                                                },
                                                selection: {
                                                    mode: "single" //'multiple'
                                                },
                                                groupPanel: {
                                                    visible: false //false // can't select other group
                                                },
                                                filterRow: {
                                                    visible: true,
                                                    applyFilter: "auto"
                                                },
                                                headerFilter: {
                                                    visible: true
                                                },
                                                filterPanel: {
                                                    visible: true
                                                },
                                                filterBuilderPopup: {
                                                    position: {
                                                        of: window, at: 'top', my: 'top', offset: { y: 5 },
                                                    },
                                                    height: 500,
                                                    width: 1000,
                                                },
                                                filterValue: [['ReqDate', '>=', aFilterT], "and", ['ReqDate', '<=', aFilterT2], "and", ['ID', '=', '1']],
                                                //              [Req.Date] Is any of('2022') and show only first record of the group  (ID=1)                                
                                                grouping: {
                                                    autoExpandAll: true,
                                                },
                                                searchPanel: {
                                                    visible: true
                                                },
                                                paging: {
                                                    pageSize: 10
                                                },
                                                pager: {
                                                    showPageSizeSelector: true,
                                                    allowedPageSizes: [10, 20, 50, 100],
                                                    showNavigationButtons: true,
                                                    showInfo: true
                                                },
                                                showBorders: true,
                                                groupPaging: true,
                                                showColumnLines: true,
                                                showRowLines: true,
                                                rowAlternationEnabled: false, //true,
                                                focusedRowEnabled: false,

                                                // Export to Excel 		
                                                export: {
                                                    enabled: arExcelEx,
                                                    allowExportSelectedData: true
                                                },
                                                onExporting: function (e) {
                                                    const workbook = new ExcelJS.Workbook();
                                                    const worksheet = workbook.addWorksheet('DATA');
                                                    DevExpress.excelExporter.exportDataGrid({
                                                        worksheet: worksheet,
                                                        component: e.component
                                                    }).then(function () {
                                                        workbook.xlsx.writeBuffer().then(function (buffer) {
                                                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'TravelRequisition' + '.xlsx');
                                                        });
                                                    });
                                                    e.cancel = true;
                                                },
                                                onInitNewRow: function (e) {
                                                    //e.component.__addingStart = true; 
                                                    //gridContainer.option("editing.popup.title", "Adding Expenses Reimbursement");
                                                    let aaID = 1
                                                    let axRunRun = aGetDateRef(aaRunPre); //aaRunPre aaOnInitExpGroupDesc.substring(0, 1)
                                                    let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                    e.data.ID = aaID
                                                    e.data.HeadRefNo = axRunRun
                                                    e.data.REFNO = axLineNo
                                                    e.data.PayToCode = asStaffID
                                                    e.data.PayToName = asFullName
                                                    e.data.Department = asDepartment
                                                    e.data.Division = asDivision
                                                    e.data.ERODesc06 = asStaffEmail
                                                    e.data.ReqDate = new Date()
                                                    e.data.ExpensesCode = "" //aaOnInitAccCode
                                                    e.data.ExpensesDescription = aaOnInitAccDesc ////aaOnInitAccDesc
                                                    e.data.Currency = "THB"
                                                    e.data.Xrate = 1
                                                    e.data.ExpGroupCode = aaOnInitExpGroupCode
                                                    e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                                    e.data.ERStatus = "Register"
                                                    e.data.ERORefNo3 = ""
                                                    e.data.EROCheck01 = true
                                                    e.data.EROCheck02 = true
                                                    e.data.NeedPayment = false
                                                    e.data.RefundedAmount = 0
                                                    e.data.LimitedAmount = 0 //aaLTotal // Fleet Card
                                                },
                                                onEditorPreparing: function (e) {
                                                    if (e.parentType === "dataRow" && arDataU === 0) {
                                                        e.editorOptions.disabled = true;
                                                    } else {
                                                        if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ERStatus" || e.dataField === "PSPvNO" || e.dataField === "LocalAmount" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department")) {
                                                            e.editorOptions.disabled = true;
                                                        }
                                                    }
                                                },

                                                // Editing
                                                editing: {
                                                    mode: "cell", // popup , row, cell (click to edit)
                                                    useIcons: true,
                                                    allowUpdating: false, //U
                                                    allowDeleting: arDataD, //D
                                                    allowAdding: 0, //C //arDataC, //arDataC, false, 
                                                    popup: {
                                                        title: "Travel Requisition FormInfo",
                                                        fullScreen: false,
                                                        showTitle: true,
                                                        width: 1200,
                                                        height: 650,
                                                        position: {
                                                            my: "top",
                                                            at: "top",
                                                            of: "window"
                                                        },
                                                        onContentReady: function (e) {
                                                            e.component.option('toolbarItems[0].visible', aSaveVisible);
                                                            e.component.option('toolbarItems[0].options.icon', 'save');
                                                            e.component.option('toolbarItems[0].options.type', 'success');
                                                            e.component.option('toolbarItems[1].options.text', aCancelText);
                                                            e.component.option('toolbarItems[1].options.icon', aCancelicon);
                                                            e.component.option('toolbarItems[1].options.type', aCancelType);
                                                        }
                                                    },

                                                },

                                                columns: [
                                                    {
                                                        type: "buttons",
                                                        width: 40,
                                                        buttons: [
                                                            {
                                                                hint: "Edit",
                                                                icon: "fas fa-pen", //<i class="fa-solid fa-magnifying-glass"></i>
                                                                visible: function (e) {
                                                                    return (e.row.data.ID === 1 && e.row.data.Confirmed === false) //return !e.row.isEditing; //&& e.row.data.Confirmed === false
                                                                },
                                                                onClick: function (e) {
                                                                    console.log(e.row.data.type)
                                                                    console.log("head ref no = ", e.row.data.HeadRefNo)
                                                                    console.log("e.row.data = ", e.row.data)
                                                                    aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate);
                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                }
                                                            },
                                                            {
                                                                hint: "view",
                                                                icon: "fas fa-search",
                                                                visible: function (e) {
                                                                    return (e.row.data.ID === 1 && e.row.data.Confirmed === true) //return !e.row.isEditing; //&& e.row.data.Confirmed === false
                                                                },
                                                                onClick: function (e) {
                                                                    aPopUpAddForm(e.row.data.HeadRefNo, e.row.data, e.row.data.ReqDate, true); // true = readOnly
                                                                }
                                                            },
                                                        ]
                                                    },
                                                    {
                                                        type: "buttons",
                                                        width: 40,
                                                        buttons: [
                                                            {
                                                                hint: "UN-Confirm",
                                                                icon: "fas fa-times-circle",
                                                                //visible: false,
                                                                visible: function (e) {
                                                                    return (e.row.data.ID === 1 && e.row.data.Confirmed === true && e.row.data.HODApproved === false) //return !e.row.isEditing;
                                                                },
                                                                onClick: function (e) {
                                                                    //send Email
                                                                    let aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + "<br> CALLBACK";
                                                                    let aApproverName = aaHODAppName         //aaHRAppName //"Wikran" + " [HR]"         // HR Approver Name
                                                                    let aApproverEmail = $.trim(aaHODAppEmail) // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                    let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                    let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"  aRefNoa
                                                                    let aSubject = aaOnInitExpGroupDesc + " - CALLBACK"
                                                                    let aRefNoa = e.row.data.HeadRefNo //iData.HeadRefNo aaiHeadRef

                                                                    let aAddress2Do = `<a href='${aaPFDMI}/XOL/index.html'>${aaOnInitExpGroupDesc}</a>`;
                                                                    let getvalues = { aApproverName: aApproverName, aApproverEmail: aApproverEmail, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName }
                                                                    let aAlertUNC = aArrays.ALERT03[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                    let result = DevExpress.ui.dialog.confirm(aAlertUNC, aArrays.ALERT03[1]);
                                                                    //let result = DevExpress.ui.dialog.confirm("Are you sure you want to Un-Confirmed to Edit this Record ? <br> HOD = " + e.row.data.Vendor02Note + " (" + $.trim(aaHODAppEmail) + ")", "UN-CONFIRMED ?"); // "<br>�� 'YES' �����?�?" //+ " <br><p style='color:Red; font-size: 12px;' > ��??�?�?���������?��?��?���?��� <br><b><u>�����?�</u> ��?��?��?���???�?�?������ </b></p><p style='color: grey; font-size: 10px;'></p>�?�?��?��?���"
                                                                    result.done(function (dresult) {
                                                                        if (dresult) {
                                                                            // mark Confirmed field
                                                                            let aERStatus = "Register"
                                                                            let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                            let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                            var aObjKeyData = { REFNO: e.row.data.REFNO, Confirmed: aTrueORFalseB, ERStatus: aERStatus };   //[aaKeyField] key.trim
                                                                            var aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //value
                                                                            sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));

                                                                            //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704'
                                                                            let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF  SET Confirmed = " + aTrueORFalse + ", ERStatus = '" + aERStatus + "' Where HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                            aSQLAction(aaPFDMI, aSQLCommand)

                                                                            e.component.refresh(true);
                                                                            e.component.refresh(true);
                                                                            e.component.refresh(true);
                                                                            e.event.preventDefault();


                                                                            let aMessage01 = aArrays.ACONFIRM[1].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                            //let aMessage01 = aEmailTRF[0] + $.trim(aApproverName) + aEmailTRF[6] + aaOnInitExpGroupDesc + aEmailTRF[7] + e.row.data.HeadRefNo + aEmailTRF[8] + aAddress2Do + aEmailTRF[9] + aRequesterName + aEmailTRF[10];
                                                                            //let aMessage01 = "<div>เรีย�� ��ุณ" + $.trim(aApproverName) + "<br>��ู����ออ��ุมัติ��ด��เรีย������อมูล " + aaOnInitExpGroupDesc + " Expenses Reimbursement สำหรั�� REFNO = [" + e.row.data.HeadRefNo + "]<br> ��ลั���������������� <br> ��������า������ร����รมที�� " + aAddress2Do + "<br><br><br><b>" + aRequesterName + "</b></div>"
                                                                            //let aP1Body = '<table style="height: 40px;" border="0" width="200" cellspacing="0" cellpadding="0"><tbody><tr style="height: 40px;"><td style="width: 200px; text-align: left; height: 40px;" align="center" bgcolor="#483D8B"><h2><span style="color: #ffffff;"><center><strong>Please Approve at &nbsp;'+ aAddress2Do +'</center></strong></span></h2></td></tr></tbody></table>'                          
                                                                            //aSendMailDMZ("Khun " + aApproverName , aApproverEmail ,"XOL-Requester",aRequesterEmail,"","Please approve a Medical Expenses Reimbursement" , "<div style='font-family:tahoma; font-size:12px;' > Dear Khun " + aApproverName + ", <br/><br/>" + aP1Body + "<br/><br/>Regards,<br/>XOL Admin.<br/><br/><i>(Plese do not reply this mail !!)<i></div>");
                                                                            var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #9700F9; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#F5E6FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"

                                                                            aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                            e.component.refresh(true);
                                                                            e.component.refresh(true);
                                                                            e.component.refresh(true);
                                                                            e.event.preventDefault();
                                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                                            //aMessageAlert("Already UN-Confirmed", "Red")
                                                                            aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                        }
                                                                    });

                                                                }

                                                            },
                                                            {
                                                                hint: "Print",
                                                                icon: "fas fa-print",
                                                                //visible: true,
                                                                visible: function (e) {
                                                                    return (e.row.data.ID === 1 && e.row.data.Confirmed === true && e.row.data.ERStatus.includes("(finished)")) //false; && e.row.data.Confirmed === true aGenPDF4HTML
                                                                },
                                                                onClick: function (e) {
                                                                    //aPopUpPrintForm(e.row.data, e.row.data.HeadRefNo); // , aTableFromDataX, aTableFromDataY)
                                                                    console.log(e.row.data.HeadRefNo)
                                                                    aRPTPrint2Pdf(e.row.data.HeadRefNo, aaPFDMI, "RMasterReport", "Travel Requisition Form") //T2302163889 e.row.data.HeadRefNo
                                                                    e.component.refresh(true);
                                                                    e.component.refresh(true);
                                                                    e.component.refresh(true);
                                                                    e.component.refresh(true);
                                                                    e.event.preventDefault();
                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                    //})  //for fetch 
                                                                }

                                                            },
                                                        ]
                                                    },
                                                    {
                                                        type: "buttons",
                                                        width: 40,
                                                        buttons: [

                                                            {
                                                                hint: "View Attach File",
                                                                icon: "fas fa-file",
                                                                // visible: true,
                                                                visible: function (e) {
                                                                    return (e.row.data.ID === 1 && e.row.data.Confirmed === true && e.row.data.ERStatus.includes("(finished)")) //false; && e.row.data.Confirmed === true aGenPDF4HTML
                                                                },
                                                                onClick: async function (e) {
                                                                    var aUriV = `${aaPFDMI}/temp/uploads/${e.row.data.HeadRefNo}.pdf`
                                                                    const cacheBusterUrl = aUriV + "?t=" + new Date().getTime();
                                                                    const fileAvailable = await isFileAvailable(aUriV);
                                                                    //alert(fileAvailable ? "Found" : "Not found")
                                                                    if (fileAvailable || aaCheckON) {
                                                                        aPopupPDF(cacheBusterUrl) //showPdf(aUriV) //'https://cbsdev2.locktonwattana.com/temp/uploads/R2411145070-001.pdf'
                                                                    } else {
                                                                        aMessageAlert("<b>The requested file is not available on the server.", "red");
                                                                    }

                                                                }
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        dataField: "HeadRefNo",
                                                        caption: "REF NO",
                                                        dataType: "string",
                                                        sortOrder: "desc",
                                                        //groupIndex: 0,
                                                        width: 120,
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "ID",
                                                        sortOrder: "asc",
                                                        dataType: "number",
                                                        caption: "NO",
                                                        width: 40,
                                                        visible: false,
                                                    },
                                                    {
                                                        dataField: "PayToName",
                                                        caption: "Requesters",
                                                        editorType: "dxTextBox",
                                                        //cssClass: "verylight-blue",
                                                        width: 150,
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "Department",
                                                        caption: "Department",
                                                        dataType: "string",
                                                        editorType: "dxTextBox",
                                                        //cssClass: "verylight-blue",
                                                        width: 80,
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "ReqDate",
                                                        caption: "Requested Date",
                                                        dataType: "date",
                                                        format: "dd/MM/yyyy",
                                                        width: 120,
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "EROCheck01",
                                                        caption: "Location",
                                                        cellTemplate: function (container, options) {
                                                            var value = options.value ? "Overseas" : "Local";
                                                            $("<div>")
                                                                .text(value)
                                                                .css("text-align", "left")
                                                                .appendTo(container);
                                                        }
                                                    },
                                                    {
                                                        dataField: "ERORefNo1", //ERODesc03
                                                        caption: "Purpose Of Trip",
                                                        dataType: "string",
                                                        width: 150,
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "ERODesc02",
                                                        caption: "Destination",
                                                        dataType: "string",
                                                        width: 150,
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "ERODate02",
                                                        caption: "Travel Start Date",
                                                        dataType: "date",
                                                        format: "dd/MM/yyyy",
                                                        width: 140,
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "ERODate03",
                                                        caption: "Travel End Date",
                                                        dataType: "date",
                                                        format: "dd/MM/yyyy",
                                                        width: 140,
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "RefundedAmount",
                                                        caption: "Estimated Cost",
                                                        dataType: "number",
                                                        format: { type: "fixedPoint", precision: 2 },
                                                        width: 140,
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "ERStatus",
                                                        caption: "Status",
                                                        dataType: "string",
                                                        width: 250,
                                                        visible: true,
                                                    },
                                                    {
                                                        dataField: "Vendor02Note",
                                                        caption: "Approver",
                                                        dataType: "string",
                                                        width: 140,
                                                        visible: false,
                                                    },
                                                ],
                                                // summary
                                                summary: {
                                                    recalculateWhileEditing: true,
                                                    skipEmptyValues: false,
                                                    totalItems: [
                                                        {
                                                            column: "REFNO",
                                                            summaryType: "count",
                                                            /*
                                                            summaryType: "max",
                                                            valueFormat: "currency",
                                                            showInGroupFooter: false,
                                                            alignByColumn: true  
                                                            */
                                                            displayFormat: "{0} Items",
                                                        },
                                                        {
                                                            column: "RefundedAmount",
                                                            summaryType: "sum",
                                                            //          summaryType: "max",
                                                            valueFormat: "#,##0.00", //"currency",
                                                            //          showInGroupFooter: false,
                                                            //          alignByColumn: true            
                                                            displayFormat: "{0}",
                                                        },
                                                    ],
                                                    groupItems: [
                                                        {
                                                            column: "ID",
                                                            summaryType: "count",
                                                            displayFormat: "{0} Items",
                                                        },
                                                        {
                                                            column: "ERORefNo4",
                                                            summaryType: "count",
                                                            showInGroupFooter: true,
                                                            displayFormat: "Total {0} Items",
                                                        },
                                                        {
                                                            column: "RefundedAmount",
                                                            summaryType: "sum",
                                                            valueFormat: "#,##0.00",
                                                            showInGroupFooter: true,
                                                            alignByColumn: true,
                                                            displayFormat: "{0}",
                                                        },
                                                    ],
                                                },
                                                // Tool Bar
                                                onToolbarPreparing: function (e) {
                                                    var dataGrid = e.component;
                                                    e.toolbarOptions.items.unshift(
                                                        {
                                                            location: "before",
                                                            template: function () { return $("<div style='padding: 5px 5px;'/>") }
                                                        },
                                                        {
                                                            location: "before",
                                                            template: function () {
                                                                return $("<div />")
                                                                    //.addClass("informer")
                                                                    .append(
                                                                        $("<span style='font-size: 13px; font-weight: bold; color: white; background-color: darkgreen; border-radius: 3px; border: 0px; padding: 1px 30px; ' />")
                                                                            .text(aaOnInitExpGroupDesc.toUpperCase()), //" FOR "
                                                                        $("<br><center />"),
                                                                        $("<i class= 'fas fa-user-circle''><span />")   //; style='color: DarkGreen;
                                                                            //.addClass("name")
                                                                            .text(" " + $.trim(asFullName)),
                                                                    );
                                                            }
                                                        },
                                                        {
                                                            location: "after",
                                                            widget: "dxButton",
                                                            options: {
                                                                icon: "fas fa-info",
                                                                text: "HELP",
                                                                type: "default",
                                                                stylingMode: "contained",
                                                                onClick: function () {
                                                                    //dataGrid.refresh();
                                                                    let aHelpMessage = `<div style = 'color: darkred; font-size: 16px;'><i class='fas fa-plus'></i>" + " ADD MORE ROW</div>`
                                                                    aPopupHelp("HELP", aVARs.HELP01)
                                                                }
                                                            }
                                                        },
                                                        {
                                                            location: "before",
                                                            template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                        },
                                                        {
                                                            location: "before",
                                                            template: function () { return $("<div style='padding: 5px 8px; '/>") }
                                                        },
                                                        {
                                                            location: "before",
                                                            template: function () { return $("<div style='padding: 5px 85px;'/>") }
                                                        },

                                                        // Add New Record
                                                        {
                                                            location: "after",
                                                            widget: "dxButton",
                                                            options: {
                                                                icon: "fas fa-plus-circle",
                                                                text: "Add New",
                                                                type: "success",
                                                                stylingMode: "contained", // "outlined" contained
                                                                onClick: function () {
                                                                    let aNewDate = new Date()
                                                                    aPopUpAddForm(1, 1, aNowDte);
                                                                }
                                                            }
                                                        },

                                                        {
                                                            location: "after",
                                                            widget: "dxButton",
                                                            options: {
                                                                icon: 'collapse',
                                                                text: 'Collapse All',
                                                                //type: "danger",
                                                                width: 140,
                                                                onClick: function (e) {
                                                                    var expanding = e.component.option("text") === "Expand All";
                                                                    dataGrid.option("grouping.autoExpandAll", expanding);
                                                                    e.component.option("text", expanding ? "Collapse All" : "Expand All");
                                                                    e.component.option("icon", expanding ? "collapse" : "expand");
                                                                }
                                                            }
                                                        },
                                                        {
                                                            location: "after",
                                                            widget: "dxButton",
                                                            visible: arPDFEx,
                                                            options: {
                                                                icon: "exportpdf",
                                                                //text: "Export to PDF",
                                                                hint: "Export to PDF File",
                                                                onClick: function () {
                                                                    const doc = new jsPDF();
                                                                    //doc.addFont("font/ANGSA.ttf", "angsana", "normal");
                                                                    doc.addFont("font/Prompt-ExtraLight.ttf", "Prompt", "normal"); // load thai font (in font location Google Font)
                                                                    doc.setFont("Prompt", "normal"); // set to thai font
                                                                    DevExpress.pdfExporter.exportDataGrid({
                                                                        jsPDFDocument: doc,
                                                                        component: dataGrid,
                                                                        customizeCell: function (options) {
                                                                            const { gridCell, pdfCell } = options;

                                                                            //if(gridCell.rowType === 'data') {
                                                                            //set font and font size
                                                                            pdfCell.styles = {
                                                                                font: 'Prompt',
                                                                                fontSize: 10
                                                                            }
                                                                            //}
                                                                        }
                                                                    }).then(function () {
                                                                        doc.save('TRVREQF' + '.pdf');
                                                                    });
                                                                }
                                                            }
                                                        },
                                                        {
                                                            location: "after",
                                                            widget: "dxButton",
                                                            options: {
                                                                icon: "refresh",
                                                                hint: "Refresh",
                                                                onClick: function () {
                                                                    dataGrid.refresh();
                                                                }
                                                            }
                                                        }
                                                    );
                                                }

                                            }).dxDataGrid("instance");

                                            // Not use
                                            $("#action-add").dxSpeedDialAction({
                                                label: "Add",
                                                icon: "fas fa-plus-circle",
                                                index: 1,
                                                position: {
                                                    offset: "-990 -950"
                                                },
                                                elementAttr: {
                                                    //class: "addEmpty"
                                                },
                                                onClick: function () {
                                                    aPopUpAddForm(1, 1, new Date());
                                                }
                                            }).dxSpeedDialAction("instance");

                                            function aDataGridRF() {
                                                dataGrid.refresh();
                                            }

                                            function aSearchjson(aObjArr, asID) {
                                                return aObjArr.filter( //aaEmployee
                                                    function (data) {
                                                        return data.ACCCODE == asID
                                                    }
                                                );
                                            }

                                            function aSearchXjson(aObjArr, asID) {
                                                return aObjArr.filter( //aaEmployee
                                                    function (data) {
                                                        return data.Code == asID
                                                    }
                                                );
                                            }

                                            // Print Form
                                            const aPopUpPrintForm = (iData, aaHeadRefNo) => { //, eData, acData
                                                var aaiHeadRef = aaHeadRefNo;
                                                var aaSchRef = "HeadRefNo LIKE '%" + aaiHeadRef + "%'" // scopes based permission (View Only Login Name)
                                                var aaPFDMI = isLocalHost();
                                                var astr = localStorage["aDXTheme"]
                                                if (astr.includes("dark")) {
                                                    var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmwhite.png' width='88'></center></div>"
                                                } else {
                                                    var alImg = "<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"
                                                }

                                                $(() => {
                                                    var gbxRateV = 1;
                                                    let atopmargin = "5px";
                                                    let abodyleftm = "5px";
                                                    let abodylefts = "15px";
                                                    var aAppArr = iData.Vendor01Note
                                                    console.log("text ", aAppArr)
                                                    var xxChkNamexx = aTranTextJson(aAppArr, "NAME:", "MAIL:")
                                                    console.log("array ", xxChkNamexx)
                                                    var anNameLen = xxChkNamexx.length
                                                    var aChkApprove = 0;
                                                    var aDate00 = iData.ERODate02.toString();
                                                    var aDateD00 = aDate00.substring(8, 10) + "/" + aDate00.substring(5, 7) + "/" + aDate00.substring(0, 4)
                                                    var aDate01 = iData.ERODate03.toString();
                                                    var aDateD01 = aDate01.substring(8, 10) + "/" + aDate01.substring(5, 7) + "/" + aDate01.substring(0, 4)
                                                    var aDate02 = iData.ERODate04.toString();
                                                    var aDateD02 = aDate02.substring(8, 10) + "/" + aDate02.substring(5, 7) + "/" + aDate02.substring(0, 4)
                                                    let aSubD = iData.ReqDate.toString();
                                                    let aSubmitD = aSubD.substring(8, 10) + "/" + aSubD.substring(5, 7) + "/" + aSubD.substring(0, 4)
                                                    console.log(aDateD00 + aDateD01 + aDateD02)
                                                    if (anNameLen === 1) {
                                                        if (aDateD00 !== "01/01/1901") {
                                                            aChkApprove = 1;
                                                        } else {
                                                            aChkApprove = 0;
                                                        }
                                                    } if (anNameLen === 2) {
                                                        if (aDateD00 !== "01/01/1901" && aDateD01 !== "01/01/1901") {
                                                            aChkApprove = 1;
                                                        } else {
                                                            aChkApprove = 0;
                                                        }
                                                    } if (anNameLen === 3) {
                                                        if (aDateD00 !== "01/01/1901" && aDateD01 !== "01/01/1901" && aDateD02 !== "01/01/1901") {
                                                            aChkApprove = 1;
                                                        } else {
                                                            aChkApprove = 0;
                                                        }
                                                    }
                                                    //console.log(aChkApprove)
                                                    //let aSubmitD =  aSubD.getFullYear() + "/" + aSubD.getMonth() + "/" + aSubD.getDate()
                                                    let atitledtl = "Travel Requisition Form";
                                                    let aAlertMessage = "<big>��?�?�?��?����� ���������?��?�����?� **</big>";
                                                    let arectanglehtml = "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><rect x='1' y='1' width='100' height='100' stroke='black' stroke-width='0.2' fill='none' /></svg>";
                                                    let arspace = (no) => { return "&nbsp;".repeat(no) }; //= "&nbsp;".repeat(30);
                                                    let arlineno = (nor) => { return "<br>".repeat(nor) };
                                                    var aAppLineDtl = "";
                                                    var aReqLineDtl = "";
                                                    if (aChkApprove === 1) {
                                                        if (anNameLen === 1) {
                                                            aReqLineDtl = " " + arlineno(2) + "<span>" + arspace(2) + "</span><div class='colorRBGlightgrey';><small><b>�����?�� (Requester)</b></small><br><br><br></div>";
                                                            aAppLineDtl = "<div class='colorRBGlightgrey';><small><b>���?��?� (Approver)</b></small><br><br>" + arspace(5) + xxChkNamexx[0] + arspace(5) + "(" + aDateD00 + ")<br>"; //+ arspace(5) + xxChkNamexx[1] + arspace(5) +"(" + aDateD01 + ")<br>" + arspace(5) + xxChkNamexx[2] +  arspace(5) + "(" + aDateD02 + ")<br>" + "</div>";
                                                        }
                                                        if (anNameLen === 2) {
                                                            aReqLineDtl = " " + arlineno(2) + "<span>" + arspace(2) + "</span><div class='colorRBGlightgrey';><small><b>�����?�� (Requester)</b></small><br><br><br><br></div>";
                                                            aAppLineDtl = "<div class='colorRBGlightgrey';><small><b>���?��?� (Approver)</b></small><br><br>" + arspace(5) + xxChkNamexx[0] + arspace(5) + "(" + aDateD00 + ")<br>" + arspace(5) + xxChkNamexx[1] + arspace(5) + "(" + aDateD01 + ")<br>"; // + arspace(5) + xxChkNamexx[2] +  arspace(5) + "(" + aDateD02 + ")<br>" + "</div>";
                                                        }
                                                        if (anNameLen === 3) {
                                                            aReqLineDtl = " " + arlineno(2) + "<span>" + arspace(2) + "</span><div class='colorRBGlightgrey';><small><b>�����?�� (Requester)</b></small><br><br><br><br><br></div>";
                                                            aAppLineDtl = "<div class='colorRBGlightgrey';><small><b>���?��?� (Approver)</b></small><br><br>" + arspace(5) + xxChkNamexx[0] + arspace(5) + "(" + aDateD00 + ")<br>" + arspace(5) + xxChkNamexx[1] + arspace(5) + "(" + aDateD01 + ")<br>" + arspace(5) + xxChkNamexx[2] + arspace(5) + "(" + aDateD02 + ")<br>" + "</div>";
                                                        }
                                                    } else {
                                                        aReqLineDtl = " " + arlineno(2) + "<span>" + arspace(2) + "</span><div class='colorRBGlightgrey';><small><b>�����?�� (Requester)</b></small><br><br><br></div>";
                                                        aAppLineDtl = "<div class='colorRBGlightgrey';><small><b>���?��?� (Approver)</b></small><br><br><br>"; //+ arspace(5) + xxChkNamexx[1] + arspace(5) +"(" + aDateD01 + ")<br>" + arspace(5) + xxChkNamexx[2] +  arspace(5) + "(" + aDateD02 + ")<br>" + "</div>";
                                                    }


                                                    var aheaderhtml = "<h4 style='text-align: left;'><img src='data:image/png;base64,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' height='42.30000000000001' width='95'> </h4>"
                                                    const popup = $("#popupContainer").dxPopup({
                                                        title: "Travel Requisition Form",
                                                        maxWidth: "1300px",
                                                        maxHeight: "5000px;",
                                                        position: { offset: "0 0" }, //{offset: "0 -180"},
                                                        //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                                        visible: true,
                                                        fullScreen: true,
                                                        showCloseButton: false,
                                                        showTitle: false,
                                                        dragEnabled: true,
                                                        closeOnOutsideClick: false,
                                                        resizeEnabled: true,
                                                        contentTemplate: () => {
                                                            return $("<div />").append(
                                                                $("<div style = 'margin-left: " + atopmargin + "'>" + aheaderhtml + " </div>"),
                                                                //$("<div style = 'margin-left: " + atopmargin + "'>" + aTableFromData + " </div>"),
                                                                $("<b><div style = 'font-size: 22px; margin-left: " + atopmargin + "; text-align:left; border-left: 10px solid grey;  border-bottom: 2px solid grey;'>" + arspace(1) + atitledtl + "</div></b>"),
                                                                $("<p style='margin-left: " + atopmargin + "; text-align:left;'>REF.NO: <b>" + aaiHeadRef + "</b>" + arspace(10) + "DATE: <b>" + aSubmitD + "</b></span><span style='float:right;' id='popupprint'></span></p>"),
                                                                $("<div style = 'margin-left: " + abodyleftm + "' id='form'></div>" + arlineno(1)),
                                                                $("<div style = 'margin-left: " + abodyleftm + "'>��������? - DESCRIPTIONS</div>"),
                                                                //$("<div style = 'margin-left: " + atopmargin + "'>" + aTableFromData + " </div>"),
                                                                $("<p><div style = 'margin-left: " + abodyleftm + "' id='detail-dxDataGrid'></div></p>"),
                                                                $("<p style = 'margin-left: " + abodyleftm + "'>�����??�?�� - ACCOUNTING INFORMATION</p>"),
                                                                //$("<div style = 'margin-left: " + atopmargin + "'>" + aTableFromAC + " </div>"),
                                                                $("<p><div style = 'margin-left: " + abodyleftm + "' id='ACCChart-dxDataGrid'></div></p>"),
                                                                $("<span style='font-size: 12px; font-weight: bold; color: black; border: 0px solid gray; padding: 1px 1px; margin-left: " + abodyleftm + "'>" + aAlertMessage + "</span>" + arlineno(2)),
                                                                //$(" " + arlineno(2) + "<span>" + arspace(2) + "</span><div class='colorRBGlightgrey';><small><b>�����?�� (Requester)</b></small><br><br><br><br><br></div>"),
                                                                $(aReqLineDtl),
                                                                $("<span>" + arspace(28) + "</span>"),
                                                                $(aAppLineDtl),
                                                                //$("<div class='colorRBGlightgrey';><small><b>���?��?� (Approver)</b></small><br><br>" + arspace(5) + xxChkNamexx[0] + arspace(5) + "(" + aDateD00 + ")<br>" + arspace(5) + xxChkNamexx[1] + arspace(5) +"(" + aDateD01 + ")<br>" + arspace(5) + xxChkNamexx[2] +  arspace(5) + "(" + aDateD02 + ")<br>" + "</div>"),
                                                            );
                                                        },
                                                    }).dxPopup("instance");

                                                    $("#popupexit").dxButton({
                                                        icon: "fas fa-times",
                                                        type: "danger",
                                                        //text: "EXIT",
                                                        //width: "120px",
                                                        visible: true,
                                                        onClick: function () {
                                                            popup.hide();
                                                        }
                                                    });

                                                    $("#popupprint").dxButton({
                                                        icon: "print",
                                                        //text: "Print",
                                                        onClick: function () {
                                                            window.print()
                                                            popup.hide();
                                                        }
                                                    });

                                                    $("#print").dxButton({
                                                        icon: "print",
                                                        //text: "Print",
                                                        onClick: function () {
                                                            window.print();
                                                        }
                                                    });

                                                    const apxform = $("#form").dxForm({
                                                        formData: iData,
                                                        showColonAfterLabel: false,
                                                        labelLocation: "top",
                                                        colCount: 1,
                                                        items: [{
                                                            itemType: "group",
                                                            //caption: "Refference",
                                                            colCount: 4,
                                                            cssClass: "colorBGlightgrey",
                                                            items: [
                                                                {
                                                                    dataField: "PayToName",
                                                                    label: { text: "Pay To" },
                                                                    editorOptions: { value: iData.PayToName + " (" + iData.PayToCode + ")", width: 200, readOnly: true },
                                                                },
                                                            ]
                                                        },
                                                        ]
                                                    }).dxForm("instance");

                                                    $("#detail-dxDataGrid").dxDataGrid({
                                                        dataSource: new DevExpress.data.CustomStore({
                                                            key: "REFNO",
                                                            loadMode: "omit",
                                                            load: function () {
                                                                return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all', { "@": btoa(aaSchRef) }) // Change aaTBKey to TokenKey for this table 5102300001
                                                                    .fail(function () { throw "Data loading error" });
                                                            },
                                                        }),

                                                        allowColumnReordering: true,
                                                        allowColumnResizing: false,
                                                        columnMinWidth: 20,
                                                        columnChooser: {
                                                            enabled: false //false // true
                                                        },
                                                        showBorders: true,
                                                        showColumnLines: true,
                                                        showRowLines: true,
                                                        /*onRowPrepared: function (e) {
                                                            e.rowElement.css({ height: 60 });
                                                        },*/
                                                        wordWrapEnabled: true,
                                                        columns: [
                                                            {
                                                                dataField: "ID",
                                                                sortOrder: "asc",
                                                                dataType: "string",
                                                                //headerCellTemplate: $('<b style="color: white">NO</b>'),
                                                                caption: " ",
                                                                width: 40
                                                            },
                                                            {
                                                                dataField: "ERORefNo4",
                                                                caption: "Bill No",
                                                                dataType: "string",
                                                                width: 80,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "ERODate01",
                                                                caption: "Bill Date",
                                                                dataType: "date",
                                                                format: "dd/MM/yyyy",
                                                                width: 100,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "ERODesc02",
                                                                caption: "Description",
                                                                dataType: "string",
                                                                editorType: "dxTextBox",
                                                                width: 190,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "ERORefNo1", //ERODesc03
                                                                caption: "Purpose",
                                                                dataType: "string",
                                                                width: 150,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "ERODesc04",
                                                                caption: "Company/Personal Name",
                                                                dataType: "string",
                                                                width: 130,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "ERORefNo3",
                                                                caption: "Type of Reimbursement..",
                                                                dataType: "string",
                                                                width: 120,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "ExpensesCode",
                                                                caption: "Account Code",
                                                                dataType: "string",
                                                                width: 100,
                                                                visible: false,
                                                            },
                                                            {
                                                                dataField: "Amount",
                                                                caption: "Original currency",
                                                                dataType: "number",
                                                                format: { type: "fixedPoint", precision: 2 },
                                                                editorType: "dxNumberBox",
                                                                width: 100,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "Currency",
                                                                caption: "Currency", //aCurrenciesList
                                                                dataType: "string",
                                                                width: 60,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "Xrate",
                                                                caption: "X-Rate",
                                                                dataType: "number",
                                                                editorOptions: { format: "#,##0.00", width: 60 },
                                                                format: "#,##0.00",
                                                                width: 60,
                                                                visible: true,
                                                            },

                                                            {
                                                                dataField: "RefundedAmount",
                                                                caption: "Estimated Cost",
                                                                dataType: "number",
                                                                format: { type: "fixedPoint", precision: 2 },
                                                                editorOptions: { format: "#,##0.00", width: 100, },
                                                                width: 100,
                                                            },

                                                        ],
                                                        // summary
                                                        summary: {//ReqDate
                                                            recalculateWhileEditing: true,
                                                            skipEmptyValues: false,
                                                            totalItems: [
                                                                {
                                                                    column: "ERORefNo4",
                                                                    summaryType: "count",
                                                                    displayFormat: "TOTAL",
                                                                },
                                                                {
                                                                    column: "RefundedAmount",
                                                                    summaryType: "sum",
                                                                    valueFormat: "#,##0.00", //"currency",
                                                                    //          showInGroupFooter: false,
                                                                    //          alignByColumn: true            
                                                                    displayFormat: "{0}",
                                                                },
                                                            ],

                                                        },

                                                    }).dxDataGrid("instance");

                                                    $("#ACCChart-dxDataGrid").dxDataGrid({

                                                        dataSource: new DevExpress.data.CustomStore({
                                                            key: "HeadRefNo",
                                                            loadMode: "omit",
                                                            load: function () {
                                                                return $.post(aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "891F052B-E489-41E3-A254-A038B66C0444" + '/all', { "@": btoa(aaSchRef) }) // Change aaTBKey to TokenKey for this table 5102300001
                                                                    .fail(function () { throw "Data loading error" });
                                                            },
                                                        }),

                                                        allowColumnReordering: true,
                                                        allowColumnResizing: false,
                                                        columnMinWidth: 20,
                                                        columnChooser: {
                                                            enabled: false //false // true
                                                        },
                                                        //HeadRefNo,DR,ExpensesCode,EAccDesc,DRAMT,CR,CRCODE,CRName,CRAMT
                                                        showBorders: true,
                                                        showColumnLines: true,
                                                        showRowLines: true,
                                                        columns: [
                                                            {
                                                                dataField: "DC",
                                                                caption: " ",
                                                                editorOptions: { width: 70 },
                                                                width: 70
                                                            },
                                                            {
                                                                dataField: "ExpensesCode",
                                                                caption: "CODE",
                                                                editorOptions: { width: 100 },
                                                                width: 100,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "EAccDesc",
                                                                caption: "Account Name",
                                                                editorType: "dxTextBox",
                                                                width: 200,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "Division",
                                                                caption: "Division",
                                                                editorType: "dxTextBox",
                                                                width: 80,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "DRAMT",
                                                                caption: "Debit Amount",
                                                                dataType: "number",
                                                                format: { type: "fixedPoint", precision: 2 },
                                                                //format: "#,##0.00",
                                                                width: 120,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "CRAMT",
                                                                caption: "Credit Amount",
                                                                dataType: "number",
                                                                format: { type: "fixedPoint", precision: 2 },
                                                                width: 120,
                                                                visible: true,
                                                            },


                                                        ],
                                                        // summary
                                                        summary: {
                                                            recalculateWhileEditing: true,
                                                            skipEmptyValues: false,
                                                            totalItems: [
                                                                {
                                                                    column: "Division",
                                                                    //summaryType: "count",
                                                                    displayFormat: "BALANCE",
                                                                },
                                                                {
                                                                    column: "DRAMT",
                                                                    summaryType: "sum",
                                                                    valueFormat: "#,##0.00",
                                                                    displayFormat: "{0}",
                                                                },

                                                                {
                                                                    column: "CRAMT",
                                                                    summaryType: "sum",
                                                                    valueFormat: "#,##0.00",
                                                                    displayFormat: "{0}",
                                                                },
                                                            ],

                                                        },

                                                    }).dxDataGrid("instance");
                                                });
                                            }

                                            // popup Add New and Edit  
                                            const aPopUpAddForm = (aRecNo, iData, idDate, iView) => {
                                                var aaPFDMI = isLocalHost();
                                                var astr = localStorage["aDXTheme"]
                                                var aViewF = (iView === undefined) ? false : iView;
                                                var aViewG = (iView === undefined) ? true : !iView;
                                                console.log(iView)
                                                console.log("aRecNo = ", aRecNo)
                                                console.log("iData = ", iData)
                                                if (aRecNo === 1) {
                                                    var aaaTitle = " [ADD]"
                                                    let aaID = 1
                                                    let axRunRun = aGetDateRef(aaRunPre); // aaOnInitExpGroupDesc.substring(0, 1)
                                                    let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                    var aaiHeadRef = axRunRun;
                                                    var asERStatus = "Register";
                                                    var asERODesc02 = ""; //Destination	ERODesc02
                                                    var asERODesc03 = ""; //Purpose of Trip
                                                    var asERORefNo1 = ""; // Purpose of Trip List
                                                    var asEROCheck01 = false; //Overseas
                                                    var asEROCheck02 = false; //Need Roaming                                        
                                                    var asERODate02 = new Date() //Travel Start Date	
                                                    var asERODate03 = new Date() //Travel End Date	
                                                    var asRefundedAmount = 0; //Estimated Cost	
                                                    var asVendor01 = ""; //Departure Flight	
                                                    var asERODesc04 = ""; //Arrival Flight	
                                                    var asEROAmount1 = 0; //Ticket Price	EROAmount1
                                                    var asERODesc05 = ""; //Hotel	ERODesc05
                                                    var asNote = ""; //Remark	Note                                                
                                                    /*
                                                        ,ERODesc02: asERODesc02, ERODesc03: asERODesc03, ERODesc04: asERODesc04, ERODesc05: asERODesc05, ERODate02: asERODate02, ERODate03: asERODate03,  Vendor01: asVendor01, Note: asNote, EROAmount1: asEROAmount1
                                                    */

                                                    var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), ERODate01: idDate, ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment, Division: asDivision, ERODesc06: asStaffEmail, ReqDate: aNowDte, ExpensesCode: "", ExpensesDescription: aaOnInitAccDesc, Currency: "THB", Xrate: 1, ExpGroupCode: aaOnInitExpGroupCode, ExpGroupDescEng: aaOnInitExpGroupDesc, ERStatus: asERStatus, ERORefNo1: asERORefNo1, ERORefNo2: "", ERORefNo3: "", EROCheck01: 0, EROCheck02: 0, NeedPayment: 0, RefundedAmount: asRefundedAmount, LimitedAmount: 0, ERODesc02: asERODesc02, ERODesc03: asERODesc03, ERODesc04: asERODesc04, ERODesc05: asERODesc05, ERODate02: new Date(), ERODate03: new Date(), ERODate05: new Date(), ERODate06: new Date(), Vendor01: asVendor01, Note: asNote, EROAmount1: asEROAmount1 }
                                                    var ObjRowData = JSON.stringify(ObjKeyData);
                                                    console.log("ObjRowData = ", ObjRowData)
                                                    sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                    iData = ObjKeyData;
                                                    console.log("iData = ", iData)
                                                    insideAddNew = true;
                                                } else {
                                                    var aaiHeadRef = aRecNo;
                                                    var aaaTitle = (iView === undefined) ? " [EDIT]" : " {VIEW}"; //" [EDIT]"
                                                    insideAddNew = false;
                                                    asERStatus = iData.ERStatus;
                                                    asERODesc02 = iData.ERODesc02; //Destination	ERODesc02
                                                    asERODesc03 = iData.ERDesc03; //Purpose of Trip
                                                    asERORefNo1 = iData.ERORefNo1; //Purpose of Trip List
                                                    asEROCheck01 = iData.EROCheck01; //Overseas
                                                    asEROCheck02 = iData.EROCheck02; //Need Roaming                                        
                                                    asERODate02 = iData.ERODate02 //Travel Start Date	
                                                    asERODate03 = iData.ERODate03 //Travel End Date	
                                                    asRefundedAmount = iData.RefundedAmount; //Estimated Cost	
                                                    asVendor01 = iData.Vendor01; //Departure Flight	
                                                    asERODesc04 = iData.ERODesc04; //Arrival Flight	
                                                    asEROAmount1 = iData.EROAmount1; //Ticket Price	EROAmount1
                                                    asERODesc05 = iData.ERODesc05; //Hotel	ERODesc05
                                                    asNote = iData.Note; //Remark	Note  
                                                    //console.log("asERODesc02 = ", asERODesc02)
                                                }
                                                var aaSchRefx = "HeadRefNo LIKE '%" + aaiHeadRef + "%'" // (DataGrid View Only This New Item)
                                                aqrFull = aaSchRefx;
                                                var aaxurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all'
                                                var aaxSettings = { "url": aaxurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aqrFull) }), };

                                                $(() => {
                                                    var aaLastLineNo = 1;
                                                    var gbxRateV = 1;

                                                    const popup = $("#popupContainerAdd").dxPopup({
                                                        title: "Travel Requisition Form" + aaaTitle,
                                                        width: '1300px',
                                                        position: { offset: "0 -140" }, //{offset: "0 -180"},
                                                        //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                                        //contentTemplate: function(contentElement) {
                                                        //    contentElement.css("background-color", "#f5f5f5");
                                                        //},
                                                        visible: true,
                                                        fullScreen: true,
                                                        showCloseButton: false,
                                                        showTitle: true,
                                                        dragEnabled: true,
                                                        closeOnOutsideClick: false,
                                                        resizeEnabled: true,
                                                        onInitialized: function (e) { e.component.registerKeyHandler("escape", function (arg) { }) }, // ignore when press 'ESC'  

                                                        contentTemplate: function () {
                                                            return $("<div />").append(
                                                                $("<p><div id='Add-form'></div></p>"),
                                                                $("<span style='padding: 0px 8px;'></span>").text(" "),
                                                                $("<span id='Add-Upload'></span>"),
                                                                $("<span style='padding: 0px 5px;'></span>").text(" "),
                                                                $("<span id='Add-ViewFile'></span>"),
                                                                $("<p><div id='Add-dxDataGrid'></div></p>"),
                                                                $("<span id='Add-popupexit'></span>"),
                                                                $("<span style='padding: 5px 15px;'></span>").text(" "),
                                                                //$("<span id='popupAccordion'></span>"),
                                                                $("<span id='aConfirm'></span>"),

                                                            );
                                                        },
                                                        onContentReady: function () {
                                                            // $("#Add-dxDataGrid").hide(); // hide dataGrid
                                                            //aform.validate();
                                                        },
                                                        toolbarItems: [
                                                            {
                                                                toolbar: "top",
                                                                locateInMenu: 'always',
                                                                //html: "<div padding-top: -7px;><img src='./images/locktonlogo70mmblack.png' width='85'></div>" // Logo
                                                            },

                                                            {
                                                                toolbar: "top", // exit (x)
                                                                locateInMenu: 'always',
                                                                widget: "dxButton",
                                                                //toolbar: "bottom",
                                                                location: "after",
                                                                visible: false,
                                                                options: {
                                                                    //text: "EXIT",
                                                                    icon: "fas fa-times",
                                                                    stylingMode: "outlined",
                                                                    type: "danger",
                                                                    onClick: function (e) {
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        alert(iData.ERODesc03) //ReqDate ERODesc03
                                                                        if (aRecNo === 1) {
                                                                            //let result = DevExpress.ui.dialog.confirm("<i>" + "Press 'YES' To SAVE " + "</i>", "SAVE BEFORE EXIT ?");
                                                                            let result = DevExpress.ui.dialog.confirm("<center><i class='fas fa-save custom-icon-size'></i>" + " Press 'YES' To SAVE </center>", "SAVE BEFORE EXIT ?");
                                                                            result.done(function (dresult) {
                                                                                if (dresult) {
                                                                                    // not delete
                                                                                    // save first row
                                                                                    alert("Save First Row")
                                                                                } else {
                                                                                    // delete data
                                                                                    let aSQLCommand = "use ExtraOnLine; DELETE FROM TRVREQF WHERE HeadRefNo = '" + aaiHeadRef + "'"
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                }
                                                                            });
                                                                        }
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        popup.hide()
                                                                    }
                                                                }
                                                            }]

                                                    }).dxPopup("instance"); // popupContainerAdd

                                                    $("#Add-Upload").dxButton({
                                                        icon: "fas fa-upload",
                                                        type: "success",
                                                        hint: "Add Attach File",
                                                        //visible: true,
                                                        visible: aViewG, //true,
                                                        onClick: function (e) {
                                                            aPopUpUpLoad(iData.HeadRefNo)
                                                            //popup.hide()
                                                        }
                                                    });

                                                    $("#Add-ViewFile").dxButton({
                                                        icon: "fas fa-file",
                                                        type: "default",
                                                        hint: "View Attach File",
                                                        visible: true,
                                                        onClick: async function (e) {
                                                            var aUriV = `${aaPFDMI}/temp/uploads/${iData.HeadRefNo}.pdf`
                                                            const cacheBusterUrl = aUriV + "?t=" + new Date().getTime();
                                                            const fileAvailable = await isFileAvailable(aUriV);
                                                            //alert(fileAvailable ? "Found" : "Not found")
                                                            if (fileAvailable || aaCheckON) {
                                                                aPopupPDF(cacheBusterUrl) //showPdf(aUriV) //'https://cbsdev2.locktonwattana.com/temp/uploads/R2411145070-001.pdf'
                                                            } else {
                                                                aMessageAlert("<b>The requested file is not available on the server.", "red");
                                                            }

                                                        }

                                                    });
                                                    // popup upload

                                                    $("#Add-popupexit").dxButton({
                                                        icon: "fas fa-times",
                                                        type: "danger",
                                                        text: "EXIT",
                                                        visible: true,
                                                        onClick: function (e) {
                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                            //alert(iData.ERODesc03)
                                                            //alert(iData.ERODesc02)
                                                            //console.log("---Click Exit---")
                                                            //console.log("iData = ",iData)
                                                            //console.log("iData.ERODesc02 = ", iData.ERODesc02)
                                                            //console.log("iData.ERODesc03 = ", iData.ERODesc03)
                                                            //console.log("iData.EROCheck01 = ", iData.EROCheck01)
                                                            //console.log("iData.EROCheck02 = ", iData.EROCheck02)
                                                            //console.log("iData.EROCode04 =  ",iData.EROCode04)
                                                            //console.log("asERODesc03 = ", asERODesc03)
                                                            //console.log("asERODesc02 = ", asERODesc02)

                                                            if (aRecNo === 1) {
                                                                let result = DevExpress.ui.dialog.confirm("<center><i class='fas fa-save custom-icon-size'></i>" + " Press 'YES' To SAVE </center>", "SAVE BEFORE EXIT ?"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                                result.done(function (dresult) {
                                                                    if (dresult) {
                                                                        /* old 
                                                                        // not delete 
                                                                        let aObjRowData = JSON.stringify(iData);
                                                                        console.log("aObjRowData = ", aObjRowData)
                                                                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX)); //EROCode04
                                                                        */
                                                                        console.log("==YES---")
                                                                        let aObjRowData = JSON.stringify(iData); //EROCode04
                                                                        console.log("JSON.stringify(iData) = ", aObjRowData)
                                                                        sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                                            .then(response => {
                                                                                console.log("First Update: ", response);
                                                                                if (response.success) {
                                                                                    // Assuming you have a data source variable
                                                                                    let dataSource = $("#gridContainer").dxDataGrid("instance").getDataSource();
                                                                                    dataSource.reload().done(() => {
                                                                                        console.log("Data source reloaded");
                                                                                    });
                                                                                } else {
                                                                                    console.error("Update failed: ", response.error);
                                                                                }
                                                                            })
                                                                            .catch(error => {
                                                                                console.error("Request error: ", error);
                                                                            });
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                    } else {
                                                                        // delete data
                                                                        let aSQLCommand = "use ExtraOnLine; DELETE FROM TRVREQF WHERE HeadRefNo = '" + aaiHeadRef + "'"
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        aSQLAction(aaPFDMI, aSQLCommand)
                                                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                                                    }
                                                                });
                                                            } else {
                                                                // edit mode
                                                                let aObjRowData = JSON.stringify(iData); //EROCode04
                                                                console.log("Edit Mode = ", aObjRowData)
                                                                sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                                    .then(response => {
                                                                        console.log("Update response: ", response);
                                                                        if (response.success) {
                                                                            // Assuming you have a data source variable
                                                                            let dataSource = $("#gridContainer").dxDataGrid("instance").getDataSource();
                                                                            dataSource.reload().done(() => {
                                                                                console.log("Data source reloaded");
                                                                            });
                                                                        } else {
                                                                            //console.error("Update failed: ", response.error);
                                                                        }
                                                                    })
                                                                    .catch(error => {
                                                                        console.error("Request error: ", error);
                                                                    });
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                            }
                                                            $("#gridContainer").dxDataGrid("instance").refresh();
                                                            // clear variables
                                                            //asERStatus = iData.ERStatus;
                                                            asERODesc02 = ""; //Destination	ERODesc02
                                                            asERODesc03 = ""; //Purpose of Trip
                                                            asERORefNo1 = ""; //Purpose of Trip List
                                                            asEROCheck01 = false; //Overseas
                                                            asEROCheck02 = false; //Need Roaming                                        
                                                            asERODate02 = new Date() //Travel Start Date	
                                                            asERODate03 = new Date() //Travel End Date	
                                                            asRefundedAmount = 0; //Estimated Cost	
                                                            asVendor01 = ""; //Departure Flight	
                                                            asERODesc04 = ""; //Arrival Flight	
                                                            asEROAmount1 = 0; //Ticket Price	EROAmount1
                                                            asERODesc05 = ""; //Hotel	ERODesc05
                                                            asNote = ""; //Remark	Note

                                                            popup.hide()
                                                        }
                                                    });

                                                    $("#aConfirm").dxButton({
                                                        hint: "Confirm and send to HOD",
                                                        icon: "fas fa-check-circle",
                                                        type: "success",
                                                        text: "CONFIRM",
                                                        //width: "120px",
                                                        visible: aViewG, //true,
                                                        onClick: function (e) {
                                                            //var aadataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                            //var validationResult = aadataGrid.validate();
                                                            //console.log("validationResult ", validationResult)

                                                            // validation
                                                            const validationResult = aform.validate();
                                                            if (validationResult.isValid) {
                                                                console.log("Form is valid. Proceed with submission.");
                                                                // Proceed with your submission logic here
                                                            } else {
                                                                console.log("Form is invalid. Please correct the errors.");
                                                                // Optionally, you can show the error messages or highlight invalid fields
                                                            }
                                                            console.log("validationResult: ", validationResult)
                                                            // check dataGrid
                                                            const rows = aAddStaff.getDataSource().items(); // Get all rows in the data grid aAddStaff
                                                            let allValid = true;
                                                            console.log("aAddStaff rows = ", rows)
                                                            //alert("pass")
                                                            rows.forEach(row => {
                                                                // Make sure that 'id' is the keyExpr you specified in the DataGrid
                                                                const rowIndex = aAddStaff.getRowIndexByKey(row.ID); // This should now work, as the keyExpr is set

                                                                // Validate the row using the row index
                                                                if (rowIndex !== -1) {  // Ensure the row index is valid
                                                                    const rowValidationResult = aAddStaff.validateRow(rowIndex);

                                                                    if (!rowValidationResult.isValid) {
                                                                        allValid = false;
                                                                        console.log(`Row ${rowIndex} is invalid. Errors:`, rowValidationResult.brokenRules);
                                                                        // Optionally, handle the error (highlight invalid row, show message)
                                                                    }
                                                                } else {
                                                                    console.log(`Row with id ${row.id} not found in the grid.`);
                                                                }
                                                            });

                                                            if (allValid) {
                                                                console.log("All rows are valid. Proceed with submission.");
                                                                // Proceed with your submission logic here
                                                            } else {
                                                                console.log("Some rows are invalid. Please correct the errors.");
                                                            }
                                                            // validation

                                                            var result = $("#Add-form").dxForm("instance").validate(); //Add-dxDataGrid
                                                            if (!result.isValid) { DevExpress.ui.dialog.alert("Required Fields not valid, please check", "VALIDATION ERROR") } else {
                                                                aaHODApprover = aaaHODApprover
                                                                let aObjRowData = JSON.stringify(iData); //EROCode04
                                                                console.log("Update when Confirm ", aObjRowData)
                                                                sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                                sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                                sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
                                                                    .then(response => {
                                                                        console.log("Update response: ", response);
                                                                        if (response.success) {
                                                                            // Assuming you have a data source variable
                                                                            let dataSource = $("#gridContainer").dxDataGrid("instance").getDataSource();
                                                                            dataSource.reload().done(() => {
                                                                                console.log("Data source reloaded");
                                                                            });
                                                                        } else {
                                                                            console.error("Update failed: ", response.error);
                                                                        }
                                                                    })
                                                                    .catch(error => {
                                                                        console.error("Request error: ", error);
                                                                    });
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                                // clear variables
                                                                //asERStatus = iData.ERStatus;
                                                                asERODesc02 = ""; //Destination	ERODesc02
                                                                asERODesc03 = ""; //Purpose of Trip
                                                                asERORefNo1 = ""; //Purpose of Trip List
                                                                asEROCheck01 = false; //Overseas
                                                                asEROCheck02 = false; //Need Roaming                                        
                                                                asERODate02 = new Date() //Travel Start Date	
                                                                asERODate03 = new Date() //Travel End Date	
                                                                asRefundedAmount = 0; //Estimated Cost	
                                                                asVendor01 = ""; //Departure Flight	
                                                                asERODesc04 = ""; //Arrival Flight	
                                                                asEROAmount1 = 0; //Ticket Price	EROAmount1
                                                                asERODesc05 = ""; //Hotel	ERODesc05
                                                                asNote = ""; //Remark	Note

                                                                //*/ check dxDataGrid field
                                                                const dataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");

                                                                // Utility function to get column by key
                                                                function getColumnByField(key) {
                                                                    const columns = dataGrid.option("columns");
                                                                    return columns.find(column => column.dataField === key);
                                                                }

                                                                // Get all rows from the grid
                                                                const rowsData = dataGrid.getVisibleRows().map(row => row.data);

                                                                // Validate each field in every row
                                                                const isValidRows = rowsData.every(row => {
                                                                    return Object.entries(row).every(([key, value]) => {
                                                                        // Get column configuration and caption
                                                                        const column = getColumnByField(key);
                                                                        const caption = column?.caption || key; // Use caption if available, fallback to key

                                                                        //ERODesc02: row[3]?.trim(), //Description
                                                                        //ERODesc03: row[4]?.trim(), //Purpose
                                                                        //var condition = item => item.Amount === 0 || item.ERODesc02 === "" || item.ERODesc03 === "" || item.ERODesc04 === "" || item.ERORefNo3 === "" || item.RefundedAmount === 0 || item.Xrate === 0 || (item.Xrate === 1 && item.Currency !== "THB") || (item.Xrate !== 1 && item.Currency === "THB");
                                                                        // Validation logic with key, value, and caption
                                                                        if (key === "Vendor02" && value === "") {
                                                                            DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                            return false;
                                                                        }
                                                                        // if (key === "PsPvDate" && value === "01/01/1901") { //(key === "EROCheck01" && value === true) && 
                                                                        //     DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                        //     return false;
                                                                        // }
                                                                        if (key === "EROCode03" && value === "") {
                                                                            DevExpress.ui.dialog.alert(`Field "${caption}" cannot be empty.`, "ERROR"); // (Key: ${key}, Value: ${value})
                                                                            return false;
                                                                        }


                                                                        // Example: Log key, value, and caption for debugging
                                                                        //console.log(`Key: ${key}, Value: ${value}, Caption: ${caption}`);

                                                                        return true; // Field is valid
                                                                    });
                                                                });

                                                                if (!isValidRows) {
                                                                    return; // Stop further processing if validation fails
                                                                }

                                                                //*/ **
                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                let aDivSxx = "Where REFNO = '" + aaiHeadRef + "-001'" //HeadRefNo Check RefundedAmount for the first record only
                                                                let aFieldSelectedxx = "HeadRefNo,RefundedAmount,EROCheck01" //ExtraOnLine].[dbo].[EXPREIM_400] TotalReimburse,
                                                                let aFullBodyxx = "Select " + aFieldSelectedxx + " From " + "ExtraOnLine.dbo.TRVREQF " + aDivSxx; //alert(aFullBody)  Estimated Amount                                         
                                                                //console.log(aFullBodyxx, aaHODApprover);
                                                                fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBodyxx) }), redirect: "follow" })
                                                                    .then(response => response.json())
                                                                    //
                                                                    .then(ppData => {
                                                                        var aaTotalValue = ppData;
                                                                        var aaTotalReim = aaTotalValue[0].RefundedAmount //TotalReimburse
                                                                        var aaCheckOverseas = aaTotalValue[0].EROCheck01 ? "TRFO" : "HOD";
                                                                        //console.log(aaCheckOverseas)
                                                                        //alert(aaTotalReim)
                                                                        //alert(aaHODApprover.length)
                                                                        // check if aaCheckOverseas = "TRFO"
                                                                        var aaChkA = aaHODApprover.filter(item => item.ApproverCode === "TRFO")
                                                                        if (aaCheckOverseas === 'TRFO') {
                                                                            if (aaChkA.length > 0) {
                                                                                aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "TRFO");
                                                                                // use only "TRFO" if overseas
                                                                            }  // if not found TRFO use TRF instead
                                                                        } else if (aaCheckOverseas === 'HOD') {
                                                                            if (aaChkA.length > 0) {
                                                                                aaHODApprover = aaHODApprover.filter(item => item.ApproverCode === "HOD");
                                                                                // use only "TRF"
                                                                            }
                                                                        }
                                                                        console.log("aaHODApprover ", aaHODApprover)
                                                                        //console.log(aaHODApprover)                                                                
                                                                        var aaiFoundApp = false;
                                                                        var nnLno = 0;
                                                                        var nnAdno = 0;
                                                                        var aaHODEmail4Chk = ""; //aaHODAppName
                                                                        var aaHODName4Chk = "";
                                                                        var aaHODRange4Chk = "";
                                                                        for (let i = 0; i < aaHODApprover.length; i++) {
                                                                            if ($.trim(aaHODApprover[i].ApproverName) === $.trim(asFullName)) {
                                                                                nnAdno = i
                                                                                aaiFoundApp = true;
                                                                                //console.log(nnAdno)
                                                                                //console.log(aaHODApprover[nnAdno].ApproverName)                                                    
                                                                                break;
                                                                            }
                                                                        }
                                                                        //console.log("asFullName ", asFullName)
                                                                        //console.log(aaHODApprover[0].ApproverName)
                                                                        //console.log(nnAdno)
                                                                        if (aaiFoundApp === true && aaHODApprover.length > 1) {
                                                                            nnAdno = nnAdno + 1
                                                                        }

                                                                        for (let i = nnAdno; i < aaHODApprover.length; i++) {
                                                                            if (aaTotalReim <= aaHODApprover[i].LRange02) {
                                                                                aaHODEmail4Chk = aaHODEmail4Chk + "|" + aaHODApprover[i].ApproverEmail + "|"
                                                                                aaHODName4Chk = aaHODName4Chk + "|" + aaHODApprover[i].ApproverName + "|"
                                                                                aaHODRange4Chk = aaHODRange4Chk + aaHODApprover[i].LRange02
                                                                                nnLno = i
                                                                                break;
                                                                            } else {
                                                                                aaHODEmail4Chk = aaHODEmail4Chk + "|" + aaHODApprover[i].ApproverEmail + "|" + ","
                                                                                aaHODName4Chk = aaHODName4Chk + "|" + aaHODApprover[i].ApproverName + "|" + ","
                                                                                aaHODRange4Chk = aaHODRange4Chk + aaHODApprover[i].LRange02 + ","
                                                                            }
                                                                        }
                                                                        var aaHODAll4Chk = "NAME:[" + aaHODName4Chk + "] MAIL:[" + aaHODEmail4Chk + "] RANG:[" + aaHODRange4Chk + "]";
                                                                        var xxChkEmailxx = aTranTextJson(aaHODAll4Chk, "MAIL:", "RANG:")
                                                                        var xxChkNamexx = aTranTextJson(aaHODAll4Chk, "NAME:", "MAIL:")
                                                                        var xxChkRangexx = aTranTextJson(aaHODAll4Chk, "RANG:", "")
                                                                        var xxChkLenxx = xxChkNamexx.length;
                                                                        console.log(aaHODAll4Chk)
                                                                        console.log(xxChkNamexx, xxChkEmailxx, xxChkRangexx)

                                                                        // send mail to first Approver 
                                                                        aaHODAppName = xxChkNamexx[0] //aaHODApprover[0].ApproverName; //aaHODApprover[nnLno].ApproverName;
                                                                        aaHODAppEmail = xxChkEmailxx[0] //aaHODApprover[0].ApproverEmail; //aaHODApprover[nnLno].ApproverEmail;

                                                                        console.log("HOD App Email = ", aaHODAppEmail)
                                                                        console.log("Overseas = ", aaCheckOverseas)
                                                                        // Check empty fields
                                                                        var aDatabasea = "ExtraOnLine.dbo.TRVREQF";
                                                                        var aKeyField = "HeadRefNo" //"HeadRefNo"; "REFNO"
                                                                        var aKeyIDa = aaiHeadRef //  T2408177541 "T2408152724" +"-001" 
                                                                        var axFieldSelected = "REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,Vendor01,Vendor02,Vendor01Amount,Vendor02Amount,Vendor01Diff,Vendor02Diff,Vendor01Note,Vendor02Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6,HODApproved,ExpGroupCode,ExpGroupDescEng,AmountBeforeVAT,VAT,ConfirmedDate,HODApprovedDate,FAApprovedDate,TotalLocalAmount,TotalAmount,TotalIems,TotalAmountBeforeVAT,TotalVAT,NeedPayment,RefundedAmount,HRApprovedDate";

                                                                        if (aaCheckOverseas === 'TRFO') {
                                                                            var aaCondition = item =>
                                                                                (item.ID === 1 && (item.ERODesc02 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROCode03 === "" || item.Vendor02 === "" || (item.PSPvDate && new Date(item.PSPvDate).getTime() === new Date('01/01/1901').getTime())))
                                                                                ||
                                                                                (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === "" || (item.PSPvDate && new Date(item.PSPvDate).getTime() === new Date('01/01/1901').getTime())))
                                                                        } else {
                                                                            var aaCondition = item =>
                                                                                (item.ID === 1 && (item.ERODesc02 === "" || item.ERORefNo1 === "" || item.RefundedAmount === 0 || item.EROCode03 === "" || item.Vendor02 === ""))
                                                                                ||
                                                                                (item.ID > 1 && (item.EROCode03 === "" || item.Vendor02 === ""))
                                                                        }

                                                                        var condition = aaCondition
                                                                        aaLoadData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected, condition)
                                                                            .then(atestCehcka => {
                                                                                //console.log("aTestChehcka = ", atestCehcka); // Logs the actual message
                                                                                // { DevExpress.ui.dialog.alert(aTRFnAlert01, "INPUT ERROR"); }
                                                                                if (atestCehcka === 1) { DevExpress.ui.dialog.alert(aVARs.ALERT01, "INPUT ERROR"); }
                                                                                else {
                                                                                    //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm (" + aaCheckOverseas + ") & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' ></b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ֡��ั��ทึ��" +
                                                                                    let getvalues = { aaCheckOverseas: aaCheckOverseas, aaHODAppName: aaHODAppName, aaHODAppEmail: aaHODAppEmail, xxChkLenxx: xxChkLenxx }
                                                                                    //console.log("getvalues ", getvalues)
                                                                                    let aTrfAlert02 = aVARs.ALERT02.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                                    let result = DevExpress.ui.dialog.confirm(aTrfAlert02, "CONFIRM TO HOD");
                                                                                    //let result = DevExpress.ui.dialog.confirm("<p style='color: darkblue; font-size: 18px;' ><i class='fas fa-info-circle custom-icon-size'></i> " + " Press [YES] to confirm (" + aaCheckOverseas + ") and send email to " + aaHODAppName + " (" + aaHODAppEmail + ") <br></b></p><p style='color: darkgreen; font-size: 14px;'>(" + (xxChkLenxx) + " HOD to approve)</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                                                    //let result = DevExpress.ui.dialog.confirm("Are you sure you want to confirm & send mail to " + aaHODAppName + " (" + aaHODAppEmail + ") ? <br><p style='color:Red; font-size: 12px;' > ��ละ ��รุณาตรว��สอ����าร��ั��ทึ��ราย��าร��ห����ร��ทุ������อ������ทุ����รรทัด** <br><b><u>��ม��เ��������ั����</u> ��ะทำ��ห��ราย��าร��ี��เ��ิ������าย��ม����ด�� </b></p><p style='color: grey; font-size: 10px;'>(" + (xxChkLenxx) + ")</p>", "CONFIRM TO HOD"); // "<br>��ด 'YES' เ��ื��อ��ั��ทึ��" +
                                                                                    result.done(function (dresult) {//                                                                                                                                                                                                                    
                                                                                        if (dresult) {
                                                                                            //if (aContinueChk !== true) {
                                                                                            let aFREF = aaiHeadRef + "-001"
                                                                                            //console.log(aaiHeadRef)
                                                                                            //console.log(aFREF)
                                                                                            let aERStatus = "Confirmed wait for HOD" //"Register"
                                                                                            let aTrueORFalse = '1'
                                                                                            let aTrueORFalseB = true
                                                                                            let aNowDateT = aaNowText(aNowDte)
                                                                                            //let aTrueORFalse = (e.row.data.Confirmed === true ? '0' : '1');
                                                                                            //let aTrueORFalseB = (e.row.data.Confirmed === true ? false : true);
                                                                                            var aObjKeyData = { REFNO: aFREF, Confirmed: aTrueORFalseB, ERStatus: aERStatus, ReqDate: aNowDte };
                                                                                            var aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
                                                                                            //sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));  // Update the ID = 1 of REFNO
                                                                                            //use ExtraOnLine; UPDATE EXPREIM  SET Confirmed = 1 Where HeadRefNo = 'M2108063704' ERORefNo6
                                                                                            let aSQLCommand = "use ExtraOnLine; UPDATE TRVREQF  SET Confirmed = " + aTrueORFalse + ", Vendor01Note = '" + aaHODAll4Chk + "', Vendor02Note = '" + aaHODAppName + "', ERORefNo6 = '" + aaHODAppEmail + "', ERStatus = '" + aERStatus + "', ReqDate = '" + aNowDateT + "' Where HeadRefNo = '" + aaiHeadRef + "'"
                                                                                            aSQLAction(aaPFDMI, aSQLCommand) // Update Confirmed for all HeadReNo
                                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                                            aSQLAction(aaPFDMI, aSQLCommand)
                                                                                            $("#gridContainer").dxDataGrid("instance").refresh();

                                                                                            //send Email
                                                                                            var aaMailTitle = aaOnInitExpGroupDesc.toUpperCase() + " TRAVEL REQUISITION ";
                                                                                            let aApproverName = aaHODAppName //+ ", [HOD]"     //aaHRAppName //"Wikran" + " [HOD]"         // HOD Approver Name
                                                                                            let aApproverEmail = $.trim(aaHODAppEmail)      // aaHRAppEmail //"wikran@asia.lockton.com" // HR Approver
                                                                                            let aRequesterName = asFullName //e.data.PayToName //"Wikran Intaraprajaks"
                                                                                            let aRequesterEmail = asStaffEmail //e.data.ERODesc06 //"wikran@asia.lockton.com"
                                                                                            //let aSubject = aaOnInitExpGroupDesc + " Expewnses Reimbursement Requested"
                                                                                            var aSubject = aaMailTitle
                                                                                            let aRefNoa = aaiHeadRef //iData.HeadRefNo
                                                                                            let aAddress2Do = `<a href='${aaPFDMI}/XOL/index.html'>${aaOnInitExpGroupDesc}</a>`;
                                                                                            let getvalues = { aApproverName: aApproverName, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName }
                                                                                            let aMessage01 = aArrays.ACONFIRM[0].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                                                                                            //let aMessage01 = aEmailTRF[0] + $.trim(aApproverName) + aEmailTRF[1] + aaOnInitExpGroupDesc + aEmailTRF[2] + aRefNoa + aEmailTRF[3] + aAddress2Do + aEmailTRF[12] + aRequesterName + aEmailTRF[5];
                                                                                            //let aMessage01 = "<div>เรีย�� ��ุณ" + $.trim(aApproverName) + ",<br>&nbsp;&nbsp;&nbsp;&nbsp;��รุณาตรว��สอ�� ��ละอ��ุมัติราย��าร " + aaOnInitExpGroupDesc + " Expenses สำหรั�� REFNO = [" + aRefNoa + "]<br> สามารถเ����า����������ร����รม��ด��ที�� " + aAddress2Do + " (หัว����อ Approve --> HOD Approve) <br><br>��อ��สด����วาม��ั��ถือ<br>" + aRequesterName + "</div>"
                                                                                            var aMessage = "<!DOCTYPE html><html><head><style>table { border-collapse: collapse; width: 50%;} th {border: 1px; border-radius: 8px 8px 0px 0px; text-align: left; padding: 8px;}tr:nth-child(even) {background-color: #ffe6ff}th {background-color: #027DFC; color: white;}</style></head><body><div style='background-color: #F8F8F8'><br><br><center><table><tr><th style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 22px;'><center>" + aaMailTitle + "</center></th></tr><tr><td style='font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 13px; background-color:#EAF4FF;'><div style='margin: 5px 2px 10px 10px;'>" + aMessage01 + "</div></td></tr></table></center><br><br><br></div></body></html>"
                                                                                            aSendMailDMZ(" " + aApproverName, aApproverEmail, aRequesterEmail, "", "", aSubject, aMessage)

                                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                            $("#gridContainer").dxDataGrid("instance").refresh();  // Refresh GridData
                                                                                            $("#gridContainer").dxDataGrid("instance").refresh();

                                                                                            //aMessageAlert("Already Confirmed & send mail to Approver " + aApproverName + " (" + aApproverEmail + ")", "DarkGreen")
                                                                                            aMessageAlert("Already Confirmed <br> EMAIL <br>" + aMessage, "DarkGreen")
                                                                                            popup.hide();
                                                                                        }
                                                                                    });
                                                                                    //1
                                                                                } //aaLoadData
                                                                            }); // then check                                                                 
                                                                    });
                                                            }
                                                        } // validationrule
                                                    });

                                                    const aform = $("#Add-form").dxForm({
                                                        formData: iData, //aXXData[0], //iData,                                              
                                                        showColonAfterLabel: false,
                                                        labelLocation: "top",//"left", //"top",
                                                        readOnly: aViewF, //true e.row.data.Confirmed
                                                        //elementAttr: {
                                                        //    style: "background-color: #F5F5F5; color: black;"
                                                        //},
                                                        //validationGroup: "formValidationGroup", // Define a validation group here
                                                        items: [
                                                            {
                                                                itemType: "group",
                                                                colCount: 5,
                                                                items: [{
                                                                    dataField: "HeadRefNo",
                                                                    label: { text: "REF NO", cssClass: "custom-label" },
                                                                    editorType: "dxTextBox",
                                                                    editorOptions: { width: 150, readOnly: true }, //value: aaiHeadRef,
                                                                    cssClass: "verylight-blue",
                                                                    colSpan: 1,
                                                                },
                                                                {
                                                                    dataField: "PayToName",
                                                                    label: { text: "Requester." },
                                                                    editorType: "dxTextBox",
                                                                    editorOptions: { width: 150, readOnly: true }, //value: asFullName,
                                                                    cssClass: "verylight-blue",
                                                                    colSpan: 1,
                                                                },
                                                                {
                                                                    dataField: "Department",
                                                                    label: { text: "Department." },
                                                                    editorType: "dxTextBox",
                                                                    editorOptions: { width: 150, readOnly: true }, //value: asDepartment,value: asDepartment,
                                                                    cssClass: "verylight-blue",
                                                                    width: 150,
                                                                    colSpan: 1,
                                                                },
                                                                {
                                                                    dataField: "ReqDate",
                                                                    label: { text: "Requested Date" },
                                                                    editorType: "dxDateBox",
                                                                    editorOptions: { displayFormat: "dd/MM/yyyy", width: 150, readOnly: true },//showClearButton: true, value: idDate, 
                                                                    cssClass: "verylight-blue",
                                                                    colSpan: 1,
                                                                },

                                                                {
                                                                    dataField: "ERStatus",
                                                                    label: { text: "STATUS" },
                                                                    editorType: "dxTextBox",
                                                                    editorOptions: { Width: 300, readOnly: true },
                                                                    cssClass: "verylight-blue",
                                                                    colSpan: 1,
                                                                },
                                                                ]
                                                            },
                                                            {
                                                                itemType: "tabbed",
                                                                tabPanelOptions: { deferRendering: false },
                                                                tabs: [
                                                                    {
                                                                        title: "TRAVEL INFO",
                                                                        icon: "fas fa-info-circle",
                                                                        iconPosition: "start",
                                                                        colCount: 5,
                                                                        items: [
                                                                            {
                                                                                dataField: "ERORefNo1",
                                                                                label: { text: "Purpose of Trip." }, //,cssClass: "bold-label" }, 
                                                                                editorType: "dxSelectBox", //dxSelectBox dxLookup
                                                                                editorOptions: {
                                                                                    dataSource: aObjects.aaPurposeTable, //aaPurposeTable
                                                                                    searchExpr: "Purpose",
                                                                                    valueExpr: "Purpose",
                                                                                    displayExpr: "Purpose",
                                                                                    searchEnabled: true,
                                                                                    width: 180,
                                                                                    //value: aNewDiva,
                                                                                    onValueChanged: function (e) {
                                                                                        asERORefNo1 = e.value;
                                                                                    }
                                                                                    /*onValueChanged: function(args) {
                                                                                        
                                                                                        let newDivision = args.value;
                                                                                        let newDepartment = args.value.slice(0, 4) //calculateNewDepartment(newDivision);
                                                                                        let formInstance = $("#PopupChangeDiv").dxForm("instance");
                                                                                        asNewDept = args.value;
                                                                                        var asNewDiv = args.value.slice(0, 4);
                                                                                        gbNewDiv = args.value;
                                                                                        gbNewDept = args.value.slice(0, 4);
                                                                                        // Update NewDepartment in the form dynamically
                                                                                        formInstance.updateData("EROCode03", newDepartment);
                                                                                    },*/
                                                                                },
                                                                                cssClass: "verylight-blue",
                                                                                visible: true,
                                                                                colSpan: 2,
                                                                                validationRules: [{ type: "required", message: "Purpose of Trip is required" }]
                                                                            },

                                                                            {
                                                                                dataField: "ERODate02",
                                                                                label: { text: "Travel Start Date" },
                                                                                editorType: "dxDateBox",
                                                                                editorOptions: {
                                                                                    displayFormat: "dd/MM/yyyy",
                                                                                    width: 150,
                                                                                    onValueChanged: function (e) {
                                                                                        var formInstance = $("#Add-form").dxForm("instance");
                                                                                        formInstance.updateData("ERODate03", e.value);
                                                                                        formInstance.updateData("ERODate05", e.value);
                                                                                        asERODate02 = e.value;
                                                                                        iData.ERODate05 = e.value;
                                                                                        //var xdataGrid = $("#Add-dxDataGrid").dxDataGrid({}).dxDataGrid("instance");                                                                         
                                                                                        //var xdataSource = xdataGrid.getDataSource();
                                                                                        //xdataSource.reload();                                                                                    

                                                                                        aSaveMemToDB(iData, aaTBKey, aaPFDMI, aaXToX)
                                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                        //var formInstance2 = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                                                        //formInstance2.updateData("ERODate05", e.value);                                                                                    
                                                                                    },

                                                                                },	  //showClearButton: true,  //value: new Date(),   value: idDate,
                                                                                //setCellValue: function (newData, value, currentRowData) {
                                                                                //   newData.ERODate05 = value;
                                                                                //   newData.ERODate06 = value;
                                                                                //},
                                                                                showClearButton: true,
                                                                                colSpan: 1,
                                                                                validationRules: [{ type: "required", message: "Travel Start Date is required" }]
                                                                            },
                                                                            {
                                                                                dataField: "ERODate03",
                                                                                label: { text: "Travel End Date" },
                                                                                editorType: "dxDateBox",
                                                                                editorOptions: {
                                                                                    displayFormat: "dd/MM/yyyy", width: 150,
                                                                                    onValueChanged: function (e) {
                                                                                        var formInstance = $("#Add-form").dxForm("instance");
                                                                                        formInstance.updateData("ERODate06", e.value);
                                                                                        asERODate03 = e.value;
                                                                                        iData.ERODate06 = e.value;
                                                                                        aSaveMemToDB(iData, aaTBKey, aaPFDMI, aaXToX)
                                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    }
                                                                                },	  //showClearButton: true,  //value: new Date(), 
                                                                                showClearButton: true,
                                                                                colSpan: 1,
                                                                                validationRules: [{ type: "required", message: "Travel End Date is required" }]
                                                                            },
                                                                            /* {
                                                                                dataField: "aButtonField",
                                                                                label: { text: "File Attachment" },
                                                                                editorType: "dxTextBox",
                                                                                editorOptions: {
                                                                                    width: 60,
                                                                                    buttons: [
                                                                                        {
                                                                                            name: "actionButton",
                                                                                            location: "before", // Place the icon after the input
                                                                                            options: {
                                                                                                icon: "fas fa-upload", // DevExtreme predefined icon or custom icon
                                                                                                type: "success",
                                                                                                hint: "Upload Attach file",
                                                                                                onClick: function (e) {
                                                                                                    // Your function to execute
                                                                                                    //alert("Function is running!");
                                                                                                    aPopUpUpLoad(iData.HeadRefNo)
                                                                                                }
                                                                                            }
                                                                                        },
                                                                                        {
                                                                                            name: "actionButton2",
                                                                                            location: "before", // Place the icon after the input
                                                                                            readOnly: false,
                                                                                            options: {
                                                                                                icon: "fas fa-file", // DevExtreme predefined icon or custom icon
                                                                                                type: "default",
                                                                                                hint: "View Attach file",
                                                                                                onClick: async function (e) {
                                                                                                    var aUriV = `https://cbsdev2.locktonwattana.com/temp/uploads/${iData.HeadRefNo}.pdf`
                                                                                                    const cacheBusterUrl = aUriV + "?t=" + new Date().getTime();
                                                                                                    const fileAvailable = await isFileAvailable(aUriV);
                                                                                                    //alert(fileAvailable ? "Found" : "Not found")
                                                                                                    if (fileAvailable || aaCheckON) {
                                                                                                        aPopupPDF(cacheBusterUrl) //showPdf(aUriV) //'https://cbsdev2.locktonwattana.com/temp/uploads/R2411145070-001.pdf'
                                                                                                    } else {
                                                                                                        aMessageAlert("<b>The requested file is not available on the server.", "red");
                                                                                                    }
    
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }, */
                                                                            // {
                                                                            //     itemType: "Empty",
                                                                            //     colSpan: 1,
                                                                            // },
                                                                            {
                                                                                dataField: "ERODesc03",
                                                                                label: { text: "Purpose Of Trip Description" }, //,cssClass: "bold-label" }, Purpose of Trip
                                                                                editorType: "dxTextArea",
                                                                                editorOptions: {
                                                                                    width: 400,
                                                                                    height: 50,
                                                                                    onValueChanged: function (e) {
                                                                                        asERODesc03 = e.value;
                                                                                    }
                                                                                },
                                                                                cssClass: "verylight-blue",
                                                                                visible: true,
                                                                                colSpan: 5,
                                                                                //validationRules: [{ type: "required", message: "Purpose of Trip is required" }]
                                                                            },
                                                                            {
                                                                                dataField: "ERODesc02",
                                                                                label: { text: "Destination/Country" },
                                                                                editorType: "dxTextArea",
                                                                                editorOptions: {
                                                                                    width: 400, height: 50,
                                                                                    onValueChanged: function (e) {
                                                                                        asERODesc02 = e.value;
                                                                                    }
                                                                                },
                                                                                cssClass: "verylight-blue",
                                                                                validationRules: [{ type: "required", message: "Destination is required" }],
                                                                                visible: true,
                                                                                colSpan: 2,
                                                                            },
                                                                            {
                                                                                dataField: "EROCheck01",
                                                                                label: { text: "Overseas" },
                                                                                editorType: "dxCheckBox",
                                                                                editorOptions: {
                                                                                    //value: false, // Initial value
                                                                                    onValueChanged: function (e) {
                                                                                        asEROCheck01 = e.value;
                                                                                        console.log("asEROCheck01 ", asEROCheck01)
                                                                                        aAddStaff.columnOption("PSPvDate", "visible", e.value);
                                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                        if (asEROCheck02 && !e.value) {
                                                                                            aMessageAlert("<b><p style=font-size: 20px;>Roaming just for Overseas Only !! ", "Red")
                                                                                            var formInstance = $("#Add-form").dxForm("instance");
                                                                                            formInstance.updateData("EROCheck02", false);
                                                                                            asEROCheck02 = false;
                                                                                        }
                                                                                        //$("#Add-form").dxDataGrid("instance").refresh();
                                                                                    }
                                                                                }
                                                                            },

                                                                            {
                                                                                dataField: "EROCheck02",
                                                                                label: { text: "Need Roaming" },
                                                                                editorType: "dxCheckBox",
                                                                                editorOptions: {
                                                                                    //readOnly: function (e){return (asEROCheck01 === true ? false : true)},
                                                                                    onValueChanged: function (e) {
                                                                                        if (!asEROCheck01 && e.value) {
                                                                                            aMessageAlert("<b><p style=font-size: 20px;>Roaming just for Overseas Only !! ", "Red")
                                                                                            var formInstance = $("#Add-form").dxForm("instance");
                                                                                            formInstance.updateData("EROCheck02", false);
                                                                                            asEROCheck02 = false;

                                                                                        } else {

                                                                                            asEROCheck02 = e.value;
                                                                                            aAddStaff.columnOption("ROAMING INFORMATION", "visible", e.value); //HR Arrange for Roaming
                                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                        }
                                                                                    }

                                                                                }, //readOnly: !aRoamL // Initial value, can be true or false
                                                                                visible: true, //true // Initially hidden
                                                                            },
                                                                            {
                                                                                dataField: "RefundedAmount",
                                                                                label: { text: "Estimated Cost" },
                                                                                dataType: "dxNumberBox",
                                                                                //format: { type: "fixedPoint", precision: 2 },
                                                                                hint: "Estimated Cost can not be zero !!!",
                                                                                editorOptions: {
                                                                                    format: "#,##0.00", width: 150, elementAttr: { class: "right-align-number" },
                                                                                    hint: "Estimated Cost can not be zero !!!",
                                                                                    onValueChanged: function (e) {
                                                                                        asRefundedAmount = e.value;
                                                                                    }
                                                                                }, //showSpinButtons: true, readOnly: true,
                                                                                cssClass: "verylight-blue",
                                                                                colSpan: 1,
                                                                                validationRules: [{ type: "required" }, {
                                                                                    type: "range",
                                                                                    min: 1, //aYearStrS
                                                                                    max: 9999999, //aYearStrL
                                                                                    message: "Please ensure that the estimated cost is entered and is greater than zero.",
                                                                                }],
                                                                            },
                                                                            {
                                                                                dataField: "ERODate05",
                                                                                label: { text: "Date" },
                                                                                dataType: "dxNumberBox",
                                                                                visible: false
                                                                            },
                                                                            {
                                                                                dataField: "ERODate06",
                                                                                label: { text: "Date" },
                                                                                dataType: "dxNumberBox",
                                                                                visible: false
                                                                            },

                                                                        ],
                                                                        onFieldDataChanged: function (e) {
                                                                            if (e.dataField === "ERODate02") {
                                                                                e.component.updateData("ERODate03", e.value);
                                                                            }
                                                                        },

                                                                    },
                                                                    {
                                                                        title: "ARRANGEMENT",
                                                                        icon: "fas fa-clock",
                                                                        iconPosition: "start",
                                                                        colCount: 5,
                                                                        items: [

                                                                            {
                                                                                dataField: "Vendor01",
                                                                                label: { text: "Departure Flight" }, //,cssClass: "bold-label" }, 
                                                                                editorType: "dxTextArea",
                                                                                editorOptions: { width: 400, height: 80, readOnly: true, }, //value: asFullName,
                                                                                cssClass: "verylight-green",
                                                                                visible: true,
                                                                                colSpan: 2,
                                                                                //validationRules: [{ type: "required" }],
                                                                            },
                                                                            {
                                                                                dataField: "ERODesc04",
                                                                                label: { text: "Arrival Flight" },
                                                                                editorType: "dxTextArea",
                                                                                editorOptions: { width: 400, height: 80, readOnly: true, },
                                                                                cssClass: "verylight-green",
                                                                                visible: true,
                                                                                colSpan: 2,
                                                                            },
                                                                            /* {
                                                                                 itemType: "Empty",
                                                                                 colSpan: 1,
                                                                             },*/
                                                                            {
                                                                                dataField: "EROAmount1",
                                                                                label: { text: "Ticket Price (per person)" },
                                                                                dataType: "dxNumberBox",
                                                                                editorOptions: { format: "#,##0.00", width: 150, readOnly: true, elementAttr: { class: "right-align-number" } }, //showSpinButtons: true, readOnly: true,
                                                                                colSpan: 1,
                                                                            },
                                                                            /*{
                                                                                itemType: "Empty",
                                                                                colSpan: 4,
                                                                            },*/
                                                                            {
                                                                                dataField: "ERODesc05",
                                                                                label: { text: "HOTEL" },
                                                                                editorType: "dxTextArea",
                                                                                editorOptions: { width: 400, height: 80, readOnly: true, },
                                                                                cssClass: "verylight-green",
                                                                                visible: true,
                                                                                colSpan: 2,
                                                                            },
                                                                            {
                                                                                dataField: "Note",
                                                                                label: { text: "Remark" },
                                                                                editorType: "dxTextArea",
                                                                                editorOptions: { width: 400, height: 80, readOnly: true, },
                                                                                cssClass: "verylight-green",
                                                                                visible: true,
                                                                                colSpan: 2,
                                                                            },
                                                                            {
                                                                                itemType: "Empty",
                                                                                colSpan: 1,
                                                                            },

                                                                        ]
                                                                    },
                                                                    {
                                                                        title: "",
                                                                        icon: "fas fa-minus-circle",
                                                                        iconPosition: "start",
                                                                    }
                                                                ]


                                                            } // tab here }]
                                                        ],
                                                        onInitialized: function (e) {
                                                            // Trigger validation immediately using the defined validation group
                                                            //const validationResult = DevExpress.validationEngine.validateGroup("formValidationGroup");

                                                            //if (!validationResult.isValid) {
                                                            //    console.log("Form is invalid upon initialization.");
                                                            // }
                                                        }

                                                    }).dxForm("instance");

                                                    const aAddStaff = $("#Add-dxDataGrid").dxDataGrid({

                                                        dataSource: new DevExpress.data.CustomStore({
                                                            key: "REFNO",
                                                            loadMode: "omit",
                                                            load: function () { return $.post(aaxSettings).done(function (response) { console.log(response); }); },
                                                            insert: function (values) {
                                                                if (aaEnt) {
                                                                    var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };
                                                                    var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                                                }
                                                                else {
                                                                    var ObjRowData = JSON.stringify(values);
                                                                }
                                                                sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                            },
                                                            update: function (key, values) {
                                                                //console.log(key)
                                                                //console.log(key.slice(-3))
                                                                //console.log(values)
                                                                //console.log("json value = ",JSON.stringify(values))
                                                                //console.log("iData = ",iData)

                                                                if (key.slice(-3) === "001") {
                                                                    let obj = values; //JSON.stringify(values); //{"EROCode04": "NO"};
                                                                    const aKey = Object.keys(obj)[0];
                                                                    const aVal = obj[aKey];
                                                                    //console.log("xx ", Object.keys(values)[0])
                                                                    console.log("aKey =", aKey); // Output: "fst = EROCode04"
                                                                    console.log("aVal =", aVal); // Output: "scd = NO"
                                                                    iData[aKey] = aVal;
                                                                    console.log("new iData =", iData);
                                                                    console.log(iData.ERODate02, iData.ERODate03)
                                                                }

                                                                var ObjKeyData = { "REFNO": $.trim(key) };   //[aaKeyField] key.trim
                                                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                                                sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                                // Refresh the DataGrid after the update is successful
                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                            },
                                                            remove: function (key) {
                                                                var ObjKeyData = { "REFNO": $.trim(key) };   //[aaKeyField] key.trim
                                                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                                                                sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                                                            }

                                                        }),

                                                        allowColumnReordering: false, //true false
                                                        allowReordering: false,
                                                        allowColumnResizing: false, //true,
                                                        columnMinWidth: 10,
                                                        columnChooser: {
                                                            enabled: false //false // true
                                                        },
                                                        showBorders: true,
                                                        sorting: {
                                                            mode: "single" //"multiple"
                                                        },
                                                        selection: {
                                                            mode: 'single' //'multiple'
                                                        },
                                                        groupPanel: {
                                                            visible: false //true //false // can't select other group
                                                        },
                                                        filterRow: {
                                                            visible: false,
                                                            applyFilter: "auto"
                                                        },
                                                        headerFilter: {
                                                            visible: false //true
                                                        },
                                                        grouping: {
                                                            autoExpandAll: true,
                                                        },
                                                        searchPanel: {
                                                            visible: false //true
                                                        },
                                                        paging: {
                                                            pageSize: 10
                                                        },
                                                        pager: {
                                                            showPageSizeSelector: true,
                                                            allowedPageSizes: [10, 20],
                                                            showNavigationButtons: true,
                                                            showInfo: true
                                                        },
                                                        showBorders: true,
                                                        groupPaging: true,
                                                        showColumnLines: true,
                                                        showRowLines: true,
                                                        rowAlternationEnabled: false, //true,
                                                        /*onRowPrepared: function (e) {
                                                            e.rowElement.css({ height: 100 });
                                                        },*/
                                                        wordWrapEnabled: true,
                                                        cacheEnabled: false,
                                                        columnAutoWidth: true,
                                                        // check for disable column
                                                        customizeColumns: function (columns) {
                                                            columns.forEach(function (column) {
                                                                if (column.dataField === "PSPvDate") {
                                                                    column.visible = asEROCheck01; //false asEROCheck01
                                                                }
                                                                if (column.caption === "ROAMING INFORMATION") { //HR Arrange for Roaming
                                                                    column.visible = asEROCheck02;
                                                                }
                                                            });
                                                        },
                                                        // Export to Excel

                                                        onInitNewRow: function (e) {
                                                            //e.component.__addingStart = true; 
                                                            //gridContainer.option("editing.popup.title", "Adding Expenses Reimbursement");
                                                            let aaID = 1
                                                            let axRunRun = aGetDateRef(aaRunPre); // aaOnInitExpGroupDesc.substring(0, 1)
                                                            let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                            e.data.ID = aaID
                                                            e.data.HeadRefNo = axRunRun
                                                            e.data.REFNO = axLineNo
                                                            e.data.PayToCode = asStaffID
                                                            e.data.PayToName = asFullName
                                                            e.data.Department = asDepartment
                                                            e.data.Division = asDivision
                                                            e.data.ERODesc06 = asStaffEmail
                                                            e.data.ReqDate = new Date()
                                                            e.data.ExpensesCode = "" //aaOnInitAccCode
                                                            e.data.ExpensesDescription = aaOnInitAccDesc //aaOnInitAccDesc
                                                            e.data.Currency = "THB"
                                                            e.data.Xrate = 1
                                                            e.data.ExpGroupCode = aaOnInitExpGroupCode
                                                            e.data.ExpGroupDescEng = aaOnInitExpGroupDesc
                                                            e.data.ERStatus = "Register"
                                                            e.data.ERORefNo3 = "" // type of expenses
                                                            //e.data.EROCheck01 = true
                                                            //e.data.EROCheck02 = true
                                                            e.data.ERODate05 = asERODate02
                                                            e.data.ERODate06 = asERODate03
                                                            e.data.NeedPayment = false
                                                            e.data.RefundedAmount = 0
                                                            e.data.LimitedAmount = 0 //aaLTotal
                                                        },
                                                        onEditorPreparing: function (e) {
                                                            if (e.parentType === "dataRow" && arDataU === 0) {
                                                                e.editorOptions.disabled = true;
                                                            } else {     //PSPvNO,PSPvDate //|| e.dataField === "PSPvDate" 
                                                                if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate" || e.dataField === "ERStatus" || e.dataField === "PSPvNO" || e.dataField === "LocalAmount" || e.dataField === "ReqDate" || e.dataField === "HeadRefNo" || e.dataField === "PayToCode" || e.dataField === "PayToName" || e.dataField === "Department")) {
                                                                    e.editorOptions.disabled = true;
                                                                }
                                                            }
                                                        },
                                                        // Editing
                                                        editing: {
                                                            mode: "cell", // popup , row, cell (click to edit)
                                                            useIcons: true,
                                                            allowUpdating: aViewG,
                                                            //allowUpdating: true,
                                                            allowDeleting: aViewG, //arDataD,
                                                            allowAdding: false, //arDataC,

                                                            popup: {
                                                                title: "Travel Requisition FormInfo",
                                                                fullScreen: false,
                                                                showTitle: true,
                                                                width: 1200,
                                                                height: 650,
                                                                position: {
                                                                    my: "top",
                                                                    at: "top",
                                                                    of: "window"
                                                                },
                                                                onContentReady: function (e) {
                                                                    e.component.option('toolbarItems[0].visible', aSaveVisible);
                                                                    e.component.option('toolbarItems[0].options.icon', 'save');
                                                                    e.component.option('toolbarItems[0].options.type', 'success');
                                                                    e.component.option('toolbarItems[1].options.text', aCancelText);
                                                                    e.component.option('toolbarItems[1].options.icon', aCancelicon);
                                                                    e.component.option('toolbarItems[1].options.type', aCancelType);
                                                                }
                                                            },
                                                        },
                                                        onRowValidating: function (e) {
                                                            var isValid = true;
                                                            e.brokenRules.forEach(function (rule) {
                                                                if (rule.type === "custom" && !rule.isValid) {
                                                                    isValid = false;
                                                                }
                                                            });
                                                            if (!isValid) {
                                                                e.isValid = false;
                                                            }
                                                        },
                                                        // column list
                                                        columns: [
                                                            {
                                                                type: "buttons",
                                                                width: 30, //80
                                                                buttons: [
                                                                    {
                                                                        hint: "delete",
                                                                        icon: "trash", //"fas fa-trash-alt", //fa-trash
                                                                        /*elementAttr: { class: "custom-icon-size"}, // Apply the custom icon size class
                                                                        cssClass: "custom-icon-size",*/
                                                                        visible: function (e) {
                                                                            return (e.row.data.Confirmed === false) //return !e.row.isEditing;
                                                                        },
                                                                        onClick: function (e) {
                                                                            //$("#gridContainer").dxDataGrid("instance").refresh();
                                                                            var aLocalMess = "";
                                                                            var aLocalTitle = "";
                                                                            var aSQLCommand = "";
                                                                            var aExitMessage = "All rows of this Reimbursement have deleted !!";
                                                                            var aFrecN = e.row.data.ID;
                                                                            if (aFrecN === 1) {
                                                                                aLocalMess = "<div style='color:Tomato; font-size: 16px'><center><b>THIS IS THE FIRST ROW (NO = 1)</b><br>If you delete first row, program will delete all rows [REFNO = <u>" + e.row.data.HeadRefNo + "</u>]</div> <br> Are you sure you want to delete all rows ?"
                                                                                aLocalTitle = "DELETE ALL ROWS"
                                                                            } else {
                                                                                aLocalMess = "Are you sure you want to delete this row (ROW =" + e.row.data.ID + " )?"
                                                                                aLocalTitle = "DELETE THIS ROW"
                                                                            }
                                                                            let result = DevExpress.ui.dialog.confirm(aLocalMess, aLocalTitle); //+ "<br>?? 'YES' ???????????"
                                                                            result.done(function (dresult) {
                                                                                if (dresult) {
                                                                                    // delete data
                                                                                    // DELETE FROM TRVREQF WHERE HeadRefNo = 'M2110120750'
                                                                                    if (aFrecN === 1) {
                                                                                        aSQLCommand = "use ExtraOnLine; DELETE FROM TRVREQF WHERE HeadRefNo = '" + e.row.data.HeadRefNo + "'"
                                                                                    } else {
                                                                                        aSQLCommand = "use ExtraOnLine; DELETE FROM TRVREQF WHERE REFNO = '" + e.row.data.REFNO + "'"
                                                                                    }
                                                                                    //alert(aSQLCommand)
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    aSQLAction(aaPFDMI, aSQLCommand)
                                                                                    aaLastLineNo = aaLastLineNo - 1
                                                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    if (aFrecN === 1) {
                                                                                        $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                        var aThisThemes = localStorage["aDXTheme"];
                                                                                        //changeTheme(aThisThemes)
                                                                                        DevExpress.ui.dialog.alert({ showTitle: false, messageHtml: aExitMessage });
                                                                                        popup.hide();
                                                                                    }
                                                                                }
                                                                            });
                                                                        }

                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                type: "buttons",
                                                                width: 30,
                                                                buttons: [// Clone first record ID++
                                                                    {
                                                                        hint: "Add More Line",
                                                                        icon: "fas fa-plus",
                                                                        visible: function (e) {
                                                                            const aadataGrid = $("#Add-dxDataGrid").dxDataGrid("instance");
                                                                            const aapageSize = aadataGrid.option('paging.pageSize'); // check page size [5,10,15]
                                                                            return (((e.row.data.ID - 1) % aapageSize === 0 && e.row.data.ID >= 1) && e.row.data.Confirmed === false)
                                                                        },
                                                                        onClick: (e) => {
                                                                            aaLastLineNo = aaLastLineNo + 1
                                                                            //alert(aaLastLineNo)
                                                                            //REFNO,ID,HeadRefNo,ReqDate,PayToCode,PayToName,Department,Division,ExpensesCode,ExpensesDescription,Currency,Xrate,Amount,LocalAmount,Confirmed,Approved,Note,EntryBy,EntryDate,HRApproved,ERStatus,LimitedAmount,OtherRefNo,PBatchNo,PBatchDate,PSPvNO,PSPvDate,RemitTo1,RemitTo2,RemitTo1Amount,RemitTo2Amount,RemitTo1Diff,RemitTo2Diff,RemitTo1Note,RemitTo2Note,ERODate01,ERODate02,ERODate03,ERODate04,ERODate05,ERODate06,ERODesc01,ERODesc02,ERODesc03,ERODesc04,ERODesc05,ERODesc06,EROCheck01,EROCheck02,EROCheck03,EROCheck04,EROCheck05,EROCheck06,EROCode01,EROCode02,EROCode03,EROCode04,EROCode05,EROCode06,ERORefNo1,ERORefNo2,ERORefNo3,ERORefNo4,ERORefNo5,ERORefNo6,EROAmount1,EROAmount2,EROAmount3,EROAmount4,EROAmount5,EROAmount6,EROSum1,EROSum2,EROSum3,EROSum4,EROSum5,EROSum6
                                                                            let aBlankDate = new Date(); //"1900-01-01T00:00:00" //new Date('1900-01-01T00:00')//console.log(aBlankDate) 
                                                                            let axRunRun = e.row.data.HeadRefNo
                                                                            let aFieldSelected = "NextID"
                                                                            let aFullTableName = "ExtraOnLine.dbo.TRnextIDview Where HeadRefNo LIKE '" + axRunRun + "%'"
                                                                            let aFullBody = "Select " + aFieldSelected + " From " + aFullTableName; //alert(aFullBody)                                           
                                                                            let myHeaders = new Headers(); myHeaders.append("Content-Type", "application/json");
                                                                            let raw = JSON.stringify({ "@": btoa(aFullBody) });
                                                                            let requestOptions = { method: "POST", headers: myHeaders, body: raw, redirect: "follow" };
                                                                            let aURL = aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232";

                                                                            fetch(aaPFDMI + "/DMQ/XOL/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": btoa(aFullBody) }), redirect: "follow" })
                                                                                .then(response => response.json())
                                                                                //
                                                                                .then(aData => {
                                                                                    // start process
                                                                                    let aaID = aData[0].NextID //JSON.stringify(aData); //aData[0].NextID //next no 
                                                                                    let axLineNo = $.trim(axRunRun) + "-" + String(aaID).padStart(3, '0')
                                                                                    //let aObjKeyData = { ID: aaID, HeadRefNo: axRunRun, REFNO: axLineNo, EROAmount: 0, PBatchDate: aBlankDate,PSPvDate: aBlankDate,ERODate01: aBlankDate,ERODate02: aBlankDate,ERODate03: aBlankDate,ERODate04: aBlankDate,ERODate05: aBlankDate,ERODate06: aBlankDate} //{EntryBy: aaUsrN , EntryDate: new Date(), PayToCode: asStaffID, PayToName: asFullName, Department: asDepartment };                                                                             
                                                                                    let aObjKeyData = { REFNO: axLineNo, ID: aaID, LocalAmount: 0, Amount: 0, RefundedAmount: 0, Note: "", ERORefNo1: "", ERORefNo2: "", ERORefNo3: "", ERORefNo4: "", ERODesc02: "", ERODesc03: "", ERODesc04: "", ExpensesCode: "", Currency: "THB", Xrate: 1, Vendor02: "", EROCode01: "", EROCode02: "", EROCode03: "", EROCode04: "", EROCode05: "" }
                                                                                    let aObjRowData = JSON.stringify($.extend({}, e.row.data, aObjKeyData)); //values 
                                                                                    //var clonedItem = $.extend({}, e.row.data, { REFNO: axRunRun }); //++maxID
                                                                                    //console.log("aObjKeyData = ",aObjKeyData)
                                                                                    sendRequestNew("Insert", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));

                                                                                    e.component.refresh(true); //employees.splice(e.row.rowIndex, 0, clonedItem);
                                                                                    e.component.refresh(true);
                                                                                    e.component.refresh(true);
                                                                                    e.event.preventDefault();

                                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                                    $("#Add-dxDataGrid").dxDataGrid("instance").refresh();

                                                                                })
                                                                                .catch(e => {
                                                                                    console.log(e);
                                                                                })
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                        }
                                                                    },
                                                                ]
                                                            },
                                                            {
                                                                dataField: "ID",
                                                                sortOrder: "asc",
                                                                caption: "#",
                                                                editorOptions: { width: 40, readOnly: true },
                                                                //alignment: 'top',
                                                                width: 40
                                                            },
                                                            {
                                                                dataField: "Vendor02",
                                                                caption: "Full name (as show in passport)*",
                                                                editorType: "dxTextBox",
                                                                width: 180,
                                                                editorOptions: { width: 180, },
                                                                //validationRules: [{ type: "required" }],
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "EROCode01",
                                                                caption: "Deparatment",
                                                                width: 150,
                                                                editorType: "dxTextBox",
                                                                editorOptions: { width: 150, },
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "EROCode06",
                                                                caption: "Passport No",
                                                                width: 200,
                                                                editorType: "dxTextBox",
                                                                editorOptions: { width: 200, },
                                                                visible: false,
                                                            },
                                                            {
                                                                dataField: "PSPvDate",
                                                                caption: "Send Passport Copy to Admin*",
                                                                dataType: "date",
                                                                format: "dd/MM/yyyy",
                                                                placeholder: '01/01/1901',
                                                                //showClearButton: true,
                                                                //useMaskBehavior: true,
                                                                value: new Date(),
                                                                width: 120,
                                                                editorOptions: {
                                                                    width: 120,
                                                                    showClearButton: true,
                                                                    useMaskBehavior: true,
                                                                    pickerType: "calendar",
                                                                    //value: new Date(),
                                                                    hint: "Select the send Email Date"
                                                                },
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "EROCode02",
                                                                caption: "Royal Orchid Plus",
                                                                editorType: "dxTextBox",
                                                                width: 100,
                                                                editorOptions: { width: 100 },
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "EROAmount2",
                                                                caption: "Ticket Price",
                                                                dataType: "number",
                                                                format: { type: "fixedPoint", precision: 2 },
                                                                editorType: "dxNumberBox",
                                                                editorOptions: { format: "#,##0.00", width: 120 },
                                                                width: 120,
                                                                visible: true,
                                                            }, {
                                                                dataField: "ERODesc01",
                                                                caption: "Hotel",
                                                                headerCellTemplate: function (header, info) {
                                                                    $('<div>')
                                                                        .html(info.column.caption)
                                                                        .appendTo(header);
                                                                    header.parent().css("backgroundColor", "#e6fdeb");
                                                                },
                                                                width: 150,
                                                                editorType: "dxTextBox",
                                                                editorOptions: { width: 150, },
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "EROAmount4",
                                                                caption: "Hotel Price",
                                                                headerCellTemplate: function (header, info) {
                                                                    $('<div>')
                                                                        .html(info.column.caption)
                                                                        .appendTo(header);
                                                                    header.parent().css("backgroundColor", "#e6fdeb");
                                                                },
                                                                dataType: "number",
                                                                format: { type: "fixedPoint", precision: 2 },
                                                                editorType: "dxNumberBox",
                                                                editorOptions: { format: "#,##0.00", width: 120 },
                                                                width: 120,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "ERODate05",
                                                                caption: "Date From",
                                                                dataType: "date",
                                                                format: "dd/MM/yyyy",
                                                                //value: iData.ERODate02,
                                                                width: 120,
                                                                editorOptions: { width: 120, }, // showClearButton: true, value: iData.ERODate02,
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "ERODate06",
                                                                caption: "Date To",
                                                                dataType: "date",
                                                                format: "dd/MM/yyyy",
                                                                //value: iData.ERODate03,
                                                                width: 120,
                                                                editorOptions: { width: 120, }, //showClearButton: true, value: iData.ERODate03
                                                                visible: true,
                                                            },
                                                            {
                                                                dataField: "EROCode03",
                                                                caption: "Company's Mobile Phone*",
                                                                editorType: "dxTextBox",
                                                                width: 120,
                                                                editorOptions: { width: 120 },
                                                                visible: true,
                                                            },
                                                            {
                                                                caption: "ROAMING INFORMATION",
                                                                visible: true,
                                                                width: 300,
                                                                headerCellTemplate: function (header, info) {
                                                                    $('<div>')
                                                                        .html(info.column.caption)
                                                                        .addClass('centered-header')
                                                                        .appendTo(header);
                                                                    header.parent().css("backgroundColor", "#e7d5ff");
                                                                },
                                                                columns: [
                                                                    {
                                                                        dataField: "EROCode04",
                                                                        caption: "Call",
                                                                        headerCellTemplate: function (header, info) {
                                                                            $('<div>')
                                                                                .html(info.column.caption)
                                                                                .addClass('centered-header')
                                                                                .appendTo(header);
                                                                            header.parent().css("backgroundColor", "#e7d5ff");
                                                                        },
                                                                        editorType: "dxSelectBox",
                                                                        width: 100,
                                                                        editorOptions: {
                                                                            width: 100,
                                                                            dataSource: aObjects.aaYesNoList, //aaYesNoList
                                                                            searchExpr: "Code",
                                                                            valueExpr: "Code",
                                                                            displayExpr: "Code",
                                                                            searchEnabled: true,
                                                                        }, // readOnly: !aRoamL
                                                                        visible: true,
                                                                    },
                                                                    {
                                                                        dataField: "EROCode05",
                                                                        caption: "Internet",
                                                                        headerCellTemplate: function (header, info) {
                                                                            $('<div>')
                                                                                .html(info.column.caption)
                                                                                .addClass('centered-header')
                                                                                .appendTo(header);
                                                                            header.parent().css("backgroundColor", "#e7d5ff");
                                                                        },
                                                                        editorType: "dxSelectBox",
                                                                        width: 100,
                                                                        editorOptions: {
                                                                            width: 100,
                                                                            dataSource: aObjects.aaYesNoList, //aaYesNoList
                                                                            searchExpr: "Code",
                                                                            valueExpr: "Code",
                                                                            displayExpr: "Code",
                                                                            searchEnabled: true,
                                                                        }, // readOnly: !aRoamL
                                                                        visible: true,
                                                                    },
                                                                    {
                                                                        dataField: "ERORefNo2",
                                                                        caption: "HR Arrangement",
                                                                        headerCellTemplate: function (header, info) {
                                                                            $('<div>')
                                                                                .html(info.column.caption)
                                                                                .addClass('centered-header')
                                                                                .appendTo(header);
                                                                            header.parent().css("backgroundColor", "#e1cbf5");
                                                                        },
                                                                        editorType: "dxTextBox",
                                                                        width: 200,
                                                                        editorOptions: { width: 200, }, // readOnly: !aRoamL
                                                                        visible: true,
                                                                    },
                                                                    {
                                                                        dataField: "EROAmount5",
                                                                        caption: "Amount",
                                                                        headerCellTemplate: function (header, info) {
                                                                            $('<div>')
                                                                                .html(info.column.caption)
                                                                                .addClass('centered-header')
                                                                                .appendTo(header);
                                                                            header.parent().css("backgroundColor", "#e1cbf5");
                                                                        },
                                                                        dataType: "number",
                                                                        format: { type: "fixedPoint", precision: 2 },
                                                                        editorType: "dxNumberBox",
                                                                        editorOptions: { format: "#,##0.00", width: 120 },
                                                                        width: 120,
                                                                        visible: true,
                                                                    },
                                                                ],
                                                            },


                                                        ],
                                                        // summary
                                                        summary: {
                                                            recalculateWhileEditing: true,
                                                            skipEmptyValues: false,
                                                            totalItems: [
                                                                {
                                                                    column: "REFNO",
                                                                    summaryType: "count",
                                                                    //          summaryType: "max",
                                                                    //          valueFormat: "currency",
                                                                    //          showInGroupFooter: false,
                                                                    //          alignByColumn: true            
                                                                    displayFormat: "{0} Items",
                                                                },
                                                                {
                                                                    column: "RefundedAmount",
                                                                    summaryType: "sum",
                                                                    //          summaryType: "max",
                                                                    valueFormat: "#,##0.00", //"currency",
                                                                    //          showInGroupFooter: false,
                                                                    //          alignByColumn: true            
                                                                    displayFormat: "{0}",
                                                                },
                                                            ],
                                                            groupItems: [
                                                                {
                                                                    column: "ID",
                                                                    summaryType: "count",
                                                                    displayFormat: "{0} Items",
                                                                },

                                                                {
                                                                    column: "ERORefNo4",
                                                                    summaryType: "count",
                                                                    showInGroupFooter: true,
                                                                    displayFormat: "Total {0} Items",
                                                                },
                                                                {
                                                                    column: "RefundedAmount",
                                                                    summaryType: "sum",
                                                                    valueFormat: "#,##0.00",
                                                                    showInGroupFooter: true,
                                                                    alignByColumn: true,
                                                                    displayFormat: "{0}",
                                                                },
                                                            ],
                                                        },
                                                        // Tool Bar
                                                        onToolbarPreparing: function (e) {
                                                            var dataGrid = e.component;
                                                            e.toolbarOptions.items.unshift(

                                                                {
                                                                    location: "before",
                                                                    widget: "dxButton",
                                                                    options: {
                                                                        icon: "refresh",
                                                                        text: "REFRESH",
                                                                        stylingMode: "outlined",
                                                                        onClick: function () {
                                                                            aAddStaff.refresh();
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#Add-dxDataGrid").dxDataGrid("instance").refresh();
                                                                            $("#Add-Form").dxDataGrid("instance").refresh();
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    location: "before",
                                                                    template: function () { return $("<div style='padding: 5px 15px;'/>") }
                                                                },
                                                                /*{
                                                                    location: "after",
                                                                    widget: "dxButton",
                                                                    options: {
                                                                        icon: "fas fa-info",
                                                                        text: "HELP",
                                                                        type: "success",
                                                                        stylingMode: "contained",
                                                                        onClick: function () {
                                                                            //dataGrid.refresh();
                                                                            aPopupHelp()
                                                                        }
                                                                    }
                                                                }*/
                                                            );
                                                        }

                                                    }).dxDataGrid("instance");

                                                    function dropDownBoxACC(cellElement, cellInfo) {
                                                        return $("<div>").dxDropDownBox({
                                                            dropDownOptions: { width: 800 },
                                                            dataSource: aaSubGroup01,
                                                            value: [cellInfo.value],
                                                            valueExpr: "EDESC",
                                                            displayExpr: "EDESC",
                                                            contentTemplate: function (e) {
                                                                return $("<div>").dxDataGrid({
                                                                    dataSource: aaSubGroup01,
                                                                    //remoteOperations: true, // IDNO,BenefitLevel,FamilyReimbursement,AllowSSO,OPDLimitperrequest,OPDLimitperyear,MaternityLimitperyear,IPDLimitpercase,FleetLimit,PositionGroup,NOTE,EntryBy,EntryDate
                                                                    columns: [{ dataField: "EDESC", caption: "Eng Desc. ", width: 200, sortOrder: "asc" }, { dataField: "TDESC", caption: "Thai  Desc", width: 280 }, { dataField: "ACCCODE", caption: "Account Code", width: 100 }],
                                                                    hoverStateEnabled: true,
                                                                    searchPanel: { visible: true },
                                                                    headerFilter: { visible: true },
                                                                    paging: { enabled: true, pageSize: 20 },
                                                                    filterRow: { visible: true },
                                                                    showBorders: true,
                                                                    scrolling: { mode: "virtual" },
                                                                    selection: { mode: "single" },
                                                                    height: 450,
                                                                    selectedRowKeys: [cellInfo.value],
                                                                    //selectedRowKeys: [value],
                                                                    //focusedRowEnabled: true,
                                                                    focusedRowKey: cellInfo.value,
                                                                    onSelectionChanged: function (sArgs) {
                                                                        //console.log(sArgs.selectedRowKeys[0].EDESC)
                                                                        e.component.option("value", sArgs.selectedRowKeys[0].EDESC); // Works but Error Need to correct next time !!!
                                                                        cellInfo.setValue(sArgs.selectedRowKeys[0].EDESC);
                                                                        if (sArgs.selectedRowKeys.length > 0) {
                                                                            e.component.close();
                                                                        }
                                                                    }
                                                                });
                                                            },
                                                        });
                                                    }

                                                    const aSearch2json = (arr, searchKey, searchValue) => {
                                                        const results = []; // Initialize an empty array to store the matching objects
                                                        for (const obj of arr) { // Loop through each object in the array
                                                            if (obj[searchKey] === searchValue) { // Check if the object has the matching search key
                                                                results.push(obj); // Add the matching object to the results array
                                                            }
                                                        }
                                                        return results; // Return the array of matching objects
                                                    }

                                                    //var accordion;
                                                    $("#popupAccordion").dxAccordion({
                                                        dataSource: [
                                                            { title: "Personal Information", formData: { firstName: "John", lastName: "Doe" } },
                                                            { title: "Contact Information", formData: { email: "john.doe@example.com", phone: "123-456-7890" } }
                                                        ],
                                                        animationDuration: 300,
                                                        collapsible: true,
                                                        multiple: true,
                                                        itemTemplate: function (data) {
                                                            return $("<div>").dxForm({
                                                                formData: data.formData,
                                                                items: [
                                                                    { dataField: "firstName", label: { text: "First Name" } },
                                                                    { dataField: "lastName", label: { text: "Last Name" } },
                                                                    { dataField: "email", label: { text: "Email" } },
                                                                    { dataField: "phone", label: { text: "Phone" } }
                                                                ]
                                                            });
                                                        },
                                                        onInitialized: function (e) {
                                                            accordion = e.component;
                                                        }
                                                    });

                                                    $("#expandButton").on("click", function () {
                                                        accordion.expandItem(0); // Expand the first item
                                                        accordion.expandItem(1); // Expand the second item
                                                    });

                                                    $("#collapseButton").on("click", function () {
                                                        accordion.collapseItem(0); // Collapse the first item
                                                        accordion.collapseItem(1); // Collapse the second item
                                                    });

                                                });
                                            }


                                            const aPopUpUpLoad = (aRefNoForName) => {
                                                $(() => {
                                                    var aaFileN;
                                                    var aaFileN2;
                                                    var aaNewNamePF = aRefNoForName;
                                                    const popup = $("#popupUL").dxPopup({
                                                        title: `File Attachment [${aaNewNamePF}]`,
                                                        height: 280,
                                                        width: 600,
                                                        position: { offset: "-50 -80" }, //{offset: "0 -180"},
                                                        //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                                        visible: true,
                                                        fullScreen: false,
                                                        showCloseButton: true,
                                                        showTitle: true,
                                                        dragEnabled: true,
                                                        closeOnOutsideClick: false,
                                                        resizeEnabled: true,
                                                        //shadingColor:"rgb(190,190,190,0.9)",

                                                        contentTemplate: () => {
                                                            return $("<div />").append(
                                                                // $("<div style = 'margin-left: 10px'>��������´ - DESCRIPTIONS</div>"),
                                                                // $("<p><div style = 'margin-left: 10px' id='first-name'></div></p>"),
                                                                //$("<p><div style = 'margin-left: 20px' id='fileUploader'></div></p>"),
                                                                //$("<p><div style = 'margin-left: 400px; margin-top: 36px;' id='scbutton'></div></p>"),
                                                                $("<div style='border: 1px solid grey; padding: 10px; display: inline-block; margin-left: 20px; margin-right: 10px;' id='fileUploaderContainer'><div id='fileUploader'></div></div>").appendTo("body"),
                                                                //$("<div style='border: 150px solid black; padding: 10px; display: inline-block; margin-left: 20px; margin-right: 10px;' id='fileUploaderContainer'><div id='fileUploader'></div></div>").appendTo("body"),
                                                                //$("<div style='display: inline-block; margin-top: 36px;' id='scbutton'></div>").appendTo("body");
                                                                $("<div style='position: fixed; left: 440px; top: 240px;' id='scbutton'></div>").appendTo("body"),
                                                            )
                                                        },

                                                    }).dxPopup("instance");

                                                    const aauploader = $("#fileUploader").dxFileUploader({
                                                        multiple: false,
                                                        selectButtonText: 'Select File',
                                                        labelText: '',
                                                        //accept: 'image/*',
                                                        uploadMode: 'useForm',
                                                        height: "130px",
                                                        uploadedMessage: "Uploaded",
                                                        uploadFailedMessage: "Upload failed",
                                                        accept: ".pdf",
                                                        allowedFileExtensions: [".pdf", ".PDF"],
                                                        //uploadUrl: "https://cbsdev2.locktonwattana.com/",
                                                        uploadUrl: `${aaPFDMI}/temp/uploads`, //`${aaPFDMI}/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE`, //"https://cbsdev2.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                                                    });

                                                    $('#scbutton').dxButton({
                                                        text: 'Upload File',
                                                        type: 'success',
                                                        onClick() {
                                                            //u2ploadFile();
                                                            u2ploadFile().then(result => {
                                                                if (result) {
                                                                    //aMessageAlert("Upload successful!","blue");                                                                
                                                                    //$("##popupUL").hide();
                                                                    popup.hide()
                                                                } else {
                                                                    aMessageAlert("Upload failed.", "red");
                                                                }
                                                            });
                                                        },
                                                    });

                                                    async function u2ploadFile() {
                                                        try {
                                                            // Get the dxFileUploader instance
                                                            const fileUploader = $("#fileUploader").dxFileUploader("instance");
                                                            const files = fileUploader.option("value");

                                                            // Validate file selection
                                                            if (!files.length) {
                                                                console.log("No files selected.");
                                                                return false;
                                                            }

                                                            // Extract original file and extension
                                                            const originalFile = files[0];
                                                            const originalFileName = originalFile.name;
                                                            const fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")); // Extract extension
                                                            const newFileName = `${aaNewNamePF}${fileExtension}`; // New name with same extension `updated_${Date.now()}${fileExtension}`

                                                            // Create a new file with the updated name
                                                            const simulatedFile = new File([originalFile], newFileName, {
                                                                type: originalFile.type,
                                                            });

                                                            // Check if it's a PDF
                                                            if (fileExtension.toLowerCase() === ".pdf") {
                                                                // Load and modify PDF metadata
                                                                const pdfBytes = await originalFile.arrayBuffer(); // Convert file to ArrayBuffer
                                                                const pdfDoc = await PDFDocument.load(pdfBytes); // Load the PDF document

                                                                // Update metadata
                                                                pdfDoc.setTitle(newFileName); // Set the new title
                                                                pdfDoc.setSubject("Updated PDF"); // Optional: Set subject
                                                                pdfDoc.setAuthor("TRF"); // Optional: Set author

                                                                // Save the updated PDF
                                                                updatedFileContent = await pdfDoc.save(); // Save the updated PDF as a Uint8Array
                                                            }

                                                            // Create FormData and append the new file
                                                            const formData = new FormData();
                                                            formData.append("file", simulatedFile);

                                                            // Request headers (DO NOT set Content-Type when using FormData)
                                                            const myHeaders = new Headers();
                                                            myHeaders.append("ref", "44095B6C-CC17-47FD-895B-649E0EAA2BAE");

                                                            // Request options
                                                            const requestOptions = {
                                                                method: "POST",
                                                                headers: myHeaders,
                                                                body: formData, // Use FormData as the body
                                                            };

                                                            // Send the request
                                                            const response = await fetch(
                                                                `${aaPFDMI}/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE`, //"https://cbsdev2.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                                                                requestOptions
                                                            );

                                                            // Check response status
                                                            if (!response.ok) {
                                                                throw new Error(`HTTP error! status: ${response.status}`);
                                                            }

                                                            // Handle success
                                                            const result = await response.text();
                                                            console.log(result);
                                                            aMessageAlert(`Upload file ${newFileName} successful!`, "blue");
                                                            fileUploader.reset(); // Clear the uploader
                                                            return true; // Success
                                                        } catch (error) {
                                                            console.error("Error:", error);
                                                            return false; // Error
                                                        }
                                                    }


                                                });
                                            }

                                            async function isFileAvailable(fileUrl) {
                                                try {
                                                    const response = await fetch(fileUrl, { method: 'GET' });
                                                    if (response.status === 200) {
                                                        return true; // File is available
                                                    } else {
                                                        console.warn("File not found. Status:", response.status);
                                                        return false; // File is not available
                                                    }
                                                } catch (error) {
                                                    console.error("Error checking file availability:", error);
                                                    return false; // Treat as unavailable on error
                                                }
                                            }


                                            function aPopupPDF(fileUrl) {
                                                const popup = $("#popupHelp").dxPopup({
                                                    title: "File Attachment",
                                                    width: "80%",
                                                    height: "90%",
                                                    fullScreen: true, // Enable full-screen mode
                                                    visible: false, // Initially hidden
                                                    closeOnOutsideClick: true,
                                                    resizeEnabled: true, // Allow resizin
                                                    //position: { offset: "40 -100" }, //{my:"top", at:"top", of:window}, <ul><li>
                                                    visible: true,
                                                    showCloseButton: true, //return $("<iframe>").attr("src", "https://cbsdev2.locktonwattana.com/temp/uploads/" + aResultFilePDF + "#view=FitH").css("width", "100%").css("height", "100%");
                                                    contentTemplate: function () {
                                                        return $("<iframe>")
                                                            .attr("src", fileUrl + "#view=FitH")
                                                            .css("width", "100%")
                                                            .css("height", "100%");
                                                    },
                                                }).dxPopup("instance");
                                            }





                                            /*                                         const aPopUpUpLoad = (aFolder) => {
                                                                                        $(() => {
                                                                                            const popup = $("#popupUL").dxPopup({
                                                                                                title: "Upload File",
                                                                                                height: 400,
                                                                                                width: 800,
                                                                                                position: { offset: "0 -10" }, //{offset: "0 -180"},
                                                                                                //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                                                                                visible: true,
                                                                                                fullScreen: false,
                                                                                                showCloseButton: true,
                                                                                                showTitle: true,
                                                                                                dragEnabled: true,
                                                                                                closeOnOutsideClick: false,
                                                                                                resizeEnabled: true,
                                                                                                //shadingColor:"rgb(190,190,190,0.9)",
                                            
                                                                                                contentTemplate: () => {
                                                                                                    return $("<div />").append(
                                                                                                        // $("<div style = 'margin-left: 10px'>รายละเอียด - DESCRIPTIONS</div>"),
                                                                                                        // $("<p><div style = 'margin-left: 10px' id='first-name'></div></p>"),
                                                                                                        $("<p><div style = 'margin-left: 10px' id='fileUploader'></div></p>"),
                                            
                                                                                                    );
                                                                                                },
                                                                                               
                                                                                            }).dxPopup("instance");
                                            
                                                                                            const fileUploader = $('#file-uploader').dxFileUploader({
                                                                                                multiple: false,
                                                                                                accept: 'image/*', //'*',
                                                                                                value: [],
                                                                                                uploadMode: 'instantly', //'instantly', 'useButtons'
                                                                                                uploadUrl: 'https://js.devexpress.com/Demos/NetCore/FileUploader/Upload',
                                                                                                onValueChanged(e) {
                                                                                                    const files = e.value;
                                                                                                    if (files.length > 0) {
                                                                                                        $('#selected-files .selected-item').remove();
                                                                                                        $.each(files, (i, file) => {
                                                                                                            const $selectedItem = $('<div />').addClass('selected-item');
                                                                                                            $selectedItem.append(
                                                                                                                $('<span />').html(`Name: ${file.name}<br/>`),
                                                                                                                $('<span />').html(`Size ${file.size} bytes<br/>`),
                                                                                                                $('<span />').html(`Type ${file.type}<br/>`),
                                                                                                                $('<span />').html(`Last Modified Date: ${file.lastModifiedDate}`),
                                                                                                            );
                                                                                                            $selectedItem.appendTo($('#selected-files'));
                                                                                                        });
                                                                                                        $('#selected-files').show();
                                                                                                    } else { $('#selected-files').hide(); }
                                                                                                },
                                                                                            }).dxFileUploader('instance');
                                                  
                                            
                                                                                            $("#fileUploader").dxFileUploader({
                                                                                                multiple: false,
                                                                                                accept: 'image/*',
                                                                                                //allowedFileExtensions: [".jpg", ".jpeg", ".png"],
                                                                                                maxFileSize: 4000000, // 4 MB
                                                                                                uploadUrl: "https://cbsdev3.locktonwattana.com/wwwroot/Uploads",
                                                                                                onValueChanged: function (e) {
                                                                                                    var files = e.value;
                                                                                                    if (files.length > 0) {
                                                                                                        var file = files[0];
                                                                                                        var formData = new FormData();
                                                                                                        formData.append("file", file);
                                                                                                        //formdata.append("FilePath",�"test");
                                                                                                        $.ajax({
                                                                                                            url: "https://cbsdev3.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAExx", //"http://wikran-w10:8081/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAExx",
                                                                                                            type: "POST",
                                                                                                            timeout: 0,
                                                                                                            headers: { "ref": "44095B6C-CC17-47FD-895B-649E0EAA2BAE", "Content-Type": "multipart/form-data;boundary=<calculated when request is sent>" }, //"Content-Type", "multipart/form-data;boundary=<calculated when request is sent>" //"multipart/form-data"
                                                                                                            mimeType: "multipart/form-data",
                                                                                                            data: formData,
                                                                                                            processData: false,
                                                                                                            contentType: false,
                                                                                                            success: function (response) {
                                                                                                                console.log("File uploaded successfully!");
                                                                                                            },
                                                                                                            error: function (error) {
                                                                                                                console.log("Error uploading file: " + error);
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                }
                                                                                            });
                                            
                                            
                                                                                            $('#first-name').dxTextBox({
                                                                                                value: 'John',
                                                                                                name: 'FirstName',
                                                                                            });
                                            
                                                                                            $('#last-name').dxTextBox({
                                                                                                value: 'Smith',
                                                                                                name: 'LastName',
                                                                                            });
                                                                                    
                                                                                            $('#button').dxButton({
                                                                                                text: 'Update profile',
                                                                                                type: 'success',
                                                                                                onClick() {
                                                                                                    DevExpress.ui.dialog.alert('Uncomment the line to enable sending a form to the server.', 'Click Handler');
                                                                                                    // $("#form").submit();
                                                                                                },
                                                                                            });
                                                                                        });
                                                                                    } */

                                        }) //then fetch (HOR or HR Email get inside better ?)
                                }) //then fetch (ACCCODE)

                        });
                        // TOP PRG
                    });  // ajax  

            }); // load help
    });  // FIRST PRG 

{/* </script> */}
    