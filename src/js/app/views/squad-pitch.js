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
            'click li.pitch-player-taken': 'showOptions',
            'click button#dropPlayer': 'dropPlayer',
            'click button#replacePlayer': 'replacePlayer',
            'click .playerOptions .close': 'closeOptions',
            'click li.pitch-player-available': 'showAvailablePlayersInPosition',
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

        dropPlayer: function (event, uid, posClass) {
            this.closeOptions();

            if (!uid) {
                uid = this.$el.find(event.currentTarget).data('uid');
            }
            if (!posClass) {
                posClass = this.$el.find('li[data-uid="' + uid + '"]').data('position');
            }

            var playerModel = App.playerCollection.findWhere({
                'uid': uid
            });
            this.$el.find('li[data-uid="' + uid + '"]').fadeOut('slow', function () {
                App.usersTeamCollection.removePlayerFromCollection(playerModel);
            });
            this.$el.find('li.pitch-player-hidden[data-position="' + posClass + '"]').fadeIn('slow');
            return false;
        },

        replacePlayer: function (event) {
            this.closeOptions();

            var uid = this.$el.find(event.currentTarget).data('uid'),
                posClass = this.$el.find(event.currentTarget).data('position'),
                playerModel = App.playerCollection.findWhere({
                    'uid': uid
                });

            this.setFilterToPosition(playerModel.get('position'));
            this.dropPlayer(null, uid, null);

            return false;
        },

        showAvailablePlayersInPosition: function (event) {
            var posClass = this.$el.find(event.currentTarget).data('position').replace(/\d+/g, '').toUpperCase();
            this.setFilterToPosition(posClass);
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

            var playerPositions = {
                'ST': {
                    containerClass: 'st'
                },
                'ST2': {
                    containerClass: 'st2'
                },
                'MR': {
                    containerClass: 'mr'
                },
                'MC': {
                    containerClass: 'mc'
                },
                'MC2': {
                    containerClass: 'mc2'
                },
                'ML': {
                    containerClass: 'ml'
                },
                'RB': {
                    containerClass: 'rb'
                },
                'CB': {
                    containerClass: 'cb'
                },
                'CB2': {
                    containerClass: 'cb2'
                },
                'LB': {
                    containerClass: 'lb'
                },
                'GK': {
                    containerClass: 'gk'
                }
            },
                usersPlayers = App.usersTeamCollection.toJSON();

            usersPlayers.forEach(function (player) {
                var indexToUse = player.position;

                if (!_.isEmpty(playerPositions[indexToUse].name)) {
                    indexToUse = indexToUse + '2'; // Second ST, MC, DC
                }
                playerPositions[indexToUse] = player;
                playerPositions[indexToUse].containerClass = indexToUse.toLowerCase();
            });

            this.$el.html(this.template({
                players: playerPositions,
                userDetails: App.userDetails.toJSON(),
                usersPlayers: App.usersTeamCollection.toJSON()
            }));
            return this;
        }

    });
});