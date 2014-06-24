define([
    'backbone',
    'underscore',
    'routes',
    'text!templates/headerTemplate.html'
], function(Backbone, _, routes, templateHTML) {
    'use strict';

    return Backbone.View.extend({

        tagName: 'header',
        
        className: 'header',

        template: _.template(templateHTML),

        initialize: function() {
            // Listen to routes
            routes.on('route:default', this.setDefault, this);
            routes.on('route:singleGame', this.setSingleGame, this);
            routes.on('route:catalogue', this.setCatalogue, this);
        },

        setDefault: function() {
            console.log('here');
           this.$links.removeClass('active');
           this.$home.addClass('active');
        },

        setSingleGame: function() {
           this.$links.removeClass('active');
           this.$single.addClass('active');
        },

        setCatalogue: function() {
           this.$links.removeClass('active');
           this.$catalogue.addClass('active');
        },

        render: function() {
            this.$el.html(this.template());
            this.$links = this.$('.link');
            this.$home = this.$('.link_home'); 
            this.$catalogue = this.$('.link_catalogue'); 
            this.$single = this.$('.link_single'); 
            return this;
        }
    });
});

