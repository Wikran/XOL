$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
var aaXToX = localStorage["aaXXoX"];
var aaUsrN = localStorage["aaXXuX"];
var aaFname = localStorage["asFTNAME"];
var [axfirstName, axlastName] = localStorage["asFTNAME"].split(" ");
var storedJsonString = localStorage.getItem("usrProperty");
var decryptedData = CryptoJS.AES.decrypt(storedJsonString, "sBxA017").toString(CryptoJS.enc.Utf8);
var ausrProperty = JSON.parse(decryptedData);
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
//let getvalues = { aApproverName: aApproverName, aApproverEmail: aApproverEmail, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName }
//let getvalues = { aServer: aaPFDMI, aaUsrN: aaUsrN, axfirstName: axfirstName, axlastName: axlastName }
//console.log(isLocalHost())
//TOP
$(() => {
    var aDatabasea = "ExtraOnLine.dbo.TaskControl";
    var aKeyField = "TaskGroup";
    var aKeyIDa = "TCHATBOT"; //TaskGroup;
    var axFieldSelected = "IDNO,TaskName,TaskProgram,TaskGroup";
    var aVARs = {};
    var aArrays = {};
    var aObjects = {};

    LoadSQLData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected)
        .then(result => {
            // get from other MENU first
            if (!Array.isArray(result)) {
                console.error("Unexpected result format:", result);
                return;
            }
            // get from first MENU
            result.forEach(item => {
                if (!item.TaskGroup.includes(",")) return;

                let aMatch = item.TaskName.match(/\[(.*?)\]/);
                if (!aMatch) return;

                const key = aMatch[1];
                const processedProgram = item.TaskProgram.replace(/`/g, "'");

                if (item.TaskName.includes("{ARRAY}")) {
                    aArrays[key] = processedProgram.split('\n').map(line => {
                        let trimmed = line.trim();
                        return trimmed === "" ? "" : isNaN(trimmed) ? trimmed : +trimmed;
                    });
                }
                else if (item.TaskName.includes("{T2O}")) {
                    aObjects[key] = processedProgram.split('\n').map(line => {
                        line = line.trim().replace(/,$/, "").replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                        return JSON.parse(line);
                    }).map(obj => {
                        Object.keys(obj).forEach(k => {
                            if (k.includes('amt') && typeof obj[k] === 'string') {
                                obj[k] = +obj[k];
                            }
                        });
                        return obj;
                    });
                }
                else if (item.TaskName.includes("{OBJ}")) {
                    aObjects[key] = processedProgram.split('\n').reduce((obj, line) => {
                        let [k, v] = line.trim().split('|').map(p => p.trim());
                        if (!k || v === undefined) return obj;

                        if (k.startsWith('xt2v') || v.startsWith('@')) {
                            v = v.startsWith("aVARs.") ? aVARs[v.substring(6)] ?? console.error(`Key "${v.substring(6)}" not found.`) : eval(v.substring(1));
                        } else {
                            v = isNaN(v) ? v : +v;
                        }
                        obj[k] = v;
                        return obj;
                    }, {});
                }
                else {
                    let prefixMatch = item.TaskName.match(/#\((.*?)\)/);
                    let prefix = prefixMatch ? prefixMatch[1] : "";
                    let varKey = prefix + key;

                    aVARs[varKey] = item.TaskName.includes("{num}") ? +processedProgram : processedProgram;
                }
            });
            // get from TCHATBOT only
            result.forEach(item => {
                if (!item.TaskGroup.includes(",")) {
                    let aMatch = item.TaskName.match(/\[(.*?)\]/);
                    if (!aMatch) return;

                    if (item.TaskName.includes("{ARRAY}")) {
                        aArrays[aMatch[1]] = item.TaskProgram
                            .replace(/`/g, "'")
                            .split('\n')
                            .map(value => {
                                let trimmedValue = value.trim();
                                return trimmedValue === "" ? "" : !isNaN(trimmedValue) ? +trimmedValue : trimmedValue;
                            });
                    } else if (item.TaskName.includes("{T2O}")) {
                        let lines = item.TaskProgram.replace(/`/g, "'").split('\n');
                        aObjects[aMatch[1]] = lines.map(line => {
                            line = line.trim().replace(/,$/, "").replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                            return JSON.parse(line);
                        }).map(obj => {
                            Object.keys(obj).forEach(key => {
                                if (key.includes('amt') && typeof obj[key] === 'string') {
                                    obj[key] = +obj[key];
                                }
                            });
                            return obj;
                        });
                    } else if (item.TaskName.includes("{OBJ}")) {
                        aObjects[aMatch[1]] = item.TaskProgram.replace(/`/g, "'").split('\n').reduce((obj, value) => {
                            let trimmedValue = value.trim();
                            if (!trimmedValue) return obj;

                            let [key, val] = trimmedValue.split('|').map(part => part.trim());
                            if (key && val !== undefined) {
                                if (key.startsWith('xt2v') || val.startsWith('@')) {
                                    if (val.startsWith("aVARs.")) {
                                        let xkey = val.substring(6);
                                        val = aVARs[xkey] !== undefined ? aVARs[xkey] : console.error(`Key "${xkey}" not found in aVARs.`);
                                    } else {
                                        try {
                                            val = eval(val.substring(1));
                                        } catch (error) {
                                            console.error(`Error evaluating value: ${val}`, error);
                                        }
                                    }
                                } else {
                                    val = isNaN(val) ? val : +val;
                                }
                                obj[key] = val;
                            }
                            return obj;
                        }, {});
                    } else {
                        let match = item.TaskName.match(/#\((.*?)\)/);
                        let aPrefix = match ? match[1] : null;

                        if (aPrefix) {
                            aVARs[aPrefix + aMatch[1]] = item.TaskName.includes("{num}") ? +item.TaskProgram.replace(/`/g, "'") : item.TaskProgram.replace(/`/g, "'");
                        } else {
                            aVARs[aMatch[1]] = item.TaskName.includes("{num}") ? +item.TaskProgram.replace(/`/g, "'") : item.TaskProgram.replace(/`/g, "'");
                        }
                    }
                }
            });

            /*             const responses = {
                            "hello": "Hi there! How can I help you?",
                            "how are you": "I'm just a bot, but I'm here to help you!",
                            "bye": "Goodbye! Have a great day!",
                            "what is your name": "I am HelperBot, your virtual assistant.",
                            "what can you do": "I can help you with various tasks like answering questions, providing information, and more.",
                            "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
                            "what is the weather like": "I can't check the weather, but you can use a weather app for that!",
                            "อยากทราบเรื่อง Travel Requisition": "Travel requisition is in MENU Travel Requisition บันทึก ขออนุมัติการเดินทางต่างประเทศและในประเทศ จะต้องได้รับการอนุมัติจากผู้อนุมัติ สำหรับการเดินทางต่างประเทศ จะอนุมัติโดย CEO ในประเทศจะอนุมัติตามลำดับการอนุมัติของ HOD ",
                            "Travel Requisition": "Travel requisition is in MENU Travel Requisition บันทึก ขออนุมัติการเดินทางต่างประเทศและในประเทศ จะต้องได้รับการอนุมัติจากผู้อนุมัติ สำหรับการเดินทางต่างประเทศ จะอนุมัติโดย CEO ในประเทศจะอนุมัติตามลำดับการอนุมัติของ HOD ",
                            "สวัสดี": "สวัสดี มีอะไรให้ช่วยบ้าง",
                        }; */

            // Select the <h1> element
            const h1Element = document.querySelector('h1');
            // Update the content of the <h1> to include both text and an image
            h1Element.innerHTML = aVARs.aChatbotTitle;


            const responses = aObjects.ACHATB;

            function displayMessage(message, sender) {
                const messageElement = $('<div class="message"></div>');
                messageElement.addClass(sender);
                messageElement.html(message); // Use .html() instead of .text()
                $('#chatbot').append(messageElement);
                $('#chatbot').scrollTop($('#chatbot')[0].scrollHeight);
            }

            const responseArray = Object.keys(responses).map(key => ({
                question: key.toLowerCase().replace(/[&]/g, 'and'),
                answer: responses[key]
            }));

            // Initialize Fuse.js with enhanced settings
            const fuse = new Fuse(responseArray, {
                keys: ['question'],
                includeScore: true,
                threshold: 0.3, // 0.5
                tokenize: true,
                matchAllTokens: false,
                minMatchCharLength: 2
            });

            function isSQLQuestion(input) {
                // Define keywords related to SQL database queries
                const sqlKeywords = ["amount", "this month", "get", "how much", "balance", "total", "ข้อมูล"];
                //console.log(sqlKeywords.some(keyword => input.toLowerCase().includes(keyword)))
                return sqlKeywords.some(keyword => input.toLowerCase().includes(keyword));
            }

            async function generateSQLQuery(input) {
                let aNowDte = new Date();
                let aCalYear = aNowDte.getFullYear();
                let aCalYearStr = aCalYear.toString();
                let aCalMonth = aNowDte.getMonth() + 1;
                let aYearNum1 = (aCalMonth >= 1 && aCalMonth <= 4) ? aCalYear - 1 : aCalYear;
                let aYearStr1 = aYearNum1.toString();
                let aaEmpID = $.trim(localStorage["asSTFID"]);

                // **Consolidated Settings (Database + Query + Word Replacements)**
                const dbSettings = {
                    "medical": {
                        database: "ExtraOnLine.dbo.MSumDViewALL",
                        keyField: "SomeField",
                        keyID: "SomeKey",
                        selectedFields: "ExpGroupDescEng,QYear,TRefundAmt,TAmount",
                        keyMappings: {
                            ExpGroupDescEng: "Expense Group",
                            QYear: "Year",
                            TRefundAmt: "Refunded Amount",
                            TAmount: "Billed Amount"
                        },
                        query: `WHERE PayToCode LIKE '${aaEmpID.trim()}%' 
                                AND ((ExpGroupDescEng LIKE '%SSO%' 
                                AND (QYear = ${aYearStr1} OR QYear = ${aCalYearStr})) 
                                OR QYear = ${aYearStr1}) 
                                AND (TAmount + TRefundAmt) <> 0`,
                        description: "Medical Expenses Query"
                    },
                    "fleet card": {
                        database: "ExtraOnLine.dbo.EXPREIM_200",
                        keyField: "SomeField",
                        keyID: "SomeKey",
                        selectedFields: "ExpGroupDescEng, year(ReqDate) as QYear,month(ReqDate) as QMonth,TotalReimburse,TotalAmount",
                        keyMappings: {
                            ExpGroupDescEng: "Expense Group",
                            QYear: "Year",
                            QMonth: "Month",
                            TotalReimburse: "Refunded Amount",
                            TotalAmount: "Billed Amount"
                        },
                        query: `WHERE PayToCode LIKE '${aaEmpID.trim()}%' 
                                AND year(ReqDate) = ${aCalYearStr} 
                                AND ERStatus LIKE '%HOD Approve%'`,
                        description: "Fleet Card Transactions"
                    },
                    wordReplacements: {
                        "ค่ารักษาพยาบาล": "medical",
                        "ค่าน้ำมัน": "fleet card",
                        "ค่าเดินทาง": "travel",
                        "Fleetcard": "fleet card"
                    }
                };

                // **Replace Words in Input Based on Mapping**
                Object.keys(dbSettings.wordReplacements).forEach(originalWord => {
                    if (input.includes(originalWord)) {
                        input = input.replace(originalWord, dbSettings.wordReplacements[originalWord]);
                    }
                });

                // **Find Matching Keyword**
                let inputKeyword = Object.keys(dbSettings).find(keyword => input.toLowerCase().includes(keyword));

                if (!inputKeyword) {
                    return "I need more details";
                }

                let selectedConfig = dbSettings[inputKeyword];

                try {
                    // **Fetch SQL Data**
                    let result = await LoadSQLData(
                        isLocalHost(),
                        selectedConfig.database,
                        selectedConfig.keyID,
                        selectedConfig.keyField,
                        selectedConfig.selectedFields,
                        selectedConfig.query
                    );

                    let resultString = "No results found."; // Default message

                    if (Array.isArray(result) && result.length > 0) {
                        // Convert objects to formatted text with mapped keys
                        resultString = result.map(item => {
                            if (typeof item === 'object' && item !== null) {
                                return Object.entries(item)
                                    .map(([key, value]) => {
                                        let readableKey = selectedConfig.keyMappings[key] || key;
                                        let separator = (typeof value === "number") ? "=" : "is";
                                        return `${readableKey} ${separator} ${value}`;
                                    })
                                    .join(', '); // Join key-value pairs with commas
                            }
                            return String(item); // Convert other types to string
                        }).join(', '); // Join array elements with ', ' for same line output
                    } else if (typeof result === 'object' && result !== null) {
                        let values = Object.entries(result)
                            .map(([key, value]) => {
                                let readableKey = selectedConfig.keyMappings[key] || key;
                                let separator = (typeof value === "number") ? "=" : "is";
                                return `${readableKey} ${separator} ${value}`;
                            })
                            .join(', '); // Join key-value pairs with commas
                        if (values.length > 0) {
                            resultString = values;
                        }
                    }

                    // **Format for UI Output (Separate Groups by Line Break)**
                    let formattedBotResponse = resultString.split(', Expense Group').map((group, index) => {
                        return (index > 0 ? '<br>Expense Group ' : '') + group.trim();
                    }).join('');

                    // Log to console for debugging
                    //console.log(resultString);
                    //console.log(formattedBotResponse);

                    return formattedBotResponse;

                } catch (error) {
                    console.error("Error executing query:", error);
                    return "Error fetching data.";
                }
            }

            // application client : 7ad32bf4-0bcf-468b-8a97-dde9dca12749
            // director tenant id : 2946b013-c232-420e-9d11-f17dcc4f7fc2
            // secret value hmx8Q~kyW6NymAYTLpSxc6Y8wxQ.6yYzzuDVVaOw
            // secret client id: 5e1beabe-21a9-4651-ab35-e4e6d90d75b0
            // async function callMistral(prompt) {
            //     try {
            //         const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1", {
            //             method: "POST",
            //             headers: {
            //                 "Authorization": "Bearer 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",
            //                 "Content-Type": "application/json"
            //             },
            //             body: JSON.stringify({
            //                 inputs: prompt,
            //                 parameters: { max_new_tokens: 100 } // Adjust token limit
            //             })
            //         });

            //         const result = await response.json();

            //         // Extract the response text
            //         let aiResponse = result && Array.isArray(result) && result.length > 0 ? result[0].generated_text : "No answer";

            //         // Check if the AI response is invalid
            //         if (!aiResponse || aiResponse.toLowerCase().includes("no answer") || aiResponse.toLowerCase().includes("no match found")) {
            //             console.warn(`AI response is invalid: "${aiResponse}"`);
            //             return /[\u0E00-\u0E7F]/.test(prompt) ? aArrays.CBUNMATCH[0] : aArrays.CBUNMATCH[1];
            //         }

            //         console.log("Mistral AI Response:", aiResponse);
            //         return aiResponse;
            //     } catch (error) {
            //         console.error("Error calling Mistral API:", error);
            //         return "Error processing request.";
            //     }
            // }

            /*             async function xcallOpenrouter(input) {
                            //console.log("Calling OpenRouter AI with input:", input);
            
                            const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
                            const apiKey = "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"; // Replace with your OpenRouter API Key
                            //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
                            //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
                            const headers = {
                                "Authorization": `Bearer ${apiKey}`,
                                "Content-Type": "application/json"
                            };
            
                            const body = JSON.stringify({
                                model: "gpt-3.5-turbo", // Change this to other models like "gpt-4-turbo" or "mistral/mixtral-8x7b" or "gpt-3.5-turbo"
                                messages: [{ role: "user", content: input }],
                                max_tokens: 200,
                                temperature: 0.7
                            });
            
                            try {
                                const response = await fetch(apiUrl, {
                                    method: "POST",
                                    headers: headers,
                                    body: body,
                                });
            
                                const data = await response.json();
                                //console.log("OpenRouter response:", data);
            
                                // Extract AI's response
                                return data.choices?.[0]?.message?.content || "Sorry, I didn't understand that.";
                            } catch (error) {
                                console.error("Error calling OpenRouter API:", error);
                                return "Error processing your request.";
                            }
                        } */

            async function callOpenrouter(input) {
                const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
                const apiKey = "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"; // ⚠️ Replace with your OpenRouter API key

                const headers = {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                };

                const body = JSON.stringify({
                    //model: "deepseek-ai/deepseek-v3", // ✅ Use DeepSeek V3
                    model: "mistralai/mistral-7b-instruct:free",
                    messages: [{ role: "user", content: input }],
                    max_tokens: 1000,
                    temperature: 0.7,
                });

                try {
                    const response = await fetch(apiUrl, {
                        method: "POST",
                        headers: headers,
                        body: body
                    });

                    const data = await response.json();

                    if (!response.ok || !data.choices) {
                        throw new Error(data.error?.message || "Unexpected response");
                    }

                    return data.choices[0].message.content;
                } catch (error) {
                    console.error("Error calling OpenRouter API:", error);
                    return "Error: Could not process your request.";
                }
            }


            // async function getResponse(input) {
            //     console.log("User input received:", input); // Debugging log

            //     const isThai = /[\u0E00-\u0E7F]/.test(input);
            //     const fillerWordsRegex = new RegExp(`(${aVARs.NNWORD})`, 'g');
            //     let getvalues = aObjects.aGetValues;

            //     const normalizeText = text => text
            //         .toLowerCase()
            //         .replace(/[&]/g, 'and')
            //         .replace(fillerWordsRegex, '')
            //         .replace(/[^a-z0-9\u0E00-\u0E7F\s]/gi, '');

            //     input = normalizeText(input);
            //     console.log("Normalized input:", input); // Debugging log

            //     if (isSQLQuestion(input)) {
            //         try {
            //             let areturnword = await generateSQLQuery(input);
            //             console.log("SQL result:", areturnword); // Debugging log
            //             return areturnword || "No SQL response."; // Prevent empty return
            //         } catch (error) {
            //             console.error("Error generating SQL query:", error);
            //             return "Error processing SQL request.";
            //         }
            //     } else {
            //         const results = fuse.search(input);
            //         console.log("Search results:", results); // Debugging log

            //         if (results.length > 0) {
            //             let response = results[0].item.answer.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
            //             console.log("Found answer:", response);
            //             return response;
            //         }

            //         console.warn(`No match found for input: ${input}`);
            //         return isThai ? aArrays.CBUNMATCH[0] : aArrays.CBUNMATCH[1];
            //     }
            // }

            async function getResponse(input) {
                //console.log("User input received:", input);

                const isThai = /[\u0E00-\u0E7F]/.test(input);
                const fillerWordsRegex = new RegExp(`(${aVARs.NNWORD})`, 'g');
                let getvalues = aObjects.aGetValues;

                const normalizeText = text => text
                    .toLowerCase()
                    .replace(/[&]/g, 'and')
                    .replace(fillerWordsRegex, '')
                    .replace(/[^a-z0-9\u0E00-\u0E7F\s]/gi, '');

                input = normalizeText(input);
                //console.log("Normalized input:", input);

                if (isSQLQuestion(input)) {
                    try {
                        let areturnword = await generateSQLQuery(input);
                        //console.log("SQL result:", areturnword);
                        return areturnword || "No SQL response.";
                    } catch (error) {
                        console.error("Error generating SQL query:", error);
                        return "Error processing SQL request.";
                    }
                } else {
                    const results = fuse.search(input);
                    //console.log("Search results:", results);

                    if (results.length > 0) {
                        let response = results[0].item.answer.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                        //console.log("Found answer:", response);
                        return response + getRandomIcon();
                    }

                    console.warn(`No match found for input: ${input}`);

                    // Call Openrouter API as fallback
                    return await callOpenrouter(input);
                }
            }


            $('#sendButton').click(async function () {
                const userInput = $('#userInput').val().trim();
                if (userInput !== "") {
                    displayMessage(userInput, 'user');

                    try {
                        const botResponse = await getResponse(userInput);
                        //console.log("Final bot response:", botResponse); // Debugging log
                        displayMessage(botResponse || "I'm not sure how to respond.", 'bot'); // Prevent empty response
                    } catch (error) {
                        console.error("Error in getResponse:", error);
                        displayMessage("An error occurred. Please try again.", 'bot');
                    }

                    $('#userInput').val('');
                }
            });


            $('#userInput').focus();
            $('#userInput').keypress(function (e) {
                if (e.which == 13) { // Enter key pressed
                    $('#sendButton').click();
                }
            });

            // Initial welcome message
            displayMessage(aVARs.aWelcomeText, 'bot');

        }); // load content   
});