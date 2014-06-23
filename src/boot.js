'use strict';
define([], function() {
    return {
        boot: function(el) {
            window.GUI = window.GUI || { el: el };
            require(['js/main'], function(App) {
                
            });
        }
    };
});
