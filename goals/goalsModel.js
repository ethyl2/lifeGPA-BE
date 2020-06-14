module.exports = {
  addGoal,
  findGoalById,
  updateGoal,
  getGoals,
  //findBy,
  connectGoalToUser,
  getUsersGoals,
  disconnectGoalToUser,
  addSuccess,
  getConnection,
  getSuccess,
  getSuccessGivenParams,
  updateSuccess,
};

const db = require('../data/db-config.js');

function getGoals() {
  return db('goals');
}

function addGoal(newGoal) {
  return db('goals')
    .insert(newGoal, 'id')
    .then((ids) => {
      return findGoalById(ids[0]);
    });
}

function findGoalById(id) {
  return db('goals').where({ id: id }).first();
}

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
    .join('goals', 'goals.id', 'connections.goal_id');
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
