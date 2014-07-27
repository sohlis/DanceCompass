var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var redis = require('redis');
var db = redis.createClient();
var db2 = redis.createClient();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	req.db = db;
	next();
});
app.use('/', routes);
app.use('/api', api);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var minReste
var lastTimestamp = 0;
db2.on("message", function(channel, message) {
	console.log("message");
	if(channel == "stream") {
		try {
			var data = JSON.parse(message);
			if(data === undefined || data.stage === undefined) {
				return;	
			}
			var intensityField = "intensity" + data.stage;
			db.sadd("stages", data.stage);
			db.get(intensityField,function(err, reply) {
				var val=parseFloat(reply);
				data.intensity = parseFloat(data.intensity);
				if(!isNaN(val)) {
					db.get("lastTS" + data.stage, function(err, reply2) {
						var td=parseFloat(data.timestamp - reply2) / 1000.0;
						var r=Math.pow(0.9,td)
						if(r > 1) {
							r=0.99;
						}
						var newIntensity = val*r + (1.0-r)*data.intensity;
						db.set(intensityField, newIntensity);
						db.set("lastTS" + data.stage, data.timestamp);

					});
				}
				else {
					db.set(intensityField,data.intensity);
					db.set("lastTS" + data.stage, data.timestamp);
				}

			});
		} catch(ex) {
		}
	}
});

db2.on("subscribe", function(channel, count) {
	console.log("Subscribed");
});
db2.subscribe("stream");

module.exports = app;
