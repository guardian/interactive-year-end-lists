
require(['jquery'], function( $ ) {

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
            1: $.extend(true, {}, incidents),
            2: $.extend(true, {}, incidents),
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
        };

    function beginMatch(user1Players, user2Players) {

        var users = {
            1: user1Players,
            2: user2Players
        };

        $.each([15, 30, 45, 60, 75, 90], function (index, timePeriod) {

            var endOfPeriodStats = {
                1: $.extend(true, {}, attackDefenseScores),
                2: $.extend(true, {}, attackDefenseScores)
            },
                endOfPeriodPlayers = {
                    1: [],
                    2: []
                };

            $.each(users, function (userID, players) {

                var tStats = $.extend(true, {}, attackDefenseScores),
                    tmStats = $.extend(true, {}, attackDefenseScores);

                $.each(players, function (key, player) {

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
                });

                endOfPeriodStats[userID].attack = (parseInt(tStats.attack, 10) + parseInt(tmStats.attack, 10));
                endOfPeriodStats[userID].defense = (parseInt(tStats.defense, 10) + parseInt(tmStats.defense, 10));
            });

            calculateEndofPeriodScores(timePeriod, endOfPeriodStats, endOfPeriodPlayers);
        });

        return finalStatistics();
    }


    function calculateEndofPeriodScores(timePeriod, endOfPeriodStats, endOfPeriodPlayers) {

        var difAttack = (parseInt(endOfPeriodStats[1].attack, 10) - parseInt(endOfPeriodStats[2].attack, 10)),
            difDefense = (parseInt(endOfPeriodStats[1].defense, 10) - parseInt(endOfPeriodStats[2].defense, 10)),
            endTimeTotal = (difAttack + difDefense),
            incidentTime = randBetween((timePeriod - 15), timePeriod),
            scorer;

        if (endTimeTotal === 0) {

        } else if (endTimeTotal > 0) {
            scorer = chanceFellTo(endOfPeriodPlayers[1]);
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
            scorer = chanceFellTo(endOfPeriodPlayers[2]);
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
    }

    function chanceFellTo(arrPlayers) {
        arrPlayers.sort(sortHighestAttack);
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
    }

    function finalStatistics() {

        // Man of the Match should be a member of the winning team
        if (moments[1].goals.length > moments[2].goals.length) {
            moments.motm = mode(motmArr[1]);
        } else if (moments[2].goals.length > moments[1].goals.length) {
            moments.motm = mode(motmArr[2]);
        } else {
            moments.motm = mode(motmArr[randBetween(1, 2)]);
        }
        moments.stats = {
            possessionHome: randBetween(35, 65),
            cornerHome: randBetween(1, 9),
            cornerAway: randBetween(1, 9),
            foulsHome: randBetween(1, 15),
            foulsAway: randBetween(1, 15),
            offsideHome: randBetween(1, 7),
            offsideAway: randBetween(1, 7),
            shotsOnHome: randBetween(moments[1].goals.length, moments[1].goals.length + 5),
            shotsOnAway: randBetween(moments[2].goals.length, moments[2].goals.length + 5),
            shotsOffHome: randBetween(moments.stats.shotsOnHome, moments.stats.shotsOnHome + 5),
            shotsOffAway: randBetween(moments.stats.shotsOnAway, moments.stats.shotsOnAway + 5)
        };
        return moments;
    }

    function sortHighestAttack(a, b) {
        if (a.attack < b.attack) {
            return -1;
        }
        if (a.attack > b.attack) {
            return 1;
        }
        return 0;
    }

    function randBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function mode(array) {
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