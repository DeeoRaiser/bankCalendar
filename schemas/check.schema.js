const mongoose = require('mongoose')
const Schema = mongoose.Schema

const checkSchema = new Schema({
    amount: { type: Number, required: true },
    note: { type: String, required: false, minLength: 0, maxLength: 500 },
    bank: {
        type: String,
        required: function() {
            return this.isNew;
        }
    },
    enterprise:{ type: String, required: true, minLength: 0, maxLength: 500 },
    createDate: { type: Date, required: true },
    debitDate: { type: Date, required: true }
})

module.exports = mongoose.model('checks', checkSchema)