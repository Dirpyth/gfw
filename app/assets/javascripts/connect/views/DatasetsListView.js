/**
 * The SubscriptionDatasetsList view.
 *
 * @return SubscriptionDatasetsList view (extends Backbone.View)
 */
define([
  'underscore',
  'handlebars',
  'mps',
  'core/View',
  'helpers/datasetsHelper',
  'map/services/CoverageService',
  'text!connect/templates/subscriptionDatasetsList.handlebars',
], function(_, Handlebars, mps, View, datasetsHelper, CoverageService, datasetTpl) {

  'use strict';

  var SubscriptionDatasetsList = View.extend({
    model: new (Backbone.Model.extend({
    })),

    el: '#datasets-selection',

    events: {
      'change .dataset-checkbox' : 'onChangeDataset'
    },

    templateDatasets: Handlebars.compile(datasetTpl),

    initialize: function(params) {
      if (!this.$el.length) {
        return;
      }
      this.params = params;

      View.prototype.initialize.apply(this);
      this.renderDatasetsList();
    },

    _subscriptions: [
      // MPS
      {
        'Datasets/change': function(params) {
          this.changeDatasets(params);
        }
      },

      {
        'Datasets/clear': function() {
          this.clearDatasets();
        }
      }
    ],


    /**
     * CHANGE EVENTS
    */
    changeDatasets: function(params) {
      var paramsValues = _.pick(params, 'use', 'useid', 'wdpaid',
      'geostore', 'country', 'region');
      var values = _.compact(_.values(paramsValues));
      this.params.datasets = params.datasets

      if (values.length) {
        this.$el.html(this.templateDatasets({
          datasets: []
        }));

        CoverageService.get(params)
          .then(function(layers) {
            this.$el.html(this.templateDatasets({
              datasets: datasetsHelper.getFilteredList(layers, this.params.datasets)
            }));
          }.bind(this))

          .error(function(error) {
            console.log(error);
          }.bind(this));
      } else {
        this.renderDatasetsList();
      }
    },

    clearDatasets: function() {
      this.params.datasets = [];
      this.renderDatasetsList();
    },


    /**
     * RENDERS
    */
    renderDatasetsList: function() {
      var selected = this.params.datasets || [];
      var datasetsList = datasetsHelper.getListSelected(selected);

      this.$el.html(this.templateDatasets({
        datasets: datasetsList
      }));
    },


    /**
     * UI EVENTS
     * - onChangeDataset
     */
    onChangeDataset: function(e) {
      e && e.preventDefault();
      var $datasetCheckboxs = this.$el.find('.dataset-checkbox');

      var datasets = _.compact(_.map($datasetCheckboxs, function(el) {
        var isChecked = $(el).is(':checked');
        return (isChecked) ? $(el).attr('id') : null;
      }.bind(this)));

      mps.publish('Datasets/update', [_.clone(datasets)]);
    }
  });

  return SubscriptionDatasetsList;

});
