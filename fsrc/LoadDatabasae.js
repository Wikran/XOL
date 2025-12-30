
/**
 * Loads data from the database based on specified criteria.
 *
 * @param {string} aaPFDMI - The base URL for the database API. Example: "https://api.example.com"
 * @param {string} aaXToX - A base64 encoded string used to identify the data. Example: "c29tZVRleHQ="
 * @param {string} fullQuery - The complete SQL query string. Example: "SELECT ACCCODE,EDESC FROM ExtraOnLine.dbo.ACCOUNTCHART WHERE EXPGroup LIKE '%example%'"
 *
 * @returns {Promise<void>} A promise that resolves when the data has been fetched and processed.
 */
/**
 * Loads data from the database by sending a POST request to a specified endpoint.
 *
 * @async
 * @function LoadDatabase
 * @param {string} aaPFDMI - The base URL for the database API.
 * @param {string} aaXToX - A base64 encoded string used to construct the endpoint.
 * @param {string} fullQuery - The query to be executed on the database, which will be base64 encoded in the request body.
 *
 * @example
 * // Sample usage to load data from the ACCOUNT database
 * const aaXToX = btoa('A75FCC75-8FB6-4460-B3F6-7070B4437930')
 * const aaPFDMI = "https://cbsdev2.locktonwattana.com"; //isLocalHost(); 
 * const fullQuery = "SELECT * FROM ExtraOnLine.dbo.ACCOUNTCHART";
 * LoadDatabase(aaPFDMI, aaXToX, fullQuery);
 */

    const LoadDatabase = async (aaPFDMI, aaXToX, fullQuery) => {
        let decodedXToX;

        try {
            decodedXToX = atob(aaXToX);
        } catch (e) {
            console.error('Invalid base64 string:', aaXToX);
            return; // Exit the function if decoding fails
        }

        try {
            const response = await fetch(`${aaPFDMI}/DMQ/XOL/${decodedXToX}/3DF65D9D-FEE8-4A8E-A01E-38C28F7B1232`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "@": btoa(fullQuery) }), // Updated variable name here
                redirect: "follow"
            });
            const acData = await response.json();
            console.log(acData); // Log the fetched data
            // Additional processing of acData can be done here
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
