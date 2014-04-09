define([
    'app',
    'backbone',
    'underscore',
    'text!templates/squad-pitch.html'
], function(
    App,
    Backbone,
    _,
    SquadPitchTemplate
) {
    return Backbone.View.extend({

        id: 'team-rating',
        className: 'col-xs-12 col-sm-4',
        template: _.template(SquadPitchTemplate),

        events: {
            'click #clearSelection': 'clearSelection'
        },

        initialize: function() {
            this.listenTo(App.usersTeamCollection, 'add remove reset', this.render);
        },

        generatePitch: function() {

            return this.template({
                players: App.usersTeamCollection.toJSON(),
                userDetails: App.userDetails.toJSON()
            });
        },

        clearSelection: function() {
            App.usersTeamCollection.reset();
            return false;
        },

        render: function() {
            this.$el.html(this.generatePitch());
            this.$el.find('.pitch_player.position-cb:eq(1), .pitch_player.position-mc:eq(1), .pitch_player.position-st:eq(1)').addClass('second');
            return this;
        }

    });
});
