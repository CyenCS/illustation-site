import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <Link to="/admin">Dashboard</Link>
      <Link to="/admin/users">Users</Link>
      <Link to="/admin/posts">Posts</Link>
    </aside>
  );
}

export default AdminSidebar;
