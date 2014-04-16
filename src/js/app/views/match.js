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
            'click #startMatch': 'startMatchTextGenerator'
        },

        initialize: function (options) {
            this.listenTo(App.player1, 'change', this.render);
            this.listenTo(App.player2, 'change', this.render);

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

            var user1Stats = new MatchStatsView({
                    collection: App.player1TeamCollection
                }).getTeamStats(),
                user2Stats = new MatchStatsView({
                    collection: App.player2TeamCollection
                }).getTeamStats(),
                matchOutput = '<table class="table"><thead><tr><th>Stat</th><th>Winner</th><th>Dif</th></tr></thead><tbody>';
// TODO: perhaps change to underscore or include jquery
            _.each(user1Stats, function (key, value) {
                matchOutput += '<tr>';
                matchOutput += '    <td>' + key + '</td>';
                if (user1Stats[key] ===  user2Stats[key]) {
                    matchOutput += '    <td>Draw</td>';
                    matchOutput += '    <td>-</td>';
                } else if (user1Stats[key] > user2Stats[key]) {
                    matchOutput += '    <td>' + App.player1.get('username') + '</td>';
                    matchOutput += '    <td>+' + (user1Stats[key] - user2Stats[key]) + '</td>';
                } else {
                    matchOutput += '    <td>' + App.player2.get('username') + '</td>';
                    matchOutput += '    <td>+' + (user2Stats[key] - user1Stats[key]) + '</td>';
                }
                matchOutput += '</tr>';
            });
            matchOutput += '<tbody></table>';

            this.$el.find('#match-details').html(matchOutput);

            this.$el.find('#startMatch').hide();

            return false;
        },

        isReady: function () {
            if (this.userValidForMatch(App.player1) && this.userValidForMatch(App.player2)) {
                return true;
            }
            return false;
        },

        userValidForMatch: function (player) {
            var res = this.validateUser(player);
            if (res.status === 'success') {
                res = this.validateTeamSelection(player);
                if (res.status === 'success') {
                    return true;
                }
            }
            console.log(res);
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
            },
                playerArr = [];
            if (user.get('teamSelection')) {
                if (user.get('teamSelection').split(',').length === 11) {
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
                    if (user.get('startingUser') === 1) {
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

            var readyForMatch = this.isReady();

            if (readyForMatch) {
                this.templateData = {
                    player1: {
                        details: App.player1.toJSON()
                    },
                    player2: {
                        details: App.player2.toJSON()
                    }
                };
            }

            this.$el.empty();
            this.$el.html(this.template(this.templateData));
            this.$el.append('<div id="match-pitches" class="row"></div>');

            if (readyForMatch) {
                this.renderTeams();
                this.startMatchTextGenerator();
            }

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