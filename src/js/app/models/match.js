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

            var users = { 1: null, 2: null };

            users[1] = [{uid:"P015",countryname:"Brazil",name:"Roberto Carlos",position:"LB",attack:15,defense:10,discipline:10,creativity:12,unpredictability:14,volatility:8,starquality:15,rowNumber:15,countrycode:"br",imageSrc:null,wantedPosition:"LB"},{uid:"P029",countryname:"France",name:"Marcel Desailly",position:"CB",attack:6,defense:17,discipline:20,creativity:3,unpredictability:3,volatility:9,starquality:6,rowNumber:29,countrycode:"fr",imageSrc:null,wantedPosition:"CB"},{uid:"P026",countryname:"Italy",name:"Franco Baresi",position:"CB",attack:8,defense:20,discipline:20,creativity:6,unpredictability:3,volatility:2,starquality:20,rowNumber:26,countrycode:"it",imageSrc:null,wantedPosition:"CB"},{uid:"P052",countryname:"Germany",name:"Paul Breitner",position:"RB",attack:17,defense:18,discipline:20,creativity:12,unpredictability:10,volatility:5,starquality:17,rowNumber:52,countrycode:"de",imageSrc:null,wantedPosition:"RB"},{uid:"P092",countryname:"Portgual",name:"Cristiano Ronaldo",position:"MR",attack:19,defense:17,discipline:17,creativity:19,unpredictability:18,volatility:15,starquality:20,rowNumber:92,imageSrc:null,wantedPosition:"MR"},{uid:"P069",countryname:"France",name:"Michel Platini",position:"MC",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:69,countrycode:"fr",imageSrc:null,wantedPosition:"MC2"},{uid:"P070",countryname:"France",name:"Alain Giresse",position:"MC",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:70,countrycode:"fr",imageSrc:null,wantedPosition:"MC2"},{uid:"P058",countryname:"Holland",name:"Johan Cruyff",position:"ML",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:58,imageSrc:null,wantedPosition:"ML"},{uid:"P101",countryname:"Argentina",name:"Diego Maradona",position:"ST",attack:20,defense:12,discipline:7,creativity:20,unpredictability:20,volatility:20,starquality:20,rowNumber:101,countrycode:"ar",imageSrc:null,wantedPosition:"ST2"},{uid:"P107",countryname:"Argentina",name:"Mario Kempes",position:"ST",attack:17,defense:10,discipline:10,creativity:15,unpredictability:15,volatility:14,starquality:16,rowNumber:107,countrycode:"ar",imageSrc:null,wantedPosition:"ST2"},{uid:"P009",countryname:"Russia",name:"Rinat Dasayev",position:"GK",attack:0,defense:16,discipline:16,creativity:0,unpredictability:7,volatility:5,starquality:7,rowNumber:9,countrycode:"ru",imageSrc:null,wantedPosition:"GK"}];

            users[2] = [{uid:"P026",countryname:"Italy",name:"Franco Baresi",position:"CB",attack:8,defense:20,discipline:20,creativity:6,unpredictability:3,volatility:2,starquality:20,rowNumber:26,countrycode:"it",imageSrc:null,wantedPosition:"CB"},{uid:"P100",countryname:"Brazil",name:"Pelé",position:"ST",attack:20,defense:12,discipline:7,creativity:20,unpredictability:20,volatility:17,starquality:20,rowNumber:100,countrycode:"br",imageSrc:null,wantedPosition:"ST"},{uid:"P101",countryname:"Argentina",name:"Diego Maradona",position:"ST",attack:20,defense:12,discipline:7,creativity:20,unpredictability:20,volatility:20,starquality:20,rowNumber:101,countrycode:"ar",imageSrc:null,wantedPosition:"ST2"},{uid:"P073",countryname:"Argentina",name:"Luis Monti",position:"MC",attack:12,defense:20,discipline:18,creativity:10,unpredictability:5,volatility:20,starquality:15,rowNumber:73,countrycode:"ar",imageSrc:null,wantedPosition:"MC"},{uid:"P063",countryname:"Hungary",name:"Zoltan Czibor",position:"ML",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:63,countrycode:"hu",imageSrc:null,wantedPosition:"ML"},{uid:"P069",countryname:"France",name:"Michel Platini",position:"MC",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:69,countrycode:"fr",imageSrc:null,wantedPosition:"MC2"},{uid:"P092",countryname:"Portgual",name:"Cristiano Ronaldo",position:"MR",attack:19,defense:17,discipline:17,creativity:19,unpredictability:18,volatility:15,starquality:20,rowNumber:92,imageSrc:null,wantedPosition:"MR"},{uid:"P050",countryname:"Brazil",name:"Djalma Santos",position:"RB",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:50,countrycode:"br",imageSrc:null,wantedPosition:"RB"},{uid:"P028",countryname:"Chile",name:"Elías Figueroa",position:"CB",attack:6,defense:17,discipline:20,creativity:3,unpredictability:3,volatility:9,starquality:6,rowNumber:28,imageSrc:null,wantedPosition:"CB2"},{uid:"P013",countryname:"Italy",name:"Paolo Maldini",position:"LB",attack:13,defense:19,discipline:18,creativity:10,unpredictability:7,volatility:3,starquality:12,rowNumber:13,countrycode:"it",imageSrc:null,wantedPosition:"LB"},{uid:"P007",countryname:"Italy",name:"Gianluigi Buffon",position:"GK",attack:0,defense:17,discipline:18,creativity:0,unpredictability:3,volatility:5,starquality:17,rowNumber:7,countrycode:"it",imageSrc:null,wantedPosition:"GK"}];

            var _this = this,
                attackDefenseScores = {
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
                        cornerHome: 0,
                        cornerAway: 0,
                        foulsHome: 0,
                        foulsAway: 0,
                        offsideHome: 0,
                        offsideAway: 0
                    },
                    motm: null
                },
                motmArr = {
                    1: [],
                    2: []
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
                                motmArr[userID].push(player.name);
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

                moments = _this.calculateEndofPeriodScores(moments, timePeriod, endOfPeriodStats, endOfPeriodPlayers);
            });

            moments = this.finalStatistics(moments, motmArr);
            console.log(moments);
        },


        calculateEndofPeriodScores: function (moments, timePeriod, endOfPeriodStats, endOfPeriodPlayers) {

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
            return moments;
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

        finalStatistics: function (moments, motmArr) {

            if (moments[1].goals.length > moments[2].goals.length) {
                moments.motm = this.mode(motmArr[1]);
            } else if (moments[2].goals.length > moments[1].goals.length) {
                moments.motm = this.mode(motmArr[2]);
            } else {
                moments.motm = this.mode(motmArr[this.randBetween(1, 2)]);
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

    });
});