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
    'views/notification',
    'views/header',
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
    NotificationView,
    HeaderView,
    MatchModel,
    Routes
) {
    
    function init() {
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

        // Collections
        App.playerCollection = new PlayersCollection();

        // TODO: Switch from Google spreadsheet
        App.playerCollection.fetchGoogleData();
        // App.playerCollection.fetchLocalData();

        App.matchModel = new MatchModel();
        App.createMatch = new CreateMatchView();
        App.header = new HeaderView();

        // Once user and player data is loaded
        Backbone.on('dataReady', function () {
            
            App.usersTeamCollection = new TeamCollection();
            App.viewingPlayerTeamCollection = new TeamCollection();
            App.player1TeamCollection = new TeamCollection();
            App.player2TeamCollection = new TeamCollection();
            // Load the current users team
            App.userDetails.fetchUserTeamFromStorage();

            App.$el.prepend(App.header.render().el);

            // Setup routing
            App.appRoutes = new Routes();
            Backbone.history.start();
        });

    });

    }

    // Add CSS
    $('head').append('<link rel="stylesheet" href="@@assetPathcss/vendor.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="@@assetPathcss/main.css" type="text/css" />');

    /**
     * Bootstrap loader
     * @param  {element} el DOM element provided from the page ie. <figure>
     */
    function boot(el, config) {

        /**
         * App.$el is the superView, add Error messages, intros etc.
         * App.superView is used in the router to render top level pages.
         */
        App.$el = $(el);
        
        App.$el.html('<div id="dream-team-interactive"></div>');
        App.superView = App.$el.find('#dream-team-interactive');
        App.notify = new NotificationView();
        App.$el.prepend(App.notify.render().el);

        init();
    }

    return {
        boot: boot
    };

});
