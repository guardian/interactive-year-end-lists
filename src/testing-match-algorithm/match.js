var matchContainer = $('.match-stats'),
    users = {
        1: window.player1,
        2: window.player2
    },
    timePeriods = {
        1: 15,
        2: 30,
        3: 45,
        4: 60,
        5: 75,
        6: 90
    },
    moments = {
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
        }
    };

createTablesForView(timePeriods);

$(function() {

    jQuery.each(timePeriods, function (portion, timePeriod) {

        var container = $('.timePeriod' + timePeriod),
            endOfPeriodStats = {
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

        jQuery.each(users, function (userID, players) {

            var table = container.find('.players-' + userID),
                theadItems = ['Position', 'name', 'unpredictability', 'attack', 'defense'],
                tStats = {
                    'attack': 0,
                    'defense': 0
                },
                tableItems = [],
                total = [],
                tmStats = jQuery.extend({}, tStats);

            theadItems = '<td>' + theadItems.join('</td><td>') + '</td>';
            table.find('thead tr').html(theadItems);

            jQuery.each(players, function (key, player) {

                if (player.attack) {

                    var playerEffectedByUnpredictability = false,
                        positiveOrNegativeEffect = true,
                        row = [],
                        modified = jQuery.extend({}, tStats),
                        decimalUnpredictability = (player.unpredictability / 100);

                    // Determines if player is even effected by his unpredictability
                    if (Math.random() >= 0.5) {
                        row.push(player.name);
                        decimalUnpredictability = 0;
                    } else {
                        row.push('<b>' + player.name + '</b>'); // Show bold so effected

                        // Player is effected, good or bad?
                        if (Math.random() <= 0.5) {

                            // Bad game!
                            positiveOrNegativeEffect = false;

                            if (player.starquality >= 18 && Math.random() >= 0.5) {
                                // Star player given a second chance but still having a bad game
                                positiveOrNegativeEffect = true;
                            }
                        }
                    }

                    row.push(player.position);

                    // Modified stats
                    modified.attack = (player.attack * decimalUnpredictability).toFixed();
                    modified.defense = (player.defense * decimalUnpredictability).toFixed();

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

                    // Stats
                    row.push(decimalUnpredictability);
                    row.push(player.attack + ' (' + modified.attack + ')');
                    row.push(player.defense + ' (' + modified.defense + ')');

                    // Total them
                    tStats.attack = parseInt(tStats.attack, 10) + parseInt(player.attack, 10);
                    tStats.defense = parseInt(tStats.defense, 10) + parseInt(player.defense, 10);
                    tmStats.attack = parseInt(tmStats.attack, 10) + parseInt(modified.attack, 10);
                    tmStats.defense = parseInt(tmStats.defense, 10) + parseInt(modified.defense, 10);
                    tableItems.push('<td>' + row.join('</td><td>') + '</td>');

                    endOfPeriodPlayers[userID].push({
                        name: player.name,
                        attack: parseInt(player.attack, 10) + parseInt(modified.attack, 10)
                    });
                }
            });
            total.push('');
            total.push('');
            total.push('Total');
            total.push(tStats.attack);
            total.push(tStats.defense);
            tableItems.push('<td class="total">' + total.join('</td><td class="total">') + '</td>');

            total = [];
            total.push('');
            total.push('');
            total.push('Modified Total');
            total.push((parseInt(tStats.attack, 10) + parseInt(tmStats.attack, 10)));
            total.push((parseInt(tStats.defense, 10) + parseInt(tmStats.defense, 10)));
            tableItems.push('<td class="total">' + total.join('</td><td class="total">') + '</td>');

            tableItems = '<tr>' + tableItems.join('</tr><tr>') + '</tr>';

            table.find('tbody').html(tableItems);

            endOfPeriodStats[userID].attack = (parseInt(tStats.attack, 10) + parseInt(tmStats.attack, 10));
            endOfPeriodStats[userID].defense = (parseInt(tStats.defense, 10) + parseInt(tmStats.defense, 10));
        });

        calculateEndofPeriodScores(timePeriod, endOfPeriodStats, endOfPeriodPlayers);
    });

});

$(window).load(function() {
    printStatistics();
});

function calculateEndofPeriodScores(timePeriod, endOfPeriodStats, endOfPeriodPlayers) {

    var difAttack = (parseInt(endOfPeriodStats[1].attack, 10) - parseInt(endOfPeriodStats[2].attack, 10)),
        difDefense = (parseInt(endOfPeriodStats[1].defense, 10) - parseInt(endOfPeriodStats[2].defense, 10)),
        endTimeTotal = (difAttack + difDefense),
        incidentTime = randomIntFromInterval((timePeriod - 15), timePeriod),
        scorer;

    if (endTimeTotal === 0) {

    } else if (endTimeTotal > 0) {
        scorer = chanceFellTo(endOfPeriodPlayers[1]);
        if (Math.random() >= 0.5) {
            moments[1].goals.push({name: scorer, time: incidentTime});
        } else {
            if (Math.random() >= 0.5) {
                moments[1].missedChance.push({name: scorer, time: incidentTime});
            }
        }
    } else {
        scorer = chanceFellTo(endOfPeriodPlayers[2]);
        if (Math.random() >= 0.5) {
            moments[2].goals.push({name: scorer, time: incidentTime});
        } else {
            if (Math.random() >= 0.5) {
                moments[2].missedChance.push({name: scorer, time: incidentTime});
            }
        }
    }
}

function chanceFellTo(arrPlayers) {
    arrPlayers.sort(sortHighestAttack);
    var playerChances = [];
    jQuery.each(arrPlayers, function (userID, players) {
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

function printStatistics() {

    var matchContainer = $('.match-stats');

    $('.score-1').text(moments[1].goals.length);
    $('.score-2').text(moments[2].goals.length);

    jQuery.each(moments[1].goals, function (userID, goalScorer) {
        $('.incidents').append('<tr><td colspan="2">' + goalScorer.name + ' <span>' + goalScorer.time + '</span></td></tr>');
    });
    jQuery.each(moments[2].goals, function (userID, goalScorer) {
        $('.incidents').append('<tr><td></td><td>' + goalScorer.name + ' <span>' + goalScorer.time + '</span></td></tr>');
    });

    var possession = randomIntFromInterval(35, 65);
    var data = [{
            value: (100 - possession),
            color: "#D51022"
        },
        {
            value: possession,
            color: "#005CA4"
        }];
    var ctx = document.getElementById("myChart").getContext("2d");
    var myNewChart = new Chart(ctx).Doughnut(data);

    var barFight = $('.bar-fight');

    barFight.append('<dt class="caption">Possession</dt>');
    barFight.append('<dd class="home" style="width:' + possession + '%">' + possession + '%</dd>');
    barFight.append('<dd class="away" style="width:' + (100 - possession) + '%">' + (100 - possession) + '%</dd>');

    var cornerHome = randomIntFromInterval(1, 9),
        cornerAway = randomIntFromInterval(1, 9),
        foulsHome = randomIntFromInterval(1, 15),
        foulsAway = randomIntFromInterval(1, 15),
        offsideHome = randomIntFromInterval(1, 7),
        offsideAway = randomIntFromInterval(1, 7),
        cornerHomePercentage,
        foulsHomePercentage,
        offsideHomePercentage;

    if (cornerHome === cornerAway) {
        cornerHomePercentage = 50;
    } else {
        if (cornerHome > cornerAway) {
            cornerHomePercentage = 100 - ((cornerAway / cornerHome) * 100);
        } else {
            cornerHomePercentage = (cornerHome / cornerAway) * 100;
        }
    }
    barFight.append('<dt class="caption">Corners</dt>');
    barFight.append('<dd class="home" style="width:' + cornerHomePercentage + '%">' + cornerHome + '</dd>');
    barFight.append('<dd class="away" style="width:' + (100 - cornerHomePercentage) + '%">' + cornerAway + '</dd>');

    if (foulsHome === foulsAway) {
        foulsHomePercentage = 50;
    } else {
        if (foulsHome > foulsAway) {
            foulsHomePercentage = 100 - ((foulsAway / foulsHome) * 100);
        } else {
            foulsHomePercentage = (foulsHome / foulsAway) * 100;
        }
    }
    barFight.append('<dt class="caption">Fouls</dt>');
    barFight.append('<dd class="home" style="width:' + foulsHomePercentage + '%">' + foulsHome + '</dd>');
    barFight.append('<dd class="away" style="width:' + (100 - foulsHomePercentage) + '%">' + foulsAway + '</dd>');

    if (offsideHome === offsideAway) {
        offsideHomePercentage = 50;
    } else {
        if (offsideHome > offsideAway) {
            offsideHomePercentage = 100 - ((offsideAway / offsideHome) * 100);
        } else {
            offsideHomePercentage = (offsideHome / offsideAway) * 100;
        }
    }
    barFight.append('<dt class="caption">Offsides</dt>');
    barFight.append('<dd class="home" style="width:' + offsideHomePercentage + '%">' + offsideHome + '</dd>');
    barFight.append('<dd class="away" style="width:' + (100 - offsideHomePercentage) + '%">' + offsideAway + '</dd>');

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

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createTablesForView(timePeriods) {
    var container = $('#algors');
    jQuery.each(timePeriods, function (portion, timePeriod) {
        container.append('<div class="row timePeriod' + timePeriod + '"> <div class="col-sm-12"><h4 class="text-center">' + timePeriod + ' minutes gone</h4><br></div> <div class="col-sm-6"> <table class="players-1 table table-players table-bordered table-condensed "> <thead> <tr></tr> </thead> <tbody></tbody> </table> </div> <div class="col-sm-6"> <table class="players-2 table table-players table-bordered table-condensed "> <thead> <tr></tr> </thead> <tbody></tbody> </table> </div> </div><hr>');
    });
}