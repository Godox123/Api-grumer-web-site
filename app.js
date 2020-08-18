const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {
  authRoutes,
  reservationRoutes,
  commentsRoutes,
  portfolioRoutes,
  servicesRoutes,
} = require('./config');

const PassportAuth = require('./passport/passport-config');

const { mongoUri, port } = require('./config').environment;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, access_token'
  );
  next();
});

mongoose
  .connect(mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connect to mongoose data base!'))
  .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
PassportAuth(app);
app.use('/auth', authRoutes);
app.use('/reservations', reservationRoutes);
app.use('/comments', commentsRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/services', servicesRoutes);

app.listen(port, () => console.log('Server started.'));
