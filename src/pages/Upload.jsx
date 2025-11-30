import { useParams,useLocation } from 'react-router-dom';
import React, {useEffect, useState} from "react";
// import { Insert } from "./placeholder/Insert.jsx"; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import axios from 'axios';
import "../Design/form.css";
import DeleteDialog from '../Components/Dialog.jsx';

function Upload() {
  const { artid } = useParams(); //replaces encodeURIComponent()
  const isEdit = !!artid;
  const { artimages, arttitle, artdescription} = useLocation().state || {};

  const APIURL = process.env.REACT_APP_API_URL || `https://illustation-site.onrender.com`;
    const [title, setTitleName] = useState(arttitle||'');
    const [description, setDescription] = useState(artdescription||'');
    const [category, setCategory] = useState('illustration');
      const [showDialog, setShowDialog] = useState(false);

    
    
      const navigate = useNavigate();

  const [images, setImages] = React.useState(artimages || []);
  const maxNumber = 3;
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

    const formData = new FormData();
    formData.append("userid", localStorage.getItem("userid"));
    // formData.append('artid', uuidv4());
    formData.append('artid', artid || Math.floor(Math.random() * 1e10).toString());
    formData.append("title", title);
    formData.append("caption", description);
    formData.append("category", category);
    

    images.forEach((imgObj) => {
      formData.append("images", imgObj.file);
    });

    for (const entry of formData.entries()) {
     // Input Test - Consists of key-value pairs
      console.log('FormData entry:', entry[0], entry[1]);
    }

    try{
      let response;
      // console.log('upload token preview:', (accessToken || '').substring(0,10) + '...');
      if (isEdit){
         response =  await axios.get(`${APIURL}/illust/edit/${artid}`, //Edit route
        title, description, userid, artid, Date.now(), //edited time
        { withCredentials: true,} 
      );
      
      } else{
         response =  await axios.post(`${APIURL}/illust/upload`, 
        formData,
        { withCredentials: true,} 
      );
      
      }
     
      // headers: { "Content-Type": "multipart/form-data" },//Breaks Boundary - do not use 

      if (response.data.success) {
        const artId = encodeURIComponent(response.data.post.artid);
        navigate(`/posts/${artId}`);
      } else{
        alert("Upload failed: " + response.data.message);
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      if(err.response?.status===401){
      alert("Upload error: " + serverMessage);
      localStorage.clear();
      navigate('/');
      }
    }
  }

  // Delete handler
const handleDelete = async (e) => {
  // ...delete logic...
  const response = await axios.post(`${APIURL}/illust/delete`,
    {artid},
    { withCredentials: true }
  );
  console.log("Delete response:", response.data);
  setShowDialog(false);
  if(response.data.success){
    navigate('/illustration', { state: { deleted: true } });
  }
  else{
    alert("Delete failed: " + response.data.message);
  }
};

const userid = localStorage.getItem('userid');
useEffect(() => {
  if (!userid) {
    alert("You must log in for upload.");
    navigate('/registry');
  }
  if (isEdit) {
      axios.get(`${APIURL}/illust/posts/${artid}/edit`, { withCredentials: true })//To be changed to /illust/edit/:artid
        .then(res => {
          if (res.data.success) {
            setTitleName(res.data.post.title || '');
            setDescription(res.data.post.caption || '');
            setImages(res.data.post.images || []);
          }
        })
        .catch(err => {
          if (err.response?.status === 403) {
            alert(`You do not have permission to edit this artwork. ${err.response.data.message || ''}`);
            navigate(`/posts/${artid}`);
          }
        });
    }
}
, [userid, navigate, isEdit, artid, arttitle, artimages, APIURL]);



    return(
      <>
            <div className="content">
            {isEdit ? <h3>Edit artwork</h3> : <h3>Submit artwork</h3>}
            <div className="forms-content">
              {/* Upload Section */}
               <div className="forms" style={{width: "40%" }}>
                {isEdit ? 
                (<div>
                  <p>ID: {artid}</p>
                  <p>Current Images:</p>
                  <div className="upload__image-wrapper">
                  {images && images.length > 0 ? images.map((image, index) => (
                    <div key={index} className="image-item">
                      <img  src={image} alt={`Artwork ${index + 1}`}/>
                    </div>
                  )) : <p>Error: No images available.</p>}
                  </div>
                </div>)
                : 
                  (<ImageUploading
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
                                  <img src={image.data_url} alt="" />
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
                    </ImageUploading>)}
              </div>
                
                {/* Form Section */}
                <div className="forms"  style= {{width: "60%"}} >
                    <form onSubmit={isEdit ? undefined : handleSubmit} >
                        <div className="inputbox">
                            <label>Title</label>
                            <input type="text" 
                            value={title} 
                            onChange={(e) => setTitleName(e.target.value)}  
                            id="itemname" className="form-control" 
                            name="itemname" placeholder="Enter title here" 
                            minLength="3" autoComplete="off"  required
                            />
                        </div>
                        <div className="inputbox description-box" >
                            <label>Description</label>
                            <textarea type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}  
                            id="itemname" className="form-control" 
                            name="itemname" placeholder="Enter description here" 
                            minLength="3" autoComplete="off"  required
                             ></textarea>
                        </div>
                        <div className="mode">
                          {isEdit ? 
                          <div >
                            <button className="action" type="submit" 
                          disabled={(title === arttitle || "" || null) && 
                            (description === artdescription || "" || null)}>Save Changes</button>
                            <div>
                      <button type="button" className="delete-btn" onClick={() => setShowDialog(true)}>Delete</button>
                      {showDialog && (
                      <DeleteDialog
                        open={showDialog}
                        onConfirm={handleDelete}
                        onClose={() => setShowDialog(false)}
                      />
                      )}
                    </div>
                          </div> 
                          :  <button disabled={images.length > maxNumber || images.length <= 0}
                          className = "action" type="submit">Submit</button>
                          }
                        </div>
                    </form>
                </div>
            </div>
        </div> 

      </>
    )
}

export default Upload;