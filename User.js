const mongoose = require('mongoose');
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({

  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  }
});


module.exports = mongoose.model('User', UserSchema);
