define([
    'app',
    'backbone',
    'underscore',
    'text!templates/find.html'
], function (
    App,
    Backbone,
    _,
    FindTemplate
) {

    return Backbone.View.extend({

        id: 'find-screen',
        className: 'container',
        template: _.template(FindTemplate),

        events: {
            'change input#q': 'contentChanged'
        },

        initialize: function () {
            this.templateData = {};
        },

        contentChanged: function () {
            this.$el.find('#search-results').html('Loading ...');
            var userInput = this.$el.find('#q').val();
        },

        render: function () {
            this.$el.html(this.template(this.templateData));
            return this;
        }
    });
});