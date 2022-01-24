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
  async createOrder(order) {
    await this.knex("orders").insert(order);
  }
  async getOpenOrders() {
    return await this.knex("orders")
      .join("grocery", "orders.whatOrdered", "=", "grocery.id")
      .select(
        "orders.id",
        "orders.orderedBy",
        "orders.whatOrdered",
        "grocery.name"
      )
      .where("confirmedBy", null);
  }
  async getOrderById(id) {
    return await this.knex("orders").select("*").where({ id }).first();
  }
  async confirmOrder(orderId, confirmedBy) {
    await this.knex("orders").where({ id: orderId }).update({ confirmedBy });
    const confirmedOrder = await this.getOrderById(orderId);
    const groceryItem = await this.getGroceryById(confirmedOrder.whatOrdered);
    this.iterateGroceryItem(groceryItem);
    return Object.assign(confirmedOrder, { confirmedBy });
  }
  async iterateGroceryItem(groceryItem) {
    await this.knex("grocery")
      .where({ id: groceryItem.id })
      .update(
        Object.assign(groceryItem, {
          timesConfirmed: groceryItem.timesConfirmed + 1,
        })
      );
  }
  async getLastOrderedByGroceryId(whatOrdered) {
    return await this.knex("orders")
      .select("*")
      .where({ whatOrdered })
      .orderBy("whenOrdered", "desc")
      .first();
  }
  async getUserByChatId(chatId) {
    return await this.knex("users").select("*").where({ chatId }).first();
  }
  async getGroceryById(id) {
    return await this.knex("grocery").select("*").where({ id }).first();
  }
  async getUsersId() {
    return await this.knex("users").select("chatId");
  }
  async getGroceryList() {
    return await this.knex("grocery").select("*");
  }
  async getOpenOrderByGroceryId(whatOrdered) {
    return await this.knex("orders")
      .select("*")
      .where({ whatOrdered, confirmedBy: null });
  }
}

const dbDataService = new DBDataService(knexConfig[process.env.ENV]);
module.exports = { dbDataService };
