import { getLoss } from 'services/forest-data';
import axios from 'axios';
import maxBy from 'lodash/maxBy';
import range from 'lodash/range';

import getWidgetProps from './selectors';

export default {
  widget: 'emissions-plantations',
  title: {
    initial: 'Biomass loss emissions in natural forest vs. plantations'
  },
  categories: ['climate'],
  types: ['country'],
  admins: ['adm0', 'adm1', 'adm2'],
  settingsConfig: [
    {
      key: 'unit',
      label: 'unit',
      type: 'select',
      whitelist: ['co2LossByYear', 'cLossByYear']
    },
    {
      key: 'years',
      label: 'years',
      endKey: 'endYear',
      startKey: 'startYear',
      type: 'range-select',
      border: true
    },
    {
      key: 'threshold',
      label: 'canopy density',
      type: 'mini-select',
      metaKey: 'widget_canopy_density'
    }
  ],
  chartType: 'pieChart',
  datasets: [
    // biomass loss
    {
      dataset: 'a9cc6ec0-5c1c-4e36-9b26-b4ee0b50587b',
      layers: ['b32a2f15-25e8-4ecc-98e0-68782ab1c0fe']
    }
  ],
  analysis: true,
  colors: 'climate',
  metaKey: 'tree_biomass_loss',
  sortOrder: {
    climate: 3
  },
  sentences: {
    initial:
      'From {startYear} to {endYear}, a total of {emissions} of {variable} emissions were released from tree cover loss in {location} natural forests.'
  },
  whitelists: {
    indicators: ['plantations']
  },
  settings: {
    forestType: 'ifl',
    threshold: 30,
    startYear: 2013,
    endYear: 2018,
    unit: 'co2LossByYear'
  },
  getData: params =>
    axios
      .all([getLoss(params), getLoss({ ...params, forestType: 'plantations' })])
      .then(
        axios.spread((admin, plantations) => {
          const adminData = admin.data && admin.data.data;
          const plantData = plantations.data && plantations.data.data;

          const maxAdmin = maxBy(adminData, 'year');
          const maxPlantations = maxBy(plantData, 'year');
          const maxYear =
            maxAdmin &&
            maxPlantations &&
            Math.max(maxAdmin.year, maxPlantations.year);

          return { adminData, plantData, years: range(2013, maxYear + 1) };
        })
      ),
  getWidgetProps
};
