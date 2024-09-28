const msal = require('@azure/msal-node');

const config = {
    auth: {
        clientId: '9a544291-7a94-4b4e-ac42-95488a0f39c8', // Your Application (client) ID
        authority: 'https://login.microsoftonline.com/2946b013-c232-420e-9d11-f17dcc4f7fc2', // Your Directory (tenant) ID
        redirectUri: 'http://localhost:8089' // Your redirect URI
    }
};

const cca = new msal.ConfidentialClientApplication(config);

async function getAccessToken() {
    const ropcRequest = {
        scopes: ["https://graph.microsoft.com/.default"],
        username: 'wikran@hotmail.com', // Your Office 365 username
        password: 'Saxx5398Saxx5398##'  // Your Office 365 password
    };

    try {
        const response = await cca.acquireTokenByUsernamePassword(ropcRequest);
        return response.accessToken;
    } catch (error) {
        console.error("Error acquiring token:", error);
    }
}

async function sendEmail(accessToken) {
    const url = 'https://graph.microsoft.com/v1.0/me/sendMail';
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

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(email)
    });

    if (response.ok) {
        console.log('Email sent successfully');
    } else {
        console.error('Error sending email', response.statusText);
    }
}

async function main() {
    const accessToken = await getAccessToken();
    if (accessToken) {
        await sendEmail(accessToken);
    }
}

main();
