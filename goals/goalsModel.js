module.exports = {
  addGoal,
  findGoalById,
  //updateGoal,
  getGoals,
  //findBy,
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
