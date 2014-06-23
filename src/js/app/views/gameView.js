define([
    'backbone',
    'underscore',
    'text!templates/gameTemplate.html'
], function(
    Backbone,
    _,
    template
) {
    'use strict';
    return Backbone.View.extend({
        
        template: _.template(template),

        className: 'game',

        tag: 'div',

        render: function() {
            var templateDate = this.model.toJSON();
            var date = new Date(this.model.get('publishedDate'));
            templateDate.date = date.toString();
            this.$el.html(this.template(templateDate));
            return this;
        }
    });
});

