import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Legend,
  LegendItemToolbar,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemButtonInfo,
  LegendItemButtonRemove,
  LegendItemTypes,
  LegendListItem,
  Icons
} from 'wri-api-components';

import Loader from 'components/ui/loader';

import Timeline from './components/timeline';
import LayerListMenu from './components/layer-list-menu';
import ThresholdSelector from './components/threshold-selector';
import LayerSelectorMenu from './components/layer-selector-menu';
import LossStatement from './components/loss-statement';

import './legend-styles.scss';

class MapLegend extends Component {
  render() {
    const {
      layerGroups,
      layers,
      onChangeOrder,
      onChangeTimeline,
      onChangeThreshold,
      onToggleLayer,
      onChangeLayer,
      onChangeInfo,
      loading,
      ...rest
    } = this.props;
    return (
      <div className="c-legend">
        <Icons />
        {loading && <Loader className="datasets-loader" />}
        {!loading &&
          layerGroups &&
          !!layerGroups.length && (
            <Legend
              layerGroups={layerGroups}
              collapsable={false}
              onChangeOrder={onChangeOrder}
            >
              {layerGroups.map((lg, i) => {
                const {
                  isSelectorLayer,
                  isMultiLayer,
                  selectorLayerConfig,
                  color,
                  isLossLayer
                } = lg;
                const activeLayer = lg.layers.find(l => !!l.active) || {};
                const { legendConfig, params, timelineConfig } = activeLayer;

                return (
                  <LegendListItem
                    index={i}
                    key={lg.id}
                    layerGroup={lg}
                    toolbar={
                      <LegendItemToolbar {...rest}>
                        <LegendItemButtonOpacity
                          className="-plain"
                          handleStyle={[
                            {
                              backgroundColor: '#fff',
                              borderRadius: '4px',
                              border: 0,
                              boxShadow: 'rgba(0, 0, 0, 0.29) 0px 1px 2px 0px'
                            }
                          ]}
                          trackStyle={[
                            { backgroundColor: color || '#97be32' },
                            { backgroundColor: '#d6d6d9' }
                          ]}
                          color={color}
                        />
                        <LegendItemButtonVisibility />
                        <LegendItemButtonInfo />
                        <LegendItemButtonRemove />
                      </LegendItemToolbar>
                    }
                  >
                    <LegendItemTypes />
                    {activeLayer &&
                      params &&
                      (params.thresh || params.threshold) && (
                        <ThresholdSelector
                          className="threshold"
                          threshold={params.thresh || params.threshold}
                          onChange={onChangeThreshold}
                          layer={activeLayer}
                        />
                      )}
                    {isSelectorLayer && (
                      <LayerSelectorMenu
                        className="layer-selector"
                        layerGroup={lg}
                        onChange={onChangeLayer}
                        {...selectorLayerConfig}
                      />
                    )}
                    {isLossLayer && (
                      <LossStatement className="loss-statement" />
                    )}
                    {timelineConfig && (
                      <Timeline
                        className="timeline"
                        handleChange={range =>
                          onChangeTimeline(activeLayer, range)
                        }
                        {...timelineConfig}
                        customColor={
                          legendConfig &&
                          legendConfig.items &&
                          legendConfig.items[0].color
                        }
                      />
                    )}
                    {isMultiLayer && (
                      <LayerListMenu
                        className="sub-layer-menu"
                        layers={lg.layers}
                        onToggle={onToggleLayer}
                        onInfoClick={onChangeInfo}
                      />
                    )}
                  </LegendListItem>
                );
              })}
            </Legend>
          )}
      </div>
    );
  }
}

MapLegend.defaultProps = {
  maxHeight: 300,
  LegendItemToolbar: <LegendItemToolbar />,
  LegendItemTypes: <LegendItemTypes />
};

MapLegend.propTypes = {
  layerGroups: PropTypes.array,
  loading: PropTypes.bool,
  onChangeOrder: PropTypes.func,
  onChangeTimeline: PropTypes.func,
  onChangeThreshold: PropTypes.func,
  onToggleLayer: PropTypes.func,
  onChangeLayer: PropTypes.func,
  onChangeInfo: PropTypes.func,
  layers: PropTypes.array
};

export default MapLegend;
