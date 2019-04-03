const mongoose = require('mongoose');

const Bookings = new mongoose.Schema({

  userID: {
    type: Number,
    default: -1
  },
  dateTime: {
    type: Date,
    default: Date.now
  },
  serviceChosen: {
    type: String,
    default: ''
  },
  preferences: {
    type: String,
    default: ''
  },
});

module.exports = mongoose.model('Bookings', Bookings);
