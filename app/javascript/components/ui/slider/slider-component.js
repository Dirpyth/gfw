import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import fill from 'lodash/fill';

import RCSlider, { Range, Handle } from 'rc-slider';
import { Tooltip } from 'wri-api-components';

import 'rc-slider/assets/index.css';
import './styles.scss';

class Slider extends PureComponent {
  renderHandle = props => {
    const { value, dragging, index, ...restProps } = props;

    return (
      <Tooltip
        key={index}
        overlay={value}
        overlayClassName="c-rc-tooltip -default"
        overlayStyle={{ color: '#fff' }}
        placement="top"
        mouseLeaveDelay={0}
        destroyTooltipOnHide
        visible={dragging}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  };

  render() {
    const {
      className,
      range,
      trackColors,
      trackStyle,
      handleStyle,
      value,
      ...rest
    } = this.props;
    const Component = range ? Range : RCSlider;
    const handleNum = value.length;
    const handleStyles = fill(Array(handleNum), { display: 'none' });
    handleStyles[0] = handleStyle;
    handleStyles[handleNum - 1] = handleStyle;

    const trackStyles = fill(Array(handleNum - 1), trackStyle).map((t, i) => ({
      ...t,
      backgroundColor: trackColors[i] || ''
    }));

    return (
      <div className={`c-slider ${className || ''}`}>
        <Component
          handle={this.renderHandle}
          {...rest}
          handleStyle={handleStyles}
          trackStyle={trackStyles}
          value={value}
        />
      </div>
    );
  }
}

Slider.defaultProps = {
  trackStyle: { backgroundColor: '#d6d6d9', borderRadius: '0px' },
  handleStyle: {
    backgroundColor: 'white',
    borderRadius: '2px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.29)',
    border: '0px'
  },
  railStyle: { backgroundColor: '#d6d6d9' },
  dotStyle: { display: 'none', border: '0px' },
  pushable: true
};

Slider.propTypes = {
  className: PropTypes.string,
  settings: PropTypes.object,
  value: PropTypes.array,
  dragging: PropTypes.bool,
  index: PropTypes.number,
  range: PropTypes.bool,
  handleStyle: PropTypes.object,
  trackStyle: PropTypes.object,
  trackColors: PropTypes.array
};

export default Slider;
