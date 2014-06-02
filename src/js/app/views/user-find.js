define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'text!templates/user-find.html',
    'jquery.cookie'
], function (
    App,
    $,
    Backbone,
    _,
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
                recentUsers: null,
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
            var cookieVal = $.cookie('dreamteam_recent');

            if (!cookieVal) {
                return;
            }

            try {
                recentlyViewed = JSON.parse(cookieVal);
            } catch(err) {
                console.error('Error parsing cookie value', err);
            }

            if (recentlyViewed) {
                this.templateData.recentUsers = recentlyViewed;
            }
        },

        render: function () {
            this.templateData.specialUsers = App.specialUsers;
            this.templateData.latestMatches = App.resultsModel.get('latestResults');
            console.log(App.resultsModel);
            this.$el.html(this.template(this.templateData));
            return this;
        }
    });
});
