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

        /**
         * This is a simpler version mimicking 'user-record.js'
         *
         * Simply shows stats for user1 vs user2
         */
        render: function () {
            if (this.options.userID && this.options.opponentID) {
                var _this = this;
                $.ajax({
                    // FIXME: Use config for url
                    url: App.getEndpoint() + 'results/' + this.options.userID
                }).done(function (data) {
                    var recArr = {
                        gamesPlayed: data.matchCount,
                        gamesWon: 0,
                        gamesLost: 0,
                        gamesDrawn: 0
                    };
                    
                    /*
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
                    */
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
