require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRouter = require('./Routes/order.route');
const productRouter = require('./Routes/product.route');

const app = express();
const url = process.env.MONGO_URL;

// ================= Middleware =================
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://sukoon-ten-beige.vercel.app"
  ],
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use('/uploads', express.static('uploads'));

// ================= DB =================
mongoose.connect(url)
  .then(() => console.log('MongoDB started'))
  .catch(err => console.log('MongoDB connection error:', err));

// ================= Routes =================
app.use('/api/orders', orderRouter);
app.use('/api/product', productRouter);

// ================= Server =================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
