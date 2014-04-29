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

        initialize : function (options) {
            this.options = options || {};
            this.templateData = {
                record: null
            };
        },

        render: function () {

            if (this.options.userID) {
                var _this = this;
                $.ajax({
                    url: 'http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/matches?userID=' + this.options.userID
                }).done(function (data) {
                    var record = {
                        gamesPlayed: data.length,
                        gamesWon: 0,
                        gamesLost: 0,
                        gamesDrawn: 0,
                        goalsFor: 0,
                        goalsAgainst: 0,
                        goalsDiff: 0
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
                        record.goalsFor += userTeam.goals.length;
                        record.goalsAgainst += opponent.goals.length;

                        if (userTeam.goals.length > opponent.goals.length) {
                            record.gamesWon += 1;
                        } else if (userTeam.goals.length < opponent.goals.length) {
                            record.gamesLost += 1;
                        } else {
                            record.gamesDrawn += 1;
                        }
                    });
                    record.goalsDiff = record.goalsFor - record.goalsAgainst;

                    _this.templateData = {
                        record: record
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