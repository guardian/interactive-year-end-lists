// Squad selection
define([
    'app',
    'underscore',
    'backbone',
    'views/squad-list',
    'text!templates/squad-filters.html'
], function(
    App,
    _,
    Backbone,
    SquadListView,
    SquadFiltersTemplate
) {
    return Backbone.View.extend({

        id: 'squad-selection',
        className: 'col-xs-12 col-sm-8',
        template:  _.template(SquadFiltersTemplate),

        events: {
            'change #player_filters': 'filterChange',
            'click #resetTeam': 'resetTeam'
        },

        initialize: function() {
            this.templateData = this.createFilterOptions();
            this.updateSquadListViews();

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
            this.updateSquadListViews(filterOptions);
        },

        resetTeam: function() {
            this.updateSquadListViews();
            $('#player_filters select').val('');
            return false;
        },

        updateSquadListViews: function(filterOptions) {
            this.SquadLists = [];
            var playersFiltered = App.playerCollection;
            if(!_.isEmpty(filterOptions)) {
                playersFiltered = App.playerCollection.where(filterOptions);
            }
            playersFiltered.map(function(playerModel) {
                this.SquadLists.push(new SquadListView({ model : playerModel }));
            }, this);
            this.renderSquadListViews();
        },

        renderSquadListViews: function() {
            var domContainer = document.createDocumentFragment();
            this.SquadLists.forEach(function(SquadList ) {
                domContainer.appendChild( SquadList.render().el );
            });
            this.$('#player_list').html(domContainer);
        },

        render: function() {
            this.$el.html(this.template(this.templateData));
            this.renderSquadListViews();
            return this;
        }

    });
});
