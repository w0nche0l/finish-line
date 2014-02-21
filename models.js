
var Mongoose = require('mongoose');

var MilestoneSchema = new Mongoose.Schema({
  // fields are defined here
  "name":String, 
  "date":Date,
  "completed":Boolean
});


var GoalSchema = new Mongoose.Schema({
  // fields are defined here
  "name":String, 
  "completionDate":Date,
  "color1":String,
  "color2":String,
  "milestones":[MilestoneSchema]
});



var UserSchema = new Mongoose.Schema({
  // fields are defined here
  "firstname":String, 
  "username":String,
  "email":String,
  "goals":[GoalSchema]
});

exports.Milestone = Mongoose.model('Milestone', MilestoneSchema);
exports.Goal = Mongoose.model('Goal', GoalSchema);
exports.User = Mongoose.model('User', UserSchema);


