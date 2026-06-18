const Order = require('../models/model-order');
const Product = require('../models/model-product');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

    // Send email notification
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to the same email to notify the admin
        subject: `New Order Received - Sukoon`,
        html: `
          <h2>New Order Received</h2>
          <p><strong>Customer Name:</strong> ${customerName}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Quantity:</strong> ${orderQuantity}</p>
          <p><strong>Total Price:</strong> ${totalPrice} ج</p>
          <p><strong>Payment Method:</strong> ${paymentMethod || 'Cash on Delivery'}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('ar-EG')}</p>
        `
      };
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("Failed to send email notification:", mailError);
    }

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