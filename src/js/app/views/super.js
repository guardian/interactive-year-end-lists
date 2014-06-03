define([
    'app',
    'backbone',
    'underscore',
    'views/user',
    'views/squad',
    'views/match',
    'views/header',
    'views/notification',
    'text!templates/super.html',
    'text!templates/comingSoon.html'
], function (
    App,
    Backbone,
    _,
    UserView,
    SquadView,
    MatchView,
    HeaderView,
    NotificationView,
    Template,
    ComingSoonTemplate
) {
    return Backbone.View.extend({
        className: 'dream-team-interactive',
               
        events: {},

        initialize: function () {
            Backbone.on('pageStateChange', this.updateView, this);
            App.notify = new NotificationView();
            this.headerView = new HeaderView();

            // FIXME: Temp coming soon view.
            this.ComingSoonView = Backbone.View.extend({
                render: function() {
                    this.$el.html(ComingSoonTemplate);
                    return this;
                }
            });

        },

        updateView: function(pageState) {
            switch (pageState) {
                case 'comingSoon':
                    this.subView = new this.ComingSoonView();
                    break;
                case 'userPage':
                    this.subView = new UserView({ model: App.viewingPlayer });
                    break;
                case 'resultPage':
                    this.subView = new MatchView({ model: App.matchModel });
                    break;
                default:
                    App.userDetails.fetchUserTeamFromStorage();
                    this.subView = new SquadView({
                        collection: App.usersTeamCollection
                    });
                    break;
            }
            
            this.subViewContainer.html(this.subView.render().el);
        },

        render: function () {
            this.$el.html(Template);
            this.notificationContainer = this.$('.dreamteam_notification');
            this.headerContainer = this.$('.dreamteam_header');
            this.subViewContainer = this.$('.subview_container');

            this.headerContainer.append(this.headerView.render().el);
            this.notificationContainer.append(App.notify.render().el);

            return this;
        }
    });
});

