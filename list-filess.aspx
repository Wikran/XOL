<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>

<script runat="server">
  protected void Page_Load(object sender, EventArgs e)
  {
    // ระบุ path ของโฟลเดอร์ uploads
    string folderPath = Server.MapPath("~/temp/uploads/");
    
    // ดึงชื่อไฟล์ทั้งหมด
    string[] files = Directory.GetFiles(folderPath);
    for (int i = 0; i < files.Length; i++)
    {
      files[i] = Path.GetFileName(files[i]);
    }

    // ส่งออกเป็น JSON
    var serializer = new JavaScriptSerializer();
    Response.ContentType = "application/json";
    Response.Write(serializer.Serialize(files));
  }
</script>
