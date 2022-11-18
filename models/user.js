const { model, Schema } = require('mongoose');

const user = new Schema({
    username: String,
    email: String,
    avatar: String,
    password: String,
    token: String,
    admin: Boolean,
    recover: String,
    verification: {
        code: Number,
        state: Boolean
    }
})

module.exports = model('user', user)