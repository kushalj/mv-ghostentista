/*! jQuery slabtext plugin v2.3 MIT/GPL2 @freqdec */
(function( $ ){

	$.fn.slabText = function(options) {

		var settings = {
			// The ratio used when calculating the characters per line
			// (parent width / (font-size * fontRatio)).
			"fontRatio"             : 0.78,
			// Always recalculate the characters per line, not just when the
			// font-size changes? Defaults to true (CPU intensive)
			"forceNewCharCount"     : true,
			// Do we wrap ampersands in <span class="amp">
			"wrapAmpersand"         : true,
			// Under what pixel width do we remove the slabtext styling?
			"headerBreakpoint"      : null,
			"viewportBreakpoint"    : null,
			// Don't attach a resize event
			"noResizeEvent"         : false,
			// By many milliseconds do we throttle the resize event
			"resizeThrottleTime"    : 300,
			// The maximum pixel font size the script can set
			"maxFontSize"           : 999,
			// Do we try to tweak the letter-spacing or word-spacing?
			"postTweak"             : true,
			// Decimal precision to use when setting CSS values
			"precision"             : 3,
			// The min num of chars a line has to contain
			"minCharsPerLine"       : 0
		};

		// Add the slabtexted classname to the body to initiate the styling of
		// the injected spans
		$("body").addClass("slabtexted");

		return this.each(function(){

			if(options) {
				$.extend(settings, options);
			};

			var $this               = $(this),
				keepSpans           = $("span.slabtext", $this).length,
				words               = keepSpans ? [] : String($.trim($this.text())).replace(/\s{2,}/g, " ").split(" "),
				origFontSize        = null,
				idealCharPerLine    = null,
				fontRatio           = settings.fontRatio,
				forceNewCharCount   = settings.forceNewCharCount,
				headerBreakpoint    = settings.headerBreakpoint,
				viewportBreakpoint  = settings.viewportBreakpoint,
				postTweak           = settings.postTweak,
				precision           = settings.precision,
				resizeThrottleTime  = settings.resizeThrottleTime,
				minCharsPerLine     = settings.minCharsPerLine,
				resizeThrottle      = null,
				viewportWidth       = $(window).width(),
				headLink            = $this.find("a:first").attr("href") || $this.attr("href"),
				linkTitle           = headLink ? $this.find("a:first").attr("title") : "";

			if(!keepSpans && minCharsPerLine && words.join(" ").length < minCharsPerLine) {
				return;
			};

			// Calculates the pixel equivalent of 1em within the current header
			var grabPixelFontSize = function() {
				var dummy = jQuery('<div style="display:none;font-size:1em;margin:0;padding:0;height:auto;line-height:1;border:0;">&nbsp;</div>').appendTo($this),
					emH   = dummy.height();
				dummy.remove();
				return emH;
			};

			// Most of this function is a (very) stripped down AS3 to JS port of
			// the slabtype algorithm by Eric Loyer with the original comments
			// left intact
			// http://erikloyer.com/index.php/blog/the_slabtype_algorithm_part_1_background/
			var resizeSlabs = function resizeSlabs() {

				// Cache the parent containers width
				var parentWidth = $this.width(),
					fs;

				//Sanity check to prevent infinite loop
				if(parentWidth === 0) {
					return;
				};

				// Remove the slabtextdone and slabtextinactive classnames to enable the inline-block shrink-wrap effect
				$this.removeClass("slabtextdone slabtextinactive");

				if(viewportBreakpoint && viewportBreakpoint > viewportWidth
					||
					headerBreakpoint && headerBreakpoint > parentWidth) {
					// Add the slabtextinactive classname to set the spans as inline
					// and to reset the font-size to 1em (inherit won't work in IE6/7)
					$this.addClass("slabtextinactive");
					return;
				};

				fs = grabPixelFontSize();
				// If the parent containers font-size has changed or the "forceNewCharCount" option is true (the default),
				// then recalculate the "characters per line" count and re-render the inner spans
				// Setting "forceNewCharCount" to false will save CPU cycles...
				if(!keepSpans && (forceNewCharCount || fs != origFontSize)) {

					origFontSize = fs;

					var newCharPerLine      = Math.min(60, Math.floor(parentWidth / (origFontSize * fontRatio))),
						wordIndex           = 0,
						lineText            = [],
						counter             = 0,
						preText             = "",
						postText            = "",
						finalText           = "",
						slice,
						preDiff,
						postDiff;

					if(newCharPerLine != idealCharPerLine) {
						idealCharPerLine = newCharPerLine;

						while (wordIndex < words.length) {

							postText = "";

							// build two strings (preText and postText) word by word, with one
							// string always one word behind the other, until
							// the length of one string is less than the ideal number of characters
							// per line, while the length of the other is greater than that ideal
							while (postText.length < idealCharPerLine) {
								preText   = postText;
								postText += words[wordIndex] + " ";
								if(++wordIndex >= words.length) {
									break;
								};
							};

							// This bit hacks in a minimum characters per line test
							// on the last line
							if(minCharsPerLine) {
								slice = words.slice(wordIndex).join(" ");
								if(slice.length < minCharsPerLine) {
									postText += slice;
									preText = postText;
									wordIndex = words.length + 2;
								};
							};

							// calculate the character difference between the two strings and the
							// ideal number of characters per line
							preDiff  = idealCharPerLine - preText.length;
							postDiff = postText.length - idealCharPerLine;

							// if the smaller string is closer to the length of the ideal than
							// the longer string, and doesn’t contain less than minCharsPerLine
							// characters, then use that one for the line
							if((preDiff < postDiff) && (preText.length >= (minCharsPerLine || 2))) {
								finalText = preText;
								wordIndex--;
								// otherwise, use the longer string for the line
							} else {
								finalText = postText;
							};

							// HTML-escape the text
							finalText = $('<div/>').text(finalText).html()

							// Wrap ampersands in spans with class `amp` for specific styling
							if(settings.wrapAmpersand) {
								finalText = finalText.replace(/&amp;/g, '<span class="amp">&amp;</span>');
							};

							finalText = $.trim(finalText);

							lineText.push('<span class="slabtext">' + finalText + "</span>");
						};

						$this.html(lineText.join(" "));
						// If we have a headLink, add it back just inside our target, around all the slabText spans
						if(headLink) {
							$this.wrapInner('<a href="' + headLink + '" ' + (linkTitle ? 'title="' + linkTitle + '" ' : '') + '/>');
						};
					};
				} else {
					// We only need the font-size for the resize-to-fit functionality
					// if not injecting the spans
					origFontSize = fs;
				};

				$("span.slabtext", $this).each(function() {
					var $span       = $(this),
					// the .text method appears as fast as using custom -data attributes in this case
						innerText   = $span.text(),
						wordSpacing = innerText.split(" ").length > 1,
						diff,
						ratio,
						fontSize;

					if(postTweak) {
						$span.css({
							"word-spacing":0,
							"letter-spacing":0
						});
					};

					ratio    = parentWidth / $span.width();
					fontSize = parseFloat(this.style.fontSize) || origFontSize;

					$span.css("font-size", Math.min((fontSize * ratio).toFixed(precision), settings.maxFontSize) + "px");

					// Do we still have space to try to fill or crop
					diff = !!postTweak ? parentWidth - $span.width() : false;

					// A "dumb" tweak in the blind hope that the browser will
					// resize the text to better fit the available space.
					// Better "dumb" and fast...
					if(diff) {
						$span.css((wordSpacing ? 'word' : 'letter') + '-spacing', (diff / (wordSpacing ? innerText.split(" ").length - 1 : innerText.length)).toFixed(precision) + "px");
					};
				});

				// Add the class slabtextdone to set a display:block on the child spans
				// and avoid styling & layout issues associated with inline-block
				$this.addClass("slabtextdone");
			};

			// Immediate resize
			resizeSlabs();

			if(!settings.noResizeEvent) {
				$(window).resize(function() {
					// Only run the resize code if the viewport width has changed.
					// we ignore the viewport height as it will be constantly changing.
					if($(window).width() == viewportWidth) {
						return;
					};

					viewportWidth = $(window).width();

					clearTimeout(resizeThrottle);
					resizeThrottle = setTimeout(resizeSlabs, resizeThrottleTime);
				});
			};
		});
	};
})(jQuery);/*global jQuery */
/*jshint multistr:true browser:true */
/*!
* FitVids 1.0.3
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    };

    if(!document.getElementById('fit-vids-style')) {

      var div = document.createElement('div'),
          ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0],
          cssStyles = '&shy;<style>.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>';

      div.className = 'fit-vids-style';
      div.id = 'fit-vids-style';
      div.style.display = 'none';
      div.innerHTML = cssStyles;

      ref.parentNode.insertBefore(div,ref);

    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );
/*------------------------------------------------------------------
 Copyright (c) 2013-2014 Viktor Bezdek
 - Released under The MIT License.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 ----------------------------------------------------------------*/

