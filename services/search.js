import request from 'utils/request';

export const getSearchQuery = ({ query, page }) =>
  request.get('https://www.googleapis.com/customsearch/v1', {
    params: {
      key: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY,
      cx: process.env.NEXT_PUBLIC_GOOGLE_CUSTOM_SEARCH_CX,
      q: query,
      start: page || 1,
      filter: 0,
    },
  });
