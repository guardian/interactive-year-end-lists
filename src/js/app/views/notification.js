define([
    'app',
    'backbone',
    'text!templates/visual-prompt.html'
], function (
    App,
    Backbone,
    VisualPromptTemplate
) {
    return Backbone.View.extend({
        className: 'visual-prompt',
        
        template: _.template(VisualPromptTemplate),

        initilaize: function() {
            this.msg = '';
        },

        events: {
            'click .closePrompt': 'closePrompt'
        },

        showMsg: function(msg) {
            this.msg = msg;
            this.render();
        },

        closePrompt: function () {
            this.remove();
        },

        render: function () {
            this.$el.html(this.template({ message: this.msg }));
            App.$el.prepend(this.el);
            console.trace();
            return this;
        }
    });
});

