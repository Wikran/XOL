function jsonToBuffer(jsonString) {
    if (!jsonString || typeof jsonString !== "string") {
        throw new Error("Invalid JSON string");
    }
    const arr = JSON.parse(jsonString);       // parse string -> array of numbers
    const uint8Array = new Uint8Array(arr);   // convert -> Uint8Array
    return uint8Array.buffer;                 // return ArrayBuffer
}

// รองรับทั้ง ISO string ("2025-11-30T00:00") หรือ "dd/mm/yyyy"
function toUTCDateOnly(input) {
    let y, m, d;

    if (typeof input === "string" && input.includes("/")) {
        // "dd/mm/yyyy"
        const [dd, mm, yyyy] = input.split("/").map(Number);
        d = dd; m = mm; y = yyyy;
    } else {
        // ISO/Date: ใช้ Date เพื่ออ่าน component แบบโลคอล แล้วสร้างใหม่เป็น UTC date
        const dt = new Date(input);
        y = dt.getFullYear();
        m = dt.getMonth() + 1;
        d = dt.getDate();
    }

    // สร้าง Date ที่ 00:00 UTC
    return new Date(Date.UTC(y, m - 1, d));
}

function parseVendorNote(noteText) {
    if (!noteText || typeof noteText !== "string") {
        return []; // ถ้า null/undefined/ไม่ใช่ string → คืน array ว่าง
    }
    const extractArray = (label, raw) => {
        const match = raw.match(new RegExp(`${label}:\\[(.*?)\\]`));
        if (!match) return [];
        const content = match[1];

        // ใช้ regex สำหรับ NAME, MAIL, APPD
        if (label === "NAME" || label === "MAIL" || label === "APPD") {
            return [...content.matchAll(/\|\s*(.*?)\s*\|/g)].map(m => m[1]);
        } else {
            return content.split(',').map(v => v.trim());
        }
    };

    const names = extractArray("NAME", noteText);
    const mails = extractArray("MAIL", noteText);
    const rangs = extractArray("RANG", noteText).map(v => parseFloat(v));
    const appds = extractArray("APPD", noteText);

    const result = names.map((name, i) => {
        let appdVal = appds[i];

        // ถ้าไม่มีค่า → default
        if (appdVal === undefined || appdVal === null || appdVal === "") {
            appdVal = "01/01/1900";
        }

        return {
            name,
            mail: mails[i] || null,
            rang: rangs[i] || null,
            appd: appdVal
        };
    });

    return result;
}

