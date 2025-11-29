// components/Navbar.js
import React, {useState} from 'react';
import { useNavigate, NavLink } from "react-router-dom";
// import '../Design/style.css';

import AccountMenu from '../Script/AccountMenu.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Navbar() {

  const isLoggedIn = !!localStorage.getItem('name'); //!! => boolean check
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
          {/* <li><NavLink to="/about" className={({ isActive }) => isActive ? "direct highlight" : "direct"}>About</NavLink></li>
          <li><NavLink to="/product" className={({ isActive }) => isActive ? "direct highlight" : "direct"}>Products</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? "direct highlight" : "direct"}>Contact</NavLink></li> */}
          {isLoggedIn ? 
          <>
            <li><NavLink to="/upload" className={({ isActive }) => isActive ? "direct highlight" : "direct"}>Upload</NavLink></li>
            <li><AccountMenu /></li>
          </>
          :
           <li >
            {isLoggedIn ? <AccountMenu /> :
            <NavLink to="/registry" id="registry">Registry</NavLink>}
          </li>}
          
        </ul>
        </div>
        
      </div>
    </nav>
  );
}

export default Navbar;
