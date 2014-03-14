
var goalslist;
var startTime = 0; 

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
	addEvents($('.timeline-wrapper'));
	addMilestones($('.milestone-list'));
	addGoals($('#goal-list'));
	$('.datepicker').datepicker();

	alert(window.location);

	setUpAdders();
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

	goalslist = result[0].goals;
	console.log('goallist');
	console.log(goalslist);

	var timeline = $('.timeline-wrapper');
	var pathname = window.location.pathname;
	
	$('#btn-add').remove();
	if(result[0] == undefined || result[0].goals.length ==0){
		$('.goal-header').remove();	
		$('.status1').remove();
		console.log('nothing to show');
		return;
	}
	else{
		$('.help-wrapper').hide();
	}
	console.log(result);
	var goals = result[0]['goals'];

	console.log(goals);

	var colors = getColors(goals.length);
	console.log(colors);
	for(var i = 0; i < goals.length; ++ i){
		goals[i].color = colors[i];
		console.log(goals[i].color);
	}

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
			milestonelist[j].goalNum=  realgolnum;
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
			if(dayMilestones[j].actualDate > Date.now()){//future
				if(dayMilestones[j].completed){
					string+= '<div class = "event event-future">';
					string+= '<p class="event-complete-time">' + goals[dayMilestones[j].goalNum].name + '</p>';
				}
				else{
					string+= '<div class = "event event-incomplete event-future">';
					string+= '<p class="event-complete-time">' + goals[dayMilestones[j].goalNum].name + '</p>';
				}
			}
			else{//past
				if(dayMilestones[j].completed){
					string+= '<div class = "event event-past">';
					string+= '<p class="event-complete-time">' + goals[dayMilestones[j].goalNum].name + '</p>';
				}
				else{
					string+= '<div class = "event event-overdue event-past">';
					string+= '<p class="event-complete-time">' + goals[dayMilestones[j].goalNum].name + '</p>';	
				}
			}
			string+=
                 '<p class="milestone-actions"><span class="milestone-delete">Delete</span>' +
                 '&nbsp;&nbsp;&nbsp;&nbsp;<span class="milestone-edit-omg">'+
                 //Edit+
                 '</span></p><br/>' +
    			'<p class="event-description" id = "' +  dayMilestones[j]._id;
			if(dayMilestones[j].completed)
				string +='"><span class="glyphicon glyphicon-check"></span>&nbsp;&nbsp;';
			else
				string +='"><span class="glyphicon glyphicon-unchecked"></span>&nbsp;&nbsp;';
    		string += dayMilestones[j].name + '</p>' +
    			'</div>';
		}
		string = '<div class = "day">' + string  + '</div>';
   		timeline.append(string);
	}
	console.log('styling goaldivs');
	var goalDivs = $('p.event-complete-time');
	for(var i = 0; i < goalDivs.length; ++i){
		var goal;
		for(var j = 0; j < goals.length; ++j){
			console.log($(goalDivs[i]).text());
			if(goals[j].name == $(goalDivs[i]).text()){
				goal = goals[j];
				break;
			}
		}
		console.log(goal.color);
		$(goalDivs[i]).parent().css({"border-left": "4px solid " + goal.color});
	}


	
	function clickedCheck(e){
		var removing;
		if($(this).hasClass("glyphicon-check")){
			removing = true;
		}
		else
			removing = false;

		var string = $('.num-milestones').text();
		var strarray = string.split(' ');
		var first = parseInt(strarray[0]);
		if(removing)
			first--;
		else
			first++;

		var newstring = "";
		newstring += first;
		for(var i = 1; i < strarray.length; ++i){
			newstring += " " ;
			newstring += strarray[i];
		}

		$('.num-milestones').text(newstring);
		

		$(this).toggleClass("glyphicon-check");
		$(this).toggleClass("glyphicon-unchecked");
		var id = $(this).parent().attr('id');
		var goalname = $(this).parent().parent().find('p.event-complete-time').text();

		var goalnum= 0;
		for(; goalnum < result[0].goals.length; goalnum++){
			if(result[0].goals[goalnum].name == goalname)
				break;
		}

		var milestonestatus;
		var milestonename;
		var ms;
		for(var i = 0; i < result[0].goals[goalnum].milestones.length; ++i){
			if(result[0].goals[goalnum].milestones[i]._id == id){
				ms = result[0].goals[goalnum].milestones[i];
				milestonestatus = ms.completed;
				milestonename = ms.name;
				break;
			}
		}


		var parentDiv = $(this).parent().parent();
		if(removing){
			if(parentDiv.hasClass('event-past'))
				parentDiv.toggleClass('event-overdue');
			if(parentDiv.hasClass('event-future'))
				parentDiv.toggleClass('event-incomplete');
		}
		else{//checking off
			if(parentDiv.hasClass('event-overdue'))
				parentDiv.toggleClass('event-overdue');
			if(parentDiv.hasClass('event-incomplete'))
				parentDiv.toggleClass('event-incomplete');
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
	};

	$('.glyphicon-check').click(clickedCheck);
	$('.glyphicon-unchecked').click(clickedCheck);

	console.log(milestones);
	setUpDeletersAndEditors();
}

