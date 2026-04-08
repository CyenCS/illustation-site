import React, { useState } from "react";
import axios from 'axios';

function LoginForm() {
  const APIURL = process.env.REACT_APP_API_URL || `https://illustation-site.onrender.com`;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleSubmit
  = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post(
         `${APIURL}/fetch/login`, {
          name, password,
        }, { withCredentials: true }
      );

    if (response.data.success) {
      if (process.env.NODE_ENV === "development") { console.log('Login successful');}
      window.location.href = '/';
    } else {
      setErrorMessage('Login failed: '+response.data.message || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    const serverMessage = err.response.data.message;
    setErrorMessage(serverMessage || 'Server error');
  }
};

  return (
    <form onSubmit={handleSubmit} id="loginform" className="login">
      <h2>Login</h2>
      <div className="inputbox">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
          minLength="3"
          autoComplete="off"
          required
        />
      </div>
      <div className="inputbox">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          minLength="3"
          autoComplete="off"
          required
        />
      </div>
      <button type="submit" className="proceed">Login</button>
      {errorMessage && <p id="alert" style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
}

export default LoginForm;
