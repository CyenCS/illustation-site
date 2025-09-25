import React, { useState, useEffect, useCallback, use } from 'react';
import Recommendation from '../Components/Recommendation.jsx';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function Illustration() {
  // const location = useLocation();
  // const params = new URLSearchParams(location.search);
  // // const initialKeyword = params.get("search") || '';
  // const initialPage = parseInt(params.get("page"), 10) || 1;
  //... to do: Add search functionality


  // const [activeKeyword, setActiveKeyword] = useState(initialKeyword);
  const [posts, setPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || '';
  const pageParam = parseInt(searchParams.get("page") || '1', 10);

  const [total, setTotal] = useState(0);
   const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(pageParam);

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

    const fetchPosts = useCallback(
    async (search, currentPage) => {
            setLoading(true); setError(null);
      try{
        const res = await axios.get(`http://localhost:3001/illust/illusts`, {
          params: {
            search: search || '',
            currentPage: currentPage || 1,
          }
        });
        if (res.data?.success) {
            setPosts(res.data.posts);
            setTotal(res.data.total);
            setMaxPage(res.data.maxpage);
            setCurrentPage((prev) => Math.min(prev, res.data.maxpage)); // Adjust current page if it exceeds maxPage
            setError(null);
            setLoading(false);
            console.log("Fetched posts: ", res.data.posts);
        } else{
          setPosts([]);
          setTotal(0);
          setMaxPage(1);
          setLoading(false);
        }
      } catch (err){
        setPosts([]);
        console.error("Error fetching posts: ", err);
        setLoading(false);
      } finally{
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchPosts(search, currentPage);
    },[search, currentPage, fetchPosts]);

  //!!!!!!!!Abandoned - useSearchParams already does this kind of function
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

    if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

    return (
      <div>
        <div> 
          <h2>Illustrations</h2>
          {search ? <p>Search: <strong>{search || '(empty)'}</strong></p>:null}
          {search && total > 0 ? <p>Found: <strong>{total}</strong> artworks</p>:null}
          
          {posts.length === 0 ? (
            <p>No illustrations found.</p>
          ): (
            <div>
            <div style={{display: "flex", flexWrap: "wrap", gap: "50px", placeItems: "center"}}>
            {posts.map((post) => (
              <Link key={post.artid} to={`/posts/${post.artid}`} className="thumbnail-link">
              <div>
                {post.firstImage && (
                  <img style={{width: "170px", height: "170px", objectFit: "cover"}}
                  src={`http://localhost:3001/${post.firstImage}`}
                  alt={post.title}
                  className="thumbnail"
              />
            )}
          <h3>{truncateText(post.title, 16)}</h3>
        <p>by {post.username}</p>
        </div>
              </Link>
        ))}
  </div>
  <div style={{ marginTop: 20 }}>
              <button 
              disabled = {currentPage <= 1}
              onClick={() => setSearchParams({ search: search, page: currentPage - 1 })}>
                Previous
              </button>

              <span style={{ margin: "0 10px" }}>
                Page {currentPage} of {maxPage}
              </span>

              <button 
              
              onClick={() => setSearchParams({ search: search, page: currentPage + 1 })} 
              disabled={currentPage === maxPage}>
                Next
              </button>
            </div>
  </div>
  
          )
        }

      </div>
        </div>
    );
}

export default Illustration;