// components/MainContent.js

import { Routes, Route } from 'react-router-dom';
import NavPage from './Components/NavPage.jsx';
import Home from './pages/Home.jsx';
import Illustration from './pages/Illustration.jsx';


function MainContent() {
  // const [category, setCategory] = useState("Home");
  
  return (
    <div>
      <div className="content"> 
        <div>
      <NavPage/>
      <Routes> {/* Nested routing for Home and Illustration*/}
          <Route index element={<Home />} />
          <Route path="illustration" element={<Illustration />} />
        </Routes>
      </div>
      </div>
      </div>

  );
}

export default MainContent;
