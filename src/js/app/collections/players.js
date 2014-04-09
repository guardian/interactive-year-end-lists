define([
    'app',
    'backbone',
    'jquery',
    'models/player',
    'data/players'
], function(
    App,
    Backbone,
    $,
    PlayerModel,
    PlayerData
) {
    return Backbone.Collection.extend({

        model: PlayerModel,

        fetchGoogleData: function() {
            // Global jsonp callbac
            window.gsS3Callback = this.populateModels.bind(this);

            $.ajax({
                url: 'http://interactive.guim.co.uk/spreadsheetdata/0AkRR3zKqdlUHdFE5SjJtS3gyUHF3ZEcwYlF0SHgxbkE.jsonp',
                dataType: 'jsonp'
            });
        },

        populateModels: function(_data) {
            console.log(_data);
            this.reset(_data);
        },

        fetchLocalData: function() {
            this.reset(PlayerData);
        }
    });
});
