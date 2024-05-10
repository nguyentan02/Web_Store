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

