const solvedac = require("../apis/solvedac");
const { User } = require("../models/User/User");

let userQueue = [];
let currentIndex = 0;
let interval = 0;

async function loadUsersFromDB() {
  try {
    const users = await User.find({}).select("-_id handle");
    // console.log(users);
    return users;
  } catch (error) {
    console.error(`Error loading user:`, error.message);
  }
}

async function updateUser() {
  console.log(`Current User Queue : ${currentIndex + 1}/${userQueue.length}`);
  if (userQueue.length === 0) {
    console.log("No users to update.");
    return;
  }

  const user = userQueue[currentIndex];

  try {
    const apiCnt = await solvedac.getSolvedacProblem(user.handle);
    const apiTier = await solvedac.getSolvedacProfile(user.handle);
    console.log(`User "${user.handle}" updated`);
  } catch (error) {
    console.error(`Error updating user ${user.handle}:`, error.message);
  }

  currentIndex = (currentIndex + 1) % userQueue.length;
}

function startUpdating() {
  if (interval) return; // 이미 실행 중이면 중복 실행 방지

  // interval = setInterval(updateUser, 7100); // 서비스 용
  interval = setInterval(updateUser, 100000); // 개발 용
  console.log("User update process started!");
}

function addUserInQueue(handle) {
  userQueue.push({ handle: handle });
  console.log(`New user "${handle}" added!`);
}

async function init() {
  userQueue = await loadUsersFromDB();
  console.log(`Loaded ${userQueue.length} users from DB.`);
  startUpdating();
}

module.exports = {
  init,
  addUserInQueue,
};
