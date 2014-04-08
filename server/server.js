var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();

// Restrict requests to known good domains
var whitelist = ['http://localhost:9000', 'http://www.theguardian.com'];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    }
};

// Setup
app.use(cors(corsOptions));
app.use(express.bodyParser());
app.use(app.router);
mongoose.connect("mongodb://localhost/test");


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
app.get("/allusers", function(req, res) {
    User.find({} ,function(err,docs){
        if(err) { throw err; }
        res.send(docs);
    });
});

// Fetch a single user
app.get("/users/:_id", function(req, res) {
    User.findById(req.params._id, function(err, user) {
        if(err) { throw err; }
        res.jsonp(user);
    });
});

app.get('/users', function(req, res) {
    var guardianID = req.param('guardianID');
     User.findOne({ 'guardianID': guardianID }, function(err, user) {
        if(err) { throw err; }
        res.jsonp(user);
    });
});


// Create new user
app.post('/users', function(req, res) {
    var newUser = new User({
        guardianID: req.body.guardianID
    });

    newUser.save(function(err, product) {
        // If save failed send error response
        if (err) {
            res.status(409);
            res.jsonp(err);
        }

        // Send back saved data with new mongo UID
        res.jsonp(product);
    });

});


// Update existing user data
app.put("/users/:_id", function(req, res, next){
    var userData = {
        guardianID: req.body.guardianID,
        username: req.body.username,
        teamSelection: req.body.teamSelection
    };

    User.findByIdAndUpdate(req.params._id, userData, function(err, doc) {
        if (err) {
            res.status(500);
            res.jsonp(err);
        }

        res.jsonp(doc);
    });
});


// Delete a user
app.del("/users/:guardianID", function(req, res, next){
    User.findByIdAndRemove(req.params.guardianID, function(err, user) {
        if(err) {
            res.status(500);
            res.jsonp(err);
        }

        res.status(200);
    });
});


// Start server
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});