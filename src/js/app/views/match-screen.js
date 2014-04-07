// Team A vs Team B
define([
    'app',
    'underscore',
    'backbone',
    'views/squad-selection',
    'views/team-rating',
    'text!templates/match-screen.html'
], function(
    App,
    _,
    Backbone,
    PlayerListView,
    TeamRating,
    TeamScreenTemplate
) {
    return Backbone.View.extend({
        
        id: 'match-screen',
        className: 'container',
        template: _.template(TeamScreenTemplate),

        events: {
            'click .start': 'showDivs'
        },

        initialize: function(options) {
        },

        showDivs: function () {
            // If there are hidden divs left
            if($('.moment:hidden').length) {
                // Fade the first of them in
                $('.moment:hidden:last').fadeIn();
                // And wait one second before fading in the next one
                setTimeout(this.showDivs, 1000);
            }
        },

        render: function() {

            var moments = {
                1: { 'time': 85, 'action': 'Goal', 'description': 'But it\'s a bad result now! What a brilliant individual goal! Outstanding!<br>PSG substitute Javier Pastore - a £37m man - takes a throw-in on the dead-ball line. He spins away from Cesar Azpilicueta, evades Frank Lampard with a Chris Waddle-style bodyswerve, does John Terry for pace and then fires in low past Petr Cech at his near post.' },
                2: { 'time': 85, 'action': 'Injury time', 'description': 'Four minutes added on in Paris. Not a bad result for Chelsea, I reckon. A 1-0 win at home and Jose\'s your uncle.' },
                3: { 'time': 85, 'action': 'Great save', 'description': 'Another Real free-kick, another flying save from Roman Weidenfeller! Gareth Bale has his eyes on the prize this time, unleashing a dipper that forces the Dortmund keeper into a fine save again.' },
                4: { 'time': 85, 'action': 'Yellow card', 'description': 'Javi Garcia hacks down Santi Cazorla. Yellow card and an Arsenal free-kick 40 yards from goal...' }
            };

            this.$el.html(this.template({
                username: 'bluedaniel',
                opponent: 'yogibear',
                moments: moments
            }));

            this.showDivs();

            return this;
        }

    });
});
