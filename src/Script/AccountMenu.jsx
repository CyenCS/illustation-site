import { useState,} from 'react';
import { getAccountMenuData } from './backend';

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
  );
}