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
    MatchModel,
    Routes
) {


    App.matchModel = new MatchModel();
    App.matchModel.beginMatch();

    // Models
    App.userDetails = new UserModel();
    App.userDetails.setToolKitObject();

    Backbone.on('toolkitReady', function () {

        console.log('Loaded: tookitObject');

        console.log(App.toolkitObj);

        App.userDetails.checkUserStatus(); // Automatic login

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

            // Setup routing
            App.appRoutes = new Routes();
            Backbone.history.start();
        });

    });

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