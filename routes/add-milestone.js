// Get all of our fake login data
//var login = require('../login.json');

exports.view = function(req, res){
	
	var goalname =req.params.goalname;
	res.render('add-milestone', {'time' : req.cookies.startTime, 'goalname': goalname});
};

exports.timePost = function(req,res){
	var startTime = req.params.startTime;
	res.cookie('time', startTime, { maxAge: 900000 });
}
