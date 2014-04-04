define([
    'app',
    'underscore',
    'backbone',
    'text!templates/visual-prompt.html'
], function(
    App,
    _,
    Backbone,
    VisualPromptTemplate
) {
    return Backbone.View.extend({

        className: 'visual-prompt',
        template: _.template(VisualPromptTemplate),
        
        events: {
            'click #closePrompt': 'closePrompt'
        },

        initialize: function() {
            App.visualPrompt.on('change', this.render, this);
        },

        closePrompt: function() {
            App.visualPrompt.set({
                'message': null,
                'closePrompt' : null
            });
        },

        render: function() {
            this.$el.html(this.template({
                message: App.visualPrompt.get('message'),
                closePrompt: App.visualPrompt.get('closePrompt')
            }));
            return this;
        }

    });
});
