define([
    'app',
    'backbone',
    'underscore',
    'text!templates/squad-pitch.html'
], function (
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
            'click li.pitch_player': 'showOptions',
            'click button#dropPlayer': 'dropPlayer',
            'click button#replacePlayer': 'replacePlayer',
            'click .playerOptions .close': 'closeOptions',
            'click #clearSelection': 'clearSelection'
        },

        initialize: function () {

        },

        showOptions: function (event) {

            var target = this.$el.find(event.currentTarget),
                playerOptions = this.$el.find('.playerOptions');

            playerOptions.find('h4').text(target.text());
            playerOptions.find('button').attr('data-uid', target.data('uid'));
            playerOptions.show();
        },

        closeOptions: function () {
            this.$el.find('.playerOptions').hide();
        },

        dropPlayer: function (event, uid) {
            this.closeOptions();

            if (!uid) {
                uid = parseInt(this.$el.find(event.currentTarget).data('uid'), 10);
            }

            var playerModel = App.playerCollection.findWhere({
                'uid': uid
            });
            this.$el.find('li[data-uid="' + uid + '"]').fadeOut('slow', function () {
                App.usersTeamCollection.removePlayerFromCollection(playerModel);
            });
            return false;
        },

        replacePlayer: function (event) {
            this.closeOptions();

            var uid = parseInt(this.$el.find(event.currentTarget).data('uid'), 10),
                playerModel = App.playerCollection.findWhere({
                    'uid': uid
                });

            this.setFilterToPosition(playerModel.get('position'));
            this.dropPlayer(null, uid);

            return false;
        },

        setFilterToPosition: function (suggestedPosition) {
            $('#squad-filters select').val('all');
            $('select#players_position').val(suggestedPosition);

            this.model.clear({
                silent: true
            }).set({
                'position': suggestedPosition
            });
        },

        clearSelection: function () {
            App.usersTeamCollection.removeAllPlayersFromCollection();
            return false;
        },

        render: function () {

            this.$el.html(this.template({
                players: App.usersTeamCollection.toJSON(),
                userDetails: App.userDetails.toJSON()
            }));
            this.$el.find('.pitch_player.position-cb:eq(1), .pitch_player.position-mc:eq(1), .pitch_player.position-st:eq(1)').addClass('second');
            return this;
        }

    });
});
