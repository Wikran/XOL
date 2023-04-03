

viewname
ACCVIEW_300

SELECT DISTINCT HeadRefNo, ExpensesCode,
                             (SELECT        TOP (1) TDESC
                               FROM            dbo.ACCOUNTCHART
                               WHERE        (ACCCODE = dbo.EXPREIM.ExpensesCode)) AS TAccDesc,
                             (SELECT        TOP (1) EDESC
                               FROM            dbo.ACCOUNTCHART AS ACCOUNTCHART_1
                               WHERE        (ACCCODE = dbo.EXPREIM.ExpensesCode)) AS EAccDesc, Department AS Division, SUM(RefundedAmount) AS DRAMT, '' AS CRAMT
FROM            dbo.EXPREIM
WHERE        (LEN(trim(HeadRefNo)) >= 11) AND (ExpGroupCode = '300')
GROUP BY HeadRefNo, ExpensesCode, ExpensesDescription, Department




viewname 
ACCVIEW_400

SELECT DISTINCT HeadRefNo, ExpensesCode,
                             (SELECT        TOP (1) TDESC
                               FROM            dbo.ACCOUNTCHART
                               WHERE        (ACCCODE = dbo.EXPREIM.ExpensesCode)) AS TAccDesc,
                             (SELECT        TOP (1) EDESC
                               FROM            dbo.ACCOUNTCHART AS ACCOUNTCHART_1
                               WHERE        (ACCCODE = dbo.EXPREIM.ExpensesCode)) AS EAccDesc, Department AS Division, SUM(RefundedAmount) AS DRAMT, '' AS CRAMT
FROM            dbo.EXPREIM
WHERE        (LEN(trim(HeadRefNo)) >= 11) AND (ExpGroupCode = '400')
GROUP BY HeadRefNo, ExpensesCode, ExpensesDescription, Department


viewname 
ACCVIEW_ALL300

SELECT        HeadRefNo, 'Dr' AS DR, ExpensesCode, EAccDesc, Division, DRAMT,
                             (SELECT        TOP (1) CR
                               FROM            dbo.ACCVIEW_CR300
                               WHERE        (CHKECODE = dbo.ACCVIEW_300.ExpensesCode) AND (HeadRefNo = dbo.ACCVIEW_300.HeadRefNo)) AS CR,
                             (SELECT        TOP (1) ExpensesCode
                               FROM            dbo.ACCVIEW_CR300 AS ACCVIEW_CR300_3
                               WHERE        (CHKECODE = dbo.ACCVIEW_300.ExpensesCode) AND (HeadRefNo = dbo.ACCVIEW_300.HeadRefNo)) AS CRCODE,
                             (SELECT        TOP (1) EAccDesc
                               FROM            dbo.ACCVIEW_CR300 AS ACCVIEW_CR300_2
                               WHERE        (CHKECODE = dbo.ACCVIEW_300.ExpensesCode) AND (HeadRefNo = dbo.ACCVIEW_300.HeadRefNo)) AS CRName,
                             (SELECT        TOP (1) Division
                               FROM            dbo.ACCVIEW_CR300 AS ACCVIEW_CR300_4
                               WHERE        (CHKECODE = dbo.ACCVIEW_300.ExpensesCode) AND (HeadRefNo = dbo.ACCVIEW_300.HeadRefNo)) AS CRDivision,
                             (SELECT        TOP (1) CRAMT
                               FROM            dbo.ACCVIEW_CR300 AS ACCVIEW_CR300_1
                               WHERE        (CHKECODE = dbo.ACCVIEW_300.ExpensesCode) AND (HeadRefNo = dbo.ACCVIEW_300.HeadRefNo)) AS CRAMT
FROM            dbo.ACCVIEW_300

viewname 
ACCVIEW_ALL400

