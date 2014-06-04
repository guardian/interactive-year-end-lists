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

            Backbone.on('player_clicked', this.blurPlayers, this);
            Backbone.on('playercard_closed', this.unblurPlayers, this);
            App.playerCollection.on('reset', this.updateSquadListViews, this);

            App.userDetails.on('change', this.handleSquadChange, this);
            Backbone.on('position_clicked', this.showPlayers, this);
            Backbone.on('resize', this.updateOnResize, this);
            this.model.on('change', this.updateSquadListViews, this);

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

        updateOnResize: function() {
            if (App.isSmallScreen() === false) {
                this.$el.removeAttr('style');
            }
        },

        handleSquadChange: function() {
            this.$('.playerlist-header').html('Select 11 players to begin');
            
            if (App.isSmallScreen()) {
               this.hidePlayers();
               return;
            }

            this.updateSquadListViews();
        },

        blurPlayers: function(model){
            this.$('#player_list').addClass('isDragging');
        },

        unblurPlayers: function(){
            this.$('#player_list').removeClass('isDragging');
        },

        hidePlayers: function(){
            this.$el.hide();
            this.squadModalView.$el.hide();
            Backbone.trigger('players_closed');
        },

        showPlayers: function(details) {
            if (details.positionName === 'all') {
                this.$('.playerlist-header').html('Select 11 players to begin');
            } else { 
                this.$('.playerlist-header').html('Click on a player to select him for this position');
            }

            var positionCode = details.positionName.toUpperCase();
            var positionName = 'all';

            if (positionCode.match(/LM|CM|RM/gi)) {
                positionName = 'Midfield';
            }
            
            if (positionCode.match(/ST/gi)) {
                positionName = 'Attack';
            }

            if (positionCode.match(/LB|CB|RB/gi)) {
                positionName = 'Defence';
            }
            
            if (positionCode.match(/GK/gi)) {
                positionName = 'Goalkeeper';
            }

            // Set filter to selection pitch position
            this.$('#players_position').val(positionName).change();

            if (!App.isSmallScreen()) {
                return;
            }

            this.updateSquadListViews();
            this.$el.show();
            var marginTop = (this.$el.offset().top - details.y) * -1;
            this.$el.css('margin-top', details.y * -1);
            this.$('.up-arrow').css('left', details.x - 40);
        },

        setNavigationPosition: function () {
            if (!this.navigationPosition || this.windowSize) {
                if ($('#squad-filters').length) {
                    this.navigationPosition = $('#squad-filters').offset().top - 10;
                }
                this.windowSize = 0;
            }
            

            if (this.navigationPosition) {
                //$('.viewSquad').toggleClass('viewSquad-show', $(document).scrollTop() >= this.navigationPosition);
                //$('#squad-filters form').toggleClass('squad-filters-fixed', $(document).scrollTop() >= this.navigationPosition);
                $('#squad-pitch').toggleClass('fix-right', $(document).scrollTop() >= this.navigationPosition);
                
                //$('#squad-pitch-inner').css('width', $('#squad-pitch').width());
            }
        },

        createFilterOptions: function () {
            var countries = [];
            var positions = [];
            var filterOptions = {};

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
            var modelValues = this.model.toJSON();
            var whereQuery = {};
            var i = 0;
            var playersFiltered = App.playerCollection;

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
            playerListContainer.html(domContainer);
        },

        render: function () {
            this.$el.empty();
            this.$el.append(this.template(this.templateData));
            this.renderSquadListViews();
            
            this.squadModalView = new SquadModalView();
            this.$('.modalWrapper').append(this.squadModalView.render().el);

            return this;
        }

    });
});
