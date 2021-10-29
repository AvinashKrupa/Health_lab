import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import index from './lab/styles/index';
import {AuthContextProvider} from './lab/context/AuthContextProvider';
import { ToastProvider } from 'react-toast-notifications';
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.render(
    <React.StrictMode>
        <AuthContextProvider>
            <ToastProvider autoDismiss={true}>
                <App />
            </ToastProvider>
        </AuthContextProvider>
    </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
