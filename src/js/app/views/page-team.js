define([
    'backbone',
    'views/player',
    'models/player',
    'text!templates/team_screen.html'
], function(
    Backbone,
    PlayerView,
    PlayerModel,
    teamScreenTemplate
) {
    return Backbone.View.extend({

        initialize: function() {
            var testPlayernModel = new PlayerModel({
                'name': 'Andrew',
                'country': 'UK',
                'position': 'Goalkeeper',
                'imageSrc': 'pic.jpg'
            });
            this.player = new PlayerView({model: testPlayernModel });
        },

        render: function() {
            this.$el.html(teamScreenTemplate);
            this.$el.append(this.player.render().el);
            return this;
        }

    });
});
