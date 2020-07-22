const express = require('express');
const router = express.Router();
const Reservation = require('../../models/reservation.model');
const passportJWT = require('../../middlewears/auth.middlewears');

router.get('/', passportJWT, (req, res) => {
  Reservation.find({}).then(reservations => {
    console.log(reservations);
    return res.status(200).json(reservations);
  });
});

router.post('/', (req, res) => {
  let reservation = {
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    selectDate: req.body.selectDate,
    selectTime: req.body.selectTime,
    selectService: req.body.selectService,
    creation_dt: new Date(),
  };
  let newReservationt = new Reservation(reservation);
  newReservationt.save().then(reservationDoc => res.json(reservationDoc));
});

router.patch('/:id', passportJWT, (req, res) => {
  Reservation.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    { $set: req.body }
  )
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(401);
      console.log(err);
    });
});

router.delete('/:id', passportJWT, (req, res) => {
  Reservation.findOneAndDelete({
    _id: req.params.id,
  })
    .then(() => {
      res.status(200).json({ status: 'ok' });
    })
    .catch(err => {
      res.status(401);
      console.log(err);
    });
});

module.exports = router;