SELECT        HeadRefNo, 'Dr' AS DR, ExpensesCode, EAccDesc, Division, DRAMT,
                             (SELECT        TOP (1) CR
                               FROM            dbo.ACCVIEW_CR400
                               WHERE        (CHKECODE = dbo.ACCVIEW_400.ExpensesCode) AND (HeadRefNo = dbo.ACCVIEW_400.HeadRefNo)) AS CR,
                             (SELECT        TOP (1) ExpensesCode
                               FROM            dbo.ACCVIEW_CR400 AS ACCVIEW_CR400_3
                               WHERE        (CHKECODE = dbo.ACCVIEW_400.ExpensesCode) AND (HeadRefNo = dbo.ACCVIEW_400.HeadRefNo)) AS CRCODE,
                             (SELECT        TOP (1) EAccDesc
                               FROM            dbo.ACCVIEW_CR400 AS ACCVIEW_CR400_2
                               WHERE        (CHKECODE = dbo.ACCVIEW_400.ExpensesCode) AND (HeadRefNo = dbo.ACCVIEW_400.HeadRefNo)) AS CRName,
                             (SELECT        TOP (1) Division
                               FROM            dbo.ACCVIEW_CR400 AS ACCVIEW_CR400_4
                               WHERE        (CHKECODE = dbo.ACCVIEW_400.ExpensesCode) AND (HeadRefNo = dbo.ACCVIEW_400.HeadRefNo)) AS CRDivision,
                             (SELECT        TOP (1) CRAMT
                               FROM            dbo.ACCVIEW_CR400 AS ACCVIEW_CR400_1
                               WHERE        (CHKECODE = dbo.ACCVIEW_400.ExpensesCode) AND (HeadRefNo = dbo.ACCVIEW_400.HeadRefNo)) AS CRAMT
FROM            dbo.ACCVIEW_400

viewname 
ACCVIEW_CR300

SELECT DISTINCT HeadRefNo, '2202600004' AS ExpensesCode, 'Provision - Sundries' AS TAccDesc, 'Provision - Sundries' AS EAccDesc, '' AS DRAMT, '1130' AS Division, SUM(DRAMT) AS CRAMT, 'Cr' AS CR,
                             (SELECT        TOP (1) ExpensesCode
                               FROM            dbo.ACCVIEW_300
                               WHERE        (ACCVIEW_300_1.HeadRefNo = HeadRefNo)) AS CHKECODE
FROM            dbo.ACCVIEW_300 AS ACCVIEW_300_1
GROUP BY HeadRefNo


viewname 
ACCVIEW_CR400

SELECT DISTINCT HeadRefNo, '2202600004' AS ExpensesCode, 'Provision - Sundries' AS TAccDesc, 'Provision - Sundries' AS EAccDesc, '' AS DRAMT, '1130' AS Division, SUM(DRAMT) AS CRAMT, 'Cr' AS CR,
                             (SELECT        TOP (1) ExpensesCode
                               FROM            dbo.ACCVIEW_400
                               WHERE        (ACCVIEW_400_1.HeadRefNo = HeadRefNo)) AS CHKECODE
FROM            dbo.ACCVIEW_400 AS ACCVIEW_400_1
GROUP BY HeadRefNo


viewname 
EXPREIM_ALL

