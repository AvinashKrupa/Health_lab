import React, { Component, createContext } from 'react';

const AuthContext = createContext();

class AuthContextProvider extends Component {
  state = {
    isAuthenticated: false,
    email: '',
    type: '3',
  }

  setAuth = (isAuthenticated) => {
    this.setState({ isAuthenticated });
  }

  setEmail = (email) => {
    this.setState({ email });
  }

  setType = (type) => {
    this.setState({ type });
  }

  render() {
    console.info('amit AuthContextProvider :', this.state);
    return (
      <AuthContext.Provider value={{...this.state, setAuth: this.setAuth, setEmail: this.setEmail}}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export  {AuthContextProvider, AuthContext};
