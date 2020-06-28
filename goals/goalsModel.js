module.exports = {
  addGoal,
  findGoalById,
  updateGoal,
  getGoals,
  removeGoal,
};

const db = require('../data/db-config.js');

function getGoals() {
  return db('goals')
    .join('categories', 'category_id', '=', 'categories.id')
    .select(
      'goals.id',
      'goals.title',
      'goals.description',
      'goals.category_id',
      'categories.title AS category_title'
    )
    .orderBy('goals.category_id');
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

function removeGoal(id) {
  return db('goals').where({ id: id }).del();
}

function updateGoal(id, new_info) {
  return db('goals')
    .where({ id })
    .update(new_info)
    .then(() => {
      return findGoalById(id);
    });
}