SELECT DISTINCT 
                         TOP (100) PERCENT HeadRefNo, ReqDate, PayToCode, PayToName, Department, Division, ExpGroupCode, ExpGroupDescEng, Confirmed, ConfirmedDate, HODApproved, HODApprovedDate, HRApproved, 
                         MAX(HRApprovedDate) AS HRApprovedDate, Approved, FAApprovedDate, PBatchNo, PBatchDate, PSPvNO, PSPvDate, SUM(Amount) AS TotalAmount, SUM(LocalAmount) AS TotalLocalAmount, SUM(RefundedAmount) 
                         AS TotalReimburse, ERStatus, ERODesc06 AS ReqEmail, CASE WHEN ExpGroupCode = '300' THEN
                             (SELECT        TOP (1) ApproverEmail
                               FROM            dbo.Approver
                               WHERE        (ApproverCode = 'HR')) ELSE
                             (SELECT        TOP (1) ApproverEmail
                               FROM            dbo.Approver AS Approver_2
                               WHERE        (ApproveToDivision = dbo.EXPREIM.Division)) END AS APPEmail, CASE WHEN ExpGroupCode = '300' THEN
                             (SELECT        TOP (1) ApproverName
                               FROM            dbo.Approver AS Approver_1
                               WHERE        (ApproverCode = 'HR')) ELSE
                             (SELECT        TOP (1) ApproverName
                               FROM            dbo.Approver AS Approver_1
                               WHERE        (ApproveToDivision = dbo.EXPREIM.Division)) END AS APPName,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LimitAmount,
                             (SELECT        TOP (1) LimitedPerTime
                               FROM            dbo.Limitation AS Limitation_2
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LimitPerTime,
                             (SELECT        TOP (1) MonthlyLimited
                               FROM            dbo.Limitation AS Limitation_1
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS MaternityLimit, COUNT(*) AS nRecord
FROM            dbo.EXPREIM
WHERE        (LEN(trim(HeadRefNo)) >= 11)
GROUP BY HeadRefNo, ReqDate, PayToCode, PayToName, Department, Division, ExpGroupCode, ExpGroupDescEng, PBatchNo, PBatchDate, Confirmed, Approved, HODApproved, HRApproved, ERStatus, PSPvNO, PSPvDate, 
                         ConfirmedDate, HODApprovedDate, FAApprovedDate, ERODesc06

viewname 
TACCView

SELECT        HeadRefNo, PayToCode,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) AS LimitedAmount, SUM(LocalAmount) AS TotalLAmount, SUM(RefundedAmount) AS TotalRefundAmt, 'Dr' AS DC01, '2202600008' AS AC01, 
                         'เงินสำรองจ่าย - ค่าน้ำมัน' AS AN01,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation AS Limitation_1
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) - (SUM(LocalAmount) - SUM(RefundedAmount)) AS AT01, 0.00 AS CT01, CASE WHEN
                             ((SELECT        TOP (1) TotalLimited
                                 FROM            dbo.Limitation
                                 WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) - SUM(LocalAmount)) >= 0 THEN 'Cr' ELSE 'Dr' END AS DC02, '5102300001' AS AC02, 'ยานพาหนะ - ค่าน้ำมัน' AS AN02, CASE WHEN
                             ((SELECT        TOP (1) TotalLimited
                                 FROM            dbo.Limitation
                                 WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) - SUM(LocalAmount)) >= 0 THEN 0.00 ELSE ABS(MAX(LimitedAmount) - SUM(LocalAmount)) END AS AT02, CASE WHEN
                             ((SELECT        TOP (1) TotalLimited
                                 FROM            dbo.Limitation
                                 WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) - SUM(LocalAmount)) >= 0 THEN ABS
                             ((SELECT        TOP (1) TotalLimited
                                 FROM            dbo.Limitation
                                 WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) - SUM(LocalAmount)) ELSE 0.00 END AS CT02, 'Cr' AS DC03, '2202600004' AS AC03, 'ค่าใช้จ่ายค้างจ่าย - อื่นๆ' AS AN03, 0.00 AS AT03, 
                         SUM(RefundedAmount) AS CT03, 'Dr' AS DC04, '2202600008' AS AC04, 'เงินสำรองจ่าย - ค่าน้ำมัน' AS AN04, SUM(RefundedAmount) AS AT04, 0.00 AS CT04, 'Cr' AS DC05, '1000502001' AS AC05, 
                         'เงินฝากออมทรัพย์ธ.ซิตี้แบงก์ - บาท - 5116258023' AS AN05, SUM(RefundedAmount) AS AT05, 0.00 AS CT05, '1130' AS DP01, Department AS DP02, '1130' AS DP03, '1130' AS DP04, '1130' AS DP05
FROM            dbo.EXPREIM
WHERE        (ExpGroupCode = '200')
GROUP BY HeadRefNo, PayToCode, Department             


viewname 
MSumDView

SELECT        PayToCode, PayToName, ExpGroupCode, ExpGroupDescEng, YEAR(ReqDate) AS QYear, SUM(LocalAmount) AS TAmount, SUM(RefundedAmount) AS TRefundAmt,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LAmount,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation AS Limitation_1
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) - SUM(RefundedAmount) AS MRemained
FROM            dbo.EXPREIM
WHERE        (ExpGroupCode = '300')
GROUP BY PayToCode, PayToName, ExpGroupCode, ExpGroupDescEng, YEAR(ReqDate)



viewname 
ERnextIDview

SELECT        HeadRefNo, MAX(ID) AS LastID, MAX(ID) + 1 AS NextID, SUM(LocalAmount) AS TAmount, SUM(RefundedAmount) AS RefundAmt
FROM            dbo.EXPREIM
GROUP BY HeadRefNo



------------------------------------------------------(NEW NEW)
ACCVIEW_100

