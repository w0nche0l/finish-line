// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();

	$('.btn-login input').click(loginFunction);
})
function loginFunction(e){
	e.preventDefault();
	//replace this with actual login information
	window.location.href='/homescreen';
}



