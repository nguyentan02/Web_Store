const express = require('express')
const router = express.Router();
const orderController = require('../app/controllers/order.controller')

router.post('/create', orderController.createOrder);
router.get('/detailOrder/:id', orderController.detailOrder)
router.put('/customer/:id', orderController.customerUpdate)
module.exports = router