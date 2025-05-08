// // components/Navbar.js
// import React from 'react';

// function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="navdiv">
//         <div className="logo">
//           <a href="home.html">CodingNinja</a>
//         </div>
//         <ul>
//           <li><a href="about.html" className="direct">About</a></li>
//           <li><a href="product.html" className="direct">Products</a></li>
//           <li><a href="contact.html" className="direct">Contact</a></li>
//           <li id="account">
//             <a href="registry.html" id="registry">Registry</a>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


// components/Navbar.js
import React, {useState} from 'react';
import { NavLink } from "react-router-dom";
import '../Design/style.css';
import AccountMenu from '../Script/AccountMenu.jsx';

function Navbar() {

  const isLoggedIn = !!localStorage.getItem('username'); //!! => boolean check
 
  return (
    <nav className="navbar">
      <div className="navdiv">
        <div className="logo">
          <NavLink to="/">my-web</NavLink>
        </div>
        <ul>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? "direct highlight" : "direct"}>About</NavLink></li>
          <li><NavLink to="/product" className={({ isActive }) => isActive ? "direct highlight" : "direct"}>Products</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? "direct highlight" : "direct"}>Contact</NavLink></li>
          <li id="account">
            {isLoggedIn ? <AccountMenu /> :
            <NavLink to="/registry" id="registry">Registry</NavLink>}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
