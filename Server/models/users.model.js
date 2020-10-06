const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, trim: true },
  userName: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  isActive: { type: Boolean, required: true, default: false },
  lastName: { type: String, required: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  userType: { type: String, required: true, trim: true },
  permissions: { type: [] }
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;
