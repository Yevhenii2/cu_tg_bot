const TelegramBot = require("node-telegram-bot-api");
const responseCallbacks = require("./responseCallbacks");
const { responseOptions, groceryConfirmedOptions } = require("./constants");
const { userInputLogger } = require("./logger");
const { dbDataService } = require("./dataServices/DBDataService");
const { isToday } = require("./tools");
require("dotenv").config();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/./, async (msg, match) => {
  const chatId = "" + msg.chat.id;
  const usersId = await dbDataService.getUsersId();
  if (!usersId.map((user) => user.chatId).includes(chatId)) {
    bot.sendMessage(chatId, "You're not welcome");
    const { username } = msg.from;
    userInputLogger.warn(`${chatId} ${username} ${msg.text}`);
    return false;
  }

  if (typeof responseCallbacks[msg.text] === "function") {
    responseCallbacks[msg.text](msg, match, bot);
  }

  const text = msg.text;
  const from = msg.from.first_name;
  userInputLogger.info(`${from}: ${text}`);
});

bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
  const message = callbackQuery.message;
  const chatId = message.chat.id;
  const from = message.chat.first_name;
  const [action, type] = callbackQuery.data.split(":");

  const managers = await dbDataService.getManagers();
  const groceryItem = await dbDataService.getGroceryById(type);

  let resp = "Not a grocery!";

  if (action === "order_grocery") {
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
    const newOrder = {
      orderedBy: chatId,
      whatOrdered: groceryItem.id,
    };

    await dbDataService.createOrder(newOrder);
    const openOrders = await dbDataService.getOpenOrders();
    const adminResponse = `Please, buy ${groceryItem.name}`;
    const managerReplyOptions = groceryConfirmedOptions;

    resp = `${groceryItem.name} is ordered!!!`;

    managerReplyOptions.reply_markup = JSON.stringify({
      inline_keyboard: openOrders.map((openOrder) => [
        {
          text: `Confirm ${openOrder.name}`,
          callback_data: `confirm_grocery:${openOrder.id}`,
        },
      ]),
    });
    // Notify managers about grocery ordering
    managers
      .map((manager) => manager.chatId)
      .forEach((adminChatId) => {
        bot.sendMessage(adminChatId, adminResponse, groceryConfirmedOptions);
      });

    // Notify user about grocery ordering
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
  }
  userInputLogger.info(`${from}: ${action}:${type}`);
});

bot.on("polling_error", console.log);
