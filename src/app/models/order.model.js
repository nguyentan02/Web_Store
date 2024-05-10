const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete')
const shortid = require('shortid');
const orderItem = new Schema({
    orderCode: {
        type: String,
        unique: true,

    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    ward: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    cartId: [{  // Sử dụng một mảng để lưu nhiều cartId
        type: Schema.Types.ObjectId,
        ref: 'Cart', // Tham chiếu đến mô hình giỏ hàng
        required: true
    }],
    totalPrice: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'fisnish'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

orderItem.plugin(mongoose_delete);
module.exports = mongoose.model('order', orderItem);
