const Order = require('../models/model-order');
const Product = require('../models/model-product');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { customerName, phoneNumber, location, quantity, paymentMethod } = req.body;
    
    // Basic validation
    if (!customerName || !phoneNumber || !location) {
      return res.status(400).json({ success: false, message: "Name, phone, and location are required." });
    }

    // Assuming we fetch the single active product to get the price
    const product = await Product.findOne({ isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not available for order." });
    }

    const orderQuantity = quantity || 1;
    const totalPrice = product.price * orderQuantity;

    const order = new Order({
      customerName,
      phoneNumber,
      location,
      quantity: orderQuantity,
      totalPrice,
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

module.exports = {
  createOrder,
  getAllOrders
};