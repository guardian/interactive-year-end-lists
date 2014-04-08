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

// Routes
app.options('*', cors(corsOptions));


var UserSchema = mongoose.Schema({
    guardianID: String,
    username: String,
    teamSelection: String
});
var User = mongoose.model('User', UserSchema);


app.get("/users", function(req, res, next) {

    var params = {};

    if(req.params.id) {
        params = {guardianID: req.params.id};
    }

    User.find(params ,function(err,docs){
        if(err) throw err;
        res.send(docs);
    });
});

app.get("/users/:guardianID", function(req, res, next) {

//    User.find().remove().exec();
    User.findOne({guardianID: req.params.guardianID}, function(err, user) {
        if(err) throw err;
        res.jsonp(user);
    });
});

app.put("/users/:guardianID", function(req, res, next){

    User.findOne({guardianID: req.params.guardianID}, function(err, user) {
        if(err) throw err;

        if(user) {
            user.username = req.body.username;
            user.teamSelection = req.body.teamSelection;
        } else {
            var user = new User(req.body);
        }
        user.save(function (err) {
            if(err) throw err;
            res.jsonp(user);
        });
    });

});

app.del("/users/:guardianID", function(req, res, next){
    var id = req.params.guardianID;
    User.findById(id, function(err, user) {
        user.remove(function(err) {
            if(err) throw err;

        });
    });
});



// Start server
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});