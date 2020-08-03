const mongoose = require('mongoose');
const Reservation = mongoose.Schema;

const reservation = new Reservation({
  id: { type: String, require: true },
  username: { type: String, require: true },
  email: String,
  selectDate: Date,
  selectTime: Number,
  phone: Number,
  selectService: String,
  creation_dt: { type: Date, require: true },
});

module.exports = mongoose.model('reservations', reservation);
