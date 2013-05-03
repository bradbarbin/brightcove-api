$(function(){
	var authenticated = false;
	
	$('#charles').click(function(){
		var jonathan = $('#brad').val();
		jonathan = encrypted(jonathan);
		$('#brad').val(jonathan);
		$('#brian').fadeIn();
		$('pre').removeClass('hidden');
	});

	$(document).keydown(function (e) {
	  var keyCode = e.keyCode || e.which;
	  if (keyCode == 20){ // 13 is the enter key
	  	if(!authenticated){
		  	$('#charles').fadeIn();
		  	authenticated = true;
	  	}
	  	else{
	  		alert("You can stop clicking Caps Lock now...");
	  	}
	  }
	});

	function encrypted(x){
		var encrypted = "";
		var str = ""+x+"";

		for (var i=0; i<str.length; i++){
			var boom = str.charCodeAt(i);
			boom -= 13;
			encrypted += boom*(10*(i+1));
		}
		return encrypted;
	}
});