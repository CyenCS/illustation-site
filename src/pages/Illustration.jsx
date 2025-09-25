import React, { useState, useEffect, useCallback } from 'react';
import Recommendation from '../Components/Recommendation.jsx';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function Illustration() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialKeyword = params.get("search") || '';
  const initialPage = parseInt(params.get("page"), 10) || 1;
  //... to do: Add search functionality


  const [activeKeyword, setActiveKeyword] = useState(initialKeyword);
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
   const [maxPage, setMaxPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  

    const fetchPosts = useCallback(
    async (keyword) => {
      try{
        const res = await axios.get(`http://localhost:3001/illust/illusts`, {
          params: {
            search: keyword,
            currentPage: currentPage,
          }
        });
        if (res.data.success) {
            setPosts(res.data.posts);
            setTotal(res.data.total);
            setMaxPage(res.data.maxpage);
            setError(null);
            setLoading(false);
            console.log("Fetched posts: ", res.data.posts);
        } else{
            setError("Failed to fetch posts: " + res.data.message);
            setLoading(false);
        }
      } catch (err){
        console.error("Error fetching posts: ", err);
      } finally{
        setLoading(false);
      }
    }, [currentPage]);

    useEffect(() => {
      fetchPosts(activeKeyword);
    },[currentPage, activeKeyword]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      let nextPage;
      if (direction === "next") {
        nextPage = Math.min(prev + 1, maxPage);
      } else {
        nextPage = Math.max(prev - 1, 1);
      }
      window.history.pushState({}, '', `?search=${encodeURIComponent(activeKeyword)}&page=${nextPage}`);
      return nextPage;
    });
  };

    return (
      <div>
        <div> 
          <h2>Illustrations</h2>
          {activeKeyword ? <p>Search: <strong>{activeKeyword || '(empty)'}</strong></p>:null}
          {activeKeyword ? <p>Found: <strong>{total || '(empty)'}</strong> artworks</p>:null}
          
          {posts.length === 0 && activeKeyword ? (
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
              <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
                Previous
              </button>

              <span style={{ margin: "0 10px" }}>
                Page {currentPage} of {maxPage}
              </span>

              <button onClick={() => handlePageChange("next")} disabled={currentPage === maxPage}>
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