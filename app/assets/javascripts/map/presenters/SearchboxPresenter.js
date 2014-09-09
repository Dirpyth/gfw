/**º
 * The SearchboxPresenter class for the SearchboxPresenter view.
 *º
 * @return SearchboxPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var SearchboxPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{
      'AnalysisTool/stop-drawing': function() {
        this.view.model.set('hidden', false);
      }
    }, {
      'AnalysisTool/start-drawing': function() {
        this.view.model.set('hidden', true);
      }
    }],

    /**
     * Used by searchbox view to handle a fitbounds.
     *
     * @return {object} Map bounds
     */
    fitBounds: function(bounds) {
      mps.publish('Map/fit-bounds', [bounds]);
    },

    setCenter: function(lat, lng) {
      mps.publish('Map/set-center', [lat, lng]);
    }
  });

  return SearchboxPresenter;
});
