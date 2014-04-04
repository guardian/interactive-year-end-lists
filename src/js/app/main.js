define([
    'app',
    'jquery',
    'backbone',
    'collections/team',
    'views/team-screen',
    'views/match-screen',
    'data/players',
    'routes'
], function(
    App,
    $,
    Backbone,
    TeamCollection,
    TeamScreenView,
    MatchScreenView,
    PlayerData,
    Routes
) {

    // Models
    App.player = new Backbone.Model();
    App.opponent = new Backbone.Model();

    App.playerSelected = new Backbone.Model();

    // Collections
    App.playerCollection = new Backbone.Collection(PlayerData);
    App.usersTeamCollection = new TeamCollection();
    App.opponentTeamCollection = new TeamCollection();

    // Views
    App.teamView = new TeamScreenView({ collection: App.playerCollection });
    App.matchView = new MatchScreenView();

    $('head').append('<link rel="stylesheet" href="http://interactive.guim.co.uk/next-gen/football/ng-interactive/football-test-1/vendor.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="http://interactive.guim.co.uk/next-gen/football/ng-interactive/football-test-1/main.css" type="text/css" />');

    // Get current user details
    App.userDetails = null;

    function autoLogin() {
        require(["common/modules/identity/api"], function(api) { 
            var loggedIn = api.getUserFromCookie();
            
            console.log(loggedIn);

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
            return {
                boot: boot
            };
        });
    }
    autoLogin();

    /**
     * Bootstrap loader
     * @param  {element} el DOM element provided from the page ie. <figure>
     */
    function boot(el) {
        // Store DOM target
        App.$el = $(el);

        // Setup routing
        var appRoutes = new Routes();
        Backbone.history.start();
    }

    console.log('Boot!');
    return {
        boot: boot
    };

});
