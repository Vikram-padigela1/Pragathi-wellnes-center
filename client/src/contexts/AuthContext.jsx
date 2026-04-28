import { createContext, useContext, useState, useEffect } from "react";
import { siteContent } from "../siteData";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check URL for token if returning from OAuth
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    
    if (tokenFromUrl) {
      localStorage.setItem("pragathi_token", tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const token = localStorage.getItem("pragathi_token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await fetch(`${siteContent.apiBaseUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("pragathi_token");
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("pragathi_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, token: localStorage.getItem("pragathi_token") }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
