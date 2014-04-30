define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'text!templates/user-find.html'
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
            var _thisView = this,
                recentUsersArr = [],
                recentlyViewed = JSON.parse(this.getCookie('recentlyViewed'));

            if (recentlyViewed) {
                recentlyViewed = _.uniq(recentlyViewed);
                recentlyViewed.forEach(function (guardianID) {
                    $.ajax({
                        url: 'http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/users',
                        data: {
                            guardianID: guardianID
                        }
                    }).done(function (data) {
                        recentUsersArr.push(data);
                    });
                });
                _thisView.templateData.recentUsers = recentUsersArr;
                _thisView.render();
            }
        },

        getAllUsers: function () {
            var _thisView = this;
            $.ajax({
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
                _thisView.templateData.users = userArr;
                _thisView.render();
            });
        },

        render: function () {
            this.$el.empty();
            this.$el.append(this.template(this.templateData));
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
        }

    });
});