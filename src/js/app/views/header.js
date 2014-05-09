define([
    'app',
    'backbone',
    'text!templates/header.html'
], function (
    App,
    Backbone,
    HeaderTemplate
) {
    return Backbone.View.extend({
        className: 'dreamteam-header',
        
        template: _.template(HeaderTemplate),

        events: {
           'click .goHome': 'navigateHome',
           'click .goPlay': 'playMatch'
        },
        navigateHome: function () {
            App.appRoutes.navigate('/', {
                trigger: true
            });
        },
        playMatch: function () {
           
            App.appRoutes.navigate('#match/000000000', {
                trigger: true
            });
        },
        render: function () {

            // console.log(App.userDetails);

            var templateHTML = this.template({
                message: 'TESTING',
                usersPlayers: App.usersTeamCollection.toJSON(),
                username: App.userDetails.get('username'),
                userID: App.userDetails.get('guardianID')
            });


            this.$el.html(templateHTML);
            App.$el.prepend(this.el);
            return this;
        }
    });
});

