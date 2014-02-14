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
	milestones.reverse();


	for(var i = 0; i < milestones.length ; ){
		var date = milestonelist[i].actualDate;
		var dayMilestones = new Array();
		while(milestones[i].actualDate == date){
			dayMilestones.push(milestones[i]);
			i++;
		}

	}

	console.log(milestones);
}

function dateComp(a,b){
	return new Date(b.actualDate) - new Date(a.actualDate);
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