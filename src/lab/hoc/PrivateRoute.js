import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {AuthContext} from '../context/AuthContextProvider';
import { getData } from '../storage/LocalStorage/LocalAsyncStorage';
import jwt_decode from "jwt-decode";
import MainView from '../MainView';

const basicRoutes = ['/', '/doctor',  '/doctor/otp', '/doctor/registration', '/patient/otp', '/patient/registration']

const PrivateRoute = ({ component: Component, exact,  ...rest }) => {
  // console.log('rest: ', rest);

  // var token = jwt_decode(getData('ACCESS_TOKEN'));
  // const authContext = useContext(AuthContext);
  // console.log('User Is Valid', new Date(token.exp * 1000) > new Date(new Date().getTime()));

  /**
   * If the user not authenticated then redirect to login page
   */
  return (
  //   <Route {...rest} render={props =>
  //     (token &&  new Date(token.exp * 1000) >  new Date(new Date().getTime())) ?  <Component {...props} /> :
  //     authContext && !authContext.isAuthenticated  ? (
  //       authContext.phone ? <Component {...props} /> :  <Redirect to='/'/>
  //     ) :  (
  //       <Redirect to='/'/>
  //     )
  //   }
  //   />
  // );

  <Route exact {...rest} render={props =>
    basicRoutes.includes(rest.path)  ? <Component {...props} /> : (
      // <MainView>
         <Component {...props} />
      // </MainView>
      )
  }
  />
  );
};

export default PrivateRoute;
