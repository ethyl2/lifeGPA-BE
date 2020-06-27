module.exports = {
  connectGoalToUser,
  getUsersGoals,
  getUsersGoalsByCategory,
  getUsersCategories,
  disconnectGoalToUser,
  addSuccess,
  getConnection,
  getSuccess,
  getSuccessGivenParams,
  updateSuccess,
  getSuccessesForUserAndGoal,
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

function updateGoal(id, new_info) {
  return db('goals')
    .where({ id })
    .update(new_info)
    .then(() => {
      return findGoalById(id);
    });
}

function getConnection(user_id, goal_id) {
  return db('connections')
    .where({ user_id: user_id, goal_id: goal_id })
    .first();
}

async function addSuccess(user_id, goal_id, date, success) {
  const connection = await getConnection(user_id, goal_id);
  return db('successes').insert({
    connections_id: connection.id,
    date: date,
    success: success,
  });
}

function getSuccess(success_id) {
  return db('successes').where({ id: success_id }).first();
}

async function getSuccessGivenParams(user_id, goal_id, date) {
  const connection = await getConnection(user_id, goal_id);
  return db('successes')
    .where({ connections_id: connection.id, date: date })
    .first();
}

async function updateSuccess(user_id, goal_id, date, success) {
  const success_entry = await getSuccessGivenParams(user_id, goal_id, date);
  return db('successes')
    .where({ id: success_entry.id })
    .update({ success: success });
}

// To return every entry for a given user with a given goal
async function getSuccessesForUserAndGoal(user_id, goal_id) {
  const connection = await getConnection(user_id, goal_id);
  return db('successes').where({ connections_id: connection.id });
}
