const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes (accessible to all users)
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", protect, adminProtect, createProduct);
router.put("/:id", protect, adminProtect, updateProduct);
router.delete("/:id", protect, adminProtect, deleteProduct);

module.exports = router;
