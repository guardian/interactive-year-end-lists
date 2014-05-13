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
        className: 'col-xs-12 col-md-5 col-lg-4',
        template: _.template(SquadPitchTemplate),

        events: {
            'click #goToMatch': 'navigateToMatch',
            'click .selectTeamPop': 'setTeamToSelection',
            //'click li.pitch-player-taken': 'showOptions',
            'click button#dropPlayer': 'dropPlayer',
            'click .playerOptions .close': 'closeOptions',
            //'click li.pitch-player-available': 'showAvailablePlayersInPosition',
            'click .pitch-player' : 'positionSelected',
            'click #clearSelection': 'clearSelection'
        },

        initialize: function() {
            this.selectedPlayerModel = null;
            Backbone.on('player_clicked', this.highlightPositions, this);
            Backbone.on('playercard_closed', this.removeHighlightPositions, this);
            App.usersTeamCollection.on('reset', this.render, this);
        },

        highlightPositions: function(playerModel) {
            this.selectedPlayerModel = playerModel;
            //console.log(playerModel);
        },

        removeHighlightPositions: function() {
            console.log('Player card is closed');
            this.selectedPlayerModel = null;
        },

        positionSelected: function(e) {
            if (this.selectedPlayerModel === null) {
                this.showOptions(e);
                return;
            }

            var position = $(e.currentTarget).data('position');
            console.log(position, this.selectedPlayerModel, this);
            App.userDetails.save(
                'player'+position,
                this.selectedPlayerModel.get('uid')
            );
            this.selectedPlayerModel = null;
        },

        navigateToMatch: function (e) {

            // button might be disabled due to not having 11 players selected
            if (!$(e.target).hasClass('disabled')) {
                App.appRoutes.navigate('user/' + App.userDetails.get('guardianID'), {
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
            var target = this.$el.find(event.currentTarget);
            var position = target.data('position');
            var playerID = App.userDetails.get('player' + position);
            
            // No player preset so do nothing
            if (playerID === null) {
                return;
            }

            this.$showOptions.find('h4').text(target.text());
            this.$showOptions.find('button').attr('data-position', target.data('position'));
            this.$showOptions.show();
        },

        // Close menu
        closeOptions: function () {
            this.$showOptions.hide();
        },

        // Remove player from team
        dropPlayer: function (event, uid, posClass) {
            this.closeOptions();

            var target = $(event.currentTarget);
            var position = target.data('position');

            if (!uid) {
                uid = this.$el.find(event.currentTarget).data('uid');
            }

            if (!posClass) {
                posClass = this.$el.find('li[data-uid="' + uid + '"]').data('position');
            }

            var playerModel = App.playerCollection.findWhere({
                'uid': uid
            });


            App.userDetails.save('player'+position, null);

            /*
            this.$el.find('li[data-uid="' + uid + '"]').fadeOut('slow', function () {
                App.usersTeamCollection.removePlayerFromCollection(playerModel);
            });
            this.$el.find('li.pitch-player-hidden[data-position="' + posClass + '"]').fadeIn('slow');
            */
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
            //App.usersTeamCollection.removeAllPlayersFromCollection();
            App.userDetails.clearSquad();
        },

        render: function () {
            var positionNames = [
                {
                    "name": "GK",
                    "position": "goalkeeper"
                },{
                    "name": "LB",
                    "position": "defence"
                },{
                    "name": "RB",
                    "position": "defence"
                },{
                    "name": "CB",
                    "position": "defence"
                },{
                    "name": "CB",
                    "position": "defence"
                },{
                    "name": "LM",
                    "position": "midfield"
                },{
                    "name": "RM",
                    "position": "midfield"
                },{
                    "name": "CM",
                    "position": "midfield"
                },{
                    "name": "CM",
                    "position": "midfield"
                },{
                    "name": "ST",
                    "position": "attack"
                },{
                    "name": "ST",
                    "position": "attack"
                }
            ];
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

            var usersSquad = App.userDetails.getSquad();

            /*
            var usersPlayers = App.usersTeamCollection.toJSON();
            console.log(App.usersTeamCollection);
            usersPlayers.forEach(function (player) {
                if (playerPositions.hasOwnProperty(player.wantedPosition)) {
                    playerPositions[player.wantedPosition].player = player;
                } else {
                    console.log(player);
                }
            });
            */

            this.$el.empty();
            var data = {
                //players: playerPositions,
                userDetails: App.userDetails.toJSON(),
                players: App.usersTeamCollection.toJSON(),
                squadCount: App.userDetails.getSquadCount(),
                positionNames: positionNames
            };
            this.$el.append(this.template(data));

            this.$showOptions = this.$('.playerOptions');
            
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
            
            App.userDetails.save('player'+position, data);

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
