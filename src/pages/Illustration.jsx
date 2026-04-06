import React, { useState, useEffect,} from 'react';
import { useSearchParams } from 'react-router-dom';
import ArtworkList from '../Components/ArtworkList.jsx';
import ArtworkHooks from '../Script/ArtworkHooks.js';

function Illustration() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || '';
  const pageParam = parseInt(searchParams.get("page") || '1', 10);

  const [currentPage, setCurrentPage] = useState(pageParam);
  const { posts, total, maxPage, loading, error } = ArtworkHooks({ search, currentPage:pageParam });

  useEffect(() => {
    setCurrentPage(pageParam);
    if(!loading && pageParam > maxPage){
      setSearchParams({ search: search, page: maxPage });
      setCurrentPage(maxPage);
    }
  }, [loading, pageParam, maxPage, search, setSearchParams]);

    return (
        <div className="content"> 
          
          {search ? <h2>Search: <strong>{search || '(empty)'}</strong></h2>:<h2>Illustrations</h2>}
          {(search && total > 0)&&!loading ? <p><strong>{total}</strong> artworks</p>:null}
          
          {(posts.length === 0)&&!loading ? (
            <p>No Illustrations found.</p>
          ): loading ? (
            <p className="loading">Loading...</p>
          ) : error ? (
            <p className="error">Error: {error}</p>
          ) : (
            <>
          <div className="flex">
            <ArtworkList search={search} currentPage={currentPage} />
          
            <div className='artspage'>
              <button className="btn-left"
              disabled={currentPage <= 1}
              onClick={(e) => { e.stopPropagation(); setSearchParams({ search: search, page: currentPage - 1 }); }}>
              </button>

              <span style={{ margin: "0 10px" }}>
                Page {currentPage} of {maxPage}
              </span>

              <button className='btn-right'
              onClick={(e) => { e.stopPropagation(); setSearchParams({ search: search, page: currentPage + 1 }); }} 
              disabled={currentPage === maxPage}>
              </button>
            </div>
          </div>
            </>
          
  
          )
        }
        </div>
      
    );
}

export default Illustration;
