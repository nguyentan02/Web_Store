const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete')
const cartItemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users', // Tham chiếu đến mô hình người dùng
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    statusCart: {
        type: Boolean,
        require: true,
        default: false
    }
});


cartItemSchema.plugin(mongoose_delete, {
    deletedAt: true, overrideMethods: 'all'
});
module.exports = mongoose.model('Cart', cartItemSchema);
