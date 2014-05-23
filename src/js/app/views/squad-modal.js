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
            'click .close': 'closeCard',
            'click .player-bio-add': 'addPlayer',
            'click .player-bio-remove': 'removePlayer'
        },

        initialize: function () {
            App.userDetails.on('change', this.closeCard, this);
            Backbone.on('player_clicked', this.openCard, this);
            Backbone.on('position_clicked', this.storeDetails, this);
        },

        storeDetails: function(details) {
            this.position = details.position;
            this.model = details.model;
            if (this.model) {
                this.render();
            }
        },

        openCard: function (playerModel) {
            this.model = playerModel;
            
            this.render();
            this.$el.show();
        },

        closeCard: function () {
            Backbone.trigger('playercard_closed');
            this.position = null;
            this.model = null;
            this.$el.hide();
        },

        removePlayer: function() {
             App.userDetails.save('player'+this.position, null);
        },

        addPlayer: function() {
            App.userDetails.save(
                'player'+this.position,
                this.model.get('uid')
            );
        },

        render: function () {
            if (!this.model || !this.model.has('name')) {
                return this;
            }

            var positionUID = App.userDetails.get('player'+this.position);
            var html = this.template({
                player: this.model.toJSON(),
                canRemove: this.model.get('uid') === positionUID,
                position: App.userDetails.isLoggedIn() && this.position !== null
            });
            this.$el.html(html);
            this.delegateEvents();
            this.$el.addClass('border-' + this.model.get('position').toLowerCase());
            this.$el.toggleClass('modalMode', !App.isSmallScreen());
            this.$el.show();
            return this;
        }

    });
});
