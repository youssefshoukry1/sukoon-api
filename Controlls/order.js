const Order = require('../models/model-order');
const Product = require('../models/model-product');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { customerName, phoneNumber, location, quantity, paymentMethod, totalPrice } = req.body;
    
    // Basic validation
    if (!customerName || !phoneNumber || !location) {
      return res.status(400).json({ success: false, message: "Name, phone, and location are required." });
    }

    const orderQuantity = quantity || 1;
    // Use totalPrice from frontend (already includes shipping cost)
    const finalPrice = totalPrice || 0;

    const order = new Order({
      customerName,
      phoneNumber,
      location,
      quantity: orderQuantity,
      totalPrice: finalPrice,
      paymentMethod
    });

    await order.save();

    res.status(201).json({ success: true, message: "Order created successfully", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get all orders (Admin side)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Cancel an order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  cancelOrder
};