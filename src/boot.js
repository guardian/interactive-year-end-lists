'use strict';
define([], function() {
    return {
        boot: function(el) {
            // Store global ref to element
            window.GUI = window.GUI || { el: el };
           // @@assetpath 
            // Load CSS
            var head = document.querySelector('head');
            var link = document.createElement('link');
            link.setAttribute('type', 'text/css');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('href', '@@assetpath/assets/css/main.css');
            head.appendChild(link);

            // Load main application
            require(['@@assetpath/assets/js/main.js'], function() {});
        }
    };
});
