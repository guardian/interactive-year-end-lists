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

        // FIXME: Use config for url
        urlRoot: App.getEndpoint() + 'match',
        idAttribute: '_id',
        defaults: {
            1: null,
            2: null,
            stats: null,
            motm: null,
            venue: null,
            time: null
        }

    });
});