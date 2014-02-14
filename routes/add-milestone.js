// Get all of our fake login data
//var login = require('../login.json');

exports.view = function(req, res){
	
	var goalname =req.params.goalname;
	res.render('add-milestone', {'goalname': goalname});
};