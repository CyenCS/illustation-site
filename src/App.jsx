import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import MainContent from "./Main.jsx";
import './Design/style.css';

import About from "./pages/placeholder/About.jsx";
import Product from "./pages/Product.jsx";
import Contact from "./pages/placeholder/Contact.jsx";
import Registry from "./pages/Registry.jsx";
import Upload from "./pages/Upload.jsx";
import Posts from "./pages/Posts.jsx";

// const Layout = ({ children }) => {

// }

function Layout({ children }) {
  const {pathname} = useLocation();
  const hideLayoutPaths = ["/registry"];
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
    <>
    <Router>
      <Layout>
        <Routes>
          <Route path="/*" element={<MainContent />} />{/* '/*' Catches all sub routes (Nested inside) */}
          {/* <Route path="/illustration" element={<Illustration />} /> */}
          <Route path="/upload" element={<Upload />} />
          {/* Assuming Registry is a component for user registration */}
          <Route path="registry" element={<Registry />} />
          <Route path="posts/:artid" element={<Posts />} />
          
          {/* Add more routes as needed */}

        </Routes>
      </Layout>
    </Router>
    <ToastContainer position="bottom-left" autoClose={3000} theme="light" closeOnClick />
    </>
  );
}

export default App;
