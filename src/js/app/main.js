define([
    'views/appView',
    'collections/gamesCollection'
], function(
    AppView,
    gamesCollection
) {
   'use strict';

    var appView = new AppView({
        collection: gamesCollection,
        el: $(window.GUI.el)
    });

    appView.render();
    
});

