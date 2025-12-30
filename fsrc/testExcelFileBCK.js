// Load Excel File (testExcelFile.html)
$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
const { PDFDocument } = PDFLib;
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();

var aaPFDMI = isLocalHost();
$(function () {
    var jsonData = "";
    const aMyData = [
        {
            "PageID": " XOXTP779",
            "TableName": "PositionBenefitLevel ",
            "PrimaryKey": "IDNO",
            "TableKey": "dca3e8a0-8533-45a4-96ce-28aeddefab72"
        },
        {
            "PageID": "EAEM7311",
            "TableName": "MasterPageSetUp",
            "PrimaryKey": "pageID",
            "TableKey": "326459ff-7ea6-4465-a946-9326b783d492"
        },
        {
            "PageID": "EMOE701",
            "TableName": "XOLStaff",
            "PrimaryKey": "EMPCode",
            "TableKey": "63971412-c4e4-4d35-8e79-3293fe59dac8"
        },
        {
            "PageID": "EMOE703",
            "TableName": "XOLStaff",
            "PrimaryKey": "EMPCode",
            "TableKey": "63971412-c4e4-4d35-8e79-3293fe59dac8"
        },
        {
            "PageID": "LACT771",
            "TableName": "TaskControl",
            "PrimaryKey": "IDNO",
            "TableKey": "19ae62cd-3de9-423d-ade7-43a335cf5def"
        },
        {
            "PageID": "LXOXTP779",
            "TableName": "PositionBenefitLevel",
            "PrimaryKey": "IDNO",
            "TableKey": "dca3e8a0-8533-45a4-96ce-28aeddefab72"
        },]
    const xtableConfig = {
        TokenKey: "importedexcelfile",
        DatabaseName: "EXCELFILE",
        TableName: "EXCEL",
        Primarykeys: "PageID",
        Fields: [
            { dataField: "PageID", caption: "Page ID", allowFiltering: true, editorType: "dxTextBox", width: 150, visible: true, }, //, Type: "string", DxType: "dxTextBox", Width: 100, visible: true,
            { dataField: "TableName", caption: "Table Name", allowFiltering: true, editorType: "dxTextBox", width: 250, visible: true, },
            { dataField: "PrimaryKey", caption: "Primary Key", allowFiltering: true, editorType: "dxTextBox", width: 200, visible: true, },
            { dataField: "TableKey", caption: "Table Key", allowFiltering: true, editorType: "dxTextBox", width: 200, visible: true, },
        ]
    }
    // Function to determine editorType based on sample data
    function getEditorType(value) {
        if (!isNaN(value) && value !== "" && value !== null) {
            return "dxNumberBox"; // If value is a number
        } else if (!isNaN(Date.parse(value))) {
            return "dxDateBox"; // If value is a date
        } else {
            return "dxTextBox"; // Default for strings
        }
    }
   
    $("#showUploadPopupButton").dxButton(
        {
            text: "Open Excel File",
            type: "default",
            onClick: function () {
                //$("#uploadPopup").dxPopup("instance").show();
                aPopUpsUpLoad()
            }
        },
    );
    $("#showJsonDataButton").dxButton(
        {
            text: "View Data",
            type: "default",
            visible: false,
            onClick: function () {
                //$("#uploadPopup").dxPopup("instance").show();
                //console.log("json Data 1 ", jsonData)
                if (typeof jsonData === "string") {
                    aPopUpJsonData(aMyData)
                } else {
                    aPopUpJsonData(jsonData)
                }

            }
        },
    );

    const aPopUpsUpLoad = () => {
        $(() => {

            //let aaNewNamePF = aRefNoForName;
            //let popupTitle = aaNewNamePF === "X" ? "Upload Excel File" : `File Attachment [${aaNewNamePF}]`;
            let popupTitle = "Load Excel File "

            // ✅ Create Popup
            const popup = $("#popupUL").dxPopup({
                title: popupTitle,
                height: 500,
                width: 800,
                position: { my: "center", at: "center", of: window },
                visible: true,
                showCloseButton: true,
                dragEnabled: true,
                closeOnOutsideClick: false,
                resizeEnabled: true,
                contentTemplate: function (contentElement) {
                    contentElement.append(`
                    <div id="ExcelUploader"></div>
                    <br/>
                    <textarea id="jsonOutput" class="form-control" rows="10" style="width:100%;" readonly></textarea>
                    <br/>
                    <div id="scbutton"></div>`
                    );
                }
            }).dxPopup("instance");

            // ✅ Initialize File Uploader
            $("#ExcelUploader").dxFileUploader({
                multiple: false,
                selectButtonText: 'Select Excel File',
                labelText: '',
                accept: ".xlsx",
                uploadMode: 'useForm',
                height: "120px",
                onValueChanged: function (e) {
                    if (e.value.length > 0) {
                        handleFileUpload(e.value[0]);
                    }
                }
            });

            // ✅ Function to Handle Excel File Upload & Convert to JSON
            function handleFileUpload(file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0]; // First sheet only
                    const worksheet = workbook.Sheets[sheetName];

                    jsonData = JSON.stringify(XLSX.utils.sheet_to_json(worksheet), null, 4);
                    //console.log("jsonData ", jsonData)
                    $("#jsonOutput").val(jsonData); // Show JSON in textarea
                };
                reader.readAsArrayBuffer(file);
            }

            // ✅ Initialize Upload Button
            $('#scbutton').dxButton({
                text: 'Upload Excel',
                type: 'success',
                onClick() {
                    if (!jsonData) {
                        DevExpress.ui.notify("Please select a valid Excel file.", "error", 3000);
                        return;
                    }
                    // Generate tableConfig array
                    if (typeof jsonData === "string") {
                        jsonData = JSON.parse(jsonData);
                    }
                    // Collect unique field names from all records
                    const uniqueFields = new Set();
                    jsonData.forEach(item => Object.keys(item).forEach(key => uniqueFields.add(key)));

                    // Convert unique fields into an array of field configurations
                    const fields = Array.from(uniqueFields).map((key) => ({
                        dataField: key,
                        caption: key.replace(/([A-Z])/g, " $1").trim(), // Convert camelCase to spaced words
                        allowFiltering: true,
                        editorType: getEditorType(jsonData[0][key]), // Use first item as a reference for editorType
                        width: 200,
                        visible: true
                    }));

                    // Create single tableConfig object
                    const tableConfig = {
                        TokenKey: "importedexcelfile",
                        DatabaseName: "EXCELFILE",
                        TableName: "EXCEL",
                        Primarykeys: fields.length > 0 ? fields[0].dataField : "", // Set first field as Primarykeys
                        Fields: fields
                    };
                    var aaKeyField = tableConfig.Primarykeys;
                    console.log("tableConfig", tableConfig)
                    aPopUpJsonData(jsonData, tableConfig, aaKeyField)
                    //alert("loaded")
                    popup.hide(); // Close popup on success
                    //console.log("JSON Data:", jsonData); // Use JSON data as needed
                },
            });

            popup.show();
        });
    };

