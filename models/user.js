const { Schema, model } = require("mongoose");

let user = Schema({
    username: String,
    avatar: String,
    email: String,
    password: String,
    token: String,
    recover: String,
    admin: Boolean,
    level: {
        xp: Number,
        lvl: Number
    },
    verification: {
        code: Number,
        verify: Boolean
    }
})

module.exports = model('user', user)