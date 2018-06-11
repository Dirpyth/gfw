import axios from 'axios';
import find from 'lodash/find';
import moment from 'moment';
import { getKey, addKey } from 'services/cache';
import CACHE_EXCEPTIONS from 'data/cache-exceptions.json';

const EXPIRE_DEFAULT = 86400;

const request = {
  get(url, expire = EXPIRE_DEFAULT, exceptionId = null) {
    const key = btoa(url);
    return axios.get(`/cache/${key}`).then(cache => {
      const { data } = cache;
      if (!data) {
        const axiosInstance = axios.create();
        const haveException = checkException(exceptionId);
        if (!haveException) {
          axiosInstance.interceptors.response.use(response =>
            addKey(key, response.data, expire, exceptionId)
              .then(() => response)
              .catch(() => response)
          );
        }
        return axiosInstance.get(url);
      }
      return getKey(key);
    });
  }
};

const checkException = exceptionId => {
  const exception = find(CACHE_EXCEPTIONS, item => item.id === exceptionId);
  let haveException = false;
  if (exception && exception.type === 'excludeWeekDay') {
    haveException = exception.data.indexOf(moment().day()) !== -1;
  }

  return haveException;
};

export default request;
