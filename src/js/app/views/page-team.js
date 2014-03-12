define([
    'backbone',
    'views/player',
    'text!templates/team_screen.html'
], function(
    Backbone,
    PlayerView,
    teamScreenTemplate
) {
    return Backbone.View.extend({

        initialize: function() {
            this.player = new PlayerView();
        },

        render: function() {
            this.$el.html(teamScreenTemplate);
            console.log(this.player.render().el);
            this.$el.append(this.player.render().el);
            return this;
        }

    });
});
