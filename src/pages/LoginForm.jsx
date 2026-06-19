import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Script/AuthContext";


function LoginForm() {
  const APIURL = process.env.REACT_APP_API_URL || `http://localhost:5000`; // ||;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 
  const { setUser } = useAuthContext();

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
  if (process.env.FRONT_DEBUG === 'true') {
    console.log('Login successful: ', response.data.user);
  }
      setUser(response.data.user);
      navigate('/');
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
