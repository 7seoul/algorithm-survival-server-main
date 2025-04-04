const { User } = require("../models/User/User");
const { userUpdate } = require("./userUpdate");

let userQueue = [];
let currentIndex = 0;
let isRunning = false;

const loadUsersFromDB = async () => {
  try {
    const users = await User.find({}, "handle");
    return users;
  } catch (error) {
    console.error(`[AUTO] Error loading user:`, error.message);
    return [];
  }
};

const autoUpdate = async () => {
  if (userQueue.length === 0) {
    console.log("[AUTO] No users to update.");
    scheduleNext();
    return;
  }

  const user = userQueue[currentIndex];
  console.log(
    `[AUTO] User Queue: ${currentIndex + 1}/${userQueue.length} | Handle: "${
      user.handle
    }"`
  );

  try {
    await userUpdate(user.handle);
  } catch (error) {
    console.error(
      `[AUTO] "${user.handle}" Error updating user:`,
      error.message
    );
  }

  currentIndex = (currentIndex + 1) % userQueue.length;

  scheduleNext(); // 다음 사용자 업데이트 예약
};

const scheduleNext = () => {
  const delay = 5000 + Math.floor(Math.random() * 10000); // 5초~15초 사이 랜덤
  setTimeout(autoUpdate, delay);
};

const startUpdating = () => {
  if (isRunning) return; // 중복 실행 방지
  isRunning = true;
  console.log("[AUTO] User update process started!");
  autoUpdate(); // 첫 실행
};

const addUserInQueue = (handle) => {
  if (!userQueue.find((u) => u.handle === handle)) {
    userQueue.push({ handle });
    console.log(`[AUTO] New user "${handle}" added to queue!`);
  } else {
    console.log(`[AUTO] User "${handle}" is already in queue.`);
  }
};

const init = async () => {
  userQueue = await loadUsersFromDB();

  if (!userQueue || userQueue.length === 0) {
    console.log("[AUTO] EMPTY QUEUE!!! RELOADING DB!!!");
    setTimeout(init, 5000); // 5초 후 재시도
    return;
  }

  console.log(`[AUTO] Loaded ${userQueue.length} users from DB.`);
  startUpdating();
};

module.exports = {
  init,
  addUserInQueue,
};
