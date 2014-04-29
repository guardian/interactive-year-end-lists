define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'views/user-find',
    'views/match-lineup',
    'text!templates/user.html'
], function (
    App,
    $,
    Backbone,
    _,
    UserFindView,
    MatchLineupView,
    UserTemplate
) {
    return Backbone.View.extend({

        id: 'user-screen',
        className: 'container',
        template: _.template(UserTemplate),

        events: {
            'click #goEdit': 'editSelection',
            'click .playAgainst': 'playAgainst'
        },

        initialize: function () {
            this.listenTo(App.viewingPlayer, 'change', this.render);
            this.listenTo(App.viewingPlayerTeamCollection, 'change', this.render);
            this.templateData = {
                details: null
            };
        },

        addToRecentlyViewed: function () {
            var recentlyViewed = JSON.parse(this.getCookie('recentlyViewed'));
            if (!recentlyViewed) {
                recentlyViewed = [];
            }
            recentlyViewed.push(App.viewingPlayer.get('guardianID'));
            recentlyViewed = _.uniq(recentlyViewed);
            this.setCookie('recentlyViewed', JSON.stringify(recentlyViewed));
        },

        editSelection: function () {
            App.appRoutes.navigate('/', {
                trigger: true
            });
        },

        playAgainst: function (e) {
            var guardianIDOpponent = $(e.target).data('guardian-id');
            App.appRoutes.navigate('/match/' + App.userDetails.get('guardianID') + '/' + guardianIDOpponent, {
                trigger: true
            });
        },

        render: function () {

            this.templateData = {
                details: App.viewingPlayer.toJSON(),
                currentUser: App.userDetails.toJSON()
            };
            this.$el.html(this.template(this.templateData));

            var playerArr = [],
                userPitch,
                userFind;

            if (App.viewingPlayer.get('teamSelection')) {
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
                userPitch = new MatchLineupView({
                    collection: App.viewingPlayerTeamCollection
                });
                this.$el.find('#users-team').html(userPitch.render().$el);
            }

            if (App.userDetails.get('guardianID') === App.viewingPlayer.get('guardianID')) {
                userFind = new UserFindView();
                this.$el.find('#users-find').html(userFind.render().$el);
            }
            return this;
        },

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
        },
    });
});