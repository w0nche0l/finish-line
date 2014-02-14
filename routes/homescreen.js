// Get all of our user data
var login = require('../login.json');

exports.view = function(req, res){
	console.log(login);
	var goalname =req.params.goalname;
	res.render('homescreen', {'goalname': goalname});
};