import React, { useState, useRef, useEffect  } from 'react';
import { getAccountMenuData } from './backend';
// import '../Design/Dropdown.css';

export default function AccountMenu() {
  const displayname = localStorage.getItem('name');
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
      console.log('Dropdown toggled!');
      setShowDropdown(!showDropdown);
    };
  if (!displayname) return null;

  const { name, links } = getAccountMenuData(displayname);

  return (
    <div className="dropdown">
      {/* <a href="#" id="accname" onClick={toggleDropdown}></a> */}
      <div >
        <button
        id="accname"
        className={"transparent" + (showDropdown ? ' active' : '')}
        onClick={toggleDropdown}
        type="button"
        aria-haspopup="true"
        aria-expanded={showDropdown}
      >
        {name}
      </button>
      {showDropdown && (
        <div className="dropdown-content">
          {links.map(link => (
            <a
            href="/"
            key={link.id}
              id={link.id}
              onClick={(e) => {
                e.preventDefault();
                link.action();
              }}
            >
              {link.text}
            </a>
          ))}
        </div>
      )}

      </div>
      
    </div>
    // <div className="dropdown" ref={dropdownRef}>
    //   <button onClick={toggleDropdown} className="dropbtn">
    //     Dropdown
    //   </button>
    //   {isOpen && (
    //     <div className="dropdown-content">
    //       <a href="#link1">Link 1</a>
    //       <a href="#link2">Link 2</a>
    //       <a href="#link3">Link 3</a>
    //     </div>
    //   )}
    // </div>
  );
}
    


// function getAccountMenuData(name) {
//     const accountElement = document.getElementById('account');

//     if (accountElement) {
//         // Hide the registry link
//         const registryLink = document.getElementById('registry');
//         if (registryLink) {
//             registryLink.style.display = 'none';
//         }

//         // Create or update the dropdown
//         const existingDropdown = accountElement.querySelector('.dropdown');
//         if (!existingDropdown) {
//             const dropdown = document.createElement('div');
//             dropdown.classList.add('dropdown');

//             const dropdownContent = document.createElement('div');
//             dropdownContent.id = 'accountDropdown';
//             dropdownContent.classList.add('dropdown-content');

//             // Dropdown button (username)
//             const accountDisplay = document.createElement('a');
//             accountDisplay.textContent = name;
//             accountDisplay.href = "#";
//             accountDisplay.id = "accname";
//             accountDisplay.onclick = (event) => {
//                 event.preventDefault(); // Prevent default action
//                 dropdownContent.classList.toggle('show');
//             };
//             dropdown.appendChild(accountDisplay);
//             dropdown.appendChild(dropdownContent);

//             // Add dropdown links
//             const links = [
//                 { href: '#', id: 'profileLink', text: 'Profile' },
//                 { href: '#', id: 'logoutLink', text: 'Sign Out' },
//             ];

//             links.forEach(link => {
//                 const a = document.createElement('a');
//                 a.href = link.href;
//                 a.id = link.id;
//                 a.textContent = link.text;

//                 if (link.id === 'profileLink') {
//                     a.onclick = profile;
//                 } else if (link.id === 'logoutLink') {
//                     a.onclick = signout;
//                 }

//                 dropdownContent.appendChild(a);
//             });

//             accountElement.appendChild(dropdown);
//         }
//     }
// }