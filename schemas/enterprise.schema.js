const mongoose = require('mongoose')
const Schema = mongoose.Schema

const enterpriseSchema = new Schema({
    name: {type: String, required: true, minLength: 0, maxLength: 500, index: true},
    color:{type: String, required: true, minLength: 0, maxLength: 500, index: true},
    fontColor:{type: String, required: true, minLength: 0, maxLength: 500, index: true}
})

module.exports = mongoose.model('enterprises', enterpriseSchema)