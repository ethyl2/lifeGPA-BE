module.exports = {
  addUser,
  findUserById,
  updateUser,
  removeUser,
  getUsers,
  findBy,
};

const db = require('../data/db-config.js');

function getUsers() {
  return db('users');
}

function addUser(newUser) {
  return db('users')
    .insert(newUser, 'id')
    .then((ids) => {
      return findUserById(ids[0]);
    });
}

/*
Later, for PostgreSQL, might need to modify to:

async function addUser(newUser) {
    const [id] = await db('users')
        .returning('id')
        .insert(newUser);
    return findUserById(id);
}
*/

function findUserById(id) {
  return db('users').where({ id: id }).first();
}

function findBy(filter) {
  return db('users').where(filter);
}

function updateUser(id, updatedUser) {
  return db('users')
    .where({ id: id })
    .update(updatedUser)
    .then(() => {
      return findUserById(id);
    });
}

function removeUser(id) {
  return db('users').where({ id: id }).del();
}
