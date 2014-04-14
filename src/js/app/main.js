define([
    'app',
    'jquery',
    'backbone',
    'models/user',
    'collections/team',
    'collections/players',
    'views/user',
    'views/squad',
    'views/match',
    'views/find',
    'routes'
], function (
    App,
    $,
    Backbone,
    UserModel,
    TeamCollection,
    PlayersCollection,
    UserView,
    SquadView,
    MatchView,
    FindView,
    Routes
) {
    // Models
    App.userDetails = new UserModel();
    App.userDetails.checkUserStatus();

    App.viewingPlayer = new UserModel();
    App.player1 = new UserModel();
    App.player2 = new UserModel();

    // Variables for listeners
    App.playerSelected = new Backbone.Model(); // Opens the player card
    App.visualPrompt = new Backbone.Model(); // Shows a prompt to the user (loading etc)

    // Collections
    App.playerCollection = new PlayersCollection();

    App.playerCollection.fetchGoogleData();
    //App.playerCollection.fetchLocal(); // TODO: Enable in prod

    Backbone.on('dataReady', function () {

        console.log('All done. Render all');
        App.usersTeamCollection = new TeamCollection();
        App.viewingPlayerTeamCollection = new TeamCollection();
        App.player1TeamCollection = new TeamCollection();
        App.player2TeamCollection = new TeamCollection();

        App.userDetails.fetchUserTeamFromStorage();

        // Views
        App.userView = new UserView();
        App.squadView = new SquadView({
            collection: App.playerCollection
        });
        App.matchView = new MatchView();
        App.findView = new FindView();

        // Setup routing
        App.appRoutes = new Routes();
        Backbone.history.start();

    });

    //    $('head').append('<link rel="stylesheet" href="http://interactive.guim.co.uk/next-gen/football/ng-interactive/football-test-1/vendor.css" type="text/css" />');
    //    $('head').append('<link rel="stylesheet" href="http://interactive.guim.co.uk/next-gen/football/ng-interactive/football-test-1/main.css" type="text/css" />');

    /**
     * Bootstrap loader
     * @param  {element} el DOM element provided from the page ie. <figure>
     */
    function boot(el) {
        App.$el = $(el);
    }

    return {
        boot: boot
    };

});
