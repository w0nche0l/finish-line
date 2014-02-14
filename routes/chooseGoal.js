// Get all of our fake login data
var login = require('../login.json');

exports.view = function(req, res){
	res.render('choose-goal', login);
};