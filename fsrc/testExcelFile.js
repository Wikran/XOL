// Load Excel File (testExcelFile.html)
$(function () {
    DevExpress.ui.themes.current(localStorage["aDXTheme"]);
    window.jsPDF = window.jspdf.jsPDF;
    applyPlugin(window.jsPDF);

    let jsonData = "";
    let currentDateFormat = "dd/MM/yyyy"; // ✅ default format

    const getEditorType = (value) => {
        if (!isNaN(value) && value !== "" && value !== null) return "dxNumberBox";
        if (!isNaN(Date.parse(value))) return "dxDateBox";
        return "dxTextBox";
    };

    // ✅ Convert Excel serial date number to JS Date
    function excelDateToJSDate(serial) {
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        const date_info = new Date(utc_value * 1000);
        return new Date(date_info.getUTCFullYear(), date_info.getUTCMonth(), date_info.getUTCDate());
    }

    // ✅ Normalize data: detect "date" fields and convert
    function normalizeData(data) {
        return data.map(row => {
            const newRow = { ...row };
            for (const key in newRow) {
                if (/date/i.test(key) && newRow[key]) {
                    let val = newRow[key];
                    if (!isNaN(val)) {
                        const d = excelDateToJSDate(val);
                        newRow[key] = d;
                    } else {
                        const d = new Date(val);
                        if (!isNaN(d)) newRow[key] = d;
                    }
                }
            }
            return newRow;
        });
    }

    $("#showUploadPopupButton").dxButton({
        text: "Open Excel File",
        type: "default",
        onClick: () => openUploadPopup()
    });

    $("#showJsonDataButton").dxButton({
        text: "View Data",
        type: "default",
        visible: false,
        onClick: () => aPopUpJsonData(jsonData)
    });

    function openUploadPopup() {
        const popup = $("#popupUL").dxPopup({
            title: "Load Excel File",
            height: 500,
            width: 800,
            position: { my: "center", at: "center", of: window },
            visible: true,
            showCloseButton: true,
            dragEnabled: true,
            resizeEnabled: true,
            contentTemplate: (el) => {
                el.append(`
                    <div id="ExcelUploader"></div>
                    <br/>
                    <textarea id="jsonOutput" class="form-control" rows="10" style="width:100%;" readonly></textarea>
                    <br/>
                    <div id="scbutton"></div>
                `);
            }
        }).dxPopup("instance");

        $("#ExcelUploader").dxFileUploader({
            multiple: false,
            selectButtonText: "Select Excel File",
            accept: ".xlsx",
            uploadMode: "useForm",
            height: 120,
            onValueChanged: (e) => e.value.length && handleFileUpload(e.value[0])
        });

        function handleFileUpload(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const workbook = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                jsonData = XLSX.utils.sheet_to_json(worksheet);
                $("#jsonOutput").val(JSON.stringify(jsonData, null, 4));
            };
            reader.readAsArrayBuffer(file);
        }

        $("#scbutton").dxButton({
            text: "Upload Excel",
            type: "success",
            onClick: () => {
                if (!jsonData || !jsonData.length) {
                    DevExpress.ui.notify("Please select a valid Excel file.", "error", 3000);
                    return;
                }

                const fields = [...new Set(jsonData.flatMap(Object.keys))].map((key) => ({
                    dataField: key,
                    caption: key.replace(/([A-Z])/g, " $1").trim(),
                    allowFiltering: true,
                    editorType: getEditorType(jsonData[0][key]),
                    width: 200,
                    visible: true
                }));

                const tableConfig = {
                    TokenKey: "importedexcelfile",
                    DatabaseName: "EXCELFILE",
                    TableName: "EXCEL",
                    Primarykeys: fields[0]?.dataField || "",
                    Fields: fields
                };

                aPopUpJsonData(jsonData, tableConfig, tableConfig.Primarykeys);
                popup.hide();
            }
        });
    }

    function aPopUpJsonData(data, tableConfig = { Fields: [] }, keyField = "", useFullScreen = false) {
        if (typeof data === "string") data = JSON.parse(data);
        data = normalizeData(data);

        const popup = $("#popupJSON").dxPopup({
            title: "Excel Data Preview",
            height: "70%",
            width: "70%",
            visible: true,
            fullScreen: useFullScreen,
            showCloseButton: true,
            dragEnabled: true,
            resizeEnabled: true,
            toolbarItems: [
                {
                    widget: "dxButton",
                    location: "after",
                    options: {
                        icon: "fas fa-expand",
                        onClick: () => popup.option("fullScreen", !popup.option("fullScreen"))
                    }
                },
                {
                    widget: "dxSelectBox",
                    location: "after",
                    options: {
                        width: 150,
                        items: ["dd/MM/yyyy", "MM/dd/yyyy", "yyyy-MM-dd"],
                        value: currentDateFormat,
                        onValueChanged: (e) => {
                            currentDateFormat = e.value;
                            $("#jsonDataGrid").dxDataGrid("instance").refresh();
                        }
                    }
                }
            ],
            contentTemplate: () => $("<div id='jsonDataGrid' style='height:100%;'></div>"),
            onOptionChanged: (e) => {
                if (e.name === "fullScreen") {
                    $("#jsonDataGrid").dxDataGrid("instance").updateDimensions();
                }
            }
        }).dxPopup("instance");

        $("#jsonDataGrid").dxDataGrid({
            dataSource: data,
            keyExpr: keyField,
            height: "100%",
            editing: {
                mode: "popup",
                allowUpdating: true,
                allowAdding: true,
                allowDeleting: true,
                popup: { title: "Edit Record", showTitle: true, width: 600, height: "auto" },
                form: { items: tableConfig.Fields.map(f => ({ dataField: f.dataField, label: { text: f.caption } })) }
            },
            export: { enabled: true, allowExportSelectedData: true },
            columns: [
                { type: "buttons", width: 110, buttons: ["edit", "delete"] },
                ...tableConfig.Fields.map(f => ({
                    ...f,
                    dataType: /date/i.test(f.dataField) ? "date" : f.dataType || "string",
                    format: /date/i.test(f.dataField) ? currentDateFormat : undefined
                }))
            ],
            paging: { pageSize: 5 },
            pager: { showPageSizeSelector: true, allowedPageSizes: [5, 10, 20, 50], showInfo: true },
            rowAlternationEnabled: true,
            showBorders: true
        });
    }
});
