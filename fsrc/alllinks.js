document.addEventListener("DOMContentLoaded", function () {
    /** Load CSS dynamically */
    let stylesheets = [
        { rel: "shortcut icon", type: "image/jpg", href: "./images/lockton-favicon.png" },
        { rel: "stylesheet", href: "./fontawesome-free-5.15.1-web/css/fontawesome.css" },
        { rel: "stylesheet", href: "./fontawesome-free-5.15.1-web/css/brands.css" },
        { rel: "stylesheet", href: "./fontawesome-free-5.15.1-web/css/solid.css" },
        { rel: "stylesheet", href: "./uicons/uicons-bold-rounded/css/uicons-bold-rounded.css" },
        { rel: "stylesheet", href: "./uicons/uicons-solid-rounded/css/uicons-solid-rounded.css" },
        { rel: "stylesheet", href: "DevExpressDevExtreme/Lib/css/dx.common.css" },
        { rel: "dx-theme", "data-theme": "generic.light", href: "DevExpressDevExtreme/Lib/css/dx.light.css", "data-active": "false" },
        { rel: "dx-theme", "data-theme": "generic.dark", href: "DevExpressDevExtreme/Lib/css/dx.dark.css", "data-active": "false" },
        { rel: "dx-theme", "data-theme": "generic.softblue", href: "DevExpressDevExtreme/Lib/css/dx.softblue.css", "data-active": "true" },
        { rel: "dx-theme", "data-theme": "generic.darkmoon", href: "DevExpressDevExtreme/Lib/css/dx.darkmoon.css", "data-active": "false" },
        { rel: "dx-theme", "data-theme": "generic.darkviolet", href: "DevExpressDevExtreme/Lib/css/dx.darkviolet.css", "data-active": "false" },
        { rel: "dx-theme", "data-theme": "generic.carmine", href: "DevExpressDevExtreme/Lib/css/dx.carmine.css", "data-active": "false" },
        { rel: "dx-theme", "data-theme": "material.blue.dark.compact", href: "DevExpressDevExtreme/Lib/css/dx.material.blue.dark.compact.css", "data-active": "false" },
        { rel: "dx-theme", "data-theme": "material.orange.light.compact", href: "DevExpressDevExtreme/Lib/css/dx.material.orange.light.compact.css", "data-active": "false" },
        { rel: "dx-theme", "data-theme": "material.purple.light.compact", href: "DevExpressDevExtreme/Lib/css/dx.material.purple.light.compact.css", "data-active": "false" },
        { rel: "dx-theme", "data-theme": "material.lime.light.compact", href: "DevExpressDevExtreme/Lib/css/dx.material.lime.light.compact.css", "data-active": "false" }
    ];

    let loadedStyles = 0;

    stylesheets.forEach(item => {
        let link = document.createElement("link");
        Object.keys(item).forEach(attr => link.setAttribute(attr, item[attr]));

        link.onload = () => {
            loadedStyles++;
            if (loadedStyles === stylesheets.length) {
                applyCursorPointer();
            }
        };

        document.head.appendChild(link);
    });

    /** Load JavaScript dynamically */
    let scripts = [
        "vendor/jquery/3.5.1/jquery.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js",
        "DevExpressDevExtreme/Lib/js/dx.all.js",
        "aThaiWord.js?v=1.0.2",
        "./src/subscripts.js"
    ];

    scripts.forEach(src => {
        let script = document.createElement("script");
        script.src = src;
        script.async = false;  // Ensures order of execution
        document.head.appendChild(script);
    });

    /** Ensure cursor pointer applies after all styles are loaded */
    function applyCursorPointer() {
        setTimeout(() => {
            document.querySelectorAll("i, .fa, .fas, .fab, .dx-icon").forEach(icon => {
                icon.style.cursor = "pointer";
            });
        }, 300);
    }

    /** Fallback for jQuery */
    let checkJQuery = setInterval(() => {
        if (window.jQuery) {
            clearInterval(checkJQuery);
        } else {
            let fallbackScript = document.createElement("script");
            fallbackScript.src = "js/jquery.min.js";
            document.head.appendChild(fallbackScript);
        }
    }, 100);
});


