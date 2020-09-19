const mongoose = require('mongoose');
const Reservation = mongoose.Schema;

const reservation = new Reservation({
  id: { type: String, require: true },
  username: { type: String, require: true },
  email: { type: String, require: true },
  selectDate: { type: Date, require: true },
  selectTime: { type: Number, require: true },
  photoUrl: { type: String, require: true },
  phone: { type: Number, require: true },
  price: { type: String, require: true },
  selectService: { type: String, require: true },
  creation_dt: { type: Date, require: true },
});

module.exports = mongoose.model('reservations', reservation);
