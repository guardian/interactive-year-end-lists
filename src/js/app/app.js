define([
    'backbone',
    'jquery'
], function (
    Backbone,
    $
) {
    // Mediator
    var app = {
        SMALL_SCREEN_WIDTH: 480,
        ready: false,
        userDataReady: false,
        playerDataReady: false,
        useDebugUser: '@@useDebugUser',
        useLocalEndpoint: '@@useLocalEndpoint',
        localEndpoint: 'http://localhost:3000/',
        remoteEnpoint: 'http://ec2-54-195-231-244.eu-west-1.compute.amazonaws.com/',
        publicURL: 'http://www.theguardian.com/XXXXXXXXXXXXXXXX/interactive/PATH/'
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

    app.logError = function(errObj) {
        console.error(errObj.msg, errObj.err);  
    };

    app.handleResize = function() {
        var width = $(document).width();
        Backbone.trigger('resize', width);
    };

    app.updatePageState = function(state) {
        app.pageState = state;
    };

    Backbone.on('pageStateChange', app.updatePageState);
    Backbone.on('loaded:userData', app.loadedUserData);
    Backbone.on('loaded:playerData', app.loadedPlayerData);
    Backbone.on('ERROR', app.logError);

    return app;
});
