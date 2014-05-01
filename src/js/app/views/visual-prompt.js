define([
    'app',
    'underscore',
    'backbone',
    'text!templates/visual-prompt.html'
], function (
    App,
    _,
    Backbone,
    VisualPromptTemplate
) {
    return Backbone.View.extend({

        className: 'visual-prompt',
        template: _.template(VisualPromptTemplate),

        /**
         * This displays a message to the user.
         *
         * Example usage:
         *
            App.visualPrompt.set({
                'message': 'You must be logged in to perform that action',
                'closePrompt': true
            });
         *
         */
        initialize: function () {
            App.visualPrompt.on('change', this.render, this);
        },

        events: {
            'click #closePrompt': 'closePrompt'
        },

        closePrompt: function () {
            App.visualPrompt.set({
                'message': null,
                'closePrompt': null
            });
        },

        render: function () {
            this.$el.append(this.template({
                message: App.visualPrompt.get('message'),
                closePrompt: App.visualPrompt.get('closePrompt')
            }));
            return this;
        }

    });
});