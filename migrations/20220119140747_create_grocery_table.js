exports.up = function (knex, Promise) {
  return knex.schema.createTable("grocery", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.bigint("timesConfirmed");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists("grocery");
};
