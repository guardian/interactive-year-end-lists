define([
    'app',
    'jquery',
    'underscore',
    'backbone',
    'views/squad-pitch',
    'views/squad-filters',
    'views/squad-modal',
    'text!templates/squad.html'
], function (
    App,
    $,
    _,
    Backbone,
    SquadPitchView,
    SquadFiltersView,
    SquadModalView,
    SquadTemplate
) {
    return Backbone.View.extend({

        className: 'container',
        template: _.template(SquadTemplate),

        events: {
            'click #signIn': 'navigateSignin'
        },

        initialize: function () {
            this.listenTo(App.userDetails, 'change:username', this.render);
            this.listenTo(App.userDetails, 'change:teamSelection', this.prePopulateTeam);
            this.listenTo(App.usersTeamCollection, 'reset', this.prePopulateTeam);

            this.filterModel = new Backbone.Model();
        },

        navigateSignin: function () {
            App.userDetails.loginUser();
            return false;
        },

        prePopulateTeam: function () {
            var squadPitch = new SquadPitchView({
                model: this.filterModel
            });
            this.$el.find('#squad-pitch').replaceWith(squadPitch.render().$el);
        },

        render: function () {
            this.$el.empty();

            this.$el.append(this.template({
                "userDetails": App.userDetails.toJSON()
            }));

            this.$el.append('<div id="team-screen" class="row"></div>');

            var squadPitch = new SquadPitchView({
                    model: this.filterModel
                }),
                squadFilters = new SquadFiltersView({
                    model: this.filterModel
                }),
                squadModal = new SquadModalView();

            this.$el.find('#team-screen').append(squadPitch.render().$el);
            this.$el.find('#team-screen').append(squadFilters.render().$el);
            this.$el.find('#team-screen').append(squadModal.render().$el);

            return this;
        }

    });
});
