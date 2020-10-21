const mongoose = require('mongoose');
const portfolio = mongoose.Schema;

const portfolioSchema = new portfolio({
  // _id: { type: String, require: true },
  description: { type: String, require: true },
  photoUrlBefore: { type: String, require: true },
  photoUrlAfter: { type: String, require: true },
  creation_dt: String,
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
