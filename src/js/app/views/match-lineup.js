define([
    'app',
    'backbone',
    'underscore',
    'text!templates/match-lineup.html'
], function (
    App,
    Backbone,
    _,
    MatchPitchTemplate
) {
    return Backbone.View.extend({

        className: 'match-pitch-container',
        template: _.template(MatchPitchTemplate),

        render: function () {

            if (!this.collection) {
                return;
            }

            var playerPositions = {
                'ST': {},
                'ST2': {},
                'MR': {},
                'MC': {},
                'MC2': {},
                'ML': {},
                'RB': {},
                'CB': {},
                'CB2': {},
                'LB': {},
                'GK': {}
            };

            this.$el.empty();
            console.log(this.collection.toJSON());
            this.$el.append(this.template({
                players: this.collection.toJSON() 
            }));

            return this;
        }

    });
});
