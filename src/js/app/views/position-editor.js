define([
    'app',
    'underscore',
    'backbone',
    'text!templates/position-editor.html'
], function(
    App,
    _,
    Backbone,
    PositionEditorTemplate
) {
    return Backbone.View.extend({

        template: _.template(PositionEditorTemplate),

        events: {
            'click #close_position': 'closeEditor'
        },

        initialize: function() {
            this.$el.hide();
            this.listenTo(App.player, 'change:selectedPlayer', this.handlePlayerSelect);
            this.templateData = { selectedPlayer: { name: 'bob' }, players: [] };
        },

        closeEditor: function() {
            App.player.set('selectedPlayer', null);
        },

        handlePlayerSelect: function(model) {
            var selectedPlayer = App.player.get('selectedPlayer');

            if (selectedPlayer) {
                this.templateData = {
                    players: App.usersTeamCollection.toJSON(),
                    selectedPlayer: App.player.get('selectedPlayer').toJSON()
                };

                this.render();
            }

            this.$el.toggle(!!selectedPlayer);
        },

        render: function() {
            this.$el.html(this.template( this.templateData ));
            return this;
        }

    });
});
