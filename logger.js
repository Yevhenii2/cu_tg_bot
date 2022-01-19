const log4js = require("log4js");

log4js.configure({
  appenders: { user_input: { type: "file", filename: "messages.log" } },
  categories: { default: { appenders: ["user_input"], level: "info" } },
});

const logger = log4js.getLogger("user_input");
module.exports = { logger };
