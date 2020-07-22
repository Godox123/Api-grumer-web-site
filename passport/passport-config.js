const passport = require('passport');

module.exports = app => {
  require('./passport');
  app.use(passport.initialize());
  app.use(passport.session());
};
