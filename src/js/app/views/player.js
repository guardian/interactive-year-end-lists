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

        className: 'col-xs-4 col-sm-3 player_profile',

        template: _.template(PlayerTemplate),

        events: {
            'click': 'openPlayerCard'
        },

        initialize: function() {
            
        },

        openPlayerCard: function() {
            App.playerSelected.set('highlighted', this.model.cid);
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
});
