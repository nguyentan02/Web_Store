const userRouter = require('./user.router')
const homeRouter = require('./home.route')
const adminRouter = require('./admin.route')
const cartRouter = require('./cart.route')
const orderRouter = require('./order.route')
const { Router } = require('express');


const router = Router();

router.use('/users', userRouter)
router.use('/', homeRouter);
router.use('/admin', adminRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)
module.exports = router;