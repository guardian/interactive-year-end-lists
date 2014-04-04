define([
    'app',
    'underscore',
    'backbone',
    'views/team-rating',
    'views/squad-selection',
    'views/position-editor',
    'views/player-modal',
    'text!templates/team-screen.html'
], function(
    App,
    _,
    Backbone,
    TeamRating,
    SquadSelectionView,
    PositionEditorView,
    PlayerModal,
    TeamScreenTemplate
) {
    return Backbone.View.extend({

        template: _.template(TeamScreenTemplate),

        className: 'container',

        events: {
            'click #signIn': 'beginSignIn'
        },

        initialize: function() {
            App.userDetails.on('change:username', this.prePopulateTeam, this);
        },

        prePopulateTeam: function() {
            if(App.userDetails.get('username')) {
                App.userDetails.fetchUserTeamFromStorage();
                this.render();
            }
        },

        beginSignIn: function() {
            App.userDetails.loginUser();
            return false;
        },

        render: function() {
            this.$el.empty();

            var teamRating = new TeamRating();
            var positionEditorView = new PositionEditorView();
            var squadSelectionView = new SquadSelectionView();
            var playerModal = new PlayerModal();

            this.$el.html(this.template({ "userDetails": App.userDetails.toJSON() }));
            
            this.$el.append('<div id="team-screen" class="row"></div>');
            this.$el.find('#team-screen').html(squadSelectionView.render().$el);
            this.$el.find('#team-screen').append(teamRating.render().$el);
            this.$el.find('#team-screen').append(playerModal.render().$el);

            this.$el.append(positionEditorView.render().$el);

            return this;
        }

    });
});
