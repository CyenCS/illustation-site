// components/Navbar.js
import React, {useState} from 'react';
import { useNavigate, NavLink } from "react-router-dom";
// import '../Design/style.css';

import AccountMenu from '../Script/AccountMenu.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from "../Script/AuthContext";

function Navbar() {
   const { user, loading} = useAuthContext();
  // const isLoggedIn = !!user;
  const [search, setSearch] = useState(""); //input text state only, not the active search query
  const navigate = useNavigate();

  function onSearchSubmit(e) {
    e.preventDefault();
    const trimmed = (search || '').trim();
    if (trimmed.length > 0) {
      navigate(`/illustration?search=${encodeURIComponent(trimmed)}&page=1`);
    } else {
      navigate(`/illustration?page=1`);
    }
  }

  
 
  return (
    <nav className="navbar">
      <div className="navdiv"> 
        {/* spacing div for nav items */}
        <div className="logo">
          <NavLink to="/">IlluStation (PT)</NavLink>
        </div>
        
          <form onSubmit={onSearchSubmit} className="searchbar">
            <input value={search} onChange={(e) => setSearch(e.target.value)} 
            type="text" placeholder="Search" className="inputbox"/>
            <button type="submit" ><FontAwesomeIcon icon={faSearch} /></button>
          </form>
           
        
                <div>
          <ul id="account">
            {loading ? (
              // keep a placeholder so layout doesn't jump while auth is being verified
              <li>
                <div
                  style={{
                    display: "inline-block",
                    width: 160,
                    height: 32,
                    background: "#f0f0f0",
                    borderRadius: 4,
                  }}
                />
              </li>
            ) : user ? (
              <>
                <li>
                  <NavLink
                    to="/upload"
                    className={({ isActive }) => (isActive ? "direct highlight" : "direct")}
                  >
                    Upload
                  </NavLink>
                </li>
                <li>
                  <AccountMenu />
                </li>
              </>
            ) : (
              <li>
                <NavLink to="/registry" id="registry">
                  Registry
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        
      </div>
    </nav>
  );
}

export default Navbar;
