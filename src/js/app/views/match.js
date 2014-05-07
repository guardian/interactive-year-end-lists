define([
    'app',
    'underscore',
    'backbone',
    'views/match-stats',
    'views/match-lineup',
    'views/match-record',
    'text!templates/match.html'
], function (
    App,
    _,
    Backbone,
    MatchLineupView,
    MatchStatsView,
    MatchRecordView,
    MatchTemplate
) {
    return Backbone.View.extend({

        id: 'match-screen',
        className: 'container',
        template: _.template(MatchTemplate),

        // Populate the teamCollections for user
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

        // Renders 'match-record.js'
        renderMatchHistory: function (userID, opponentID) {
            var matchRecord = new MatchRecordView({
                userID: userID,
                opponentID: opponentID
            });
            this.$el.find('#matchRecord').empty();
            this.$el.find('#matchRecord').append(matchRecord.render().$el);
        },

        // Renders 'match-record.js'
        renderTeams: function () {

            /**
             * TODO: Team stats will not be present in prod
             */
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

            this.$el.find('#user1-pitch').empty();
            this.$el.find('#user2-pitch').empty();

            this.$el.find('#user1-pitch').append(user1Stats.render().$el);
            this.$el.find('#user2-pitch').append(user2Stats.render().$el);

            this.$el.find('#user1-pitch').append(user1Pitch.render().$el);
            this.$el.find('#user2-pitch').append(user2Pitch.render().$el);

            return this;
        },

        render: function () {
            console.log('render match');
            var matchDetails = App.matchModel.toJSON();
            
            this.placeTeamsIntoCollection(matchDetails[1].teamSelection, 1);
            this.placeTeamsIntoCollection(matchDetails[2].teamSelection, 2);

            this.templateData = {
                matchDetails: matchDetails
            };

            this.$el.empty();
            this.$el.html(this.template(this.templateData));

            this.renderTeams();
            this.renderMatchHistory(matchDetails[1].guardianID, matchDetails[2].guardianID);
            
            console.log(matchDetails);
            return this;
        }

    });
});
