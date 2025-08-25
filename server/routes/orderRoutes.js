const express = require("express");
const { createOrder, getOrders, getOrderById, confirmPayment } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createOrder);
router.post("/confirm-payment", protect, confirmPayment);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

module.exports = router;

