$(function () {
    // Initialize the form with default rows
    const formData = Array.from({ length: 10 }, () => ({
        Description: "",
        Purpose: "",
        Company: "",
    }));

    // Create the form
    $("#formContainer").dxForm({
        formData: formData,
        colCount: 1,
        items: formData.map((_, index) => ({
            itemType: "group",
            items: [
                { dataField: `Description_${index}`, label: { text: "Description" }, editorType: "dxTextBox" },
                { dataField: `Purpose_${index}`, label: { text: "Purpose" }, editorType: "dxTextBox" },
                { dataField: `Company_${index}`, label: { text: "Company" }, editorType: "dxTextBox" },
            ],
        })),
    });

    // Handle paste event
    $("#pasteArea").on("input", function () {
        const selectedField = $("#fieldSelect").val();
        const pastedData = $(this).val().trim().split("\n");

        const formInstance = $("#formContainer").dxForm("instance");

        pastedData.forEach((value, index) => {
            if (index < formData.length) {
                const fieldKey = `${selectedField}_${index}`;
                formInstance.updateData(fieldKey, value);
            }
        });
    });
});
