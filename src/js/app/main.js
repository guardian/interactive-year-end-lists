'use strict';

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

    // Collections
    App.usersTeamCollection = new TeamCollection(new Array(11));
    App.opponentTeamCollection = new TeamCollection();
    App.playerCollection = new Backbone.Collection(PlayerData);

    // Views
    App.teamView = new TeamScreenView({ collection: App.playerCollection });
    App.matchView = new MatchScreenView();
    
    function init() {
        // Store DOM target
        App.$el = $(window.GUI.el);

        // Setup routing
        var appRoutes = new Routes();
        Backbone.history.start();
    }


    init();
});

