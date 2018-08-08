import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import { MapPopup } from 'wri-api-components';

import Button from 'components/ui/button/button-component';
import Dropdown from 'components/ui/dropdown/dropdown-component';
import Card from 'components/ui/card';

import DataTable from './components/data-table';

class Popup extends Component {
  componentDidUpdate(prevProps) {
    const { layers, clearInteractions } = prevProps;
    if (!isEqual(layers.length, this.props.layers.length)) {
      clearInteractions();
    }
  }

  render() {
    const {
      map,
      tableData,
      cardData,
      latlng,
      interactions,
      selected,
      setInteractionSelected
    } = this.props;

    return (
      <MapPopup
        map={map}
        latlng={!isEmpty(interactions) ? latlng : null}
        data={{ interactions, selected }}
      >
        <div className="c-popup">
          {cardData ? (
            <Card
              className="popup-card"
              theme="theme-card-small"
              data={cardData}
            />
          ) : (
            <div className="popup-table">
              {interactions &&
                interactions.length > 1 && (
                  <Dropdown
                    className="layer-selector"
                    theme="theme-dropdown-native-plain"
                    value={selected}
                    options={interactions}
                    onChange={e => setInteractionSelected(e.target.value)}
                    native
                  />
                )}
              {selected &&
                interactions.length === 1 && (
                  <div className="popup-title">{selected.label}</div>
                )}
              <DataTable data={tableData} />
              {
                <div className="nav-footer">
                  <Button>Analyze</Button>
                </div>
              }
            </div>
          )}
        </div>
      </MapPopup>
    );
  }
}

Popup.propTypes = {
  map: PropTypes.object,
  setInteractionSelected: PropTypes.func,
  latlng: PropTypes.object,
  selected: PropTypes.object,
  interactions: PropTypes.array,
  tableData: PropTypes.array,
  cardData: PropTypes.object,
  layers: PropTypes.array
};

export default Popup;
