$(document).ready(function () {
    var aDXTheme = localStorage["aDXTheme"]
    DevExpress.ui.themes.current(aDXTheme);
});
window.jsPDF = window.jspdf.jsPDF;
applyPlugin(window.jsPDF);
console.clear();
var aaXToX = localStorage["aaXXoX"];
//var aaXNoX = localStorage["aaXXuX"];
//var aaXTXB = "326459ff-7ea6-4465-a946-9326b783d492";
//var aaPXXI = localStorage["aPXIXD"];
//var aaPXIXD = localStorage["aPXIXD"];
//var aaEnt = aaPXIXD.includes("X");
var aaUsrN = localStorage["aaXXuX"];
var aaFname = localStorage["asFTNAME"];
// var vvfullName = localStorage["asFTNAME"];
// var parts = vvfullName.split(" ");
// var axfirstName = parts[0];
// var axlastName = parts.slice(1).join(" "); 
var [axfirstName, axlastName] = localStorage["asFTNAME"].split(" ");
////console.log("name ", axfirstName, " ", axlastName)
var storedJsonString = localStorage.getItem("usrProperty");
var decryptedData = CryptoJS.AES.decrypt(storedJsonString, "sBxA017").toString(CryptoJS.enc.Utf8);
var ausrProperty = JSON.parse(decryptedData);
//console.log(ausrProperty)
var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
//let getvalues = { aApproverName: aApproverName, aApproverEmail: aApproverEmail, aaOnInitExpGroupDesc: aaOnInitExpGroupDesc, aRefNoa: aRefNoa, aAddress2Do: aAddress2Do, aRequesterName: aRequesterName }
//let getvalues = { aServer: aaPFDMI, aaUsrN: aaUsrN, axfirstName: axfirstName, axlastName: axlastName }

