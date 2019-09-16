import { createSelector, createStructuredSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import intersection from 'lodash/intersection';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import lowerFirst from 'lodash/lowerFirst';
import moment from 'moment';
import qs from 'query-string';

import { getAllAreas } from 'providers/areas-provider/selectors';
import { getGeodescriberTitleFull } from 'providers/geodescriber-provider/selectors';
import { getActiveLayersWithDates } from 'components/map/selectors';

import { getIsTrase } from 'app/layouts/root/selectors';

import tropicalIsos from 'data/tropical-isos.json';
import colors from 'data/colors.json';
import { locationLevelToStr } from 'utils/format';

import {
  getSettingsConfig,
  getOptionsSelected,
  getIndicator,
  getStatements,
  getLocationPath
} from './utils/config';
import allWidgets from './manifest';

const buildLocationDict = locations =>
  location &&
  locations.length &&
  locations.reduce(
    (dict, next) => ({
      ...dict,
      [next.value || next.id]: {
        ...next
      }
    }),
    {}
  );

export const selectLocation = state => state.location && state.location.payload;
export const selectRouteType = state => state.location && state.location.type;
export const selectLocationQuery = state =>
  state.location && state.location.query;
export const selectLocationSearch = state =>
  state.location && state.location.search;
export const selectWidgetsData = state => state.widgets && state.widgets.data;
export const selectGeostore = state => state.geostore && state.geostore.data;
export const selectLoading = state =>
  state.countryData &&
  state.whitelists &&
  (state.countryData.countriesLoading ||
    state.countryData.regionsLoading ||
    state.countryData.subRegionsLoading ||
    state.whitelists.loading);
export const selectCountryData = state => state.countryData;
export const selectPolynameWhitelist = state =>
  state.whitelists && state.whitelists.data;
export const selectEmbed = (state, { embed }) => embed;
export const selectSimple = (state, { simple }) => simple;
export const selectAnalysis = (state, { analysis }) => analysis;
export const selectCategory = state =>
  state.location && state.location.query && state.location.query.category;
export const selectModalClosing = state =>
  state.modalMeta && state.modalMeta.closing;
export const selectNonGlobalDatasets = state =>
  state.widgets && state.widgets.data.nonGlobalDatasets;

export const getWdigetFromQuery = createSelector(
  selectLocationQuery,
  query => query && query.widget
);

export const getLocation = createSelector(
  [selectLocation, selectGeostore, selectRouteType],
  (location, geostore, routeType) => {
    if (location.type === 'aoi' && geostore) {
      return {
        ...location,
        routeType,
        type: 'geostore',
        adm0: geostore.id
      };
    }

    return { ...location, routeType };
  }
);

export const getLocationObj = createSelector(
  [getLocation, getGeodescriberTitleFull],
  (location, title) => ({
    ...location,
    locationLabel: location.type === 'global' ? 'globally' : title,
    adminLevel: locationLevelToStr(location),
    locationLabelFull: location.type === 'global' ? 'globally' : title,
    isTropical: location && tropicalIsos.includes(location.adm0)
  })
);

export const getAllLocationData = createSelector(
  [
    selectLocation,
    selectCountryData,
    getAllAreas,
    selectRouteType,
    selectLocationQuery
  ],
  (location, countryData, areas, routeType, query) => {
    if (isEmpty(areas) && isEmpty(countryData)) return null;
    const { type, adm0, adm1 } = location;

    if (type === 'aoi') {
      return { adm0: areas.map(a => ({ ...a, value: a.geostore })) };
    }

    if (type === 'global' || type === 'country') {
      return {
        adm0: countryData.countries.map(l => ({
          ...l,
          path: getLocationPath(routeType, type, query, { adm0: l.value })
        })),
        adm1: countryData.regions.map(l => ({
          ...l,
          path: getLocationPath(routeType, type, query, { adm0, adm1: l.value })
        })),
        adm2: countryData.subRegions.map(l => ({
          ...l,
          path: getLocationPath(routeType, type, query, {
            adm0,
            adm1,
            adm2: l.value
          })
        })),
        fao: countryData.faoCountries
      };
    }

    return {};
  }
);

export const getLocationData = createSelector(
  [getLocationObj, getAllLocationData, selectPolynameWhitelist],
  (location, allLocationData, polynames) => {
    if (isEmpty(allLocationData)) return null;
    const { type, adminLevel, locationLabel } = location;

    let parent = {};
    let parentData = [];
    let children = [];
    if (adminLevel === 'adm0') {
      parent = { label: 'global', value: 'global' };
      children = allLocationData.adm1;
    } else if (adminLevel === 'adm1') {
      parent = allLocationData.adm0.find(d => d.value === location.adm0);
      parentData = allLocationData.adm0;
      children = allLocationData.adm2;
    } else if (adminLevel === 'adm2') {
      parent = allLocationData.adm1.find(d => d.value === location.adm1);
      parentData = allLocationData.adm1;
    }

    const locationData = allLocationData[adminLevel] || allLocationData.adm0;
    const currentLocation =
      locationData && locationData.find(d => d.value === location[adminLevel]);

    return {
      parent,
      parentLabel: parent && parent.label,
      parentData: parentData && buildLocationDict(parentData),
      location: currentLocation,
      locationData: locationData && buildLocationDict(locationData),
      locationLabel:
        type === 'geostore' || type === 'global'
          ? lowerFirst(locationLabel)
          : currentLocation && currentLocation.label,
      childData: children && buildLocationDict(children),
      polynames,
      status: currentLocation && currentLocation.status
    };
  }
);

export const filterWidgets = createSelector(
  [
    getLocationObj,
    getLocationData,
    selectPolynameWhitelist,
    selectEmbed,
    getWdigetFromQuery,
    selectCategory,
    getActiveLayersWithDates,
    selectAnalysis
  ],
  (
    location,
    locationData,
    polynameWhitelist,
    embed,
    widget,
    category,
    layers,
    showAnalysis
  ) => {
    const { adminLevel, type } = location;

    const widgets = Object.values(allWidgets).map(w => ({
      ...w,
      colors: colors[w.colors]
    }));

    if (embed && widget) return widgets.filter(w => w.widget === widget);
    const layerIds = layers && layers.map(l => l.id);

    return sortBy(
      widgets.filter(w => {
        const {
          types,
          admins,
          whitelists,
          categories,
          source,
          datasets,
          analysis
        } =
          w || {};
        const { fao } = locationData || {};

        const layerIntersection =
          datasets &&
          intersection(flatMap(datasets.map(d => d.layers)), layerIds);
        const hasLocation =
          types &&
          types.includes(type) &&
          admins &&
          admins.includes(adminLevel);
        const adminWhitelist = whitelists && whitelists[adminLevel];
        const isFAOCountry =
          source !== 'fao' || (fao && fao.find(f => f.value === location.adm0));
        const matchesAdminWhitelist =
          !adminWhitelist || adminWhitelist.includes(location[adminLevel]);
        const matchesPolynameWhitelist =
          !whitelists ||
          !whitelists.indicators ||
          intersection(polynameWhitelist, whitelists.indicators);
        const hasCategory = !category || categories.includes(category);
        const isAnalysisWidget =
          !showAnalysis || (analysis && !isEmpty(layerIntersection));

        return (
          hasLocation &&
          matchesAdminWhitelist &&
          matchesPolynameWhitelist &&
          hasCategory &&
          isFAOCountry &&
          isAnalysisWidget
        );
      }),
      category ? `sortOrder[${category}]` : 'sortOrder.summary'
    );
  }
);

export const getWidgets = createSelector(
  [
    filterWidgets,
    getLocationObj,
    getLocationData,
    selectWidgetsData,
    selectLocationQuery,
    selectLocationSearch,
    selectNonGlobalDatasets,
    getIsTrase,
    getActiveLayersWithDates,
    selectAnalysis
  ],
  (
    widgets,
    locationObj,
    locationData,
    widgetsData,
    query,
    search,
    datasets,
    isTrase,
    layers,
    analysis
  ) => {
    if (isEmpty(widgets) || !locationObj || !locationData || !widgetsData) {
      return null;
    }

    const { locationLabelFull, type } = locationObj || {};
    const { polynames, status } = locationData || {};

    return widgets.map(w => {
      const {
        settings: defaultSettings,
        widget,
        settingsConfig,
        pendingKeys,
        title: titleTemplate,
        dataType
      } =
        w || {};
      const rawData = widgetsData && widgetsData[widget];

      const { settings: dataSettings } = rawData || {};

      const widgetLayer =
        layers &&
        layers.find(
          l =>
            w.datasets && flatMap(w.datasets.map(d => d.layers)).includes(l.id)
        );

      const { params: layerParams, decodeParams } = widgetLayer || {};
      const startDate =
        (layerParams && layerParams.startDate) ||
        (decodeParams && decodeParams.startDate);
      const startYear =
        startDate && parseInt(moment(startDate).format('YYYY'), 10);
      const endDate =
        (layerParams && layerParams.endDate) ||
        (decodeParams && decodeParams.endDate);
      const endYear = endDate && parseInt(moment(endDate).format('YYYY'), 10);

      const widgetQuerySettings = query && query[widget];

      const layerSettings = {
        ...layerParams,
        ...decodeParams,
        ...(startYear && {
          startYear
        }),
        ...(endYear && {
          endYear
        }),
        ...(!analysis && {
          ...widgetQuerySettings
        })
      };

      const mergedSettings = {
        ...defaultSettings,
        ...dataSettings,
        ...widgetQuerySettings,
        ...layerSettings
      };

      const settings = {
        ...mergedSettings,
        ...(mergedSettings.ifl === 2016 && {
          extentYear: 2010
        }),
        ...(mergedSettings.forestType === 'primary_forest' && {
          extentYear: 2000
        })
      };

      const dataOptions = rawData && rawData.options;

      const settingsConfigParsed = getSettingsConfig({
        settingsConfig,
        dataOptions,
        settings,
        polynames,
        status,
        pendingKeys
      });

      const optionsSelected =
        settingsConfigParsed && getOptionsSelected(settingsConfigParsed);

      const forestType = optionsSelected && optionsSelected.forestType;
      const landCategory = optionsSelected && optionsSelected.landCategory;
      const indicator = getIndicator(forestType, landCategory);

      const footerStatements = getStatements({
        forestType,
        landCategory,
        settings,
        datasets,
        type,
        dataType
      });

      const { ifl } = settings || {};

      const settingsConfigFiltered =
        settingsConfigParsed &&
        settingsConfigParsed.filter(
          o =>
            o.key !== 'extentYear' ||
            (ifl !== 2016 && settings.forestType !== 'primary_forest')
        );

      const props = {
        ...w,
        ...locationObj,
        ...locationData,
        data: rawData,
        settings,
        title: titleTemplate,
        settingsConfig: settingsConfigFiltered,
        optionsSelected,
        indicator,
        showAttributionLink: isTrase,
        statements: footerStatements
      };

      const parsedProps = props.getWidgetProps(props);
      const { title: parsedTitle } = parsedProps || {};
      const title = parsedTitle || titleTemplate;

      const searchObject = qs.parse(search);
      const widgetQuery = searchObject && searchObject[widget];
      const locationPath = `${window.location.href}`;
      const shareUrl = `${locationPath}#${widget}`;
      const embedUrl = `${window.location.origin}/embed${
        window.location.pathname
      }?${`widget=${widget}`}${widgetQuery ? `&${widget}=${widgetQuery}` : ''}`;

      return {
        ...props,
        ...parsedProps,
        shareUrl,
        embedUrl,
        title: title
          ? title.replace('{location}', locationLabelFull || '...')
          : ''
      };
    });
  }
);

export const getActiveWidget = createSelector(
  [getWidgets, getWdigetFromQuery, selectAnalysis],
  (widgets, activeWidgetKey, analysis) => {
    if (!widgets || analysis) return null;
    if (!activeWidgetKey) return widgets[0];
    return widgets.find(w => w.widget === activeWidgetKey);
  }
);

export const getWidgetsProps = () =>
  createStructuredSelector({
    loading: selectLoading,
    widgets: getWidgets,
    activeWidget: getActiveWidget,
    location: getLocation,
    emebd: selectEmbed,
    simple: selectSimple,
    modalClosing: selectModalClosing
  });
