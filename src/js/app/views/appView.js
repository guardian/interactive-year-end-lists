define([
    'backbone',
    'underscore',
    'routes',
    'text!templates/appTemplate.html'
], function(
    Backbone,
    _,
    routes,
    template
) {
    'use strict';

    return Backbone.View.extend({

        className: 'guInteractive',

        template: _.template(template),
        
        events: {

        },

        initialize: function() {
            // Listen to routes
            /*
            routes.on('route:default', this.defaultRender, this);
            routes.on('route:catalogue', this.catalogueRender, this);
            routes.on('route:singleGame', this.singleGameRender, this);
            */
        },

        defaultRender: function() {
            var introView = new IntroView();
            this.$container.html(introView.render().el);
        },

        catalogueRender: function() {
            var catalogueView = new CatalogueView();
            this.$container.html(catalogueView.render().el);
        },

        singleGameRender: function(gameID) {
            var singleGameView = new SingleGameView({ gameID: gameID });
            this.$container.html(singleGameView.render().el);
        },

        render: function() {
            // Render template
            this.$el.html(this.template());
            
            // Store DOM reference
            this.$container = this.$('.container');
            return this;
        }
    });
});

