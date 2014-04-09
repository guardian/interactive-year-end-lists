// Squad selection
define([
    'app',
    'underscore',
    'backbone',
    'views/player',
    'text!templates/squad-selection.html'
], function(
    App,
    _,
    Backbone,
    PlayerView,
    SquadSelectionTemplate
) {
    return Backbone.View.extend({

        id: 'squad-selection',
        className: 'col-xs-12 col-sm-8',
        template:  _.template(SquadSelectionTemplate),

        events: {
            'change #player_filters': 'filterChange',
            'click #resetTeam': 'resetTeam'
        },

        initialize: function() {
            this.templateData = this.createFilterOptions();
            this.updatePlayerViews();

            this.navigationPosition = 0;
            this.windowSize = 0;

            $(window).scroll(this.setNavigationPosition);
            $(window).resize(function() { this.windowSize = window.innerWidth + window.innerHeight; });
        },

        setNavigationPosition: function() {
            if(!this.navigationPosition || this.windowSize) {
                if($('#squad-selection').length) {
                    this.navigationPosition = $('#squad-selection').offset().top;
                }
                this.windowSize = 0;
            }
            if(this.navigationPosition) {
                $('#player_filters').toggleClass('player_filters_fixed', $(document).scrollTop() >= this.navigationPosition);
            }
        },

        createFilterOptions: function() {
            var countries = [], positions = [];
            App.playerCollection.each(function(player) {
                if($.inArray(player.get('position'), positions) < 0) {
                    positions.push(player.get('position'));
                }
                if($.inArray(player.get('country'), countries) < 0) {
                    countries.push(player.get('country'));
                }
            });
            var filterOptions = {};
            if(countries) {
                filterOptions.countries = countries.sort();
            }
            if(positions) {
                filterOptions.positions = positions.sort();
            }
            return filterOptions;
        },

        filterChange: function() {
            var filterOptions = {};
            $('#player_filters select').each(function( index ) {
                if($(this).val()) {
                    filterOptions[$(this).data('filter-name')] = $(this).val();
                }
            });
            this.updatePlayerViews(filterOptions);
        },

        resetTeam: function() {
            this.updatePlayerViews();
            $('#player_filters select').val('');
            return false;
        },

        updatePlayerViews: function(filterOptions) {
            this.playerViews = [];
            var playersFiltered = App.playerCollection;
            if(!_.isEmpty(filterOptions)) {
                playersFiltered = App.playerCollection.where(filterOptions);
            }
            playersFiltered.map(function(playerModel) {
                this.playerViews.push(new PlayerView({ model : playerModel }));
            }, this);
            this.renderPlayerViews();
        },

        renderPlayerViews: function() {
            var domContainer = document.createDocumentFragment();
            this.playerViews.forEach(function(playerView ) {
                domContainer.appendChild( playerView.render().el );
            });
            this.$('#player_list').html(domContainer);
        },

        render: function() {
            this.$el.html(this.template(this.templateData));
            this.renderPlayerViews();
            return this;
        }

    });
});
