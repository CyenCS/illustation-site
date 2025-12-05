import { useParams} from 'react-router-dom';
import React, {useEffect, useState} from "react";
// import { Insert } from "./placeholder/Insert.jsx"; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Design/form.css";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function Profile(){
    const { userid } = useParams();
    
    const navigate = useNavigate();
    const APIURL = process.env.REACT_APP_API_URL || `https://illustation-site.onrender.com`;

    return(
        <div className="content">
            <h2>${}</h2>
            <p>This is a placeholder for the profile page.</p>
        </div>
    );
}

export default Profile;