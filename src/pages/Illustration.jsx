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
  const navigate = useNavigate();
  //... to do: Add search functionality


  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

    const fetchPosts = useCallback(
    async () => {
      try{
        const res = await axios.get(`http://localhost:3001/illust/illusts`);
        if (res.data.success) {
            setPosts(res.data.posts);
        }
      } catch (err){
        console.error("Error fetching posts: ", err);
      }
    }, []);

    useEffect(() => {
      fetchPosts();
    },[]);

    return (
      <div>
        <div> 
          <h2>Illustrations</h2>
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

      </div>
        </div>
    );
}

export default Illustration;