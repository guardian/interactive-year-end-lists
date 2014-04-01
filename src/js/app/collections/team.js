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
            
            // Cant have more than 4 players
            if((App.usersTeamCollection.length + 1) <= 4) {

                // Cant have more than x players in position y
                var allowedPositions = {
                    'Striker' : 2,
                    'Midfield' : 2,
                    'Defender' : 2,
                    'Goalkeeper' : 1
                };
                if((App.usersTeamCollection.where({'position' : model.get('position')}).length + 1) <= allowedPositions[model.get('position')]) {
                    App.usersTeamCollection.add(model);
                    response.status = 'success';
                } else {
					response.message = 'Cant have more than ' + allowedPositions[model.get('position')] + ' ' + model.get('position') + 's';
                }
            } else {
                response.message = 'Cant have more than 4 players!';
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