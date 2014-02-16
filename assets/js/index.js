(function () {
    var e = /\blang(?:uage)?-(?!\*)(\w+)\b/i, t = self.Prism = {util: {type: function (e) {
        return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]
    }, clone: function (e) {
        var n = t.util.type(e);
        switch (n) {
            case"Object":
                var r = {};
                for (var i in e)e.hasOwnProperty(i) && (r[i] = t.util.clone(e[i]));
                return r;
            case"Array":
                return e.slice()
        }
        return e
    }}, languages: {extend: function (e, n) {
        var r = t.util.clone(t.languages[e]);
        for (var i in n)r[i] = n[i];
        return r
    }, insertBefore: function (e, n, r, i) {
        i = i || t.languages;
        var s = i[e], o = {};
        for (var u in s)if (s.hasOwnProperty(u)) {
            if (u == n)for (var a in r)r.hasOwnProperty(a) && (o[a] = r[a]);
            o[u] = s[u]
        }
        return i[e] = o
    }, DFS: function (e, n) {
        for (var r in e) {
            n.call(e, r, e[r]);
            t.util.type(e) === "Object" && t.languages.DFS(e[r], n)
        }
    }}, highlightAll: function (e, n) {
        var r = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');
        for (var i = 0, s; s = r[i++];)t.highlightElement(s, e === !0, n)
    }, highlightElement: function (r, i, s) {
        var o, u, a = r;
        while (a && !e.test(a.className))a = a.parentNode;
        if (a) {
            o = (a.className.match(e) || [, ""])[1];
            u = t.languages[o]
        }
        if (!u)return;
        r.className = r.className.replace(e, "").replace(/\s+/g, " ") + " language-" + o;
        a = r.parentNode;
        /pre/i.test(a.nodeName) && (a.className = a.className.replace(e, "").replace(/\s+/g, " ") + " language-" + o);
        var f = r.textContent;
        if (!f)return;
        f = f.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
        var l = {element: r, language: o, grammar: u, code: f};
        t.hooks.run("before-highlight", l);
        if (i && self.Worker) {
            var c = new Worker(t.filename);
            c.onmessage = function (e) {
                l.highlightedCode = n.stringify(JSON.parse(e.data), o);
                t.hooks.run("before-insert", l);
                l.element.innerHTML = l.highlightedCode;
                s && s.call(l.element);
                t.hooks.run("after-highlight", l)
            };
            c.postMessage(JSON.stringify({language: l.language, code: l.code}))
        } else {
            l.highlightedCode = t.highlight(l.code, l.grammar, l.language);
            t.hooks.run("before-insert", l);
            l.element.innerHTML = l.highlightedCode;
            s && s.call(r);
            t.hooks.run("after-highlight", l)
        }
    }, highlight: function (e, r, i) {
        return n.stringify(t.tokenize(e, r), i)
    }, tokenize: function (e, n, r) {
        var i = t.Token, s = [e], o = n.rest;
        if (o) {
            for (var u in o)n[u] = o[u];
            delete n.rest
        }
        e:for (var u in n) {
            if (!n.hasOwnProperty(u) || !n[u])continue;
            var a = n[u], f = a.inside, l = !!a.lookbehind, c = 0;
            a = a.pattern || a;
            for (var h = 0; h < s.length; h++) {
                var p = s[h];
                if (s.length > e.length)break e;
                if (p instanceof i)continue;
                a.lastIndex = 0;
                var d = a.exec(p);
                if (d) {
                    l && (c = d[1].length);
                    var v = d.index - 1 + c, d = d[0].slice(c), m = d.length, g = v + m, y = p.slice(0, v + 1), b = p.slice(g + 1), w = [h, 1];
                    y && w.push(y);
                    var E = new i(u, f ? t.tokenize(d, f) : d);
                    w.push(E);
                    b && w.push(b);
                    Array.prototype.splice.apply(s, w)
                }
            }
        }
        return s
    }, hooks: {all: {}, add: function (e, n) {
        var r = t.hooks.all;
        r[e] = r[e] || [];
        r[e].push(n)
    }, run: function (e, n) {
        var r = t.hooks.all[e];
        if (!r || !r.length)return;
        for (var i = 0, s; s = r[i++];)s(n)
    }}}, n = t.Token = function (e, t) {
        this.type = e;
        this.content = t
    };
    n.stringify = function (e, r, i) {
        if (typeof e == "string")return e;
        if (Object.prototype.toString.call(e) == "[object Array]")return e.map(function (t) {
            return n.stringify(t, r, e)
        }).join("");
        var s = {type: e.type, content: n.stringify(e.content, r, i), tag: "span", classes: ["token", e.type], attributes: {}, language: r, parent: i};
        s.type == "comment" && (s.attributes.spellcheck = "true");
        t.hooks.run("wrap", s);
        var o = "";
        for (var u in s.attributes)o += u + '="' + (s.attributes[u] || "") + '"';
        return"<" + s.tag + ' class="' + s.classes.join(" ") + '" ' + o + ">" + s.content + "</" + s.tag + ">"
    };
    if (!self.document) {
        self.addEventListener("message", function (e) {
            var n = JSON.parse(e.data), r = n.language, i = n.code;
            self.postMessage(JSON.stringify(t.tokenize(i, t.languages[r])));
            self.close()
        }, !1);
        return
    }
    var r = document.getElementsByTagName("script");
    r = r[r.length - 1];
    if (r) {
        t.filename = r.src;
        document.addEventListener && !r.hasAttribute("data-manual") && document.addEventListener("DOMContentLoaded", t.highlightAll)
    }
})();
;
Prism.languages.css = {comment: /\/\*[\w\W]*?\*\//g, atrule: {pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi, inside: {punctuation: /[;:]/g}}, url: /url\((["']?).*?\1\)/gi, selector: /[^\{\}\s][^\{\};]*(?=\s*\{)/g, property: /(\b|\B)[\w-]+(?=\s*:)/ig, string: /("|')(\\?.)*?\1/g, important: /\B!important\b/gi, ignore: /&(lt|gt|amp);/gi, punctuation: /[\{\};:]/g};
Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {style: {pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/style(>|&gt;)/ig, inside: {tag: {pattern: /(&lt;|<)style[\w\W]*?(>|&gt;)|(&lt;|<)\/style(>|&gt;)/ig, inside: Prism.languages.markup.tag.inside}, rest: Prism.languages.css}}});
;
Prism.languages.css.selector = {pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/g, inside: {"pseudo-element": /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/g, "pseudo-class": /:[-\w]+(?:\(.*\))?/g, "class": /\.[-:\.\w]+/g, id: /#[-:\.\w]+/g}};
Prism.languages.insertBefore("css", "ignore", {hexcode: /#[\da-f]{3,6}/gi, entity: /\\[\da-f]{1,8}/gi, number: /[\d%\.]+/g, "function": /(attr|calc|cross-fade|cycle|element|hsla?|image|lang|linear-gradient|matrix3d|matrix|perspective|radial-gradient|repeating-linear-gradient|repeating-radial-gradient|rgba?|rotatex|rotatey|rotatez|rotate3d|rotate|scalex|scaley|scalez|scale3d|scale|skewx|skewy|skew|steps|translatex|translatey|translatez|translate3d|translate|url|var)/ig});
;
Prism.languages.clike = {comment: {pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])\/\/.*?(\r?\n|$))/g, lookbehind: !0}, string: /("|')(\\?.)*?\1/g, "class-name": {pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig, lookbehind: !0, inside: {punctuation: /(\.|\\)/}}, keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g, "boolean": /\b(true|false)\b/g, "function": {pattern: /[a-z0-9_]+\(/ig, inside: {punctuation: /\(/}}, number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g, operator: /[-+]{1,2}|!|&lt;=?|>=?|={1,3}|(&amp;){1,2}|\|?\||\?|\*|\/|\~|\^|\%/g, ignore: /&(lt|gt|amp);/gi, punctuation: /[{}[\];(),.:]/g};
;
Prism.languages.javascript = Prism.languages.extend("clike", {keyword: /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|throw|catch|finally|null|break|continue)\b/g, number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g});
Prism.languages.insertBefore("javascript", "keyword", {regex: {pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g, lookbehind: !0}});
Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {script: {pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig, inside: {tag: {pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig, inside: Prism.languages.markup.tag.inside}, rest: Prism.languages.javascript}}});
;
Prism.languages.php = Prism.languages.extend("clike", {keyword: /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|extends|private|protected|parent|static|throw|null|echo|print|trait|namespace|use|final|yield|goto|instanceof|finally|try|catch)\b/ig, constant: /\b[A-Z0-9_]{2,}\b/g});
Prism.languages.insertBefore("php", "keyword", {delimiter: /(\?>|&lt;\?php|&lt;\?)/ig, variable: /(\$\w+)\b/ig, "package": {pattern: /(\\|namespace\s+|use\s+)[\w\\]+/g, lookbehind: !0, inside: {punctuation: /\\/}}});
Prism.languages.insertBefore("php", "operator", {property: {pattern: /(->)[\w]+/g, lookbehind: !0}});
Prism.languages.markup && (Prism.hooks.add("before-highlight", function (a) {
    "php" === a.language && (a.tokenStack = [], a.code = a.code.replace(/(?:&lt;\?php|&lt;\?|<\?php|<\?)[\w\W]*?(?:\?&gt;|\?>)/ig, function (b) {
        a.tokenStack.push(b);
        return"{{{PHP" + a.tokenStack.length + "}}}"
    }))
}), Prism.hooks.add("after-highlight", function (a) {
    if ("php" === a.language) {
        for (var b = 0, c; c = a.tokenStack[b]; b++)a.highlightedCode = a.highlightedCode.replace("{{{PHP" + (b + 1) + "}}}", Prism.highlight(c, a.grammar, "php"));
        a.element.innerHTML = a.highlightedCode
    }
}), Prism.hooks.add("wrap", function (a) {
    "php" === a.language && "markup" === a.type && (a.content = a.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, '<span class="token php">$1</span>'))
}), Prism.languages.insertBefore("php", "comment", {markup: {pattern: /(&lt;|<)[^?]\/?(.*?)(>|&gt;)/g, inside: Prism.languages.markup}, php: /\{\{\{PHP[0-9]+\}\}\}/g}));
;
/*global jQuery */
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

