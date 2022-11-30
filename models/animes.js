const { model, Schema } = require('mongoose');

const animes = new Schema({
    fullName: String,
    name: String,
    thumbnail: String,
    description: String,
    eps: [{
        number: Number,
        url: String
    }]
})

module.exports = model('anime', animes)