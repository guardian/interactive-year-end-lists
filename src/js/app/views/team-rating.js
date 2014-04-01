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
        className: 'col-sm-4',
        template: _.template(TeamRatingTemplate),

        initialize: function() {
            this.listenTo(App.usersTeamCollection, 'add remove', this.render);
        },

        generatePitch: function() {
            
            return this.template({
                players: App.usersTeamCollection.toJSON(),
                skillPercentage: 33,
                creativityPercentage: 89,
                unforgettablyPercentage: 33
            });
        },

        render: function() {
            this.$el.html(this.generatePitch());
            return this;
        }

    });
});
