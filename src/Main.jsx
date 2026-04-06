import { Routes, Route } from 'react-router-dom';
import NavPage from './Components/NavPage.jsx';
import Home from './pages/Home.jsx';
import Illustration from './pages/Illustration.jsx';


function MainContent() {
  
  return (
    <div>
      
        <div>
      <NavPage/>
      <Routes>
          <Route index element={<Home />} />
          <Route path="illustration" element={<Illustration />} />
        </Routes>
      </div>
      </div>

  );
}

export default MainContent;
