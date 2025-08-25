import React, { useState } from "react";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext"; // Import cart context
import "../styles/Checkout.css";

const Checkout = ({ totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCart(); // Get cart and clearCart function
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleAddressChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    // Calculate totalPrice from cart items
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    console.log("🛒 Total Price Before Sending to Backend:", totalPrice); // 🔍 Debugging
  
    // Ensure totalPrice is valid
    if (!totalPrice || totalPrice < 50) {
      setError("Minimum order amount must be ₹50.");
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to complete the checkout.");
        setLoading(false);
        return;
      }
  
      if (cart.length === 0) {
        setError("Your cart is empty.");
        setLoading(false);
        return;
      }
  
      if (Object.values(shippingAddress).some((val) => val.trim() === "")) {
        setError("Please fill in all shipping details.");
        setLoading(false);
        return;
      }
  
      const { data } = await axios.post(
        "https://e-commerce1-wd40.onrender.com/api/orders",
        {
          orderItems: cart.map((item) => ({
            _id: item._id,
            name: item.title, // ✅ Fix: Change 'title' to 'name'
            price: item.price,
            quantity: item.qty, // ✅ Fix: Change 'qty' to 'quantity'
            image: item.image,
            brand: item.brand,
            model: item.model,
          })),
          totalPrice,
          shippingAddress,
          paymentMethod: "card",
        },
        { headers: { Authorization: `Bearer ${token}`} }
        );
      
  
      console.log("Order Created:", data);
      const { clientSecret, order } = data;
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
  
      if (result.error) {
        setError(result.error.message);
      } else {
        await axios.post(
          "https://e-commerce1-wd40.onrender.com/api/orders/confirm-payment",
          { orderId: order._id, paymentIntentId: result.paymentIntent.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        setSuccess(true);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setError("Payment failed. Please try again.");
    }
  
    setLoading(false);
  };
  
  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shippingAddress.address}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingAddress.city}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingAddress.postalCode}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shippingAddress.country}
          onChange={handleAddressChange}
        />

        <CardElement />
        <button type="submit" disabled={!stripe || loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Payment successful! 🎉</p>}
    </div>
  );
};

export default Checkout;
