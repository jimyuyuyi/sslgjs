Super-Lite Line Graphing JS library
Started by jimyuyuyi@gmail.com, since 2014-08-19

A light-weight line graph rendering Javascript library for web-site graphs.
Able to render massive amount of data points (eg. annual data at 1 minute granularity=525600 data points),
with optimized speed in rendering and minimal memory usage.

Contains built-in basic statistics (min,max,average,percentile) options.
_loopx functions are designed to allow progress % updates, and to avoid IE 8- browsers becoming non-responsive.


Detailed Options References coming soon!

Interactive Controls:
- mouse roll-over & move: highlight and show point values. 
- click and drag: Zoom-in 
- double-click: Zoom-out
- series label click: hide/show the series

Benchmark: 500K data size for 2 groups rendered in 80 seconds, 1840 seconds for IE8- using excanvas.

Inspirations: Dygraph[www.dygraph.com] & Highcharts [www.highcharts.com] JS graphing libraries.

Advantages of SLLG over Dygraph:
- Embededd statistics variables, such as series sum, minimum & maximum.
- mouse rollover highlighthing on large data set is more accurate, taking account of Y coordinate.
- zoom-out on large data set is faster due to inital drawing state being saved.
- X-axis time values labels automatically adjust to date or time levels, contains more information.
- clicking on series label allows you to show/hide series
- Does not crash in IE8 for huge data-sets, due to use of timeout in rendering loops.
- Allows input of Object/map data.
- Shows triangluar labels on min/max points per series

Disadvantages of SLLG vs Dygraph:
- Dygraph inital rendering is about 5 times faster.
- Dygraph is more established and has more plot-related options (e.g rollover periods)
- Dygraph has mouse panning encoded. SLLG does not.
- Dygraph can handle CSV data input; SLLG cannot.
- SLLG large data sets requires  minimum&maximum for both x-axis and y-axis to be provided ahead of time.
