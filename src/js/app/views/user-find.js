define([
    'app',
    'backbone',
    'underscore',
    'text!templates/user-find.html'
], function (
    App,
    Backbone,
    _,
    UserFindTemplate
) {
    return Backbone.View.extend({

        id: 'users-find-inner',
        template: _.template(UserFindTemplate),

        events: {
            'click #playAgainst': 'playAgainst'
        },

        initialize: function () {
            this.templateData = {users: null};
            this.getAllUsers();
        },

        playAgainst: function (e) {
            App.appRoutes.navigate('/match/' + App.userDetails.get('guardianID') + '/' + $(e.target).data('guardian-id'), { trigger: true });
        },

        getAllUsers: function () {
            var _thisView = this;
            $.ajax({
                url: "http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/allusers"
            }).done(function (data) {
                var userArr = [];
                $.each(data, function (k, v) {
                    if (v.teamSelection.split(',').length === 11 && App.userDetails.get('guardianID') !== v.guardianID) {
                        userArr.push(v);
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