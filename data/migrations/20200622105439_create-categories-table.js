exports.up = function (knex) {
  return knex.schema.createTable('categories', (tbl) => {
    tbl.increments();
    tbl.text('title', 128).notNullable().index();
    tbl.text('description', 128);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
