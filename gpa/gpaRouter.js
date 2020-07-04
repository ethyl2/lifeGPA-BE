const express = require('express');
const router = express.Router();
const restricted = require('../auth/authMiddleware.js');
const Successes = require('../successes/successesModel.js');
const Connections = require('../connections/connectionsModel.js');

/* All endpoints dealing with stats & percentages */

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the GPA Router! 🧮' });
});

/* First, endpoints dealing with a given goal */

// To get statistics for a given user with a given goal
// GET /api/gpa/:user_id/goal/:goal_id
router.get('/:user_id/goal/:goal_id', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  Successes.getStatsForUserAndGoal(user_id, goal_id)
    .then((response) => {
      res.status(200).json({
        percentage_success: response.percentage,
        total_successes: response.num_successes,
        user_id: user_id,
        goal_id: goal_id,
        connection_created_or_oldest_entry_date: response.oldest_entry_date,
        number_of_days_with_goal: response.days_elapsed,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failure to get goal stats for user ${user_id} with goal ${goal_id}.`,
      });
    });
});

// To get statistics for a given user with a given goal over the time period specified (the last x number of days)
// GET /api/gpa/:user_id/goal/:goal_id/:num_days
router.get('/:user_id/goal/:goal_id/:num_days', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const goal_id = req.params.goal_id;
  const num_days = req.params.num_days;
  Successes.getStatsForUserAndGoalForTimePeriod(user_id, goal_id, num_days)
    .then((response) => {
      res.status(200).json({
        percentage_success: response.percentage_success,
        user_id: user_id,
        goal_id: goal_id,
        num_days_checked: num_days,
        entries_since: response.entries_since,
        total_successes: response.total_successes,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failed to get stats for user ${user_id}, goal ${goal_id} for last ${num_days} days.`,
      });
    });
});

/* ------------------------------------------------------- */
/* Next, endpoints dealing with a given category */

// To get the average percentage of success for a given user/category:
// GET /api/gpa/:user_id/:category_id/
router.get(
  '/:user_id/:category_id/',
  restricted,
  (req, res) => {
    const user_id = req.params.user_id;
    const category_id = req.params.category_id;

    Connections.getUsersGoalsByCategory(user_id, category_id)
      .then((goals) => {
        if (goals.length == 0) {
          res.status(500).json({
            message: `User ${user_id} has no goals in category ${category_id}.`,
          });
        }
        const percentages = [];
        const goal_ids = [];
        goals.map((goal) => {
          let category_title = goal.category_title;
          goal_ids.push(goal.goal_id);
          Successes.getStatsForUserAndGoal(user_id, goal.goal_id)
            .then((goal_stats) => {
              console.log(goal_stats);
              percentages.push(goal_stats.percentage);
              if (percentages.length === goals.length) {
                const total = percentages.reduce((acc, cur) => acc + cur);
                const average = total / percentages.length;
                res.status(200).json({
                  average_percentage: average,
                  category_id: category_id,
                  category_title: category_title,
                  goal_percentages: percentages,
                  goal_ids: goal_ids,
                  user_id: user_id,
                  message: `${average}% is user ${user_id}'s average success percentage for goals in the category ${category_title} (which has the category_id of ${category_id}).`,
                });
              } // end of if block
            }) // end of inner then
            .catch((err) => {
              res.status(500).json({
                error: err,
                message: `Failed to get stats for user ${user_id}, goal ${goal.goal_id}.`,
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

// To get the average percentage of success for a given user/category/time period:
// GET /api/gpa/:user_id/:category_id/:num_days
router.get(
  '/:user_id/:category_id/:num_days',
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
        const goal_ids = [];
        goals.map((goal) => {
          goal_ids.push(goal.goal_id);
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
                  category_id: category_id,
                  category_title: category_title,
                  goal_percentages: percentages,
                  goal_ids: goal_ids,
                  user_id: user_id,
                  num_days_checked: num_days,
                  message: `In the past ${num_days} days, ${average}% is user ${user_id}'s average success percentage for goals in the category ${category_title} (which has the category_id of ${category_id}).`,
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

module.exports = router;
