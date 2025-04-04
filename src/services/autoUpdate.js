const scrap = require("../apis/scrap");
const { User } = require("../models/User/User");
const { Group } = require("../models/Group/Group");
const { MemberData } = require("../models/Group/MemberData");
const { userUpdate } = require("./userUpdate");

let userQueue = [];
let currentIndex = 0;
let interval = 0;

async function loadUsersFromDB() {
  try {
    const users = await User.find({}, "handle");
    // console.log(users);
    return users;
  } catch (error) {
    console.error(`[AUTO] Error loading user:`, error.message);
  }
}

async function autoUpdate() {
  console.log(
    `[AUTO] Current User Queue: ${currentIndex + 1}/${userQueue.length}`
  );
  if (userQueue.length === 0) {
    console.log("[AUTO] No users to update.");
    return;
  }

  const user = userQueue[currentIndex];

  try {
    await userUpdate(user.handle);
  } catch (error) {
    console.error(
      `[AUTO] "${user.handle}" Error updating user:`,
      error.message
    );
  }

  currentIndex = (currentIndex + 1) % userQueue.length;
}

function startUpdating() {
  if (interval) return; // 이미 실행 중이면 중복 실행 방지

  interval = setInterval(autoUpdate, 5000 + Math.floor(Math.random() * 10000)); // 개발 용
  console.log("[AUTO] User update process started!");
}

function addUserInQueue(handle) {
  userQueue.push({ handle: handle });
  console.log(`[AUTO] New user "${handle}" added!`);
}

async function init() {
  userQueue = await loadUsersFromDB();

  if (!userQueue) {
    console.log("[AUTO] EMPTY QUEUE!!! RELOADING DB!!!");
    init();
    return;
  }
  console.log(`[AUTO] Loaded ${userQueue.length} users from DB.`);
  startUpdating();
}

module.exports = {
  init,
  addUserInQueue,
};
