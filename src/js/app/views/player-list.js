define([
    'underscore',
    'backbone',
    'views/player',
    'text!templates/player-list.html'
], function(
    _,
    Backbone,
    PlayerView,
    playerListTemplate
) {
    return Backbone.View.extend({
        id: 'player-selector',

        events: {
            'change #player_filters': 'filterChange'
        },

        initialize: function() {
            this.template = _.template(playerListTemplate);
            this.playerViews = [];
            this.updatePlayerViews();
        },

        filterChange: function() {
            console.log('Filter changed');
        },

        updatePlayerViews: function() {
            this.collection.each(function(playerModel) {
                this.playerViews.push(new PlayerView({ model : playerModel }));
            }, this);
        },

        renderPlayerViews: function() {
            var domContainer = document.createDocumentFragment();
            this.playerViews.forEach(function(playerView ) {
                domContainer.appendChild( playerView.render().el );
            });
            return domContainer;
        },

        render: function() {
            this.$el.append(this.template({}));
            this.$('#player_list').append( this.renderPlayerViews() );
            return this;
        }

    });
});
