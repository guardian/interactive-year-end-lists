define([
    'app',
    'backbone',
    'underscore',
    'views/match-lineup',
    'text!templates/user.html'
], function (
    App,
    Backbone,
    _,
    MatchLineupView,
    UserTemplate
) {

    return Backbone.View.extend({

        id: 'user-screen',
        className: 'container',
        template: _.template(UserTemplate),

        events: {

        },

        initialize: function () {

            App.viewingPlayer.on('change', this.render, this);

            this.templateData = {
                details: null
            };
        },



        render: function () {

            this.templateData = {
                details: App.viewingPlayer.toJSON()
            };

            this.$el.html(this.template(this.templateData));

            var playerArr = [];

            if (App.viewingPlayer.get('teamSelection')) {

                if (App.viewingPlayer.get('teamSelection').split(',').length === 11) {
                    App.viewingPlayer.get('teamSelection').split(',').map(function (player) {
                        var playerSplit = player.split(':'),
                            playerModel = App.playerCollection.findWhere({
                                'uid': playerSplit[0]
                            });
                        playerModel.set('wantedPosition', playerSplit[1]);
                        if (playerModel) {
                            playerArr.push(playerModel);
                        }
                    });
                    App.viewingPlayerTeamCollection.reset(playerArr);

                    var userPitch = new MatchLineupView({
                        collection: App.viewingPlayerTeamCollection
                    });

                    this.$el.find('#users-team').html(userPitch.render().$el);
                }
            }
            return this;
        }
    });
});