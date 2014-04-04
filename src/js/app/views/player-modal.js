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

                this.$el.show();
            }
        },

        closeCard: function() {
            this.$el.hide();
            App.playerSelected.set('highlighted', 0);
            return false;
        },

        addToSquad: function() {

            this.closeCard();
            
            if(!App.userDetails.get('username')) {
                App.visualPrompt.set({
                    'message': 'Please login first',
                    'closePrompt' : true
                });
                return;
            }

            var response = App.usersTeamCollection.addPlayerToCollection(this.playerModel);
            if(response.status == 'fail') {
                App.visualPrompt.set({
                    'message': response.message,
                    'closePrompt' : true
                });
            }
            return false;
        },

        render: function() {
            this.$el.html(this.template(this.templateData));
            return this;
        }
    });
});
