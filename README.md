# Ghostentista [![Project Status](http://stillmaintained.com/viktorbezdek/ghostentista.png)](http://stillmaintained.com/viktorbezdek/ghostentista) [![Build Passing](https://travis-ci.org/viktorbezdek/ghostentista.png)](https://travis-ci.org/viktorbezdek/ghostentista)
## Theme for Ghost Blogging Platform
version 1.0.0-beta

Responsive, beautiful, usable, open source, content centric theme for Ghost Blogging Platform. Built using Grunt.js, styled using LESS, configurable and linted.

### Demo
- [Latest version can be seen at Etheeks.com](http://www.etheeks.com)
- [Join newsletter here](http://www.etheeks.com/#newsletter)

### Features
@todo rewrite completely

### How to build and stuff
@todo write guide

____
### Known issues
Probably lots of issues since its beta.

____
## Like the theme? Want to show your appreciation?
Buy me a beer via [gittip](https://www.gittip.com/viktorbezdek/).
[![Support via Gittip](https://rawgithub.com/twolfson/gittip-badge/0.1.0/dist/gittip.png)](https://www.gittip.com/viktorbezdek/)
____
## Changelog

### 1.0.0
- Grunt build for great and easy local development
- Easy customisation of colors and stuff in style.less
- New open source paragraph font Roboto
- Support for all languages using latin and latin extended alphabet
- Enhanced typography (optimal chars per line on each platform)
- Trendy slabby headlines
- Responsive masonry(ish) layout
- Nanostrap (Bootstrap) styled forms and components for convenience
- Featured posts support
- FitVids.js for responsive videos (thanks @anieto)
- Lots of changes, tweaks and enhancements
- (NOT YET) Component helpers - gallery, masonry, buttons, highlights and other cool stuff
- (NOT YET) Menu support (By adding links to `assets/js/config.js` file. No other way. Blame @TryGhost)
- (NOT YET) Custom `error.hbs` page
- (NOT YET) Smart logo colors by detecting background color with `BackgroundCheck.js`
- (FAR FROM DONE) The Configurator
____
### 0.6.0
- loading assets using ghosts helpers bug #10
- template for pages
- working correctly on Android 4.3 default browser bug #7
- got rid of async page loading so we are compatible with disqus bug #8
- configuration in `assets/js/config.js`

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

## Copyright & License

Copyright (C) 2013 Viktor Bezdek - Released under the MIT License.

<small>
*FitVids 1.0.3*
Copyright 2013, Chris Coyier WTFPL

*SlabText 2.3*
jQuery slabtext plugin v2.3 MIT/GPL2 @freqdec

*Salvattore 1.0.5*
Masonry helper, Rolando Murillo and Giorgio Leveroni
</small>
___
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
