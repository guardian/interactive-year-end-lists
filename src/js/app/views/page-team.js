define(['backbone'], function(Backbone) {
    return Backbone.View.extend({

        render: function() {
            this.$el.html('<p>Hello</p>');
            return this;
        }

    });
});
