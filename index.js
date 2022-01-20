const TelegramBot = require("node-telegram-bot-api");
const DataService = require("./dataServices/mockDataService").DataService;
const responseCallbacks = require("./responseCallbacks");
const { responseOptions, groceryConfirmedOptions } = require("./constants");
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
  const managers = await dbDataService.getManagers();

  const [action, type] = callbackQuery.data.split(":");
  let resp = "Not a grocery!";
  const groceryItem = await dbDataService.getGroceryList().then((data) => {
    return data.find((groceryItem) => groceryItem.id == type);
  });
  if (action === "order_grocery") {
    resp = `${groceryItem.name} is ordered!!!`;
    const newOrder = {
      orderedBy: chatId,
      whatOrdered: groceryItem.id,
    };
    await dbDataService.createOrder(newOrder);
    const openOrders = await dbDataService.getOpenOrders();
    const adminResponse = `Please, buy ${groceryItem.name}`;
    const managerReplyOptions = groceryConfirmedOptions;
    managerReplyOptions.reply_markup = JSON.stringify({
      inline_keyboard: openOrders.map((openOrder) => [
        {
          text: `Confirm ${openOrder.name}`,
          callback_data: `confirm_grocery:${openOrder.id}`,
        },
      ]),
    });
    managers
      .map((manager) => manager.chatId)
      .forEach((adminChatId) => {
        bot.sendMessage(adminChatId, adminResponse, groceryConfirmedOptions);
      });

    logger.info(`${from}: Orders ${type}`);
    bot.sendMessage(chatId, resp, responseOptions);
  } else if (action === "confirm_grocery") {
    const confirmedOrder = await dbDataService.confirmOrder(type, chatId);
    const groceryItem = await dbDataService.getGroceryById(
      confirmedOrder.whatOrdered
    );
    const confirmedUser = await dbDataService.getUserByChatId(
      confirmedOrder.confirmedBy
    );
    const openOrders = await dbDataService.getOpenOrders();
    const managerReplyOptions = groceryConfirmedOptions;
    managerReplyOptions.reply_markup = JSON.stringify({
      inline_keyboard: openOrders.map((openOrder) => [
        {
          text: `Confirm ${openOrder.name}`,
          callback_data: `confirm_grocery:${openOrder.id}`,
        },
      ]),
    });
    if (openOrders.length) {
      managers
        .map((manager) => manager.chatId)
        .forEach((adminChatId) => {
          bot.sendMessage(
            adminChatId,
            "Waiting for confirmation: ",
            groceryConfirmedOptions
          );
        });
    }
    bot.sendMessage(
      confirmedOrder.orderedBy,
      `${groceryItem[0].name} is confirmed by ${confirmedUser[0].userName}`,
      responseOptions
    );
  }
});

bot.on("polling_error", console.log);
