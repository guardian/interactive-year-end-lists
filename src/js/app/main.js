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

    function init(el, context, config, mediator) {
        // DEBUG: What we get given on boot
        console.log(el, context, config, mediator);

        // DON'T WANT TO DO TWO FETCH FOR EACH SHEET! WILL CACHING FIX THIS?
        var key = '1ZjPjdEbLD7h3qCQ3Y_W92aT0CjD-bYGnOcDVDbOcNe8';
        var dataCollection = new SheetCollection({key: key, sheetname: 'data'});
        dataCollection.fetch();
        dataCollection.on('sync', function(d) {
            console.log(d);
        });
        
        var totalsCollection = new SheetCollection({key: key, sheetname: 'recoverycalcs'});
        totalsCollection.fetch();
        totalsCollection.on('sync', function(d) {
            console.log(d);
        });



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
