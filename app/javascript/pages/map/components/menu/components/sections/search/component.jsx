import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Search from 'components/ui/search';
import NoContent from 'components/ui/no-content';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import LayerToggle from 'components/map-v2/components/legend/components/layer-toggle';

import locationIcon from 'assets/icons/location.svg';
import './styles.scss';

class MapMenuSearch extends PureComponent {
  handleSearchChange = () => {};

  render() {
    const {
      datasets,
      locations,
      onToggleLayer,
      onInfoClick,
      search,
      setMenuSettings,
      handleClickLocation,
      loading
    } = this.props;

    return (
      <div className="c-map-menu-search">
        <h3>Search</h3>
        <Search
          className="side-menu-search"
          placeholder="Search"
          input={search}
          onChange={value => setMenuSettings({ search: value })}
        />
        {!search && (
          <NoContent
            className="empty-search"
            message="Enter a search to find datasets or locations..."
          />
        )}
        {loading && <Loader />}
        {!loading &&
          search &&
          datasets &&
          !!datasets.length && (
            <div className="datasets-search">
              <h5>Datasets</h5>
              {datasets.map(d => (
                <LayerToggle
                  key={d.id}
                  className="dataset-toggle"
                  data={{ ...d, dataset: d.id }}
                  onToggle={onToggleLayer}
                  onInfoClick={onInfoClick}
                  showSubtitle
                />
              ))}
            </div>
          )}
        {!loading &&
          search &&
          locations &&
          !!locations.length && (
            <div className="locations-search">
              <h5>Locations</h5>
              {locations.map(loc => (
                <button
                  className={cx('location', { active: loc.active })}
                  key={loc.label}
                  onClick={() => handleClickLocation(loc)}
                >
                  <Icon icon={locationIcon} className="location-icon" />
                  <p>{loc.label}</p>
                </button>
              ))}
            </div>
          )}
      </div>
    );
  }
}

MapMenuSearch.propTypes = {
  datasets: PropTypes.array,
  locations: PropTypes.array,
  onToggleLayer: PropTypes.func,
  onInfoClick: PropTypes.func,
  search: PropTypes.string,
  setMenuSettings: PropTypes.func,
  handleClickLocation: PropTypes.func,
  loading: PropTypes.bool
};

export default MapMenuSearch;
