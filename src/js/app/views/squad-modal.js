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
        className: 'player-card',
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

            // Listening to model changes (in 'squad-list.js')
            App.playerSelected.on('change', this.openCard, this);
        },

        openCard: function () {
            if (App.playerSelected.get('highlighted')) {
                this.playerModel = App.playerCollection.get(App.playerSelected.get('highlighted'));

                /**
                 * TODO: This validation check might be worth removing, it was mainly
                 * used to prevent Stikers being placed into Goalkeeper positions
                 *
                 */

                this.templateData.validation = App.usersTeamCollection.validateAddingPlayer(this.playerModel);

                this.templateData.playerSelected = this.playerModel.toJSON();

                this.render();

                /*
                 * FIXME: Use transit jquery plugin so we can determine CSS transition end
                 */
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
             * FIXME: Use transit jquery plugin so we can determine CSS transition end
             */
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

        // Add to squad and into a specific position ('data-wantedPos="ST"')
        addToSquad: function (e) {
            var target = $(e.target);
            this.closeCard();

            if (!App.userDetails.get('username')) {
                App.notify.showMsg('Please login first');
                return;
            }
            
            var response = App.usersTeamCollection.addPlayerToCollection(
                this.playerModel,
                target.data('wantedPos')
            );

            if (response.status === 'fail') {
                App.notify.showMsg(response.message);
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
