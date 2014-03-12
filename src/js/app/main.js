define([
    'backbone',
    'views/page-team',
    'routes'
], function(
    Backbone,
    PageTeamView,
    Routes
) {
    var pageTeamView = new PageTeamView();


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
