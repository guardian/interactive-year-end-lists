define([
    'app',
    'backbone',
    'underscore',
    'data/players',
    'text!templates/squad-modal.html'
], function (
    App,
    Backbone,
    _,
    PlayerData,
    SquadModalTemplate
) {

    return Backbone.View.extend({
        id: 'playerSelectedModal',
        
        className: 'player-card',
        
        template: _.template(SquadModalTemplate),

        events: {
            'click .close': 'closeCard'
        },

        initialize: function () {
            this.templateData = {};
            
            Backbone.on('player_clicked', this.openCard, this);
            App.userDetails.on('change', this.closeCard, this);
        },

        openCard: function (playerModel) {
            this.templateData = playerModel.toJSON();
            this.render();
            this.$el.show();
        },

        closeCard: function () {
            Backbone.trigger('playercard_closed');
            this.$el.hide();
        },

        render: function () {
            this.$el.html(this.template(this.templateData));
            this.$el.hide();
            return this;
        }

    });
});
