define([
    'app',
    'backbone',
    'underscore',
    'data/players',
    'text!templates/player-modal.html'
], function(
    App,
    Backbone,
    _,
    PlayerData,
    ProfileTemplate
){

    return Backbone.View.extend({
        tagName: 'div',
        id: 'playerSelectedModal',
        className: 'giwc-player-card',
        template: _.template(ProfileTemplate),

        events: {
            'click button.addToSquad, .removeFromSquad': 'addToSquad',
            'click .close': 'closeCard'
        },

        initialize: function() {
            this.templateData = {"playerSelected": '', 'validation': {}};
            App.playerSelected.on('change', this.openCard, this);
        },

        openCard: function() {
            /*
            require(["common/modules/identity/api"], function(api) { 
                if(!App.userDetails) {
                    App.userDetails = api.getUserOrSignIn();
                }
            });
*/
            if(App.playerSelected.get('highlighted')) {
                this.playerModel = App.playerCollection.get(App.playerSelected.get('highlighted'));

                this.templateData.validation = App.usersTeamCollection.validateAddingPlayer(this.playerModel);
                this.templateData.playerSelected = this.playerModel.toJSON();

                this.render();

                $('#' + this.$el.attr('id')).show();
            }
        },

        closeCard: function() {
            this.$el.hide();
            App.playerSelected.set('highlighted', 0);
            return false;
        },

        addToSquad: function() {

            if(!App.userDetails.get('username')) {
                alert('Please log in first!');
                return;
            }

            this.closeCard();
            var response = App.usersTeamCollection.addPlayerToCollection(this.playerModel);
            if(response.status == 'fail') {
                alert('Can\'t do that Dave');
            } else {
                //$('#player_profile_' + this.model.cid).addClass('selected');
            }
            return false;
        },

        render: function() {
            $('#' + this.$el.attr('id')).html(this.template(this.templateData));
            return this;
        }
    });
});
