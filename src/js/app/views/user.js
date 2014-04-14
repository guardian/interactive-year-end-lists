define([
    'app',
    'backbone',
    'underscore',
    'text!templates/user.html'
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