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
            'click .viewTeam': 'viewTeam'
        },

        initialize: function () {
            this.templateData = {
                users: null,
                recentUsers: null
            };
            this.getAllUsers();
            this.getRecentlyViewed();
        },

        viewTeam: function (e) {
            var guardianIDOpponent = $(e.target).data('guardian-id');
            App.appRoutes.navigate('/match/' + guardianIDOpponent, {
                trigger: true
            });
        },

        getCookie: function (sKey) {
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },

        getRecentlyViewed: function () {
            var _thisView = this;
            var recentUsersArr = [];

            var recentlyViewed = JSON.parse(this.getCookie('recentlyViewed'));
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
        }

    });
});