import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'components/ui/dropdown';

import './styles.scss';

class LayerSelectorMenu extends PureComponent {
  render() {
    const {
      name,
      layerGroup,
      selected,
      options,
      groups,
      onChange,
      className
    } = this.props;

    return (
      <div className={`c-layer-selector-menu ${className || ''}`}>
        {groups &&
          !!groups.length && (
            <div className="menu-wrapper">
              <span>{`Displaying ${name} for`}</span>
              <Dropdown
                className="layer-selector"
                theme="theme-dropdown-native-button"
                value={selected}
                options={groups}
                onChange={e => onChange(layerGroup, e.target.value)}
                native
              />
            </div>
          )}
        {options &&
          !!options.length && (
            <div className="menu-wrapper">
              <span>{`Displaying ${selected.group} for`}</span>
              <Dropdown
                className="layer-selector"
                theme="theme-dropdown-native-button"
                value={selected}
                options={options}
                onChange={e => onChange(layerGroup, e.target.value)}
                native
              />
            </div>
          )}
      </div>
    );
  }
}

LayerSelectorMenu.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  groups: PropTypes.array,
  layerGroup: PropTypes.object,
  onChange: PropTypes.func,
  selected: PropTypes.object
};

export default LayerSelectorMenu;
