const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  paymentMethod: { type: String, default: 'Cash on Delivery' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);