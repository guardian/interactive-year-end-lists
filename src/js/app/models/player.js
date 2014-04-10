define([
    'backbone'
], function (
    Backbone
) {
    return Backbone.Model.extend({

        defaults: {
            uid: null,
            name: null,
            imageSrc: null,
            position: null,
            countryname: null,
            careerStart: null,
            careerEnd: null,

            selected: false,
            active: false
        }

    });
});