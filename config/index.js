module.exports = {
  environment: require('./environment'),
  authRoutes: require('./routes').authRoutes,
  reservationRoutes: require('./routes').reservationRoutes,
  commentsRoutes: require('./routes').commentsRoutes,
  portfolioRoutes: require('./routes').portfolioRoutes,
};
