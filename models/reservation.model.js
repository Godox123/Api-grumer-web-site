const mongoose = require('mongoose');
const Reservation = mongoose.Schema;

const reservation = new Reservation({
  username: { type: String, require: true },
  email: String,
  selectDate: Date,
  selectTime: String,
  phone: Number,
  selectService: String,
  creation_dt: { type: Date, require: true },
});

module.exports = mongoose.model('reservations', reservation);
