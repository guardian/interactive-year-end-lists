define([
    'backbone',
    'views/player-list',
    'views/team-overview',
    'text!templates/team-screen.html'
], function(
    Backbone,
    PlayerListView,
    TeamOverview,
    teamScreenTemplate
) {
    return Backbone.View.extend({

        initialize: function(options) {
            this.collection.on('change', function() {
                console.log(arguments);
            });

            this.usersTeamCollection = options.usersTeamCollection;

            this.playerListView = new PlayerListView({
                collection: this.collection,
                usersTeamCollection: this.usersTeamCollection
            });

            this.teamOverview = new TeamOverview();
        },

        render: function() {
            //this.$el.empty();


            this.$el.append(this.playerListView.render().$el);
            this.$el.append(this.teamOverview.render().$el);

            return this;
        }

    });
});
