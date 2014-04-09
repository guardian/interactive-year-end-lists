define([
    'backbone',
], function(
    Backbone
) {
    var app = {
        env: 'dev'
    };

    app.isDev = function() {
        return app.env === 'dev';
    };

    return app;
});
