define([
    'backbone',
    'collections/team',
    'views/page-team',
    'data/players',
    'routes',
    'app'

], function(
    Backbone,
    TeamCollection,
    PageTeamView,
    PlayerData,
    Routes,
    App
) {


    App.usersTeamCollection = new Backbone.Collection();

    var teamCollection = new TeamCollection(PlayerData);
    var usersTeamCollection = new Backbone.Collection.extend();

    var pageTeamView = new PageTeamView({
        collection: teamCollection,
        usersTeamCollection: usersTeamCollection
    });


    /**
     * Bootstrap loader
     * @param  {element} el DOM element provided from the page ie. <figure>
     */
    function boot(el) {
        // Setup routing
        var appRoutes = new Routes();
        Backbone.history.start();

        // Render app into the page
        el.appendChild(pageTeamView.render().el);
    }

    return {
        boot: boot
    };
});
