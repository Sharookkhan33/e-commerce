import { Route, Routes, Navigate } from "react-router-dom"; // ✅ Removed unused Router
import { useAuth } from "./context/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Navbar from "./components/Navbar";
import CartScreen from "./screens/CartScreen";
import ProductDetailsScreen from "./screens/ProductDetailsScreen";
import AdminProductScreen from "./adminscreens/adminProductScreen";
import AdminEditProductScreen from "./adminscreens/AdminEditProductScreen";
import AdminCreateProductScreen from "./adminscreens/AdminCreateProductScreen";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./components/Checkout";

const stripePromise = loadStripe("pk_test_51R569dAI5hRJlbg2cHevVDHtSdxDMhpsNclu71otYasl8yEAzCoUDJitAdBsBifmJNO4dF4gEdwzM55ie9hcbzGF00rspHN2yf");
// Admin Route Protection
const AdminRoute = ({ element }) => {
  const { user } = useAuth();
  return user?.isAdmin ? element : <Navigate to="/" />;
};

// Protected Route (Only logged-in users can access)
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/product/:id" element={<ProductDetailsScreen />} />
        
        {/* Protected Routes */}
        <Route path="/cart" element={<ProtectedRoute element={<CartScreen />} />} />

        {/* Admin Routes */}
        <Route path="/admin/products" element={<AdminRoute element={<AdminProductScreen />} />} />
        <Route path="/admin/edit-product/:id" element={<AdminRoute element={<AdminEditProductScreen />} />} />
        <Route path="/admin/create-product" element={<AdminRoute element={<AdminCreateProductScreen />} />} />

        <Route path="/checkout"element={<Elements stripe={stripePromise}><Checkout /></Elements>}/>
      </Routes>
    </>
  );
};

export default App;
