// Get all of our user data
var login = require('../login.json');

exports.view = function(req, res){
	res.render('menu', login);
};