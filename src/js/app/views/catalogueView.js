define([
    'backbone',
    'underscore',
    'views/gameView',
    'collections/gamesCollection',
    'text!templates/catalogueTemplate.html'
], function(
    Backbone,
    _,
    GameView,
    gamesCollection,
    templateHTML
) {
    'use strict';

    return Backbone.View.extend({

        className: 'catalogue',

        template: _.template(templateHTML),
        
        events: {
        },

        initialize: function() {
        },

        addGame: function(model) {
            var gameView = new GameView({model: model});
            this.$el.append(gameView.render().el);
        },

        addAll: function() {
            gamesCollection.each(this.addGame, this);
        },

        render: function() {
            this.$el.html(this.template());
            this.addAll();
            return this;
        }
    });
});

