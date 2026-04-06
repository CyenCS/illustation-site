import React, { useState } from 'react';
import { useAuthContext } from "../Script/AuthContext";
import { Link } from 'react-router-dom';

export default function AccountMenu() {
  const { user, logout } = useAuthContext();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user || !user.username) return null;

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const onSignOut = async (e) => {
    e.preventDefault();
    setShowDropdown(false);
    await logout();
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
         <Link to={`/profile/${user.userid}`} onClick={() => setShowDropdown(false)}> Profile </Link>
         <Link onClick={onSignOut}> Sign Out </Link>
        </div>
      )}
    </div>
  );
}