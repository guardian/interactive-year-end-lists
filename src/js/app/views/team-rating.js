define([
    'app',
    'backbone',
    'underscore',
    'text!templates/team-rating.html'
], function(
    App,
    Backbone,
    _,
    TeamRatingTemplate
) {
    return Backbone.View.extend({
        
        id: 'team-rating',
        className: 'col-xs-12 col-sm-4',
        template: _.template(TeamRatingTemplate),

        events: {
            'click #clearSelection': 'clearSelection'
        },

        initialize: function() {
            this.listenTo(App.usersTeamCollection, 'add remove reset', this.render);
        },

        generatePitch: function() {
            var stats = {
                goals: 0,
                apps: 0
            };
            App.usersTeamCollection.each(function(player) {
                stats.goals = stats.goals + player.get('gls');
                stats.apps = stats.apps + player.get('apps');
            });

            return this.template({
                players: App.usersTeamCollection.toJSON(),
                stats: stats,
                userDetails: App.userDetails.toJSON()
            });
        },

        clearSelection: function() {
            App.usersTeamCollection.reset();
            return false;
        },

        render: function() {
            this.$el.html(this.generatePitch());
            this.$el.find('.pitch_player.position-cb:eq(1), .pitch_player.position-mc:eq(1), .pitch_player.position-st:eq(1)').addClass('second');
            return this;
        }

    });
});
