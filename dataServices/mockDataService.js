const usersInfo = [
  {
    userName: "Сурженко Дмитрий",
    isOnline: false,
  },
  {
    userName: "Покрас Евгений",
    isOnline: false,
  },
  {
    userName: "Мериков А.А.",
    isOnline: true,
  },
  {
    userName: "Горбенко Иван",
    isOnline: true,
  },
  {
    userName: "Билба Игорь",
    isOnline: false,
  },
  {
    userName: "Колесник Роман",
    isOnline: false,
  },
  {
    userName: "Шмигельская Ирина",
    isOnline: true,
  },
  {
    userName: "Геращенко Виктория",
    isOnline: true,
  },
  {
    userName: "Шлапак Евгений",
    isOnline: true,
  },
  {
    userName: "Дегтяренко Ника",
    isOnline: true,
  },
  {
    userName: "Олейник Михаил",
    isOnline: true,
  },
];
const usersDaysOff = [
  {
    chatId: 381729739,
    daysOff: 12,
  },
  {
    chatId: 197669496,
    daysOff: 5,
  },
  {
    chatId: 399578003,
    daysOff: 365,
  },
];
const adminsChatId = [197669496, 399578003];
class MockDataService {
  constructor() {}
  getEmployeesStatuses() {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve(usersInfo);
      }, 1000);
    });
  }
  getOnlineUsers() {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve(usersInfo.filter((user) => user.isOnline));
      }, 700);
    });
  }
  getUserDaysOff(userChatId) {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        const userDaysOff = usersDaysOff.find(
          (userDaysOff) => userDaysOff.chatId == userChatId
        );
        if (!userDaysOff) reject();
        resolve(userDaysOff.daysOff);
      }, 700);
    });
  }
  getAdminsChatId() {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        resolve(adminsChatId);
      }, 700);
    });
  }
}

module.exports.DataService = MockDataService;
