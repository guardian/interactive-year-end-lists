define([
    'app',
    'backbone'
], function(
    App,
    Backbone
) {
    return Backbone.Model.extend({

        defaults: {
            username: null,
            teamName: null,
            teamSelection: null
        },

        checkUserStatus: function() {
            require(["common/modules/identity/api"], function(api) { 
                var loggedIn = api.getUserFromCookie();
                console.log(loggedIn);
                if(loggedIn) {
                    App.userDetails.set('username', loggedIn.id);
                    return true;
                } else {
                    return false;
                }
            });
        },

        loginUser: function() {
            require(["common/modules/identity/api"], function(api) { 
                var loggedIn = api.getUserOrSignIn();
                if(loggedIn) {
                    App.userDetails.set('username', loggedIn.id);
                }
            });
        },

        saveUserTeamToStorage: function() {

        },

        fetchUserTeamFromStorage: function() {

            App.userDetails.set('teamName', '50 Shades of OShea');
            App.userDetails.set('teamSelection', [1, 2, 3, 4, 5]);

            if(App.userDetails.get('teamSelection')) {
                var selection = App.userDetails.get('teamSelection');
                selection.map(function(playerUID) {
                    var playerModel = App.playerCollection.findWhere({'uid':playerUID});
                    App.usersTeamCollection.addPlayerToCollection(playerModel);
                });
                App.userDetails.set('teamSelection', [1, 2, 3, 4, 5]);
            }

            return;

        }

    });
});
