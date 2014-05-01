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
            'click .viewTeam': 'navigateToUser'
        },

        initialize: function () {
            this.templateData = {
                users: null,
                recentUsers: null
            };
            this.getAllUsers();
            this.getRecentlyViewed();
        },

        navigateToUser: function (e) {
            var guardianIDOpponent = $(e.target).data('guardian-id');
            App.appRoutes.navigate('/match/' + guardianIDOpponent, {
                trigger: true
            });
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

        // FIXME: Replace with hardcoded list.
        getAllUsers: function () {
            var _thisView = this;
            $.ajax({
                // FIXME: Use config for url
                url: 'http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/allusers'
            }).done(function (data) {
                var userArr = [];
                $.each(data, function (k, v) {
                    if (v.teamSelection) {
                        if (v.teamSelection.split(',').length === 11 && App.userDetails.get('guardianID') !== v.guardianID) {
                            userArr.push(v);
                        }
                    }
                });
                this.templateData.users = userArr;
                this.$el.append(this.template(this.templateData));
            }.bind(this));
        },

        render: function () {
            return this;
        }
    });
});
