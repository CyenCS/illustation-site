import React, { useState } from "react";
import axios from 'axios';


function SignupForm() {
  const APIURL = process.env.REACT_APP_API_URL || `https://illustation-site.onrender.com`;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault(); 
  try {
    const response = await axios.post(
      `${APIURL}/fetch/registry`, {
      name,
      password
    });

    if (response.data.success) {
      alert('Registration successful! Please log in.');
      window.location.href = '/registry';
    } else {
      setErrorMessage(response.data.message || 'Signup failed');
    }
  } catch (err) {
    console.error(err);
    setErrorMessage('Server error');
  }
};

  return (
    <form onSubmit={handleSubmit} id="signupform" className="registration">
      <h2>Sign Up</h2>
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
      <button type="submit" className="proceed">Register</button>
      {errorMessage && <p id="alert" style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
}

export default SignupForm;
