define([
    'app',
    'backbone'
],
function(
    App,
    Backbone
){
    return Backbone.Router.extend({
        routes: {
            'user/:username':              'showUser',    // dreamteam#user/andrew
            'match/:player1id/:player2id':  'showMatch',   // dreamteam#match/andrew/daan
            '*other':                      'defaultRoute' // dreamteam#
        },

        showMatch: function(player1id, player2id) {

            App.player1.set({guardianID: player1id}).fetchByGuardianId();
            App.player1.set('startingUser', 1);

            App.player2.set({guardianID: player2id}).fetchByGuardianId();
            App.player2.set('startingUser', 2);

            App.$el.empty();
            App.$el.html(App.matchView.render().$el);
        },

        showUser: function(username) {
            App.$el.empty();
            App.$el.html(App.userView.render().$el);
        },

        showMyTeam: function(username) {
            App.$el.empty();
            App.$el.html(App.teamView.render().$el);
        },

        defaultRoute: function(other){
            this.showMyTeam();
        }
    });
});
