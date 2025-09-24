import { useNavigate, useLocation } from 'react-router-dom';


function NavPage() {
    const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="navpage">
      <button 
      className={location.pathname === '/' ? 'active' : ''}
      onClick={() => navigate('/')}>Home</button>
      <button 
      className={location.pathname === '/illustration' ? 'active' : ''}
      onClick={() => navigate('/illustration')}>Illustrations</button>
    </nav>
  );
}

export default NavPage;
