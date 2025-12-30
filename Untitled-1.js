// Check Benefits Popup 
        function aPopUpBenefits(iData) { 
            var aYearNum1 = aaGetBusYear(1, 4, aNowDte); 
            var aYearStr1 = aYearNum1.toString()
            var aCalYear = aNowDte.getFullYear();
            var aCalYearStr = aCalYear.toString();
            var aaSqlS = "PayToCode LIKE '" + $.trim(aaEmpID) + "%' AND ((ExpGroupDescEng Like '%SSO%' and (QYear = " + aYearStr1 + " or QYear = " + aCalYearStr + ")) or QYear = " + aYearStr1 + ") AND (TAmount + TRefundAmt) <> 0 "
            var aaqrFull = aaSqlS;
            var aaurl = aaPFDMI + '/DMQ/XOL/' + atob(aaXToX) + '/' + "D8CAE826-9DFA-4446-A12C-0C42B1A95ADB" + '/all'
            var aaSettings = { "url": aaurl, "method": "POST", "timeout": 0, "headers": { "Content-Type": "application/json" }, "data": JSON.stringify({ "@": btoa(aaqrFull) }), };
            
            $(() => {
                const popup = $("#popupBenefitsView").dxPopup({
                    title: "My Benefits",
                    width: '900px',
                    height: '600px',
                    focusStateEnabled: true,
                    position: { offset: "0 -165" }, 
                    visible: true,
                    fullScreen: false,
                    showCloseButton: false,
                    showTitle: true,
                    dragEnabled: true,
                    closeOnOutsideClick: false,
                    resizeEnabled: true,
                    
                    contentTemplate: function () {
                        return $("<div />").append(
                            $("<p><div id='Benefits-View' background-color: grey></div></p>"), //'<hr>'
                            $("<p><hr></p>"),
                            $("<span style='font-size: 13px; font-weight: bold; color: darkblue; background-color: rgb(64, 224, 208); border-radius: 3px; border: 0px; padding: 1px 10px;' />") //text-align: center; color:blue; border-radius: 5px; border: 2px solid #73AD21; width: 250px; height: 10px;
                                .text("MEDICAL BENEFITS BALANCE"),
                            $("<br>"),
                            $("<span style='font-size: 9px;  color: darkblue;' />").text("[NOT SHOW = Never used, Medical = OPD+Dental]"),
                            $("<p><center><div id='Benefits-Movement'></div></center></p>"),                           
                        );
                    },
                  
                    toolbarItems: [
                        {
                            toolbar: "top",
                            locateInMenu: 'always',
                        },
                        {
                            toolbar: "top",
                            locateInMenu: 'always',
                            widget: "dxButton",
                            //toolbar: "bottom",
                            location: "after",
                            options: {
                                //text: "EXIT",
                                icon: "fas fa-times",
                                stylingMode: "outlined",
                                type: "danger",
                                onClick: function (e) {
                                    popup.hide()
                                }
                            }
                        }]

                }).dxPopup("instance");

                //Benefits Popup
                const aform = $("#Benefits-View").dxForm({
                    formData: iData, //aXXData[0], //iData, aaLimited
                    showColonAfterLabel: false,
                    labelLocation: "left", //"top",
                    cssClass: "aMarkRef",
                    readOnly: true,
                    colCount: 1,
                    items: [{
                        itemType: "group",
                        colCount: 3,
                        items: [
                            {
                                dataField: "EmpName",
                                label: { text: "Name" },
                                editorType: "dxTextBox",
                                editorOptions: { value: asFullName, width: 150 },
                            },

                            {
                                dataField: "AllowFamily",
                                label: { text: "Allow Family" },
                                editorOptions: { value: aaFamily, width: 100 },
                            },

                            {
                                dataField: "AllowSSO",
                                label: { text: "Allow SSO" },
                                editorOptions: { value: aaSSO, width: 100 },
                            },

                            {
                                dataField: "MedicalLimit",
                                label: { text: "Medical Limit" },
                                editorOptions: { value: aaMedical, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                visible: true,
                            },
                            {
                                dataField: "LimitPerCase",
                                label: { text: "Medical Limit per time" },
                                editorOptions: { value: aaLimitPC, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                visible: (aaLimitPC !== 0),
                            },
                            {
                                dataField: "MaternityLimit",
                                label: { text: "Maternity Limit" },
                                editorOptions: { value: aaMaternity, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                visible: (aaMaternity !== 0),
                            },
                            {
                                itemType: "empty"
                            },
                            {
                                dataField: "FleetLimit",
                                label: { text: "Fleet Card Limit" },
                                editorOptions: { value: aaFleet, format: "#,##0.00", rtlEnabled: true, width: 150, readOnly: true }, //value: aaLMontyly,
                                visible: (aaFleet !== 0),
                            },
                            {
                                dataField: "EmpPosition",
                                label: { text: "Plate No" },
                                editorType: "dxTextBox",
                                editorOptions: { value: aaPlateNo, width: 180 },
                                visible: (aaFleet !== 0),
                            },
                            {
                                dataField: "EmpDept",
                                label: { text: "Fleet Card NO" },
                                editorType: "dxTextBox",
                                editorOptions: { value: aaFCardNo, width: 180 },
                                visible: (aaFleet !== 0),
                            },

                        ]

                    },

                    ]

                }).dxForm("instance");

                //Benefits DataGrid
                $("#Benefits-Movement").dxDataGrid({

                    dataSource: new DevExpress.data.CustomStore({
                        key: "PayToCode",
                        loadMode: "omit",
                        load: function () { return $.post(aaSettings).done(); },
                    }),

                    allowColumnReordering: true,
                    allowColumnResizing: false,
                    columnMinWidth: 20,
                    columnChooser: {
                        enabled: false 
                    },
                    
                    showBorders: true,
                    showColumnLines: true,
                    rowAlternationEnabled: true, // 2 Tones Line Color
                    columns: [
                        {
                            dataField: "ExpGroupDescEng",
                            caption: "Expenese",
                            sortOrder: "desc",
                            editorOptions: { width: 120 },
                            width: 120
                        },
                        {
                            dataField: "QYear",
                            caption: "Year",
                            editorOptions: { width: 80 },
                            width: 80,
                            visible: true,
                        },
                        {  
                            dataField: "LAmount",
                            caption: "Limit Amount",
                            dataType: "number",
                            format: { type: "fixedPoint", precision: 2 },
                            width: 120,
                            visible: true,
                        },
                        {
                            dataField: "TAmount",
                            caption: "Actual Amount",
                            dataType: "number",
                            format: { type: "fixedPoint", precision: 2 },
                            width: 120,
                            visible: true,
                        },
                        {
                            dataField: "TRefundAmt",
                            caption: "Reimbursement",
                            dataType: "number",
                            format: { type: "fixedPoint", precision: 2 },
                            width: 120,
                            visible: true,
                        },
                        {
                            dataField: "MRemained",
                            caption: "Remained",
                            dataType: "number",
                            format: { type: "fixedPoint", precision: 2 },
                            width: 120,
                            visible: true,
                        },
                        

                    ],
                    
                    summary: {
                        recalculateWhileEditing: true,
                        skipEmptyValues: false,
                        totalItems: [

                            {
                                column: "ExpGroupDescEng",
                                summaryType: "count",
                                displayFormat: "TOTAL",
                            },
                            {
                                column: "TAmount",
                                cssClass: "colorGreen",
                                summaryType: "sum",
                                valueFormat: "#,##0.00",
                                displayFormat: "{0}",
                            },
                            {
                                column: "TRefundAmt",
                                cssClass: "colorGreen",
                                summaryType: "sum",
                                valueFormat: "#,##0.00",
                                displayFormat: "{0}",
                            },
                        ],

                    },

                }).dxDataGrid("instance");

            });
        }