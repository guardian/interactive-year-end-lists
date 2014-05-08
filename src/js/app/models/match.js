define([
    'app',
    'backbone',
    'jquery'
], function (
    App,
    Backbone,
    $
) {
    return Backbone.Model.extend({

        urlRoot: App.getEndpoint() + 'result',
        
        idAttribute: '_id',

        defaults: {
            user1: null,
            user2: null
        }

    });
});
