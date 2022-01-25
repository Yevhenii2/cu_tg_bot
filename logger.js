const log4js = require("log4js");

log4js.configure({
  appenders: { user_input: { type: "file", filename: "messages.log" } },
  categories: {
    default: { appenders: ["user_input", "api_request"], level: "info" },
  },
});

const userInputLogger = log4js.getLogger("user_input");
const apiRequestLogger = log4js.getLogger("api_request");

module.exports = { userInputLogger, apiRequestLogger };
