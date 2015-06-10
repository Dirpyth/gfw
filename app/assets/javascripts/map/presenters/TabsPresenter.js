/**
 * The MapControlsPresenter class for the MapControlsPresenter view.
 *º
 * @return MapControlsPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/PresenterClass'
], function(_, mps, PresenterClass) {

  'use strict';

  var MapControlsPresenter = PresenterClass.extend({

    init: function(view) {
      this.view = view;
      this._super();
    },

    // /**
    //  * Application subscriptions.
    //  */
    _subscriptions: [{
      'Tab/open': function(id, backbutton) {
        this.view.openTab(id, backbutton);
      }
    }],

    onTabOpen: function(id){
      mps.publish('Tab/opened', [id]);
    },

  });

  return MapControlsPresenter;
});
