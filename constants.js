const constants = {
  ONLINE_SYMBOL: "✅",
  OFFLINE_SYMBOL: "❌",
  COMMANDS: {
    START: "/start",
    ALL_USERS: "👤 All Users",
    ONLINE_USERS: "✅ Online Users",
    GET_DAYSOFF: "🤟 My Days Off",
    GET_MY_CHAT_ID: "🆔 Get my chat id",
    ORDER_GROCERY: "👜 Grocery",
    GROCERY_ORDERED: "👍 Ordered",
  },
};
const responseOptions = {
  reply_markup: JSON.stringify({
    keyboard: [
      [constants.COMMANDS.ALL_USERS, constants.COMMANDS.ONLINE_USERS],
      [constants.COMMANDS.GET_DAYSOFF],
      [constants.COMMANDS.GET_MY_CHAT_ID],
      [constants.COMMANDS.ORDER_GROCERY],
    ],
  }),
  parse_mode: "HTML",
};
const gorceryList = [
  { name: "Coffee", id: "order_grocery:Coffee" },
  { name: "Water", id: "order_grocery:Water" },
  { name: "Sugar", id: "order_grocery:Sugar" },
];
const groceryResponseOptions = {
  reply_markup: "",
  parse_mode: "HTML",
};
const groceryOrderedOptions = {
  reply_markup: JSON.stringify({
    keyboard: [[constants.COMMANDS.GROCERY_ORDERED]],
  }),
  parse_mode: "HTML",
};
module.exports = {
  constants,
  responseOptions,
  gorceryList,
  groceryResponseOptions,
  groceryOrderedOptions,
};
