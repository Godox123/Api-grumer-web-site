const mongoose = require('mongoose');
const Comment = mongoose.Schema;

const comment = new Comment({
  username: { type: String, require: true },
  email: String,
  comment: String,
  creation_dt: { type: Date, require: true },
});

module.exports = mongoose.model('comment', comment);
