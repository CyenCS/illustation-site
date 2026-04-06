import { useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import { useSearchParams } from 'react-router-dom';
import ArtworkHooks from '../Script/ArtworkHooks';
import ArtworkList from '../Components/ArtworkList.jsx';
import { useAuthContext } from '../Script/AuthContext.jsx';


function Profile(){
    const { userid: profileId } = useParams();
    const { user } = useAuthContext();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOwner, setIsOwner] = useState(false);

    const pageParam = parseInt(searchParams.get("page") || '1', 10);
    const [currentPage, setCurrentPage] = useState(pageParam);
      
      

    useEffect(() => {
  if (!profileId) return setIsOwner(false);

  setIsOwner(String(user?.userid) === String(profileId));

}, [profileId, user]);

    const { posts, total, artistname, maxPage, loading, error,} = ArtworkHooks(
        {
            search: null,
            currentPage:pageParam, 
            profileid: profileId
        });
    
    useEffect(() => {
        setCurrentPage(pageParam);
        if(!loading && pageParam > maxPage){
          setSearchParams({ page: maxPage });
          setCurrentPage(maxPage);
        }
    }, [loading, pageParam, maxPage, setSearchParams]);

    return(
        <div className="content">
            
          {(!error && posts.length === 0)&& !loading && profileId ? (
            <p>No Illustrations found.</p>
          ): loading ? (
            <p className='loading'>Loading...</p>
          ) : error &&!loading ? (
            <p className='error'>Error: {error}</p>
          ) : (
          <div className='flex'>
          <div>
            <h2>{artistname}</h2>
            
            <p>This is {isOwner ? "your" : "this user's"} profile page.</p>
            {(profileId && total > 0)&&!loading ? <p>Found: <strong>{total}</strong> artworks</p>:null}
            <ArtworkList profileid={profileId} currentPage={currentPage} />
          </div> 
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