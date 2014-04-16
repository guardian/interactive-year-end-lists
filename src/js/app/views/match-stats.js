define([
    'app',
    'backbone',
    'underscore',
    'text!templates/match-stats.html'
], function (
    App,
    Backbone,
    _,
    MatchStatsTemplate
) {
    return Backbone.View.extend({

        className: 'match-stats-container',
        template: _.template(MatchStatsTemplate),

        initialize: function () {

        },

        getTeamStats: function () {

            var usersPlayers = this.collection.toJSON(),
                stats = {
                    attack: 0,
                    defense: 0,
                    discipline: 0,
                    creativity: 0,
                    unpredictability: 0,
                    volatility: 0,
                    starquality: 0
                };
// TODO: perhaps change to underscore or include jquery
            _.each(stats, function(key, value) {
                usersPlayers.forEach(function (player) {
                    if(player[key]) {
                        value = parseInt(value, 10) + parseInt(player[key], 10);
                    }
                });
                stats[key] = value;
            });

            return stats;

        },

        render: function () {

            if (!this.collection) {
                return;
            }

            this.$el.html(this.template({
                stats: this.getTeamStats()
            }));

            return this;
        }

    });
});