var matchModel = require('./matchModel.js');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var verifyGUCookie = require('./verifyGuardianCookie');
var app = express();

// Restrict requests to known good domains
var whitelist = [
    'http://localhost:9000',
    'http://www.theguardian.com',
    'http://localdev.theguardian.com',
    'http://www.code.dev-theguardian.com',
    'http://test.theguardian.com:9000',
    'http://localdev.theguardian.com:9000',
    'http://daan.theguardian.com:9000'
];
var corsOptions = {
    origin: function (origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
};

// Setup
app.use(cors(corsOptions));
app.use(bodyParser());
mongoose.connect("mongodb://localhost/test");


// Helper functions
function isValidUser(req) {
    // FIXME: DEBUG ALLOW ALL USERS
    return true;
    //var GU_U = req.body.auth;
    //return (GU_U && verifyGUCookie(GU_U));
}


// DB model
var UserSchema = mongoose.Schema({
    guardianID: String,
    username: String,
    player0: String,
    player1: String,
    player2: String,
    player3: String,
    player4: String,
    player5: String,
    player6: String,
    player7: String,
    player8: String,
    player9: String,
    player10: String,
    teamStarRating: Number
});
var User = mongoose.model('User', UserSchema);

var MatchSchema = mongoose.Schema({
    1: {
        guardianID: String,
        username: String,
        squad: Array,
        injuries: Array,
        goals: Array,
        missedChance: Array,
        redCard: Array,
        yellowCard: Array,
        teamStarRating: Number
    },
    2: {
        guardianID: String,
        username: String,
        squad: Array,
        injuries: Array,
        goals: Array,
        missedChance: Array,
        redCard: Array,
        yellowCard: Array,
        teamStarRating: Number
    },
    stats: {
        possessionHome: Number,
        cornerHome: Number,
        cornerAway: Number,
        foulsHome: Number,
        foulsAway: Number,
        offsideHome: Number,
        offsideAway: Number,
        shotsOnHome: Number,
        shotsOnAway: Number,
        shotsOffHome: Number,
        shotsOffAway: Number,
        cornerHomePercent: Number,
        foulsHomePercent: Number,
        offsideHomePercent: Number
    },
    motm: String,
    venue: {
        stadium: String,
        location: String,
        attendance: Number
    },
    time: Number
});
var Match = mongoose.model('Match', MatchSchema);


/**
 *  Routes
 */

// Endpoint HTTP options
app.options('*', cors(corsOptions));


// DEV LIST ALL USERS!
// FIXME: DELETE THIS ROUTE
app.get("/allusers", function (req, res) {
    User.find({}, function (err, docs) {
        if (err) {
            throw err;
        }
        res.send(docs);
    });
});

// Fetch a single user
app.get("/users/:_id", function (req, res) {
    User.findById(req.param('_id'), function (err, user) {
        if (err || user === null) {
            res.status(404);
            res.jsonp(err);
            return;
        }

        res.jsonp(user);
    });
});

app.get('/users', function (req, res) {
    var guardianID = req.param('guardianID');
    User.findOne({
        'guardianID': guardianID
    }, function (err, user) {
        if (err || user === null) {
            //res.status(404);
            res.jsonp(err);
            return;
        }
        
        res.jsonp(user);
    });
});


// Create new user
app.post('/users', function (req, res) {
       
    var userData = {
        guardianID: req.body.guardianID,
        username: req.body.username,
        player0: req.body.player0,
        player1: req.body.player1,
        player2: req.body.player2,
        player3: req.body.player3,
        player4: req.body.player4,
        player5: req.body.player5,
        player6: req.body.player6,
        player7: req.body.player7,
        player8: req.body.player8,
        player9: req.body.player9,
        player10: req.body.player10
    };

    // Calc and store team star rating
    userData.teamStarRating = matchModel.calcTeamStarRating(userData);
   
    var newUser = new User(userData);

    newUser.save(function (err, product) {
        // If save failed send error response
        if (err) {
            res.status(409);
            res.jsonp(err);
        } else {
            // Send back saved data with new mongo UID
            res.jsonp(product);
        }
    });

});


// Update existing user data
app.put("/users/:_id", function (req, res, next) {
    var userData = {
        guardianID: req.body.guardianID,
        username: req.body.username,
        player0: req.body.player0,
        player1: req.body.player1,
        player2: req.body.player2,
        player3: req.body.player3,
        player4: req.body.player4,
        player5: req.body.player5,
        player6: req.body.player6,
        player7: req.body.player7,
        player8: req.body.player8,
        player9: req.body.player9,
        player10: req.body.player10
    };

    // Calc and store team star rating
    userData.teamStarRating = matchModel.calcTeamStarRating(userData);

    User.findByIdAndUpdate(req.param('_id'), userData, function (err, doc) {
        if (err) {
            res.status(500);
            res.jsonp(err);
        } else {
            res.jsonp(doc);
        }
    });
});


app.get("/allmatches", function (req, res) {
    Match.find({}, function (err, docs) {
        if (err) {
            throw err;
        }
        res.send(docs);
    });
});


app.post('/result', function(req, res) {
    // Check if user is logged in
    if (!isValidUser(req)) {
        res.status(401);
        res.jsonp({'msg': 'User not logged in'});
        return;
    }

    var user1 = req.param('user1');
    var user2 = req.param('user2');
  
    // Check we have user IDs
    if (!user1 || !user2) {
        res.status(404);
        res.jsonp({'msg': 'Missing user ids'});
        return;
    }

    // Check user isn't playing against themselves
    if (user1 === user2) {
        res.status(400);
        res.jsonp({'msg': 'Players are the same'});
        return;

    }

    // All good. Lets play
    fetchUserDetails(user1, user2, res);
});


function fetchUserDetails(user1, user2, res) {
    User.find({
      '_id': { $in: [
          user1,
          user2
      ]}
    },
    function(err, docs) {
        if (err || docs.length !== 2) {
            res.status(404);
            res.jsonp({'msg': 'Failed to fetch uses', error: err});
            return;
        }

        // Extract users from DB results to ensure order
        var user1Doc = docs.filter(function(user) {              
            return user._id.toString() === user1;                
        })[0];                                                   
                                                                 
        var user2Doc = docs.filter(function(user) {              
            return user._id.toString() === user2;                
        })[0];                                                   
                                                                 
        // Check if both users have valid squads                                                         
        if (hasValidSquad(user1Doc) && hasValidSquad(user2Doc)) {
            isPlayerAllowedToPlay(user1Doc, user2Doc, res);      
        } else {
            res.status(400);
            res.jsonp({'msg': 'Users don\'t have full squards'});
        }
    });
}

// Users can have a max of 1000 match recors and can only recreate a new record
// every 10 seconds.
function isPlayerAllowedToPlay(user1Doc, user2Doc, res) {
    Match.find({ '1.guardianID' : user1Doc.guardianID }, {time: 1}, { sort: { 'time': -1} },
        function(err, docs) {

            if (err) {
                 res.status(400);
                 res.jsonp({'msg': 'Error fetching users match history'});
                 return;
            }
            
            // Check if they've played any matches
            if (docs.length > 0) {
                
                // Not allowed to player more than 1000 matches
                if (docs.length > 1000) {
                    res.status(400);
                    res.jsonp({'msg': 'User has played too many matches'});
                    return;
                }
                
                /* NOTE: Disabling time restriction
                // Can only play a match every 10 seconds
                var timeDiff = Date.now() - docs[0].time;
                if (timeDiff < 10000) {
                    res.status(400);
                    res.jsonp({'msg': 'User tried to play again too soon'});
                    return;
                }
                */

            }
            
            // Everything's good. Let's play a match.
            createMatchResult(user1Doc, user2Doc, res);
            
    });
    //db.matches.find({ "1.guardianID" : "01" }, {time: 1}).sort({time: -1})
}

function hasValidSquad(user) {
    for (var key in user) {
        if (user[key] === null) {
            return false;
        }
    }

    return true;
}

function createMatchResult(user1, user2, res) {
    var resultData = matchModel.createResult(user1, user2);
    var newMatch = new Match(resultData);
    newMatch.save(function (err, product) {
        // If save failed send error response
        if (err) {
            res.status(409);
            res.jsonp(err);
        } else {
            // Send back saved data with new mongo UID
            res.jsonp(product);
        }
    });
}

app.get('/result/:id', function(req, res) {
    Match.findById(req.params.id, function(err, matchRecord) {
        if (err || matchRecord === null) {
            res.status(404);
            res.json({'msg': 'Could not find match', err: err });
            return;
        }

        res.json(matchRecord);
    });
});

// User's match resuls total
app.get('/results/:userid', function(req, res) {
    var userID = req.params.userid;

    if (!userID) {
        res.status(401);
        res.jsonp({'msg': 'No user id provided'});
        return;
    }

    var query = {
        '$or': [
            { '1.guardianID' : userID.toString()},
            { '2.guardianID' : userID.toString()}
        ]
    };

    Match.find(query, {}, {sort: { 'time': -1}},  function(err, matchRecords) {
        if (err || matchRecords === null) {
            res.status(404);
            res.json({'msg': 'Could not find users matches match', err: err });
            return;
        }


        function latestMatches(matches) {
            var subSetMatches = matches.slice(0, 9);
            return subSetMatches.map(function(match) {
                return {
                    user1ID: match['1'].guardianID,
                    user1Name: match['1'].username,
                    user1Goals: match['1'].goals.length,
                    user2ID: match['2'].guardianID,
                    user2Name: match['2'].username,
                    user2Goals: match['2'].goals.length,
                    id: match._id,
                    time: match.time
                };
            });
        }

        var results = {
            gamesPlayed: matchRecords.length,
            gamesWon:    0,
            gamesDrawn:  0,
            gamesLost:   0,
            latestResults: latestMatches(matchRecords) 
        };

        matchRecords.forEach(function(record) {
            // Find the correct player index
            var p1, p2;
            if (record['1'].guardianID === userID) {
                p1 = record['1'];
                p2 = record['2'];
            } else {
                p1 = record['2'];
                p2 = record['1'];
            }
            
            // Win
            if (p1.goals.length > p2.goals.length) {
                results.gamesWon++;
            }
            
            // Draw
            if (p1.goals.length === p2.goals.length) {
                results.gamesDrawn++;
            }
            
            // Lose
            if (p1.goals.length < p2.goals.length) {
                results.gamesLost++;
            }
        });

        res.json(results);
    });
});


// Start server
var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});
