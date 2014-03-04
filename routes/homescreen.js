// Get all of our user data
var AM = require('../modules/account-manager');
var login = require('../login.json');

exports.view = function(req, res){
	
	console.log(req.cookies);
	// check if the user's credentials are saved in a cookie //
	if (req.cookies.user == undefined || req.cookies.pass == undefined){
		console.log('no credentials');
		res.redirect('/');
		//res.render('login', { title: 'Hello - Please Login To Your Account' });
	}	else{
// attempt automatic login //
		AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
			console.log('attempting login');
			if (o != null){
			    req.session.user = o;
			    var goalname =req.params.goalname;
				res.render('homescreen', {test: false,'goalname': goalname});
				//res.redirect('/homescreen');
			}	else{
				res.render('login', {  title: 'Hello - Please Login To Your Account' });
			}
		});
	}
	//console.log(login);
};

exports.altView = function(req,res){
	console.log(req.cookies);
	// check if the user's credentials are saved in a cookie //
	if (req.cookies.user == undefined || req.cookies.pass == undefined){
		console.log('no credentials');
		res.redirect('/');
		//res.render('login', { title: 'Hello - Please Login To Your Account' });
	}	else{
// attempt automatic login //
		AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
			console.log('attempting login');
			if (o != null){
			    req.session.user = o;
			    var goalname =req.params.goalname;
				res.render('homescreen', {test:true, 'goalname': goalname});
				//res.redirect('/homescreen');
			}	else{
				res.render('login', { title: 'Hello - Please Login To Your Account' });
			}
		});
	}
	//console.log(login);
};