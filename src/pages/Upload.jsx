import React, {useState} from "react";
// import { Insert } from "./placeholder/Insert.jsx"; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import axios from 'axios';

function Upload() {
    const [title, setTitleName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('illustration');

    const navigate = useNavigate();

  const [images, setImages] = React.useState([]);
  const maxNumber = 1;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("userid", localStorage.getItem("id"));
    formData.append('artid', Math.floor(Math.random() * 1e10).toString());
    formData.append("title", title);
    formData.append("caption", description);
    formData.append("category", category);

    images.forEach((imgObj) => {
      formData.append("images", imgObj.file);
    });

    try{
      
      const response = await axios.post('http://localhost:3001/illust/upload', 
        formData,
        {headers: { 
          "Authorization": `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' //No Boundary - Unable to read token
        }}
      );

      if (response.data.success) {
        // const userId = encodeURIComponent(response.data.post.userid);
        const artId = encodeURIComponent(response.data.post.artid);
        navigate(`/posts/${artId}`);
      } else{
        alert("Upload failed: " + response.data.message);
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      alert("Upload error: " + serverMessage);
      console.error("Upload error details:", err);
    }
  }


    return(
          <div className="content" >
            <h3>Sumbit artwork</h3>
            <div className="content posts-content">
                <div className="posts" style={{width: "40%" }}>
                    <ImageUploading
                            multiple
                            value={images}
                            onChange={onChange}
                            maxNumber={maxNumber}
                            dataURLKey="data_url"
                            acceptType={["png", "jpg", "jpeg"]} // Adjust accepted file types as needed
                          >
                            {({
                              imageList,
                              onImageUpload,
                              onImageRemoveAll,
                              onImageUpdate,
                              onImageRemove,
                              isDragging,
                              dragProps
                            }) => (
                              // write your building UI
                              <div>
                                <div>Images: {imageList.length}/{maxNumber}</div>
                                {imageList.length >= maxNumber && ( <p style={{ color: "red" }}>Maximum image limit reached</p> )}
                                <button
                                  disabled={imageList.length >= maxNumber}
                                  style={isDragging ? { color: "red" } : null}
                                  onClick={onImageUpload}
                                  {...dragProps}> Upload </button>
                                  &nbsp;
                                <button onClick={onImageRemoveAll}>Remove All</button>
                                <div className="upload__image-wrapper">
                                  {imageList.map((image, index) => (
                                  <div key={index} className="image-item">
                                    <img src={image.data_url} alt="" style={{display:"flex", width:"200px", justifyContent:"center", overflow: "auto"}}/>
                                    <p>File name: {image.file.name}</p>
                                    <div className="image-item__btn-wrapper">
                                      <button onClick={() => onImageUpdate(index)}>Update</button>
                                      <button onClick={() => onImageRemove(index)}>Remove</button>
                                    </div>
                                  </div>
                                ))}
                                </div>
                              </div>
                            )}
                      </ImageUploading>
                </div>
                
                <div className="posts"  style={{width: "60%"}} >
                    <form onSubmit={handleSubmit}>
                        <div className="inputbox">
                            <label>Title</label>
                            <input type="text" 
                            value={title} 
                            onChange={(e) => setTitleName(e.target.value)}  
                            id="itemname" className="form-control" 
                            name="itemname" placeholder="Item name" 
                            minLength="3" autoComplete="off"  required
                            />
                        </div>
                        <div className="inputbox" >
                            <label>Description</label>
                            <textarea type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}  
                            id="itemname" className="form-control" 
                            name="itemname" placeholder="Item name" 
                            minLength="3" autoComplete="off"  required
                             ></textarea>
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px"
                        }}>
                        <button disabled={images.length > maxNumber || images.length <= 0}
                        className = "action" type="submit">Submit</button></div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Upload;