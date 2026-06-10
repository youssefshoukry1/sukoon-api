const Product = require('../models/model-product');

// Get all active products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Create a product (For admin)
const createProduct = async (req, res) => {
  try {
    const { name, subtitle, price, image, stock } = req.body;
    if(!name || !price) {
      return res.status(400).json({ success: false, message: "Name and Price are required" });
    }
    const product = new Product({ name, subtitle, price, image, stock });
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct
};