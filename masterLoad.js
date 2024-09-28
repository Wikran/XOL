// Function to load a script from a URL
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;

    script.onload = function () {
        console.log(`${url} loaded successfully.`);
        if (callback) callback();
    };

    script.onerror = function () {
        console.error(`Failed to load the script ${url}`);
    };

    document.head.appendChild(script);
}

// Load jQuery with a fallback
function loadJQuery() {
    loadScript("vendor/jquery/3.5.1/jquery.min.js", function () {
        if (!window.jQuery) {
            loadScript("js/jquery.min.js", function () {
                console.log("Fallback jQuery loaded from local js directory.");
            });
        }
    });
}

// Load other necessary scripts
function loadOtherScripts() {
    // Export to Excel
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.4.0/polyfill.min.js");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/exceljs/3.3.1/exceljs.min.js");
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js");

    // Export to PDF
    loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.umd.min.js", function () {
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.9/jspdf.plugin.autotable.min.js");
    });

    // DevExpress library
    loadScript("DevExpressDevExtreme/Lib/js/dx.all.js");
}

// Ensure all scripts are loaded after the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    //loadJQuery();  // Load jQuery and its fallback
    loadOtherScripts(); // Load all other scripts
});
