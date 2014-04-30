define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'text!templates/match-record.html'
], function (
    App,
    $,
    Backbone,
    _,
    MatchRecordTemplate
) {
    return Backbone.View.extend({

        id: 'match-history',
        template: _.template(MatchRecordTemplate),

        initialize: function (options) {
            this.options = options || {};
            this.templateData = {
                record: null
            };
        },

        render: function () {
            if (this.options.userID && this.options.opponentID) {
                var _this = this;
                $.ajax({
                    url: 'http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/matches',
                    data: {
                        userID: this.options.userID,
                        opponentID: this.options.opponentID
                    },
                }).done(function (data) {
                    var recArr = {
                        gamesPlayed: data.length,
                        gamesWon: 0,
                        gamesLost: 0,
                        gamesDrawn: 0
                    };

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

                        if (userTeam.goals.length > opponent.goals.length) {
                            recArr.gamesWon += 1;
                        } else if (userTeam.goals.length < opponent.goals.length) {
                            recArr.gamesLost += 1;
                        } else {
                            recArr.gamesDrawn += 1;
                        }
                    });

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