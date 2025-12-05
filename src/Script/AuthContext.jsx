// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
    const APIURL = process.env.REACT_APP_API_URL || `https://illustation-site.onrender.com`;

  useEffect(() => {
    axios.get(`${APIURL}/auth/me`, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setUser(res.data); // { userid, username, ... }
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
