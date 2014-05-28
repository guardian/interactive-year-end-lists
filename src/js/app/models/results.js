define([
    'backbone',
    'app'
], function (
    Backbone,
    App
) {
    return Backbone.Model.extend({
        urlRoot: function() {
            return App.getEndpoint() + 'results/' + this.get('guardianID');
        },

        defaults: {
        }


    });
});
