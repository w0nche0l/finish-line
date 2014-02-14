// Call this function when the page loads (the "ready" event)
$(document).ready(function() {

	$('.btn-register').click(loginFunction);
	$('#btn-cancel').click(cancelFunction);
	$('#btn-add').click(addFunction);
	console.log('blah');
	addEvents($('.timeline-wrapper'));

})


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
	
	for(var i = 0; i < goals.length; ++i){
		var milestonelist = goals[i]['milestones'];
		for(var j = 0; j <milestonelist.length; ++j){
			milestonelist[j].actualDate = new Date(milestonelist[j]['date']);
			milestonelist[j].goalNum = i;
			milestonelist[j].milestoneNum = j;
			milestones.push(milestonelist[j]);
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
			}
			else{
				string+= '<div class = "event">';
				string+= '<p class="event-complete-time">' + 'Completed at ' + dayMilestones[j].time + '</p>';
			}
			string+=
                '<p class="milestone-progress">' +
                	(dayMilestones[j].milestoneNum+1) + '/'+goals[dayMilestones[j].goalNum]['milestones'].length+
                '</p><br />' +
    			'<p class="event-description">'+ dayMilestones[j].name + '</p>' +
    			'</div>';
		}
		string = '<div class = "day">' + string  + '</div>';
		if(i == milestones.length)
			string += '<div class="event event-complete event-add">'+
                	'<p class="event-description"><a href="/add-milestone" class="add-milestone">Add Milestone</a></p>'+
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