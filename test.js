
$(function() {
    $("#dataGrid").dxDataGrid({
        editing: {
            mode: "cell",
            allowUpdating: true,
            allowAdding: true,
            allowDeleting: true
        },
        dataSource: [],
        columns: [
            { dataField: "ReqDate", caption: "REQ. Date", dataType: "date", format: "dd/MM/yyyy",},
            { dataField: "Description", caption: "Description" },
            { dataField: "Purpose", caption: "Purpose" },
            { dataField: "Company", caption: "Company" }
        ],
        onContentReady: function(e) {
            // Enable pasting data into the grid
            e.element.on("paste", function(event) {
                navigator.clipboard.readText().then((text) => {
                    const rows = text.trim().split("\n").map(row => row.split("\t"));
                    const data = rows.map(row => ({
                        ReqDate: row[0],
                        Description: row[1],
                        Purpose: row[2],
                        Company: row[3]
                    }));
                    e.component.option("dataSource", data);
                });
            });
        }
    });
});