SELECT DISTINCT HeadRefNo, ExpensesCode,
                             (SELECT        TOP (1) TDESC
                               FROM            dbo.ACCOUNTCHART
                               WHERE        (ACCCODE = dbo.EXPREIM.ExpensesCode)) AS TAccDesc,
                             (SELECT        TOP (1) EDESC
                               FROM            dbo.ACCOUNTCHART AS ACCOUNTCHART_1
                               WHERE        (ACCCODE = dbo.EXPREIM.ExpensesCode)) AS EAccDesc, Department AS Division, SUM(RefundedAmount) AS DRAMT, '' AS CRAMT
FROM            dbo.EXPREIM
WHERE        (LEN(trim(HeadRefNo)) >= 11) AND (ExpGroupCode = '100')
GROUP BY HeadRefNo, ExpensesCode, ExpensesDescription, Department

ACCVIEW_200_1
SELECT        HeadRefNo, DC01 AS DC, AC01 AS ExpensesCode, AN01 AS TAccDesc, '' AS EAccDesc, DP01 AS Division, AT01 AS DRAMT, CT01 AS CRAMT
FROM            dbo.TACCView
WHERE        (AT01 + CT01 <> 0)

ACCVIEW_200_2
SELECT        HeadRefNo, DC02 AS DC, AC02 AS ExpensesCode, AN02 AS TAccDesc, '' AS EAccDesc, DP02 AS Division, AT02 AS DRAMT, CT02 AS CRAMT
FROM            dbo.TACCView
WHERE        (AT02 + CT02 <> 0)

ACCVIEW_200_3
SELECT        HeadRefNo, DC03 AS DC, AC03 AS ExpensesCode, AN03 AS TAccDesc, '' AS EAccDesc, DP03 AS Division, AT03 AS DRAMT, CT03 AS CRAMT
FROM            dbo.TACCView
WHERE        (AT03 + CT03 <> 0)

ACCVIEW_200_4
SELECT        HeadRefNo, DC04 AS DC, AC04 AS ExpensesCode, AN04 AS TAccDesc, '' AS EAccDesc, DP04 AS Division, AT04 AS DRAMT, CT04 AS CRAMT
FROM            dbo.TACCView
WHERE        (AT04 + CT04 <> 0)

ACCVIEW_200_5
SELECT        HeadRefNo, DC05 AS DC, AC05 AS ExpensesCode, AN05 AS TAccDesc, '' AS EAccDesc, DP05 AS Division, AT05 AS DRAMT, CT05 AS CRAMT
FROM            dbo.TACCView
WHERE        (AT05 + CT05 <> 0)

ACCVIEW_300
SELECT DISTINCT HeadRefNo, ExpensesCode,
                             (SELECT        TOP (1) TDESC
                               FROM            dbo.ACCOUNTCHART
                               WHERE        (ACCCODE = dbo.EXPREIM.ExpensesCode)) AS TAccDesc,
                             (SELECT        TOP (1) EDESC
                               FROM            dbo.ACCOUNTCHART AS ACCOUNTCHART_1
                               WHERE        (ACCCODE = dbo.EXPREIM.ExpensesCode)) AS EAccDesc, Department AS Division, SUM(RefundedAmount) AS DRAMT, '' AS CRAMT
FROM            dbo.EXPREIM
WHERE        (LEN(trim(HeadRefNo)) >= 11) AND (ExpGroupCode = '300')
GROUP BY HeadRefNo, ExpensesCode, ExpensesDescription, Department

ACCVIEW_400
SELECT DISTINCT HeadRefNo, ExpensesCode,
                             (SELECT        TOP (1) TDESC
                               FROM            dbo.ACCOUNTCHART
                               WHERE        (ACCCODE = dbo.EXPREIM.ExpensesCode)) AS TAccDesc,
                             (SELECT        TOP (1) EDESC
                               FROM            dbo.ACCOUNTCHART AS ACCOUNTCHART_1
                               WHERE        (ACCCODE = dbo.EXPREIM.ExpensesCode)) AS EAccDesc, Department AS Division, SUM(RefundedAmount) AS DRAMT, '' AS CRAMT
FROM            dbo.EXPREIM
WHERE        (LEN(trim(HeadRefNo)) >= 11) AND (ExpGroupCode = '400')
GROUP BY HeadRefNo, ExpensesCode, ExpensesDescription, Department


