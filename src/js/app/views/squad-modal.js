define([
    'app',
    'backbone',
    'underscore',
    'data/players',
    'models/player',
    'text!templates/squad-modal.html'
], function (
    App,
    Backbone,
    _,
    PlayerData,
    PlayerModel,
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
            Backbone.on('player_clicked', this.openCard, this);
            App.userDetails.on('change', this.closeCard, this);
        },

        openCard: function (playerModel) {
            this.model = playerModel;
            this.render();
            this.$el.toggleClass('modalMode', !App.isSmallScreen());
            this.$el.show();
        },

        closeCard: function () {
            Backbone.trigger('playercard_closed');
            this.$el.hide();
        },

        render: function () {
            if (this.model && this.model.has('name')) {
                this.$el.html(this.template(this.model.toJSON()));
            }
            return this;
        }

    });
});
