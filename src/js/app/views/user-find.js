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
            'click .playAgainst': 'playAgainst'
        },

        initialize: function () {
            this.templateData = {
                users: null,
                recentUsers: null
            };
            this.getAllUsers();
            this.getRecentlyViewed();
        },

        playAgainst: function (e) {
            var guardianIDOpponent = $(e.target).data('guardian-id');
            App.appRoutes.navigate('/match/' + App.userDetails.get('guardianID') + '/' + guardianIDOpponent, { trigger: true });
        },

        getRecentlyViewed: function () {
            var _thisView = this;
            var recentUsersArr = [];

            var recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed'));
            if (recentlyViewed) {
                recentlyViewed = _.uniq(recentlyViewed);
                recentlyViewed.forEach(function (guardianID) {
                    $.ajax({
                        url: "http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/users?guardianID=" + guardianID
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
                url: "http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/allusers"
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
            this.$el.html(this.template(this.templateData));
            return this;
        }

    });
});