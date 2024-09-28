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
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.orange.light.compact.css', 'data-theme': 'material.orange.light.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.purple.light.compact.css', 'data-theme': 'material.purple.light.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.teal.light.compact.css', 'data-theme': 'material.teal.light.compact', 'data-active': 'false' },
    { href: 'DevExpressDevExtreme/Lib/css/dx.material.lime.light.compact.css', 'data-theme': 'material.lime.light.compact', 'data-active': 'false' },
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
});*/

// Get the stored theme from localStorage
const aDXTheme = localStorage["aDXTheme"] || 'generic.light'; // Default to 'generic.light' if not set

// Function to load the appropriate stylesheet
const loadStylesheets = () => {
    links.forEach(link => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        
        if (typeof link === 'string') {
            linkElement.href = link;
        } else {
            linkElement.href = link.href;
            linkElement.setAttribute('data-theme', link['data-theme']);
            // Only set active to true for the selected theme
            if (link['data-theme'] === aDXTheme) {
                linkElement.setAttribute('data-active', 'true');
            } else {
                linkElement.setAttribute('data-active', 'false');
            }
        }

        document.head.appendChild(linkElement);
    });

    // Set the current theme in DevExtreme
    DevExpress.ui.themes.current(aDXTheme);
};

// Ensure the function runs after document is ready
document.addEventListener('DOMContentLoaded', loadStylesheets);