ACCVIEW_CR100
SELECT DISTINCT HeadRefNo, '2202600004' AS ExpensesCode, 'Provision - Sundries' AS TAccDesc, 'Provision - Sundries' AS EAccDesc, '' AS DRAMT, '1130' AS Division, SUM(DRAMT) AS CRAMT, 'Cr' AS CR,
                             (SELECT        TOP (1) ExpensesCode
                               FROM            dbo.ACCVIEW_100
                               WHERE        (ACCVIEW_100_1.HeadRefNo = HeadRefNo)) AS CHKECODE
FROM            dbo.ACCVIEW_100 AS ACCVIEW_100_1
GROUP BY HeadRefNo


ACCVIEW_CR300
SELECT DISTINCT HeadRefNo, '2202600004' AS ExpensesCode, 'Provision - Sundries' AS TAccDesc, 'Provision - Sundries' AS EAccDesc, '' AS DRAMT, '1130' AS Division, SUM(DRAMT) AS CRAMT, 'Cr' AS CR,
                             (SELECT        TOP (1) ExpensesCode
                               FROM            dbo.ACCVIEW_300
                               WHERE        (ACCVIEW_300_1.HeadRefNo = HeadRefNo)) AS CHKECODE
FROM            dbo.ACCVIEW_300 AS ACCVIEW_300_1
GROUP BY HeadRefNo

ACCVIEW_CR400
SELECT DISTINCT HeadRefNo, '2202600004' AS ExpensesCode, 'Provision - Sundries' AS TAccDesc, 'Provision - Sundries' AS EAccDesc, '' AS DRAMT, '1130' AS Division, SUM(DRAMT) AS CRAMT, 'Cr' AS CR,
                             (SELECT        TOP (1) ExpensesCode
                               FROM            dbo.ACCVIEW_400
                               WHERE        (ACCVIEW_400_1.HeadRefNo = HeadRefNo)) AS CHKECODE
FROM            dbo.ACCVIEW_400 AS ACCVIEW_400_1
GROUP BY HeadRefNo


ACCVIEW_ALL100
SELECT        HeadRefNo, 'Dr' AS DC, ExpensesCode, TAccDesc, EAccDesc, Division, DRAMT, CRAMT
FROM            ACCVIEW_100
UNION
SELECT        HeadRefNo, 'Cr' AS DC, ExpensesCode, TAccDesc, EAccDesc, Division, DRAMT, CRAMT
FROM            ACCVIEW_CR100


ACCVIEW_ALL200
SELECT        *
FROM            ACCVIEW_200_1
UNION
SELECT        *
FROM            ACCVIEW_200_2
UNION
SELECT        *
FROM            ACCVIEW_200_3


ACCVIEW_ALL300
SELECT        HeadRefNo, 'Dr' AS DC, ExpensesCode, TAccDesc, EAccDesc, Division, DRAMT, CRAMT
FROM            ACCVIEW_300
UNION
SELECT        HeadRefNo, 'Cr' AS DC, ExpensesCode, TAccDesc, EAccDesc, Division, DRAMT, CRAMT
FROM            ACCVIEW_CR300



ACCVIEW_ALL400
SELECT        HeadRefNo, 'Dr' AS DC, ExpensesCode, TAccDesc, EAccDesc, Division, DRAMT, CRAMT
FROM            ACCVIEW_400
UNION
SELECT        HeadRefNo, 'Cr' AS DC, ExpensesCode, TAccDesc, EAccDesc, Division, DRAMT, CRAMT
FROM            ACCVIEW_CR400


ERnextIDview
SELECT        HeadRefNo, MAX(ID) AS LastID, MAX(ID) + 1 AS NextID, SUM(LocalAmount) AS TAmount, SUM(RefundedAmount) AS RefundAmt
FROM            dbo.EXPREIM
GROUP BY HeadRefNo

