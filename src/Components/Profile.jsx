import { useParams} from 'react-router-dom';
import React, {useEffect, useState} from "react";
// import { Insert } from "./placeholder/Insert.jsx"; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Design/form.css";

function Profile(profilename){
    return(
        <div className="content">
            <h2>${profilename}</h2>
            <p>This is a placeholder for the profile page.</p>
        </div>
    );
}

export default Profile;