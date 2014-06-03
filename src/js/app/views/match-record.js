define([
    'app',
    'jquery',
    'backbone',
    'underscore',
    'text!templates/match-record.html'
], function (
    App,
    $,
    Backbone,
    _,
    MatchRecordTemplate
) {
    return Backbone.View.extend({

        id: 'match-history',
        template: _.template(MatchRecordTemplate),

        initialize: function (options) {
            this.options = options || {};
            this.templateData = {
                record: null
            };
        },

        /**
         * This is a simpler version mimicking 'user-record.js'
         *
         * Simply shows stats for user1 vs user2
         */
        render: function () {
            console.log('hhhhhhhh');
            if (this.options.userID && this.options.opponentID) {
                var _this = this;
                $.ajax({
                    // FIXME: Use config for url
                    url: App.getEndpoint() + 'results/' + this.options.userID
                }).done(function (data) {
                    if (!data) {
                        return;
                    }
                    _this.templateData = {
                        record: data 
                    };

                    _this.$el.empty();
                    _this.$el.append(_this.template(_this.templateData));
                    return _this;
                });
            }
            return this;
        }

    });
});
