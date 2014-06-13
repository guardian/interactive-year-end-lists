'use strict';

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
            'user/:username':              'showUser',
            'match/:username/:oppontent':  'showMatch',
            '*other':                      'defaultRoute'
        },

        showMatch: function(username, oppontent) {
            App.player.set('username', username);
            App.opponent.set('username', oppontent);

            App.$el.empty();
            App.$el.html(App.matchView.render().$el);
        },

        showUser: function(username) {
            App.player.set('username', username);
            App.$el.empty();
            App.$el.html(App.teamView.render().$el);
        },

        defaultRoute: function(){
            this.showUser();
        }
    });
});
