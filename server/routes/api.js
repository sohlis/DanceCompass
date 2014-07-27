var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res) {
	var data = JSON.parse(req.param('data'));
	req.db.publish("stream",JSON.stringify(data));
	res.send("ok");
});
router.get('/', function(req, res) {
	req.db.get("intensity", function(err, reply) {
		res.send(reply);
	});
});
module.exports = router;

