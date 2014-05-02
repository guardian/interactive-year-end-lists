define([
    'app',
    'backbone',
    'text!templates/header.html'
], function (
    App,
    Backbone,
    HeaderTemplate
) {
    return Backbone.View.extend({
        className: 'dreamteam-header',
        
        template: _.template(HeaderTemplate),

        events: {
            
        },

        render: function () {

            // console.log(App.userDetails);

            var templateHTML = this.template({
                message: 'TESTING',
                username: App.userDetails.get('username'),
                userID: App.userDetails.get('guardianID')
            });


            this.$el.html(templateHTML);
            App.$el.prepend(this.el);
            return this;
        }
    });
});

