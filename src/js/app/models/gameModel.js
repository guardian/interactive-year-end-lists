define([
    'backbone'
], function(
    Backbone
) {
    'use strict';

    return Backbone.Model.extend({
        
        defaults: {
            name: '',
            releaseDate: new Date(),
            publisher: ''
        }

    });
});

