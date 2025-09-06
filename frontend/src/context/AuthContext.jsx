import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchAuth = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setAuth({ user: data.user, isAuthenticated: true });
      } else {
        setAuth({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuth({ user: null, isAuthenticated: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
