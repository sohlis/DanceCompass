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
	req.db.get("intensity", function(err, reply) {
		res.send(reply);
	});
});
module.exports = router;

