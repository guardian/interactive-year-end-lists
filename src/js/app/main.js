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

    /*
    // Get current user details
    require(["common/modules/identity/api"], function(api) { 
        App.userDetails = api.getUserFromCookie();
        if(App.userDetails) {
            // Go grab list of ID's and pre-populate team
        } else {
            // New team selection

        }
    });
    */

    // Views
    App.teamView = new TeamScreenView({ collection: App.playerCollection });
    App.matchView = new MatchScreenView();

    var preSelected = [1, 2, 3, 4, 5, 6];
    preSelected.map(function(playerUID) {
        var playerModel = App.playerCollection.findWhere({'uid':playerUID});
        App.usersTeamCollection.addPlayerToCollection(playerModel);
    });

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

    return {
        boot: boot
    };
});
