import { useParams,} from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import '../Design/posts.css';

import { useNavigate } from 'react-router-dom';
import FormatTime from "../Script/TimeFormat.jsx";

function Posts() {
  const navigate = useNavigate();
  
    const { artid } = useParams();
    const userId = localStorage.getItem('userid'); // set at login
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // const [published, setPublished] = useState(null);
  // const [edited, setEdited] = useState(null);
  
  //Right
  const [imagesList, setImagesList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailsRef = useRef(null);
  const thumbRefs = useRef([])

  const APIURL = process.env.REACT_APP_API_URL || `https://illustation-site.onrender.com`;

  // const postsURL = `${APIURL}/illust/posts/`;
  // base URL to serve image files (files are stored under /posts/<artid>/...)
  // const imagesBase = `${APIURL}/posts/`;

  const { published, edited } = FormatTime(post?.created, post?.edited);
//NOTICE: useCallback not needed due to the function being inside of useEffect
  useEffect(() => {
    if (!artid) return;
    setLoading(true);
    setNotFound(false);
    axios.get(`${APIURL}/illust/posts/${artid}`) //`${APIURL}/illust/posts/${artid}`;
      .then(res => {
        console.log("Response:", res.data);
        if (res.data.success) {
          setPost(res.data.post);
          console.log(res.data.post.created, res.data.post.edited);
          
          const imgs = Array.isArray(res.data.post.images) ? res.data.post.images : [];
          setImagesList(imgs);
          setSelectedIndex(0);
          setIsOwner(Number(userId) === res.data.post.userid);
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
  }, [artid, userId]);


  // Scroll selected thumbnail into view when selectedIndex changes
  useEffect(() => {
    const selectedborder = thumbRefs.current[selectedIndex];
    if (selectedborder) {
      // prefer centering the item in the scroll container
      selectedborder.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedIndex]);

// Loading and Not Found states
if (!post && loading) {
  return <div className="loading"><p>Loading...</p></div>;
} 

if (notFound) {
  return <div className="error"><p>Page Not Found</p></div>;
}

if (!post) return <div>Post data not available</div>;

  console.log("Images List:", imagesList);    



    return(
        <div className="content">
          <div className="posts">
            {/* className="content posts-content" */}
            <div className="blocks details">
              {/* className="posts" */}
                <h3 className="title">{post.title ?? "No Title"}</h3>
                {isOwner && (<div className="options">
                    <button className="edit-btn"
                    onClick={()=> navigate('/posts/'+post.artid+'/edit', 
                      {state: 
                        {artimages: imagesList, 
                          arttitle: post.title, artdescription: post.caption, artid: post.artid,
                        }
                      }
                    )}
                    >Edit</button>
                     
                </div>)}
                <div className="info">
                    <p>By: {post.username}</p>
                    <p>Published: {published}</p>
                    {/* post.created */}
                    {edited ? <p>Edited: {edited}</p>:null}
                    {/* post.edited */}
                    <p>Category: {post.category}</p>
                    <div className="description">
                        {post.caption ?? <i>No Desription</i>}
                    </div>
                </div>
                
            </div>
            {/* Image Display */}
            
            <div className="blocks showimage">
              <div className="gallery-outer">
                <div className="gallery-container">
                  {/* Main image */}
                  <div className="main-image">
                    <img src={imagesList[selectedIndex]} alt={`Artwork ${selectedIndex + 1}`} />
                  </div>
                  <div className="thumbnail-strip">
                    <button
          className="nav-btn"
          onClick={() => setSelectedIndex((selectedIndex - 1 + imagesList.length) % imagesList.length)}
        >
          ◀
        </button>

        <div className="thumbnails" ref={thumbnailsRef}>
          {imagesList.map((src, index) => (
            <img
              key={index}
              ref={(selectedborder) => (thumbRefs.current[index] = selectedborder)}
              src={src}
              className={`thumbnailList ${selectedIndex === index ? "active" : ""}`}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>

        <button
          className="nav-btn"
          onClick={() => setSelectedIndex((selectedIndex + 1) % imagesList.length)}
        >
          ▶
        </button>
                  </div>
                  <div className="page-label">{`${selectedIndex + 1} of ${imagesList.length}`}</div>
                </div>
              </div>

            </div>
            </div>
          </div>
        )
      }

export default Posts;

