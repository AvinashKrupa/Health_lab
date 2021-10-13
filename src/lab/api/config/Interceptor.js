import axios from 'axios';
import {getData, storeData} from '../../storage/LocalStorage/LocalAsyncStorage';
import Constants from '../../constants/index.js';
import jwt_decode from "jwt-decode";

const requestMap = [];
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: Constants.BASE_URL,
});

// Add a request interceptor

instance.interceptors.request.use(
  async config => {
    const token = getData('ACCESS_TOKEN');
    const temp =  getData('TEMP_TOKEN');
    console.log('CONSOL', config);
    if (temp) {
      config.headers['Authorization'] = 'Bearer ' + temp;
    }
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    config.headers['timezone'] = 'Asia/Calcutta';
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

//Add a response interceptor

instance.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data && response.data.data && response.data.data.session) {
        const token = jwt_decode(response.data.data.session.access_token);
        storeData('ACCESS_TOKEN', response.data.data.session.access_token);
        storeData('REFRESH_TOKEN', response.data.data.session.refresh_token);
        storeData('USER_TYPE', token.selected_profile);

      }
    }
    return response;
  },

  function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest.url === 'Constants.BASE_URL'
    ) {
      //  router.push('/login');
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      requestMap.push(originalRequest);
      originalRequest._retry = true;
      const headers = {
        'Content-Type': 'application/json',
      };

      const refresh_token =  getData('REFRESH_TOKEN');
      headers['Authorization'] = 'Bearer ' + refresh_token;

       return axios
        .post(
          Constants.BASE_URL + 'auth/refreshAccessToken',
          JSON.stringify({refresh_token : refresh_token}),
          {headers: headers},
        )
        .then(res => {
          console.log('res: ', res);
          if (res.status === 200) {
            storeData('ACCESS_TOKEN', res.data.data.access_token);
            storeData('REFRESH_TOKEN', res.data.data.refresh_token);
            const token = jwt_decode(res.data.data.access_token);
            storeData('USER_TYPE', token.selected_profile);
            originalRequest.headers['Authorization'] =
              'Bearer ' + res.data.data.access_token;
              window.location.reload(true);
            // return axios(originalRequest);
          }
        }).catch(function (error) {
          const type = getData('USER_TYPE');
          type === '1' ? window.location.href="/" : window.location.href="/doctor";
        })
    }
    return Promise.reject(error);
  },
);
export default instance;
