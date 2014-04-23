
module.exports = {

    beginMatch: function (user1Players, user2Players) {

        'use strict';

        var attackDefenseScores = {
                'attack': 0,
                'defense': 0
            },
            incidents = {
                injuries: [],
                goals: [],
                missedChance: [],
                redCard: [],
                yellowCard: []
            },
            moments = {
                1: JSON.parse(JSON.stringify(incidents)),
                2: JSON.parse(JSON.stringify(incidents)),
                stats: {
                    possessionHome: 0,
                    cornerHome: 0,
                    cornerAway: 0,
                    foulsHome: 0,
                    foulsAway: 0,
                    offsideHome: 0,
                    offsideAway: 0,
                    shotsOnHome: 0,
                    shotsOnAway: 0,
                    shotsOffHome: 0,
                    shotsOffAway: 0
                },
                motm: null
            },
            motmArr = {
                1: [],
                2: []
            },
            users = {
                1: user1Players,
                2: user2Players
            };

        [15, 30, 45, 60, 75, 90].forEach(function (timePeriod) {

            var endOfPeriodStats = {
                1: JSON.parse(JSON.stringify(attackDefenseScores)),
                2: JSON.parse(JSON.stringify(attackDefenseScores))
            },
                endOfPeriodPlayers = {
                    1: [],
                    2: []
                };

            for (var userID in users) {
                var players = users[userID];

                var tStats = JSON.parse(JSON.stringify(attackDefenseScores)),
                    tmStats = JSON.parse(JSON.stringify(attackDefenseScores));

                for (var key in players) {
                    var player = players[key];

                    var playerEffectedByUnpredictability = false,
                        positiveOrNegativeEffect = true,
                        modified = JSON.parse(JSON.stringify(tStats)),
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
                        motmArr[userID].push(player.name);
                    }

                    if (!positiveOrNegativeEffect) {
                        if (Math.random() >= 0.5) {

                            // Effected both attack and defense
                            modified.attack = -modified.attack;
                            modified.defense = -modified.defense;

                        } else {

                            // Effected only attack or defense
                            if (Math.random() >= 0.5) {
                                modified.attack = -modified.attack;
                            } else {
                                modified.defense = -modified.defense;
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

                endOfPeriodStats[userID].attack = (parseInt(tStats.attack, 10) + parseInt(tmStats.attack, 10));
                endOfPeriodStats[userID].defense = (parseInt(tStats.defense, 10) + parseInt(tmStats.defense, 10));
            }

            moments = module.exports.calculateEndofPeriodScores(moments, timePeriod, endOfPeriodStats, endOfPeriodPlayers);
        });

        return this.finalStatistics(moments, motmArr);
    },


    calculateEndofPeriodScores: function (moments, timePeriod, endOfPeriodStats, endOfPeriodPlayers) {

        var difAttack = (parseInt(endOfPeriodStats[1].attack, 10) - parseInt(endOfPeriodStats[2].attack, 10)),
            difDefense = (parseInt(endOfPeriodStats[1].defense, 10) - parseInt(endOfPeriodStats[2].defense, 10)),
            endTimeTotal = (difAttack + difDefense),
            incidentTime = module.exports.randBetween((timePeriod - 15), timePeriod),
            scorer;

        if (endTimeTotal === 0) {

        } else if (endTimeTotal > 0) {
            scorer = module.exports.chanceFellTo(endOfPeriodPlayers[1]);
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
            scorer = module.exports.chanceFellTo(endOfPeriodPlayers[2]);
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
        return moments;
    },

    chanceFellTo: function (arrPlayers) {
        arrPlayers.sort(module.exports.sortHighestAttack);
        var playerChances = [];

        for (var key in arrPlayers) {
            var players = arrPlayers[key],
                i = 0,
                noOfArrayInstances = players.attack;
            while (i !== noOfArrayInstances) {
                playerChances.push(players.name);
                i++;
            }
        }
        var idx = Math.floor(Math.random() * playerChances.length);
        return playerChances[idx];
    },

    finalStatistics: function (moments, motmArr) {

        // Man of the Match should be a member of the winning team
        if (moments[1].goals.length > moments[2].goals.length) {
            moments.motm = module.exports.mode(motmArr[1]);
        } else if (moments[2].goals.length > moments[1].goals.length) {
            moments.motm = module.exports.mode(motmArr[2]);
        } else {
            moments.motm = module.exports.mode(motmArr[module.exports.randBetween(1, 2)]);
        }
        moments.stats = {
            possessionHome: module.exports.randBetween(35, 65),
            cornerHome: module.exports.randBetween(1, 9),
            cornerAway: module.exports.randBetween(1, 9),
            foulsHome: module.exports.randBetween(1, 15),
            foulsAway: module.exports.randBetween(1, 15),
            offsideHome: module.exports.randBetween(1, 7),
            offsideAway: module.exports.randBetween(1, 7),
            shotsOnHome: module.exports.randBetween(moments[1].goals.length, moments[1].goals.length + 5),
            shotsOnAway: module.exports.randBetween(moments[2].goals.length, moments[2].goals.length + 5),
            shotsOffHome: module.exports.randBetween(moments.stats.shotsOnHome, moments.stats.shotsOnHome + 5),
            shotsOffAway: module.exports.randBetween(moments.stats.shotsOnAway, moments.stats.shotsOnAway + 5)
        };
        return moments;
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

};