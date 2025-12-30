document.addEventListener("DOMContentLoaded", function () {
    let stylesheets = [
        "./fontawesome-free-5.15.1-web/css/fontawesome.css",
        "./fontawesome-free-5.15.1-web/css/brands.css",
        "./fontawesome-free-5.15.1-web/css/solid.css",
        "./uicons/uicons-bold-rounded/css/uicons-bold-rounded.css",
        "./uicons/uicons-solid-rounded/css/uicons-solid-rounded.css",
        "DevExpressDevExtreme/Lib/css/dx.common.css",
        "DevExpressDevExtreme/Lib/css/dx.light.css",
        "DevExpressDevExtreme/Lib/css/dx.dark.css",
        "DevExpressDevExtreme/Lib/css/dx.softblue.css",
        "DevExpressDevExtreme/Lib/css/dx.darkmoon.css",
        "DevExpressDevExtreme/Lib/css/dx.darkviolet.css",
        "DevExpressDevExtreme/Lib/css/dx.carmine.css",
        "DevExpressDevExtreme/Lib/css/dx.carmine.compact.css",
        "DevExpressDevExtreme/Lib/css/dx.darkmoon.compact.css",
        "DevExpressDevExtreme/Lib/css/dx.darkviolet.compact.css",
        "DevExpressDevExtreme/Lib/css/dx.material.blue.dark.compact.css",
        "DevExpressDevExtreme/Lib/css/dx.material.blue.light.compact.css",
        "DevExpressDevExtreme/Lib/css/dx.material.teal.dark.compact.css",
        "DevExpressDevExtreme/Lib/css/dx.material.orange.light.compact.css",
        "DevExpressDevExtreme/Lib/css/dx.material.purple.light.compact.css",
        "DevExpressDevExtreme/Lib/css/dx.material.teal.light.compact.css",
        "DevExpressDevExtreme/Lib/css/dx.material.lime.light.compact.css"
    ];
    
    stylesheets.forEach((href, index) => {
        let link = document.createElement("link");
        link.rel = index === 5 ? "dx-theme" : "stylesheet";
        link.href = href;

        if (index >= 6) {
            link.setAttribute("data-theme", href.match(/dx\.(.*)\.css/)[1]);
            link.setAttribute("data-active", "false");
        }

        document.head.appendChild(link);
    });
});



