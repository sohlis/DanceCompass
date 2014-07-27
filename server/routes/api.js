var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res) {
	var data = req.body;
	console.log(data);
	data.timestamp = Date.now();
	req.db.publish("stream",JSON.stringify(data));
	console.log(data);
	res.send("ok");
});
router.get('/', function(req, res) {
	req.db.smembers("stages", function(err, reply) {
		console.log(reply);
		var m = req.db.multi();
		for(var i in reply) {
			m = m.get("intensity" + reply[i]);	
		}
		m.exec(function(err, replies) {
			console.log("REPLIES");
			console.log(replies);
			var ret = {};
			for(i in reply) {
				ret[reply[i]] = replies[i];
			}
			res.send(JSON.stringify(ret));
		});
	});
});
router.get('/clear', function(req, res) {
	req.db.flushdb();
	res.send("Cleared");
});
module.exports = router;

