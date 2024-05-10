const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoose_delete = require('mongoose-delete');
const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        require: true
    },
    screen: {
        type: String,
        required: true
    },
    operatingSystem: {
        type: String,
        required: true
    },
    rearCamera: {
        type: String,
        required: true
    },
    frontCamera: {
        type: String,
        required: true
    },
    chip: {
        type: String,
        required: true
    },
    ram: {
        type: String,
        required: true
    },
    storageCapacity: {
        type: String,
        required: true
    },
    sim: {
        type: String,
        required: true
    },
    battery: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    networkSup: {
        type: String,
        required: true
    },
    sensor: {
        type: String,
        require: true
    },
    material: {
        type: String,
        require: true
    },
    since: {
        type: String,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'CategoryProducts',
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
productSchema.plugin(mongoose_delete);
module.exports = mongoose.model('Product', productSchema);