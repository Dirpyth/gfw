import {
  AREA_HA,
  ALERT_COUNT,
  GLAD_ALERTS_ISO_WEEK,
  TREE_COVER_LOSS_YEAR,
  TREE_COVER_DENSITY
} from 'data/layers-v2';

export default {
  loss: {
    sum: [AREA_HA],
    groupBy: [TREE_COVER_LOSS_YEAR],
    filters: [TREE_COVER_DENSITY]
  },
  areaHa: {
    sum: [AREA_HA]
  },
  extent: {
    sum: [AREA_HA],
    filters: [TREE_COVER_DENSITY]
  },
  gladAlerts: {
    sum: [AREA_HA, ALERT_COUNT],
    groupBy: [GLAD_ALERTS_ISO_WEEK]
  }
};
