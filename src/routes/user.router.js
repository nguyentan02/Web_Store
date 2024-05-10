const express = require('express')

const router = express.Router();

const userController = require('../app/controllers/user.controller')
const authenticateToken = require('../app/middlewares/auth.middleware');

router.post('/register', userController.register)
router.post('/login', userController.login)

router.get('/:id/profile', userController.edit)
router.put('/:id', userController.update)
router.post('/logout', userController.logout)


module.exports = router