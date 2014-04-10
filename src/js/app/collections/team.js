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
            },
                // Cant have more than x players in position y
                positionsValidation = {
                    'ST': {
                        allowed: 2,
                        name: 'Strikers'
                    },
                    'ML': {
                        allowed: 1,
                        name: 'Left midfielder'
                    },
                    'MR': {
                        allowed: 1,
                        name: 'Right midfielder'
                    },
                    'MC': {
                        allowed: 2,
                        name: 'Centre midfielders'
                    },
                    'RB': {
                        allowed: 1,
                        name: 'Right back'
                    },
                    'LB': {
                        allowed: 1,
                        name: 'Left back'
                    },
                    'CB': {
                        allowed: 2,
                        name: 'Centre backs'
                    },
                    'GK': {
                        allowed: 1,
                        name: 'Goalkeeper'
                    }
                };

            // Cannot already be in squad
            if (!App.usersTeamCollection.contains(model)) {

                // Cant have more than 4 players
                if ((App.usersTeamCollection.length) >= 11) {

                    if ((App.usersTeamCollection.where({
                            'position': model.get('position')
                        }).length + 1) <= positionsValidation[model.get('position')].allowed) {
                        res.status = 'success';
                    } else {
                        res.message = 'Cant have more than ' + positionsValidation[model.get('position')].allowed + ' ' + positionsValidation[model.get('position')].name;
                    }
                } else {
                    res.message = 'Cant have more than 11 players!';
                }
            } else {
                res.message = model.get('name') + ' is aleady in your squad!';
            }
            return res;
        },

        addPlayerToCollection: function (model, saveToStorage) {
            var res = this.validateAddingPlayer(model);
            if (res.status === 'success') {
                App.usersTeamCollection.add(model);
                if (saveToStorage) {
                    App.userDetails.saveUserTeamToStorage();
                }
            }
            return res;
        },

        removePlayerFromCollection: function (model) {
            App.usersTeamCollection.remove(model);
            App.userDetails.saveUserTeamToStorage();
        },

        removeAllPlayersFromCollection: function () {
            App.usersTeamCollection.reset([]);
            App.userDetails.saveUserTeamToStorage();
        }

    });
});