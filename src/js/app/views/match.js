define([
    'app',
    'underscore',
    'backbone',
    'views/match-stats',
    'views/match-lineup',
    'views/match-record',
    'text!templates/match.html',
    'text!templates/squad-pitch.html'
], function (
    App,
    _,
    Backbone,
    MatchLineupView,
    MatchStatsView,
    MatchRecordView,
    MatchTemplate,
    PitchTemplate
) {
    return Backbone.View.extend({
        id: 'match-screen',
        
        className: 'container clearfix',
        
        template: _.template(MatchTemplate),

        events: {
            'click .playAgain': 'playMatch'
        },

        playMatch: function () {
            App.appRoutes.navigate('#user/' + App.userDetails.get('guardianID'), {
                trigger: true
            });
        },

        initialize: function() {
            App.notify.showMsg({msg: 'Fetching match result'});
            this.model.on('sync', this.render, this);
            this.model.fetch({
                success: function() {
                    App.notify.closePrompt();
                }.bind(this),
                error: function(attributes, err) {
                var msg = "Problem fetching match.";
                    if (err && err.responseJSON && err.responseJSON.msg) {
                        msg = err.responseJSON.msg;
                    }

                Backbone.trigger('ERROR', { msg: msg, err: err });
            }.bind(this)});
        },

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
            App.player1TeamCollection.populateUsingIDs(
                this.model.get('1').squad);
            App.player2TeamCollection.populateUsingIDs(
                this.model.get('2').squad);
            
            var user1Pitch = new MatchLineupView({
                collection: App.player1TeamCollection
            });
            this.$('#user1-pitch .pitch-container').empty();

            var pitchTemplate = _.template(PitchTemplate);
            this.$('#user1-pitch .pitch-container').append(pitchTemplate({
                squadCount: null,
                players: App.player1TeamCollection.toJSON()
            }));
            this.$('#user1-pitch .pitch-container').append(user1Pitch.render().$el);
            
            var user2Pitch = new MatchLineupView({
                collection: App.player2TeamCollection
            });
            this.$('#user2-pitch .pitch-container').empty();

            this.$('#user2-pitch .pitch-container').append(pitchTemplate({
                squadCount: null,
                players: App.player2TeamCollection.toJSON()
            }));
            this.$('#user2-pitch .pitch-container').append(user2Pitch.render().$el);
            
            
            /**
             * TODO: Team stats will not be present in prod
             
            var user1Pitch = new MatchLineupView({
                    collection: App.player1TeamCollection
                });
            var user1Stats = new MatchStatsView({
                    collection: App.player1TeamCollection
                });
            var user2Pitch = new MatchLineupView({
                    collection: App.player2TeamCollection
                });
            var user2Stats = new MatchStatsView({
                    collection: App.player2TeamCollection
                });

            this.$el.find('#user1-pitch').empty();
            this.$el.find('#user2-pitch').empty();

            this.$el.find('#user1-pitch').append(user1Stats.render().$el);
            this.$el.find('#user2-pitch').append(user2Stats.render().$el);

            this.$el.find('#user1-pitch').append(user1Pitch.render().$el);
            this.$el.find('#user2-pitch').append(user2Pitch.render().$el);
           
            return this;
            */
        },

        render: function () {
            if (this.model.has('time')) {
                var tplHTML = this.template({
                    matchDetails: this.model.toJSON()
                });
                this.$el.html(tplHTML);
                this.renderTeams(); 

            } else {
                this.$el.html('<p>Loading...</p>');
            }
            return this;
            /*
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
            */
        }

    });
});
