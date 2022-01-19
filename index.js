const TelegramBot = require("node-telegram-bot-api");
const DataService = require("./dataServices/mockDataService").DataService;
const responseCallbacks = require("./responseCallbacks");
const { responseOptions, groceryOrderedOptions } = require("./constants");
const { logger } = require("./logger");
const { dbDataService } = require("./dataServices/DBDataService");
require("dotenv").config();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });
const dataService = new DataService();

bot.onText(/./, async (msg, match) => {
  const chatId = "" + msg.chat.id;
  const usersId = await dbDataService.getUsersId();
  if (!usersId.map((user) => user.chatId).includes(chatId)) {
    bot.sendMessage(chatId, "You're not welcome");
    const { username } = msg.from;
    logger.warn(`${chatId} ${username} ${msg.text}`);
    return false;
  }

  if (typeof responseCallbacks[msg.text] === "function") {
    responseCallbacks[msg.text](msg, match, bot);
  }

  const text = msg.text;
  const from = msg.from.first_name;
  logger.info(`${from}: ${text}`);
});

bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const from = msg.chat.first_name;

  const [action, type] = callbackQuery.data.split(":");
  let resp = "Not a grocery!";

  if (action === "order_grocery") {
    resp = `${type} is ordered!!!`;
  }
  const managers = await dbDataService.getManagers();
  const adminResponse = `Please, buy ${type}`;
  managers
    .map((manager) => manager.chatId)
    .forEach((adminChatId) => {
      bot.sendMessage(adminChatId, adminResponse, groceryOrderedOptions);
    });

  logger.info(`${from}: Orders ${type}`);
  bot.sendMessage(chatId, resp, responseOptions);
});

bot.on("polling_error", console.log);
