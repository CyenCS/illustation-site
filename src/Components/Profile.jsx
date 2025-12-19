import { useParams} from 'react-router-dom';
import React, {useEffect, useState} from "react";
// import { Insert } from "./placeholder/Insert.jsx"; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ArtworkHooks from '../Script/ArtworkHooks';
import ArtworkList from '../Components/ArtworkList.jsx';

function Profile(){
    const { userid } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // const search = searchParams.get("search") || '';
    const pageParam = parseInt(searchParams.get("page") || '1', 10);
    const [currentPage, setCurrentPage] = useState(pageParam);
      
    useEffect(() => {
        setCurrentPage(pageParam);
    }, [pageParam]);

    const { posts, total, artistname, maxPage, loading, error } = ArtworkHooks(
        {
            search: null,
            currentPage:pageParam, 
            profileid: userid
        });

    return(
        <div className="content">
            <h2>{artistname || `User ${userid}`}</h2>
            <p>This is a placeholder for the profile page.</p>
            {(userid && total > 0)&&!loading ? <p>Found: <strong>{total}</strong> artworks</p>:null}
            {(posts.length === 0)&&!loading ? (
            <p>No Illustrations found.</p>
          ): loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className='error'>Error: {error}</p>
          ) : (
          <div>
            <ArtworkList profileid={userid} currentPage={currentPage} />
            <div className='artspage'>
              <button 
              disabled = {currentPage <= 1}
              onClick={() => setSearchParams({page: currentPage - 1 })}>
                Previous
              </button>

              <span style={{ margin: "0 10px" }}>
                Page {currentPage} of {maxPage}
              </span>

              <button 
              
              onClick={() => setSearchParams({ page: currentPage + 1 })} 
              disabled={currentPage === maxPage}>
                Next
              </button>
            </div>
          </div>
  
          )
        }
        </div>
    );
}

export default Profile;