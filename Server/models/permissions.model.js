const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, trim: true },
    isGranted: { type: Boolean, required: true, default: false },
    level: { type: Number, required: true },
    child: { type: [], required: false }
});

const permissionModel = mongoose.model('permissions', permissionSchema);
module.exports = permissionModel;
