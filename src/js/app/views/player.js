define([
    'backbone',
    'text!templates/player_profile.html'
], function(
    Backbone,
    playerTemplate
){

    return Backbone.View.extend({
        render: function() {
            this.el.innerHTML = playerTemplate;
            return this;
        }
    });
});
