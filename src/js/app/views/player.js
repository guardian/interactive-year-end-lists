define([
    'underscore',
    'backbone',
    'text!templates/player-profile.html'
], function(
    _,
    Backbone,
    playerTemplate
){

    return Backbone.View.extend({
        tagName: 'div',
        className: 'player_profile',

        events: {
            'click': 'clickHandler'
        },

        initialize: function() {
            this.template = _.template(playerTemplate);
        },

        clickHandler: function() {
            this.model.set('selected', !this.model.get('selected'));
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
});
