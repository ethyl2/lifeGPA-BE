exports.up = function (knex) {
  return knex.schema.createTable('successes', (tbl) => {
    tbl.increments();
    tbl
      .integer('connections_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('connections')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT');
    tbl.timestamp('date').notNullable();
    tbl.boolean('success').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('successes');
};
