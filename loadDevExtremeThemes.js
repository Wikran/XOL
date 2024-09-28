function loadDevExtremeThemes() {
    const themes = [
      { rel: 'stylesheet', href: 'DevExpressDevExtreme/Lib/css/dx.common.css' },
      { rel: 'dx-theme', 'data-theme': 'generic.light', href: 'DevExpressDevExtreme/Lib/css/dx.light.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'generic.dark', href: 'DevExpressDevExtreme/Lib/css/dx.dark.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'generic.softblue', href: 'DevExpressDevExtreme/Lib/css/dx.softblue.css', 'data-active': 'true' },
      { rel: 'dx-theme', 'data-theme': 'generic.darkmoon', href: 'DevExpressDevExtreme/Lib/css/dx.darkmoon.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'generic.darkviolet', href: 'DevExpressDevExtreme/Lib/css/dx.darkviolet.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'generic.carmine', href: 'DevExpressDevExtreme/Lib/css/dx.carmine.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'generic.carmine.compact', href: 'DevExpressDevExtreme/Lib/css/dx.carmine.compact.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'generic.darkmoon.compact', href: 'DevExpressDevExtreme/Lib/css/dx.darkmoon.compact.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'generic.darkviolet.compact', href: 'DevExpressDevExtreme/Lib/css/dx.darkviolet.compact.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'material.blue.dark.compact', href: 'DevExpressDevExtreme/Lib/css/dx.material.blue.dark.compact.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'material.blue.light.compact', href: 'DevExpressDevExtreme/Lib/css/dx.material.blue.light.compact.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'material.teal.dark.compact', href: 'DevExpressDevExtreme/Lib/css/dx.material.teal.dark.compact.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'material.orange.light.compact', href: 'DevExpressDevExtreme/Lib/css/dx.material.orange.light.compact.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'material.purple.light.compact', href: 'DevExpressDevExtreme/Lib/css/dx.material.purple.light.compact.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'material.teal.light.compact', href: 'DevExpressDevExtreme/Lib/css/dx.material.teal.light.compact.css', 'data-active': 'false' },
      { rel: 'dx-theme', 'data-theme': 'material.lime.light.compact', href: 'DevExpressDevExtreme/Lib/css/dx.material.lime.light.compact.css', 'data-active': 'false' }
    ];
  
    themes.forEach(theme => {
      const link = document.createElement('link');
      Object.keys(theme).forEach(attr => link.setAttribute(attr, theme[attr]));
      document.head.appendChild(link);
    });
    alert("load theme");
  }
  
  // Call the function to load the themes
  loadDevExtremeThemes();
  alert("Load DevExtreme themes")
  