import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import '../Design/registry.css';
import { NavLink } from "react-router-dom";

function Registry() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <main className="registry-page-container">
      <div className="registry-page">
        <h1>ILLUSTATION</h1>
        <NavLink to="/"><p>Click here to go back</p></NavLink>
        {showLogin ? (
          <LoginForm />
        ) : (
          <SignupForm />
        )}
        <p className="message"></p>
          <button type="button" className="switch" onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? "Create account now" : "Back to Sign In"}
          </button>
        
      </div>
    </main>
  );
}

export default Registry;