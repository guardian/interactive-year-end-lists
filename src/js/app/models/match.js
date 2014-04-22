define([
    'app',
    'backbone',
    'jquery'
], function (
    App,
    Backbone,
    $
) {
    return Backbone.Model.extend({

        idAttribute: '_id',

        beginMatch: function () {

            var moments = {
                1: {
                    'injuries': [],
                    'goals': [],
                    'missedChance': [],
                    'redCard': [],
                    'yellowCard': []
                },
                2: {
                    'injuries': [],
                    'goals': [],
                    'missedChance': [],
                    'redCard': [],
                    'yellowCard': []
                },
                stats: {
                    cornerHome: 0,
                    cornerAway: 0,
                    foulsHome: 0,
                    foulsAway: 0,
                    offsideHome: 0,
                    offsideAway: 0
                },
                motm: null
            };

            $.each([15, 30, 45, 60, 75, 90], function (timePeriod) {

                var endOfPeriodStats = {
                        1: {
                            'attack': 0,
                            'defense': 0
                        },
                        2: {
                            'attack': 0,
                            'defense': 0
                        }
                    },
                    endOfPeriodPlayers = {
                        1: [],
                        2: []
                    };

                $.each(users, function (userID, players) {

                    var tStats = {
                            'attack': 0,
                            'defense': 0
                        },
                        tmStats = $.extend({}, tStats);

                    $.each(players, function (key, player) {

                        if (player.attack) {

                            var playerEffectedByUnpredictability = false,
                                positiveOrNegativeEffect = true,
                                modified = $.extend({}, tStats),
                                decimalUnpredictability = (player.unpredictability / 100);

                            // Determines if player is even effected by his unpredictability
                            if (Math.random() >= 0.5) {
                                decimalUnpredictability = 0;
                            } else {
                                // Player is effected, good or bad?
                                if (Math.random() >= 0.5) {
                                    // Bad game!
                                    positiveOrNegativeEffect = false;
                                    if (player.starquality >= 18 && Math.random() >= 0.5) {
                                        // Star player given a second chance to redeem
                                        positiveOrNegativeEffect = true;
                                    }
                                }
                            }

                            // Modified stats
                            modified.attack = (player.attack * decimalUnpredictability).toFixed();
                            modified.defense = (player.defense * decimalUnpredictability).toFixed();

                            if (decimalUnpredictability && positiveOrNegativeEffect) {
                                motm[userID].push(player.name);
                            }

                            if (!positiveOrNegativeEffect) {
                                if (Math.random() >= 0.5) {

                                    // Effected both attack and defense
                                    modified.attack = (0 - modified.attack);
                                    modified.defense = (0 - modified.defense);

                                } else {

                                    // Effected only attack or defense
                                    if (Math.random() >= 0.5) {
                                        modified.attack = (0 - modified.attack);
                                    } else {
                                        modified.defense = (0 - modified.defense);
                                    }
                                }
                            }

                            // Total them
                            tStats.attack = parseInt(tStats.attack, 10) + parseInt(player.attack, 10);
                            tStats.defense = parseInt(tStats.defense, 10) + parseInt(player.defense, 10);
                            tmStats.attack = parseInt(tmStats.attack, 10) + parseInt(modified.attack, 10);
                            tmStats.defense = parseInt(tmStats.defense, 10) + parseInt(modified.defense, 10);

                            endOfPeriodPlayers[userID].push({
                                name: player.name,
                                attack: parseInt(player.attack, 10) + parseInt(modified.attack, 10)
                            });
                        }
                    });

                    endOfPeriodStats[userID].attack = (parseInt(tStats.attack, 10) + parseInt(tmStats.attack, 10));
                    endOfPeriodStats[userID].defense = (parseInt(tStats.defense, 10) + parseInt(tmStats.defense, 10));
                });

//                this.calculateEndofPeriodScores(timePeriod, endOfPeriodStats, endOfPeriodPlayers);
            });
        },


        calculateEndofPeriodScores: function (timePeriod, endOfPeriodStats, endOfPeriodPlayers) {

            var difAttack = (parseInt(endOfPeriodStats[1].attack, 10) - parseInt(endOfPeriodStats[2].attack, 10)),
                difDefense = (parseInt(endOfPeriodStats[1].defense, 10) - parseInt(endOfPeriodStats[2].defense, 10)),
                endTimeTotal = (difAttack + difDefense),
                incidentTime = this.randBetween((timePeriod - 15), timePeriod),
                scorer;

            if (endTimeTotal === 0) {

            } else if (endTimeTotal > 0) {
                scorer = this.chanceFellTo(endOfPeriodPlayers[1]);
                if (Math.random() >= 0.5) {
                    moments[1].goals.push({
                        name: scorer,
                        time: incidentTime
                    });
                } else {
                    if (Math.random() >= 0.5) {
                        moments[1].missedChance.push({
                            name: scorer,
                            time: incidentTime
                        });
                    }
                }
            } else {
                scorer = this.chanceFellTo(endOfPeriodPlayers[2]);
                if (Math.random() >= 0.5) {
                    moments[2].goals.push({
                        name: scorer,
                        time: incidentTime
                    });
                } else {
                    if (Math.random() >= 0.5) {
                        moments[2].missedChance.push({
                            name: scorer,
                            time: incidentTime
                        });
                    }
                }
            }
        },

        chanceFellTo: function (arrPlayers) {
            arrPlayers.sort(this.sortHighestAttack);
            var playerChances = [];
            $.each(arrPlayers, function (userID, players) {
                var i = 0,
                    noOfArrayInstances = players.attack;
                while (i !== noOfArrayInstances) {
                    playerChances.push(players.name);
                    i++;
                }
            });
            var idx = Math.floor(Math.random() * playerChances.length);
            return playerChances[idx];
        },

        finalStatistics: function () {

            if (moments[1].goals.length > moments[2].goals.length) {
                moments.motm = this.mode(motm[1]);
            } else if (moments[2].goals.length > moments[1].goals.length) {
                moments.motm = this.mode(motm[2]);
            } else {
                moments.motm = this.mode(motm[this.randBetween(1, 2)]);
            }

            // Random stats
            moments.stats.possessionHome = this.randBetween(35, 65);
            moments.stats.cornerHome = this.randBetween(1, 9);
            moments.stats.cornerAway = this.randBetween(1, 9);
            moments.stats.foulsHome = this.randBetween(1, 15);
            moments.stats.foulsAway = this.randBetween(1, 15);
            moments.stats.offsideHome = this.randBetween(1, 7);
            moments.stats.offsideAway = this.randBetween(1, 7);

            moments.stats.shotsOnHome = this.randBetween(moments[1].goals.length, moments[1].goals.length + 5);
            moments.stats.shotsOnAway = this.randBetween(moments[2].goals.length, moments[2].goals.length + 5);
            moments.stats.shotsOffHome = this.randBetween(moments.stats.shotsOnHome, moments.stats.shotsOnHome + 5);
            moments.stats.shotsOffAway = this.randBetween(moments.stats.shotsOnAway, moments.stats.shotsOnAway + 5);

        },

        sortHighestAttack: function (a, b) {
            if (a.attack < b.attack) {
                return -1;
            }
            if (a.attack > b.attack) {
                return 1;
            }
            return 0;
        },

        randBetween: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },

        mode: function (array) {
            if (array.length === 0) {
                return null;
            }
            var modeMap = {},
                maxEl = array[0],
                maxCount = 1;
            for (var i = 0; i < array.length; i++) {
                var el = array[i];
                if (modeMap[el] === null)
                    modeMap[el] = 1;
                else
                    modeMap[el]++;
                if (modeMap[el] > maxCount) {
                    maxEl = el;
                    maxCount = modeMap[el];
                }
            }
            return maxEl;
        }

    });
});