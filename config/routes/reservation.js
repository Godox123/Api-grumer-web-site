const express = require('express');
const router = express.Router();
const Reservation = require('../../models/reservation.model');
const passportJWT = require('../../middlewears/auth.middlewears');

router.get('/', (req, res) => {
  Reservation.find({}).then(reservations => {
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
  let newReservation = new Reservation(reservation);
  newReservation
    .save()
    .then(() => Reservation.find({}).then(resp => res.status(201).json(resp)));
});

router.patch('/:id', passportJWT, (req, res) => {
  Reservation.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    { $set: req.body }
  )
    .then(() => {
      Reservation.find({}).then(resp => res.status(201).json(resp));
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
      Reservation.find({}).then(reservations =>
        res.status(200).json(reservations)
      );
    })
    .catch(err => {
      res.status(401);
      console.log(err);
    });
});

module.exports = router;
