const msalConfig = {
    auth: {
        clientId: '9a544291-7a94-4b4e-ac42-95488a0f39c8', // Your Application (client) ID
        authority: 'https://login.microsoftonline.com/2946b013-c232-420e-9d11-f17dcc4f7fc2', // Your Directory (tenant) ID
        redirectUri: 'http://localhost:8089' // Your redirect URI
    }
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

const graphClient = MicrosoftGraph.Client.init({
    authProvider: async (done) => {
        const account = msalInstance.getAllAccounts()[0];
        if (!account) {
            done("No user account found", null);
            return;
        }

        try {
            const response = await msalInstance.acquireTokenSilent({
                scopes: ["https://graph.microsoft.com/Mail.Send"],
                account: account
            });
            done(null, response.accessToken);
        } catch (error) {
            done(error, null);
        }
    }
});

async function signIn() {
    try {
        const loginResponse = await msalInstance.loginPopup({
            scopes: ["https://graph.microsoft.com/Mail.Send"]
        });
        console.log("Login successful:", loginResponse);
    } catch (error) {
        console.error("Login error:", error);
    }
}

async function sendEmail() {
    const email = {
        message: {
            subject: "Test Email from Microsoft Graph API",
            body: {
                contentType: "Text",
                content: "This is a test email sent using the Microsoft Graph API."
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: "wikran@hotmail.com"
                    }
                }
            ]
        },
        saveToSentItems: "true"
    };

    try {
        await graphClient.api('/me/sendMail').post(email);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email', error);
    }
}
