const express = require('express');
const router = express.Router();
const Services = require('../../models/services.model');
const passportJWT = require('../../middlewears/auth.middlewears');
const isAuthenticatedAdmin = require('../../middlewears/isAuthAdmin.middlewear');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.get('/', (req, res) => {
  Services.find()
    .select('servicename photoUrl description')
    .exec()
    .then(services => {
      return res.status(200).json(services);
    })
    .catch(err => res.status(501).json(err));
});

router.post(
  '/',
  passportJWT,
  isAuthenticatedAdmin,
  upload.single('photoUrl'),
  (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    let service = {
      servicename: req.body.servicename,
      price: req.body.price,
      photoUrl: url + '/images/' + req.file.filename,
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
  }
);

router.patch(
  '/:id',
  passportJWT,
  isAuthenticatedAdmin,
  upload.single('photoUrl'),
  (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    new Promise((resolve, reject) => {
      if (req.file === undefined) {
        resolve(
          Services.findByIdAndUpdate(
            {
              _id: req.params.id,
            },
            { $set: req.body }
          )
        );
      } else {
        resolve(
          Services.findByIdAndUpdate(
            {
              _id: req.params.id,
            },
            { $set: req.body },
            { $set: req.body.photoUrl = url + '/images/' + req.file.filename }
          )
        );
      }
      reject(err => console.log(err));
    })
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
  }
);
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
