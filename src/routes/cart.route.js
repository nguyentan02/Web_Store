const express = require('express')
const router = express.Router();
const cartController = require('../app/controllers/cart.controller')

router.post('/addToCart/:id', cartController.addToCart);
router.get('/showCart/', cartController.showCart)
router.delete('/deleted/:id', cartController.deleteCart)
router.put('/update/:id', cartController.updateCartItem)
module.exports = router