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

        tagName: 'div',
        id: 'playerSelectedModal',
        className: 'giwc-player-card',
        template: _.template(SquadModalTemplate),

        events: {
            'click button.addToSquad, .removeFromSquad': 'addToSquad',
            'click .close': 'closeCard'
        },

        initialize: function () {
            this.templateData = {
                "playerSelected": '',
                'validation': {}
            };
            App.playerSelected.on('change', this.openCard, this);
        },

        openCard: function () {
            if (App.playerSelected.get('highlighted')) {
                this.playerModel = App.playerCollection.get(App.playerSelected.get('highlighted'));

                this.templateData.validation = App.usersTeamCollection.validateAddingPlayer(this.playerModel);
                this.templateData.playerSelected = this.playerModel.toJSON();

                this.render();

                this.$el.fadeIn('fast');
            }
        },

        closeCard: function () {
            this.$el.fadeOut('fast');
            App.playerSelected.set('highlighted', 0);
            return false;
        },

        addToSquad: function () {

            this.closeCard();

            if (!App.userDetails.get('username')) {
                App.visualPrompt.set({
                    'message': 'Please login first',
                    'closePrompt': true
                });
                return;
            }
            var response = App.usersTeamCollection.addPlayerToCollection(this.playerModel, true);
            if (response.status === 'fail') {
                App.visualPrompt.set({
                    'message': response.message,
                    'closePrompt': true
                });
            }
            return false;
        },

        render: function () {
            this.$el.html(this.template(this.templateData));
            return this;
        }
    });
});