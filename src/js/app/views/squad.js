define([
    'app',
    'underscore',
    'backbone',
    'views/squad-pitch',
    'views/squad-filters',
    'views/squad-modal',
    'views/visual-prompt',
    'text!templates/squad.html'
], function(
    App,
    _,
    Backbone,
    SquadPitchView,
    SquadFiltersView,
    SquadModalView,
    VisualPromptView,
    SquadTemplate
) {
    return Backbone.View.extend({

        className: 'container',
        template: _.template(SquadTemplate),

        events: {
            'click #signIn': 'beginSignIn'
        },

        initialize: function() {
            this.listenTo(App.userDetails, 'change:teamSelection', this.prePopulateTeam);
        },

        prePopulateTeam: function() {
            if(App.userDetails.get('username')) {
                App.userDetails.fetchUserTeamFromStorage();

                var squadPitch = new SquadPitchView({model: App.filterValues});
                this.$el.find('#squad-pitch').html(squadPitch.render().$el);
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

            // Push visualPrompt to view
            var visualPrompt = new VisualPromptView();
            this.$el.find('#team-screen').html(visualPrompt.render().$el);

            var squadPitch = new SquadPitchView({model: App.filterValues});
            var squadFilters = new SquadFiltersView({model: App.filterValues});

            var squadModal = new SquadModalView();

            this.$el.find('#team-screen').append(squadPitch.render().$el);
            this.$el.find('#team-screen').append(squadFilters.render().$el);
            this.$el.find('#team-screen').append(squadModal.render().$el);

            return this;
        }

    });
});
