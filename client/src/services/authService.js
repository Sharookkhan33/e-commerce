import axios from "axios";

const API_URL = "https://e-commerce-7xtp.onrender.com/api/users";

// Register User
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

// Login User
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    
    console.log("Login API Response:", response.data); // 🔍 Debugging

    // Ensure token exists and is a string
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      console.log("Stored Token in localStorage:", localStorage.getItem("token")); // 🔍 Debugging
    } else {
      console.error("No token received from API.");
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Invalid credentials");
  }
};


// Get User Profile
export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Profile Fetch Error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Error fetching profile");
  }
};
