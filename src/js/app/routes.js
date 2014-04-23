define([
    'app',
    'backbone'
], function (
    App,
    Backbone
) {
    return Backbone.Router.extend({

        routes: {
            'match/:player1id': 'showUser',
            'match/:player1id/:player2id': 'createMatch',
            'match/:player1id/:player2id/:matchID': 'showMatch',
            '*other': 'defaultRoute'
        },

        showUser: function (playerid) {
            App.$el.empty();
            App.viewingPlayer.clear();
            App.viewingPlayer.set({guardianID: playerid}).fetchByGuardianId();
            App.$el.html(App.userView.render().$el);
        },

        createMatch: function (player1id, player2id) {
            App.$el.empty();
            App.player1.clear();
            App.player2.clear();
            App.player1.set({guardianID: player1id}).fetchByGuardianId();
            App.player1.set('startingUser', 1);
            App.player2.set({guardianID: player2id}).fetchByGuardianId();
            App.player2.set('startingUser', 2);
            App.$el.html(App.matchView.render().$el);
        },

        showMatch: function (player1id, player2id, matchID) {
            App.$el.empty();
            App.matchModel.clear();
            App.player1.clear();
            App.player2.clear();
            App.player1.set({guardianID: player1id}).fetchByGuardianId();
            App.player1.set('startingUser', 1);
            App.player2.set({guardianID: player2id}).fetchByGuardianId();
            App.player2.set('startingUser', 2);
            App.$el.html(App.matchView.render().$el);
        },

        showSquad: function (username) {
            App.$el.empty();
            App.$el.html(App.squadView.render().$el);
        },

        defaultRoute: function (other) {
            this.showSquad();
        }

    });
});
