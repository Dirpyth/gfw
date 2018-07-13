import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { getSectionData } from 'pages/map/menu/menu-selectors';
import actions from './actions';
import reducers, { initialState } from './reducers';

import Component from './component';

const mapStateToProps = ({ location, dataAnalysis, mapMenu }) => {
  const { selectedSection } = mapMenu;
  return {
    activeTab: location.payload.tab,
    analysis: dataAnalysis.analysis,
    menuSectionData: getSectionData({ selectedSection })
  };
};

class DataAnalysisMenuContainer extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const { analysis, getGeostore, getAnalysis } = nextProps;
    if (
      analysis.polygon !== null &&
      !isEqual(analysis.polygon, this.props.analysis.polygon)
    ) {
      getGeostore(analysis.polygon);
    }
    if (
      analysis.geostore !== null &&
      !isEqual(analysis.geostore, this.props.analysis.geostore)
    ) {
      getAnalysis(analysis.geostore);
    }
  }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}
DataAnalysisMenuContainer.propTypes = {
  analysis: PropTypes.object,
  getGeostore: PropTypes.func,
  getAnalysis: PropTypes.func
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(DataAnalysisMenuContainer);
