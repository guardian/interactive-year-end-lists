define([
    'app',
    'backbone',
    'underscore',
    'text!templates/header.html'
], function (
    App,
    Backbone,
    _,
    HeaderTemplate
) {
    return Backbone.View.extend({
        className: 'dreamteam-header',
        
        template: _.template(HeaderTemplate),

        events: {
           'click .goHome': 'navigateHome',
           'click .goPlay': 'playMatch'
        },

        initialize: function () {
            App.userDetails.on('change', this.render, this);
            Backbone.on('pageStateChange', this.updateOnPageState, this);
        },

        navigateHome: function () {
            App.appRoutes.navigate('/', {
                trigger: true
            });
        },
        
        playMatch: function () {
           
            App.appRoutes.navigate('#user/' + App.userDetails.get('guardianID'), {
                trigger: true
            });
        },

        updateOnPageState: function(pageState) {
            console.log('Page state = ', pageState);
        },

        render: function () {
            var templateHTML = this.template({
                message: 'TESTING',
                squadCount: App.userDetails.getSquadCount(),
                username: App.userDetails.get('username'),
                userID: App.userDetails.get('guardianID')
            });

            this.$el.html(templateHTML);
            return this;
        }
    });
});

