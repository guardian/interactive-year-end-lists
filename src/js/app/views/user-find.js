define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'models/social',
    'text!templates/user-find.html',
    'jquery.cookie'
], function (
    App,
    $,
    Backbone,
    _,
    SocialModel,
    UserFindTemplate
) {
    return Backbone.View.extend({

        id: 'users-find-inner',
        template: _.template(UserFindTemplate),

        events: {
            'click .viewTeam': 'navigateToUser',
            'click .viewResult': 'navigateToResult',
            'click .view-match-history': 'loadUserResult'
        },

        initialize: function () {
            this.templateData = {
                users: null,
                recentUsers: [],
                specialUsers: App.specialUsers 
            };

            this.getRecentlyViewed();

            App.resultsModel.on('change', this.render, this);
        },

        loadUserResult: function(e) {
            $(e.currentTarget).hide();
            App.resultsModel.fetch(); 
        },

        navigateToUser: function (e) {
            var guardianIDOpponent = $(e.target).data('guardian-id');
            App.appRoutes.navigate('/user/' + guardianIDOpponent, {
                trigger: true
            });
        },

        outputResults: function() {
            
        },

        // Render of recently viewed users on user page
        getRecentlyViewed: function () {
            var recentlyViewed;
            var cookieVal = $.cookie('dreamteam');

            if (!cookieVal) {
                return;
            }

            try {
                var users = cookieVal.split(',');
                recentlyViewed = users.map(function(user) {
                    return {
                        un: user.split('|')[0],
                        id: user.split('|')[1]
                    };
                });
            } catch(err) {
                console.error('Error parsing cookie value', err);
                return;
            }

            if (recentlyViewed) {
                var filteredList = _.reject(recentlyViewed, function(userObj) {
                    return userObj.id === App.userDetails.get('guardianID');
                });
                
                this.templateData.recentUsers = filteredList;
            }
        },

        render: function () {
            var socialLinks = SocialModel.getShareTeamURLs({
                url: document.location.href
            });
            this.templateData.specialUsers = App.specialUsers;
            this.templateData.latestMatches = App.resultsModel.get('latestResults');
            this.templateData.squadCount = App.userDetails.getSquadCount();
            this.templateData.twitter_link = socialLinks.twitter;
            this.templateData.facebook_link = socialLinks.facebook;
            this.templateData.email_link = socialLinks.email;
            this.$el.html(this.template(this.templateData));
            return this;
        }
    });
});
