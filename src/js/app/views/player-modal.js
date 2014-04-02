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
        className: 'modal player-card',
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
            if(App.playerSelected.get('highlighted')) {
                this.model = App.playerCollection.get(App.playerSelected.get('highlighted'));

                this.templateData.validation = App.usersTeamCollection.validateAddingPlayer(this.model);
                this.templateData.playerSelected = this.model.attributes;

                console.log(this.templateData);
                this.$el.html(this.template(this.templateData));

                this.$el.show();
                App.playerSelected.set('highlighted', 0);
            }
        },

        closeCard: function() {
            this.$el.hide();
            return false;
        },

        addToSquad: function() {
            this.closeCard();
            var response = App.usersTeamCollection.addPlayerToCollection(this.model);
            console.log(response.message);
            if(response.status == 'fail') {
                
            } else {
                $('#player_profile_' + this.model.cid).addClass('selected');
            }
            return false;
        },

        render: function() {
            this.$el.html(this.template(this.templateData));
            return this;
        }
    });
});