$(function () {
	var config = window.ghostentista.config;
	var siteURL = location.host;
	var internalLinksQuery = "a[href^='" + siteURL + "'], a[href^='/'], a[href^='./'], a[href^='../'], a[href^='#']";
	var $window = $(window);
	var $mainContent = $('#main-content');
	var $internalLinks = $(internalLinksQuery);
	var $relatedPostsContainer = $('#related-posts-container');
	var $logo = $('#site-head-content');
	var $header = $('#site-head');
	var $footerLinks = $('.get-connected p');

	$mainContent.fitVids();

	var socialProfiles = config.socialProfiles;
	if (socialProfiles.facebook != '') $footerLinks.append($('<a class="icon-facebook-circled" href="' + socialProfiles.facebook + '" target="_blank"></a>'));
	if (socialProfiles.email != '') $footerLinks.append($('<a class="icon-mail-circled" href="' + socialProfiles.email + '" target="_blank"></a>'));
	if (socialProfiles.twitter != '') $footerLinks.append($('<a class="icon-twitter-circled" href="' + socialProfiles.twitter + '" target="_blank"></a>'));
	if (socialProfiles.linkedIn != '') $footerLinks.append($('<a class="icon-linkedin-circled" href="' + socialProfiles.linkedIn + '" target="_blank"></a>'));
	if (socialProfiles.github != '') $footerLinks.append($('<a class="icon-github-circled" href="' + socialProfiles.github + '" target="_blank"></a>'));
	if (socialProfiles.pinterest != '') $footerLinks.append($('<a class="icon-pinterest-circled" href="' + socialProfiles.pinterest + '" target="_blank"></a>'));
	if (socialProfiles.instagram != '') $footerLinks.append($('<a class="icon-instagram-circled" href="' + socialProfiles.instagram + '" target="_blank"></a>'));
	if (config.logoBackground != '') $logo.css({background: config.logoBackground});

	// ios < 7 fixed position bug
	var ios = iOSversion();
	if (ios && ios[0] <= 6) $('body').addClass('no-fixed-elements')

	// logo position
	$window.scroll(function () {
		var logoHeight = $logo.height() + 40;
		var headerHeight = $header.height() - $window.scrollTop();

		// if we need to position logo
		if (headerHeight > logoHeight) {
			var marginTop = (headerHeight / 2 - logoHeight / 2) + 'px';
			$logo.parent().css({paddingTop: marginTop});
		}

		// if header is completely gone
		var $secondaryTitle = $('#secondaryTitle');
		$secondaryTitle.css({background: config.logoBackground});
		if (headerHeight <= 0) {
			if (!$secondaryTitle.hasClass('displayed')) {
				$secondaryTitle.addClass('displayed');
				$secondaryTitle.animate({top: '0px'}, 500);
			}
		}
		// if not
		else {
			if ($secondaryTitle.hasClass('displayed')) {
				$secondaryTitle.removeClass('displayed');
				$secondaryTitle.animate({top: '-200px'}, 500);
			}
		}

	});

	// create second header
	var siteName = $('#site-head h1').text().replace(/\s+/g, ' ');
	var slogan = $('#site-head h2').text().replace(/\s+/g, ' ');
	var header = $('<nav id="secondaryTitle"><div class="siteInfo"><h1>' + siteName + '</h1><h2>' + slogan + '</h2></div><a href="#top" id="scroll-to-top"></a></nav>');
	$('body').prepend(header);

	// scroll to top button
	$('#scroll-to-top').click(function (e) {
		e.preventDefault();
		$('html, body').animate({scrollTop: 0}, 200);
	});

	// resize does equalization of post titles
	$window.resize(function () {
		var articles = $('.post');//.find('h2.page-title');
		for (var x = 0; x < articles.length; x += 2) {
			var ea = $(articles[x]).find('.post-title');
			var oa = $(articles[x + 1]).find('.post-title');

			ea.css({height: 'auto', paddingTop: 0});
			oa.css({height: 'auto', paddingTop: 0});

			var eh = ea.innerHeight(), oh = oa.innerHeight();
			var th = Math.max(eh, oh) + 'px';
			var pt = Math.abs(eh - oh) / 2 + 'px';
			ea.css({height: th, paddingTop: eh < oh ? pt : 0});
			oa.css({height: th, paddingTop: eh > oh ? pt : 0});
		}
		$window.trigger('scroll');
	});

	// if on home, saves related posts to local storage and removes the temporary element
	// if on post, displays related posts if available
	if ($relatedPostsContainer.length > 0) {
		var rp = $relatedPostsContainer.clone();
		$relatedPostsContainer.remove();
		localStorage.setItem('relatedPosts', JSON.stringify(rp.html()));
		setTimeout(scrollToContent, 200);
	} else {
		displayRelatedPosts();
	}

	// updates layout after init
	$window.trigger('scroll');
	$window.trigger('resize');
	setTimeout(function () {
		$('h2.post-title, h1.post-title').slabText({minCharsPerLine: 15});
		$('article.loading').each(function () {
			var $this = $(this);
			setTimeout(function () {
				$this.removeClass('loading');
				$window.trigger('resize');
			}, Math.random() * 200);
		});
	}, 500);

	// if on home, updates related posts in local storage
	// if on posts, displays related posts if available
	function displayRelatedPosts() {
		var related = JSON.parse(localStorage.getItem('relatedPosts'));
		var $nav = $('nav.related-posts ul');
		if (related.length > 0 && $nav.length > 0) {
			$nav.html(related);
		} else {
			$('nav.related-posts').remove();
		}
	}

	// scrolls down to start of content if marker is available
	function scrollToContent() {
		var contentAnchor = $("span[name='post-content']");
		if (contentAnchor.length > 0) {
			$('html,body').animate({scrollTop: contentAnchor.offset().top - 10}, 'slow');
		} else {
			$('html,body').animate({scrollTop: 0}, 'slow');
		}
	}

	// removes all css and style tags from loaded content to prevent reinitialization
	function dataFilter(data, type) {
		type = type || 'text';
		if (type == 'html' || type == 'text') {
			data = data.replace(/<link.*?\/>/gi, '');
			data = data.replace(/<script.*?>([\w\W]*?)<\/script>/gi, '');
			data = $(data).filter('#main-content').children().parent();
			return data.html();
		}

		return data;
	}

	// ios version detection helper (for annoying fixed pos bug in iOS < 7)
	// source: http://bit.ly/1c7F26O
	function iOSversion() {
		if (/iP(hone|od|ad)/.test(navigator.platform)) {
			// supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
			var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
			return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		}
	}

	// Google Analytics
	if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1' && config.googleAnalytics) {

		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments)
			}, i[r].l = 1 * new Date();
			a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m)
		})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

		ga('create', config.googleAnalytics);
		ga('send', 'pageview');
	}

});

