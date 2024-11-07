
window.onload = function () {
    setTimeout(function () {
        location.reload();
    }, 24000000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
}
$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
//console.clear(); var mydata = JSON.parse(data);

var aRightsGroup = [
    {
        "FullRightsName": "nuserm",
        "Description": "Medical",
    },
    {
        "FullRightsName": "nuserm,nusert,nusero",
        "Description": "Medical/Travel & Entertainment/Others",
    },
    {
        "FullRightsName": "nusert",
        "Description": "Travel & Entertainment",
    },
    {
        "FullRightsName": "nusero",
        "Description": "Others",
    },
    {
        "FullRightsName": "nuserf",
        "Description": "Fleet Card",
    },
    {
        "FullRightsName": "nusertrf",
        "Description": "Travel Requisition Form",
    },
    {
        "FullRightsName": "nuserm,nusert,nusero",
        "Description": "Standard Expenses Reimbursement",
    },
    {
        "FullRightsName": "nuserm,nusert,nusero,nuserf",
        "Description": "All Expenses Reimbursement",
    },
    {
        "FullRightsName": "hrSupervisor",
        "Description": "HR Supervisor",
    },
    {
        "FullRightsName": "faSupervisor",
        "Description": "FA Supervisor",
    },
    {
        "FullRightsName": "faStaff",
        "Description": "FA Staff",
    },
    {
        "FullRightsName": "HODApp",
        "Description": "HOD Approver",
    },
    {
        "FullRightsName": "HODRpt",
        "Description": "HOD Report",
    },
    {
        "FullRightsName": "*DEL*",
        "Description": "Delete Group Rights",
    },
]

var aRightsAdmin = [
    {
        "FullRightsName": "admin",
        "Description": "Administrator (TOP)",
    },
    {
        "FullRightsName": "nuserm",
        "Description": "Medical",
    },
]
//$.extend( true, aRightsGroup, aRightsAdmin );

var aaXToX = localStorage["aaXXoX"];
var aaXNoX = localStorage["aaXXuX"];
var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492"; //Master Page
var aaPXXI = localStorage["aPXIXD"];
//             elementAttr: {class: "ablueclass"}
var aThemeList = [
    { thid: "generic.light", text: "light", icon: "fas fa-paint-roller", Category: "Generic", visible: false },
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

const afilterObj = (arr, searchKey) => {
    return arr.filter(obj => Object.keys(obj).some(key => obj[key].includes(searchKey)));
}
const aSelectFreeKey = (arr, searchKey) => {
    var cckk = arr.filter(obj => Object.keys(obj).some(key => obj[key].includes(searchKey)));
    if (cckk.length === 0) {
        return "531ccded-9b9d-472e-9608-bc76554899c0" //U013
    } else {
        return cckk[0].TokenKey
    }
}
//console.log(afilterObj(UserStd,"xxx")) //"Wikran I."
// Function for Load Master Data for dropdown and others
// "https://cbsdev2.locktonwattana.com","[lockthbnk-ap14].ExtraOnLine.dbo.XOLStaff","EMPCode,FullNameThai,FullNameEng,EffectiveDate,ResignDate,Dept,DivCode,EmailAddress","aaOBJDT"
/*
        const aGetDataAPI = (aDMZServer, aFullTableName, aFieldSelected, aOBJsName) => {
            let aLocalSQLToken = "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232"; // with select command
            let aLocalNonQueryToken = "9DE8BDB8-8EE0-48D0-A506-9AD24F151F9A"; // no select command
            let aaXPUB = "A75FCC75-8FB6-4460-B3F6-7070B4437930"; //Public Key
            
            //var aDMZServer = "https://cbsdev2.locktonwattana.com";
            //var aOBJsName = "aaOBJDT"
            //var aSQLServerName ="[lockthbnk-ap14]"
            //var aSQLDatabaseName = ".ExtraOnLine.dbo."
            //var aSQLTableName = "XOLStaff"
            //var aFullTableName = aSQLServerName + aSQLDatabaseName + aSQLTableName ;
            //var aFieldSelected = "EMPCode,FullNameThai,FullNameEng,EffectiveDate,ResignDate,Dept,DivCode,EmailAddress" ;
            //var aWhereCause = "Where " 
            
            let aFullBody = "Select " + aFieldSelected + " From " + aFullTableName;

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            var raw = JSON.stringify({
                "@": aFullBody
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            let aURL = aDMZServer + "/DMQ/" + acPRJ + "/" + aaXPUB + "/" + aLocalSQLToken;

            fetch(aURL, requestOptions)
                .then(response => response.json())
                //
                .then(aData => {
                    //var aal = btoa(aData[0].Gright); 
                    //Console.log(aData) // works
                    //aaObjData = aData;
                    localStorage.setItem(aOBJsName, JSON.stringify(aData));
                })
        }
*/
var aAUserStandard;
fetch('UserStd.json')
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(aAUserStandard => {
        console.log("UserStd: ", aAUserStandard);
    })
    .catch(function (error) {
        console.log('There was a problem with the fetch operation:', error.message);
    });


var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
var aaKeyField = localStorage["aaXKFX"];
var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492";
var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost();
var aaPFDMZz = aaPFDMI; //"https://cbsdev2.locktonwattana.com"; //"https://cbsdev2.locktonwattana.com"; // API for DMZ only

var afqrFull = "pageID = '" + aaPXIXD + "' "
var afURL = aaPFDMI + "/DMQ/" + acPRJ + "/" + atob(aaXToX) + '/' + aaXTXB + '/all' //+ aaPXXI aaXTXB "326459ff-7ea6-4465-a946-9326b783d492"
var afsettings = {
    "url": afURL,
    "method": "POST",
    "timeout": 0,
    "headers": { "Content-Type": "application/json" },
    "data": JSON.stringify({ "@": afqrFull }), //"�pageID='Resigned'�"
};
var jqxhr = $.post(afsettings, function (e) { })
    .done(function (e) {
        //console.log("set aaTBKey");
        aObjMPage = e;
        var aaKeyField = aObjMPage[0].PrimaryKey;
        var aaTBKey = aObjMPage[0].TBKey;
        //console.log(aaTBKey)

        //$(function () { TOP PRG
        $(() => {
            // Load Data for [Employee] DropDown Selection   
            let aqr2S = "Where Status != 'Resigned'"
            let aFieldSelected = "EMPCode,FullNameThai,FullNameEng,Dept,DivCode,EmailAddress,Position,AccDeptCode,AccDivCode"
            let aFullBody = "Select " + aFieldSelected + " From " + "[lockthbnk-ap14].ExtraOnLine.dbo.XOLStaffs " + aqr2S;
            fetch(aaPFDMZz + "/DMQ/" + acPRJ + "/" + atob(aaXToX) + "/" + "3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "@": aFullBody }), redirect: "follow" })
                .then(response => response.json())
                //
                .then(aData => {
                    var aaEmployee = aData;
                    var aMMaMx = atob(localStorage["aaXrXg"])
                    var aRRgRs = aMMaMx.split('0');
                    var aDDeDx = aRRgRs[0];
                    var aRrgSx = aRRgRs[1];
                    if (jQuery.type(aRrgSx) === "undefined") {
                        aRrgSx = "377B";
                    }
                    //alert(aDDeDx)
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
                        var aCancelStyle = "contained";
                    } else {
                        var aUpdateText = "xxx";
                        var aSaveVisible = 0;
                        var aCancelText = "EXIT";
                        var aCancelicon = "fas fa-sign-out-alt";
                        var aCancelType = "success";
                        var aCancelStyle = "contained";
                    }
                    var arDataD = aRolesAction(aRrgSx, nDataPos, 3);
                    var arExcelEx = aRolesAction(aRrgSx, nExcelPos, 2);
                    var arPDFEx = aRolesAction(aRrgSx, nPDFPos, 2);
                    var aUsrEdit = false;
                    var aAdminEdit = false;
                    var ahrSuperEdit = false;
                    var aScF = "/all"
                    var aqrFull = "IDUsr != '' "
                    var nFoundn = aDDeDx.search("admin")
                    if (nFoundn === -1) { //$.trim(aDDeDx) !== "admin"
                        aScF = "/" + $.trim(aaUsrN);
                        aqrFull = "IDUsr = '" + $.trim(aaUsrN) + "' "
                        aUsrEdit = true
                    }
                    var nFoundnShr = aDDeDx.search("hrSupervisor") //hrSupervisor
                    //alert(nFoundnShr)
                    if (nFoundnShr !== -1) { //$.trim(aDDeDx) !== "admin"
                        aScF = "/" + $.trim(aaUsrN);
                        var aqrFull = "IDUsr != '' "
                        aUsrEdit = false;
                        aAdminEdit = false;
                        ahrSuperEdit = true;
                    }
                    if (aUsrEdit === false && ahrSuperEdit === false) {
                        aAdminEdit = true;
                        $.extend(true, aRightsGroup, aRightsAdmin);
                    }

                    //var aqrFull = "IDUsr != '' " //"Status LIKE 'Active%'" //"Dept = '1196'" // "Password !LIKE '%\%"
                    var aurl = aaPFDMI + "/DMQ/" + acPRJ + "/" + atob(aaXToX) + '/' + aaTBKey + '/all'

                    var settings = {
                        "url": aurl,
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                            "@": aqrFull
                        }),
                    };

                    $("#gridContainer").dxDataGrid({

                        dataSource: new DevExpress.data.CustomStore({
                            key: "IDUsr", //aaKeyField, //
                            loadMode: "omit",
                            //load: function () { return $.post(settings).done();  },// function (response) { console.log(response);}
                            load: function () {
                                return fetch(aurl, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ "@": aqrFull }), //
                                })
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(data => {
                                        console.log(data);
                                        // Process the data and populate the datagrid here
                                        return data;
                                    })
                            },
                            insert: function (values) {
                                if (aaEnt) {
                                    var ObjKeyData = { EntryBy: aaUsrN, EntryDate: new Date() };
                                    var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                }
                                else {
                                    var ObjRowData = JSON.stringify(values);
                                }
                                sendRequestNew("Insert", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            },
                            update: function (key, values) {
                                //console.log( aaKeyField );
                                var ObjKeyData = { "IDUsr": $.trim(key) };   //[aaKeyField] key.trim
                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                sendRequestNew(aUpdateText, ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            },
                            remove: function (key) {
                                var ObjKeyData = { "IDUsr": $.trim(key) };   //[aaKeyField] key.trim
                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                                sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            }
                        }),

                        allowColumnReordering: true,
                        allowColumnResizing: true,
                        columnMinWidth: 20,
                        columnChooser: {
                            enabled: true
                        },
                        showBorders: true,
                        sorting: {
                            mode: "multiple"
                        },
                        selection: {
                            mode: 'single' //'multiple'
                        },
                        groupPanel: {
                            visible: true
                        },
                        filterRow: {
                            visible: true,
                            applyFilter: "auto"
                        },
                        headerFilter: {
                            visible: true,
                            allowSearch: true,
                        },
                        grouping: {
                            autoExpandAll: true,
                        },
                        searchPanel: {
                            visible: true
                        },
                        paging: {
                            pageSize: 15
                        },
                        pager: {
                            showPageSizeSelector: true,
                            allowedPageSizes: [5, 10, 15, 20, 50],
                            showInfo: true
                        },
                        showBorders: true,
                        groupPaging: true,
                        showColumnLines: true,
                        showRowLines: true,
                        rowAlternationEnabled: true,

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
                                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MainUsrs' + '.xlsx');
                                });
                            });
                            e.cancel = true;
                        },
                        onEditorPreparing: function (e) {
                            if (e.parentType === "dataRow" && arDataU === 0) {
                                e.editorOptions.disabled = true;
                            } else {
                                if (ahrSuperEdit) {
                                    if (e.parentType === "dataRow" && (e.dataField === "IDUsr")) {
                                        e.editorOptions.disabled = true;
                                    }
                                }
                            }
                        },
                        //
                        //
                        // Editing
                        editing: {
                            mode: "popup",
                            useIcons: true,
                            allowUpdating: true,
                            allowDeleting: arDataD,
                            allowAdding: (arDataC || ahrSuperEdit === true),
                            //editorStylingMode: "outlined",
                            popup: {
                                title: "Main User Setup",
                                fullScreen: false,
                                showTitle: true,
                                width: 1120,
                                height: 810,
                                position: {
                                    my: "top",
                                    at: "top",
                                    of: "window"
                                },
                                onContentReady: function (e) {
                                    e.component.option('toolbarItems[0].visible', aSaveVisible); //stylingMode
                                    e.component.option('toolbarItems[0].options.icon', 'save');
                                    e.component.option('toolbarItems[0].options.type', 'success');
                                    e.component.option('toolbarItems[0].options.stylingMode', 'contained');
                                    e.component.option('toolbarItems[1].options.text', aCancelText);
                                    e.component.option('toolbarItems[1].options.icon', aCancelicon);
                                    e.component.option('toolbarItems[1].options.type', aCancelType);
                                    e.component.option('toolbarItems[1].options.stylingMode', aCancelStyle);
                                }
                            }
                        },
                        // column list
                        columns: [
                            {
                                type: "buttons",
                                width: 35,
                                visible: function (e) { return ((e.row.data.IDUsr === aaXNoX) || aUsrEdit) }, //(ahrSuperEdit === true || aUsrEdit), && ahrSuperEdit === true
                                buttons: [
                                    {
                                        hint: "Edit My User Information",
                                        icon: "fas fa-pen",
                                        visible: function (e) { return ((e.row.data.IDUsr === aaXNoX) || aUsrEdit) }, //&& ahrSuperEdit === true
                                        //visible: function (e) {
                                        //    //return !e.row.isEditing;
                                        //    return (e.row.data.ID === 1) //false;
                                        // },
                                        onClick: function (e) {
                                            if (e.row.data.IDUsr === aaXNoX) {
                                                EditUserProfiles(e.row.data); //aPopUpEditForm
                                                e.component.refresh(true);
                                                e.component.refresh(true);
                                                e.component.refresh(true);
                                                e.component.refresh(true);
                                                e.event.preventDefault();
                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                                $("#gridContainer").dxDataGrid("instance").refresh();
                                            }
                                        }

                                    }

                                ],
                            },
                            {
                                type: "buttons",
                                width: 60,
                                visible: aAdminEdit,
                                buttons: ["edit", "delete"]
                            },
                            {
                                type: "buttons",
                                width: 60,
                                visible: ahrSuperEdit,
                                buttons: ["edit"] //, "delete"
                            },
                            {
                                dataField: "Scopebase",
                                caption: "Staff ID",
                                editCellTemplate: dropDownBoxEMP,
                                setCellValue: function (newData, value, currentRowData) {
                                    if (arDataU === 1) { //&& ahrSuperEdit === false
                                        let aResult = aSearchjson(aaEmployee, value);
                                        let aEmailAdd = $.trim(aResult[0].EmailAddress);
                                        let aNickArray = aResult[0].EmailAddress.split('@');
                                        let aaUserNa = $.trim(aNickArray[0]);
                                        let aSendOTP = "YES"
                                        if (aaUserNa === "-") {
                                            let aUserArray = aResult[0].FullNameEng.split(" ");
                                            aaUserNa = $.trim(aUserArray[0]);
                                            aEmailAdd = "No Email Address"
                                            aSendOTP = "NO"
                                        }
                                        newData.Scopebase = $.trim(value);
                                        newData.Pword = "Password123" //'pwd' + $.trim(value);
                                        newData.Department = $.trim(aResult[0].AccDeptCode);
                                        newData.Division = $.trim(aResult[0].AccDivCode);
                                        newData.email = aEmailAdd; //aResult[0].EmailAddress;
                                        newData.Nickname = aResult[0].FullNameThai;
                                        newData.LGName = aResult[0].FullNameEng;
                                        newData.IDUsr = aaUserNa.toLowerCase();
                                        newData.Description = $.trim(aResult[0].Position);
                                        newData.Kright = "material.blue.light.compact";
                                        newData.PictureLoc = "./images/userss.png";
                                        newData.otp = aSendOTP;
                                        newData.Tkey = aSelectFreeKey(UserStd, aResult[0].FullNameEng)
                                    }
                                },

                                editorOptions: { width: 150 },
                                validationRules: [{ type: 'required', message: 'Staff ID is required' }],
                                width: 150,
                                visible: false,
                            },
                            {
                                dataField: "LGName",
                                caption: "Name",
                                dataType: "string",
                                editorOptions: { width: 450, readOnly: ahrSuperEdit },
                                width: 300,
                            },
                            {
                                dataField: "Nickname",
                                caption: "Thai Name",
                                dataType: "string",
                                editorOptions: { width: 450, readOnly: ahrSuperEdit },
                                width: 300,
                            },
                            {
                                dataField: "Department",
                                caption: "Department (ACC)",
                                dataType: "string",
                                sortOrder: "asc",
                                allowHiding: false,
                                validationRules: [{ type: 'required', message: 'Department is required' }],
                                groupIndex: 0,
                                editorOptions: { width: 450, },//readOnly: ahrSuperEdit 
                                width: 120,
                                //visible: false,
                            },
                            {
                                dataField: "Tkey",
                                caption: "Token Key",
                                dataType: "string",
                                lookup: {
                                    dataSource: UserStd, // //EMPCode,FullNameThai
                                    valueExpr: "TokenKey",
                                    displayExpr: "UserName",
                                },
                                setCellValue: function (newData, value, currentRowData) {
                                    if (arDataU === 1) {
                                        newData.Tkey = value;
                                    }
                                },
                                editorOptions: { width: 450, readOnly: ahrSuperEdit },
                                width: 450,
                                visible: false,
                            },
                            {
                                dataField: "Division",
                                caption: "Division (ACC)",
                                dataType: "string",
                                editorOptions: { width: 450, }, //readOnly: ahrSuperEdit 
                                width: 150,
                                //visible: false,
                            },
                            {
                                dataField: "TGR", //"Gright",//
                                caption: "Rights Select (Select for Group Rights)",
                                dataType: "string",
                                editCellTemplate: dropDownRights,
                                setCellValue: function (newData, value, currentRowData) {

                                    let aPreGR = ""
                                    if (currentRowData.Gright === undefined || currentRowData.Gright === "") { aPreGR = "" } else { aPreGR = currentRowData.Gright + ',' }
                                    if (value === "*DEL*") {
                                        newData.Gright = "";
                                    } else {
                                        newData.Gright = aPreGR + value;
                                    }

                                },
                                editorOptions: { width: 450 },
                                width: 450,
                                visible: false,
                            },
                            {
                                dataField: "Gright", //"TGR", //
                                caption: "Group Rights",
                                dataType: "string",
                                editorOptions: { width: 450, showClearButton: true, readOnly: ahrSuperEdit }, //, stylingMode: 'filled'
                                width: 450,
                                visible: false,
                            },
                            {
                                dataField: "IDUsr",
                                caption: "Username",
                                dataType: "string",
                                sortOrder: "asc",
                                validationRules: [{ type: 'required', message: 'User ID(Username) is required' }],
                                editorOptions: { width: 450, readOnly: ahrSuperEdit },
                                width: 150,
                            },
                            {
                                dataField: "Pword",
                                caption: "Password",
                                dataType: "string",
                                editorOptions: { width: 450, readOnly: ahrSuperEdit, }, //mode: "password", mode: "password",
                                width: 450,
                                visible: false,
                            },
                            {
                                dataField: "email",
                                caption: "Email",
                                dataType: "string",
                                editorOptions: { width: 450, }, //, readOnly: ahrSuperEdit
                                width: 250,
                            },

                            {
                                dataField: "telephone",
                                caption: "Telephone",
                                dataType: "string",
                                editorOptions: { width: 450, readOnly: ahrSuperEdit },
                                width: 250,
                                visible: false,
                            },
                            {
                                dataField: "Description",
                                caption: "Position",
                                dataType: "string",
                                editorOptions: { width: 450, },//readOnly: ahrSuperEdit
                                width: 450,
                                visible: false,
                            },
                            {
                                dataField: "Kright",
                                caption: "Theme",
                                dataType: "string",
                                width: 250,
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    width: 250,
                                    dataSource: aThemeListGroup,
                                    valueExpr: "thid",
                                    displayExpr: "text",
                                    grouped: true,
                                    readOnly: ahrSuperEdit
                                },
                                visible: false,
                            },
                            {
                                dataField: "otp",
                                caption: "OTP",
                                dataType: "string",
                                width: 80,
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    items: ["YES", "NO"],
                                    searchEnabled: true,
                                    //value: '',
                                    width: 80,
                                    //readOnly: ahrSuperEdit
                                },
                                //editorOptions: { width: 80}, //StylingMode: 'filled', labelMode: 'floating',
                                visible: false,
                            },
                            {
                                dataField: "PictureLoc",
                                caption: "Picture",
                                width: 150,
                                editorType: 'dxSelectBox',
                                editorOptions: {
                                    width: 150,
                                    readOnly: ahrSuperEdit,
                                    dataSource: aAvatar,
                                    displayExpr: 'Name',
                                    valueExpr: 'ImageSrc',
                                    value: aAvatar[20].ImageSrc,
                                    fieldTemplate(data, container) {
                                        const result = $(`<div class='custom-item' ><center><img src='${data ? data.ImageSrc : ''}' style='display: block; margin-top: 25px;' width='60' /></center><div class='avatar-name'></div></div>`); //<div class='avatar-name'></div>
                                        result
                                            .find('.avatar-name')
                                            .dxTextBox({
                                                //value: data && data.Name, //data && & data.Name
                                                readOnly: true,
                                            });
                                        container.append(result);
                                    },
                                    itemTemplate(data) {
                                        return `<div class='custom-item'><center><img src='${data.ImageSrc}' width="40"/></center><div class='avatar-name'></div></div>`; //<div class='avatar-name'>${data.Name}</div>
                                    },
                                },
                                /*  allowFiltering: false,
                                  allowSorting: false,
                                  cellTemplate: function (container, options) {
                                      $("<div>")
                                          .append($("<img>", { "src": options.value }))
                                          .appendTo(container);
                                  } */
                                visible: false
                            },
                            {
                                dataField: "Active",
                                caption: "Active",
                                dataType: "string",
                                width: 50,
                                editorType: "dxSwitch",
                                editorOptions: { width: 50, readOnly: ahrSuperEdit },
                                visible: false,
                            },


                        ],
                        // summary
                        summary: {
                            recalculateWhileEditing: true,
                            skipEmptyValues: false,
                            totalItems: [
                                {
                                    column: "IDUsr",
                                    summaryType: "count",
                                    //          summaryType: "max",
                                    //          valueFormat: "currency",
                                    showInGroupFooter: false,
                                    alignByColumn: true,
                                    displayFormat: "{0} Items",
                                },

                            ],
                            groupItems: [
                                {
                                    column: "Department",
                                    summaryType: "count",
                                    displayFormat: "{0} Items",
                                    //showInGroupFooter: true,
                                    //alignByColumn: true,                            

                                },
                                /*
                                {
                                    column: "LocalAmount",
                                    summaryType: "sum",
                                    valueFormat: "#,##0.00",
                                    showInGroupFooter: true,
                                    alignByColumn: true,
                                    displayFormat: "{0}",
                                },
                                {
                                    column: "RefundedAmount",
                                    summaryType: "sum",
                                    valueFormat: "#,##0.00",
                                    showInGroupFooter: true,
                                    alignByColumn: true,
                                    displayFormat: "{0}",
                                },*/
                            ],
                        },
                        // Tool Bar
                        onToolbarPreparing: function (e) {
                            var dataGrid = e.component;
                            e.toolbarOptions.items.unshift(
                                {
                                    location: "after",
                                    widget: "dxButton",
                                    type: "success",
                                    options: {
                                        icon: 'collapse',
                                        text: 'Collapse All',
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
                                        text: "Export to PDF",
                                        onClick: function () {
                                            const doc = new jsPDF();
                                            //doc.addFont("font/ANGSA.ttf", "angsana", "normal"); //Pridi-Regular.ttf
                                            doc.addFont("font/Pridi-Regular.ttf", "Pridi", "normal");
                                            //doc.addFont("font/Prompt-ExtraLight.ttf", "Prompt", "normal"); // load thai font (in font location Google Font)
                                            doc.setFont("Prompt", "normal"); // set to thai font
                                            DevExpress.pdfExporter.exportDataGrid({
                                                jsPDFDocument: doc,
                                                component: dataGrid,
                                                customizeCell: function (options) {
                                                    const { gridCell, pdfCell } = options;

                                                    //if(gridCell.rowType === 'data') {
                                                    //set font and font size
                                                    pdfCell.styles = {
                                                        font: 'Pridi', //Prompt
                                                        fontSize: 10
                                                    }
                                                    //}
                                                }
                                            }).then(function () {
                                                doc.save('MainUser' + '.pdf');
                                            });
                                        }
                                    }
                                },
                                {
                                    location: "after",
                                    widget: "dxButton",
                                    options: {
                                        icon: "refresh",
                                        onClick: function () {
                                            dataGrid.refresh();
                                        }
                                    }
                                }
                            );
                        }
                    }).dxDataGrid("instance");

                    function EditUserProfiles(iData) { //,aaSS,nOfRec
                        //console.log(aaSS)
                        var aOldPwd = iData.Pword

                        jQuery(function ($) {
                            // ...
                            //var gbxRateV = 1;
                            const popup = $("#ChangeProfilePopUp").dxPopup({
                                title: "Edit User Profiles",
                                width: '1000px',
                                height: '500px',
                                position: { offset: "0 -140" }, //{offset: "0 -180"},
                                //position: {offset: "40 -200"}, //{my:"top", at:"top", of:window},
                                visible: true,
                                fullScreen: false,
                                showCloseButton: false,
                                showTitle: true,
                                dragEnabled: true,
                                closeOnOutsideClick: false,
                                resizeEnabled: true,
                                //shadingColor:"rgb(190,190,190,0.9)",
                                //toolbarItems: [{toolbar:"top", html: "<span id='popupexit'></span>"}],
                                //toolbarItems: [
                                //    {toolbar:"top", html:"<div padding-top: -7px;><center><img src='./images/locktonlogo70mmblack.png' width='88'></center></div>"}],            
                                contentTemplate: function () {
                                    return $("<div />").append(
                                        $("<p><div id='aUserProfilefform'></div></p>"), //acStatus
                                        $("<p><div id='ConfirmR' style='margin:5px;'></div>"),
                                        $("<div id='popupexit' style='margin:5px;'></div></p>"),

                                    );
                                },
                                toolbarItems: [
                                    {
                                        toolbar: "top",
                                        locateInMenu: 'always',
                                        //html: "<div padding-top: -7px;><img src='./images/locktonlogo70mmblack.png' width='85'></div>"
                                    },

                                ]

                            }).dxPopup("instance");

                            const formUserProfile = $("#aUserProfilefform").dxForm({
                                formData: iData,
                                showColonAfterLabel: false,
                                labelLocation: "top",
                                colCount: 3,

                                items: [
                                    {
                                        itemType: "group",
                                        //caption: "User Profiles",
                                        //width: 500,
                                        colCount: 1,
                                        items: [
                                            {
                                                dataField: "LGName",
                                                label: { text: "ENG Name" },
                                                editorOptions: { readOnly: true },
                                            },


                                            {
                                                dataField: "Department",
                                                label: { text: "Department" },
                                                editorOptions: { readOnly: true },
                                            },
                                            {
                                                dataField: "email",
                                                label: { text: "Mail Address" },
                                                editorOptions: { readOnly: true },
                                            },

                                            {
                                                dataField: "Description",
                                                label: { text: "Description" },
                                                editorOptions: { readOnly: true },
                                            },
                                        ]
                                    },
                                    {
                                        itemType: "group",
                                        //caption: "User Profiles",
                                        //width: 500,
                                        colCount: 1,
                                        items: [

                                            {
                                                dataField: "Nickname",
                                                label: { text: "THA Name" },
                                                editorOptions: { readOnly: true },
                                            },
                                            {
                                                dataField: "Division",
                                                label: { text: "Division" },
                                                editorOptions: { readOnly: true },
                                            },

                                            {
                                                dataField: "telephone",
                                                label: { text: "Telephone" },
                                                editorOptions: { readOnly: true },
                                            },
                                            {
                                                dataField: "Kright",
                                                label: { text: "Theme Selection" },
                                                //width: 250,
                                                editorType: 'dxSelectBox',
                                                editorOptions: {
                                                    //width: 250,
                                                    dataSource: aThemeListGroup,
                                                    valueExpr: "thid",
                                                    displayExpr: "text",
                                                    grouped: true,
                                                },
                                            },

                                        ]
                                    },
                                    {

                                        itemType: "tabbed",
                                        tabPanelOptions: {
                                            deferRendering: false
                                        },
                                        tabs: [
                                            {
                                                title: "Avatar",
                                                colCount: 1,
/*                                                items: [
                                
                                                        itemType: "group",
                                                        //caption: "User Profiles",
                                                        colCount: 1,

*/                                               items: [
                                                    {
                                                        dataField: "PictureLoc",
                                                        label: { text: "Picture" },
                                                        width: 150,
                                                        editorType: 'dxSelectBox',
                                                        editorOptions: {
                                                            width: 150,
                                                            dataSource: aAvatar,
                                                            displayExpr: 'Name',
                                                            valueExpr: 'ImageSrc',
                                                            //value: aAvatar[20].ImageSrc,
                                                            fieldTemplate(data, container) {
                                                                const result = $(`<div class='custom-item' ><center><img src='${data ? data.ImageSrc : ''}' style='display: block; margin-top: 25px;' width='60' /></center><div class='avatar-name'></div></div>`); //<div class='avatar-name'></div>
                                                                result
                                                                    .find('.avatar-name')
                                                                    .dxTextBox({
                                                                        readOnly: true,
                                                                    });
                                                                container.append(result);
                                                            },
                                                            itemTemplate(data) {
                                                                return `<div class='custom-item'><center><img src='${data.ImageSrc}' width="40"/></center><div class='avatar-name'></div></div>`; //<div class='avatar-name'>${data.Name}</div>
                                                            },
                                                        },
                                                    }
                                                ]

                                            }
                                            , {
                                                title: "User & Password",
                                                colCount: 1,
                                                items: [
                                                    {
                                                        dataField: "IDUsr",
                                                        label: { text: "Username" },
                                                        editorOptions: { readOnly: true },
                                                    },
                                                    /*{
                                                        dataField: "Pword",
                                                        label: { text: "Password" },
                                                        editorOptions: { mode: "password" },
                                                    },*/
                                                    {
                                                        dataField: 'Pword',
                                                        label: { text: "Password" },
                                                        editorType: "dxTextBox",
                                                        editorOptions: {
                                                            mode: 'text', // 'text' 'password'
                                                            stylingMode: 'filled',
                                                            /*buttons: [{
                                                                name: 'password',
                                                                location: 'after',
                                                                options: {
                                                                    icon: 'fas fa-lock',
                                                                    type: 'default',
                                                                    onClick(e) {
                                                                        //passwordEditor.option('mode', passwordEditor.option('mode') === 'text' ? 'password' : 'text');
                                                                        e.component.option("mode", e.component.option("mode") === "text" ? "password" : "text");
                                                                    },
                                                                },
                                                            }],*/
                                                        }, //'password',
                                                        //validationGroup: "loginGrup",
                                                        setCellValue: function (newData, value, currentRowData) {
                                                            console.log("--pwd--")
                                                            console.log(currentRowData.Active)
                                                            console.log(value)
                                                            console.log(currentRowData.Pword)
                                                            if (currentRowData.Pword !== value) {
                                                                newData.Active = 1;
                                                            } else {
                                                                newData.Active = 0;
                                                            }
                                                        },
                                                        validationRules: [{
                                                            type: 'required',
                                                            message: 'Password is required',
                                                        }, {
                                                            type: 'stringLength',
                                                            min: 6,
                                                            message: 'Password must have at least 6 symbols',
                                                        }],
                                                    },
                                                    /*
                                                    {
                                                        label: {
                                                            text: 'Confirm Password',
                                                        },
                                                        editorType: 'dxTextBox',
                                                        editorOptions: {
                                                            mode: 'password',
                                                        },
                                                        validationRules: [
                                                            {
                                                                type: 'required',
                                                                message: 'Confirm Password is required',
                                                            },
                                                            {
                                                                type: 'compare',
                                                                message: "'Password' and 'Confirm Password' do not match",
                                                                comparisonTarget() {
                                                                    return formUserProfile.option('formData').Pword; //Password
                                                                },
                                                            }
                                                        ],
        
                                                    },
                                                   
                                                    {
                                                        itemType: 'button',
                                                        horizontalAlignment: 'left',
                                                        buttonOptions: {
                                                            text: 'Check',
                                                            type: 'success',
                                                            useSubmitBehavior: true,
                                                        },
        
                                                    }, */
                                                ]
                                            }
                                        ] // tab

                                    }


                                ],
                                /*items: [
                                    {
                                        itemType: "group",
                                        caption: "User Profiles",
                                        colCount: 1,
                                        items: [{
                                                dataField: "PictureLoc",
                                                label: { text: "Picture" },
                                                width: 150,
                                                editorType: 'dxSelectBox',
                                                editorOptions: {
                                                    width: 150,
                                                    dataSource: aAvatar,
                                                    displayExpr: 'Name',
                                                    valueExpr: 'ImageSrc',
                                                    value: aAvatar[20].ImageSrc,
                                                    fieldTemplate(data, container) {
                                                        const result = $(`<div class='custom-item' ><center><img src='${data ? data.ImageSrc : ''}' style='display: block; margin-top: 25px;' width='60' /></center><div class='avatar-name'></div></div>`); //<div class='avatar-name'></div>
                                                        result
                                                            .find('.avatar-name')
                                                            .dxTextBox({
                                                                readOnly: true,
                                                            });
                                                        container.append(result);
                                                    },
                                                    itemTemplate(data) {
                                                        return `<div class='custom-item'><center><img src='${data.ImageSrc}' width="40"/></center><div class='avatar-name'></div></div>`; //<div class='avatar-name'>${data.Name}</div>
                                                    },
                                                },
                                            }
                                            ]                        
                                    }
                                ]*/

                            }).dxForm("instance");

                            $("#popupexit").dxButton({
                                icon: "fas fa-times",
                                type: "danger",
                                hint: "Cancel and Exit",
                                //stylingMode: "outlined",
                                text: "CANCEL",
                                width: "120px",
                                visible: true,
                                onClick: function () {
                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                    popup.hide();
                                }
                            });

                            $("#ConfirmR").dxButton({
                                //stylingMode: "outlined",
                                icon: "fas fa-check",
                                text: "Confirm",
                                type: "success",
                                //useSubmitBehavior: true,
                                width: "120px",
                                visible: true,
                                useSubmitBehavior: true,
                                //validationGroup: "loginGroup",
                                onClick: function () {
                                    //DevExpress.validationEngine.validateGroup("loginGroup");
                                    var anLen = $.trim(iData.Pword).length;
                                    //console.log(anLen)
                                    //console.log(iData.Active)
                                    //console.log(iData.Pword)
                                    //console.log(aOldPwd)
                                    if (iData.Pword !== aOldPwd) {
                                        iData.Active = 1
                                    }
                                    if (anLen >= 6) {
                                        let ObjRowD = JSON.stringify(iData)
                                        sendRequestNew("Update", ObjRowD, aaTBKey, aaPFDMI, atob(aaXToX)); //aaPFDMI aaPFDMZz
                                        // refresh before close popup ?
                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                        $("#gridContainer").dxDataGrid("instance").refresh();
                                        popup.hide();
                                    } else {
                                        DevExpress.ui.dialog.alert({
                                            showTitle: false,
                                            messageHtml: "<center><b style='color:Tomato;'>Password must have at least 6 symbols</b></center>"
                                        });
                                    }
                                }
                            });

                        });

                    }

                    function aSearchjson(aObjArr, asID) {
                        return aObjArr.filter( //aaEmployee
                            function (data) {
                                return data.EMPCode == asID
                            }
                        );
                    }


                    // DataGrid > Editing > Righta Access
                    function dropDownRights(cellElement, cellInfo) {
                        return $("<div>").dxDropDownBox({
                            dropDownOptions: { width: 600 },
                            dataSource: aRightsGroup,
                            value: [cellInfo.value],
                            valueExpr: "FullRightsName",
                            displayExpr: "FullRightsName",
                            contentTemplate: function (e) {
                                return $("<div>").dxDataGrid({
                                    dataSource: aRightsGroup,
                                    //remoteOperations: true, // EMPCode,FullNameThai
                                    columns: [{ dataField: "Description", caption: "Description", width: 250 }, { dataField: "FullRightsName", caption: "Rights Access", width: 250 }], //"EMPCode,FullNameThai,FullNameEng,EffectiveDate,ResignDate,Dept,DivCode,EmailAddress" 
                                    hoverStateEnabled: true,
                                    searchPanel: { visible: false },
                                    headerFilter: { visible: true },
                                    paging: { enabled: true, pageSize: 20 },
                                    filterRow: { visible: true },
                                    showBorders: true,
                                    showColumnLines: true,
                                    showRowLines: true,
                                    //rowAlternationEnabled: true,
                                    scrolling: { mode: "virtual" },
                                    selection: { mode: "single" },    //multiple  single             
                                    height: 400,
                                    selectedRowKeys: [cellInfo.value],
                                    //selectedRowKeys: [value],
                                    //focusedRowEnabled: true,
                                    focusedRowKey: cellInfo.value,
                                    onSelectionChanged: function (sArgs) {
                                        //console.log(sArgs.selectedRowKeys[0].EMPCode)
                                        e.component.option("value", sArgs.selectedRowKeys[0].FullRightsName); // Works but Error Need to correct next time !!!
                                        cellInfo.setValue(sArgs.selectedRowKeys[0].FullRightsName);
                                        if (sArgs.selectedRowKeys.length > 0) {
                                            e.component.close();
                                        }
                                    }
                                });
                            },
                        });
                    }

                    // DataGrid > Editing > Custome Editor
                    function dropDownBoxEMP(cellElement, cellInfo) {
                        return $("<div>").dxDropDownBox({
                            dropDownOptions: { width: 1000 },
                            dataSource: aaEmployee,
                            value: [cellInfo.value],
                            valueExpr: "EMPCode",
                            displayExpr: "EMPCode",
                            contentTemplate: function (e) {
                                return $("<div>").dxDataGrid({
                                    dataSource: aaEmployee,
                                    //remoteOperations: true, // EMPCode,FullNameThai
                                    columns: [{ dataField: "AccDeptCode", caption: "Dept", width: 100 }, { dataField: "EMPCode", caption: "ID", width: 80 }, { dataField: "FullNameThai", caption: "Thai Name", width: 200 }, { dataField: "FullNameEng", caption: "Eng Name", width: 200 }, { dataField: "Position", caption: "Position", width: 200 }], //"EMPCode,FullNameThai,FullNameEng,EffectiveDate,ResignDate,Dept,DivCode,EmailAddress" 
                                    hoverStateEnabled: true,
                                    searchPanel: { visible: true },
                                    headerFilter: { visible: true },
                                    paging: { enabled: true, pageSize: 15 },
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
                                        //console.log(sArgs.selectedRowKeys[0].EMPCode)
                                        //e.component.option("value", sArgs.selectedRowKeys[0].EMPCode); // Works but Error Need to correct next time !!!
                                        cellInfo.setValue(sArgs.selectedRowKeys[0].EMPCode);
                                        if (sArgs.selectedRowKeys.length > 0) {
                                            e.component.close();
                                        }
                                    }
                                });
                            },
                        });
                    }

                    /*
                    function xdropDownBoxEMP(cellElement, cellInfo) {
                        return $("<div>").dxDropDownBox({
                            dropDownOptions: { width: 600 },
                            dataSource: aaEmployee,
                            value: [cellInfo.value],
                            valueExpr: "EMPCode",
                            displayExpr: "EMPCode",
        
                            contentTemplate(e) {
                            const v = e.component.option('value');
                            const $dataGrid = $('<div>').dxDataGrid({
                                dataSource: aaEmployee, //e.component.getDataSource(),
                                columns: [{ dataField: "Dept", caption: "Dept", width: 100 }, { dataField: "FullNameThai", caption: "Thai Name", width: 200 }, { dataField: "FullNameEng", caption: "Eng Name", width: 200 }], 
                                hoverStateEnabled: true,
                                paging: { enabled: true, pageSize: 10 },
                                filterRow: { visible: true },
                                scrolling: { mode: 'virtual' },
                                height: 450,
                                selection: { mode: 'single' },
                                selectedRowKeys: v,
                                onSelectionChanged(selectedItems) {
                                const keys = selectedItems.selectedRowKeys;
                                e.component.option('value', keys);
                                },
                            });
        
                            dataGrid = $dataGrid.dxDataGrid('instance');
        
                            e.component.on('valueChanged', (args) => {
                                const { value } = args;
                                dataGrid.selectRows(value, false);
                            });
        
                            return $dataGrid;
                            },
                        });
                    }
                    */


                }) //then fetch (Employee)
        });
        // TOP PRG
    });  // ajax        
