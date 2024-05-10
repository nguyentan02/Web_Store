// const { model, models } = require('mongoose')
const Order = require('../models/order.model')
const Cart = require('../models/cart.model')
const shortid = require('shortid');
const { format } = require('date-fns-tz');


async function createOrder(req, res, next) {
    try {
        const { userId, name, phoneNumber, province, district, ward, address, cartId, totalPrice } = req.body;
        console.log(userId, name, phoneNumber, province, district, ward, address, cartId, totalPrice);

        const orderCode = shortid.generate();
        // Kiểm tra xem tất cả các trường cần thiết có được cung cấp không
        if (!userId || !name || !phoneNumber || !province || !district || !ward || !address || !cartId || !totalPrice) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const newOrder = new Order({
            orderCode, user: userId, name, phoneNumber, province, district, ward, address, cartId, totalPrice
        });
        await newOrder.save();
        await Cart.updateMany({ _id: { $in: cartId } }, { statusCart: true });
        return res.status(201).json({ message: 'Product created successfully', order: newOrder });
    } catch (error) {
        return res.status(500).json({ message: 'Could not create category', error: error.message });
    }
}
async function detailOrder(req, res, next) {
    // let totalOrderPrice = 0;
    const idOrder = req.params.id;
    const orders = await Order.findById(idOrder).lean()
    // console.log(orders);
    let totalOrderPrice = 0;
    const orderDetailsMap = new Map();
    const orderDetails = []
    for (const cartId of orders.cartId) {
        if (cartId) {
            const cart = await Cart.find({ _id: cartId, statusCart: true }).populate('product').lean();
            console.log(cart);
            if (cart.length > 0) {
                const { product, quantity } = cart[0];
                const { name, image, price } = product;
                const orderPrice = price * quantity; // Tính giá của mỗi đơn hàng
                totalOrderPrice += orderPrice
                orderDetails.push({ name, image, price, quantity });

            }
        }
        orderDetailsMap.set(orders._id, orderDetails);
    }
    const orderIds = Array.from(orderDetailsMap.keys());
    let orderDetail = []
    for (const orderId of orderIds) {
        orderDetail = orderDetailsMap.get(orderId);
    }
    const vietnameseTimezone = 'Asia/Ho_Chi_Minh';
    // Sử dụng format từ date-fns-tz để chuyển đổi thời gian sang múi giờ Việt Nam
    const createdAt = orders.createdAt
    const createdAtFormat = format(createdAt, 'HH:mm:ss dd/MM/yyyy', { timeZone: vietnameseTimezone })

    res.render('order/infoOrder', { orders, orderDetail, createdAtFormat })
}
async function detailOrderAdmin(req, res, next) {
    // let totalOrderPrice = 0;
    const idOrder = req.params.id;
    const orders = await Order.findById(idOrder).lean()
    // console.log(orders);
    let totalOrderPrice = 0;
    const orderDetailsMap = new Map();
    const orderDetails = []
    for (const cartId of orders.cartId) {
        if (cartId) {
            const cart = await Cart.find({ _id: cartId, statusCart: true }).populate('product').lean();
            if (cart.length > 0) {
                const { product, quantity } = cart[0];
                const { name, image, price } = product;
                const orderPrice = price * quantity; // Tính giá của mỗi đơn hàng
                totalOrderPrice += orderPrice
                orderDetails.push({ name, image, price, quantity });

            }
        }
        orderDetailsMap.set(orders._id, orderDetails);
    }
    const orderIds = Array.from(orderDetailsMap.keys());
    let orderDetail = []
    for (const orderId of orderIds) {
        orderDetail = orderDetailsMap.get(orderId);
    }
    const vietnameseTimezone = 'Asia/Ho_Chi_Minh';
    // Sử dụng format từ date-fns-tz để chuyển đổi thời gian sang múi giờ Việt Nam
    const createdAt = orders.createdAt
    const createdAtFormat = format(createdAt, 'HH:mm:ss dd/MM/yyyy', { timeZone: vietnameseTimezone })

    res.render('order/infoOrderAdmin', { orders, orderDetail, createdAtFormat })
}
async function customerUpdate(req, res, next) {
    const orderId = req.params.id
    const status = req.query.status;
    var statusNew;
    if (status == 'pending') {
        statusNew = 'cancelled'
    } else if (status == 'cancelled') {
        statusNew = 'pending'
    } else { statusNew = 'finish' }
    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: statusNew }, { new: true });
        res.redirect('back')
    } catch (error) {
        next(error);
    }
}

async function adminUpdate(req, res, next) {
    const orderId = req.params.id
    const status = req.query.status;
    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status: status }, { new: true });
        res.redirect('back')
    } catch (error) {
        next(error);
    }
}

async function showOrder(req, res, next) {
    try {
        const orders = await Order.find().lean();
        const vietnameseTimezone = 'Asia/Ho_Chi_Minh';
        for (const order of orders) {
            const createdAt = order.createdAt;
            // Format ngày cho mỗi đơn hàng
            order.createdAt = format(createdAt, 'HH:mm:ss dd/MM/yyyy', { timeZone: vietnameseTimezone });
        }
        res.render('admin/order', { orders });
    } catch (error) {
        next(error);
    }

}

module.exports = { createOrder, detailOrder, customerUpdate, showOrder, detailOrderAdmin, adminUpdate }