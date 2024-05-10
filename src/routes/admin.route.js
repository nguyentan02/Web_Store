const express = require('express')
const router = express.Router();
const adminController = require('../app/controllers/admin.controller')
const productController = require('../app/controllers/products.controller')
const orderController = require('../app/controllers/order.controller')
router.get('/index', adminController.index)
router.get('/category', adminController.showCategory)
router.post('/createCtr', adminController.createCategory)
router.get('/category/:id/edit', adminController.editCategory)
router.put('/category/:id', adminController.updateCategory)
router.delete('/:id', adminController.deleteCate)

//Product
router.get('/products', productController.showPoduct)
router.get('/showCreate', productController.showCreate)
router.post('/createProduct', productController.createProduct)
router.get('/product/:id/edit', productController.editProduct)
router.put('/products/:id', productController.updateProduct)
router.delete('/deleted/:id', productController.deleteProduct)

//Order
router.get('/orders', orderController.showOrder)
module.exports = router