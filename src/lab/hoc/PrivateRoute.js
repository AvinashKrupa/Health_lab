import React from 'react';
import {Route} from 'react-router-dom';

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
