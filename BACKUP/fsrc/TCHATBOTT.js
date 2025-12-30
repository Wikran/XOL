$(document).ready(function () {
    initializeTheme();
    initializePDFPlugin();
    clearConsole();
    loadUserData();
    initializeChatbot();
});

function initializeTheme() {
    var aDXTheme = localStorage["aDXTheme"];
    DevExpress.ui.themes.current(aDXTheme);
}

function initializePDFPlugin() {
    window.jsPDF = window.jspdf.jsPDF;
    applyPlugin(window.jsPDF);
}

function clearConsole() {
    console.clear();
}

function loadUserData() {
    var aaXToX = localStorage["aaXXoX"];
    var aaUsrN = localStorage["aaXXuX"];
    var aaFname = localStorage["asFTNAME"];
    var [axfirstName, axlastName] = localStorage["asFTNAME"].split(" ");
    var storedJsonString = localStorage.getItem("usrProperty");
    var decryptedData = CryptoJS.AES.decrypt(storedJsonString, "sBxA017").toString(CryptoJS.enc.Utf8);
    var ausrProperty = JSON.parse(decryptedData);
    var aaPFDMI = isLocalHost(); // check API for LOCAL or DMZ
}

function initializeChatbot() {
    const aDatabasea = "ExtraOnLine.dbo.TaskControl";
    const aKeyField = "TaskGroup";
    const aKeyIDa = "TCHATBOT"; // TaskGroup;
    const axFieldSelected = "IDNO,TaskName,TaskProgram,TaskGroup";
    const aVARs = {};
    const aArrays = {};
    const aObjects = {};

    LoadSQLData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected)
        .then(result => {
            if (!Array.isArray(result)) {
                console.error("Unexpected result format:", result);
                return;
            }
            processMenuData(result, aVARs, aArrays, aObjects);
            processChatbotData(result, aVARs, aArrays, aObjects);
            initializeChatbotUI(aVARs, aObjects);
        })
        .catch(error => {
            console.error("Error loading SQL data:", error);
        });
}

function processMenuData(result, aVARs, aArrays, aObjects) {
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
        } else if (item.TaskName.includes("{T2O}")) {
            aObjects[key] = processT2OData(processedProgram);
        } else if (item.TaskName.includes("{OBJ}")) {
            aObjects[key] = processOBJData(processedProgram, aVARs);
        } else {
            let prefixMatch = item.TaskName.match(/#\((.*?)\)/);
            let prefix = prefixMatch ? prefixMatch[1] : "";
            let varKey = prefix + key;

            aVARs[varKey] = item.TaskName.includes("{num}") ? +processedProgram : processedProgram;
        }
    });
}

function processChatbotData(result, aVARs, aArrays, aObjects) {
    result.forEach(item => {
        if (!item.TaskGroup.includes(",")) {
            let aMatch = item.TaskName.match(/\[(.*?)\]/);
            if (!aMatch) return;

            if (item.TaskName.includes("{ARRAY}")) {
                aArrays[aMatch[1]] = processArrayData(item.TaskProgram);
            } else if (item.TaskName.includes("{T2O}")) {
                aObjects[aMatch[1]] = processT2OData(item.TaskProgram);
            } else if (item.TaskName.includes("{OBJ}")) {
                aObjects[aMatch[1]] = processOBJData(item.TaskProgram, aVARs);
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
}

function processArrayData(taskProgram) {
    return taskProgram.replace(/`/g, "'").split('\n').map(value => {
        let trimmedValue = value.trim();
        return trimmedValue === "" ? "" : !isNaN(trimmedValue) ? +trimmedValue : trimmedValue;
    });
}

function processT2OData(taskProgram) {
    return taskProgram.replace(/`/g, "'").split('\n').map(line => {
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
}

function processOBJData(taskProgram, aVARs) {
    return taskProgram.replace(/`/g, "'").split('\n').reduce((obj, value) => {
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
}

function initializeChatbotUI(aVARs, aObjects) {
    const h1Element = document.querySelector('h1');
    h1Element.innerHTML = aVARs.aChatbotTitle;

    const responses = aObjects.ACHATB;

    function displayMessage(message, sender) {
        const messageElement = $('<div class="message"></div>');
        messageElement.addClass(sender);
        messageElement.html(message);
        $('#chatbot').append(messageElement);
        $('#chatbot').scrollTop($('#chatbot')[0].scrollHeight);
    }

    const responseArray = Object.keys(responses).map(key => ({
        question: key.toLowerCase().replace(/[&]/g, 'and'),
        answer: responses[key]
    }));

    const fuse = new Fuse(responseArray, {
        keys: ['question'],
        includeScore: true,
        threshold: 0.3,
        tokenize: true,
        matchAllTokens: false,
        minMatchCharLength: 2
    });

    $('#sendButton').click(async function () {
        const userInput = $('#userInput').val().trim();
        if (userInput !== "") {
            displayMessage(userInput, 'user');

            try {
                const botResponse = await getResponse(userInput, fuse, aVARs, aObjects);
                displayMessage(botResponse || "I'm not sure how to respond.", 'bot');
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

    displayMessage(aVARs.aWelcomeText, 'bot');
}

async function getResponse(input, fuse, aVARs, aObjects) {
    const isThai = /[\u0E00-\u0E7F]/.test(input);
    const fillerWordsRegex = new RegExp(`(${aVARs.NNWORD})`, 'g');
    let getvalues = aObjects.aGetValues;

    const normalizeText = text => text
        .toLowerCase()
        .replace(/[&]/g, 'and')
        .replace(fillerWordsRegex, '')
        .replace(/[^a-z0-9\u0E00-\u0E7F\s]/gi, '');

    input = normalizeText(input);

    if (isSQLQuestion(input)) {
        try {
            let areturnword = await generateSQLQuery(input);
            return areturnword || "No SQL response.";
        } catch (error) {
            console.error("Error generating SQL query:", error);
            return "Error processing SQL request.";
        }
    } else {
        const results = fuse.search(input);

        if (results.length > 0) {
            let response = results[0].item.answer.replace(/\${(.*?)}/g, (match, p1) => getvalues[p1] || match);
            return response;
        }

        console.warn(`No match found for input: ${input}`);

        return await callOpenrouter(input);
    }
}