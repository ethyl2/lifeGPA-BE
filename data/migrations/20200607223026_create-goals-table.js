exports.up = function (knex) {
  return knex.schema.createTable('goals', (tbl) => {
    tbl.increments();
    tbl.text('title', 128).notNullable().index();
    tbl.text('description', 128);
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('goals');
};
