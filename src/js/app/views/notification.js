define([
    'app',
    'backbone',
    'text!templates/visual-prompt.html',
    'underscore'
], function (
    App,
    Backbone,
    VisualPromptTemplate,
    _
) {
    return Backbone.View.extend({
        className: 'visual-prompt',
        
        template: _.template(VisualPromptTemplate),

        initialize: function() {
            this.msg = '';
            Backbone.on('ERROR', this.showMsg, this);
        },

        events: {
            'click .closePrompt': 'closePrompt'
        },

        showMsg: function(msgObj) {
            this.$msg.text(msgObj.msg);
            this.$el.show();
        },

        closePrompt: function () {
            this.$el.hide();
        },

        render: function () {
            this.$el.html(this.template());
            this.$msg = this.$('.notifyMsg');
            this.$el.hide();
            return this;
        }
    });
});

