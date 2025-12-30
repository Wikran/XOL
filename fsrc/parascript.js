const timestamp = Date.now();
const path = window.location.pathname;
const subpath = "src" //dist
const subp = "dist"
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const param1 = urlParams.get('param1');
//const fileName = path.substring(path.lastIndexOf('/') + 1);
const jsFileName = param1 + '.js'    //fileName.replace(/\.html$/, '.js');
const cssFileName = param1 + '.css'  //fileName.replace(/\.html$/, '.css'); // Convert HTML file name to CSS file name
const scripts = [`./${subpath}/bundle.min.js?t=${timestamp}`, `./${subpath}/${jsFileName}?t=${timestamp}`];
localStorage["aPXIXD"] = param1;

// Function to load CSS dynamically
function loadCSS(file) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = file;
    linkElement.onerror = () => console.error(`Failed to load CSS: ${file}`);
    document.head.appendChild(linkElement);
    //console.log(`Loaded CSS file: ${file}`);
}

function loadScript(file, callback) {
    const scriptElement = document.createElement('script');
    scriptElement.src = file;
    scriptElement.async = true; // Load asynchronously but maintain execution order
    scriptElement.onload = callback;
    scriptElement.onerror = () => console.error(`Failed to load script: ${file}`);
    document.head.appendChild(scriptElement);
}

// Sequentially load scripts
function loadScriptsSequentially(scripts, index = 0) {
    if (index < scripts.length) {
        loadScript(scripts[index], () => {
            loadScriptsSequentially(scripts, index + 1); // Load the next script
        });
    }
}

// Start loading scripts
loadCSS(`./srp/${cssFileName}?t=${timestamp}`); // Load the CSS file
loadScriptsSequentially(scripts);