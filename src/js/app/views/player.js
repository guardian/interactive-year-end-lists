define([
    'app',
    'backbone',
    'underscore',
    'text!templates/player-profile.html'
], function(
    App,
    Backbone,
    _,
    playerTemplate
){

    return Backbone.View.extend({
        tagName: 'div',

        className: 'player_profile',

        template: _.template(playerTemplate),

        events: {
            'click': 'clickHandler'
        },

        initialize: function() {
            this.listenTo(this.model, 'change:selected', this.updateStatus);
        },

        updateStatus: function() {
            this.$el.toggleClass('selected', this.model.get('selected'));
        },

        clickHandler: function() {
            this.model.set('selected', !this.model.get('selected'));
            if (this.model.get('selected')) {
                App.usersTeamCollection.add(this.model);
            } else {
                App.usersTeamCollection.remove(this.model);
            }
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
});
