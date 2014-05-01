define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'text!templates/user-record.html'
], function (
    App,
    $,
    Backbone,
    _,
    UserRecordTemplate
) {
    return Backbone.View.extend({

        id: 'game-history',
        template: _.template(UserRecordTemplate),

        initialize: function (options) {
            this.options = options || {};
            this.templateData = {
                record: null
            };
        },

        // 1 => 1, 1.454 => 1.45, 0 => 0
        formatToDecimal: function (num) {
            return Math.round(num * 100) / 100;
        },

        render: function () {
            if (this.options.userID) {
                var _this = this;
                $.ajax({

                    // FIXME: Use config for url
                    url: 'http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/matches',
                    data: {
                        userID: this.options.userID
                    }
                }).done(function (data) {
                    var recArr = {
                        gamesPlayed: data.length,
                        gamesWon: 0,
                        gamesLost: 0,
                        gamesDrawn: 0,
                        goalsFor: 0,
                        goalsAgainst: 0,
                        goalsDiff: 0,
                        goalsAverage: 0,
                        yellowTotal: 0,
                        yellowAverage: 0,
                        redTotal: 0,
                        redAverage: 0,
                        topScorers: [],
                        goalScorers: []
                    };

                    // Calculate game history, goals, scorers etc
                    data.forEach(function (v, k) {
                        var userTeam,
                            opponent;
                        if (v[1].guardianID === _this.options.userID) {
                            userTeam = v[1];
                            opponent = v[2];
                        } else {
                            userTeam = v[2];
                            opponent = v[1];
                        }
                        recArr.goalsFor += userTeam.goals.length;
                        recArr.goalsAgainst += opponent.goals.length;

                        recArr.yellowTotal += userTeam.yellowCard.length;
                        recArr.redTotal += userTeam.redCard.length;

                        if (userTeam.goals.length) {
                            userTeam.goals.forEach(function (v, k) {
                                recArr.goalScorers.push(v.name);
                            });
                        }

                        if (userTeam.goals.length > opponent.goals.length) {
                            recArr.gamesWon += 1;
                        } else if (userTeam.goals.length < opponent.goals.length) {
                            recArr.gamesLost += 1;
                        } else {
                            recArr.gamesDrawn += 1;
                        }
                    });
                    recArr.goalsDiff = recArr.goalsFor - recArr.goalsAgainst;
                    recArr.goalsAverage = _this.formatToDecimal(recArr.goalsFor / recArr.gamesPlayed);
                    recArr.yellowAverage = _this.formatToDecimal(recArr.yellowTotal / recArr.gamesPlayed);
                    recArr.redAverage = _this.formatToDecimal(recArr.redTotal / recArr.gamesPlayed);

                    // Build array of all scorers and sort on totals
                    var scorers = {},
                        topScorers = [];
                    for (var i = 0, j = recArr.goalScorers.length; i < j; i++) {
                        scorers[recArr.goalScorers[i]] = (scorers[recArr.goalScorers[i]] || 0) + 1;
                    }
                    for (var key in scorers) {
                        if (scorers.hasOwnProperty(key)) {
                            topScorers.push({
                                name: key,
                                goals: scorers[key]
                            });
                        }
                    }
                    topScorers.sort(function (a, b) {
                        return b.goals - a.goals;
                    });
                    recArr.topScorers = topScorers.slice(0, 7);

                    _this.templateData = {
                        record: recArr
                    };
                    _this.$el.empty();
                    _this.$el.append(_this.template(_this.templateData));
                    return _this;
                });
            }
            return this;
        }

    });
});