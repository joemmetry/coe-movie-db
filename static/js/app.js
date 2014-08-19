var res = "", firstSearch = true, currentPage = 1, pageLength = 1;
$(function() {
    // your code here
    
    var initialize = function(callback){
    	addEventHandlers();
    	displayMovieSearchContent();
    };
    var addEventHandlers = function(){
    	$('#form-search').submit(function(){
    		var queryN = $('#form-search > div > input[type=text]').val(),
    			wordsN = queryN.split(" ");

    		queryN != "" ? ((wordsN.length >  0) ? searchMovie(queryN, 1) : alert('Must be minimum of two words')) : alert('Null. Try again');
    		firstSearch = true;
    		return false;
    	});
    };
    var searchMovie = function(query, p){
    	var baseUrl = "http://api.themoviedb.org/3/",
    		api		= "search/movie",
    		url 	= baseUrl + api,
    		reqParams = {
    			api_key: "c1709b6f3d9d558eb9a39ec2584bb9c7", /*ab api key*/
    			query: query,
    			page: p
    		};
    	$.get(url, reqParams, function(response){
    		if(firstSearch == true){
    			displayMovieSearchPages(response.total_pages);
    			firstSearch = false;
    		}
    		displayMovies(response, p);
    	});
    };
    var displayMovies = function(data){
    	$('#dSR').show();
    	$('#dispResults').empty();
    	console.log(data);

    	for(var x = 0; x < data.results.length - 1; x ++){
    		var imgpath = data.results[x].poster_path != null  && data.results != "undefined" ? ("https://image.tmdb.org/t/p/w396" + data.results[x].poster_path) : "/static/img/no_image.jpg";
    		var title = data.results[x].title != '' ? data.results[x].title : 'Untitled Movie';
    		var result = "<li><img src='" + imgpath + "'>" + title + 
    		 " 		</li>";
    		$('#dispResults').append(result);
    	}
    	
    };
    var displayMovieSearchPages = function(data){
    	$('#dSRP').empty();
    	$('#dSRP').append('<li class="disabled" disabled="disabled"><a  href="#">«</a></li>');
    	for (var x = 1; x <= data; x++) {
    		var pageElem = "<li><a href='#'>" + x + "</a></li>";
    		$('#dSRP').append(pageElem);
    		if(x==1){$('#dSRP li:nth-child(2)').addClass('active');}
    	};
    	$('#dSRP').append('<li><a href="#">»</a></li>');
    	pageLength = data;
    };
    var displayMovieSearchContent = function(){
    	$(document).on('click','#dSRP li',function(e){
    		e.preventDefault();

    		var elem = $(this).children(),
    			innerVal = elem.html(),
    			queryN = $('#form-search > div > input[type=text]').val(),
    			index = $(this).index();
    		
    		switch(index){
    			case 0:
    				if(currentPage > 1){
    					searchMovie(queryN,currentPage - 1);
    					currentPage--;
    					$( "body" ).find( "#dSRP li" ).removeClass('active').eq(currentPage).addClass('active');
    				}
    				if(currentPage == 1){
    					$('#dSRP li:first-child').addClass('disabled').attr('disabled','disabled');
    				}
    				if(currentPage != pageLength){
    					$('#dSRP li:last-child').removeClass('disabled').removeAttr('disabled');	
    				}
    				break;
    			case pageLength + 1:
    				if(currentPage < pageLength){
    					searchMovie(queryN,currentPage + 1);
    					currentPage++;
    					$( "body" ).find( "#dSRP li" ).removeClass('active').eq(currentPage).addClass('active');
    				}
    				if(currentPage == pageLength){
    					$('#dSRP li:last-child').addClass('disabled').attr('disabled','disabled');
    				}
    				if(currentPage != 1){
    					$('#dSRP li:first-child').removeClass('disabled').removeAttr('disabled');	
    				}
    				break;
    			default:
    				searchMovie(queryN,innerVal);
    				currentPage = innerVal;
    				if(currentPage != 1 || pageLength){
    					$('#dSRP li:first-child, #dSRP li:last-child').removeClass('disabled').removeAttr('disabled');			
    				}
    				if(currentPage == 1){
    					$('#dSRP li:first-child').addClass('disabled').attr('disabled', 'disabled');	
    				}
    				if(currentPage == pageLength){
    					$('#dSRP li:last-child').addClass('disabled').attr('disabled', 'disabled');
    				}
    				$('#dSRP li').removeClass('active');
    				$(this).addClass('active');
    				break;
    		}
    	});
    }
    var loadNowShowing = function(){};

    initialize();
});