const ULbCustomerGrp = async (iData) => {
    try {
        // Use iData instead of njsonDataSum
        const customerGroupName = iData.ERORefNo1;
        const templateBuffer = jsonToBuffer(jsonStr);
        const today = new Date();
        // 👉 แบบใส่วันที่+เวลา (dd/MM/yyyy HH:mm:ss)
        const formattedDateTime = today.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

        const groupRecord = iData;
        let jsHOD = parseVendorNote(groupRecord.Vender01Note)
        let nofjsHOD = jsHOD.length;
        alert(nofjsHOD)
        let lOverLimit = (groupRecord.RefundedAmount > groupRecord.EROAmount1);

        try {
            // Load template workbook
            const templateWb = new ExcelJS.Workbook();
            await templateWb.xlsx.load(templateBuffer);

            const memoSheet = templateWb.getWorksheet("MEMO");
            const dataSheet = templateWb.getWorksheet("DATA");
            if (!memoSheet || !dataSheet) {
                alert("Error,Template missing MEMO or DATA sheet.");
                return;
            }

            const aSt = 1;

            // Parse Note JSON for the selected group
            let noteItems = [];
            try {
                noteItems = JSON.parse(groupRecord.Note || "[]");
            } catch (err) {
                console.error("Invalid Note JSON", err);
                alert(`Warning Skip ${customerGroupName}: invalid Note JSON.`);
                return;
            }
            const bFCorpC = noteItems.some(item => item.PayBy === PayByList[0].PayType);
            const bFCorpC2 = noteItems.some(item => item.PayBy === PayByList[1].PayType);
            const bFPers = noteItems.some(item => item.PayBy === PayByList[2].PayType);
            //alert("past noteItems")

            const byCompany = noteItems.reduce((acc, r) => {
                const companyName = (r.CompanyName || r.Company || "Unknown").trim();
                const qty = Number(r.Quantity) || 0;
                const cost = Number(r.ProductCost) || 0;
                const price = qty ? cost / qty : 0;
                (acc[companyName] ||= []).push({
                    ProductName: r.ProductName,
                    Quantity: qty,
                    Price: price,
                    ProductCost: cost,
                    DateText: r.PayBy || "Unknown"
                });
                return acc;
            }, {});

            // Clear previous content from row 18 down
            const LIGHT_GREY = { argb: "FFEFEFEF" };
            for (let r = 18; r <= (memoSheet.lastRow?.number || 0); r++) {
                const row = memoSheet.getRow(r);
                row.eachCell(c => { c.value = null; c.fill = null; c.font = null; c.border = null; });
                row.values = [];
            }

            let rowIndex = 18;
            let grandQty = 0;
            let grandCost = 0;
            const companies = Object.keys(byCompany).sort((a, b) => a.localeCompare(b));

            companies.forEach(companyName => {
                // spacer
                if (grandQty !== 0) memoSheet.getRow(rowIndex++).values = ["", "", "", "", "", "", ""];

                // header
                const headerRow = memoSheet.getRow(rowIndex++);
                headerRow.values = aHeaders //["", "", "สินค้า", "จำนวน", "ราคา", "จำนวนเงิน", "การชำระเงิน"];
                for (let c = 2; c <= 7; c++) {
                    const cell = headerRow.getCell(c);
                    cell.font = { bold: true };
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                    if ([4, 5, 6].includes(c)) cell.alignment = { horizontal: "right" };
                    if (c === 7) cell.alignment = { indent: 2 };
                }

                // data
                let subtotalQty = 0;
                let subtotalCost = 0;
                byCompany[companyName].forEach(item => {
                    const row = memoSheet.getRow(rowIndex++);
                    row.values = ["", item.ProductName, undefined, item.Quantity, item.Price, item.ProductCost, item.DateText];
                    row.getCell(4).numFmt = "#,##0";
                    row.getCell(5).numFmt = "#,##0.00";
                    row.getCell(6).numFmt = "#,##0.00";
                    row.getCell(7).alignment = { indent: 2 };
                    subtotalQty += item.Quantity;
                    subtotalCost += item.ProductCost;
                    grandQty += item.Quantity;
                    grandCost += item.ProductCost;
                });

                // subtotal
                const subtotalRow = memoSheet.getRow(rowIndex++);
                subtotalRow.values = ["", `${companyName} Total`, undefined, subtotalQty, "", subtotalCost, ""];
                for (let c = 2; c <= 7; c++) {
                    subtotalRow.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
                }
                subtotalRow.getCell(2).font = { bold: true };
                subtotalRow.getCell(4).numFmt = "#,##0";
                subtotalRow.getCell(6).numFmt = "#,##0.00";
            });

            // grand total
            memoSheet.addRow([]);
            const grandRow = memoSheet.addRow(["", "Grand Total", "", grandQty, "", grandCost, ""]);
            for (let c = 2; c <= 7; c++) {
                const cell = grandRow.getCell(c);
                cell.font = { bold: true };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: LIGHT_GREY };
            }
            grandRow.getCell(4).numFmt = "#,##0";
            grandRow.getCell(6).numFmt = "#,##0.00";

            let summaryStartRow = memoSheet.lastRow.number + 2;

            // แถวแรกของสรุป (ใช้เป็นจุดเริ่มต้นช่วง SUM ของ Total)
            const firstSummaryRow = summaryStartRow;

            // นับจำนวน summary items ที่ถูกสร้าง (Corp/Corp2/Personal)
            let summaryItemCount = 0;

            // Corporate Card
            if (bFCorpC) {
                const corpRow = memoSheet.getRow(summaryStartRow++);
                summaryItemCount++;

                corpRow.getCell(3).value = PayByList[0].PayType;
                corpRow.getCell(3).alignment = { indent: 15 };

                // SUMIF จากข้อมูลดิบ เพื่อได้ค่ายอดรวมตาม PayType
                corpRow.getCell(4).value = {
                    formula: `SUMIF(G:G,"Corporate Card",D:D)`
                };
                corpRow.getCell(6).value = {
                    formula: `SUMIF(G:G,"Corporate Card",F:F)`
                };

                corpRow.getCell(4).numFmt = "#,##0";
                corpRow.getCell(6).numFmt = "#,##0.00";

                if (!bFPers && !bFCorpC2) {
                    [4, 6].forEach(col => { corpRow.getCell(col).border = { bottom: { style: "thin" } }; });
                }
            }

            // Corporate Card 2
            if (bFCorpC2) {
                const corp2Row = memoSheet.getRow(summaryStartRow++);
                summaryItemCount++;

                corp2Row.getCell(3).value = PayByList[1].PayType;
                corp2Row.getCell(3).alignment = { indent: 15 };

                corp2Row.getCell(4).value = {
                    formula: `SUMIF(G:G,"Corporate Card 2",D:D)`
                };
                corp2Row.getCell(6).value = {
                    formula: `SUMIF(G:G,"Corporate Card 2",F:F)`
                };

                corp2Row.getCell(4).numFmt = "#,##0";
                corp2Row.getCell(6).numFmt = "#,##0.00";

                if (!bFPers && !bFCorpC) {
                    [4, 6].forEach(col => { corp2Row.getCell(col).border = { bottom: { style: "thin" } }; });
                }
            }

            // Personal
            if (bFPers) {
                const personalRow = memoSheet.getRow(summaryStartRow++);
                summaryItemCount++;

                personalRow.getCell(3).value = PayByList[2].PayType;
                personalRow.getCell(3).alignment = { indent: 15 };

                personalRow.getCell(4).value = {
                    formula: `SUMIF(G:G,"Personal",D:D)`
                };
                personalRow.getCell(6).value = {
                    formula: `SUMIF(G:G,"Personal",F:F)`
                };

                personalRow.getCell(4).numFmt = "#,##0";
                personalRow.getCell(6).numFmt = "#,##0.00";

                [4, 6].forEach(col => { personalRow.getCell(col).border = { bottom: { style: "thin" } }; });
            }

            // Total Row
            const totalRow = memoSheet.getRow(summaryStartRow++);
            totalRow.getCell(3).value = "Total";
            totalRow.getCell(3).alignment = { indent: 15 };
            totalRow.getCell(3).font = { bold: true };

            // ถ้ามีอย่างน้อย 1 item → SUM ช่วงแถวสรุปที่สร้างขึ้น
            if (summaryItemCount > 0) {
                totalRow.getCell(4).value = {
                    formula: `SUM(D${firstSummaryRow}:D${totalRow.number - 1})`
                };
                totalRow.getCell(6).value = {
                    formula: `SUM(F${firstSummaryRow}:F${totalRow.number - 1})`
                };
            } else {
                // ไม่มี item ใดถูกสร้าง → ให้ Total เป็น 0 เพื่อกัน error/วงเล็บว่าง
                totalRow.getCell(4).value = 0;
                totalRow.getCell(6).value = 0;
            }

            totalRow.getCell(4).numFmt = "#,##0";
            totalRow.getCell(6).numFmt = "#,##0.00";

            // เส้น double border สำหรับ Total
            [4, 6].forEach(col => {
                totalRow.getCell(col).border = { bottom: { style: "double" } };
            });

            // regards + prepared/approved + dates + verify rows

            const regardsRow = memoSheet.getRow(summaryStartRow++);
            regardsRow.getCell(2).value = "Regards,";

            summaryStartRow += 2;

            const preparedRow = memoSheet.getRow(summaryStartRow++);
            preparedRow.getCell(2).value = "Prepared by";
            preparedRow.getCell(3).value = { formula: "UPPER(DATA!C11)" };
            preparedRow.getCell(3).font = { bold: true };
            preparedRow.getCell(3).border = { bottom: { style: "thin" } };

            preparedRow.getCell(5).value = "Approved by";
            preparedRow.getCell(6).value = { formula: "UPPER(DATA!C8)" };
            preparedRow.getCell(6).font = { bold: true };
            preparedRow.getCell(6).border = { bottom: { style: "thin" } };

            memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

            const dateRow = memoSheet.getRow(summaryStartRow++);
            dateRow.getCell(3).value = { formula: "DATA!E18" };
            dateRow.getCell(6).value = { formula: "DATA!E16" };

            if (lOverLimit) {
                summaryStartRow += 2;

                const verifyRow = memoSheet.getRow(summaryStartRow++);

                verifyRow.getCell(5).value = "Approved by";
                verifyRow.getCell(6).value = { formula: "UPPER(DATA!C14)" };
                verifyRow.getCell(6).font = { bold: true };
                verifyRow.getCell(6).border = { bottom: { style: "thin" } };

                memoSheet.mergeCells(summaryStartRow - 1, 6, summaryStartRow - 1, 7);

                const xdateRow = memoSheet.getRow(summaryStartRow++);
                xdateRow.getCell(6).value = { formula: "DATA!C15" };
            }

            // Stamp DATA sheet from njsonDataSum fields
            dataSheet.getCell("C1").value = groupRecord.HeadRefNo;    // PRE REF#
            dataSheet.getCell("C2").value = groupRecord.ERORefNo1;    // Company Group
            dataSheet.getCell("C4").value = groupRecord.EROAmount2;   // Outstanding
            dataSheet.getCell("C7").value = groupRecord.RefundedAmount; // Cash Advance
            //dataSheet.getCell("E5").value = groupRecord.ERODate02;    // Period
            // ใช้งาน Change date to UTC
            const aPeriodD = toUTCDateOnly(groupRecord.ERODate02);
            const cell = dataSheet.getCell("E5");
            cell.value = aPeriodD;           // ✅ เป็น Date object จริง
            cell.numFmt = "dd/mm/yyyy";      // ✅ Excel จะแสดงเฉพาะวันที่

            dataSheet.getCell("E6").value = groupRecord.ERODesc05;    // LOT
            dataSheet.getCell("C7").value = groupRecord.EROAmount1;   // Limit C8
            if (groupRecord.Confirmed === true) {
                dataSheet.getCell("C18").value = groupRecord.PayToName;   // Requester
                const aReqDateD = toUTCDateOnly(groupRecord.ReqDate);
                const cell1 = dataSheet.getCell("C19");
                cell1.value = aReqDateD;          
                cell1.numFmt = "dd/mm/yyyy";    
                const cell2 = dataSheet.getCell("D18");
                cell2.value = aReqDateD;          
                cell2.numFmt = "dd/mm/yyyy";   
                // dataSheet.getCell("C19").value = formattedDateTime;   // Requester Date
                // dataSheet.getCell("D18").value = formattedDateTime;   // Requester Date
            }
            //if (nofjsHOD >= 1 && jsHOD[0].appd.includes("/")) {
            if (true) {   
                dataSheet.getCell("C16").value = "Name"//jsHOD[0].name;   // Approve 1
                dataSheet.getCell("D16").value = "10/12/2025"//jsHOD[0].appd;   // Approve Date 1
                alert("OK")
            }
            if (nofjsHOD >= 2 && jsHOD[1].appd.includes("/")) {
                dataSheet.getCell("C17").value = jsHOD[1].name;   // Approve 2
                dataSheet.getCell("D17").value = jsHOD[1].appd;   // Approve Date 2
            }
            // Column widths
            [5, 12, 35, 8, 12, 13, 22].forEach((w, i) => memoSheet.getColumn(i + 1).width = w);

            // Keep only MEMO & DATA sheets
            templateWb.worksheets.slice().forEach(ws => {
                if (!["MEMO", "DATA"].includes(ws.name)) templateWb.removeWorksheet(ws.id);
            });

            const safeName = groupRecord.HeadRefNo || "Unknown";
            const fileName = safeName + ".xlsx"
            if (safeName !== "Unknown") {
                const outBuffer = await templateWb.xlsx.writeBuffer();
                const outFile = new File(
                    [outBuffer],
                    `${safeName}.xlsx`,
                    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
                );
                saveAs(new Blob([outBuffer], { type: "application/octet-stream" }), fileName);
                const uploadedName = await u2pload2File(outFile);
                //if (uploadedName && typeof viewUploadedFile === "function") {
                //viewUploadedFile(uploadedName);
                //}
            }

            notify("success", `DL Customer Group completed for ${customerGroupName}.`, 2500);

        } catch (err) {
            console.error(err);
            notify("error", `Failed group export for ${customerGroupName}.`, 3000);
        }

    } catch (err) {
        console.error("Error transforming JSON to Excel:", err);
        alert("Failed to transform JSON to Excel.");
    }
}

async function u2pload2File(file, prefix) { //= "RPT"
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