define([
    'backbone',
    'views/appView'
], function(
    Backbone,
    AppView
) {
   'use strict';

    var appView = new AppView({
        el: $(window.GUI.el)
    });

    // Load 'css/main.css' as an example.

    appView.render();
    Backbone.history.start();
});

