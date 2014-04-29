define([
    'app',
    'underscore',
    'backbone',
    'views/match-stats',
    'views/match-lineup',
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

        render: function () {

            var matchDetails = App.matchModel.toJSON();

            this.placeTeamsIntoCollection(matchDetails[1].teamSelection, 1);
            this.placeTeamsIntoCollection(matchDetails[2].teamSelection, 2);

            this.templateData = {
                matchDetails: matchDetails
            };

            this.$el.empty();
            this.$el.html(this.template(this.templateData));

            this.renderTeams();

            return this;
        },

        placeTeamsIntoCollection: function (teamSelection, startingUser) {
            var playerArr = [];
            teamSelection.split(',').map(function (player) {
                var playerSplit = player.split(':'),
                    playerModel = App.playerCollection.findWhere({
                        'uid': playerSplit[0]
                    });
                playerModel.set('wantedPosition', playerSplit[1]);
                if (playerModel) {
                    playerArr.push(playerModel);
                }
            });
            if (startingUser === 1) {
                App.player1TeamCollection.reset(playerArr);
            } else {
                App.player2TeamCollection.reset(playerArr);
            }
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
            this.$el.find('#user1-pitch').empty();
            this.$el.find('#user1-pitch').append(user1Stats.render().$el);

            this.$el.find('#user2-pitch').empty();
            this.$el.find('#user2-pitch').append(user2Stats.render().$el);

            this.$el.find('#user1-pitch').append(user1Pitch.render().$el);
            this.$el.find('#user2-pitch').append(user2Pitch.render().$el);

            return this;
        }

    });
});