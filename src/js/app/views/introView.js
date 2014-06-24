define([
    'backbone',
    'underscore',
    'text!templates/introTemplate.html'
], function(Backbone, _, templateHTML) {
    'use strict';

    return Backbone.View.extend({
        
        className: 'intro',

        template: _.template(templateHTML),

        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });
});

