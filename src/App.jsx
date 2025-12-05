import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import MainContent from "./Main.jsx";
import './Design/style.css';

import Registry from "./pages/Registry.jsx";
import Upload from "./pages/Upload.jsx";
import Posts from "./pages/Posts.jsx";
import Profile from "./pages/Profile.jsx";
import { AuthProvider } from "./Script/AuthContext.jsx";

// const Layout = ({ children }) => {

// }

function Layout({ children }) { //Global layout wrapper
  const {pathname} = useLocation();
  const hideLayoutPaths = ["/registry"]; //Hides Navbar and Footer when on /registry
  const shouldHideLayout = hideLayoutPaths.includes(pathname);
  return(
    <>
    {!shouldHideLayout && <Navbar />}
    {children}
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
          <Route path="/*" element={<MainContent />} />{/* '/*' Catches all sub routes (Nested inside) */}
          {/* Key: Changes the componenets especially within the same place */}
          <Route path="/upload" element={<Upload key="upload"/>} />
          <Route path="/posts/:artid/edit" element={<Upload key="edit"/>} />
          {/* Assuming Registry is a component for user registration */}
          <Route path="/registry" element={<Registry />} />
          <Route path="/posts/:artid" element={<Posts />} />
          <Route path="/profile/:userid" element={<Profile />} />
          
          {/* Add more routes as needed */}

        </Routes>
      </Layout>
    </Router>
    <ToastContainer position="bottom-left" autoClose={3000} theme="light" closeOnClick />
    </AuthProvider>
  );
}

export default App;
