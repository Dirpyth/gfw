import request from 'utils/request';

const REQUEST_URL = `${process.env.RESOURCE_WATCH_API}`;

export const getDatasetsProvider = () =>
  request.get(
    `${
      REQUEST_URL
    }/dataset?application=gfw&includes=metadata,vocabulary,layer&page[size]=9999&hash=4233131321312321312321213`
  );
