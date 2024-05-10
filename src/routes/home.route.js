const express = require('express')

const router = express.Router();
const homeController = require('../app/controllers/home.controller')
router.get('/home', homeController.index)
router.get('/:id/detail', homeController.detailProduct)

module.exports = router