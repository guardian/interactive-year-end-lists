define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'text!templates/squad-pitch.html'
], function (
    App,
    $,
    Backbone,
    _,
    SquadPitchTemplate
) {
    return Backbone.View.extend({

        id: 'squad-pitch',
        className: 'col-xs-12 col-sm-4',
        template: _.template(SquadPitchTemplate),

        events: {
            'click #goToMatch': 'goToMatch',
            'click li.pitch-player-taken': 'showOptions',
            'click button#dropPlayer': 'dropPlayer',
            'click button#replacePlayer': 'replacePlayer',
            'click .playerOptions .close': 'closeOptions',
            'click li.pitch-player-available': 'showAvailablePlayersInPosition',
            'click #clearSelection': 'clearSelection'
        },

        initialize: function () {

        },

        goToMatch: function (e) {
            if (!$(e.target).hasClass('disabled')) {
                App.appRoutes.navigate('/match/' + App.userDetails.get('guardianID'), { trigger: true });
            }
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
                'ST': {},
                'ST2': {},
                'MR': {},
                'MC': {},
                'MC2': {},
                'ML': {},
                'RB': {},
                'CB': {},
                'CB2': {},
                'LB': {},
                'GK': {}
            },
                usersPlayers = App.usersTeamCollection.toJSON();

            usersPlayers.forEach(function (player) {
                playerPositions[player.wantedPosition] = player;
            });

            this.$el.html(this.template({
                players: playerPositions,
                userDetails: App.userDetails.toJSON(),
                usersPlayers: App.usersTeamCollection.toJSON()
            }));

            // Start hover event bindings

            if (App.userDetails.get('username')) {
                var dragDropTarget = this.$el.find('li');
                dragDropTarget.bind("dragover", _.bind(this._dragOverEvent, this));
                dragDropTarget.bind("dragenter", _.bind(this._dragEnterEvent, this));
                dragDropTarget.bind("dragleave", _.bind(this._dragLeaveEvent, this));
                dragDropTarget.bind("drop", _.bind(this._dropEvent, this));
            }
            return this;
        },



        /**
         * Drag and drop listeners
         * https://gist.github.com/Rob-ot/1488561
         */

        _dragOverEvent: function (e) {
            if (e.originalEvent) {
                e = e.originalEvent;
            }
            var data = this._getCurrentDragData(e);

            if (this.dragOver(data, e.dataTransfer, e) !== false) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.dataTransfer.dropEffect = 'copy'; // default
            }
        },

        _dragEnterEvent: function (e) {
            if (e.originalEvent) {
                e = e.originalEvent;
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
        },

        _dragLeaveEvent: function (e) {
            if (e.originalEvent) {
                e = e.originalEvent;
            }
            var data = this._getCurrentDragData(e);
            this.dragLeave(data, e.dataTransfer, e);
        },

        _dropEvent: function (e) {

            if (e.originalEvent) {
                e = e.originalEvent;
            }
            var data = this._getCurrentDragData(e);

            if (e.preventDefault) {
                e.preventDefault();
            }
            if (e.stopPropagation) {
                e.stopPropagation(); // stops the browser from redirecting
            }

            this.drop(data, e.dataTransfer, e);
        },

        _getCurrentDragData: function (e) {
            var data = null;
            if (window._backboneDragDropObject) {
                data = window._backboneDragDropObject;
            }
            return data;
        },

        dragOver: function (data, dataTransfer, e) {
            var target = $(e.target);
            if (!target.hasClass('pitch-player')) {
                target = target.closest('.pitch-player');
            }
            target.addClass("draghover");
        },

        dragLeave: function (data, dataTransfer, e) {
            this.$el.find('.draghover').removeClass("draghover");
        },

        drop: function (data, dataTransfer, e) {

            var target = $(e.target),
                playerModel = App.playerCollection.findWhere({
                    'uid': data
                });

            if (!target.hasClass('pitch-player')) {
                target = target.closest('.pitch-player');
            }
            if (playerModel.get('position') === target.data('position').replace(/\d+/g, '')) {
                App.usersTeamCollection.addPlayerToCollection(playerModel, target.data('position'));
            } else {
                App.visualPrompt.set({
                    'message': playerModel.get('name') + ' is a ' + playerModel.get('position') + ', he can\'t play ' + target.data('position').replace(/\d+/g, ''),
                    'closePrompt': true
                });
            }
        }

    });
});