function dateComp(a,b){
	return new Date(a.actualDate)-new Date(b.actualDate);
}

function getColors(size){
	var colors = new Array();
	for(var i = 0; i < size; ++i){
		colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
	}
	return colors;
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
	console.log('signingup');
	$.post('/signup', {
		"name": $('#name').val(),
		"user": $('#username').val(),
		"email" : $('#email').val(),
		"pass": $('#password').val()
	}, function(data, status){
		if(status == 'success'){
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
			alert(status);
			console.log(data);
		}
		window.location.href = "/";
	});
	window.location.href = "/";
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
		ga("send", "event", "ms", "add");
		ga('send', 'timing', 'jQuery', 'Milestone1Add', new Date().getTime(), 'Google CDN');
		$.post('/addEvent', {
				"type": 'addmilestone1',		
				"val" : new Date().getTime()
			});
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

	$.post('/setTime', {"startTime": new Date().getTime()}, function(data,status){
		console.log(data);
		console.log(status);
	});
	ga("send", "event", "ms", "startadd");
	ga('send', 'timing', 'jQuery', 'Milestone1Start', new Date().getTime(), 'Google CDN');
	$.post('/addEvent', {
		"type": 'milestone1start',		
		"val" : new Date().getTime()
	});

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

function setUpDeletersAndEditors(){
	console.log("asdlfkjasldfjalsdkfjasd");
	$('.milestone-delete').click(deleteMilestone);
	console.log($('.milestone-delete'));
	$('.milestone-edit-omg').click(editMilestone);

	function deleteMilestone(e){
		var date  = $(this).parent().parent().parent().find('.date').text();
		var name = $(this).parent().parent().find('.event-description').text();
		var goal = $(this).parent().parent().find('.event-complete-time').text();

		console.log('deleting' + name + date);

		$.post('/deletemilestonepost', {
			'milestonename':$.trim(name),
			'milestonedate':new Date(date),
			'goalname':$.trim(goal)
		}, function(data,status){
			console.log(status);
			window.location.href = "/";
		});
	}

	function editMilestone(e){
		e.preventDefault();
		
		var date = $(this).parent().parent().parent().find('.date').text();
		var name = $(this).parent().parent().find('.event-description').text();
		var goal = $(this).parent().parent().find('.event-complete-time').text();

		console.log('starting to edit' + name  + "  " + data );


	}
}


function setUpAdders(){
	
	$('.add-event').click(goForward);

	function fillWithEvent1(e){
		var parent = $(e);	
		parent.toggleClass("status1");
		parent.toggleClass("status2");
		parent.html('<p class="add-event-description">Add New Milestone</p>');
		parent.unbind();
		parent.removeClass("status2");
		parent.removeClass("status3");
		parent.addClass("status1");
		parent.click(goForward);
	};

	function fillWithEvent2(e){
		var div = $(e);
		console.log('fwe2');
		if(getGoalName() != ""){
			fillWithEvent3(e);
			return;
		}

		
		var newdata = '<p class="add-event-header">' +
            '<span class="btn-left-mini"><span class="glyphicon glyphicon-remove"></span></span>'+
            'Pick a goal to add a milestone to:'+
            '<span class="btn-right-mini"><span class="glyphicon glyphicon-chevron-right"></span></span>'+
        '</p>'+
        '<div class="select">'+
        '<select id = "goalselect">';
        for(var i = 0 ; i < goalslist.length; ++i){
        	newdata += '<option>' + goalslist[i].name + '</option>';
        }
       	// getGoalsOptions();
        newdata+='</select>';
		div.html(newdata);
		div.removeClass("status1");
		div.removeClass("status3");
		div.addClass("status2");
		div.unbind();
		div.children('.add-event-header').children('.btn-left-mini').click(goBack);
		div.children('.add-event-header').children('.btn-right-mini').click(goForward);
		console.log('event2');
	};

	function fillWithEvent3(e){
		var div = $(e);
		
		var goalname = getGoalName();
		if(goalname == ""){
			goalname = div.children('.select').children('#goalselect').children('option:selected').text();
		}
		console.log(goalname);

		var newdata =  '<p class="add-event-header" id ="'+goalname+'">' + 
            '<span class="btn-left-mini"><span class="glyphicon glyphicon-arrow-left"></span></span>'+
            'Add Milestone for '+ goalname +
            '<span class="btn-right-mini"><span class="glyphicon glyphicon-ok"></span></span>'+
        	'</p>'+
        '<div class="form-group">'+
            '<input type="text" class="form-control" id="name" placeholder="Milestone description" name="name">'+
            '<input type="text" class="form-control datepicker" readonly="true" id="date" placeholder="Due date" name="password">'+
        '</div>';

        console.log(div.html());
        div.html(newdata);
        $('.datepicker').datepicker();
        div.removeClass('status1 status2');
        div.addClass('status3');
        div.unbind();
        div.children('.add-event-header').children('.btn-left-mini').click(goBack);
		div.children('.add-event-header').children('.btn-right-mini').click(goForward);
	};

	function submitThis(e){
		var div = $(e);		
		console.log('trying to add milestone');
		console.log({
			"name" :  $('#name').val(), 
			"date": $('#date').val(),
			"goal": $('.add-event-header').attr('id')
		});
		$.post('/addmilestonepost', {
			"name" :  $('#name').val(), 
			"date": $('#date').val(),
			"goal": $('.add-event-header').attr('id')
		}, function(data, status){
			console.log(data);
			console.log(status);
			var endTime = new Date().getTime();
			console.log(endTime);
			ga("send", "event", "ms", "add2");
			ga('send', 'timing', 'jQuery', 'addMilestone2', endTime-startTime, 'Google CDN');
			$.post('/addEvent', {
				"type": 'addmilestone2',		
				"val" : endTime-startTime
			});
			//alert(endTime-startTime);
			window.location.href = "/";
		});
	}

	function goForward(e){
		if($(this).hasClass('status1') &&  getGoalName() == ""){
			startTime= new Date().getTime();
			fillWithEvent2($(this));
			return false;
		}
		else if($(this).hasClass('status1') &&  getGoalName() != ""){
			fillWithEvent3($(this));
			return false;
		}


		console.log('forwarding');
		if($(this).parent().parent().hasClass('status2')){
			console.log('front3');
			fillWithEvent3($(this).parent().parent());
			return false;
		}
		else if($(this).parent().parent().hasClass('status3')){
			console.log('front,add,back1');
			submitThis($(this).parent().parent());
			//window.location.href = "/homescreen";
			//fillWithEvent1($(this).parent().parent());
			return false;
		}
	};

	function goBack(e){
		console.log('backing');
		if($(this).parent().parent().hasClass('status2') || getGoalName() != ""){
			console.log('back1');
			fillWithEvent1($(this).parent().parent());
			return false;
		}
		else if($(this).parent().parent().hasClass('status3')){
			console.log('back2');
			fillWithEvent2($(this).parent().parent());
			return false;
		}
	};
}

function getGoalName(){
	return $("#goal-name-hack").text();
}