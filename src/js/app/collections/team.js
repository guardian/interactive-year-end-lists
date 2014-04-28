define([
    'app',
    'backbone',
    'models/player',
    'models/user'
], function (
    App,
    Backbone,
    PlayerModel
) {
    return Backbone.Collection.extend({

        model: PlayerModel,

        validateAddingPlayer: function (model) {
            var res = {
                status: 'fail',
                message: ''
            };

            // Cannot already be in squad
            if (!App.usersTeamCollection.contains(model)) {

                // Cant have more than 11 players
                if ((App.usersTeamCollection.length) <= 11) {
                    res.status = 'success';
                } else {
                    res.message = 'Cant have more than 11 players!';
                }
            } else {
                res.message = model.get('name') + ' is aleady in your squad!';
            }
            return res;
        },


        addPlayerToCollection: function (model, forcePosition) {

            if (forcePosition) {

                if (App.usersTeamCollection.contains(model)) {
                    this.removePlayerFromCollection(model, true);
                }

                this.removePlayerFromCollection(App.usersTeamCollection.findWhere({
                    'wantedPosition': forcePosition
                }), true);
                model.set('wantedPosition', forcePosition);
            }

            var res = this.validateAddingPlayer(model);
            if (res.status === 'success') {
                if (_.contains(['ST', 'MC', 'CB'], model.get('wantedPosition'))) {
                    if (App.usersTeamCollection.where({
                            'wantedPosition': model.get('wantedPosition')
                        }).length) {
                        model.set('wantedPosition', model.get('wantedPosition') + '2');
                    }
                }
                App.usersTeamCollection.add(model);
                App.userDetails.saveUserTeamToStorage();
            }
            return res;
        },

        removePlayerFromCollection: function (model, skipSave) {
            skipSave = typeof skipSave !== 'undefined' ? skipSave : false;

            if (model) {
                model.unset('wantedPosition', {
                    silent: true
                });
                App.usersTeamCollection.remove(model);

                if (skipSave) {
                    return;
                }
                App.userDetails.saveUserTeamToStorage();
            }
        },

        removeAllPlayersFromCollection: function () {
            App.usersTeamCollection.reset([]);
            App.userDetails.saveUserTeamToStorage();
        }

    });
});