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
            this.listenTo(App.playerSelected, 'change:highlighted', this.handlePlayerSelect);
            this.templateData = { selectedPlayer: { name: 'bob' }, players: [] };
        },

        closeEditor: function() {
            App.playerSelected.set('highlighted', 0);
        },

        handlePlayerSelect: function(model) {
            var selectedPlayer = App.playerSelected.get('highlighted');

            if (selectedPlayer) {
                this.templateData = {
                    players: App.usersTeamCollection.toJSON(),
                    selectedPlayer: App.playerSelected.toJSON()
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
