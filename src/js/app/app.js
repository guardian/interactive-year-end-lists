define([
    'backbone'
], function (
    Backbone
) {
    // Mediator
    var app = {
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
            console.log('Loaded: All required data');
            Backbone.trigger('dataReady');
        }
    };

    app.loadedUserData = function () {
        console.log('Loaded: user data');
        app.userDataReady = true;
        app.checkIfReady();
    };

    app.loadedPlayerData = function () {
        console.log('Loaded: player data');
        app.playerDataReady = true;
        app.checkIfReady();
    };

    Backbone.on('loaded:userData', app.loadedUserData);
    Backbone.on('loaded:playerData', app.loadedPlayerData);

    return app;
});
