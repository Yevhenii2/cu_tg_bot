require("dotenv").config();

const databaseConnection = {
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
};
module.exports = {
  development: {
    client: "mysql",
    connection: databaseConnection,
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    debug: false,
    useNullAsDefault: true,
  },
  production: {
    client: "mysql",
    connection: databaseConnection,
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
    debug: false,
  },
};
