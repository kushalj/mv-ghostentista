/*------------------------------------------------------------------
 Copyright (c) 2013-2014 Viktor Bezdek - Released under The MIT License.

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

/*
 <a class="icon-gplus-circled" href="#" target="_blank"></a>
 <a class="icon-twitter-circled" href="#" target="_blank"></a>
 <a class="icon-mail-circled" href="#" target="_blank"></a>
 <a class="icon-github-circled" href="#" target="_blank"></a>
 <a class="icon-linkedin-circled" href="#" target="_blank"></a>
 <a class="icon-pinterest-circled" href="#" target="_blank"></a>
 <a class="icon-instagram-circled" href="#" target="_blank"></a>
 */

$(function () {
	var siteURL = location.host;
	var internalLinksQuery = "a[href^='" + siteURL + "'], a[href^='/'], a[href^='./'], a[href^='../'], a[href^='#']";
	var $window = $(window);
	var $mainContent = $('#main-content');
	var $internalLinks = $(internalLinksQuery);
	var $relatedPostsContainer = $('#related-posts-container');
	var $logo = $('#site-head-content');
	var $header = $('#site-head');
	var config = window.ghostentista.config;
	var $footerLinks = $('.get-connected p');
	$mainContent.fitVids();
	if (config.socialProfiles.facebook != '') {
		$footerLinks.append($('<a class="icon-facebook-circled" href="' + config.socialProfiles.facebook + '" target="_blank"></a>'))
	}
	if (config.socialProfiles.email != '') {
		$footerLinks.append($('<a class="icon-mail-circled" href="' + config.socialProfiles.email + '" target="_blank"></a>'))
	}
	if (config.socialProfiles.twitter != '') {
		$footerLinks.append($('<a class="icon-twitter-circled" href="' + config.socialProfiles.twitter + '" target="_blank"></a>'))
	}
	if (config.socialProfiles.linkedIn != '') {
		$footerLinks.append($('<a class="icon-linkedin-circled" href="' + config.socialProfiles.linkedIn + '" target="_blank"></a>'))
	}
	if (config.socialProfiles.github != '') {
		$footerLinks.append($('<a class="icon-github-circled" href="' + config.socialProfiles.github + '" target="_blank"></a>'))
	}
	if (config.socialProfiles.pinterest != '') {
		$footerLinks.append($('<a class="icon-pinterest-circled" href="' + config.socialProfiles.pinterest + '" target="_blank"></a>'))
	}
	if (config.socialProfiles.instagram != '') {
		$footerLinks.append($('<a class="icon-instagram-circled" href="' + config.socialProfiles.instagram + '" target="_blank"></a>'))
	}
	if(config.logoBackground != '') {
		$logo.css({background: config.logoBackground});

	}

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
		Prism.highlightElement();
		$window.trigger('scroll');
		$window.trigger('resize');
	}, 200);

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

		ga('create', 'UA-xxxx');
		ga('send', 'pageview');
	}

});

