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
        className: 'col-xs-4 col-sm-3 col-lg-2 player_profile',
        template: _.template(SquadListTemplate),

        events: {
            'click img, p': 'openPlayerCard',
            'click .removePlayer': 'removePlayerFromSquad'
        },

        initialize: function () {

            this.$el.attr({
                'id': 'player_profile_' + this.model.cid,
                'data-uid': this.model.attributes.uid,
                'data-position': this.model.attributes.position
            });

            App.playerSelected.on('change', this.openCard, this);
            this.listenTo(App.usersTeamCollection, 'add remove reset', this.showSelectedPlayer);
            this.showSelectedPlayer();

            if (App.userDetails.get('username')) {
                this.$el.attr("draggable", "true");
                this.$el.bind("dragstart", _.bind(this._dragStartEvent, this));
                this.$el.bind("dragend", _.bind(this._dragEndEvent, this));
            }
        },

        showSelectedPlayer: function () {
            this.$el.toggleClass('selected', App.usersTeamCollection.contains(this.model));
        },

        openPlayerCard: function () {
            App.playerSelected.set('highlighted', this.model.cid);
        },

        removePlayerFromSquad: function () {
            App.usersTeamCollection.removePlayerFromCollection(this.model);
            this.showSelectedPlayer();
            return false;
        },

        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },


        /**
         * Drag and drop listeners
         * https://gist.github.com/Rob-ot/1488561
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
                // we cant bind an object directly because it has to be a string, json just won't do
                window._backboneDragDropObject = data;
            }
        },

        _dragEndEvent: function (e) {
            $('.draghover, .dragTarget, .isDragging').removeClass('draghover dragTarget isDragging');
        },

        dragStart: function (dataTransfer, e) {
            var target = $(e.target);
            if (!target.hasClass('player_profile')) {
                target = target.closest('.player_profile');
            }
            var positionTarget = target.data('position'),
                newTarget = '.pitch-player.position-' + positionTarget.replace(/[0-9]/g);
            $((newTarget + ', ' + newTarget + '2').toLowerCase()).addClass('dragTarget');

            $('.pitch').addClass('isDragging');
            target.addClass('isDragging');

            return target.data('uid');
        }
    });
});