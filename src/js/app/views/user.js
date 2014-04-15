define([
    'app',
    'backbone',
    'underscore',
    'views/user-find',
    'views/match-lineup',
    'text!templates/user.html'
], function (
    App,
    Backbone,
    _,
    UserFindView,
    MatchLineupView,
    UserTemplate
) {
    return Backbone.View.extend({

        id: 'user-screen',
        className: 'container',
        template: _.template(UserTemplate),

        events: {
            'click #goEdit': 'editSelection',
            'click #playAgainst': 'playAgainst'
        },

        initialize: function () {
            this.listenTo(App.viewingPlayer, 'change', this.render);
            this.listenTo(App.viewingPlayerTeamCollection, 'change', this.render);
            this.templateData = {
                details: null
            };
        },

        editSelection: function () {
            App.appRoutes.navigate('/', { trigger: true });
        },

        playAgainst: function (e) {
            App.appRoutes.navigate('/match/' + App.userDetails.get('guardianID') + '/' + $(e.target).data('guardian-id'), { trigger: true });
        },

        render: function () {

            this.templateData = {
                details: App.viewingPlayer.toJSON(),
                currentUser: App.userDetails.toJSON()
            };
            this.$el.html(this.template(this.templateData));

            var playerArr = [],
                userPitch,
                userFind;

            if (App.viewingPlayer.get('teamSelection')) {
                App.viewingPlayer.get('teamSelection').split(',').map(function (player) {
                    var playerSplit = player.split(':'),
                        playerModel = App.playerCollection.findWhere({
                            'uid': playerSplit[0]
                        });
                    playerModel.set('wantedPosition', playerSplit[1]);
                    if (playerModel) {
                        playerArr.push(playerModel);
                    }
                });
                App.viewingPlayerTeamCollection.reset(playerArr);
                userPitch = new MatchLineupView({
                    collection: App.viewingPlayerTeamCollection
                });
                this.$el.find('#users-team').html(userPitch.render().$el);
            }

            if (App.viewingPlayer.get('guardianID') === App.viewingPlayer.get('guardianID')) {
                userFind = new UserFindView();
                this.$el.find('#users-find').html(userFind.render().$el);
            }
            return this;
        }
    });
});