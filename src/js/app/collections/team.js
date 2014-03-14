define([
    'backbone',
    'models/player'
], function(
    Backbone,
    PlayerModel
) {
    return Backbone.Collection.extend({
        model: PlayerModel,

        // Remote DB
        url: '#'
    });
});