define([
    'app',
    'backbone'
], function (
    App,
    Backbone
) {
    return Backbone.Model.extend({
        urlRoot: App.getEndpoint() + 'users',
        
        idAttribute: '_id',
        
        defaults: {
            guardianID: null,
            username: null,
            teamSelection: null,
            player0: null,
            player1: null,
            player2: null,
            player3: null,
            player4: null,
            player5: null,
            player6: null,
            player7: null,
            player8: null,
            player9: null,
            player10: null
        },

        initialize: function() {
            this.on('sync', this.fetchUserTeamFromStorage, this);
        },

        validate: function(attributes, options) {
            var playerIDs = _.filter(this.getSquad(), function(id) {
                return id !== null;
            });

            if (playerIDs.length !== _.uniq(playerIDs).length) {
                return 'Duplicate player IDs detected';
            }
        },

        isPlayerInSquad: function(playerID) {
            return _.find(this.getSquad(), function(id) {
                return id === playerID;
            });
        },

        getSquadCount: function() {
            return _.reject(this.getSquad(), function(player) {
                return player === null;
            }).length;

        },

        getSquad: function() {
            var usersSquad = [];
            for (var i=0; i < 11; i++) {
                usersSquad.push(this.get('player'+i));
            }
            return usersSquad;
        },

        setToolKitObject: function () {
            if (typeof require() === 'function') {
                require(['guardian_idToolkit'], function (toolkit) {
                    App.toolkitObj = {
                        api: toolkit,
                        version: 1
                    };
                    Backbone.trigger('toolkitReady');
                });
            } else {
                require(['common/modules/identity/api']).then(function (toolkit) {
                    App.toolkitObj = {
                        api: toolkit,
                        version: 2
                    };
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

            if (App.useDebugUser) {
                loggedIn = {
                    id: '111111111',
                    displayName: 'DebugUser',
                    publicFields: {
                        displayName: 'DebugUser'
                    }
                };
            }
            if (loggedIn) {
                App.userDetails.set('guardianID', loggedIn.id);
                App.userDetails.fetchByGuardianId({
                    success: function (user) {
                        if (!user.username) {
                            var username = null;
                            if (App.toolkitObj.version === 1) {
                                username = loggedIn.publicFields.displayName;
                            } else {
                                username = loggedIn.displayName;
                            }
                            App.userDetails.set('username', username);
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
            /*
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
            }
            */
                       
            App.usersTeamCollection.reset(this.getPlayerModels());
        },

        getPlayerModels: function() {
            var playerModels = [];
            console.log('fetching/building users'); 
            _.each(this.getSquad(), function(playerID) {
                var playerModel = App.playerCollection.findWhere({
                    'uid': playerID
                });
                playerModels.push(playerModel);
            });
            return playerModels;
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
