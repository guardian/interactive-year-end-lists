define([
    'app',
    'underscore',
    'backbone',
    'views/squad-selection',
    'views/team-rating',
    'views/position-editor',
    'views/player-modal',
    'text!templates/team-screen.html'
], function(
    App,
    _,
    Backbone,
    SquadSelectionView,
    TeamRating,
    PositionEditorView,
    PlayerModal,
    TeamScreenTemplate
) {
    return Backbone.View.extend({

        template: _.template(TeamScreenTemplate),

        className: 'container',

        events: {
            'click button#sign-in': 'beginSignIn',
        },

        initialize: function() {
            this.templateData = { "userDetails": null };
        },

        beginSignIn: function() {
            require(["common/modules/identity/api"], function(api) { 
                var loggedIn = getUserOrSignIn();
            });
            return false;
        },

        render: function() {
            this.$el.empty();

            this.teamRating = new TeamRating();
            this.positionEditorView = new PositionEditorView();
            this.SquadSelectionView = new SquadSelectionView({
                collection: this.collection
            });
            this.PlayerModal = new PlayerModal();

            this.templateData.userDetails = App.userDetails;
            this.$el.html(this.template(this.templateData));
            
            this.$el.append('<div id="team-screen" class="row"></div>');
            this.$el.find('#team-screen').html(this.SquadSelectionView.render().$el);
            this.$el.find('#team-screen').append(this.teamRating.render().$el);
            this.$el.find('#team-screen').append(this.PlayerModal.render().$el);

            this.$el.append(this.positionEditorView.render().$el);

            return this;
        }

    });
});
