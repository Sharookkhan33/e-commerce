import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import "./index.css";
import "./styles.css"; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider> {/* Wrap everything with AuthProvider */}
    <CartProvider>
      <Router>
        <App />
      </Router>
    </CartProvider>
  </AuthProvider>
);
