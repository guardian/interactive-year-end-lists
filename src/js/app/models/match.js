define([
    'app',
    'backbone'
], function (
    App,
    Backbone
) {
    return Backbone.Model.extend({

        idAttribute: '_id',

    });
});
