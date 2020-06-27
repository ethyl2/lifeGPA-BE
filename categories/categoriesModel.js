module.exports = {
  getCategories,
  addCategory,
  updateCategory,
  removeCategory,
};

const db = require('../data/db-config.js');

/* Category Queries*/
function getCategories() {
  return db('categories');
}

// Adds a category and returns all the categories
async function addCategory(newCategory) {
  const ids = await db('categories').insert(newCategory, 'id');
  return getCategories();
}

// Updates a category and returns all the categories
async function updateCategory(id, new_info) {
  await db('categories').where({ id }).update(new_info);
  return getCategories();
}

// Deletes a category and returns all of the remaining categories
async function removeCategory(id) {
  const result = await db('categories').where({ id }).del();
  return getCategories();
}
