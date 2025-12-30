import React, {useState, useEffect, useCallback} from 'react';
import Recommendation from '../Script/Recommendation.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ArtworkCard from '../Components/ArtworkCard.jsx';
import ArtworkList from '../Components/ArtworkList.jsx';
const APIURL = process.env.REACT_APP_API_URL || "https://illustation-site.onrender.com";

//No more http://localhost:3001 as server for production


function Home(){
    const [posts, setPosts] = useState([]);

    const fetchPosts = useCallback(
    async () => {
      try{
        const link = `${APIURL}/illust/illusts`;
        const res = await axios.get(link);
        if (res.data.success) {
          // console.log("access: "+localStorage.getItem("accessToken"));
            setPosts(res.data.posts);
        }
      } catch (err){
        console.error("Error fetching posts: ", err);
      }
    }, []);

    useEffect(() => {
      fetchPosts();
    },[fetchPosts]);

    return (
        <div className="content">
            <h2>Recent Posts</h2>
        <div >
          <ArtworkList />
        {/* <div className='listpage'> {posts.map((post) => (
          <ArtworkCard key={post.artid} post={post} />
        ))} </div>  */}
        </div>

        {/* Repeat content as needed */}

      {/* ref={introRef} */}
        <h2>Recommendation</h2>
        <div><Recommendation /></div>

        {/* Repeat content as needed */}
          </div>
    );
}

export default Home;