const mongoose = require('mongoose');

const userTypeSchema = new mongoose.Schema({
    code: { type: Number, required: true },
    name: { type: String, required: true }
});

const userTypeModel = mongoose.model('usertypes', userTypeSchema);
module.exports = userTypeModel;
