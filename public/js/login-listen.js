// Call this function when the page loads (the "ready" event)
$(document).ready(function() {

	$('.btn-register').click(loginFunction);
	$('#btn-cancel').click(cancelFunction);
	$('#btn-add').click(addFunction);
	$('#submit-btn').click(cancelFunction);
	console.log('blah');
	addMilestones($('.milestone-list'));
	addEvents($('.timeline-wrapper'));
	addGoals($('#goal-list'));
})

function addMilestones(e){
	if(e.length ==0)
		return;
	console.log('blah');
	$.get('/data', gotMilestones);
}

function gotMilestones(result){
	var milestoneList = $('.milestone-list');
	console.log(result);
	var goalname = $('#goal-name-hack').html();
	console.log($('#goal-name-hack').html());
	var goals = result['user']['goals'];
	var realgoal ;
	for(var i = 0 ; i < goals.length; ++i){
		if(goals[i].name == goalname)
			realgoal = goals[i];
	}
	console.log(realgoal);
	for(var i = 0; i < realgoal.milestones.length; ++i){

		milestoneList.append('<button type="button" class="btn btn-default">' + realgoal.milestones[i].name+'</button>')
	}

}

function addGoals(e){
	if(e.length ==0)
		return;
	console.log('blah');
	$.get('/data', gotGoals);
}

function gotGoals(result){
	if($('#mainmenu').length==0){
		var goalList = $('#goal-list');
		console.log(result);
		var goals = result['user']['goals'];
		console.log(goals);
		for(var i = 0; i< goals.length; ++i){
			var string = '<li><a href="/add-milestone/' + goals[i].name+ '">' + goals[i].name +  '</a></li>';
			goalList.append(string);
		}
	}
	else{
		var goalList = $('#goal-list');
		console.log(result);
		var goals = result['user']['goals'];
		console.log(goals);
		for(var i = 0; i< goals.length; ++i){
			var string = '<li><a href="/homescreen/' + goals[i].name+ '">' + goals[i].name +  '</a></li>';
			goalList.append(string);
		}
	}
}



function addEvents(e){
	if(e.length ==0)
		return;
	console.log('blah');
	$.get('/data', gotEvents);
}

function gotEvents(result){
	var timeline = $('.timeline-wrapper');
	console.log(result);
	var goals = result['user']['goals'];
	console.log(goals);
	var milestones = new Array();
	
	var goalname = $('#goal-name-hack').html();
	console.log(goalname);
	if(goalname != ''){
		var realgoal ;
		var realgolnum;
		for(var i = 0 ; i < goals.length; ++i){
			if(goals[i].name == goalname){
				realgoal = goals[i];
				realgolnum = i;
				break;
			}
		}
		var milestonelist = realgoal.milestones;
		for(var j = 0; j <milestonelist.length; ++j){
			milestonelist[j].actualDate = new Date(milestonelist[j]['date']);
			milestonelist[j].goalNum = realgolnum;
			milestonelist[j].milestoneNum = j;
			milestones.push(milestonelist[j]);
		}
	}
	else{
		for(var i = 0; i < goals.length; ++i){
			var milestonelist = goals[i]['milestones'];
			for(var j = 0; j <milestonelist.length; ++j){
				milestonelist[j].actualDate = new Date(milestonelist[j]['date']);
				milestonelist[j].goalNum = i;
				milestonelist[j].milestoneNum = j;
				milestones.push(milestonelist[j]);
			}
		}
	}
	milestones.sort(dateComp);
	for(var i = 0; i < milestones.length ; ){
		var date = milestones[i].actualDate;
		var dayMilestones = new Array();
		while(i < milestones.length && milestones[i].actualDate.getTime() == date.getTime()){
			dayMilestones.push(milestones[i]);
			i++;
		}

		var string = '<h2 class="date">'+ date.toDateString() + ' </h2>'
		for(var j = 0; j < dayMilestones.length; ++j){
			if(dayMilestones[j].actualDate > Date.now()){
				string+= '<div class = "event event-incomplete">';
				string+= '<p class="event-complete-time">' + goals[dayMilestones[j].goalNum].name + '</p>';
			}
			else{
				string+= '<div class = "event">';
				string+= '<p class="event-complete-time">' + goals[dayMilestones[j].goalNum].name + '</p>';
			}
			string+=
                '<p class="milestone-progress">' +
                	(dayMilestones[j].milestoneNum+1) + '/'+goals[dayMilestones[j].goalNum]['milestones'].length+
                '</p><br />' +
    			'<p class="event-description"><span class="glyphicon glyphicon-ok"></span>&nbsp;&nbsp;'+ dayMilestones[j].name + '</p>' +
    			'</div>';
		}
		string = '<div class = "day">' + string  + '</div>';
		if(i == milestones.length)
			string += '<div class="event event-complete event-add">'+
                	'<p class="event-description"><a href="/choose-goal" class="add-milestone">Add Milestone</a></p>'+
                '</div>';
   		timeline.append(string);
	}

	
	console.log(milestones);
}

function dateComp(a,b){
	return new Date(a.actualDate)-new Date(b.actualDate);
}

function loginFunction(e){
	e.preventDefault();
	//replace this with actual login information
	window.location.href='/signup';
};

function cancelFunction(e){
	e.preventDefault();
	window.location.href= '/homescreen';
};

function addFunction(e){
	e.preventDefault();
	window.location.href= '/add-goal';
};