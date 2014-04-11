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

        events: {

        },

        initialize: function () {

        },

        render: function () {

            if (!this.collection) {
                return;
            }

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

            $.each(stats, function(key, value) {
                usersPlayers.forEach(function (player) {
                    if(player[key]) {
                        value = parseInt(value, 10) + parseInt(player[key], 10);
                    }
                });
                stats[key] = value;
            });

            this.$el.html(this.template({
                stats: stats
            }));

            return this;
        }

    });
});