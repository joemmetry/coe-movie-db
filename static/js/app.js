$(function() {
    var config, res = lastQuery = "", firstSearch = true, currentPage = 1, pageLength = 1, baseUrl = "http://api.themoviedb.org/3/", api = "c1709b6f3d9d558eb9a39ec2584bb9c7";
    var initialize = function(callback){
        addEventHandlers();
        loadNowShowing(1);
        selectedPage({elemID: '#grid1', showType:'NS'});
        selectedPage({elemID: '#grid2', showType:'UC'});
        selectedPage({elemID: '#grid3', showType:'POP'});
        selectedPage({elemID: '#grid4', showType:'TR'});
        selectedPage({elemID: '#grid5', showType:'SR'});
        dispMovieByType({showType:'NS',page: 1});
        dispMovieByType({showType:'UC',page: 1});
        dispMovieByType({showType:'POP',page: 1});
        dispMovieByType({showType:'TR',page: 1});
    };
    var addEventHandlers = function(){
        $('#form-search').submit(function(){
            var queryN =  $('#form-search > div > input[type=text]').val();
            startQuery(queryN);return false;
        });
        $('#form-search-main').submit(function(){
            var queryN = $('#form-search-main > div > input[type=text]').val();
            startQuery(queryN);return false;
        });
        var startQuery = function(opt){
            scrollToElement('#grid5');
            wordsN = opt.split(" ");
            opt != "" ? ((wordsN.length >  0) ? dispMovieByType({showType: 'SR', page: 1, query: opt}) /*searchMovie(opt, 1)*/ : alert('Must be minimum of two words')) : alert('Null. Try again');
            firstSearch = true;
        };
    };
    var dispMovieByType = function(data){
        var baseUrl = 'http://api.themoviedb.org/3/', useUrl, selectGrid,
            reqParams = {
                            api_key: 'c1709b6f3d9d558eb9a39ec2584bb9c7', 
                            page: data.page
                        };
        switch(data.showType){
            case 'NS':
                useUrl = baseUrl + 'movie/now_playing';
                selectGrid = "grid1";
                break;
            case 'UC':
                useUrl = baseUrl + 'movie/upcoming';
                selectGrid = "grid2";
                break;
            case 'POP':
                useUrl = baseUrl + 'movie/popular';
                selectGrid = "grid3";
                break;
            case 'TR':
                useUrl = baseUrl + 'movie/top_rated';
                selectGrid = "grid4";
                break;
            case 'SR':
                $('#grid5 ul').empty();
                useUrl = baseUrl + 'search/movie';
                selectGrid = "grid5";
                reqParams.query = lastQuery = data.query;
                break;                        
        }
        $.get(useUrl,reqParams, function(fetched){
            for(var x = 0; x < fetched.results.length; x++){
                var imgpath = fetched.results[x].poster_path != null  && fetched.results != "undefined" ? ("https://image.tmdb.org/t/p/w500" + fetched.results[x].poster_path) : "/static/img/no_image.jpg";
                var title = fetched.results[x].title != '' ? fetched.results[x].title : 'Untitled Movie';
                var result = "<li class=\"col-md-4\" style=\"background:rgba(96,96,96,0.2);max-width:290px;height:340px;margin:10px;padding:10px 5px;\"><center><img style=\"max-width:60%;max-height:400px\" class=\"clearfix\" src='" + imgpath + "'></center>" + 
                    "<center><div style=\"\"><a href=\"#\">" + title + "</a></div>" +
                    "<div><i class=\"fa fa-thumbs-o-up\"></i> " + fetched.results[x].vote_count + " votes " +
                    "<i class=\"fa fa-bar-chart-o\"></i> " + Math.round(fetched.results[x].popularity * 100)/100 + "% " +
                    "<i class=\"fa fa-calendar-o\"></i> " + fetched.results[x].release_date + "</div>" +
                 "      </center></li>";
                $('#'+selectGrid + ' > div > ul').append(result);
            }
            var startPage = (fetched.page<4)? 1:fetched.page-3;
            var endPage = (fetched.total_pages-fetched.page>7)? startPage+10: fetched.total_pages+1;
            /*$('#'+selectGrid + ' > div > center > ul.pagination').append('<li class="disabled" disabled="disabled"><a  href="#">«</a></li>');*/
            for(x = startPage; x< endPage; x++){
                var pageElem = "<li><a href='#'>" + x + "</a></li>";
                $('#'+selectGrid + ' > div > center > ul.pagination').append(pageElem);
                if(x==data.page){$('#'+selectGrid + ' > div > center > ul.pagination > li:contains('+ data.page + ')').addClass('active');}
            }
            /*$('#'+selectGrid + ' > div > center > ul.pagination').append('<li><a  href="#">»</a></li>');*/
        });
    };
    var selectedPage = function(params){
        $(document).on('click',params.elemID + ' ul.pagination li a',function(e){
            if($(this).closest(params.elemID)){
                e.preventDefault();
                $(params.elemID + ' ul').empty();
                var queriedPage = $(this).html();
                if(params.showType == 'SR'){
                    dispMovieByType({showType: params.showType, page: queriedPage, query: lastQuery});
                }
                else{
                    dispMovieByType({showType: params.showType, page: queriedPage});
                }
                $('html,body').animate({
                  scrollTop: $(params.elemID).offset().top - 40 
                }, 1000);
            }
        });
    };
    var loadNowShowing = function(p){
            api     = "movie/now_playing",
            url     = baseUrl + api,
            reqParams = {
                api_key: "c1709b6f3d9d558eb9a39ec2584bb9c7", /*ab api key*/
                page: p
            };
        $.get(url, reqParams, function(response){
            dispMoviePreview(response);
        });
    };
    var dispMoviePreview = function(data){
        console.log(data);

        for(var x = 0; x < data.results.length - 1; x ++){
            if(data.results[x].backdrop_path != null){
                var effect = ['left','top','right','bottom'],
                    imgpath = data.results[x].backdrop_path != null  && data.results != "undefined" ? ("https://image.tmdb.org/t/p/original/" + data.results[x].backdrop_path) : "/static/img/no_image.jpg",
                    title = data.results[x].title != '' ? data.results[x].title : 'Untitled Movie',
                    result = "<div class=\"rsContent\">" +
                                "<img class=\"rsImg\" src=\"" + imgpath + "\" alt=\"\">" +
                                    "<div class=\"infoBlock infoBlockLeftBlack rsABlock\" data-fade-effect=\"\" data-move-offset=\"20\" data-move-effect=\"" + effect[getRandomInt(0,4%x)] + "\" data-speed=\"200\">" +
                                        "<h4><a href=\"\">" + title + "</a></h4>" +
                                        "<p>" +
                                            "<ul class=\"list-unstyled\">" +
                                                "<li><i class=\"fa fa-star\"></i> " + data.results[x].vote_average + "/10</li>" +
                                                "<li><i class=\"fa fa-thumbs-o-up\"></i> " + data.results[x].vote_count + " votes</li>" +
                                                "<li><i class=\"fa fa-bar-chart-o\"></i> " + Math.round(data.results[x].popularity * 100)/100 + "%</li>" +
                                                "<li><i class=\"fa fa-calendar-o\"></i> " + data.results[x].release_date + "</li>" +
                                            "</ul>" +
                                        "</p>" +
                                    "</div>" +
                              "</div>";
                $('#showNowPlaying').append(result);
            }
        }
        
        $(document).ready(function($) {
          $('#showNowPlaying').royalSlider({    
            loop: true,
            keyboardNavEnabled: true,
            controlsInside: false,
            imageScaleMode: 'fill',
            arrowsNavAutoHide: false,
            autoScaleSlider: true, 
            autoScaleSliderWidth: 660,     
            autoScaleSliderHeight: 250,
            controlNavigation: 'bullets',
            thumbsFitInViewport: false,
            navigateByClick: false,
            startSlideId: 0,
            autoPlay: {
              enabled: true,
              delay: 3000,
              pauseOnHover: false,
              stopAtAction: false
            },
            transitionType:'move',
            globalCaption: false,
            deeplinking: {
              enabled: true,
              change: false
            },
            imgWidth: 1400,
            imgHeight: 580
          });
        });
    };
    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    var scrollToElement = function(selector, callback){
        var animation = {scrollTop: $(selector).offset().top - 40};
        $('html,body').animate(animation, 'slow', 'swing', function() {
            if (typeof callback == 'function') {
                callback();
            }
            callback = null;
        });
    };
    initialize();

      $('a[href*=#]:not([href=#])').click(function() {
        if ($(this).parent().parent().attr('role') == 'sticky' && location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 1000);
            return false;
          }
        }
      });
});
/*

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
    };
*/