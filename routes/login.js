var AM = require('../modules/account-manager');
var login = require('../login.json');

exports.loginView = function(req, res){
	console.log(req.cookies);

	// check if the user's credentials are saved in a cookie //
	if (req.cookies.user == undefined || req.cookies.pass == undefined){
		console.log('login no credentials');
		//if(req.param());
		res.render('login', { title: 'Hello - Please Login To Your Account' });
	}	else{
// attempt automatic login //
		AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
			console.log('attempting login');
			if (o != null){
			    req.session.user = o;
				res.redirect('/homescreen');
			}	else{
				//if(req)

				res.render('login', { title: 'Hello - Please Login To Your Account' });
			}
		});
	}
};

exports.loginPost =  function(req, res){
	console.log('login post');
	console.log(req.param('user'));
	console.log(req.param('pass'));
	AM.manualLogin(req.param('user'), req.param('pass'), function(err, o){
		if (!o){
			console.log(err);
			res.send(err, 400);
		}	else{
			console.log('user found');
		    req.session.user = o;
			if (req.param('remember-me') == 'true'){
				//console.log('savingdata' + o.user + o.pass);	
				res.cookie('user', o.user, { maxAge: 900000 });
				res.cookie('pass', o.pass, { maxAge: 900000 });
			}
			res.send(o, 200);
		}
	});
};

exports.signUpView = function(req, res){
	res.render('signup', login);
};

exports.signUpPost = function(req, res){
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
			console.log('error:');
			console.log(e);
			res.send(e, 400);
		}	else{
			res.send('ok', 200);
		}
	});
};

exports.logOutPost = function(req,res){
	res.clearCookie('user');
	res.clearCookie('pass');
	console.log('lgout');
	//console.log(req.cookie.user);
	req.session.destroy(function(e){ res.send('ok', 200); });
}