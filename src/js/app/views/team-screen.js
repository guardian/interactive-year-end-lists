define([
    'app',
    'underscore',
    'backbone',
    'views/team-rating',
    'views/squad-selection',
    'views/player-modal',
    'views/visual-prompt',
    'text!templates/team-screen.html'
], function(
    App,
    _,
    Backbone,
    TeamRating,
    SquadSelectionView,
    PlayerModal,
    VisualPrompt,
    TeamScreenTemplate
) {
    return Backbone.View.extend({

        className: 'container',
        template: _.template(TeamScreenTemplate),

        events: {
            'click #signIn': 'beginSignIn'
        },

        initialize: function() {
            this.listenTo(App.userDetails, 'change', this.prePopulateTeam);
        },

        prePopulateTeam: function() {
            if(App.userDetails.get('username')) {
                App.userDetails.fetchUserTeamFromStorage();

                var teamRating = new TeamRating();
                this.$el.find('#team-rating').html(this.teamRating.render().$el);
            }
        },

        beginSignIn: function() {
            App.userDetails.loginUser();
            return false;
        },

        render: function() {

            this.$el.empty();

            this.$el.html(this.template({ "userDetails": App.userDetails.toJSON() }));

            this.$el.append('<div id="team-screen" class="row"></div>');

            var visualPrompt = new VisualPrompt();

            var teamRating = new TeamRating();
            var squadSelectionView = new SquadSelectionView();
            var playerModal = new PlayerModal();

            this.$el.find('#team-screen').html(visualPrompt.render().$el);

            this.$el.find('#team-screen').append(teamRating.render().$el);
            this.$el.find('#team-screen').append(squadSelectionView.render().$el);
            this.$el.find('#team-screen').append(playerModal.render().$el);

            return this;
        }

    });
});
