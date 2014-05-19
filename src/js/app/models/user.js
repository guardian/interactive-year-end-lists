define([
    'app',
    'backbone',
    'underscore',
    'jquery',
    'jquery.cookie'
], function (
    App,
    Backbone,
    _,
    $
) {
    return Backbone.Model.extend({
        urlRoot: App.getEndpoint() + 'users',
        
        idAttribute: '_id',
        
        defaults: {
            guardianID: null,
            username: null,
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
            this.identityDetails = null; 
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

        hasFullSquad: function() {
            return this.getSquadCount() === 11;
        },

        getSquad: function() {
            var usersSquad = [];
            for (var i=0; i < 11; i++) {
                usersSquad.push(this.get('player'+i));
            }
            return usersSquad;
        },

        clearSquad: function() {
            var players = {};
            for (var i=0; i < 11; i++) {
                players['player' + i] =  null;
            }
            this.save(players);
        },

        getGUCookie: function() {
            return $.cookie('GU_U');
        },

        setToolKitObject: function () {
            if (typeof require() === 'function') {
                require(['guardian_idToolkit'], function (toolkit) {
                    App.toolkitObj = {
                        api: toolkit,
                        version: 1
                    };
                    Backbone.trigger('toolkitReady');
                }, function(err) {
                    Backbone.trigger('ERROR', {
                        msg:'Error loading identity toolkit.',
                        err: err
                    });      

                    Backbone.trigger('toolkitReady');
                });
            } else {
                require(['common/modules/identity/api']).then(function (toolkit) {
                    App.toolkitObj = {
                        api: toolkit,
                        version: 2
                    };
                    Backbone.trigger('toolkitReady');
                }, function(err) {
                    Backbone.trigger('ERROR', {
                        msg:'Error loading identity toolkit.',
                        err: err
                    });      

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
            this.getIdentityDetails();
            if (this.identityDetails) {
                App.userDetails.set('guardianID', this.identityDetails.id);
                App.userDetails.fetchByGuardianId({
                    success: this.handleUserDataResponse.bind(this),
                    error: function (err) {
                        console.error('fetchByGuardianId failed: ', err);
                    }
                });
            }
            Backbone.trigger('loaded:userData');
        },

        handleUserDataResponse: function(user) {
            // Use stored user data or save new user data from identity
            if (user.get('username')) {
                App.userDetails.set(user.toJSON());
            } else {
                var username = null;
                if (App.toolkitObj && App.toolkitObj.version === 1) {
                    username = this.identityDetails.publicFields.displayName;
                } else {
                    username = this.identityDetails.displayName;
                }
                App.userDetails.set('username', username);
            }

            Backbone.trigger('loaded:userData');
        },

        loginUser: function () {
            if (App.toolkitObj && App.toolkitObj.version === 1) {
                App.toolkitObj.api.showLoginIfNotLoggedIn();
            } else {
                App.toolkitObj.api.getUserOrSignIn(App.publicURL);
            }
        },

        fetchUserTeamFromStorage: function () {
            App.usersTeamCollection.reset(this.getPlayerModels());
        },

        getPlayerModels: function() {
            var playerModels = [];
            _.each(this.getSquad(), function(playerID) {
                var playerModel = App.playerCollection.findWhere({
                    'uid': playerID
                });
                playerModels.push(playerModel);
            });
            
            return playerModels;
        },

        isLoggedIn: function() {
            return this.get('username') !== null;
        },

        getIdentityDetails: function () {
            if (App.useDebugUser) {
                this.identityDetails = {
                    id: '04',
                    displayName: 'DebugUser',
                    publicFields: {
                        displayName: 'DebugUser'
                    }
                };
                return this.identityDetails;
            }

            if (App.toolkitObj.version === 1) {
                // R2
                if (App.toolkitObj.api.isLoggedIn()) {
                    this.identityDetails = App.toolkitObj.api.localUserData();
                }
            } else {
                // Next-gen
                if (App.toolkitObj.api.isUserLoggedIn()) {
                    this.identityDetails = App.toolkitObj.api.getUserFromCookie();
                }
            }
            return this.identityDetails;
        }

    });
});
