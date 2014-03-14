define([
    'app',
    'underscore',
    'backbone',
    'views/player-list',
    'views/team-overview',
    'text!templates/team-screen.html'
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

        render: function() {
            this.$el.empty();

            this.teamOverview = new TeamOverview();
            this.playerListView = new PlayerListView({
                collection: this.collection
            });

            this.$el.html(this.template( App.player.toJSON() ));
            this.$el.append(this.playerListView.render().$el);
            this.$el.append(this.teamOverview.render().$el);

            return this;
        }

    });
});
