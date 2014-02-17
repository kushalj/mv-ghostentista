# Ghostentista [![Project Status](http://stillmaintained.com/viktorbezdek/ghostentista.png)](http://stillmaintained.com/viktorbezdek/ghostentista) [![GitHub version](https://badge.fury.io/gh/viktorbezdek%2Fghostentista.png)](http://badge.fury.io/gh/viktorbezdek%2Fghostentista)

# <div style='color: red; text-align: center;'>Current version is broken. Fixed will be published later today. Please do not update to this version! 

(written 17.02.2014 18:30)</div>

## Theme for Ghost Blogging Platform

### version 0.6

Responsive, asynchronous, content centric theme for Ghost. Inspired by my own WordPress theme Kontentista (not quite finished). Built using modern web technologies and with a help of LESS preprocessor. Tested on IE9+, Chrome Firefox, Safari, iOS7 and Android 4.3 on Nexus 7.

### Demo
- [Latest version can be seen at Etheeks.com](http://www.etheeks.com)

## Features
- Responsive (images, videos included)
- Optimal letters per line for great reading experience
- Simple configuration in `assets/js/config.js`
- Prism code highlighting
- Related articles under posts
- Fluid width video embeds
- Social sharing
- Animations and modern layout approach

### Coming soon
- Menu for pages
- Theme Builder (choose font, colors...)
- Developer version (Grunt built, Bower packages support, Auto-wired RequireJS)

## Like it? Tip it ;)

Support this project via [gittip](https://www.gittip.com/viktorbezdek/).

[![Support via Gittip](https://rawgithub.com/twolfson/gittip-badge/0.1.0/dist/gittip.png)](https://www.gittip.com/viktorbezdek/)

___

## Changelog

### 0.6.0
- loading assets using ghosts helpers bug #10
- template for pages
- working correctly on Android 4.3 default browser bug #7
- got rid of async page loading so we are compatible with disqus bug #8
- configuration in `assets/js/config.js` - social networks, logo background, google analytics
- properly implemented fitvids

### 0.5.1
- fixed ios < 7 fixed layout issue
- added mail icon fixed issue #5
- combined js
- optimized stylesheet by csso

____
### 0.5
- simplified stylesheets
- dynamic navbar
- better layout for post listings
- typography improvements
- rethought footer
- performance optimized
- tweaked responsive behavior
- fixed issue #3
- fixed issue #4

_____
#### 0.4.2
- asynchronous paging
- LESS styles are no longer part of the project
   
______
#### 0.4.1 - service release
- fixed issues #1 #2
- animations only for big screens
- text size corrections to maintain optimal number of characters on line
   
_____
#### 0.4
- rewriten most layout code, 18% faster page rendering in chrome
- completely rewriten typography using golden cut scaling
- changed fonts to League Gothic for headers and Raleway for rest
- rewritten and rethought breakpoints
- more tidy HTML
- nifty animation on image logo
- temporarily removed footer static position until I have nervs to deal with fraking iOS7
- pagination working
   
## Known issues
None. If you find something, report it and it will be fixed in next commit

## Copyright & License

Copyright (C) 2013 Viktor Bezdek - Released under the MIT License.    
___
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
