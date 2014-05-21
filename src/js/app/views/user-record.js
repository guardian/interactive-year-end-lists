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
        },

        // 1 => 1, 1.454 => 1.45, 0 => 0
        formatToDecimal: function (num) {
            return Math.round(num * 100) / 100;
        },

        render: function () {
            if (this.options.userID) {
                $.ajax({
                    // FIXME: Use config for url
                    url: App.getEndpoint() + 'results/' + this.options.userID
                }).done(function (data) {
                    this.templateData = {
                        record: data
                    };
                    this.$el.empty();
                    this.$el.append(this.template(this.templateData));
                    return this;
                }.bind(this));
            }
            // console.log(this);
            return this;
        }

    });
});
