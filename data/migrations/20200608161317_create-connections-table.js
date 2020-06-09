exports.up = function (knex) {
  return knex.schema.createTable('connections', (tbl) => {
    tbl.increments();
    tbl
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    tbl
      .integer('goal_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('goals')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('connections');
};
