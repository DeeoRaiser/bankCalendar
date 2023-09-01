const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    userName: { type: String, required: true, minLength: 1, maxLength: 100, index: true, unique: true },
    pass: { type: String, required: true, minLength: 8, maxLength: 150 },
    role: {
        type: String,
        required: true,
        enum: [
            'ADMIN_ROLE',
            'USER_CREATOR',
            'ONLY_WATCH'
        ]
    },
})



module.exports = mongoose.model('User', userSchema)