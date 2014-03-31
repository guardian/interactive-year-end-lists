define([
    'app',
    'underscore',
    'backbone',
    'views/squad-selection',
    'views/team-rating',
    'views/position-editor',
    'text!templates/team-screen.html'
], function(
    App,
    _,
    Backbone,
    SquadSelectionView,
    TeamRating,
    PositionEditorView,
    TeamScreenTemplate
) {
    return Backbone.View.extend({

        template: _.template(TeamScreenTemplate),

        className: 'container',

        render: function() {
            this.$el.empty();

            this.teamRating = new TeamRating();
            this.positionEditorView = new PositionEditorView();
            this.SquadSelectionView = new SquadSelectionView({
                collection: this.collection
            });

            this.$el.html(this.template( App.player.toJSON() ));
            this.$el.append(this.SquadSelectionView.render().$el);
            this.$el.append(this.teamRating.render().$el);
            this.$el.append(this.positionEditorView.render().$el);

            return this;
        }

    });
});
