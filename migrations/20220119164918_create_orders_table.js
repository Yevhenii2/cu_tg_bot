exports.up = function (knex, Promise) {
  return knex.schema.createTable("orders", function (table) {
    table.increments("id").primary();
    table.string("orderedBy");
    table.foreign("orderedBy").references("chatId").inTable("users");
    table.integer("whatOrdered").unsigned();
    table.foreign("whatOrdered").references("id").inTable("grocery");
    table.timestamp("whenOrdered").defaultTo(knex.fn.now());
    table.string("confirmedBy");
    table.foreign("confirmedBy").references("chatId").inTable("users");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists("orders");
};
