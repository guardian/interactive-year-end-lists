define([
    'backbone',
    'underscore',
    'routes',
    'text!templates/gameTemplate.html'
], function(
    Backbone,
    _,
    routes,
    template
) {
    'use strict';
    return Backbone.View.extend({
        
        template: _.template(template),

        className: 'game',

        tag: 'div',

        events: {
            'click .title': 'navigate'
        },

        navigate: function() {
            var gameID = this.model.get('id');
            routes.navigate('games/'+gameID, { trigger: true });
        },

        render: function() {
            var templateDate = this.model.toJSON();
            var date = new Date(this.model.get('publishedDate'));
            templateDate.date = date.toString();
            this.$el.html(this.template(templateDate));
            return this;
        }
    });
});

