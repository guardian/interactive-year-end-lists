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
    'http://www.code.dev-theguardian.com'
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

app.get("/beginmatch", function (req, res) {
            var users1 = [{uid:"P015",countryname:"Brazil",name:"Roberto Carlos",position:"LB",attack:15,defense:10,discipline:10,creativity:12,unpredictability:14,volatility:8,starquality:15,rowNumber:15,countrycode:"br",imageSrc:null,wantedPosition:"LB"},{uid:"P029",countryname:"France",name:"Marcel Desailly",position:"CB",attack:6,defense:17,discipline:20,creativity:3,unpredictability:3,volatility:9,starquality:6,rowNumber:29,countrycode:"fr",imageSrc:null,wantedPosition:"CB"},{uid:"P026",countryname:"Italy",name:"Franco Baresi",position:"CB",attack:8,defense:20,discipline:20,creativity:6,unpredictability:3,volatility:2,starquality:20,rowNumber:26,countrycode:"it",imageSrc:null,wantedPosition:"CB"},{uid:"P052",countryname:"Germany",name:"Paul Breitner",position:"RB",attack:17,defense:18,discipline:20,creativity:12,unpredictability:10,volatility:5,starquality:17,rowNumber:52,countrycode:"de",imageSrc:null,wantedPosition:"RB"},{uid:"P092",countryname:"Portgual",name:"Cristiano Ronaldo",position:"MR",attack:19,defense:17,discipline:17,creativity:19,unpredictability:18,volatility:15,starquality:20,rowNumber:92,imageSrc:null,wantedPosition:"MR"},{uid:"P069",countryname:"France",name:"Michel Platini",position:"MC",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:69,countrycode:"fr",imageSrc:null,wantedPosition:"MC2"},{uid:"P070",countryname:"France",name:"Alain Giresse",position:"MC",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:70,countrycode:"fr",imageSrc:null,wantedPosition:"MC2"},{uid:"P058",countryname:"Holland",name:"Johan Cruyff",position:"ML",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:58,imageSrc:null,wantedPosition:"ML"},{uid:"P101",countryname:"Argentina",name:"Diego Maradona",position:"ST",attack:20,defense:12,discipline:7,creativity:20,unpredictability:20,volatility:20,starquality:20,rowNumber:101,countrycode:"ar",imageSrc:null,wantedPosition:"ST2"},{uid:"P107",countryname:"Argentina",name:"Mario Kempes",position:"ST",attack:17,defense:10,discipline:10,creativity:15,unpredictability:15,volatility:14,starquality:16,rowNumber:107,countrycode:"ar",imageSrc:null,wantedPosition:"ST2"},{uid:"P009",countryname:"Russia",name:"Rinat Dasayev",position:"GK",attack:0,defense:16,discipline:16,creativity:0,unpredictability:7,volatility:5,starquality:7,rowNumber:9,countrycode:"ru",imageSrc:null,wantedPosition:"GK"}];

            var users2 = [{uid:"P026",countryname:"Italy",name:"Franco Baresi",position:"CB",attack:8,defense:20,discipline:20,creativity:6,unpredictability:3,volatility:2,starquality:20,rowNumber:26,countrycode:"it",imageSrc:null,wantedPosition:"CB"},{uid:"P100",countryname:"Brazil",name:"Pelé",position:"ST",attack:20,defense:12,discipline:7,creativity:20,unpredictability:20,volatility:17,starquality:20,rowNumber:100,countrycode:"br",imageSrc:null,wantedPosition:"ST"},{uid:"P101",countryname:"Argentina",name:"Diego Maradona",position:"ST",attack:20,defense:12,discipline:7,creativity:20,unpredictability:20,volatility:20,starquality:20,rowNumber:101,countrycode:"ar",imageSrc:null,wantedPosition:"ST2"},{uid:"P073",countryname:"Argentina",name:"Luis Monti",position:"MC",attack:12,defense:20,discipline:18,creativity:10,unpredictability:5,volatility:20,starquality:15,rowNumber:73,countrycode:"ar",imageSrc:null,wantedPosition:"MC"},{uid:"P063",countryname:"Hungary",name:"Zoltan Czibor",position:"ML",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:63,countrycode:"hu",imageSrc:null,wantedPosition:"ML"},{uid:"P069",countryname:"France",name:"Michel Platini",position:"MC",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:69,countrycode:"fr",imageSrc:null,wantedPosition:"MC2"},{uid:"P092",countryname:"Portgual",name:"Cristiano Ronaldo",position:"MR",attack:19,defense:17,discipline:17,creativity:19,unpredictability:18,volatility:15,starquality:20,rowNumber:92,imageSrc:null,wantedPosition:"MR"},{uid:"P050",countryname:"Brazil",name:"Djalma Santos",position:"RB",attack:"",defense:"",discipline:"",creativity:"",unpredictability:"",volatility:"",starquality:"",rowNumber:50,countrycode:"br",imageSrc:null,wantedPosition:"RB"},{uid:"P028",countryname:"Chile",name:"Elías Figueroa",position:"CB",attack:6,defense:17,discipline:20,creativity:3,unpredictability:3,volatility:9,starquality:6,rowNumber:28,imageSrc:null,wantedPosition:"CB2"},{uid:"P013",countryname:"Italy",name:"Paolo Maldini",position:"LB",attack:13,defense:19,discipline:18,creativity:10,unpredictability:7,volatility:3,starquality:12,rowNumber:13,countrycode:"it",imageSrc:null,wantedPosition:"LB"},{uid:"P007",countryname:"Italy",name:"Gianluigi Buffon",position:"GK",attack:0,defense:17,discipline:18,creativity:0,unpredictability:3,volatility:5,starquality:17,rowNumber:7,countrycode:"it",imageSrc:null,wantedPosition:"GK"}];

    var data = matchModel.beginMatch(users1, users2);
    res.jsonp(data);
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

// Start server
var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});

