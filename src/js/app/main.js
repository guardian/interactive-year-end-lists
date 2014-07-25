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

    var appView = new AppView({
        el: $(window.GUI.el)
    });


    appView.render();
    Backbone.history.start();
    
    
    // Enable iframe resizing on the GU site
    iframeMessenger.enableAutoResize();
});

