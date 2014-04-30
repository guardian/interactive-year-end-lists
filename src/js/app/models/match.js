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
        urlRoot: 'http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/match',
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