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
        
        template: _.template(TeamScreenTemplate),

        initialize: function(options) {
        },

        render: function() {
            this.$el.html(this.template({
                username: 'bluedaniel',
                opponent: 'yogibear'
            }));
            return this;
        }

    });
});
