define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'data/players',
    'text!templates/squad-list.html'
], function (
    App,
    $,
    Backbone,
    _,
    PlayerData,
    SquadListTemplate
) {

    return Backbone.View.extend({

        tagName: 'div',
        className: 'col-xs-6 col-xm-4 col-sm-4 col-md-3 col-lg-2 player_profile',
        template: _.template(SquadListTemplate),

        events: {
            'click .inner': 'openPlayerCard',
            'click .removePlayer': 'removePlayerFromSquad'
        },

        initialize: function () {

            // Set list item attributes
            this.$el.attr({
                'id': 'player_profile_' + this.model.cid,
                'data-uid': this.model.attributes.uid,
                'data-position': this.model.attributes.position.toLowerCase()
            });

            App.playerSelected.on('change', this.openCard, this);

            // This is listening to changes in the team so we can show that in the list
            //this.listenTo(App.usersTeamCollection, 'add remove reset', this.showSelectedPlayer);
            App.usersTeamCollection.on('reset', this.showSelectedPlayer, this);
            this.showSelectedPlayer();

            if (App.userDetails.get('username')) {
                this.$el.attr("draggable", "true");
                this.$el.bind("dragstart", _.bind(this._dragStartEvent, this));
                this.$el.bind("dragend", _.bind(this._dragEndEvent, this));
            }
        },

        // List items may have class 'selected' (ie ticked so we can untick them)
        showSelectedPlayer: function () {
            this.$el.toggleClass('selected', App.usersTeamCollection.contains(this.model));
        },

        // 'squad-modal.js' listens to this App.playerSelected and opens the modal based
        // on the cid (backbones internal ID system)
        openPlayerCard: function () {
            //App.playerSelected.set('highlighted', this.model.cid);
            console.log('squad list: opening player card');
            Backbone.trigger('player_clicked', this.model);
        },

        // Remove and also check the list items for 'selected' class toggle
        removePlayerFromSquad: function () {
            /*console.log(App.usersTeamCollection.remove(this.model));
            console.log(App.usersTeamCollection.get(this.model)); 
            */
            var indexOfPlayer = App.usersTeamCollection.indexOf(this.model);
            App.userDetails.save('player'+indexOfPlayer, null);
            this.showSelectedPlayer();
            return false;
        },

        render: function () {
            this.$el.empty();
            this.$el.append(this.template(this.model.attributes));
            return this;
        },


        /**
         *
         * Drag and drop listeners ported from:
         * https://gist.github.com/Rob-ot/1488561
         *
         * These functions are for the begining of the drag,
         * the drop is coded in 'squad-pitch.js'
         *
         */
        _dragStartEvent: function (e) {

            var data;
            if (e.originalEvent) {
                e = e.originalEvent;
            }
            // default to copy
            e.dataTransfer.effectAllowed = 'copy';
            data = this.dragStart(e.dataTransfer, e);

            window._backboneDragDropObject = null;
            if (data !== undefined) {
                window._backboneDragDropObject = data;
            }
        },

        _dragEndEvent: function (e) {
            console.log('DRAG END!');
            $('#squad-pitch').removeClass('goalkeeper defence midfield attack');
            $('.draghover, .dragTarget, .isDragging')
                .removeClass('draghover dragTarget isDragging');
        },

        dragStart: function (dataTransfer, e) {
            var target = $(e.target);
            if (!target.hasClass('player_profile')) {
                target = target.closest('.player_profile');
            }
            
            var positionTarget = target.data('position');
            var newTarget = '.pitch-player[data-area="' + positionTarget + '"]';
            var player = App.playerCollection.findWhere({uid: target.data('uid')});

            var playerPositions = player.get('position').split(',');
            playerPositions.forEach(function(position, i) {
                $('#squad-pitch').addClass(position.trim().toLowerCase());
            });

            console.log(playerPositions);
            
            $(newTarget + ', ' + newTarget).addClass('dragTarget');
            $('#squad-pitch').addClass('isDragging');
            $('#squad-filters').addClass('isDragging');
            target.addClass('isDragging');

            return target.data('uid');
        }

    });
});
