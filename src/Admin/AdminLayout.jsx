import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="sidebartext">
      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/users">Users</Link>
      <Link to="/admin/posts">Posts</Link>
      <Link to="/admin/stats">Stats</Link>
    </aside>
  );
}

export default AdminSidebar;
