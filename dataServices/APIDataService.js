const axios = require("axios");
const { apiRequestLogger } = require("../logger");

const axiosInstance = axios.create({
  baseURL: "https://some-domain.com/api/",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});
// Logging request interceptors
axiosInstance.interceptors.request.use(function (config) {
  console.log(config);
  return config;
});
// Logging response interceptors
axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

class APIDataService {
  constructor() {}
  getUserDaysOff(chatId) {}
  getAllUsersOnlineStastuses() {}
}

module.exports = new APIDataService();
