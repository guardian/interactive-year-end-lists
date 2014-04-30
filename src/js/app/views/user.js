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
            if (!App.viewingPlayer.get('teamSelection')) {

                // No team, no pitch
                return;
            }
            var playerArr = [];
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
            App.viewingPlayerTeamCollection.reset(playerArr);
            var userPitch = new MatchLineupView({
                collection: App.viewingPlayerTeamCollection
            });
            this.$el.find('#users-team').empty();
            this.$el.find('#users-team').append(userPitch.render().$el);
        },

        // view/user-record.js
        renderGameHistory: function () {
            var userRecord = new UserRecordView({
                userID: App.viewingPlayer.get('guardianID')
            });
            this.$el.find('#usersRecord').empty();
            this.$el.find('#usersRecord').append(userRecord.render().$el);
        },

        // view/user-find.js
        renderFindUsers: function () {
            var userFind = new UserFindView();
            this.$el.find('#users-find').empty();
            this.$el.find('#users-find').append(userFind.render().$el);
        },

        render: function () {
            this.templateData = {
                details: App.viewingPlayer.toJSON(),
                currentUser: App.userDetails.toJSON()
            };

            this.$el.empty();
            this.$el.append(this.template(this.templateData));

            // Render extra parts of the user page, eg pitch, record etc.
            this.renderPitch();
            this.renderGameHistory();

            // If user viewing own page, show Guardian writers & recently viewed
            if (App.userDetails.get('guardianID') === App.viewingPlayer.get('guardianID')) {
                this.renderFindUsers();
            } else {

                // Add to recently viewed if not (regardless of logged in status)
                this.addToRecentlyViewed();
            }
            return this;
        },


        /**
         *
         * Code below is from Mozilla to get and set Cookies
         * for the recently viewed users array.
         *
         * TODO: would be cleaner split into a separate plugin
         *
         * https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
         *
         */

        getCookie: function (sKey) {
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },

        setCookie: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        }

    });
});
