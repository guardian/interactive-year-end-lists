define([
    'underscore',
    'backbone',
    'text!templates/player_profile.html'
], function(
    _,
    Backbone,
    playerTemplate
){

    return Backbone.View.extend({
        tagName: 'div',
        className: 'player_profile',

        initialize: function() {
            this.template = _.template(playerTemplate);
        },

        render: function() {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
});
