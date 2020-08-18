const express = require('express');
const router = express.Router();
const Services = require('../../models/services.model');
const passportJWT = require('../../middlewears/auth.middlewears');
const isAuthenticatedAdmin = require('../../middlewears/isAuthAdmin.middlewear');

router.get('/', (req, res) => {
  Services.find({})
    .then(reservations => {
      return res.status(200).json(reservations);
    })
    .catch(err => res.status(501).json(err));
});

router.post('/', passportJWT, isAuthenticatedAdmin, (req, res) => {
  let service = {
    servicename: req.body.servicename,
    photoUrl: req.body.photoUrl,
    description: req.body.description,
  };

  new Services(service)
    .save()
    .then(() =>
      Services.find({})
        .then(resp => res.status(201).json(resp))
        .catch(err => res.status(501).json(err))
    )
    .catch(err => res.status(501).json(err));
});

router.patch('/:id', passportJWT, isAuthenticatedAdmin, (req, res) => {
  Services.findByIdAndUpdate(
    {
      _id: req.params.id,
    },
    { $set: req.body }
  )
    .then(() => {
      Services.find({})
        .then(resp => res.status(201).json(resp))
        .catch(err => {
          res.status(401).json(err);
          console.log(err);
        });
    })
    .catch(err => {
      res.status(401);
      console.log(err);
    });
});
router.delete('/:id', passportJWT, isAuthenticatedAdmin, (req, res) => {
  Services.findOneAndDelete({
    _id: req.params.id,
  })
    .then(() => {
      Services.find({})
        .then(reservations => res.status(200).json(reservations))
        .catch(err => {
          res.status(401).json(err);
          console.log(err);
        });
    })
    .catch(err => {
      res.status(401);
      console.log(err);
    });
});

module.exports = router;
