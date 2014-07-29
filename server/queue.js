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
						var r=Math.pow(0.5,td);

						if(r > 1) {
							r=0.99;
						}
						var newIntensity = r*val + .5*data.intensity;
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

