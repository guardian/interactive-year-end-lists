define([
    'backbone'
], function(
    Backbone
) {
    return Backbone.Model.extend({

        defaults: {
            name: null,
            imageSrc: null,
            position: null,
            country: null,
            careerStart: null,
            careerEnd: null
        }

    });
});