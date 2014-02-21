var data = require('../login.json');
var models = require('../models');
var ObjectId = require('mongodb').ObjectId;


/*
	POST request for getting milestones
*/

exports.getUserData = function(req,res, callback){
	console.log(req.param('goal'));
	console.log('user is ' + req.cookies.user);

	var user = models.User.find({"username":req.cookies.user});
		user.exec(function(e, data){
			console.log(e);
			console.log(data);
			//res.send(data);
	});


	var other = models.Goal.find({"name":"Read Hamlet"});
	other.exec(function(e, data){
			console.log('printing other');
			console.log(e);
			console.log(data);
			//res.send(data);
			console.log('done printing other');
	});
	/*if(req.param('goal') == undefined){//get everything
		var user = models.User.find({"username":req.cookies.user});
		user.exec(function(e, res){
			console.log(e);
			console.log(res);
		});

		var user = models.Goal.find({"name":"Read Hamlet"});
		user.exec(function(e, res){
			console.log(e);
			console.log(res);
		});
	}
	else{
		var user = models.User.find({"username":req.cookies.user});
		user.exec(function(e, res){
			console.log(e);
			console.log(res);
		});
	}*/
}

/*
	POST request for adding milestone to a specific goal
*/


/*
	POST request for deleting milestone from a specific goal
*/

/*
	POST request for getting list of goals
*/

/*
	POST request for adding to list of goals
*/


exports.addGoal = function(req, res) {
  //var form_data = req.body;
  //console.log(form_data);
  // make a new Project and save it to the DB
  // YOU MUST send an OK response w/ res.send();
  var newGoal = new models.Goal({
    "name":req.name, 
  	"completionDate":req.date,
  	"color1":req.color1,
  	"color2":req.color2
  });
  console.log(newGoal);
  models.User.update({"username":req.cookies.user},{$push: {goals: newGoal}},afterQuery);
  function afterQuery(err, projects) {
    if(err) console.log(err);
  }
}


exports.addMilestone = function(req, res) {
  //var form_data = req.body;
  //console.log(form_data);
  // make a new Project and save it to the DB
  // YOU MUST send an OK response w/ res.send();
  var newGoal = new models.Goal({
    "name":req.name, 
  	"completionDate":req.date,
  	"color1":req.color1,
  	"color2":req.color2
  });
  models.User.update({"username":req.cookies.user},{$push: {goals: newGoal}},afterQuery);
  function afterQuery(err, projects) {
    if(err) console.log(err);
    res.send();
  }
}

/*
	POST request for deleting a specific goal
*/

exports.deleteGoal = function(req,res){
	console.log('trying to delete');


	//var project = models.User.find({"username":req.cookies.user, goals : {$elemMatch: {_id: ObjectId(req.id)}}).remove().exec(afterQuery);
	models.User.find({"username": req.cookies.user, 'goals._id': req.goalid}).remove().exec(afterQuery);
	models.User.update({"username": req.cookies.user, "goals._id": req.goalid}, {$pull : { goals : {"_id": ObjectId(req.goalid)} } });
	console.log('done');
	//models.User.update({$pull : { r : {"_id": ObjectId(req.id)} } }, false, afterQuery);
	function afterQuery(err, projects) {
		console.log(projects);
    	if(err) console.log(err);
  	}
}
 
exports.toggleMilestone = function(req,res){
	console.log('trying to toggle');
	var milestonename = req.mlname;
	var milestoneid = req.mlid;

	models.User.update({'username':req.cookies.user, 'goals.milestone.id': mlid, 'goals.milestone.name' : mlname}, {'$set': {
    	'goals.$.$.completed': 'true'
	}}, function(err){
		console.log(err);
	});
}


exports.getData = function(req, res) {
	// get a random palette from the top ones

	console.log('user is ' + req.cookies.user);

	var user = models.User.find({"username":req.cookies.user});
		user.exec(function(e, data){
			console.log(e);
			console.log(data);
			res.send(data);
	});
}