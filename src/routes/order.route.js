const express = require('express')
const router = express.Router();
const orderController = require('../app/controllers/order.controller')
const multer = require('multer');
const upload = multer();
router.post('/create', upload.none(), orderController.createOrder);
router.get('/detailOrder/:id', orderController.detailOrder)
router.put('/customer/:id', orderController.customerUpdate)
module.exports = router