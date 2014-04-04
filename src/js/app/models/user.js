define([
    'backbone'
], function(
    Backbone
) {
    return Backbone.Model.extend({

        defaults: {
            username: null,
            teamName: null,
            teamSelection: null
        }

    });
});

/*
require(["common/modules/identity/api"], function(api) { 
    var loggedIn = api.getUserFromCookie();

    if(loggedIn) {
        App.userDetails = {
            'username': App.userDetails.displayName,
            'team' : {
                'name' : '50 Shades of O’Shea',
                'preSelected' : [1, 2, 3, 4, 5, 6]
            }
        };
        if(App.userDetails.team.preSelected) {
            App.userDetails.team.preSelected.map(function(playerUID) {
                var playerModel = App.playerCollection.findWhere({'uid':playerUID});
                App.usersTeamCollection.addPlayerToCollection(playerModel);
            });
        }
    }
    console.log('Eek');
    console.log(App.userDetails);
});
*/