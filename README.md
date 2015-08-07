Super-Lite Line Graphing JS library
Started by jimyuyuyi@gmail.com, since 2014-08-19

A light-weight line graph rendering Javascript library for web-site graphs.
Able to render massive amount of data points (eg. annual data at 1 minute granularity=525600 data points),
with optimized speed in rendering and minimal memory usage.

Contains built-in basic statistics (min,max,average,percentile) options.
_loopx functions are designed to allow progress % updates, and to avoid IE 8- browsers becoming non-responsive.

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
- Dygraph is more established and has more plot-related options (eg. error bars, rolling averages).
- Dygraph has mouse panning encoded. SLLG does not.
- Dygraph can handle CSV data input; SLLG cannot.
- SLLG large data sets requires  minimum&maximum for both x-axis and y-axis to be provided ahead of time.

Basic Usage: new SLLG(node,input data,{options})


Options References:
- grpary: Group/series names in array. Default: undefined, auto-derived from input data structure.
- colors: Array of Color for each series line. Default: undefined, all drawn as black
- endfunc: Callback function to excute after each rendering ends.
- xhili: x-label node on mouse rollover-highlight.
- yhili: y-values node on mouse rollover-highlight.
- ser_hide: Array of boolean to indicate which arrays are hidden at start. Default: blank, no series hidden.
- loadlbl: Loading progress Label node.
- lineThickness: Line thickness of graph. Default:1.5
- areafill: wheter or not to fill in area under line graph. Default: false.

- xmin: Minimum X value to plot.
- xmax: Maximum X value to plot.
- xinc: X value increment for each data point.
- xincsub: X sub-interval increment for summation/rollover within xinc intervals.
- xary: Array of X-values to plot.
- xincgap: How many consecutive xinc with no data to be drawn as a gap. 
	No gap is drawn if this is not defined. 
- xtimeflag: Boolean indicator whether x-values are time (milliseconds) values. Default: false.
- xincsub_addflag option: boolean wheter or not subinterval values gets summed up, or only get the first valid sub-interval value as representative of interval. Default: true

- ymin: Minimum Y value to plot.
- ymax: Maximum Y value to plot.
- yscale: Y-scaling divisor of data values. Default: 1.
- ydec: Maximum number of decimal places in plot. Default: 4 decimal places
- yunit: Y-axis unit label.
- yudlbl: Undefined Y-value label for missing data points. Default:'NODATA'
- ypowadjust: Boolean indicator on whether to automatically adjust y-unit power prefix (eg. B->KB) Default:true.

- rpthrs: Start hours of plot per daily basis, only if xtimeflag is enabled.
- rpthre: End hours of plot per daily basis, only if xtimeflag is enabled.
- combinemod: Group combination modulator, to combine series data as one.
- colind: Column index to extract data from sub-arrays of input.
- ymultintrvl: Y multiplier by intervals.

- yrecalc_limit: Max number of points (based on xinc) to recalculate y-axis scaling and labels. Default:21600
- loopbrk: Max number of points (based on xinc) to pause between drawing loops. Default: undefined; auto-determined based on loadlbl[40K] and excanvas[30K].
- resizewait: Milliseconds for wait period in window auto-resizing. Default: 500
- movewait: Milliseconds of waiting between mouse moves for roll-over updates. Default:40

- statpar: Statistics Parent Node: where to display series statisics summary lines (min,max,avg...etc.)
- statmin: Boolean indicator to show series minimum stats. Default: true
- statmax: Boolean indicator to show series maximum stats. Default: true
- statavg: Boolean indicator to show series average stats. Default: true
- stat_triglbl: Boolean indicator to draw triangle labels on plot for series min & max. Default: true
- statpct: Percentile Statistics, 0 to 100. Default: undefined
- stattimenode: Statistics X/time period label node.
- statcolorlines: Mapping of color:Y values to draw dashed lines
- statbench: Benchmark statistics - how many data points are under this y-value. Default: undefined. 
- statbenchdesc: Benchmark statistics label.

- zoomcolor: Zoom-drag background rectangle color. Default:half-transparent gray
- gridcolor: Axis Grid colors. Default:gray
- gridsize: Axis grid size. Default: 2
- gridopacity: Grid opacity. Default: 0.2
- hili_size: High-light point circle size. Default: 6
- yavglsize: Y-average line size,if statavg is enabled. Default:2
- yleftmargin: Margin space(px) to left of x-axis (right of y-axis). Default:5
- yrightmargin: Margin space(px) to left of x-axis (right edge of data points). Default:0
- xlblmargin: X-axis tick labels margin spacing(px). Default: 4.
