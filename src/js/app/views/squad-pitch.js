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
            'click #goToMatch': 'navigateToMatch',
            'click .selectTeamPop': 'setTeamToSelection',
            'click li.pitch-player-taken': 'showOptions',
            'click button#dropPlayer': 'dropPlayer',
            'click button#replacePlayer': 'replacePlayer',
            'click .playerOptions .close': 'closeOptions',
            'click li.pitch-player-available': 'showAvailablePlayersInPosition',
            'click #clearSelection': 'clearSelection'
        },

        navigateToMatch: function (e) {

            // button might be disabled due to not having 11 players selected
            if (!$(e.target).hasClass('disabled')) {
                App.appRoutes.navigate('/match/' + App.userDetails.get('guardianID'), {
                    trigger: true
                });
            }
        },

        setTeamToSelection: function (event) {
            var teamSelection = this.$el.find(event.currentTarget).data('team');

            App.userDetails.set({
                teamSelection: teamSelection
            }, {
                silent: true
            });
            App.userDetails.fetchUserTeamFromStorage();
            App.userDetails.save();
            this.render();

            return false;
        },

        /**
         * These functions are for the little menu that appears
         * when you click on the player icon on the pitch.
         *
         * ie Replace or Drop
         */
        showOptions: function (event) {
            var target = this.$el.find(event.currentTarget),
                playerOptions = this.$el.find('.playerOptions');

            playerOptions.find('h4').text(target.text());
            playerOptions.find('button').attr('data-uid', target.data('uid'));
            playerOptions.show();
        },

        // Close menu
        closeOptions: function () {
            this.$el.find('.playerOptions').hide();
        },

        // Remove player from team
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

        // Remove player from team AND show available players for that position in list
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

        // See function below for more details
        showAvailablePlayersInPosition: function (event) {
            var posClass = this.$el.find(event.currentTarget).data('area');
            this.setFilterToPosition(posClass);
        },

        // Set the filter options for that position
        setFilterToPosition: function (suggestedPosition) {
            suggestedPosition = this.ucwords(suggestedPosition);

            $('#squad-filters select').val('all');
            $('select#players_position').val(suggestedPosition);

            this.model.clear({
                silent: true
            }).set({
                'position': suggestedPosition
            });
        },

        // Reset the teamCollection and wipe the pitch
        clearSelection: function () {
            App.usersTeamCollection.removeAllPlayersFromCollection();
            return false;
        },

        render: function () {
            var playerPositions = {
                'ST': {
                    player: null,
                    area: 'attack'
                },
                'ST2': {
                    player: null,
                    area: 'attack'
                },
                'MR': {
                    player: null,
                    area: 'midfield'
                },
                'MC': {
                    player: null,
                    area: 'midfield'
                },
                'MC2': {
                    player: null,
                    area: 'midfield'
                },
                'ML': {
                    player: null,
                    area: 'midfield'
                },
                'RB': {
                    player: null,
                    area: 'defence'
                },
                'CB': {
                    player: null,
                    area: 'defence'
                },
                'CB2': {
                    player: null,
                    area: 'defence'
                },
                'LB': {
                    player: null,
                    area: 'defence'
                },
                'GK': {
                    player: null,
                    area: 'goalkeeper'
                }
            };

            console.log(App.userDetails.toJSON(), App.usersTeamCollection.toJSON());
            var usersSquad = App.userDetails.getSquad();

            /*
            var usersPlayers = App.usersTeamCollection.toJSON();
            usersPlayers.forEach(function (player) {
                if (playerPositions.hasOwnProperty(player.wantedPosition)) {
                    playerPositions[player.wantedPosition].player = player;
                } else {
                    console.log(player);
                }
            });
            */

            this.$el.empty();
            this.$el.append(this.template({
                //players: playerPositions,
                userDetails: App.userDetails.toJSON(),
                players: App.usersTeamCollection.toJSON(),
                squadCount: 0
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

        // Simple function to turn goalkeeper => Goalkeeper
        ucwords: function (str) {
            return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                return $1.toUpperCase();
            });
        },

        /**
         *
         * Drag and drop listeners ported from:
         * https://gist.github.com/Rob-ot/1488561
         *
         * When starting to drag a player, the available position on the pitch
         * has a class 'dragTarget'. This is coded in 'squad-list.js'
         *
         * These functions handle the drop.
         *
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
            var target = $(e.target).closest('.pitch-player');
            var position = parseInt(target.data('position'), 10);
            
            if (isNaN(position) || position > 11 || position < 0) {
                console.warn('Invalid player position', position);
                return;
            }

            if (App.userDetails.isPlayerInSquad(data)) {
                console.warn('Attempting to assign a duplicate player', data);
                return;
            }
            
            App.userDetails.save('player'+position, data, {
                success: App.userDetails.fetchUserTeamFromStorage.bind(App.userDetails)                   
            });

            // Prevent Goalkeepers being Strikers
            // TODO: If you want Pele in goal remove this if statement.
            /*
            if (playerModel.get('position').toLowerCase() === target.data('area')) {
                App.usersTeamCollection.addPlayerToCollection(playerModel, target.data('position'));
            } else {
                App.notify.showMsg(
                    playerModel.get('name') + ' cant play ' + target.data('area')
                );
            }
            */
        }

    });
});
