import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/CartStyles.css"; 

const CartScreen = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login"); // Redirect to login if not authenticated
    return null;
  }

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    navigate("/checkout");  // Navigate to the checkout page
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-image" />
                <div className="cart-details">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="cart-price">Price: ${item.price.toFixed(2)}</p>
                  <div className="cart-qty">
                    <button onClick={() => removeFromCart(item._id)}>-</button>
                    <span className="qty-number">{item.qty}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>
          <h2 className="total-price">Total Price: ${totalPrice.toFixed(2)}</h2>
          <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          <button className="clear-cart-btn" onClick={clearCart}>🗑️ Clear Cart</button>
        </>
      )}
    </div>
  );
};

export default CartScreen;
