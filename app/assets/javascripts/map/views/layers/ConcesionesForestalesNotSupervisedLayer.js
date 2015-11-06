/**
 * The Forma Coverage layer module for use on canvas.
 *
 * @return ConcesionesForestalesNotSupervised class (extends CanvasLayerClass)
 */
define([
  'abstract/layer/CartoDBLayerClass',
  'text!map/cartocss/concesiones_peruTypes.cartocss'
], function(CartoDBLayerClass,concesiones_forestalesCartoCSS) {

  'use strict';

  var ConcesionesForestalesNotSupervised = CartoDBLayerClass.extend({

    options: {
      sql: 'SELECT the_geom_webmercator, cartodb_id, title_holder, area_ha, type, province, contract, department, supervision, \'{tableName}\' AS tablename, {analysis} AS analysis, \'{tableName}\' AS name FROM {tableName}',
      analysis: true,
      infowindow: true,
      interactivity: 'cartodb_id, tablename, title_holder, area_ha, type, province, department, contract, supervision, analysis',
      cartocss: concesiones_forestalesCartoCSS
    }

  });

  return ConcesionesForestalesNotSupervised;

});
