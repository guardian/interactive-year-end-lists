define([
    'app',
    'backbone',
    'underscore',
    'text!templates/team-rating.html'
], function(
    App,
    Backbone,
    _,
    TeamOverviewTemplate
) {
    return Backbone.View.extend({
        id: 'team-view',

        template: _.template(TeamOverviewTemplate),

        initialize: function() {
            this.listenTo(App.usersTeamCollection, 'add remove', this.render);
        },

        generatePitch: function() {
            // var el = document.createDocumentFragment();
            // App.usersTeamCollection.each(function(model) {
            //     var player = document.createElement('p');
            //     player.innerHTML = model.get('name');
            //     el.appendChild(player);
            // });
            // return el;
            //

            // STUB: Calculate team stats

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
