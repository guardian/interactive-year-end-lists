define([
    'backbone',
    'underscore',
    'text!templates/headerTemplate.html'
], function(Backbone, _, templateHTML) {
    'use strict';

    return Backbone.View.extend({

        tagName: 'header',
        
        className: 'header',

        template: _.template(templateHTML),

        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
});

