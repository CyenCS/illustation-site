import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import MainContent from "./Main.jsx";
import './Design/style.css';

import Registry from "./pages/Registry.jsx";
import Upload from "./pages/Upload.jsx";
import Posts from "./pages/Posts.jsx";
import Profile from "./Components/Profile.jsx";
import { AuthProvider } from "./Script/AuthContext.jsx";


function Layout({ children }) { //Global layout wrapper
  const {pathname} = useLocation();
  const hideLayoutPaths = ["/registry"];
  const shouldHideLayout = hideLayoutPaths.includes(pathname);
  return(
    <>
    {!shouldHideLayout && <Navbar />}
    <div className="content"> {children}</div>
    {!shouldHideLayout && <Footer />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
    <Router>
      <Layout>
        <Routes>
          <Route path="/*" element={<MainContent />} />
          <Route path="/upload" element={<Upload/>} />
          <Route path="/posts/:artid/editfetch" element={<Upload/>} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/posts/:artid" element={<Posts />} />
          <Route path="/profile/:userid" element={<Profile/>} />
        </Routes>
      </Layout>
    </Router>
    </AuthProvider>
  );
}

export default App;
