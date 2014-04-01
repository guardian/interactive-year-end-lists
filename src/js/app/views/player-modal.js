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
        className: 'modal',
        template: _.template(ProfileTemplate),

        events: {
            'click button.addToSquad, .removeFromSquad': 'addToSquad',
            'click .close': 'closeCard'
        },

        initialize: function() {
            this.templateData = {"playerSelected": ''};
            App.playerSelected.on('change', this.openCard, this);
        },

        openCard: function() {
            this.model = App.playerCollection.get(App.playerSelected.get('highlighted'));
            this.templateData = {"playerSelected": this.model.attributes};
            this.$el.html(this.template(this.templateData));

            this.$el.show();
        },

        closeCard: function() {
            this.$el.hide();
            return false;
        },

        updateStatus: function() {
            this.$el.toggleClass('selected', App.usersTeamCollection.contains(this.model));
        },

        addToSquad: function() {
            this.closeCard();
            if (App.usersTeamCollection.contains(this.model)) {
                App.usersTeamCollection.remove(this.model);
            } else {
                var response = App.usersTeamCollection.addPlayerToCollection(this.model);
                if(response.status == 'fail') {
                    console.log(response.message);
                }
            }
            return false;
        },

        render: function() {
            this.$el.html(this.template(this.templateData));
            return this;
        }
    });
});
