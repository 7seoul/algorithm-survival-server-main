const solvedac = require("../apis/solvedac");
const { User } = require("../models/User/User");

let userQueue = [];
let currentIndex = 0;
let interval = 0;

async function loadUsersFromDB() {
  try {
    const users = await User.find({}, "handle");
    // console.log(users);
    return users;
  } catch (error) {
    console.error(`UPDATE USER : Error loading user:`, error.message);
  }
}

async function updateUser() {
  console.log(
    `UPDATE USER : Current User Queue : ${currentIndex + 1}/${userQueue.length}`
  );
  if (userQueue.length === 0) {
    console.log("UPDATE USER : No users to update.");
    return;
  }

  const user = userQueue[currentIndex];

  try {
    const problemApiData = await solvedac.problem(user.handle);
    const profileApiData = await solvedac.profile(user.handle);

    User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          currentProblemCount: problemApiData,
          tier: profileApiData.tier,
          bio: profileApiData.bio,
        },
      }
    )
      .then(() => {
        console.log(`UPDATE USER : User "${user.handle}" updated`);
      })
      .catch((err) => {
        console.error(`UPDATE USER : Error updating user ${user.handle}:`, err);
      });
  } catch (error) {
    console.error(
      `UPDATE USER : Error updating user ${user.handle}:`,
      error.message
    );
  }

  currentIndex = (currentIndex + 1) % userQueue.length;
}

function startUpdating() {
  if (interval) return; // 이미 실행 중이면 중복 실행 방지

  // interval = setInterval(updateUser, 7100); // 서비스 용
  interval = setInterval(updateUser, 1000000); // 개발 용 (1000s)
  console.log("UPDATE USER : User update process started!");
}

function addUserInQueue(handle) {
  userQueue.push({ handle: handle });
  console.log(`UPDATE USER : New user "${handle}" added!`);
}

async function init() {
  userQueue = await loadUsersFromDB();
  console.log(`UPDATE USER : Loaded ${userQueue.length} users from DB.`);
  startUpdating();
}

module.exports = {
  init,
  addUserInQueue,
};
