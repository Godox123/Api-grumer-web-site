const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { jwtSecret } = require('../config').environment;
const User = require('../models').User;

const headerExtractor = req => {
  let token = null;
  if (req && req.headers) {
    token = req.headers['access_token'];
  }
  return token;
};

// JSON WEB TOKENS STRATEGY
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: headerExtractor,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    },
    async (req, payload, done) => {
      try {
        const user = await User.findById(payload.sub);

        if (!user) {
          console.log('tut error');
          return done(null, false);
        }
        req.user = user;
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });

        if (!user) {
          return done(null, false);
        }

        const isMatch = await user.isValid(password);

        if (!isMatch) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id); // serializeUser определяет, какие данные пользовательского объекта должны храниться в сеансе.
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
