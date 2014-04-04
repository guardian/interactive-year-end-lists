define([
    'app',
    'backbone',
    'underscore',
    'data/players',
    'views/player-modal',
    'text!templates/player-list.html'
], function(
    App,
    Backbone,
    _,
    PlayerData,
    PlayerModal,
    PlayerTemplate
){

    return Backbone.View.extend({
        
        tagName: 'div',
        className: 'col-xs-4 col-sm-3 col-lg-2 player_profile',
        template: _.template(PlayerTemplate),

        events: {
            'click img, p': 'openPlayerCard',
            'click .removePlayer': 'removePlayerFromSquad'
        },

        initialize: function() {
            this.$el.attr('id', 'player_profile_' + this.model.cid);
            App.playerSelected.on('change', this.openCard, this);
            this.listenTo(App.usersTeamCollection, 'add remove reset', this.showSelectedPlayer);
            this.showSelectedPlayer();
        },

        showSelectedPlayer: function() {
            this.$el.toggleClass('selected', App.usersTeamCollection.contains(this.model));
        },

        openPlayerCard: function() {
            App.playerSelected.set('highlighted', this.model.cid);
        },

        removePlayerFromSquad: function() {
            App.usersTeamCollection.remove(this.model);
            this.showSelectedPlayer();
            return false;
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
});
