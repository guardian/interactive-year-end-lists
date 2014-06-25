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

    appView.render();
    Backbone.history.start();
});

