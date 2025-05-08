import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import MainContent from "./pages/MainContent.jsx";
import './Design/style.css';
import About from "./pages/About.jsx";
import Product from "./pages/Product.jsx";
import Contact from "./pages/Contact.jsx";
import Registry from "./pages/Registry.jsx";

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
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/about" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/registry" element={<Registry />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
