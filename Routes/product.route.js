const express = require('express');
const router = express.Router();
const productController = require('../Controlls/product');

router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);

module.exports = router;
