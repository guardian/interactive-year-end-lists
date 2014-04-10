// Team A vs Team B
define([
    'app',
    'underscore',
    'backbone',
    'text!templates/match-screen.html'
], function (
    App,
    _,
    Backbone,
    TeamScreenTemplate
) {
    return Backbone.View.extend({

        id: 'match-screen',
        className: 'container',
        template: _.template(TeamScreenTemplate),

        events: {
            'click .start': 'startMatchTextGenerator'
        },

        initialize: function (options) {
            this.listenTo(App.player1, 'change', this.isReady);
            this.listenTo(App.player2, 'change', this.isReady);
            this.templateData = {
                player1: {
                    details: null,
                    team: null
                },
                player2: {
                    details: null,
                    team: null
                },
                moments: null
            };
        },

        startMatchTextGenerator: function () {

            jQuery.fn.reverse = [].reverse;

            this.$el.find('.moment').reverse().each(function (index, i) {
                $(this).delay(index * 2001).fadeIn('slow');
            });

            this.$el.find('.start').hide();
        },

        isReady: function () {

            if (this.userValidForMatch(App.player1) && this.userValidForMatch(App.player2)) {

                var team1 = App.player1TeamCollection.toJSON();
                var team2 = App.player2TeamCollection.toJSON();

                this.templateData = {
                    player1: {
                        details: App.player1.toJSON(),
                        team: team1
                    },
                    player2: {
                        details: App.player2.toJSON(),
                        team: team2
                    }
                };

                var moments = {
                    1: {
                        'time': 85,
                        'action': 'Goal',
                        'title': 'GOAL! 50 Shades of O’Shea 1-0 Arsenal (' + this.pickRandomPlayerName(team1) + ')',
                        'description': 'But it\'s a bad result now! What a brilliant individual goal! Outstanding!<br>PSG substitute ' + this.pickRandomPlayerName(team1) + ' - a £37m man - takes a throw-in on the dead-ball line. He spins away from Cesar Azpilicueta, evades Frank Lampard with a Chris Waddle-style bodyswerve, does John Terry for pace and then fires in low past Petr Cech at his near post.'
                    },
                    2: {
                        'time': 85,
                        'action': 'Injury time',
                        'title': '',
                        'description': 'Four minutes added on in Paris. Not a bad result for Chelsea, I reckon. A 1-0 win at home and Jose\'s your uncle.'
                    },
                    3: {
                        'time': 85,
                        'action': 'Great save',
                        'title': '',
                        'description': 'Another Real free-kick, another flying save from Roman Weidenfeller! ' + this.pickRandomPlayerName(team2) + ' has his eyes on the prize this time, unleashing a dipper that forces the Dortmund keeper into a fine save again.'
                    },
                    4: {
                        'time': 85,
                        'action': 'Yellow card',
                        'title': '',
                        'description': this.pickRandomPlayerName(team2) + ' hacks down Santi Cazorla. Yellow card and an Arsenal free-kick 40 yards from goal...'
                    }
                };

                this.templateData.moments = moments;

                this.render();
            }

        },

        pickRandomPlayerName: function (obj) {
            var keys = Object.keys(obj);
            var player = obj[keys[keys.length * Math.random() << 0]];
            return player.name;
        },

        userValidForMatch: function (player) {
            var playerVal = this.validateUser(player);
            if (playerVal.status == 'success') {
                playerVal = this.validateTeamSelection(player);
                if (playerVal.status == 'success') {
                    return true;
                }
            }
            console.log(playerVal);
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

        validateTeamSelection: function (player) {
            var res = {
                status: 'fail',
                message: ''
            };
            if (player.get('teamSelection')) {
                var selection = player.get('teamSelection').split(',');

                // TODO: Should be 11, for testing allow less than 11
                if (selection.length <= 11) {
                    selection.map(function (playerUID) {
                        var playerModel = App.playerCollection.findWhere({
                            'uid': parseInt(playerUID)
                        });
                        if (player.get('startingUser') == 1) {
                            App.player1TeamCollection.add(playerModel);
                        } else {
                            App.player2TeamCollection.add(playerModel);
                        }
                    });

                    res.status = 'success';
                } else {
                    res.message = 'ID ' + player.get('guardianID') + ': not enough players!';
                }
            } else {
                res.message = 'ID ' + player.get('guardianID') + ': Has no team selection!';
            }
            return res;
        },

        render: function () {

            this.$el.html(this.template(this.templateData));
            this.$el.find('.pitch').each(function (index, i) {
                $(this).find('.pitch_player.position-cb:eq(1), .pitch_player.position-mc:eq(1), .pitch_player.position-st:eq(1)').addClass('second');
            });

            return this;
        }

    });
});