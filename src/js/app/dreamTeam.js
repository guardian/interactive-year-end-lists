define([
    'app',
    'jquery',
    'underscore',
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
    'views/super',
    'models/match',
    'routes'
], function (
    App,
    $,
    _,
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
    SuperView,
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
        App.usersTeamCollection = new TeamCollection();
        App.viewingPlayerTeamCollection = new TeamCollection();
        App.player1TeamCollection = new TeamCollection();
        App.player2TeamCollection = new TeamCollection();


        // TODO: Switch from Google spreadsheet
        App.playerCollection.fetchGoogleData();
        // App.playerCollection.fetchLocalData();

        App.matchModel = new MatchModel();
        App.createMatch = new CreateMatchView();

        // Once user and player data is loaded
        Backbone.on('dataReady', function () {
            // Load the current users team
            App.userDetails.fetchUserTeamFromStorage();
            
            // Listen to window resize and trigger event
            $(window).resize(_.debounce(App.handleResize, 200));

            // Setup routing
            App.appRoutes = new Routes();
            Backbone.history.start();
        });

    });


    // Set view class based on width
    Backbone.on('resize', function() {
        App.$el.toggleClass('narrow-view', App.isSmallScreen());
    }, this);

    }

    // Add CSS
    $('head').append('<link rel="stylesheet" href="@@assetPathcss/vendor.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="@@assetPathcss/main.css" type="text/css" />');

    /**
     * Bootstrap loader
     * @param  {element} el DOM element provided from the page ie. <figure>
     */
    function boot(el, config) {
        init();
        App.$el = $(el);
        App.superView = new SuperView();
        App.$el.html(App.superView.render().el);
    }

    return {
        boot: boot
    };

});
