const { constants } = require("./constants");

const getUserOnlineString = (user) =>
  `${user.isOnline ? constants.ONLINE_SYMBOL : constants.OFFLINE_SYMBOL} ${
    user.userName
  }\n`;

module.exports = {
  getUserOnlineString: getUserOnlineString,
};
