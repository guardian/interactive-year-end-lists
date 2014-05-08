var competitionData = require('./competitionData');

module.exports = (function Match() {
    "use strict";
    var odds = {
        playerEffected: 50,
        playerEffectedBadly: 50,
        chanceConversion: 50,
        redCardGiven: 2
    };

    function getPlayerByID(uid) {
        return competitionData['Player data'].filter(function(player) {
            return player.uid === uid;
        })[0];
    }

    function createResult(user1, user2) {
        console.log(user1);
        var attDef = {
                'attack': 0,
                'defense': 0
            };
        var incidents = {
                injuries: [],
                goals: [],
                missedChance: [],
                redCard: [],
                yellowCard: []
            };
        var moments = {
                1: JSON.parse(JSON.stringify(incidents)),
                2: JSON.parse(JSON.stringify(incidents)),
                stats: {
                    possessionHome: 0,
                    cornerHomePercent: 0,
                    cornerHome: 0,
                    cornerAway: 0,
                    foulsHomePercent: 0,
                    foulsHome: 0,
                    foulsAway: 0,
                    offsideHomePercent: 0,
                    offsideHome: 0,
                    offsideAway: 0,
                    shotsOnHome: 0,
                    shotsOnAway: 0,
                    shotsOffHome: 0,
                    shotsOffAway: 0
                },
                motm: null,
                venue: null,
                time: null
            };

        var  motmArr = {
            1: [],
            2: []
        };
        var users = {
            1: getSquad(user1),
            2: getSquad(user2)
        };

        moments.time = new Date().getTime();

        console.log(users[1].length);

        moments[1].guardianID = user1.guardianID;
        moments[1].username = user1.username;
        moments[1].squad = getSquadIDs(user1);
        moments[2].guardianID = user2.guardianID;
        moments[2].username = user2.username;
        moments[2].squad = getSquadIDs(user2);

        [15, 30, 45, 60, 75, 90].forEach(function (timePeriod) {
            var eopStats = {
                    1: JSON.parse(JSON.stringify(attDef)),
                    2: JSON.parse(JSON.stringify(attDef))
                };
            var eopPlayers = {
                    1: [],
                    2: []
                };
            var userID;
            var key;

            for (userID in users) {
                if (users.hasOwnProperty(userID)) {

                    var players = users[userID];
                    var tStats = JSON.parse(JSON.stringify(attDef));
                    var tmStats = JSON.parse(JSON.stringify(attDef));

                    // Red card generator
                    if (Math.random() <= odds.redCardGiven) {
                        var playerName = fetchMostLikelyOn(players, 'volatility');
                        var idx = arrayObjectIndexOf(players, playerName, 'name');
                        users[userID].splice(idx, 1);

                        moments[userID].redCard.push({
                            name: playerName,
                            time: randBetween((timePeriod - 15), timePeriod)
                        });
                    }

                    for (key in players) {
                        if (players.hasOwnProperty(key)) {
                            var player = players[key];

                            var positiveEffect = true;
                            var modified = JSON.parse(JSON.stringify(attDef));
                            var unpredictability = (player.unpredictability / 100);

                            // Determines if player is even effected by his unpredictability
                            if (Math.random() <= odds.playerEffected) {
                                unpredictability = 0;
                            } else {
                                // Player is effected, good or bad?
                                if (Math.random() <= odds.playerEffectedBadly) {
                                    // Bad game!
                                    positiveEffect = false;
                                    if (player.discipline >= 18 && Math.random() >= 0.5) {
                                        // Disciplined player given a second chance to redeem
                                        positiveEffect = true;
                                    }
                                }
                                // Modified stats
                                modified.attack = (player.attack * unpredictability).toFixed();
                                modified.defense = (player.defense * unpredictability).toFixed();
                            }

                            if (!positiveEffect) {
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

                            if (unpredictability && positiveEffect) {
                                motmArr[userID].push(player.name);
                            }

                            tmStats.attack += (parseInt(player.attack, 10) + parseInt(modified.attack, 10));
                            tmStats.defense += (parseInt(player.defense, 10) + parseInt(modified.defense, 10));

                            eopPlayers[userID].push({
                                name: player.name,
                                attack: parseInt(player.attack, 10) + parseInt(modified.attack, 10)
                            });

                        }
                        eopStats[userID].attack = tmStats.attack;
                        eopStats[userID].defense = tmStats.defense;
                    }
                }
            }
            moments = fetchEopScores(moments, timePeriod, eopStats, eopPlayers);
        });

        return finalStatistics(moments, motmArr, users);
    }

    function getSquad(userDetails) {
        return getSquadIDs(userDetails).map(function(uid) {
            return getPlayerByID(uid);
        });
    }

    function getSquadIDs(userDetails) {
        var squadIDs = [];
        for (var i=0; i < 11; i++) {
            var playerID = userDetails['player' + i];
            squadIDs.push(playerID);
        }
        return squadIDs;
    }

    function fetchEopScores(moments, timePeriod, eopStats, eopPlayers) {
        var difAttack = (parseInt(eopStats[1].attack, 10) - parseInt(eopStats[2].attack, 10));
        var difDefense = (parseInt(eopStats[1].defense, 10) - parseInt(eopStats[2].defense, 10));
        var endTimeTotal = (difAttack + difDefense);
        var incidentTime = randBetween((timePeriod - 15), timePeriod);
        var userID = 1;
        var scorer;

        if (endTimeTotal !== 0) {
            if (endTimeTotal < 0) {
                // User 2 won the period
                userID = 2;
            }
            scorer = fetchMostLikelyOn(eopPlayers[userID], 'attack');
            if (Math.random() <= odds.chanceConversion) {
                moments[userID].goals.push({
                    name: scorer,
                    time: incidentTime
                });
            } else if (endTimeTotal < 0) {
                if (Math.random() <= odds.chanceConversion) {
                    moments[userID].missedChance.push({
                        name: scorer,
                        time: incidentTime
                    });
                }
            }
        }
        return moments;
    }

    function fetchMostLikelyOn(arrPlayers, statistic) {
        arrPlayers.sort(sortHighest(statistic));
        var playerChances = [];
        var key;
        for (key in arrPlayers) {
            if (arrPlayers.hasOwnProperty(key)) {
                var players = arrPlayers[key],
                    i = 0,
                    noOfArrayInstances = players[statistic];
                while (i !== noOfArrayInstances) {
                    playerChances.push(players.name);
                    i += 1;
                }
            }
        }
        return playerChances[getRandItem(playerChances)];
    }

    function finalStatistics(moments, motmArr, players) {

        // Man of the Match should be a member of the winning team
        if (moments[1].goals.length > moments[2].goals.length) {
            moments.motm = mode(motmArr[1]);
        } else if (moments[2].goals.length > moments[1].goals.length) {
            moments.motm = mode(motmArr[2]);
        } else {
            moments.motm = mode(motmArr[randBetween(1, 2)]);
        }

        // Generate random stats
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
        moments.stats.cornerHomePercent = (moments.stats.cornerHome / (moments.stats.cornerHome + moments.stats.cornerAway) * 100).toFixed();
        moments.stats.foulsHomePercent = (moments.stats.foulsHome / (moments.stats.foulsHome + moments.stats.foulsAway) * 100).toFixed();
        moments.stats.offsideHomePercent = (moments.stats.offsideHome / (moments.stats.offsideHome + moments.stats.offsideAway) * 100).toFixed();

        // Yellow card generator
        var totalYellows = randBetween(1, 6);
        var i = 0;
        var idx;
        var userID;
        
        while (i !== totalYellows) {
            userID = 1;
            if (Math.random() >= 0.5) {
                userID = 2;
            }
            idx = getRandItem(players[userID]);
            moments[userID].yellowCard.push({
                name: players[userID][idx].name,
                time: randBetween(3, 94)
            });
            players[userID].splice(idx, 1);
            i += 1;
        }

        moments.venue = getVenue();
        return moments;
    }

    function getRandItem(arr) {
        return Math.floor(Math.random() * arr.length);
    }

    function sortHighest(prop) {
        return function (a, b) {
            return a[prop] - b[prop];
        };
    }

    function randBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function mode(array) {
        if (array.length === 0) {
            return null;
        }
        var modeMap = {};
        var maxEl = array[0];
        var maxCount = 1;
        var i;
        var el;

        for (i = 0; i < array.length; i += 1) {
            el = array[i];
            if (modeMap[el] === null) {
                modeMap[el] = 1;
            } else {
                modeMap[el] += 1;
            }
            
            if (modeMap[el] > maxCount) {
                maxEl = el;
                maxCount = modeMap[el];
            }
        }
        return maxEl;
    }

    function arrayObjectIndexOf(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) { return i; }
        }
        return -1;
    }
 
    function getVenue() {
        var venues = competitionData.stadiums;
        var chosenVenue = venues[Math.floor(Math.random() * venues.length)];
        /*
         * TODO: Choose a random number between 90% and 100% of maxAttendance and set as attendance
        chosenVenue.push({attendance: randBetween((chosenVenue.maxAttendance / 90 * 100), chosenVenue.maxAttendance)});
        */
        return chosenVenue;
    }

    return {
        createResult: createResult
    };
}());

