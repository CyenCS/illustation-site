import {useState, useEffect} from 'react';
import '../Design/dashboard.css';

import { useNavigate } from 'react-router-dom';
import { useAuthContext } from "../Script/AuthContext.jsx";
import { Link } from 'react-router-dom';
import axios from 'axios';

import ArtworkLineChart from './weeklyartwork';
import RegistryBarChart from './weeklyregistry';
import WeeklyStats from './weeklystats';
import WeeklyRecent from './weeklyrecent.jsx';


              

function AdminDashboard() {
  const navigate = useNavigate();
  const { user} = useAuthContext();

  const APIURL = process.env.REACT_APP_API_URL;
   const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtworks: 0,
    newUsers: 0,
    newArtworks: 0,
  });
  const [userActivity, setUserActivity] = useState([]);
  const [artworkActivity, setArtworkActivity] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentArtworks, setRecentArtworks] = useState([]);

  useEffect(() => {
    if (!user || user.userrole !== "admin") {
      navigate("/"); // Redirect to home if not admin
      return;
    }
    setLoading(true);
    setNotFound(false);
    axios.get(`${APIURL}/admin/dashboard`, { withCredentials: true })
    .then(res=>{
      console.log("Response:", res.data);
      if (res.data.success) {
        setStats(res.data.stats);
        setUserActivity(res.data.userActivity);
        setArtworkActivity(res.data.artworkActivity);
        setRecentUsers(res.data.recentUsers);
        setRecentArtworks(res.data.recentArtworks);
      }
    })
    .catch(err => {
      if (err.response?.status === 404) {
        setNotFound(true);
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }, [APIURL, user, navigate]);

  let template;

  if (!notFound && loading){
    template = <div className="loading"><p>Loading...</p></div>;
  } else if (notFound) {
  template = <div className="error"><p>Page Not Found</p></div>;
} else if (!notFound && !loading) {
  template = <div>
      <div className="dashboard-stats">
        <WeeklyStats stats={stats}/>
      </div>
      <div className="dashboard-graphs">
        <RegistryBarChart />
        <ArtworkLineChart />
      </div>

      <div className="dashboard-datalist">
        <WeeklyRecent />
      </div>
    </div>
}
else{
  template = <div className="error">Unknown Error</div>;
}

  return (
    <> {template}  </>
  );
}

export default AdminDashboard;