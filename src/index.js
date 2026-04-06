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

reportWebVitals();

axios.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    const message = err.response?.data?.message;
    if (status === 401 && message && message.toLowerCase().includes('expired')) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);
