const knex = require("knex");
require("dotenv").config();

const defaultConfig = {
  USERNAME: "CodeUnityTgBot",
  PASSWORD: "CodeUnityTgBot_123",
  DATABASE: "CodeUnityTgBot",
  HOST: "127.0.0.1",
  PORT: "80",
};
class DBDataService {
  constructor(config) {
    this.config = Object.assign(defaultConfig, config); // HERS's everything is good
    this.knex = knex({
      client: "mysql",
      connection: {
        host: this.config.HOST,
        port: this.config.PORT,
        user: this.config.USERNAME,
        password: this.config.PASSWORD,
        database: this.config.DATABASE,
      },
      pool: { min: 0, max: 7 },
    });
  }
  async getManagers() {
    const managers = await this.knex
      .select("*")
      .from("users")
      .where("isManager", 1)
      .then((data) => data);

    return managers;
  }
  async addUserToDB(chatId, newUser) {
    const currentUser = await this.knex
      .select("*")
      .from("users")
      .where("chatId", chatId);
    if (currentUser.length) return false;

    const result = this.knex("users")
      .insert({ chatId, userName: "@" + newUser.username, isManager: 0 })
      .then((res) => res);

    return result;
  }
  async getUsersId() {
    return await this.knex("users").select("chatId");
  }
}
const databaseConfiguration = {
  USERNAME: process.env.MYSQL_USERNAME,
  PASSWORD: process.env.MYSQL_PASSWORD,
  DATABASE: process.env.MYSQL_DATABASE,
  HOST: process.env.MYSQL_HOST,
  PORT: process.env.MYSQL_PORT,
};
const dbDataService = new DBDataService(databaseConfiguration);
module.exports = { dbDataService };
