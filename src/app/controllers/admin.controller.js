const Category = require('../models/productCategory.model')
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const { mutipleMongooseToObject, mongooseToObject } = require('../../utils/mongoose');

async function index(req, res, next) {
    res.render('admin/index',)
}

async function showCategory(req, res, next) {
    Category.find({})
        .lean()
        .then((category) => {
            res.render("admin/catogery", { category });
        })
        .catch((error) => {
            next(error);
        });
}
// async function showHome(req, res, next) {
//     Category.find({})
//         .lean()
//         .then((category) => {
//             res.render("partials/header", { category });
//         })
//         .catch((error) => {
//             next(error);
//         });
// }
const uploadDirectory = './uploads';

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });
async function createCategory(req, res, next) {
    // Xử lý tải lên tệp hình ảnh sử dụng middleware multer
    upload.single('formFile')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Xử lý lỗi từ multer
            return res.status(500).json({ message: 'Error uploading file' });
        } else if (err) {
            // Xử lý lỗi khác
            return res.status(500).json({ message: err.message });
        }


        try {
            const { name } = req.body;
            const image = req.file.filename;

            const newCategory = await Category.create({ name, image });

            // Trả về phản hồi thành công
            return res.status(201).json({ message: 'Category created successfully', category: newCategory });
        } catch (error) {
            // Xử lý lỗi nếu có
            return res.status(500).json({ message: 'Could not create category', error: error.message });
        }
    });
}
async function editCategory(req, res, next) {

    Category.findById(req.params.id)
        .then(category =>
            res.render('admin/editCategory', { category: mongooseToObject(category) }))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: "Internal server error" });
        });
}
async function updateCategory(req, res, next) {
    upload.single('formFile')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // Xử lý lỗi từ multer
            return res.status(500).json({ message: 'Error uploading file' });
        } else if (err) {
            // Xử lý lỗi khác
            return res.status(500).json({ message: err.message });
        }

        try {
            const { name } = req.body;
            let image = null;
            if (req.file) {
                image = req.file.filename;
                const category = await Category.findById(req.params.id).lean();
                if (category.image) {
                    const imagePath = path.join(__dirname, '..', '..', '..', 'uploads', category.image);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }
            }
            const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name, image }, { new: true });
            updatedCategory.save()
            res.redirect(".")
        } catch (error) {

            return res.status(500).json({ message: 'Could not update category', error: error.message });
        }
    });
}
async function deleteCate(req, res, next) {
    const category = await Category.findById(req.params.id).lean();
    if (category.image) {
        const imagePath = path.join(__dirname, '..', '..', '..', 'uploads', category.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
    Category.deleteOne({ id: req.params._id })
        .then(() => res.redirect('back'))
        .catch(next)
}

module.exports = { index, showCategory, createCategory, editCategory, updateCategory, deleteCate }