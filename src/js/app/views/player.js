define([
    'app',
    'backbone',
    'underscore',
    'text!templates/player-profile.html'
], function(
    App,
    Backbone,
    _,
    PlayerTemplate
){

    return Backbone.View.extend({
        tagName: 'div',

        className: 'col-xs-4 player_profile',

        template: _.template(PlayerTemplate),

        events: {
            'click': 'showSelectionInfo',
            'click .selection-info button.addToSquad': 'addToSquad',
        },

        initialize: function() {
            this.listenTo(this.model, 'change:selected', this.updateStatus);
        },

        showSelectionInfo: function(ev) {
            this.hideAllSelectionInfo();
            if($(ev.target).hasClass('close')) {
                return false;
            } else {
                this.$el.find('.selection-info').show();
            }
        },

        updateStatus: function() {
            this.$el.toggleClass('selected', this.model.get('selected'));
        },

        addToSquad: function() {
            
            this.hideAllSelectionInfo();

            App.player.set('selectedPlayer', this.model);

            this.model.set('selected', !this.model.get('selected'));

            if (this.model.get('selected')) {
                App.usersTeamCollection.add(this.model);
            } else {
                App.usersTeamCollection.remove(this.model);
            }
            return false;
        },

        hideAllSelectionInfo: function() {
            $('.selection-info').hide();
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
});
