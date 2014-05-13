define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'views/user-find',
    'views/user-record',
    'views/match-lineup',
    'models/match',
    'text!templates/user.html',
    'text!templates/squad-list.html',
    'jquery.cookie'
], function (
    App,
    $,
    Backbone,
    _,
    UserFindView,
    UserRecordView,
    MatchLineupView,
    MatchModel,
    UserTemplate,
    SquadTemplate
) {
    return Backbone.View.extend({

        id: 'user-screen',
        className: 'container',
        template: _.template(UserTemplate),
        squadTemplate: _.template(SquadTemplate),

        events: {
            'click #goEdit': 'navigateHome',
            'click .playAgainst': 'createMatch'
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

        createMatch: function() {
            console.log(App.userDetails.toJSON());
            var newMatch = new MatchModel({
                user1: App.userDetails.get('_id'),
                user2: App.viewingPlayer.get('_id')
            });

            newMatch.save({}, {
                success: function(matchModel) {
                    console.log('saved', matchModel.get('_id'));
                    App.appRoutes.navigate('/result/' + matchModel.get('_id'), 
                                            {trigger: true});
                }
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
            userPitch.setElement(this.$('#users-team')).render();
        },

        // view/user-find.js
        renderFindUsers: function () {
            var userFind = new UserFindView();
            userFind.setElement(this.$('#users-find')).render();
            //this.$('#users-find').empty();
            //this.$('#users-find').append(userFind.render().$el);
        },
        renderPlayerCards: function(){
            App.viewingPlayerTeamCollection.each(function (value, key){
                var playerCard = this.squadTemplate(value.attributes);
                var player_card = document.createElement("div");
                player_card.className = "col-xs-6 col-sm-4 col-lg-3 player_profile";
                player_card.innerHTML = playerCard;
                console.log(player_card);
                this.$('#squad-list').append(player_card);
            }, this);
        },

        render: function () {
            console.log('bob');
            this.templateData = {
                details: App.viewingPlayer.toJSON(),
                currentUser: App.userDetails.toJSON()
            };

            console.log('bob');
            this.$el.append(this.template(this.templateData));
            this.renderPitch();
            this.renderPlayerCards();
            
            console.log('bob');
            var userRecord = new UserRecordView({
                userID: App.viewingPlayer.get('guardianID')
            });
            this.$('#usersRecord').html(userRecord.render().el);
            console.log('bob');
 
            // If user viewing own page, show Guardian writers & recently viewed
            if (App.userDetails.get('guardianID') === App.viewingPlayer.get('guardianID')) {
                this.renderFindUsers();
            } else {
                // Add to recently viewed if not (regardless of logged in status)
                //this.addToRecentlyViewed();
            }
            console.log('bob');
            return this;
        },
    });
});
