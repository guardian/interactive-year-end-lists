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

        id: 'squad-pitch',
        className: 'col-xs-12 col-sm-4',
        template: _.template(SquadPitchTemplate),

        events: {
            'click li': 'swapPlayer',
            'click #clearSelection': 'clearSelection'
        },

        initialize: function() {

        },

        swapPlayer: function(event) {
            var target = $(event.currentTarget);
            var playerModel = App.playerCollection.findWhere({'uid': parseInt(target.data('uid'))});
            target.fadeOut('slow', function() {
                App.usersTeamCollection.removePlayerFromCollection(playerModel);
            });
        },

        clearSelection: function() {
            App.usersTeamCollection.removeAllPlayersFromCollection();
            return false;
        },

        render: function() {
            this.$el.html(this.template({
                players: App.usersTeamCollection.toJSON(),
                userDetails: App.userDetails.toJSON()
            }));
            this.$el.find('.pitch_player.position-cb:eq(1), .pitch_player.position-mc:eq(1), .pitch_player.position-st:eq(1)').addClass('second');
            return this;
        }

    });
});
