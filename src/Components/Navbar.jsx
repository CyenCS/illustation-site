// components/Navbar.js
import React, {useState} from 'react';
import { useNavigate, NavLink } from "react-router-dom";
// import '../Design/style.css';

import AccountMenu from '../Script/AccountMenu.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Navbar() {

  const isLoggedIn = !!localStorage.getItem('name'); //!! => boolean check
  const [searchText, setSearchText] = useState(""); //input text state only, not the active search query
  const navigate = useNavigate();

  function onSearchSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchText.trim()) {
      params.append("search", searchText.trim());
    }
     params.set('page', '1'); // start at page 1 for new searches
    navigate(`/illustration?${params.toString()}`);
  }
 
  return (
    <nav className="navbar">
      <div className="navdiv">
        <div className="logo">
          <NavLink to="/">IlluStation</NavLink>
        </div>
        
          <form onSubmit={onSearchSubmit} className="searchbar">
            <input value={searchText} onChange={(e) => setSearchText(e.target.value)} 
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
