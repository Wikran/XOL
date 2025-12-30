const acMailAPI = "https://cbsdev3.locktonwattana.com/send-email/false/smtp2";

    const formData = {
      from: "wikran@hotmail.com",
      toName: "",
      toEmail: "",
      ccEmail: "",
      bccEmail: "",
      subject: "",
      message: ""
    };

    $("#emailForm").dxForm({
      formData: formData,
      labelLocation: "top",
      items: [
        { dataField: "from", label: { text: "From Email" }, editorOptions: { readOnly: true } },
        { dataField: "toName", label: { text: "To Name" } },
        { dataField: "toEmail", label: { text: "To Email (ใช้ ; แยก CC และ BCC)" } },
        { dataField: "subject", label: { text: "Subject" } },
        {
          dataField: "message",
          editorType: "dxTextArea",
          label: { text: "Message Body" },
          editorOptions: { height: 120 }
        }
      ]
    });

    $("#sendBtn").dxButton({
  text: "Send Mail",
  type: "success",
  onClick: function () {
    const form = $("#emailForm").dxForm("instance").option("formData");

    // Convert plain text to safe HTML
    function formatToHTML(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Replace multiple spaces with non-breaking spaces
  const withSpaces = escaped.replace(/  /g, "&nbsp;&nbsp;"); // handles double spaces
  
  // Convert line breaks to <br>
  return withSpaces.replace(/\n/g, "<br>");
}


    const formattedMessage = `<div style="font-family:Segoe UI, sans-serif; font-size:14px;">${formatToHTML(form.message)}</div>`;

    aSendMailDMZ(
      form.toName,
      form.toEmail,
      form.from,
      form.ccEmail,
      form.bccEmail,
      form.subject,
      formattedMessage
    );
  }
});


    function aSendMailDMZ(aRecipient, aRCPeMailList, aSendereMail, aCCeMail, aBcceMail, aSubject, aMessage) {
  // 🔧 ป้องกันการส่งซ้ำ
  let sentEmails = new Set();

  // 🧾 แยกรายชื่ออีเมลออกจากกันด้วย ,
  let recipients = aRCPeMailList.split(',').map(e => e.trim()).filter(e => e !== "");

  // 🚀 ส่งอีเมลทีละคนโดยไม่ซ้ำ
  recipients.forEach((rcp) => {
    if (!sentEmails.has(rcp)) {
      let raw = JSON.stringify({
        toname: aRecipient,
        toemail: rcp,
        fromemail: aSendereMail,
        ccemail: aCCeMail || "",    // รองรับ CC
        bccemail: aBcceMail || "",  // รองรับ BCC
        subject: aSubject,
        message: aMessage           // ✅ ใช้ข้อความตรง ๆ โดยไม่ผ่านการแปลงเป็น HTML
      });

      fetch("https://cbsdev3.locktonwattana.com/send-email/false/smtp2", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: raw
      })
      .then(response => {
        if (response.ok) {
          console.log(`✅ สำเร็จ: ส่งถึง ${rcp}`);
        } else {
          console.log(`❌ ล้มเหลว: ${rcp}`);
        }
      })
      .catch(error => {
        console.log(`⚠️ เกิดข้อผิดพลาดกับ ${rcp}:`, error);
      });

      sentEmails.add(rcp);
    } else {
      console.log(`⏭️ ข้าม (ซ้ำ): ${rcp}`);
    }
  });
}