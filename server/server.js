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
app.use(app.router);
mongoose.connect("mongodb://localhost/test");

// Routes
app.options('*', cors(corsOptions));

app.get("/users/:id", function(req, res, next) {
    console.log('GET: ', req.params.id);
    res.jsonp({ 'id': req.params.id });
});

app.put("/users/:id", function(req, res, next) {
    console.log('PUT: ', req.params.id);
    res.jsonp({ 'id': req.params.id });
});


// Start server
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});