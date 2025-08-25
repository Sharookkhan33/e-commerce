import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        console.log("Stored Token:", storedToken);
        const decodedUser = jwtDecode(storedToken);
        console.log("Decoded User:", decodedUser);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  const login = (tokenResponse) => {
    if (!tokenResponse || typeof tokenResponse !== "object" || !tokenResponse.token) {
      console.error("Invalid token received at login:", tokenResponse);
      return;
    }
  
    const token = tokenResponse.token; // Extract only the token
    localStorage.setItem("token", token);
  
    try {
      const decodedUser = jwtDecode(token);
      console.log("Decoded User after login:", decodedUser);
      setUser(decodedUser);
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("User logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
