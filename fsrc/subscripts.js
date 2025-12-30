(() => {
    const path = window.location.pathname;
    const fileName = path.substring(path.lastIndexOf('/') + 1);
    const fileNameOnly = fileName.replace(/\.html$/, '');
    const jsFileName = fileName.replace(/\.html$/, '.js');
    const cssFileName = fileName.replace(/\.html$/, '.css');
    const subpath = "src"; // Change to "dist" if needed
    const csspath = "srp"; // CSS path
    const timestamp = Date.now(); // Always generate a new timestamp

    // Scripts to load
    const scripts = [
        `./${subpath}/bundle.min.js?t=${timestamp}`,
        `./${subpath}/${jsFileName}?t=${timestamp}`
    ];

    // Load CSS dynamically
    function loadCSS(file) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = file;
            link.onload = resolve;
            link.onerror = () => reject(`Failed to load CSS: ${file}`);
            document.head.appendChild(link);
        });
    }

    // Load a script dynamically
    function loadScript(file) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = file;
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(`Failed to load script: ${file}`);
            document.head.appendChild(script);
        });
    }

    // Load scripts sequentially using async/await
    async function loadScriptsSequentially(scripts) {
        for (const script of scripts) {
            try {
                await loadScript(script);
            } catch (error) {
                console.error(error);
            }
        }
    }

    // Start loading CSS and JavaScript
    loadCSS(`./${csspath}/${cssFileName}?t=${timestamp}`)
        .then(() => console.log(`Loaded CSS: ${cssFileName}`))
        .catch(console.error);

    loadScriptsSequentially(scripts)
        .then(() => console.log("All scripts loaded successfully"))
        .catch(console.error);
})();
