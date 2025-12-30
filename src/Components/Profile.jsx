import { useParams} from 'react-router-dom';
import React, {useEffect, useState} from "react";
// import { Insert } from "./placeholder/Insert.jsx"; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ArtworkHooks from '../Script/ArtworkHooks';
import ArtworkList from '../Components/ArtworkList.jsx';
import { useAuthContext } from '../Script/AuthContext.jsx';
const APIURL = process.env.REACT_APP_API_URL || "https://illustation-site.onrender.com";


function Profile(){
    const { userid: profileId } = useParams(); // Profile userid from URL
    const { user } = useAuthContext();// Logged in user info
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOwner, setIsOwner] = useState(false);

    // const search = searchParams.get("search") || '';
    const pageParam = parseInt(searchParams.get("page") || '1', 10);
    const [currentPage, setCurrentPage] = useState(pageParam);
      
    useEffect(() => {
        setCurrentPage(pageParam);
    }, [pageParam]);

    useEffect(() => {
  if (!profileId) return setIsOwner(false);

  setIsOwner(String(user?.userid) === String(profileId));

  // axios.get(`${APIURL}/fetch/auth/me`, { withCredentials: true })
  //   .then(res => {
  //     if (res.data?.success && res.data.user?.userid) {
  //       setIsOwner(String(res.data.user.userid) === String(userid));
  //     } else {
  //       setIsOwner(false);
  //     }
  //   })
  //   .catch(() => setIsOwner(false));
}, [profileId]);

    const { posts, total, artistname, maxPage, loading, error, message } = ArtworkHooks(
        {
            search: null,
            currentPage:pageParam, 
            profileid: profileId
        });

    return(
        <div className="content">
            
          {(!error && posts.length === 0)&& !loading && profileId ? (
            <p>No Illustrations found.</p>
          ): loading ? (
            <p className='loading'>Loading...</p>
          ) : error &&!loading ? (
            <p className='error'>Error: {error}</p>
          ) : (
          <div>
            <h2>{artistname}</h2>
            
            <p>This is a placeholder for {isOwner ? "your" : "this user's"} profile page.</p>
            {(profileId && total > 0)&&!loading ? <p>Found: <strong>{total}</strong> artworks</p>:null}
            <ArtworkList profileid={profileId} currentPage={currentPage} />
            <div className='artspage'>
              <button className="btn-left"
              disabled = {currentPage <= 1}
              onClick={() => setSearchParams({page: currentPage - 1 })}>
              </button>

              <span style={{ margin: "0 10px" }}>
                Page {currentPage} of {maxPage}
              </span>

              <button className="btn-right"
              
              onClick={() => setSearchParams({ page: currentPage + 1 })} 
              disabled={currentPage === maxPage}>
              </button>
            </div>
          </div>
  
          )
        }
        </div>
    );
}

export default Profile;