const express = require('express');
const router = express.Router();
const restricted = require('../auth/authMiddleware.js');
const Goals = require('./goalsModel.js');

router.get('/', (req, res) => {
  res.status(200).send('Welcome to the Goals Router! 💡');
});

/* General goal endpoints (not specific to a user) */

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

// Add a goal. Note: this DOESN'T connect a goal to a specific user
// It returns the new goal.
router.post('/', restricted, (req, res) => {
  const goal = req.body; // Needs 'title' and optionally, 'description'
  Goals.addGoal(goal)
    .then((added_goal) => {
      res.status(201).json(added_goal);
    })
    .catch((err) => {
      res.status(500).json({ error: err, message: 'Failure to add new goal.' });
    });
});

// Update a goal
router.put('/:id', restricted, (req, res) => {
  const id = req.params.id;
  Goals.updateGoal(id, req.body)
    .then((goal) => {
      res.status(200).json(goal);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failed to update goal with id ${id}`,
      });
    });
});

// Delete a goal
// DELETE /api/goals/:id
router.delete('/:id', restricted, (req, res) => {
  const id = req.params.id;
  Goals.removeGoal(id)
    .then((response) => {
      res.status(200).json({
        message: `Successfully deleted goal with id ${id}.`,
        response: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failed to delete goal with id ${id}`,
      });
    });
});

module.exports = router;
