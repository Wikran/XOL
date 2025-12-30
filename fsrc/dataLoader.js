/** ✅ Load and process SQL data */
function loadAndProcessSQLData(aDatabasea, aKeyField, aKeyIDa, axFieldSelected, callback) {
    var aVARs = {};
    var aArrays = {};
    var aObjects = {};

    loadSQLData(isLocalHost(), aDatabasea, aKeyIDa, aKeyField, axFieldSelected)
        .then(result => {
            if (!$.isArray(result)) {
                console.error("Unexpected result format:", result);
                return;
            }

            $.each(result, (index, item) => {
                let aMatch = item.TaskName.match(/\[(.*?)\]/);
                if (!aMatch) return;

                let taskProgram = item.TaskProgram.replace(/`/g, "'");

                if (item.TaskName.includes("{ARRAY}")) {
                    aArrays[aMatch[1]] = parseArray(taskProgram);
                } else if (item.TaskName.includes("{T2O}")) {
                    aObjects[aMatch[1]] = parseT2O(taskProgram);
                } else if (item.TaskName.includes("{OBJ}")) {
                    aObjects[aMatch[1]] = parseObject(taskProgram);
                } else {
                    aVARs[aMatch[1]] = parseVariable(taskProgram, item.TaskName);
                }
            });

            if (typeof callback === "function") {
                callback(aVARs, aArrays, aObjects);
            }
        })
        .fail(error => console.error("Error fetching SQL data:", error));
}

/** ✅ Function to parse ARRAY values */
function parseArray(data) {
    return data.split("\n")
        .map(line => $.trim(line))
        .map(line => (line === "" ? "" : isNaN(line) ? line : +line));
}

/** ✅ Function to parse T2O (Text to Object) */
function parseT2O(data) {
    return data.split("\n")
        .map(line => {
            line = $.trim(line).replace(/,$/, "");
            line = line.replace(/(\w+):/g, '"$1":').replace(/:\s*([\w]+)/g, ': "$1"');
            return JSON.parse(line);
        })
        .map(obj => {
            $.each(obj, (key, value) => {
                if (key.includes("amt") && typeof value === "string") {
                    obj[key] = +value; // Convert numeric strings to numbers
                }
            });
            return obj;
        });
}

/** ✅ Function to parse OBJ (Object) */
function parseObject(data) {
    return data.split("\n").reduce((obj, line) => {
        let [key, value] = $.trim(line).split(":").map(part => $.trim(part));
        if (key && value !== undefined) obj[key] = isNaN(value) ? value : +value;
        return obj;
    }, {});
}

/** ✅ Function to parse simple variables */
function parseVariable(data, taskName) {
    return taskName.includes("{num}") ? +data : data;
}

// Export functions (For use in other scripts)
if (typeof module !== "undefined" && module.exports) {
    module.exports = { loadAndProcessSQLData };
}
