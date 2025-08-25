import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaShoppingCart, FaBars, FaUser } from "react-icons/fa";
import { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          TrendyCart
        </Link>

      
        {/* Hamburger Menu */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars />
        </button>

        {/* Nav Links */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart />
            </Link>
          </li>

          {user ? (
            <li className="profile-menu">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="profile-btn">
                <FaUser className="nav-icon" />
                <span>{user.name}</span>
              </button>

              {dropdownOpen && (
                <ul className="dropdown">
                  {user.isAdmin && (
                    <li>
                      <Link to="/admin/products">Admin Panel</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={logout}>Logout</button>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <li className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
