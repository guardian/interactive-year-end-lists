// Squad selection
define([
    'app',
    'jquery',
    'underscore',
    'backbone',
    'views/squad-list',
    'views/squad-modal',
    'text!templates/squad-filters.html'
], function (
    App,
    $,
    _,
    Backbone,
    SquadListView,
    SquadModalView,
    SquadFiltersTemplate
) {
    return Backbone.View.extend({

        id: 'squad-filters',
        className: 'col-xs-12 col-md-7 col-lg-8',
        template: _.template(SquadFiltersTemplate),

        events: {
            'change select': 'filterChange',
            'click #clearLink': 'clearFilters',
            'click .viewSquad': 'viewSquad',
            'click .hidePlayers': 'hidePlayers'
        },

        initialize: function () {
            this.templateData = this.createFilterOptions();
            this.updateSquadListViews();

            this.listenTo(this.model, 'change', this.updateSquadListViews);
            Backbone.on('position_clicked', this.showPlayers, this);

            /**
             * This code below is to set the select inputs to be fixed position
             * as the user scrolls down
             */
            this.navigationPosition = 0;
            this.windowSize = 0;

            $(window).on('scroll', this.setNavigationPosition);
            $(window).on('resize', function () {
                this.windowSize = window.innerWidth + window.innerHeight;
            });
        },

        hidePlayers: function(){
            this.$el.hide();
            Backbone.trigger('players_closed');
        },

        showPlayers: function(details) {
            if (!App.isSmallScreen()) {
                return;
            }

            this.$el.show();
            var marginTop = (this.$el.offset().top - details.y) * -1;
            this.$el.css('margin-top', details.y * -1);
            this.$('.up-arrow').css('left', details.x - 10);
        },

        setNavigationPosition: function () {
            
            if (!this.navigationPosition || this.windowSize) {
                if ($('#squad-filters').length) {
                    this.navigationPosition = $('#squad-filters').offset().top;
                }
                this.windowSize = 0;
            }
            

            if (this.navigationPosition) {
                //$('.viewSquad').toggleClass('viewSquad-show', $(document).scrollTop() >= this.navigationPosition);
                //$('#squad-filters form').toggleClass('squad-filters-fixed', $(document).scrollTop() >= this.navigationPosition);
                $('#squad-pitch').toggleClass('fix-right', $(document).scrollTop() >= this.navigationPosition);
            }
        },

        createFilterOptions: function () {
            var countries = [],
                positions = [],
                filterOptions = {};

            App.playerCollection.each(function (player) {
                if ($.inArray(player.get('position'), positions) < 0) {
                    positions.push(player.get('position'));
                }
                if ($.inArray(player.get('countryname'), countries) < 0) {
                    countries.push(player.get('countryname'));
                }
            });
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
            this.$el.find('select').each(function (index) {
                if ($(this).val()) {
                    newOptions[$(this).data('filter-name')] = $(this).val();
                }
            });
            this.model.set(newOptions);
        },

        clearFilters: function () {
            this.model.clear();
            this.$el.find('select').val('all');
            return false;
        },

        /**
         * TODO: Era not coded into filters, just position and country.
         */
        updateSquadListViews: function () {
            var modelValues = this.model.toJSON(),
                whereQuery = {},
                i = 0,
                playersFiltered = App.playerCollection;

            for (i in modelValues) {
                if (modelValues[i] && modelValues[i] !== 'all') {
                    whereQuery[i] = modelValues[i];
                }
            }

            this.SquadLists = [];
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

        // Scroll back up to pitch
        viewSquad: function () {

            /**
             * FIXME: This would not be needed if pitch is fixed pos
             */
            $('html, body').animate({
                scrollTop: $('#squad-pitch').offset().top + 2
            }, 1000);
        },

        renderSquadListViews: function () {
            var domContainer = document.createDocumentFragment(),
                playerListContainer = this.$('#player_list');

            if (!_.isEmpty(this.SquadLists)) {
                this.SquadLists.forEach(function (SquadList) {
                    domContainer.appendChild(SquadList.render().el);
                });
            }

            this.$el.toggleClass('showClearFilterButton', _.isEmpty(this.SquadLists));

            playerListContainer.fadeOut('fast', function () {
                playerListContainer.html(domContainer).fadeIn();
            });
        },

        render: function () {
            this.$el.empty();
            this.$el.append(this.template(this.templateData));
            this.renderSquadListViews();

            var squadModalView = new SquadModalView();
            this.$('.modalWrapper').append(squadModalView.render().el);

            if (App.isSmallScreen()) {
                this.$el.hide();
            }
            return this;
        }

    });
});
