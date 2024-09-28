import $ from 'jquery';
import DevExpress from 'devextreme';
import 'devextreme/ui/popup';

// Function to describe roles
function aRolesDesc(aRoles: string): string {
    const aRolesM = ["00", "ReadOnly", "CRU", "CRUD", "Disable", "Import", "Export", "Import and Export", "Printable", "Export2PDF", "Export2Excel", "Report Full Rights"];
    const aFR = ["Data:", "Excel:", "PDF:", "REPORT:"];
    let aPass = "";
    let aCC: number;
    let aF1 = aRoles.substring(0, 1);
    let i = 0;

    while (i < 4) {
        const char = aRoles.substring(i, i + 1);
        if (char === "A") {
            aCC = 10;
        } else if (char === "B") {
            aCC = 11;
        } else {
            aCC = Number(char);
        }
        aPass = aPass + aFR[i] + " " + aRolesM[aCC] + ",";
        i++;
    }
    return aPass;
}

// Function to initialize the page
function initializePage() {
    setTimeout(() => {
        location.reload();
    }, 3000000); // refresh after 5 seconds 5*60*1000 refresh first time and every 40 minutes

    $(document).ready(() => {
        const aDXTheme = localStorage.getItem("aDXTheme");
        if (aDXTheme) {
            DevExpress.ui.themes.current(aDXTheme);
        }

        const aDXMenuTitle = localStorage.getItem("aDXMenuTitle");
        const aMMaMx = localStorage.getItem("MMaMx");
        if (!aMMaMx) return;

        const aRRgRs = aMMaMx.split('0');
        const aDDeDx = aRRgRs[0];
        let aRrgSx = aRRgRs[1] || "377B";
        const aRText = aRolesDesc(aRrgSx);

        const popup = $("#popupContainer").dxPopup({
            title: `${aDXMenuTitle} Maintenance (XOL)`,
            height: '30%',
            position: { offset: "40 -300" }, // { my: "top", at: "top", of: window },
            visible: true,
            showCloseButton: false,
            contentTemplate: `<h1><i class='fas fa-clock'></i> IN PROGRESS</h1><p>Develop by DevExtreme, DevExpress, jQuery, JavaScript, FontAwesome, uicon </br> Program Access Rights : ${aDDeDx}</br>Usage Roles : ${aRrgSx} [${aRText}]</p>`
        }).dxPopup("instance");
    });
}

// Run initialization
window.onload = initializePage;
