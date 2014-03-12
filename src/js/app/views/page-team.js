define(['backbone'], function(Backbone) {
    return Backbone.View.extend({

        render: function() {
            this.$el.html('<p>Hello world. I\'m a backbone required view.</p>');
            return this;
        }

    });
});
