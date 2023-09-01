const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bankSchema = new Schema({
    name: { type: String, required: true },
    color: { type: String, required: true},
    fontColor: { type: String, required: true}
})

module.exports = mongoose.model('banks', bankSchema)