const mongoose = require('mongoose');
const Services = mongoose.Schema;

const services = new Services({
  servicename: { type: String, require: true },
  photoUrl: { type: String, require: true },
  description: { type: String, require: true },
  creation_dt: { type: Date, require: true },
});

module.exports = mongoose.model('services', services);
