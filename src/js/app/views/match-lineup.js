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

            var positionNames = [
                {
                    "name": "GK",
                    "position": "goalkeeper"
                },{
                    "name": "LB",
                    "position": "defence"
                },{
                    "name": "RB",
                    "position": "defence"
                },{
                    "name": "CB",
                    "position": "defence"
                },{
                    "name": "CB",
                    "position": "defence"
                },{
                    "name": "LM",
                    "position": "midfield"
                },{
                    "name": "RM",
                    "position": "midfield"
                },{
                    "name": "CM",
                    "position": "midfield"
                },{
                    "name": "CM",
                    "position": "midfield"
                },{
                    "name": "ST",
                    "position": "attack"
                },{
                    "name": "ST",
                    "position": "attack"
                }
            ];
            
            var usersSquad = App.userDetails.getSquad();
            var data = {
                players: this.collection.toJSON(),
                positionNames: positionNames
            };

            this.$el.empty();
            this.$el.append(this.template(data));
            
            return this;
        }

    });
});
