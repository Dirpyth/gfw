import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';

// get list data
const getData = state => state.data || null;
const getStartYear = state => state.startYear || null;
const getEndYear = state => state.endYear || null;

// get lists selected
export const filterData = createSelector(
  [getData, getStartYear, getEndYear],
  (data, startYear, endYear) => {
    if (!data || isEmpty(data.loss)) return null;
    return data.loss
      .filter(d => d.year >= startYear && d.year <= endYear)
      .map(d => ({
        ...d,
        percentage: d.area / data.extent * 100
      }));
  }
);
