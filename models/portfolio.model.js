const mongoose = require('mongoose');
const portfolio = mongoose.Schema;

const portfolioSchema = new portfolio({
  workName: { type: String, require: true },
  description: { type: String, require: true },
  photoUrl: { type: String, require: true },
  creation_dt: String,
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
