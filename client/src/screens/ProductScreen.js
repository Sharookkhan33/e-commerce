import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext"; // Import Cart Context


const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart(); // Add to cart function

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://e-commerce1-wd40.onrender.com/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="product-container">
      <img src={product.image} alt={product.title} className="product-image" />
      <div className="product-details">
        <h1>{product.name}</h1>
        <p className="product-price">Price: ${product.price.toFixed(2)}</p>
        <p className="product-description">{product.description}</p>
        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductScreen;
