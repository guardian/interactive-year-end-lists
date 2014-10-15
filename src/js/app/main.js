define([
    'backbone',
    'views/appView',
    'iframeMessenger'
], function(
    Backbone,
    AppView,
    iframeMessenger
) {
   'use strict';

    function init(el, context, config, mediator) {
        // DEBUG: What we get given on boot
        console.log(el, context, config, mediator);

        var appView = new AppView({
            el: el
        });


        appView.render();
        Backbone.history.start();
        
        // Enable iframe resizing on the GU site
        iframeMessenger.enableAutoResize();
    }
    
    return {
        init: init
    };
});
