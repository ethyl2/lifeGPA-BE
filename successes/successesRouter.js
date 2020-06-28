const express = require('express');
const router = express.Router();
const restricted = require('../auth/authMiddleware.js');
const Successes = require('./successesModel.js');

router.get('/', (req, res) => {
  res.status(200).send('Welcome to the Successes Router! 🏆');
});

/* Accountability Endpoints */

// Add a success (to show whether a user did a specified goal on a specified date)

// POST /api/successes/:user_id/:goal_id
// Success is a boolean
router.post(
  '/:user_id/:goal_id/',
  restricted,
  checkForDuplicateSuccess,
  (req, res) => {
    const user_id = req.params.user_id;
    const goal_id = req.params.goal_id;
    const { date, success } = req.body;
    Successes.addSuccess(user_id, goal_id, date, success)
      .then((response) => {
        const successText = success ? 'was' : "wasn't";
        res.status(201).json({
          message: `User ${user_id} ${successText} able to do goal ${goal_id} on ${date}.`,
          success_value: success,
          successes_id: response[0],
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          message: `Failed to add record to show that user ${user_id} ${successText} able to do goal ${goal_id} on ${date}.`,
          date: date,
          success_value: success,
          connections_id: connection.id,
        });
      });
  }
);

// Helper function to make sure a specified user/goal/date combination doesn't already exist,
// before proceeding with the POST.
function checkForDuplicateSuccess(req, res, next) {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  const { date, success } = req.body;
  Successes.getSuccessGivenParams(user_id, goal_id, date)
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

// Update a success entry.
// PUT /api/successes/:user_id/:goal_id
router.put('/:user_id/:goal_id', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  const { date, success } = req.body;
  Successes.updateSuccess(user_id, goal_id, date, success)
    .then((response) => {
      res.status(200).json({
        response: response,
        message: `Successfully updated success/fail entry for user ${user_id}, goal ${goal_id}, and date ${date}.`,
        success_value: success,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failure to update success/fail for user ${user_id} with goal ${goal_id} and date ${date}.`,
      });
    });
});

// Get a success/fail entry for a given user/goal/date
// GET /api/successes/:user_id/:goal_id

router.get('/:user_id/:goal_id', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  const { date } = req.body;
  Successes.getSuccessGivenParams(user_id, goal_id, date)
    .then((entry) => {
      res.status(200).json(entry);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failure to get success/fail entry for user ${user_id} with goal ${goal_id} for date ${date}.`,
      });
    });
});

// To get every success/fail entry for a given user with a given goal
// GET /api/successes/:user_id/:goal_id/all
router.get('/:user_id/:goal_id/all', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  Successes.getSuccessesForUserAndGoal(user_id, goal_id)
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
