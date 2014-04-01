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

                // Cant have more than 4 players
                if((App.usersTeamCollection.length + 1) <= 4) {

                    // Cant have more than x players in position y
                    var allowedPositions = {
                        'Striker' : 2,
                        'Midfield' : 2,
                        'Defender' : 2,
                        'Goalkeeper' : 1
                    };
                    if((App.usersTeamCollection.where({'position' : this.model.get('position')}).length + 1) <= allowedPositions[this.model.get('position')]) {
                        App.usersTeamCollection.add(this.model);
                    } else {
                        alert('Cant have more than ' + allowedPositions[this.model.get('position')] + ' ' + this.model.get('position') + 's');
                    }
                } else {
                    alert('Cant have more than 4 players!');
                }
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
