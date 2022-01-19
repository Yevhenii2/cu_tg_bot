const {
  constants,
  responseOptions,
  groceryResponseOptions,
} = require("./constants");
const DataService = require("./dataServices/mockDataService").DataService;
const { getUserOnlineString } = require("./tools");
const { dbDataService } = require("./dataServices/DBDataService");
const { logger } = require("./logger");

require("dotenv").config();

const dataService = new DataService();

const responseCallbacks = {
  [constants.COMMANDS.START]: async (msg, match, bot) => {},
  [constants.COMMANDS.ALL_USERS]: async (msg, match, bot) => {
    const chatId = msg.chat.id;

    const usersInfo = await dataService.getEmployeesStatuses();
    const sortedUsers = usersInfo.sort((x, y) => x.isOnline - y.isOnline);

    const resp = sortedUsers.reduce((msg, user) => {
      msg += getUserOnlineString(user);
      return msg;
    }, "");
    bot.sendMessage(chatId, resp, responseOptions);
  },
  [constants.COMMANDS.ONLINE_USERS]: async (msg, match, bot) => {
    const chatId = msg.chat.id;

    const usersInfo = await dataService.getOnlineUsers();

    const resp = usersInfo.reduce((msg, user) => {
      msg += getUserOnlineString(user);
      return msg;
    }, "");

    bot.sendMessage(chatId, resp, responseOptions);
  },
  [constants.COMMANDS.GET_DAYSOFF]: async (msg, match, bot) => {
    const chatId = msg.chat.id;

    const daysOff = await dataService.getUserDaysOff(chatId);

    const resp = "Days off: " + daysOff;

    bot.sendMessage(chatId, resp, responseOptions);
  },
  [constants.COMMANDS.GET_MY_CHAT_ID]: async (msg, match, bot) => {
    const chatId = msg.chat.id;

    const isAdded = await dbDataService.addUserToDB(chatId, msg.from);
    const resp =
      `Yout chat 🆔: <b>${chatId}</b>
Add it in your portal profile.\n` +
      (isAdded
        ? "You've just been added to database"
        : "You'r already added to database");

    bot.sendMessage(chatId, resp, responseOptions);
  },
  [constants.COMMANDS.ORDER_GROCERY]: async (msg, match, bot) => {
    const chatId = msg.chat.id;
    const responeseOptions = groceryResponseOptions;
    const gorceryList = await dbDataService.getGroceryList();
    responeseOptions.reply_markup = JSON.stringify({
      inline_keyboard: gorceryList.map((grocery) => [
        { text: grocery.name, callback_data: "order_grocery:" + grocery.id },
      ]),
    });

    bot.sendMessage(
      chatId,
      "Please, select the grocery type:",
      responeseOptions
    );
  },
  [constants.COMMANDS.GROCERY_ORDERED]: async (msg, match, bot) => {
    const chatId = msg.chat.id;

    const resp = `Grocery ordered.`;

    // TODO: Change 381729739 to the rquested user!
    bot.sendMessage(381729739, resp, responseOptions);
    bot.sendMessage(chatId, "Thank you!", responseOptions);
  },
};

module.exports = responseCallbacks;
