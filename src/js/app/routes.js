define([
    'backbone'
],
function(
    Backbone
){
    return Backbone.Router.extend({
        routes: {
            'about':                    'showAbout',   // dreamteam#about
            'match/:player1/:player2':  'showMatch',   // dreamteam#match/andrew/daan
            'user/:username':           'showUser',    // dreamteam#user/andrew
            '*other':                   'defaultRoute' // dreamteam#
        },

        showAbout: function() {
            console.log('in about section');
        },

        showMatch: function(player1, player2) {
            console.log(player1, player2);
        },

        showUser: function(username) {
            console.log(username);
        },

        defaultRoute: function(other){
            console.log('Invalid. You attempted to reach:' + other);
        }
    });
});
