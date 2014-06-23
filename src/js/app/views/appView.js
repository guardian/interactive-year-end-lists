define([
    'backbone',
    'underscore',
    'views/gameView',
    'text!templates/appTemplate.html'
], function(
    Backbone,
    _,
    GameView,
    template
) {
    'use strict';

    return Backbone.View.extend({

        className: 'guInteractive',

        template: _.template(template),
        
        events: {

        },

        initialize: function() {
        },

        addGame: function(model) {
            var gameView = new GameView({model: model});
            this.$('.gamesContainer').append(gameView.render().el);
        },

        addAll: function() {
            this.collection.each(this.addGame);
        },

        render: function() {
            this.$el.html(this.template({}));
            this.addAll();
            return this;
        }
    });
});

