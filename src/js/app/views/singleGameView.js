define([
    'backbone',
    'underscore',
    'collections/gamesCollection',
    'text!templates/singleGameTemplate.html'
], function(Backbone, _, gamesCollections, templateHTML) {
    'use strict';

    return Backbone.View.extend({
        
        className: 'singlegame',

        template: _.template(templateHTML),

        initialize: function(options) {
            this.model = gamesCollections.findWhere({id: options.gameID});
        },

        render: function() {
            var date = new Date(this.model.get('releaseDate'));
            var templateData = this.model.toJSON();
            templateData.date = date.toString();
            this.$el.html(this.template(templateData));
            return this;
        }
    });
});

