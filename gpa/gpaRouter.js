const express = require('express');
const router = express.Router();
const restricted = require('../auth/authMiddleware.js');
const Successes = require('../successes/successesModel.js');
const Connections = require('../connections/connectionsModel.js');

/* Endpoints dealing with stats & percentages */

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the GPA Router! 🧮' });
});

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