//  const aPopupHelp = (aHTitle, aHelpMessageOrFile, useFullScreen = false) => {
    const aPopUpJsonData = (aMyData, tableConfig, aaKeyField, useFullScreen = false) => {
        $(() => {
            //console.log("json datax", aMyData)
            //console.log("data type ", typeof aMyData)
            
            if (typeof aMyData === "string") {
                aMyData = JSON.parse(aMyData);
            }
            console.log("my data ", aMyData)
            const popup = $("#popupJSON").dxPopup({
                title: "Excel Data Preview",
                width: '1300px',
                position: { offset: "0 -140" },
                visible: true,
                fullScreen: useFullScreen,
                showTitle: true,
                dragEnabled: true,
                closeOnOutsideClick: false,
                resizeEnabled: true,
                onInitialized: function (e) { e.component.registerKeyHandler("escape", function (arg) { }) },
                height: 600,
                width: 1000,
                showCloseButton: true,
                closeOnOutsideClick: true,
                toolbarItems: [
                    {
                        widget: "dxButton",
                        location: "after",
                        options: {
                            icon: "fas fa-expand",
                            onClick: function () {
                                const currentState = popup.option("fullScreen");
                                popup.option("fullScreen", !currentState);
                            },
                        },
                    },
                ],
                contentTemplate: () => {
                    return $("<div>").append(
                        //$("<div id='jsonDataGrid' style='height:400px;'></div>")
                        $("<p><div id='jsonDataGrid' style='height:400px;'></div></p>"),
                    );
                },
                // onShown: function () {
                // }
            }).dxPopup("instance");

            $("#jsonDataGrid").dxDataGrid({
                dataSource: aMyData,   // Replace with your actual data source
                keyExpr: aaKeyField, // Adjust to your primary key field
                editing: {
                    mode: "popup", //"raw"
                    allowUpdating: true,
                    allowAdding: true,
                    allowDeleting: true,
                    popup: {
                        title: "Edit Record",  // ✅ This will set the title of the popup
                        showTitle: true,       // ✅ Ensures the title is displayed
                        width: 600,
                        height: "auto"
                    },
                    form: {
                        items: tableConfig.Fields.map(field => ({
                            dataField: field.dataField,
                            label: { text: field.caption }
                        }))
                    }
                },
                // Export to Excel 		
                export: {
                    enabled: true,
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
                columns: [
                    {
                        type: "buttons",
                        width: 110,
                        buttons: ["edit", "delete"],
                        visible: true,
                    },
                    ...tableConfig.Fields.map(field => ({
                        dataField: field.dataField,
                        sortOrder: field.sortOrder ?? null,
                        allowFiltering: field.allowFiltering || false,
                        caption: field.caption,
                        dataType: field.dataType ?? null, // || "string", // === "date" ? "date" : "string",
                        editorType: field.editorType || "dxTextBox",
                        width: field.width || 100,
                        validationRules: field.validationRules || [], // ✅ Apply validation rules if they exist
                        visible: field.visible,
                    })),
                    // { dataField: "PageID", caption: "Page ID", allowFiltering: true, editorType: "dxTextBox", width: 150, visible: true, }, //, Type: "string", DxType: "dxTextBox", Width: 100, visible: true,
                    // { dataField: "TableName", caption: "Table Name", allowFiltering: true, editorType: "dxTextBox", width: 250, visible: true, },
                    // { dataField: "PrimaryKey", caption: "Primary Key", allowFiltering: true, editorType: "dxTextBox", width: 200, visible: true, },
                    // { dataField: "TableKey", caption: "Table Key", allowFiltering: true, editorType: "dxTextBox", width: 200, visible: true, },
                ],
                 // summary
                 summary: {
                    recalculateWhileEditing: true,
                    skipEmptyValues: false,
                    totalItems: [
                        {
                            column: aaKeyField, //"DivCode",
                            summaryType: "count",
                            displayFormat: "{0} Items",
                        },
                    ],
                    // groupItems: [
                    //     {
                    //         column: "DivName",
                    //         summaryType: "count",
                    //         displayFormat: "{0} Items",
                    //     },
                    // ],
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
                            visible: true,
                            options: {
                                icon: "exportpdf",
                                text: "Export to PDF",
                                onClick: function () {
                                    const doc = new jsPDF();
                                    DevExpress.pdfExporter.exportDataGrid({
                                        jsPDFDocument: doc,
                                        component: dataGrid
                                    }).then(function () {
                                        doc.save('XOLDivision' + '.pdf');
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
                },
                allowColumnReordering: true,
                allowColumnResizing: true,
                columnMinWidth: 100,
                columnChooser: {
                    enabled: true
                },
                showBorders: true,
                sorting: {
                    mode: "multiple"
                },
                selection: {
                    mode: 'single'
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
            });

        });
    };
});




