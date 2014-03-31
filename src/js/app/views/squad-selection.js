// Squad selection
define([
    'underscore',
    'backbone',
    'views/player',
    'text!templates/squad-selection.html'
], function(
    _,
    Backbone,
    PlayerView,
    PlayerListTemplate
) {
    return Backbone.View.extend({
        id: 'player-selector',

        events: {
            'change #player_filters': 'filterChange',
            'click #resetTeam': 'resetTeam'
        },

        template:  _.template(PlayerListTemplate),

        initialize: function() {
            console.log('player-list.js has been initialized.');
            
            this.playerViews = [];
            this.updatePlayerViews();
        },

        filterChange: function() {
            console.log('Filter changed');
        },

        resetTeam: function() {
            return false;
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
            this.$el.html(this.template({}));
            this.$('#player_list').append( this.renderPlayerViews() );
            return this;
        }

    });
});