<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>

<script runat="server">
  protected void Page_Load(object sender, EventArgs e)
  {
    // 🔐 Whitelist ของ origin ที่อนุญาต
    var allowedOrigins = new[] {
      "http://localhost:8089",
      "https://webspace.locktonwattana.com/XOL"
    };

    string origin = Request.Headers["Origin"];
    if (!string.IsNullOrEmpty(origin) && allowedOrigins.Contains(origin.ToLower()))
    {
      Response.AddHeader("Access-Control-Allow-Origin", origin);
      Response.AddHeader("Access-Control-Allow-Headers", "Content-Type");
      Response.AddHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      Response.AddHeader("Access-Control-Allow-Credentials", "true");
    }

    // 🧪 Handle preflight OPTIONS request
    if (Request.HttpMethod == "OPTIONS")
    {
      Response.StatusCode = 200;
      Response.End();
      return;
    }

    // 📁 Base folder
    string basePath = Server.MapPath("~/temp/uploads/");
    string folderPath = basePath;

    // 📂 รองรับ path หลายชั้นผ่าน ?sub=reports/2025/Q4
    string sub = Request.QueryString["sub"];
    if (!string.IsNullOrEmpty(sub))
    {
      string safeSub = sub.Replace("\\", "/").Replace("..", "");
      folderPath = Path.Combine(basePath, safeSub);

      // ตรวจว่า path ยังอยู่ภายใต้ basePath
      string fullResolved = Path.GetFullPath(folderPath);
      string baseResolved = Path.GetFullPath(basePath);
      if (!fullResolved.StartsWith(baseResolved))
      {
        Response.StatusCode = 400;
        Response.ContentType = "application/json";
        Response.Write("{\"error\":\"Invalid path\"}");
        Response.End();
        return;
      }
    }

    if (!Directory.Exists(folderPath))
    {
      Response.StatusCode = 404;
      Response.ContentType = "application/json";
      Response.Write("{\"error\":\"Folder not found\"}");
      Response.End();
      return;
    }

    var fileList = new List<object>();

    // 📂 เพิ่มโฟลเดอร์ย่อย
    string[] dirPaths = Directory.GetDirectories(folderPath);
    foreach (string dir in dirPaths)
    {
      var info = new DirectoryInfo(dir);
      fileList.Add(new {
        filename = info.Name,
        type = "folder",
        modified = info.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
      });
    }

    // 📄 เพิ่มไฟล์
    string[] filePaths = Directory.GetFiles(folderPath);
    foreach (string path in filePaths)
    {
      var info = new FileInfo(path);
      fileList.Add(new {
        filename = info.Name,
        type = "file",
        modified = info.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
      });
    }

    // 📤 Return JSON
    var serializer = new JavaScriptSerializer();
    Response.ContentType = "application/json";
    Response.Write(serializer.Serialize(fileList));
  }
</script>
