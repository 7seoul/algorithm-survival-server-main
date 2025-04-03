const scrap = require("../apis/scrap");
const { User } = require("../models/User/User");
const { Group } = require("../models/Group/Group");
const { MemberData } = require("../models/Group/MemberData");

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
    console.time(`"${user.handle}" scraping delay`);
    const profile = await scrap.profile(user.handle);
    console.timeEnd(`"${user.handle}" scraping delay`);

    if (profile.success === true) {
      try {
        const initial = await User.findById(user._id);

        let down = 0;
        let newStreak = initial.initialStreak;
        if (initial.initialStreak > profile.streak) {
          down = 1;
          newStreak = profile.streak;
        }

        const saved = await User.findByIdAndUpdate(
          user._id,
          {
            $set: {
              initialStreak: newStreak,
              currentStreak: profile.streak,
              currentSolved: profile.solved,
              tier: profile.tier,
            },
          },
          { new: true }
        )
          .select("-_id joinedGroupList")
          .populate("joinedGroupList", "groupName _id memberData");

        console.log(`UPDATE USER : User "${user.handle}" updated`);

        const groups = saved.joinedGroupList;
        // 그룹에 유저 업데이트 정보 반영
        for (let group of groups) {
          await MemberData.findOneAndUpdate(
            { handle: user.handle, _id: { $in: group.memberData } }, // 해당 그룹의 memberData 중 유저 찾기
            {
              $set: {
                initialStreak: newStreak,
                currentStreak: profile.streak,
                currentSolved: profile.solved,
              },
              $inc: { downs: down },
            }
          );
          console.log(`그룹에 정보 반영 완료 : ${group.groupName}`);
        }
      } catch (err) {
        console.error(`UPDATE USER : Error updating user ${user.handle}:`, err);
      }
    } else {
      console.log("SKIP USER : FAIL TO SCRAPING.");
    }
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

  interval = setInterval(updateUser, 5000 + Math.floor(Math.random() * 10000)); // 개발 용
  console.log("UPDATE USER : User update process started!");
}

function addUserInQueue(handle) {
  userQueue.push({ handle: handle });
  console.log(`UPDATE USER : New user "${handle}" added!`);
}

async function init() {
  userQueue = await loadUsersFromDB();
  
  if (!userQueue) {
    console.log("EMPTY QUEUE!!! RELOADING DB!!!");
    init();
    return
  } 
  console.log(`UPDATE USER : Loaded ${userQueue.length} users from DB.`);
  startUpdating();
}

module.exports = {
  init,
  addUserInQueue,
};
