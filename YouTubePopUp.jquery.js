/*
    Name: YouTubePopUp
    Description: jQuery plugin to display YouTube or Vimeo video in PopUp, responsive and retina, easy to use. Supports bitly URLs now, with an api key.
    Version: 1.0.2
    Plugin URL: http://wp-time.com/youtube-popup-jquery-plugin/
    Written By: Qassim Hassan
    Twitter: @QQQHZ
    Websites: wp-time.com | qass.im | wp-plugins.in
    Dual licensed under the MIT and GPL licenses:
        http://www.opensource.org/licenses/mit-license.php
        http://www.gnu.org/licenses/gpl.html
    Copyright (c) 2016 - Qassim Hassan
*/
(function($) {
    
        $.fn.YouTubePopUp = function(options) {
    
            var YouTubePopUpOptions = $.extend({
                autoplay: 1,
            }, options);
    
    
    
            $(this).on('click', function(e) {
    
                var youtubeLink = $(this).attr("href");
    
                function markupCreator(youtubeLink) {
    
                    if (youtubeLink.match(/(youtube.com)/)) {
                        var split_c = "v=";
                        var split_n = 1;
                    }
    
                    if (youtubeLink.match(/(youtu.be)/) || youtubeLink.match(/(vimeo.com\/)+[0-9]/)) {
                        var split_c = "/";
                        var split_n = 3;
                    }
    
                    if (youtubeLink.match(/(vimeo.com\/)+[a-zA-Z]/)) {
                        var split_c = "/";
                        var split_n = 5;
                    }
    
                    var getYouTubeVideoID = youtubeLink.split(split_c)[split_n];
    
                    var cleanVideoID = getYouTubeVideoID.replace(/(&)+(.*)/, "");
    
                    if (youtubeLink.match(/(youtu.be)/) || youtubeLink.match(/(youtube.com)/)) {
                        var videoEmbedLink = "https://www.youtube.com/embed/" + cleanVideoID + "?autoplay=" + YouTubePopUpOptions.autoplay + "";
                    }
    
                    if (youtubeLink.match(/(vimeo.com\/)+[0-9]/) || youtubeLink.match(/(vimeo.com\/)+[a-zA-Z]/)) {
                        var videoEmbedLink = "https://player.vimeo.com/video/" + cleanVideoID + "?autoplay=" + YouTubePopUpOptions.autoplay + "";
                    }
    
                    $("body").append('<div class="YouTubePopUp-Wrap YouTubePopUp-animation"><div class="YouTubePopUp-Content"><span class="YouTubePopUp-Close"></span><iframe src="' + videoEmbedLink + '" allowfullscreen></iframe></div></div>');
    
                    if ($('.YouTubePopUp-Wrap').hasClass('YouTubePopUp-animation')) {
                        setTimeout(function() {
                            $('.YouTubePopUp-Wrap').removeClass("YouTubePopUp-animation");
                        }, 600);
                    }
    
                    $(".YouTubePopUp-Wrap, .YouTubePopUp-Close").click(function() {
                        $(".YouTubePopUp-Wrap").addClass("YouTubePopUp-Hide").delay(515).queue(function() {
                            $(this).remove();
                        });
                    });
    
                };
    
                // if the link is bitly.com's link, and an api key is set we get the targetUrl and generate the popup
                // based on that link
    
                if ( (youtubeLink.match(/(bitly.com)/) || youtubeLink.match(/(bit.ly)/)) && YouTubePopUpOptions.bitlyAccessToken) {
    
                    var bitLyApi = 'https://api-ssl.bitly.com';

                    // constructed URL string    
                    var reqUrl = bitLyApi + '/v3/link/info?link=' + youtubeLink + '&access_token=' + YouTubePopUpOptions.bitlyAccessToken;
    
                    $.ajax({
                            context: this,
                            url: reqUrl,
                            dataType: 'jsonp',
                        })
    
                        .done(function(response) {

                            // getting the cononical_url from the response
                            destUrl = response.data.canonical_url;

                            // passing the canonical_url
                            markupCreator(destUrl);
    
                        })
                        .fail(function(err) {
                            console.log(err);
                        });
                        
                } else {
                    markupCreator(youtubeLink);
                }
    
                e.preventDefault();
    
            });
    
            $(document).keyup(function(e) {
    
                if (e.keyCode == 27) {
                    $('.YouTubePopUp-Wrap, .YouTubePopUp-Close').click();
                }
    
            });
    
        };
    
    }(jQuery));