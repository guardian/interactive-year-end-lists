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

        fetchByGuardianId: function (_options) {
            var options = _options || {};
            options.data = {
                guardianID: this.get('guardianID')
            };
            return this.fetch(options);
        },

        checkUserStatus: function () {
            require(["common/modules/identity/api"], function (api) {
                var loggedIn = api.getUserFromCookie();
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
            });
        },

        loginUser: function () {
            require(["common/modules/identity/api"], function (api) {
                var loggedIn = api.getUserOrSignIn('http://test.theguardian.com:9000/ngw.html');
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
            });
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
        }

    });
});