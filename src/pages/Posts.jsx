import { useParams,} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Posts() {
    const { artid } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  

//NOTICE: useCallback not needed due to the function being inside of useEffect
  useEffect(() => {
    if (!artid) return;
    setLoading(true);
    setNotFound(false);
    axios.get(`http://localhost:3001/illust/posts/${artid}`)
      .then(res => {
        console.log("Response:", res.data);
        if (res.data.success) {
          setPost(res.data.post);
        } else {
          setNotFound(true);
        }
      
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error(err);
        }
      }).finally(() => setLoading(false));
  }, [artid]);

  if (loading) {
  return <div className="content"><p>Loading...</p></div>;
} 

if (notFound) {
  return <div className="content"><p>Page Not Found</p></div>;}


    return(
        <div className="content">
          <div className="content posts-content">
            <div className="posts" style={{width: "40%" }}>
                <h3 className="title">{post.title ?? "No Title"}</h3>
                <div className="info">
                    <p>Username: {post.username??"None"}</p>
                    <p>Published: {post.created??"None"}</p>
                    {post.edited ? <p>Edited: {post.edited}</p>:null}
                    <p>Category: {post.category??"None"}</p>
                    <div className="description">
                        {post.caption ?? "No Desription"}
                    </div>
                </div>
            </div>
            <div className="posts" style={{width: "60%"}}>
              <div className="image-preview">
                {Array.isArray(post.images) ? (
  post.images.map((img, idx) => (
    <img key={idx} src={`http://localhost:3001/${img}`}
    alt={post.images} />
  ))
) : (
  <p>No images available.</p>
)}
              </div>
                

            </div>
        </div>
        
    </div>
    )
}

export default Posts;

