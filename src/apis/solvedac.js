const axios = require("axios");
const logger = require("../../logger");

const profile = async (handle) => {
  try {
    const response = await axios.get("https://solved.ac/api/v3/user/show", {
      params: {
        handle: handle,
      },
    });

    const profile = response.data;

    if (profile.profileImageUrl === null) {
      profile.profileImageUrl =
        "https://static.solved.ac/misc/360x360/default_profile.png";
    }

    return profile;
  } catch (error) {
    logger.error(`Failed to profile: ${error}`);
    throw new Error("Invalid data");
  }
};

const problem = async (handle) => {
  try {
    const response = await axios.get(
      "https://solved.ac/api/v3/user/problem_stats",
      {
        params: {
          handle: handle,
        },
      }
    );

    const problems = response.data;

    const current = new Array(31).fill(0);

    for (let i = 0; i < problems.length; i++) {
      current[i] = problems[i]?.solved ?? 0;
    }

    console.log(current);

    return current;
  } catch (error) {
    logger.error(`Failed to problem: ${error}`);
    throw new Error("Invalid data");
  }
};

const grass = async (handle) => {
  try {
    const response = await axios.get("https://solved.ac/api/v3/user/grass", {
      params: {
        handle: handle,
        topic: "today-solved",
      },
    });

    const currentStreak = response.data.currentStreak;

    return currentStreak;
  } catch (error) {
    logger.error(`Failed to problem: ${error}`);
    throw new Error("Invalid data");
  }
};

module.exports = {
  profile,
  problem,
  grass,
};
