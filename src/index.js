import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  //* </React.StrictMode> */}
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

axios.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    const message = err.response?.data?.message;
    if (status === 401 && message && message.toLowerCase().includes('expired')) {
      // token expired -> clear saved token and redirect to login
      localStorage.removeItem('token');
      // optional: show message to user
      window.location.href = '/registry'; // or your login route
    }
    return Promise.reject(err);
  }
);
