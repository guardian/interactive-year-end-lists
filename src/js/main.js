define(['backbone', 'app/views/page-team'], function(backbone, PageTeamView) {
    var pageTeamView = new PageTeamView();

    console.log('Set things up');

    function boot(el) {
        el.appendChild(pageTeamView.render().el);
    }

    return {
        boot: boot
    };
});