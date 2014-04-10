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
            var response = {
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
                if ((App.usersTeamCollection.length + 1) <= 11) {

                    if ((App.usersTeamCollection.where({
                            'position': model.get('position')
                        }).length + 1) <= positionsValidation[model.get('position')].allowed) {
                        response.status = 'success';
                    } else {
                        response.message = 'Cant have more than ' + positionsValidation[model.get('position')].allowed + ' ' + positionsValidation[model.get('position')].name;
                    }
                } else {
                    response.message = 'Cant have more than 11 players!';
                }
            } else {
                response.message = model.get('name') + ' is aleady in your squad!';
            }
            return response;
        },

        addPlayerToCollection: function(model, saveToStorage) {
			var response = this.validateAddingPlayer(model);
			if(response.status === 'success') {
				App.usersTeamCollection.add(model);
                if(saveToStorage) {
                    App.userDetails.saveUserTeamToStorage();
                }
            }
            return response;
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