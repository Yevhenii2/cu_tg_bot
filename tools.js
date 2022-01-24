const { constants } = require("./constants");

const getUserOnlineString = (user) =>
  `${user.isOnline ? constants.ONLINE_SYMBOL : constants.OFFLINE_SYMBOL} ${
    user.userName
  }\n`;
const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

module.exports = {
  getUserOnlineString: getUserOnlineString,
  isToday: isToday,
};
