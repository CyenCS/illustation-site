import React, { useState } from "react";
import { handleFormSubmit } from "../Script/backend";

function SignupForm() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('password', password);

    handleFormSubmit(
      'http://localhost:80/Service/signup.php',
      formData,
      () => window.location.reload(),
      setErrorMessage
    );
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
