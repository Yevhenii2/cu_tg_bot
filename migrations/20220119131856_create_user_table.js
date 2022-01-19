exports.up = function (knex, Promise) {
  return knex.schema.createTable("users", function (table) {
    table.string("chatId").primary();
    table.string("userName");
    table.tinyint("isManager");
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable("users");
};
