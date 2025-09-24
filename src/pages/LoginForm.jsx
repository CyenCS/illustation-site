import React, { useState } from "react";
// import { handleFormSubmit } from "../Script/backend";
import axios from 'axios'; // make sure it's imported

function LoginForm() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleSubmit //Manual Trigger
= async (e) => {
  e.preventDefault(); 
  try {
    const response = await axios.post(
      'http://localhost:3001/fetch/login', {
      name,
      password
    });

    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.user.name);
      localStorage.setItem('id', response.data.user.id);
      
      console.log('Login successful:', response.data.user.id);
      window.location.href = '/';
    } else {
      setErrorMessage(response.data.message || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    setErrorMessage('Server error');
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
