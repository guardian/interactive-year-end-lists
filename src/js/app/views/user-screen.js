define([
    'app',
    'backbone',
    'underscore',
    'text!templates/user-screen.html'
], function (
    App,
    Backbone,
    _,
    UserTemplate
) {

    return Backbone.View.extend({

        tagName: 'div',
        className: '',
        template: _.template(UserTemplate),

        events: {

        },

        initialize: function () {

        },

        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });
});