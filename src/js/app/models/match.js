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

        idAttribute: '_id'

    });
});