EXPREIM_300
SELECT DISTINCT 
                         TOP (100) PERCENT HeadRefNo, ReqDate, PayToCode, PayToName, Department, Division, ExpGroupCode, ExpGroupDescEng, Confirmed, ConfirmedDate, HODApproved, HODApprovedDate, HRApproved, 
                         MAX(HRApprovedDate) AS HRApprovedDate, Approved, FAApprovedDate, PBatchNo, PBatchDate, PSPvNO, PSPvDate, Currency, Xrate, SUM(Amount) AS TotalAmount, SUM(LocalAmount) AS TotalLocalAmount, 
                         SUM(RefundedAmount) AS TotalReimburse, ERStatus, ERODesc06 AS ReqEmail,
                             (SELECT        TOP (1) ApproverEmail
                               FROM            dbo.Approver
                               WHERE        (ApproverCode = 'HR')) AS APPEmail,
                             (SELECT        TOP (1) ApproverName
                               FROM            dbo.Approver AS Approver_1
                               WHERE        (ApproverCode = 'HR')) AS APPName,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LimitAmount,
                             (SELECT        TOP (1) LimitedPerTime
                               FROM            dbo.Limitation AS Limitation_2
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LimitPerTime,
                             (SELECT        TOP (1) MonthlyLimited
                               FROM            dbo.Limitation AS Limitation_1
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS MaternityLimit, COUNT(*) AS nRecord
FROM            dbo.EXPREIM
WHERE        (LEN(trim(HeadRefNo)) >= 11) AND (ExpGroupCode = '300')
GROUP BY HeadRefNo, ReqDate, PayToCode, PayToName, Department, Division, ExpGroupCode, ExpGroupDescEng, PBatchNo, PBatchDate, Confirmed, Approved, HODApproved, HRApproved, ERStatus, PSPvNO, PSPvDate, Currency, 
                         Xrate, ConfirmedDate, HODApprovedDate, FAApprovedDate, ERODesc06

EXPREIM_400
SELECT DISTINCT 
                         TOP (100) PERCENT HeadRefNo, ReqDate, PayToCode, PayToName, Department, Division, ExpGroupCode, ExpGroupDescEng, Confirmed, ConfirmedDate, HODApproved, HODApprovedDate, HRApproved, 
                         MAX(HRApprovedDate) AS HRApprovedDate, Approved, FAApprovedDate, PBatchNo, PBatchDate, PSPvNO, PSPvDate, SUM(Amount) AS TotalAmount, SUM(LocalAmount) AS TotalLocalAmount, SUM(RefundedAmount) 
                         AS TotalReimburse, ERStatus, ERODesc06 AS ReqEmail,
                             (SELECT        TOP (1) ApproverEmail
                               FROM            dbo.Approver
                               WHERE        (ApproveToDivision = dbo.EXPREIM.Division)) AS APPEmail,
                             (SELECT        TOP (1) ApproverName
                               FROM            dbo.Approver AS Approver_1
                               WHERE        (ApproveToDivision = dbo.EXPREIM.Division)) AS APPName,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LimitAmount,
                             (SELECT        TOP (1) LimitedPerTime
                               FROM            dbo.Limitation AS Limitation_2
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LimitPerTime,
                             (SELECT        TOP (1) MonthlyLimited
                               FROM            dbo.Limitation AS Limitation_1
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS MaternityLimit, COUNT(*) AS nRecord
FROM            dbo.EXPREIM
WHERE        (LEN(trim(HeadRefNo)) >= 11) AND (ExpGroupCode = '400')
GROUP BY HeadRefNo, ReqDate, PayToCode, PayToName, Department, Division, ExpGroupCode, ExpGroupDescEng, PBatchNo, PBatchDate, Confirmed, Approved, HODApproved, HRApproved, ERStatus, PSPvNO, PSPvDate, 
                         ConfirmedDate, HODApprovedDate, FAApprovedDate, ERODesc06


EXPREIM_ALL
SELECT DISTINCT 
                         TOP (100) PERCENT HeadRefNo, ReqDate, PayToCode, PayToName, Department, Division, ExpGroupCode, ExpGroupDescEng, Confirmed, ConfirmedDate, HODApproved, HODApprovedDate, HRApproved, 
                         MAX(HRApprovedDate) AS HRApprovedDate, Approved, FAApprovedDate, PBatchNo, PBatchDate, PSPvNO, PSPvDate, SUM(Amount) AS TotalAmount, SUM(LocalAmount) AS TotalLocalAmount, SUM(RefundedAmount) 
                         AS TotalReimburse, ERStatus, ERODesc06 AS ReqEmail, CASE WHEN ExpGroupCode = '300' THEN
                             (SELECT        TOP (1) ApproverEmail
                               FROM            dbo.Approver
                               WHERE        (ApproverCode = 'HR')) ELSE
                             (SELECT        TOP (1) ApproverEmail
                               FROM            dbo.Approver AS Approver_2
                               WHERE        (ApproveToDivision = dbo.EXPREIM.Division)) END AS APPEmail, CASE WHEN ExpGroupCode = '300' THEN
                             (SELECT        TOP (1) ApproverName
                               FROM            dbo.Approver AS Approver_1
                               WHERE        (ApproverCode = 'HR')) ELSE
                             (SELECT        TOP (1) ApproverName
                               FROM            dbo.Approver AS Approver_1
                               WHERE        (ApproveToDivision = dbo.EXPREIM.Division)) END AS APPName,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LimitAmount,
                             (SELECT        TOP (1) LimitedPerTime
                               FROM            dbo.Limitation AS Limitation_2
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LimitPerTime,
                             (SELECT        TOP (1) MonthlyLimited
                               FROM            dbo.Limitation AS Limitation_1
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS MaternityLimit, COUNT(*) AS nRecord
FROM            dbo.EXPREIM
WHERE        (LEN(trim(HeadRefNo)) >= 11)
GROUP BY HeadRefNo, ReqDate, PayToCode, PayToName, Department, Division, ExpGroupCode, ExpGroupDescEng, PBatchNo, PBatchDate, Confirmed, Approved, HODApproved, HRApproved, ERStatus, PSPvNO, PSPvDate, 
                         ConfirmedDate, HODApprovedDate, FAApprovedDate, ERODesc06

EXPRIM_200
SELECT DISTINCT 
                         TOP (100) PERCENT HeadRefNo, ReqDate, PayToCode, PayToName, Department, Division, ExpGroupCode, ExpGroupDescEng, Confirmed, ConfirmedDate, HODApproved, HODApprovedDate, HRApproved, 
                         MAX(HRApprovedDate) AS HRApprovedDate, Approved, FAApprovedDate, PBatchNo, PBatchDate, PSPvNO, PSPvDate, Currency, Xrate, SUM(Amount) AS TotalAmount, SUM(LocalAmount) AS TotalLocalAmount, 
                         SUM(RefundedAmount) AS TotalReimburse, ERStatus, ERODesc06 AS ReqEmail,
                             (SELECT        TOP (1) ApproverEmail
                               FROM            dbo.Approver
                               WHERE        (ApproveToDivision = dbo.EXPREIM.Division)) AS APPEmail,
                             (SELECT        TOP (1) ApproverName
                               FROM            dbo.Approver AS Approver_1
                               WHERE        (ApproveToDivision = dbo.EXPREIM.Division)) AS APPName,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LimitAmount,
                             (SELECT        TOP (1) LimitedPerTime
                               FROM            dbo.Limitation AS Limitation_2
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LimitPerTime,
                             (SELECT        TOP (1) MonthlyLimited
                               FROM            dbo.Limitation AS Limitation_1
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS MaternityLimit, COUNT(*) AS nRecord
FROM            dbo.EXPREIM
WHERE        (LEN(trim(HeadRefNo)) >= 11) AND (ExpGroupCode = '200')
GROUP BY HeadRefNo, ReqDate, PayToCode, PayToName, Department, Division, ExpGroupCode, ExpGroupDescEng, PBatchNo, PBatchDate, Confirmed, Approved, HODApproved, HRApproved, ERStatus, PSPvNO, PSPvDate, Currency, 
                         Xrate, ConfirmedDate, HODApprovedDate, FAApprovedDate, ERODesc06

MSumDView
 SELECT        PayToCode, PayToName, ExpGroupCode, ExpGroupDescEng, YEAR(ReqDate) AS QYear, SUM(LocalAmount) AS TAmount, SUM(RefundedAmount) AS TRefundAmt,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) AS LAmount,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation AS Limitation_1
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = dbo.EXPREIM.ExpGroupCode)) - SUM(RefundedAmount) AS MRemained
FROM            dbo.EXPREIM
WHERE        (ExpGroupCode = '300')
GROUP BY PayToCode, PayToName, ExpGroupCode, ExpGroupDescEng, YEAR(ReqDate)                        

MTACCView
SELECT        HeadRefNo, PayToCode, LimitAmount, TotalAmount, TotalReimburse, 'Dr' AS DC01, '5204100003' AS AC01, 'Sickness & Maternity' AS AN01, TotalReimburse AS AT01, 0.00 AS CT01, 'Cr' AS DC02, '2202600004' AS AC02, 
                         'Provision - Sundries' AS AN02, 0.00 AS AT02, TotalReimburse AS CT02, Department AS DP01, '1130' AS DP02
FROM            dbo.EXPREIM_300


PPM_ERDATA
SELECT        dbo.ACCVIEW_ALL.HeadRefNo, dbo.ACCVIEW_ALL.DC, dbo.ACCVIEW_ALL.ExpensesCode, dbo.ACCVIEW_ALL.TAccDesc, dbo.ACCVIEW_ALL.EAccDesc, dbo.ACCVIEW_ALL.Division, dbo.ACCVIEW_ALL.DRAMT, 
                         dbo.ACCVIEW_ALL.CRAMT, dbo.EXPREIM_ALL.PayToCode, dbo.EXPREIM_ALL.PayToName, dbo.EXPREIM_ALL.PBatchNo, dbo.EXPREIM_ALL.PBatchDate, 
                         dbo.EXPREIM_ALL.PBatchNo + dbo.EXPREIM_ALL.HeadRefNo AS PPMREFNO, dbo.EXPREIM_ALL.ExpGroupCode
FROM            dbo.ACCVIEW_ALL LEFT OUTER JOIN
                         dbo.EXPREIM_ALL ON dbo.ACCVIEW_ALL.HeadRefNo = dbo.EXPREIM_ALL.HeadRefNo



TACCView 
SELECT        HeadRefNo, PayToCode,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) AS LimitedAmount, SUM(LocalAmount) AS TotalLAmount, SUM(RefundedAmount) AS TotalRefundAmt, 'Dr' AS DC01, '2202600008' AS AC01, 
                         '????????????? - ?????????' AS AN01,
                             (SELECT        TOP (1) TotalLimited
                               FROM            dbo.Limitation AS Limitation_1
                               WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) - (SUM(LocalAmount) - SUM(RefundedAmount)) AS AT01, 0.00 AS CT01, CASE WHEN
                             ((SELECT        TOP (1) TotalLimited
                                 FROM            dbo.Limitation
                                 WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) - SUM(LocalAmount)) >= 0 THEN 'Cr' ELSE 'Dr' END AS DC02, '5102300001' AS AC02, '???????? - ?????????' AS AN02, CASE WHEN
                             ((SELECT        TOP (1) TotalLimited
                                 FROM            dbo.Limitation
                                 WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) - SUM(LocalAmount)) >= 0 THEN 0.00 ELSE ABS(MAX(LimitedAmount) - SUM(LocalAmount)) END AS AT02, CASE WHEN
                             ((SELECT        TOP (1) TotalLimited
                                 FROM            dbo.Limitation
                                 WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) - SUM(LocalAmount)) >= 0 THEN ABS
                             ((SELECT        TOP (1) TotalLimited
                                 FROM            dbo.Limitation
                                 WHERE        (EmpID = dbo.EXPREIM.PayToCode) AND (ExpGroupCode = '200')) - SUM(LocalAmount)) ELSE 0.00 END AS CT02, 'Cr' AS DC03, '2202600004' AS AC03, '?????????????????? - ?????' AS AN03, 0.00 AS AT03, 
                         SUM(RefundedAmount) AS CT03, 'Dr' AS DC04, '2202600008' AS AC04, '????????????? - ?????????' AS AN04, SUM(RefundedAmount) AS AT04, 0.00 AS CT04, 'Cr' AS DC05, '1000502001' AS AC05, 
                         '?????????????????.?????????? - ??? - 5116258023' AS AN05, 0.00 AS AT05, SUM(RefundedAmount) AS CT05, '1130' AS DP01, Department AS DP02, '1130' AS DP03, '1130' AS DP04, '1130' AS DP05
FROM            dbo.EXPREIM
WHERE        (ExpGroupCode = '200')
GROUP BY HeadRefNo, PayToCode, Department

ApproverNextNoView
SELECT        MAX(IDNO) + 1 AS NextNO
FROM            dbo.Approver


ACCVIEW_ALL
SELECT        *
FROM            ACCVIEW_ALL100
UNION
SELECT        *
FROM            ACCVIEW_ALL200
UNION
SELECT        *
FROM            ACCVIEW_ALL300
UNION
SELECT        *
FROM            ACCVIEW_ALL400
