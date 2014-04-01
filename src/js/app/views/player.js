define([
    'app',
    'backbone',
    'underscore',
    'data/players',
    'text!templates/player-profile.html'
], function(
    App,
    Backbone,
    _,
    PlayerData,
    PlayerTemplate
){

    return Backbone.View.extend({
        tagName: 'div',

        className: 'col-xs-3 col-lg-4 player_profile',

        template: _.template(PlayerTemplate),

        events: {
            'click': 'showSelectionInfo',
            'click button.addToSquad, .removeFromSquad': 'addToSquad',
        },

        initialize: function() {
            this.updateStatus();
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
            this.$el.toggleClass('selected', App.usersTeamCollection.contains(this.model));
        },

        addToSquad: function() {
            this.hideAllSelectionInfo();
            if (App.usersTeamCollection.contains(this.model)) {
                App.usersTeamCollection.remove(this.model);
            } else {
                App.usersTeamCollection.addPlayerToCollection(this.model);
            }
            this.updateStatus();
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
