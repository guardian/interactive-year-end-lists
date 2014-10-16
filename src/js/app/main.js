define([
    'backbone',
    'collections/sheetCollection',
    'views/appView',
    'iframeMessenger'
], function(
    Backbone,
    SheetCollection,
    AppView,
    iframeMessenger
) {
   'use strict';

    var appView;
    
    // Your proxied Google spreadsheet goes here
    var key = '1hy65wVx-pjwjSt2ZK7y4pRDlX9wMXFQbwKN0v3XgtXM';

    function init(el, context, config, mediator) {
        // DEBUG: What we get given on boot
        console.log(el, context, config, mediator);

        // Create collection from Google spreadsheet key and sheetname
        var videogameCollection = new SheetCollection({
            key: key,
            sheetname: 'videogames'
        });
       
        // Create an app view, passing along the collection made above
        appView = new AppView({
            el: el,
            collection: videogameCollection
        });
        
        // Fetch data
        videogameCollection.fetch();

        // Start listening to URL #paths
        Backbone.history.start();
        
        // Enable iframe resizing on the GU site
        iframeMessenger.enableAutoResize();
    }
    
    return {
        init: init
    };
});
