
module.exports = {

    beginMatch: function (user1, user2) {

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
                motm: null
            },
            motmArr = {
                1: [],
                2: []
            },
            users = {
                1: user1.players,
                2: user2.players
            };

        moments[1].guardianID = user1.guardianID;
        moments[1].teamSelection = user1.teamSelection;
        moments[2].guardianID = user2.guardianID;
        moments[2].teamSelection = user2.teamSelection;

        [15, 30, 45, 60, 75, 90].forEach(function (timePeriod) {

            var endOfPeriodStats = {
                    1: JSON.parse(JSON.stringify(attackDefenseScores)),
                    2: JSON.parse(JSON.stringify(attackDefenseScores))
                },
                endOfPeriodPlayers = {
                    1: [],
                    2: []
                },
                userID,
                key;

            for (userID in users) {
                if (users.hasOwnProperty(userID)) {

                    var players = users[userID],
                        tStats = JSON.parse(JSON.stringify(attackDefenseScores)),
                        tmStats = JSON.parse(JSON.stringify(attackDefenseScores));

                    for (key in players) {
                        if (players.hasOwnProperty(key)) {
                            var player = players[key];

                            if (player.attack) {

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
                        }

                        endOfPeriodStats[userID].attack = (parseInt(tStats.attack, 10) + parseInt(tmStats.attack, 10));
                        endOfPeriodStats[userID].defense = (parseInt(tStats.defense, 10) + parseInt(tmStats.defense, 10));
                    }
                }
            }

            moments = module.exports.calculateEndofPeriodScores(moments, timePeriod, endOfPeriodStats, endOfPeriodPlayers);
        });

        moments = this.finalStatistics(moments, motmArr);

        return moments;
    },


    calculateEndofPeriodScores: function (moments, timePeriod, endOfPeriodStats, endOfPeriodPlayers) {

        var difAttack = (parseInt(endOfPeriodStats[1].attack, 10) - parseInt(endOfPeriodStats[2].attack, 10)),
            difDefense = (parseInt(endOfPeriodStats[1].defense, 10) - parseInt(endOfPeriodStats[2].defense, 10)),
            endTimeTotal = (difAttack + difDefense),
            incidentTime = module.exports.randBetween((timePeriod - 15), timePeriod),
            scorer;

        if (endTimeTotal > 0) {
            scorer = module.exports.chanceFellTo(endOfPeriodPlayers[1]);
            if (Math.random() >= 0.5) {
                moments[1].goals.push({
                    name: scorer,
                    time: incidentTime
                });
            } else if (endTimeTotal < 0) {
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
        var playerChances = [],
            idx,
            key;

        for (key in arrPlayers) {
            if (arrPlayers.hasOwnProperty(key)) {
                var players = arrPlayers[key],
                    i = 0,
                    noOfArrayInstances = players.attack;
                while (i !== noOfArrayInstances) {
                    playerChances.push(players.name);
                    i += 1;
                }
            }
        }
        idx = Math.floor(Math.random() * playerChances.length);
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

        moments.stats.cornerHomePercent = (moments.stats.cornerHome / (moments.stats.cornerHome + moments.stats.cornerAway) * 100).toFixed();
        moments.stats.foulsHomePercent = (moments.stats.foulsHome / (moments.stats.foulsHome + moments.stats.foulsAway) * 100).toFixed();
        moments.stats.offsideHomePercent = (moments.stats.offsideHome / (moments.stats.offsideHome + moments.stats.offsideAway) * 100).toFixed();

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
            maxCount = 1,
            i,
            el;
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
    },


    getPlayersFromSelection: function (selection) {
        var playerCollection = [
  {
    "uid":"P001",
    "countryname":"Russia",
    "name":"Lev Yashin",
    "position":"GK",
    "attack":0,
    "defense":18,
    "discipline":20,
    "creativity":0,
    "unpredictability":3,
    "volatility":0,
    "starquality":18
  },
  {
    "uid":"P002",
    "countryname":"Germany",
    "name":"Sepp Maier",
    "position":"GK",
    "attack":0,
    "defense":15,
    "discipline":18,
    "creativity":0,
    "unpredictability":10,
    "volatility":5,
    "starquality":16
  },
  {
    "uid":"P003",
    "countryname":"Germany",
    "name":"Oliver Kahn",
    "position":"GK",
    "attack":0,
    "defense":15,
    "discipline":13,
    "creativity":0,
    "unpredictability":15,
    "volatility":12,
    "starquality":14
  },
  {
    "uid":"P004",
    "countryname":"Italy",
    "name":"Dino Zoff",
    "position":"GK",
    "attack":0,
    "defense":18,
    "discipline":17,
    "creativity":0,
    "unpredictability":5,
    "volatility":3,
    "starquality":19
  },
  {
    "uid":"P005",
    "countryname":"Czechoslovakia",
    "name":"Viliam Schrojf",
    "position":"GK",
    "attack":0,
    "defense":18,
    "discipline":17,
    "creativity":0,
    "unpredictability":19,
    "volatility":5,
    "starquality":2
  },
  {
    "uid":"P006",
    "countryname":"England",
    "name":"Gordon Banks",
    "position":"GK",
    "attack":0,
    "defense":19,
    "discipline":18,
    "creativity":0,
    "unpredictability":5,
    "volatility":0,
    "starquality":20
  },
  {
    "uid":"P007",
    "countryname":"Italy",
    "name":"Gianluigi Buffon",
    "position":"GK",
    "attack":0,
    "defense":17,
    "discipline":18,
    "creativity":0,
    "unpredictability":3,
    "volatility":5,
    "starquality":17
  },
  {
    "uid":"P008",
    "countryname":"Turky",
    "name":"Rüştü Reçber",
    "position":"GK",
    "attack":0,
    "defense":13,
    "discipline":15,
    "creativity":0,
    "unpredictability":15,
    "volatility":10,
    "starquality":10
  },
  {
    "uid":"P009",
    "countryname":"Russia",
    "name":"Rinat Dasayev",
    "position":"GK",
    "attack":0,
    "defense":16,
    "discipline":16,
    "creativity":0,
    "unpredictability":7,
    "volatility":5,
    "starquality":7
  },
  {
    "uid":"P010",
    "countryname":"Poland",
    "name":"Jan Tomaszewski",
    "position":"GK",
    "attack":0,
    "defense":12,
    "discipline":18,
    "creativity":0,
    "unpredictability":18,
    "volatility":5,
    "starquality":12
  },
  {
    "uid":"P011",
    "countryname":"Spain",
    "name":"Andoni Zubizaretta",
    "position":"GK",
    "attack":0,
    "defense":12,
    "discipline":16,
    "creativity":0,
    "unpredictability":16,
    "volatility":7,
    "starquality":14
  },
  {
    "uid":"P012",
    "countryname":"",
    "name":"",
    "position":"",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P013",
    "countryname":"Italy",
    "name":"Paolo Maldini",
    "position":"LB",
    "attack":13,
    "defense":19,
    "discipline":18,
    "creativity":10,
    "unpredictability":7,
    "volatility":3,
    "starquality":12
  },
  {
    "uid":"P014",
    "countryname":"Germany",
    "name":"Hans-Peter Briegel",
    "position":"LB",
    "attack":6,
    "defense":18,
    "discipline":4,
    "creativity":3,
    "unpredictability":6,
    "volatility":18,
    "starquality":4
  },
  {
    "uid":"P015",
    "countryname":"Brazil",
    "name":"Roberto Carlos",
    "position":"LB",
    "attack":15,
    "defense":10,
    "discipline":10,
    "creativity":12,
    "unpredictability":14,
    "volatility":8,
    "starquality":15
  },
  {
    "uid":"P016",
    "countryname":"Germany",
    "name":"Andreas Brehme",
    "position":"LB",
    "attack":12,
    "defense":14,
    "discipline":18,
    "creativity":11,
    "unpredictability":5,
    "volatility":11,
    "starquality":8
  },
  {
    "uid":"P017",
    "countryname":"Brazil",
    "name":"Nílton Santos",
    "position":"LB",
    "attack":15,
    "defense":10,
    "discipline":8,
    "creativity":14,
    "unpredictability":13,
    "volatility":17,
    "starquality":10
  },
  {
    "uid":"P018",
    "countryname":"Italy",
    "name":"Giacinto Facchetti",
    "position":"LB",
    "attack":14,
    "defense":16,
    "discipline":16,
    "creativity":13,
    "unpredictability":7,
    "volatility":4,
    "starquality":12
  },
  {
    "uid":"P019",
    "countryname":"Brazil",
    "name":"Junior",
    "position":"LB",
    "attack":13,
    "defense":12,
    "discipline":15,
    "creativity":15,
    "unpredictability":6,
    "volatility":7,
    "starquality":11
  },
  {
    "uid":"P020",
    "countryname":"",
    "name":"",
    "position":"LB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P021",
    "countryname":"",
    "name":"",
    "position":"LB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P022",
    "countryname":"",
    "name":"",
    "position":"LB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P023",
    "countryname":"",
    "name":"",
    "position":"",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P024",
    "countryname":"England",
    "name":"Bobby Moore",
    "position":"CB",
    "attack":10,
    "defense":19,
    "discipline":19,
    "creativity":6,
    "unpredictability":5,
    "volatility":3,
    "starquality":17
  },
  {
    "uid":"P025",
    "countryname":"Germany",
    "name":"Franz Beckenbauer",
    "position":"CB",
    "attack":11,
    "defense":18,
    "discipline":18,
    "creativity":6,
    "unpredictability":6,
    "volatility":4,
    "starquality":18
  },
  {
    "uid":"P026",
    "countryname":"Italy",
    "name":"Franco Baresi",
    "position":"CB",
    "attack":8,
    "defense":20,
    "discipline":20,
    "creativity":6,
    "unpredictability":3,
    "volatility":2,
    "starquality":15
  },
  {
    "uid":"P027",
    "countryname":"Argentina",
    "name":"Daniel Passarella",
    "position":"CB",
    "attack":15,
    "defense":19,
    "discipline":14,
    "creativity":5,
    "unpredictability":5,
    "volatility":5,
    "starquality":12
  },
  {
    "uid":"P028",
    "countryname":"Chile",
    "name":"Elías Figueroa",
    "position":"CB",
    "attack":9,
    "defense":17,
    "discipline":17,
    "creativity":13,
    "unpredictability":8,
    "volatility":9,
    "starquality":14
  },
  {
    "uid":"P029",
    "countryname":"France",
    "name":"Marcel Desailly",
    "position":"CB",
    "attack":6,
    "defense":17,
    "discipline":20,
    "creativity":3,
    "unpredictability":3,
    "volatility":9,
    "starquality":6
  },
  {
    "uid":"P030",
    "countryname":"France",
    "name":"Marius Trésor",
    "position":"CB",
    "attack":6,
    "defense":18,
    "discipline":18,
    "creativity":4,
    "unpredictability":4,
    "volatility":4,
    "starquality":9
  },
  {
    "uid":"P031",
    "countryname":"South Korea",
    "name":"Hong Myung-Bo",
    "position":"CB",
    "attack":3,
    "defense":16,
    "discipline":14,
    "creativity":3,
    "unpredictability":3,
    "volatility":3,
    "starquality":12
  },
  {
    "uid":"P032",
    "countryname":"Ireland",
    "name":"Paul McGrath ",
    "position":"CB",
    "attack":7,
    "defense":18,
    "discipline":14,
    "creativity":4,
    "unpredictability":11,
    "volatility":10,
    "starquality":13
  },
  {
    "uid":"P033",
    "countryname":"Argentina",
    "name":"Luis Monti",
    "position":"CB",
    "attack":15,
    "defense":15,
    "discipline":2,
    "creativity":15,
    "unpredictability":17,
    "volatility":18,
    "starquality":14
  },
  {
    "uid":"P034",
    "countryname":"Italy",
    "name":"Fabio Cannavaro",
    "position":"CB",
    "attack":6,
    "defense":17,
    "discipline":9,
    "creativity":3,
    "unpredictability":6,
    "volatility":6,
    "starquality":10
  },
  {
    "uid":"P035",
    "countryname":"France",
    "name":"Laurent Blanc",
    "position":"CB",
    "attack":8,
    "defense":14,
    "discipline":10,
    "creativity":6,
    "unpredictability":6,
    "volatility":8,
    "starquality":9
  },
  {
    "uid":"P036",
    "countryname":"Germany",
    "name":"Guido Buchwald",
    "position":"CB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P037",
    "countryname":"",
    "name":"",
    "position":"CB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P038",
    "countryname":"",
    "name":"",
    "position":"CB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P039",
    "countryname":"",
    "name":"",
    "position":"CB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P040",
    "countryname":"",
    "name":"",
    "position":"CB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P041",
    "countryname":"",
    "name":"",
    "position":"CB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P042",
    "countryname":"",
    "name":"",
    "position":"CB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P043",
    "countryname":"",
    "name":"",
    "position":"CB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P044",
    "countryname":"",
    "name":"",
    "position":"CB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P045",
    "countryname":"",
    "name":"",
    "position":"",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P046",
    "countryname":"Brazil",
    "name":"Carlos Alberto",
    "position":"RB",
    "attack":20,
    "defense":20,
    "discipline":16,
    "creativity":13,
    "unpredictability":10,
    "volatility":5,
    "starquality":18
  },
  {
    "uid":"P047",
    "countryname":"Brazil",
    "name":"Cafu",
    "position":"RB",
    "attack":14,
    "defense":16,
    "discipline":14,
    "creativity":13,
    "unpredictability":10,
    "volatility":8,
    "starquality":14
  },
  {
    "uid":"P048",
    "countryname":"Brazil",
    "name":"Josimar",
    "position":"RB",
    "attack":20,
    "defense":14,
    "discipline":12,
    "creativity":18,
    "unpredictability":20,
    "volatility":10,
    "starquality":18
  },
  {
    "uid":"P049",
    "countryname":"France",
    "name":"Lilian Thuram",
    "position":"RB",
    "attack":13,
    "defense":17,
    "discipline":14,
    "creativity":12,
    "unpredictability":13,
    "volatility":10,
    "starquality":10
  },
  {
    "uid":"P050",
    "countryname":"Brazil",
    "name":"Djalma Santos",
    "position":"RB",
    "attack":10,
    "defense":19,
    "discipline":20,
    "creativity":9,
    "unpredictability":3,
    "volatility":1,
    "starquality":8
  },
  {
    "uid":"P051",
    "countryname":"Italy",
    "name":"Giuseppe Bergomi",
    "position":"RB",
    "attack":8,
    "defense":17,
    "discipline":13,
    "creativity":8,
    "unpredictability":2,
    "volatility":2,
    "starquality":9
  },
  {
    "uid":"P052",
    "countryname":"Germany",
    "name":"Paul Breitner",
    "position":"RB",
    "attack":17,
    "defense":18,
    "discipline":20,
    "creativity":12,
    "unpredictability":10,
    "volatility":5,
    "starquality":17
  },
  {
    "uid":"P053",
    "countryname":"Italy",
    "name":"Claudio Gentile",
    "position":"RB",
    "attack":3,
    "defense":20,
    "discipline":20,
    "creativity":4,
    "unpredictability":3,
    "volatility":13,
    "starquality":16
  },
  {
    "uid":"P054",
    "countryname":"",
    "name":"",
    "position":"RB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P055",
    "countryname":"",
    "name":"",
    "position":"RB",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P056",
    "countryname":"",
    "name":"",
    "position":"",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P057",
    "countryname":"France",
    "name":"Zinedine Zidane",
    "position":"ML",
    "attack":17,
    "defense":9,
    "discipline":9,
    "creativity":19,
    "unpredictability":14,
    "volatility":14,
    "starquality":19
  },
  {
    "uid":"P058",
    "countryname":"Holland",
    "name":"Johan Cruyff",
    "position":"ML",
    "attack":18,
    "defense":7,
    "discipline":14,
    "creativity":18,
    "unpredictability":15,
    "volatility":10,
    "starquality":19
  },
  {
    "uid":"P059",
    "countryname":"Sweden",
    "name":"Lennart Skoglund",
    "position":"ML",
    "attack":17,
    "defense":3,
    "discipline":9,
    "creativity":9,
    "unpredictability":16,
    "volatility":12,
    "starquality":17
  },
  {
    "uid":"P060",
    "countryname":"Bulgaria",
    "name":"Hristo Stoichkov",
    "position":"ML",
    "attack":18,
    "defense":1,
    "discipline":2,
    "creativity":20,
    "unpredictability":20,
    "volatility":20,
    "starquality":17
  },
  {
    "uid":"P061",
    "countryname":"Brazil",
    "name":"Mario Zagallo",
    "position":"ML",
    "attack":12,
    "defense":17,
    "discipline":15,
    "creativity":11,
    "unpredictability":9,
    "volatility":8,
    "starquality":10
  },
  {
    "uid":"P062",
    "countryname":"Spain",
    "name":"Paco Gento",
    "position":"ML",
    "attack":17,
    "defense":4,
    "discipline":11,
    "creativity":19,
    "unpredictability":14,
    "volatility":11,
    "starquality":16
  },
  {
    "uid":"P063",
    "countryname":"Hungary",
    "name":"Zoltan Czibor",
    "position":"ML",
    "attack":16,
    "defense":8,
    "discipline":13,
    "creativity":15,
    "unpredictability":11,
    "volatility":6,
    "starquality":14
  },
  {
    "uid":"P064",
    "countryname":"Sweden",
    "name":"Tomas Brolin",
    "position":"ML",
    "attack":14,
    "defense":6,
    "discipline":11,
    "creativity":16,
    "unpredictability":16,
    "volatility":7,
    "starquality":13
  },
  {
    "uid":"P065",
    "countryname":"Romainia",
    "name":"Gheorge Hagi",
    "position":"ML",
    "attack":16,
    "defense":3,
    "discipline":11,
    "creativity":15,
    "unpredictability":13,
    "volatility":9,
    "starquality":15
  },
  {
    "uid":"P066",
    "countryname":"",
    "name":"",
    "position":"",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P067",
    "countryname":"Brazil",
    "name":"Zico",
    "position":"MC",
    "attack":20,
    "defense":4,
    "discipline":13,
    "creativity":18,
    "unpredictability":18,
    "volatility":7,
    "starquality":19
  },
  {
    "uid":"P068",
    "countryname":"Germany",
    "name":"Lothar Matthäus",
    "position":"MC",
    "attack":15,
    "defense":11,
    "discipline":14,
    "creativity":13,
    "unpredictability":12,
    "volatility":9,
    "starquality":14
  },
  {
    "uid":"P069",
    "countryname":"France",
    "name":"Michel Platini",
    "position":"MC",
    "attack":17,
    "defense":8,
    "discipline":11,
    "creativity":16,
    "unpredictability":14,
    "volatility":8,
    "starquality":16
  },
  {
    "uid":"P070",
    "countryname":"France",
    "name":"Alain Giresse",
    "position":"MC",
    "attack":16,
    "defense":7,
    "discipline":14,
    "creativity":16,
    "unpredictability":14,
    "volatility":9,
    "starquality":14
  },
  {
    "uid":"P071",
    "countryname":"Spain",
    "name":"Xavi",
    "position":"MC",
    "attack":14,
    "defense":11,
    "discipline":15,
    "creativity":17,
    "unpredictability":14,
    "volatility":8,
    "starquality":10
  },
  {
    "uid":"P072",
    "countryname":"England",
    "name":"Bobby Charlton",
    "position":"MC",
    "attack":18,
    "defense":11,
    "discipline":16,
    "creativity":14,
    "unpredictability":7,
    "volatility":6,
    "starquality":12
  },
  {
    "uid":"P073",
    "countryname":"Argentina",
    "name":"Luis Monti",
    "position":"MC",
    "attack":12,
    "defense":20,
    "discipline":18,
    "creativity":10,
    "unpredictability":5,
    "volatility":20,
    "starquality":15
  },
  {
    "uid":"P074",
    "countryname":"Uruguay",
    "name":"Obdulio Varela",
    "position":"MC",
    "attack":16,
    "defense":20,
    "discipline":20,
    "creativity":18,
    "unpredictability":15,
    "volatility":20,
    "starquality":20
  },
  {
    "uid":"P075",
    "countryname":"Austria",
    "name":"Matthias Sindelar",
    "position":"MC",
    "attack":18,
    "defense":2,
    "discipline":15,
    "creativity":19,
    "unpredictability":20,
    "volatility":7,
    "starquality":17
  },
  {
    "uid":"P076",
    "countryname":"Uruguay",
    "name":"Juan Alberto Schiaffino",
    "position":"MC",
    "attack":18,
    "defense":14,
    "discipline":15,
    "creativity":18,
    "unpredictability":10,
    "volatility":5,
    "starquality":18
  },
  {
    "uid":"P077",
    "countryname":"",
    "name":"",
    "position":"MC",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P078",
    "countryname":"Uruguay",
    "name":"Alcides Ghiggia",
    "position":"MC",
    "attack":17,
    "defense":3,
    "discipline":15,
    "creativity":19,
    "unpredictability":17,
    "volatility":5,
    "starquality":13
  },
  {
    "uid":"P079",
    "countryname":"Sweden",
    "name":"Nils Liedholm",
    "position":"MC",
    "attack":19,
    "defense":10,
    "discipline":20,
    "creativity":18,
    "unpredictability":10,
    "volatility":2,
    "starquality":14
  },
  {
    "uid":"P080",
    "countryname":"Holland",
    "name":"Ruud Gullit",
    "position":"MC",
    "attack":18,
    "defense":18,
    "discipline":18,
    "creativity":15,
    "unpredictability":10,
    "volatility":5,
    "starquality":19
  },
  {
    "uid":"P081",
    "countryname":"England",
    "name":"Paul Gascoigne",
    "position":"MC",
    "attack":18,
    "defense":14,
    "discipline":5,
    "creativity":18,
    "unpredictability":20,
    "volatility":20,
    "starquality":19
  },
  {
    "uid":"P082",
    "countryname":"",
    "name":"",
    "position":"MC",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P083",
    "countryname":"",
    "name":"",
    "position":"MC",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P084",
    "countryname":"Hungary",
    "name":"Ferenc Puskas",
    "position":"MC",
    "attack":20,
    "defense":4,
    "discipline":8,
    "creativity":19,
    "unpredictability":19,
    "volatility":20,
    "starquality":20
  },
  {
    "uid":"P085",
    "countryname":"Holland",
    "name":"Johann Neeskens",
    "position":"MC",
    "attack":18,
    "defense":15,
    "discipline":15,
    "creativity":16,
    "unpredictability":13,
    "volatility":17,
    "starquality":17
  },
  {
    "uid":"P086",
    "countryname":"Brazil",
    "name":"Roberto Rivelino",
    "position":"MC",
    "attack":18,
    "defense":6,
    "discipline":9,
    "creativity":18,
    "unpredictability":16,
    "volatility":14,
    "starquality":18
  },
  {
    "uid":"P087",
    "countryname":"",
    "name":"",
    "position":"MC",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P088",
    "countryname":"",
    "name":"",
    "position":"",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P089",
    "countryname":"Brazil",
    "name":"Jairzinho",
    "position":"MR",
    "attack":20,
    "defense":3,
    "discipline":15,
    "creativity":14,
    "unpredictability":13,
    "volatility":6,
    "starquality":18
  },
  {
    "uid":"P090",
    "countryname":"Brazil",
    "name":"Garrincha",
    "position":"MR",
    "attack":20,
    "defense":0,
    "discipline":0,
    "creativity":20,
    "unpredictability":20,
    "volatility":20,
    "starquality":20
  },
  {
    "uid":"P091",
    "countryname":"Poland",
    "name":"Zbigniew Boniek",
    "position":"MR",
    "attack":14,
    "defense":12,
    "discipline":16,
    "creativity":14,
    "unpredictability":10,
    "volatility":6,
    "starquality":12
  },
  {
    "uid":"P092",
    "countryname":"Portgual",
    "name":"Cristiano Ronaldo",
    "position":"MR",
    "attack":19,
    "defense":17,
    "discipline":17,
    "creativity":19,
    "unpredictability":18,
    "volatility":15,
    "starquality":20
  },
  {
    "uid":"P093",
    "countryname":"England",
    "name":"David Beckham",
    "position":"MR",
    "attack":14,
    "defense":15,
    "discipline":8,
    "creativity":14,
    "unpredictability":6,
    "volatility":16,
    "starquality":20
  },
  {
    "uid":"P094",
    "countryname":"Denmark",
    "name":"Brian Laudrup",
    "position":"MR",
    "attack":13,
    "defense":10,
    "discipline":12,
    "creativity":16,
    "unpredictability":18,
    "volatility":5,
    "starquality":13
  },
  {
    "uid":"P095",
    "countryname":"",
    "name":"",
    "position":"MR",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P096",
    "countryname":"",
    "name":"",
    "position":"MR",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P097",
    "countryname":"",
    "name":"",
    "position":"MR",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P098",
    "countryname":"",
    "name":"",
    "position":"MR",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P099",
    "countryname":"",
    "name":"",
    "position":"",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P100",
    "countryname":"Brazil",
    "name":"Pelé",
    "position":"ST",
    "attack":20,
    "defense":12,
    "discipline":7,
    "creativity":20,
    "unpredictability":20,
    "volatility":17,
    "starquality":20
  },
  {
    "uid":"P101",
    "countryname":"Argentina",
    "name":"Diego Maradona",
    "position":"ST",
    "attack":20,
    "defense":12,
    "discipline":7,
    "creativity":20,
    "unpredictability":20,
    "volatility":20,
    "starquality":20
  },
  {
    "uid":"P102",
    "countryname":"France",
    "name":"Just Fontaine",
    "position":"ST",
    "attack":20,
    "defense":10,
    "discipline":16,
    "creativity":12,
    "unpredictability":14,
    "volatility":7,
    "starquality":17
  },
  {
    "uid":"P103",
    "countryname":"Germany",
    "name":"Gerd Müller",
    "position":"ST",
    "attack":20,
    "defense":8,
    "discipline":17,
    "creativity":8,
    "unpredictability":8,
    "volatility":3,
    "starquality":20
  },
  {
    "uid":"P104",
    "countryname":"Brazil",
    "name":"Ronaldo",
    "position":"ST",
    "attack":16,
    "defense":7,
    "discipline":12,
    "creativity":12,
    "unpredictability":18,
    "volatility":10,
    "starquality":19
  },
  {
    "uid":"P105",
    "countryname":"England",
    "name":"Gary Lineker",
    "position":"ST",
    "attack":14,
    "defense":5,
    "discipline":18,
    "creativity":10,
    "unpredictability":5,
    "volatility":0,
    "starquality":17
  },
  {
    "uid":"P106",
    "countryname":"Italy",
    "name":"Paolo Rossi",
    "position":"ST",
    "attack":16,
    "defense":10,
    "discipline":12,
    "creativity":10,
    "unpredictability":7,
    "volatility":12,
    "starquality":17
  },
  {
    "uid":"P107",
    "countryname":"Argentina",
    "name":"Mario Kempes",
    "position":"ST",
    "attack":17,
    "defense":10,
    "discipline":10,
    "creativity":15,
    "unpredictability":15,
    "volatility":14,
    "starquality":16
  },
  {
    "uid":"P108",
    "countryname":"Peru",
    "name":"Teófilo Cubillas",
    "position":"ST",
    "attack":18,
    "defense":8,
    "discipline":12,
    "creativity":19,
    "unpredictability":17,
    "volatility":9,
    "starquality":13
  },
  {
    "uid":"P109",
    "countryname":"",
    "name":"",
    "position":"ST",
    "attack":null,
    "defense":null,
    "discipline":null,
    "creativity":null,
    "unpredictability":null,
    "volatility":null,
    "starquality":null
  },
  {
    "uid":"P110",
    "countryname":"Argentina",
    "name":"Messi",
    "position":"ST",
    "attack":20,
    "defense":1,
    "discipline":10,
    "creativity":18,
    "unpredictability":20,
    "volatility":14,
    "starquality":20
  },
  {
    "uid":"P111",
    "countryname":"Uruguay",
    "name":"Hector Castro",
    "position":"ST",
    "attack":18,
    "defense":5,
    "discipline":15,
    "creativity":17,
    "unpredictability":12,
    "volatility":5,
    "starquality":18
  },
  {
    "uid":"P112",
    "countryname":"Brazil",
    "name":"Leonidas",
    "position":"ST",
    "attack":16,
    "defense":5,
    "discipline":15,
    "creativity":20,
    "unpredictability":20,
    "volatility":10,
    "starquality":18
  },
  {
    "uid":"P113",
    "countryname":"Brazil",
    "name":"Ademir",
    "position":"ST",
    "attack":20,
    "defense":5,
    "discipline":20,
    "creativity":20,
    "unpredictability":20,
    "volatility":12,
    "starquality":20
  },
  {
    "uid":"P114",
    "countryname":"Germany",
    "name":"Fritz Walter",
    "position":"ST",
    "attack":15,
    "defense":12,
    "discipline":20,
    "creativity":16,
    "unpredictability":10,
    "volatility":2,
    "starquality":19
  },
  {
    "uid":"P115",
    "countryname":"Germany",
    "name":"Max Morlock",
    "position":"ST",
    "attack":15,
    "defense":15,
    "discipline":18,
    "creativity":14,
    "unpredictability":10,
    "volatility":5,
    "starquality":15
  },
  {
    "uid":"P116",
    "countryname":"Sweden",
    "name":"Gunnar Gren",
    "position":"ST",
    "attack":16,
    "defense":10,
    "discipline":18,
    "creativity":16,
    "unpredictability":7,
    "volatility":3,
    "starquality":18
  },
  {
    "uid":"P117",
    "countryname":"Hungary",
    "name":"Ferenc Bene",
    "position":"ST",
    "attack":17,
    "defense":7,
    "discipline":14,
    "creativity":15,
    "unpredictability":13,
    "volatility":8,
    "starquality":14
  },
  {
    "uid":"P118",
    "countryname":"Brazil",
    "name":"Romário",
    "position":"ST",
    "attack":18,
    "defense":5,
    "discipline":15,
    "creativity":14,
    "unpredictability":19,
    "volatility":10,
    "starquality":17
  },
  {
    "uid":"P119",
    "countryname":"Italy",
    "name":"Roberto Baggio",
    "position":"ST",
    "attack":17,
    "defense":8,
    "discipline":18,
    "creativity":19,
    "unpredictability":17,
    "volatility":5,
    "starquality":19
  },
  {
    "uid":"P120",
    "countryname":"Italy",
    "name":"Salvatore Schillaci",
    "position":"ST",
    "attack":15,
    "defense":12,
    "discipline":10,
    "creativity":10,
    "unpredictability":8,
    "volatility":7,
    "starquality":12
  },
  {
    "uid":"P121",
    "countryname":"Portugal",
    "name":"Eusabio",
    "position":"ST",
    "attack":20,
    "defense":8,
    "discipline":16,
    "creativity":19,
    "unpredictability":18,
    "volatility":14,
    "starquality":17
  },
  {
    "uid":"P122",
    "countryname":"Hungary",
    "name":"Sandor Kocsis",
    "position":"ST",
    "attack":20,
    "defense":8,
    "discipline":17,
    "creativity":17,
    "unpredictability":17,
    "volatility":5,
    "starquality":18
  },
  {
    "uid":"P123",
    "countryname":"Cameroon",
    "name":"Roger Milla",
    "position":"ST",
    "attack":14,
    "defense":10,
    "discipline":15,
    "creativity":11,
    "unpredictability":18,
    "volatility":10,
    "starquality":14
  },
  {
    "uid":"P124",
    "countryname":"Germany",
    "name":"Karl-Heinz Rumenigge",
    "position":"ST",
    "attack":17,
    "defense":12,
    "discipline":15,
    "creativity":13,
    "unpredictability":10,
    "volatility":5,
    "starquality":15
  }
];
        var team = [];
        if (selection.split(',').length === 11) {
            selection.split(',').map(function (player) {
                var playerSplit = player.split(':');
                for(var key in playerCollection) {
                    if(playerCollection[key].uid === playerSplit[0]) {
                        team.push(playerCollection[key]);
                    }
                }
            });
        }
        return team;
    }

};