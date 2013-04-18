(function() {
	var numberOfResults = 0;
	var token = "QPSBAWlP3ZxIA74YI9gw07QjSeTQ0ezwBUSab8pMUtM-_4xiy5fAiw.."
  	var testURL = "http://api.brightcove.com/services/library?command=search_videos&token="+token+"&media_delivery=http";
	  
  	//initially populate the page with 100 results
	  $.ajax({
	  	url: testURL,
	    dataType: "jsonp"
	  })
	  .done(function( data ) {
	  	console.log("Search Reuslts: ", data);
	    $.each( data.items, function( i, item ) {
	      var description = item.longDescription || item.shortDescription || "";
	      var date = new Date(parseInt(item.lastModifiedDate));
	      
		    var dataRow = '<div class="zRow">';
		    	dataRow += '<div class="zPhoto">';
				dataRow +=	'<img class="video-thumb" data-videourl="'+item.FLVURL+'" src="'+item.videoStillURL+'">';
				dataRow +=	'</div><div class="zDetails">';
				dataRow +=	'<h3><a data-videourl="'+item.FLVURL+'" class="video-title">'+item.name+'</a></h3>';
				dataRow +=	'<p class="tags"><span class="views">'+item.playsTotal+' Views</span>  ';
				dataRow +=	'&bull; <span class="views">Last edited: '+date+'</span></p><p class="tags"> ';
					for (var i=0; i<item.tags.length; i++){
						dataRow += ' <span data-tag="'+item.tags[i]+'" class="label">'+item.tags[i]+'</span> '
					}
				dataRow += '</p><p>'+description+'</p></div></div>';
				numberOfResults++;

				$('.zList').prepend(dataRow);
				$('#numberOfResults').html(numberOfResults);
	    });
  });

 /* Events that fire the video player */

  $('.zList').on('click', '.video-title', function(){
  	showPlayer();
  	var videoURL = $(this).data('videourl');
  	loadVideo(videoURL);
  	
  });

   $('.zList').on('click', '.video-thumb', function(){
   	showPlayer();
  	var videoURL = $(this).data('videourl');
  	loadVideo(videoURL);
  	
  });

   $('.closeZPlayer').click(function(){
  	$('.zVideo > video').remove();
  	$('.zPlayer > .inner').fadeOut();
  	$('.zPlayer').slideUp();
  });

   function showPlayer(){
   	$('.zPlayer').slideDown();
  	$('.zPlayer > .inner').fadeIn();
   }

   function loadVideo(x){
   	var videoHTML = '<video height="315" width="557" controls>';
  		videoHTML += '<source src="'+x+'" type="video/mp4">';
  		videoHTML += '</video>';
  	$('.zVideo').html(videoHTML);
   }
 
  /* Search by clicking a tag */

  $('.zList').on('click', 'span.label', function(){
   	// add the tag to the api call
  	var tagName = $(this).data('tag');
  	processSearch(tagName);  	
  });

 /* Or search through the search bar */

  $('#submit-search').click(function(){
  	var query = $('#appendedInput').val();
  	processSearch(query);
  });

  $(document).keydown(function (e) {
	  var keyCode = e.keyCode || e.which;
	  if (keyCode == 13){ // 13 is the enter key
	  	var query = $('#appendedInput').val();
	  	processSearch(query);
	  }
	});

  function processSearch(query){
  	//remove all current results
  	$('.zRow').each(function(){$(this).remove();});
   	numberOfResults = 0;

   	//add the search query to the api call
  	var query = query;
  	var queryURL = "http://api.brightcove.com/services/library?command=search_videos&any="+query+"&token="+token+"&media_delivery=http";
	  $.ajax({
	  	url: queryURL,
	    dataType: "jsonp"
	  })
	  .done(function( data ) {
	  	console.log("Search Reuslts: ", data);
	    $.each( data.items, function( i, item ) {
	      var description = item.longDescription || item.shortDescription || "";
	      var date = new Date(parseInt(item.lastModifiedDate));
	      
	    var dataRow = '<div class="zRow"><div class="zPhoto">';
			dataRow +=	'<img class="video-thumb" data-videourl="'+item.FLVURL+'" src="'+item.videoStillURL+'">';
			dataRow +=	'</div><div class="zDetails">';
			dataRow +=	'<h3><a data-videoURL="'+item.FLVURL+'" class="video-title">'+item.name+'</a></h3>';
			dataRow +=	'<p class="tags"><span class="views">'+item.playsTotal+' Views</span>';
			dataRow += 	' &bull; <span class="views">Last edited: '+date+'</span></p><p class="tags"> ';
				for (var i=0; i<item.tags.length; i++){
					dataRow += ' <span data-tag="'+item.tags[i]+'" class="label">'+item.tags[i]+'</span> '
				}
			dataRow += '</p><p>'+description+'</p></div></div>';
			numberOfResults++;
			$('.zList').prepend(dataRow);
			$('#numberOfResults').html(numberOfResults);
			$('')
	    });
	});
  }
})();