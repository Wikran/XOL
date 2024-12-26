
$(function () {
    const msalConfig = {
        auth: {
            clientId: '45887e5d-f593-4973-b957-4e80d32875c7', // Replace with your Client ID find from Azure // d06fb086-2e92-4d48-bd18-9702d0f185b0
            authority: 'https://login.microsoftonline.com/common', // Use the common endpoint
            redirectUri: 'http://localhost:8089' // Ensure this matches the registered redirect URI //https://cbsdev2.locktonwattana.com
        }
    };
    
    const msalInstance = new msal.PublicClientApplication(msalConfig);
    

    async function getToken() {
        const loginRequest = {
            scopes: ["Mail.Send"]
        };

        try {
            const loginResponse = await msalInstance.loginPopup(loginRequest);
            const tokenRequest = {
                scopes: ["Mail.Send"],
                account: loginResponse.account
            };
            const tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
            return tokenResponse.accessToken;
        } catch (error) {
            console.error('Error acquiring token:', error);
            if (error instanceof msal.InteractionRequiredAuthError) {
                try {
                    const tokenResponse = await msalInstance.acquireTokenPopup(tokenRequest);
                    return tokenResponse.accessToken;
                } catch (popupError) {
                    console.error('Error acquiring token via popup:', popupError);
                }
            }
            return null;
        }
    }


    // $("#email-form").dxForm({
    //     formData: {
    //         to: "",
    //         cc: "",
    //         bcc: "",
    //         subject: "",
    //         body: "",
    //         attachment: null
    //     },
    //     items: [
    //         {
    //             dataField: "to",
    //             label: { text: "To" },
    //             editorType: "dxTextBox",
    //             editorOptions: { placeholder: "Recipient email address" }
    //         },
    //         {
    //             dataField: "cc",
    //             label: { text: "CC" },
    //             editorType: "dxTextBox",
    //             editorOptions: { placeholder: "CC email addresses" }
    //         },
    //         {
    //             dataField: "bcc",
    //             label: { text: "BCC" },
    //             editorType: "dxTextBox",
    //             editorOptions: { placeholder: "BCC email addresses" }
    //         },
    //         {
    //             dataField: "subject",
    //             label: { text: "Subject" },
    //             editorType: "dxTextBox",
    //             editorOptions: { placeholder: "Email subject" }
    //         },
    //         {
    //             dataField: "body",
    //             label: { text: "Body" },
    //             editorType: "dxTextArea",
    //             editorOptions: { placeholder: "Email body", height: 100 }
    //         },
    //         {
    //             dataField: "attachment",
    //             label: { text: "Attachment" },
    //             editorType: "dxFileUploader",
    //             editorOptions: {
    //                 selectButtonText: "Select file",
    //                 labelText: "",
    //                 uploadMode: "useButtons"
    //             }
    //         }
    //     ]
    // });
  
    async function sendMail() {
        const accessToken = await getToken();
        if (!accessToken) {
            console.error('Failed to acquire access token');
            return;
        }

        const email = {
            message: {
                subject: "TEST send mail from MS Graph API",
                body: {
                    contentType: "Text",
                    content: "The new cafeteria is open. ทดสอบภาษาไทยส่งไปที่ Email"
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: "wikran@hotmail.com"
                        }
                    }
                ]
            }
        };

        const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
        });

        if (response.ok) {
            console.log('Email sent successfully!');
        } else {
            const errorData = await response.json();
            console.error('Error sending email:', errorData);
        }
    }


    $("#send-email-button").dxButton({
        text: "Send Email",
        onClick: function () {
            const formData = $("#email-form").dxForm("instance").option("formData");
            sendMail();  //sendEmail(formData);
        }
    });

});


const asendEmail = async (formData) => {
    try {
        const loginResponse = await msalInstance.loginPopup(loginRequest);
        const accessToken = loginResponse.accessToken;

        const email = {
            message: {
                subject: formData.subject,
                body: {
                    contentType: "HTML",
                    content: formData.body
                },
                toRecipients: formData.to.split(",").map(email => ({ emailAddress: { address: email.trim() } })),
                ccRecipients: formData.cc.split(",").map(email => ({ emailAddress: { address: email.trim() } })),
                bccRecipients: formData.bcc.split(",").map(email => ({ emailAddress: { address: email.trim() } }))
            }
        };

        if (formData.attachment) {
            const file = formData.attachment[0];
            const fileContent = await file.arrayBuffer();
            email.message.attachments = [
                {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    name: file.name,
                    contentBytes: btoa(String.fromCharCode(...new Uint8Array(fileContent))),
                    contentType: file.type
                }
            ];
        }

        const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(email)
        });

        if (response.ok) {
            console.log("Email sent successfully!");
        } else {
            console.error("Error sending email:", await response.json());
        }
    } catch (error) {
        console.error("Error:", error);
    }
};
