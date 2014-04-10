// Squad selection
define([
    'app',
    'underscore',
    'backbone',
    'views/squad-list',
    'text!templates/squad-filters.html'
], function (
    App,
    _,
    Backbone,
    SquadListView,
    SquadFiltersTemplate
) {
    return Backbone.View.extend({

        id: 'squad-filters',
        className: 'col-xs-12 col-sm-8',
        template: _.template(SquadFiltersTemplate),

        events: {
            'change select': 'filterChange',
            'click #resetTeam': 'resetTeam'
        },

        initialize: function () {
            this.templateData = this.createFilterOptions();
            this.updateSquadListViews();

            this.listenTo(this.model, 'change', this.updateSquadListViews);

            this.navigationPosition = 0;
            this.windowSize = 0;

            $(window).scroll(this.setNavigationPosition);
            $(window).resize(function () {
                this.windowSize = window.innerWidth + window.innerHeight;
            });
        },

        setNavigationPosition: function () {
            if (!this.navigationPosition || this.windowSize) {
                if ($('#squad-filters').length) {
                    this.navigationPosition = $('#squad-filters').offset().top;
                }
                this.windowSize = 0;
            }
            if (this.navigationPosition) {
                $('#squad-filters form').toggleClass('squad-filters-fixed', $(document).scrollTop() >= this.navigationPosition);
            }
        },

        createFilterOptions: function () {
            var countries = [],
                positions = [];
            App.playerCollection.each(function (player) {
                if ($.inArray(player.get('position'), positions) < 0) {
                    positions.push(player.get('position'));
                }
                if ($.inArray(player.get('country'), countries) < 0) {
                    countries.push(player.get('country'));
                }
            });
            var filterOptions = {};
            if (countries) {
                filterOptions.countries = countries.sort();
            }
            if (positions) {
                filterOptions.positions = positions.sort();
            }
            return filterOptions;
        },

        filterChange: function () {
            var newOptions = {};
            $('#squad-filters select').each(function (index) {
                if ($(this).val()) {
                    newOptions[$(this).data('filter-name')] = $(this).val();
                }
            });
            this.model.set(newOptions);
        },

        resetTeam: function () {
            this.updateSquadListViews();
            $('#squad-filters select').val('');
            return false;
        },

        updateSquadListViews: function () {

            var modelValues = this.model.toJSON();
            var whereQuery = {};
            for (var i in modelValues) {
                if (modelValues[i] && modelValues[i] !== 'all') {
                    whereQuery[i] = modelValues[i];
                }
            }

            this.SquadLists = [];
            var playersFiltered = App.playerCollection;

            if (!_.isEmpty(whereQuery)) {
                playersFiltered = App.playerCollection.where(whereQuery);
            }

            playersFiltered.map(function (playerModel) {
                this.SquadLists.push(new SquadListView({
                    model: playerModel
                }));
            }, this);
            this.renderSquadListViews();

            if (this.model.hasChanged()) {
                $('html, body').animate({

                    // +2 so that it navigation becomes fixed
                    scrollTop: this.$el.offset().top + 2
                }, 1000);
            }
        },

        renderSquadListViews: function () {
            var domContainer = document.createDocumentFragment();
            this.SquadLists.forEach(function (SquadList) {
                domContainer.appendChild(SquadList.render().el);
            });

            var playerListContainer = this.$('#player_list');
            playerListContainer.fadeOut('fast', function () {
                playerListContainer.html(domContainer).fadeIn();
            });
        },

        render: function () {
            this.$el.html(this.template(this.templateData));
            this.renderSquadListViews();
            return this;
        }

    });
});