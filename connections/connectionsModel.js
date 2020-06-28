module.exports = {
  connectGoalToUser,
  getUsersGoal,
  getUsersGoals,
  getUsersGoalsByCategory,
  getUsersCategories,
  disconnectGoalToUser,
};

const db = require('../data/db-config.js');

function connectGoalToUser(user_id, goal_id) {
  return db('connections')
    .insert({
      user_id: user_id,
      goal_id: goal_id,
    })
    .then(() => {
      return getUsersGoals(user_id);
    });
}

function getUsersGoal(user_id, goal_id) {
  return db('connections')
    .where({ user_id: user_id, goal_id: goal_id })
    .first();
}

function getUsersGoals(user_id) {
  return db('connections')
    .where({ user_id: user_id })
    .join('goals', 'goals.id', 'connections.goal_id')
    .join('categories', 'goals.category_id', '=', 'categories.id')
    .select(
      'connections.id AS connection_id',
      'goals.id AS goal_id',
      'goals.category_id AS category_id',
      'goals.title',
      'goals.description',
      'categories.title AS category_title'
    );
}

function getUsersGoalsByCategory(user_id, category_id) {
  return db('connections')
    .where({ user_id: user_id })
    .join('goals', 'goals.id', 'connections.goal_id')
    .join('categories', 'goals.category_id', '=', 'categories.id')
    .where({ category_id: category_id })
    .select(
      //knex.raw('STRING_AGG(goals.title, "," AS goal_titles'),
      'connections.id AS connection_id',
      'goals.id AS goal_id',
      'goals.category_id AS category_id',
      'goals.title',
      'goals.description',
      'categories.title AS category_title'
    )
    .orderBy('goals.category_id');
}

function getUsersCategories(user_id) {
  return db('connections')
    .where({ user_id: user_id })
    .join('goals', 'goals.id', 'connections.goal_id')
    .join('categories', 'goals.category_id', '=', 'categories.id')
    .select(
      'categories.title AS category_title',
      'categories.id AS category_id',
      'categories.description AS category_description'
    )
    .distinct()
    .orderBy('categories.id');
}

function disconnectGoalToUser(user_id, goal_id) {
  return db('connections').where({ user_id: user_id, goal_id: goal_id }).del();
}
