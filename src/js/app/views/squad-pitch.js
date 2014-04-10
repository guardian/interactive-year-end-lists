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

            var target = $(event.currentTarget);

            var playerOptions = $('.playerOptions');
            playerOptions.find('h4').text(target.text());
            playerOptions.find('button').attr('data-uid', target.data('uid'));
            playerOptions.show();
        },

        closeOptions: function () {
            $('.playerOptions').hide();
        },

        dropPlayer: function (event, uid) {
            this.closeOptions();

            if (!uid) {
                uid = parseInt($(event.currentTarget).data('uid'));
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

            var uid = parseInt($(event.currentTarget).data('uid'));
            var playerModel = App.playerCollection.findWhere({
                'uid': uid
            });

            $('#squad-filters select').val('all');
            $('select#players_position').val(playerModel.get('position'));

            this.model.clear({
                silent: true
            }).set({
                'position': playerModel.get('position')
            });

            this.dropPlayer(null, uid);

            return false;
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