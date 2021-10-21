import React, { Component, createContext } from 'react';

const AuthContext = createContext();

class AuthContextProvider extends Component {
  state = {
    email: '',
  }

  setEmail = (email) => {
    this.setState({ email });
  }

  render() {
    return (
      <AuthContext.Provider value={{...this.state, setEmail: this.setEmail}}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export  {AuthContextProvider, AuthContext};
