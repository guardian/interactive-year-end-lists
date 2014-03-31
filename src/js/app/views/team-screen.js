define([
    'app',
    'underscore',
    'backbone',
    'views/squad-selection',
    'views/team-overview',
    'views/position-editor',
    'text!templates/team-screen.html'
], function(
    App,
    _,
    Backbone,
    PlayerListView,
    TeamOverview,
    PositionEditorView,
    TeamScreenTemplate
) {
    return Backbone.View.extend({

        template: _.template(TeamScreenTemplate),

        className: 'container',

        render: function() {
            this.$el.empty();

            this.teamOverview = new TeamOverview();
            this.positionEditorView = new PositionEditorView();
            this.playerListView = new PlayerListView({
                collection: this.collection
            });

            this.$el.html(this.template( App.player.toJSON() ));
            this.$el.append(this.playerListView.render().$el);
            this.$el.append(this.teamOverview.render().$el);
            this.$el.append(this.positionEditorView.render().$el);

            return this;
        }

    });
});
