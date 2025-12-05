// src/Script/AccountMenu.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../Script/AuthContext";

export default function AccountMenu() {
  const { user, logout } = useAuthContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  if (!user || !user.username) return null;

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const onProfile = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    alert('Navigating to Profile...');
    // navigate('/profile');
  };

  const onSignOut = async (e) => {
    e.preventDefault();
    setShowDropdown(false);
    await logout(); // calls server logout and sets user=null in context
    navigate('/');  // optional: go to homepage after logout
  };

  return (
    <div className="dropdown">
      <button
        id="accname"
        className={"transparent" + (showDropdown ? ' active' : '')}
        onClick={toggleDropdown}
        type="button"
        aria-haspopup="true"
        aria-expanded={showDropdown}
      >
        {user.username}
      </button>

      {showDropdown && (
        <div className="dropdown-content">
          <a href="/" onClick={onProfile}>Profile</a>
          <a href="/" onClick={onSignOut}>Sign Out</a>
        </div>
      )}
    </div>
  );
}