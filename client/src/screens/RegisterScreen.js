import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";


const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await register({ name, email, password });
      setAuthUser(userData);
      navigate("/");
    } catch (error) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="auth-container">
     <div className="auth-box">
      <h2 >Register</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
