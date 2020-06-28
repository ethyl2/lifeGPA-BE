module.exports = {
  addSuccess,
  getConnection,
  getSuccess,
  getSuccessGivenParams,
  getSuccessesGivenConnection,
  updateSuccess,
  getSuccessesForUserAndGoal,
  getSuccessesForUser,
};

const db = require('../data/db-config.js');

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

function getSuccessesGivenConnection(connection_id) {
  return db('successes')
    .where({ connections_id: connection_id })
    .select('date', 'success');
}

async function updateSuccess(user_id, goal_id, date, success) {
  const success_entry = await getSuccessGivenParams(user_id, goal_id, date);
  return db('successes')
    .where({ id: success_entry.id })
    .update({ success: success });
}

// To return every success/fail entry for a given user with a given goal
async function getSuccessesForUserAndGoal(user_id, goal_id) {
  const connection = await getConnection(user_id, goal_id);
  return db('successes')
    .where({ connections_id: connection.id })
    .orderBy('date');
}

// To return every success/fail entry for a given user
async function getSuccessesForUser(user_id) {
  return db('connections')
    .where({ user_id: user_id })
    .join('successes', 'connections_id', '=', 'connections.id');
}
