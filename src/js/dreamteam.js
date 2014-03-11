require.config({
    baseUrl: "js",
    paths: {
        "underscore": "libs/underscore",
        "jquery": "libs/jquery",
        "backbone": "libs/backbone"
    },
});


require(['backbone', 'app/views/page-team'], function(backbone, PageTeamView) {
    var pageTeamView = new PageTeamView();
});