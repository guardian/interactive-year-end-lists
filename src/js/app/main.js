define([
    'views/page-team'
], function(
    PageTeamView
) {
    var pageTeamView = new PageTeamView();

    /**
     * Bootstrap loader
     * @param  {element} el DOM element provided from the page ie. <figure>
     */
    function boot(el) {
       el.appendChild(pageTeamView.render().el);
    }

    return {
        boot: boot
    };
});