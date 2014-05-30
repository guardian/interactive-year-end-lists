define([
    'app',
    'backbone',
    'jquery',
    'underscore',
    'text!templates/header.html'
], function (
    App,
    Backbone,
    $,
    _,
    HeaderTemplate
) {
    return Backbone.View.extend({
        className: 'dreamteam-header clearfix',
        
        template: _.template(HeaderTemplate),

        events: {
           'click .backToEdit': 'navigateHome',
           'click .dreamteamLogo': 'navigateHome',
           'click .backToTeam': 'playMatch',
           'click .goPlay': 'playMatch'
        },

        initialize: function () {
            App.userDetails.on('playersChange change:username', this.render, this);
            Backbone.on('pageStateChange', this.updateOnPageState, this);
        },

        navigateHome: function () {
            App.appRoutes.navigate('home', { trigger: true });
        },
        
        playMatch: function () {
            App.appRoutes.navigate('#user/' + App.userDetails.get('guardianID'), {
                trigger: true
            });
        },


        updateOnPageState: function() {
            if(App.pageState == "editPage"){
                $('.editPageNav').removeClass('invisible');
                $('.yourPageNav').addClass('invisible');
                $('.userPageNav').addClass('invisible');
            } else if(App.pageState == "userPage"){
                    if(App.viewingPlayer.get('guardianID') === App.userDetails.get('guardianID')){
                        $('.editPageNav').addClass('invisible');
                        $('.yourPageNav').removeClass('invisible');
                        $('.userPageNav').addClass('invisible');
                    }else{
                        $('.editPageNav').addClass('invisible');
                        $('.yourPageNav').addClass('invisible');
                        $('.userPageNav').removeClass('invisible');
                    }
            } else if(App.pageState == "resultPage"){
                $('.editPageNav').addClass('invisible');
                $('.yourPageNav').addClass('invisible');
                $('.userPageNav').removeClass('invisible');
            }
            
        },

        render: function () {
            var templateHTML = this.template({
                squadCount: App.userDetails.getSquadCount(),
                username: App.userDetails.get('username'),
                userID: App.userDetails.get('guardianID')
            });

            this.$el.html(templateHTML);

            this.$('.editPageNav').addClass('invisible');
            this.$('.yourPageNav').addClass('invisible');
            this.$('.userPageNav').addClass('invisible');

            this.updateOnPageState();
           
            return this;
        }
    });
});

