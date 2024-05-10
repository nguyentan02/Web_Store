const Product = require('../models/product.model')
const Category = require('../models/productCategory.model')
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { mutipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');

async function showPoduct(req, res, next) {

    try {
        const category = await Category.find({}).lean();
        const products = await Product.find({}).lean();
        res.render("admin/products", { category, products });
    } catch (error) {
        next(error);
    }
}
async function showCreate(req, res, next) {
    try {
        const category = await Category.find({}).lean();

        res.render("admin/createProducts", { category });
    } catch (error) {
        next(error);
    }
}
const uploadDirectory = './uploads/productImgs';

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/productImgs');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const uploadImg = multer({ storage: storage });
async function createProduct(req, res, next) {
    uploadImg.single('formFile')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Xử lý lỗi từ multer
            return res.status(500).json({ message: 'Error uploading file' });
        } else if (err) {
            // Xử lý lỗi khác
            return res.status(500).json({ message: err.message });
        }
        try {
            const { name, code, screen, operatingSystem, rearCamera, frontCamera,
                chip, ram, storageCapacity, sim, battery, category, manufacturer, networkSup, sensor, material, since, price } = req.body;

            const image = req.file.filename;

            const newProduct = await Product.create({
                name, code, screen, operatingSystem, rearCamera, frontCamera,
                chip, ram, storageCapacity, sim, battery, category, manufacturer, networkSup, sensor, material, since, price, image
            });
            // Trả về phản hồi thành công
            return res.status(201).json({ message: 'Product created successfully', product: newProduct });
        } catch (error) {
            // Xử lý lỗi nếu có
            return res.status(500).json({ message: 'Could not create category', error: error.message });
        }

    })
}
async function editProduct(req, res, next) {
    try {
        const product = await Product.findById(req.params.id).lean();
        const category = await Category.find({}).lean();
        res.render("admin/editProduct", { product, category })
    } catch (error) {

    }

}
async function updateProduct(req, res, next) {
    uploadImg.single('formFile')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Xử lý lỗi từ multer
            return res.status(500).json({ message: 'Error uploading file' });
        } else if (err) {
            // Xử lý lỗi khác
            return res.status(500).json({ message: err.message });
        }


        try {
            const { name, code, screen, operatingSystem, rearCamera, frontCamera,
                chip, ram, storageCapacity, sim, battery, category, manufacturer, networkSup, sensor, material, since, price } = req.body;
            let image = null;
            if (req.file) {
                image = req.file.filename;
                const product = await Product.findById(req.params.id).lean();
                if (product.image) {
                    const imagePath = path.join(__dirname, '..', '..', '..', 'uploads/productImgs', product.image);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }
            }
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
                name, code, screen, operatingSystem, rearCamera, frontCamera,
                chip, ram, storageCapacity, sim, battery, category, manufacturer, networkSup, sensor, material, since, price, image
            }, { new: true });
            updatedProduct.save()
            res.redirect(".")
        } catch (error) {

            return res.status(500).json({ message: 'Could not update category', error: error.message });
        }
    });
}
async function deleteProduct(req, res, next) {
    const product = await Product.findById(req.params.id).lean();
    if (product.image) {
        const imagePath = path.join(__dirname, '..', '..', '..', 'uploads/productImgs', product.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
    Product.deleteOne({ id: req.params._id })
        .then(() => res.redirect('back'))
        .catch(next)
}
module.exports = { showPoduct, createProduct, showCreate, editProduct, updateProduct, deleteProduct }