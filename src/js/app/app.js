define([
    'backbone',
    'jquery'
], function (
    Backbone,
    $
) {
    // Mediator
    var app = {
        SMALL_SCREEN_WIDTH: 320,
        ready: false,
        userDataReady: false,
        playerDataReady: false,
        useDebugUser: '@@useDebugUser',
        useLocalEndpoint: '@@useLocalEndpoint',
        localEndpoint: 'http://localhost:3000/',
        remoteEnpoint: 'http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/'
    };

    app.getEndpoint = function() {
        return (app.useLocalEndpoint) ? app.localEndpoint : app.remoteEnpoint;
    };

    // Listen for async success events
    app.checkIfReady = function () {
        if (true === app.userDataReady && true === app.playerDataReady) {
            app.ready = true;
            Backbone.trigger('dataReady');
        }
    };

    app.loadedUserData = function () {
        app.userDataReady = true;
        app.checkIfReady();
    };

    app.loadedPlayerData = function () {
        app.playerDataReady = true;
        app.checkIfReady();
    };

    app.isSmallScreen = function() {
        return ($(window).width() <= app.SMALL_SCREEN_WIDTH);
    };

    Backbone.on('loaded:userData', app.loadedUserData);
    Backbone.on('loaded:playerData', app.loadedPlayerData);

    return app;
});
