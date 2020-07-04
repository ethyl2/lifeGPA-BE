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

/* --------------------------------------------------------------------------------------------*/
/* Next, the endpoints that return the overall percentage of success -- aka the Life GPA! */

// Get the overall average success percentage of all of the user's categories.
// GET /api/gpa/:user_id
router.get('/:user_id', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const category_averages = [];
  const category_ids = [];
  Connections.getUsersCategories(user_id)
    .then((categories) => {
      if (categories.length == 0) {
        res.status(500).json({
          message: `User ${user_id} does not exist, or doesn't have any goals in categories yet.`,
        }); // end of json
      } // end of if block
      categories.map((category) => {
        category_ids.push(category.category_id);
        const goals_percentages = [];
        Connections.getUsersGoalsByCategory(user_id, category.category_id)
          .then((goals) => {
            goals.map((goal) => {
              Successes.getStatsForUserAndGoal(user_id, goal.goal_id)
                .then((goal_stats) => {
                  goals_percentages.push(goal_stats.percentage);

                  if (goals_percentages.length === goals.length) {
                    const total = goals_percentages.reduce(
                      (acc, cur) => acc + cur
                    );
                    const category_average = total / goals_percentages.length;
                    category_averages.push(category_average);
                    if (category_averages.length == categories.length) {
                      console.log(category_averages);
                      const overall_total = category_averages.reduce(
                        (acc, cur) => acc + cur
                      );
                      const overall_average = (
                        overall_total / category_averages.length
                      ).toFixed(2);
                      res.status(200).json({
                        overall_average_success: overall_average,
                        category_averages: category_averages,
                        category_ids: category_ids,
                      }); // end json
                    } // end of inner if block
                  } // end of outer if block
                }) // end of then
                .catch((err) => {
                  res.status(500).json({
                    error: err,
                    message: `Unable to get goal stats for user ${user_id} and goal ${goal.goal_id}.`,
                  }); // end of json
                }); // end of catch
            }); // end of mapping through goals
          }) // end of then
          .catch((err) => {
            res.status(500).json({
              error: err,
              message: `Failure to get goals in category ${category.category_id}`,
            }); // end of json
          }); // end of catch
      }); // end of mapping through categories
    }) // end of then
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failed to get user ${user_id}'s categories.`,
      }); // end of json
    }); // end of catch
});

// Get the overall average success percentage of all of the user's categories for a given time period (last x number of days)
// GET /api/gpa/:user_id/:num_days
router.get('/:user_id/:num_days', restricted, (req, res) => {
  const user_id = req.params.user_id;
  const num_days = req.params.num_days;
  const category_averages = [];
  const category_ids = [];
  Connections.getUsersCategories(user_id)
    .then((categories) => {
      if (categories.length == 0) {
        res.status(500).json({
          message: `User ${user_id} does not exist, or doesn't have any goals in categories yet.`,
        }); // end of json
      } // end of if block
      categories.map((category) => {
        category_ids.push(category.category_id);
        const goals_percentages = [];
        Connections.getUsersGoalsByCategory(user_id, category.category_id)
          .then((goals) => {
            goals.map((goal) => {
              Successes.getStatsForUserAndGoalForTimePeriod(
                user_id,
                goal.goal_id,
                num_days
              )
                .then((goal_stats) => {
                  goals_percentages.push(goal_stats.percentage_success);

                  if (goals_percentages.length === goals.length) {
                    const total = goals_percentages.reduce(
                      (acc, cur) => acc + cur
                    );
                    const category_average = total / goals_percentages.length;
                    category_averages.push(category_average);
                    if (category_averages.length == categories.length) {
                      const overall_total = category_averages.reduce(
                        (acc, cur) => acc + cur
                      );
                      const overall_average = (
                        overall_total / category_averages.length
                      ).toFixed(2);
                      res.status(200).json({
                        overall_average_success: overall_average,
                        category_averages: category_averages,
                        category_ids: category_ids,
                        num_days: num_days,
                      }); // end json
                    } // end of inner if block
                  } // end of outer if block
                }) // end of then
                .catch((err) => {
                  res.status(500).json({
                    error: err,
                    message: `Unable to get goal stats for user ${user_id} and goal ${goal.goal_id} for ${num_days} days.`,
                  }); // end of json
                }); // end of catch
            }); // end of mapping through goals
          }) // end of then
          .catch((err) => {
            res.status(500).json({
              error: err,
              message: `Failure to get goals in category ${category.category_id}`,
            }); // end of json
          }); // end of catch
      }); // end of mapping through categories
    }) // end of then
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failed to get user ${user_id}'s categories.`,
      }); // end of json
    }); // end of catch
});

/* ------------------------------------------------------- */
/* Finally, endpoints dealing with a given category */

// To get the average percentage of success for a given user/category:
// GET /api/gpa/:user_id/category/:category_id/
router.get(
  '/:user_id/category/:category_id/',
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
