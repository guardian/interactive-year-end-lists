var matchModel = require('./matchModel.js');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();

// Restrict requests to known good domains
var whitelist = [
    'http://localhost:9000',
    'http://www.theguardian.com',
    'http://localdev.theguardian.com',
    'http://www.code.dev-theguardian.com',
    'http://test.theguardian.com:9000'
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


var crypto = require('crypto');
var base64url = require('base64url');
var fs = require('fs');
var pubKey = fs.readFileSync(__dirname +'/gu_prod_key.pub');

function isCookieValid(cookieValue) {
    var cookieDataBase64 = base64url.toBase64(cookieValue.split('.')[0]);
    var cookieSigBase64 = base64url.toBase64(cookieValue.split('.')[1]);
    var verifier = crypto.createVerify('sha256');
    var buffer = new Buffer(cookieDataBase64, 'base64');

    verifier.update(buffer);
    return verifier.verify(pubKey, cookieSigBase64, 'base64');
}


// DB model
var UserSchema = mongoose.Schema({
    guardianID: String,
    username: String,
    teamSelection: String
});
var User = mongoose.model('User', UserSchema);

var MatchSchema = mongoose.Schema({
    1: Array,
    2: Array,
    stats: Array,
    motm: String
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
        if (err) { throw err; }
        res.send(docs);
    });
});

// Fetch a single user
app.get("/users/:_id", function (req, res) {
    User.findById(req.param('_id'), function (err, user) {
        if (err) {
            res.status(404);
            res.jsonp(err);
        } else {
            res.jsonp(user);
        }
    });
});

app.get('/users', function (req, res) {
    var guardianID = req.param('guardianID');

    User.findOne({ 'guardianID': guardianID }, function (err, user) {
        if (err) {
            res.status(404);
            res.jsonp(err);
        } else {
            res.jsonp(user);
        }
    });
});


// Create new user
app.post('/users', function (req, res) {
    var newUser = new User({
        guardianID: req.body.guardianID,
        username: req.body.username
    });

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
    // var GU_U = req.body.GU_U;
    // if (!GU_U || false === isCookieValid(GU_U)) {
    //     res.status(401);
    //     res.jsonp({'msg': 'user not logged in.'});
    // }
    var userData = {
        guardianID: req.body.guardianID,
        username: req.body.username,
        teamSelection: req.body.teamSelection
    };

    User.findByIdAndUpdate(req.param('_id'), userData, function (err, doc) {
        if (err) {
            res.status(500);
            res.jsonp(err);
        } else {
            res.jsonp(doc);
        }
    });
});


app.get("/match/:_id", function (req, res) {

    var data = matchModel.beginMatch(1, 2);
    res.jsonp(data);

});

// Start server
var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});

