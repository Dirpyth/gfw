/**
 * The TimelineView class for the Google Map.
 *
 * @return TimelineView class (extends Backbone.View)
 */
define([
  'backbone',
  'underscore',
  'handlebars',
  'map/views/Widget',
  'map/presenters/TimelinePresenter',
  'text!map/templates/timeline.handlebars'
], function(Backbone, _, Handlebars, Widget, Presenter, tpl) {

  'use strict';

  var TimelineView = Widget.extend({

    className: 'widget widget-timeline',

    template: Handlebars.compile(tpl),

    options: {
      hidden: true,
      boxClosed: false,
      boxDraggable: false
    },

    initialize: function() {
      this.presenter = new Presenter(this);
      this.currentTimeline = null;
      TimelineView.__super__.initialize.apply(this);
    },

    _cacheSelector: function() {
      TimelineView.__super__._cacheSelector.apply(this);
      this.$timelineName = this.$el.find('.timeline-name');
      this.$timelineLatLng = this.$el.find('.timeline-latlng');
    },

    update: function(layer) {
      var currentLatlng = this.$timelineLatLng.html();
      var p = {};
      p[layer.slug] = true;
      p.layerTitle = layer.title;
      var html = this.template(p);
      this._update(html);
      this.$timelineLatLng.html(currentLatlng);
      ga('send', 'event', 'Map', 'Timeline', 'Change' + layer.slug);
    },

    updateLatlng: function(lat, lng) {
      var html = 'Lat/long: {0}, {1}'.format(lat.toFixed(6), lng.toFixed(6));
      this.$timelineLatLng.html(html);
    },

    getCurrentDate: function() {
      if (this.currentTimeline) {
        return this.currentTimeline.getCurrentDate();
      }
    }
  });

  return TimelineView;
});
