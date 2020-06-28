module.exports = {
  addSuccess,
  getConnection,
  getSuccess,
  getSuccessGivenParams,
  getSuccessesGivenConnection,
  updateSuccess,
  getSuccessesForUserAndGoal,
  getSuccessesForUser,
  getCountSuccessesForUserAndGoal,
  getStatsForUserAndGoal,
  getOldestSuccessForUserAndGoal,
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

async function getCountSuccessesForUserAndGoal(user_id, goal_id) {
  const connection = await getConnection(user_id, goal_id);
  return db('successes')
    .where({ connections_id: connection.id, success: 1 })
    .count('id as total_successes');
}

async function getOldestSuccessForUserAndGoal(user_id, goal_id) {
  const connection = await getConnection(user_id, goal_id);
  return db('successes').where({ connections_id: connection.id }).min('date');
}

async function getStatsForUserAndGoal(user_id, goal_id) {
  const connection = await getConnection(user_id, goal_id);
  const total_successes = await getCountSuccessesForUserAndGoal(
    user_id,
    goal_id
  );
  const num_successes = total_successes[0]['total_successes'];

  // Find either the oldest success/fail entry's date,
  // or the date the connection was made (if no entries were created yet)
  const oldest_entry = await getOldestSuccessForUserAndGoal(user_id, goal_id);
  let oldest_entry_date;
  if (oldest_entry[0]['min(`date`)']) {
    console.log('here');
    oldest_entry_date = new Date(oldest_entry[0]['min(`date`)']);
  } else {
    console.log('here instead');
    oldest_entry_date = new Date(connection.created_at);
  }

  // Calculate the percentage of successful days so far
  const today = new Date();
  const days_elapsed = Math.round(
    (today - oldest_entry_date) / (1000 * 60 * 60 * 24)
  );
  const percentage = parseFloat(
    ((100 * num_successes) / days_elapsed).toFixed(2)
  );

  return { days_elapsed, num_successes, percentage, oldest_entry_date };
}

// To return every success/fail entry for a given user
async function getSuccessesForUser(user_id) {
  return db('connections')
    .where({ user_id: user_id })
    .join('successes', 'connections_id', '=', 'connections.id');
}
