define([
    'app',
    'backbone'
], function(
    App,
    Backbone
) {
    return Backbone.Model.extend({

        urlRoot: "http://localhost:3000/users",

        idAttribute: '_id',

        defaults: {
            guardianID: null,
            username: 'Anon',
            teamSelection: ''
        },

        fetchByGuardianId: function(_options) {
            var options = _options || {};
            options.data = { guardianID: this.get('guardianID') };
            return this.fetch(options);
        },

        checkUserStatus: function() {

            if(App.inDevMode()) {

                App.userDetails.set({'guardianID': '002'});
                App.userDetails.fetchByGuardianId({
                    success: function (user) {
                        if(!user.username) {
                            // Create new user, dont bother fetching team.
                            // user.username from Cookie
                            //App.userDetails.set('username', 'hamlet');
                            //App.userDetails.save();
                        } else {

                            // this.fetchUserTeamFromStorage
                        }
                        App.userDetails.set(user.toJSON());
                        Backbone.trigger('loaded:userData');

                    },
                    error: function(err) {
                        console.error('fetchByGuardianId failed: ', err);
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
            if(App.inDevMode()) {

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
            if(App.inDevMode()) {
                App.userDetails.set({teamSelection: this.parseTeamIntoArray()});
                App.userDetails.save();
            } else {

            }
        },

        fetchUserTeamFromStorage: function() {

            if(App.userDetails.get('teamSelection')) {
                var playerArr = [];
                App.userDetails.get('teamSelection').split(',').map(function(playerUID) {
                    var playerModel = App.playerCollection.findWhere({'uid': playerUID});
                    if (playerModel) {
                        playerArr.push(playerModel);
                    }
                });
                App.usersTeamCollection.reset(playerArr);

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
