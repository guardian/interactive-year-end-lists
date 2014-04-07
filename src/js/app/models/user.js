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

            if(App.environment == 'development') {
                App.userDetails.set('username', 'bluedaniel');
            } else {
                require(["common/modules/identity/api"], function(api) { 
                    require(["common/modules/identity/api"], function(api) { 
                        var loggedIn = api.getUserFromCookie();
                        if(loggedIn) {
                            App.userDetails.set('username', loggedIn.id);
                            this.fetchUserTeamFromStorage();
                            return true;
                        } else {
                            return false;
                        }
                    });
                });
            }
        },

        loginUser: function() {
            if(App.environment == 'development') {
                App.userDetails.set('username', 'bluedaniel');
            } else {
                require(["common/modules/identity/api"], function(api) { 
                    var loggedIn = api.getUserOrSignIn();
                    if(loggedIn) {
                        App.userDetails.set('username', loggedIn.id);
                    }
                });
            }
        },

        saveUserTeamToStorage: function() {
            if(App.environment == 'development') {
            
            } else {
                
            }
        },

        fetchUserTeamFromStorage: function() {
            if(App.environment == 'development') {
                App.userDetails.set('teamSelection', [1, 2, 3, 4, 5]);
            } else {
                
            }

            if(App.userDetails.get('teamSelection')) {

                var selection = App.userDetails.get('teamSelection');
                selection.map(function(playerUID) {
                    var playerModel = App.playerCollection.findWhere({'uid':playerUID});
                    App.usersTeamCollection.addPlayerToCollection(playerModel);
                });

                App.visualPrompt.set({
                    'message': null
                });
            }
            return;
        }

    });
});
