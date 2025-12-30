$(() => {
    // DevExpress.ui.themes.current(localStorage["aDXTheme"]);
    // window.jsPDF = window.jspdf.jsPDF;
    // applyPlugin(window.jsPDF);
    // $(document).ready(function () {
    //     var aDXTheme = localStorage["aDXTheme"];
    //     DevExpress.ui.themes.current(aDXTheme);
    // });
    const aserverName = isLocalHost(); // `${aserverName}/temp/uploads/` //  `${aserverName}/temp/${aapilistfile}` //
    const aapilistfile = "list-files.aspx"
    //let remoteUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/FlexibleIME.xlsx";
    //let filename = "FlexibleIME.xlsx";
    const baseUrl = `${aserverName}/temp/uploads/` //"https://cbsdev2.locktonwattana.com/temp/uploads/"; or //"https://cbsdev2.locktonwattana.com/temp/uploads/";
    const listApi = `${aserverName}/temp/${aapilistfile}` //"https://cbsdev2.locktonwattana.com/temp/list-files.aspx";
    //alert(listApi)

    const filenameInput = $("#filename-input").dxTextBox({
        placeholder: "Enter filename (e.g., DeclarationTEMP.xlsx)",
        value: "",
        width: "100%"
    }).dxTextBox("instance");


    $("#download-button").dxButton({
        text: "Download",
        type: "success",
        icon: "fas fa-file-upload",
        onClick: function () {
            const filename = filenameInput.option("value").trim();
            if (!filename) {
                DevExpress.ui.dialog.alert("Please select a filename.", "error");
                return;
            }
            const fileUrl = baseUrl + encodeURIComponent(filename);
            const anchor = document.createElement("a");
            anchor.href = fileUrl;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            //alert("Downloading " + filename);
            //alert(fileUrl);
        }
    });

    $("#print-button").dxButton({
        text: "Print to PDF",
        type: "default",
        icon: "fas fa-print",
        onClick: function () {
            const iframe = document.getElementById("viewerFrame");
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            } else {
                DevExpress.ui.notify("No file loaded to print.", "error", 2000);
            }
        }
    });

    // ✅ View button
    // $("#view-button").dxButton({
    //     text: "View File",
    //     type: "default",
    //     icon: "fas fa-eye",
    //     onClick: function () {
    //         const filename = filenameInput.option("value").trim();
    //         if (!filename) {
    //             DevExpress.ui.notify("Please enter a filename.", "error", 2000);
    //             return;
    //         }

    //         const ext = filename.split('.').pop().toLowerCase();
    //         const fileUrl = baseUrl + encodeURIComponent(filename);
    //         let viewerUrl = "";

    //         if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
    //             viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(fileUrl);
    //         } else if (ext === "pdf") {
    //             viewerUrl = "https://docs.google.com/gview?embedded=true&url=" + encodeURIComponent(fileUrl);
    //         } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
    //             viewerUrl = fileUrl;
    //         } else {
    //             viewerUrl = fileUrl;
    //         }

    //         $("#viewerFrame").attr("src", viewerUrl).show();
    //     }
    // });
    let showMenu = true; // default mode
    $("#view-button").dxButton({
        text: "View File",
        type: "default",
        icon: "fas fa-eye",
        onClick: function () {
            const filename = filenameInput.option("value").trim();
            if (!filename) {
                DevExpress.ui.notify("Please enter a filename.", "error", 2000);
                return;
            }

            const ext = filename.split('.').pop().toLowerCase();
            const fileUrl = baseUrl + encodeURIComponent(filename);
            let viewerUrl = "";

            if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
                // Toggle here: true = show menu, false = hide menu
                //const showMenu = true;
                const mode = showMenu ? "embed" : "view";
                viewerUrl = `https://view.officeapps.live.com/op/${mode}.aspx?src=${encodeURIComponent(fileUrl)}`;
            } else if (ext === "pdf") {
                viewerUrl = "https://docs.google.com/gview?embedded=true&url=" + encodeURIComponent(fileUrl);
            } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
                viewerUrl = fileUrl;
            } else {
                viewerUrl = fileUrl;
            }

            $("#viewerFrame").attr("src", viewerUrl).show();
        }
    });

 

    // เก็บ path ปัจจุบัน เช่น "", "reports", "reports/2025"
    let currentPath = "";

    // ฟังก์ชันหา parent path
    function getParentPath(path) {
        if (!path) return "";
        const idx = path.lastIndexOf("/");
        return idx === -1 ? "" : path.substring(0, idx);
    }

    // Helper: ไอคอนตามนามสกุลไฟล์
    function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case "pdf": return "fa-file-pdf";
            case "xlsx":
            case "xls": return "fa-file-excel";
            case "doc":
            case "docx": return "fa-file-word";
            case "ppt":
            case "pptx": return "fa-file-powerpoint";
            case "jpg":
            case "jpeg":
            case "png":
            case "gif": return "fa-file-image";
            case "mp4":
            case "mov": return "fa-file-video";
            case "html":
            case "js":
            case "css": return "fa-file-code";
            default: return "fa-file";
        }
    }

    // โหลดไฟล์/โฟลเดอร์
    function loadFiles() {
        let url = listApi;
        if (currentPath) {
            url += "?sub=" + encodeURIComponent(currentPath);
        }

        return fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            mode: "cors"
        })
            .then(res => res.json())
            .then(items => {
                let rows = items.map(item => ({
                    filename: item.filename,
                    type: item.type,
                    modified: item.modified,
                    icon: item.type === "folder" ? "fa-folder" : getFileIcon(item.filename),
                    extension: item.type === "file" ? item.filename.split('.').pop().toLowerCase() : ""
                }));

                // 👉 ถ้าไม่ใช่ root ให้เพิ่มแถว ".." สำหรับย้อนกลับ
                if (currentPath) {
                    rows.unshift({
                        filename: "..",
                        type: "up",
                        modified: "",
                        icon: "fa-level-up-alt",
                        extension: ""
                    });
                }

                return rows;
            });
    }

    // Refresh DataGrid
    function refreshGrid() {
        loadFiles().then(data => {
            $("#file-grid").dxDataGrid("instance").option("dataSource", data);
        });
    }

    /**
     * Export a sheet from a workbook to PDF
     * @param {ExcelJS.Workbook} workbook - The ExcelJS workbook already loaded in memory
     * @param {string} sheetName - The name of the sheet to export
     * @param {string} outputName - The filename for the PDF (if saving)
     * @param {boolean} saveFile - Whether to trigger browser download (default true)
     * @returns {Blob} - The PDF file as a Blob in memory
     */
    function exportSheetToPDF(workbook, sheetName = "MEMO", outputName = "output.pdf", saveFile = true) {
        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) {
            alert(`Sheet named '${sheetName}' not found`);
            return null;
        }

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        let rowIndex = 10;
        pdf.setFontSize(14);
        pdf.text(`Sheet: ${sheetName}`, 10, rowIndex);
        rowIndex += 10;

        sheet.eachRow((row) => {
            const rowText = row.values.slice(1).map(cell => {
                if (cell && typeof cell === "object") {
                    return cell.text || cell.result || cell.value || "";
                }
                return cell ?? "";
            }).join(" | ");

            pdf.setFontSize(10);
            pdf.text(rowText, 10, rowIndex);
            rowIndex += 8;

            if (rowIndex > 280) {
                pdf.addPage();
                rowIndex = 10;
            }
        });

        if (saveFile) pdf.save(outputName);
        return pdf.output("blob");
    }

    async function u2pload2File(file, prefix = "RPT") {
        try {
            if (!file) {
                console.log("No file provided.");
                return false;
            }

            const originalFileName = file.name;
            const fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            const baseName = originalFileName.substring(0, originalFileName.lastIndexOf("."));
            const prefixUnderscore = prefix ? `_${prefix}` : "";

            // Always append "_RPT"
            const newFileName = `${baseName}${prefixUnderscore}${fileExtension}`;

            const simulatedFile = new File([file], newFileName, { type: file.type });

            const formData = new FormData();
            formData.append("file", simulatedFile);

            const myHeaders = new Headers();
            myHeaders.append("ref", "44095B6C-CC17-47FD-895B-649E0EAA2BAE");

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formData,
            };

            //const response = await fetch("https://cbsdev2.locktonwattana.com/temp/uploads/",requestOptions);
            const response = await fetch(
                //"https://cbsdev2.locktonwattana.com/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                isLocalHost() + "/FMP/44095B6C-CC17-47FD-895B-649E0EAA2BAE",
                requestOptions
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.text();
            console.log(result);
            //aMessageAlert(`Upload file ${newFileName} successful!`, "blue");
            return newFileName;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

       // ฟังก์ชันดูไฟล์ที่อัพโหลดแล้ว
       function viewUploadedFile(filename) {
        const baseUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/";
        const fileUrl = baseUrl + encodeURIComponent(filename);

        const ext = filename.split('.').pop().toLowerCase();
        let viewerUrl = "";

        if (["xlsx", "xls", "pptx", "ppt", "doc", "docx"].includes(ext)) {
            viewerUrl = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(fileUrl);
        } else if (ext === "pdf") {
            viewerUrl = "https://docs.google.com/gview?embedded=true&url=" + encodeURIComponent(fileUrl);
        } else {
            viewerUrl = fileUrl;
        }

        $("#viewerFrame").attr("src", viewerUrl).show();
    }


    // Popup + DataGrid
    const popup = $("#file-popup").dxPopup({
        title: "Select a file",
        visible: false,
        showTitle: true,
        closeOnOutsideClick: true,
        width: 600,
        height: "auto",
        position: { my: "top center", at: "top center", offset: "0 10" },
        contentTemplate: function (contentElement) {
            $("<div>").attr("id", "file-grid")
                .css({ "max-height": "600px", "overflow": "auto" })
                .appendTo(contentElement);

            $("#file-grid").dxDataGrid({
                dataSource: [],
                height: "auto",
                paging: { enabled: true, pageSize: 50 },
                pager: { showPageSizeSelector: false, showNavigationButtons: true, visible: true },
                columns: [
                    {
                        dataField: "icon",
                        caption: "",
                        width: 40,
                        cellTemplate: function (container, options) {
                            $("<i>").addClass("fas").addClass(options.value)
                                .css("font-size", "18px").css("color", "#3c3c3c")
                                .appendTo(container);
                        }
                    },
                    { dataField: "filename", caption: "File / Folder Name", minWidth: 220 },
                    { dataField: "extension", caption: "Type", width: 80 },
                    { dataField: "modified", caption: "Modified", width: 160 }
                ],
                rowAlternationEnabled: true,
                showBorders: true,
                hoverStateEnabled: true,
                searchPanel: { visible: true, width: 240, placeholder: "Search..." },
                selection: { mode: "single" },
                onRowClick: function (e) {
                    if (e.data.type === "folder") {
                        // เข้าไป subfolder
                        currentPath = currentPath ? currentPath + "/" + e.data.filename : e.data.filename;
                        refreshGrid();
                    } else if (e.data.type === "up") {
                        // ย้อนกลับ
                        currentPath = getParentPath(currentPath);
                        refreshGrid();
                    } else {
                        // เลือกไฟล์
                        const fullPath = currentPath ? currentPath + "/" + e.data.filename : e.data.filename;
                        filenameInput.option("value", fullPath);
                        popup.hide();
                    }
                }
            });
        }
    }).dxPopup("instance");

    // ปุ่ม Browse
    $("#browse-button").dxButton({
        text: "List Files",
        type: "default",
        icon: "fas fa-folder",
        onClick: function () {
            popup.show();
            currentPath = "";
            refreshGrid();
        }
    });

    // Transform button
    $("#load_transform").dxButton({
        text: "Transform",
        type: "default",
        icon: "fas fa-folder",
        onClick: async function () {
            try {
                // 1. Load file list
                const rows = await loadFiles();
                const selected = rows.find(r => r.type === "file"); // pick first file for demo
                if (!selected) { alert("No file found"); return; }

                $("#filename-input").text(selected.filename);
                $("#status").text("Processing " + selected.filename + "…");

                // 2. Fetch file content
                const buffer = await getFileContent(selected.filename, "/files");

                // 3. Process with ExcelJS
                const replacements = {
                    approver1: "Nadporn Srilert",
                    datenow1: "08/11/2025",
                    approver2: "Suradee Malaiarisoon",
                    datenow2: "09/11/2025",
                    requester: "Natthida Trisahavirakul",
                    datenowR: "12/11/2025",
                    reqdate: "12/11/2025",
                    refno: "G9999999"
                };
                const processedFile = await processTemplate(buffer, replacements, "DATA", selected.filename);

                // 4. Download new file
                const link = document.createElement("a");
                link.href = URL.createObjectURL(processedFile);
                link.download = processedFile.name;
                link.click();

                //$("#status").text("Done. File downloaded.");
            } catch (err) {
                console.error(err);
                //$("#status").text("Processing failed.");
            }
        }
    });

    // $("#excel_transform").dxButton({
    //     text: "Excel Transform",
    //     type: "success",
    //     icon: "fa-file-excel",
    //     onClick: async function () {
    //         try {
    //             const fileUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/FlexibleIME.xlsx";
    //             $("#status").text("Fetching and processing…");

    //             // 1. Fetch file content
    //             const response = await fetch(fileUrl, { method: "GET", credentials: "include", mode: "cors" });
    //             if (!response.ok) throw new Error("Failed to load file: " + response.status);
    //             const buffer = await response.arrayBuffer();

    //             // 2. Call your existing processTemplate
    //             const replacements = {
    //                 approver1: "Nadporn Srilert",
    //                 datenow1: "08/11/2025",
    //                 approver2: "Suradee Malaiarisoon",
    //                 datenow2: "09/11/2025",
    //                 requester: "Natthida Trisahavirakul",
    //                 datenowR: "12/11/2025",
    //                 reqdate: "12/11/2025"
    //             };
    //             const processedFile = await processTemplate(buffer, replacements, "DATA", "FlexibleIME.xlsx");

    //             // 3. Download new file
    //             const link = document.createElement("a");
    //             link.href = URL.createObjectURL(processedFile);
    //             link.download = processedFile.name;
    //             link.click();

    //             $("#status").text("Done. File downloaded.");
    //         } catch (err) {
    //             console.error(err);
    //             $("#status").text("Processing failed.");
    //         }
    //     }
    // });

    // Helper: fetch file content
    let processedFile = null;
    let processedWorkbook = null; // keep workbook in memory
    // $("#excel_transform").dxButton({
    //     text: "Excel Transform",
    //     type: "success",
    //     icon: "fa-file-excel",
    //     onClick: async function () {
    //         try {
    //             const fileUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/FlexibleIME.xlsx";
    //             $("#status").text("Fetching and processing…");

    //             // 1. Fetch file content
    //             const response = await fetch(fileUrl, { method: "GET", credentials: "include", mode: "cors" });
    //             if (!response.ok) throw new Error("Failed to load file: " + response.status);
    //             const buffer = await response.arrayBuffer();

    //             // 2. Call your existing processTemplate
    //             const replacements = {
    //                 approver1: "Nadporn Srilert",
    //                 datenow1: "08/11/2025",
    //                 approver2: "Suradee Malaiarisoon",
    //                 datenow2: "09/11/2025",
    //                 requester: "Natthida Trisahavirakul",
    //                 datenowR: "12/11/2025",
    //                 reqdate: "12/11/2025"
    //             };
    //             const processedFile = await processTemplate(buffer, replacements, "DATA", "FlexibleIME.xlsx");

    //             // 3. Download new file
    //             const link = document.createElement("a");
    //             link.href = URL.createObjectURL(processedFile);
    //             link.download = processedFile.name;
    //             link.click();

    //             $("#status").text("Done. File downloaded.");
    //         } catch (err) {
    //             console.error(err);
    //             $("#status").text("Processing failed.");
    //         }
    //     }
    // });
    // Excel Transform button
    $("#excel_transform").dxButton({
        text: "Excel Transform",
        type: "success",
        icon: "fas fa-file-excel",
        onClick: async function () {
            try {
                const fileUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/FlexibleIME.xlsx";
                //const remoteUrl = "https://cbsdev2.locktonwattana.com/temp/uploads/FlexibleIME.xlsx";
                const filename = "FlexibleIME.xlsx"; //filenameInput.option("value").trim();//"FlexibleIME.xlsx";
                if (!filename) {
                    DevExpress.ui.dialog.alert("Please select a filename.", "error");
                    return;
                }

                //const remoteUrl = baseUrl + encodeURIComponent(filename);
                const filenameonly = filename.substring(0, filename.lastIndexOf("."));
                const fileExtension = filename.substring(filename.lastIndexOf("."));
                const pdffilename = filenameonly + ".pdf";
                // 1. Fetch file content
                const response = await fetch(fileUrl, { method: "GET", credentials: "include", mode: "cors" });
                if (!response.ok) throw new Error("Failed to load file: " + response.status);
                const buffer = await response.arrayBuffer();

                //const response = await fetch(remoteUrl);
                //if (!response.ok) throw new Error("Failed to load file: " + response.status);
                //const buffer = await response.arrayBuffer();

                // 2. Call your existing processTemplate
                const replacements = {
                    approver1: "Nadporn Srilert",
                    datenow1: "08/11/2025",
                    approver2: "Suradee Malaiarisoon",
                    datenow2: "09/11/2025",
                    requester: "Natthida Trisahavirakul",
                    datenowR: "12/11/2025",
                    reqdate: "12/11/2025"
                };
                alert("before processedFile")
                // Use your existing processTemplate
                processedFile = await processTemplate(buffer, replacements, "DATA", filename);
                alert("after processedFile")
                // Keep workbook in memory for download, upload and viewing
                processedWorkbook = new ExcelJS.Workbook();
                await processedWorkbook.xlsx.load(await processedFile.arrayBuffer());
                alert("OK")
                // Upload RPT and View
                const uploadedName = await u2pload2File(processedFile);
                if (uploadedName) {
                    viewUploadedFile(uploadedName); // show in Office Online viewer
                }


            } catch (err) {
                console.error(err);
                DevExpress.ui.notify("Processing failed.", "error", 2000);
            }
        }
    });

    // View button (renamed) not used
    $("#view_xlsxmem").dxButton({
        text: "View Excel (Memory)",
        type: "success",
        icon: "fa-file-excel",
        //disabled: true,
        onClick: function () {
            if (!processedWorkbook) {
                //DevExpress.ui.notify("No workbook in memory.", "error", 2000);
                DevExpress.ui.dialog.alert("No workbook in memory.", "error");
                return;
            }

            const sheet = processedWorkbook.getWorksheet("DATA");
            if (!sheet) {
                DevExpress.ui.dialog.alert("Sheet DATA not found.", "error");
                return;
            }

            const rows = [];
            sheet.eachRow((row) => {
                rows.push(row.values.slice(1)); // skip ExcelJS index 0
            });

            $("#viewerGrid").dxDataGrid({
                dataSource: rows,
                showBorders: true,
                columnAutoWidth: true
            });
        }
    });

    async function getFileContent(filename, baseUrl = "/files") {
        const url = `${baseUrl}/${encodeURIComponent(filename)}`;
        const response = await fetch(url, { method: "GET", credentials: "include", mode: "cors" });
        if (!response.ok) throw new Error("Failed to load file: " + response.status);
        return await response.arrayBuffer();
    }

    // Helper: process Excel template
    async function processTemplate(buffer, replacements, sheetName = "DATA", filename = "processed.xlsx") {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        alert(filename)
        workbook.eachSheet(ws => {
            if (ws.tables) ws.tables = [];
            if (ws.autoFilter) ws.autoFilter = null;
        });

        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) throw new Error(`Sheet "${sheetName}" not found.`);

        sheet.eachRow(row => {
            row.eachCell(cell => {
                if (typeof cell.value === "string") {
                    let newValue = cell.value;
                    for (const [key, val] of Object.entries(replacements)) {
                        if (val) newValue = newValue.replaceAll(`{{${key}}}`, val);
                    }
                    cell.value = newValue;
                }
            });
        });

        const newBuffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([newBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        return new File([blob], filename, { type: blob.type });
    }

    // ===== Independent processor =====
    async function LoadFile2Replace(inputFile, replacements, sheetName = "DATA") {
        const buffer = await inputFile.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        // Strip table metadata to avoid Excel repair
        workbook.eachSheet((ws) => {
            if (ws.tables) ws.tables = [];
            if (ws.autoFilter) ws.autoFilter = null;
        });

        const sheet = workbook.getWorksheet(sheetName);
        if (!sheet) throw new Error(`Sheet "${sheetName}" not found.`);

        sheet.eachRow((row) => {
            row.eachCell((cell) => {
                if (typeof cell.value === "string") {
                    let newValue = cell.value;
                    for (const [key, val] of Object.entries(replacements)) {
                        if (val) newValue = newValue.replaceAll(`{{${key}}}`, val);
                    }
                    cell.value = newValue;
                }
            });
        });

        const newBuffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([newBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        return new File([blob], inputFile.name, { type: blob.type });
    }

    $("#showUploadPopupButton").dxButton({
        text: "Upload File",
        type: "success",
        icon: "fas fa-file-upload",
        onClick: function () {
            aPopUpUpLoad("X");
        }
    });
});