define([
    'app',
    'jquery',
    'backbone',
    'models/user',
    'collections/team',
    'views/team-screen',
    'views/match-screen',
    'data/players',
    'routes'
], function(
    App,
    $,
    Backbone,
    UserModel,
    TeamCollection,
    TeamScreenView,
    MatchScreenView,
    PlayerData,
    Routes
) {

    App.environment = 'development';

    // Models
    App.userDetails = new UserModel();
    App.userDetails.checkUserStatus();

    App.player = new Backbone.Model();
    App.opponent = new Backbone.Model();

    // Variables for listeners
    App.playerSelected = new Backbone.Model(); // Opens the player card
    App.visualPrompt = new Backbone.Model(); // Shows a prompt to the user (loading etc)

    // Collections
    App.playerCollection = new Backbone.Collection(PlayerData);
    App.usersTeamCollection = new TeamCollection();
    App.opponentTeamCollection = new TeamCollection();

    // Views
    App.teamView = new TeamScreenView({ collection: App.playerCollection });
    App.matchView = new MatchScreenView();

//    $('head').append('<link rel="stylesheet" href="http://interactive.guim.co.uk/next-gen/football/ng-interactive/football-test-1/vendor.css" type="text/css" />');
//    $('head').append('<link rel="stylesheet" href="http://interactive.guim.co.uk/next-gen/football/ng-interactive/football-test-1/main.css" type="text/css" />');

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
