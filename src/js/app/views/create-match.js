define([
    'app',
    'underscore',
    'backbone'
], function (
    App,
    _,
    Backbone
) {
    return Backbone.View.extend({

        initialize: function (options) {
            this.res = {
                status: 'fail',
                message: ''
            };
        },

        createMatchAndNavigate: function () {
            var readyForMatch = this.isReady();
            if (readyForMatch) {
                var _this = this,
                    matchUsers = {
                        user1: App.player1.get('guardianID'),
                        user2: App.player2.get('guardianID')
                    };
                App.matchModel.save(matchUsers, {
                    success: function () {
                        var url = ['match', matchUsers.user1, matchUsers.user2, App.matchModel.get('_id')];
                        App.appRoutes.navigate(url.join('/'), {
                            trigger: true,
                            replace: true
                        });
                    }
                }, {
                    wait: true
                });
            }
        },

        isReady: function () {
            if (this.userValidForMatch(App.player1) && this.userValidForMatch(App.player2)) {
                return true;
            }
            return false;
        },

        userValidForMatch: function (player) {
            this.res = this.validateUser(player);
            if (this.res.status === 'success') {
                this.res = this.validateTeamSelection(player);
                if (this.res.status === 'success') {
                    return true;
                }
            }
            return false;
        },

        validateUser: function (player) {
            if (player.get('username')) {
                this.res.status = 'success';
            } else {
                this.res.message = 'ID ' + player.get('guardianID') + ': data not in Mongo!';
            }
            return this.res;
        },

        validateTeamSelection: function (user) {
            var playerArr = [];
            if (user.get('teamSelection')) {
                if (user.get('teamSelection').split(',').length === 11) {
                    this.res.status = 'success';
                } else {
                    this.res.message = 'ID ' + user.get('guardianID') + ': not enough players!';
                }
            } else {
                this.res.message = 'ID ' + user.get('guardianID') + ': Has no team selection!';
            }
            return this.res;
        }

    });
});