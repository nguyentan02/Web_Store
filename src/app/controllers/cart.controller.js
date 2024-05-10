const Cart = require('../models/cart.model')
const Product = require('../models/product.model')
const Order = require('../models/order.model')
async function addToCart(req, res, next) {
    try {

        const { productId, userId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Missing productId' });
        }
        // const existingUser = await User.findById(userId).lean()
        const existingCartItem = await Cart.findOne({ product: productId, statusCart: false });
        const productPrice = await Product.findById(productId).lean()
        if (existingCartItem) {
            existingCartItem.quantity += 1;
            existingCartItem.price = existingCartItem.quantity * productPrice.price
            await existingCartItem.save();
            return res.status(200).json({ message: 'Product added to cart', cartItem: existingCartItem });
        } else {

            const newCartItem = new Cart({
                user: userId,
                product: productId,
                quantity: 1,
                price: productPrice.price
            });
            await newCartItem.save();
            return res.status(201).json({ message: 'Product added to cart', cartItem: newCartItem });
        }
    } catch (error) {
        next(error);
    }
}
async function showCart(req, res, next) {
    try {
        const userId = req.query.userId;
        const carts = await Cart.find({ user: userId, statusCart: false }).lean();
        const products = [];
        let totalPrice = 0;
        for (const cartItem of carts) {
            const product = await Product.findById(cartItem.product).lean();

            if (product) {
                products.push({
                    name: product.name,
                    price: cartItem.price,
                    image: product.image,
                    quantity: cartItem.quantity,
                    cartId: cartItem._id,
                    user: cartItem.user,
                });
                totalPrice += product.price * cartItem.quantity;
            }

        }

        res.render('cart', { products, totalPrice, userId });

    } catch (error) {
        next(error);
    }
}
async function deleteCart(req, res, next) {
    try {

        const deletedCartItem = await Cart.deleteOne({ id: req.params._id })

        if (deletedCartItem.deletedCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }
        res.redirect('back')
    } catch (error) {
        next(error);
    }
}
async function updateCartItem(req, res, next) {
    try {
        const quantity = req.body;
        console.log(quantity);
        const updatedCartItem = await Cart.findByIdAndUpdate(
            req.params.id,
            quantity,
            { new: true } // Trả về bản ghi đã được cập nhật
        );
        if (!updatedCartItem) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }
        updatedCartItem.save()
        res.status(200).json({ message: 'Đã cập nhật số lượng sản phẩm trong giỏ hàng', updatedCartItem });

    } catch (error) {
        next(error);
    }
}

module.exports = { addToCart, showCart, deleteCart, updateCartItem };

