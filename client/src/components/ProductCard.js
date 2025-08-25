import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import Cart Context
import "../styles/ProductCard.css"; // Import separate CSS

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // Get addToCart function from context

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} className="product-image" />
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
      <div className="product-buttons">
        <Link to={`/product/${product._id}`} className="view-details-btn">
          View Details
        </Link>
        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
