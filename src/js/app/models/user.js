define([
    'app',
    'backbone'
], function(
    App,
    Backbone
) {
    return Backbone.Model.extend({

        idAttribute : "guardianID",
        urlRoot: "http://localhost:3000/users",
        defaults: {
            guardianID: null,
            username: null,
            teamSelection: null
        },

        populateDB: function() {
            App.userDetails.set({
                guardianID: 8888,
                username: 'bluedaniel',
                teamSelection: null
            });
            App.userDetails.save();
        },

        checkUserStatus: function() {

            if(App.environment == 'development') {
                
                App.userDetails.set({guardianID: 8888});
                App.userDetails.fetch({
                    success: function (user) {
                        App.userDetails.set(user.toJSON());
                    }
                });
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
                App.userDetails.set({teamSelection: this.parseTeamIntoArray()});
                App.userDetails.save();
            } else {
                
            }
        },

        fetchUserTeamFromStorage: function() {

            if(App.userDetails.get('teamSelection')) {

                App.userDetails.get('teamSelection').split(',').map(function(playerUID) {
                    var playerModel = App.playerCollection.findWhere({'uid': parseInt(playerUID)});
                    App.usersTeamCollection.addPlayerToCollection(playerModel);
                });

                App.visualPrompt.set({
                    'message': null
                });
            }
            return;
        },

        parseTeamIntoArray: function() {
            var team = [];
            App.usersTeamCollection.each(function(player) {
                team.push(player.get('uid'));
            });
            return team.join(',');
        }

    });
});
