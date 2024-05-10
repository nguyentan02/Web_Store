
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Order = require('../models/order.model')
const Cart = require('../models/cart.model')
const { mongooseToObject } = require('../../utils/mongoose');
async function register(req, res) {
    const { username, email, password, password_confirm } = req.body

    if (!username || !email || !password || !password_confirm) {
        return res.status(422).json({ 'message': 'Invalid fields' })
    }

    if (password !== password_confirm) return res.status(422).json({ 'message': 'Passwords do not match' })

    const userExists = await User.exists({ email }).exec()

    if (userExists) return res.sendStatus(409)

    try {
        hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({ email, username, password: hashedPassword })
        return res.status(201).json({ userId: newUser._id })

    } catch (error) {
        return res.status(400).json({ message: "Could not register" })
    }
}

async function login(req, res) {
    const { email, password } = req.body

    if (!email || !password) return res.status(422).json({ 'message': 'Invalid fields' })

    const user = await User.findOne({ email }).exec()

    if (!user) return res.status(401).json({ message: "Email or password is incorrect" })

    const match = await bcrypt.compare(password, user.password)

    if (!match) return res.status(401).json({ message: "Email or password is incorrect" })

    const accessToken = jwt.sign(
        {
            id: user._id
        },
        'jwttoken',
        {
            expiresIn: '1800s'
        }
    )

    const refreshToken = jwt.sign(
        {
            id: user._id
        },
        'jwttoken',
        {
            expiresIn: '1d'
        }
    )

    user.refresh_token = refreshToken
    await user.save()
    res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    req.session.username = user.username;
    res.json({ access_token: accessToken, username: user.username, userId: user._id, role: user.role })
}

async function logout(req, res) {
    const cookies = req.cookies
    if (!cookies.refresh_token) return res.sendStatus(204)

    const refreshToken = cookies.refresh_token
    const user = await User.findOne({ refresh_token: refreshToken }).exec()

    if (!user) {
        res.clearCookie('refresh_token', { httpOnly: true })
        return res.sendStatus(204)
    }

    user.refresh_token = null
    await user.save()
    res.clearCookie('refresh_token', { httpOnly: true })
    req.session.destroy()
    res.status(204).json({ message: 'Logout seccessfuly' })

}


async function edit(req, res, next) {
    try {
        const user = await User.findById(req.params.id).lean();
        const orders = await Order.find({ user: req.params.id }).lean();

        res.render('user/editUser', { user, orders })
    }
    catch (error) {
        next(error);
    }
}
async function update(req, res, next) {
    try {
        const { username, password } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        if (username && username !== user.username) {
            user.username = username;
        }

        // Kiểm tra xem có chỉnh sửa password không
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        // Lưu thông tin người dùng đã chỉnh sửa vào cơ sở dữ liệu
        await user.save();
        return res.redirect(`/api/v1/users/${user._id}/profile`);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { register, login, edit, logout, update }