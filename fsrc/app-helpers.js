// app-helpers.js
// Global namespace for reusable helper functions

window.AppHelpers = window.AppHelpers || {};

AppHelpers.MDropDown = function (config) {
    return function (cellElement, cellInfo) {
        const {
            tbKey,
            queryFilter = "Active = 1",
            keyField = "IDUsr",
            displayField = "Nickname",
            returnField = "Nickname",
            returnFields = null,        // optional: map multiple fields
            columns = [],
            dropDownWidth = 1000,
            gridHeight = 420,
            pageSize = 20,
            customRowStyle = true,
            onSelectCallback = null,
        } = config;

        const url = `${aaPFDMI}/DMQ/XOL/${atob(aaXToX)}/${tbKey}/all`;

        const dataSource = new DevExpress.data.CustomStore({
            key: keyField,
            loadMode: "raw",
            load: async () => {
                try {
                    const resp = await $.ajax({
                        url,
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        data: JSON.stringify({ "@": btoa(queryFilter) }),
                    });
                    return resp;
                } catch (err) {
                    console.error("Dropdown load failed:", err);
                    return [];
                }
            },
        });

        return $("<div>").dxDropDownBox({
            dropDownOptions: { width: dropDownWidth },
            dataSource,
            value: cellInfo.value,
            valueExpr: keyField,
            displayExpr: displayField,
            contentTemplate: function (e) {
                return $("<div>").dxDataGrid({
                    dataSource,
                    columns,
                    hoverStateEnabled: true,
                    searchPanel: { visible: true },
                    headerFilter: { visible: true },
                    paging: { enabled: true, pageSize },
                    filterRow: { visible: true },
                    showBorders: true,
                    scrolling: { mode: "virtual" },
                    selection: { mode: "single" },
                    height: gridHeight,
                    selectedRowKeys: [cellInfo.value],
                    focusedRowKey: cellInfo.value,
                    onRowPrepared: function (info) {
                        if (customRowStyle && info.rowType === "data") {
                            info.rowElement.css({
                                "background-color": "#fdfde3",
                                "color": "#333",
                            });
                        }
                    },
                    onSelectionChanged: function (sArgs) {
                        const selectedRow = sArgs.selectedRowsData[0];
                        if (selectedRow) {
                            // Single field return
                            const returnValue = selectedRow[returnField];
                            e.component.option("value", returnValue);
                            cellInfo.setValue(returnValue);

                            // Multi-field return
                            if (returnFields && typeof returnFields === "object") {
                                Object.keys(returnFields).forEach(gridField => {
                                    const sourceField = returnFields[gridField];
                                    cellInfo.component.cellValue(
                                        cellInfo.rowIndex,
                                        gridField,
                                        selectedRow[sourceField]
                                    );
                                });
                            }

                            e.component.close();

                            if (typeof onSelectCallback === "function") {
                                onSelectCallback(selectedRow, cellInfo);
                            }
                        }
                    },
                });
            },
        });
    };
};

// New function: aSaveMemToDB
AppHelpers.aSaveMemToDB = function (iData, aaTBKey, aaPFDMI, aaXToX) {
    const aObjRowData = JSON.stringify(iData);

    // Call sendRequestNew three times (as in your original code)
    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
    sendRequestNew("Update", aObjRowData, aaTBKey, aaPFDMI, atob(aaXToX));
};

/**
 * Save data to DB with retry mechanism
 * @param {Object} iData - The data object to save
 * @param {string} aaTBKey - Table key
 * @param {string} aaPFDMI - API endpoint
 * @param {string} aaXToX - Encoded token
 * @param {number} retries - Number of retry attempts (default 3)
 * @param {number} delay - Delay between retries in ms (default 300)
 */
