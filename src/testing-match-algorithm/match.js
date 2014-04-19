var users = {
    1: window.player1,
    2: window.player2
};

var timePeriods = {
    1: 15,
    2: 30,
    3: 45,
    4: 60,
    5: 75
};

var moments = {
    'injuries': 0,
    'goals': 0,
    'redCard': 0,
    'yellowCard': 0
};

createTablesForView(timePeriods);

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
            tmStats = jQuery.extend({}, tStats),
            goalProbability = [];

        theadItems = '<td>' + theadItems.join('</td><td>') + '</td>';
        table.find('thead tr').html(theadItems);

        jQuery.each(players, function (key, value) {

            if (value.attack) {

                var playerEffectedByUnpredictability = false,
                    positiveOrNegativeEffect = true,
                    row = [],
                    modified = jQuery.extend({}, tStats),
                    decimalUnpredictability = (value.unpredictability / 100);

                // Determines if player is even effected by his unpredictability
                if (Math.random() >= 0.5) {
                    row.push(value.name);
                    decimalUnpredictability = 0;
                } else {
                    row.push('<b>' + value.name + '</b>'); // Show bold so effected

                    // Player is effected, good or bad?
                    if (Math.random() <= 0.5) {

                        // Bad game!
                        positiveOrNegativeEffect = false;

                        if (value.starquality >= 18 && Math.random() >= 0.5) {
                            // Star player given a second chance but still having a bad game
                            positiveOrNegativeEffect = true;
                        }
                    }
                }

                row.push(value.position);

                // Modified stats
                modified.attack = (value.attack * decimalUnpredictability).toFixed();
                modified.defense = (value.defense * decimalUnpredictability).toFixed();

                if (!positiveOrNegativeEffect) {
                    if (Math.random() >= 0.5) {

                        // Effected both attack and defense
                        modified.attack = 0 - modified.attack;
                        modified.defense = 0 - modified.defense;

                    } else {

                        // Effected only attack or defense
                        if (Math.random() >= 0.5) {
                            modified.attack = 0 - modified.attack;
                        } else {
                            modified.defense = 0 - modified.defense;
                        }
                    }
                }

                // Stats
                row.push(decimalUnpredictability);
                row.push(value.attack + ' (' + modified.attack + ')');
                row.push(value.defense + ' (' + modified.defense + ')');

                // Total them
                tStats.attack = parseInt(tStats.attack, 10) + parseInt(value.attack, 10);
                tStats.defense = parseInt(tStats.defense, 10) + parseInt(value.defense, 10);
                tmStats.attack = parseInt(tmStats.attack, 10) + parseInt(modified.attack, 10);
                tmStats.defense = parseInt(tmStats.defense, 10) + parseInt(modified.defense, 10);
                tableItems.push('<td>' + row.join('</td><td>') + '</td>');

                goalProbability.push({name: value.name, attack: parseInt(value.attack, 10) + parseInt(modified.attack, 10) });
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

    calculateEndofPeriodScores(1, endOfPeriodStats);
    calculateEndofPeriodScores(2, endOfPeriodStats);

});


function calculateEndofPeriodScores(user, endOfPeriodStats) {

    var difAttack,
        difDefense;

    if (user == 1) {
        difAttack = (parseInt(endOfPeriodStats[1].attack, 10) - parseInt(endOfPeriodStats[2].attack, 10));
        difDefense = (parseInt(endOfPeriodStats[1].defense, 10) - parseInt(endOfPeriodStats[2].defense, 10));
    } else {
        difAttack = (parseInt(endOfPeriodStats[2].attack, 10) - parseInt(endOfPeriodStats[1].attack, 10));
        difDefense = (parseInt(endOfPeriodStats[2].defense, 10) - parseInt(endOfPeriodStats[1].defense, 10));
    }
    var endTimeTotal = (difAttack + difDefense);

    if (endTimeTotal > 0) {
        console.log('user ' + user + ' wins this section of the match.');
    }
}

function createTablesForView(timePeriods) {
    jQuery.each(timePeriods, function (portion, timePeriod) {
        $('#algors').append('<div class="row timePeriod' + timePeriod + '"> <div class="col-sm-12"><h4 class="text-center">' + timePeriod + ' minutes gone</h4><br></div> <div class="col-sm-4"> <table class="players-1 table table-players table-bordered table-condensed "> <thead> <tr></tr> </thead> <tbody></tbody> </table> </div> <div class="col-sm-4"> <table class="players-2 table table-players table-bordered table-condensed "> <thead> <tr></tr> </thead> <tbody></tbody> </table> </div> <div class="col-sm-4"> <table class="endOfTimePeriod table table-bordered table-condensed "> <tbody></tbody> </table> </div> </div><hr>');
    });
}