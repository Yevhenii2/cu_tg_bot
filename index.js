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
  const openOrders = await dbDataService.getOpenOrders();
  const groceryItem = await dbDataService.getGroceryById(type);
  if (action === "order_grocery") {
    resp = `${groceryItem.name} is ordered!!!`;
    const newOrder = {
      orderedBy: chatId,
      whatOrdered: groceryItem.id,
    };
    const openedGroceryOrder = await dbDataService.getOpenOrderByGroceryId(
      groceryItem.id
    );
    const lastOrderByGrocery = await dbDataService.getLastOrderedByGroceryId(
      groceryItem.id
    );

    if (
      openedGroceryOrder.length ||
      (lastOrderByGrocery && isToday(lastOrderByGrocery.whenOrdered))
    ) {
      bot.sendMessage(
        chatId,
        `${groceryItem.name} is already ordered today`,
        responseOptions
      );
      return false;
    }

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

    logger.info(`${from}: Orders ${groceryItem.name}`);
    bot.sendMessage(chatId, resp, responseOptions);
  } else if (action === "confirm_grocery") {
    const confirmedOrder = await dbDataService.confirmOrder(type, chatId);
    const openOrders = await dbDataService.getOpenOrders();
    const groceryItem = await dbDataService.getGroceryById(
      confirmedOrder.whatOrdered
    );
    const confirmedUser = await dbDataService.getUserByChatId(
      confirmedOrder.confirmedBy
    );
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
    } else {
      bot.sendMessage(chatId, "Thank you!", responseOptions);
    }
    bot.sendMessage(
      confirmedOrder.orderedBy,
      `${groceryItem.name} is confirmed by ${confirmedUser.userName}`,
      responseOptions
    );
    logger.info(`${from}: Confirms ${groceryItem.name}`);
  }
});

bot.on("polling_error", console.log);

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};
