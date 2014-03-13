define([
    'backbone',
    'views/player-list',
    'text!templates/team-screen.html'
], function(
    Backbone,
    PlayerListView,
    teamScreenTemplate
) {
    return Backbone.View.extend({

        initialize: function() {
            this.collection.on('change', function() {
                console.log(arguments);
            });
        },

        render: function() {
            this.$el.empty();
            this.playerListView = new PlayerListView({ collection: this.collection });
            this.$el.append(this.playerListView.render().el);
            return this;
        }

    });
});
