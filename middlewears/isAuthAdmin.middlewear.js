const User = require('../models/user');
const isAuthenticatedAdmin = (req, res, next) => {
  let currentUserId = req.user ? req.user._id : false;
  if (!currentUserId) {
    res.status(401).json({ message: 'Нет индитификатора.' });
    return;
  }

  User.findById(currentUserId, (err, user) => {
    if (err) {
      return res.status(500).json({ err });
    }
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Вы не админ, мы вас не звали.' });
    } else {
      next();
    }
  });
};
module.exports = isAuthenticatedAdmin;
