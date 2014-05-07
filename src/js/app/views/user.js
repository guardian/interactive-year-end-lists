define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'views/user-find',
    'views/user-record',
    'views/match-lineup',
    'text!templates/user.html',
    'jquery.cookie'
], function (
    App,
    $,
    Backbone,
    _,
    UserFindView,
    UserRecordView,
    MatchLineupView,
    UserTemplate
) {
    return Backbone.View.extend({

        id: 'user-screen',
        className: 'container',
        template: _.template(UserTemplate),

        events: {
            'click #goEdit': 'navigateHome',
            'click .playAgainst': 'navigateCreateMatch'
        },

        initialize: function () {
            this.templateData = {
                details: null,
                currentUser: null
            };
        },

        navigateHome: function () {
            App.appRoutes.navigate('/', {
                trigger: true
            });
        },

        navigateCreateMatch: function (e) {
            var opponentID = $(e.target).data('guardian-id');
            App.appRoutes.navigate('/match/' + App.userDetails.get('guardianID') + '/' + opponentID, {
                trigger: true
            });
        },

        // Adds the user to a cookie to display in a recently viewed list
        addToRecentlyViewed: function () {
            var COOKIE_NAME = 'dreamteam_recent';
            var uID = App.userDetails.get('guardianID');
            var vID = App.viewingPlayer.get('guardianID');
            var cookieVal = $.cookie(COOKIE_NAME);

            var recentlyViewed = [];
            if (cookieVal) {
                recentlyViewed = JSON.parse($.cookie(COOKIE_NAME));
            }

            if (_.findWhere(recentlyViewed, {id: uID})  ||
                _.findWhere(recentlyViewed, {id: vID}) ||
                uID === vID) {
                return;
            }
            
            recentlyViewed.unshift({
                un: App.viewingPlayer.get('username'),
                id: vID
            });

            // Set cookie
            $.cookie(
                'dreamteam_recent',
                JSON.stringify(recentlyViewed),
                { expires: 7 }
            );
        },

        renderPitch: function () {
            var playerArr = App.viewingPlayer.getPlayerModels();
            /*
            App.viewingPlayer.get('teamSelection').split(',').map(function (player) {
                var playerSplit = player.split(':'),
                    playerModel = App.playerCollection.findWhere({
                        'uid': playerSplit[0]
                    });
                playerModel.set('wantedPosition', playerSplit[1]);
                if (playerModel) {
                    playerArr.push(playerModel);
                }
            });
            */
            App.viewingPlayerTeamCollection.reset(playerArr);
            var userPitch = new MatchLineupView({
                collection: App.viewingPlayerTeamCollection
            });
            console.log(playerArr);
            userPitch.setElement(this.$('#users-team')).render();
        },

        // view/user-find.js
        renderFindUsers: function () {
            var userFind = new UserFindView();
            userFind.setElement(this.$('#users-find')).render();
            //this.$('#users-find').empty();
            //this.$('#users-find').append(userFind.render().$el);
        },

        render: function () {
            console.log('render user');
            this.templateData = {
                details: App.viewingPlayer.toJSON(),
                currentUser: App.userDetails.toJSON()
            };

            console.log('render user1');
            this.$el.append(this.template(this.templateData));
            this.renderPitch();
            
            console.log('render user2');
            var userRecord = new UserRecordView({
                userID: App.viewingPlayer.get('guardianID')
            });
            this.$('#usersRecord').html(userRecord.render().el);
 

            
            console.log('render user3');
            // If user viewing own page, show Guardian writers & recently viewed
            if (App.userDetails.get('guardianID') === App.viewingPlayer.get('guardianID')) {
                this.renderFindUsers();
            } else {
                // Add to recently viewed if not (regardless of logged in status)
                //this.addToRecentlyViewed();
            }
            return this;
        },
    });
});