AppHelpers.SaveMemToDBs = async function (
    iData,
    aaTBKey,
    aaPFDMI,
    aaXToX,
    retries = 3,
    delay = 300
) {
    const aObjRowData = JSON.stringify(iData);

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            // Assuming sendRequestNew returns a Promise
            const result = await sendRequestNew(
                "Update",
                aObjRowData,
                aaTBKey,
                aaPFDMI,
                atob(aaXToX)
            );

            console.log(`Save successful on attempt ${attempt}`);
            return result; // ✅ Exit if successful
        } catch (err) {
            console.warn(`Save attempt ${attempt} failed:`, err);

            if (attempt < retries) {
                // wait before retrying
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error("All save attempts failed");
                throw err; // ❌ rethrow after final attempt
            }
        }
    }
};

/**
 * Clone and save data into DB with a new ID and optional division
 * @param {Object} iData - Original data object
 * @param {string} aaTBKey - Table key
 * @param {string} aaPFDMI - API endpoint
 * @param {string} aaXToX - Encoded token
 * @param {string} [NewDiv] - Optional division override
 * @returns {Promise<any>} - Result of the save request
 */
AppHelpers.SaveCloneDBs = async function (iData, aaTBKey, aaPFDMI, aaXToX, NewDiv) {
    try {
        // Generate new ID
        const aaID = aGetDateRef("T").substring(1, 11);

        // Build key data
        const aObjKeyData = {
            IDNO: aaID,
            ...(NewDiv ? { ApproveToDivision: NewDiv } : {})
        };

        // Merge objects (modern spread instead of $.extend)
        const mergedData = { ...iData, ...aObjKeyData };

        // Serialize
        const aObjRowData = JSON.stringify(mergedData);

        // Await the request (assuming sendRequestNew returns a Promise)
        const result = await sendRequestNew(
            "Insert",
            aObjRowData,
            aaTBKey,
            aaPFDMI,
            atob(aaXToX)
        );

        console.log("Clone saved successfully:", result);
        return result;
    } catch (err) {
        console.error("Failed to save clone:", err);
        throw err; // rethrow so caller can handle
    }
};

/**
 * Create a DevExtreme popup viewer with fullscreen toggle, draggable mode, and top positioning.
 * @param {string|HTMLElement|jQuery} contentHtml - HTML content to display inside the popup
 * @param {Object} [options] - Optional configuration overrides
 * @param {string} [options.id="#popupViewer"] - DOM selector for the popup container
 * @param {string} [options.title="View Attached File"] - Title text for the popup
 */
 /* 
  Example usage:
  AppHelpers.createPopupViewer("<div>Preview content here</div>", {
    id: "#popupViewer",
    title: "Preview: Invoice.pdf"
  }); 
*/
AppHelpers.createPopupViewer = (contentHtml, options = {}) => {
    try {
      let isFullScreen = true;
  
      const popupId = options.id || "#popupViewer";
      const popupInstance = $(popupId).dxPopup("instance");
  
      if (!popupInstance) {
        console.warn(`Popup element not found: ${popupId}`);
        return;
      }
  
      const toggleFullscreen = () => {
        isFullScreen = !isFullScreen;
        popupInstance.option({
          fullScreen: isFullScreen,
          dragEnabled: !isFullScreen,
          toolbarItems: [{
            widget: "dxButton",
            location: "after",
            options: {
              icon: isFullScreen ? "collapse" : "expand",
              hint: isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen",
              onClick: toggleFullscreen
            }
          }]
        });
      };
  
      popupInstance.option({
        title: options.title || "View Attached File",
        visible: true,
        showTitle: true,
        showCloseButton: true,
        fullScreen: isFullScreen,
        dragEnabled: !isFullScreen,
        width: "80%",
        height: "80%",
        position: {
          my: "top center",
          at: "top center",
          offset: "0 20"
        },
        contentTemplate: contentElement => {
          contentElement.append(contentHtml);
        },
        toolbarItems: [
          {
            widget: "dxButton",
            location: "after",
            options: {
              icon: "collapse",
              hint: "Exit Fullscreen",
              onClick: toggleFullscreen
            }
          }
        ]
      });
    } catch (err) {
      console.error("Failed to create popup viewer:", err);
    }
  };
  
 
  
  