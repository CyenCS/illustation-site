// src/context/AuthContext.jsx
//https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
    const APIURL = process.env.REACT_APP_API_URL || `https://illustation-site.onrender.com`;

  useEffect(() => {
    axios.get(`${APIURL}/fetch/auth/me`, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setUser(res.data.user); // { userid, username, ... }
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
      
  }, [APIURL]);

  const logout = async () => {
    try {
      await axios.post(`${APIURL}/fetch/logout`, {}, { withCredentials: true });
      alert("Logged out successfully.");
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null); // clear context
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
