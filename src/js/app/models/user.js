define([
    'app',
    'backbone'
], function(
    App,
    Backbone
) {
    return Backbone.Model.extend({

        idAttribute : "_id",
        urlRoot: "http://localhost:3000/users",
        defaults: {
            _id: null,
            username: null,
            teamSelection: null
        },

        checkUserStatus: function() {

            if(App.environment == 'development') {

                App.userDetails.fetch(123);

                var attrs = {
                    _id: '1236',
                    username: 'bluedanielsss',
                    //teamSelection: [1, 2, 3, 4, 5]
                };

                //App.userDetails.set();
                App.userDetails.save(attrs);

                console.log(App.userDetails);

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
                var ar = this.parseTeamIntoArray();
                console.log(ar);
            } else {
                
            }
        },

        fetchUserTeamFromStorage: function() {

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
        },

        parseTeamIntoArray: function() {
            var team = [];
            App.usersTeamCollection.each(function(player) {
                team.push(player.get('uid'));
            });
            return team;
        }

    });
});
