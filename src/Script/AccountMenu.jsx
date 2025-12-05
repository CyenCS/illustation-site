import { useState,} from 'react';
import { getAccountMenuData } from './backend';
import { useAuthContext } from "../Script/AuthContext";

export default function AccountMenu() {
  const { user } = useAuthContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
      console.log('Dropdown toggled!');
      setShowDropdown(!showDropdown);
    };
  if (!user.username) return null;

  const { name, links } = getAccountMenuData(user.username);

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