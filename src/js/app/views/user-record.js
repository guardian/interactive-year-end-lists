define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'text!templates/user-record.html'
], function (
    App,
    $,
    Backbone,
    _,
    UserRecordTemplate
) {
    return Backbone.View.extend({

        id: 'game-history',
        template: _.template(UserRecordTemplate),

        initialize: function (options) {
            this.options = options || {};
            this.templateData = {
                record: null
            };

            App.resultsModel.on('change', this.render, this);
        },

        // 1 => 1, 1.454 => 1.45, 0 => 0
        formatToDecimal: function (num) {
            return Math.round(num * 100) / 100;
        },

        render: function () {
            this.templateData = {
                record: App.resultsModel.toJSON() 
            };
            this.$el.empty();
            this.$el.append(this.template(this.templateData));
            return this;
        }

    });
});
