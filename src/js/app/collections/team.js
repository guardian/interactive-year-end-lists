define([
	'app',
    'backbone',
    'models/player'
], function(
	App,
    Backbone,
    PlayerModel
) {
    return Backbone.Collection.extend({
        model: PlayerModel,

        // Remote DB
        url: '#',

        validateAddingPlayer: function(model) {
			var response = { status: 'fail', message: '' };
            
            // Cannot already be in squad
            if (!App.usersTeamCollection.contains(model)) {

                // Cant have more than 4 players
                if((App.usersTeamCollection.length + 1) <= 11) {

                    // Cant have more than x players in position y
                    var allowedPositions = {
                        'ST' : 2,
                        'ML' : 1,
                        'MR' : 1,
                        'MC' : 2,
                        'RB' : 1,
                        'LB' : 1,
                        'CB' : 2,
                        'GK' : 1
                    };
                    if((App.usersTeamCollection.where({'position' : model.get('position')}).length + 1) <= allowedPositions[model.get('position')]) {
                        response.status = 'success';
                    } else {
                        response.message = 'Cant have more than ' + allowedPositions[model.get('position')] + ' ' + model.get('position').toLowerCase() + 's';
                    }
                } else {
                    response.message = 'Cant have more than 11 players!';
                }
            } else {
                response.message = model.get('name') + ' is aleady in your squad!';
            }
            return response;
        },

        addPlayerToCollection: function(model) {
			var response = this.validateAddingPlayer(model);
			if(response.status == 'success') {
				App.usersTeamCollection.add(model);
			}
			return response;
        }

    });
});