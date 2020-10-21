const express = require('express');
const router = express.Router();
const Portfolio = require('../../models/portfolio.model');
const passportJWT = require('../../middlewears/auth.middlewears');
const isAuthenticatedAdmin = require('../../middlewears/isAuthAdmin.middlewear');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/portfolio/');
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
  Portfolio.find({})
    .then(portfolio => {
      return res.status(200).json(portfolio);
    })
    .catch(err => res.status(501).json(err));
});

router.delete('/:id', passportJWT, isAuthenticatedAdmin, (req, res) => {
  Portfolio.findOneAndDelete({
    _id: req.params.id,
  })
    .then(() => {
      Portfolio.find({})
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

router.post(
  '/',
  passportJWT,
  isAuthenticatedAdmin,
  upload.any(),
  (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    let portfolio = {
      description: req.body.description,
      creation_dt: new Date(),
    };
    if ((req.files[0], req.files[1])) {
      req.files.forEach(elem => {
        if (elem.fieldname === 'photoUrlBefore') {
          portfolio.photoUrlBefore = url + '/images/portfolio/' + elem.filename;
        } else if (elem.fieldname === 'photoUrlAfter') {
          portfolio.photoUrlAfter = url + '/images/portfolio/' + elem.filename;
        }
      });
    } else {
      res.status(406).json({ message: 'Не удовлетворяет условию отправки' });
    }

    let newPortfolio = new Portfolio(portfolio);
    new Portfolio(newPortfolio)
      .save()
      .then(() =>
        Portfolio.find({})
          .then(resp => {
            return res.status(200).json(resp);
          })
          .catch(err => res.status(501).json(err))
      )
      .catch(err => res.status(501).json(err));
  }
);

router.patch(
  '/:id',
  passportJWT,
  isAuthenticatedAdmin,
  upload.any(),
  (req, res) => {
    const url = req.protocol + '://' + req.get('host');
    new Promise((resolve, reject) => {
      if (req.files === undefined) {
        resolve(
          Portfolio.findByIdAndUpdate(
            {
              _id: req.params.id,
            },
            { $set: req.body }
          )
        );
      } else {
        resolve(
          Portfolio.findByIdAndUpdate(
            {
              _id: req.params.id,
            },
            { $set: req.body },
            {
              $set: req.files.forEach(elem => {
                if (elem.fieldname === 'photoUrlBefore') {
                  req.body.photoUrlBefore =
                    url + '/images/portfolio/' + elem.filename;
                } else if (elem.fieldname === 'photoUrlAfter') {
                  req.body.photoUrlAfter =
                    url + '/images/portfolio/' + elem.filename;
                }
              }),
            }
          )
        );
      }
      reject(err => console.log(err));
    })
      .then(() => {
        Portfolio.find({})
          .then(resp => {
            res.status(201).json(resp);
          })
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

module.exports = router;
