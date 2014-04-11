define([
    'app',
    'underscore',
    'backbone',
    'views/match-lineup',
    'views/match-stats',
    'text!templates/match.html'
], function (
    App,
    _,
    Backbone,
    MatchLineupView,
    MatchStatsView,
    MatchTemplate
) {
    return Backbone.View.extend({

        id: 'match-screen',
        className: 'container',
        template: _.template(MatchTemplate),

        events: {
            'click .start': 'startMatchTextGenerator'
        },

        initialize: function (options) {
            this.listenTo(App.player1, 'change', this.isReady);
            this.listenTo(App.player2, 'change', this.isReady);

            this.templateData = {
                player1: {
                    details: null
                },
                player2: {
                    details: null
                }
            };
        },

        startMatchTextGenerator: function () {

        },

        isReady: function () {

            if (this.userValidForMatch(App.player1) && this.userValidForMatch(App.player2)) {

                this.templateData = {
                    player1: {
                        details: App.player1.toJSON()
                    },
                    player2: {
                        details: App.player2.toJSON()
                    }
                };

                this.render();

                this.renderTeams();
            }

        },

        userValidForMatch: function (player) {
            var playerVal = this.validateUser(player);
            if (playerVal.status == 'success') {
                playerVal = this.validateTeamSelection(player);
                if (playerVal.status == 'success') {
                    return true;
                }
            }
            return false;
        },

        validateUser: function (player) {
            var res = {
                status: 'fail',
                message: ''
            };
            if (player.get('username')) {
                res.status = 'success';
            } else {
                res.message = 'ID ' + player.get('guardianID') + ': data not in Mongo!';
            }
            return res;
        },

        validateTeamSelection: function (user) {
            var res = {
                status: 'fail',
                message: ''
            };
            if (user.get('teamSelection')) {

                if (user.get('teamSelection').split(',').length === 11) {

                    var playerArr = [];
                    user.get('teamSelection').split(',').map(function (player) {
                        var playerSplit = player.split(':'),
                            playerModel = App.playerCollection.findWhere({
                                'uid': playerSplit[0]
                            });
                        playerModel.set('wantedPosition', playerSplit[1]);
                        if (playerModel) {
                            playerArr.push(playerModel);
                        }
                    });
                    if (user.get('startingUser') == 1) {
                        App.player1TeamCollection.reset(playerArr);
                    } else {
                        App.player2TeamCollection.reset(playerArr);
                    }
                    res.status = 'success';
                } else {
                    res.message = 'ID ' + user.get('guardianID') + ': not enough players!';
                }
            } else {
                res.message = 'ID ' + user.get('guardianID') + ': Has no team selection!';
            }
            return res;
        },


        render: function () {
            this.$el.empty();
            this.$el.html(this.template(this.templateData));
            this.$el.append('<div id="match-pitches" class="row"></div>');
            return this;
        },

        renderTeams: function () {

            var user1Pitch = new MatchLineupView({
                    collection: App.player1TeamCollection
                }),
                user1Stats = new MatchStatsView({
                    collection: App.player1TeamCollection
                }),
                user2Pitch = new MatchLineupView({
                    collection: App.player2TeamCollection
                }),
                user2Stats = new MatchStatsView({
                    collection: App.player2TeamCollection
                });

            // Push visualPrompt to view
            this.$el.find('#user1-pitch').html(user1Pitch.render().$el);
            this.$el.find('#user2-pitch').html(user2Pitch.render().$el);

            this.$el.find('#user1-pitch').append(user1Stats.render().$el);
            this.$el.find('#user2-pitch').append(user2Stats.render().$el);

            return this;
        }



    });
});
