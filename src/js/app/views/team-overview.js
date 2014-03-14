define([
    'app',
    'backbone',
], function(
    App,
    Backbone
) {
    return Backbone.View.extend({
        id: 'team-view',

        initialize: function() {
            this.listenTo(App.usersTeamCollection, 'add remove', this.render);
        },

        generatePitch: function() {
            var el = document.createDocumentFragment();
            App.usersTeamCollection.each(function(model) {
                var player = document.createElement('p');
                player.innerHTML = model.get('name');
                el.appendChild(player);
            });
            return el;
        },

        render: function() {
            this.$el.html(this.generatePitch());
            return this;
        }

    });
});
