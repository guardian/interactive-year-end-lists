define([
    'app',
    'underscore',
    'backbone',
    'views/player-list',
    'views/team-overview',
    'text!templates/match-screen.html'
], function(
    App,
    _,
    Backbone,
    PlayerListView,
    TeamOverview,
    TeamScreenTemplate
) {
    return Backbone.View.extend({

        template: _.template(TeamScreenTemplate),

        initialize: function(options) {
        },

        render: function() {
            this.$el.html(this.template({
                username: App.player.get('username'),
                opponent: App.opponent.get('username')
            }));
            return this;
        }

    });
});
