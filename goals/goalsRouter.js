const express = require('express');
const router = express.Router();
const restricted = require('../auth/authMiddleware.js');
const Goals = require('./goalsModel.js');

router.get('/', (req, res) => {
  res.status(200).send('Welcome to the Goals Router! 💡');
});

router.get('/all', restricted, (req, res) => {
  Goals.getGoals()
    .then((goals) => {
      res.status(200).json(goals);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: 'Failed to retrieve goals',
      });
    });
});

router.post('/new', (req, res) => {
  const goal = req.body;
  Goals.addGoal(goal)
    .then((added_goal) => {
      res.status(201).json(added_goal);
    })
    .catch((err) => {
      res.status(500).json({ error: err, message: 'Failure to add new goal.' });
    });
});

module.exports = router;
