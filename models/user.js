const { model, Schema} = require('mongoose');

const user = new Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    admin: Boolean,
    verification: {
        code: Number,
        state: Boolean
    }
})

module.exports = model('user', user)