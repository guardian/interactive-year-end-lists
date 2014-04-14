define([
    'app',
    'backbone'
], function (
    App,
    Backbone
) {
    return Backbone.Router.extend({

        routes: {
            'match':                        'showMatch',   // dreamteam#match/andrew/daan
            'match/:player1id':             'showMatch',   // dreamteam#match/andrew/daan
            'match/:player1id/:player2id':  'showMatch',   // dreamteam#match/andrew/daan
            '*other':                       'defaultRoute' // dreamteam#
        },

        showMatch: function (player1id, player2id) {

            App.$el.empty();

            if (!player1id && !player2id) {

                App.$el.html(App.findView.render().$el);

            } else if (!player2id) {

                // No player 2 so render single user page
                App.viewingPlayer.clear();
                App.viewingPlayer.set({guardianID: player1id}).fetchByGuardianId();
                App.$el.html(App.userView.render().$el);

            } else {

                App.player1.clear();
                App.player2.clear();

                App.player1.set({guardianID: player1id}).fetchByGuardianId();
                App.player1.set('startingUser', 1);
                App.player2.set({guardianID: player2id}).fetchByGuardianId();
                App.player2.set('startingUser', 2);

                App.$el.html(App.matchView.render().$el);

            }
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