//TOP
$(() => {
    const aRuniFrame = (aPageUrl, aTMessage) => {
        $("#tframe").attr("src", aPageUrl);
        $("#workinglabel").text(aTMessage);
    }
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
            for (let ii = 0; ii < result.length; ii++) {
                //console.log(result[ii]);                 
                if (result[ii].TaskGroup.includes(",")) {
                    //console.log("Group ", result[ii].TaskGroup, result[ii].TaskGroup.includes(","))
                    let aMatch = result[ii].TaskName.match(/\[(.*?)\]/);
                    if (aMatch) {
                        //
                    } else {
                        // Skip this iteration and move to the next one
                        continue;
                    }
                    //console.log("aMatch ", aMatch[1])
                    if (result[ii].TaskName.includes("{ARRAY}")) {
                        aArrays[aMatch[1]] = result[ii].TaskProgram
                            .replace(/`/g, "'") // Replace backticks with single quotes
                            .split('\n')
                            .map(item => {
                                let trimmedItem = item.trim(); // Remove extra spaces
                                if (trimmedItem === "") {
                                    return ""; // Keep blanks as blank
                                } else if (!isNaN(trimmedItem)) {
                                    return +trimmedItem; // Convert numeric strings to numbers
                                } else {
                                    return trimmedItem; // Keep non-numeric text unchanged
                                }
                            });
                        //console.log("aArrays.", aMatch[1], aArrays[aMatch[1]]);
                    } else if (result[ii].TaskName.includes("{T2O}")) {
                        let lines = result[ii].TaskProgram
                            .replace(/`/g, "'") // Replace backticks with single quotes
                            .split('\n')
                        aObjects[aMatch[1]] = lines.map(line => { //aObjects[aMatch[1]]
                            // Remove the trailing comma and extra spaces
                            line = line.trim().replace(/,$/, "");
                            // Add quotes around keys and values to make it JSON-compliant
                            line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                            // Parse the cleaned line into an object
                            return JSON.parse(line);
                        });
                        // Iterate through the array and modify the objects
                        aObjects[aMatch[1]] = aObjects[aMatch[1]].map(obj => {
                            for (let key in obj) {
                                // Check if the key includes 'amt' and the value is a string
                                if (key.includes('amt') && typeof obj[key] === 'string') {
                                    obj[key] = +obj[key]; // Convert the value to a number
                                }
                            }
                            return obj;
                        });

                    } 
                    else if (result[ii].TaskName.includes("{OBJ}")) {
                        aObjects[aMatch[1]] = result[ii].TaskProgram
                            .replace(/`/g, "'") // Replace backticks with single quotes
                            .split('\n')
                            .reduce((obj, item) => {
                                let trimmedItem = item.trim(); // Remove extra spaces
                                if (trimmedItem === "") {
                                    return obj; // Skip blank lines
                                }

                                // Split the line by the delimiter (|) to get key and value
                                let [key, value] = trimmedItem.split('|').map(part => part.trim());

                                if (key && value !== undefined) {
                                    if (key.startsWith('xt2v') || value.startsWith('@')) {
                                        if (value.startsWith("aVARs.")) {
                                            // Extract the key after "aVARs."
                                            let xkey = value.substring(6);

                                            // Dynamically access the value from aVARs
                                            if (aVARs[xkey] !== undefined) {
                                                let nvalue = aVARs[xkey];
                                                value = nvalue
                                                //console.log(nvalue); // Output the resolved value
                                            } else {
                                                console.error(`Key "${xkey}" not found in aVARs.`);
                                            }
                                        } else {
                                            try {
                                                value = eval(value.substring(1)); // Use eval() to evaluate the expression
                                            } catch (error) {
                                                console.error(`Error evaluating value: ${value}`, error);
                                            }
                                        }
                                    } else {
                                        // Check if value is numeric and convert it, otherwise keep it as a string
                                        value = isNaN(value) ? value : +value;
                                    }
                                    obj[key] = value;
                                }

                                return obj; // Return the accumulated object
                            }, {});
                        //console.log(aObjects[aMatch[1]]);
                    } 
                    else {
                        let match = result[ii].TaskName.match(/#\((.*?)\)/);
                        // Extract the matched prefix if it exists
                        let aPrefix = match ? match[1] : null; // match[1] contains the content inside the parentheses
                        //console.log(aPrefix); // Output: "MED", "FLE", "OTH", "TRF" or null if no match
                        if (aPrefix) {
                            if (result[ii].TaskName.includes("{num}")) {
                                aVARs[aPrefix + aMatch[1]] = +(result[ii].TaskProgram.replace(/`/g, "'"));
                            } else {
                                //aVARs[aMatch[1]] = result[ii].TaskProgram.replace(/`/g, "'");
                                aVARs[aPrefix + aMatch[1]] = result[ii].TaskProgram.replace(/`/g, "'");
                            }
                            //console.log(aPrefix + aMatch[1])
                            //console.log("aVARs ", aVARs[aPrefix + aMatch[1]])

                        } else {
                            if (result[ii].TaskName.includes("{num}")) {
                                aVARs[aMatch[1]] = +(result[ii].TaskProgram.replace(/`/g, "'"));
                            } else {
                                aVARs[aMatch[1]] = result[ii].TaskProgram.replace(/`/g, "'");
                                //aVARs[aMatch[1] + aPrefix] = result[ii].TaskProgram.replace(/`/g, "'");
                            }
                            //console.log("aVARs ", aVARs[aMatch[1]])
                        }
                    }
                }
            }

            /*          let scheck = "aVARs.FLEHELP01"
                        // Resolve dynamically without eval
                        if (scheck.startsWith("aVARs.")) {
                            // Extract the key after "aVARs."
                            let key = scheck.substring(6);
            
                            // Dynamically access the value from aVARs
                            if (aVARs[key] !== undefined) {
                                let newchk = aVARs[key];
                                //console.log(newchk); // Output the resolved value
                            } else {
                                console.error(`Key "${key}" not found in aVARs.`);
                            }
                        } 
            */

            // get from TCHATBOT only
            for (let ii = 0; ii < result.length; ii++) {
                //console.log(result[ii]);                 
                if (!result[ii].TaskGroup.includes(",")) {
                    //console.log("Group ", result[ii].TaskGroup, result[ii].TaskGroup.includes(","))
                    let aMatch = result[ii].TaskName.match(/\[(.*?)\]/);
                    if (aMatch) {
                        //
                    } else {
                        // Skip this iteration and move to the next one
                        continue;
                    }
                    //console.log("aMatch ", aMatch[1])
                    if (result[ii].TaskName.includes("{ARRAY}")) {
                        aArrays[aMatch[1]] = result[ii].TaskProgram
                            .replace(/`/g, "'") // Replace backticks with single quotes
                            .split('\n')
                            .map(item => {
                                let trimmedItem = item.trim(); // Remove extra spaces
                                if (trimmedItem === "") {
                                    return ""; // Keep blanks as blank
                                } else if (!isNaN(trimmedItem)) {
                                    return +trimmedItem; // Convert numeric strings to numbers
                                } else {
                                    return trimmedItem; // Keep non-numeric text unchanged
                                }
                            });
                        //console.log("aArrays.", aMatch[1], aArrays[aMatch[1]]);
                    } else if (result[ii].TaskName.includes("{T2O}")) {
                        let lines = result[ii].TaskProgram
                            .replace(/`/g, "'") // Replace backticks with single quotes
                            .split('\n')
                        aObjects[aMatch[1]] = lines.map(line => { //aObjects[aMatch[1]]
                            // Remove the trailing comma and extra spaces
                            line = line.trim().replace(/,$/, "");
                            // Add quotes around keys and values to make it JSON-compliant
                            line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
                            // Parse the cleaned line into an object
                            return JSON.parse(line);
                        });
                        // Iterate through the array and modify the objects
                        aObjects[aMatch[1]] = aObjects[aMatch[1]].map(obj => {
                            for (let key in obj) {
                                // Check if the key includes 'amt' and the value is a string
                                if (key.includes('amt') && typeof obj[key] === 'string') {
                                    obj[key] = +obj[key]; // Convert the value to a number
                                }
                            }
                            return obj;
                        });

                    } 
                    else if (result[ii].TaskName.includes("{OBJ}")) {
                        aObjects[aMatch[1]] = result[ii].TaskProgram
                            .replace(/`/g, "'") // Replace backticks with single quotes
                            .split('\n')
                            .reduce((obj, item) => {
                                let trimmedItem = item.trim(); // Remove extra spaces
                                if (trimmedItem === "") {
                                    return obj; // Skip blank lines
                                }

                                // Split the line by the delimiter (|) to get key and value
                                let [key, value] = trimmedItem.split('|').map(part => part.trim());

                                if (key && value !== undefined) {
                                    if (key.startsWith('xt2v') || value.startsWith('@')) {
                                        if (value.startsWith("aVARs.")) {
                                            // Extract the key after "aVARs."
                                            let xkey = value.substring(6);

                                            // Dynamically access the value from aVARs
                                            if (aVARs[xkey] !== undefined) {
                                                let nvalue = aVARs[xkey];
                                                value = nvalue
                                                //console.log(nvalue); // Output the resolved value
                                            } else {
                                                console.error(`Key "${xkey}" not found in aVARs.`);
                                            }
                                        } else {
                                            try {
                                                value = eval(value.substring(1)); // Use eval() to evaluate the expression
                                            } catch (error) {
                                                console.error(`Error evaluating value: ${value}`, error);
                                            }
                                            // Dynamically resolve the value of scheck2
                                            // if (typeof window[value] !== "undefined") {
                                            //     value = window[value];
                                            //     console.log(window[value]); // Output the resolved value
                                            // } else {
                                            //     console.error(`Variable "${value}" is not defined.`);
                                            // }
                                        }
                                    } else {
                                        // Check if value is numeric and convert it, otherwise keep it as a string
                                        value = isNaN(value) ? value : +value;
                                    }
                                    obj[key] = value;
                                }

                                return obj; // Return the accumulated object
                            }, {});
                        //console.log(aObjects[aMatch[1]]);
                    } 
                    else {
                        let match = result[ii].TaskName.match(/#\((.*?)\)/);
                        // Extract the matched prefix if it exists
                        let aPrefix = match ? match[1] : null; // match[1] contains the content inside the parentheses
                        //console.log(aPrefix); // Output: "MED", "FLE", "OTH", "TRF" or null if no match
                        if (aPrefix) {
                            if (result[ii].TaskName.includes("{num}")) {
                                aVARs[aPrefix + aMatch[1]] = +(result[ii].TaskProgram.replace(/`/g, "'"));
                            } else {
                                //aVARs[aMatch[1]] = result[ii].TaskProgram.replace(/`/g, "'");
                                aVARs[aPrefix + aMatch[1]] = result[ii].TaskProgram.replace(/`/g, "'");
                            }
                            //console.log(aPrefix + aMatch[1])
                            //console.log("aVARs ", aVARs[aPrefix + aMatch[1]])

                        } else {
                            if (result[ii].TaskName.includes("{num}")) {
                                aVARs[aMatch[1]] = +(result[ii].TaskProgram.replace(/`/g, "'"));
                            } else {
                                aVARs[aMatch[1]] = result[ii].TaskProgram.replace(/`/g, "'");
                                //aVARs[aMatch[1] + aPrefix] = result[ii].TaskProgram.replace(/`/g, "'");
                            }
                           //console.log("aVARs ", aVARs[aMatch[1]])
                        }
                    }
                }
            }
            
            // Select the <h1> element
            const h1Element = document.querySelector('h1');

            // Update the content of the <h1> to include both text and an image
            //h1Element.innerHTML = 'ถามนิดหน่อย <img src="https://cbsdev2.locktonwattana.com/temp/uploads/nidnoi01.png" alt="Chatbot Icon" style="width: 48px; height: 48px; vertical-align: middle;">';
            h1Element.innerHTML = aVARs.aChatbotTitle;
            // const responses = {
            //     "hello": "Hi there! How can I help you?",
            //     "how are you": "I'm just a bot, but I'm here to help you!",
            //     "bye": "Goodbye! Have a great day!",
            //     "what is your name": "I am HelperBot, your virtual assistant.",
            //     "what can you do": "I can help you with various tasks like answering questions, providing information, and more.",
            //     "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
            //     "what is the weather like": "I can't check the weather, but you can use a weather app for that!",
            //     "อยากทราบเรื่อง Travel Requisition": "Travel requisition is in MENU Travel Requisition บันทึก ขออนุมัติการเดินทางต่างประเทศและในประเทศ จะต้องได้รับการอนุมัติจากผู้อนุมัติ สำหรับการเดินทางต่างประเทศ จะอนุมัติโดย CEO ในประเทศจะอนุมัติตามลำดับการอนุมัติของ HOD ",
            //     "Travel Requisition": "Travel requisition is in MENU Travel Requisition บันทึก ขออนุมัติการเดินทางต่างประเทศและในประเทศ จะต้องได้รับการอนุมัติจากผู้อนุมัติ สำหรับการเดินทางต่างประเทศ จะอนุมัติโดย CEO ในประเทศจะอนุมัติตามลำดับการอนุมัติของ HOD ",
            //     "สวัสดี": "สวัสดี มีอะไรให้ช่วยบ้าง",
            // };
            const responses = aObjects.ACHATB;
           
            // function displayMessage(message, sender) {
            //     const messageElement = $('<div class="message"></div>').text(message);
            //     messageElement.addClass(sender);
            //     $('#chatbot').append(messageElement);
            //     $('#chatbot').scrollTop($('#chatbot')[0].scrollHeight);
            // }
            function displayMessage(message, sender) {
                const messageElement = $('<div class="message"></div>');
                messageElement.addClass(sender);
                messageElement.html(message); // Use .html() instead of .text()
                $('#chatbot').append(messageElement);
                $('#chatbot').scrollTop($('#chatbot')[0].scrollHeight);
            }

            /*       function getResponse(input) {
                      const isThai = /[\u0E00-\u0E7F]/.test(input);
                      //let getvalues = { aServer: aaPFDMI, aaUsrN: aaUsrN}
                      //let getvalues = { aServer: aaPFDMI, aaUsrN: aaUsrN, axfirstName: axfirstName, axlastName: axlastName}
      
                      input = input.toLowerCase();
                      for (let key in responses) {
                          if (input.includes(key.toLowerCase())) {
                              //key = key.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                              //console.log(responses[key].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match))
                              return responses[key].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                          }
                      }
                      if (isThai) {
                          return aArrays.CBUNMATCH[0] //"ขอโทษด้วย ยังไม่ค่อยเข้าใจ, ลองถามว่า 'หัวข้อการถาม' ดูซิ"; // Response for unmatched Thai input
                      }
                      return aArrays.CBUNMATCH[1] //"I'm sorry, I don't understand that.";
                  } */
            // Convert responses object into an array suitable for Fuse.js
            /*  const responseArray = Object.keys(responses).map(key => ({
                 question: key,
                 answer: responses[key]
             })); */
            const responseArray = Object.keys(responses).map(key => ({
                question: key.toLowerCase().replace(/[&]/g, 'and'),
                answer: responses[key]
            }));
            // const responseArray = Object.keys(responses).map(key => ({
            //     question: normalizeText(key), // Normalize the questions
            //     answer: responses[key]
            // }));
            // Initialize Fuse.js
            // const fuse = new Fuse(responseArray, {
            //     keys: ['question'], // Search in 'question' field
            //     includeScore: true,
            //     threshold: 0.4, // Adjust fuzziness tolerance
            // });

            // Initialize Fuse.js with enhanced settings
            const fuse = new Fuse(responseArray, {
                keys: ['question'],
                includeScore: true,
                threshold: 0.3, // 0.5
                tokenize: true,
                matchAllTokens: false,
                minMatchCharLength: 2
            });

            function getResponse(input) {
                const isThai = /[\u0E00-\u0E7F]/.test(input); // Check if input is in Thai
                const fillerWordsRegex = new RegExp(`(${aVARs.NNWORD})`, 'g'); // Dynamically create the regex
                //let getvalues = { aServer: aaPFDMI, aaUsrN: aaUsrN, axfirstName: axfirstName, axlastName: axlastName, xt2vTravelExpenses: aVARs.TREHELP01, xt2vFleetCard: aVARs.FLEHELP01, xt2vMedical: aVARs.MEDHELP01, xt2vTRF: aVARs.TRFHELP01 } //, xt2vFleetCardHelp: aVARs.FLEHELP01
                //,xt2vFleetCard: aVARs.FLEHELP01
                /*  // Function to resolve values safely
                 const resolveValue = (value, context) => {
                     return value.split('.').reduce((obj, key) => obj[key], context);
                 }; */

                /* // Iterate over aGetValues
                for (const key in aObjects.aGetValues) {
                    if (key.startsWith("xt2v")) { // Check if the key starts with "xt2v"
                        const value = aObjects.aGetValues[key];
                        if (typeof value === "string" && value.includes('.')) {
                            // Resolve the value dynamically and update the object
                            aObjects.aGetValues[key] = resolveValue(value, { aVARs });
                        }
                    }
                } */
                let getvalues = aObjects.aGetValues;
                //console.log("1 ", getvalues)
                //console.log("2 aObjects.aGetValues ", aObjects.aGetValues)
                // Normalize the input for better matching
                const normalizeText = text => text
                    .toLowerCase()
                    .replace(/[&]/g, 'and') // Replace '&' with 'and'
                    .replace(fillerWordsRegex, '') // Remove filler words // Remove specific Thai filler words
                    .replace(/[^a-z0-9\u0E00-\u0E7F\s]/gi, ''); // Remove special characters (preserve Thai)

                input = normalizeText(input); // Normalize input

                // Perform Fuse.js search
                const results = fuse.search(input);

                if (results.length > 0) {
                    // Return the best match's answer
                    //console.log(results[0].item.answer)
                    //return results[0].item.answer;
                    return results[0].item.answer.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                    //return responses[key].replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
                }
                //console.log(`input: ${input}`)
                // Log unmatched input for debugging purposes
                console.warn(`No match found for input: ${input}`);

                // Fallback responses for unmatched input
                if (isThai) {
                    return aArrays.CBUNMATCH[0]; // Thai fallback response
                }
                return aArrays.CBUNMATCH[1]; // English fallback response
            }

            $('#sendButton').click(function () {
                const userInput = $('#userInput').val();
                if (userInput.trim() !== "") {
                    displayMessage(userInput, 'user');
                    const botResponse = getResponse(userInput);
                    displayMessage(botResponse, 'bot');
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
            // });
            // Your code here
            // });
            // Example usage
            // const userInput = "Please check the Gift & Entertain";
            // const response = getResponse(userInput);
            // console.log(response); // Output the response
        }); // load content
    // })();  // TOP PRG
    // }); // TOP PRG
});