
var AM = require('../modules/account-manager');
var login = require('../login.json');

exports.view = function(req, res){
	//console.log(login);
	res.render('signup', login);
};

exports.post = function(req, res){
	console.log(req.param('name'));
	console.log(req.param('user'));
	console.log(req.param('pass'));
	AM.addNewAccount({
		name 	: req.param('name'),
		email 	: req.param('email'),
		user 	: req.param('user'),
		pass	: req.param('pass')
	}, function(e){
		if (e){
			res.send(e, 400);
		}	else{
			res.send('ok', 200);
		}
	});
};
