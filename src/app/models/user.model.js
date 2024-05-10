const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Users = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            validate: [
                (val) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val),
            ]
        },
        password: {
            type: String,
            required: true,
            min: 6
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        refresh_token: String,
    },
    {
        virtuals: {
            id: {
                get() {
                    return this._id
                }
            }
        },
        timestamps: true,
    }
)

module.exports = mongoose.model('Users', Users);
