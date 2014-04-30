define([
    'app',
    'backbone',
    'underscore',
    'transit',
    'data/players',
    'text!templates/squad-modal.html'
], function (
    App,
    Backbone,
    _,
    Transit,
    PlayerData,
    SquadModalTemplate
) {

    return Backbone.View.extend({

        tagName: 'div',
        id: 'playerSelectedModal',
        className: 'giwc-player-card',
        template: _.template(SquadModalTemplate),

        events: {
            'click button.addToSquad': 'addToSquad',
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

                /*
                var _this = this;
                this.$el.show().transition({
                    scale: 1
                }, function () {
                    _this.$el.find('.flip-container').addClass('hover');
                });
                */
                this.$el.show();
                this.$el.find('.flip-container').addClass('hover');
            }
        },

        closeCard: function () {
            /*
            var _this = this;
            this.$el.transition({
                scale: 0.001
            }, function () {
                _this.$el.find('.flip-container').addClass('hover');
                _this.$el.hide();
            });
            */
            this.$el.find('.flip-container').addClass('hover');
            this.$el.hide();

            App.playerSelected.set('highlighted', 0);
            return false;
        },

        addToSquad: function (e) {
            var target = $(e.target);

            this.closeCard();

            if (!App.userDetails.get('username')) {
                App.visualPrompt.set({
                    'message': 'Please login first',
                    'closePrompt': true
                });
                return;
            }
            var response = App.usersTeamCollection.addPlayerToCollection(this.playerModel, target.data('wantedPos'));

            if (response.status === 'fail') {
                App.visualPrompt.set({
                    'message': response.message,
                    'closePrompt': true
                });
            }
            return false;
        },

        render: function () {
            this.$el.empty();
            this.$el.append(this.template(this.templateData));
            return this;
        }

    });
});