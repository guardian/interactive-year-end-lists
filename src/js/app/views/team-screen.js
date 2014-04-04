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
            'click #signIn': 'beginSignIn',
        },

        initialize: function() {
            //App.userDetails.on('change', this.render, this);
        },

        beginSignIn: function() {
            App.userDetails.set('username', 'Daniel Levitt');
            App.userDetails.set('teamName', '50 Shades of OShea');
            App.userDetails.set('teamSelection', [1, 2, 3, 4, 5]);

            if(App.userDetails.get('teamSelection')) {
                var selection = App.userDetails.get('teamSelection');
                selection.map(function(playerUID) {
                    var playerModel = App.playerCollection.findWhere({'uid':playerUID});
                    App.usersTeamCollection.addPlayerToCollection(playerModel);
                });
            }

            this.render();

            return false;

            /*
            require(["common/modules/identity/api"], function(api) { 
                var loggedIn = getUserOrSignIn();
                console.log('Do signup!');
                console.log(loggedIn);
            });
            return false;
            */
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
