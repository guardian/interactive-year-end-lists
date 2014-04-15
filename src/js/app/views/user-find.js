define([
    'app',
    'backbone',
    'underscore',
    'text!templates/user-find.html'
], function (
    App,
    Backbone,
    _,
    UserFindTemplate
) {
    return Backbone.View.extend({

        template: _.template(UserFindTemplate),

        initialize: function () {
            // Search for all users and show them in the view with an option to play against them
        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }

    });
});