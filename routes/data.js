var data = require('../login.json');

exports.getData = function(req, res) {
	// get a random palette from the top ones
	res.json(data);
}