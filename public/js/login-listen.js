// Call this function when the page loads (the "ready" event)
$(document).ready(function() {

	$('.btn-register').click(loginFunction);
	$('#btn-cancel').click(cancelFunction);
	$('#btn-add').click(addFunction);
	$addEvents($('.timeline-wrapper'));
})


function addEvents(e){
	if(e.length ==0)
		return;
	get('/data', gotEvents);
}

function gotEvents(result){
	var goals = result['user.goals'];
	var milestones = new Array();
	for(int i = 0; i < goals.length; ++i){
		var milestonelist = goals[i]['milestones'];
		for(int j = 0; j <goals.length; ++j){
			milestonelist[j].actualDate = new Date(milestonelist[j]['date']);
			milestones.push(milestonelist[j]);
		}
	}
	milestones.sort();
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