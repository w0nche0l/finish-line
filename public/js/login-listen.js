
// Call this function when the page loads (the "ready" event)
$(document).ready(function() {

	$('#submit-btn').click(loginFunction);
	$('#btn-back').click(cancelFunction);
	$('.btn-register').click(goToSignUp);
	$('#makeact-btn').click(signupFunction);
	$('#btn-cancel').click(cancelFunction);
	$('#btn-add').click(addMilestoneFunction);
	$('#btn-menu').click(menuFunction);
	$('#btn-back-homescreen').click(cancelFunction);
	$('.logout').click(logOutFunction);
	$('#add-goal').click(addGoalFunction);
	$('#submit-milestone-btn').click(addMilestonePost);
	//$('#submit-btn').click(cancelFunction);
	console.log('blah');
	addMilestones($('.milestone-list'));
	addEvents($('.timeline-wrapper'));
	addGoals($('#goal-list'));
	//getMilestones();
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
	var goals = result[0]['goals'];
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
	console.log(result);
	if($('#mainmenu').length==0){
		var goalList = $('#goal-list');
		console.log(result);
		var goals = result[0]['goals'];
		console.log(goals);
		for(var i = 0; i< goals.length; ++i){
			var string = '<li id = "' + goals[i]._id+ '"><a href="/add-milestone/' + goals[i].name+ '">' + goals[i].name +  '</a> </li>';
			goalList.append(string);
		}
	}
	else{
		var goalList = $('#goal-list');
		console.log(result);
		var goals = result[0]['goals'];
		console.log(goals);
		for(var i = 0; i< goals.length; ++i){
			var string = '<li id = "' + goals[i]._id+ '"><a href="/homescreen/' + goals[i].name+ '">' + goals[i].name +  '</a></li>';
			goalList.append(string);
			// $('#'+ goals[i]._id+' a[class = delete]').bind("click", function(e){
			// 	e.preventDefault();
			// 	console.log("clicked");
			// 	console.log( $(this).parent().parent().attr('id'));
			// 	$.post('/delgoal', {id: $(this).parent().attr('id')});
			// 	//window.location.href = '/menu';
			// });
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

	if(result[0] == undefined || result[0].goals.length ==0){
		$('.goal-header').remove();	
		$('#btn-add').remove();
		console.log('nothing to show');
		return;
	}
	else{
		$('.help-wrapper').hide();
	}
	console.log(result);
	var goals = result[0]['goals'];

	console.log(goals);
	var milestones = new Array();
	
	var goalname = $('#goal-name-hack').html();
	console.log(goalname);
	var realgolnum;
	if(goalname != ''){
		var realgoal ;
		for(var i = 0 ; i < goals.length; ++i){
			if(goals[i].name == goalname){
				realgoal = goals[i];
				realgolnum = i;

				break;
			}
		}
		makeGoalHeader(result, realgolnum);
		var milestonelist = realgoal.milestones;
		for(var j = 0; j <milestonelist.length; ++j){
			milestonelist[j].actualDate = new Date(milestonelist[j]['date']);
			milestonelist[j].goalNum = realgolnum;
			milestonelist[j].milestoneNum = j;
			milestones.push(milestonelist[j]);
		}
	}
	else{
		makeGoalHeader(result, -1);
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

	console.log(milestones);
	for(var i = 0; i < milestones.length ; ){
		var date = milestones[i].actualDate;
		if(isNaN(date.getTime())){
			i++;
			continue;
		}



		var dayMilestones = new Array();
		console.log(date);

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
    			'<p class="event-description" id = "' +  dayMilestones[j]._id+
    			'"><span class="glyphicon glyphicon-ok"></span>&nbsp;&nbsp;'+ dayMilestones[j].name + '</p>' +
    			'</div>';
		}
		string = '<div class = "day">' + string  + '</div>';
   		timeline.append(string);
	}

	$('.glyphicon-ok').click(function(e){
		$(this).toggleClass("black");
		var id = $(this).parent().attr('id');
		var goalname = $(this).parent().parent().find('p.event-complete-time').text();

		var goalnum= 0;
		for(; goalnum < result[0].goals.length; goalnum++){
			if(result[0].goals[goalnum].name == goalname)
				break;
		}

		var milestonestatus;
		var milestonename;
		for(var i = 0; i < result[0].goals[goalnum].milestones.length; ++i){
			if(result[0].goals[goalnum].milestones[i]._id == id){
				milestonestatus = result[0].goals[goalnum].milestones[i].completed;
				milestonename =result[0].goals[goalnum].milestones[i].name;
			}
		}

		console.log("switching from " + milestonestatus + " to " + !milestonestatus);

		var callback = function(data, status){
			if(status =='success'){
				console.log(data);
				$.get('/data', function(res){
					console.log(res);
					countGoals(res, realgolnum);
				});
			}
		};

		$.post('/milestoneupdate', {'milestonestatus' : !milestonestatus, 'milestonename': milestonename, 'milestoneid':id, 'goalname': goalname}
			, callback);
	});

	console.log(milestones);
}

function dateComp(a,b){
	return new Date(a.actualDate)-new Date(b.actualDate);
}

function countGoals(results, goalnum){
	var smallnum =0;
	var bignum =0; 
	var goalname;
	var object = results[0];
	console.log('number is' + goalnum);
	if(goalnum != undefined){
		var goal = object['goals'][goalnum];
		goalname = goal.name;
		for(var i = 0 ; i < goal.milestones.length; ++i)
			if(goal.milestones[i].completed)
				smallnum++;
		bignum = goal.milestones.length;
	}
	else{
		goalname = "All Goals";
		for(var i = 0; i < object['goals'].length; ++i){
			var goal = object['goals'][i];
			for(var j = 0 ; j< goal.milestones.length; ++j)
				if(goal.milestones[j].completed)
					smallnum++;
			bignum += goal.milestones.length
		}
	}
	
	var percent = smallnum/bignum*100  + "%";
	$("#meter-span").width(percent)
}


function makeGoalHeader(results, goalnum){
	var smallnum =0;
	var bignum =0; 
	var goalname, goaldate;
	if(goalnum != -1){
		var goal = results[0]['goals'][goalnum];
		goalname = goal.name;
		goaldate = new Date(goal.completionDate);
		goaldate = ((goaldate.getMonth() + 1) + '/' + goaldate.getDate() + '/' +  goaldate.getFullYear());

		var smallnum = 0;
		for(var i = 0 ; i < goal.milestones.length; ++i)
			if(goal.milestones[i].completed)
				smallnum++;
		bignum = goal.milestones.length;
	}
	else{
		goalname = "All Goals";
		for(var i = 0; i < results[0]['goals'].length; ++i){
			var goal = results[0]['goals'][i];
			goaldate = goal.completionDate;
			for(var j = 0 ; j< goal.milestones.length; ++j)
				if(goal.milestones[j].completed)
					smallnum++;
			bignum += goal.milestones.length
		}
	}



	var string = '<div class="container goal-wrapper"><h3>'+goalname+'</h3><p class="goal-info">';
        if(goalnum!=-1)
            string += '<span class="complete-by">Finish by ' +  goaldate + '</span><br />';

        string += '<span class="num-milestones">'+  smallnum + ' of '+ bignum + ' milestones completed</span>'+
           '<div class="meter">'+
                '<span id = "meter-span"style="width: ' + smallnum/bignum*100 + '%"></span>'+
             '</div>' +
         '</p></div>';

        $(".goal-header").append(string);
}


function loginFunction(e){
	e.preventDefault();
	console.log('loggingin');
	$.post('/', {
		"user": $('#name').val(),
		"pass": $('#password').val(),
		"remember-me": 'true'
	}, function(data, status){
		console.log(data);
		console.log(status);
		window.location.href = "/";
	});
}



function signupFunction(e){
	e.preventDefault();
	//replace this with actual login information
	console.log('signingup');
	$.post('/signup', {
		"name": $('#name').val(),
		"user": $('#username').val(),
		"email" : $('#email').val(),
		"pass": $('#password').val()
	}, function(data, status){
		if(data == 'ok'){
			$.post('/', {
				"user": $('#name').val(),
				"pass": $('#password').val(),
				"remember-me": 'true'
			}, function(a, b){
				console.log(a);
				console.log(b);
				window.location.href = "/";
			});
		}
		else{
			window.location.href = "/";
			console.log(data);
		}
		
	});
	// $.get('/');
};



function logOutFunction(e){
	e.preventDefault();
	
	$.post('/logout', {},  
		function(data, status){
		console.log(data);
		console.log(status);
		window.location.href = "/";
	});
};


function addGoalFunction(e){
	e.preventDefault();
	
	console.log('clicked');
	console.log( $('#name').val() );
	$.post('/addgoal', {
		"name" : $('#name').val() , 
		"date": $('#date').val()
	},  
	function(data, status){
		console.log(data);
		console.log(status);
		window.location.href = "/";
	});		
	//window.location.href = "/";
};

function addMilestonePost(e){
	e.preventDefault;
	console.log('trying to add milestone');
	console.log($('#goal-name-hack').html());
	$.post('/addmilestonepost', {
		"name" : $('#goalname').val() , 
		"date": $('#complete').val(),
		"goal": $('#goal-name-hack').html()
	}, function(data, status){
		console.log(data);
		console.log(status);
		window.location.href = "/";
	});
	
}


function goToSignUp(e){
	e.preventDefault();
	window.location.href= '/signup';
}

function cancelFunction(e){
	e.preventDefault();
	window.location.href= '/homescreen';
};

function addFunction(e){
	e.preventDefault();
	window.location.href= '/add-goal';
};

function addMilestoneFunction(e){
	e.preventDefault();
	if($('#goal-name-hack').html()){
		window.location.href= '/add-milestone/' + $('#goal-name-hack').html();
	}
	else
		window.location.href= '/choose-goal';
}


function menuFunction(e){
	e.preventDefault();
	window.location.href= '/menu';
};

function getMilestones(){
	console.log('stuff');
	$.post('/getms', {},  
		function(data, status){
	});

	$.post('/addgoal', {},  
		function(data, status){
	});
}
