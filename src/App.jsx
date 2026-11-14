import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";

import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import MainContent from "./Main.jsx";
import "./Design/style.css";
import "./Design/sidebar.css";

import Registry from "./pages/Registry.jsx";
import Upload from "./pages/Upload.jsx";
import Posts from "./pages/Posts.jsx";
import Profile from "./pages/Profile.jsx";
import { AuthProvider, useAuthContext } from "./Script/AuthContext.jsx";
import Sidebar from "./Components/MainLayout.jsx";
import AdminSidebar from "./Admin/AdminLayout.jsx";
import AdminDashboard from "./Admin/dashboard.jsx";

function RequireLogin() {
  const { user, loading } = useAuthContext();

  if (loading) return <div>Checking login...</div>;
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />;
}

function RequireAdmin() {
  const { user, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>;
  if (!user || user.userrole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function Layout({ children }) {
  const location = useLocation();
  const { user } = useAuthContext();
  const [sidebar, setSidebar] = useState(false);

  const shouldHideLayout = location.pathname === "/registry";
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAdminUser = user?.userrole === "admin";
  const SidebarComponent = isAdminPage && isAdminUser ? AdminSidebar : Sidebar;

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      {!shouldHideLayout && (
        <Navbar onToggleSidebar={() => setSidebar((v) => !v)} />
      )}


        <div className="page-layout">
          <div className={sidebar ? 'sidebar active' : 'sidebar'}>
            <SidebarComponent />
          </div>

          <main className={`content ${sidebar ? 'sidebar-open' : ''}`}>{children}</main>
        </div>


      {!shouldHideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/*" element={<MainContent />} />
            <Route element={<RequireLogin />}>
              <Route path="/upload" element={<Upload />} />
              <Route path="/posts/:artid/edit" element={<Upload />} />
            </Route>
            <Route path="/registry" element={<Registry />} />
            <Route path="/posts/:artid" element={<Posts />} />
            <Route path="/profile/:userid" element={<Profile />} />
            <Route element={<RequireAdmin />}> 
               <Route path="/admin" element={<AdminDashboard/>} /> 
               {/* <AdminDashboard/> */}
               <Route path="/admin/users" element={<div>Admin Users</div>} />
               <Route path="/admin/posts" element={<div>Admin Posts</div>} />
               <Route path="/admin/stats" element={<div>Admin Stats</div>} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;