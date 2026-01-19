import { useParams} from 'react-router-dom';
import React, {useEffect, useState} from "react";
// import { Insert } from "./placeholder/Insert.jsx"; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import axios from 'axios';
import "../Design/form.css";
import DeleteDialog from '../Components/Dialog.jsx';
import { useAuthContext } from '../Script/AuthContext.jsx';


function Upload() {
  const { user, loading } = useAuthContext();
  
  const { artid } = useParams(); //replaces encodeURIComponent()
  const isEdit = !!artid;

  const APIURL = process.env.REACT_APP_API_URL || `https://illustation-site.onrender.com`;
    const [title, setTitleName] = useState('');
    const [description, setDescription] = useState('');
    const [initialTitle, setInitialTitle] = useState('');
    const [initialDescription, setInitialDescription] = useState('');
    const [category, setCategory] = useState('illustration');
    const [showDialog, setShowDialog] = useState(false);
    
      const navigate = useNavigate();
      
  const [images, setImages] = React.useState([]);
  const maxNumber = 3;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

        const formData = new FormData();
    formData.append("userid", user.userid);
    // formData.append('artid', uuidv4());
    formData.append('artid', artid || Math.floor(Math.random() * 1e10).toString());
    formData.append("title", title);
    formData.append("caption", description);
      
      // console.log('upload token preview:', (accessToken || '').substring(0,10) + '...');
    try{
      const payload = { title, caption: description, artid }; // send caption
      const response =  await axios.put(`${APIURL}/illust/edit/${artid}`, //Edit route
        payload, //edited time
        { withCredentials: true,} 
      );

    if (response.data.success) {
      navigate(`/posts/${artid}`);
    } else{
      alert(`Edit failed: ` + response.data.message);
    }
    } catch (err) {
      console.error("Edit error: ", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("userid", user.userid);
    // formData.append('artid', uuidv4());
    formData.append('artid', artid || Math.floor(Math.random() * 1e10).toString());
    formData.append("title", title);
    formData.append("caption", description);
    formData.append("category", category);
    

    images.forEach((imgObj) => {
      formData.append("images", imgObj.file);
    });

    // for (const entry of formData.entries()) {
    //  // Input Test - Consists of key-value pairs
    //   console.log('FormData entry:', entry[0], entry[1]);
    // }
    try{
      
     const response =  await axios.post(`${APIURL}/illust/upload`, 
          formData, { withCredentials: true,} 
        );
      // headers: { "Content-Type": "multipart/form-data" },//Breaks Boundary - do not use 

      if (response.data.success) {
        const artId = encodeURIComponent(response.data.post.artid);
        navigate(`/posts/${artId}`);
      } else{
        alert(`Upload failed: ` + response.data.message);
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      if(err.response?.status===401){
      alert(`Upload error: ` + serverMessage);
      navigate('/');
      }
    }
  }

  // Delete handler
const handleDelete = async (e) => {
  // ...delete logic...
  const response = await axios.delete(`${APIURL}/illust/delete`,{
    // axios.delete only supports one argument for URL, config. Must type 'data' inside config.
    data: { artid },
    withCredentials: true 
  });
  console.log("Delete response:", response.data);
  
  if(response.data.success){
    alert(response.data.message);
    navigate('/illustration');
  }
  else{
    alert("Delete failed: " + response.data.message);
  }
};

useEffect(() => {
  function fetchPostDataForEdit(artid) {
  axios.get(`${APIURL}/illust/posts/${artid}/edit`, // Fetch existing post data for editing
        { withCredentials: true })
        .then(res => {
          if (res.data.success) {
            const post = res.data.post || {};
            setTitleName(post.title || '');
            setDescription(post.caption || '');
            setInitialTitle(post.title || '');
            setInitialDescription(post.caption || '');
            let imgs = (post.images ?? []);
            if ((Array.isArray(imgs))) {
              try { imgs = imgs || '[]'; }
              catch (e) { console.error('Failed to parse images:', e); imgs = []; }
            }
            if (!Array.isArray(imgs)) imgs = [];
            setImages(imgs);
          }
        })
        .catch(err => {
          if (err.response?.status === 403) {
            alert(`You do not have permission to edit this artwork. ${err.response.data.message || ''}`);
            navigate(`/posts/${artid}`);
            return;
          }
        });
}

  if (loading) return; // Wait until loading is complete  

  if (!user) {
    navigate('/');
    return;
  }
  else{
    if (isEdit) {
      fetchPostDataForEdit(artid);
    } else{
      return;
    }
  }
}
, [user, isEdit, artid, loading, navigate, APIURL]);

    return(
      <>
            <div className="content">
            {isEdit ? <h3>Edit artwork</h3> : <h3>Submit artwork</h3>}
            <div className="forms-content">
              {/* Upload Section */}
              <div className="forms">
                {isEdit ? 
                (<div>
                  <p>ID: {artid}</p>
                  <p>Current Images:</p>
                  <div className="upload__image-wrapper">
                  {images && images.length > 0 ? images.map((image, index) => (
                    <div key={index} className="image-item">
                      <img  src={image} alt={`Artwork ${index + 1}`}/>
                    </div>
                  )) : null}
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
                              <div className='flex-row'>
                                <div>Images: {imageList.length}/{maxNumber}</div>
                              {imageList.length >= maxNumber && ( <div style={{ color: "red" }}>Maximum image limit reached</div> )}
                              {imageList.length > 0 && (<button className="removeall" onClick={onImageRemoveAll}>Remove All</button>
                              )}
                              </div>
                              <div className="upload__image-wrapper">
                                {imageList.map((image, index) => (
                                  
                                <div key={index} className="image-item">
                                  <div className="image-item__btn-wrapper">
                                    <button className="btn-mini btn-replace" onClick={() => onImageUpdate(index)}></button>
                                    <button className="btn-mini btn-remove" onClick={() => onImageRemove(index)}></button>
                                  </div>
                                  <img src={image.data_url} alt="" />
                                  <p className="filename">{image.file.name}</p>
                                </div>
                              ))}
                              {(imageList.length >= maxNumber)||(imageList.length === 0) ? null : <button className="btn-mini btn-add"
                                disabled={imageList.length >= maxNumber}
                                onClick={onImageUpload}
                                {...dragProps}> </button>}
                              </div>
                              <div className='mode'>
                                {(imageList.length <= 0 )? 
                              <button className='upload-btn' onClick={onImageUpload}
                                {...dragProps}>Upload</button>
                              : null}
                              </div>
                              <div></div>
                            </div>
                          )}
                    </ImageUploading>)}
              </div>
                
                {/* Form Section */}
                <div className="forms" >
                    <form onSubmit={isEdit ? handleEdit : handleSubmit} >
                        <div className="inputbox">
                            <label>Title</label>
                            <input type="text" 
                            value={title} 
                            onChange={(e) => setTitleName(e.target.value)}  
                            id="title" className="form-control" 
                            name="title" placeholder="Enter title here" 
                            minLength="3" autoComplete="off"  required
                            />
                        </div>
                        <div className="inputbox description-box" >
                            <label>Description</label>
                            <textarea type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}  
                            id="description" className="form-control" 
                            name="description" placeholder="Enter description here" 
                            minLength="0" autoComplete="off"
                             ></textarea>
                        </div>
                        <div className="mode">
                          {isEdit ? 
                          <div className='btn-col'>
                            <button className="upload-btn" type="submit" 
                          disabled={(title === initialTitle || "" || null) && 
                            (description === initialDescription || "" || null)}>Save Changes</button>
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
                          className = "upload-btn" type="submit">Submit</button>
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