const knex = require("knex");
const knexConfig = require("../knexfile");
require("dotenv").config();

class DBDataService {
  constructor(knexConfig) {
    this.knex = knex(knexConfig);
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
  async getGroceryList() {
    return await this.knex("grocery").select("*");
  }
}

const dbDataService = new DBDataService(knexConfig[process.env.ENV]);
module.exports = { dbDataService };
