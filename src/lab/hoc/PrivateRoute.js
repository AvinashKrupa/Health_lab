import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from '../context/AuthContextProvider';
import { getData } from '../storage/LocalStorage/LocalAsyncStorage';
import jwt_decode from "jwt-decode";
import MainView from '../MainView';

const basicRoutes = ['/', '/otp']

const PrivateRoute = ({component: Component, exact, ...rest}) => {
  /**
   * If the user not authenticated then redirect to login page
   */
  return (
      <Route exact {...rest} render={props =>
          basicRoutes.includes(rest.path) ? <Component {...props} /> : (
              <Component {...props} />
          )
      }
      />
  );
};

export default PrivateRoute;
