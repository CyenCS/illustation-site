import React, { useState, useEffect,} from 'react';
import { useSearchParams } from 'react-router-dom';
import ArtworkList from '../Components/ArtworkList.jsx';
import ArtworkHooks from '../Script/ArtworkHooks.js';

//Notes (keep it up to 5 lines, exculding this row of line):
//Drive everything from the URL: always read pageParam and search from useSearchParams.

function Illustration() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || '';
  const pageParam = parseInt(searchParams.get("page") || '1', 10);

  // const [total, setTotal] = useState(0);
  //  const [maxPage, setMaxPage] = useState(1);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
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
              disabled = {currentPage <= 1}
              onClick={() => setSearchParams({ search: search, page: currentPage - 1 })}>
              </button>

              <span style={{ margin: "0 10px" }}>
                Page {currentPage} of {maxPage}
              </span>

              <button className='btn-right'
              
              onClick={() => setSearchParams({ search: search, page: currentPage + 1 })} 
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



    // const fetchPosts = useCallback(
    // async (search, currentPage) => {
    //         setLoading(true); setError(null);
    //   try{
    //     const res = await axios.get(`${APIURL}/illust/illusts`, {
    //       params: {
    //         search: search || '',
    //         currentPage: currentPage || 1,
    //       }
    //     });
    //     // console.log();
    //     if (res.data?.success) {
    //         setPosts(res.data.posts);
    //         setTotal(res.data.total);
    //         setMaxPage(res.data.maxpage);
    //         setCurrentPage((prev) => Math.min(prev, res.data.maxpage)); // Adjust current page if it exceeds maxPage
    //         setError(null);
    //         setLoading(false);
    //         console.log("Fetched posts: ", res.data.posts);
    //     } else{
    //       setPosts([]);
    //       setTotal(0);
    //       setMaxPage(1);
    //       setLoading(false);
    //     }
    //   } catch (err){
    //     setPosts([]);
    //     console.error("Error fetching posts: ", err);
    //     setLoading(false);
    //   } finally{
    //     setLoading(false);
    //   }
    // }, [APIURL]);

    // useEffect(() => {
    //   fetchPosts(search, currentPage);
    // },[search, currentPage, fetchPosts]);

  //!!!!!!!!Abandoned - useSearchParams already does this kind of function by grabbing parameters from the URL
  // const handlePageChange = (direction) => {
  //   setCurrentPage((prev) => {
  //     let nextPage;
  //     if (direction === "next") {
  //       nextPage = Math.min(prev + 1, maxPage);
  //     } else {
  //       nextPage = Math.max(prev - 1, 1);
  //     }
  //     window.history.pushState({}, '', `?search=${encodeURIComponent(search)}&page=${nextPage}`);
  //     return nextPage;
  //   });
  // };