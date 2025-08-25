import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminStyles.css";

const AdminCreateProductScreen = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    category: "",
    description: ""
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    try {
      await axios.post("https://e-commerce1-wd40.onrender.com/api/products", product, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error.response?.data);
    }
  };
  

  return (
    <div className="admin-container">
      <h2>➕ Add New Product</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="title" onChange={handleChange} required />

        <label>Price:</label>
        <input type="number" name="price" onChange={handleChange} required />

        <label>Image URL:</label>
        <input type="text" name="image" onChange={handleChange} required />

        <label>Category:</label>
        <input type="text" name="category" onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" onChange={handleChange} required />

        <button type="submit" className="save-btn">✅ Add Product</button>
      </form>
    </div>
  );
};

export default AdminCreateProductScreen;
