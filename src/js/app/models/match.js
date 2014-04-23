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

        urlRoot: 'http://test.theguardian.com:3000/match',
        idAttribute: '_id',
        defaults: {
            1: null,
            2: null,
            stats: null,
            motm: null
        }

    });
});