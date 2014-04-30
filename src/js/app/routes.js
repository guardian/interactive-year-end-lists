define([
    'app',
    'backbone'
], function (
    App,
    Backbone
) {
    return Backbone.Router.extend({

        routes: {
            'match/:player1id(/)': 'showUser',
            'match/:player1id/:player2id(/)': 'createMatch',
            'match/:player1id/:player2id/:matchID(/)': 'showMatch',
            '*other': 'defaultRoute'
        },

        defaultRoute: function (other) {
            App.$el.empty();
            App.$el.append(App.squadView.render().$el);
        },

        showUser: function (playerid) {

            App.viewingPlayer.clear(this.silently);
            App.viewingPlayer.set({
                guardianID: playerid
            }).fetchByGuardianId({
                success: function () {
                    App.$el.empty();
                    App.$el.append(App.userView.render().$el);
                },
                error: function (e) {
                    console.log('No user found!');
                }
            });
        },

        createMatch: function (player1id, player2id) {

            // Clear all models
            App.matchModel.clear(this.silently);
            App.player1.clear(this.silently);
            App.player2.clear(this.silently);

            // Load player 1
            App.player1.set({
                guardianID: player1id
            }).fetchByGuardianId({
                success: function () {
                    App.player1.set('startingUser', 1, this.silently);

                    // Load player 2
                    App.player2.set({
                        guardianID: player2id
                    }).fetchByGuardianId({
                        success: function () {
                            App.player2.set('startingUser', 2, this.silently);

                            // Create match and navigate
                            App.createMatch.createMatchAndNavigate();
                        },
                        error: function (e) {
                            console.log('User 2 not found!');
                        }
                    });
                },
                error: function (e) {
                    console.log('User 1 not found!');
                }
            });
        },

        showMatch: function (player1id, player2id, matchID) {
            App.matchModel.set({
                _id: matchID
            }, this.silently).fetch({
                success: function () {
                    App.$el.empty();
                    App.$el.append(App.matchView.render().$el);
                },
                error: function (e) {
                    console.log('No match found!');
                }
            });
        },

        /**
         *
         * Silly but keeps the code inline, eg:
         *
         * .clear({
         *      silent: true
         * });
         *
         * Using function: .clear(this.silently);
         *
         */
        silently: function () {
            return {
                silent: true
            };
        }

    });
});