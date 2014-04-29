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

        showUser: function (playerid) {
            App.viewingPlayer.clear();
            App.viewingPlayer.set({guardianID: playerid}).fetchByGuardianId({
                success: (function () {

                    App.$el.empty();
                    App.$el.append(App.userView.render().$el);
                    App.userView.addToRecentlyViewed();
                }),
                error: (function (e) {
                    console.log('No user found!');
                })
            });
        },

        createMatch: function (player1id, player2id) {
            App.matchModel.clear();
            App.player1.clear();
            App.player2.clear();
            App.player1.set({guardianID: player1id}).fetchByGuardianId();
            App.player1.set('startingUser', 1);
            App.player2.set({guardianID: player2id}).fetchByGuardianId();
            App.player2.set('startingUser', 2);
            App.createMatch.createMatchAndNavigate();
        },

        showMatch: function (player1id, player2id, matchID) {
            App.matchModel.set({_id: matchID}, {silent: true}).fetch({
                success: (function () {
                    App.$el.empty();
                    App.$el.append(App.matchView.render().$el);
                }),
                error: (function (e) {
                    console.log('No match found!');
                })
            });
        },

        showSquad: function (username) {
            App.$el.empty();
            App.$el.append(App.squadView.render().$el);
        },

        defaultRoute: function (other) {
            this.showSquad();
        }

    });
});
