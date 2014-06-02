define([
    'app',
    'backbone',
    'jquery',
    'models/player',
    'data/players'
], function (
    App,
    Backbone,
    $,
    PlayerModel,
    PlayerData
) {
    return Backbone.Collection.extend({

        model: PlayerModel,

        fetchGoogleData: function () {
            // Global jsonp callback
            window.gsS3Callback = this.handleJSONP.bind(this);

            $.ajax({
                url: 'http://interactive.guim.co.uk/spreadsheetdata/0AkRR3zKqdlUHdFE5SjJtS3gyUHF3ZEcwYlF0SHgxbkE.jsonp',
                dataType: 'jsonp'
            });
        },

        handleJSONP: function (_data) {
            var players = _data.sheets['Player data'].filter(function (player) {
                return (player.name && player.name.length > 0);
            });

            App.specialUsers = _data.sheets.teams;
            this.parsePlayers(players);
        },

        fetchLocalData: function () {
            App.specialUsers = PlayerData.teams;
            this.parsePlayers(PlayerData['Player data']);
        },

        parsePlayers: function (_data) {
            _data.map(function (player) {
                player.countrycode = this.getCountryCode(player.countryname);
            }, this);


            this.reset(_data);
            Backbone.trigger('loaded:playerData');
        },

        getCountryCode: function (countryName) {
            var countries = [
                {
                    name: 'Argentina',
                    code: 'AR'
                },
                {
                    name: 'Austria',
                    code: 'AT'
                },
                {
                    name: 'Brazil',
                    code: 'BR'
                },
                {
                    name: 'Belgium',
                    code: 'BE'
                },
                {
                    name: 'Bulgaria',
                    code: 'BG'
                },
                {
                    name: 'Cameroon',
                    code: 'CM'
                },
                {
                    name: 'Chile',
                    code: 'CL'
                },
                {
                    name: 'Croatia',
                    code: 'HR'
                },

                {
                    name: 'Czech Republic',
                    code: 'CZ'
                },
                {
                    name: 'Czechoslovakia',
                    code: 'CZ'
                },
                {
                    name: 'Denmark',
                    code: 'DK'
                },
                {
                    name: 'England',
                    code: 'EN'
                },
                {
                    name: 'France',
                    code: 'FR'
                },
                {
                    name: 'Germany',
                    code: 'DE'
                },
                {
                    name: 'W Germany',
                    code: 'DE'
                },
                {
                    name: 'E Germany',
                    code: 'DD'
                },
                
                {
                    name: 'Hungary',
                    code: 'HU'
                },
                {
                    name: 'Ireland',
                    code: 'IE'
                },
                {
                    name: 'Italy',
                    code: 'IT'
                },
                {
                    name: 'Holland',
                    code: 'NL'
                },
                {
                    name: 'Mexico',
                    code: 'MX'
                },
                {
                    name: 'Peru',
                    code: 'PE'
                },
                {
                    name: 'Poland',
                    code: 'PL'
                },
                {
                    name: 'Portugal',
                    code: 'PT'
                },
                {
                    name: 'Romania',
                    code: 'RO'
                },
                {
                    name: 'Russia',
                    code: 'RU'
                },
                {
                    name: 'Soviet Union',
                    code: 'SU'
                },
                {
                    name: 'Scotland',
                    code: 'SCO'
                },
                {
                    name: 'South Korea',
                    code: 'KP'
                },
                {
                    name: 'Spain',
                    code: 'ES'
                },
                {
                    name: 'Sweden',
                    code: 'SE'
                },
                {
                    name: 'Turkey',
                    code: 'TR'
                },
                {
                    name: 'Yugoslavia',
                    code: 'YU'
                },
                {
                    name: 'Uruguay',
                    code: 'UY'
                }
            ];

            for (var i = 0; i < countries.length; i++) {
                if (countryName.toLowerCase() === countries[i].name.toLowerCase()) {
                    return countries[i].code.toLowerCase();
                }
            }
        }

    });
});
