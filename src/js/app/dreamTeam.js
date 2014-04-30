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
    'views/create-match',
    'models/match',
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
    CreateMatchView,
    MatchModel,
    Routes
) {

    /**
     * Create user model and load Guardian identity toolkit,
     * the toolkit might be R2 or Next-Gen
     */
    App.userDetails = new UserModel();
    App.userDetails.setToolKitObject();

    // Once toolkit is ready
    Backbone.on('toolkitReady', function () {

        // Automatic login
        App.userDetails.checkUserStatus();

        App.viewingPlayer = new UserModel();
        App.player1 = new UserModel();
        App.player2 = new UserModel();

        // Variables for listeners
        App.playerSelected = new Backbone.Model(); // Opens the player modal
        App.visualPrompt = new Backbone.Model(); // Shows a prompt to the user (loading etc)

        // Collections
        App.playerCollection = new PlayersCollection();

        // TODO: Switch from Google spreadsheet
        App.playerCollection.fetchGoogleData();
        // App.playerCollection.fetchLocalData();

        App.matchModel = new MatchModel();
        App.createMatch = new CreateMatchView();

        // Once user and player data is loaded
        Backbone.on('dataReady', function () {

            App.usersTeamCollection = new TeamCollection();
            App.viewingPlayerTeamCollection = new TeamCollection();
            App.player1TeamCollection = new TeamCollection();
            App.player2TeamCollection = new TeamCollection();

            // Load the current users team
            App.userDetails.fetchUserTeamFromStorage();

            // Views
            App.userView = new UserView();
            App.squadView = new SquadView({
                collection: App.playerCollection
            });
            App.matchView = new MatchView();

            // Setup routing
            App.appRoutes = new Routes();
            Backbone.history.start();
        });

    });

    // Add CSS
    $('head').append('<link rel="stylesheet" href="@@assetPathcss/vendor.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="@@assetPathcss/main.css" type="text/css" />');

    /**
     * Bootstrap loader
     * @param  {element} el DOM element provided from the page ie. <figure>
     */
    function boot(el, config) {
        App.$el = $(el);
    }

    return {
        boot: boot
    };

});