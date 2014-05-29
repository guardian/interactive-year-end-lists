define([
    'app',
    'backbone',
    'models/match',
    'models/results'
], function (
    App,
    Backbone,
    MatchModel,
    ResultsModel
) {
    return Backbone.Router.extend({

        routes: {
            'user/:userid(/)': 'showUser',
            'result/:matchid(/)': 'showMatch',
            '/': 'defaultRoute',
            '*other': 'defaultRoute'
        },

        defaultRoute: function (other) {
            Backbone.trigger('pageStateChange', 'editPage');
        },

        showUser: function (playerid) {
            App.notify.showMsg({ msg: 'Fetching user'});
            App.viewingPlayer.clear({ silent: true });
            App.viewingPlayer.set(App.viewingPlayer.defaults, {});
            App.viewingPlayer.set({ guardianID: playerid });
            App.viewingPlayer.fetchByGuardianId({
                success: this.handleUserData,
                error: function (err) {
                    this.showErrorAndRedirect('No user found!');
                }.bind(this)
            });
        },

        handleUserData: function(data) {
            if (!data.get('username')) {
                this.showErrorAndRedirect('No user found!');
                return;
            }
            App.resultsModel = new ResultsModel();
            App.resultsModel.set('guardianID', App.viewingPlayer.get('guardianID'));
            App.resultsModel.fetch();
            App.notify.closePrompt();
            Backbone.trigger('pageStateChange', 'userPage');
        },
        
        showMatch: function (matchID) {
            App.matchModel = new MatchModel({_id: matchID});
            Backbone.trigger('pageStateChange', 'resultPage');
        },

        showErrorAndRedirect: function (msg) {
            App.appRoutes.navigate('/', {
                trigger: true
            });
            App.notify.showMsg(msg);
        }

    });
});

