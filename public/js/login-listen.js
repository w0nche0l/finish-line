// Call this function when the page loads (the "ready" event)
$(document).ready(function() {

	$('.btn-register').click(loginFunction);
	$('.btn-cancel a').click(cancelFunction);
	$('.btn-add a').click(addFunction);
})

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