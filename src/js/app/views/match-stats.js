define([
    'app',
    'backbone',
    'underscore',
    'text!templates/match-stats.html'
], function (
    App,
    Backbone,
    _,
    MatchStatsTemplate
) {
    return Backbone.View.extend({

        className: 'match-stats-container',
        
        template: _.template(MatchStatsTemplate),
        
        render: function () {
            if (!this.collection) {
                return;
            }
            this.$el.empty();
            return this;
        }

    });
});
