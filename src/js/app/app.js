define([
    'backbone'
], function (
    Backbone
) {
    // Mediator
    var app = {
        env: 'dev',
        ready: false,
        userDataReady: false,
        playerDataReady: false
    };

    app.inDevMode = function() {
        return app.env === 'dev';
    };


    // Listen for async success events
    app.checkIfReady = function() {
        if (true === app.userDataReady && true === app.playerDataReady) {
            app.ready = true;
            console.log('Loaded: All required data');
            Backbone.trigger('dataReady');
        }
    };

    app.loadedUserData = function() {
        console.log('Loaded: user data');
        app.userDataReady = true;
        app.checkIfReady();
    };

    app.loadedPlayerData = function() {
        console.log('Loaded: player data');
        app.playerDataReady = true;
        app.checkIfReady();
    };


    Backbone.on('loaded:userData', app.loadedUserData);
    Backbone.on('loaded:playerData', app.loadedPlayerData);

    return app;
});
