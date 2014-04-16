define([
    'app',
    'backbone'
], function (
    App,
    Backbone
) {
    return Backbone.Model.extend({

        urlRoot: "http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/users",
        idAttribute: '_id',

        defaults: {
            guardianID: null,
            username: null,
            teamSelection: null
        },

        getCookie: function(name) {
            var value = '; ' + document.cookie;
            var parts = value.split('; ' + name + '=');
            if (parts.length == 2) {
                return parts.pop().split(';').shift();
            }
        },

        setToolKitObject: function () {
            if (typeof require() === 'function') {
                require(['guardian_idToolkit'], function (toolkit) {
                    App.toolkitObj = {api: toolkit, version: 1};
                    Backbone.trigger('toolkitReady');
                });
            } else {
                require([ 'common/modules/identity/api' ]).then(function (toolkit) {
                    App.toolkitObj = {api: toolkit, version: 2};
                    Backbone.trigger('toolkitReady');
                });
            }
        },

        fetchByGuardianId: function (_options) {
            var options = _options || {};
            options.data = {
                guardianID: this.get('guardianID')
            };
            return this.fetch(options);
        },

        checkUserStatus: function () {

            var loggedIn = this.isUserLoggedIn();
            if (loggedIn) {
                App.userDetails.set('guardianID', loggedIn.id);
                App.userDetails.fetchByGuardianId({
                    success: function (user) {
                        if (!user.username) {
                            App.userDetails.set('username', loggedIn.displayName);
                            App.userDetails.save();
                        } else {
                            App.userDetails.set(user.toJSON());
                        }
                        Backbone.trigger('loaded:userData');
                    },
                    error: function (err) {
                        console.error('fetchByGuardianId failed: ', err);
                    }
                });
            }
            Backbone.trigger('loaded:userData');
        },

        loginUser: function () {
            if (App.toolkitObj.version === 1) {
                App.toolkitObj.api.showLoginIfNotLoggedIn();
            } else {
                App.toolkitObj.api.getUserOrSignIn('www.gucode.gnl/sport/interactive/2014/apr/16/1');
            }
        },

        saveUserTeamToStorage: function () {
            App.userDetails.save({
                teamSelection: this.parseTeamIntoArray()
            }, {
                wait: true
            });
        },

        fetchUserTeamFromStorage: function () {
            if (App.userDetails.get('teamSelection')) {

                var playerArr = [];
                App.userDetails.get('teamSelection').split(',').map(function (player) {
                    var playerSplit = player.split(':'),
                        playerModel = App.playerCollection.findWhere({
                            'uid': playerSplit[0]
                        });
                    playerModel.set('wantedPosition', playerSplit[1]);
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

        parseTeamIntoArray: function () {
            var team = [];
            App.usersTeamCollection.each(function (player) {
                team.push(player.get('uid') + ':' + player.get('wantedPosition'));
            });
            return team.join(',');
        },

        isUserLoggedIn: function () {
            var isloggedIn = false;
            if (App.toolkitObj.version === 1) {

                // R2
                if (App.toolkitObj.api.isLoggedIn()) {
                    isloggedIn = App.toolkitObj.api.localUserData();
                }
            } else {

                // Next-gen
                if (App.toolkitObj.api.isUserLoggedIn()) {
                    isloggedIn = App.toolkitObj.api.getUserFromCookie();
                }
            }
            return isloggedIn;
        }

    });
});
