const express = require('express');
const router = express.Router();
const orderController = require('../Controlls/order');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.delete('/:id', orderController.cancelOrder);

module.exports = router;
