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
        className: 'col-xs-4 col-sm-3 col-md-4 col-lg-3 col-xl-2 player_profile',
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
                this.$el.attr('draggable', 'true')
                    .bind('dragstart', this._dragStartEvent.bind(this))
                    .bind('dragend', this._dragEndEvent.bind(this));
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
            // console.log(this);
            $('body').scrollTop($('#squad-filters .up-arrow').offset().top);
            Backbone.trigger('player_clicked', this.model);
        },

        // Remove and also check the list items for 'selected' class toggle
        removePlayerFromSquad: function () {
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
            var dt = e.originalEvent.dataTransfer;
            dt.setData('Text', '');

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
            return true;
        },

        _dragEndEvent: function (e) {
            $('#squad-pitch').removeClass('goalkeeper defence midfield attack');
            $('.draghover, .dragTarget, .isDragging')
                .removeClass('draghover dragTarget isDragging');
            return false;
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

            $(newTarget + ', ' + newTarget).addClass('dragTarget');
            $('#squad-pitch-inner').addClass('isDragging');
            $('#squad-filters').addClass('isDragging');
            target.addClass('isDragging');

            return target.data('uid');
        }

    });
});
