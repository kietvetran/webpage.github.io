import {readCookie} from '../components/common/General';
import axios from 'axios';

export const baseUrl = '/api/';
// export const baseUrl = 'http://localhost:8081/';
const CancelToken = axios.CancelToken;

function getClient() {
  return axios.create({
    'baseURL': '',
    'headers': { 
      'CSRF-Token'  : readCookie('csurf') || '',
      'Content-Type': 'application/json'
    }
  });
}

function mapResponse(data) {
  if (data.stack) {
    return {
      'error'       : true,
      'errorMessage': data.message
    };
  }

  if (data.status !== 200) {
    return {
      'error'       : true,
      'errorMessage': data.response.data.error,
      'statusCode'  : data.response.status
    };
  }
  return data.data;
}

export function get(url, holder) {
  return getClient().get(baseUrl + url, {
    'cancelToken': new CancelToken(function executor(c) {
      if ( holder ) { holder.cancel = c; }
    })
  }).then(response => mapResponse(response))
    .catch(response => mapResponse(response));
}

export function post(url, data, holder) {
  return getClient().post(baseUrl + url, data, {
    'cancelToken': new CancelToken(function executor(c) {
      if ( holder ) { holder.cancel = c; }
    })
  }).then(response => mapResponse(response))
    .catch(response => mapResponse(response));
}
