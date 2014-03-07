//var data = require('../login.json');
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
			res.send(data);
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
};

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
  // YOU MUST send an OK response w/ res.send();
  console.log(req.param('name'));
  console.log(req.cookies.user);
  var newGoal = new models.Goal({
    "name":req.param('name'), 
  	"completionDate": new Date(req.param('date')),
  	"color1":req.color1,
  	"color2":req.color2
  });
  console.log(newGoal);
  models.User.update({"username":req.cookies.user},{$push: {goals: newGoal}}, afterQuery);
  function afterQuery(err, projects) {
  	console.log('finished');
  	console.log(projects);
    if(err) console.log(err);
    res.send(projects , 200);
  }
};


exports.addMilestone = function(req, res,callback) {
  console.log(req.param('name') + " goal" + req.param('goal'));
  var newMilestone = new models.Milestone({
    "name":req.param('name'), 
  	"date":req.param('date'),
  	"completed":false
  });
  console.log(newMilestone);
  console.log(req.cookies.user);
  models.User.update({"username":req.cookies.user , 'goals.name' : req.param('goal')},
  	{$push: {'goals.$.milestones': newMilestone}}, afterQuery);
  function afterQuery(err, projects) {
  	console.log('finished');
  	console.log(projects);
    if(err) console.log(err);
    res.send(projects, 200);
  };
};
 

/*
	POST request for deleting a specific goal
	currently unused
*/

exports.deleteGoal = function(req,res){
	console.log('trying to delete');
	//var project = models.User.find({"username":req.cookies.user, goals : {$elemMatch: {_id: ObjectId(req.id)}}).remove().exec(afterQuery);
	models.User.find({"username": req.cookies.user}, afterQuery);
	// models.User.update({"username": req.cookies.user, "goals._id": req.param('goalid')}, 
	// 	{$pull : { goals : {"_id": ObjectId()} } });
	//models.User.update({$pull : { r : {"_id": ObjectId(req.id)} } }, false, afterQuery);
	function afterQuery(err, projects) {
		req.param('goalid')
		console.log(projects);
		project[0].goals.id(req.param('goalid')).remove();
		project[0].save(function(err){
			if(err){
				console.log(err);
				res.send(null, 500);
			}
			else{
				console.log('sucess');
				res.send(projects, 200);
			}
		});		
    	if(err) console.log(err);
  	};
};

exports.deleteMilestone = function(req,res){
	console.log('trying to delete');
	var milestonename = req.param('milestonename');
	var milestonedate = req.param('milestonedate');
	var goalname = req.param('goalname');

	models.User.find({"username": req.cookies.user}, afterQuery);
	function afterQuery(err, projects) {
		var user = projects[0];
		for(var i = 0; i < user.goals.length; ++i){
			if(user.goals[i].name == goalname){
				for(var j = 0; j < user.goals[i].milestones.length; ++j){
					if(user.goals[i].milestones[j].name == milestonename && user.goals[i].milestones[j].date == milestonedate){
						user.goals[i].milestones[j].remove();
						break;
					}
				}
			}
		}
		user.save();
  	};
};

exports.editMilestone = function(req,res){
	console.log('trying to delete');
	var milestonename = req.param('milestoneoldname');
	var milestonedate = req.param('milestoneolddate');
	var goalname = req.param('goalname');

	models.User.find({"username": req.cookies.user}, afterQuery);
	function afterQuery(err, projects) {
		var user = projects[0];
		for(var i = 0; i < user.goals.length; ++i){
			if(user.goals[i].name == goalname){
				for(var j = 0; j < user.goals[i].milestones.length; ++j){
					if(user.goals[i].milestones[j].name == milestonename){
						user.goals[i].milestones[j].remove();
						break;
					}
				}
			}
		}
		user.save();
  	};
}


function logError(err){
	if(err){
		console.log(err);
		res.send(null, 400);
	}
	else
		res.send(null,200);
};

exports.toggleMilestone = function(req,res){
	console.log('trying to toggle');
	var milestonename = req.param('milestonename');
	var milestoneid = req.param('milestoneid');
	var goalname = req.param('goalname');
	var newmilestonestatus = new Boolean(req.param('milestonestatus'));
	console.log('looking for' + milestonename);
	// var user = models.User.find({'username':req.cookies.user, 
	// 	'goals.milestone.id': milestonename, 'goals.milestone.name' : milestoneid});
	// 	user.exec(function(e, data){
	// 		console.log(e);
	// 		console.log(data);
	// 		res.send(data);
	// });
	console.log('goal:' + goalname);
	console.log('setting this to ' + newmilestonestatus);
	models.User.findOne({'username':req.cookies.user}, function(err, user){
		console.log(user);
		for(var i = 0; i < user.goals.length; ++i){
			if(user.goals[i].name == goalname){
				console.log(user.goals[i]);
				for(var j = 0; j < user.goals[i].milestones.length; ++j){

					if(user.goals[i].milestones[j].name == milestonename){
						console.log(user.goals[i].milestones[j].completed);
						user.goals[i].milestones[j].completed = !user.goals[i].milestones[j].completed;
					}
				}
			}
		}

		user.save(logError);

	});



	// models.User.update({'username':req.cookies.user, 'goals.name': goalname, 'goals.$.milestones.name' : milestonename}, 
	// 	{$set: {'goals.$.milestones.$.completed': newmilestonestatus}}, 
	// 	function(err, projects){
	// 	if(!err){
	// 		console.log(projects);
	// 		res.send(projects, 200);
	// 	}
	// 	else{
	// 		console.log(projects);
	// 		console.log(err);
	// 		res.send(null, 400);
	// 	}
	// });
};


exports.getData = function(req, res) {
	// get a random palette from the top ones
	console.log('user is ' + req.cookies.user);

	var user = models.User.find({"username":req.cookies.user});
		user.exec(function(e, data){
			console.log(e);
			console.log(data);
			res.send(data);
	});
};

exports.addEvent = function(req,res){
	console.log(req.param('name'));
  	console.log(req.cookies.user);
  	var newEvent = new models.Event({
		"eventType":req.param('type'),
		"eventTime": new Date(),
		"user":req.cookies.user,
		"eventValue" : req.param('val')
  	});
  	newEvent.save();

};