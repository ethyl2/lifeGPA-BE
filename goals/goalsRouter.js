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
router.post('/new', restricted, (req, res) => {
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

/* Accountability Endpoints */

// Add a success (to show whether a user did a specified goal on a specified date)
// Success is a boolean
router.post(
  '/:user_id/:goal_id/success',
  restricted,
  checkForDuplicateSuccess,
  (req, res) => {
    const user_id = req.params.user_id;
    const goal_id = req.params.goal_id;
    const { date, success } = req.body;
    Goals.addSuccess(user_id, goal_id, date, success)
      .then((response) => {
        const successText = success ? 'was' : "wasn't";
        res.status(201).json({
          message: `User ${user_id} ${successText} able to do goal ${goal_id} on ${date}.`,
          success: success,
          successes_id: response[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          message: `Failed to add record to show that user ${user_id} ${successText} able to do goal ${goal_id} on ${date}.`,
          date: date,
          success: success,
          connections_id: connection.id,
        });
      });
  }
);

function checkForDuplicateSuccess(req, res, next) {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  const { date, success } = req.body;
  Goals.getSuccessGivenParams(user_id, goal_id, date)
    .then((connection) => {
      if (connection) {
        res.status(500).json({
          message:
            'The success/fail entry for specified user/goal/date already exists.',
          existing_entry: connection,
        });
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

router.put('/:user_id/:goal_id/success', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  const { date, success } = req.body;
  Goals.updateSuccess(user_id, goal_id, date, success)
    .then((response) => {
      res.status(200).json({
        response: response,
        message: `Successfully updated success/fail for user ${user_id}, goal ${goal_id}.`,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failure to update success/fail for user ${user_id} with goal ${goal_id}.`,
      });
    });
});

// To get every success/fail entry for a given user with a given goal
router.get('/:user_id/:goal_id/history', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  Goals.getSuccessesForUserAndGoal(user_id, goal_id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failure to get successes history for user ${user_id} with goal ${goal_id}.`,
      });
    });
});

module.exports = router;
