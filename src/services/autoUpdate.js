const { User } = require("../models/User/User");
const { userUpdateByScrap } = require("./userUpdate");
const logger = require("../../logger");

let userQueue = [];
let currentIndex = 0;
let isRunning = false;

const loadUsersFromDB = async () => {
  try {
    const users = await User.find({}).sort({ _id: 1 });

    return users;
  } catch (error) {
    logger.error(`[AUTO] Error loading user: ${error}`);
    return [];
  }
};

const autoUpdate = async () => {
  if (userQueue.length === 0) {
    logger.info("[AUTO] No users to update.");
    scheduleNext();
    return;
  }

  const user = userQueue[currentIndex];

  logger.info(
    `[AUTO] User Queue: ${currentIndex + 1}/${userQueue.length} | Handle: "${
      user.handle
    }"`
  );

  // logger.info(
  //   `[AUTO] User Queue: ${Math.floor(currentIndex / 2) + 1}/${Math.ceil(
  //     userQueue.length / 2
  //   )} | Handle: "${user.handle}"`
  // );

  try {
    await userUpdateByScrap(user.handle);
  } catch (error) {
    logger.error(`[AUTO] "${user.handle}" Error updating user: ${error}`);
  }

  currentIndex += 1;

  if (currentIndex >= userQueue.length) {
    logger.info("[AUTO] Completed one round of updates. Reloading users...");
    currentIndex = 0;
    userQueue = await loadUsersFromDB();

    if (!userQueue || userQueue.length === 0) {
      logger.warn("[AUTO] EMPTY QUEUE after reload! Retrying in 15s...");
      setTimeout(init, 15000);
      return;
    }

    logger.info(`[AUTO] Reloaded ${userQueue.length} users from DB.`);
  }

  scheduleNext();
};

const scheduleNext = () => {
  const delay = 3000 + Math.floor(Math.random() * 3000);
  setTimeout(autoUpdate, delay);
};

const startUpdating = () => {
  if (isRunning) return; // 중복 실행 방지
  isRunning = true;
  logger.info("[AUTO] User update process started!");
  autoUpdate(); // 첫 실행
};

const init = async () => {
  userQueue = await loadUsersFromDB();

  if (!userQueue || userQueue.length === 0) {
    logger.warn("[AUTO] EMPTY QUEUE after reload! Retrying in 15s...");
    setTimeout(init, 15000);
    return;
  }

  logger.info(`[AUTO] Loaded ${userQueue.length} users from DB.`);
  startUpdating();
};

module.exports = {
  init,
};
