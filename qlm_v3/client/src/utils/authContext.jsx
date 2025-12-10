import {
  useContext,
  useCallback,
  useEffect,
  createContext,
  useState,
  useRef,
} from "react";
import axios from "axios";

// Create AuthContext
const AuthContext = createContext(null);

// Create AuthProvider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 初始設為 true，用於檢查登入狀態
  const effectRan = useRef(false); // Prevent double-execution in StrictMode

  // Check login status
  const checkLoginStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/auth", {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (err) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (effectRan.current === false) {
      checkLoginStatus();
      return () => {
        effectRan.current = true;
      };
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "/api/login",
        { username, password },
        { withCredentials: true }
      );
      setUser(response.data);
    } catch (err) {
      console.log("Login failed:", err.response?.data.message || err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const response = await axios.post(
        "/api/logout",
        {},
        { withCredentials: true }
      );
      console.log("Logout response:", response.data);
      setUser(null);
    } catch (err) {
      console.log("Logout failed:", err.response?.data.message || err.message);
    }
  };

  const value = { user, login, logout, isLoading, isLoggedIn: !!user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
