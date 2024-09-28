const links = [
    './fontawesome-free-5.15.1-web/css/fontawesome.css',
    './fontawesome-free-5.15.1-web/css/brands.css',
    './fontawesome-free-5.15.1-web/css/solid.css',
    './uicons/uicons-bold-rounded/css/uicons-bold-rounded.css',
    './uicons/uicons-solid-rounded/css/uicons-solid-rounded.css',
    'DevExpressDevExtreme/Lib/css/dx.common.css',
    { href: 'DevExpressDevExtreme/Lib/css/dx.light.css', 'data-theme': 'generic.light', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.dark.css', 'data-theme': 'generic.dark', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.softblue.css', 'data-theme': 'generic.softblue', 'data-active': 'true' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.darkmoon.css', 'data-theme': 'generic.darkmoon', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.darkviolet.css', 'data-theme': 'generic.darkviolet', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.carmine.css', 'data-theme': 'generic.carmine', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.carmine.compact.css', 'data-theme': 'generic.carmine.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.darkmoon.compact.css', 'data-theme': 'generic.darkmoon.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.darkviolet.compact.css', 'data-theme': 'generic.darkviolet.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.blue.dark.compact.css', 'data-theme': 'material.blue.dark.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.blue.light.compact.css', 'data-theme': 'material.blue.light.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.teal.dark.compact.css', 'data-theme': 'material.teal.dark.compact', 'data-active': 'false' },
   
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.purple.light.compact.css', 'data-theme': 'material.purple.light.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.teal.light.compact.css', 'data-theme': 'material.teal.light.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.lime.light.compact.css', 'data-theme': 'material.lime.light.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.orange.light.compact.css', 'data-theme': 'material.orange.light.compact', 'data-active': 'false' },    
];
/*
links.forEach(link => {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    
    if (typeof link === 'string') {
        linkElement.href = link;
    } else {
        linkElement.href = link.href;
        Object.keys(link).forEach(key => {
            if (key !== 'href') {
                linkElement.setAttribute(key, link[key]);
            }
        });
    }

    document.head.appendChild(linkElement);
});
*/
const aDXTheme = localStorage["aDXTheme"] || 'generic.light'; // Default to 'generic.light' if not set
const aNewTheme = "";
const loadStylesheets = () => {
    let themeStylesheet = null;
    
    links.forEach(link => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';

        if (typeof link === 'string') {
            linkElement.href = link;
        } else {
            linkElement.href = link.href;
            linkElement.setAttribute('data-theme', link['data-theme']);

            // If this link matches the aDXTheme, save it for later application
            if (link['data-theme'] === aDXTheme) {
                themeStylesheet = linkElement;
                aNewTheme = link['data-theme'];
            } else {
                linkElement.setAttribute('data-active', 'false');
            }
        }

        document.head.appendChild(linkElement);
    });

    // Apply the theme once the correct stylesheet is loaded
    if (themeStylesheet) {
        themeStylesheet.onload = () => {
            console.log(`Applying theme: ${aDXTheme}`);
            DevExpress.ui.themes.current(aDXTheme);
        };
        themeStylesheet.setAttribute('data-active', 'true');
    } else {
        console.warn(`Theme '${aDXTheme}' not found in the loaded stylesheets.`);
    }
};

//document.addEventListener('DOMContentLoaded', loadStylesheets);
// Ensure jQuery is loaded, then run the code depending on jQuery
document.addEventListener('DOMContentLoaded', () => {
    loadJQuery().then(() => {
        $(document).ready(function () {
            alert("inside");
            var aDXTheme = localStorage["aDXTheme"];
            DevExpress.ui.themes.current(aDXTheme);
        });

        loadStylesheets(); // Load stylesheets and apply theme
    }).catch(() => {
        console.error("Failed to load jQuery.");
    });
});

