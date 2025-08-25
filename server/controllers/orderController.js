const Stripe = require("stripe")
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");
const dotenv = require("dotenv");
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables.");
}
const createOrder = async (req, res) => {
  try {
    console.log("🛠️ Order Request Received:", req.body);

    const { orderItems, totalPrice, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      console.error("❌ No order items received!");
      return res.status(400).json({ message: "No order items" });
    }

    console.log("✅ Order Items:", orderItems);

    if (!req.user) {
      console.error("❌ User not authenticated!");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: "usd",
      metadata: { integration_check: "accept_a_payment" },
    });

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      isPaid: false,
      transactionId: paymentIntent.id,
    });

    const createdOrder = await order.save();
    console.log("✅ Order Created Successfully:", createdOrder);

    res.status(201).json({
      order: createdOrder,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("❌ Server Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const order = await Order.findById(orderId).populate("user", "email");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Step 1: Mark the order as paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.transactionId = paymentIntentId;

    await order.save();

    // Step 2: Send confirmation email
    if (order.user.email) {
      await sendEmail(
        order.user.email,
        "Order Confirmation",
        `Your order with ID ${orderId} has been successfully placed!`
      );
    }

    res.status(200).json({ message: "Payment successful, order updated!" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Ensure confirmPayment is exported
module.exports = { createOrder, confirmPayment, getOrders, getOrderById };
