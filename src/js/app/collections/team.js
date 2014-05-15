define([
    'app',
    'backbone',
    'models/player',
    'models/user',
    'underscore'
], function (
    App,
    Backbone,
    PlayerModel,
    _
) {
    return Backbone.Collection.extend({
        model: PlayerModel,

        populateUsingIDs: function(playerIDs) {
            var playerModels = _.map(playerIDs, function(uid) {
                return App.playerCollection.findWhere({ uid: uid }); 
            });
            this.reset(playerModels);
        },

        removeAllPlayersFromCollection: function () {
            App.usersTeamCollection.reset(Array(11));
        }

    });
});
