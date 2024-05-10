
const User = require('../models/user.model')
const Product = require('../models/product.model');
const { render } = require('sass');
async function index(req, res, next) {
    const username = req.session.username;
    const products = await Product.find({}).lean();
    res.render('home', { name: username, products });

}
async function detailProduct(req, res, next) {

    try {
        // Lấy ngẫu nhiên 3 sản phẩm từ cơ sở dữ liệu
        const product = await Product.findById(req.params.id).lean();
        const randomProducts = await Product.aggregate([{ $sample: { size: 3 } }]);

        // Truyền dữ liệu sản phẩm ngẫu nhiên lấy được vào template và render trang
        res.render('detailProduct', { product, ramdom: randomProducts });
    } catch (error) {
        next(error);
    }
}

module.exports = { index, detailProduct }