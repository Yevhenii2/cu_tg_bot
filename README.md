# CodeUnity Office Managment Bot for Telegram

## User guide

**Commands description:**

1. 👤 All Users.
   Gives list of all employees with online status.
2. ✅ Online Users
   Gives list of online users.
3. 🤟 My Days Off
   Gives user's ammount of days off.
4. 🆔 Get my chat id
   Gives user's chat id. User should add it in portal profile, to link portal informaiton with chat bot.
5. 👜 Grocery
   Gives possibility to notify managers about lack of anything in office.
6. 👍 Ordered
   Click this button after needed product is bougth or ordered. It also will notify person who asked for povission.

## Developer guide

**NODE version** (_node -v_): 14.17.0

### Setup toutorial
1. Clone the [GitHub repository](https://github.com/Yevhenii2/cu_tg_bot "GitHub repository").
```bash
#SSH
git clone git@github.com:Yevhenii2/cu_tg_bot.git
# or HTTPS
git clone https://github.com/Yevhenii2/cu_tg_bot.git
```
2. Change you *[NodeJS](https://nodejs.org/ "NodeJS")* version to **14.17.0** via *[NVM](https://github.com/nvm-sh/nvm "NVM")*.
```bash
nvm install 14.17.0
nvm use 14.17.0
node -v
# Output: v14.17.0
```
3. Enter the project directory and install all the packages.
```bash
npm install
```
4. Create file called `.env` using file `.env.example` as ~~*(what?)*~~ an example.
5. Make sure that Knex.js ( [npm](https://www.npmjs.com/package/knex "npm") | [documentation](https://knexjs.org/ "documentation") ) is installed globaly.
```bash
knex -V
# Output: Knex CLI version: 1.0.1
# Output: Knex Local version: 0.14.6
```
If not install it using *NPM*.
```bash
npm install knex -g
```
Relaunch the terminal and check you knex version once again.
6. Come back to your project directory. Run migrations to create tables in your database.
```bash
npm run migrate
```
7. As migrations were done, you can strart the project.
```bash
npm run start
```




