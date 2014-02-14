// Get all of our fake login data
var login = require('../login.json');

exports.view = function(req, res){
	console.log(login);
	res.render('login', login);
};