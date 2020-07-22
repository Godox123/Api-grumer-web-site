const User = require('../models/user');
const passport = require('passport');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const JWT = require('jsonwebtoken');
const { jwtSecret } = require('../config/environment');

const signToken = user => {
  return JWT.sign(
    {
      iss: 'CodeWorkr',
      sub: user.id,
    },
    jwtSecret,
    { expiresIn: '2h' }
  );
};

const signUp = async (req, res) => {
  let foundUserEmail = await User.findOne({ email: req.body.email });
  if (foundUserEmail) {
    return res.status(403).json({ error: 'Данный Email  уже занят.' });
  }
  const user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwords: [],
    phone: req.body.phone,
    creation_dt: Date.now(),
  });
  try {
    user.passwords.push(user.password);
    const token = signToken(user);
    res.header('access_token', token);
    await user.save();
    return res.status(201).json({
      token: token,
    });
  } catch (err) {
    return res.status(501).json(err);
  }
};

const signIn = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(501).json(err);
    }
    if (!user) {
      return res
        .status(501)
        .json({ message: 'Не правильное имя пользователя или пароль.' });
    }
    req.logIn(user, err => {
      if (err) {
        return res.status(501).json(err);
      } else {
        const token = signToken(user);
        res.header('access_token', token);
        return res.status(200).json({
          token: token,
        });
      }
    });
  })(req, res, next);
};

const signOut = async (req, res, next) => {
  try {
    await req.logout();
    res.json({ success: true });
    return next();
  } catch (err) {
    return err;
  }
};

const forgot = (req, res) => {
  async.waterfall(
    [
      done => {
        crypto.randomBytes(20, function(err, buf) {
          const token = buf.toString('hex');
          done(err, token);
        });
      },
      (token, done) => {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (err) {
            res.status(501).json(err);
          }
          if (!user) {
            return res.status(404).json({ message: 'Ваш Email не найден.' });
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000;
          user.save(err => {
            done(err, token, user);
          });
        });
      },
      (token, user) => {
        const smtpTrans = nodemailer.createTransport({
          service: 'yandex',
          auth: {
            user: 'godox123123@yandex.by',
            pass: 'godox123',
          },
        });
        const mailOptions = {
          to: user.email,
          from: 'godox123123@yandex.by',
          subject: 'Node.js Password Reset',
          text:
            'Вы получили это письмо потому что запросили сброс вашего пароля.\n\n' +
            'Пожалуйста нажмите на эту ссылку или вставьте ее в браузер:\n\n' +
            'http://' +
            // 'localhost:3000' +
            'localhost:4200' +
            '/auth' +
            '/reset/' +
            token +
            '\n\n' +
            'Если вы не запрашивали новый пароль,то ничего не делайте и ваш пароль останется прежним.Так же в целях безопасности аккаунта сообщите об этом сообщении админитсрации сайта.\n',
        };

        smtpTrans.sendMail(mailOptions, err => {
          if (err) {
            res.status(501).json(err);
          }
          res.status(200).json({
            message:
              'Запрос на изменение пароля был успешно отправлен,пожалуйста проверьте вашу электронную почту.\n\n ' +
              user.email +
              ' ' +
              'с дальнейшими инструкциями.',
          });
        });
      },
    ],
    err => {
      return res.json(err);
    }
  );
};

const reset = (req, res) => {
  async.waterfall(
    [
      done => {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          (err, user, next) => {
            try {
              if (err) {
                res.json(err);
              }
              if (!user) {
                res.status(406).json({
                  message:
                    'Не удалось изменить пароль.Не валидный ключ доступа.',
                });
                throw new Error('undefined Error');
              }
              if (user.passwords.includes(req.body.password, 0)) {
                return res.status(406).json({
                  message: 'Вы уже использовали этот пароль,введите другой.',
                });
              } else {
                user.passwords.push(req.body.password);
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save(err => {
                  if (err) {
                    return res.status(501).json(err);
                  } else {
                    res
                      .status(200)
                      .json({ message: 'Ваш пароль изменен успешно.' });
                    done(err, user);
                  }
                });
              }
            } catch (err) {
              if (err === 'undefined Error') {
                throw err;
              }
            }
          }
        );
      },

      (user, done) => {
        const smtpTrans = nodemailer.createTransport({
          service: 'yandex',
          auth: {
            user: 'godox123123@yandex.by',
            pass: 'godox123',
          },
        });
        const mailOptions = {
          to: user.email,
          from: 'godox123123@yandex.by',
          subject: 'Your password has been changed',
          text:
            'Привет,\n\n' +
            ' - Это подтверждение изменения пароля. ' +
            user.email +
            ' Ваш пароль только что был изменен.\n',
        };
        smtpTrans.sendMail(mailOptions, err => {
          req.status(200).json({ message: 'Ваш пароль был успешно изменен.' });
          done(err);
        });
      },
    ],
    err => {
      res.json(err);
    }
  );
};

try {
  console.log('ok');
} catch (e) {
  console.log('Внешний catch поймал: ' + e);
}

module.exports = {
  signIn,
  signOut,
  signUp,
  forgot,
  reset,
};
