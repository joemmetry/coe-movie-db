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
                var bdpath= fetched.results[x].backdrop_path != null  && fetched.results != "undefined" ? ("https://image.tmdb.org/t/p/w500" + fetched.results[x].backdrop_path) : "/static/img/no_image.jpg";
                var title = fetched.results[x].title != '' ? fetched.results[x].title : 'Untitled Movie';
                var fetchedresid = fetched.results[x].id;
                var fetchedvote  = fetched.results[x].vote_count;
                var fetchedpop = Math.round(fetched.results[x].popularity *100)/100;
                var  fetchedreldate = fetched.results[x].release_date;
                  var poster = {
                          "image" : imgpath,
                          "resid" : fetchedresid,
                          "title1" : title,
                         "resvote" : fetchedvote,
                         "respop" : fetchedpop,
                         "resreldate" : fetchedreldate,
                         "bdimg" : bdpath,
                          };
                    var rawpost = $('.backdrop').html();
                    var templatepost = Handlebars.compile(rawpost);
                    var htmlpost = templatepost(poster);
                    $('#'+selectGrid + '> div > ul').append(htmlpost);
                    
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
        for(var x = 0; x < data.results.length - 1; x ++){
            if(data.results[x].backdrop_path != null){
                var effect = ['left','top','right','bottom'],
                    imgpath = data.results[x].backdrop_path != null  && data.results != "undefined" ? ("https://image.tmdb.org/t/p/original/" + data.results[x].backdrop_path) : "/static/img/no_image.jpg",
                    title = data.results[x].title != '' ? data.results[x].title : 'Untitled Movie',
                    effgetranint = effect[getRandomInt(0,4%x)],
                    votave = data.results[x].vote_average,
                    pop = Math.round(data.results[x].popularity * 100)/100,
                    reldate = data.results[x].release_date,
                    votecount = data.results[x].vote_count,
                    id = data.results[x].id,
                    result = {
                                  "img" : imgpath,
                                  "title1" : title,         
                                  "getranint" : effgetranint,
                                  "vcount": votecount,
                                  "avevote" : votave,
                                  "respop" : pop,
                                  "resreldate" : reldate,
                                  "dataid" : id,
                          };
                                  var raw = $('.dispMoviePreview').html();
                                  var template = Handlebars.compile(raw);
                                  var html = template(result);
                                  $('#showNowPlaying').append(html); 
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
        var showResult = function(a){
          b = baseUrl + "movie/" + a;
          c = { api_key: api};
          $.get(b,c,showSelected);
          $.get(b,c,showSynopsis);
          $.get(b,c,showTagline);
        };
        var showSelected = function(a){
          b = {api_key: api};
          c = baseUrl + "movie/" + movieID;
          d = a.original_title + " <small>" +
              "<i class=\"fa fa-thumbs-o-up\"></i> " + a.vote_count + " votes " +
                                  "<i class=\"fa fa-bar-chart-o\"></i> " + Math.round(a.popularity * 100)/100 + "% " +
                                  "<i class=\"fa fa-calendar-o\"></i> " + a.release_date + "</small>" ;
          $('#grid0 > .container > .page-header > h3').html(d);
          $.get(c + "/videos", b, showTrailer);
          $.get(c + "/credits",b,showCasting);
          $.get(c + "/similar",b,showRelated);
        };
        var showTrailer = function(a){
          var a = (a.results.length > 0) ? "https://www.youtube.com/v/" + a.results[0].key : '',
              b = function(a){
                    return '<embed width="640px" height="360px" src="'+a+'" type="application/x-shockwave-flash">';
              },
              c = '<div style="width:640px;height:360px;background:#222"><div><center style="padding-top:154px;color:#fff;">No Trailer Available</center></div></div>';
          $('.mv').html(b(a));
          if(a == ''){
            $('.mv').html(c);
          }
        };
        var showRelated = function(a){
          var a = a.results,
              b,
              c = function(d){
                    d.title = (d.title.length<1)? d.original_title : d.title;
                        f = '<div class="mrL">' +
                              '<div>' +
                                '<a href="/view/' + d.id +'"><img src="' + (d.backdrop_path == null ? "/static/img/no_image.jpg" : 
                                  'http://image.tmdb.org/t/p/w300' + d.backdrop_path)+'"/></a>' +
                              '</div>' +
                              '<div>' +
                                '<div>' +
                                  '<a href="/view/' + d.id +'">'+d.title+'</a> ' +
                                  "<i class=\"fa fa-thumbs-o-up\"></i> " + d.vote_count + " votes " +
                                  "<i class=\"fa fa-bar-chart-o\"></i> " + Math.round(d.popularity * 100)/100 + "% " +
                                  "<i class=\"fa fa-calendar-o\"></i> " + d.release_date +
                                '</div>' +
                                '<div class="ms-' + d.id +'">' +
                                  e(d.id) +
                                '</div>' +
                              '</div>' +
                            '</div>';
                    return f;
              },
              e = function(a){
                $.get(baseUrl + "movie/" + a,{api_key:api},function(b){ $('.ms-'+a).append(b.overview);});
                return '';
              };
          for(var i=0;i<a.length;i++){
            b= c(a[i]);
            $(".mr").append(b);
          }
        };
        var showSynopsis = function(a){
          $('.ms').html(a.overview);
        };
        var showTagline = function(a){
          $('.ma').html(a.tagline);
        };
        var showCasting = function(a){
          var a = a.cast, b="";
          for(var i=0;i<a.length;i++){
            b+= '<div class="mcL">' +
                  '<div>' +
                    '<img src="' + (a[i].profile_path != "" ? 'http://image.tmdb.org/t/p/w45' + a[i].profile_path : '/static/img/no_image.jpg') + '/">' +
                  '</div>' +
                  '<div>' +
                    '<span><strong>' + a[i].name + '</strong> as ' + a[i].character + '</span>' + 
                  '</div>' +
                '</div>';
          }
          $('.mc').html(b);
        };
        