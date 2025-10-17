import { useParams,} from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import '../Design/posts.css';

function Posts() {
    const { artid } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  //Right
  const [imagesList, setImagesList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailsRef = useRef(null);
  const thumbRefs = useRef([])

  const postsURL = "http://localhost:3001/illust/posts/";
  // base URL to serve image files (files are stored under /posts/<artid>/...)
  const imagesBase = "http://localhost:3001/posts/";

//NOTICE: useCallback not needed due to the function being inside of useEffect
  useEffect(() => {
    if (!artid) return;
    setLoading(true);
    setNotFound(false);
    axios.get(`${postsURL}${artid}`)
      .then(res => {
        console.log("Response:", res.data);
        if (res.data.success) {
          setPost(res.data.post);
          const imgs = Array.isArray(res.data.post.images) ? res.data.post.images : [];
          setImagesList(imgs);
          setSelectedIndex(0);
          
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
  }, [postsURL, artid]);

  useEffect(() => {
    const selectedborder = thumbRefs.current[selectedIndex];
    if (selectedborder) {
      // prefer centering the item in the scroll container
      selectedborder.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selectedIndex]);

  if (loading) {
  return <div className="loading"><p>Loading...</p></div>;
} 

if (notFound) {
  return <div className="error"><p>Page Not Found</p></div>;}

  console.log("Images List:", imagesList);    

    return(
        <div className="content">
          <div className="posts">
            {/* className="content posts-content" */}
            <div className="blocks details">
              {/* className="posts" */}
                <h3 className="title">{post.title ?? "No Title"}</h3>
                <div className="info">
                    <p>By: {post.username}</p>
                    <p>Published: {post.created}</p>
                    {post.edited ? <p>Edited: {post.edited}</p>:null}
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
                    <img src={imagesBase+imagesList[selectedIndex]} alt={`Artwork ${selectedIndex + 1}`} />
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
              src={imagesBase+src}
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
            {/* <div className="image">
              <div className="image-preview">
                {Array.isArray(post.images) ? (
                  post.images.map((img, idx) => (
                    <img className="img-box"
                    key={idx} src={`http://localhost:3001/posts/${img}`}
                    alt={post.images} />

                  ))
                ) : (
                  <p>No images available.</p>
                )}
                </div>
               <div className="artpieceBar">Pagination Bar</div>
              </div> */}
            </div>
          </div>
        )
      }

export default Posts;

