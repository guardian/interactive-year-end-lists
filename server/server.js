var express = require('express'),
mongoose = require('mongoose'),
http = require('http'),
path = require('path');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

mongoose.connect("mongodb://localhost/worldCup");
mongoose.connection.on('open', function() {
    console.log("Connected to Mongoose...");
});

var UserSchema = mongoose.Schema({
    id: String,
    username: String,
    teamSelection: Array
});

var User = mongoose.model('User', UserSchema);

app.get("/users", function(req, res, next) {

    //User.find().remove().exec();

    User.find({},function(err,docs){
        if(err) throw err;
        res.send(docs);
    });

    console.log('/users GET endpoint');
});

app.put("/users/:id", function(req, res, next){
    var id = req.params.id;
    User.findById(id, function(err, user) {
        if(err) throw err;
        user.username = req.body.username,
        user.teamSelection = req.body.teamSelection
        user.save(function(err) {
            if(err) throw err;
            res.send(user);
        });
    });
});

app.del("/users/:id", function(req, res, next){
    var id = req.params.id;
    User.findById(id, function(err, user) {
        user.remove(function(err) {
            if(err) throw err;

        });
    });
});

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});