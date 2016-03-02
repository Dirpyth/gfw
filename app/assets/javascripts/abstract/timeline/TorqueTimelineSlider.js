define([
  'moment', 'd3'
], function(moment, d3) {

  'use strict';

  var svg, timeScale, brush, margin, width, height, el, extent, callback,
    handle, startingDate, slider;

  var TorqueTimelineSlider = function(options) {
    options = options || {};

    margin = {top: 0, right: 0, bottom: 0, left: 10};
    width = options.width - margin.left - margin.right;
    height = options.height - margin.bottom - margin.top;

    el = options.el;
    callback = options.callback;

    extent = options.extent;
    startingDate = options.startingDate;

    this.setupScales();
    this.render();

    return this;
  };

  TorqueTimelineSlider.prototype.reScale = function(range) {
    extent = range.map(function(m) { return m.toDate(); });
    startingDate = extent[0];
    this.setupScales();
  };

  TorqueTimelineSlider.prototype.setDate = function(date) {
    brush.extent([date, date]);
    handle.attr('transform', 'translate(' + (timeScale(date)-8) + ',0)');
    svg.select('.played_domain').attr('x2', timeScale(date));
  };

  TorqueTimelineSlider.prototype.setupScales = function() {
    timeScale = d3.time.scale()
      .domain(extent)
      .range([0, width])
      .clamp(true);
  };

  TorqueTimelineSlider.prototype.setupBrush = function() {
    var startingExtent = [startingDate, startingDate];
    if (!startingDate) {
      startingExtent = [moment.utc(0).toDate(), moment.utc(0).toDate()];
    }

    brush = d3.svg.brush()
      .x(timeScale)
      .extent([startingDate, startingDate])
      .on('brush', this.brushed);
  };

  TorqueTimelineSlider.prototype.brushed = function() {
    var value = brush.extent()[0];
    handle.attr('transform', 'translate(' + (timeScale(value)-8) + ',0)');

    var notProgrammaticEvent = (d3.event && d3.event.sourceEvent);
    if (notProgrammaticEvent) {
      value = timeScale.invert(d3.mouse(this)[0]);
      brush.extent([value, value]);

      if (value !== undefined) {
        callback(value);
      }
    }
  };

  TorqueTimelineSlider.prototype.setupSlider = function() {
    slider = svg.append('g')
      .attr('class', 'slider')
      .call(brush);

    slider.selectAll('.extent,.resize').remove();
    slider.select('.background')
      .attr('height', height)
      .style('cursor', 'col-resize');

    handle = slider.append('g')
      .attr('class', 'handle')
      .attr('transform', 'translate(' + (width-8) + ',0)');

    handle.append('svg:image')
      .attr('width', 16)
      .attr('height', 16)
      .attr('xlink:href', '/assets/svg/dragger2.svg')
      .attr('x', 0)
      .attr('y', (height / 2) - 8);
  };

  TorqueTimelineSlider.prototype.setupDomain = function() {
    svg.select('.slider')
      .insert('svg:line', ':first-child')
      .attr('class', 'played_domain')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', height / 2)
      .attr('y2', height / 2);

    svg.select('.slider')
      .insert('svg:line', ':first-child')
      .attr('class', 'domain')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', height / 2)
      .attr('y2', height / 2);
  };

  TorqueTimelineSlider.prototype.render = function() {
    svg = d3.select(el)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.setupBrush();
    this.setupSlider();
    this.setupDomain();
  };

  return TorqueTimelineSlider;

});
