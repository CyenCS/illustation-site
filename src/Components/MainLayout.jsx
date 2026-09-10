import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebartext">
      <Link to="/" >Home</Link>
      <Link to="/illustration">Illustrations</Link>
    </div>
  );
}

export default Sidebar;