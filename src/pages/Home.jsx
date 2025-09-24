import React, {useState, useEffect, useCallback} from 'react';
import Recommendation from '../Components/Recommendation.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function Home(){
    const [posts, setPosts] = useState([]);

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
            <h2>Recent Posts</h2>
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
    <h3>{truncateText(post.title, 20)}</h3>
    <p>by {post.username}</p>
  </div>
          </Link>
  
))}
        </div>

        {/* Repeat content as needed */}

      <div className="content"> 
      {/* ref={introRef} */}
        <h2>Recommendation</h2>
        <div><Recommendation /></div>

        {/* Repeat content as needed */}
          </div>
        </div>
    );
}

export default Home;