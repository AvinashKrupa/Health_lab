import instance from './Interceptor';
import qs from 'qs';

export const API = {
  /**
   * Lab related APIS
   */
  LOGIN: 'auth/login',
  SEARCH_PATIENTS_API: 'lab/getAppointments',
  LOGOUT: 'auth/logout',
  GET_DEPARTMENTS: 'departments',
  UPLOAD_REPORT: 'lab/uploadReport',
};

export function post(endPoint, params, isStringfy = true) {
  return instance.post(
      endPoint,
      params && (isStringfy ? JSON.stringify(params) : qs.stringify(params)),
  );
}

export function get(endPoint) {
  return instance.get(endPoint);
}

export function deleteCall(endPoint) {
  return instance.delete(endPoint);
}

export function putCall(endPoint, params) {
  return instance.put(endPoint, params);
}
