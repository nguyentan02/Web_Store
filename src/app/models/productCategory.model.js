const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('mongoose-slug-updater');
const mongoose_delete = require('mongoose-delete');
const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        require: true
    },
    slug: { type: String, slug: "name", unique: true },
}, {
    timestamps: true,
});
mongoose.plugin(slug);
categorySchema.plugin(mongoose_delete);
module.exports = mongoose.model('CategoryProducts', categorySchema);

