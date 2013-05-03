$(function() {
	
	var totalVideos = 305,
		startPage = dividePages(totalVideos).n - 1,
		currentPage = startPage,
		pageSize = dividePages(totalVideos).m,
		token = "QPSBAWlP3ZxIA74YI9gw07QjSeTQ0ezwBUSab8pMUtM-_4xiy5fAiw..", //set this to your Read API token with URL Access
		includes = "&custom_fields=notes",
  		firstURL = "http://api.brightcove.com/services/library?command=search_videos&page_number="+currentPage+"&page_size="+pageSize+"&none=tag:exclude"+includes+"&get_item_count=true&token="+token+"&sort_by=PLAYS_TOTAL&sort_order=ASC&media_delivery=http",
  		lastURL = "http://api.brightcove.com/services/library?command=search_videos&none=tag:exclude"+includes+"&page_number=0&get_item_count=true&token="+token+"&media_delivery=http",
		resultsforSearch = "",
		authenticated = showFilters = searchTags = false,
		numberOfResults = 0, request,
  	 	months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
  	 	years = ["11", "12", "13"];
  	 	backhack();
  	 	start();

  	 

 	/* Event Listeners with anonymous callbacks */

 	$('#guess-password').click( function(){
 		$('#booYah').focus();
		checkPassword();
	});

	$('.idk').click(function(){
		window.location.href="http://sironaexperience.tv/";
	});

	$(window).scroll(function(){
		var threshold = 230, y = $(window).scrollTop();
		(y>threshold) ?	$('#scroll-to-top').fadeIn() : $('#scroll-to-top').fadeOut();
	});

	$('.dropdown-toggle').dropdown();
	
	$('#scroll-to-top').click(function(){
		$('html, body').animate({scrollTop: '0px'}, 300);
	});

	$('.closeZPlayer').click(function(){
		$('.zVideo > object').remove();
		$('.zPlayer > .inner').fadeOut();
		$('.zPlayer').slideUp();
		$('.zList').css('opacity', 1.0);
		 $('#posh, #ginger').css('height', '80px');
		// if( $('#list-links').is(':visible') ) {
  //   		$('#list-links').fadeOut();
	 // 		$('.zInfo form').animate({
		// 	    opacity: 1.0,
		// 	    height: 'toggle'
		// 	  }, 300, function() {
		// 	});
		// }
		// else {
		//     // it's not visible so do something else
		// }
	});

 	$('#video-link').bind('click', function(){
 		$('.zInfo form').animate({
		    opacity: 0,
		    height: 'toggle'
		  }, 300, function() {
		    $('#list-links').fadeIn();
		});
 	});

 	$('#video-info-link').bind('click', function(){
 		$('#list-links').fadeOut();
 		$('.zInfo form').animate({
		    opacity: 1.0,
		    height: 'toggle'
		  }, 300, function() {
		    
		});
 	});


	$('.zList').on('click', 'span.label', function(){
  		var tagName = $(this).data('tag');
  		processTag(tagName);
  	});


	$('.search-text').click(function(){
  		var other = $('.search-tags').parent(),
  		self = $(this).parent(),
  		icon = $(this).parent().parent().parent().children('a').children('i');

  		if(icon.hasClass('icon-tags')) icon.removeClass('icon-tags').addClass('icon-text-width');
	  	if(other.hasClass('active')) other.removeClass('active');
	  	self.addClass('active');
	  	searchTags = false;
	});

	$('.search-tags').click(function(){
	 	var other = $('.search-text').parent(),
	  		self = $(this).parent(),
	  		icon = $(this).parent().parent().parent().children('a').children('i');

  		if(icon.hasClass('icon-text-width')) icon.removeClass('icon-text-width').addClass('icon-tags');
	  	if(other.hasClass('active')) other.removeClass('active');
	  	self.addClass('active');
	  	searchTags = true;
	});

  	$('#submit-search').click(function(){
  		var query = $('#appendedInput').val();
  		(searchTags) ? processTag(query) : processSearch(query);
  	});

  	$("#clear-search, #the-logo").on("click", function(){
        currentPage = startPage;
        $('#appendedInput').val("");
        $('#numberOfResults').html("");
        $('#filter-btn').addClass('hidden');
        start();
    });

    $("#load-more").on("click", function(){
        currentPage ++;
        $('#appendedInput').val("");
        $('#numberOfResults').html("");
        $('#filter-btn').addClass('hidden');
        start();
    });

  	$(document).keydown(function (e) {
	  var keyCode = e.keyCode || e.which;
	  if (keyCode == 13){ // 13 is the enter key
	  	if(authenticated){
		  	var query = $('#appendedInput').val();
		  	(searchTags) ? processTag(query) : processSearch(query);
	  	}
	  	else{
	  		checkPassword();
	  	}
	  }
	});


	$('.sort-alpha').click(function(){
		addSortParameter("DISPLAY_NAME%3ADESC");
		$(this).parent().addClass('active');
	});

	$('.sort-total').click(function(){
		addSortParameter("PLAYS_TOTAL%3AASC");
		$(this).parent().addClass('active');
	});
	
	// $('.sort-pop').click(function(){ addSortParameter("PLAYS_TRAILING_WEEK%3AASC"); $(this).parent().addClass('active'); });  $('.sort-new').click(function(){	addSortParameter("CREATION_DATE%3ADESC"); $(this).parent().addClass('active'); }); $('.sort-old').click(function(){	addSortParameter("CREATION_DATE%3AASC");  	$(this).parent().addClass('active'); });

	$('.zList').on('click', '.video-title, .video-thumb', function(){
	  	showPlayer();
	  	var videoURL = $(this).data('id'),
		  	superParent = $(this).parent().parent(),
		  	videoRenditions = [],
		  	totalRenditions = parseInt(superParent.data('total-renditions')),
		  	description = superParent.data('description'),
		  	videoTags = [],
		  	videoTitle = $(this).data('videotitle'),
		  	notes = superParent.data('notes');

	  		superParent.children('.zDetails').children('.tags').children('span').each(function(){
	  			videoTags.push($(this).data('tag'));
	  		});

	  		for(var i=0; i<totalRenditions; i++){
	  			var rendition = {};
	  			rendition.url = superParent.data('rendition-'+i);
	  			rendition.height = parseInt(superParent.data('rendition-'+i+'-height'));
	  			rendition.width = parseInt(superParent.data('rendition-'+i+'-width'));
	  			rendition.encoding = superParent.data('rendition-'+i+'-encoding');
	  			rendition.size = superParent.data('rendition-'+i+'-size');
	  			videoRenditions[i] = rendition;
	  		} 

	  	loadVideo(videoURL);
	  
	  	loadInfo(videoTitle, videoRenditions, videoTags, description, notes);
	  	$('.zList').css('opacity', 0.3)
	});

	// bind to the submit event of our form
	$("#baby").submit(function(event){	
	    var url = "http://api.brightcove.com/services/post";
	    var data = "json={'method':'update_video','params':{'video':{'id':'1303224831001','shortDescription':'Jellyfish'},'token':'jLVkR7HtGGZzrRrrR9--MZluhvfwkZA2dNjsIENVdK7zDVje8sU7-A..'}};"

	    // fire off the request to brightcove
	    var request = $.ajax({
	    	type: "POST",
	    	id: "JSONRPC",
	    	dataType: "json",
	    	data: data,
	    	url: "http://api.brightcove.com/services/post"
	    });

	    request.done(function (response, textStatus, jqXHR){
	    	console.log("done", response);
	        // $.getJSON(response, function(){
	        // 	console.log("success", response);
	        // });
	    });

	    request.fail(function (response, textStatus, jqXHR){
	        	console.log("fail", response);
	        	console.log(textStatus);
	        	console.log(jqXHR);
	        });


	    // prevent default posting of form
	    event.preventDefault();
	});

	/* Functions that do things with DOM elements */

	function start(){
		numberOfResults = 0;
  	 	clearResults();
  	 	for(var i=0; i<years.length; i++){
  	 		for(var j=0; j<months.length; j++){
  	 			var time = months[j] + "%20" + years[i];
  	 			var url = "http://api.brightcove.com/services/library?command=search_videos"+includes+"&none=tag:exclude&any=tag:"+time+"&token="+token+"&media_delivery=http";
  	 			display(url, "initial", "");
  	 		}
  	 	}
  	 	
	}

   	function showPlayer(){
   		$('.zPlayer').slideDown();
  		$('.zPlayer > .inner').fadeIn();
   	}

   	function clearResults(){
		$('.zRow').each(function(){$(this).remove();});
	  	$('.zLoader').fadeIn();
	  	$('.dropdown-menu#filters li').each(function(){$(this).removeClass('active');});
	}

	function removeModal(){
		$('.modal').fadeOut();
		$('#scary').fadeOut();
		$('.zList, .zSearchBar').fadeIn();
		if(authenticated){
			// keep fields locked for now
			 //$(' #posh, #ginger').removeAttr('disabled'); 
			 //$('#baby').removeClass('disabled');
		}
		$('html, body').animate({scrollTop: '0px'}, 300);
	}

	function checkPassword(){
		var guess = $('#booYah').val();
		var check = "";
		check = encrypted(guess);
		evaluate(check);
		if(authenticated){removeModal()};
	}

	/* Functions that dynamically do things with DOM elements */

	function loadVideo(id){
   		// using html 5 video player and passing the mp4 file url
   		// 	var videoHTML = '<video height="365" width="635" poster="images/poster.png" controls>';
  		// videoHTML += '<source src="'+src+'" type="video/mp4">';
  		// videoHTML += '</video>';

  		var videoHTML = '<object id="myExperience" class="BrightcoveExperience">';
  			videoHTML += '<param name="bgcolor" value="#000000" />';
  			videoHTML += '<param name="width" value="635" />';
  			videoHTML += '<param name="height" value="365" />';
  			videoHTML += '<param name="playerID" value="2132398951001" />';
  			videoHTML += '<param name="playerKey" value="AQ~~,AAAA2jbW4vk~,-Sfm236PrvxONgxZvO_Oriw3uU519TOh" />';
  			videoHTML += '<param name="isVid" value="true" />';
  			videoHTML += '<param name="isUI" value="true" />';
  			videoHTML += '<param name="dynamicStreaming" value="true" />';
  			videoHTML += '<param name="templateLoadHandler" value="myTemplateLoaded" /> ';
  			videoHTML += '<param name="@videoPlayer" value="'+id+'" />';
  			videoHTML += '</object>';
  		$('.zVideo').html(videoHTML);
  		brightcove.createExperiences();
   	}

	function processTag(tagName){  	
	  	clearResults();
	  	var queryURL = "http://api.brightcove.com/services/library?command=search_videos"+includes+"&none=tag:exclude&any=tag:"+tagName+"&token="+token+"&media_delivery=http";
		lastURL = queryURL;
		display(queryURL, "tag", tagName);
 	}

	function processSearch(query){
	  	clearResults();
	  	var queryURL = "http://api.brightcove.com/services/library?command=search_videos"+includes+"&none=tag:exclude&any="+query+"&token="+token+"&media_delivery=http";
		lastURL = queryURL;
		display(queryURL, "query", query);
	}

	function addSortParameter(filter){
		$('.dropdown-menu#filters li').each(function(){$(this).removeClass('active');});
		var pieces = lastURL.split("&token=");
		var newURL = pieces[0] + "&sort_by=" + filter + "&token=" + token +"&media_delivery=http";
		console.log(newURL);
		processFilter(newURL);
	}

	function processFilter(filteredURL){
	  	$('.zRow').each(function(){$(this).remove();});
	  	display(filteredURL, "filter", "");	   	 
	}

	function display(url, identifier, query){
	  	if(identifier != "initial") numberOfResults = 0;
	  	console.log(url);
			  $.ajax({
			  	url: url,
			    dataType: "jsonp"
			  })
			  .done(function( data ) {
			  	console.log("Search Reuslts: ", data);
			    $.each( data.items, function( i, item ) {
			      
			      var description = item.longDescription || item.shortDescription || "",
			      	  time = millisecondsToString(item.length),
			      	  date = new Date(parseInt(item.lastModifiedDate)),
					  notes = (item.customFields != null && item.customFields.notes != undefined) ? item.customFields.notes : "";
			     	  
			      
			      //bind the video data to each search result through the DOM
				    var dataRow = '<div class="zRow" data-notes="'+notes+'" data-description="'+description+'"';

				    		if(item.renditions.length != 0){
				    			dataRow += ' data-total-renditions="'+item.renditions.length+'"';
				    			for(var i=0; i<item.renditions.length; i++){
				    			var theEncoding = bytesToSize(item.renditions[i].encodingRate),
				    				theSize = bytesToSize(item.renditions[i].size);

				    			dataRow += ' data-rendition-'+i+'="'+item.renditions[i].url+'"';
				    			dataRow += ' data-rendition-'+i+'-width="'+item.renditions[i].frameWidth+'"';
				    			dataRow += ' data-rendition-'+i+'-height="'+item.renditions[i].frameHeight+'"';
				    			dataRow += ' data-rendition-'+i+'-encoding="'+theEncoding+'"';
				    			dataRow += ' data-rendition-'+i+'-size="'+theSize+'"';
				    			}
				    		}
				    		else{
				    			dataRow += ' data-total-renditions="1"';
				    			dataRow += ' data-rendition-0='+item.FLVURL+ ' data-rendition-0-width="Download" data-rendition-0-height="" data-rendition-0-enconding="" data-rendition-0-size=""';
				    		}	
				    	dataRow += '>';
				    	// add the photo
				    	dataRow += '<div class="zPhoto">';
						dataRow +=	'<img class="video-thumb" data-id="'+item.id+'" data-videotitle="'+item.name+'" src="'+item.videoStillURL+'">';
						// add the video details
						dataRow +=	'</div><div class="zDetails">';
						dataRow +=	'<a data-id="'+item.id+'" data-videotitle="'+item.name+'" class="video-title">'+item.name+'</a>';
						dataRow +=	'<p class="info"><span class="views">'+time+'</span> &bull; <span class="views">'+item.playsTotal+' Views</span>  ';
						dataRow +=	'</p><p class="tags"> ';
							for (var i=0; i<item.tags.length; i++){
								dataRow += ' <span data-tag="'+item.tags[i]+'" class="label">'+item.tags[i]+'</span> '
							}
						dataRow += '</p><p>'+notes+'</p></div></div>';
						numberOfResults++;
						//write the row to the page
						$('.zList').prepend(dataRow);
						
			    });
				// update the search results on a case by case basis
				switch (identifier){
					case "initial":
						$('#numberOfResults').html(numberOfResults);
					break;
					case "tag":
						if($('.dropdown').hasClass('hidden')) $('.dropdown').removeClass('hidden');
						resultsforSearch = numberOfResults + ' results for <strong><span class="label">' + query + '</span></strong>';
						$('#numberOfResults').html(resultsforSearch);
					break;
					case "query":
						if($('.dropdown').hasClass('hidden')) $('.dropdown').removeClass('hidden');
						resultsforSearch = numberOfResults + ' results for <strong>' + query + '</strong>';
						$('#numberOfResults').html(resultsforSearch);
					break;
					case "filter":
						true;
					break;
				}					
				$('.zLoader').hide();
	  		}); 
	}

	function loadInfo(title, rendition, tags, description, notes){

	   	$('.zInfo #video-title').text(title);
	   	var theList = '<ul class="downloadables">';
	   	
	   	if(rendition.length != 1){
	   		for(var i=0; i<rendition.length; i++){
	   		theList += '<li><a class="label" href="'+rendition[i].url+'" target="_blank" style="color:white;"> <i class="icon-download"></i> '+rendition[i].width+' x '+rendition[i].height+'</a> '+rendition[i].size+' at '+rendition[i].encoding+ '/sec</li>'
	   		}	
	    }
	    else{
	    	theList += '<li><a class="label" href="'+rendition[0].url+'" target="_blank" style="color:white;"> <i class="icon-download"></i> Download</a></li>'
	    }
	   	
	   	theList += "</ul>";
	   	$('#dynamic-links').html(theList);
	   	$('#ginger').val(description);
	   	
	   	// var theTags = "";
	   	
	   	// for(var j=0; j<tags.length; j++){
	   	// 	(j<tags.length-1) ? theTags += tags[j] + ", " : theTags += tags[j];
	   	// }

	   	$('#posh').val(notes);
	   	//$('#sporty').val(theTags);
   	}	

	function evaluate(x){
		if(x === "860182025204040475058807210824079207000616085209490133001380013600171701512019190216004620924080509360"){
			authenticated = true;
		}
		else{
			window.location.href="http://sironaexperience.tv/";
		}
	}

	/* Functions that take an input and return an output */
	function dividePages(count){
		var r = count, n,
		max = {
			m: 100,
			n: 0,
			x: 0
		};

		for(var m=100; m>1; m--){
			n = Math.ceil(r/m);
			var x = r - (m*(n-1));
			if(x>max.x){
				max.x = x;
				max.m = m;
				max.n = n;
			}
		}

		return max;
	}

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
	
	function bytesToSize(bytes) {
	    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	    if (bytes == 0) return 'n/a';
	    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	}

	function millisecondsToString(milliseconds) {
	    var oneHour = 3600000,
	    	oneMinute = 60000,
	    	oneSecond = 1000,
	    	seconds = 0,
	    	minutes = 0,
	    	hours = 0,
	    	result;

	    if (milliseconds >= oneHour) { hours = Math.floor(milliseconds / oneHour); }
		milliseconds = hours > 0 ? (milliseconds - hours * oneHour) : milliseconds;
	    if (milliseconds >= oneMinute) { minutes = Math.floor(milliseconds / oneMinute); }
	    milliseconds = minutes > 0 ? (milliseconds - minutes * oneMinute) : milliseconds;
	    if (milliseconds >= oneSecond) { seconds = Math.floor(milliseconds / oneSecond); }
	    milliseconds = seconds > 0 ? (milliseconds - seconds * oneSecond) : milliseconds;
	    if (hours > 0) { result = (hours > 9 ? hours : "0" + hours) + ":"; } 
	    else { result = ""; }
		if (minutes > 0) { result += (minutes > 9 ? minutes : "0" + minutes) + ":";  } 
		else { result += "00:"; }
	    if (seconds > 0) { result += (seconds > 9 ? seconds : "0" + seconds) ; } 
	    else { result += "00";  }

	    return result;
	}

	function backhack(){
		if(!$('.modal').is(':visible') && authenticated == false){
			$('body').remove();
			document.write('403 Unauthorized');
		}
	}


});