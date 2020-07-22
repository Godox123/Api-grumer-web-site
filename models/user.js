const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const schema = new Schema({
  email: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
  phone: Number,
  role: { type: String, default: 'user', require: true },
  passwords: [],
  resetPasswordToken: String,
  resetPasswordExpires: String,
  creation_dt: { type: Date, require: true },
});

schema.pre('save', function(next) {
  let user = this;
  let costFactor = 10;

  if (user.isModified('password')) {
    bcrypt.genSalt(costFactor, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

schema.methods.isValid = function(hashedpassword) {
  return bcrypt.compare(hashedpassword, this.password);
};

module.exports = mongoose.model('User', schema);
