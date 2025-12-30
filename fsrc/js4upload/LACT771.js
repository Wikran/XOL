// Task Control
// window.onload = function () {
//     setTimeout(function () {
//         location.reload();
//     }, 3000000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes
// }
$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
var aaXToX = localStorage["aaXXoX"];
var aaXNoX = localStorage["aaXXuX"];
var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492";
//var aaPXXI = localStorage["aPXIXD"];
var aaPXIXD = localStorage["aPXIXD"];
var aaEnt = aaPXIXD.includes("X");
// var aaKeyField = localStorage["aaXKFX"];
// var aaTBKey = localStorage["aaXTBX"];
var aaUsrN = localStorage["aaXXuX"];
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
var afqrFull = "pageID='" + aaPXIXD + "' "
var afURL = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "326459ff-7ea6-4465-a946-9326b783d492" + '/all' //+ aaPXXI
var afsettings = {
    "url": afURL,
    "method": "POST",
    "timeout": 0,
    "headers": { "Content-Type": "application/json" },
    "data": JSON.stringify({ "@": afqrFull }), //" pageID='Resigned' "
};
const aGetDateRefE = (aERSuf, aMSuf, nFtoL) => {
    let aNowDatev = new Date()
    let aYear2 = String(aNowDatev.getFullYear()).substring(2, 4);
    let aMonth2 = String(101 + aNowDatev.getMonth()).substring(1, 3);
    let aDate2 = String(100 + aNowDatev.getDate()).substring(1, 3);
    let aHour2 = String(100 + aNowDatev.getHours()).substring(1, 3);
    let aDateNow2 = aYear2 + aMonth2 + aDate2 + aMSuf + String(Date.now()).substring(5, nFtoL) // 5,16
    return aERSuf + aDateNow2 //+ aYear2 + aMonth2 + aDate2 + aHour2;
}
const aSaveCloneN = (iData, aaTBKey, aaPFDMI, aaXToX, NewDiv) => {
    let aaID = aGetDateRef("T").substring(1, 11); //aGetDateRefE("", "", 12) 
    let aObjKeyData = { IDNO: aaID }
    if (NewDiv !== undefined) {
        aObjKeyData = { IDNO: aaID, ApproveToDivision: NewDiv }
    }
    let aObjRowData = JSON.stringify($.extend({}, iData, aObjKeyData));
    sendRequestNew("Insert", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX))
}
var jqxhr = $.post(afsettings, function (e) { })
    .done(function (e) {
        //console.log("set aaTBKey");
        aObjMPage = e;
        var aaKeyField = aObjMPage[0].PrimaryKey;
        var aaTBKey = aObjMPage[0].TBKey;

        //TOP PRG
        $(() => {
            var aDatabasea = "ExtraOnLine.dbo.TaskControl";
            var aKeyField = "TaskGroup";
            var aKeyIDa = aaPXIXD; //"main"; //aaPXIXD;
            var axFieldSelected = "IDNO,TaskName,TaskProgram,TaskGroup";
            var aVARs = {};
            var aArrays = {};
            var aObjects = {};
            LoadSQLData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected)
                .then(result => {
                    if (!Array.isArray(result)) {
                        console.error("Unexpected result format:", result);
                        return;
                    }        
                    result.forEach(item => {
                        let aMatch = item.TaskName.match(/\[(.*?)\]/);
                        if (!aMatch) return;
        
                        let taskProgram = item.TaskProgram.replace(/`/g, "'");
        
                        if (item.TaskName.includes("{ARRAY}")) {
                            aArrays[aMatch[1]] = taskProgram
                                .split("\n")
                                .map(line => line.trim())
                                .map(line => (line === "" ? "" : isNaN(line) ? line : +line));
        
                        } else if (item.TaskName.includes("{T2O}")) {
                            let lines = taskProgram.split("\n");
                            aObjects[aMatch[1]] = lines
                                .map(line => {
                                    line = line.trim().replace(/,$/, "");
                                    line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                                    return JSON.parse(line);
                                })
                                .map(obj => {
                                    for (let key in obj) {
                                        if (key.includes("amt") && typeof obj[key] === "string") {
                                            obj[key] = +obj[key];
                                        }
                                    }
                                    return obj;
                                });        
                        } else if (item.TaskName.includes("{OBJ}")) {
                            aObjects[aMatch[1]] = taskProgram
                                .split("\n")
                                .reduce((obj, line) => {
                                    let [key, value] = line.trim().split(":").map(part => part.trim());
                                    if (key && value !== undefined) obj[key] = isNaN(value) ? value : +value;
                                    return obj;
                                }, {});
        
                        } else {
                            aVARs[aMatch[1]] = item.TaskName.includes("{num}") ? +taskProgram : taskProgram;                            
                        }
                    });
                    //console.log(aObjects.aaLIMITed) //
                    //console.log(aObjects.aaTypeOfGift)
                    //let aVcheck = "Gift"
                    //console.log(aObjects.aaLIMITed.find(item => item.code === aVcheck) ? aObjects.aaLIMITed.find(item => item.code === aVcheck).lmtamt : null );

                    var aMMaMx = localStorage["MMaMx"];
                    var aRRgRs = aMMaMx.split('0');
                    var aDDeDx = aRRgRs[0];
                    var aRrgSx = aRRgRs[1];
                    var asTaskProgram;
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


                    var aqrFull = `${aaKeyField} != '' ` //"Status LIKE 'Active%'" //"Dept = '1196'" // "Password !LIKE '%\%"
                    var aurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + aaTBKey + '/all' //aaPFDMZz  aaPFDMI

                    var settings = {
                        "url": aurl,
                        "method": "POST",
                        "timeout": 0,
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                            "@": aqrFull //" Status!='Resigned' "
                        }),
                    };

                    $("#gridContainer").dxDataGrid({

                        dataSource: new DevExpress.data.CustomStore({
                            key: aaKeyField,
                            loadMode: "omit",

                            load: function () { return $.post(settings).done(); }, //function (response) {//console.log(response)};           
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
                                //console.log(aaKeyField);
                                var ObjKeyData = { [aaKeyField]: $.trim(key) }; //key.trim
                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData, values));
                                sendRequestNew("Update", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            },
                            remove: function (key) {
                                var ObjKeyData = { [aaKeyField]: $.trim(key) }; //key.trim
                                var ObjRowData = JSON.stringify($.extend({}, ObjKeyData));
                                sendRequestNew("Delete", ObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
                            }
                        }),
                        allowColumnReordering: true,
                        allowColumnResizing: true,
                        columnMinWidth: 40,
                        columnChooser: {
                            enabled: true
                        },
                        showBorders: true,
                        sorting: {
                            mode: "multiple"
                        },
                        selection: {
                            mode: 'single',//'multiple'
                        },
                        groupPanel: {
                            visible: true
                        },
                        filterRow: {
                            visible: true,
                            applyFilter: "auto"
                        },
                        headerFilter: {
                            visible: true
                        },
                        grouping: {
                            autoExpandAll: true,
                        },
                        searchPanel: {
                            visible: true
                        },
                        paging: {
                            pageSize: 5
                        },
                        pager: {
                            showPageSizeSelector: true,
                            allowedPageSizes: [5, 10, 20, 50],
                            showInfo: true
                        },
                        showBorders: true,
                        groupPaging: true,
                        showColumnLines: true,
                        showRowLines: true,
                        rowAlternationEnabled: true,
                        wordWrapEnabled: true,
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
                                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'TaskControl' + '.xlsx');
                                });
                            });
                            e.cancel = true;
                        },
                        onInitNewRow: function (e) {
                            let aaID = 1
                            let axRunRun = aGetDateRef("T").substring(1, 11); // generateUniqueId(); //
                            console.log(axRunRun)
                            e.data.IDNO = axRunRun
                        },
                        onEditorPreparing: function (e) {
                            if (e.parentType === "dataRow" && arDataU === 0) {
                                e.editorOptions.disabled = true;
                            } else {
                                if (e.parentType === "dataRow" && (e.dataField === "EntryBy" || e.dataField === "EntryDate")) {
                                    e.editorOptions.disabled = true;
                                }
                                // if (e.parentType === "dataRow" && (e.dataField === "TaskProgram" )) {
                                //     asTaskProgram = e.data.TaskProgram
                                // }
                            }

                        },
                        onCellPrepared: function (e) {
                            if (e.rowType === "data") {
                                e.cellElement.css("vertical-align", "top");
                                //asTaskProgram = e.data.TaskProgram
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
                            allowAdding: arDataC,
                            form: {
                                showColonAfterLabel: false,
                                labelLocation: "left",//"left", //"top",
                                //labelMode: 'floating',
                                colCount: 2,
                                items: [
                                    {
                                        dataField: "IDNO",
                                        label: { text: "ID NO" },
                                        width: 100,
                                        editorType: "dxTextBox",
                                        editorOptions: { width: 100, readOnly: true },
                                        colSpan: 1,
                                    },
                                     {
                                        dataField: "TaskGroup",
                                        label: { text: "Group" },
                                        //editorType: "dxTextBox",
                                        //editorOptions: { width: 200, },
                                        editorType: "dxSelectBox", //dxSelectBox dxLookup
                                        //editorType: "dxTextArea",
                                        editorOptions: {
                                            dataSource: aObjects.aTaskProgram, //aaPurposeTable
                                            searchExpr: "PNAME",
                                            valueExpr: "code",
                                            displayExpr: "PNAME",
                                            searchEnabled: true,
                                            width: 200,
                                            //value: aNewDiva,
                                            // onValueChanged: function (e) {
                                            //     asERORefNo1 = e.value;
                                            // },
                                        },
                                        colSpan: 1,
                                    }, 
                                  /*   {
                                        dataField: "TaskGroup",
                                        label: { text: "Group" },
                                        editorType: "dxTagBox", // Use dxTagBox for multiple selection
                                        editorOptions: {
                                            dataSource: aObjects.aTaskProgram, // The data source remains the same
                                            searchExpr: "PNAME", // Enables search by the PNAME field
                                            valueExpr: "code", // The value field
                                            displayExpr: "PNAME", // The display text
                                            searchEnabled: true, // Enable search functionality
                                            showSelectionControls: true, // Show checkboxes for better multiple selection UX
                                            width: 200, // Set the width of the editor
                                            multiline: true, // Allow multiple lines for displaying selected items
                                            //value: aNewDiva, // Preselect values if needed
                                            // onValueChanged: function (e) { // Handle value change events if needed
                                            //     asERORefNo1 = e.value;
                                            // },
                                        },
                                        colSpan: 1, // Adjust layout settings as needed
                                    }, */
                                   /*  {
                                        dataField: "TaskGroup",
                                        label: { text: "Group" },
                                        editorType: "dxTagBox", // Use dxTagBox for multiple selection
                                        editorOptions: {
                                            dataSource: aObjects.aTaskProgram, // The data source remains the same
                                            searchExpr: "PNAME", // Enables search by the PNAME field
                                            valueExpr: "code", // The value field
                                            displayExpr: "PNAME", // The display text
                                            searchEnabled: true, // Enable search functionality
                                            showSelectionControls: true, // Show checkboxes for better multiple selection UX
                                            width: 200, // Set the width of the editor
                                            multiline: true, // Allow multiple lines for displaying selected items
                                            onValueChanged: function (e) {
                                                // Convert the array of selected values into a comma-separated string
                                                const selectedValues = e.value.join(",");
                                                // Update the form data to reflect the string result
                                                const formData = e.component.option("formData");
                                                formData.TaskGroup = selectedValues;
                                                console.log("Selected Groups:", selectedValues); // Example: "101,104"
                                            },
                                        },
                                        colSpan: 1, // Adjust layout settings as needed
                                    }, */
                                    
                                    {
                                        dataField: "TaskDescription",
                                        caption: "Description",
                                        width: 250,
                                        editorType: "dxTextArea",
                                        editorOptions: { width: "100%", height: 100 }, //width: 750
                                        colSpan: 2,
                                    },
                                    {
                                        dataField: "TaskName",
                                        label: { text: "Variable" },
                                        width: 200,
                                        editorType: "dxTextBox",
                                        editorOptions: { width: 400 },
                                        colSpan: 2,
                                    },
                                    // {
                                    //     itemType: "empty",
                                    //     colSpan: 1,
                                    // },
                                    {
                                        dataField: "TaskProgram",
                                        label: { text: "Program/Text" },
                                        width: 700,
                                        editorType: "dxTextArea",
                                        editorOptions: { width: "100%", height: 420 }, // width: "750"   height: 320
                                        setCellValue: function (newData, value, currentRowData) {
                                            newData.asTaskProgram = value; //value.slice(0, 4);                                                
                                            asTaskProgram = value

                                        },
                                        colSpan: 2,
                                    },

                                ]
                            },
                            popup: {
                                title: "Task Control Info",
                                fullScreen: false,
                                showTitle: true,
                                resizeEnabled: true, // Allow resizing
                                width: 1400,
                                height: 820,
                                position: {
                                    my: "top",
                                    at: "top",
                                    of: "window",
                                    offset: "-100 30"
                                },
                                // onShowing: function (e) {
                                //     const rowData = e.component.getSelectedRowsData()[0]; // Get selected row data
                                //     initializeHtmlEditor(rowData.TaskProgram, (updatedValue) => {
                                //         rowData.TaskProgram = updatedValue; // Update field with new value
                                //         e.component.refresh(); // Refresh grid after editing
                                //     });
                                // },
                                toolbarItems: [
                                    {
                                        widget: "dxButton",
                                        toolbar: "bottom",
                                        location: "after",
                                        options: {
                                            text: "Save",
                                            onClick: function (e) {
                                                const popup = e.component;
                                                $("#gridContainer").dxDataGrid("instance").saveEditData();
                                            }
                                        }
                                    },
                                    {
                                        widget: "dxButton",
                                        toolbar: "bottom",
                                        location: "after",
                                        options: {
                                            text: "Cancel",
                                            onClick: function (e) {
                                                const popup = e.component;
                                                $("#gridContainer").dxDataGrid("instance").cancelEditData();
                                            }
                                        }
                                    },
                                    // {
                                    //     widget: "dxButton",
                                    //     toolbar: "bottom",
                                    //     location: "after",
                                    //     options: {
                                    //         text: "VIEW Program/Text",
                                    //         onClick: function (e) {
                                    //             //DevExpress.ui.alert("Custom action executed!", "info", 2000);
                                    //             DevExpress.ui.dialog.alert({ showTitle: true, title: "Program/Text VIEW", messageHtml: asTaskProgram });
                                    //         }
                                    //     }
                                    // }
                                ],
                                onContentReady: function (e) {
                                    e.component.option('toolbarItems[0].visible', aSaveVisible);
                                    e.component.option('toolbarItems[0].options.icon', 'save');
                                    e.component.option('toolbarItems[0].options.type', 'success');
                                    e.component.option('toolbarItems[1].options.text', aCancelText);
                                    e.component.option('toolbarItems[1].options.icon', aCancelicon);
                                    e.component.option('toolbarItems[1].options.type', aCancelType);
                                }
                            }
                        },

                        // column list
                        columns: [
                            {
                                type: "buttons",
                                width: 120,
                                buttons: ["edit", "delete",
                                    {
                                        hint: "Template/Program VIEW",
                                        icon: "fas fa-file-code", //"fas fa-trash-alt", //fa-trash
                                        /*elementAttr: { class: "custom-icon-size"}, // Apply the custom icon size class
                                        cssClass: "custom-icon-size",*/
                                        visible: true,
                                        onClick: function (e) {
                                            if (e.row.data.TaskName.includes("HELP")) {
                                                aPopupHelp("Template/Program [VIEW]", e.row.data.TaskProgram.replace(/`/g, "'"))
                                            } else {
                                                DevExpress.ui.dialog.alert({ showTitle: true, title: "Template/Program [VIEW]", messageHtml: e.row.data.TaskProgram.replace(/`/g, "'") });
                                            }
                                            //                                                    
                                        }
                                    }
                                ]
                            },
                            {
                                type: "buttons",
                                width: 20,
                                buttons: [// Clone first record ID++
                                    {
                                        hint: "Clone this Line",
                                        icon: "fas fa-plus",
                                        visible: true,
                                        onClick: (e) => {
                                            let result = DevExpress.ui.dialog.confirm("Are you sure to clone this RECORD ? <br> ", "CLONE THIS RECORD ?");
                                            result.done(function (dresult) {
                                                if (dresult) {
                                                    aSaveCloneN(e.row.data, aaTBKey, aaPFDMI, aaXToX)

                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                    $("#gridContainer").dxDataGrid("instance").refresh();
                                                }
                                            })
                                        }
                                    },
                                ]
                            },
                            {
                                dataField: "IDNO",
                                caption: "ID NO",

                                width: 100,
                                //allowHiding: false,
                                editorType: "dxTextBox",
                                editorOptions: { width: 100, readOnly: true },
                                visible: false,
                            },
                            {
                                dataField: "TaskGroup",
                                caption: "Group",
                                sortOrder: "asc",
                                dataType: "string",
                                lookup: {
                                    dataSource: aObjects.aTaskProgram,
                                    valueExpr: "code",
                                    displayExpr: "PNAME",
                                },
                                editorOptions: { width: 150 },
                                //editorType: "dxSelectBox", //dxSelectBox dxLookup
                                // editorOptions: {
                                //     dataSource: aObjects.aTaskProgram, //aaPurposeTable
                                //     searchExpr: "PNAME",
                                //     valueExpr: "code",
                                //     displayExpr: "PName",
                                //     searchEnabled: true,
                                //     width: 150,
                                //     //value: aNewDiva,
                                //     // onValueChanged: function (e) {
                                //     //     asERORefNo1 = e.value;
                                //     // },
                                // },
                                width: 150,
                            },
                            {
                                dataField: "TaskDescription",
                                caption: "Description",
                                width: 250,
                                editorType: "dxTextBox",
                                editorOptions: { width: 250 },
                            },
                            {
                                dataField: "TaskName",
                                caption: "Variables",
                                width: 250,
                                editorType: "dxTextBox",
                                editorOptions: { width: 250 },
                            },
                            {
                                dataField: "TaskProgram",
                                caption: "Template/Program",
                                width: 500,
                                height: 200,
                            },
                        ],
                        // summary
                        summary: {
                            recalculateWhileEditing: true,
                            skipEmptyValues: false,
                            totalItems: [
                                {
                                    column: "TaskGroup",
                                    summaryType: "count",
                                    displayFormat: "{0} Items",
                                },
                            ],
                            groupItems: [
                                {
                                    column: "TaskGroup",
                                    summaryType: "count",
                                    displayFormat: "{0} Items",
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
                                        icon: "fas fa-info",
                                        text: "HELP",
                                        type: "default",
                                        stylingMode: "contained", // "outlined" contained
                                        onClick: function () {
                                            aPopupHelp("HELP", aVARs.APOPUPHELP) //"./images/All Slide-Training Expense Reimbursement System.pdf#view=FitH" //"./Help.html" "https://cbsdev2.locktonwattana.com/xol/index.html"
                                        }
                                    }
                                },
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
                                            DevExpress.pdfExporter.exportDataGrid({
                                                jsPDFDocument: doc,
                                                component: dataGrid
                                            }).then(function () {
                                                doc.save('TaskControl' + '.pdf');
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
                    
                    // function initializeHtmlEditor(initialValue, onSave) {
                    //     // Create the HTML Editor
                    //     $("#htmlEditorContainer").dxHtmlEditor({
                    //         height: 300,
                    //         width: "100%",
                    //         value: initialValue, // Set the initial value
                    //         toolbar: {
                    //             items: [
                    //                 "undo", "redo", "separator",
                    //                 "bold", "italic", "underline", "separator",
                    //                 "alignLeft", "alignCenter", "alignRight", "alignJustify",
                    //                 "orderedList", "bulletList", "separator",
                    //                 "link", "image", "separator",
                    //                 {
                    //                     widget: "dxButton",
                    //                     options: {
                    //                         text: "Save",
                    //                         stylingMode: "contained",
                    //                         type: "success",
                    //                         onClick: function () {
                    //                             const editor = $("#htmlEditorContainer").dxHtmlEditor("instance");
                    //                             const updatedValue = editor.option("value");
                    //                             onSave(updatedValue); // Save the new value
                    //                             DevExpress.ui.notify("Changes saved!", "success", 2000); // Optional notification
                    //                         },
                    //                     },
                    //                 },
                    //             ],
                    //         },
                    //     });
                    // }

                    // function generateUniqueId() { 
                    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
                    //     let uniqueId = '';
                    //     for (let i = 0; i < 10; i++) { 
                    //         const randomIndex = Math.floor(Math.random() * characters.length); 
                    //         uniqueId += characters[randomIndex]; 
                    //     } 
                    //     return uniqueId;  
                    // }

                    function generateUniqueId() {
                        let timestamp = Date.now().toString(36);
                        let randomString = Math.random().toString(36).substring(2, 8);
                        let uniqueId = timestamp + randomString;
                        return uniqueId.substring(0, 10);
                    }

                    /* const aPopupHelp = (aHTitle, aHelpMessageOrFile, useFullScreen = false) => {
                        const isPdf = typeof aHelpMessageOrFile === "string" && aHelpMessageOrFile.includes(".pdf");
                        const isHtml = typeof aHelpMessageOrFile === "string" && aHelpMessageOrFile.includes(".html");
                        const isPpt = typeof aHelpMessageOrFile === "string" && aHelpMessageOrFile.includes(".pptx");

                        const popup = $("#popupHelp").dxPopup({
                            title: aHTitle,
                            height: 750,
                            width: 1200,
                            position: { offset: "-40 -100" },
                            fullScreen: useFullScreen, // Toggle full-screen mode based on the parameter
                            visible: true,
                            showCloseButton: true,
                            focusStateEnabled: false, // disable focusing of popup overlay
                            toolbarItems: [
                                {
                                    widget: "dxButton",
                                    location: "after",
                                    options: {
                                        //text: "Toggle Fullscreen",
                                        icon: "fas fa-expand", // Use font-expand icon for fullscreen toggle <i class="fas fa-window-maximize"></i>
                                        onClick: function () {
                                            const currentState = popup.option("fullScreen");
                                            popup.option("fullScreen", !currentState);
                                        },
                                    },
                                },
                            ],
                            contentTemplate: function (contentElement) {
                                const container = $("<div>").css({ height: "100%", overflowY: "auto" });

                                if (isPdf || isHtml || isPpt) {
                                    const embedUrl = isPpt
                                        ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(aHelpMessageOrFile)}`
                                        : aHelpMessageOrFile;

                                    const iframe = $("<iframe>")
                                        .attr("src", embedUrl)
                                        .css({ width: "100%", height: "100%", border: "none" });
                                    container.append(iframe);
                                } else {
                                    container.append(aHelpMessageOrFile);
                                }

                                container.appendTo(contentElement);
                            },
                        }).dxPopup("instance");
                    }; */

                    // Example usage
                    //aPopupHelp("./images/All Slide-Training Expense Reimbursement System.pdf#view=FitH", false); // Default size with real-time fullscreen toggle
                    //aPopupHelp("./example.html", false); // Default size with real-time fullscreen toggle
                }) //then fetch (Employee)
                .catch(error => console.error("Error fetching SQL data:", error)); // load loadsqldata  
            }); // load content
                
        }); // TOP PRG
        //
    //});  // ajax  