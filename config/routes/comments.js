const express = require('express');
const router = express.Router();
const Comment = require('../../models/comments.model');
const passportJWT = require('../../middlewears/auth.middlewears');

router.get('/', (req, res) => {
  Comment.find({}).then(comments => {
    return res.status(200).json(comments);
  });
});

router.post('/', passportJWT, (req, res) => {
  let comment = {
    username: req.body.username,
    email: req.body.email,
    comment: req.body.comment,
    creation_dt: new Date(),
  };
  let newReservationt = new Comment(comment);
  newReservationt.save().then(commentDoc => res.json(commentDoc));
});

router.patch('/:id', passportJWT, (req, res) => {
  Comment.findByIdAndUpdate(
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
  Comment.findOneAndDelete({
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
