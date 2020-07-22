const express = require('express');
const router = express.Router();
const Portfolio = require('../../models/portfolio.model');

router.get('/', (req, res) => {
  Portfolio.find({}).then(portfolio => {
    return res.status(200).json(portfolio);
  });
});
router.post('/', (req, res) => {
  let portfolio = {
    workName: req.body.workName,
    description: req.body.description,
    photoUrl: req.body.photoUrl,
    creation_dt: new Date(),
  };
  let newPortfolio = new Portfolio(portfolio);
  newPortfolio.save().then(portfolioDoc => res.json(portfolioDoc));
});

module.exports = router;
