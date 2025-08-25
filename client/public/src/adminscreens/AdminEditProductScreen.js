import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminStyles.css";

const AdminEditProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    category: "",
    description: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        const { data } = await axios.get(`https://e-commerce1-wd40.onrender.com/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error.response?.data || error.message);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Get JWT token from localStorage
      await axios.put(`https://e-commerce1-wd40.onrender.com/api/products/${id}`, product, {
        headers: { Authorization: `Bearer ${token}` }, // Include token in headers
      });
      navigate("/admin/products"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="admin-container">
      <h2>✏️ Edit Product</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="title" value={product.title} onChange={handleChange} required />

        <label>Price:</label>
        <input type="number" name="price" value={product.price} onChange={handleChange} required />

        <label>Image URL:</label>
        <input type="text" name="image" value={product.image} onChange={handleChange} required />

        <label>Category:</label>
        <input type="text" name="category" value={product.category} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={product.description} onChange={handleChange} required />

        <button type="submit" className="save-btn">💾 Save Changes</button>
      </form>
    </div>
  );
};

export default AdminEditProductScreen;
