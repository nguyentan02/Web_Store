
const Product = require('../models/product.model');
const Category = require('../models/productCategory.model');


const formatProductPrices = (products) => {
    // Lặp qua từng sản phẩm và định dạng giá của nó
    return products.map(product => {
        // Thực hiện định dạng giá ở đây, ví dụ: chuyển từ kiểu số sang chuỗi tiền tệ Việt Nam
        product.price = formatPrice(product.price);
        return product;
    });
};
function formatPrice(price) {
    // Định dạng giá tiền thành dấu chấm phẩy và thêm VND vào sau
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

async function index(req, res, next) {
    const username = req.session.username;
    let products = await Product.find({}).lean();
    const category = await Category.find({}).lean();
    // Định dạng giá của sản phẩm trước khi render
    products = formatProductPrices(products);
    res.render('home', { name: username, products, category });

}
async function detailProduct(req, res, next) {

    try {
        // Lấy ngẫu nhiên 3 sản phẩm từ cơ sở dữ liệu
        const product = await Product.findById(req.params.id).lean();
        const price = formatPrice(product.price)
        let randomProducts = await Product.aggregate([{ $sample: { size: 3 } }]);
        randomProducts = formatProductPrices(randomProducts);
        // Truyền dữ liệu sản phẩm ngẫu nhiên lấy được vào template và render trang
        res.render('detailProduct', { product, price, ramdom: randomProducts });
    } catch (error) {
        next(error);
    }
}

module.exports = { index, detailProduct }