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

            // DEV


            // BUILD
            
            require(["common/modules/identity/api"], function(api) { 
                var loggedIn = api.getUserFromCookie();
                if(loggedIn) {
                    App.userDetails.set('username', loggedIn.id);
                    return true;
                } else {
                    return false;
                }
            });
            
        },

        loginUser: function() {
            //App.userDetails.set('username', 'boohoo');
            
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

            App.userDetails.set('teamSelection', [1, 2, 3, 4, 5]);
            
            App.visualPrompt.set({
                'message': '*Loading gif* Loading your team',
                'closePrompt' : null
            });

            if(App.userDetails.get('teamSelection')) {
                setTimeout(function(){

                    App.userDetails.set('teamName', '50 Shades of OShea');
                    
                    var selection = App.userDetails.get('teamSelection');
                    selection.map(function(playerUID) {
                        var playerModel = App.playerCollection.findWhere({'uid':playerUID});
                        App.usersTeamCollection.addPlayerToCollection(playerModel);
                    });
                    App.userDetails.set('teamSelection', [1, 2, 3, 4, 5]);

                    App.visualPrompt.set({
                        'message': null
                    });
                    
                    return;

                }, 5000);
            }

            return;

        }

    });
});
