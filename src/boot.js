'use strict';
define([], function() {
    return {
        boot: function(el, context, config, mediator) {
            // Load main application
            require(['@@assetpath/assets/js/main.js'], function(req) {
                req(['main'], function(main) {
                    var config = (config) ? config : {};
                    config.assetPath = '@@assetpath/';
                    main.init(el, context, config, mediator);
                });
            }, function(err) { console.error('Error loading boot.', err); });
        }
    };
});
