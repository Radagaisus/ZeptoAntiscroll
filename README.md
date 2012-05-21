
# Zepto [Antiscroll](https://github.com/LearnBoost/antiscroll): cross-browser native OSX Lion scrollbars

This is a port of Antiscroll, written in Coffee Script, to work with Zepto. This is for a personal project, but it might help someone out there.

## Caveats:
- `jQuery.mousewheel` isn't supported yet. (planned)
- There are no options.
- You can only use this on one elemnt, and there's no chaining afterwards, since there's no `.data() support.`

This is for a personal project, but it might helped someone out there.

## Features

- Supports mousewheels, trackpads, other input devices natively.
- Total size is **1kb** minified and gzipped.
- Doesn't magically autowrap your elements with divs (manual wrapping is necessary,
  please see `index.html` demo)
- Fade in/out controlled with CSS3 animations.
- Shows scrollbars upon hovering.
- Scrollbars are draggable.
- Size of container can be dynamically adjusted and scrollbars will adapt.
- Supports IE7+, Firefox 3+, Chrome, Safari

## License 

(The MIT License)

Copyright (c) 2011 Guillermo Rauch &lt;guillermo@learnboost.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
