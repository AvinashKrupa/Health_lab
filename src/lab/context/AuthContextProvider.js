import React, { Component, createContext } from 'react';

const AuthContext = createContext();

class AuthContextProvider extends Component {
  state = {
    isAuthenticated: false,
    phone: '',
    type: '1',
  }

  setAuth = (isAuthenticated) => {
    this.setState({ isAuthenticated });
  }

  setPhone = (phone) => {
    this.setState({ phone });
  }

  setType = (type) => {
    this.setState({ type });
  }

  render() { 
    return (
      <AuthContext.Provider value={{...this.state, setAuth: this.setAuth, setPhone: this.setPhone}}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
 
export  {AuthContextProvider, AuthContext};