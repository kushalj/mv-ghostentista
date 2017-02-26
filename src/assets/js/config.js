/*------------------------------------------------------------------
 Copyright (c) 2013-2014 Viktor Bezdek
 - Released under The MIT License

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

window.ghostentista = {};
var config = {
	// links to your social profiles
	// note: empty link = button wont appear
	socialProfiles: {
		facebook: '', 					// ex: https://www.facebook.com/username
		twitter: '', 					// ex: https://twitter.com/username
		github: '',						// ex: https://github.com/username
		email: '',						// ex: you@yourdomain.com
		linkedIn: '',					// ex: http://linkedin.com/in/username
		gplus: '', 						// ex: https://plus.google.com/something
		pinterest: '',					// ex: https://pinterest.com/username
		instagram: ''					// ex: http://instagram.com/username
	},
	showThemeBadge: true,				// Show or hide theme and platform credits
	showAuthorOnPostDetail: true,		// Show author bio on post detail
	googleAnalytics: '', 				// ex: UA-XXXXX-XX, if empty will not track anything
	logoBackground: 'rgba(0,0,0,0.75)',	// Enter anything which suits css background shorthand. Ex: #ffcc00, green
	appendContent: null					// HTML or text to be appended just before closing body tag
}

window.ghostentista.config = config;

/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, undefined) {
    "use strict";

    var $document = $(document);

    $document.ready(function () {

        var $postContent = $(".post-content");
        $postContent.fitVids();

        $(".scroll-down").arctic_scroll();

        $(".menu-button, .nav-cover, .nav-close").on("click", function(e){
            e.preventDefault();
            $("body").toggleClass("nav-opened nav-closed");
        });

    });

    // Arctic Scroll by Paul Adam Davis
    // https://github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };
})(jQuery);
