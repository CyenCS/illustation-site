import { useNavigate, useLocation, NavLink } from 'react-router-dom';


function NavPage() {
    const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="navpage">
      <NavLink className={location.pathname === '/' ? 'active' : ''} to="/" end>Home</NavLink>
      <NavLink className={location.pathname === '/illustration' ? 'active' : ''} to="/illustration">
      Illustrations</NavLink>
    </nav>
  );
}

export default NavPage;
