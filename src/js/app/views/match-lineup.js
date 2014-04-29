define([
    'app',
    'backbone',
    'underscore',
    'text!templates/match-lineup.html'
], function (
    App,
    Backbone,
    _,
    MatchPitchTemplate
) {
    return Backbone.View.extend({

        className: 'match-pitch-container',
        template: _.template(MatchPitchTemplate),

        events: {

        },

        initialize: function () {

        },

        render: function () {

            if (!this.collection) {
                return;
            }

            var playerPositions = {
                'ST': {},
                'ST2': {},
                'MR': {},
                'MC': {},
                'MC2': {},
                'ML': {},
                'RB': {},
                'CB': {},
                'CB2': {},
                'LB': {},
                'GK': {}
            },
                usersPlayers = this.collection.toJSON();

            usersPlayers.forEach(function (player) {
                playerPositions[player.wantedPosition] = player;
            });

            this.$el.empty();
            this.$el.append(this.template({
                players: playerPositions
            }));

            return this;
        }

    });
});