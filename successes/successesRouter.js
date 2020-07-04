const express = require('express');
const router = express.Router();
const restricted = require('../auth/authMiddleware.js');
const Successes = require('./successesModel.js');
const Connections = require('../connections/connectionsModel.js');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Successes Router! 🏆' });
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

// Get all of the success/fail entries for a given user
// GET /api/successes/:user_id

router.get('/:user_id', restricted, (req, res) => {
  const user_id = req.params.user_id;
  Successes.getSuccessesForUser(user_id)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failure to get success/fail entries for user ${user_id}.`,
      });
    });
});

// Get all success/fail entries for a given user, grouped by goal
// GET /api/succcesses/:user_id/goals
router.get('/:user_id/goals', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const successes_by_goal = [];
  Connections.getUsersGoals(user_id)
    .then((goals) => {
      goals.map((goal) => {
        Successes.getSuccessesGivenConnection(goal.connection_id)
          .then((successes) => {
            const info_to_return = {
              goal_title: goal.title,
              goal_id: goal.goal_id,
              successes: successes,
            };
            successes_by_goal.push(info_to_return);
            if (goals.length === successes_by_goal.length) {
              res.status(200).json(successes_by_goal);
            }
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
              message: `Failure to get successes for user ${user_id}`,
            });
          });
      }); // end of map
    }) // end of then
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failure to get goals for user ${user_id} in preparation for getting user's success/fail entries, grouped by goal.`,
      });
    }); // end of catch
});

// Get all success/fail entries for a given user, grouped by category and goals within each category
// GET /api/succcesses/:user_id/categories
router.get('/:user_id/categories', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const organized_successes = [];
  Connections.getUsersCategories(user_id).then((categories) => {
    categories
      .map((category) => {
        const goals_for_category = [];
        Connections.getUsersGoalsByCategory(user_id, category.category_id).then(
          (goals) => {
            goals
              .map((goal) => {
                Successes.getSuccessesGivenConnection(goal.connection_id)
                  .then((successes) => {
                    const goal_info = {
                      goal_title: goal.title,
                      goal_id: goal.goal_id,
                      successes: successes,
                    };
                    goals_for_category.push(goal_info);
                    if (goals_for_category.length === goals.length) {
                      const category_info = {
                        category_title: category.category_title,
                        category_id: category.category_id,
                        goals: goals_for_category,
                      };
                      organized_successes.push(category_info);
                      if (organized_successes.length === categories.length) {
                        res.status(200).json(organized_successes);
                      }
                    }
                  })
                  .catch((err) => {
                    res.status(500).json({
                      error: err,
                      message: `Failure to get user ${user_id}'s success/fail entries.`,
                    }); // ends catch for getSuccessesGivenConnection
                  }); // ends mapping thru goals
              }) // ends then for getUsersGoalsByCategory
              .catch((err) => {
                res.status(500).json({
                  error: err,
                  message: `Failure to get user ${user_id}'s goals by category.`,
                });
              }); // ends catch for getUsersGoalsByCategory
          }
        ); // ends mapping through categories
      }) //ends the then for getUsersCategories
      .catch((err) => {
        res.status(500).json({
          error: err,
          message: `Failure to get user ${user_id}'s success/fail entries, organized by category.`,
        });
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

// To get statistics for a given user with a given goal over the time period specified (the last x number of days)
// GET /api/successes/:user_id/:goal_id/stats/:num_days
router.get('/:user_id/:goal_id/stats/:num_days', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  const num_days = req.params.num_days;
  Successes.getStatsForUserAndGoalForTimePeriod(user_id, goal_id, num_days)
    .then((response) => {
      res.status(200).json({
        user_id: user_id,
        goal_id: goal_id,
        num_days_checked: num_days,
        entries_since: response.entries_since,
        total_successes: response.total_successes,
        percentage_success: response.percentage_success,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failed to get stats for user ${user_id}, goal ${goal_id} for last ${num_days} days.`,
      });
    });
});

// To get the average percentage for a given user/category/time period:
// GET /api/successes/:user_id/:category_id/category/:num_days
router.get(
  '/:user_id/:category_id/category/:num_days',
  restricted,
  (req, res) => {
    const user_id = req.params.user_id;
    const category_id = req.params.category_id;
    const num_days = req.params.num_days;
    Connections.getUsersGoalsByCategory(user_id, category_id)
      .then((goals) => {
        if (goals.length == 0) {
          res.status(500).json({
            message: `User ${user_id} has no goals in category ${category_id}.`,
          });
        }
        const percentages = [];
        goals.map((goal) => {
          let category_title = goal.category_title;
          Successes.getStatsForUserAndGoalForTimePeriod(
            user_id,
            goal.goal_id,
            num_days
          )
            .then((goal_stats) => {
              percentages.push(goal_stats.percentage_success);
              if (percentages.length === goals.length) {
                const total = percentages.reduce((acc, cur) => acc + cur);
                const average = total / percentages.length;
                res.status(200).json({
                  average_percentage: average,
                  category: category_id,
                  category_title: category_title,
                  goal_percentages: percentages,
                  user_id: user_id,
                  num_days_checked: num_days,
                  message: `In the past ${num_days} days, user ${user_id}'s average success percentage for goals in the category ${category_title} (which has the category_id of ${category_id}) is ${average}%.`,
                });
              } // end of if block
            }) // end of inner then
            .catch((err) => {
              res.status(500).json({
                error: err,
                message: `Failed to get stats for user ${user_id}, goal ${goal.goal_id} for last ${num_days} days.`,
              }); // end of json
            }); // end of inner catch
        }); // end of map
      }) // end of outer then

      .catch((err) => {
        res.status(500).json({
          error: err,
          message: `Unable to get an average percentage of success for user ${user_id} with category ${category_id} and time period ${num_days} days.`,
        }); // end of json
      });
  } // end of arrow function
); // end of router.get

// To get statistics for a given user with a given goal
// GET /api/successes/:user_id/:goal_id/stats
router.get('/:user_id/:goal_id/stats', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  Successes.getStatsForUserAndGoal(user_id, goal_id)
    .then((response) => {
      res.status(200).json({
        user_id: user_id,
        goal_id: goal_id,
        connection_created_or_oldest_entry_date: response.oldest_entry_date,
        total_successes: response.num_successes,
        number_of_days_with_goal: response.days_elapsed,
        percentage_success: response.percentage,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failure to get goal stats for user ${user_id} with goal ${goal_id}.`,
      });
    });
});

module.exports = router;
